import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueTidyRoutes from 'vue-tidyroutes'
import VueRouter from 'vue-router'

import './views/home'
import './components/category-search'

Vue.use(VueAxios, axios)
Vue.use(VueRouter)

Vue.directive('lowercase', {
  update: function(el) {
    el.value = el.value.toLowerCase()
  },
})

const router = new VueRouter({
  routes: VueTidyRoutes.export(),
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
