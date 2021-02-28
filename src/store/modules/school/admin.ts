/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  SchoolAdminOptions,
  UpdateStateOptions,
  StudentOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'schoolAdmin' })
export class SchoolAdmin extends VuexModule {
  [index: string]: ModuleIndexType;
  baseUrl = 'https://morning-hamlet-81284.herokuapp.com';
  id = 0;
  national_id = '';
  first_name = '';
  last_name = '';
  email = '';
  position = '';
  comments = '';
  phone_number = '';
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
    type: 'School Admin',
    school_id: 0,
    national_id: '',
    first_name: '',
    last_name: ''
  };

  list: SchoolAdminOptions[] = [];
  detailsChanged = false;

  get schoolId() {
    return helpers.getState('school/id');
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: SchoolAdminOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toCreate.type = 'School Admin';
    //cache schoolAdmin
    helpers.cacheObj('schoolAdmin', data);
  }

  @Action
  detail(admin: SchoolAdminOptions) {
    this.context.commit('update', admin);
    helpers.push('/schools/users/detail/');
  }

  @Action
  edit(admin: SchoolAdminOptions) {
    this.detail(admin);
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'schoolAdmin',
      `${helpers.getBaseUrl()}/schools/admins/${this.id}`,
      this.changes
    );
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'schoolAdmin',
      `${helpers.getBaseUrl()}/schools/admins/create/`,
      this.toCreate
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    await helpers.listNoCache(
      'schoolAdmin',
      `${helpers.getBaseUrl()}/schools/${this.schoolId}/admins/`,
      forceRequest
    );
  }
}
