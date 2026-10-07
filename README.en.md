# 🔮 BI Magic Resources

[Русский](README.md) | English

Tools for developing and maintaining projects based on the **Luxms BI** platform. Create custom visualizations, style the interface, and store and edit dashlet, dashboard, and cube configurations.

Project code and resources are stored in Git with version history, making it easier to develop in parallel and coordinate the team's work. Built-in scripts let you run the project locally, validate changes, and synchronize resources with remote BI servers.

Choose a base branch that matches your BI server version:

| Branch | Luxms BI version | React version |
|---|---|---|
| `master` | v12 | 19.0.0 |
| [`master-v11`](https://github.com/luxms/bi-magic-resources/tree/master-v11) | v11 | 18.2.0 |

## Contents

- [Quick start](#-quick-start)
- [Commands](#-commands)
- [Workflow](#-workflow)
- [Project structure](#-project-structure)
- [Configuration](#-configuration)
- [Authentication](#-authentication)

## ⚡ Quick start

### 1. Prepare your environment

You will need Git, Node.js, Yarn, and access to a BI server with permissions for the required resources. Clone the repository and install the dependencies:

```sh
git clone --branch master git@github.com:luxms/bi-magic-resources.git
cd bi-magic-resources
yarn install
```

For BI version 11, replace `--branch master` with `--branch master-v11`.

### 2. Configure the project

In `config.json`, enter your BI server address and replace `ds_my_project` with your project's schema name:

```json
{
  "server": "https://bi.example.com",
  "port": 3003,
  "include": "^ds_my_project$",
  "resources": true,
  "dashboards": false,
  "cubes": false
}
```

By default, only resources are handled locally. Enable `dashboards` to work with dashboard and dashlet configurations, or `cubes` to work with cubes. See [Configuration](#-configuration) for details on all available options.

### 3. Set up access

Create an `authConfig.json` file in the project root and enter your username and password:

```json
{
  "username": "<username>",
  "password": "<password>"
}
```

Other sign-in methods are also available. See [Authentication](#-authentication) for details.

### 4. Download resources and start the project

```sh
yarn pull --no-remove
yarn start
```

Open **http://localhost:3003**, edit files in `src`, and check the results in your browser.

## 🪄 Commands

| Command | Description |
|---|---|
| `yarn start` | Start the local development server |
| `yarn pull` | Download files from the BI server |
| `yarn build` | Build source files from `src` into `dist` |
| `yarn push` | Build the project and synchronize `dist` with the BI server |
| `yarn test` | Run tests |
| `yarn create-topic` | Create a topic configuration locally |
| `yarn create-dashboard` | Create a dashboard configuration locally |
| `yarn create-dashlet` | Create a dashlet configuration locally |

The configuration creation commands obtain IDs from the BI server, so they require authentication and access to the selected schema.

The diagram shows how files move through building and synchronization: from source files in `src`, through server-ready resources in `dist`, to the BI server and back.

```mermaid
flowchart LR
  SRC["src<br/>Editable source files"]
  DIST["dist<br/>Server-ready files"]
  BI["Luxms BI<br/>Resources on the server"]
  SRC -->|"push: build"| DIST
  DIST -->|"push: upload"| BI
  BI -->|"pull: download"| DIST
  DIST -->|"pull: restore"| SRC
```

## 📋 Workflow

The steps below describe a basic workflow, from updating the project to validating changes and publishing them to the server:

1. **Update code and resources if needed.** Run `git pull --rebase` to get the latest repository state and `yarn pull` to download resources from the server.

2. **Start the environment and make changes.** Run `yarn start`, edit source files in `src`, and check the results in your browser.

   > Before editing through the interface, check the `resources`, `dashboards`, and `cubes` options in `config.json`: changes to enabled blocks are handled locally, while changes to disabled blocks are sent to the server. Independent local and server changes to the same resources can cause conflicts during the next `yarn pull`. Restart the development server after changing the configuration.

3. **Validate changes with tests.** Tests are recommended for new logic and behavior changes. Before sharing your changes, run the project's tests with `yarn test`.

   > Keep visualization tests in `tests/`: this directory is excluded from the build and is not uploaded to the BI server. See the [testing documentation](tests/README.md) for setup and execution details (in Russian).

4. **Save the history in Git.** Stage the required files (`git add`), create a commit (`git commit`), and send it to the remote repository (`git push`).

5. **Upload resources to the server.** Run `yarn push`: it first builds the project, then synchronizes the result with the server. Review the `CREATE`, `OVERWRITE`, and `REMOVE` lists before confirming.

### Synchronization and conflicts

Use these flags to control synchronization:

| Flag | Purpose |
|---|---|
| `--no-remove` | Keep files on the destination that are absent from the source: `yarn pull --no-remove` or `yarn push --no-remove` |
| `--include` and `--exclude` | Limit the schemas included in synchronization |
| `--force` | Skip confirmation for `pull` and `push` |

If `yarn pull` reports `Restore conflicts`, reconcile local and server changes manually before downloading again. Restoration stops before writing to `src`; `dist` may already have been updated by then. Conflicting source files are not merged automatically.

See [Configuration](#-configuration) for details on options, filters, and flags.

### Source formats

- Visualization code can use JavaScript, JSX, TypeScript, and TSX; styles can use CSS, SCSS, and Sass
- Topic, dashboard, dashlet, and cube configurations support JSON, JSON5, and YAML. New configurations use JSON5 with a `.json` extension; plain JSON is sent to the server
- Regular resources outside configuration directories retain their names and content, even if they have a `.json`, `.json5`, `.yaml`, or `.yml` extension
- Source code is restored from `sourcesContent` in source maps. If a map is incomplete or contains no source content, the resource remains a compiled JS/map file pair; comments in server-side JSON and original YAML formatting cannot be restored
- The `.bi-build.json` file created inside a schema during restoration is stored in Git alongside source files and defines the build entry points

The build and development server normalize UTF-8 text resource line endings to LF, including source text inside `.map` files. Differences only in CRLF/LF do not trigger overwrites during synchronization. Building does not overwrite source files.

For details on transformations, format preservation, and conflicts, see [the source and server file pipeline](doc/source-pipeline.md) (in Russian).

## 🗂️ Project structure

Example after downloading resources and building:

```text
src/                     Editable source files stored in Git
  ds_my_project/         Resources for the selected schema
    topic.1/             Topic, dashboard, and dashlet configurations
    .cubes/              Cube and dimension configurations
    .bi-build.json       Entry points and the contents of restored bundles
dist/                    Build output or files downloaded from the server; ignored by Git
.bi-sync/                Restoration state and local metadata; ignored by Git
bi-internal/             Luxms BI API type declarations
scripts/                 Build, development server, and synchronization tools
tests/                   Project visualization tests
doc/                     Detailed documentation
config.json              Project settings
authConfig.json          Local sign-in credentials; ignored by Git
```

## ⚙️ Configuration

Parameters are resolved in the following order, from highest to lowest priority:

1. Command-line arguments
2. `BI_*` environment variables; `.env` in the project root only fills in missing variables
3. `config.json` for project settings and `authConfig.json` for authentication settings
4. Default values
5. Terminal prompts when a required parameter is missing

### Project settings

| Field in `config.json` | Default | Purpose |
|---|---|---|
| `server` | Prompted | BI server address |
| `port` | `3003` | Development server port |
| `include` | `^ds_\w+$` | Regular expression for including schemas |
| `exclude` | Empty string | Regular expression for excluding schemas |
| `resources` | `true` | Resources, including code, styles, and files |
| `dashboards` | `false` | Topics, dashboards, and dashlets |
| `cubes` | `false` | Cubes and dimensions |
| `noRemove` | `false` | Synchronize without deleting missing files |
| `force` | `false` | Synchronize without asking for confirmation |
| `noLogin` | `false` | Start the development server without signing in first, for work on the sign-in screen |

CLI option names use hyphens. Environment variable names use uppercase with the `BI_` prefix:

```sh
yarn start --port=8080
yarn pull --include='^ds_my_project$' --no-remove
```

Example `.env`:

```dotenv
BI_SERVER=https://bi.example.com
BI_PORT=3003
BI_INCLUDE=^ds_my_project$
BI_USERNAME=<username>
BI_PASSWORD=<password>
```

## 🔐 Authentication

The first configured authentication method is selected in the following order:

1. Browser session
2. Kerberos
3. JWT
4. Username and password

| Method | Where to configure it | Environment variables |
|---|---|---|
| Browser session | `session` in `authConfig.json` | `BI_SESSION` |
| Kerberos / SSO | `kerberos` in `config.json`, for example `HTTP@sso.example.com` | `BI_KERBEROS` |
| JWT | `jwt` in `authConfig.json` | `BI_JWT` |
| Username and password | `username`, `password` in `authConfig.json` | `BI_USERNAME`, `BI_PASSWORD` |

Permissions to read and modify the selected entities are required regardless of the sign-in method. JWT creation and the required endpoints are described in the [token guide](doc/jwt.md) (in Russian).

For multiple projects, `authConfig.json` can contain settings keyed by Git branch names:

```json
{
  "feature/my-project": {
    "username": "<username>",
    "password": "<password>"
  },
  "feature/another-project": {
    "jwt": "<token>"
  }
}
```

### Browser session via BLITZ

After signing in to BI via BLITZ, copy the value of the `LuxmsBI-User-Session` cookie and add it to your local `authConfig.json`:

```json
{
  "session": "<cookie-value>",
  "insecureSessionTls": false
}
```

Set `config.json` to the **HTTPS address of the BI server itself** and run `yarn start`. The session is validated through `/api/auth/check` and used by the proxy and the `pull`/`push` commands. In this mode, the development server listens only on `127.0.0.1`; starting it does not end the browser session.

When the session expires, update the cookie and restart the command. For a BI server with an untrusted certificate, the explicit `insecureSessionTls: true` option (`BI_INSECURE_SESSION_TLS=true`) disables certificate verification for session validation and synchronization. The default is `false`; the development proxy separately uses `secure: false`.
