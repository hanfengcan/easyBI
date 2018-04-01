// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import fontawesome from '@fortawesome/fontawesome'
// import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import '@fortawesome/fontawesome-free-solid/'

// fontawesome.library.add(fontawesomesolid)
Vue.use(fontawesome)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
