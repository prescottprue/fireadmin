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
  echo "{
  \"type\": \"service_account\",
  \"project_id\": \"$STAGE_FIREBASE_PROJECT_ID\",
  \"private_key_id\": \"$STAGE_FIREBASE_PRIVATE_KEY_ID\",
  \"private_key\": \"$STAGE_FIREBASE_PRIVATE_KEY\",
  \"client_email\": \"$STAGE_FIREBASE_CLIENT_EMAIL\",
  \"client_id\": \"$STAGE_FIREBASE_CLIENT_ID\",
  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",
  \"token_uri\": \"https://accounts.google.com/o/oauth2/token\",
  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",
  \"client_x509_cert_url\": \"$STAGE_FIREBASE_CERT_URL\"
}" > ./serviceAccount.json


elif [ "$CI_ENVIRONMENT_SLUG" == "production" ]; then
  echo "Build config for production e2e testing"
  echo "{
      \"TEST_UID\": \"$PROD_TEST_UID\",
      \"TEST_PASSWORD\": \"$PROD_TEST_PASSWORD\",
      \"FIREBASE_API_KEY\": \"$PROD_FIREBASE_API_KEY\",
      \"FIREBASE_PROJECT_ID\": \"$PROD_FIREBASE_PROJECT_ID\"
    }" > ./cypress.env.json
  echo "{
  \"type\": \"service_account\",
  \"project_id\": \"$PROD_FIREBASE_PROJECT_ID\",
  \"private_key_id\": \"$PROD_FIREBASE_PRIVATE_KEY_ID\",
  \"private_key\": \"$PROD_FIREBASE_PRIVATE_KEY\",
  \"client_email\": \"$PROD_FIREBASE_CLIENT_EMAIL\",
  \"client_id\": \"$PROD_FIREBASE_CLIENT_ID\",
  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",
  \"token_uri\": \"https://accounts.google.com/o/oauth2/token\",
  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",
  \"client_x509_cert_url\": \"$PROD_FIREBASE_CERT_URL\"
}" > ./serviceAccount.json

else
  echo "\"$CI_ENVIRONMENT_SLUG\" does not match an existing test environment"
fi
