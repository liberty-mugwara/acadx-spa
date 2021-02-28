import store, {
  AcadxStoreModules,
  AcadxApiCallsStateKeys,
  AcadxApiCallsState,
  AcadxStateChangeKeys,
  AcadxArrayApiCallsStateKeys
} from 'src/store';
import { ClassCreateOptions } from 'src/interfaces';

export function isClassCreateOptions(
  arg: unknown | ClassCreateOptions
): arg is ClassCreateOptions {
  return (
    (arg as ClassCreateOptions).index !== undefined &&
    (arg as ClassCreateOptions).name !== undefined &&
    (arg as ClassCreateOptions).level_id !== undefined
  );
}

export function getModuleState<T, K extends keyof T>(o: T, propertyName: K) {
  return o[propertyName];
}

export function isModuleKey(
  propertyName: string
): propertyName is AcadxStoreModules {
  for (const key in store.state) {
    if (key === propertyName) return true;
  }
  return false;
}

export function isAcadxApiCallsStateKey(
  propertyName: string
): propertyName is AcadxApiCallsStateKeys {
  const keys = ['toCreate', 'toRegister', 'changes', 'baseChanges'];
  if (keys.includes(propertyName)) return true;

  return false;
}

export function isAcadxStateChangeKeys(
  propertyName: string
): propertyName is AcadxStateChangeKeys {
  const keys = [
    'baseChanged',
    'detailsChanged',
    'subjectsChanged',
    'termsChanged',
    'levelsChanged'
  ];
  if (keys.includes(propertyName)) return true;
  return false;
}

export function isAcadxArrayApiCallsStateKeys(
  propertyName: string
): propertyName is AcadxArrayApiCallsStateKeys {
  const keys = ['termsChanges', 'levelsChanges', 'acadx_subjects'];
  if (keys.includes(propertyName)) return true;
  return false;
}

export function isArray(obj: unknown): obj is [] {
  return Array.isArray(obj);
}
