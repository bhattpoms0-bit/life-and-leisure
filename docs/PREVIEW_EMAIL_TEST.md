# One synthetic email on PR #4 - disabled by default

This is a temporary operator-only endpoint, not customer intake. No credentials, permits, configuration, deployment or email are created by local implementation. The normal Contact form, `/api/enquiries`, production release guard, unapproved `email-first-draft-1` notice and lack of effective date remain unchanged. The isolated test project is not used or modified.

## Authorization and scope

POST `/api/preview-enquiry-test` requires trusted Netlify context `deploy-preview`, `published: false`, the verified site UUID `bd40fa12-261f-4443-bb66-6d1862c38cf7`, exact origin `https://deploy-preview-4--lifeandleisure.netlify.app`, explicit server activation and a signed bearer permit. Production/branch-deploy/dev contexts cannot be authorized by environment variables. Origin is defense in depth, not authentication.

The permit binds that site/origin, one exact runtime deploy ID, fixture/version, issue time and expiry. Its HMAC-SHA-256 is checked with constant-time comparison before claims are parsed. The server enforces a positive window no longer than 900 seconds and rechecks after body reading. Issue a permit only after the intended deployment is ready and reviewed: setting an environment deploy-ID pin before redeployment would pin the wrong deployment. A token for another deploy or an expired token is rejected.

The request contains no customer fields. The server owns the immutable fictional consultation enquiry, recipient/Reply-To `enquiries@lifeandleisure.travel`, sender `notifications@mail.lifeandleisure.travel`, and subject `[TEST] Life & Leisure Enquiry — Synthetic delivery verification`. Synthetic acknowledgement does not approve the Privacy Policy. There are no attachments, customer acknowledgements, new database or Forms storage.

## Preview-only variables - configure only after separate approval

| Variable | Value/source |
| --- | --- |
| `PREVIEW_EMAIL_TEST_ENABLED` | Literal `true` only during authorized testing; absent/false disables |
| `EMAIL_ENQUIRY_ENABLED` | Explicitly `false`; normal intake must stay disabled |
| `PREVIEW_EMAIL_TEST_SITE_ID` | Exactly the verified site UUID above |
| `PREVIEW_EMAIL_TEST_ORIGIN` | Exactly the PR #4 origin above; no trailing slash |
| `PREVIEW_EMAIL_TEST_AUTH_SECRET` | Owner-generated 32-byte random signing secret, encoded as 64 lowercase hex characters |
| `PREVIEW_EMAIL_TEST_RESEND_API_KEY` | Owner's sending-only, sender-domain-restricted key; preferably dedicated/revocable for this test |

All are server settings available to Functions, scoped to authorized Deploy Preview builds only, never Production or shared team defaults. No VITE variable or browser credential is needed. The Resend key is deliberately separate from normal intake's `RESEND_API_KEY`. Where selectable scopes are unavailable, verify the plan's actual behaviour first. Context scoping alone is not per-PR access control: verify Netlify's sensitive-variable/build-approval policy and ensure untrusted PR code cannot obtain these secrets. Do not provision them if that boundary cannot be established.

## Token creation - owner private terminal only, not during this task

Never paste the signing secret, bearer permit or API key into chat, Git, URLs, screenshots, saved command arguments or logs. Do not run these examples through assistant tools. Disable terminal transcripts/recording and avoid clipboard persistence. The signing secret is not the Resend key.

After separate credential-configuration approval, generate a random signing secret privately with Python's `secrets.token_hex(32)` and enter it directly into the server variable. Keep it in an owner-controlled secret store. Do not reuse offline test secrets. Configure the other variables and separately authorize a preview redeploy; it remains unable to send without a valid permit.

After the new preview is ready, verify its branch, approved commit, site UUID, context and actual deploy ID. The previous visual-only deployment does not contain this endpoint. Run the following privately to issue a permit for the newly reviewed deployment; it does not send email:

