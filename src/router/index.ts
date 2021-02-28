import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import { StoreStateOptions } from '../store';
import routes from './routes';
import { getState } from '../helpers';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route<StoreStateOptions>(function({ Vue }) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });
  Router.beforeEach((to, from, next) => {
    if (to.name === from.name) {
    } else if (
      to.name === 'acadxSignin' &&
      getState('user/user_id') &&
      getState('user/is_active')
    )
      next({ name: 'home' });
    else next();
  });

  return Router;
});
