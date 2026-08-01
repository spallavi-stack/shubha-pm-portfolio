/* GTM Trade-Off Engine — PLG vs. enterprise sales motion calculator.
   Scoring model is directionally grounded in the growth-benchmark
   frameworks Lenny's Newsletter has published from Elena Verna and
   Kyle Poyar (ACV and deal complexity as the primary axes separating
   PLG from sales-led motions), simplified into a single 0-100 score
   for a client-side calculator. Not a substitute for a real GTM model. */
(function(){
  var CYCLE_SCORE = {instant: 0, '1-3': 10, '3-6': 20, '6-12': 30};
  var CYCLE_LABEL = {instant: 'an instant', '1-3': 'a 1-3 month', '3-6': 'a 3-6 month', '6-12': 'a 6-12 month'};
  var PERSONA_SCORE = {'end-user': 0, 'team-lead': 15, 'exec-vp': 30};
  var PERSONA_LABEL = {'end-user': 'an individual contributor (self-serve)', 'team-lead': 'a team lead', 'exec-vp': 'an executive/VP buyer'};

  // Illustrative anchors only — these companies' actual GTM motions have
  // evolved and blend multiple approaches. Matched to strategy category,
  // not to the exact ACV/cycle/persona inputs.
  var STRATEGY_EXAMPLE = {
    'Pure PLG (Product-Led Growth)': 'Calendly and Loom grew this way early on: cheap enough per seat that self-serve signup had to carry the whole motion.',
    'PLG + Sales-Assist Hybrid': 'Notion and Figma started here: free to self-serve, with a sales-assist layer added once accounts got big enough to justify a rep.',
    'Product-Led Sales / Enterprise Hybrid': 'Slack and Zoom run this today: usage inside a free or team plan sources and qualifies the pipeline, but a rep closes the enterprise upgrade.',
    'Enterprise Sales-Led': 'Salesforce and Workday: six/seven-figure deals, a VP+ buyer, and a sales cycle measured in quarters, not days.'
  };

  var DIAL_PATH_LENGTH = Math.PI * 80; // semicircle, r=80

  var STAGE_DEFAULTS = {
    '0to1': {acv: 2000, cycle: 'instant', persona: 'end-user'},
    '1ton': {acv: 40000, cycle: '3-6', persona: 'team-lead'}
  };
  var STAGE_NOTES = {
    '0to1': 'At this stage, treat this as a hypothesis about your eventual motion, not a commitment — you likely don’t have enough closed deals yet to know your real numbers.',
    '1ton': 'With real deal data now, revisit these inputs quarterly as ACV and cycle length actually shift.'
  };

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function formatCurrency(n){
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function baseScore(acv, cycle, persona){
    var acvScore = clamp((acv - 1000) / (100000 - 1000), 0, 1) * 40;
    return acvScore + CYCLE_SCORE[cycle] + PERSONA_SCORE[persona];
  }

  function decideStrategy(state){
    var acv = state.acv, cycle = state.cycle, persona = state.persona;
    var score = baseScore(acv, cycle, persona);
    var result;

    if(acv < 5000 && persona === 'end-user'){
      result = {
        label: 'Pure PLG (Product-Led Growth)',
        desc: 'At ' + formatCurrency(acv) + ' ACV sold to ' + PERSONA_LABEL[persona] + ', a sales team can’t be paid for out of the deal. Growth has to come from self-serve signup, in-product activation, and free-to-paid conversion.',
        metrics: ['Time-to-Value (TTV)', 'Free-to-Paid Conversion %']
      };
      score = Math.min(score, 18);
    } else if(acv > 30000 && (cycle === '3-6' || cycle === '6-12')){
      result = {
        label: 'Product-Led Sales / Enterprise Hybrid',
        desc: 'At ' + formatCurrency(acv) + ' ACV with ' + CYCLE_LABEL[cycle] + ' cycle, product usage should generate and qualify pipeline, but a rep is still needed to close. Let the product create PQLs; let sales run the deal.',
        metrics: ['PQL-to-Demo Conversion', 'Sales Cycle Velocity']
      };
      score = Math.max(score, 60);
    } else if(score < 25){
      result = {
        label: 'Pure PLG (Product-Led Growth)',
        desc: 'Low ACV and a short cycle mean the product itself has to do the selling. Self-serve onboarding and in-product upgrade prompts should carry the motion.',
        metrics: ['Time-to-Value (TTV)', 'Free-to-Paid Conversion %']
      };
    } else if(score < 55){
      result = {
        label: 'PLG + Sales-Assist Hybrid',
        desc: 'Deal size and buyer seniority justify a light-touch sales layer on top of self-serve. Let users self-onboard, then route qualified accounts to a rep for expansion, not first activation.',
        metrics: ['PQL-to-SQL Conversion %', 'Net Revenue Retention (NRR)']
      };
    } else if(score < 80){
      result = {
        label: 'Product-Led Sales / Enterprise Hybrid',
        desc: 'The deal is big enough and the cycle long enough that a rep needs to run the close, even if product usage sources and qualifies the pipeline.',
        metrics: ['PQL-to-Demo Conversion', 'Sales Cycle Velocity']
      };
    } else {
      result = {
        label: 'Enterprise Sales-Led',
        desc: 'High ACV, a long cycle, and an executive buyer point to a fully sales-led motion, with product usage as supporting evidence in the deal rather than the primary driver of it.',
        metrics: ['Win Rate', 'Sales Cycle Length']
      };
    }

    result.score = clamp(score, 0, 100);
    return result;
  }

  function initGtmEngine(){
    var root = document.getElementById('gtm-engine-root');
    if(!root) return;

    var acvInput = document.getElementById('gtmAcv');
    var acvValueEl = document.getElementById('gtmAcvValue');
    var cycleGroup = document.getElementById('gtmCycleGroup');
    var personaGroup = document.getElementById('gtmPersonaGroup');
    var dialFill = document.getElementById('gtmDialFill');
    var dialNeedle = document.getElementById('gtmDialNeedle');
    var summaryTitle = document.getElementById('gtmSummaryTitle');
    var summaryDesc = document.getElementById('gtmSummaryDesc');
    var metricsWrap = document.getElementById('gtmMetrics');
    var stageNoteEl = document.getElementById('gtmStageNote');
    var exampleEl = document.getElementById('gtmExample');
    if(!acvInput || !cycleGroup || !personaGroup || !dialFill || !dialNeedle) return;

    var state = {
      acv: Number(acvInput.value),
      cycle: cycleGroup.querySelector('.gtm-segment.is-active').getAttribute('data-value'),
      persona: personaGroup.querySelector('.gtm-segment.is-active').getAttribute('data-value')
    };

    function setSegmentGroup(group, value){
      Array.prototype.forEach.call(group.querySelectorAll('.gtm-segment'), function(btn){
        var isActive = btn.getAttribute('data-value') === value;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    function render(){
      var result = decideStrategy(state);

      var offset = DIAL_PATH_LENGTH * (1 - result.score / 100);
      dialFill.style.strokeDasharray = DIAL_PATH_LENGTH;
      dialFill.style.strokeDashoffset = offset;

      var angle = ((result.score - 50) / 50) * 90; // -90..90deg
      dialNeedle.style.transform = 'rotate(' + angle + 'deg)';

      if(summaryTitle) summaryTitle.textContent = result.label;
      if(summaryDesc) summaryDesc.textContent = result.desc;
      if(exampleEl){
        var example = STRATEGY_EXAMPLE[result.label] || '';
        exampleEl.innerHTML = example ? '<strong>Looks like:</strong> ' + example : '';
      }
      if(metricsWrap){
        metricsWrap.innerHTML = '';
        result.metrics.forEach(function(metric){
          var pill = document.createElement('span');
          pill.className = 'gtm-metric-pill';
          pill.textContent = metric;
          metricsWrap.appendChild(pill);
        });
      }
    }

    acvInput.addEventListener('input', function(){
      state.acv = Number(acvInput.value);
      if(acvValueEl) acvValueEl.textContent = formatCurrency(state.acv);
      render();
    });

    cycleGroup.addEventListener('click', function(e){
      var btn = e.target.closest('.gtm-segment');
      if(!btn) return;
      state.cycle = btn.getAttribute('data-value');
      setSegmentGroup(cycleGroup, state.cycle);
      render();
    });

    personaGroup.addEventListener('click', function(e){
      var btn = e.target.closest('.gtm-segment');
      if(!btn) return;
      state.persona = btn.getAttribute('data-value');
      setSegmentGroup(personaGroup, state.persona);
      render();
    });

    function applyStage(stage){
      var defaults = STAGE_DEFAULTS[stage] || STAGE_DEFAULTS['0to1'];
      state.acv = defaults.acv;
      state.cycle = defaults.cycle;
      state.persona = defaults.persona;
      acvInput.value = String(defaults.acv);
      if(acvValueEl) acvValueEl.textContent = formatCurrency(state.acv);
      setSegmentGroup(cycleGroup, state.cycle);
      setSegmentGroup(personaGroup, state.persona);
      if(stageNoteEl) stageNoteEl.textContent = STAGE_NOTES[stage] || '';
      render();
    }

    window.addEventListener('pmlab:stage', function(e){
      applyStage(e.detail.stage);
    });

    applyStage(window.pmLabStage);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initGtmEngine);
  } else {
    initGtmEngine();
  }
})();
