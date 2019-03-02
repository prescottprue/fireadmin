module.exports = [
  {
    path: "dist/main.*.js",
    limit: "1.1 MB",
    name: "Main bundle",
    webpack: false,
    gzip: false
  },
  {
    path: "dist/vendor.*.js",
    limit: "850 KB",
    name: "Vendor bundle",
    gzip: false,
    webpack: false
  }
]