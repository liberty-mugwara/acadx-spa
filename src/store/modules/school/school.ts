/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import * as helpers from 'src/helpers';
import {
  SchoolOptions,
  TermOptions,
  LevelsTermsToProvideOptions,
  LevelOptions,
  SelectOptions,
  SchoolDataOptions,
  UpdateStateOptions
} from 'src/interfaces';

@Module({ dynamic: true, store: store, namespaced: true, name: 'school' })
export class School extends VuexModule {
  [index: string]: ModuleIndexType;
  cacheIndex: { groupIndex: number; index: number } = {
    groupIndex: -1,
    index: -1
  };
  id = 0;
  name = '';
  classification = 0;
  phone_number = '';
  tel_number = '';
  email = '';
  bank_name = 0;
  branch = '';
  bank_account_number = '';
  bank_account_name = '';
  join_date = '';
  is_active = false;
  starting_number = 0;
  available_number = 0;
  code = { code: '' };
  created_by = {};
  address = {};
  current_term = {};
  acadx_schoolterms: TermOptions[] = [];
  levels_terms_to_provide: LevelsTermsToProvideOptions[] = [];
  acadx_subjects: number[] = [];
  acadx_schoollevels: LevelOptions[] = [];
  production = false;
  list: SchoolOptions[] = [];
  baseChanged = false;
  baseChanges: Record<string, string | boolean | number> = {};
  termsChanges: TermOptions[] = [];
  levelsChanges: LevelOptions[] = [];
  type = '';
  classifications: SelectOptions[] = [];
  banks: SelectOptions[] = [];
  subjects: SelectOptions[] = [];
  subjectsChanged = false;
  toCreate = {
    name: '',
    classification: 3
  };

  get subjectsOffered() {
    const subjectsOffered: SelectOptions[] = [];
    for (const subject of this.acadx_subjects) {
      const option = this.subjects.find(option => option.value == subject);
      option && subjectsOffered.push(option);
    }
    return subjectsOffered;
  }

  get classes(): SelectOptions[] {
    const classOptions: SelectOptions[] = [];
    for (const level of this.acadx_schoollevels)
      for (const klass of level.school_classes)
        classOptions.push({ value: klass.id, label: klass.name });
    return classOptions;
  }

  get terms(): SelectOptions[] {
    const terms: SelectOptions[] = [];
    for (const term of this.acadx_schoolterms)
      terms.push({ value: term.id, label: term.name });
    return terms;
  }

  get levels(): SelectOptions[] {
    const levels: SelectOptions[] = [];
    for (const level of this.acadx_schoollevels)
      levels.push({ value: level.id, label: level.name });
    return levels;
  }

  get termsChanged() {
    return this.termsChanges.length > 0;
  }

  get levelsChanged() {
    return this.levelsChanges.length > 0;
  }

  get canEditSchool() {
    return this.id && this.context.rootState.user.group_4;
  }

  get bankName() {
    const bank = this.banks.find(bank => bank.value == this.bank_name);
    return bank?.label;
  }

  get classificationName() {
    const classification = this.classifications.find(
      classification => classification.value == this.classification
    );
    return classification?.label;
  }
  get createClassificationName() {
    const classification = this.classifications.find(
      classification => classification.value == this.toCreate.classification
    );
    return classification?.label;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    const specialKeys = ['acadx_schoollevels', 'acadx_schoolterms'];
    if (specialKeys.includes(arg.state)) {
      if (typeof arg.value === 'string') {
        /**
         * state must be in the format 'id||name||position'
         */
        const idNamePosition = arg.value.split('||');
        if (idNamePosition.length == 3) {
          if (arg.state == 'acadx_schoollevels') {
            const level = this.acadx_schoollevels.find(
              (level: { id: number; position: number; name: string }) =>
                level.id === parseInt(idNamePosition[0])
            );
            if (level) {
              level.name = idNamePosition[1];
              level.position = parseInt(idNamePosition[2]);
              this.levelsChanges.push(level);
            }
          } else {
            const term = this.acadx_schoolterms.find(
              (term: { id: number; position: number; name: string }) =>
                term.id === parseInt(idNamePosition[0])
            );
            if (term) {
              term.name = idNamePosition[1];
              term.position = parseInt(idNamePosition[2]);
              this.termsChanges.push(term);
            }
          }
        }
      }
      return;
    }

    helpers.updateState(arg, {
      acadx_subjects: { boolKey: 'subjectsChanged' },
      other: { boolKey: 'baseChanged', objKey: 'baseChanges' }
    });
  }

