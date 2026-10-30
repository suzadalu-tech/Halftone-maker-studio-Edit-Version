/**
 * Precision Halftone Studio - Main ExtendScript Entry Point
 * Routes calls from CEP CSInterface evalScript to specific modules
 */

#include "illustratorCommands.jsx"
#include "vectorGenerator.jsx"
#include "cleanup.jsx"
#include "document.jsx"

// Global dispatch handler for CSInterface.evalScript
function PrecisionHalftoneDispatch(action, payloadJson) {
  try {
    switch (action) {
      case 'ping':
        return JSON.stringify({ success: true, message: 'Illustrator ExtendScript Engine Ready' });

      case 'getDocumentInfo':
        return DocumentHelper.getDocumentInfo();

      case 'createVectors':
        return VectorGenerator.createHalftoneVectors(payloadJson);

      case 'cleanSelection':
        return VectorCleanup.cleanSelection(payloadJson);

      case 'executeCommand':
        return JSON.stringify(IllustratorCommands.execute(payloadJson));

      default:
        return JSON.stringify({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
}
