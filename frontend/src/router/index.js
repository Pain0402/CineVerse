// src/router/index.js
import { createWebHistory, createRouter } from 'vue-router'
import AuthView from '@/views/AuthView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'), // Trang chủ
  },
  {
    path: '/movies/:id',
    name: 'movie.detail',
    component: () => import('@/views/MovieDetailView.vue'), // Trang chi tiết phim
    props: true, // Cho phép truyền params làm props
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('@/views/MovieManagementView.vue'), // Trang thêm phim (Admin)
  },
  // {
  //   path: '/profile',
  //   name: 'user.profile',
  //   component: () => import('@/views/UserProfile.vue'), // Trang profile người dùng
  // },
  {
    path: '/watchlist',
    name: 'user.watchlist',
    component: () => import('@/views/WatchListView.vue'), // Trang danh sách xem
  },
  // // Các route cho đăng ký, đăng nhập
  // {
  //   path: '/register',
  //   name: 'auth.register',
  //   component: () => import('@/views/AuthPage.vue'), // Hoặc một component Register riêng
  // },
  // {
  //   path: '/login',
  //   name: 'auth.login',
  //   component: () => import('@/views/AuthPage.vue'), // Hoặc một component Login riêng
  // },
  // Route 404
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'notfound',
  //   component: () => import('@/views/NotFound.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
