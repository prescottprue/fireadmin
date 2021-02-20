export const DOCS_URL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname.includes('fireadmin-stage')
      ? 'https://fireadmin-stage-docs.firebaseapp.com'
      : 'https://docs.fireadmin.io'
    : 'http://localhost:8000'
