/* PM Strategy & Execution Lab (Playground): tab switching and the
   0→1 / 1→n stage toggle. Vanilla JS, no dependencies. Individual
   tool scripts (gtm-engine.js, prioritization.js, prd-analyzer.js,
   ab-test.js) mount into the .pm-lab-tool containers independently
   of this file, but read window.pmLabStage for their initial stage
   and listen for the 'pmlab:stage' event to re-apply stage defaults
   when the toggle changes. */
window.pmLabStage = window.pmLabStage || '0to1';

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
