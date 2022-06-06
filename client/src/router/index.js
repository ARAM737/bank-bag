import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {title: 'Логин'},
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import('../views/Registration.vue'),
    meta: {title: 'Регистрация'},
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/private/Monitoring.vue'),
    meta: {title: 'Аккаунт пользователя', auth: true},
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('../views/private/Updateaccidents.vue'),
    meta: {title: 'Добавление записи', auth: true},
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    ...routes,
  ]
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.auth);

  document.title = to.meta.title;

  if(requireAuth && store.state.token === '') {
    next('/login')
  } else {
    next()
  }

});

export default router;
