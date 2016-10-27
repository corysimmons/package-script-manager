# Package Script Manager Example

<p align="center">
Based on [Boy boilerplate](https://github.com/corysimmons/boy)
A very opinionated, lightweight, version of HTML5 Boilerplate with conditionally-loaded polyfills and an opinionated CSS reset for firing up web projects in no time.
</p>

### Steps to run the Example
- Prior to running the steps below take a look at the following files
  - package.json
  - psm.js

```shell
$ npm install
$ npm start
```
- Now take a second look at the aforementioned files. Edit the psm.js file to uncomment `watch` tasks that were commented out for testing
- Run the following command

```shell
$ npm psm
```
- Re-exam the `package.json` file and take note of the newly added npm script tasks
  - Execute any of the npm script tasks to better understand the capabilities provided by npm as a build tool.

  ### example
  ```shell
  $ npm run lint
  $ npm run clean
  $ npm run build:css
  ```
