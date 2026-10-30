/**
 * Precision Halftone Studio - Core Mathematics (CEP Runtime Compatible)
 */

var PrecisionHalftoneCore = (function () {
  function calculateLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function applyResponseCurve(lum, curve, factor) {
    var v = Math.max(0, Math.min(1, lum));
    factor = factor || 1.0;
    if (curve === 'gamma') {
      v = Math.pow(v, factor);
    } else if (curve === 'logarithmic') {
      v = Math.log(1 + 9 * v) / Math.log(10);
      if (factor !== 1.0) v = Math.pow(v, factor);
    } else if (curve === 'smoothstep') {
      v = v * v * (3 - 2 * v);
      if (factor !== 1.0) v = Math.pow(v, factor);
    } else if (factor !== 1.0) {
      v = Math.pow(v, factor);
    }
    return Math.max(0, Math.min(1, v));
  }

  function resolveCollisions(dots, minGap, minRadius) {
    minRadius = minRadius || 0.1;
    var adjusted = 0;
    var len = dots.length;

    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < len; i++) {
        var a = dots[i];
        if (a.radius <= 0) continue;

        for (var j = i + 1; j < len; j++) {
          var b = dots[j];
          if (b.radius <= 0) continue;

          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          var req = a.radius + b.radius + minGap;
          if (dist < req) {
            var avail = Math.max(0, dist - minGap);
            var sum = a.radius + b.radius;
            if (sum > 0) {
              var s = avail / sum;
              a.radius = Math.max(minRadius, a.radius * s);
              b.radius = Math.max(minRadius, b.radius * s);
              adjusted++;
            }
          }
        }
      }
    }
    return { dots: dots.filter(function (d) { return d.radius >= minRadius; }), adjustedCount: adjusted };
  }

  return {
    calculateLuminance: calculateLuminance,
    applyResponseCurve: applyResponseCurve,
    resolveCollisions: resolveCollisions
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrecisionHalftoneCore;
}
