const useAppSettings = () => {
  let settings = {};
  settings['app_email'] = 'noreply@example.com';
  settings['base_url'] = process.env.PUBLIC_SERVER_FILE || 'http://localhost:8888/';
  return settings;
};

module.exports = useAppSettings;
