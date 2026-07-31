/* AI Spec & PRD Auditor — turns a raw feature idea into an edge-case
   audit, a metric tree, and Gherkin acceptance criteria. The preset
   features below are curated by hand (this is a demo playground, not
   a live model call); any other typed-in feature falls back to a
   generalized, clearly-labeled template so the tool never breaks.
   Presets swap per the 0→1 / 1→n stage toggle (window.pmLabStage,
   set by pm-lab.js) so the examples actually fit company stage. */
(function(){
  var STAGE_PRESETS = {
    '1ton': {
    'Add 2FA via SMS to login flow': {
      edgeCases: [
        {title: 'SMS delivery failure / carrier rate limits', desc: 'Carriers throttle or drop messages, especially internationally, leaving a user unable to complete login with no visible cause.'},
        {title: 'OTP timeout & replay', desc: 'A code expires mid-entry, or a user (or attacker) resubmits a previously-used code after the window has closed.'},
        {title: 'Lost or changed phone number', desc: 'A user loses access to their enrolled number entirely, with no backup factor and no support-safe recovery path.'},
        {title: 'International number / SMS toll fraud', desc: 'Bad actors trigger repeated OTP sends to premium or foreign numbers to run up carrier costs (SMS pumping).'}
      ],
      metricTree: {
        northStar: 'Successful secure login rate (% of attempts completed safely, without compromise)',
        l1: [
          {label: '2FA enrollment rate', l2: ['Enrollment prompt CTR', 'Enrollment completion time']},
          {label: 'OTP delivery success rate', l2: ['Avg. SMS delivery latency', 'Carrier failure rate by region']},
          {label: 'Account-lockout support tickets', l2: ['% resolved via backup method', 'Time-to-recovery']}
        ]
      },
      gherkin: [
        {title: 'Successful OTP verification', given: 'a user with 2FA enabled attempts to log in', when: 'they enter the correct OTP within the validity window', then: 'they are granted access and a login event is logged'},
        {title: 'Expired OTP', given: 'a user requests an OTP', when: 'they submit the code after it has expired', then: 'the system rejects the code and prompts them to request a new one'},
        {title: 'SMS delivery failure fallback', given: "a user's carrier fails to deliver the OTP within 30 seconds", when: 'the user requests a resend twice', then: 'the system offers an alternate delivery channel (voice call) instead of retrying SMS indefinitely'},
        {title: 'Lost phone recovery', given: 'a user no longer has access to their enrolled phone number', when: 'they attempt account recovery', then: 'they are routed to an identity-verified backup recovery flow, not a silent 2FA bypass'}
      ]
    },
    'Implement Team Member Permissions Grid': {
      edgeCases: [
        {title: 'Last admin lockout', desc: 'Removing or downgrading the only remaining Admin leaves the team with no one able to manage access at all.'},
        {title: 'Permission change mid-session', desc: "A user's access is revoked or downgraded while they already have an active session or open tab."},
        {title: 'Role conflicts on bulk import', desc: 'Bulk-inviting users assigns conflicting, undefined, or default-to-highest-privilege roles without review.'},
        {title: 'Orphaned resources on removal', desc: 'A removed user still owns resources (dashboards, integrations, saved reports) with no reassignment path.'}
      ],
      metricTree: {
        northStar: '% of teams with correctly scoped access (no over- or under-permissioned members)',
        l1: [
          {label: 'Permission grid adoption rate', l2: ['Custom role creation rate', 'Default-role override rate']},
          {label: 'Access-related support tickets', l2: ['% citing incorrect access', '% citing locked-out admins']},
          {label: 'Time-to-provision new member', l2: ['Median invite-to-active time', 'Bulk import success rate']}
        ]
      },
      gherkin: [
        {title: 'Prevent last admin downgrade', given: 'a team has exactly one Admin', when: 'that Admin tries to downgrade their own role', then: 'the system blocks the change and prompts them to assign another Admin first'},
        {title: 'Immediate permission revocation', given: "a user's role is downgraded mid-session", when: 'their next action requires the removed permission', then: 'they are denied access and their session is re-validated against current permissions'},
        {title: 'Bulk import role conflict', given: 'an admin bulk-imports users with an unrecognized role value', when: 'the import runs', then: 'conflicting rows are flagged for manual review instead of silently defaulting to the highest-privilege role'},
        {title: 'Resource reassignment on removal', given: 'a user who owns team resources is removed from the team', when: 'the removal is confirmed', then: "the admin is prompted to reassign ownership of that user's resources before the removal completes"}
      ]
    },
    'Build CSV Export for Analytics Reports': {
      edgeCases: [
        {title: 'Large dataset timeout', desc: 'Exporting a wide date range times out the request or crashes the browser tab before the file finishes generating.'},
        {title: 'CSV formula injection', desc: 'Cell values starting with =, +, -, or @ can execute as formulas when opened in Excel or Sheets.'},
        {title: 'Timezone & locale mismatch', desc: "Exported timestamps and number formats don't match the viewing user's locale, causing silent analysis errors."},
        {title: 'Partial or stale data mid-export', desc: 'Underlying data changes while an async export is still aggregating, producing an internally inconsistent file.'}
      ],
      metricTree: {
        northStar: '% of exports trusted and used downstream (opened or re-imported without correction)',
        l1: [
          {label: 'Export completion rate', l2: ['Timeout rate on large exports', 'Retry rate']},
          {label: 'Export-to-open rate', l2: ['Time from export to first open', 'Re-export rate (proxy for distrust)']},
          {label: 'Support tickets citing export errors', l2: ['% citing wrong numbers', '% citing formatting/locale issues']}
        ]
      },
      gherkin: [
        {title: 'Large export succeeds asynchronously', given: 'a user requests an export covering more than 90 days of data', when: 'the dataset exceeds the synchronous export threshold', then: 'the system queues the export and emails the user when it is ready, instead of timing out the request'},
        {title: 'CSV injection is neutralized', given: 'a report value begins with a formula-triggering character (=, +, -, @)', when: 'the CSV is generated', then: 'that value is escaped so spreadsheet apps render it as text, not an executable formula'},
        {title: "Timestamps match the exporting user's timezone", given: 'a user in a non-UTC timezone exports a report', when: 'the CSV is generated', then: "all timestamps are rendered in the user's account timezone, with the timezone labeled in the column header"},
        {title: 'Export reflects a consistent snapshot', given: 'report data is still aggregating when an export is requested', when: 'the export is generated', then: 'it is built from a single consistent snapshot, not partially-updated data, and the snapshot time is noted in the file'}
      ]
    }
    },
    '0to1': {
      'Add magic-link (passwordless) signup': {
        edgeCases: [
          {title: 'Link expiry mid-click', desc: 'A user clicks an old/expired magic link from a stale email tab and hits a dead end that reads as a broken product, not an expected "request a new link" state.'},
          {title: 'Email delivery failure or spam folder', desc: 'The login-critical email lands in spam or is delayed, with no fallback path to get in.'},
          {title: 'Multiple pending links', desc: 'A user impatiently requests several magic links in a row; clicking an old one needs to fail predictably, not silently do nothing.'},
          {title: 'Shared or public inbox access', desc: 'A magic link sent to a shared team inbox can let anyone with inbox access log in as that user, with no second factor.'}
        ],
        metricTree: {
          northStar: '% of signups that reach first login without contacting support',
          l1: [
            {label: 'Magic-link click-through rate', l2: ['Time from email sent to click', '% of emails opened']},
            {label: 'Link failure rate', l2: ['% expired on click', '% landing in spam']},
            {label: 'Support tickets citing login issues', l2: ['% citing "didn’t get email"', '% citing "link didn’t work"']}
          ]
        },
        gherkin: [
          {title: 'Valid link within window', given: 'a user requests a magic link', when: 'they click it within the validity window', then: 'they are logged in directly, with no password prompt'},
          {title: 'Expired link', given: 'a user clicks a magic link after it has expired', when: 'the system detects the expiry', then: 'it explains the link expired and offers to send a new one immediately'},
          {title: 'Old link after a new one is requested', given: 'a user has requested a second magic link', when: 'they click the first, older link', then: 'it is rejected as superseded, not silently ignored'},
          {title: 'Email non-delivery', given: "a magic-link email hasn't arrived after 60 seconds", when: 'the user requests a resend', then: 'the system offers an alternate way to confirm identity rather than just resending blindly'}
        ]
      },
      'Build a 3-step onboarding checklist': {
        edgeCases: [
          {title: 'Steps completed out of order', desc: 'The checklist assumes step 1→2→3, but a user jumps to step 3 first via a direct link or the browser back button.'},
          {title: 'Checklist state lost on refresh', desc: "Progress isn't persisted server-side, so reloading the page resets what looked \"done.\""},
          {title: 'Step becomes irrelevant mid-flow', desc: "A step ties to a feature the user's plan doesn't include, leaving a checklist item that can never be checked off."},
          {title: 'Team accounts with multiple users', desc: "The checklist assumes one user, but on a team account it's unclear if one teammate's completed step should count for everyone."}
        ],
        metricTree: {
          northStar: '% of new signups that complete all onboarding steps within week 1',
          l1: [
            {label: 'Step 1 completion rate', l2: ['Time to complete step 1', 'Drop-off rate before starting']},
            {label: 'Step 2 completion rate', l2: ['% who skip', '% who complete same session']},
            {label: 'Step 3 completion rate', l2: ['% who complete same session', 'Days to complete after step 2']}
          ]
        },
        gherkin: [
          {title: 'Sequential completion', given: 'a new user starts the checklist', when: 'they complete step 1', then: 'step 2 unlocks and their progress is saved immediately'},
          {title: 'Refresh preserves progress', given: 'a user has completed step 1', when: 'they refresh or return later', then: 'the checklist still shows step 1 as complete'},
          {title: 'Irrelevant step for plan', given: "a user is on a plan that excludes a checklist step's feature", when: 'they view the checklist', then: 'that step is hidden rather than shown as permanently incomplete'},
          {title: 'Team account shared progress', given: 'one teammate completes a checklist step on a team account', when: 'another teammate views the checklist', then: 'they see the same step marked complete, not a separate copy'}
        ]
      },
      'Add a one-click referral invite': {
        edgeCases: [
          {title: 'Referral fraud / self-referral', desc: 'A user refers their own second email address to claim a reward twice.'},
          {title: 'Invited user already has an account', desc: 'The referral link points to a signup flow, but the invitee is already a user under a different account.'},
          {title: 'Reward timing mismatch', desc: 'The referrer expects credit immediately on send, but the reward should only trigger once the invitee actually activates, not just signs up.'},
          {title: 'Revoked or abandoned referral', desc: 'The referrer deletes their account, or the invite goes unused for months; the pending referral state needs a defined expiry, not to sit open forever.'}
        ],
        metricTree: {
          northStar: 'Net new activated users acquired via referral per month',
          l1: [
            {label: 'Referral send rate', l2: ['% of active users who send at least one referral', 'Avg. referrals sent per sender']},
            {label: 'Referral conversion rate', l2: ['% of invitees who sign up', '% of signups who activate']},
            {label: 'Reward redemption rate', l2: ['% of eligible rewards claimed', 'Time from eligibility to claim']}
          ]
        },
        gherkin: [
          {title: 'Successful referral and reward', given: 'a user sends a referral link', when: 'the invitee signs up and reaches the activation milestone', then: "the referrer's reward is granted automatically"},
          {title: 'Self-referral blocked', given: 'a referral link is used to sign up', when: "the new account's email or payment method matches the referrer's existing account", then: 'the referral is flagged and no reward is granted'},
          {title: 'Invitee already has an account', given: 'an invitee clicks a referral link', when: 'they already have an existing account', then: "they're logged into their existing account and the referral is marked invalid, not duplicated"},
          {title: 'Reward before activation', given: 'an invitee has signed up but not yet activated', when: 'the referrer checks their referral status', then: 'it shows "pending," not "rewarded," until activation actually happens'}
        ]
      }
    }
  };

  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function buildGenericAnalysis(featureText){
    var name = featureText.trim() || 'this feature';
    return {
      generic: true,
      edgeCases: [
        {title: 'Abuse & rate-limit exposure', desc: 'Nothing yet bounds how often "' + name + '" can be triggered per user, which usually means bulk or automated abuse until a limit is added.'},
        {title: 'Timeout & partial-failure handling', desc: 'If any step of "' + name + '" depends on a slow or external call, define what the user sees when it times out partway through.'},
        {title: 'Permission & access edge case', desc: 'Confirm what happens when a user loses the access level "' + name + '" assumes they have, mid-flow rather than at entry.'},
        {title: 'Data consistency under concurrent change', desc: 'If the underlying data behind "' + name + '" can change while the feature is in use, define which version of the data the user actually sees.'}
      ],
      metricTree: {
        northStar: 'Successful completion rate of ' + name,
        l1: [
          {label: 'Adoption rate', l2: ['Discovery/entry-point CTR', 'Time-to-first-use']},
          {label: 'Error / failure rate', l2: ['% of attempts that fail', 'Retry rate after failure']},
          {label: 'Related support tickets', l2: ['% citing confusion', '% citing a defect']}
        ]
      },
      gherkin: [
        {title: 'Happy path', given: 'a user is eligible to use ' + name, when: 'they complete the flow with valid input', then: 'the action succeeds and is reflected immediately in the UI'},
        {title: 'Invalid input', given: 'a user attempts to use ' + name + ' with invalid or incomplete input', when: 'they submit', then: 'the system blocks the action with a specific, correctable error message'},
        {title: 'Loss of access mid-flow', given: 'a user starts ' + name + ' with valid access', when: 'their access is revoked before they finish', then: 'the system stops the flow safely rather than completing it on stale permissions'}
      ]
    };
  }

  function getAnalysis(featureText, stage){
    var key = featureText.trim();
    var presets = STAGE_PRESETS[stage] || STAGE_PRESETS['0to1'];
    if(presets[key]) return presets[key];
    return buildGenericAnalysis(featureText);
  }

  function renderEdgeCases(container, edgeCases){
    container.innerHTML = edgeCases.map(function(item, i){
      return '<div class="prd-edge-card">' +
        '<div class="prd-edge-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div><h5 class="prd-edge-title">' + escapeHtml(item.title) + '</h5>' +
        '<p class="prd-edge-desc">' + escapeHtml(item.desc) + '</p></div>' +
        '</div>';
    }).join('');
  }

  function renderMetricTree(container, tree){
    var l1Html = tree.l1.map(function(l1){
      var l2Html = l1.l2.map(function(l2){
        return '<div class="prd-tree-node-l2">' + escapeHtml(l2) + '</div>';
      }).join('');
      return '<div class="prd-tree-branch">' +
        '<div class="prd-tree-tick"></div>' +
        '<div class="prd-tree-node-l1">' + escapeHtml(l1.label) + '</div>' +
        '<div class="prd-tree-l2-list">' + l2Html + '</div>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<span class="prd-tree-kicker">North Star Metric</span>' +
      '<div class="prd-tree-node-north">' + escapeHtml(tree.northStar) + '</div>' +
      '<div class="prd-tree-connector" aria-hidden="true"></div>' +
      '<div class="prd-tree-l1-row">' + l1Html + '</div>';
  }

  function renderGherkin(container, scenarios){
    container.innerHTML = scenarios.map(function(s){
      return '<div class="prd-gherkin-card">' +
        '<div class="prd-gherkin-title">Scenario: ' + escapeHtml(s.title) + '</div>' +
        '<div class="prd-gherkin-line"><span class="prd-kw">GIVEN</span>' + escapeHtml(s.given) + '</div>' +
        '<div class="prd-gherkin-line"><span class="prd-kw">WHEN</span>' + escapeHtml(s.when) + '</div>' +
        '<div class="prd-gherkin-line"><span class="prd-kw">THEN</span>' + escapeHtml(s.then) + '</div>' +
        '</div>';
    }).join('');
  }

  function initPrdAnalyzer(){
    var root = document.getElementById('prd-analyzer-root');
    var input = document.getElementById('prdInput');
    var analyzeBtn = document.getElementById('prdAnalyzeBtn');
    var presetsWrap = document.getElementById('prdPresets');
    var emptyState = document.getElementById('prdEmptyState');
    var result = document.getElementById('prdResult');
    var resultFeature = document.getElementById('prdResultFeature');
    var edgeList = document.getElementById('prdEdgeList');
    var metricTree = document.getElementById('prdMetricTree');
    var gherkinList = document.getElementById('prdGherkinList');
    var tabs = result ? Array.prototype.slice.call(result.querySelectorAll('.prd-tab')) : [];
    var panels = result ? Array.prototype.slice.call(result.querySelectorAll('.prd-result-panel')) : [];
    if(!root || !input || !analyzeBtn || !presetsWrap || !result) return;

    var currentStage = window.pmLabStage;

    function syncPresetHighlight(){
      var value = input.value.trim();
      Array.prototype.forEach.call(presetsWrap.querySelectorAll('.prd-preset-btn'), function(btn){
        btn.classList.toggle('is-active', btn.getAttribute('data-preset') === value);
      });
    }

    function renderPresetButtons(stage){
      var presets = STAGE_PRESETS[stage] || STAGE_PRESETS['0to1'];
      var names = Object.keys(presets);
      presetsWrap.innerHTML = names.map(function(name){
        return '<button type="button" class="gtm-segment prd-preset-btn" data-preset="' + name.replace(/"/g, '&quot;') + '">' + name + '</button>';
      }).join('');
      input.value = names[0] || '';
      syncPresetHighlight();
      if(emptyState) emptyState.hidden = false;
      result.hidden = true;
    }

    function activateTab(panelId){
      tabs.forEach(function(tab){
        var isActive = tab.getAttribute('aria-controls') === panelId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach(function(panel){
        panel.classList.toggle('is-active', panel.id === panelId);
      });
    }

    function runAnalysis(){
      var featureText = input.value.trim();
      if(!featureText) return;

      var analysis = getAnalysis(featureText, currentStage);
      if(resultFeature) resultFeature.textContent = '“' + featureText + '”' + (analysis.generic ? ' (generalized template)' : '');
      renderEdgeCases(edgeList, analysis.edgeCases);
      renderMetricTree(metricTree, analysis.metricTree);
      renderGherkin(gherkinList, analysis.gherkin);

      if(emptyState) emptyState.hidden = true;
      result.hidden = false;
      activateTab('prd-panel-edge');
    }

    presetsWrap.addEventListener('click', function(e){
      var btn = e.target.closest('.prd-preset-btn');
      if(!btn) return;
      input.value = btn.getAttribute('data-preset');
      syncPresetHighlight();
      input.focus();
    });

    input.addEventListener('input', syncPresetHighlight);
    analyzeBtn.addEventListener('click', runAnalysis);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        runAnalysis();
      }
    });

    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        activateTab(tab.getAttribute('aria-controls'));
      });
    });

    window.addEventListener('pmlab:stage', function(e){
      currentStage = e.detail.stage;
      renderPresetButtons(currentStage);
    });

    renderPresetButtons(currentStage);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPrdAnalyzer);
  } else {
    initPrdAnalyzer();
  }
})();
