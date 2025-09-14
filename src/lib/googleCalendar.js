import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Load environment variables for standalone Node.js usage
if (typeof process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH === 'undefined') {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Go up from src/lib/ to project root
    const envPath = path.join(__dirname, '../../.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('Could not load .env.local file:', error.message);
  }
}

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * Load saved credentials if they exist
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(process.env.GOOGLE_CALENDAR_TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Save credentials to token file
 */
async function saveCredentials(client) {
  const content = await fs.readFile(process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(process.env.GOOGLE_CALENDAR_TOKEN_PATH, payload);
}

/**
 * Authorize and return authenticated client
 */
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  try {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH,
    });
    
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  } catch (error) {
    console.error('Google Calendar authentication error:', error);
    throw error;
  }
}

/**
 * Get authenticated Google Calendar service
 */
export async function getCalendarService() {
  const auth = await authorize();
  return google.calendar({ version: 'v3', auth });
}
