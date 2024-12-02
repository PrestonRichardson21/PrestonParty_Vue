import { createRouter, createWebHistory } from 'vue-router';
import TATBCardList from './pages/tatb/TATBCardList.vue';
import HotSeatCardList from './pages/hotseat/HotSeatCardList.vue';
import NotFound from './pages/NotFound.vue';
import TATBRules from './pages/tatb/TATBRules.vue';
import HotSeatRules from './pages/hotseat/HotSeatRules.vue';
import RegisterAnswer from './pages/tatb/RegisterAnswer.vue';
import UserAuth from './pages/auth/UserAuth.vue';
import store from './store/index.js';




const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tatb' },
    { path: '/tatb', component: TATBCardList, meta: { requiresAuth: true } },
    { path: '/hotseat', component: HotSeatCardList, meta: { requiresAuth: true } },
    { path: '/tatb/rules', component: TATBRules },
    { path: '/hotseat/rules', component: HotSeatRules },
    { path: '/:notFound(.*)', component: NotFound },
    { path: '/tatb/answer', component: RegisterAnswer, meta: { requiresAuth: true } },
    // {path: '/tatb/answerDetail', component: AnswerDetail},
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },

  ]

});

//redirects to the auth page if the user is not authenticated & redirects to home if they go to pages that require unauth
router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;

