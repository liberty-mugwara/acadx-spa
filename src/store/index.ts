import Vue from 'vue';
import Vuex, {
  StoreOptions,
  ActionTree,
  ActionContext,
  GetterTree,
  ModuleTree
} from 'vuex';
import {
  SelectOptions,
  SchoolOptions,
  TermOptions,
  LevelOptions,
  LevelsTermsToProvideOptions,
  UserRolesOptions,
  UserOptions,
  SchoolAdminOptions
} from 'src/interfaces';
Vue.use(Vuex);

export type ModuleIndexType =
  | AcadxModuleOptions
  | ActionTree<ThisType<AcadxModuleOptions>, StoreStateOptions>
  | ActionContext<ThisType<AcadxModuleOptions>, StoreStateOptions>
  | GetterTree<ThisType<AcadxModuleOptions>, StoreStateOptions>
  | ModuleTree<StoreStateOptions>
  | ThisType<AcadxModuleOptions>
  | (() => ThisType<AcadxModuleOptions>)
  | undefined;

export type DetailModules =
  | 'address'
  | 'librarian'
  | 'nextOfKin'
  | 'parent'
  | 'school'
  | 'schoolAdmin'
  | 'student'
  | 'teacher'
  | 'userDetail';
export type AcadxStoreModules =
  | DetailModules
  | 'data'
  | 'delete'
  | 'Form'
  | 'notify'
  | 'page'
  | 'user';

export type AcadxApiCallsStateKeys =
  | 'baseChanges'
  | 'changes'
  | 'toCreate'
  | 'toRegister';

export type AcadxArrayApiCallsStateKeys =
  | 'acadx_subjects'
  | 'levelsChanges'
  | 'termsChanges';

export type AcadxStateChangeKeys =
  | 'baseChanged'
  | 'detailsChanged'
  | 'levelsChanged'
  | 'subjectsChanged'
  | 'termsChanged';

export type AcadxPrimitives = string | number | boolean | string[] | number[];
export type AcadxAdvanced = RegExp | [string, string] | [string, string][];
export type AcadxTypes = SelectOptions[];
export type AcadxSchoolTypes =
  | LevelOptions[]
  | LevelsTermsToProvideOptions[]
  | SchoolOptions[]
  | TermOptions[];
export type AcadxUserOptions =
  | SchoolAdminOptions[]
  | UserOptions
  | UserOptions[]
  | UserRolesOptions;

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export type AcadxArrayApiCallsState = Record<
  AcadxArrayApiCallsStateKeys,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any[]
>;
export type AcadxApiCallsState = Record<
  AcadxApiCallsStateKeys,
  Record<string, AcadxPrimitives>
>;
export type AcadxStateChangeState = Record<AcadxStateChangeKeys, boolean>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreStateOptions = Record<AcadxStoreModules, AcadxModuleOptions>;

export type AcadxModuleOptions = Partial<AcadxStateChangeState> &
  Partial<AcadxArrayApiCallsState> &
  Partial<AcadxApiCallsState> &
  OtherIndexTypes;

export type OtherIndexTypes = Record<
  string,
  | AcadxAdvanced
  | AcadxPrimitives
  | AcadxSchoolTypes
  | AcadxTypes
  | AcadxUserOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<'store', Record<'$router', any>>
  | Record<AcadxApiCallsStateKeys, AcadxPrimitives>
>;

const myStore: StoreOptions<StoreStateOptions> = {
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: !!process.env.DEV
};

const store = new Vuex.Store(myStore);
export default store;
