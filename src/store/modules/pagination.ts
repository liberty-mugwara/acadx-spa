import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import store from 'src/store';
import { UpdateStateOptions } from 'src/interfaces';
import * as helpers from 'src/helpers';
@Module({ dynamic: true, store: store, namespaced: true, name: 'page' })
export class Pagination extends VuexModule {
  pagination = false;
  currentPage = 0;
  limit = 10;
  totalItems = 1;
  /* left drawer */
  leftDrawerOpen = true;
  mini = false;
  miniState = false;
  activeMenu = 0;

  get maxPages() {
    return Math.ceil(this.totalItems / this.limit);
  }

  get currentOffset() {
    return (this.currentPage - 1) * this.limit;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
    if (arg.state === 'pagination' && !arg.value) this.currentPage = 0;
  }

  @Mutation
  toggleMiniMode() {
    this.leftDrawerOpen = true;
    this.mini = !this.mini;
    if (!this.mini) this.miniState = false;
    else this.miniState = true;
  }

  @Mutation
  miniStateOn() {
    if (this.mini) this.miniState = true;
  }

  @Mutation
  miniStateOff() {
    if (this.mini) this.miniState = false;
  }

  @Mutation
  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}