```python
import base64, getpass, hashlib, hmac, json, re, time
secret = getpass.getpass('Preview signing secret (not Resend key): ')
deploy = input('Exact reviewed Netlify deploy ID: ').strip()
assert re.fullmatch(r'[0-9a-f]{64}', secret)
assert re.fullmatch(r'[0-9a-f]{24}', deploy)
issued = int(time.time())
claims = dict(version=1, siteId='bd40fa12-261f-4443-bb66-6d1862c38cf7',
              deployId=deploy, origin='https://deploy-preview-4--lifeandleisure.netlify.app',
              issuedAt=issued, expiresAt=issued+900,
              fixtureId='life-leisure-preview-v1', noticeVersion='email-first-draft-1')
encoded = base64.urlsafe_b64encode(json.dumps(claims, separators=(',', ':')).encode()).rstrip(b'=')
permit = encoded.decode() + '.' + hmac.new(bytes.fromhex(secret), encoded, hashlib.sha256).hexdigest()
print(permit)  # Owner-only bearer credential; never save/share this output.
secret = None
```

Use an accurate local clock. A newly issued permit does not require another redeploy. The server still rejects other sites/deploys and production regardless of a permit. Changing source pins, the notice version, fixture or deployment requires renewed review/authorization.

## One-email operation and deactivation

1. Separately approve the local diff, commit/push/PR #4 update and preview deployment. Verify default POST returns 503 with no data/key; keep normal customer intake disabled. Inspect deployment logs for function packaging and the declared rate limit.
2. Separately approve preview-only credential configuration/redeployment and **one** synthetic send. Verify domain/key permissions, fixed From/To, mailbox access and account allowance. Never configure credentials in Production. Issue the short-lived permit after the final deployment is ready.
3. In an owner-controlled HTTP client that accepts secrets through a private prompt/in-memory value, POST to `https://deploy-preview-4--lifeandleisure.netlify.app/api/preview-enquiry-test`, with `Content-Type: application/json`, `Origin: https://deploy-preview-4--lifeandleisure.netlify.app`, and `Authorization: Bearer <private permit>`. Do not put the permit in a shell argument/history or URL. Send exactly:

   ```json
   {"fixtureId":"life-leisure-preview-v1","syntheticAcknowledged":true,"privacyNoticeVersion":"email-first-draft-1","honeypot":""}
   ```

4. Submit once. Record only the reference and provider email ID from authorized records. A 200/`accepted: true` means provider acceptance, not inbox delivery. Verify the reference, fixed headers and fictional content in Resend and Workspace; inspect Spam if needed. Inspect Reply-To without sending a reply. If acceptance is ambiguous, inspect provider records before requesting retry approval. Use mocks for additional failure cases.
5. Stop immediately after verification; issue no further permits. For an immediate sending cutoff across old deployments, revoke the dedicated test provider key through a separately authorized owner action (assess any shared use first). Then set test activation false, remove the preview key/signing secret, and redeploy disabled after authorization. Environment changes/redeployment alone do not necessarily revoke old deployments. Verify old and current deploy URLs; hard permit expiry remains an independent bound. Closing the PR is not credential revocation.
6. Separately authorize cleanup of synthetic Workspace messages, forwarded copies, attachments/exports and provider-retained content/logs. Use supported provider deletion/expiry processes; do not promise immediate erasure of backups or a per-message delete API. Retain minimal evidence without credentials. No deletion happens automatically.

## Limits and residual risks

The endpoint enforces POST, exact origin/path, uncompressed JSON, the shared 24 KiB streaming limit, fixed envelope, safe errors and no application logging. Unapproved input is rejected and never forwarded; a public endpoint cannot prevent strangers from sending unwanted bytes to it. Review platform observability so headers/bodies are not captured unnecessarily. There is no new durable quota or storage.

Warm-instance requests coalesce. Across instances, the deterministic provider key/body bind the fixture and exact deploy, not the permit, so renewed permits for the same deploy do not vary the provider request. Resend deduplicates within its documented 24-hour window, not permanently. Reissuing authorization after that window, deploying new code, or changing the fixture can produce another email and requires separate approval. This is not permanent exactly-once delivery.

Five requests per IP/domain per 60 seconds are declared in the function; deployment enforcement must be verified and can lag. Distributed abuse can still consume function/account capacity. A leaked bearer permit is replayable until expiry; a leaked signing secret can mint more permits and must be treated as a serious credential compromise. Do not expose secrets to other PR builds. Budget one intended email plus deployment/function usage; verify actual account limits and do not enable paid features automatically.

References: [Netlify runtime context](https://docs.netlify.com/build/functions/api/), [Function variables](https://docs.netlify.com/build/functions/environment-variables/), [Rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
