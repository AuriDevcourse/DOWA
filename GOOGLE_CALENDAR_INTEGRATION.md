# Google Calendar Integration Guide

## Overview
This guide explains how to integrate Google Calendar with the "Important Dates" feature in your web app, so events created in Google Calendar automatically sync and appear in the app.

## Current Implementation
- Events are stored in `localStorage` under the key `'upcomingDates'`
- Manual entry through the UI
- No external sync

## Integration Approach

### Option 1: Simple One-Way Sync (Google Calendar → Web App)
This is the easiest approach where events from Google Calendar flow into your app.

#### Step 1: Set Up Google Calendar API

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable Google Calendar API

2. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins: `
   ` (dev) and your production URL
   - Add authorized redirect URIs
   - Download the client configuration

3. **Install Required Package**
   ```bash
   npm install @react-oauth/google gapi-script
   ```

#### Step 2: Create Google Calendar Service

Create `/src/services/googleCalendar.js`:

```javascript
import { gapi } from 'gapi-script';

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const API_KEY = 'YOUR_API_KEY_HERE';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Initialize Google API
export const initializeGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  });
};

// Sign in to Google
export const signInToGoogle = async () => {
  try {
    await gapi.auth2.getAuthInstance().signIn();
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    return false;
  }
};

// Sign out from Google
export const signOutFromGoogle = () => {
  gapi.auth2.getAuthInstance().signOut();
};

// Check if user is signed in
export const isSignedIn = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Fetch upcoming events from Google Calendar
export const fetchGoogleCalendarEvents = async (maxResults = 50) => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: 'startTime',
    });

    const events = response.result.items;
    
    // Transform Google Calendar events to your app's format
    return events.map(event => {
      const startDate = new Date(event.start.dateTime || event.start.date);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dayOptions = { weekday: 'long' };
      
      return {
        date: startDate.toLocaleDateString('en-US', options),
        day: startDate.toLocaleDateString('en-US', dayOptions),
        event: event.summary,
        type: categorizeEvent(event),
        icon: getIconForEvent(event),
        googleEventId: event.id, // Store Google event ID for reference
        source: 'google' // Mark as synced from Google
      };
    });
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
};

// Helper function to categorize events based on keywords
const categorizeEvent = (event) => {
  const summary = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  const text = summary + ' ' + description;
  
  if (text.includes('social') || text.includes('party') || text.includes('celebration')) return 'social';
  if (text.includes('conference') || text.includes('summit')) return 'conference';
  if (text.includes('launch') || text.includes('release')) return 'launch';
  if (text.includes('workshop') || text.includes('training')) return 'workshop';
  return 'meeting';
};

// Helper function to get icon based on event type
const getIconForEvent = (event) => {
  const type = categorizeEvent(event);
  const icons = {
    social: '🍻',
    conference: '🎪',
    meeting: '🤝',
    launch: '🚀',
    workshop: '🏗️'
  };
  return icons[type] || '📅';
};

// Sync Google Calendar with local storage
export const syncGoogleCalendar = async () => {
  if (!isSignedIn()) {
    return { success: false, message: 'Not signed in to Google' };
  }

  try {
    const googleEvents = await fetchGoogleCalendarEvents();
    
    // Get existing local events
    const localEventsStr = localStorage.getItem('upcomingDates');
    const localEvents = localEventsStr ? JSON.parse(localEventsStr) : [];
    
    // Filter out old Google-synced events
    const manualEvents = localEvents.filter(event => event.source !== 'google');
    
    // Combine manual events with new Google events
    const combinedEvents = [...manualEvents, ...googleEvents];
    
    // Sort by date
    combinedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save to localStorage
    localStorage.setItem('upcomingDates', JSON.stringify(combinedEvents));
    
    return { success: true, events: combinedEvents };
  } catch (error) {
    console.error('Error syncing calendar:', error);
    return { success: false, message: error.message };
  }
};
```

#### Step 3: Add Google Sign-In Component

