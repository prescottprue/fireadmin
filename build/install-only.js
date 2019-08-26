#!/usr/bin/env node
const fs = require('fs')
const PACKAGE_PATH = `${process.cwd()}/package.json`
const pkg = require(PACKAGE_PATH)

const depsToInstall =
  process.argv.length > 2
    ? process.argv.slice(2)
    : ['cypress', 'cypress-firebase']

const newPkg = {
  ...pkg,
  devDependencies: depsToInstall.reduce((acc, depName, ind) => {
    return { ...acc, [depName]: pkg.devDependencies[depName] }
  }, {})
}

fs.writeFileSync(PACKAGE_PATH, JSON.stringify(newPkg, null, 2))
