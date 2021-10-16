import React, { PureComponent } from 'react'
import { existsSync } from 'fs-extra'
import { join } from 'path-extra'
import {
  Button,
} from '@blueprintjs/core'
import { spawn } from 'child_process'

const { remote } = window
const { APPDATA_PATH } = global

/* eslint-disable no-console */
const installPackage = fp => {
  if (!existsSync(fp)) {
    console.error(`File ${fp} does not exist.`)
    return
  }

  console.log(`Spawning npm to install ${fp} ...`)
  const p = spawn(
    'npm',
    ['install', fp],
    {cwd: join(APPDATA_PATH, 'plugins')}
  )
  let pOut = ''
  let pErr = ''

  p.stdout.on('data', d => { pOut += d.toString() })
  p.stderr.on('data', d => { pErr += d.toString() })

  p.on('close', code => {
    console.log(`Exited (${code})`)
    if (code !== 0) {
      console.warn('stdout:')
      console.warn(pOut)
      console.warn('stderr:')
      console.warn(pErr)
    }
  })
}
/* eslint-enable no-console */

class PacmanSettings extends PureComponent {
  handleOpen = () => {
    const {dialog} = remote
    if (dialog) {
      dialog.showOpenDialog({
      }).then(({canceled, filePaths}) => {
        if (filePaths.length !== 1)
          return
        const [filePath] = filePaths
        if (!canceled) {
          installPackage(filePath)
        }
      })
    }
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          style={{
            margin: '10px 20px',
          }}
          onClick={this.handleOpen}
        >
          Install .tgz file
        </Button>
      </div>
    )
  }
}

export {
  PacmanSettings,
}
