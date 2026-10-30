/**
 * Precision Halftone Studio - Illustrator Command Abstraction Layer
 * Isolates menu commands and DOM methods to ensure cross-version compatibility
 */

var IllustratorCommands = (function () {
  var COMMAND_MAP = {
    // Selection & Deselection
    DESELECT_ALL: 'deselectall',
    SELECT_ALL: 'selectall',
    INVERT_SELECTION: 'Inverse',

    // Appearance & Expansion
    EXPAND_APPEARANCE: 'expandStyle',
    EXPAND_TRACING: 'Live Trace Expand',
    RASTERIZE: 'Rasterize menu',

    // Object Grouping
    GROUP: 'group',
    UNGROUP: 'ungroup',

    // Undo / Redo
    UNDO: 'undo',
    REDO: 'redo',

    // Document & Artboard
    FIT_ARTBOARD_TO_SELECTED: 'Fit Artboard to artwork bounds',
    FIT_ALL_IN_WINDOW: 'fitall',
  };

  return {
    /**
     * Executes a menu command safely with error trapping
     */
    execute: function (commandKey) {
      var cmdId = COMMAND_MAP[commandKey] || commandKey;
      try {
        app.executeMenuCommand(cmdId);
        return { success: true, command: cmdId };
      } catch (e) {
        return { success: false, error: e.message, command: cmdId };
      }
    },

    /**
     * Checks if an active document exists
     */
    hasActiveDocument: function () {
      return app.documents.length > 0;
    },

    /**
     * Gets current selection count
     */
    getSelectionCount: function () {
      if (!this.hasActiveDocument()) return 0;
      return app.activeDocument.selection.length;
    },

    /**
     * Suspends document redraw for maximum execution speed
     */
    beginBatchOperation: function () {
      try {
        app.redraw = false;
      } catch (e) {}
    },

    /**
     * Restores screen redraw after batch operation completes
     */
    endBatchOperation: function () {
      try {
        app.redraw = true;
        app.redraw();
      } catch (e) {}
    },

    /**
     * Creates an undo step wrapper
     */
    runWithUndo: function (actionName, fn) {
      this.beginBatchOperation();
      try {
        var res = fn();
        this.endBatchOperation();
        return res;
      } catch (err) {
        this.endBatchOperation();
        throw err;
      }
    }
  };
})();
