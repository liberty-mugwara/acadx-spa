import { AddressOptions, SchoolClassOptions, SelectOptions } from '.';
import { AcadxStoreModules } from 'src/store';

export interface UserCreateMenuOptions {
  permission: boolean | string;
  title: string;
  createLink: ToRouterOptions | string;
  listLink: ToRouterOptions | string;
  icon?: string;
  createOnClick?: (arg?: unknown) => unknown;
  listOnClick?: (arg?: unknown) => unknown;
}

export interface ToRouterOptions {
  name?: string;
  path?: string;
  params?: {};
  query?: {};
}
export interface FancyFormOptions {
  title: string;
  submitIcon: string;
  onSubmit: () => void;
  inputs: Array<InputsOptions>;
}

export interface InputsOptions
  extends ImpressiInputOptions,
    ImpressiSelectOptions {}

export interface DrawerLinkOptions {
  title: string;
  icon: string;
  link: ToRouterOptions;
  permission: boolean | string;
  caption?: string;
  click?: unknown;
  iconColor?: string;
  id?: number;
}

export interface DropdownMenuOptions {
  label?: string;
  icon?: string;
  permission: boolean | string;
  menus: Array<{
    heading?: string;
    links: Array<DrawerLinkOptions>;
  }>;
}

export interface StoreStateOptions {
  module: AcadxStoreModules;
  state: string;
  get?: string;
}
export interface DetailEditOptions {
  label: string;
  store?: string;
  avatarTxt?: string;
  date?: boolean;
  hint?: string;
  icon?: string;
  optionsStore?: string;
  permission?: boolean | string;
  rules?: Array<unknown>;
  type?: string;
}

export interface CommonInputOptions {
  store?: string;
  value?: unknown;
  label?: string;
  color?: string;
  inputClass?: string;
  filled?: boolean;
  rules?: string[];
  mask?: string;
}
export interface ImpressiInputOptions extends CommonInputOptions {
  type?: string;
  placeholder?: string;
  debounce?: string;
  autofocus?: boolean;
  hint?: string;
  date?: boolean;
}

export interface ImpressiSelectOptions extends CommonInputOptions {
  optionsStore?: string;
  selectOptions?: SelectOptions[];
  emit?: boolean;
  map?: boolean;
  multiple?: boolean;
  transitionShow?: string;
  transitionHide?: string;
  toggle?: boolean;
}

export interface SaveButtonOptions {
  click?: () => void;
  permission: boolean | string;
  showCondition: string | boolean;
  label?: string;
}

export interface EDetailEditOptions {
  icon: string;
  label: string;
  permission?: boolean | string;
  saveBtnOptions?: SaveButtonOptions;
  detailEdits?: DetailEditOptions[];
  address?: Partial<AddressOptions>;
  classes?: boolean;
  subjects?: SubjectsEditOptions;
  group?: string;
  headerClass?: string;
}

export interface SubjectsEditOptions {
  saveBtnOptions: SaveButtonOptions;
  optionsStore: string;
  store: string;
  permission: boolean | string;
  schoolClass?: SchoolClassOptions;
}
