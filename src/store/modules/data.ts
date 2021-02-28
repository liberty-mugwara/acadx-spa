/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import {
  SelectOptions,
  SchoolOptions,
  PaginatedSessionStorage,
  CacheModule
} from 'src/interfaces';
import * as helpers from 'src/helpers';
import { LocalStorage, SessionStorage } from 'quasar';

@Module({ dynamic: true, store: store, namespaced: true, name: 'data' })
export class Data extends VuexModule {
  [index: string]: ModuleIndexType;
  classifications: SelectOptions[] = [];
  banks: SelectOptions[] = [];
  subjects: SelectOptions[] = [];
  countries: SelectOptions[] = [];
  provinces: SelectOptions[] = [];
  cities: SelectOptions[] = [];
  parentModules = ['schoolAdmin', 'parent', 'teacher', 'librarian'];
  modulesForSchool = [...this.parentModules, ...['student']];

  get currentPage(): number {
    return helpers.getState('page/currentPage');
  }
  get schoolId() {
    return helpers.getState('school/id');
  }

  @Action
  async getAddressData() {
    const addressData = LocalStorage.getItem('addressData');
    if (!addressData) {
      const response = await helpers.get(
        `${helpers.getBaseUrl()}/schools/get-address-data/`
      );
      if (response) {
        helpers.rootCommit('address/updateData', response.data);
        try {
          LocalStorage.set('addressData', response.data);
        } catch (e) {}
      }
    } else helpers.rootCommit('address/updateData', addressData);
  }

  @Action
  async getSchoolData() {
    const schoolData = LocalStorage.getItem('schoolData');
    if (!schoolData) {
      const response = await helpers.get(
        `${helpers.getBaseUrl()}/schools/get-data/`
      );

      if (response) {
        helpers.rootCommit('school/updateData', response.data);
        try {
          LocalStorage.set('schoolData', response.data);
        } catch (e) {}
      }
    } else helpers.rootCommit('school/updateData', schoolData);
  }

  @Mutation
  updateActiveSchool(school: SchoolOptions) {
    const activeSchool: SchoolOptions | null = SessionStorage.getItem(
      'activeSchool'
    );
    if (!activeSchool) {
      try {
        SessionStorage.set('activeSchool', school);
      } catch (e) {}
    }
  }

  @Action
  async getActiveSchool(data: { pk?: number; url?: string }) {
    const activeSchool: SchoolOptions | null = SessionStorage.getItem(
      'activeSchool'
    );
    if (data.pk) {
      if (
        (activeSchool && activeSchool.id == data.pk) ||
        (activeSchool && activeSchool.ownerId == data.pk)
      )
        return helpers.rootCommit('school/update', activeSchool);

      if (!activeSchool) {
        const response = await helpers.get(
          data.url || `${helpers.getBaseUrl()}/schools/${data.pk}`
        );

        if (response) {
          const school: SchoolOptions = response.data;
          if (data.url) school.ownerId = data.pk;
          try {
            SessionStorage.set('activeSchool', school);
          } catch (e) {}
          await this.getSchoolData();
          helpers.rootCommit('school/update', school);
          await helpers.rootDispatch('teacher/getListSilent');
        }
      }
    }

    if (activeSchool) {
      await this.getSchoolData();
      helpers.rootCommit('school/update', activeSchool);
      await helpers.rootDispatch('teacher/getListSilent');
    }
    return;
  }

  @Action
  cacheObj(data: { module: string; obj: {} }) {
    try {
      SessionStorage.set('active' + helpers.capitalize(data.module), data.obj);
    } catch (e) {}
  }

  @Action
  getCachedObject(module: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cachedObj: Record<string, any> | null = SessionStorage.getItem(
      'active' + helpers.capitalize(module)
    );
    return cachedObj;
  }

  @Action
  async getParentSchools(parentId?: number) {
    const parentSchools: SchoolOptions | null = SessionStorage.getItem(
      'activeSchool'
    );
    if (parentId) {
      if (parentSchools) return parentSchools;
      if (!parentSchools) {
        const response = await helpers.get(
          `${helpers.getBaseUrl()}/schools/parent/${parentId}`
        );

        if (response) {
          const schools: SchoolOptions = response.data;
          try {
            SessionStorage.set('parentSchools', schools);
          } catch (e) {}
          helpers.rootCommit('school/update', schools[0]);
          helpers.setState('school/list', schools);
        }
      } else {
        helpers.rootCommit('school/update', parentSchools[0]);
        helpers.setState('school/list', parentSchools);
      }
    }
  }

