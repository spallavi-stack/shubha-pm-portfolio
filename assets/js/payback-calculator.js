/* Payback Period Calculator: CAC / monthly gross profit, benchmarked
   against real named-operator consensus (16 growth operators surveyed
   in Lenny's "What is a good payback period?"), not an invented
   threshold. Never says a result is simply "bad", the caveat that a
   shorter payback isn't automatically better is always shown, per the
   same operators' own examples of when a longer one is correct. */
(function(){
  var SEGMENTS = {
    b2c:  {label: 'B2C', great: 1, good: 6, ok: 12},
    smb:  {label: 'B2B, SMB', great: 6, good: 12, ok: 18},
    ent:  {label: 'B2B, Enterprise', great: 12, good: 18, ok: 24}
  };

  function formatNum(n){
    return n.toLocaleString('en-US', {maximumFractionDigits: 0});
  }

  function classify(months, seg){
    if(months < seg.great) return 'GREAT';
    if(months <= seg.good) return 'GOOD';
    if(months <= seg.ok) return 'OK';
    return 'BEYOND';
  }

  function initPayback(){
    var cacInput = document.getElementById('pbCac');
    var revenueInput = document.getElementById('pbRevenue');
    var marginInput = document.getElementById('pbMargin');
    var segmentInput = document.getElementById('pbSegment');
    var runBtn = document.getElementById('pbRunBtn');
    var emptyState = document.getElementById('pbEmptyState');
    var result = document.getElementById('pbResult');
    var banner = document.getElementById('pbBanner');
    var details = document.getElementById('pbDetails');
    if(!cacInput || !revenueInput || !marginInput || !segmentInput || !runBtn || !result) return;

    function run(){
      var cac = Number(cacInput.value) || 0;
      var revenue = Number(revenueInput.value) || 0;
      var margin = Number(marginInput.value) / 100;
      var seg = SEGMENTS[segmentInput.value] || SEGMENTS.b2c;

      if(!(cac > 0) || !(revenue > 0) || !(margin > 0)){
        banner.className = 'ab-validity-banner is-underpowered';
        banner.textContent = 'Enter a CAC, monthly revenue, and gross margin greater than zero.';
        details.innerHTML = '';
        emptyState.hidden = true;
        result.hidden = false;
        return;
      }

      var grossProfit = revenue * margin;
      var months = cac / grossProfit;
      var monthsRevenueBasis = cac / revenue;
      var tier = classify(months, seg);

      var bannerText = 'Your payback period is ' + months.toFixed(1) + ' months (' + formatNum(cac) + ' ÷ ' + formatNum(grossProfit) + ' gross profit per month). ';
      if(tier === 'BEYOND'){
        bannerText += 'That’s beyond the OK range this benchmark suggests for a ' + seg.label + ' business (over ' + seg.ok + ' months). That’s not automatically a problem, see the note below.';
        banner.className = 'ab-validity-banner is-underpowered';
      } else {
        bannerText += 'That’s in ' + tier + ' range for a ' + seg.label + ' business, per a survey of 16 growth operators.';
        banner.className = (tier === 'OK') ? 'ab-validity-banner is-underpowered' : 'ab-validity-banner is-valid';
      }
      banner.textContent = bannerText;

      details.innerHTML = [
        'Calculated off revenue instead of gross profit, a common mistake, this would look like ' + monthsRevenueBasis.toFixed(1) + ' months instead. "Revenue doesn’t pay your salaries, gross profit does." — Brian Rothenberg',
        'A shorter payback period isn’t automatically better. Operators in this survey point to real cases where a longer payback period is the right call: mature businesses with predictable long-term LTV, multi-year enterprise contracts with renewal data, or a deliberate growth-stage investment. Treat this as a reference point, not a verdict.'
      ].map(function(t){ return '<li>' + t + '</li>'; }).join('');

      emptyState.hidden = true;
      result.hidden = false;
    }

    runBtn.addEventListener('click', run);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPayback);
  } else {
    initPayback();
  }
})();
