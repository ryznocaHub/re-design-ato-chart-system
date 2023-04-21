
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import {authStore} from "../store/auth-store"


const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    component: Home,

  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/map',
    name: 'Map',
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Map.vue')
  },
  {
    path: '/orikomi_map',
    name: 'OrikomiMap',
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OrikomiMap.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Cart.vue')
  },
  {
    path:'/orders',
    name:'Orders',
    meta: { requiresAuth: true },

    component: () => import('../views/Orders.vue')
  },
  {
    path:'/orders_orikomi',
    name:'OrdersOrikomi',
    meta: { requiresAuth: true },

    component: () => import('../views/OrdersOrikomi.vue')
  },
  {
    path:'/order/:id',
    name:'OrderDetail',
    meta: { requiresAuth: true },

    component: () => import('../views/OrderDetail.vue')
  },
  {
    path:'/order_orikomi/:order_key',
    name:'OrderDetailOrikomi2',
    meta: { requiresAuth: true },

    component: () => import('../views/OrderDetailOrikomi2.vue')
  },
  {
    path:'/accounts/manage',
    name:'AccountsManage',
    meta: { requiresAuth: true },
    component: () => import('../views/AccountsManage.vue')
  },
  {
    path:'/myAccount',
    name:'MyAccountManage',
    meta: { requiresAuth: true },
    component: () => import('../views/MyAccountManage.vue')
  },
  {
    path:'/scroll_test',
    name:'ScrollTest',
    meta: { requiresAuth: true },

    component: () => import('../views/ScrollTest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(authStore.getters.isAuthorized)
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.getters.isAuthorized) {
    next({ path: '/login', query: { redirect: to.fullPath }});
   // location.href = "/login"
  } else {
    next();
  }
});

export default router

//router
