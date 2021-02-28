/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  UpdateStateOptions,
  LibrarianOptions,
  StudentOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'librarian' })
export class Librarian extends VuexModule {
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
    type: 'Librarian',
    school_id: 0,
    national_id: '',
    first_name: '',
    last_name: ''
  };

  list: LibrarianOptions[] = [];
  detailsChanged = false;

  get schoolId() {
    return helpers.getState('school/id');
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: LibrarianOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toCreate.type = 'Librarian';
    //cache librarian
    helpers.cacheObj('librarian', data);
  }

  @Action
  detail(librarian: LibrarianOptions) {
    this.context.commit('update', librarian);
    helpers.push('/schools/users/detail/');
  }

  @Action
  edit(librarian: LibrarianOptions) {
    this.detail(librarian);
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'librarian',
      `${helpers.getBaseUrl()}/schools/librarian/${this.id}`,
      this.changes
    );
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'librarian',
      `${helpers.getBaseUrl()}/schools/librarians/create/`,
      this.toCreate
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    if (this.schoolId)
      await helpers.listNoCache(
        'librarian',
        `${helpers.getBaseUrl()}/schools/${this.schoolId}/librarians/`,
        forceRequest
      );
  }
}
