/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  UpdateStateOptions,
  StudentOptions,
  SelectOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'student' })
export class Student extends VuexModule {
  [index: string]: ModuleIndexType;
  id = 0;
  national_id = '';
  first_name = '';
  last_name = '';
  email = '';
  dob = '';
  sex = 1;
  sponsor = 0;
  current_level = 0;
  starting_level = 0;
  starting_term = 0;
  school_class = 0;
  terms_levels_attended = [];
  terms_levels_paid = [];
  graduation_date = '';
  comments = '';
  phone_number = '';
  join_date = '';
  user = {};
  parent_type = '';
  parent: Record<string, ModuleIndexType> = {};
  school = 0;
  created_by = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parents: SelectOptions[] = [];

  changes: Record<string, string | boolean | number> = {};

  toCreate = {
    type: 'Student',
    school_id: 0,
    parent_id: 0,
    parent_national_id: '',
    national_id: '',
    first_name: '',
    last_name: ''
  };

  list: StudentOptions[] = [];
  detailsChanged = false;
  sexes: SelectOptions[] = [
    { value: 1, label: 'male' },
    { value: 2, label: 'female' },
    { value: 3, label: 'other' }
  ];

  get schoolId() {
    return helpers.getState('school//id');
  }

  get terms(): SelectOptions[] {
    return helpers.getState('school//terms');
  }

  get levels(): SelectOptions[] {
    return helpers.getState('school//levels');
  }
  get classes(): SelectOptions[] {
    return helpers.getState('school//classes');
  }

  get schoolClassName() {
    const myClass = this.classes.find(
      myClass => myClass.value == this.school_class
    );
    return myClass?.label;
  }

  get startingTermName() {
    const term = this.terms.find(term => term.value == this.starting_term);
    return term?.label;
  }

  get currentLevelName() {
    const level = this.levels.find(level => level.value == this.current_level);
    return level?.label;
  }

  get startingLevelName() {
    const level = this.levels.find(level => level.value == this.starting_level);
    return level?.label;
  }

  get sexName() {
    const sex = this.sexes.find(sex => sex.value == this.sex);
    return sex?.label;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(data: StudentOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toCreate.type = 'Student';
    //cache the student
    helpers.cacheObj('student', data);
  }

  @Action
  detail(student: StudentOptions) {
    this.context.commit('update', student);
    helpers.push('/schools/students/detail/');
    helpers.setState('user/profile', 'student');
    helpers.rootCommit(this.parent_type + '/update', this.parent);
  }

  @Action
  edit(student: StudentOptions) {
    this.detail(student);
    helpers.notify(
      'info',
      'To edit user information click on the information you would like to change'
    );
  }

  @Action
  async commit() {
    await helpers.commitNoCache(
      'student',
      `${helpers.getBaseUrl()}/schools/students/${this.id}`,
      this.changes
    );
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'student',
      `${helpers.getBaseUrl()}/schools/students/create/`,
      this.toCreate
    );
  }

  @Action
  async getList(forceRequest?: boolean) {
    if (this.schoolId)
      await helpers.listNoCache(
        'student',
        `${helpers.getBaseUrl()}/schools/${this.schoolId}/students/`,
        forceRequest
      );
  }
}
