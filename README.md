# sqhtml

Base to start projects in HTML, simply and quickly.

## Requirements

- Minimum Node v16.7.0

## Installation

1. Open a terminal at the root of your project

2. Optional step: run the following command in a terminal if your project 
   is completely empty or presents location errors upon installation.
   
   ```bash
   npm init
   ```

3. Execute
   
   ```bash
   npm i sqhtml
   npm explore sisass -- npm run init -- --dep sqhtml
   ```

4. Rename the gitignore file
   
   ```bash
   mv gitignore .gitignore
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
