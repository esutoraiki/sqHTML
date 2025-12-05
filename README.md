# sqHTML

Base to start projects in HTML, simply and quickly.

## Requirements

- Minimum Node v16.7.0

## Installation

1. Open a terminal at the root of your project.
2. Optional (empty project): initialize npm metadata.
   
   ```bash
   npm init
   ```
3. Install:
   
   ```bash
   npm i sqhtml
   ```
   
   The postinstall will copy `files/` into your project, run `npm explore sisass -- npm run init -- --dep sqhtml`, and handle `gitignore` -> `.gitignore`. If `.gitignore` already exists, the duplicate `gitignore` is removed.

### Skipping sisass init

Set the environment variable if you need to bypass the sisass init during CI or custom workflows:

```bash
SKIP_SISASS_INIT=1 npm i sqhtml
```

## Server

To run the site if you don't have a configured localhost, run the following command:

```bash
nodemon --ext html,js,css,scss ./config/serve.js
```

In another terminal, run the gulp task with the -browser parameter as follows:

```bash
gulp -browser
```

If you want the browser to refresh when you make changes, you can run the gulp command with the following parameter

```bash
gulp -browser -sync
```
