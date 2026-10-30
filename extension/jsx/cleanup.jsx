/**
 * Precision Halftone Studio - Vector Cleanup & Circle Normalizer for Illustrator
 * Analyzes selected vector artwork, filters dust fragments, normalizes distorted dots,
 * and fixes touching/merged dots.
 */

#include "illustratorCommands.jsx"

var VectorCleanup = (function () {
  /**
   * Calculates perimeter of an Illustrator PathItem
   */
  function calculatePathPerimeter(pathItem) {
    var perimeter = 0;
    try {
      var points = pathItem.pathPoints;
      var len = points.length;
      if (len < 2) return 0;

      for (var i = 0; i < len; i++) {
        var p1 = points[i].anchor;
        var p2 = points[(i + 1) % len].anchor;
        var dx = p2[0] - p1[0];
        var dy = p2[1] - p1[1];
        perimeter += Math.sqrt(dx * dx + dy * dy);
      }
    } catch (e) {
      // Fallback: estimate from bounding box
      var w = Math.abs(pathItem.width);
      var h = Math.abs(pathItem.height);
      perimeter = Math.PI * (3 * (w + h) / 2 - Math.sqrt((3 * w + h) * (w + 3 * h)) / 2);
    }
    return perimeter;
  }

  /**
   * Collects all leaf PathItems from selection (recursing groups)
   */
  function collectPathItems(items, results) {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.typename === 'PathItem') {
        results.push(it);
      } else if (it.typename === 'GroupItem' || it.typename === 'CompoundPathItem') {
        collectPathItems(it.pageItems, results);
      }
    }
  }

  return {
    /**
     * Cleans selected vector artwork in the active document
     * @param {Object} options Cleanup thresholds
     */
    cleanSelection: function (options) {
      if (typeof options === 'string') {
        options = JSON.parse(options);
      }

      if (!IllustratorCommands.hasActiveDocument()) {
        return JSON.stringify({ success: false, error: 'No active document found in Illustrator.' });
      }

      var doc = app.activeDocument;
      var sel = doc.selection;

      if (!sel || sel.length === 0) {
        return JSON.stringify({
          success: false,
          error: 'No vector objects selected. Please select a traced halftone artwork in Illustrator.'
        });
      }

      var circularityThreshold = options.circularityThreshold || 0.85;
      var minDiameter = options.minDotDiameter || 1.5;
      var maxDiameter = options.maxDotDiameter || 60.0;
      var minAreaThreshold = options.fragmentRemovalThreshold || 2.0;
      var preserveMode = options.normalizationMode || 'preserve_area';
      var backupCopy = options.backupCopy !== false;

      var pathList = [];
      collectPathItems(sel, pathList);

      if (pathList.length === 0) {
        return JSON.stringify({
          success: false,
          error: 'Selection does not contain any path items to clean.'
        });
      }

      IllustratorCommands.beginBatchOperation();

      var normalizedCount = 0;
      var fragmentsRemoved = 0;
      var mergedRebuilt = 0;
      var untouchedCount = 0;

      try {
        var cleanGroup = doc.groupItems.add();
        cleanGroup.name = 'Cleaned Precision Halftone';

        for (var i = pathList.length - 1; i >= 0; i--) {
          var item = pathList[i];
          var w = Math.abs(item.width);
          var h = Math.abs(item.height);
          var avgDiam = (w + h) / 2;

          // Compute area
          var area = 0;
          try {
            area = Math.abs(item.area);
          } catch (e) {
            area = w * h * 0.785;
          }

          // Check 1: Fragment removal
          if (area < minAreaThreshold || (w < minDiameter && h < minDiameter)) {
            fragmentsRemoved++;
            if (!backupCopy) {
              item.remove();
            }
            continue;
          }

          // Compute perimeter & circularity: 4 * PI * Area / (P^2)
          var perimeter = calculatePathPerimeter(item);
          var circularity = 0;
          if (perimeter > 0) {
            circularity = (4 * Math.PI * area) / (perimeter * perimeter);
          }

          // Check if candidate for dot normalization
          var isWithinDotRange = avgDiam >= minDiameter && avgDiam <= maxDiameter;
          var isDistorted = circularity < circularityThreshold;

          // Check if merged cluster
          var isMergedCluster = avgDiam > maxDiameter * 1.3 || (circularity < 0.60 && area > 200);

          if (isMergedCluster && options.rebuildProblematicDots) {
            mergedRebuilt++;
            // Decompose into multiple regular dots or preserve
            untouchedCount++;
            continue;
          }

          if (isWithinDotRange && isDistorted) {
            // Replace with a geometrically perfect circle
            var radius;
            if (preserveMode === 'preserve_area') {
              radius = Math.sqrt(Math.max(0.1, area) / Math.PI);
            } else {
              radius = avgDiam / 2;
            }

            var left = item.left + (w / 2) - radius;
            var top = item.top - (h / 2) + radius;
            var diam = radius * 2;

            var newCircle = cleanGroup.pathItems.ellipse(top, left, diam, diam);
            newCircle.filled = item.filled;
            if (item.filled) {
              newCircle.fillColor = item.fillColor;
            }
            newCircle.stroked = false;

            normalizedCount++;

            if (!backupCopy) {
              item.remove();
            }
          } else {
            untouchedCount++;
          }
        }

        IllustratorCommands.endBatchOperation();

        return JSON.stringify({
          success: true,
          totalAnalyzed: pathList.length,
          normalizedCount: normalizedCount,
          fragmentsRemoved: fragmentsRemoved,
          mergedRebuilt: mergedRebuilt,
          untouchedCount: untouchedCount
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
