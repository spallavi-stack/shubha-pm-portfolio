/* A/B Test Planner: real sample-size math (classical two-proportion
   z-test, 95% confidence / 80% power), not a copy-quality predictor.
   Given a baseline conversion rate and the smallest lift worth
   detecting, computes how many visitors a valid test needs and how
   long that takes at the given reach. Never claims to predict which
   variant wins, see the sources note in index.html. The peeking-
   problem warning is always shown, not conditional, since a sample
   size number without that discipline is misleading on its own. */
(function(){
  var Z_ALPHA = 1.96; // 95% confidence, two-tailed
  var Z_BETA = 0.84;  // 80% power
  var IMPRACTICAL_DAYS = 180;

  function formatNum(n){
    return Math.round(n).toLocaleString('en-US');
  }

  function initAbPlanner(){
    var baselineInput = document.getElementById('abplanBaseline');
    var mdeInput = document.getElementById('abplanMde');
    var reachInput = document.getElementById('abplanReach');
    var runBtn = document.getElementById('abplanRunBtn');
    var emptyState = document.getElementById('abplanEmptyState');
    var result = document.getElementById('abplanResult');
    var banner = document.getElementById('abplanBanner');
    var details = document.getElementById('abplanDetails');
    if(!baselineInput || !mdeInput || !reachInput || !runBtn || !result) return;

    function run(){
      var p1 = Number(baselineInput.value) / 100;
      var mde = Number(mdeInput.value) / 100;
      var reach = Number(reachInput.value) || 0;
      var p2 = p1 + mde;

      if(!(p1 > 0) || !(mde > 0) || p2 >= 1){
        banner.className = 'ab-validity-banner is-underpowered';
        banner.textContent = 'Enter a conversion rate and lift that stay between 0 and 100%.';
        details.innerHTML = '';
        emptyState.hidden = true;
        result.hidden = false;
        return;
      }

      var variance = p1 * (1 - p1) + p2 * (1 - p2);
      var n = Math.pow(Z_ALPHA + Z_BETA, 2) * variance / Math.pow(p1 - p2, 2);
      var total = n * 2;
      var dailyReach = reach / 30;
      var days = dailyReach > 0 ? Math.ceil(total / dailyReach) : Infinity;
      var weeks = isFinite(days) ? Math.ceil(days / 7) : Infinity;

      if(isFinite(days) && days <= IMPRACTICAL_DAYS){
        banner.className = 'ab-validity-banner is-valid';
        banner.textContent = 'You’d need about ' + formatNum(n) + ' visitors per variant (' + formatNum(total) + ' total) to detect a ' + mdeInput.value + '-point lift with 95% confidence. At your estimated reach of ' + formatNum(reach) + '/month, that’s about ' + days + ' days (~' + weeks + ' weeks).';
      } else {
        banner.className = 'ab-validity-banner is-underpowered';
        var timeText = isFinite(days) ? 'about ' + formatNum(days) + ' days' : 'an unbounded amount of time at zero reach';
        banner.textContent = 'At this reach, detecting a ' + mdeInput.value + '-point lift would take ' + timeText + ', likely too long to be a practical test. Consider a larger minimum detectable effect (accept only detecting bigger changes) or a higher-reach placement.';
      }

      details.innerHTML = [
        'Commit to the full sample size before checking results. Stopping early because an interim result looks significant is one of the most common ways A/B tests produce false positives, in some analyses, checking results repeatedly can push the real false-positive rate from 5% past 40%. If you need to monitor results continuously, that requires a different statistical method (sequential testing), not this fixed-sample calculation.',
        'Assumes the standard 95% confidence / 80% power used by most experimentation platforms.'
      ].map(function(t){ return '<li>' + t + '</li>'; }).join('');

      emptyState.hidden = true;
      result.hidden = false;
    }

    runBtn.addEventListener('click', run);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAbPlanner);
  } else {
    initAbPlanner();
  }
})();
