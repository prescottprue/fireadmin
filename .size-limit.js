module.exports = [
  {
    path: "build/static/js/main.*.chunk.js",
    limit: "30kb",
    name: "Main bundle",
    webpack: true,
    gzip: false
  },
  {
    path: "build/static/js/runtime~main.*.js",
    limit: "3 kb",
    name: "Vendor bundle",
    gzip: false,
    webpack: true
  }
]