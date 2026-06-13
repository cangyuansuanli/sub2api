#!/usr/bin/env node
/**
 * Upload frontend/static-assets/** to Cloudflare R2 (S3-compatible).
 * Skips unchanged objects by comparing local MD5 with remote ETag.
 * Reads frontend/.env.local for credentials.
 *
 * Usage:
 *   node scripts/upload-r2-assets.mjs          # skip unchanged
 *   node scripts/upload-r2-assets.mjs --force  # re-upload all
 */

import { createReadStream, readFileSync, readdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const FRONTEND_ROOT = fileURLToPath(new URL('..', import.meta.url))
const ROOT = join(FRONTEND_ROOT, 'static-assets')
const ENV_FILE = join(FRONTEND_ROOT, '.env.local')
const FORCE = process.argv.includes('--force')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(ENV_FILE)

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucket = process.env.R2_BUCKET
const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')

function required(name, value) {
  if (!value) {
    console.error(`Missing env: ${name}`)
    process.exit(1)
  }
  return value
}

required('R2_ACCOUNT_ID', accountId)
required('R2_ACCESS_KEY_ID', accessKeyId)
required('R2_SECRET_ACCESS_KEY', secretAccessKey)
required('R2_BUCKET', bucket)

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
})

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.json': 'application/json',
  '.js': 'text/javascript',
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

function contentType(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
  return MIME[ext] || 'application/octet-stream'
}

function fileMd5Hex(filePath) {
  const hash = createHash('md5')
  hash.update(readFileSync(filePath))
  return hash.digest('hex')
}

function normalizeEtag(etag) {
  if (!etag) return null
  const trimmed = etag.replace(/^"|"$/g, '')
  // Multipart uploads use ETag like "abc-5" — always re-upload to be safe.
  if (trimmed.includes('-')) return null
  return trimmed.toLowerCase()
}

async function remoteMd5(key) {
  try {
    const res = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return normalizeEtag(res.ETag)
  } catch (err) {
    const status = err?.$metadata?.httpStatusCode
    const code = err?.name || err?.Code
    if (status === 404 || code === 'NotFound' || code === 'NoSuchKey') return null
    throw err
  }
}

async function uploadFile(filePath) {
  const key = relative(ROOT, filePath).split('\\').join('/')
  const localMd5 = fileMd5Hex(filePath)

  if (!FORCE) {
    const remote = await remoteMd5(key)
    if (remote && remote === localMd5) {
      console.log(`  ○ ${key} (unchanged, md5=${localMd5.slice(0, 8)}…)`)
      return 'skipped'
    }
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(filePath),
      ContentType: contentType(filePath),
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )
  const url = publicBase ? `${publicBase}/${key.split('/').map(encodeURIComponent).join('/')}` : key
  console.log(`  ✓ ${key}${publicBase ? `\n    ${url}` : ''}`)
  return 'uploaded'
}

async function main() {
  const files = walk(ROOT)
  if (files.length === 0) {
    console.error('No files in static-assets/')
    process.exit(1)
  }

  console.log(
    `${FORCE ? 'Force uploading' : 'Syncing'} ${files.length} file(s) to R2 bucket "${bucket}"…`
  )

  let uploaded = 0
  let skipped = 0
  for (const file of files) {
    const result = await uploadFile(file)
    if (result === 'skipped') skipped += 1
    else uploaded += 1
  }

  console.log(`\nDone. uploaded=${uploaded}, skipped=${skipped}${FORCE ? ' (force)' : ''}.`)
  if (publicBase) {
    console.log(`Set VITE_STATIC_CDN=${publicBase} before building the frontend.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
