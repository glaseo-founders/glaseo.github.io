// Opening screen. The lamp from the logo hops in, falls over and turns into the wordmark;
// the screen then closes into the header and leaves the real wordmark in its place.
// Runs only when the head script has set .intro-on on <html>; the header wordmark is [data-intro-target].
(function () {
  var GROUND = 700, S = 0.35, FS = 0.36, X0 = 300;
  var O_X = 1080.5, O_CX = O_X + 309 * FS;
  var DOT = { x: 1283.9, y: 644.9, w: 58.7, h: 55.1 };
  var REST_X = 1410, HALF_BASE = 63, N = 140, FLY_DUR = 0.7;
  // static letters, nearest to the impact first: [id, x, delay, height of the jolt]
  var JOLT = [['intro-j0', 881.8, 0.04, 26], ['intro-j1', 691.7, 0.1, 19], ['intro-j2', 490.1, 0.16, 13], ['intro-j3', 300, 0.22, 9]];
  var EASE = {
    lin: function (p) { return p; },
    'in': function (p) { return p * p; },
    out: function (p) { return 1 - (1 - p) * (1 - p); },
    io: function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  };
  var root = document.documentElement, raf = 0, cleanup = null;

  function reveal() {
    if (window.okoloRevealed) return;
    window.okoloRevealed = true;
    window.dispatchEvent(new Event('okolo:reveal'));
  }
  function finish() {
    cancelAnimationFrame(raf);
    if (cleanup) cleanup();
    cleanup = null;
    reveal();
    root.classList.remove('intro-on');
  }

  function start() {
    cancelAnimationFrame(raf);
    if (cleanup) cleanup();
    cleanup = null;
    window.okoloRevealed = false;
    var intro = document.getElementById('intro'), target = document.querySelector('[data-intro-target]');
    if (!intro || !target) { finish(); return; }

    var $ = function (id) { return intro.querySelector('#' + id); };
    var top = intro.querySelector('.intro-top'), svg = $('intro-svg'), stage = $('intro-stage'),
        lamp = $('intro-lamp'), head = $('intro-head'), stem = $('intro-stem'), shade = $('intro-shade'),
        base = $('intro-base'), letter = $('intro-letter'), dot = $('intro-dot'),
        morphShade = $('intro-ms'), morphBase = $('intro-mb');
    var jolt = JOLT.map(function (j) { return [$(j[0]), j[1], j[2], j[3]]; });
    var under = null;
    cleanup = function () {
      if (under) under.remove();
      top.style.clipPath = top.style.webkitClipPath = '';
      stage.removeAttribute('transform');
    };

    // How far off the right edge the lamp starts, in the drawing's own units.
    var box = intro.getBoundingClientRect(), ctm = svg.getScreenCTM();
    var startX = Math.max((box.right - ctm.e) / ctm.a + 130, REST_X + 300);
    var hops = startX - REST_X > 700 ? 2 : 1, step = (startX - REST_X) / hops;

    var tracks = { x: [], y: [], sq: [], lean: [], head: [], fall: [], m: [] };
    function K(name, t, v, ease) { tracks[name].push([t, v, ease || 'io']); }
    // One hop: crouch, stretch, parabolic arc, hard squash on landing.
    // pre: starts from rest. settle: comes to rest after. Chained hops rebound straight into the next crouch.
    function hop(t, x0, x1, h, air, pre, settle) {
      var land = t + air;
      if (pre) { K('sq', t - 0.2, 1); K('lean', t - 0.16, 0); K('head', t - 0.16, 0); }
      K('sq', t - 0.12, 0.62); K('sq', t + 0.07, 1.22, 'out');
      K('sq', land - 0.04, 1.14); K('sq', land + 0.06, 0.56, 'out');
      K('y', t, 0); K('y', t + air / 2, h, 'out'); K('y', land, 0, 'in');
      K('x', t, x0, 'lin'); K('x', land, x1, 'lin');
      K('lean', t, -9); K('lean', t + air / 2, -3); K('lean', land, 6);
      K('head', t + 0.06, 13); K('head', land, -5); K('head', land + 0.1, -15);
      if (settle) {
        K('sq', land + 0.2, 1.08); K('sq', land + 0.32, 1);
        K('lean', land + 0.25, 0);
        K('head', land + 0.3, 4); K('head', land + 0.42, 0);
      }
    }

    K('x', -1, startX); K('y', -1, 0); K('sq', -1, 1); K('lean', -1, 0); K('head', -1, 0); K('fall', -1, 0); K('m', -1, 0);
    for (var i = 0; i < hops; i++) {
      hop(0.25 + i * 0.56, startX - i * step, startX - (i + 1) * step, 110 + step * 0.04, 0.34, i === 0, i === hops - 1);
    }
    var LAND = 0.25 + (hops - 1) * 0.56 + 0.34, FALL = LAND + 0.14, IMPACT = FALL + 0.4, FLY = IMPACT + 0.85;
    // tips over to the left; the moment it hits the floor the shade splats into the letter
    // and the base is thrown off and lands as the dot
    K('fall', FALL, 0); K('fall', IMPACT, -70, 'in');
    K('y', FALL, 0); K('y', IMPACT, -5);
    K('head', IMPACT, 8);
    K('m', IMPACT, 0, 'lin'); K('m', IMPACT + 0.75, 1, 'lin');
    Object.keys(tracks).forEach(function (n) { tracks[n].sort(function (a, b) { return a[0] - b[0]; }); });

    function val(name, t) {
      var k = tracks[name];
      if (t <= k[0][0]) return k[0][1];
      for (var i = 1; i < k.length; i++) {
        if (t < k[i][0]) {
          var a = k[i - 1], b = k[i], span = b[0] - a[0];
          if (span <= 0) return b[1];
          return a[1] + (b[1] - a[1]) * EASE[b[2]]((t - a[0]) / span);
        }
      }
      return k[k.length - 1][1];
    }
    function lampMatrix(t) {
      var x = val('x', t), sy = val('sq', t), sx = 1 + (1 - sy) * 0.6, px = x - HALF_BASE;
      return new DOMMatrix()
        .translate(px, GROUND).rotate(val('fall', t)).translate(-px, -GROUND)
        .translate(x, GROUND - val('y', t)).rotate(val('lean', t))
        .scale(sx * S, sy * S).translate(-512, -888);
    }

    // Morph contours: N points along each outline, matched by the rotation that moves them least.
    function sample(d) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      p.setAttribute('visibility', 'hidden');
      svg.appendChild(p);
      var len = p.getTotalLength(), pts = [];
      for (var i = 0; i < N; i++) { var q = p.getPointAtLength(len * i / N); pts.push([q.x, q.y]); }
      svg.removeChild(p);
      return pts;
    }
    function align(from, to) {
      var best = null, bestCost = Infinity;
      [to, to.slice().reverse()].forEach(function (cand) {
        for (var s = 0; s < N; s++) {
          var cost = 0;
          for (var i = 0; i < N; i += 3) {
            var a = from[i], b = cand[(i + s) % N];
            cost += (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
          }
          if (cost < bestCost) { bestCost = cost; best = [cand, s]; }
        }
      });
      return from.map(function (_, i) { return best[0][(i + best[1]) % N]; });
    }
    function glyph(p) { return [O_X + p[0] * FS, GROUND - p[1] * FS]; }
    function poly(pts) {
      return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
    }
    function lerp(a, b, k) {
      return a.map(function (p, i) { return [p[0] + (b[i][0] - p[0]) * k, p[1] + (b[i][1] - p[1]) * k]; });
    }
    function via(M) { return function (p) { return [M.a * p[0] + M.c * p[1] + M.e, M.b * p[0] + M.d * p[1] + M.f]; }; }
    function about(c) { return function (p) { return [p[0] - c[0], p[1] - c[1]]; }; }
    function back(p) { var q = p - 1; return 1 + 2.70158 * q * q * q + 1.70158 * q * q; }
    function wobble(p, damp, freq) { return p > 0 ? Math.exp(-damp * p) * Math.sin(freq * p) : 0; }
    function squash(cx, w, wide, tall) {
      return function (p) { return [cx + (p[0] - cx) * (1 + wide * w), GROUND + (p[1] - GROUND) * (1 - tall * w)]; };
    }

    var rest = lampMatrix(IMPACT);
    var restHead = rest.multiply(new DOMMatrix().translate(512, 540).rotate(val('head', IMPACT)).translate(-512, -540));
    var oParts = $('intro-o').getAttribute('d').split('Z');
    var shadeFrom = sample(shade.getAttribute('d')).map(via(restHead));
    var shadeTo = align(shadeFrom, sample(oParts[0] + 'Z').map(glyph));
    var hole = sample(oParts[1] + 'Z').map(glyph);
    var holeC = [O_X + 309 * FS, GROUND - 268 * FS];
    // base and dot outlines are kept relative to their centres, so the base can spin through the air
    var C0 = via(rest)([512, 812]), C1 = [DOT.x + DOT.w / 2, DOT.y + DOT.h / 2];
    var baseFrom = [];
    for (var n = 0; n < N; n++) {
      var a = Math.PI * 2 * n / N;
      baseFrom.push(via(rest)([512 + 180 * Math.cos(a), 812 + 76 * Math.sin(a)]));
    }
    baseFrom = baseFrom.map(about(C0));
    var baseTo = align(baseFrom, sample('M' + DOT.x + ' ' + DOT.y + 'h' + DOT.w + 'v' + DOT.h + 'h' + -DOT.w + 'Z').map(about(C1)));

    function show(el, on) { el.setAttribute('visibility', on ? 'visible' : 'hidden'); }

    function draw(t) {
      var M = lampMatrix(t), m = val('m', t), morphing = m > 0 && m < 1, done = m >= 1;
      lamp.setAttribute('transform', 'matrix(' + [M.a, M.b, M.c, M.d, M.e, M.f].join(' ') + ')');
      head.setAttribute('transform', 'rotate(' + val('head', t) + ' 512 540)');
      show(lamp, !done);
      show(shade, m <= 0);
      show(base, m <= 0);
      show(morphShade, morphing);
      show(morphBase, morphing);
      show(letter, done);
      show(dot, done);
      if (morphing) {
        // shade: snaps past the letter shape and springs back, flattened by the impact
        var splat = squash(O_CX, wobble(m, 4, 13), 0.18, 0.35);
        var grow = m < 0.15 ? 0 : back(Math.min((m - 0.15) / 0.45, 1));
        var ring = hole.map(function (p) { return [holeC[0] + (p[0] - holeC[0]) * grow, holeC[1] + (p[1] - holeC[1]) * grow]; });
        morphShade.setAttribute('d', poly(lerp(shadeFrom, shadeTo, back(Math.min(m / 0.55, 1))).map(splat)) +
          (grow > 0.02 ? poly(ring.map(splat)) : ''));
        // base: one full turn through the air, squaring up on the way, then a squashy landing
        var p = Math.min(m / 0.6, 1), ang = -2 * Math.PI * p, co = Math.cos(ang), si = Math.sin(ang);
        var cx = C0[0] + (C1[0] - C0[0]) * p, cy = C0[1] + (C1[1] - C0[1]) * p - 4 * 170 * p * (1 - p);
        var land = squash(C1[0], wobble((m - 0.6) / 0.4, 5, 16), 0.25, 0.4);
        morphBase.setAttribute('d', poly(lerp(baseFrom, baseTo, EASE.io(p)).map(function (q) {
          return land([cx + q[0] * co - q[1] * si, cy + q[0] * si + q[1] * co]);
        })));
      }
      // the stem snaps back into the shade
      var k = m <= 0 ? 1 : Math.max(1 - m / 0.15, 0.001);
      stem.setAttribute('transform', 'translate(512 540) scale(1 ' + k + ') translate(-512 -540)');
      // the wordmark jumps from the impact, letter by letter
      jolt.forEach(function (j) {
        var u = (t - IMPACT - j[2]) / 0.28, dy = u > 0 && u < 1 ? j[3] * Math.sin(Math.PI * u) : 0;
        j[0].setAttribute('transform', 'translate(' + j[1] + ' ' + (GROUND - dy) + ') scale(' + FS + ' ' + -FS + ')');
      });
    }

    // Where the drawn wordmark has to end up to sit exactly on the real one, and the circle the screen closes into.
    // The circle shrinks ever faster, so it is gone in a frame or two once it reaches the wordmark.
    function takeoff() {
      var r = target.getBoundingClientRect(), size = parseFloat(getComputedStyle(target).fontSize);
      var probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      target.insertBefore(probe, target.firstChild);
      var baseline = probe.getBoundingClientRect().bottom;
      target.removeChild(probe);
      var c = svg.getScreenCTM(), b = intro.getBoundingClientRect(), g = size / 1000 / (FS * c.a);
      var dx = (r.left - c.e) / c.a - g * X0, dy = (baseline - c.f) / c.a - g * GROUND;
      // the screen closes into the dot of the landed wordmark
      var cx = c.a * (g * C1[0] + dx) + c.e - b.left, cy = c.a * (g * C1[1] + dy) + c.f - b.top;
      under = top.cloneNode(true);
      under.className = 'intro-under';
      [].forEach.call(under.querySelectorAll('[id]'), function (el) { el.removeAttribute('id'); });
      intro.insertBefore(under, top);
      return {
        g: g, dx: dx, dy: dy,
        cx: cx, cy: cy,
        radius: Math.hypot(Math.max(cx, b.width - cx), Math.max(cy, b.height - cy)),
        stages: [stage, under.querySelector('.intro-stage')]
      };
    }

    var fontsReady = !document.fonts;
    if (document.fonts) document.fonts.ready.then(function () { fontsReady = true; });
    var last = null, t = 0, waited = 0, fly = null;
    intro.onpointerdown = function () { if (!fly) { t = FLY; waited = 9; } };

    function frame(now) {
      try {
        var dt = last === null ? 0 : Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        if (!fly) {
          if (t < FLY) draw(t);
          else {
            // the real wordmark can only be measured once its font is in
            t = FLY;
            draw(FLY);
            if (fontsReady || waited >= 1.5) { fly = takeoff(); reveal(); } else waited += dt;
          }
        } else {
          var p = Math.min((t - FLY) / FLY_DUR, 1), e = EASE.io(p), g = 1 + (fly.g - 1) * e;
          var move = 'matrix(' + [g, 0, 0, g, fly.dx * e, fly.dy * e].join(' ') + ')';
          fly.stages.forEach(function (s) { s.setAttribute('transform', move); });
          top.style.clipPath = top.style.webkitClipPath =
            'circle(' + (fly.radius * (1 - p * p)).toFixed(1) + 'px at ' + fly.cx.toFixed(1) + 'px ' + fly.cy.toFixed(1) + 'px)';
          if (p >= 1) { finish(); return; }
        }
      } catch (err) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    draw(0);
    raf = requestAnimationFrame(frame);
  }

  function run() {
    if (!root.classList.contains('intro-on')) return;
    try { start(); } catch (err) { finish(); }
  }
  // lets a page replay it: put .intro-on back on <html> and call this
  window.okoloIntro = run;
  run();
})();
