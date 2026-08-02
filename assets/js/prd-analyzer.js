/* AI Spec & PRD Auditor. This is a demo playground with no LLM behind
   it, so there's no free-text input implying it can analyze anything
   you type. Instead you pick from two clearly-labeled groups:
   1) "Curated examples": a small set of features with hand-written,
      specific analysis, exact to that feature.
   2) "General patterns": broader domain patterns (payments, uploads,
      notifications, search, bulk actions, real-time/collab, comments,
      integrations) with hand-written analysis accurate for the domain
      and written at that general level.
   Both are labeled in the UI and in the result header so it's always
   clear which kind of content is showing. Curated examples swap per
   the 0→1 / 1→n stage toggle (window.pmLabStage, set by pm-lab.js) so
   they actually fit company stage; general patterns stay constant. */
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
        {title: 'SMS delivery failure fallback', given: "a user's carrier fails to deliver the OTP within 30 seconds", when: 'the user requests a resend twice', then: 'the system offers an alternate delivery channel (voice call) after the second failed attempt'},
        {title: 'Lost phone recovery', given: 'a user no longer has access to their enrolled phone number', when: 'they attempt account recovery', then: 'they are routed to an identity-verified backup recovery flow that still requires proof of identity'}
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
        {title: 'Bulk import role conflict', given: 'an admin bulk-imports users with an unrecognized role value', when: 'the import runs', then: 'conflicting rows are flagged for manual review before any role is assigned'},
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
        {title: 'Large export succeeds asynchronously', given: 'a user requests an export covering more than 90 days of data', when: 'the dataset exceeds the synchronous export threshold', then: 'the system queues the export and emails the user when it is ready'},
        {title: 'CSV injection is neutralized', given: 'a report value begins with a formula-triggering character (=, +, -, @)', when: 'the CSV is generated', then: 'that value is escaped so spreadsheet apps render it as plain text'},
        {title: "Timestamps match the exporting user's timezone", given: 'a user in a non-UTC timezone exports a report', when: 'the CSV is generated', then: "all timestamps are rendered in the user's account timezone, with the timezone labeled in the column header"},
        {title: 'Export reflects a consistent snapshot', given: 'report data is still aggregating when an export is requested', when: 'the export is generated', then: 'it is built from a single consistent snapshot, with the snapshot time noted in the file'}
      ]
    },
    'Add usage-based billing tiers': {
      edgeCases: [
        {title: 'Mid-cycle tier changes', desc: "A customer crosses a usage threshold mid-billing-cycle, and it's unclear whether they're billed at the new tier immediately, retroactively, or at the next cycle."},
        {title: 'Usage metering drift', desc: 'The usage counter used for billing and the usage a customer sees in their dashboard disagree, undermining trust in the bill.'},
        {title: 'Overage surprise', desc: 'A customer has no visibility into approaching a usage threshold until the bill arrives showing a large overage charge.'},
        {title: 'Proration on downgrade', desc: 'A customer downgrades mid-cycle, and the proration logic for the difference is undefined.'}
      ],
      metricTree: {
        northStar: '% of bills that match customer-visible usage with no disputed charges',
        l1: [
          {label: 'Usage visibility', l2: ['% of customers who view usage dashboard before bill', 'Threshold-warning open rate']},
          {label: 'Billing dispute rate', l2: ['% of bills disputed', 'Avg. time to resolve a dispute']},
          {label: 'Tier conversion rate', l2: ['% of customers who upgrade after a threshold warning', 'Involuntary downgrade rate']}
        ]
      },
      gherkin: [
        {title: 'Threshold warning before overage', given: 'a customer approaches a usage tier threshold', when: 'they cross 80% of their current tier', then: 'they receive a warning with enough time to upgrade before incurring overage charges'},
        {title: 'Usage dashboard matches billed usage', given: 'a customer views their usage dashboard', when: 'the billing cycle closes', then: 'the number on their invoice matches what the dashboard showed them throughout the cycle'},
        {title: 'Mid-cycle tier change is prorated', given: 'a customer upgrades tiers mid-cycle', when: 'the change takes effect', then: 'they are billed a prorated amount for the remainder of the cycle at the new tier'},
        {title: 'Downgrade takes effect at cycle end', given: 'a customer requests a downgrade', when: 'they are mid-cycle', then: 'the downgrade takes effect at the next billing cycle, and they are informed of the effective date'}
      ]
    },
    'Build an admin audit log': {
      edgeCases: [
        {title: 'Log tampering', desc: 'An admin with access to the audit log can delete or alter entries covering their own actions.'},
        {title: 'Volume at scale', desc: 'A busy team generates thousands of loggable events per day, and the log view has no filtering or search, making it hard to use in practice.'},
        {title: 'Sensitive data in log entries', desc: "Log entries capture full field values on a change, including data that shouldn't be broadly visible even to other admins, such as a password reset token."},
        {title: 'Retention undefined', desc: 'Nothing specifies how long audit log entries are kept, so storage grows unbounded, or entries needed for a compliance review have already been purged.'}
      ],
      metricTree: {
        northStar: '% of admin actions with a complete, tamper-evident audit trail',
        l1: [
          {label: 'Log coverage', l2: ['% of admin action types instrumented', 'Events logged per day']},
          {label: 'Log usability', l2: ['Search/filter usage rate', 'Time to find a specific event during an investigation']},
          {label: 'Compliance readiness', l2: ['% of retention policy checks passed', 'Time to produce an audit export on request']}
        ]
      },
      gherkin: [
        {title: 'Audit entries are immutable', given: 'an admin action is logged', when: 'any user, including admins, attempts to edit or delete that entry', then: 'the system blocks the change, and the attempt itself is logged'},
        {title: 'Sensitive fields are redacted', given: 'a logged action includes a sensitive field, such as a password reset token', when: 'the log entry is created', then: 'that field is redacted or masked in the stored entry'},
        {title: 'Log entries are searchable', given: 'an admin needs to investigate a specific change', when: 'they search the audit log by user, action type, or date range', then: 'matching entries are returned promptly'},
        {title: 'Retention policy enforced', given: 'a log entry reaches the defined retention period', when: 'the retention job runs', then: 'the entry is archived or deleted according to the documented policy, and that action is itself logged'}
      ]
    },
    'Add multi-region data residency': {
      edgeCases: [
        {title: 'Cross-region data leakage', desc: "A feature such as search indexing, analytics, or backups unintentionally replicates a customer's data outside their chosen region."},
        {title: 'Region migration for existing customers', desc: 'A customer who signed up before regional choice existed has no defined path to move their data into a specific region now.'},
        {title: 'Latency for cross-region teams', desc: "A team with members across two regions gets degraded performance for whichever members sit outside the team's assigned data region."},
        {title: 'Regional outage isolation', desc: "An outage in one region needs to stay contained to that region's customers, without degrading service for customers hosted elsewhere."}
      ],
      metricTree: {
        northStar: '% of customer data provably stored and processed only within their selected region',
        l1: [
          {label: 'Region assignment coverage', l2: ['% of customers with an explicit region set', '% of data flows audited for region compliance']},
          {label: 'Cross-region latency', l2: ['p95 latency for out-of-region team members', 'Support tickets citing regional performance']},
          {label: 'Regional incident isolation', l2: ['% of incidents contained to a single region', 'Cross-region blast-radius incidents per quarter']}
        ]
      },
      gherkin: [
        {title: 'New customer selects a data region', given: 'a new customer signs up', when: 'they complete onboarding', then: 'they select a data region, and all their data is provisioned within that region'},
        {title: 'Existing customer can migrate region', given: 'a customer signed up before regional choice existed', when: 'they request a specific region', then: 'a defined migration process moves their data into that region with a documented timeline'},
        {title: 'Regional outage contained', given: 'one region experiences an infrastructure outage', when: 'the outage occurs', then: 'customers in other regions continue operating without disruption'},
        {title: 'Auxiliary data flows respect region', given: 'a feature like search indexing or analytics processes customer data', when: 'that data flow runs', then: "it stays within the customer's selected region, using an in-region processing pipeline"}
      ]
    }
    },
    '0to1': {
      'Add magic-link (passwordless) signup': {
        edgeCases: [
          {title: 'Link expiry mid-click', desc: "A user clicks an old or expired magic link from a stale email tab. The dead end they hit needs to clearly explain the link expired and offer a way to request a new one."},
          {title: 'Email delivery failure or spam folder', desc: 'The login-critical email lands in spam or is delayed, with no fallback path to get in.'},
          {title: 'Multiple pending links', desc: "A user requests several magic links in a row. Clicking an old one needs to fail with a clear, predictable message explaining it's no longer valid."},
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
          {title: 'Old link after a new one is requested', given: 'a user has requested a second magic link', when: 'they click the first, older link', then: 'it is rejected as superseded, with a message explaining a newer link was requested'},
          {title: 'Email non-delivery', given: "a magic-link email hasn't arrived after 60 seconds", when: 'the user requests a resend', then: 'the system offers an alternate way to confirm identity, such as a fallback delivery channel'}
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
          {title: 'Irrelevant step for plan', given: "a user is on a plan that excludes a checklist step's feature", when: 'they view the checklist', then: 'that step is hidden from their checklist'},
          {title: 'Team account shared progress', given: 'one teammate completes a checklist step on a team account', when: 'another teammate views the checklist', then: 'they see that same step marked complete'}
        ]
      },
      'Add a one-click referral invite': {
        edgeCases: [
          {title: 'Referral fraud / self-referral', desc: 'A user refers their own second email address to claim a reward twice.'},
          {title: 'Invited user already has an account', desc: 'The referral link points to a signup flow, but the invitee is already a user under a different account.'},
          {title: 'Reward timing mismatch', desc: 'The referrer expects credit immediately on send, but the reward should only trigger once the invitee actually activates.'},
          {title: 'Revoked or abandoned referral', desc: 'The referrer deletes their account, or the invite goes unused for months; the pending referral state needs a defined expiry.'}
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
          {title: 'Invitee already has an account', given: 'an invitee clicks a referral link', when: 'they already have an existing account', then: "they're logged into their existing account and the referral is marked invalid"},
          {title: 'Reward before activation', given: 'an invitee has signed up but not yet activated', when: 'the referrer checks their referral status', then: 'it shows "pending" until activation actually happens'}
        ]
      },
      'Add a waitlist with referral-based queue jumping': {
        edgeCases: [
          {title: 'Gaming the referral count', desc: 'A user creates fake accounts or asks strangers to click a referral link without ever converting, inflating their queue position for no real signal.'},
          {title: 'Queue position confusion', desc: "A user's position moves up and down as others join or refer, and without a visible explanation for the change, this can look like a bug."},
          {title: 'Founder/team bypass expectations', desc: "Early hand-picked users, such as friends, advisors, or press, need a way into the product ahead of the public queue without undermining the queue's credibility for everyone else."},
          {title: 'Waitlist abandonment', desc: 'Most signups never convert once finally invited, because the invite arrives long after the initial interest has faded.'}
        ],
        metricTree: {
          northStar: '% of waitlist signups that activate within 7 days of being invited',
          l1: [
            {label: 'Waitlist signup rate', l2: ['Landing page conversion to waitlist', 'Referral link share rate']},
            {label: 'Queue movement / referral effectiveness', l2: ['Avg. positions gained per referral', '% of signups who refer at least one person']},
            {label: 'Invite-to-activation rate', l2: ['Time from invite to first login', '% who never activate after invite']}
          ]
        },
        gherkin: [
          {title: 'Referral moves queue position', given: 'a waitlisted user refers a new signup', when: 'the referral completes', then: 'the referring user moves up a defined number of positions and can see the new count'},
          {title: 'Fake referral does not count', given: 'a referral link is used to sign up', when: 'the new signup never verifies their email', then: 'the referral does not count toward queue movement'},
          {title: 'Hand-picked early access', given: 'the team wants to admit a specific user ahead of the public queue', when: 'that user is manually granted access', then: 'they are invited immediately, and the public queue continues moving independently'},
          {title: 'Stale invite expires', given: 'a user is invited off the waitlist', when: 'they do not activate within a defined window', then: 'their invite expires and their spot opens for the next person in line'}
        ]
      },
      'Build a single-tenant pilot for your first paying customer': {
        edgeCases: [
          {title: 'Diverging codebase', desc: "Custom requests for the pilot customer get built directly into their environment, and nothing tracks which changes need to fold back into the main product."},
          {title: 'No clear pilot exit criteria', desc: 'The pilot runs indefinitely because success criteria for converting to a standard paid plan were never defined upfront.'},
          {title: 'Support load concentration', desc: "One pilot customer's direct access to the founding team sets a response-time expectation that becomes unsustainable as the customer base grows."},
          {title: 'Data migration at pilot end', desc: "Moving the pilot customer from their custom single-tenant setup to the standard multi-tenant product has no defined migration path."}
        ],
        metricTree: {
          northStar: '% of pilots that convert to a standard paid contract by the agreed decision date',
          l1: [
            {label: 'Pilot engagement', l2: ['Weekly active usage by pilot customer', 'Number of custom requests raised']},
            {label: 'Custom-to-core feature ratio', l2: ['% of pilot requests folded into the core product', '% left as one-off customizations']},
            {label: 'Time to conversion decision', l2: ['Days from pilot start to go/no-go call', '% of pilots reaching a decision on schedule']}
          ]
        },
        gherkin: [
          {title: 'Pilot exit criteria defined upfront', given: 'a pilot agreement is signed with a new customer', when: 'the pilot begins', then: 'the specific criteria for converting to a paid contract are documented and shared with the customer before any custom work starts'},
          {title: 'Custom request triaged', given: 'the pilot customer requests a feature specific to their workflow', when: 'the request is reviewed', then: 'it is explicitly marked as either a core-product candidate or a one-off customization'},
          {title: 'Pilot end triggers migration plan', given: 'a pilot reaches its decision date and converts to a paid contract', when: 'the conversion is confirmed', then: 'a defined migration plan moves the customer off any single-tenant customizations and onto the standard product'},
          {title: 'Pilot support boundaries set', given: 'the pilot customer has direct access to the founding team', when: 'the pilot begins', then: 'response-time expectations are set explicitly so they can be sustained as the customer base grows'}
        ]
      },
      'Add an in-app feedback widget for beta users': {
        edgeCases: [
          {title: 'Feedback goes unread', desc: 'Feedback submissions pile up in a queue nobody reviews, and beta users who submitted feedback never hear back or see it acted on.'},
          {title: 'Widget interrupts core flow', desc: 'The feedback prompt appears mid-task and blocks the action the user was trying to complete.'},
          {title: 'No context captured', desc: 'Feedback text arrives with no attached context, such as which page, action, or state, so triaging it requires guessing what the user was doing.'},
          {title: 'Feedback fatigue', desc: 'The same beta users get prompted for feedback repeatedly across sessions until they start ignoring or dismissing it by reflex.'}
        ],
        metricTree: {
          northStar: '% of submitted feedback items that get a visible response or product change within 2 weeks',
          l1: [
            {label: 'Feedback submission rate', l2: ['% of beta users who submit at least one item', 'Avg. submissions per active beta user']},
            {label: 'Feedback triage time', l2: ['Time from submission to first internal review', '% submissions reviewed within 48 hours']},
            {label: 'Feedback prompt fatigue', l2: ['Dismiss rate on the prompt', '% of users who mute after first dismissal']}
          ]
        },
        gherkin: [
          {title: 'Feedback captures context automatically', given: 'a beta user opens the feedback widget', when: 'they submit feedback', then: 'the current page and relevant state are attached automatically, without the user typing it manually'},
          {title: 'Widget does not block the current task', given: 'a user is mid-task when they open the feedback widget', when: 'they submit or dismiss it', then: 'they return to exactly where they left off in their task'},
          {title: 'Repeat prompting respects dismissal', given: 'a user dismisses the feedback prompt', when: 'they encounter it again in a later session', then: 'the prompt appears less frequently, based on a defined cooldown'},
          {title: 'Submitter sees their feedback acknowledged', given: 'a user submits feedback that leads to a product change', when: 'the change ships', then: 'the submitter is notified that their feedback was acted on'}
        ]
      }
    }
  };

  // General-pattern library: broader domain guidance shown under the
  // "General patterns" group, distinct from the exact, curated examples
  // above. Selected directly by name, not matched against typed text.
  var GENERAL_PATTERNS = [
    {
      name: 'Payments & Billing',
      edgeCases: [
        {title: 'Failed or declined payment mid-flow', desc: "A card is declined after the user believes they've completed checkout, leaving an ambiguous state between \"trying to pay\" and \"paid.\""},
        {title: 'Double charge on retry', desc: 'A user retries after a slow response, unaware the first charge already went through, risking a duplicate charge.'},
        {title: 'Currency / locale mismatch', desc: 'Price is calculated in one currency but displayed or charged in another for international users.'},
        {title: 'Refund/chargeback reconciliation', desc: 'A refund or chargeback needs to reverse downstream state as well, including access, usage, and invoices.'}
      ],
      metricTree: {
        northStar: '% of checkout attempts that complete successfully without a support ticket',
        l1: [
          {label: 'Checkout completion rate', l2: ['Card decline rate', 'Time to complete checkout']},
          {label: 'Payment-related support tickets', l2: ['% citing double charge', '% citing failed payment']},
          {label: 'Refund/chargeback rate', l2: ['Time to resolve refund', '% resulting in churn']}
        ]
      },
      gherkin: [
        {title: 'Declined card', given: 'a user submits a payment', when: 'the card is declined', then: 'they see a specific reason and can retry with a different method without losing their cart'},
        {title: 'Prevented double charge', given: 'a user has already submitted a successful payment', when: 'they resubmit the same checkout (e.g. double-click, refresh)', then: 'the system detects the duplicate and blocks a second charge'},
        {title: 'Refund reverses access', given: 'a payment is refunded', when: 'the refund is processed', then: 'any access or entitlement granted by that payment is revoked accordingly'}
      ]
    },
    {
      name: 'File Upload & Import',
      edgeCases: [
        {title: 'Oversized or malformed file', desc: 'A file exceeds the size limit or is corrupted mid-upload, and the failure needs to surface a clear reason to the user.'},
        {title: 'Unsupported file type', desc: "A user uploads a file type the system doesn't handle, and should be told which types are supported before attempting the upload."},
        {title: 'Interrupted upload', desc: 'A network drop or tab close mid-upload leaves a partial file; the system needs to detect the partial file and discard it.'},
        {title: 'Malicious file content', desc: 'An uploaded file could contain malware or a script payload disguised as an accepted type, so validation can\'t rely on file extension alone.'}
      ],
      metricTree: {
        northStar: '% of upload attempts that complete successfully on the first try',
        l1: [
          {label: 'Upload success rate', l2: ['Failure rate by file size', 'Failure rate by file type']},
          {label: 'Time to complete upload', l2: ['Avg. upload duration', 'Retry rate']},
          {label: 'Upload-related support tickets', l2: ['% citing unsupported file type', '% citing stuck/failed upload']}
        ]
      },
      gherkin: [
        {title: 'Oversized file rejected early', given: 'a user selects a file over the size limit', when: 'they attempt to upload it', then: 'the system rejects it before starting the upload and states the limit'},
        {title: 'Interrupted upload is discarded', given: "a user's upload is interrupted by a network drop", when: 'the connection resumes', then: 'the partial file is discarded and the user is prompted to retry'},
        {title: 'Unsupported type blocked', given: 'a user selects a file type the system does not support', when: 'they attempt to upload it', then: 'they are told which types are supported before the upload starts'}
      ]
    },
    {
      name: 'Notifications & Email',
      edgeCases: [
        {title: 'Notification fatigue / no granular control', desc: 'Every event sends a notification with no way to mute or batch, so users end up disabling notifications entirely to get relief.'},
        {title: 'Delivery failure goes unnoticed', desc: "An email or push notification fails to send and nothing surfaces that failure, so the product silently stops informing the user."},
        {title: 'Stale or duplicate notification', desc: 'An action is undone or changed after the notification is queued, so the user receives a notification about a state that no longer exists.'},
        {title: 'Timezone-insensitive timing', desc: 'A digest or reminder is sent at a fixed UTC time, landing at 3am for users in other timezones.'}
      ],
      metricTree: {
        northStar: '% of notifications that lead to the intended user action',
        l1: [
          {label: 'Notification delivery rate', l2: ['Failure rate by channel', 'Delivery latency']},
          {label: 'Notification engagement rate', l2: ['Open/click-through rate', 'Time from send to action']},
          {label: 'Unsubscribe / mute rate', l2: ['% muting after first week', '% disabling all notifications']}
        ]
      },
      gherkin: [
        {title: 'Muting reduces volume for that type only', given: 'a user finds a notification type unhelpful', when: 'they mute that type', then: 'they stop receiving that type while continuing to receive others'},
        {title: 'Stale notification suppressed', given: 'an action a notification refers to is undone before the notification sends', when: 'the send job runs', then: 'the notification is skipped, since the state it would describe no longer exists'},
        {title: 'Delivery failure is visible', given: 'a notification fails to send', when: 'the failure is detected', then: 'it is logged and retried according to a defined policy'}
      ]
    },
    {
      name: 'Search',
      edgeCases: [
        {title: 'Empty or zero-result queries', desc: "A query returns nothing, and the user is left without guidance on whether that's correct or a typo/filter issue."},
        {title: 'Stale index', desc: 'The underlying data changes but the search index lags, so users see outdated or since-deleted results.'},
        {title: 'Performance at scale', desc: 'Search response time degrades as the dataset or query complexity grows, with no defined latency budget.'},
        {title: 'Special characters / query injection', desc: "Search input isn't sanitized, allowing special characters to break the query or inject into a backing query language."}
      ],
      metricTree: {
        northStar: '% of searches that result in the user clicking a result',
        l1: [
          {label: 'Zero-result rate', l2: ['% of queries with no results', 'Refinement rate after zero results']},
          {label: 'Search latency', l2: ['p50/p95 response time', 'Timeout rate']},
          {label: 'Result click-through rate', l2: ['Avg. result position clicked', 'Re-search rate (proxy for bad relevance)']}
        ]
      },
      gherkin: [
        {title: 'Zero results shown clearly', given: 'a user searches for a term with no matches', when: 'the search runs', then: 'they see a clear zero-results state with a suggestion to adjust the query'},
        {title: 'Search input is sanitized', given: 'a user enters special characters in the search box', when: 'the query runs', then: 'the input is safely escaped and does not break or manipulate the underlying query'},
        {title: 'Recently changed data reflected', given: 'an item matching a saved search is deleted', when: 'the user re-runs the search', then: "the deleted item no longer appears, even if the index hasn't fully caught up elsewhere"}
      ]
    },
    {
      name: 'Bulk Actions',
      edgeCases: [
        {title: 'Partial failure mid-batch', desc: 'Some items in a bulk action succeed and others fail, and the user needs to know exactly which ones and why.'},
        {title: 'No undo for an irreversible bulk action', desc: 'A bulk delete or bulk status change is applied instantly with no confirmation step or undo window.'},
        {title: 'Performance/timeout on large selections', desc: "Selecting \"all\" on a large dataset queues an operation too big to complete synchronously."},
        {title: 'Permission mismatch within a selection', desc: "A bulk action is applied to a selection that includes items the user doesn't actually have permission to modify."}
      ],
      metricTree: {
        northStar: '% of bulk actions that complete fully successfully on the first attempt',
        l1: [
          {label: 'Bulk action completion rate', l2: ['% partially failed', '% fully failed']},
          {label: 'Undo usage rate', l2: ['% of bulk actions undone', 'Time to undo after action']},
          {label: 'Bulk-action support tickets', l2: ['% citing unexpected changes', '% citing permission errors']}
        ]
      },
      gherkin: [
        {title: 'Partial failure reported clearly', given: 'a user runs a bulk action on 50 items', when: '10 fail and 40 succeed', then: 'they see exactly which 10 failed and why'},
        {title: 'Destructive bulk action requires confirmation', given: 'a user selects a bulk delete on multiple items', when: 'they submit it', then: 'they must confirm the count and action before it executes, with a short undo window after'},
        {title: 'Permission-scoped bulk action', given: 'a user selects items for a bulk action, some of which they lack permission to modify', when: 'they submit it', then: 'the action applies only to items they have permission for, with the rest flagged'}
      ]
    },
    {
      name: 'Real-Time & Collaboration',
      edgeCases: [
        {title: 'Conflicting simultaneous edits', desc: 'Two users edit the same record at the same time, and the system needs a defined resolution, such as last-write-wins, a merge, or a lock.'},
        {title: 'Stale client state', desc: "A user's view goes out of sync after a dropped connection, showing outdated data as if it were current."},
        {title: 'Presence/awareness inaccuracy', desc: "The \"who's online/editing\" indicator lags or shows a user as present after they've actually left."},
        {title: 'Reconnection storms', desc: 'Many clients reconnecting at once after an outage overwhelm the real-time infrastructure.'}
      ],
      metricTree: {
        northStar: '% of concurrent edit sessions that resolve without a reported conflict or data loss',
        l1: [
          {label: 'Conflict rate', l2: ['% of sessions with simultaneous edits', '% of conflicts auto-resolved vs. manual']},
          {label: 'Sync latency', l2: ['Time from edit to visible for other users', 'Reconnection time after drop']},
          {label: 'Data-loss reports', l2: ['% citing lost edits', '% citing stale view']}
        ]
      },
      gherkin: [
        {title: 'Conflicting edits resolved predictably', given: 'two users edit the same field at the same time', when: 'both changes are submitted', then: 'the system applies a defined resolution rule, and both users can see what happened'},
        {title: 'Reconnection refreshes state', given: "a user's connection drops and reconnects", when: 'they reconnect', then: 'their view is refreshed to the current state before they can make further edits'},
        {title: 'Presence reflects actual activity', given: 'a user closes the tab without an explicit logout', when: 'their connection times out', then: 'they are shown as offline within a defined grace period'}
      ]
    },
    {
      name: 'Comments & Social',
      edgeCases: [
        {title: 'Abusive or spam content', desc: 'Nothing moderates or rate-limits comment content, opening the door to spam, harassment, or abuse with no reporting path.'},
        {title: 'Deleted parent content', desc: 'A comment is left dangling when the item, thread, or user it belongs to is deleted.'},
        {title: 'Notification storms on active threads', desc: 'A popular thread with many replies triggers a notification per reply to every participant, overwhelming them.'},
        {title: 'Edit/delete after others have reacted', desc: "A comment is edited or deleted after other users have already liked, replied to, or quoted it, and downstream context breaks."}
      ],
      metricTree: {
        northStar: '% of comment threads with meaningful engagement and no reported abuse',
        l1: [
          {label: 'Comment/reply rate', l2: ['Comments per active thread', 'Reply rate to existing comments']},
          {label: 'Moderation actions', l2: ['% flagged by users', '% auto-flagged by filters']},
          {label: 'Notification opt-out rate', l2: ['% muting active threads', '% disabling comment notifications']}
        ]
      },
      gherkin: [
        {title: 'Reported content is actionable', given: 'a user reports a comment as abusive', when: 'the report is submitted', then: 'it is queued for moderation review and the reporting user gets a confirmation message'},
        {title: 'Orphaned comments handled', given: 'the item a comment thread is attached to is deleted', when: 'the deletion completes', then: 'the comment thread is deleted or archived accordingly'},
        {title: 'Reply notifications are batched', given: 'a thread receives many replies in a short window', when: 'a participant would otherwise get one notification per reply', then: 'they receive a single batched notification instead'}
      ]
    },
    {
      name: 'Integrations, API & Webhooks',
      edgeCases: [
        {title: 'Third-party outage or rate limit', desc: 'A connected external service goes down or rate-limits requests, and the integration needs a defined degraded-mode behavior.'},
        {title: 'Auth token expiry', desc: 'An OAuth token or API key expires mid-use, silently breaking the integration until a user notices and reconnects.'},
        {title: 'Webhook delivery failure/retry', desc: 'An outbound webhook fails to reach the receiving endpoint, and needs a retry/backoff policy.'},
        {title: 'Schema drift on the external side', desc: "The third-party API changes its response shape without notice, breaking the integration's parsing logic."}
      ],
      metricTree: {
        northStar: '% of integration syncs that complete successfully without manual reconnection',
        l1: [
          {label: 'Sync success rate', l2: ['Failure rate by external service', 'Time to detect a failed sync']},
          {label: 'Auth/token health', l2: ['% of tokens expired without reconnect', 'Time to reconnect after expiry']},
          {label: 'Webhook delivery rate', l2: ['% delivered on first attempt', '% resolved via retry']}
        ]
      },
      gherkin: [
        {title: 'Expired token prompts reconnection', given: "a connected integration's auth token expires", when: 'the next sync attempt runs', then: 'the user is notified and prompted to reconnect'},
        {title: 'Webhook retried on failure', given: 'an outbound webhook delivery fails', when: 'the receiving endpoint is unreachable', then: 'the system retries with backoff up to a defined limit before marking it failed'},
        {title: 'External outage degrades gracefully', given: 'a connected third-party service is down', when: 'a sync is attempted during the outage', then: 'the integration reports a clear degraded state for that connection alone'}
      ]
    }
  ];

  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    var presetsWrap = document.getElementById('prdPresets');
    var emptyState = document.getElementById('prdEmptyState');
    var result = document.getElementById('prdResult');
    var resultFeature = document.getElementById('prdResultFeature');
    var edgeList = document.getElementById('prdEdgeList');
    var metricTree = document.getElementById('prdMetricTree');
    var gherkinList = document.getElementById('prdGherkinList');
    var tabs = result ? Array.prototype.slice.call(result.querySelectorAll('.prd-tab')) : [];
    var panels = result ? Array.prototype.slice.call(result.querySelectorAll('.prd-result-panel')) : [];
    if(!root || !presetsWrap || !result) return;

    var currentStage = window.pmLabStage;
    var currentTopics = [];

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

    function renderTopic(topic){
      var suffix = topic.source === 'pattern' ? ' (general pattern)' : '';
      if(resultFeature) resultFeature.textContent = '“' + topic.name + '”' + suffix;
      renderEdgeCases(edgeList, topic.edgeCases);
      renderMetricTree(metricTree, topic.metricTree);
      renderGherkin(gherkinList, topic.gherkin);

      if(emptyState) emptyState.hidden = true;
      result.hidden = false;
      activateTab('prd-panel-edge');
    }

    function buildTopicButtons(topics, groupClass){
      return topics.map(function(topic, i){
        var globalIndex = currentTopics.indexOf(topic);
        return '<button type="button" class="gtm-segment prd-preset-btn ' + groupClass + '" data-topic-idx="' + globalIndex + '">' + escapeHtml(topic.name) + '</button>';
      }).join('');
    }

    function renderPresetButtons(stage){
      var presets = STAGE_PRESETS[stage] || STAGE_PRESETS['0to1'];
      var curated = Object.keys(presets).map(function(name){
        var data = presets[name];
        return {name: name, source: 'preset', edgeCases: data.edgeCases, metricTree: data.metricTree, gherkin: data.gherkin};
      });
      var patterns = GENERAL_PATTERNS.map(function(p){
        return {name: p.name, source: 'pattern', edgeCases: p.edgeCases, metricTree: p.metricTree, gherkin: p.gherkin};
      });

      currentTopics = curated.concat(patterns);

      presetsWrap.innerHTML =
        '<div class="prd-picker-group">' +
          '<div class="prd-picker-label">Curated examples <span class="prd-picker-sub">Exact analysis for this specific feature</span></div>' +
          '<div class="prd-picker-row">' + buildTopicButtons(curated, 'prd-preset-btn-curated') + '</div>' +
        '</div>' +
        '<div class="prd-picker-group">' +
          '<div class="prd-picker-label">General patterns <span class="prd-picker-sub">Domain-level guidance that applies broadly across features like this</span></div>' +
          '<div class="prd-picker-row">' + buildTopicButtons(patterns, 'prd-preset-btn-pattern') + '</div>' +
        '</div>';

      if(emptyState) emptyState.hidden = false;
      result.hidden = true;
    }

    presetsWrap.addEventListener('click', function(e){
      var btn = e.target.closest('.prd-preset-btn');
      if(!btn) return;
      var idx = Number(btn.getAttribute('data-topic-idx'));
      var topic = currentTopics[idx];
      if(!topic) return;

      Array.prototype.forEach.call(presetsWrap.querySelectorAll('.prd-preset-btn'), function(b){
        b.classList.toggle('is-active', b === btn);
      });
      renderTopic(topic);
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
