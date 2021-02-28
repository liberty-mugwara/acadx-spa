/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from 'src/store';
import { CurrentTermOptions, SchoolOptions } from 'src/interfaces';
import * as helpers from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'currentTerm' })
export class CurrentTerm extends VuexModule implements CurrentTermOptions {
  [index: string]: string | boolean | number | unknown;
  term = {
    id: 0,
    name: '',
    position: 0
  };
  last_edited_by = {};

  @Mutation
  update(cterm: CurrentTermOptions) {
    this.term = cterm.term;
    this.last_edited_by = cterm.last_edited_by;
  }

  @Action({ commit: 'update' })
  async changeCurrentTerm(school: SchoolOptions) {
    helpers.load('Updating current term ...');
    const response = await helpers.post(
      `${helpers.getBaseUrl()}/schools/update-current-term/`,
      {
        school_id: school.id,
        production: school.production
      }
    );
    helpers.stopLoader();
    if (response) {
      helpers.notify('positive', 'Current Term updated');
      return response.data;
    }
  }
}
