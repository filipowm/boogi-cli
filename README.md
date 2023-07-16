**Project is no longer maintained (as if it was in recent two years 🙃). I suggest to switch to Docusaurus which is really powerful documentation sites engine, quite similar to BooGi**

# BooGi CLI

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/filipowm/boogi-cli)
![CI](https://github.com/filipowm/boogi-cli/workflows/CI/badge.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/filipowm/boogi)

CLI for BooGi - an awesome documentation pages generator 
with modern look-and-feel.

## :label: Requirements

- NodeJS in version _12.13_ or higher
- Yarn (`npm install -g yarn`)

## :rocket: Quick Start

1. Initialize BooGi project in current directory:
   ```bash
   boogi init
   ```
   Now wizard will guide you through core BooGi
   configuration.

2. Run your app in development mode with live reload
   ```bash
   boogi develop
   ```
   You can access your app on `localhost:8000`. Any changes
   applied will be automatically applied on running
   development server.

3. Build you app package ready for deployment
   ```bash
   boogi build
   ```
   Built package will be available in `public` directory.

## :book: Guide

### `boogi init`

Initialize BooGi app in given path. This gives a way to easily and quickly
start a BooGi project.

```
boogi init [path] [-f|--full] [--skip|--skip-config] [-d|--debug]
```

`path` - path where BooGi project will be initialized. Defaults to current directory.

`-f`, `--full` - use full (advanced) configuration wizard. Guides you through most of available configuration options.

`--skip`, `--skip-config` - skip configuration wizard. Default values will be applied.

`-d`, `--debug` - enable debugging mode.

### `boogi develop`

Start BooGi development server on specified port (default 8000).
The development server supports live (hot) reload on any changes.

```
boogi develop [-p|--port] [-d|--debug]
```
`-p`, `--port` - port on which development server will run. Defaults to `8000`.

`-d`, `--debug` - enable debugging mode.

**Note** Changes done to `config/jargon.yml` will not be reloaded.
To apply changes to jargon you must restart server.

### `boogi build`

Build BooGi project. Deployment-ready package will be created
in `public` directory.

```
boogi build [-a|--archive] [-d|--debug]
```

`-a`, `--archive` - archive (zip) result directory. `public.zip` file will be created
with your built app.

`-d`, `--debug` - enable debugging mode.

### `boogi clean`

Wipe the local BooGi environment including built assets and cache.
Useful in case of issues while running `build` or `develop` commands.

```
boogi clean
```

## :construction_worker: Roadmap

- add command to manage navigation sidebar (create, edit, remove groups etc..)
- add command to manage pages (create, edit, remove etc..)
- add command to manage theme
- improve debugging mode
- tests, tests, tests
