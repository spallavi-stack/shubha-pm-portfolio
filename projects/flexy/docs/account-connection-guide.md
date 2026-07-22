# Flexy- Account Connection Guide

Written for a future engineering team: what it would take to replace the fake "Connect to ComEd" step in the prototype with a real one.

## What this covers, and what it doesn't

The prototype's account-connection screens (entering a ComEd login, seeing "You're connected to ComEd") are entirely simulated. No real ComEd account is ever contacted. This is a different integration from the one described in the [Price Integration Guide](real-data-integration-guide.html), which covers the live pricing feed and is already partially real in the prototype today. Account connection would pull a specific customer's own usage and billing data, a per-user, opt-in integration with its own trust model, separate from the shared, public pricing feed.

## The real integration: Green Button Connect My Data

ComEd already operates Green Button Connect My Data (CMD), one of the few utility programs of its kind live in the US today (alongside California's investor-owned utilities). It's an OAuth 2.0-based, opt-in data-sharing standard, not a generic username/password API, and the redirect-to-ComEd pattern already used correctly for the EV-connection step in the prototype is the right shape for this too.

<svg viewBox="0 0 640 900" xmlns="http://www.w3.org/2000/svg" role="img">
<title>ComEd account connection flow (Green Button Connect My Data)</title>
<desc>A vertical flowchart showing the OAuth 2.0 flow Flexy would use to connect a user's ComEd account via Green Button Connect My Data, distinguishing steps that happen inside Flexy from steps that happen on ComEd's own domain.</desc>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="#8A94A6"/>
  </marker>
</defs>
<rect x="0" y="0" width="640" height="900" fill="#FFFFFF"/>
<rect x="24" y="20" width="14" height="14" rx="3" fill="#C2790E"/>
<text x="44" y="31" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#201A12">Happens inside Flexy</text>
<rect x="210" y="20" width="14" height="14" rx="3" fill="#1C1712"/>
<text x="230" y="31" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#201A12">Happens on ComEd's own domain</text>
<rect x="60" y="52" width="520" height="58" rx="10" fill="#F7F4EC" stroke="#C9C2AE" stroke-width="1.5" stroke-dasharray="5,4"/>
<text x="320" y="75" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="13.5" font-weight="700" fill="#5C5445">ONE-TIME SETUP (done in advance, not per-user)</text>
<text x="320" y="95" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Flexy registers as a ComEd Third Party &#8594; assigned client_id / client_secret</text>
<line x1="320" y1="110" x2="320" y2="136" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="138" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="138" width="6" height="58" rx="3" fill="#C2790E"/>
<text x="50" y="163" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">1. User taps "Connect ComEd" inside Flexy</text>
<text x="50" y="182" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Flexy app kicks off the OAuth request</text>
<line x1="320" y1="196" x2="320" y2="222" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="224" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="224" width="6" height="58" rx="3" fill="#1C1712"/>
<text x="50" y="249" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">2. Redirected to ComEd's own login page</text>
<text x="50" y="268" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">comed.com domain, not Flexy's</text>
<line x1="320" y1="282" x2="320" y2="308" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="310" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="310" width="6" height="58" rx="3" fill="#1C1712"/>
<text x="50" y="335" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">3. User enters real ComEd credentials</text>
<text x="50" y="354" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Flexy never sees or touches the password</text>
<line x1="320" y1="368" x2="320" y2="394" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="396" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="396" width="6" height="58" rx="3" fill="#1C1712"/>
<text x="50" y="421" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">4. Consent screen: what data, for how long</text>
<text x="50" y="440" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Opt-in, revocable any time from the ComEd account page</text>
<line x1="320" y1="454" x2="320" y2="480" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="482" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="482" width="6" height="58" rx="3" fill="#1C1712"/>
<text x="50" y="507" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">5. ComEd redirects back with an auth code</text>
<text x="50" y="526" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Short-lived, single-use code, not the actual data</text>
<line x1="320" y1="540" x2="320" y2="566" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="568" width="592" height="58" rx="10" fill="#FFFFFF" stroke="#E5DFD2" stroke-width="1.5"/>
<rect x="24" y="568" width="6" height="58" rx="3" fill="#C2790E"/>
<text x="50" y="593" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">6. Flexy backend exchanges code for tokens</text>
<text x="50" y="612" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Access token + refresh token, standard OAuth 2.0</text>
<line x1="320" y1="626" x2="320" y2="652" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)"/>
<rect x="24" y="654" width="592" height="68" rx="10" fill="#FDF8EF" stroke="#E9CFA0" stroke-width="1.5"/>
<rect x="24" y="654" width="6" height="68" rx="3" fill="#C2790E"/>
<text x="50" y="679" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#201A12">7. Flexy pulls the Green Button data feed</text>
<text x="50" y="698" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Ongoing, on a schedule - separate usage + PII streams, up to 12 months of interval data</text>
<text x="50" y="715" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="11.5" font-style="italic" fill="#96600A">Separate from the live pricing feed (already real): this is account/usage data, not tariff data.</text>
<line x1="320" y1="722" x2="320" y2="748" stroke="#8A94A6" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="4,3"/>
<text x="320" y="774" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="12.5" fill="#5C5445">Access stays live until the user revokes it from their ComEd account &#8594; back to step 2 on reconnect</text>
</svg>

