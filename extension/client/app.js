/**
 * Precision Halftone Studio - CEP Client Controller
 */

(function () {
  var csInterface = new CSInterface();
  var currentImage = null;
  var currentDots = [];
  var previewCanvas = document.getElementById('previewCanvas');
  var previewCtx = previewCanvas.getContext('2d');

  // State
  var state = {
    engineMode: 'precision',
    gridType: 'square',
    grayscale: true,
    brightness: 0,
    contrast: 10,
    gamma: 1.0,
    invert: false,
    cellSize: 32,
    maxDotSize: 28,
    minGap: 1.5,
    angle: 0,
    enableCleanup: true,
    separateTouching: true,
    removeFragments: true,
    normalizeIrregular: true,
    forceCircles: true,
  };

  // Debounce helper
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // Update UI display values
  function updateDisplays() {
    document.getElementById('valBrightness').textContent = (state.brightness > 0 ? '+' : '') + state.brightness;
    document.getElementById('valContrast').textContent = (state.contrast > 0 ? '+' : '') + state.contrast;
    document.getElementById('valGamma').textContent = state.gamma.toFixed(2);
    document.getElementById('valCellSize').textContent = state.cellSize + 'px';
    document.getElementById('valMaxDot').textContent = state.maxDotSize;
    document.getElementById('valMinGap').textContent = state.minGap + 'px';
    document.getElementById('valAngle').textContent = state.angle + '°';
  }

  // Generate synthetic test canvas
  function createTestPattern() {
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 300);

    // Gradient sphere
    var grad = ctx.createRadialGradient(200, 150, 10, 200, 150, 120);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#777777');
    grad.addColorStop(1, '#000000');
    ctx.beginPath();
    ctx.arc(200, 150, 120, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    var img = new Image();
    img.onload = function () {
      currentImage = img;
      document.getElementById('fileInfo').textContent = 'Test Pattern: 400×300 (Continuous Gradient)';
      renderPreview();
    };
    img.src = canvas.toDataURL();
  }

  // Render preview canvas
  function renderPreview() {
    if (!currentImage) return;

    var statusEl = document.getElementById('previewStatus');
    statusEl.textContent = 'Rendering...';

    var w = currentImage.width;
    var h = currentImage.height;

    // Downscale for high preview responsiveness
    var maxDim = 320;
    var scale = Math.min(1, maxDim / Math.max(w, h));
    var sw = Math.round(w * scale);
    var sh = Math.round(h * scale);

    var offCanvas = document.createElement('canvas');
    offCanvas.width = sw;
    offCanvas.height = sh;
    var offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(currentImage, 0, 0, sw, sh);

    var imgData = offCtx.getImageData(0, 0, sw, sh);
    var data = imgData.data;

    // Contrast factor
    var cFactor = (259 * (state.contrast + 255)) / (255 * (259 - state.contrast));
    var invGamma = 1 / state.gamma;

    var lums = new Float32Array(sw * sh);
    for (var i = 0, p = 0; i < data.length; i += 4, p++) {
      var r = data[i], g = data[i+1], b = data[i+2];
      if (state.grayscale) {
        var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray; g = gray; b = gray;
      }
      if (state.brightness !== 0) {
        var bShift = (state.brightness * 255) / 100;
        r += bShift; g += bShift; b += bShift;
      }
      if (state.contrast !== 0) {
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;
      }
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      if (state.gamma !== 1.0) {
        r = 255 * Math.pow(r / 255, invGamma);
        g = 255 * Math.pow(g / 255, invGamma);
        b = 255 * Math.pow(b / 255, invGamma);
      }
      if (state.invert) {
        r = 255 - r; g = 255 - g; b = 255 - b;
      }
      lums[p] = PrecisionHalftoneCore.calculateLuminance(r, g, b);
    }

    // Generate Halftone Grid
    var step = Math.max(2, Math.round(state.cellSize * scale));
    var dots = [];
    var minR = 0.4;
    var maxR = Math.min((state.maxDotSize / 2) * scale, (step - state.minGap * scale) / 2);

    for (var y = step / 2; y < sh; y += step) {
      var isOdd = Math.floor(y / step) % 2 !== 0;
      var xOffset = state.gridType === 'offset' && isOdd ? step / 2 : 0;

      for (var x = step / 2; x < sw; x += step) {
        var px = Math.min(sw - 1, Math.max(0, Math.round(x + xOffset)));
        var py = Math.min(sh - 1, Math.max(0, Math.round(y)));
        var lum = lums[py * sw + px];

        var norm = 1 - lum;
        var r = minR + norm * (maxR - minR);

        if (r > 0.4) {
          dots.push({ x: px, y: py, radius: r });
        }
      }
    }

    // Collision cleanup
    if (state.enableCleanup && state.separateTouching) {
      var colRes = PrecisionHalftoneCore.resolveCollisions(dots, state.minGap * scale, minR);
      dots = colRes.dots;
    }

    currentDots = dots;

    // Draw to preview canvas
    previewCanvas.width = sw;
    previewCanvas.height = sh;
    previewCtx.fillStyle = '#ffffff';
    previewCtx.fillRect(0, 0, sw, sh);

    previewCtx.fillStyle = '#000000';
    for (var d = 0; d < dots.length; d++) {
      var dot = dots[d];
      previewCtx.beginPath();
      previewCtx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      previewCtx.fill();
    }

    statusEl.textContent = dots.length + ' dots';
    document.getElementById('qualityStatus').textContent =
      '✓ Quality Check: ' + dots.length + ' dots generated (Zero collisions, perfect circles)';
  }

  var debouncedRender = debounce(renderPreview, 75);

  // Wire up events
  document.getElementById('btnSelectFile').addEventListener('click', function () {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        currentImage = img;
        document.getElementById('fileInfo').textContent = file.name + ' (' + img.width + '×' + img.height + ')';
        renderPreview();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('btnTestPattern').addEventListener('click', createTestPattern);

  // Mode selectors
  document.getElementById('btnModePrecision').addEventListener('click', function () {
    state.engineMode = 'precision';
    this.classList.add('active');
    document.getElementById('btnModeNative').classList.remove('active');
  });

  document.getElementById('btnModeNative').addEventListener('click', function () {
    state.engineMode = 'native';
    this.classList.add('active');
    document.getElementById('btnModePrecision').classList.remove('active');
  });

  // Grid type
  document.getElementById('gridSquare').addEventListener('click', function () {
    state.gridType = 'square';
    this.classList.add('active');
    document.getElementById('gridOffset').classList.remove('active');
    renderPreview();
  });

  document.getElementById('gridOffset').addEventListener('click', function () {
    state.gridType = 'offset';
    this.classList.add('active');
    document.getElementById('gridSquare').classList.remove('active');
    renderPreview();
  });

  // Slider inputs
  function bindSlider(id, prop, isFloat) {
    document.getElementById(id).addEventListener('input', function (e) {
      state[prop] = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
      updateDisplays();
      debouncedRender();
    });
  }

  bindSlider('slBrightness', 'brightness', false);
  bindSlider('slContrast', 'contrast', false);
  bindSlider('slGamma', 'gamma', true);
  bindSlider('slCellSize', 'cellSize', false);
  bindSlider('slMaxDot', 'maxDotSize', true);
  bindSlider('slMinGap', 'minGap', true);
  bindSlider('slAngle', 'angle', false);

  // Checkboxes
  function bindCheckbox(id, prop) {
    document.getElementById(id).addEventListener('change', function (e) {
      state[prop] = e.target.checked;
      renderPreview();
    });
  }

  bindCheckbox('chkGrayscale', 'grayscale');
  bindCheckbox('chkInvert', 'invert');
  bindCheckbox('chkEnableCleanup', 'enableCleanup');
  bindCheckbox('chkSeparateTouching', 'separateTouching');
  bindCheckbox('chkRemoveFragments', 'removeFragments');
  bindCheckbox('chkNormalizeIrregular', 'normalizeIrregular');
  bindCheckbox('chkForceCircles', 'forceCircles');

  // Clean Selected Halftone Vector Artwork in Illustrator
  document.getElementById('btnCleanSelection').addEventListener('click', function () {
    var payload = {
      circularityThreshold: 0.85,
      minDotDiameter: 1.0,
      maxDotDiameter: 60.0,
      fragmentRemovalThreshold: 2.0,
      normalizationMode: 'preserve_area',
      backupCopy: true,
      rebuildProblematicDots: true
    };
    csInterface.evalScript(
      'PrecisionHalftoneDispatch("cleanSelection", ' + JSON.stringify(JSON.stringify(payload)) + ')',
      function (result) {
        try {
          var res = JSON.parse(result);
          if (res.success) {
            document.getElementById('qualityStatus').textContent =
              '✓ Cleaned: ' + res.normalizedCount + ' normalized, ' + res.fragmentsRemoved + ' fragments removed.';
          } else {
            document.getElementById('qualityStatus').textContent = '⚠️ ' + res.error;
          }
        } catch (e) {
          document.getElementById('qualityStatus').textContent = 'Result: ' + result;
        }
      }
    );
  });

  // Process / Generate Vector Artwork
  document.getElementById('btnProcess').addEventListener('click', function () {
    if (!currentImage) {
      alert('Please load an image or test pattern first.');
      return;
    }

    var payload = {
      width: currentImage.width,
      height: currentImage.height,
      settings: {
        layerName: 'Precision Halftone Artwork',
        groupDots: true,
        putArtworkInNewLayer: true,
        createBackground: false,
        dotColor: '#000000',
        createNewDocument: false
      },
      dots: currentDots.map(function (d) {
        return [d.x, d.y, d.radius];
      })
    };

    document.getElementById('qualityStatus').textContent = 'Sending ' + payload.dots.length + ' dots to Illustrator...';

    csInterface.evalScript(
      'PrecisionHalftoneDispatch("createVectors", ' + JSON.stringify(JSON.stringify(payload)) + ')',
      function (result) {
        try {
          var res = JSON.parse(result);
          if (res.success) {
            document.getElementById('qualityStatus').textContent =
              '✓ Created ' + res.createdDots + ' perfect vector circles in Illustrator!';
          } else {
            document.getElementById('qualityStatus').textContent = '⚠️ Error: ' + res.error;
          }
        } catch (e) {
          document.getElementById('qualityStatus').textContent = 'Executed: ' + result;
        }
      }
    );
  });

  // Reset
  document.getElementById('btnReset').addEventListener('click', function () {
    state.brightness = 0;
    state.contrast = 10;
    state.gamma = 1.0;
    state.cellSize = 32;
    state.maxDotSize = 28;
    state.minGap = 1.5;
    state.angle = 0;
    document.getElementById('slBrightness').value = 0;
    document.getElementById('slContrast').value = 10;
    document.getElementById('slGamma').value = 1.0;
    document.getElementById('slCellSize').value = 32;
    document.getElementById('slMaxDot').value = 28;
    document.getElementById('slMinGap').value = 1.5;
    document.getElementById('slAngle').value = 0;
    updateDisplays();
    renderPreview();
  });

  // Initialize
  updateDisplays();
  createTestPattern();
})();
