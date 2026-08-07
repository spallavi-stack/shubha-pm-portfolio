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

  /* ---------- Case study cards: name flips in, screenshot crawls up from
     below, bullets stagger in. Base CSS leaves everything visible, so this
     only runs as a progressive enhancement when full motion is enabled.

     Cards sit side by side horizontally in the carousel (same vertical
     position, offset in X), so a ScrollTrigger on every card would fire
     for all of them the instant the row's Y-position scrolls into view,
     regardless of which one is actually horizontally visible - the later
     cards' reveals would silently play offscreen before the user ever
     scrolls or clicks to them. Only card 0 gets that scroll-gated auto
     reveal; every card (including 0) is also replayable, and the
     carousel's next/prev/dot nav calls window.replayCaseCardReveal(card)
     whenever a new card becomes the active one. ---------- */
  function initCaseCards(){
    var cards = document.querySelectorAll('.case-card-v2.live');
    if(!cards.length) return;
    var players = new Map();

    cards.forEach(function(card, cardIndex){
      var name = card.querySelector('[data-case-split]');
      var shot = card.querySelector('[data-case-shot]');
      var bullets = card.querySelectorAll('[data-case-bullets] li');
      var split = null;

      if(!hasGSAP || !enableFullMotion){
        if(name) name.style.visibility = 'visible';
        return;
      }

      if(name && window.SplitText){
        split = new SplitText(name, { type:'lines', linesClass:'case-name-line' });
        gsap.set(name, { visibility:'visible' });
        gsap.set(split.lines, { yPercent:100, rotateX:70, opacity:0 });
      } else if(name){
        name.style.visibility = 'visible';
      }
      if(shot){
        gsap.set(shot, { yPercent:14, opacity:0 });
      }
      if(bullets.length){
        gsap.set(bullets, { autoAlpha:0, y:10 });
      }

      function play(){
        if(split){
          gsap.fromTo(split.lines,
            { yPercent:100, rotateX:70, opacity:0 },
            { yPercent:0, rotateX:0, opacity:1, transformOrigin:'50% 100%', duration:1, ease:'expo.out', stagger:0.08 }
          );
        }
        if(shot){
          gsap.fromTo(shot, { yPercent:14, opacity:0 }, {
            yPercent:0, opacity:1, duration:1.3, ease:'power3.out', delay:0.1
          });
        }
        if(bullets.length){
          gsap.fromTo(bullets, { autoAlpha:0, y:10 }, {
            autoAlpha:1, y:0, duration:0.6, ease:'power2.out', stagger:0.14, delay:0.3
          });
        }
      }

      players.set(card, play);
      if(cardIndex === 0){
        ScrollTrigger.create({ trigger: card, start: 'top 55%', once: true, onEnter: play });
      }
    });

    window.replayCaseCardReveal = function(card){
      var play = players.get(card);
      if(play) play();
    };
  }

  /* ---------- Who-this-is-for flip cards: click/tap swaps the short label
     for the full sentence via a CSS 3D flip. Pure CSS transform, no GSAP
     dependency, so it works identically whether or not GSAP loaded. Toggles
     aria-hidden/aria-expanded so a screen reader only ever announces
     whichever face is currently facing the visitor.

     At most one card open at a time: opening a second card first closes
     whichever one is already open, then waits for its collapse transition
     to finish before growing the new one, so two cards never sit mid-grow
     together and disrupt the row layout at once. Delay matches the
     .flip-card width/height transition duration (500ms); skipped entirely
     under reduced motion, where that transition is already instant. ---------- */
  function initFlipCards(){
    var cards = document.querySelectorAll('[data-flip-card]');
    if(!cards.length) return;
    var CLOSE_DELAY = reduceMotion ? 0 : 500;
    var setters = new Map();
    var openCard = null;

    cards.forEach(function(card){
      var btn = card.querySelector('.flip-card-trigger');
      var front = card.querySelector('.flip-card-front');
      var back = card.querySelector('.flip-card-back');
      if(!btn) return;

      function setFlipped(flipped){
        card.classList.toggle('is-flipped', flipped);
        btn.setAttribute('aria-expanded', flipped ? 'true' : 'false');
        if(front) front.setAttribute('aria-hidden', flipped ? 'true' : 'false');
        if(back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      }
      setters.set(card, setFlipped);

      btn.addEventListener('click', function(){
        if(card.classList.contains('is-flipped')){
          setFlipped(false);
          openCard = null;
          return;
        }
        if(openCard){
          var closePrev = setters.get(openCard);
          if(closePrev) closePrev(false);
          openCard = card;
          setTimeout(function(){ setFlipped(true); }, CLOSE_DELAY);
        } else {
          openCard = card;
          setFlipped(true);
        }
      });
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
    initCaseCards();
    initFlipCards();
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
