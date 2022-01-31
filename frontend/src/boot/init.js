import Vue from 'vue';
// import Router from '../router';
// import App from '../App.vue';
import * as store from '../store/index';
import config from 'src/config';
import { Loader } from '@googlemaps/js-api-loader';
import * as GmapVue from 'gmap-vue';
import 'assets/scss/main.scss';
import modalCommon from 'components/share/modalCommon';
// module
Vue.config.productionTip = false;
Vue.use(GmapVue, {
  load: { key: config.gmap, libraries: 'places,drawing,geometry' }
});

Vue.prototype.$splitString = (val, length) => {
  if (val && val.length > length) {
    return val.substring(0, length) + '...';
  } else {
    return val;
  }
};
Vue.component(modalCommon.name, modalCommon);
const google = async () => {
  if (typeof google.instance === 'object') {
    return google.instance;
  }
  const loader = new Loader({
    apiKey: config.gmap,
    version: 'weekly',
    libraries: ['places'],
    language: 'en'
  });
  try {
    google.instance = await loader.load();

    return google.instance;
  } catch (error) {
    return error;
  }
};

Vue.prototype.$google = google;

// new Vue({
//   store,
//   apolloProvider,
//   render: (h) => h(App)
// }).$mount('#q-app');
