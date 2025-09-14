import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Load environment variables for standalone Node.js usage
if (typeof process.env.GOOGLE_CLIENT_ID === 'undefined') {
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
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(process.env.GOOGLE_CALENDAR_TOKEN_PATH, payload);
}

/**
 * Create OAuth2 client from environment variables
 */
function createOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  return oauth2Client;
}

/**
 * Authorize and return authenticated client
 */
export async function authorize() {
  // First try to load saved credentials
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  
  // If no saved credentials, create OAuth2 client
  const oauth2Client = createOAuth2Client();
  
  // Check if we have a refresh token in environment variables
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    return oauth2Client;
  }
  
  // If no refresh token, we need to get authorization
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('🔐 Google Calendar Authorization Required');
  console.log('📋 Please visit this URL to authorize the application:');
  console.log(authUrl);
  console.log('\n📝 After authorization, you will receive a code.');
  console.log('💡 Add the refresh token to your .env.local file as GOOGLE_REFRESH_TOKEN');
  console.log('\n🚨 For now, using existing token.json if available...');
  
  // Try to use existing token.json as fallback
  try {
    const content = await fs.readFile('./token.json');
    const credentials = JSON.parse(content);
    oauth2Client.setCredentials(credentials);
    return oauth2Client;
  } catch (error) {
    console.error('❌ No valid credentials found. Please complete OAuth flow.');
    throw new Error('Google Calendar authentication required. Please complete OAuth flow and add GOOGLE_REFRESH_TOKEN to environment variables.');
  }
}

/**
 * Get authenticated Google Calendar service
 */
export async function getCalendarService() {
  const auth = await authorize();
  return google.calendar({ version: 'v3', auth });
}
