/* eslint-disable @typescript-eslint/camelcase */
import { StoreStateOptions } from 'src/interfaces';
import { getValue } from './utils';
import store from 'src/store';
import { isModuleKey, getModuleState } from 'src/type-guards';

export const rootCommit = (action: string, payload?: unknown) =>
  store.commit(action, getValue(payload), { root: true });

export const rootDispatch = async (action: string, payload?: unknown) =>
  await store.dispatch(action, getValue(payload), { root: true });

export const getStore = (storeString: string): StoreStateOptions => {
  /**string format
   * <module>
   * <module>/<state>//<get>
   * <module>//<get>/<state>
   */
  const storeData: StoreStateOptions = {
    module: 'page',
    state: '',
    get: ''
  };
  if (!storeString.includes('/') && !storeString.includes('//')) {
    if (isModuleKey(storeString)) storeData.module = storeString;
    return storeData;
  }
  const moduleKey = storeString.slice(0, storeString.indexOf('/'));
  if (isModuleKey(moduleKey)) storeData.module = moduleKey;
  storeString = storeString.replace('//', '#');

  if (storeString.includes('/') && storeString.includes('#')) {
    if (storeString.indexOf('/') < storeString.indexOf('#')) {
      storeData.state = storeString.slice(
        storeString.indexOf('/') + 1,
        storeString.indexOf('#')
      );
      storeData.get = storeString.slice(storeString.indexOf('#') + 1);
    } else {
      storeData.state = storeString.slice(storeString.indexOf('/') + 1);
      storeData.get = storeString.slice(
        storeString.indexOf('#') + 1,
        storeString.indexOf('/')
      );
    }
  } else if (storeString.includes('/'))
    storeData.state = storeString.slice(storeString.indexOf('/') + 1);
  else storeData.get = storeString.slice(storeString.indexOf('#') + 1);
  return storeData;
};

const prepareState = (storeInfo: StoreStateOptions) => {
  const { module, get, state } = storeInfo;
  if (!state && !get) return getModuleState(store.state, module);

  const getsOrStates = (get && get.split('|')) || state.split('|');
  getsOrStates.push('**end**');
  for (const value of getsOrStates) {
    const stateList = value.split('.');
    let processedState =
      (get && store.getters[`${module}/${value}`]) ||
      store.state[module][stateList[0]];

    if (state)
      for (const value of stateList.slice(1))
        processedState = processedState[value];

    if (getsOrStates.length == 2) return processedState;
    if (processedState) return processedState;
    if (value === '**end**') return false;
  }
};

export const getState = (storeInfo: string) =>
  prepareState(getStore(storeInfo));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setState(storeInfo: string, value: unknown): void {
  const { module, state } = getStore(storeInfo);
  rootCommit(`${module}/updateState`, {
    state: state,
    value: value,
    module: getState(module)
  });
}

export function getOrAddParent(nationalId: string): any | undefined;
export function getOrAddParent(parent: { national_id: string }): void;
export function getOrAddParent(data: string | { national_id: string }): any {
  if (typeof data == 'string')
    return rootDispatch('data/parentCache', { national_id: data });
  else return rootDispatch('data/parentCache', { parent: data });
}

export function cacheObj(module: string, obj: {}) {
  rootDispatch('data/cacheObj', { module: module, obj: obj });
}

export function getBaseUrl() {
  return getState('constants/baseUrl');
}
