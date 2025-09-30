import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Debug: Log environment variables (remove in production)
console.log('CLIENT_ID:', CLIENT_ID ? 'Loaded' : 'MISSING');
console.log('API_KEY:', API_KEY ? 'Loaded' : 'MISSING');

// Initialize Google API
export const initializeGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID || !API_KEY) {
      reject(new Error('Missing Google API credentials. Check .env.local file'));
      return;
    }

    gapi.load('client:auth2', () => {
      console.log('gapi loaded, initializing client...');
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        console.log('Google API initialized successfully');
        console.log('Auth instance:', gapi.auth2.getAuthInstance() ? 'Available' : 'Not available');
        resolve();
      })
      .catch(error => {
        console.error('Error initializing Google API:', error);
        reject(error);
      });
    });
  });
};

// Sign in to Google
export const signInToGoogle = async () => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance) {
      console.error('Auth instance not available');
      return false;
    }
    await authInstance.signIn();
    console.log('Successfully signed in to Google');
    return true;
  } catch (error) {
    console.error('Error signing in to Google:', error);
    console.error('Error details:', error.error, error.details);
    return false;
  }
};

// Sign out from Google
export const signOutFromGoogle = () => {
  gapi.auth2.getAuthInstance().signOut();
};

// Check if user is signed in
export const isSignedIn = () => {
  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance && authInstance.isSignedIn.get();
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
