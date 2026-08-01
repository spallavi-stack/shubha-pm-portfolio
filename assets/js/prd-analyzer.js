/* AI Spec & PRD Auditor — turns a raw feature idea into an edge-case
   audit, a metric tree, and Gherkin acceptance criteria. This is a demo
   playground, not a live model call — there's no LLM behind it. Instead:
   1) the preset features below are curated by hand, exact-matched;
   2) anything else is keyword-matched against a library of common
      feature domains (payments, uploads, notifications, search, bulk
      actions, real-time/collab, comments, integrations) so a typed-in
      idea like "add file upload" gets upload-specific content, not a
      generic filler;
   3) if nothing matches, it falls back to a fully generic template.
   Each path is labeled in the UI so it's clear which one produced the
   result. Presets swap per the 0→1 / 1→n stage toggle (window.pmLabStage,
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

  // Keyword-matched fallback library. Not exact-preset content, but not
  // the fully generic template either — matched by counting keyword hits
  // in the typed feature text against each category below.
  var KEYWORD_CATEGORIES = [
    {
      name: 'Payments & Billing',
      keywords: ['payment', 'pay', 'billing', 'checkout', 'invoice', 'subscription', 'credit card', 'price', 'pricing', 'refund', 'charge'],
      edgeCases: [
        {title: 'Failed or declined payment mid-flow', desc: "A card is declined after the user believes they've completed checkout, leaving an ambiguous state between \"trying to pay\" and \"paid.\""},
        {title: 'Double charge on retry', desc: 'A user retries after a slow response, unaware the first charge already went through, risking a duplicate charge.'},
        {title: 'Currency / locale mismatch', desc: 'Price is calculated in one currency but displayed or charged in another for international users.'},
        {title: 'Refund/chargeback reconciliation', desc: 'A refund or chargeback needs to reverse downstream state (access, usage, invoices), not just the payment record.'}
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
      keywords: ['upload', 'import', 'attach', 'file', 'photo', 'image', 'document'],
      edgeCases: [
        {title: 'Oversized or malformed file', desc: 'A file exceeds the size limit or is corrupted mid-upload, and the failure needs a clear reason, not a silent hang.'},
        {title: 'Unsupported file type', desc: "A user uploads a file type the system doesn't handle, and needs to be told before wasting an upload attempt, not after."},
        {title: 'Interrupted upload', desc: 'A network drop or tab close mid-upload leaves a partial file; the system needs to detect and discard it rather than treat it as complete.'},
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
        {title: 'Interrupted upload is discarded', given: "a user's upload is interrupted by a network drop", when: 'the connection resumes', then: 'the partial file is discarded and the user is prompted to retry, not left with a corrupt file'},
        {title: 'Unsupported type blocked', given: 'a user selects a file type the system does not support', when: 'they attempt to upload it', then: 'they are told which types are supported before the upload starts'}
      ]
    },
    {
      name: 'Notifications & Email',
      keywords: ['notification', 'notify', 'email', 'alert', 'reminder', 'push', 'sms', 'digest'],
      edgeCases: [
        {title: 'Notification fatigue / no granular control', desc: 'Every event sends a notification with no way to mute or batch, so users disable notifications entirely rather than tune them.'},
        {title: 'Delivery failure goes unnoticed', desc: "An email or push notification fails to send and nothing surfaces that failure, so the product silently stops informing the user."},
        {title: 'Stale or duplicate notification', desc: 'An action is undone or changed after the notification is queued, so the user receives a notification about a state that no longer exists.'},
        {title: 'Timezone-insensitive timing', desc: 'A digest or reminder is sent at a fixed UTC time, landing at 3am for users in other timezones.'}
      ],
      metricTree: {
        northStar: '% of notifications that lead to the intended user action, not an unsubscribe',
        l1: [
          {label: 'Notification delivery rate', l2: ['Failure rate by channel', 'Delivery latency']},
          {label: 'Notification engagement rate', l2: ['Open/click-through rate', 'Time from send to action']},
          {label: 'Unsubscribe / mute rate', l2: ['% muting after first week', '% disabling all notifications']}
        ]
      },
      gherkin: [
        {title: 'Muting reduces volume, not everything', given: 'a user finds a notification type unhelpful', when: 'they mute that type', then: 'they stop receiving it while still receiving other types, not all notifications'},
        {title: 'Stale notification suppressed', given: 'an action a notification refers to is undone before the notification sends', when: 'the send job runs', then: 'the notification is skipped rather than sent about a state that no longer exists'},
        {title: 'Delivery failure is visible', given: 'a notification fails to send', when: 'the failure is detected', then: 'it is logged and retried according to a defined policy, not silently dropped'}
      ]
    },
    {
      name: 'Search',
      keywords: ['search', 'filter', 'query', 'find'],
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
        {title: 'Zero results shown clearly', given: 'a user searches for a term with no matches', when: 'the search runs', then: 'they see a clear zero-results state with a suggestion to adjust the query, not a blank screen'},
        {title: 'Search input is sanitized', given: 'a user enters special characters in the search box', when: 'the query runs', then: 'the input is safely escaped and does not break or manipulate the underlying query'},
        {title: 'Recently changed data reflected', given: 'an item matching a saved search is deleted', when: 'the user re-runs the search', then: "the deleted item no longer appears, even if the index hasn't fully caught up elsewhere"}
      ]
    },
    {
      name: 'Bulk Actions',
      keywords: ['bulk', 'batch', 'mass', 'multiple', 'select all'],
      edgeCases: [
        {title: 'Partial failure mid-batch', desc: 'Some items in a bulk action succeed and others fail, and the user needs to know exactly which, not just an aggregate error.'},
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
        {title: 'Partial failure reported clearly', given: 'a user runs a bulk action on 50 items', when: '10 fail and 40 succeed', then: 'they see exactly which 10 failed and why, not just a generic partial-success message'},
        {title: 'Destructive bulk action requires confirmation', given: 'a user selects a bulk delete on multiple items', when: 'they submit it', then: 'they must confirm the count and action before it executes, with a short undo window after'},
        {title: 'Permission-scoped bulk action', given: 'a user selects items for a bulk action, some of which they lack permission to modify', when: 'they submit it', then: 'the action applies only to items they have permission for, with the rest flagged'}
      ]
    },
    {
      name: 'Real-Time & Collaboration',
      keywords: ['real-time', 'realtime', 'collaborate', 'collaboration', 'live', 'multiplayer', 'co-edit', 'presence'],
      edgeCases: [
        {title: 'Conflicting simultaneous edits', desc: 'Two users edit the same record at the same time, and the system needs a defined resolution (last-write-wins, merge, lock), not silent data loss.'},
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
        {title: 'Conflicting edits resolved predictably', given: 'two users edit the same field at the same time', when: 'both changes are submitted', then: 'the system applies a defined resolution rule and both users can see what happened, not a silent overwrite'},
        {title: 'Reconnection refreshes state', given: "a user's connection drops and reconnects", when: 'they reconnect', then: 'their view is refreshed to the current state before they can make further edits'},
        {title: 'Presence reflects actual activity', given: 'a user closes the tab without an explicit logout', when: 'their connection times out', then: 'they are shown as offline within a defined grace period, not indefinitely as present'}
      ]
    },
    {
      name: 'Comments & Social',
      keywords: ['comment', 'reply', 'mention', 'like', 'react', 'post', 'feed'],
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
        {title: 'Reported content is actionable', given: 'a user reports a comment as abusive', when: 'the report is submitted', then: 'it is queued for moderation review and the reporting user gets confirmation, not silence'},
        {title: 'Orphaned comments handled', given: 'the item a comment thread is attached to is deleted', when: 'the deletion completes', then: 'the comment thread is deleted or archived accordingly, not left pointing at nothing'},
        {title: 'Reply notifications are batched', given: 'a thread receives many replies in a short window', when: 'a participant would otherwise get one notification per reply', then: 'they receive a single batched notification instead'}
      ]
    },
    {
      name: 'Integrations, API & Webhooks',
      keywords: ['integration', 'api', 'webhook', 'connect', 'sync', 'third-party', 'oauth'],
      edgeCases: [
        {title: 'Third-party outage or rate limit', desc: 'A connected external service goes down or rate-limits requests, and the integration needs a defined degraded-mode behavior, not a hard failure.'},
        {title: 'Auth token expiry', desc: 'An OAuth token or API key expires mid-use, silently breaking the integration until a user notices and reconnects.'},
        {title: 'Webhook delivery failure/retry', desc: 'An outbound webhook fails to reach the receiving endpoint, and needs a retry/backoff policy instead of a single silent attempt.'},
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
        {title: 'Expired token prompts reconnection', given: "a connected integration's auth token expires", when: 'the next sync attempt runs', then: 'the user is notified and prompted to reconnect, rather than syncs failing silently'},
        {title: 'Webhook retried on failure', given: 'an outbound webhook delivery fails', when: 'the receiving endpoint is unreachable', then: 'the system retries with backoff up to a defined limit before marking it failed'},
        {title: 'External outage degrades gracefully', given: 'a connected third-party service is down', when: 'a sync is attempted during the outage', then: 'the integration reports a clear degraded state instead of erroring the whole feature'}
      ]
    }
  ];

  function matchKeywordCategory(featureText){
    var lower = featureText.toLowerCase();
    var best = null;
    var bestHits = 0;
    KEYWORD_CATEGORIES.forEach(function(category){
      var hits = category.keywords.filter(function(kw){ return lower.indexOf(kw) !== -1; }).length;
      if(hits > bestHits){
        bestHits = hits;
        best = category;
      }
    });
    return best;
  }

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

    var category = matchKeywordCategory(featureText);
    if(category){
      return {
        edgeCases: category.edgeCases,
        metricTree: category.metricTree,
        gherkin: category.gherkin,
        matchedCategory: category.name
      };
    }

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
      var suffix = analysis.generic ? ' (generalized template)' : (analysis.matchedCategory ? ' (matched: ' + analysis.matchedCategory + ' pattern)' : '');
      if(resultFeature) resultFeature.textContent = '“' + featureText + '”' + suffix;
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
