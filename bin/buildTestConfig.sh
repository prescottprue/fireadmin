#!/usr/bin/env bash
set -e

if [ "$CI_ENVIRONMENT_SLUG" == "staging" ]; then
  echo "Build config for staging e2e testing"
  echo "{
      \"TEST_UID\": \"$STAGE_TEST_UID\",
      \"TEST_PASSWORD\": \"$STAGE_TEST_PASSWORD\",
      \"FIREBASE_API_KEY\": \"$STAGE_FIREBASE_API_KEY\",
      \"FIREBASE_PROJECT_ID\": \"$STAGE_FIREBASE_PROJECT_ID\"
    }" > ./cypress.env.json

elif [ "$CI_ENVIRONMENT_SLUG" == "production" ]; then
  echo "Build config for production e2e testing"
  echo "{
      \"TEST_UID\": \"$PROD_TEST_UID\",
      \"TEST_PASSWORD\": \"$PROD_TEST_PASSWORD\",
      \"FIREBASE_API_KEY\": \"$PROD_FIREBASE_API_KEY\",
      \"FIREBASE_PROJECT_ID\": \"$PROD_FIREBASE_PROJECT_ID\"
    }" > ./cypress.env.json
else
  echo "\"$CI_ENVIRONMENT_SLUG\" does not match an existing test environment"
fi
