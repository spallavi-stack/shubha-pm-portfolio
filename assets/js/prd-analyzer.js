/* Spec Deep-Dives. A gallery of worked examples, not a live analyzer:
   there's no LLM behind it, and picking a feature only displays a
   hand-written breakdown of that exact feature (edge cases, a metric
   tree, Gherkin acceptance criteria), not an analysis of anything
   typed in. Each feature name has a small "i" info button next to it
   (window.pmLabInitInfoTooltips, shared with the RICE table) giving a
   one-line plain-language description of what the feature actually
   is, since some of these (e.g. a trial-expiration flow) aren't
   self-explanatory from the name alone. The feature set swaps per the
   0→1 / 1→n stage toggle (window.pmLabStage, set by pm-lab.js) so the
   examples fit company stage. */
(function(){
  var STAGE_PRESETS = {
    '1ton': {
    'Add 2FA via SMS to login flow': {
      info: 'A second login step where a one-time code is texted to your phone, in addition to your password.',
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
      info: 'A settings screen where an admin assigns each team member specific access levels.',
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
      info: 'A button that lets a user download their report data as a spreadsheet file, to analyze or share outside the product.',
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
      info: 'Pricing that charges customers based on how much they actually use, moving them up a tier automatically as usage crosses a threshold.',
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
      info: 'A record of every action an admin takes (who changed what, and when), kept for accountability and investigation.',
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
      info: 'Letting a customer choose which geographic region their data is stored and processed in, usually for legal or compliance reasons.',
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
    },
    'Add enterprise SSO/SAML login': {
      info: "Letting a company's employees use their own company identity system, like Okta or Azure AD, to log in. Almost always required before a large enterprise signs.",
      edgeCases: [
        {title: 'Deprovisioning isn\'t a delete', desc: 'Most identity providers deactivate a user by updating their status. Logic built only around a delete request never fires, leaving departed employees with access.'},
        {title: 'Domain ownership disputes', desc: 'A company claims a domain for SSO that another existing customer already uses email addresses under, creating an access conflict.'},
        {title: 'JIT-provisioned user before assignment', desc: "A new employee logs in via SSO before IT has assigned them a role, and the product needs a defined default so they're neither blocked entirely nor over-granted access."},
        {title: 'Retry-triggered duplicates', desc: 'The identity provider retries a provisioning request after a slow response, and a non-idempotent handler creates two records for the same user.'}
      ],
      metricTree: {
        northStar: "% of SSO-connected accounts with access that exactly matches their identity provider's current roster",
        l1: [
          {label: 'Provisioning accuracy', l2: ['% of new SSO logins correctly assigned a default role', 'Time from IT role assignment to access reflected']},
          {label: 'Deprovisioning speed', l2: ['Time from employee deactivation at the IdP to access revoked', '% of deprovisioning events handled without manual intervention']},
          {label: 'Connection reliability', l2: ['% of provisioning requests processed without duplication', 'Domain-conflict incidents per quarter']}
        ]
      },
      gherkin: [
        {title: 'Deactivation is treated as removal', given: 'an identity provider deactivates a user without deleting their record', when: 'the deactivation event is received', then: "the system revokes that user's access exactly as it would for a deletion"},
        {title: 'Domain conflict is caught before activation', given: 'a company attempts to claim a domain for SSO', when: 'that domain is already associated with another account', then: 'the claim is blocked and flagged for manual review before SSO is enabled'},
        {title: 'JIT-provisioned user gets a safe default', given: 'a new employee logs in via SSO before any role is explicitly assigned', when: 'their first login completes', then: 'they receive a defined minimum-access default role: neither full access nor a blocked login'},
        {title: 'Retried provisioning request is idempotent', given: 'an identity provider retries a provisioning request after a timeout', when: 'the retry is received', then: 'it updates the existing user record and does not create a duplicate'}
      ]
    },
    'Add rate limiting to a public API': {
      info: "Capping how many requests a customer's integration can make in a given time window, so one heavy user can't degrade the product for everyone else.",
      edgeCases: [
        {title: 'Legitimate burst traffic gets blocked', desc: "A customer's normal batch job triggers the limit even though it isn't abuse, with no way to request a higher allowance."},
        {title: 'Retry storms after a 429', desc: 'A client retries immediately after being rate-limited, and without a defined backoff signal, that retry itself gets rate-limited again in a loop.'},
        {title: 'Limit differs silently by endpoint', desc: "One endpoint has a stricter limit than another with no documentation, so a customer's integration fails unpredictably depending on which endpoint they call."},
        {title: 'Concurrent limit vs. rate limit confusion', desc: "A customer is blocked by a concurrency cap but the error message implies they've exceeded their per-second rate, sending them to fix the wrong thing."}
      ],
      metricTree: {
        northStar: '% of API requests from good-faith integrations that succeed without a rate-limit error',
        l1: [
          {label: 'Rate-limit accuracy', l2: ['% of 429s from actual abuse vs. legitimate burst traffic', 'Support tickets requesting a higher limit']},
          {label: 'Client retry behavior', l2: ['% of clients using proper exponential backoff', 'Repeat-429 rate within 60 seconds of a prior 429']},
          {label: 'Limit transparency', l2: ['% of endpoints with a documented limit', 'Time to diagnose a rate-limit-related integration failure']}
        ]
      },
      gherkin: [
        {title: '429 includes a clear reason and retry time', given: 'a client exceeds its rate limit', when: 'the request is rejected', then: 'the response includes which limit was hit and how long to wait before retrying'},
        {title: 'Legitimate high-volume customer can request a higher limit', given: "a customer's integration consistently needs more throughput than the default limit", when: 'they request an increase', then: 'there is a defined process to raise their specific limit without changing it for everyone else'},
        {title: 'Concurrency limit is distinguished from rate limit', given: 'a client is blocked for having too many simultaneous requests in flight', when: 'the request is rejected', then: 'the error names the limit type explicitly as concurrency, distinguishing it from a per-second rate limit'}
      ]
    },
    'Add soft-delete with a restore window': {
      info: 'Instead of permanently deleting something the instant a user clicks delete, moving it to a recoverable trash for a set period, like Gmail or Google Drive.',
      edgeCases: [
        {title: 'Restore window expectations mismatch', desc: 'A user assumes delete is instant and permanent, or assumes trash is permanent storage and never checks it before the window closes.'},
        {title: 'Bulk delete fills trash silently', desc: 'A large bulk delete moves thousands of items to trash at once, and nothing tells the user how much space or how many items that now represents.'},
        {title: 'Restoring breaks a dependent reference', desc: 'An item is restored after something else was created assuming it was gone, such as a new item reusing its name or slot, creating a conflict.'},
        {title: 'Permanent-delete override', desc: "A user wants an item actually deleted immediately, for legal or privacy reasons, so a real \"empty trash now\" action needs to exist alongside the retention wait."}
      ],
      metricTree: {
        northStar: '% of accidental deletions successfully recovered within the restore window',
        l1: [
          {label: 'Restore usage', l2: ['% of deleted items restored before expiry', 'Time from delete to restore']},
          {label: 'Trash awareness', l2: ['% of users who have viewed their trash at least once', 'Support tickets asking "how do I get this back?"']},
          {label: 'Permanent-deletion accuracy', l2: ['% of trash correctly auto-purged at window end', '% of manual "delete forever" requests honored immediately']}
        ]
      },
      gherkin: [
        {title: 'Deleted item is recoverable within the window', given: 'a user deletes an item', when: 'they view trash within the defined restore window', then: 'the item is there and can be restored to its original location'},
        {title: 'Trash auto-empties after the window', given: 'an item has been in trash past the defined retention period', when: 'the retention job runs', then: 'the item is permanently deleted and no longer restorable'},
        {title: 'Immediate permanent deletion is available', given: 'a user needs an item permanently deleted right away', when: 'they choose "delete forever"', then: 'it is removed immediately, bypassing the restore window'},
        {title: 'Restoring a conflicting item is flagged', given: 'a restored item conflicts with something created after it was deleted', when: 'the restore completes', then: 'the conflict is surfaced to the user, and neither item is silently overwritten'}
      ]
    },
    'Sunset a legacy feature or API version': {
      info: 'Retiring an old feature or API version that customers still depend on: giving notice, a migration path, and a hard cutoff date.',
      edgeCases: [
        {title: 'Silent breakage at cutoff', desc: 'Customers who never migrated hit a hard failure the moment the old version is retired, with no warning visible to them specifically.'},
        {title: 'No usage visibility', desc: "The team doesn't actually know which customers are still on the legacy version, so notice goes out broadly, without being targeted to those affected."},
        {title: 'Migration path incomplete', desc: "The new version doesn't yet support every capability of the old one, so some customers have no way to fully migrate even if they want to."},
        {title: 'Repeated deadline extensions erode urgency', desc: 'The cutoff date gets pushed back more than once, so customers learn to ignore the deadline entirely.'}
      ],
      metricTree: {
        northStar: '% of active users of the legacy version successfully migrated before the hard cutoff',
        l1: [
          {label: 'Migration progress', l2: ['% of legacy usage migrated to the new version, tracked weekly', 'Days remaining vs. % still unmigrated']},
          {label: 'Notice effectiveness', l2: ['% of still-active legacy users who acknowledge the deprecation notice', 'Time from first notice to first migration action']},
          {label: 'Cutoff integrity', l2: ['% of cutoff dates honored without extension', 'Support tickets from users broken by the cutoff']}
        ]
      },
      gherkin: [
        {title: 'Deprecation notice reaches active users specifically', given: 'a legacy version is being sunset', when: 'the deprecation is announced', then: 'every customer still actively using it is notified directly, beyond a general changelog post'},
        {title: 'Response headers signal the coming cutoff', given: 'a client calls a deprecated API version', when: 'the response is returned', then: 'it includes the deprecation date and the hard sunset date in the response headers'},
        {title: 'Cutoff is enforced as communicated', given: 'the announced sunset date arrives', when: 'a request is made to the retired version', then: 'it is rejected with a clear message pointing to the migration guide, matching the date that was communicated'},
        {title: 'Migration gap is identified before sunset', given: 'a capability in the legacy version has no equivalent in the new version', when: 'the migration plan is reviewed', then: 'that gap is closed or explicitly addressed before the cutoff date is finalized'}
      ]
    },
    "Handle account deletion and GDPR's right to be forgotten": {
      info: 'Honoring a legal right to have personal data permanently deleted, including copies sitting in backups, analytics tools, and other connected systems.',
      edgeCases: [
        {title: 'Data survives in backups', desc: "A user's data is deleted from the live database but still exists in older backups for months, technically still processed data under the law."},
        {title: 'Data replicated to third-party tools', desc: 'Personal data was synced to an analytics tool, a support-ticket system, or an email platform, and deleting it in the core product does not touch those copies.'},
        {title: 'Deletion conflicts with a legal retention requirement', desc: 'A record needs to be kept for a defined period for tax, audit, or fraud purposes, so full erasure has to wait until that requirement expires.'},
        {title: 'Shared data with other users', desc: "A user requests deletion, but their data, such as a comment or shared document, is also visible to or owned partly by other users who haven't requested deletion."}
      ],
      metricTree: {
        northStar: '% of deletion requests fully completed across all systems within the required timeframe',
        l1: [
          {label: 'Deletion completeness', l2: ['% of requests verified deleted across backups and third-party tools', 'Systems still missed by an average request']},
          {label: 'Time to fulfill', l2: ['Days from request to full completion', '% completed within the legally required window']},
          {label: 'Legal-hold handling', l2: ['% of requests correctly delayed for a documented retention requirement', 'Time from retention expiry to actual deletion']}
        ]
      },
      gherkin: [
        {title: 'Deletion request reaches all systems', given: 'a user submits a data-deletion request', when: 'the request is processed', then: 'their personal data is removed from the live database, backups on their next cycle, and any connected third-party tool holding it'},
        {title: 'Legal retention requirement delays but does not block deletion', given: 'a record is subject to a defined legal retention period', when: 'a deletion request is received for that record', then: 'deletion is scheduled for the moment the retention period ends, and the user is told why'},
        {title: "Shared content is handled without deleting others' data", given: "a user's data is shared with or referenced by another user's content", when: 'the deletion request is processed', then: "the requesting user's personal data is removed while the other user's independent content is preserved"}
      ]
    },
    'Handle a compensation-rate change for existing vs. new customers': {
      info: 'When a policy changes how much someone is paid for something, like solar export credits, existing customers who signed up under the old rate often keep it, while new customers get the new one.',
      edgeCases: [
        {title: 'Cohort not tracked at signup', desc: "The system tracks a customer's current rate but not which rate vintage they originally qualified under, so there's no way to tell who should be grandfathered when the policy changes."},
        {title: 'Equipment change misclassified as a new signup', desc: 'A customer who adds new equipment, like a battery, to an existing grandfathered system gets incorrectly bumped to the new rate, losing their original one.'},
        {title: 'Two customers, same usage, different numbers', desc: "A calculator shows two customers with identical usage two different outputs because they're on different rate cohorts, which looks like a bug unless it's explained."},
        {title: 'Grandfathering period has an end date', desc: "A customer's protected rate is only guaranteed for a defined number of years, and nothing currently tracks or communicates when that protection itself expires."}
      ],
      metricTree: {
        northStar: '% of customers billed or calculated under the correct rate cohort with no disputed discrepancy',
        l1: [
          {label: 'Cohort tracking accuracy', l2: ['% of customers with an explicit rate-vintage recorded at signup', 'Misclassification incidents per quarter']},
          {label: 'Calculator trust', l2: ['Support tickets citing "two customers, different numbers"', '% of rate-difference questions resolved without escalation']},
          {label: 'Grandfathering expiry readiness', l2: ['% of customers notified before their protected rate ends', 'Time from expiry to customer acknowledgment']}
        ]
      },
      gherkin: [
        {title: 'Rate cohort is recorded at signup', given: 'a new customer is approved under the current compensation rate', when: 'their account is created', then: 'the specific rate and the date it was locked in are stored permanently on their record'},
        {title: 'Adding equipment does not change the rate cohort', given: 'a grandfathered customer adds new equipment to their existing system', when: 'the addition is processed', then: 'they retain their original grandfathered rate and are not reassessed under the current rate'},
        {title: 'Differing outputs are explained', given: 'two customers with identical usage are on different rate cohorts', when: 'either customer views their calculation', then: 'the result explains which rate cohort applies to them and why it may differ from someone else\'s'},
        {title: 'Grandfathering expiry is communicated in advance', given: "a customer's grandfathered rate has a defined end date", when: 'that date approaches', then: 'they are notified in advance of what rate applies afterward'}
      ]
    },
    'Integrate with third-party EV charging hardware (OCPP)': {
      info: "Connecting a charging network product to physical charge points from different hardware vendors using the shared OCPP protocol, so software can monitor and control chargers it didn't build.",
      edgeCases: [
        {title: 'Vendors interpret the protocol differently', desc: 'Two charge points from different manufacturers report the same charging status using different timing or field values, even though both claim to support the same protocol version.'},
        {title: 'Charger goes offline mid-session', desc: 'Connectivity drops while a vehicle is actively charging, and the system needs a defined behavior for whether charging continues locally or halts.'},
        {title: 'Firmware-level instability', desc: "A specific charger model's firmware has a memory leak or bug that appears only after sustained real-world use, beyond what a lab test covers."},
        {title: 'Meter-value disputes', desc: "The charger's own reported energy delivered doesn't match what the billing system calculates, creating a discrepancy in what the customer gets charged."}
      ],
      metricTree: {
        northStar: '% of charging sessions that complete with no reported hardware/software mismatch',
        l1: [
          {label: 'Cross-vendor reliability', l2: ['% of sessions with a status field mismatch by charger model', 'Charger models requiring vendor-specific handling']},
          {label: 'Offline resilience', l2: ['% of sessions surviving a connectivity drop without billing error', 'Time to detect and flag an offline charger']},
          {label: 'Billing accuracy', l2: ['% of sessions with a meter-value discrepancy', 'Average discrepancy size when one occurs']}
        ]
      },
      gherkin: [
        {title: 'Offline session behavior is defined', given: 'a charge point loses connectivity mid-session', when: 'the disconnection is detected', then: 'the system applies a defined fallback, either continuing locally or halting, and the session never sits in an undefined state'},
        {title: 'Vendor-specific quirks are isolated', given: "a charger model reports status fields differently from the spec's expected behavior", when: 'that model is onboarded', then: 'a documented vendor-specific handling rule accounts for the difference, so the discrepancy never silently corrupts session data'},
        {title: 'Meter-value discrepancy is flagged before billing', given: "a charger's reported energy delivered differs from the billing system's own calculation", when: 'the session closes', then: 'the discrepancy is flagged for review, and the customer is not billed either figure until it is reconciled'},
        {title: 'New charger model is soak-tested before rollout', given: 'a new charger hardware model is being integrated', when: 'it completes lab testing', then: 'it also runs a live soak test before being rolled out broadly, to catch firmware issues that only appear under sustained real-world load'}
      ]
    }
    },
    '0to1': {
      'Add magic-link (passwordless) signup': {
        info: 'A login flow where clicking a one-time link sent to your email signs you in, with no password to create or remember.',
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
        info: 'A short, sequential list of setup steps shown to new users right after signup, guiding them to their first real action.',
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
        info: 'A single button existing users can send to friends or colleagues, turning a referral into one step.',
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
        info: 'A signup waitlist where referring other people moves you up the line faster than waiting alone.',
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
        info: 'A custom, isolated environment built for one early customer, before the product has a standard multi-tenant setup for everyone.',
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
        info: 'A built-in way for beta users to submit feedback from inside the product, without leaving to email or fill out a separate form.',
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
      },
      'Add a free trial with an expiration flow': {
        info: "A time-limited free trial that converts to paid or locks access once it ends. The decision covers trial length, what happens at expiry, and whether there's a grace period.",
        edgeCases: [
          {title: 'Trial ends mid-task', desc: 'A user is in the middle of an important action when access cuts off, with no warning that it was about to happen.'},
          {title: 'No card on file at signup', desc: 'The trial expires with no way to charge anyone, so converting requires an explicit add-card step the product has to prompt for.'},
          {title: 'Silent expiry', desc: "A user doesn't notice the trial ended until they try to log in days later and assume the product is broken."},
          {title: 'Team trial with one converter', desc: "On a team trial, one person adds payment info, and it's unclear whether that covers the whole team or just that person."}
        ],
        metricTree: {
          northStar: '% of trial users who become paying customers by trial end',
          l1: [
            {label: 'Trial activation rate', l2: ['% who complete core setup during trial', 'Days to first value moment']},
            {label: 'Expiry conversion rate', l2: ['% who add payment before expiry', '% who convert during a grace period']},
            {label: 'Post-expiry support tickets', l2: ['% citing "lost access unexpectedly"', '% citing billing confusion']}
          ]
        },
        gherkin: [
          {title: 'Trial-ending reminder', given: 'a user is 3 days from trial expiry', when: 'they log in', then: 'they see a clear reminder of the expiry date and a prompt to add payment'},
          {title: 'Trial expires without payment', given: 'a trial ends with no payment method on file', when: 'the user next logs in', then: 'they see a locked state explaining the trial ended, with a direct path to add payment'},
          {title: 'Grace period honored', given: 'a user adds payment within the defined grace period after expiry', when: 'the payment is confirmed', then: 'their account and data are restored exactly as they left them'},
          {title: 'Team trial conversion is unambiguous', given: 'multiple people are using a shared team trial', when: 'one member adds payment', then: 'the system clearly states whether that covers the whole team or just that member'}
        ]
      },
      'Design the empty state for a brand-new account': {
        info: "What a user sees before they've created anything: an empty dashboard, inbox, or project list. The decision is whether to show nothing, instructions, or sample data.",
        edgeCases: [
          {title: 'Blank screen reads as broken', desc: 'A literally empty container gives no signal whether the product is working or stuck.'},
          {title: 'Sample data left behind', desc: 'Demo content meant to illustrate the empty state is mistaken for real data, or never gets cleaned up.'},
          {title: 'Same empty state after a bulk delete', desc: 'A user who deletes everything sees the identical welcome empty state meant for new users, which reads as ignoring what they just did.'},
          {title: 'Empty state hides the create action', desc: 'The guidance text describes what to do, but the actual button to do it sits somewhere else on the page.'}
        ],
        metricTree: {
          northStar: "% of new accounts that create their first real item within the first session",
          l1: [
            {label: 'Empty-state engagement', l2: ['% who click the primary action shown', 'Time spent on an empty screen before acting']},
            {label: 'First-item creation rate', l2: ['% who create an item in session 1', 'Drop-off rate on empty screens']},
            {label: 'Confusion signals', l2: ['Support tickets asking "is this broken?"', 'Rage clicks on empty containers']}
          ]
        },
        gherkin: [
          {title: 'New account sees guided empty state', given: 'a user opens a section with no data yet', when: 'the page loads', then: 'they see an explanation of what belongs there and a direct action to create the first one'},
          {title: 'Empty state after deletion differs from first-run', given: 'a user deletes their last remaining item', when: 'the list becomes empty', then: 'they see a message reflecting that they just deleted their last item, different from the new-user welcome message'},
          {title: 'Sample data is clearly labeled', given: 'a product shows sample data to illustrate an empty state', when: 'the user views it', then: 'it is visibly marked as sample data they could not mistake for something they created'}
        ]
      },
      'Decide what to instrument before you have any users': {
        info: "The first analytics decision: which user actions actually get logged, before there's real usage to learn from. Get this wrong and you can't tell later if anyone's stuck.",
        edgeCases: [
          {title: 'Instrumenting too late', desc: 'The team ships a feature, gets real usage, and only later realizes no events were logged for it, so early data is unrecoverable.'},
          {title: 'Vanity events only', desc: 'Only easy-to-log events like page views get tracked, while the harder, more meaningful ones, like whether someone actually completed the task, do not.'},
          {title: 'No consistent naming', desc: 'Events get named ad hoc by whoever wrote that feature, so the same conceptual action shows up under three different event names.'},
          {title: 'Duplicate/double-fired events', desc: 'An event fires twice for a single user action, such as once on click and once on page load, inflating every downstream count.'}
        ],
        metricTree: {
          northStar: '% of core user actions with a logged event, verified against real usage',
          l1: [
            {label: 'Instrumentation coverage', l2: ['% of key actions with an event defined before launch', 'Time from feature ship to event verified live']},
            {label: 'Data trustworthiness', l2: ['% of events passing a naming/schema check', 'Known duplicate-event incidents']},
            {label: 'Decision usability', l2: ['% of product decisions backed by an actual event', '% of "we don\'t know" answers to basic usage questions']}
          ]
        },
        gherkin: [
          {title: 'Event exists before the feature ships', given: 'a new feature is being built', when: 'it is scheduled to ship', then: 'the events needed to measure its usage are defined and verified before launch'},
          {title: 'Event names follow one convention', given: 'a new event is added to the tracking plan', when: 'it is implemented', then: 'its name follows the same naming convention as every other tracked event'},
          {title: 'Duplicate firing is caught', given: 'an event is wired to fire on a user action', when: 'that action happens once', then: 'exactly one event is recorded'}
        ]
      },
      'Publish a public changelog or build-in-public roadmap': {
        info: "A public page showing what shipped recently and what's next, used by small teams to build trust before they have a big brand name to lean on.",
        edgeCases: [
          {title: 'Nothing to publish some weeks', desc: 'A quiet week with no real progress leaves a gap that makes the product look abandoned if the changelog goes silent.'},
          {title: 'Public roadmap read as a promise', desc: 'An item listed as exploring gets treated by a customer as a committed release date.'},
          {title: 'Internal-only detail leaks', desc: 'A changelog entry accidentally describes an unreleased feature in enough detail to tip off a competitor.'},
          {title: 'Stale entries never removed', desc: "Old planned items stay listed long after they were quietly deprioritized, and a visitor has no way to tell what's still active."}
        ],
        metricTree: {
          northStar: "% of early users who report the product feels like it's actively improving",
          l1: [
            {label: 'Changelog engagement', l2: ['% of users who visit the changelog', 'Return visit rate to the changelog page']},
            {label: 'Roadmap-driven signups', l2: ['% of new signups citing a public roadmap item', 'Upvotes/comments per roadmap item']},
            {label: 'Roadmap credibility', l2: ['% of "planned" items shipped within stated window', 'Support questions doubting a stated timeline']}
          ]
        },
        gherkin: [
          {title: 'Roadmap items are labeled by confidence', given: 'an item appears on the public roadmap', when: 'a user views it', then: 'it is labeled as exploring, planned, or in progress, so only genuine commitments are shown as firm'},
          {title: 'Changelog entries stay factual', given: 'a changelog entry describes a shipped change', when: 'it is published', then: 'it describes only what actually shipped'},
          {title: 'Deprioritized items are removed promptly', given: 'a roadmap item is no longer being worked on', when: 'the roadmap is next updated', then: 'that item is removed or clearly marked as deprioritized, so it is never left listed indefinitely'}
        ]
      },
      "Connect a customer's utility account to pull their real usage data": {
        info: "Letting a user log into their electric utility account so the product can pull real usage and billing data automatically, skipping a manual bill upload.",
        edgeCases: [
          {title: 'Invalid login on first connect', desc: "A user enters the wrong utility-site credentials, and the failure needs to say so clearly, so it doesn't look like the connection is broken."},
          {title: 'Authorization quietly expires', desc: "Unless the customer granted indefinite access, the link to their utility account expires after a period and silently stops pulling new data."},
          {title: 'Utility site itself is down', desc: "The connection attempt fails because the utility's own portal is unavailable, which looks identical to a wrong password unless the product tells them apart."},
          {title: 'Multiple accounts under one login', desc: 'A single utility login covers several properties or meters, and the product needs the user to pick which one this connection is for.'}
        ],
        metricTree: {
          northStar: '% of connected utility accounts still successfully syncing 90 days later',
          l1: [
            {label: 'Connection success rate', l2: ['% of first-attempt logins that succeed', '% failing due to utility site outage vs. bad credentials']},
            {label: 'Reauthorization rate', l2: ['% of expired connections successfully reauthorized', 'Time from expiry to reauthorization']},
            {label: 'Data completeness', l2: ['% of expected billing cycles successfully pulled', 'Support tickets citing missing usage data']}
          ]
        },
        gherkin: [
          {title: 'Invalid credentials explained clearly', given: 'a user enters incorrect utility login credentials', when: 'the connection attempt runs', then: 'they see a specific invalid-login message, distinct from a generic error, and a way to try again'},
          {title: 'Expired authorization prompts reconnection', given: "a customer's utility authorization has expired", when: 'the next scheduled data pull runs', then: 'the user is notified and given a direct link to reauthorize'},
          {title: 'Utility outage is distinguished from bad credentials', given: "the utility's own site is down during a connection attempt", when: 'the attempt fails', then: 'the user sees a message identifying it specifically as a utility-side outage, with guidance to retry later'},
          {title: 'Multiple accounts require explicit selection', given: 'a utility login covers more than one account or meter', when: 'the user connects it', then: 'they are prompted to select which specific account this connection applies to'}
        ]
      }
    }
  };

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
      if(resultFeature) resultFeature.textContent = '“' + topic.name + '”';
      renderEdgeCases(edgeList, topic.edgeCases);
      renderMetricTree(metricTree, topic.metricTree);
      renderGherkin(gherkinList, topic.gherkin);

      if(emptyState) emptyState.hidden = true;
      result.hidden = false;
      activateTab('prd-panel-edge');
    }

    function buildTopicButtons(topics){
      return topics.map(function(topic, i){
        var globalIndex = currentTopics.indexOf(topic);
        return '<span class="prd-preset-item">' +
          '<button type="button" class="gtm-segment prd-preset-btn" data-topic-idx="' + globalIndex + '">' + escapeHtml(topic.name) + '</button>' +
          '<button type="button" class="rice-info" data-tooltip="' + escapeHtml(topic.info || '') + '" aria-label="What is &#8220;' + escapeHtml(topic.name) + '&#8221;?">i</button>' +
          '</span>';
      }).join('');
    }

    function renderPresetButtons(stage){
      var presets = STAGE_PRESETS[stage] || STAGE_PRESETS['0to1'];
      currentTopics = Object.keys(presets).map(function(name){
        var data = presets[name];
        return {name: name, info: data.info, edgeCases: data.edgeCases, metricTree: data.metricTree, gherkin: data.gherkin};
      });

      presetsWrap.innerHTML =
        '<div class="prd-picker-group">' +
          '<div class="prd-picker-label">Feature examples <span class="prd-picker-sub">Pick one to see it worked through, or hover/tap the <span class="prd-info-hint" aria-hidden="true">i</span> icon for what it means</span></div>' +
          '<div class="prd-picker-row">' + buildTopicButtons(currentTopics) + '</div>' +
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

    window.pmLabInitInfoTooltips(presetsWrap);

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
