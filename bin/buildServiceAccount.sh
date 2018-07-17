#!/usr/bin/env bash
set -e

if [ "$CI_ENVIRONMENT_SLUG" == "staging" ]; then
  echo "Build service account for staging..."
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
  }" > ./functions/serviceAccount.json

elif [ "$CI_ENVIRONMENT_SLUG" == "production" ]; then
  echo "Building service account for production..."
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
  }" > ./functions/serviceAccount.json
else
  echo "TEST_ENV environment variable does not match an existing test environment"
fi
