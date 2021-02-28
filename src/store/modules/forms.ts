import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from 'src/store';
import * as helpers from 'src/helpers';
import { getState } from 'src/helpers';

@Module({ dynamic: true, store: store, namespaced: true, name: 'form' })
class Form extends VuexModule {
  loading = false;
  edit = false;
  error = false;
  detailsChanged = false;
  changesSaved = false;
  checkedOk: Array<string> = [];
  checkedNotOk: Array<string> = [];
  email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  alpha = /^[a-zA-Z]*$/;
  alphaSpace = /^[a-zA-Z][a-zA-Z\s]*$/;
  nameInitials = /^[a-zA-Z][a-zA-Z]*[\s][a-zA-z][a-zA-z]*$/;
  nameSpace = /^[a-zA-Z][a-zA-Z]*[\s]*$/;
  id = /^(\d\d-\d\d\d\d\d\d+[a-zA-Z]\d\d)$/;
  veryStrongPassword = /^(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[!@#$&*]).{8,}$/;
  strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*]).{8,}$/;
  mediumPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
  password = '';
  success = false;
  successText = '';
  successColor = 'primary';

  get password1(): string {
    return this.password;
  }

  @Mutation
  public updateDetailsChanged(val: boolean) {
    this.detailsChanged = val;
  }
  @Mutation
  public updateEdit(val: boolean) {
    this.edit = val;
  }
  @Mutation
  public updateError(val: boolean) {
    this.error = val;
    if (!val) {
      this.error = val;
      this.success = false;
      this.loading = false;
    } else this.error = val;
  }
  @Mutation
  public updateChangesSaved(val: boolean) {
    if (val == true) {
      this.changesSaved = val;
      this.detailsChanged = false;
      if (this.edit) this.edit = false;
    } else this.changesSaved = val;
  }

  @Mutation
  public updateSuccess(val: boolean) {
    if (val) {
      this.success = val;
      this.error = false;
      this.loading = false;
    } else this.success = val;
  }

  @Mutation
  hideSuccess() {
    this.success = false;
  }

  @Mutation
  public updateSuccessText(val: string) {
    this.successText = val;
  }
  @Mutation
  public updateSuccessColor(val: string) {
    this.successColor = val;
  }

  @Mutation
  public updatePassword(password: string) {
    this.password = password;
  }

  @Mutation
  public updateLoadingState(state: boolean) {
    if (state) {
      this.loading = true;
      this.success = false;
      this.error = true;
    } else this.loading = false;
  }

  @Mutation
  public updateCheckedOk(item: string) {
    const checked = this.checkedOk.find(val => val == item);
    checked || this.checkedOk.unshift(item);
  }

  @Mutation
  public updateCheckedNotOk(item: string) {
    const checked = this.checkedNotOk.find(val => val == item);
    checked || this.checkedNotOk.unshift(item);
  }

  @Action
  public registerDetailChange() {
    this.context.commit('updateChangesSaved', false);
    this.context.commit('updateDetailsChanged', true);
  }
  @Action
  public startEditing() {
    this.context.commit('updateEdit', true);
    helpers.notify('info', 'Edit Mode ON');
  }
  @Action
  public stopEditing() {
    this.context.commit('updateEdit', false);
    helpers.notify('info', 'Edit Mode OFF');
  }

  @Action
  required(val: string | number): true | string {
    return (
      (!!val && helpers.formValid()) ||
      helpers.formError('This field is required')
    );
  }

  @Action
  isAlpha(name: string | number): true | string {
    if (typeof name == 'number')
      return 'Name does not support inputs of type number';

    return (
      (this.alpha.test(name) && helpers.formValid('Good')) ||
      helpers.formError('Name must contain alphabet letters only')
    );
  }

  @Action
  checkNamePlusInitials(name: string | number): true | string {
    if (typeof name == 'number')
      return 'Name does not support inputs of type number';

    if (this.alpha.test(name) || this.nameInitials.test(name)) {
      return (
        (name.length > 1 && helpers.formValid('Good')) ||
        helpers.formError('Name must be at least 2 letters')
      );
    }
    return (
      (this.nameSpace.test(name) && helpers.formError('Enter Initials')) ||
      helpers.formError('Name must contain alphabet letters and spaces only')
    );
  }

