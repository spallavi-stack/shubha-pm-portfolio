/* A/B Test It — predicted-winner heuristic for two copy variants.
   There's no real traffic here, so this never claims to run a live
   test. It scores each variant against real copywriting/activation
   principles (clarity, specificity, friction reduction — see
   "What is a good activation rate" in the sources ledger below), then
   applies a minimum-reach validity check inspired by Ronny Kohavi's
   point that A/B testing needs "enough units... for the statistics
   to work out." Below that reach, the tool says so instead of
   pretending to be confident. The scoring weights and thresholds
   below are my own implementation of those principles, not lifted
   from any source. */
(function(){
  var MIN_RELIABLE_REACH = 1000; // monthly visitors; my own threshold, not Kohavi's literal number

  var STAGE_DEFAULTS = {
    '0to1': {reach: 250, a: "Welcome! Let's get your account set up", b: "You're in. Here's your first step"},
    '1ton': {reach: 4000, a: 'Save 20% when you upgrade to our new plan', b: 'Try it free for 14 days, no credit card required'}
  };

  var VAGUE_WORDS = ['innovative', 'revolutionize', 'revolutionary', 'solution', 'synergy', 'leverage', 'best-in-class', 'cutting-edge', 'game-changing', 'robust', 'seamless'];
  var FRICTION_PHRASES = ['no credit card', 'no signup', 'no commitment', 'cancel anytime', 'free', 'instant', 'in seconds'];
  var URGENCY_WORDS = ['today', 'this week', 'limited', 'now', 'hurry'];

  function countMatches(text, list){
    var lower = text.toLowerCase();
    return list.filter(function(term){ return lower.indexOf(term) !== -1; });
  }

  function scoreVariant(label, text){
    var reasons = [];
    var score = 50;
    var words = text.trim().split(/\s+/).filter(Boolean);
    var wordCount = words.length;

    if(wordCount > 0 && wordCount <= 12){
      score += 10;
      reasons.push(label + ' is concise (' + wordCount + ' words). It reads clearly at a glance.');
    } else if(wordCount > 20){
      score -= 10;
      reasons.push(label + ' is long (' + wordCount + ' words) and risks losing the reader before the point lands.');
    }

    var vagueHits = countMatches(text, VAGUE_WORDS);
    if(vagueHits.length){
      score -= 8 * vagueHits.length;
      reasons.push(label + ' leans on vague language ("' + vagueHits.join('", "') + '") instead of a concrete claim.');
    }

    if(/\d/.test(text)){
      score += 12;
      reasons.push(label + ' cites a concrete number, which reads as more credible than an unspecific claim.');
    }

    var frictionHits = countMatches(text, FRICTION_PHRASES);
    if(frictionHits.length){
      score += 10 * Math.min(frictionHits.length, 2);
      reasons.push(label + ' reduces perceived friction ("' + frictionHits.join('", "') + '").');
    }

    var urgencyHits = countMatches(text, URGENCY_WORDS);
    if(urgencyHits.length){
      score += 4 * Math.min(urgencyHits.length, 2);
      reasons.push(label + ' adds a mild urgency cue ("' + urgencyHits.join('", "') + '").');
    }

    return {
      label: label,
      score: Math.max(0, Math.min(100, score)),
      reasons: reasons
    };
  }

  function initAbTest(){
    var root = document.getElementById('ab-test-root');
    var variantAInput = document.getElementById('abVariantA');
    var variantBInput = document.getElementById('abVariantB');
    var reachInput = document.getElementById('abReach');
    var runBtn = document.getElementById('abRunBtn');
    var emptyState = document.getElementById('abEmptyState');
    var result = document.getElementById('abResult');
    var validityBanner = document.getElementById('abValidityBanner');
    var cardA = document.getElementById('abCardA');
    var cardB = document.getElementById('abCardB');
    var textA = document.getElementById('abTextA');
    var textB = document.getElementById('abTextB');
    var scoreA = document.getElementById('abScoreA');
    var scoreB = document.getElementById('abScoreB');
    var reasoningList = document.getElementById('abReasoningList');
    if(!root || !variantAInput || !variantBInput || !runBtn || !result) return;

    function runTest(){
      var variantAText = variantAInput.value.trim();
      var variantBText = variantBInput.value.trim();
      if(!variantAText || !variantBText) return;

      var reach = Number(reachInput.value) || 0;
      var a = scoreVariant('Variant A', variantAText);
      var b = scoreVariant('Variant B', variantBText);
      var winner = a.score === b.score ? null : (a.score > b.score ? 'A' : 'B');

      textA.textContent = variantAText;
      textB.textContent = variantBText;
      scoreA.textContent = a.score + '/100';
      scoreB.textContent = b.score + '/100';
      cardA.classList.toggle('is-winner', winner === 'A');
      cardB.classList.toggle('is-winner', winner === 'B');

      if(reach < MIN_RELIABLE_REACH){
        validityBanner.className = 'ab-validity-banner is-underpowered';
        validityBanner.textContent = 'With an estimated reach of ' + reach.toLocaleString('en-US') + '/month, you likely don’t have enough volume to reach a statistically reliable result in a reasonable timeframe. Treat this as a directional read, not a confident call.';
      } else {
        validityBanner.className = 'ab-validity-banner is-valid';
        validityBanner.textContent = 'At an estimated reach of ' + reach.toLocaleString('en-US') + '/month, this has enough volume to be worth actually testing, not just predicting.';
      }

      var reasoning = a.reasons.concat(b.reasons);
      if(winner){
        reasoning.push('Predicted winner: Variant ' + winner + ', based on the factors above.');
      } else {
        reasoning.push('Both variants score too close to call, so treat this as a coin flip.');
      }
      reasoning.push('A/B testing works best for incremental copy tweaks like this. Strategy, vision, and other one-off decisions need a different kind of validation.');

      reasoningList.innerHTML = reasoning.map(function(r){ return '<li>' + r + '</li>'; }).join('');

      if(emptyState) emptyState.hidden = true;
      result.hidden = false;
    }

    function applyStage(stage){
      var defaults = STAGE_DEFAULTS[stage] || STAGE_DEFAULTS['0to1'];
      variantAInput.value = defaults.a;
      variantBInput.value = defaults.b;
      reachInput.value = String(defaults.reach);
      result.hidden = true;
      if(emptyState) emptyState.hidden = false;
    }

    runBtn.addEventListener('click', runTest);
    window.addEventListener('pmlab:stage', function(e){
      applyStage(e.detail.stage);
    });

    applyStage(window.pmLabStage);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAbTest);
  } else {
    initAbTest();
  }
})();
