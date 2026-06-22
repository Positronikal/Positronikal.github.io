#!/usr/bin/env bash
# Single source of truth for CI/code-quality checks.
# Invoked locally by hooks/pre-push (blocking) and by .github/workflows/ci.yml
# (confirmation only) — both run this exact script so local and CI cannot drift.
set -e

bundle install --quiet

echo "Building site with Jekyll..."
bundle exec jekyll build

echo "Checking links and HTML with html-proofer..."
bundle exec htmlproofer ./_site --disable-external

echo "Scanning gem dependencies for known vulnerabilities (bundler-audit)..."
bundle exec bundler-audit check --update

echo "ci-check passed."
