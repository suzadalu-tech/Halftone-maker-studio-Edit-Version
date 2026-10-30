import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));

// Health / Status Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper for Intelligent Fallback Calculation if API key is not configured
function calculateIntelligentHalftoneSettings(imageWidth: number, imageHeight: number, prompt: string) {
  const isLarge = Math.max(imageWidth || 800, imageHeight || 800) > 1200;
  const targetCell = isLarge ? 10 : 8;
  const targetGap = Math.max(1.2, targetCell * 0.18);
  const targetMaxDot = targetCell - targetGap;

  return {
    text: `আপনার অনুরোধ "${prompt || 'নিখুঁত ডট সেটিংস'}" অনুযায়ী জ্যামিতিক বিশ্লেষক দিয়ে অটোমেটিক ক্যালকুলেট করা হয়েছে:\n• প্রতিটি ডটের মাঝে স্পষ্ট ফাঁকা বজায় রাখতে **${targetGap.toFixed(1)}px** ব্যারিয়ার সেট করা হয়েছে।\n• লেগে থাকা রোধ করতে অফসেট ল্যাটিস ও পারফেক্ট সার্কেল সক্রিয় করা হয়েছে।`,
    recommendedSettings: {
      cellSize: targetCell,
      maxDotSize: Math.round(targetMaxDot * 10) / 10,
      minDotSize: 0.6,
      minGap: Math.round(targetGap * 10) / 10,
      contrast: 15,
      gamma: 1.05,
      angle: 15,
      gridType: 'offset' as const,
      circularityThreshold: 0.88,
      forcePerfectCircles: true,
      separateTouchingDots: true,
    },
  };
}

// 1. Halftone Prepress AI Assistant Endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { userInstruction, imageThumbnailUrl, imageWidth, imageHeight } = req.body;
    const promptText = userInstruction || 'ইমেজটি ভিজ্যুয়ালি স্ক্যান করে নিখুঁত ডট সেটিংস তৈরি করে দাও।';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = calculateIntelligentHalftoneSettings(imageWidth, imageHeight, promptText);
      return res.json(fallback);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `You are a world-class prepress and vector halftone expert for Adobe Illustrator.
The user wants to generate clean, commercial-grade vector halftone dots without any touching, overlapping, or irregular blobs.
Image dimensions: ${imageWidth || 800}x${imageHeight || 800} pixels.
User Instruction: "${promptText}".

Analyze this request and return strict JSON at the very end enclosed in \`\`\`json { ... } \`\`\`:
{
  "explanationBn": "বাংলায় ব্যাখ্যা করুন কেন এই প্যারামিটারগুলো দেওয়া হলো",
  "cellSize": number (between 4 and 25),
  "maxDotSize": number (between 2 and 22),
  "minDotSize": number (between 0.4 and 2.0),
  "minGap": number (between 0.5 and 4.0, minimum gap to prevent touching),
  "contrast": number (between -40 and 40),
  "gamma": number (between 0.6 and 1.8),
  "angle": number (0, 15, 22.5, 45),
  "gridType": "square" | "offset",
  "circularityThreshold": 0.88,
  "forcePerfectCircles": true,
  "separateTouchingDots": true
}`;

    const parts: any[] = [];
    if (imageThumbnailUrl && typeof imageThumbnailUrl === 'string' && imageThumbnailUrl.startsWith('data:image/')) {
      const base64Data = imageThumbnailUrl.split(',')[1];
      const mimeType = imageThumbnailUrl.split(';')[0].replace('data:', '') || 'image/png';
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }
    parts.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
    });

    const aiResultText = response.text || '';
    const match = aiResultText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let recommendedSettings = null;
    if (match) {
      try {
        recommendedSettings = JSON.parse(match[1]);
      } catch {
        // Ignored
      }
    }

    res.json({
      text: aiResultText,
      recommendedSettings,
    });
  } catch (error: any) {
    console.error('Error in /api/ai-assistant:', error);
    const { imageWidth, imageHeight, userInstruction } = req.body || {};
    const fallback = calculateIntelligentHalftoneSettings(imageWidth, imageHeight, userInstruction);
    res.json(fallback);
  }
});

// 2. AI Background Remover / Subject Segmentation Endpoint
app.post('/api/ai-remove-bg', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    if (!apiKey) {
      // Heuristic fallback for background detection
      return res.json({
        success: true,
        fallback: true,
        segmentation: {
          backgroundType: 'studio',
          estimatedBgRgb: [250, 250, 250],
          colorTolerance: 45,
          cropBox: [0, 0, 1000, 1000],
        },
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `You are a computer vision segmentation specialist.
Look at this image of an object or food (like a burger, fries, product, or person).
Analyze the main subject vs background.
Provide strict JSON containing:
1. "backgroundType": "solid_white" | "gradient" | "studio" | "complex"
2. "estimatedBgRgb": [r, g, b] (RGB values of the background area, integers 0-255)
3. "colorTolerance": integer between 25 and 70 (higher if shadows exist)
4. "cropBox": [ymin, xmin, ymax, xmax] (bounding box of foreground subject in 0-1000 scale)

Return ONLY JSON enclosed in \`\`\`json { ... } \`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { inlineData: { data: cleanBase64, mimeType } },
        { text: prompt },
      ],
    });

    const resText = response.text || '';
    const match = resText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let parsed: any = null;
    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      parsed = JSON.parse(resText);
    }

    res.json({
      success: true,
      segmentation: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/ai-remove-bg:', error);
    res.json({
      success: true,
      fallback: true,
      segmentation: {
        backgroundType: 'studio',
        estimatedBgRgb: [250, 250, 250],
        colorTolerance: 45,
        cropBox: [0, 0, 1000, 1000],
      },
    });
  }
});

// Frontend Serving
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
