/**
 * Precision Halftone Studio - Vector Circle Generator for Illustrator
 */

#include "illustratorCommands.jsx"

var VectorGenerator = (function () {
  /**
   * Helper: Hex string to Illustrator RGBColor
   */
  function hexToRgb(hex) {
    var c = (hex || '#000000').replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var rgb = new RGBColor();
    rgb.red = parseInt(c.substring(0, 2), 16) || 0;
    rgb.green = parseInt(c.substring(2, 4), 16) || 0;
    rgb.blue = parseInt(c.substring(4, 6), 16) || 0;
    return rgb;
  }

  return {
    /**
     * Batch creates circles from structured dot data
     * @param {Object} payload Configuration and dot array
     */
    createHalftoneVectors: function (payload) {
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }

      var width = payload.width || 600;
      var height = payload.height || 400;
      var dots = payload.dots || [];
      var settings = payload.settings || {};

      var layerName = settings.layerName || 'Halftone Artwork';
      var dotColorHex = settings.dotColor || '#000000';
      var createBg = settings.createBackground === true;
      var bgColorHex = settings.backgroundColor || '#FFFFFF';
      var groupDots = settings.groupDots !== false;
      var createNewDoc = settings.createNewDocument === true;
      var newLayer = settings.putArtworkInNewLayer !== false;

      var doc;
      if (createNewDoc || !IllustratorCommands.hasActiveDocument()) {
        doc = app.documents.add(DocumentColorSpace.RGB, width, height);
      } else {
        doc = app.activeDocument;
      }

      IllustratorCommands.beginBatchOperation();

      try {
        // Target Layer
        var targetLayer;
        if (newLayer) {
          targetLayer = doc.layers.add();
          targetLayer.name = layerName;
        } else {
          targetLayer = doc.activeLayer;
        }

        // Optional Background Plate
        if (createBg) {
          var bgRect = targetLayer.pathItems.rectangle(height, 0, width, height);
          bgRect.name = 'Background';
          bgRect.filled = true;
          bgRect.fillColor = hexToRgb(bgColorHex);
          bgRect.stroked = false;
        }

        // Parent Dot Group
        var container = targetLayer;
        if (groupDots) {
          container = targetLayer.groupItems.add();
          container.name = 'Dot Group';
        }

        var fillColor = hexToRgb(dotColorHex);
        var totalDots = dots.length;

        // Create vector circles
        for (var i = 0; i < totalDots; i++) {
          var d = dots[i];
          var cx = d[0];
          var cy = d[1];
          var r = d[2];
          var diam = r * 2;

          // Illustrator coordinate system:
          // origin (0, 0) is bottom-left, top is positive Y
          var top = height - (cy - r);
          var left = cx - r;

          var circle = container.pathItems.ellipse(top, left, diam, diam);
          circle.filled = true;
          circle.fillColor = fillColor;
          circle.stroked = false;
        }

        IllustratorCommands.endBatchOperation();

        if (groupDots) {
          doc.selection = [container];
        }

        return JSON.stringify({
          success: true,
          createdDots: totalDots,
          layerName: targetLayer.name
        });

      } catch (err) {
        IllustratorCommands.endBatchOperation();
        return JSON.stringify({
          success: false,
          error: err.message
        });
      }
    }
  };
})();
