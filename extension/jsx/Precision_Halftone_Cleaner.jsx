/**
 * Precision Halftone Dot Fixer & Normalizer for Adobe Illustrator
 * File: Precision_Halftone_Cleaner.jsx
 */

#target illustrator

(function () {
  if (app.documents.length === 0) {
    alert("অনুগ্রহ করে ইলাস্ট্রেটরে একটি ডকুমেন্ট খুলুন এবং হাফটোন ডটগুলো সিলেক্ট করুন।\n(Please open a document and select halftone dots.)", "Precision Halftone Fixer");
    return;
  }

  var doc = app.activeDocument;
  var sel = doc.selection;

  if (!sel || sel.length === 0) {
    alert("কোনো অবজেক্ট সিলেক্ট করা নেই!\nঅনুগ্রহ করে যে হাফটোন ডটগুলো ঠিক করতে চান সেগুলো সিলেক্ট করে স্ক্রিপ্টটি চালান।\n\n(No artwork selected. Please select the traced halftone dots first.)", "Precision Halftone Fixer");
    return;
  }

  var dialog = new Window("dialog", "Precision Halftone Dot Fixer");
  dialog.orientation = "column";
  dialog.alignChildren = ["fill", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

  var desc = dialog.add("statictext", undefined, "আঁকাবাঁকা ডট নিখুঁত বৃত্ত করা এবং লেগে থাকা ডট আলাদা করা");
  desc.graphics.foregroundColor = desc.graphics.newPen(dialog.graphics.PenType.SOLID_COLOR, [0.1, 0.45, 0.9, 1], 1);

  var panel = dialog.add("panel", undefined, "সেটিংস (Settings)");
  panel.orientation = "column";
  panel.alignChildren = ["fill", "top"];
  panel.spacing = 8;
  panel.margins = 12;

  var gapGroup = panel.add("group");
  gapGroup.orientation = "row";
  gapGroup.add("statictext", undefined, "ডটের মধ্যবর্তী ফাঁক/গ্যাপ (Gap):");
  var gapInput = gapGroup.add("edittext", undefined, "1.2");
  gapInput.characters = 5;
  gapGroup.add("statictext", undefined, "pt / px");

  var sizeGroup = panel.add("group");
  sizeGroup.orientation = "row";
  sizeGroup.add("statictext", undefined, "সাইজ নির্ধারণ (Size Mode):");
  var modeDropdown = sizeGroup.add("dropdownlist", undefined, [
    "আসল আয়তন রক্ষা (Exact Area - রিকমেন্ডেড)",
    "গড় ব্যাস রক্ষা (Average Diameter)"
  ]);
  modeDropdown.selection = 0;

  var removeDustCheck = panel.add("checkbox", undefined, "খুব ছোট ময়লা ও টুকরো রিমুভ করুন (Remove Tiny Fragments)");
  removeDustCheck.value = true;

  var backupCheck = panel.add("checkbox", undefined, "আগের অবজেক্টগুলো নতুন হাইড লেয়ারে ব্যাকআপ রাখুন (Keep Backup)");
  backupCheck.value = true;

  var btnGroup = dialog.add("group");
  btnGroup.alignment = "right";
  var cancelBtn = btnGroup.add("button", undefined, "বাতিল (Cancel)", { name: "cancel" });
  var okBtn = btnGroup.add("button", undefined, "ফিক্স করুন (Clean & Fix)", { name: "ok" });

  if (dialog.show() !== 1) {
    return;
  }

  var minGap = parseFloat(gapInput.text);
  if (isNaN(minGap) || minGap < 0) minGap = 1.0;
  var useAreaMode = (modeDropdown.selection.index === 0);
  var removeDust = removeDustCheck.value;
  var keepBackup = backupCheck.value;

  var allPaths = [];
  function collectPaths(items) {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.typename === "PathItem") {
        allPaths.push(it);
      } else if (it.typename === "GroupItem" || it.typename === "CompoundPathItem") {
        collectPaths(it.pageItems);
      }
    }
  }
  collectPaths(sel);

  if (allPaths.length === 0) {
    alert("সিলেকশনের ভেতরে কোনো ভেক্টর পাথ পাওয়া যায়নি!", "Precision Halftone Fixer");
    return;
  }

  app.redraw = false;

  try {
    var dots = [];
    var fragmentsCount = 0;

    for (var i = 0; i < allPaths.length; i++) {
      var item = allPaths[i];
      var w = Math.abs(item.width);
      var h = Math.abs(item.height);

      if (removeDust && (w < 1.2 && h < 1.2)) {
        fragmentsCount++;
        continue;
      }

      var cx = item.left + (w / 2);
      var cy = item.top - (h / 2);

      var radius = 0;
      if (useAreaMode) {
        var area = Math.abs(item.area);
        if (area > 0) {
          radius = Math.sqrt(area / Math.PI);
        } else {
          radius = (w + h) / 4;
        }
      } else {
        radius = (w + h) / 4;
      }

      var fillColor = item.filled ? item.fillColor : null;

      dots.push({
        cx: cx,
        cy: cy,
        radius: Math.max(0.2, radius),
        originalRadius: radius,
        fillColor: fillColor,
        filled: item.filled
      });
    }

    var totalDots = dots.length;
    var adjustedCollisions = 0;

    for (var pass = 0; pass < 2; pass++) {
      for (var a = 0; a < totalDots; a++) {
        var dotA = dots[a];
        if (dotA.radius <= 0) continue;

        for (var b = a + 1; b < totalDots; b++) {
          var dotB = dots[b];
          if (dotB.radius <= 0) continue;

          var dx = dotB.cx - dotA.cx;
          var dy = dotB.cy - dotA.cy;
          var dist = Math.sqrt(dx * dx + dy * dy);

          var requiredDistance = dotA.radius + dotB.radius + minGap;

          if (dist < requiredDistance && dist > 0) {
            var availableSpace = Math.max(0.2, dist - minGap);
            var sumRadii = dotA.radius + dotB.radius;

            if (sumRadii > 0) {
              var scale = availableSpace / sumRadii;
              dotA.radius = Math.max(0.3, dotA.radius * scale);
              dotB.radius = Math.max(0.3, dotB.radius * scale);
              adjustedCollisions++;
            }
          }
        }
      }
    }

    var targetGroup;
    if (keepBackup) {
      var backupLayer = doc.layers.add();
      backupLayer.name = "Original Traced Halftone (Backup)";
      for (var k = 0; k < sel.length; k++) {
        try {
          sel[k].move(backupLayer, ElementPlacement.PLACEATEND);
        } catch (e) {}
      }
      backupLayer.visible = false;

      var cleanLayer = doc.layers.add();
      cleanLayer.name = "Perfect Clean Halftone";
      targetGroup = cleanLayer.groupItems.add();
      targetGroup.name = "Halftone Dots";
    } else {
      targetGroup = doc.activeLayer.groupItems.add();
      targetGroup.name = "Perfect Clean Halftone";
      for (var m = sel.length - 1; m >= 0; m--) {
        try {
          sel[m].remove();
        } catch (e) {}
      }
    }

    var defaultBlack = new RGBColor();
    defaultBlack.red = 0;
    defaultBlack.green = 0;
    defaultBlack.blue = 0;

    for (var d = 0; d < totalDots; d++) {
      var cur = dots[d];
      var diam = cur.radius * 2;
      var top = cur.cy + cur.radius;
      var left = cur.cx - cur.radius;

      var circle = targetGroup.pathItems.ellipse(top, left, diam, diam);
      circle.stroked = false;
      circle.filled = true;

      if (cur.fillColor) {
        circle.fillColor = cur.fillColor;
      } else {
        circle.fillColor = defaultBlack;
      }
    }

    app.redraw = true;
    app.redraw();

    doc.selection = [targetGroup];

    alert(
      "সফলভাবে সম্পন্ন হয়েছে!\n\n" +
      "• পারফেক্ট বৃত্ত তৈরি হয়েছে: " + totalDots + " টি\n" +
      "• লেগে থাকা ডট আলাদা করা হয়েছে: " + adjustedCollisions + " বার\n" +
      (fragmentsCount > 0 ? "• ময়লা/ক্ষুদ্র টুকরো রিমুভ হয়েছে: " + fragmentsCount + " টি\n" : "") +
      "• সব ডট এখন নিখুঁত বৃত্তাকার (Width == Height)",
      "Precision Halftone Studio"
    );

  } catch (err) {
    app.redraw = true;
    alert("ত্রুটি (Error): " + err.message, "Precision Halftone Fixer");
  }
})();