Create `/src/components/GoogleCalendarSync.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { 
  initializeGoogleAPI, 
  signInToGoogle, 
  signOutFromGoogle, 
  isSignedIn,
  syncGoogleCalendar 
} from '@/services/googleCalendar';

export default function GoogleCalendarSync({ onSync }) {
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Initialize Google API when component mounts
    initializeGoogleAPI()
      .then(() => {
        setIsGoogleSignedIn(isSignedIn());
      })
      .catch(error => {
        console.error('Failed to initialize Google API:', error);
      });
  }, []);

  const handleSignIn = async () => {
    const success = await signInToGoogle();
    if (success) {
      setIsGoogleSignedIn(true);
      handleSync(); // Auto-sync after sign in
    }
  };

  const handleSignOut = () => {
    signOutFromGoogle();
    setIsGoogleSignedIn(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncGoogleCalendar();
    setIsSyncing(false);
    
    if (result.success) {
      setLastSyncTime(new Date());
      if (onSync) {
        onSync(result.events);
      }
    } else {
      alert('Failed to sync calendar: ' + result.message);
    }
  };

  return (
    <div className="glass-morphism rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Google Calendar</span>
        </div>
        
        {isGoogleSignedIn ? (
          <button
            onClick={handleSignOut}
            className="glass-morphism px-2 py-1 text-xs text-red-400 hover:text-red-300 rounded transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="glass-morphism px-2 py-1 text-xs text-green-400 hover:text-green-300 rounded transition-colors flex items-center gap-1"
          >
            <LogIn className="w-3 h-3" />
            Connect
          </button>
        )}
      </div>
      
      {isGoogleSignedIn && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="glass-morphism px-2 py-1 text-xs text-blue-400 hover:text-blue-300 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          
          {lastSyncTime && (
            <span className="text-xs text-white/50">
              Last sync: {lastSyncTime.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

#### Step 4: Update Departments Page

In `/src/pages/Departments.jsx`, add the Google Calendar sync component:

```javascript
// Add import at the top
import GoogleCalendarSync from '@/components/GoogleCalendarSync';

// Inside the component, add handler
const handleGoogleSync = (syncedEvents) => {
  setUpcomingDates(syncedEvents);
};

// Add the component in the Important Dates section (after line 494)
<GoogleCalendarSync onSync={handleGoogleSync} />
```

#### Step 5: Environment Variables

Create `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

Update `googleCalendar.js` to use env variables:
```javascript
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
```

---

### Option 2: Two-Way Sync (Bidirectional)
For events created in the app to also appear in Google Calendar:

1. Change SCOPES to include write access:
   ```javascript
   const SCOPES = 'https://www.googleapis.com/auth/calendar';
   ```

2. Add function to create events in Google Calendar:
   ```javascript
   export const createGoogleCalendarEvent = async (eventData) => {
     try {
       const event = {
         summary: eventData.event,
         start: {
           dateTime: new Date(eventData.date).toISOString(),
           timeZone: 'America/New_York',
         },
         end: {
           dateTime: new Date(new Date(eventData.date).getTime() + 3600000).toISOString(),
           timeZone: 'America/New_York',
         },
       };

       const response = await gapi.client.calendar.events.insert({
         calendarId: 'primary',
         resource: event,
       });

       return { success: true, event: response.result };
     } catch (error) {
       console.error('Error creating event:', error);
       return { success: false, error };
     }
   };
   ```

---

### Option 3: Webhook/Real-time Sync
For real-time updates when calendar changes:

1. Set up Google Calendar Push Notifications
2. Create a backend webhook endpoint
3. Update app when webhook receives calendar changes

This requires a backend server to receive webhooks.

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use OAuth 2.0** - Let users authenticate with their Google account
3. **Limit scopes** - Only request calendar read access if you don't need write
4. **Store tokens securely** - Don't store in localStorage, use secure cookies or session storage
5. **Validate on backend** - If possible, validate Google tokens on your backend

---

## Testing

1. Test with a Google Calendar that has various event types
2. Test sync with long event names
3. Test with recurring events
4. Test edge cases (all-day events, different timezones)
5. Test error handling (network issues, auth failures)

---

## Deployment Checklist

- [ ] Update authorized redirect URIs in Google Console with production URL
- [ ] Set environment variables in production
- [ ] Test OAuth flow in production
- [ ] Set up periodic auto-sync (every 5-10 minutes)
- [ ] Add loading states and error messages
- [ ] Consider rate limiting for API calls

---

## Alternative: Use Google Calendar Embed
If full integration is too complex, you can embed Google Calendar directly:

```javascript
<iframe 
  src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID" 
  style="border: 0" 
  width="800" 
  height="600"
  frameborder="0" 
  scrolling="no">
</iframe>
```

This is simpler but offers less customization.
