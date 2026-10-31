# Code Review Notes — Positronikal.github.io

## What failure looks like here
A Jekyll build that succeeds locally but breaks on GitHub Pages — usually
a gem version mismatch, a broken internal link, or an HTML structure issue
that html-proofer catches on CI.

## Key invariants the reviewer should check
- All internal links resolve (html-proofer covers this in CI)
- Gemfile.lock is committed and up to date
- No content that conflicts with GitHub Pages' allowed plugins
- CC BY 4.0 license applies to content; GPL does not apply here

## Paths to skip
- `_site/` — generated build output, not source
- `var/` — health reports

## Finding standards
- Every finding must cite a specific file and line number
- Cap nits at 3 per review pass; flag the class, not every instance
