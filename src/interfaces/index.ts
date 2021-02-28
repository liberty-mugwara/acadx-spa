import { ModuleIndexType } from 'src/store/';

export * from './components';

export type CacheModule = Record<string, ModuleIndexType> &
  Record<'cacheIndex', { groupIndex: number; index: number }>;

export type PaginatedSessionStorage = CacheModule[];

export interface CacheIndexOptions {
  groupIndex: number;
  index: number;
}
export interface ClassSubjectTeacherOptions {
  [index: string]: number | Record<'subject', number>;
  id: number;
  subject: { subject: number };
  teacher: number;
}

export interface ClassCreateOptions {
  index: number;
  level_id: number;
  name: string;
}
export interface UpdateStateOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
  state: string;
  value: string | boolean | number | number[] | ClassCreateOptions;
}
export interface CookieDataOptions {
  user_id?: number;
  access_token: string;
  refresh_token: string;
}
export interface TokenDataOptions {
  cookieData: CookieDataOptions;
  expires: number;
}

export interface JsonResponseToken {
  data: TokenDataOptions;
}

export interface JsonResponseUserRoles {
  data: Record<string, UserRolesOptions>;
}

export interface JsonResponseUser {
  data: UserOptions;
}
export interface JsonResponseUsers {
  data: Array<UserOptions>;
}
export interface JsonResponseAvailability {
  data: {
    available: boolean;
  };
}
export interface JsonResponseAddressData {
  data: AddressDataOptions;
}

export interface JsonResponseSchoolFormData {
  data: SchoolFormDataOptions;
}

export interface JsonResponseSchools {
  data: Array<SchoolOptions>;
}

export interface JsonResponseSchool {
  data: SchoolOptions;
}