  @Action
  checkNameMulti(name: string | number): true | string {
    if (typeof name == 'number')
      return 'Name does not support inputs of type number';

    if (this.alphaSpace.test(name)) {
      return (
        (name.length > 1 && helpers.formValid('Good')) ||
        helpers.formError('Name must be at least 2 letters')
      );
    }
    return helpers.formError(
      'Name must contain alphabet letters and spaces only'
    );
  }

  @Action
  checkName(name: string | number): true | string {
    if (typeof name == 'number')
      return 'Name does not support inputs of type number';

    if (this.alpha.test(name)) {
      return (
        (name.length > 1 && helpers.formValid('Good')) ||
        helpers.formError('Name must be at least 2 letters')
      );
    }
    return helpers.formError('Name must contain alphabet letters only');
  }

  @Action
  passwordsMatch(password2: string | number): true | string {
    if (typeof password2 == 'number')
      return 'Password Matching does not support inputs of type number';

    return (
      (this.password1 === password2 && helpers.formValid('Passwords Match')) ||
      helpers.formError('Passwords do not match')
    );
  }

  @Action
  checkPassword(val: string | number): true | string {
    if (typeof val == 'number')
      return 'Passwords does not support inputs of type number';

    if (this.veryStrongPassword.test(val)) {
      this.updatePassword(val);
      this.updateSuccessColor('deep-purple-8');
      return helpers.formValid('Very strong password');
    }
    if (this.strongPassword.test(val)) {
      this.updatePassword(val);
      this.updateSuccessColor('purple-7');
      return helpers.formValid('Strong password');
    }
    if (this.mediumPassword.test(val)) {
      this.updatePassword(val);
      this.updateSuccessColor('teal-8');
      return helpers.formValid('Medium strength password');
    }

    return helpers.formError(
      'Weak password, password must be at least 8 characters, containing uppercase and lowercase letters, numbers and or special characters'
    );
  }
  @Action
  public async checkEmail(value: string | number): Promise<true | string> {
    if (typeof value == 'number')
      return 'Emails does not support inputs of type number';

    const val = value.toLowerCase(); //important
    if (!this.email.test(val))
      return helpers.formError('Enter a valid email address');

    if (this.checkedNotOk.includes(val))
      return helpers.formError('Email not available');

    if (this.checkedOk.includes(val))
      return helpers.formValid('This email is available');

    return helpers.formAvailable(
      `${helpers.getBaseUrl()}/users/is-email-available/`,
      val,
      'Email not available',
      'This email is available'
    );
  }

  @Action
  public async checkId(value: string | number) {
    if (typeof value == 'number')
      return 'Id does not support inputs of type number';

    let val = value.toLowerCase(); //!important
    this.context.commit('updateLoadingState', true);

    if (!this.id.test(val))
      return helpers.formError('Enter a valid Zimbabwean Id');

    if (this.checkedNotOk.includes(val))
      return helpers.formError('Id not available');

    if (this.checkedOk.includes(val))
      return helpers.formValid('This id is available');

    val = val.toUpperCase(); //!important for correct results
    return helpers.formAvailable(
      `${helpers.getBaseUrl()}/users/is-id-available/`,
      val,
      'Id not available',
      'This id is available'
    );
  }

  @Action
  public async checkBEN(value: string | number) {
    if (typeof value == 'number')
      return 'Birth Entry Number does not support inputs of type number';

    let val = value.toLowerCase(); //!important
    this.context.commit('updateLoadingState', true);

    if (val.length < 5)
      return helpers.formError(
        'Birth Entry number must be greater than 4 characters'
      );

    if (this.checkedNotOk.includes(val))
      return helpers.formError('Birth Entry number not available');

    if (this.checkedOk.includes(val))
      return helpers.formValid('Birth Entry number is available');

    val = val.toUpperCase(); //!important for correct results
    return helpers.formAvailable(
      `${helpers.getBaseUrl()}/users/is-id-available/`,
      val,
      'Birth Entry number not available',
      'Birth Entry number is available'
    );
  }

