# XRPackage Github Actions build

This Github Action lets you build and release [XRPackage](https://github.com/webaverse/xrpackage) apps.

To use it, make sure you have a valid XRPackage in the repository (e.g. by using `xrpk init`), then add a workflow file:

## `.github/workflows/build.yml`

This will only build your package, not release it.

```
name: Build XRPackage

on: [push]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Build package
        id: build
        uses: webaverse/xrpackage-build-action@v0.0.13
        with:
          src: '.'
          dst: 'a.wbn'
      - name: Echo build result
        run: echo 'The output file is ${{ steps.build.outputs.dst }}; the release name is ${{ steps.build.outputs.name }}'
```
