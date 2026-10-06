# 410 Days landing page

`index.html` is the beta-signup page for 410 Days. `privacy.html` is unchanged and stays at `/privacy.html`.

## The only file to edit: `config.js`

| Setting | What it does |
|---|---|
| `TESTFLIGHT_URL` | Empty: every "Join the TestFlight beta" button scrolls to the email form. Paste the public TestFlight link here and every button goes straight to TestFlight. |
| `APP_STORE_URL` | Paste once 1.0 is live; adds a "Download on the App Store" link. |
| `FORM_ENDPOINT` | Where signups are POSTed as JSON. Defaults to FormSubmit (`https://formsubmit.co/ajax/gordon@liang.ca`), which needs no account. |
| `CONTACT_EMAIL` | Used for the mailto fallback and the footer. |
| `SITE_URL` | Base for share/referral links. |

## Making signups live (one step)

After this is merged and GitHub Pages has rebuilt (about a minute), open the page, sign up once with your
own email, then click **Activate Form** in the email FormSubmit sends to gordon@liang.ca. From then on
every signup arrives in that inbox as a table (email, what they're starting, ref code, UTM source).

Until activation, or whenever the endpoint fails, the form falls back to opening the visitor's mail app with a
prefilled "Add me to the 410 Days beta" note to `CONTACT_EMAIL`, so no signup is lost.

Optional: FormSubmit's activation email also gives a random-string endpoint. Swap it into `FORM_ENDPOINT`
so your address isn't visible in the page source.

## Link previews

`og-image.png` (1200x630) is referenced with absolute URLs to `https://glianx.github.io/greatness-journal/`.
If the page moves to another domain, update `og:url`, `og:image`, `twitter:image` and `canonical` in `index.html`.

## Notes

- No analytics, no cookies, no third-party requests except the form POST. Fonts are self-hosted (SIL OFL).
- Gallery content is the app's shipping Technology catalog (8 entries). All photos are public domain (NASA / U.S. DoD); credits are in the footer.
- Source and build scripts live outside this repo (`/workspace/money-bot/overnight/launch/` on the agent box).
