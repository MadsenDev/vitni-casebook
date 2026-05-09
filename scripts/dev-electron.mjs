import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import http from 'node:http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const statePath = path.join(repoRoot, '.casebook-dev-server.json')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function readRendererUrl() {
  const raw = fs.readFileSync(statePath, 'utf8')
  const parsed = JSON.parse(raw)
  if (!parsed.url || typeof parsed.url !== 'string') {
    throw new Error(`Missing dev server URL in ${statePath}.`)
  }
  return parsed.url
}

const scriptStart = Date.now()

async function waitForFile(filePath, timeoutMs) {
  const start = Date.now()
  while (true) {
    if (fs.existsSync(filePath)) {
      const mtime = fs.statSync(filePath).mtimeMs
      if (mtime >= scriptStart) return
    }
    if (Date.now() - start > timeoutMs) throw new Error(`Timed out waiting for fresh ${filePath}.`)
    await sleep(250)
  }
}

async function waitForHttp(url, timeoutMs) {
  const start = Date.now()
  while (true) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, res => {
          res.resume()
          if (res.statusCode >= 200 && res.statusCode < 500) { resolve(undefined); return }
          reject(new Error(`Status ${res.statusCode}`))
        })
        req.on('error', reject)
        req.setTimeout(1000, () => req.destroy(new Error('Timeout')))
      })
      return
    } catch {
      if (Date.now() - start > timeoutMs) throw new Error(`Timed out waiting for ${url}.`)
      await sleep(500)
    }
  }
}

const rendererUrl = readRendererUrl()
const timeoutMs = 60_000

await Promise.all([
  waitForFile(path.join(repoRoot, 'dist/main/app/main/main.js'), timeoutMs),
  waitForFile(path.join(repoRoot, 'dist/preload/app/preload/preload.js'), timeoutMs),
  waitForHttp(rendererUrl, timeoutMs),
])

const electronBinary =
  process.platform === 'win32'
    ? path.join(repoRoot, 'node_modules', '.bin', 'electron.cmd')
    : path.join(repoRoot, 'node_modules', '.bin', 'electron')

const child = spawn(electronBinary, ['.'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    CASEBOOK_DEV_SERVER_URL: rendererUrl,
  },
})

child.on('exit', (code, signal) => {
  if (signal) { process.kill(process.pid, signal); return }
  process.exit(code ?? 0)
})
