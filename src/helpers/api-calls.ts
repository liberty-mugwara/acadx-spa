import axios, { AxiosResponse } from 'axios';
import { get as getCookie } from 'es-cookie';
import { stopLoader, notify } from './ui';
import { getState, setState } from './store-helper';

export const apiTryCatch = async (
  promise: Promise<AxiosResponse>,
  errorHandler?: (error: Error) => void
) => {
  let response;
  try {
    response = await promise;
    return response;
  } catch (error) {
    stopLoader();
    if (error.message == 'Network Error')
      notify('negative', 'Network connection could not be established');
    else if (errorHandler) errorHandler(error);
    else if (error.response)
      notify(
        'negative',
        `${error.response.status} ${error.response.statusText || ' '}: ${error
          .response.data.detail ||
          'Sorry your request could not be processed'} `
      );
    else notify('negative', 'An error occurred');
  }
};

export const setHeader = () => {
  const token = getState('user/token') || getCookie('access_token') || '';
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const get = async (
  url: string,
  pagination?: boolean,
  errorHandler?: (error: Error) => void
) => {
  const limit = getState('page/limit');
  const offset = getState('page//currentOffset');

  const path =
    (pagination &&
      getState('page/currentPage') &&
      `${url}?limit=${limit}&offset=${offset}`) ||
    url;

  const response = await apiTryCatch(
    axios.get(path, setHeader()),
    errorHandler
  );
  if (pagination && response) {
    const pageInfo = response.headers.pagination.split(',');
    const limit = parseInt(pageInfo[0]);
    const total = parseInt(pageInfo[1]);
    if (total > limit) {
      setState('page/pagination', true);
      setState('page/limit', limit);
      setState('page/totalItems', total);
      if (!getState('page/currentPage')) setState('page/currentPage', 1);
    } else setState('page/pagination', true);
  }
  return response;
};

export const post = async (
  url: string,
  payload: object,
  errorHandler?: (error: Error) => void
) => await apiTryCatch(axios.post(url, payload, setHeader()), errorHandler);

export const patch = async (
  url: string,
  payload: object,
  errorHandler?: (error: Error) => void
) => await apiTryCatch(axios.patch(url, payload, setHeader()), errorHandler);
