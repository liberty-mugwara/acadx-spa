/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  UpdateStateOptions,
  ParentOptions,
  StudentOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'parent' })
export class Parent extends VuexModule {
  [index: string]: ModuleIndexType;
  id = 0;
  national_id = '';
  first_name = '';
  last_name = '';
  email = '';
  position = '';
  comments = '';
  work_phone_number = '';
  home_phone_number = '';
  join_date = '';
  employee_number = 0;
  user = {};
  school = 0;
  created_by = 0;
  next_of_kin = {
    id: 0,
    national_id: '',
    first_name: '',
    last_name: '',
    email: ''
  };
  address = {
    id: 0,
    address: '',
    suburb: '',
    country: 0,
    province: 0,
    city: 0
  };
  children: StudentOptions[] = [];

  changes: Record<string, string | boolean | number> = {};

  toCreate = {
    type: 'Parent',
    school_id: 0,
    national_id: '',
    first_name: '',
    last_name: ''
  };

  list: ParentOptions[] = [];
  detailsChanged = false;

  get schoolId() {
    return helpers.getState('school/id');
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: ParentOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toCreate.type = 'Parent';
    //cache parent
    helpers.cacheObj('parent', data);
  }

  @Action
  detail(parent: ParentOptions) {
    this.context.commit('update', parent);
    helpers.push('/schools/users/detail/');
  }

  @Action
  edit(parent: ParentOptions) {
    this.detail(parent);
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'parent',
      `${helpers.getBaseUrl()}/schools/parents/${this.id}`,
      this.changes
    );
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'parent',
      `${helpers.getBaseUrl()}/schools/parents/create/`,
      this.toCreate
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    if (this.schoolId)
      await helpers.listNoCache(
        'parent',
        `${helpers.getBaseUrl()}/schools/${this.schoolId}/parents/`,
        forceRequest
      );
  }
}