  @Action
  async getList(arg: { url: string; module: string; forceRequest?: boolean }) {
    // format '<module name>s<school id>' or '<module name>s'
    const storageName = `${arg.module}s${(this.modulesForSchool.includes(
      arg.module
    ) &&
      this.schoolId) ||
      ''}`;
    const list: PaginatedSessionStorage[] =
      SessionStorage.getItem(storageName) || [];
    if (list[1] && !list[0]) {
      list[0] = list[1];
      SessionStorage.set(storageName, list);
    }

    const getListRemote = async () => {
      helpers.load(
        `Collecting ${(arg.module === 'userDetail' && 'user') ||
          arg.module}s ...`
      );
      const response = await helpers.get(
        arg.url,
        (arg.module !== 'teacher' && true) || false
      );
      helpers.stopLoader();

      if (
        response &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const data: CacheModule[] = response.data;
        list[this.currentPage] = data;
        for (const item of list[this.currentPage]) {
          item.cacheIndex = {
            groupIndex: this.currentPage,
            index: list[this.currentPage].indexOf(item)
          };
          if (this.parentModules.includes(arg.module)) {
            this.parentCache({ parent: item });
          }
        }
        SessionStorage.set(storageName, list);
        helpers.setState(`${arg.module}/list`, list[this.currentPage]);
        if (this.currentPage == 0) list[1] = list[0];
      }
    };

    if (!list[this.currentPage]) getListRemote();
    else {
      if (!this.currentPage) helpers.setState('page/currentPage', 1);

      helpers.setState(`${arg.module}/list`, list[this.currentPage]);

      const schoolIndependent = ['school', 'userDetail'];
      const url = `${helpers.getBaseUrl()}${(!schoolIndependent.includes(
        arg.module
      ) &&
        '/school/' + helpers.getState('school/id')) ||
        ''}/get-headers/${(arg.module === 'userDetail' && 'user') ||
        arg.module}s`;
      const response = await helpers.get(url, false);
      if (response) {
        const pageInfo = response.headers.pagination.split(',');
        const limit = parseInt(pageInfo[0]);
        const total = parseInt(pageInfo[1]);
        if (total > limit) {
          helpers.setState('page/pagination', true);
          helpers.setState('page/limit', limit);
          helpers.setState('page/totalItems', total);
          if (!helpers.getState('page/currentPage'))
            helpers.setState('page/currentPage', 1);
        } else helpers.setState('page/pagination', false);
      }
      if (helpers.getState('page/pagination')) {
        if (list[0] && !list[1] && this.currentPage == 1) {
          list.length = 1;
          getListRemote();
        }
      }
    }
  }

  @Mutation
  updateList(arg: { module: string; item: CacheModule }) {
    const storageName = `${arg.module}s${(this.modulesForSchool.includes(
      arg.module
    ) &&
      this.schoolId) ||
      ''}`;
    const list: PaginatedSessionStorage[] =
      SessionStorage.getItem(storageName) || [];

    if (list.length > 0) {
      if (
        arg.item.cacheIndex.groupIndex != -1 &&
        arg.item.cacheIndex.index != -1
      ) {
        //item updated
        list[arg.item.cacheIndex.groupIndex][arg.item.cacheIndex.index] =
          arg.item;
        helpers.rootCommit(arg.module + '/update', arg.item);
      } else {
        //item created
        let itemList;
        if (list.length > 0) {
          for (const items of list.slice(1)) {
            if (items.length < 10) {
              itemList = items;
              break;
            }
          }
        } else {
          list[1] = [];
          itemList = list[1];
        }

        if (itemList !== undefined) {
          arg.item.cacheIndex = {
            groupIndex: list.indexOf(itemList),
            index: itemList.length
          };
          itemList.push(arg.item);
        }
      }

      SessionStorage.set(storageName, list);
    }
    helpers.rootDispatch(arg.module + '/detail', arg.item);
  }

  @Action
  deleteSchoolLocal(xul: SchoolOptions) {
    const schools: SchoolOptions[] | null = SessionStorage.getItem('schools');

    if (schools) {
      const index = schools.findIndex(school => school.id == xul.id);
      if (index > -1) {
        schools.splice(index, 1);
        SessionStorage.set('schools', schools);
      }
    }
    this.getList({ module: 'school', url: `${helpers.getBaseUrl()}schools` });
  }

  @Action
  parentCache(data: { nationalId?: string; parent?: any }) {
    const parentCache: Record<string, Record<string, ModuleIndexType>> =
      SessionStorage.getItem('parentCache') || {};
    if (data.parent && data.parent.national_id) {
      parentCache[data.parent.national_id] = data.parent;
      SessionStorage.set('parentCache', parentCache);
    }
    if (data.nationalId) return parentCache[data.nationalId];
  }
}
