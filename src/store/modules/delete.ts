import { VuexModule, Module, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import { UserOptions, SchoolOptions } from 'src/interfaces';
import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import { get as getCookie } from 'es-cookie';
import { getBaseUrl } from 'src/helpers';

@Module({ dynamic: true, store: store, name: 'delete' })
class Delete extends VuexModule {
  [index: string]: ModuleIndexType;

  @Action
  dialog({
    msg,
    action,
    payload
  }: {
    msg: string;
    action: string;
    payload: { user: UserOptions; url: string; successAction: string };
  }) {
    Vue.prototype.$q
      .dialog({
        title: 'ACADX',
        message: msg,
        cancel: true,
        persistent: true,
        transitionShow: 'slide-down',
        dark: true
      })
      .onOk(() => {
        this.context.dispatch(action, payload);
      });
  }

  @Action
  async deleteUser({
    user,
    url,
    successAction
  }: {
    user: UserOptions;
    url: string;
    successAction: string;
  }) {
    if (getCookie('access_token') || user.token) {
      this.context.dispatch('startLoading', `Deleting ${user.first_name} ...`);
      try {
        const response: AxiosResponse | void = await axios.delete(
          `${url}${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${
                user.token
                  ? user.token
                  : getCookie('access_token')
                  ? getCookie('access_token')
                  : ''
              }`
            }
          }
        );
        this.context.dispatch('stopLoading');
        if (response) {
          this.context.dispatch('notify', [
            'positive',
            `${user.first_name} ${user.last_name} was deleted`
          ]);
          this.context.dispatch(successAction);
        }
      } catch (error) {
        console.info(error);
        this.context.dispatch('stopLoading');
        if (error.message == 'Network Error') {
          this.context.dispatch('notify', [
            'negative',
            'Network connection could not be established'
          ]);
        } else {
          if (error.response && error.response.status == 403) {
            this.context.dispatch('notify', [
              'negative',
              `403 ${error.response.data.detail}`
            ]);
          } else {
            this.context.dispatch('notify', ['negative', 'server error']);
          }
        }
      }
    }
  }

  @Action
  deleteSchool(school: SchoolOptions) {
    Vue.prototype.$q
      .dialog({
        title: 'ACADX',
        message: `Are you sure you want to delete ${school.name}?`,
        cancel: true,
        persistent: true,
        transitionShow: 'slide-down',
        dark: true
      })
      .onOk(() => {
        if (getCookie('access_token') || this.token) {
          (async () => {
            this.context.dispatch(
              'startLoading',
              `Deleting ${school.name} SchoolOptions ...`
            );
            try {
              const response: AxiosResponse | void = await axios.delete(
                `${getBaseUrl()}/schools/update-destroy/${school.id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${
                      this.token
                        ? this.token
                        : getCookie('access_token')
                        ? getCookie('access_token')
                        : ''
                    }`
                  }
                }
              );
              this.context.dispatch('stopLoading');
              if (response) {
                this.context.dispatch('deleteSchoolLocal', school);
                this.context.dispatch('notify', [
                  'positive',
                  `${school.name} was deleted`
                ]);
                this.context.dispatch('push', '/schools/');
              }
            } catch (error) {
              console.info(error);
              this.context.dispatch('stopLoading');
              if (error.message == 'Network Error') {
                this.context.dispatch('notify', [
                  'negative',
                  'Network connection could not be established'
                ]);
              } else {
                if (error.response && error.response.status == 403) {
                  this.context.dispatch('notify', [
                    'negative',
                    `403 ${error.response.data.detail}`
                  ]);
                } else {
                  this.context.dispatch('notify', ['negative', 'server error']);
                }
              }
            }
          })();
        }
      });
  }

  @Action
  deleteSpecialUser(user: UserOptions) {
    this.dialog({
      msg: `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
      action: 'deleteUser',
      payload: {
        user: user,
        url: `${getBaseUrl()}/users/special/`,
        successAction: 'specialUsers'
      }
    });
  }
}
export default Delete;
