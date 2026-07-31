/* Prioritization & ROI Stress-Tester — dynamic RICE matrix.
   RICE Score = (Reach * Impact * Confidence) / Effort.
   'High Tech Debt Risk' and 'Missing Retention Loop' each apply a
   20% penalty to the raw score (multiplicative, so both together
   is a 36% penalty), surfaced in a Strategic Risk Flag panel that
   explains why the flagged feature ranked lower than its raw score
   would suggest. That penalty is my own addition, not part of RICE.

   Each row can also be stress-tested DRICE-style (Darius Contractor
   & Alexey Komissarouk, "Introducing DRICE"): a Hypothesis, a
   dollarized annual impact estimate, and an engineering-days
   estimate, computed out to a real ROI-per-engineering-week. */
(function(){
  var PENALTY_PER_FLAG = 0.2;
  var WORK_DAYS_PER_WEEK = 5;

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function formatCurrency(n){
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function readRow(row){
    var get = function(field){ return row.querySelector('[data-field="' + field + '"]'); };
    var nameEl = get('name');
    var reach = Number(get('reach').value) || 0;
    var impact = Number(get('impact').value) || 0;
    var confidence = clamp(Number(get('confidence').value) || 0, 0, 100);
    var effort = Math.max(Number(get('effort').value) || 0, 0.01);
    var techDebt = get('techDebt').checked;
    var retentionGap = get('retentionGap').checked;

    var rawScore = (reach * impact * (confidence / 100)) / effort;
    var flagCount = (techDebt ? 1 : 0) + (retentionGap ? 1 : 0);
    var penalizedScore = rawScore * Math.pow(1 - PENALTY_PER_FLAG, flagCount);

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
    var reasons = [];
    if(item.techDebt) reasons.push('High Tech Debt Risk');
    if(item.retentionGap) reasons.push('Missing Retention Loop');
    var penaltyPct = Math.round((1 - Math.pow(1 - PENALTY_PER_FLAG, item.flagCount)) * 100);
    return '<strong>' + item.name + '</strong> ranks lower than its raw RICE score suggests: flagged for ' +
      reasons.join(' and ') + ', a combined &minus;' + penaltyPct + '% penalty (' +
      item.rawScore.toFixed(1) + ' &rarr; ' + item.penalizedScore.toFixed(1) + ').';
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
    var template = document.getElementById('riceRowTemplate');
    var riskPanel = document.getElementById('riceRiskPanel');
    var riskList = document.getElementById('riceRiskList');
    if(!root || !tbody || !template || !riskPanel || !riskList) return;

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

    var mainRows = Array.prototype.slice.call(tbody.querySelectorAll('[data-rice-row]'));
    mainRows.forEach(function(row){
      var driceRow = row.nextElementSibling && row.nextElementSibling.hasAttribute('data-rice-drice')
        ? row.nextElementSibling
        : null;
      wireRow(row, driceRow);
    });

    if(addBtn){
      addBtn.addEventListener('click', function(){
        var fragment = template.content.cloneNode(true);
        var row = fragment.querySelector('[data-rice-row]');
        var driceRow = fragment.querySelector('[data-rice-drice]');
        tbody.appendChild(fragment);
        wireRow(row, driceRow);
        computeAll();
        var nameInput = row.querySelector('[data-field="name"]');
        if(nameInput){ nameInput.focus(); nameInput.select(); }
      });
    }

    computeAll();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPrioritization);
  } else {
    initPrioritization();
  }
})();
