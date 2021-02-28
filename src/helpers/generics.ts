/* eslint-disable @typescript-eslint/camelcase */
import { patch, post, get } from './api-calls';
import { load, stopLoader, notify } from './ui';
import { rootCommit, getState, rootDispatch, setState } from './store-helper';
import {
  DetailEditOptions,
  UpdateStateOptions,
  SelectOptions
} from 'src/interfaces';
import { getIcon, formatDate, formatDateTime, resetObj } from './utils';
import { AcadxModuleOptions, ModuleIndexType, DetailModules } from 'src/store';
import { isAcadxApiCallsStateKey } from 'src/type-guards';

export async function listNoCache(
  module: string,
  url: string,
  forceRequest?: boolean
) {
  load(`Collecting ${(module === 'userDetail' && 'user') || module}s ...`);
  const response = await get(url, (module !== 'teacher' && true) || false);
  stopLoader();
  response && setState(`${module}/list`, response.data);
}

export const list = async (
  module: string,
  url: string,
  forceRequest?: boolean
) => {
  await rootDispatch('data/getList', {
    module: module,
    url: url,
    forceRequest: forceRequest
  });
};
export const updateList = (
  module: string,
  data: { [index: string]: unknown; id: number }
) => {
  rootCommit('data/updateList', {
    module: module,
    item: data
  });
};

export async function commit(module: string, url: string, changes: object) {
  const changesList = load(changes);
  const response = await patch(url, changes);
  //api does not return standalone address and next of kin
  //'address', 'nextOfKin' provide update for themselves
  const exclude = ['address', 'nextOfKin'];
  stopLoader();
  if (response) {
    const cachedData = await rootDispatch('data/getCachedObject', module);
    if (!exclude.includes(module)) {
      const data = { ...response.data };
      if (cachedData) {
        data.cacheIndex = cachedData.cacheIndex;
        updateList(module, data);
      }
      notify('positive', `Changes to ${changesList} were saved`);
      return data;
    }
  }
  return response?.data;
}

export async function commitNoCache(
  module: string,
  url: string,
  changes: object
) {
  const changesList = load(changes);
  const response = await patch(url, changes);
  //api does not return standalone address and next of kin
  //'address', 'nextOfKin' provide update for themselves
  const exclude = ['address', 'nextOfKin'];
  stopLoader();
  if (response) {
    if (!exclude.includes(module)) {
      rootCommit(module + '/update', response.data);
      notify('positive', `Changes to ${changesList} were saved`);
    }
  }
  return response?.data;
}

export async function createNoCache(
  module: string,
  url: string,
  toCreate: { [key: string]: string | number | boolean }
) {
  const name =
    (toCreate.first_name && `${toCreate.first_name} ${toCreate.last_name}`) ||
    toCreate.name ||
    '';
  load(`Creating ${name}...`);
  const response = await post(url, toCreate);
  stopLoader();
  if (response) {
    rootDispatch(module + '/detail', response.data);
    notify('positive', `${name} was created successfully`);
  }
  return response?.data;
}

export const create = async (
  module: string,
  url: string,
  toCreate: { [key: string]: string | number | boolean }
) => {
  const name =
    (toCreate.first_name && `${toCreate.first_name} ${toCreate.last_name}`) ||
    toCreate.name ||
    '';
  load(`Creating ${name}...`);
  const response = await post(url, toCreate);
  stopLoader();
  if (response) {
    await rootDispatch(`${module}/getList`, true);
    const data = { ...response.data };
    data.cacheIndex = {
      groupIndex: -1,
      index: -1
    };
    updateList(module, data);
    notify('positive', `${name} was created successfully`);
  }
  return response?.data;
};

