#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import meow from 'meow'

export default (() => {
  const cli = meow(`
Usage
  $ psm [input] [target]

Options
  -i, --input   Source JavaScript to pull psm({}) object of scripts from. (default: psm.js)
  -t, --target  Target file to destructively overwrite with package scripts. (default: package.json)
  -h, --help

Examples
  $ psm
  $ psm --input package-script-manager.js  # Descriptive filename
  $ psm --target package.dry.json  # Do a dry run
  `, {
    alias: {
      i: 'input',
      t: 'target',
      h: 'help'
    }
  })

  // Set defaults that can be overridden by cli input position or flags
  let input = 'psm.js'
  let target = 'package.json'

  if (cli.input[0]) input = cli.input[0]
  if (cli.input[1]) target = cli.input[1]

  if (cli.flags.input) input = cli.flags.input
  if (cli.flags.target) target = cli.flags.target

  const cliInput = input
  const cliTarget = target

  input = path.resolve(input)
  target = path.resolve(target)

  let inputData = ''
  try {
    inputData = require(input)
  } catch (err) {
    console.error(err)
  }

  let targetData = JSON.parse(fs.readFileSync(target, 'utf8'))

  // if package.json is an empty object
  if (Object.keys(targetData).length === 0) {
    targetData['scripts'] = inputData
  } else {
    // map over existing package.json for "scripts", if it exists, assign new scripts to it, else create it with new scripts
    Object.keys(targetData).map(key => {
      // if "scripts" exists in target package.json
      if (key === 'scripts') {
        // assign new scripts to it
        targetData[key] = inputData
      } else {
        // create "scripts" in target package.json with new scripts
        targetData['scripts'] = inputData
      }
    })
  }
  // add psm script to package.json
  targetData['scripts']['psm'] = `psm ${cliInput} ${cliTarget}`
  targetData['scripts']['psm:watch'] = `chokidar ${cliInput} -c 'npm run psm'`

  // write new package.json to target
  fs.writeFileSync(target, JSON.stringify(targetData, null, 2))
})()
