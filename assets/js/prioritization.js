/* Prioritization & ROI Stress-Tester: dynamic RICE matrix.
   RICE Score = (Reach * Impact * Confidence) / Effort.
   'High Tech Debt Risk' and 'Missing Retention Loop' each let the user
   pick a severity (none/mild/moderate/severe) that applies a
   multiplicative penalty to the raw score, surfaced in a Strategic
   Risk Flag panel explaining why a flagged feature ranked lower than
   its raw score would suggest. The tier values themselves (10/20/35%)
   are my own judgment call, not a measured benchmark, same as the
   flat 20% this replaced. Letting the user pick the severity, rather
   than a fixed deduction, is the actual improvement; the qualitative
   reasoning for why "missing retention loop" is a real risk (not just
   a made-up flag) comes from Jessica Lachs (VP Analytics, DoorDash on
   Lenny's podcast): retention can't be driven directly in the short
   term, so a missing retention loop is a proxy for risk you can't
   measure yet, not something you can price precisely.

   Each row can also be stress-tested DRICE-style (Darius Contractor
   & Alexey Komissarouk, "Introducing DRICE"): a Hypothesis, a
   dollarized annual impact estimate, and an engineering-days
   estimate, computed out to a real ROI-per-engineering-week.

   Sample rows swap per the 0→1 / 1→n stage toggle (window.pmLabStage,
   set by pm-lab.js): same tool, different example features so the
   sample data actually fits the selected company stage. */
