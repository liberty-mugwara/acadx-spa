/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  UpdateStateOptions,
  TeacherOptions,
  StudentOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'teacher' })
export class Teacher extends VuexModule {
  [index: string]: ModuleIndexType;
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
    type: 'Teacher',
    school_id: 0,
    national_id: '',
    first_name: '',
    last_name: ''
  };

  detailsChanged = false;

  list: TeacherOptions[] = [];

  get schoolId() {
    return helpers.getState('school/id');
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: TeacherOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toCreate.type = 'Teacher';
    //cache teacher
    helpers.cacheObj('teacher', data);
  }

  @Action
  detail(teacher: TeacherOptions) {
    this.context.commit('update', teacher);
    helpers.push('/schools/users/detail/');
  }

  @Action
  edit(teacher: TeacherOptions) {
    this.detail(teacher);
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'teacher',
      `${helpers.getBaseUrl()}/schools/teachers/${this.id}`,
      this.changes
    );
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'teacher',
      `${helpers.getBaseUrl()}/schools/teachers/create/`,
      this.toCreate
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    if (this.schoolId) {
      await helpers.listNoCache(
        'teacher',
        `${helpers.getBaseUrl()}/schools/${this.schoolId}/teachers/`,
        forceRequest
      );
    }
  }

  @Action
  async getListSilent() {
    if (this.schoolId && helpers.getState('user/group_4')) {
      const response = await helpers.get(
        `${helpers.getBaseUrl()}/schools/${this.schoolId}/teachers/`,
        false
      );
      response && helpers.setState('teacher/list', response.data);
    }
  }
}
