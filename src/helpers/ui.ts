import { rootCommit, rootDispatch } from './store-helper';

export const changesList = (changes: object) => {
  let changesString = '';
  for (const key in changes) {
    changesString =
      (changesString && `${changesString}, ${key.replace('_', ' ')}`) ||
      key.replace('_', ' ');
  }
  return changesString;
};

//start loading
export const load = (message?: string | object) => {
  const msg =
    typeof message == 'string'
      ? message
      : typeof message == 'object'
      ? changesList(message)
      : '';
  rootCommit('updateMsg', msg);
  rootCommit('addLoader');
  rootCommit('load', true);
  return msg;
};

//stop loading
export const stopLoader = () => {
  rootCommit('removeLoader');
  rootCommit('load', false);
};

//* notifications
export const notify = (
  type: 'positive' | 'negative' | 'info',
  message: string
) => rootDispatch('notify', [type, message]);
