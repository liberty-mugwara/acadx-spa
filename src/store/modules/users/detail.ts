/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import * as helpers from 'src/helpers';
import {
  UserOptions,
  UpdateStateOptions,
  UserRolesOptions
} from 'src/interfaces';
@Module({ dynamic: true, store: store, namespaced: true, name: 'userDetail' })
export class UserDetail extends VuexModule {
  [index: string]: ModuleIndexType;
  cacheIndex: { groupIndex: number; index: number } = {
    groupIndex: -1,
    index: -1
  };
  date_joined = '';
  detailsChanged = false;
  email = '';
  first_name = '';
  id = 0;
  is_active = false;
  is_librarian = false;
  is_parent = false;
  is_school_admin = false;
  is_staff = false;
  is_student = false;
  is_superadmin = false;
  is_superuser = false;
  is_supervisor = false;
  is_teacher = false;
  last_name = '';
  list: Array<UserRolesOptions> = [];
  national_id = '';
  user_id = 0;
  user_role = '';

  changes: Record<string, string | boolean | number> = {};
  /* processed date */
  join_date = '';

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  public update(data: UserOptions): void {
    helpers.updateAcadxModule(this, data);
    //cache userDetail
    helpers.cacheObj('userDetail', data);
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'userDetail',
      `${helpers.getBaseUrl()}/users/special/${this.id}`,
      this.changes
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    await helpers.listNoCache(
      'userDetail',
      `${helpers.getBaseUrl()}/users/special/`,
      forceRequest
    );
  }
  @Action
  detail(user: UserRolesOptions) {
    this.context.commit('update', user);
    helpers.push('/acadx/special-user-detail/');
  }

  @Action
  edit(user: UserRolesOptions) {
    this.context.commit('update', user);
    helpers.push('/acadx/special-user-detail/');
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }
}
