const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_SERVICES_JSON = process.env.GOOGLE_SERVICES_JSON;

module.exports = ({ config }) => {
  config.android.config.googleMaps.apiKey = GOOGLE_MAPS_API_KEY;
  config.android.googleServicesFile = GOOGLE_SERVICES_JSON;

  return {
    ...config,
  };
};
