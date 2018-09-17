import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index/index'
import main from '@/components/main/index'
import view from '@/components/view'

import '@/assets/index.css'
import '@/assets/common.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'main'
      }
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/main',
          name: 'main',
          component: main
        },
        {
          path: '/view',
          name: 'view',
          component: view
        },

      ]
    },

  ]
})
