# Forged Tools / Return Here website

Canonical local repo: `~/ForgedToolsSite` (`/Users/peteballstriker/ForgedToolsSite`).
GitHub: [pbakunas1/ForgedToolsSite](https://github.com/pbakunas1/ForgedToolsSite).
Cloudflare Pages project: `forgedtoolssite`; Pages URL: https://forgedtoolssite.pages.dev.
Production branch: `main` (merging publishes through the existing Pages Git integration).

## Site and local review

Plain static HTML/CSS: no framework, dependencies, or build step. Files are served
from the repository root; no generated output directory is needed.
Open `index.html` in a browser, or run `python3 -m http.server 8000` from this
folder and visit http://localhost:8000. Check desktop and narrow/mobile layouts,
page navigation, Privacy, Support, contact email, and app links.

## Update workflow

**branch → PR → Cloudflare preview → review → merge → production**

1. Start from a clean, current `main`: `git switch main`, `git pull --ff-only`.
2. Create a short-lived branch, e.g. `git switch -c landing/hero-copy`.
3. Edit, review locally, run `git diff --check`, then commit and push the branch
   with `git push -u origin HEAD`.
4. Open a pull request targeting `main`. Wait for the Cloudflare Pages check,
   open its preview URL, and review all three pages and their links.
5. Merge only after the preview succeeds and the change is approved for release.
   Verify production after Pages deploys, then delete the finished branch.

Use this same lightweight process for small copy fixes. Do not push directly to
`main`, force-push production history, or maintain a separate deployment copy.
A missing preview/check must be investigated before merging.

## Rollback

For a normal rollback, create a branch from current `main`, revert the offending
commit with `git revert <commit>`, and follow the PR/preview/review workflow above.
For a merge commit, identify the mainline parent before reverting (typically
`git revert -m 1 <merge-commit>`). This preserves history.

For an urgent production rollback, in Cloudflare Pages → `forgedtoolssite` →
Deployments, select a previously successful **production** deployment and choose
**Rollback to this deployment**. This immediately changes production; preview
deployments are not rollback targets. Then revert the corresponding Git changes
through a PR so the next deployment does not reintroduce the problem.
See [Cloudflare rollback documentation](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Baseline before this documentation change: `0b9ade95576993be5b917d014f4d544aea4a4b5f`
(`Link Return Here to the App Store`). Confirm the deployed commit in Cloudflare
before choosing a rollback target; this baseline is not a verified deployment ID.

## Site and app link maintenance

- `index.html`: homepage copy, Return Here product section, and App Store link
  (currently https://apps.apple.com/app/id6803208554). There is no Play Store link;
  add one here only when the Android listing is available and verified.
- `styles.css`: shared layout and styling for all pages.
- `privacy.html`: privacy statements and last-updated date; keep aligned with
  actual website/app behavior.
- `support.html`: product support copy. Contact links use `hello@forgedtools.ai`
  across all three HTML files; update them together if the address changes.
- Preserve `privacy.html` and `support.html` URLs used by store listings. When
  changing domains or URLs, update store metadata and verify existing links.

## Hosting settings to verify in the dashboard

The site needs no application environment variables or secrets. Never commit
local env files; `.env.example` may document names with placeholder values only.

Dashboard settings were not accessible without sign-in on September 5, 2026.
Under Workers & Pages → `forgedtoolssite`, verify:

- Connected repository `pbakunas1/ForgedToolsSite`, production branch `main`,
  automatic production deployments, and preview deployments for working branches.
- Framework **None**, no build command, repository root as the served output;
  confirm the actual root/output field values in the existing project.
- Custom domains and their active/TLS status; no custom domain is assumed here.
- Production and Preview variables, secrets, and bindings (inspect names/settings,
  never copy secret values into this repo).

GitHub branch protection is separate: the intended lightweight policy is PRs,
no force pushes, and the actual Cloudflare check required once verified, without
mandatory outside reviewers. Documentation does not enable these settings.