  @Action
  public async registrationStage1(value: string | number) {
    if (typeof value == 'number')
      return 'Id does not support inputs of type number';

    let val = value.toLowerCase(); //!important
    this.context.commit('updateLoadingState', true);

    if (helpers.getState('user/useBirthEntryNumber')) {
      if (val.length < 5)
        return helpers.formError(
          'Birth Entry number must be greater than 4 characters'
        );
    } else if (!this.id.test(val))
      return helpers.formError('Enter a valid Zimbabwean Id');

    val = val.toUpperCase(); //!important for correct results
    const response = await helpers.get(
      `${helpers.getBaseUrl()}/users/register/${val}`
    );
    if (response) {
      if (response.data.registered) {
        helpers.notify('info', 'You are already registered please login!');
        helpers.push('/signin/');
      }
      if (!response.data.found)
        return helpers.formError('Id not in system', val);
      else {
        helpers.setState('user/toRegister.hint', response.data.message);
        helpers.setState(
          'user/toRegister.first_name',
          response.data.first_name
        );
        helpers.setState('user/toRegister.last_name', response.data.last_name);
        helpers.setState('user/toRegister.user_type', response.data.user_type);
        helpers.setState('user/toRegister.id', response.data.id);
        return helpers.formValid(
          `welcome ${response.data.first_name} ${response.data.last_name}`,
          val
        );
      }
    }
    return helpers.formError('An error occurred, try again');
  }

  @Action
  public async registrationStage2() {
    const data = helpers.getState('user/toRegister');
    if (
      data.employee_number &&
      this.checkedNotOk.includes(data.employee_number)
    )
      return helpers.formError('Information you provided is incorrect');

    if (data.employee_number && this.checkedOk.includes(data.employee_number))
      return helpers.formValid('verified!');

    if (data.dob && this.checkedNotOk.includes(data.dob))
      return helpers.formError('Information you provided is incorrect');

    if (data.dob && this.checkedOk.includes(data.dob))
      return helpers.formValid('verified!');

    const response = await helpers.patch(
      `${helpers.getBaseUrl()}/users/register/verify/user/${data.id}`,
      data
    );

    if (response) {
      if (response.data.verified) {
        helpers.setState('user/toRegister.verified', true);
        return helpers.formValid('verified!', data.dob || data.employee_number);
      } else
        return helpers.formError(
          'Information you provided is incorrect',
          data.dob || data.employee_number
        );
    }
  }
  @Action
  async parentExists(nationalId: string | number) {
    if (typeof nationalId == 'number') return 'Parent does not exist';

    if (this.checkedNotOk.includes(nationalId))
      return helpers.formError('Information you provided is incorrect');

    if (!this.id.test(nationalId))
      return helpers.formError('Enter a valid Zimbabwean Id');

    const profile = helpers.getState(helpers.getState('user/profile'));
    if (profile?.national_id == nationalId) {
      helpers.setState('student/toCreate.parent_id', profile.id);
      helpers.setState('student/toCreate.last_name', profile.last_name);
      return helpers.formValid(
        `Parent selected: ${profile.first_name} ${profile.last_name}`
      );
    }

    const cachedParent = await helpers.getOrAddParent(nationalId);
    if (cachedParent) {
      if (cachedParent.school_id == getState('school/id')) {
        helpers.setState('student/toCreate.parent_id', cachedParent.id);
        helpers.setState('student/toCreate.last_name', cachedParent.last_name);
        return helpers.formValid(
          `Parent selected: ${cachedParent.first_name} ${cachedParent.last_name}`
        );
      }
    }
    const response = await helpers.get(
      `${helpers.getBaseUrl()}/schools/${helpers.getState(
        'school/id'
      )}/parent/${nationalId}`
    );
    if (response) {
      helpers.getOrAddParent(response.data);
      helpers.setState('student/toCreate.parent_id', response.data.id);
      helpers.setState('student/toCreate.last_name', response.data.last_name);
      return helpers.formValid(
        `Parent selected: ${response.data.first_name} ${response.data.last_name}`
      );
    }

    return helpers.formError('Parent does not exist', nationalId);
  }
}
export default Form;
