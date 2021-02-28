import { VuexModule, Module } from 'vuex-module-decorators';
import store from 'src/store';
@Module({ dynamic: true, store: store, namespaced: true, name: 'constants' })
export class Constants extends VuexModule {
  limit = 10;
  baseUrl = 'https://morning-hamlet-81284.herokuapp.com'; //production
  //baseUrl = 'http://127.0.0.1:8000'; //dev
}