(function(){
  var SEVERITY_LEVELS = ['none', 'mild', 'moderate', 'severe'];
  var SEVERITY_PENALTY = { none: 0, mild: 0.1, moderate: 0.2, severe: 0.35 };
  var WORK_DAYS_PER_WEEK = 5;

  var BLANK_ROW = {
    name: 'New feature', reach: 500, impact: 1, confidence: 50, effort: 1,
    techDebt: 'none', retentionGap: 'none',
    hypothesis: '', dollarImpact: 0, engDays: 5
  };

  var STAGE_ROWS = {
    '0to1': [
      {
        name: 'Simplify onboarding to 3 steps', reach: 300, impact: 2, confidence: 70, effort: 0.5,
        techDebt: 'none', retentionGap: 'none',
        hypothesis: 'If onboarding drops from 8 steps to 3, we believe activation roughly doubles, because most signups currently drop off before reaching first value.',
        dollarImpact: 0, engDays: 3
      },
      {
        name: 'Manual concierge onboarding for first 20 users', reach: 20, impact: 3, confidence: 90, effort: 0.25,
        techDebt: 'none', retentionGap: 'none',
        hypothesis: "If we personally onboard our first 20 users by call, we believe we'll learn the real activation blocker faster than any amount of analytics.",
        dollarImpact: 0, engDays: 1
      },
      {
        name: 'Launch a paid annual plan', reach: 300, impact: 2, confidence: 50, effort: 1.5,
        techDebt: 'none', retentionGap: 'moderate',
        hypothesis: 'If we charge for an annual plan now, we believe a portion of active users will pay, but we have no evidence yet that they stick around long enough to renew.',
        dollarImpact: 0, engDays: 5
      }
    ],
    '1ton': [
      {
        name: 'Self-Service Team Invite Flow', reach: 1200, impact: 2, confidence: 80, effort: 1.5,
        techDebt: 'none', retentionGap: 'none',
        hypothesis: 'If self-serve invites remove the need for IT to add teammates manually, we believe more teams activate within their first week.',
        dollarImpact: 180000, engDays: 7
      },
      {
        name: 'Custom Enterprise SSO', reach: 150, impact: 3, confidence: 90, effort: 3,
        techDebt: 'moderate', retentionGap: 'none',
        hypothesis: 'If we replace per-seat SSO setup calls with a self-serve SAML config, we believe the security-review blocker disappears for mid-market deals.',
        dollarImpact: 90000, engDays: 15
      },
      {
        name: 'AI Automated Summary Widget', reach: 2000, impact: 1, confidence: 50, effort: 1,
        techDebt: 'none', retentionGap: 'severe',
        hypothesis: 'If summaries save reviewers time, we believe weekly active usage rises, but without a reason to return, usage may fade after the novelty wears off.',
        dollarImpact: 60000, engDays: 4
      }
    ]
  };

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function formatCurrency(n){
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function escapeAttr(str){
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function severityOptionsHTML(selected){
    return SEVERITY_LEVELS.map(function(level){
      var label = level.charAt(0).toUpperCase() + level.slice(1);
      return '<option value="' + level + '"' + (level === selected ? ' selected' : '') + '>' + label + '</option>';
    }).join('');
  }

  function buildRowHTML(data){
    return (
      '<tr class="rice-row" data-rice-row>' +
        '<td><input type="text" class="rice-input rice-input-name" data-field="name" value="' + escapeAttr(data.name) + '" placeholder="Feature name"></td>' +
        '<td><input type="number" class="rice-input rice-input-num" data-field="reach" value="' + data.reach + '" min="0" step="10"></td>' +
        '<td><input type="number" class="rice-input rice-input-num" data-field="impact" value="' + data.impact + '" min="0.25" max="3" step="0.25"></td>' +
        '<td><input type="number" class="rice-input rice-input-num" data-field="confidence" value="' + data.confidence + '" min="0" max="100" step="5"></td>' +
        '<td><input type="number" class="rice-input rice-input-num" data-field="effort" value="' + data.effort + '" min="0.1" step="0.1"></td>' +
        '<td class="rice-td-select"><select class="rice-input rice-select" data-field="techDebt">' + severityOptionsHTML(data.techDebt) + '</select></td>' +
        '<td class="rice-td-select"><select class="rice-input rice-select" data-field="retentionGap">' + severityOptionsHTML(data.retentionGap) + '</select></td>' +
        '<td class="rice-td-score"><span class="rice-score-value" data-rice-score>0</span><span class="rice-rank-badge" data-rice-rank></span><button type="button" class="rice-drice-toggle" data-drice-toggle>Stress-test (DRICE) &#9656;</button></td>' +
        '<td class="rice-td-remove"><button type="button" class="rice-remove-btn" aria-label="Remove this feature row">&times;</button></td>' +
      '</tr>' +
      '<tr class="rice-drice-row" data-rice-drice hidden>' +
        '<td colspan="9">' +
          '<div class="rice-drice-panel">' +
            '<div class="rice-drice-field rice-drice-field-wide">' +
              '<label>Hypothesis<button type="button" class="rice-info" data-tooltip="Your best guess at cause and effect: if we build X, we believe Y will happen, because Z. Keeps the estimate honest about what&rsquo;s assumed vs. known." aria-label="What is Hypothesis?">i</button></label>' +
              '<input type="text" class="rice-drice-input" data-drice-field="hypothesis" placeholder="If we build X, we believe Y will happen because Z" value="' + escapeAttr(data.hypothesis) + '">' +
            '</div>' +
            '<div class="rice-drice-field">' +
              '<label>$ Impact estimate (annual)</label>' +
              '<input type="number" class="rice-drice-input" data-drice-field="dollarImpact" min="0" step="1000" value="' + data.dollarImpact + '">' +
            '</div>' +
            '<div class="rice-drice-field">' +
              '<label>Engineering estimate (days)<button type="button" class="rice-info" data-tooltip="How many actual engineering days you think this will take to build." aria-label="What is engineering estimate?">i</button></label>' +
              '<input type="number" class="rice-drice-input" data-drice-field="engDays" min="0.5" step="0.5" value="' + data.engDays + '">' +
            '</div>' +
            '<div class="rice-drice-result">' +
              '<span class="rice-drice-result-label">ROI<button type="button" class="rice-info" data-tooltip="The payoff per week of engineering time: $ Impact Estimate &divide; (Engineering Estimate &divide; 5 workdays). Higher means more value for the same effort." aria-label="What is ROI?">i</button></span>' +
              '<span class="rice-drice-result-value" data-drice-roi>&mdash;</span>' +
            '</div>' +
          '</div>' +
        '</td>' +
      '</tr>'
    );
  }

  function readRow(row){
    var get = function(field){ return row.querySelector('[data-field="' + field + '"]'); };
    var nameEl = get('name');
    var reach = Number(get('reach').value) || 0;
    var impact = Number(get('impact').value) || 0;
    var confidence = clamp(Number(get('confidence').value) || 0, 0, 100);
    var effort = Math.max(Number(get('effort').value) || 0, 0.01);
    var techDebt = get('techDebt').value;
    var retentionGap = get('retentionGap').value;

    var rawScore = (reach * impact * (confidence / 100)) / effort;
    var techDebtPenalty = SEVERITY_PENALTY[techDebt] || 0;
    var retentionPenalty = SEVERITY_PENALTY[retentionGap] || 0;
    var flagCount = (techDebt !== 'none' ? 1 : 0) + (retentionGap !== 'none' ? 1 : 0);
    var penalizedScore = rawScore * (1 - techDebtPenalty) * (1 - retentionPenalty);

    return {
      row: row,
      name: (nameEl.value || 'Untitled feature').trim(),
      rawScore: rawScore,
      penalizedScore: penalizedScore,
      techDebt: techDebt,
      retentionGap: retentionGap,
      flagCount: flagCount
    };
  }

  function buildRiskMessage(item){
    var combinedPenalty = 1 - (1 - SEVERITY_PENALTY[item.techDebt]) * (1 - SEVERITY_PENALTY[item.retentionGap]);
    var penaltyPct = Math.round(combinedPenalty * 100);
    var penaltyLabel = (item.flagCount > 1 ? 'a combined &minus;' : 'a &minus;') + penaltyPct + '% penalty';
    return '<strong>' + item.name + '</strong> ranks lower than its raw RICE score suggests: ' +
      penaltyLabel + ' (' + item.rawScore.toFixed(1) + ' &rarr; ' + item.penalizedScore.toFixed(1) + ').';
  }

  function computeDriceRoi(driceRow){
    var get = function(field){ return driceRow.querySelector('[data-drice-field="' + field + '"]'); };
    var dollarImpact = Number(get('dollarImpact').value) || 0;
    var engDays = Math.max(Number(get('engDays').value) || 0, 0.5);
    var engWeeks = engDays / WORK_DAYS_PER_WEEK;
    var roiEl = driceRow.querySelector('[data-drice-roi]');
    if(roiEl){
      roiEl.textContent = engWeeks > 0
        ? formatCurrency(dollarImpact / engWeeks) + '/eng-week'
        : '—';
    }
  }

  function initPrioritization(){
    var root = document.getElementById('prioritization-root');
    var tbody = document.getElementById('riceTableBody');
    var addBtn = document.getElementById('riceAddRow');
    var riskPanel = document.getElementById('riceRiskPanel');
    var riskList = document.getElementById('riceRiskList');
    if(!root || !tbody || !riskPanel || !riskList) return;

    window.pmLabInitInfoTooltips(root);

    function computeAll(){
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('[data-rice-row]'));
      var items = rows.map(readRow);

      var ranked = items.slice().sort(function(a, b){ return b.penalizedScore - a.penalizedScore; });
      var rankByRow = new Map();
      ranked.forEach(function(item, i){ rankByRow.set(item.row, i + 1); });

      items.forEach(function(item){
        var scoreEl = item.row.querySelector('[data-rice-score]');
        var rankEl = item.row.querySelector('[data-rice-rank]');
        if(scoreEl) scoreEl.textContent = item.penalizedScore.toFixed(1);
        if(rankEl){
          var rank = rankByRow.get(item.row);
          rankEl.textContent = '#' + rank;
          rankEl.setAttribute('data-rank', String(rank));
        }
      });

      var flagged = items.filter(function(item){ return item.flagCount > 0; })
        .sort(function(a, b){ return b.flagCount - a.flagCount; });

      if(flagged.length){
        riskList.innerHTML = flagged.map(function(item){
          return '<li>' + buildRiskMessage(item) + '</li>';
        }).join('');
        riskPanel.hidden = false;
      } else {
        riskList.innerHTML = '';
        riskPanel.hidden = true;
      }
    }

    function wireDriceRow(driceRow){
      computeDriceRoi(driceRow);
      driceRow.addEventListener('input', function(){ computeDriceRoi(driceRow); });
    }

    function wireRow(row, driceRow){
      row.addEventListener('input', computeAll);
      row.addEventListener('change', computeAll);

      var removeBtn = row.querySelector('.rice-remove-btn');
      if(removeBtn){
        removeBtn.addEventListener('click', function(){
          row.remove();
          if(driceRow) driceRow.remove();
          computeAll();
        });
      }

      var driceToggle = row.querySelector('[data-drice-toggle]');
      if(driceToggle && driceRow){
        driceToggle.addEventListener('click', function(){
          var isOpen = driceRow.hidden;
          driceRow.hidden = !isOpen;
          driceToggle.classList.toggle('is-open', isOpen);
          driceToggle.innerHTML = isOpen ? 'Stress-test (DRICE) &#9662;' : 'Stress-test (DRICE) &#9656;';
        });
      }

      if(driceRow) wireDriceRow(driceRow);
    }

    function wireAllRows(){
      var mainRows = Array.prototype.slice.call(tbody.querySelectorAll('[data-rice-row]'));
      mainRows.forEach(function(row){
        var driceRow = row.nextElementSibling && row.nextElementSibling.hasAttribute('data-rice-drice')
          ? row.nextElementSibling
          : null;
        wireRow(row, driceRow);
      });
    }

    function renderStage(stage){
      var rows = STAGE_ROWS[stage] || STAGE_ROWS['0to1'];
      tbody.innerHTML = rows.map(buildRowHTML).join('');
      wireAllRows();
      computeAll();
    }

    if(addBtn){
      addBtn.addEventListener('click', function(){
        var container = document.createElement('tbody');
        container.innerHTML = buildRowHTML(BLANK_ROW);
        var row = container.querySelector('[data-rice-row]');
        var driceRow = container.querySelector('[data-rice-drice]');
        tbody.appendChild(row);
        tbody.appendChild(driceRow);
        wireRow(row, driceRow);
        computeAll();
        var nameInput = row.querySelector('[data-field="name"]');
        if(nameInput){ nameInput.focus(); nameInput.select(); }
      });
    }

    window.addEventListener('pmlab:stage', function(e){
      renderStage(e.detail.stage);
    });

    renderStage(window.pmLabStage);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPrioritization);
  } else {
    initPrioritization();
  }
})();
