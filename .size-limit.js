module.exports = [
  {
    path: "dist/main.*.js",
    limit: "1.5 MB",
    name: "Main bundle",
    webpack: false,
    gzip: false
  },
  {
    path: "dist/vendor.*.js",
    limit: "1.2 MB",
    name: "Vendor bundle",
    gzip: false,
    webpack: false
  }
]