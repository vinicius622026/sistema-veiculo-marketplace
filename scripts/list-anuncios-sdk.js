#!/usr/bin/env node
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function listBucket(bucket) {
  try {
    const { data, error } = await supabase.storage.from(bucket).list('')
    if (error) {
      console.error('SDK list error:', error.message || error)
      process.exit(1)
    }
    console.log(`Objects in bucket '${bucket}':`)
    console.log(data)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

listBucket('anuncios')
