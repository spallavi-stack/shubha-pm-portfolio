/* ============================================================
   Shared motion layer — Shubha's PM Portfolio
   Requires (loaded before this file): lenis.min.js, gsap.min.js,
   ScrollTrigger.min.js, SplitText.min.js (see assets/vendor/).

   Everything here is guarded by prefers-reduced-motion and a
   coarse-pointer/mobile check: on either, Lenis/parallax/magnetic
   effects are skipped and content relies on plain CSS instead of
   ever depending on JS to become visible.
   ============================================================ */
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var enableFullMotion = !reduceMotion; // Lenis + parallax + magnetic gated on this
  var enableHoverMotion = !reduceMotion && !isCoarsePointer; // magnetic/cursor-follow only

  var hasGSAP = typeof window.gsap !== 'undefined';
  if(hasGSAP && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
  }
  if(hasGSAP && window.SplitText){
    gsap.registerPlugin(SplitText);
  }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if(enableFullMotion && typeof window.Lenis !== 'undefined'){
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    if(hasGSAP){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time){ lenis.raf(time); requestAnimationFrame(raf); });
    }
  }

  /* ---------- Nav shrink/blur state ---------- */
  function initNavState(){
    var nav = document.querySelector('nav');
    if(!nav) return;
    function update(){ nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Scroll reveal: fade + rise on entry ---------- */
  function initReveal(){
    var els = document.querySelectorAll('[data-reveal]');
    if(!els.length) return;
    if(!hasGSAP){ return; } // base CSS already leaves them visible
    els.forEach(function(el){
      gsap.fromTo(el, { autoAlpha:0, y:28 }, {
        autoAlpha:1, y:0, duration:0.9, ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 88%' }
      });
    });
  }

  /* ---------- Staggered group reveal (cards, list items) ---------- */
  function initStagger(){
    var groups = document.querySelectorAll('[data-reveal-stagger]');
    if(!groups.length || !hasGSAP) return;
    groups.forEach(function(group){
      var items = group.children;
      gsap.fromTo(items, { autoAlpha:0, y:24 }, {
        autoAlpha:1, y:0, duration:0.8, ease:'power3.out', stagger:0.08,
        scrollTrigger:{ trigger:group, start:'top 85%' }
      });
    });
  }

  /* ---------- Hero headline split-text reveal ---------- */
  function initSplitHeadline(){
    var el = document.querySelector('[data-split-reveal]');
    if(!el || !hasGSAP) return;
    if(!enableFullMotion || !window.SplitText){
      gsap.set(el, { autoAlpha:1, y:0 });
      return;
    }
    var split = new SplitText(el, { type:'lines,words', linesClass:'split-line' });
    gsap.set(el, { autoAlpha:1 });
    gsap.from(split.words, {
      yPercent:110, opacity:0, duration:0.9, ease:'power3.out', stagger:0.025, delay:0.15
    });
  }

  /* ---------- Count-up numbers (stat strip) ---------- */
  function initCountUp(){
    var stats = document.querySelectorAll('[data-count]');
    if(!stats.length) return;
    stats.forEach(function(el){
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'),10) : 0;
      var ring = el.closest('.stat') && el.closest('.stat').querySelector('.arc');
      var run = function(){
        var obj = { v:0 };
        if(hasGSAP){
          gsap.to(obj, {
            v:target, duration:1.6, ease:'power2.out',
            onUpdate:function(){ el.textContent = obj.v.toFixed(decimals) + suffix; }
          });
          if(ring){
            var len = ring.getTotalLength ? ring.getTotalLength() : 301.6;
            gsap.set(ring, { strokeDasharray:len, strokeDashoffset:len });
            gsap.to(ring, { strokeDashoffset:0, duration:1.6, ease:'power2.out' });
          }
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      };
      if(hasGSAP){
        ScrollTrigger.create({ trigger: el, start:'top 90%', once:true, onEnter: run });
      } else {
        run();
      }
    });
  }

  /* ---------- Magnetic hover (desktop only) ---------- */
  function initMagnetic(){
    if(!enableHoverMotion || !hasGSAP) return;
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      var strength = 18;
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        gsap.to(el, { x:(x/r.width)*strength, y:(y/r.height)*strength, duration:0.3, ease:'power2.out' });
      });
      el.addEventListener('mouseleave', function(){
        gsap.to(el, { x:0, y:0, duration:0.4, ease:'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- Energy-flow line motif: draw stroke on scroll ---------- */
  function initEnergyDividers(){
    document.querySelectorAll('.energy-divider path').forEach(function(path){
      var len = path.getTotalLength ? path.getTotalLength() : 1000;
      if(hasGSAP){
        gsap.set(path, { strokeDasharray:len, strokeDashoffset:len });
        gsap.to(path, {
          strokeDashoffset:0, duration:1.4, ease:'power2.inOut',
          scrollTrigger:{ trigger:path, start:'top 92%' }
        });
      } else {
        path.style.strokeDashoffset = 0;
      }
    });
  }

  /* ---------- Subtle hero parallax (full motion only) ---------- */
  function initHeroParallax(){
    if(!enableFullMotion || !hasGSAP) return;
    var layer = document.querySelector('[data-parallax]');
    if(!layer) return;
    gsap.to(layer, {
      yPercent:18, ease:'none',
      scrollTrigger:{ trigger: layer.closest('header') || layer, start:'top top', end:'bottom top', scrub:true }
    });
  }

  function init(){
    initNavState();
    initSplitHeadline();
    initReveal();
    initStagger();
    initCountUp();
    initMagnetic();
    initEnergyDividers();
    initHeroParallax();
    if(hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PortfolioMotion = { lenis: lenis, reduceMotion: reduceMotion };
})();
