/* PM Strategy & Execution Lab (Playground): tab switching and the
   0→1 / 1→n stage toggle. Vanilla JS, no dependencies. Individual
   tool scripts (gtm-engine.js, prioritization.js, prd-analyzer.js,
   ab-test.js) mount into the .pm-lab-tool containers independently
   of this file, but read window.pmLabStage for their initial stage
   and listen for the 'pmlab:stage' event to re-apply stage defaults
   when the toggle changes. */
window.pmLabStage = window.pmLabStage || '0to1';

// Shared hover/tap tooltip for any ".rice-info" icon button with a
// data-tooltip attribute, used by both the RICE table's column/field
// info icons and the Spec Deep-Dives preset buttons. Appended to
// <body> and positioned with getBoundingClientRect() on demand, so it
// escapes any scrolling/overflow container and stays unclipped. Wired
// via delegation on the passed-in root so it keeps working for icons
// added later (new RICE rows, a stage switch). Hover/focus shows it
// (desktop); a tap toggles it open and outside-click/Escape closes it
// (touch).
window.pmLabInitInfoTooltips = function(root){
  var bubble = document.createElement('div');
  bubble.className = 'rice-tooltip-bubble';
  bubble.setAttribute('role', 'tooltip');
  document.body.appendChild(bubble);

  var openBtn = null;

  function positionBubble(btn){
    var rect = btn.getBoundingClientRect();
    bubble.style.top = (rect.bottom + 8) + 'px';
    var left = rect.left + rect.width / 2 - bubble.offsetWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - bubble.offsetWidth - 8));
    bubble.style.left = left + 'px';
  }

  function show(btn){
    bubble.textContent = btn.getAttribute('data-tooltip') || '';
    bubble.classList.add('is-visible');
    positionBubble(btn);
  }

  function hide(){
    bubble.classList.remove('is-visible');
    if(openBtn) openBtn.classList.remove('is-open');
    openBtn = null;
  }

  root.addEventListener('mouseover', function(e){
    var btn = e.target.closest('.rice-info');
    if(btn) show(btn);
  });
  root.addEventListener('mouseout', function(e){
    var btn = e.target.closest('.rice-info');
    if(btn && btn !== openBtn) hide();
  });
  root.addEventListener('focusin', function(e){
    var btn = e.target.closest('.rice-info');
    if(btn) show(btn);
  });
  root.addEventListener('focusout', function(e){
    var btn = e.target.closest('.rice-info');
    if(btn && btn !== openBtn) hide();
  });
  root.addEventListener('click', function(e){
    var btn = e.target.closest('.rice-info');
    if(!btn) return;
    e.stopPropagation();
    if(openBtn === btn){
      hide();
    } else {
      if(openBtn) openBtn.classList.remove('is-open');
      openBtn = btn;
      btn.classList.add('is-open');
      show(btn);
    }
  });

  document.addEventListener('click', function(){ if(openBtn) hide(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && openBtn) hide(); });
  window.addEventListener('scroll', function(){ if(openBtn) positionBubble(openBtn); }, true);
};

(function(){
  var STAGE_CAPTIONS = {
    '0to1': 'Defaults and sample data below are set for an early-stage team finding its first users.',
    '1ton': 'Defaults and sample data below are set for a team with real usage data and a proven motion.'
  };

  function initPmLab(){
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.pm-lab-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.pm-lab-panel'));

    function activate(panelId){
      tabs.forEach(function(tab){
        var isActive = tab.getAttribute('aria-controls') === panelId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach(function(panel){
        panel.classList.toggle('is-active', panel.id === panelId);
      });
    }

    if(tabs.length && panels.length){
      tabs.forEach(function(tab, i){
        tab.addEventListener('click', function(){
          activate(tab.getAttribute('aria-controls'));
        });
        tab.addEventListener('keydown', function(e){
          var next;
          if(e.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if(e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else return;
          e.preventDefault();
          tabs[next].focus();
          activate(tabs[next].getAttribute('aria-controls'));
        });
      });

      activate(tabs[0].getAttribute('aria-controls'));
    }

    var stageBtns = Array.prototype.slice.call(document.querySelectorAll('.pm-lab-stage-btn'));
    var stageCaption = document.getElementById('pmLabStageCaption');
    if(stageBtns.length){
      stageBtns.forEach(function(btn){
        btn.addEventListener('click', function(){
          var stage = btn.getAttribute('data-stage');
          if(stage === window.pmLabStage) return;
          window.pmLabStage = stage;
          stageBtns.forEach(function(b){
            var isActive = b === btn;
            b.classList.toggle('is-active', isActive);
            b.setAttribute('aria-checked', isActive ? 'true' : 'false');
          });
          if(stageCaption) stageCaption.textContent = STAGE_CAPTIONS[stage] || '';
          window.dispatchEvent(new CustomEvent('pmlab:stage', { detail: { stage: stage } }));
        });
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPmLab);
  } else {
    initPmLab();
  }
})();