Green Button's data model splits what comes back into two separate streams, a usage/billing stream and a PII stream, by design, so that the two are never bundled together in one payload; the receiving application (Flexy) has to correlate them itself. Data comes back at 15-minute or hourly interval granularity, for up to 12 months of history. This is meaningfully different from the pricing feed: ComEd's Real-Time Pricing API is one shared, system-wide series that every user sees the same values from, while Green Button data is per-account, per-meter, and requires this full OAuth flow for every single user, individually.

## API specification

Green Button Connect My Data is an implementation of a published standard, NAESB REQ.21 (the Energy Services Provider Interface, ESPI), rather than a ComEd-specific API design. That's genuinely useful for a build-vs-integrate decision: the shape below is documented and stable across utilities that adopt the standard. ComEd's exact production values (its specific OAuth base URL, rate limits, and default scope options) aren't publicly documented ahead of registration, so treat the structure here as accurate to the standard and confirm the specifics once Flexy is registered as a Third Party.

**1. Authorization endpoint** (browser redirect, step 2 in the flow above)
```
GET /oauth/authorize
    ?response_type=code
    &client_id={flexy_client_id}
    &redirect_uri={flexy_callback_url}
    &scope={scope_selector}
    &state={csrf_token}
```
Returns the ComEd-hosted login and consent screen. On approval, redirects back to `redirect_uri` with `?code={auth_code}&state={csrf_token}`.

**2. Token endpoint** (server-to-server, step 6)
```
POST /oauth/token
    grant_type=authorization_code
    &code={auth_code}
    &redirect_uri={flexy_callback_url}
    &client_id={flexy_client_id}
    &client_secret={flexy_client_secret}
```
Returns `access_token`, `refresh_token`, and `expires_in`, standard OAuth 2.0. The refresh token is what makes step 7 an ongoing, unattended job rather than something the user has to repeat.

**3. The scope selector string.** Green Button's scope parameter is a semicolon-delimited string that encodes exactly what's being authorized in one value, for example: `FB=4_5_15;IntervalDuration=3600;BlockDuration=daily;HistoryLength=13`. Read left to right, this requests fifteen-minute-family interval data (`FB=4_5_15`), in hourly blocks (`IntervalDuration=3600` seconds), delivered daily (`BlockDuration=daily`), covering 13 months of history (`HistoryLength=13`). Flexy would request the narrowest scope that actually serves the product, not the broadest one available.

