import { rootCommit } from './store-helper';
import { get } from './api-calls';

export const formValid = (successMessage?: string, value?: string): true => {
  rootCommit('form/updateSuccessText', successMessage);
  value && rootCommit('form/updateCheckedOk', value.toLowerCase());
  rootCommit('form/updateSuccess', true);
  return true;
};

export const formError = (errorMessage: string, value?: string) => {
  rootCommit('form/updateError', true);
  value && rootCommit('form/updateCheckedNotOk', value.toLowerCase());
  return errorMessage;
};

export const formAvailable = async (
  url: string,
  testValue: string,
  errorMessage: string,
  successMessage: string
): Promise<true | string> => {
  const response = await get(`${url}${testValue}`);
  return (
    (response?.data.available && formValid(successMessage, testValue)) ||
    formError(errorMessage, testValue)
  );
};
