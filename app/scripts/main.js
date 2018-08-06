import 'styles/lib/foundation.css';
import 'styles/lib/v-tooltip.css';
import 'styles/index.scss';

import VTooltip from 'v-tooltip';
import { sync } from 'vuex-router-sync';
import VeeValidate from 'vee-validate';

import Vue from 'vue';
import App from './App';

import store from './store';
import router from './router';

sync(store, router);

Vue.use(VTooltip);
Vue.use(VeeValidate);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store,
  router,
});
