# ureact-package-boilerplate
>A starter project for a Ureact package

[![Commitizen friendly](https://img.shields.io/badge/commitizen-udacity%20friendly-02b3e4.svg?style=flat&colorA=2e3d49)](http://commitizen.github.io/cz-cli/)
[![Udacity Changelog](https://img.shields.io/badge/changelog-udacity%20convention-02b3e4.svg?style=flat&colorA=2e3d49)](https://github.com/udacity/conventional-release-tools)

## How create a new package using this
Example, if you are creating `ureact-foo`:

1. Clone this repo into a `ureact-foo` directory via:
`git clone git@github.com:udacity/ureact-package-boilerplate.git ureact-foo`
2. Remove the existing `.git` folder in `ureact-foo`
3. Run `git init .` in `ureact-foo` to create a new Git repo.

## What you need to change
1. Update the `package.json` "name" and "repository" fields
2. Change stuff in "src" to actually do something interesting
3. Update /examples/index.jsx to use your stuff in /src

## Required Setup
- node v4.4.5 (run `nvm use` if you use [nvm](https://github.com/creationix/nvm))
- npm v3.9.5 (run `npm install npm@^3.9.5 -g`)

## Usage
`npm install`

`gulp` Start a dev server on localhost:5000 running the example code in /examples

`gulp release` Push a release to npm

See [ureact-package](https://github.com/udacity/ureact-package) for more info.
