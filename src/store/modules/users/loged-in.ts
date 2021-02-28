/* eslint-disable @typescript-eslint/camelcase */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store, { ModuleIndexType } from 'src/store';
import * as helpers from 'src/helpers';
import {
  set as setCookie,
  get as getCookie,
  remove as removeCookie
} from 'es-cookie';
import { Cookies } from 'quasar';
import { UserRolesOptions, UpdateStateOptions } from 'src/interfaces';
import { SessionStorage } from 'quasar';

@Module({ dynamic: true, store: store, namespaced: true, name: 'user' })
export class User extends VuexModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: ModuleIndexType;

  date_joined = '';
  email = '';
  first_name = '';
  id = 0;
  is_active = false;
  is_librarian = false;
  is_parent = false;
  is_school_admin = false;
  is_staff = false;
  is_student = false;
  is_superadmin = false;
  is_superuser = false;
  is_supervisor = false;
  is_teacher = false;
  last_name = '';
  loginBusy = false;
  national_id = '';

  token = '';
  profile = '';
  school = 0;
  user_id = 0;
  user_role = '';
  //  user  groups
  group_0 = false;
  group_1 = false;
  group_2 = false;
  group_0_1 = false;
  group_4 = false;
  group_5 = false;
  group_6 = false;
  group_7 = false;
  group_8 = false;

  toCreate = {
    user_type: 'Acadx Staff',
    national_id: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: ''
  };

  toRegister: {
    [key: string]: string | number | boolean;
    first_name: string;
    last_name: string;
    message: string;
    user_type: string;
  } = {
    message: 'Welcome to Acadx',
    hint: 'Enter your national id', // instructions for registration
    user_type: '', //updated by the form module after id verification
    national_id: '',
    verified: false, //passed the verification test
    id: 0, //profile id used for stage2 registration
    first_name: '',
    last_name: '',
    employee_number: '',
    dob: '',
    email: '',
    password: '',
    password2: ''
  };

  useBirthEntryNumber = false;

  get authenticated() {
    return this.user_id != 0;
  }

  get accessToken() {
    return this.token;
  }

  get fullname() {
    return `${this.first_name} ${this.last_name}`;
  }

  @Mutation
  public useBEN(state: boolean): void {
    this.useBirthEntryNumber = state;
  }

  @Mutation
  public updateState(arg: UpdateStateOptions): void {
    if (arg.state === 'toCreate.user_type' && typeof arg.value === 'number') {
      const types = ['Superuser', 'Supervisor', 'Acadx Staff', 'Superadmin'];
      this.toCreate.user_type = types[arg.value - 1];
    }
    helpers.updateState(arg, undefined, ['toCreate.user_type']);
  }

  @Mutation
  update(data: UserRolesOptions): void {
    helpers.updateAcadxModule(this, data);
    this.toRegister.message = 'Welcome to Acadx';
    this.toRegister.hint = 'Enter your national id';
    this.toCreate.user_type = 'Acadx Staff';
  }

  @Mutation
  resetUser(): void {
    helpers.resetObj(this);
    this.toRegister.message = 'Welcome to Acadx';
    this.toRegister.hint = 'Enter your national id';
  }
  @Mutation
  resetObject(key: string): void {
    helpers.resetObj(this[key]);
    if (key === 'toRegister') {
      this.toRegister.message = 'Welcome to Acadx';
      this.toRegister.hint = 'Enter your national id';
    }
  }

  @Action
  async getActiveSchool(user: UserRolesOptions) {
    const admin = user.is_school_admin || user.is_superadmin;
    const urlPart = admin
      ? 'get-by-admin'
      : user.is_teacher
      ? 'get-by-teacher'
      : user.is_librarian
      ? 'get-by-librarian'
      : user.is_student
      ? 'get-by-student'
      : 'error';

    const url = `${helpers.getBaseUrl()}/schools/${urlPart}/${user.user_id}`;
    return await helpers.rootDispatch('data/getActiveSchool', {
      pk: user.user_id,
      url: url
    });
  }

  @Action
  async getSchools(parentId: number) {
    return await helpers.rootDispatch('data/getParentSchools', parentId);
  }

  @Action
  async getUserRoles() {
    let roles: UserRolesOptions | null = null;

    roles = SessionStorage.getItem('userRoles');

    if (!roles) {
      const response = await helpers.get(
        `${helpers.getBaseUrl()}/users/user-roles/`
      );
      if (response) {
        roles = response.data;
        SessionStorage.set('userRoles', roles);
      } else this.logout();
    }
    roles && this.context.commit('update', roles);
    return roles;
  }

  @Action
  getSchool(user: UserRolesOptions) {
    if (user.group_8 && !user.group_2)
      if (user.is_parent) this.getSchools(user.user_id);
      else this.getActiveSchool(user);
  }

  @Action
  private async getToken(data: { password: string; username: string }) {
    if (getCookie('access_token')) {
      helpers.setState('users/token', getCookie('access_token'));
      return true;
    }
    const response = await helpers.post(
      `${helpers.getBaseUrl()}/users/token/`,
      {
        username: data.username,
        password: data.password
      }
    );
    if (response) {
      const secondsFromNow = new Date();
      secondsFromNow.setSeconds(
        secondsFromNow.getSeconds() + response.data.expires - 3600
      );
      setCookie('access_token', response.data.cookieData.access_token, {
        expires: secondsFromNow
        //secure: true,
        //sameSite: 'strict'
      });

      helpers.setState('users/token', getCookie('access_token'));
    }
    return response;
  }

  @Action
  async auth() {
    if (getCookie('access_token') || this.token) {
      const cachedModules = [
        'schoolAdmin',
        'teacher',
        'librarian',
        'parent',
        'student',
        'userDetail'
      ];
      if (!helpers.getState('school/id'))
        helpers.rootDispatch('data/getActiveSchool', {});

      for (const module of cachedModules) {
        const data = await helpers.rootDispatch('data/getCachedObject', module);
        data && helpers.rootCommit(module + '/update', data);
      }
      if (!this.token) {
        const data = await this.getUserRoles();
        if (data) {
          this.getSchool(data);
          helpers.setState('users/token', getCookie('access_token'));
        } else {
          helpers.push('/signin/');
          return;
        }
      }
      helpers.push(-1);
    } else helpers.push('/signin/');
  }

  @Action
  authR() {
    if (!this.authenticated) {
      helpers.push('/auth');
    }
  }

  @Action
  public async login(data: { password: string; username: string }) {
    if (!this.loginBusy) {
      helpers.setState('user/loginBusy', true);
      helpers.load('Logging in ...');
      const token = await this.getToken(data);
      helpers.stopLoader();
      if (token) helpers.push('/acadx/');
      helpers.setState('user/loginBusy', false);
    }
  }

  @Action
  async logout() {
    if (getCookie('access_token') || this.token) {
      const response = await helpers.post(
        `${helpers.getBaseUrl()}/users/token/revoke/`,
        {
          access_token: getCookie('access_token') || this.token
        }
      );

      if (response && response.data.hasOwnProperty('error')) {
        helpers.notify('negative', 'server error');
        return;
      }
      removeCookie('access_token');
      SessionStorage.remove('userRoles');
      this.context.commit('resetUser');
      helpers.notify(
        'info',
        'You have successfully logged out.Call again soon!'
      );
      helpers.push('/');
    }
  }

  /// user creations
  @Action({ commit: 'updateCreateUserType' })
  toCreateUser(type: number) {
    helpers.push('/acadx/create-user/');
    return type;
  }

  @Action
  async createUser() {
    await helpers.createNoCache(
      'userDetail',
      `${helpers.getBaseUrl()}/users/create/`,
      this.toCreate
    );
  }

  @Action
  async register() {
    const name = `${this.toRegister.first_name} ${this.toRegister.last_name}`;
    helpers.load(`Creating ${name}...`);
    const response = await helpers.post(
      `${helpers.getBaseUrl()}/users/register/`,
      this.toRegister
    );
    helpers.stopLoader();

    if (response) {
      this.context.commit('resetObject', 'toRegister');
      helpers.push('/signin/');
    }
  }
}
