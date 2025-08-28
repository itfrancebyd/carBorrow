// const express = require('express')
import express from 'express'
import 'dotenv/config'

const app = express()
const port = '3001'
const env_data = process.env

import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
const supabase = createClient(env_data.SUPABASE_URL, env_data.SUPABASE_PUBLISHABLE_KEY)

const {data,error} = await supabase.from('car fleet').select()
console.log(data)

app.get('/', (req, res) => {
    res.send('test get')
})

app.listen(port, () => {
    console.log("server runs on the port: " + port)
})