// frontend/src/utils/googleMapsLoader.js
let isLoading = false;
let isLoaded = false;
const callbacks = [];
const SCRIPT_ID = 'google-maps-js-api';
const CALLBACK_NAME = '__pvmsGoogleMapsInit';
const LOAD_TIMEOUT_MS = 15000;
let loadTimeoutId = null;

const flushCallbacks = (error) => {
  callbacks.forEach((cb) => cb(error));
  callbacks.length = 0;
};

const ensureMapsReady = async () => {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API unavailable');
  }

  // Newer Maps API loading flows require explicitly importing libraries
  // before constructors like google.maps.Map are guaranteed to exist.
  if (typeof window.google.maps.importLibrary === 'function') {
    await window.google.maps.importLibrary('maps');
    await window.google.maps.importLibrary('marker');
  }

  if (typeof window.google.maps.Map !== 'function') {
    throw new Error('Google Maps failed to initialize Map constructor');
  }
};

const clearLoadTimeout = () => {
  if (loadTimeoutId) {
    window.clearTimeout(loadTimeoutId);
    loadTimeoutId = null;
  }
};

const completeWithError = (error) => {
  clearLoadTimeout();
  isLoading = false;
  flushCallbacks(error);
};

const completeSuccess = () => {
  clearLoadTimeout();
  isLoading = false;
  isLoaded = true;
  flushCallbacks();
};

export const loadGoogleMaps = (callback) => {
  if (isLoaded) {
    ensureMapsReady()
      .then(() => callback())
      .catch((error) => callback(error));
    return;
  }

  callbacks.push(callback);

  if (isLoading) {
    return;
  }

  isLoading = true;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key not found in environment variables');
    isLoading = false;
    flushCallbacks(new Error('API key missing'));
    return;
  }

  window[CALLBACK_NAME] = async () => {
    try {
      await ensureMapsReady();
      completeSuccess();
    } catch (error) {
      completeWithError(error);
    }
  };

  const existingScript = document.getElementById(SCRIPT_ID);
  if (existingScript) {
    // If script already exists, callback will fire once Maps is ready.
    loadTimeoutId = window.setTimeout(() => {
      completeWithError(new Error('Timed out while loading Google Maps'));
    }, LOAD_TIMEOUT_MS);
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async&libraries=marker&callback=${CALLBACK_NAME}`;
  script.async = true;
  script.defer = true;

  script.onerror = () => {
    completeWithError(new Error('Failed to load Google Maps'));
  };

  loadTimeoutId = window.setTimeout(() => {
    completeWithError(new Error('Timed out while loading Google Maps'));
  }, LOAD_TIMEOUT_MS);

  document.head.appendChild(script);
};
