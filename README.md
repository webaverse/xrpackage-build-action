# XRPackage Builder Github Action

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

## `.github/workflows/release.yml`

This will build _and_ release your package using Github Releases, if it was tagged in Git using semver (e.g. `v1.2.3`).

```
name: Release XRPackage

on:
  create:
    tags:
      - v*

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
      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: ${{ steps.build.outputs.name }}
          body: |
            XRPackage build
          draft: false
          prerelease: false
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ${{ steps.build.outputs.dst }}
          asset_name: ${{ steps.build.outputs.dst }}
          asset_content_type: application/webbundle
```
