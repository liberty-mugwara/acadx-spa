/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  UpdateStateOptions,
  SelectOptions,
  ClassSubjectTeacherOptions,
  SchoolOptions
} from 'src/interfaces';
import * as helpers from 'src/helpers';
import { getState } from 'src/helpers';
import { school } from '..';

@Module({
  dynamic: true,
  store: store,
  namespaced: true,
  name: 'classSubjectTeacher'
})
export class ClassSubjectTeacher extends VuexModule {
  [index: string]: ModuleIndexType;
  id = 0;
  teacher = 0;
  changes: Record<string, string | boolean | number> = {};

  get classes(): SelectOptions[] {
    const classes = helpers.getState('school/allClasses');
    const classOptions: SelectOptions[] = [];
    for (const klass of classes)
      classOptions.push({ value: klass.id, label: klass.name });
    return classOptions;
  }

  get teachers(): SelectOptions[] {
    const teachers = helpers.getState('teacher/list');
    const teacherOptions: SelectOptions[] = [
      {
        value: 0,
        label: 'Select teacher'
      }
    ];
    for (const teacher of teachers)
      teacherOptions.push({
        value: teacher.id,
        label: `${teacher.first_name.charAt(0)} ${teacher.last_name}`
      });
    return teacherOptions;
  }

  get subjects(): SelectOptions[] {
    return getState('school//subjectsOffered');
  }

  get teacherName() {
    const teacher = this.teachers.find(
      teacher => teacher.value == this.teacher
    );
    return teacher?.label;
  }
  get schoolClassName() {
    const myClass = this.classes.find(
      myClass => myClass.value == this.school_class
    );
    return myClass?.label;
  }
  get subjectName() {
    const subject = this.subjects.find(
      subject => subject.value == this.subject
    );
    return subject?.label;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    helpers.updateState(arg);
  }

  @Mutation
  update(cst: ClassSubjectTeacherOptions) {
    helpers.updateAcadxModule(this, cst);
  }

  @Action
  async commit(data: { teacher: number; cstId: number }) {
    if (data.teacher && data.cstId) {
      const school: SchoolOptions = await helpers.commit(
        'classSubjectTeacher',
        `${helpers.getBaseUrl()}/schools/c-s-t/${data.cstId}`,
        { teacher: data.teacher }
      );
      if (school) {
        const cachedSchool = await helpers.rootDispatch(
          'data/getCachedObject',
          'school'
        );
        school.cacheIndex = cachedSchool.cacheIndex;
        //school update offered by updateList
        helpers.updateList('school', school);
      }
    }
    return school?.acadx_schoollevels;
  }
}
