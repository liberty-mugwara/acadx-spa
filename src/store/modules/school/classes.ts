/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  LevelOptions,
  SchoolClassOptions,
  SchoolOptions,
  UserOptions,
  UpdateStateOptions,
  ClassSubjectTeacherOptions,
  SelectOptions
} from 'src/interfaces';

import * as helpers from 'src/helpers';
import { isClassCreateOptions } from 'src/type-guards';

@Module({ dynamic: true, store: store, namespaced: true, name: 'classes' })
export class Classes extends VuexModule {
  [index: string]: ModuleIndexType;
  id = 0;
  name = '';
  subjects: number[] = [];
  subjects_teachers: Partial<ClassSubjectTeacherOptions>[] = [];
  level: Partial<LevelOptions> = {};
  created_by: Partial<UserOptions> = {};
  detailsChanged = false;
  toCreate: {
    level_id: number;
    name: string;
  }[] = [];

  get levels() {
    return helpers.getState('school/acadx_schoollevels');
  }

  get cacheIndex() {
    return helpers.getState('school/cacheIndex');
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    if (isClassCreateOptions(arg.value)) {
      if (arg.state == 'toCreate.name')
        this.toCreate[arg.value.index].name = arg.value.name;
      if (arg.state == 'toCreate.') this.toCreate.push(arg.value);
      return;
    }
    helpers.updateState(arg);
  }

  @Mutation
  setLevel(level: Partial<LevelOptions>) {
    this.level = level;
    this.toCreate.length = 0;
    this.detailsChanged = false;
  }

  @Mutation
  update(myClass: SchoolClassOptions) {
    helpers.updateAcadxModule(this, myClass, ['subjects', 'created_by']);
    this.subjects.length = 0;
    for (const subject of myClass.subjects) this.subjects.push(subject.subject);
  }

  @Action
  async create() {
    helpers.load('Creating classes ...');
    const response = await helpers.post(
      `${helpers.getBaseUrl()}/schools/classes/`,
      {
        classes: this.toCreate
      }
    );
    helpers.stopLoader();
    if (response) {
      const school: SchoolOptions = response.data;
      const cachedSchool = await helpers.rootDispatch(
        'data/getCachedObject',
        'school'
      );
      school.cacheIndex = cachedSchool.cacheIndex;
      //school update offered by updateList
      helpers.updateList('school', school);
      const level = school.acadx_schoollevels.find(
        level => level.id == this.level.id
      );
      if (level) {
        this.context.commit('setLevel', level);
      }
      helpers.notify('positive', 'Classes created successfully');
    }
  }

  @Action
  async addSubjects(data: { classId: number; subjects: number[] }) {
    helpers.load(`Adding subjects to ${this.name}...`);
    const response = await helpers.patch(
      `${helpers.getBaseUrl()}/schools/classes/${data.classId}/subjects/`,
      { subjects: data.subjects }
    );
    helpers.stopLoader();
    if (response) {
      const school: SchoolOptions = response.data;
      const cachedSchool = await helpers.rootDispatch(
        'data/getCachedObject',
        'school'
      );
      school.cacheIndex = cachedSchool.cacheIndex;
      //school update offered by updateList
      helpers.updateList('school', school);
      const level = school.acadx_schoollevels.find(
        level => level.id == this.level.id
      );
      if (level) {
        this.context.commit('setLevel', level);
      }
      helpers.notify('positive', 'Subjects created successfully');
      return response;
    }
  }
}
