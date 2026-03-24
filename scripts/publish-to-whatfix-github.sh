#!/usr/bin/env bash
# Publishes this folder to github.com/pratikraj-whatfix/platform_release_notes
# Requires GitHub CLI authenticated as pratikraj-whatfix (not pratikraj-git).
set -euo pipefail

REPO_OWNER="pratikraj-whatfix"
REPO_NAME="platform_release_notes"
FULL_REPO="${REPO_OWNER}/${REPO_NAME}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TOKEN_FILE="${WH_TOKEN_FILE:-${HOME}/.config/gh/pratikraj-whatfix.token}"

ensure_whatfix_gh_auth() {
  if gh auth switch -u "${REPO_OWNER}" >/dev/null 2>&1; then
    [[ "$(gh api user -q .login 2>/dev/null || true)" == "${REPO_OWNER}" ]] && return 0
  fi
  if [[ -n "${GH_WHATFIX_TOKEN:-}" ]]; then
    echo "${GH_WHATFIX_TOKEN}" | gh auth login -h github.com --with-token
    [[ "$(gh api user -q .login)" == "${REPO_OWNER}" ]] || {
      echo "Token is not for GitHub user ${REPO_OWNER}."
      exit 1
    }
    return 0
  fi
  if [[ -f "$TOKEN_FILE" ]]; then
    gh auth login -h github.com --with-token <"$TOKEN_FILE"
    [[ "$(gh api user -q .login)" == "${REPO_OWNER}" ]] || {
      echo "Token in ${TOKEN_FILE} is not for GitHub user ${REPO_OWNER}."
      exit 1
    }
    return 0
  fi
  echo "GitHub CLI is not logged in as ${REPO_OWNER}."
  echo ""
  echo "Fix (pick one):"
  echo "  1) Interactive:  gh auth login -h github.com"
  echo "     Sign in in the browser as ${REPO_OWNER}, then:"
  echo "     gh auth switch -u ${REPO_OWNER}"
  echo ""
  echo "  2) PAT file: create a classic token (repo scope) for ${REPO_OWNER}, then:"
  echo "     mkdir -p ~/.config/gh"
  echo "     echo 'ghp_YOUR_TOKEN' > ${TOKEN_FILE}"
  echo "     chmod 600 ${TOKEN_FILE}"
  echo "     Re-run this script."
  echo ""
  echo "  3) One-shot env:  GH_WHATFIX_TOKEN=ghp_... $0"
  exit 1
}

command -v gh >/dev/null || { echo "Install GitHub CLI: brew install gh"; exit 1; }

ensure_whatfix_gh_auth
gh auth switch -u "${REPO_OWNER}" >/dev/null

ACTIVE="$(gh api user -q .login)"
if [[ "$ACTIVE" != "${REPO_OWNER}" ]]; then
  echo "Active gh user is '${ACTIVE}', expected '${REPO_OWNER}'."
  exit 1
fi

gh auth setup-git -h github.com >/dev/null 2>&1 || true

if gh repo view "${FULL_REPO}" >/dev/null 2>&1; then
  echo "Remote repo exists. Configuring origin and pushing main..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/${FULL_REPO}.git"
  git push -u origin main
else
  echo "Creating ${FULL_REPO} and pushing..."
  git remote remove origin 2>/dev/null || true
  gh repo create "${FULL_REPO}" \
    --public \
    --description "platform_release_notes ? Release Notes design revamp (Whatfix dashboard / Navi design language)" \
    --add-topic release-notes \
    --add-topic design \
    --add-topic whatfix \
    --source=. \
    --remote=origin \
    --push
fi

echo "Done: https://github.com/${FULL_REPO}"
