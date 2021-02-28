import { VuexModule, Module, Action } from 'vuex-module-decorators';
import store from 'src/store';
import { ToRouterOptions } from 'src/interfaces';
@Module({ dynamic: true, store: store, namespaced: true, name: 'router' })
export class Router extends VuexModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;

  get router() {
    return this.store.$router;
  }

  @Action
  push(url: string | ToRouterOptions | number) {
    if (typeof url === 'number') this.store.$router.go(url);
    else this.store.$router.push(url);
  }
}
