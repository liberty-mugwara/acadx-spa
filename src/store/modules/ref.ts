import { VuexModule, Module } from 'vuex-module-decorators';
import store from 'src/store';

@Module({ store: store, name: 'ref' })
class Ref extends VuexModule {}
export default Ref;
