module.exports = {
  id: process.env.ID,
  production:
    process.env.NODE_ENV == 'testing' ||
    process.env.NODE_ENV == 'staging' ||
    process.env.NODE_ENV == 'production',
  env: process.env.NODE_ENV,
  vue_app_base_url: process.env.VUE_APP_BASE_URL,
  gmap: process.env.GMAP
};