**4. Resource endpoints** (data retrieval, once a token exists), following the ESPI resource hierarchy: `Subscription` &#8594; `UsagePoint` &#8594; `MeterReading` &#8594; `IntervalBlock` &#8594; `IntervalReading`.
```
GET /espi/1_1/resource/Subscription/{subscriptionId}/UsagePoint
GET /espi/1_1/resource/Subscription/{subscriptionId}/UsagePoint/{usagePointId}/MeterReading/{meterReadingId}/IntervalBlock
Header: Authorization: Bearer {access_token}
```
A `Batch` variant of the same path (`.../Batch/Subscription/{id}/UsagePoint/{id}`) exists to pull everything under one subscription in a single call, the efficient path for a nightly sync job rather than resource-by-resource polling.

**5. Response format is Atom+XML, not JSON.** Every resource comes back wrapped in an Atom `<entry>`, with the actual usage data as ESPI-schema XML (`espi:IntervalBlock`, `espi:IntervalReading`, each reading carrying a `duration` and a `value`) inside `<content>`. This matters for planning: it means an XML parser sits in the ingestion pipeline next to the JSON-based ComEd pricing client already built for the Price Integration Guide, not a shared client.

**6. Errors follow standard OAuth 2.0 semantics**: a `401` on an expired or revoked token (the signal to prompt reconnection), a `403` on a resource outside the granted scope, and utility-specific rate limiting on top, whose exact thresholds ComEd doesn't publish and would need to be confirmed as part of the sandbox process below.

## What else the two tech teams would need to sort out

Beyond the OAuth plumbing itself, a handful of things sit outside the API spec but would block a real launch:

- **Third-party registration and review.** Flexy would need to formally register with ComEd as an authorized Third Party before any of this works, a process ComEd reviews on roughly a 10-business-day cycle, not something that can be self-served or skipped.
- **Data-sharing agreement and PII handling review.** Green Button explicitly requires PII to be transmitted and stored separately from usage data, which means Flexy's backend needs a real security review and a documented data-handling policy before ComEd will approve production access, not just at registration time.
- **Token refresh and polling infrastructure.** Green Button access isn't a live push, it's a periodic feed a backend job pulls on a schedule and refreshes tokens for over time, so this needs the same kind of scheduled-job infrastructure already sketched for the pricing feed in the Price Integration Guide, but per-user instead of shared.
- **Account and meter matching.** Green Button returns data tied to a specific ComEd account/meter ID, which Flexy's backend has to map to its own user record, a piece of logic that doesn't exist yet anywhere in the prototype.
- **Revocation handling.** A customer can revoke Flexy's access at any time from their own ComEd account page, entirely outside Flexy's app. Flexy needs a way to detect that (a failed refresh, a webhook, or a periodic re-check) and fall back gracefully rather than silently failing.
- **Rate-plan detection.** Knowing whether a given account is on Real-Time Pricing, the incoming Time-of-Use rate, or a standard flat rate may not come cleanly out of the Green Button usage feed itself, and might need to be self-reported by the user or looked up through a separate ComEd system.
- **A sandbox environment.** Utility integrations of this kind typically require testing against synthetic accounts in a sandbox before any production third-party access is granted, a step that would need to happen well before this could be demoed against a real account.

## Status

This documents what a real ComEd account connection would require, replacing the fully simulated login/consent screens in the current prototype. No part of this is implemented; the prototype's "You're connected to ComEd" screen is decorative. See the [Price Integration Guide](real-data-integration-guide.html) for the one integration that is genuinely real today, the public pricing feed.

## Sources

- [ComEd Green Button Connect - Third Party Provider Registration](https://secure.comed.com/MyAccount/MyBillUsage/pages/GBCThirdPartyReg.aspx)
- [Green Button, US Department of Energy](https://www.energy.gov/data/green-button)
- [Green Button Connect My Data (CMD), Green Button Alliance](https://www.greenbuttonalliance.org/green-button-connect-my-data-cmd)
- [UtilityAPI and Green Button Data](https://support.utilityapi.com/hc/en-us/articles/360015183934-UtilityAPI-and-Green-Button-Data)
- [Register to Receive Customer Data via Green Button Connect My Data, Con Edison](https://www.coned.com/en/accounts-billing/share-energy-usage-data/become-a-third-party) (same CMD standard, cited for comparison since ComEd's own program page did not return fetchable text directly)
