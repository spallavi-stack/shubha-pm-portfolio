/* PM Strategy & Execution Lab — tab switching.
   Vanilla JS, no dependencies. Individual tool scripts
   (gtm-engine.js, prioritization.js, prd-analyzer.js) mount
   into the .pm-lab-tool containers independently of this file. */
(function(){
  function initPmLab(){
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.pm-lab-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.pm-lab-panel'));
    if(!tabs.length || !panels.length) return;

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

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPmLab);
  } else {
    initPmLab();
  }
})();
