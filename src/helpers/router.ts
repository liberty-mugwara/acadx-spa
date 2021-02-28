import { rootDispatch } from './store-helper';
import { ToRouterOptions } from 'src/interfaces';

export const push = (route: ToRouterOptions | string | number) =>
  rootDispatch('router/push', route);
