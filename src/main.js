// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
import App from './App'
import router from './router'
import moment from 'moment'
import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import config from './assets/js/config'
import functions from './assets/js/functions'
import global from './assets/js/global'

/*sso权限集成*/
axios.interceptors.request.use(
  rest => {
    let hash = location.href
    let ticket = ''
    if (hash.indexOf('?ticket=') !== -1) {
      ticket = hash.substring(hash.indexOf('=') + 1, hash.indexOf('#'))
    }
    rest.headers = {
      hash: hash.replace(`?ticket=${ticket}`, ''),
      ticket: ticket,
      'Content-type': 'application/json;charset=UTF-8'
    }
    return rest
  }
)
/**/

Vue.config.productionTip = false
// Vue.config.devtools = false
Vue.prototype.axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts
Vue.prototype.GLOBAL = global
Vue.prototype.CONFIG = config
Vue.prototype.FUNCTIONS = functions
Vue.use(ElementUI)

/*Vue.http.interceptors.push((request, next) => {
  request.withCredentials=true;
  next((response) => {
    return response;
  });

});*/
/* eslint-disable no-new*/
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
