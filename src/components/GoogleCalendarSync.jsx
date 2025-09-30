import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { gapi } from 'gapi-script';
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
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load and initialize Google API when component mounts
    const loadGoogleAPI = () => {
      initializeGoogleAPI()
        .then(() => {
          console.log('Google API initialized');
          setIsInitialized(true);
          setIsGoogleSignedIn(isSignedIn());
        })
        .catch(error => {
          console.error('Failed to initialize Google API:', error);
          setError('Failed to initialize: ' + error.message);
        });
    };

    // Check if gapi is already loaded
    if (window.gapi) {
      loadGoogleAPI();
    } else {
      // Wait a bit for gapi to load
      const timer = setTimeout(loadGoogleAPI, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSignIn = async () => {
    setError(null);
    const success = await signInToGoogle();
    if (success) {
      setIsGoogleSignedIn(true);
      handleSync(); // Auto-sync after sign in
    } else {
      setError('Failed to sign in to Google');
    }
  };

  const handleSignOut = () => {
    signOutFromGoogle();
    setIsGoogleSignedIn(false);
    setLastSyncTime(null);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    const result = await syncGoogleCalendar();
    setIsSyncing(false);
    
    if (result.success) {
      setLastSyncTime(new Date());
      if (onSync) {
        onSync(result.events);
      }
    } else {
      setError('Failed to sync calendar: ' + result.message);
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
            title="Sign out from Google"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="glass-morphism px-2 py-1 text-xs text-green-400 hover:text-green-300 rounded transition-colors flex items-center gap-1"
            title="Connect to Google Calendar"
          >
            <LogIn className="w-3 h-3" />
            Connect
          </button>
        )}
      </div>
      
      {error && (
        <div className="text-xs text-red-400 mb-2 p-2 glass-morphism rounded">
          {error}
        </div>
      )}
      
      {isGoogleSignedIn && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="glass-morphism px-2 py-1 text-xs text-blue-400 hover:text-blue-300 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
            title="Sync events from Google Calendar"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          
          {lastSyncTime && (
            <span className="text-xs text-white/50">
              {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
