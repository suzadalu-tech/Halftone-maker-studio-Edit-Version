/**
 * Precision Halftone Studio - Document & Artboard Helper
 */

#include "illustratorCommands.jsx"

var DocumentHelper = (function () {
  return {
    getDocumentInfo: function () {
      if (!IllustratorCommands.hasActiveDocument()) {
        return JSON.stringify({ hasDocument: false });
      }

      var doc = app.activeDocument;
      var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
      var rect = ab.artboardRect; // [left, top, right, bottom]
      var width = rect[2] - rect[0];
      var height = rect[1] - rect[3];

      return JSON.stringify({
        hasDocument: true,
        name: doc.name,
        width: width,
        height: height,
        colorSpace: doc.documentColorSpace.toString(),
        selectionCount: doc.selection.length
      });
    },

    createNewDocument: function (width, height, colorSpaceStr) {
      var cs = colorSpaceStr === 'CMYK' ? DocumentColorSpace.CMYK : DocumentColorSpace.RGB;
      var doc = app.documents.add(cs, width || 800, height || 600);
      return JSON.stringify({ success: true, name: doc.name });
    }
  };
})();
