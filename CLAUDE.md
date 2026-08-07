# CLAUDE.md — Positronikal.github.io

> Cross-session context: vault `_meta/CURRENT_STATE.md` and `_meta/Logs/SESSION_LOG.md`

Positronikal public website. Jekyll static site served via GitHub Pages at `positronikal.github.io`. Under `Positronikal` GitHub org.

## Development Environment

Ruby toolchain: `C:\Ruby40-x64` (not on default PATH — add manually or use the Ruby command prompt).

```bash
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

**Windows note:** `html-proofer` requires `libcurl.dll` under that exact name. MSYS2 ships it as `libcurl-4.dll`. Fix applied: both DLLs copied to `C:\Ruby40-x64\bin\`. The Ubuntu CI runner has libcurl natively.

## CI / Hooks

Two independent workflows:
- `hooks/ci-check.sh` + `.github/workflows/ci.yml` — quality gate (jekyll build, htmlproofer, bundler-audit). Local gate runs on pre-push.
- `.github/workflows/jekyll.yml` — GitHub Pages deploy. Not gated by ci.yml (local-CI-is-the-gate model).

`core.hooksPath` was previously set to `.husky/_` (leftover from pre-Jekyll Astro lineage) — fixed 2026-06-22. Confirm it is unset (`git config --local core.hooksPath`) if hooks are not firing.

## Standards

Content-only repo; no application source. Linting is structural (htmlproofer) rather than language-level. Follow vault [[BRAND_VOICE]] and [[VISUAL_IDENTITY]] for content decisions.
