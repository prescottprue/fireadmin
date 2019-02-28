export const DOCS_URL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname.includes('fireadmin-stage')
      ? 'https://fireadmin-stage-docs.firebaseapp.com'
      : 'https://fireadmin-docs.firebaseapp.com'
    : 'http://localhost:8000'
