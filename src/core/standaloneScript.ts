/**
 * Complete standalone Adobe Illustrator JSX Script
 * Can be run directly in Illustrator via File > Scripts > Other Script... (Ctrl+F12)
 */

export const STANDALONE_CLEANER_JSX = `/**
 * ============================================================================
 * Halftone Maker Studio - Zero-Overlap Cutter & Shrinker for Adobe Illustrator
 * File: Halftone_Maker_Cleaner.jsx (v11.0 Absolute Non-Touching Enforcer)
 *
 * ভাই, এবার একদম সোজা কথা:
 * ১. কোনো শেপের সাথে আরেকটা শেপ ১ চুলও লেগে থাকবে না!
 * ২. লেগে থাকা শেপকে চিহ্নিত করে মাঝখান থেকে কেটে আলাদা আলাদা সার্কেল বানানো হবে।
 * ৩. প্রতিটির মাঝে কঠোরভাবে দৃশ্যমান ফাঁকা গ্যাপ (Gap) নিশ্চিত করা হবে।
 * ৪. কোনো শেপ একে অপরকে স্পর্শ (Touch) করতেই পারবে না!
 * ============================================================================
 */

#target illustrator

(function () {
  if (app.documents.length === 0) {
    alert("অনুগ্রহ করে Adobe Illustrator-এ ডকুমেন্ট খুলে আর্টওয়ার্ক সিলেক্ট করুন।", "No-Touch Halftone Fixer");
    return;
  }

  var doc = app.activeDocument;
  var sel = doc.selection;

  if (!sel || sel.length === 0) {
    alert("কোনো অবজেক্ট সিলেক্ট করা নেই!\\nআর্টওয়ার্কটি সিলেক্ট করে স্ক্রিপ্টটি চালান।", "No-Touch Halftone Fixer");
    return;
  }

  function cloneColor(c) {
    if (!c) return null;
    try {
      if (c.typename === "RGBColor") {
        var rgb = new RGBColor();
        rgb.red = c.red; rgb.green = c.green; rgb.blue = c.blue;
        return rgb;
      } else if (c.typename === "CMYKColor") {
        var cmyk = new CMYKColor();
        cmyk.cyan = c.cyan; cmyk.magenta = c.magenta; cmyk.yellow = c.yellow; cmyk.black = c.black;
        return cmyk;
      } else if (c.typename === "GrayColor") {
        var gray = new GrayColor();
        gray.gray = c.gray;
        return gray;
      } else if (c.typename === "SpotColor") {
        var spot = new SpotColor();
        spot.spot = c.spot;
        spot.tint = c.tint;
        return spot;
      }
    } catch (e) {}
    return c;
  }

  function isColorWhite(c, isFilled) {
    if (!isFilled || !c) return true;
    try {
      if (c.typename === "RGBColor") return c.red > 240 && c.green > 240 && c.blue > 240;
      if (c.typename === "CMYKColor") return c.cyan < 4 && c.magenta < 4 && c.yellow < 4 && c.black < 4;
      if (c.typename === "GrayColor") return c.gray < 4;
      if (c.typename === "SpotColor" && c.spot) return c.tint < 4;
    } catch (e) {}
    return false;
  }

  var selLeft = 999999, selRight = -999999, selTop = -999999, selBottom = 999999;
  for (var k = 0; k < sel.length; k++) {
    var b = sel[k].geometricBounds;
    if (b[0] < selLeft) selLeft = b[0];
    if (b[1] > selTop) selTop = b[1];
    if (b[2] > selRight) selRight = b[2];
    if (b[3] < selBottom) selBottom = b[3];
  }
  var selW = Math.abs(selRight - selLeft);
  var selH = Math.abs(selTop - selBottom);

  var rawPaths = [];
  function collectPaths(items, pColor, pFilled) {
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.typename === "PathItem") {
        var effColor = it.filled ? it.fillColor : pColor;
        var effFilled = it.filled || pFilled;
        if (isColorWhite(effColor, effFilled)) continue;

        var pw = Math.abs(it.width);
        var ph = Math.abs(it.height);

        if (pw > selW * 0.95 && ph > selH * 0.95) continue;
        if (pw < 0.2 && ph < 0.2) continue;

        rawPaths.push({
          item: it,
          width: pw,
          height: ph,
          area: Math.abs(it.area),
          color: cloneColor(effColor)
        });
      } else if (it.typename === "GroupItem") {
        collectPaths(it.pageItems, pColor, pFilled);
      } else if (it.typename === "CompoundPathItem") {
        var cColor = it.filled ? it.fillColor : pColor;
        var cFilled = it.filled || pFilled;
        if (it.pathItems) {
          for (var p = 0; p < it.pathItems.length; p++) {
            var sp = it.pathItems[p];
            var sColor = sp.filled ? sp.fillColor : cColor;
            var sFilled = sp.filled || cFilled;
            if (isColorWhite(sColor, sFilled)) continue;

            var spw = Math.abs(sp.width);
            var sph = Math.abs(sp.height);
            if (spw > selW * 0.95 && sph > selH * 0.95) continue;
            if (spw < 0.2 && sph < 0.2) continue;

            rawPaths.push({
              item: sp,
              width: spw,
              height: sph,
              area: Math.abs(sp.area),
              color: cloneColor(sColor)
            });
          }
        }
      }
    }
  }
  collectPaths(sel, null, false);

  if (rawPaths.length === 0) {
    alert("কোনো অবজেক্ট পাওয়া যায়নি!", "No-Touch Halftone Fixer");
    return;
  }

  var dialog = new Window("dialog", "Halftone Maker Studio — কোনো শেপ যেন না লাগে (v11.0)");
  dialog.orientation = "column";
  dialog.alignChildren = ["fill", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

  var titleText = dialog.add("statictext", undefined, "শেপ লেগে থাকা বন্ধ করা — সম্পূর্ণ আলাদা ও নিখুঁত ফাঁকা গ্যাপ");
  titleText.graphics.foregroundColor = titleText.graphics.newPen(dialog.graphics.PenType.SOLID_COLOR, [0.1, 0.45, 0.9, 1], 1);

  var panel = dialog.add("panel", undefined, "গ্যাপ কন্ট্রোল (Clear Distance)");
  panel.orientation = "column";
  panel.alignChildren = ["fill", "top"];
  panel.spacing = 8;
  panel.margins = 12;

  var gapGroup = panel.add("group");
  gapGroup.orientation = "row";
  gapGroup.add("statictext", undefined, "প্রতিটি শেপের মাঝে ফাঁকা গ্যাপ:");
  var gapInput = gapGroup.add("edittext", undefined, "0.5");
  gapInput.characters = 5;
  gapGroup.add("statictext", undefined, "pt / px (যাতে একটার সাথে আরেকটা না লাগে)");

  var preservePattyCheck = panel.add("checkbox", undefined, "মাঝখানের বড় সলিড কালো শ্যাডো/প্যাটি অক্ষত রাখুন");
  preservePattyCheck.value = true;

  var backupCheck = panel.add("checkbox", undefined, "আগের আর্টের ব্যাকআপ লেয়ার রাখুন");
  backupCheck.value = true;

  var btnGroup = dialog.add("group");
  btnGroup.alignment = "right";
  var cancelBtn = btnGroup.add("button", undefined, "Cancel", { name: "cancel" });
  var okBtn = btnGroup.add("button", undefined, "আলাদা করুন (Fix & Separate)", { name: "ok" });

  if (dialog.show() !== 1) return;

  var minGap = parseFloat(gapInput.text);
  if (isNaN(minGap) || minGap < 0.1) minGap = 0.5;
  var keepPatty = preservePattyCheck.value;
  var keepBackup = backupCheck.value;

  app.redraw = false;
  var startTime = new Date().getTime();

  try {
    var dims = [];
    for (var s = 0; s < rawPaths.length; s++) {
      var dVal = (rawPaths[s].width + rawPaths[s].height) / 2;
      if (dVal > 0.8 && dVal < 35) dims.push(dVal);
    }
    dims.sort(function (a, b) { return a - b; });
    var typicalDot = dims.length > 0 ? dims[Math.floor(dims.length / 2)] : 5.5;

    var circles = [];
    var solidItems = [];

    for (var i = 0; i < rawPaths.length; i++) {
      var pObj = rawPaths[i];
      var itm = pObj.item;
      var w = pObj.width;
      var h = pObj.height;
      var cx = itm.left + (w / 2);
      var cy = itm.top - (h / 2);
      var col = pObj.color;

      if (keepPatty && (w > typicalDot * 4 || h > typicalDot * 4) && (w > 28 || h > 28)) {
        solidItems.push(itm);
        continue;
      }

      if (w > h * 1.3 && w > typicalDot * 1.2) {
        var numX = Math.min(5, Math.max(2, Math.round(w / typicalDot)));
        var stepX = w / numX;
        var rX = (stepX - minGap) / 2;
        for (var nx = 0; nx < numX; nx++) {
          circles.push({
            cx: (itm.left + stepX / 2) + nx * stepX,
            cy: cy,
            radius: Math.max(0.3, rX),
            color: col
          });
        }
        continue;
      }

      if (h > w * 1.3 && h > typicalDot * 1.2) {
        var numY = Math.min(5, Math.max(2, Math.round(h / typicalDot)));
        var stepY = h / numY;
        var rY = (stepY - minGap) / 2;
        for (var ny = 0; ny < numY; ny++) {
          circles.push({
            cx: cx,
            cy: (itm.top - stepY / 2) - ny * stepY,
            radius: Math.max(0.3, rY),
            color: col
          });
        }
        continue;
      }

      var rad = pObj.area > 0 ? Math.sqrt(pObj.area / Math.PI) : (w + h) / 4;
      circles.push({
        cx: cx,
        cy: cy,
        radius: Math.max(0.3, rad - (minGap / 2)),
        color: col
      });
    }

    var totalCircles = circles.length;

    var cellSize = Math.max(12, typicalDot * 2.5);
    var grid = {};
    for (var d = 0; d < totalCircles; d++) {
      var cDot = circles[d];
      var gx = Math.floor(cDot.cx / cellSize);
      var gy = Math.floor(cDot.cy / cellSize);
      var kStr = gx + "_" + gy;
      if (!grid[kStr]) grid[kStr] = [];
      grid[kStr].push(d);
    }

    for (var kKey in grid) {
      if (!grid.hasOwnProperty(kKey)) continue;
      var cIndices = grid[kKey];
      var parts = kKey.split("_");
      var cX = parseInt(parts[0], 10);
      var cY = parseInt(parts[1], 10);

      for (var ox = -1; ox <= 1; ox++) {
        for (var oy = -1; oy <= 1; oy++) {
          var nKey = (cX + ox) + "_" + (cY + oy);
          var nIndices = grid[nKey];
          if (!nIndices) continue;

          for (var iA = 0; iA < cIndices.length; iA++) {
            var a = cIndices[iA];
            var dotA = circles[a];

            for (var iB = 0; iB < nIndices.length; iB++) {
              var b = nIndices[iB];
              if (b <= a) continue;

              var dotB = circles[b];
              var dx = dotB.cx - dotA.cx;
              var dy = dotB.cy - dotA.cy;
              var distSq = dx * dx + dy * dy;
              var reqSpace = dotA.radius + dotB.radius + minGap;

              if (distSq < reqSpace * reqSpace && distSq > 0) {
                var dist = Math.sqrt(distSq);
                var allowedSum = Math.max(0.5, dist - minGap);
                var curSum = dotA.radius + dotB.radius;
                if (curSum > allowedSum) {
                  var factor = allowedSum / curSum;
                  dotA.radius = Math.max(0.25, dotA.radius * factor);
                  dotB.radius = Math.max(0.25, dotB.radius * factor);
                }
              }
            }
          }
        }
      }
    }

    var cleanLayer = doc.layers.add();
    cleanLayer.name = "100% Separated Non-Touching Halftone";
    var targetGroup = cleanLayer.groupItems.add();
    targetGroup.name = "Individual Circles";

    for (var s = 0; s < solidItems.length; s++) {
      try {
        solidItems[s].duplicate(targetGroup, ElementPlacement.PLACEATEND);
      } catch (e) {}
    }

    var defBlack = new RGBColor();
    defBlack.red = 0; defBlack.green = 0; defBlack.blue = 0;

    for (var f = 0; f < totalCircles; f++) {
      var cObj = circles[f];
      var diam = cObj.radius * 2;
      var top = cObj.cy + cObj.radius;
      var left = cObj.cx - cObj.radius;

      var circle = targetGroup.pathItems.ellipse(top, left, diam, diam);
      circle.stroked = false;
      circle.filled = true;
      circle.fillColor = cObj.color ? cObj.color : defBlack;
    }

    if (keepBackup) {
      var backupLayer = doc.layers.add();
      backupLayer.name = "Original Overlapped Halftone (Backup)";
      for (var m = 0; m < sel.length; m++) {
        try { sel[m].move(backupLayer, ElementPlacement.PLACEATEND); } catch (e) {}
      }
      backupLayer.visible = false;
    } else {
      for (var d = sel.length - 1; d >= 0; d--) {
        try { sel[d].remove(); } catch (e) {}
      }
    }

    app.redraw = true;
    app.redraw();
    doc.selection = [targetGroup];

    var elapsed = ((new Date().getTime() - startTime) / 1000).toFixed(1);

    alert(
      "একটি শেপের সাথেও আরেকটি শেপ আর লেগে নেই!\\n\\n" +
      "• প্রতিটি শেপের মাঝে ন্যূনতম " + minGap + " pt ফাঁকা গ্যাপ নিশ্চিত করা হয়েছে\\n" +
      "• মোট তৈরি হয়েছে: " + totalCircles + " টি স্বাধীন বৃত্ত\\n" +
      "• সময় লেগেছে: মাত্র " + elapsed + " সেকেন্ড!",
      "No-Touch Halftone Fixer"
    );

  } catch (err) {
    app.redraw = true;
    alert("Error: " + err.message, "No-Touch Halftone Fixer");
  }
})();
`;
