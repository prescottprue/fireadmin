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
    limit: "310 KB",
    name: "Vendor bundle",
    gzip: false,
    webpack: false
  },
  {
    path: "dist/*.*.js",
    limit: "310 KB",
    name: "Other bundles",
    gzip: false,
    webpack: false
  }
]