  @Mutation
  updateData(data: SchoolDataOptions) {
    helpers.updateSelectOptions(this.classifications, data.classification);
    helpers.updateSelectOptions(this.banks, data.banks);
    helpers.updateSelectOptions(this.subjects, data.subjects);
  }

  @Mutation
  update(school: SchoolOptions) {
    const classifications = [...this.classifications];
    const banks = [...this.banks];
    const subjects = [...this.subjects];

    helpers.updateAcadxModule(this, school, ['acadx_subjects']);
    for (const subject of school.acadx_subjects)
      this.acadx_subjects.push(subject.subject);

    this.classifications = classifications;
    this.banks = banks;
    this.subjects = subjects;
    this.toCreate.classification = 3;

    const modules = ['schoolAdmin'];
    for (const module of modules)
      helpers.setState(`${module}/toCreate.school_id`, school.id);

    //cache the school
    helpers.cacheObj('school', school);
  }

  @Action
  detail(school: SchoolOptions) {
    this.context.commit('update', school);
    helpers.push('/schools/details');
    helpers.setState('page/activeMenu', 3);
    helpers.rootDispatch('teacher/getListSilent');
  }

  @Action
  async create() {
    await helpers.createNoCache(
      'school',
      `${helpers.getBaseUrl()}/schools/create/`,
      this.toCreate
    );
  }

  @Action
  async getList() {
    await helpers.listNoCache('school', `${helpers.getBaseUrl()}/schools`);
  }

  @Action
  edit(school: SchoolOptions) {
    this.detail(school);
    helpers.notify(
      'info',
      'To edit school information click on the information you would like to change.'
    );
  }

  @Action
  commit() {
    const promises: Promise<unknown>[] = [];
    if (this.baseChanged) {
      promises.push(
        (async () => {
          const response = await helpers.patch(
            `${helpers.getBaseUrl()}/schools/update-destroy/${this.id}`,
            this.baseChanges
          );
          //  if response then
          if (response) {
            this.context.commit('update', response.data);
          }
        })()
      );
    }

    const subs = { school_id: this.id, subjects: this.acadx_subjects };
    promises.push(
      (async () => {
        const response = await helpers.post(
          `${helpers.getBaseUrl()}/schools/subjects/`,
          subs
        );
        if (response) {
          this.context.commit('update', response.data);
        }
      })()
    );

    if (this.termsChanges.length > 0) {
      this.termsChanges.forEach(term => {
        promises.push(
          (async () => {
            const response = await helpers.patch(
              `${helpers.getBaseUrl()}/schools/term/${term.id}`,
              term
            );
            response && this.context.commit('update', response.data);
          })()
        );
      });
    }

    if (this.levelsChanges.length > 0) {
      this.levelsChanges.forEach(level => {
        promises.push(
          (async () => {
            const response = await helpers.patch(
              `${helpers.getBaseUrl()}/schools/level/${level.id}`,
              level
            );
            response && this.context.commit('update', response.data);
          })()
        );
      });
    }
    helpers.load('Saving changes ...');
    Promise.all(promises)
      .then(() => {
        helpers.stopLoader();
        helpers.notify('positive', 'All changes saved');
      })
      .catch(() => {
        helpers.stopLoader();
        helpers.notify(
          'negative',
          'An Error occurred all/some changes might not be saved'
        );
      });
  }
}