export interface CommonAOptions {
  national_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

type CommonBIndex = string | number | Partial<UserRolesOptions>;
type CommonCIndex = CommonBIndex | NextOfKinOptions | AddressOptions;
export interface CommonBOptions extends CommonAOptions {
  id: number;
  user: Partial<UserRolesOptions>;
  school: number;
  comments: string;
  phone_number: string;
  join_date: string;
  created_by: number;
}

export interface CommonCOptions {
  school_admin?: CommonBOptions;
  librarian?: CommonBOptions;
  teacher?: CommonBOptions;
  parent?: CommonBOptions;
}
export interface CommonDOptions extends CommonBOptions {
  next_of_kin: NextOfKinOptions;
  address: AddressOptions;
}
export interface NextOfKinOptions extends CommonAOptions, CommonCOptions {
  [index: string]: string | boolean | number | {} | undefined;
  id: number;
}
export interface SchoolAdminOptions extends CommonDOptions {
  [index: string]:
    | string
    | boolean
    | number
    | NextOfKinOptions
    | AddressOptions
    | Partial<UserOptions>;
  position: string;
  employee_number: number;
}

export interface LibrarianOptions extends CommonDOptions {
  [index: string]:
    | string
    | boolean
    | number
    | NextOfKinOptions
    | AddressOptions
    | Partial<UserOptions>;
  employee_number: number;
}

export interface TeacherOptions extends CommonDOptions {
  [index: string]:
    | string
    | boolean
    | number
    | NextOfKinOptions
    | AddressOptions
    | Partial<UserOptions>;
  employee_number: number;
}

export interface StudentOptions extends CommonBOptions {
  [index: string]:
    | string
    | boolean
    | number
    | NextOfKinOptions
    | AddressOptions
    | Partial<UserOptions>
    | LevelOptions
    | TermOptions
    | SchoolClassOptions
    | LevelsTermsToProvideOptions[];
  dob: string;
  sponsor: {};
  sex: number;
  starting_level: LevelOptions;
  starting_term: TermOptions;
  current_level: LevelOptions;
  school_class: SchoolClassOptions;
  graduation_date: string;
  terms_levels_attended: LevelsTermsToProvideOptions[];
  terms_levels_paid: LevelsTermsToProvideOptions[];
  parent: ParentOptions;
}
export interface ParentOptions extends CommonDOptions {
  [index: string]:
    | string
    | boolean
    | number
    | NextOfKinOptions
    | AddressOptions
    | Partial<UserOptions>
    | SchoolOptions[];
  work_phone_number: string;
  home_phone_number: string;
  schools: SchoolOptions[];
}

export interface UserCreateDataOptions extends CommonAOptions {
  type: string;
  password1: string;
  password2: string;
}

export interface UserRolesOptions extends UserOptions, UserGroupsOptions {
  [index: string]: any;
  user_id: number;
  user_role: string;
}

export interface UserOptions extends CommonAOptions {
  [index: string]: any;
  cacheIndex: CacheIndexOptions;
  id: number;
  date_joined: string;
  is_active: boolean;
  is_superuser: boolean;
  is_supervisor: boolean;
  is_staff: boolean;
  is_superadmin: boolean;
  is_school_admin: boolean;
  is_librarian: boolean;
  is_teacher: boolean;
  is_student: boolean;
  is_parent: boolean;
}

export interface UserGroupsOptions {
  [index: string]: boolean | string | number;
  //  user  groups
  group_0: boolean;
  group_1: boolean;
  group_2: boolean;
  group_0_1: boolean;
  group_4: boolean;
  group_5: boolean;
  group_6: boolean;
  group_7: boolean;
  group_8: boolean;
}

export interface AddressDataOptions {
  cities: Record<string, string>;
  countries: Record<string, string>;
  provinces: Record<string, string>;
}

export interface ProcessedSelectOptions {
  [key: number]: SelectOptions;
}

export interface SelectOptions {
  [key: number]: number | string;
  value: number;
  label: string;
}

export interface SchoolFormDataOptions {
  classification: Record<string, string>;
  banks: Record<string, string>;
  school: SchoolStripedOptions;
}

export interface SchoolDataOptions {
  classification: Record<string, string>;
  banks: Record<string, string>;
  subjects: Record<string, string>;
}

export interface JsonResponse {
  data: object;
}

export interface AddressOptions extends CommonCOptions {
  [index: string]: string | boolean | number | {} | undefined;
  id: number;
  address: string;
  suburb: string;
  country: number;
  province: number;
  city: number;
}

export interface SchoolCodeOptions {
  code: string;
}

export interface TermOptions {
  id: number;
  name: string;
  position: number;
}

export interface CurrentTermOptions {
  term: TermOptions;
  last_edited_by: Partial<UserOptions>;
}

export interface SchoolClassOptions {
  [index: string]:
    | number
    | string
    | SubjectOptions[]
    | ClassSubjectTeacherOptions[];
  id: number;
  name: string;
  subjects: SubjectOptions[];
  subjects_teachers: ClassSubjectTeacherOptions[];
}

export interface LevelOptions {
  id: number;
  name: string;
  position: number;
  school_classes: SchoolClassOptions[];
}

export interface LevelsTermsToProvideOptions {
  id: number;
  level: LevelOptions;
  term: TermOptions;
}
export interface SubjectOptions {
  id: number;
  name: string;
  subject: number;
}
export interface SchoolStripedOptions {
  name: string;
  classification: number;
  phone_number: string;
  tel_number: string;
  email: string;
  bank_name: number;
  branch: string;
  bank_account_number: string;
  bank_account_name: string;
}
export interface SchoolOptions extends SchoolStripedOptions {
  [index: string]: string | boolean | number | {};
  id: number;
  join_date: string;
  is_active: boolean;
  starting_number: number;
  available_number: number;
  code: SchoolCodeOptions;
  created_by: Partial<UserOptions>;
  address: Partial<AddressOptions>;
  acadx_schoolterms: Array<TermOptions>;
  levels_terms_to_provide: Array<LevelsTermsToProvideOptions>;
  acadx_subjects: SubjectOptions[];
  current_term: Partial<CurrentTermOptions>;
  acadx_schoollevels: Array<LevelOptions>;
  production: boolean;
}

export interface LoginDataOptions {
  username: string;
  password: string;
}
