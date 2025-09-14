#!/usr/bin/env node

/**
 * Google OAuth Refresh Token Helper
 * 
 * This script helps you get a Google OAuth refresh token for the calendar API.
 * Run this script once to get your refresh token, then add it to your .env.local file.
 */

import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

async function getRefreshToken() {
  console.log('🔐 Google OAuth Refresh Token Helper');
  console.log('=====================================\n');

  // Check if we have the required environment variables
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Missing required environment variables:');
    console.error('   - GOOGLE_CLIENT_ID');
    console.error('   - GOOGLE_CLIENT_SECRET');
    console.error('\n💡 Please add these to your .env.local file first.');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob' // For desktop applications
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('📋 Please visit this URL to authorize the application:');
  console.log(authUrl);
  console.log('\n📝 After authorization, you will receive a code.');
  console.log('💡 Copy and paste that code below.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the authorization code: ', async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      console.log('\n✅ Success! Your refresh token is:');
      console.log(tokens.refresh_token);
      console.log('\n📝 Add this to your .env.local file:');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('\n🎉 You can now remove the credentials.json file!');

      rl.close();
    } catch (error) {
      console.error('\n❌ Error getting refresh token:', error.message);
      rl.close();
      process.exit(1);
    }
  });
}

getRefreshToken().catch(console.error);
