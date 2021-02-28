import { VuexModule, Module, Mutation } from 'vuex-module-decorators';
import store from 'src/store';

@Module({ dynamic: true, store: store, name: 'loader' })
class Loader extends VuexModule {
  loading = false;
  active = 0;
  message = 'Fetching data';

  //! this must be called after updating active loaders
  @Mutation
  public load(state: boolean) {
    if (state == false && this.active == 0) this.loading = false;
    else if (state == true && this.active > 0) this.loading = true;
  }

  @Mutation
  public updateMsg(msg: string) {
    this.message = msg;
  }

  @Mutation
  public addLoader() {
    this.active++;
  }
  @Mutation
  public removeLoader() {
    if (this.active > 0) {
      this.active--;
    }
  }
}
export default Loader;
