/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import { NextOfKinOptions, UpdateStateOptions } from 'interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'nextOfKin' })
export class NextOfKin extends VuexModule implements NextOfKinOptions {
  [index: string]: ModuleIndexType;
  id = 0;
  first_name = '';
  last_name = '';
  national_id = '';
  phone_number = '';
  email = '';
  detailsChanged = false;
  changes: Record<string, string | boolean | number> = {};

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: NextOfKinOptions): void {
    helpers.updateAcadxModule(this, data);
  }

  @Action
  async commit() {
    const owner = await helpers.commit(
      'nextOfKin',
      `${helpers.getBaseUrl()}/schools/next-of-kin/${this.id}`,
      this.changes
    );
    owner && this.context.commit('update', owner.next_of_kin);
  }
}