export function prepareDetailEdits(
  module: DetailModules,
  filter?: string[],
  startsWith?: boolean
) {
  const obj = getState(module);
  const de: DetailEditOptions[] = [];
  const allowedKeys = (filter && filter) || [
    'first_name',
    'last_name',
    'national_id',
    'bank_account_name',
    'bank_account_number',
    'bank_name',
    'branch',
    'classification',
    'email',
    'name',
    'phone_number',
    'work_phone_number',
    'home_phone_number',
    'tel_number',
    'employee_number',
    'address',
    'suburb'
  ];
  const readOnly = [
    'available_number',
    'starting_number',
    'employee_number',
    'join_date'
  ];

  const displayNames: Record<string, string> = {
    available_number: 'AAEN',
    branch: 'Bank branch',
    starting_number: 'ASEN',
    employee_number: 'AEN'
  };

  const selects: Record<string, string> = {
    bank_name: 'school/banks||school//bankName',
    classification: 'school/classifications||school//classificationName',
    city: 'address/cities||address//cityName',
    country: 'address/countries||address//countryName',
    province: 'address/provinces||address//provinceName',
    starting_term: 'school//terms||student//startingTermName',
    starting_level: 'school//levels||student//startingLevelName',
    current_level: 'school//levels||student//currentLevelName',
    sex: 'student/sexes||student//sexName',
    school_class: 'school//classes||student//schoolClassName'
  };

  const permissions: Record<DetailModules, Record<string, string>> = {
    school: {
      is_active: 'user/group_1',
      other: 'user/group_4'
    },
    schoolAdmin: {
      other: 'user/group_4'
    },
    userDetail: {
      is_active:
        (obj['group_1'] && 'user/is_superuser') ||
        (obj['group_2'] && 'user/group_1') ||
        (obj['is_superadmin'] && 'user/is_superuser') ||
        (obj['group_4'] && 'user/group_2|is_superadmin') ||
        'user/group_4',
      is_school_admin: 'user/group_2|is_superadmin',
      is_staff: 'user/group_1',
      is_superadmin: 'user/group_1',
      is_superuser: 'user/is_superuser',
      is_supervisor: 'user/is_superuser',
      other: 'user/group_4'
    },
    teacher: {
      other: 'user/group_4'
    },
    librarian: {
      other: 'user/group_4'
    },
    parent: {
      other: 'user/group_4'
    },
    student: {
      other: 'user/group_4'
    },
    address: {
      other: 'user/group_4'
    },
    nextOfKin: {
      other: 'user/group_4'
    }
  };

  const commonRules = {
    email: ['checkEmail'],
    first_name: ['checkNamePlusInitials'],
    national_id: ['checkId'],
    last_name: ['checkName']
  };

  const rules: Record<DetailModules, Record<string, string[]>> = {
    school: { name: ['checkNameMulti'], email: ['checkEmail'] },
    userDetail: commonRules,
    schoolAdmin: commonRules,
    teacher: commonRules,
    librarian: commonRules,
    parent: commonRules,
    student: commonRules,
    address: {},
    nextOfKin: {}
  };

  function getPermission(
    module: DetailModules,
    property: string
  ): string | boolean {
    if (readOnly.includes(property) || property.startsWith('group_'))
      return false;
    if (permissions[module])
      return permissions[module][property] || permissions[module]['other'];
    return false;
  }
  function formatForDisplay(val: string) {
    const value = (val.startsWith('is_') && val.slice(3)) || val;
    const list = value.split('_');
    const formatted = list.join(' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function prepareStore(key: string) {
    return (
      (selects[key] && `${selects[key].split('||')[1]}/${key}`) ||
      `${module}/${key}`
    );
  }

  function generateDE(key: string) {
    de.push({
      permission: getPermission(module, key),
      label: displayNames[key] || formatForDisplay(key),
      icon: getIcon((key.startsWith('is_') && key.slice(3)) || key),
      store: prepareStore(key),
      optionsStore: (selects[key] && selects[key].split('||')[0]) || undefined,
      rules: rules[module][key] || [],
      date: (key === 'dob' && true) || false
    });
  }

  for (const key in obj) {
    if (filter) {
      if (startsWith)
        for (const val of filter) {
          if (key.startsWith(val)) {
            generateDE(key);
            break;
          }
        }

      if (allowedKeys.includes(key)) generateDE(key);
    } else {
      if (
        allowedKeys.includes(key) ||
        selects[key] ||
        readOnly.includes(key) ||
        displayNames[key] ||
        key.startsWith('is_')
      ) {
        if (key === 'address' && module !== 'address') {
        } else generateDE(key);
      }
    }
  }
  return de;
}
interface ChangesOptions {
  boolKey?: string;
  objKey?: string;
}
export function updateState(
  arg: UpdateStateOptions,
  changes?: Record<string, ChangesOptions | undefined>,
  exclude?: string[]
) {
  if ((exclude || []).includes(arg.state)) return;

  const stateList = arg.state.split('.');
  if (stateList.length == 2) {
    arg.module[stateList[0]][stateList[1]] = arg.value;
    return;
  }
  arg.module[arg.state] = arg.value;

  if (
    arg.state == 'changes' ||
    arg.state.endsWith('Changed') ||
    arg.state.endsWith('Changes')
  ) {
    return;
  }

  let changesObjKey = '',
    changesBoolKey = '';
  if (changes) {
    changesObjKey =
      changes[arg.state]?.objKey ||
      (!changes[arg.state] && changes['other']?.objKey) ||
      '';
    changesBoolKey =
      changes[arg.state]?.boolKey || changes['other']?.boolKey || '';
  }

  if (changesObjKey || arg.module.hasOwnProperty('changes'))
    arg.module[changesObjKey || 'changes'][arg.state] = arg.value;
  if (changesBoolKey || arg.module.hasOwnProperty('detailsChanged'))
    arg.module[changesBoolKey || 'detailsChanged'] = true;
}

export function updateAcadxModule(
  storeModule: { [index: string]: ModuleIndexType },
  data: { [index: string]: ModuleIndexType },
  exclude?: string[]
) {
  function update(
    storeModule: AcadxModuleOptions,
    data: AcadxModuleOptions,
    exclude?: string[]
  ) {
    const dateKeys = ['dob'];
    const dateTimeKeys = ['join_date', 'date_joined'];
    resetObj(storeModule);
    if (storeModule.cacheIndex) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (storeModule as any).cacheIndex.groupIndex = -1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (storeModule as any).cacheIndex.index = -1;
    }
    for (const key in storeModule) {
      if (isAcadxApiCallsStateKey(key)) {
        const specialKeys = ['baseChanges', 'changes'];
        if (specialKeys.includes(key)) storeModule[key] = {};
      }
      if (dateTimeKeys.includes(key) && typeof data[key] === 'string') {
        if (key === 'date_joined')
          storeModule.join_date = formatDateTime(data[key] as string);
        else storeModule[key] = formatDateTime(data[key] as string);
      } else if (dateKeys.includes(key) && typeof data[key] === 'string') {
        storeModule[key] = formatDate(data[key] as string);
      } else if (data.hasOwnProperty(key) && !exclude?.includes(key)) {
        storeModule[key] = data[key];
        if (typeof data[key] === 'object') {
          if (key === 'address') rootCommit('address/update', data.address);
          if (key === 'user') rootCommit('userDetail/update', data.user || {});
          if (key === 'current_term')
            rootCommit('currentTerm/update', data[key]);
          if (key === 'next_of_kin') rootCommit('nextOfKin/update', data[key]);
        }
      }
    }
  }
  update(
    storeModule as AcadxModuleOptions,
    data as AcadxModuleOptions,
    exclude
  );
}

export function updateSelectOptions(
  arrayToUpdate: SelectOptions[],
  dataObj: Record<string, string>
) {
  arrayToUpdate.length = 0;
  for (const key in dataObj) {
    arrayToUpdate.push({
      label: dataObj[key],
      value: parseInt(key)
    });
  }
}
