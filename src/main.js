import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueScroller from 'vue-scroller'





import './common/stylus/fonts.styl'


import moment from 'moment'
import './mock/mockServer' // 引入加载模块
import './common/stylus/fonts.styl'




Vue.use(VueResource)
Vue.use(VueScroller)


Vue.config.productionTip = false



// 注册全局的过滤器
Vue.filter('date-string', function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
})


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})