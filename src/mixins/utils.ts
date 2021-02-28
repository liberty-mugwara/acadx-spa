/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component, Prop, Mixins, Emit } from 'vue-property-decorator';
import { SelectOptions, UserRolesOptions } from 'src/interfaces';
import { form, user, userDetail } from 'src/store/modules';
import { getState, setState, getIcon, rootDispatch } from 'src/helpers';

interface Icons {
  [key: string]: string;
}

@Component
export class IconsMixin extends Vue {
  getIcon = (key: string) => getIcon(key);
}

@Component
export class UserRolesMixin extends Vue {
  userRoles = [
    'superuser',
    'supervisor',
    'staff',
    'superadmin',
    'school_admin',
    'teacher',
    'librarian',
    'parent',
    'student'
  ];

  userColors: Record<string, string> = {
    superuser: 'deep-purple',
    supervisor: 'purple',
    staff: 'pink',
    superadmin: 'pink-10',
    school_admin: 'deep-orange',
    teacher: 'light-blue',
    librarian: 'amber',
    parent: 'brown',
    student: 'teal'
  };

  get authenticated(): boolean {
    return user.user_id != 0;
  }
  get userRole(): string {
    return user.user_role;
  }
  get userIcon() {
    return getIcon(this.userRole);
  }
  get superuser(): boolean {
    return user.is_superuser;
  }
  get supervisor(): boolean {
    return user.is_supervisor;
  }
  get staff(): boolean {
    return user.is_staff;
  }

  get superadmin(): boolean {
    return user.is_superadmin;
  }

  get schoolAdmin(): boolean {
    return user.is_school_admin;
  }

  get teacher(): boolean {
    return user.is_teacher;
  }

  get librarian(): boolean {
    return user.is_librarian;
  }

  get student(): boolean {
    return user.is_student;
  }

  get parent(): boolean {
    return user.is_parent;
  }

  get group1(): boolean {
    return user.group_1;
  }
  get group2(): boolean {
    return user.group_2;
  }
  get group0(): boolean {
    return user.group_0;
  }
  get group01(): boolean {
    return user.group_0_1;
  }
  get group4(): boolean {
    return user.group_4;
  }
  get group5(): boolean {
    return user.group_5;
  }
  get group6(): boolean {
    return user.group_6;
  }
  get group7(): boolean {
    return user.group_7;
  }
  get group8(): boolean {
    return user.group_8;
  }
  getUserIcon(user: UserRolesOptions) {
    for (const role of this.userRoles) {
      if (user['is_' + role]) return getIcon(role);
    }
    return 'las la-user-cog';
  }

  getUserColor(user: UserRolesOptions) {
    for (const role of this.userRoles) {
      if (user['is_' + role]) return this.userColors[role];
    }
    return 'grey-4';
  }

  formatRoles(val: string) {
    const value = val.replace('is_', '');
    const list = value.split('_');
    return list.join(' ');
  }
  modifyUser = () => userDetail.commit();
}

@Component
export class VModelMixin extends Vue {
  @Prop() readonly value?: unknown;
  @Prop() store?: string;
  @Prop() optionsStore?: string;
  @Prop() selectOptions?: SelectOptions[];

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public input(val: unknown) {
    this.store && setState(this.store, val);
  }

  get model() {
    if (this.store) return getState(this.store);
    if (this.value) return this.value;
    return undefined;
  }
  set model(val: unknown) {
    this.input(val);
  }

  get options(): SelectOptions[] {
    if (this.optionsStore) return getState(this.optionsStore);
    if (this.selectOptions) return this.selectOptions;
    return [];
  }
}

@Component
export class ReactiveTitleMixin extends Vue {
  @Prop() readonly title?: string;
  get titleProp() {
    return this.title || '';
  }
  get reactiveTitle() {
    if (this.titleProp.includes('/')) return getState(this.titleProp);
    return this.titleProp;
  }
}
@Component
export class ClickableMixin extends Vue {
  @Prop() readonly click?: () => void;
}

@Component
export class PermissionMixin extends Vue {
  @Prop()
  readonly permission?: boolean | string;

  get permProp() {
    return this.permission || false;
  }

  get perm() {
    if (typeof this.permProp != 'boolean') return getState(this.permProp);
    else return this.permProp;
  }
}

@Component
export class InputSuccessMixin extends Vue {
  get loading(): boolean {
    return form.loading;
  }
  get success(): boolean {
    return form.success;
  }
  get successText(): string {
    return form.successText;
  }
  get successColor(): string {
    return form.successColor;
  }
}

@Component
export class PopupEditMixin extends Mixins(InputSuccessMixin) {
  get error(): boolean {
    return form.error;
  }
  validate() {
    return !this.error;
  }
  get edit(): boolean {
    return form.edit;
  }
  registerChange = () => form.registerDetailChange();
}

@Component
export class InputsMixin extends Mixins(VModelMixin) {
  @Prop() autofocus?: boolean;
  @Prop() color?: string;
  @Prop() date?: boolean;
  @Prop() debounce?: string;
  @Prop() dense?: boolean;
  @Prop() emit?: boolean;
  @Prop() filled?: boolean;
  @Prop() hint?: string;
  @Prop() inputClass?: string;
  @Prop() label?: string;
  @Prop() map?: boolean;
  @Prop() mask?: string;
  @Prop() multiple?: boolean;
  @Prop() placeholder?: string;
  @Prop() rules?: string[];
  @Prop() toggle?: boolean;
  @Prop() transitionHide?: string;
  @Prop() transitionShow?: string;
  @Prop() type?: string;

  prepareRules() {
    /**all form validation handled by the form module */
    function prepareRuleString(rule: string) {
      /**allow rules to be written in two formats
       * 1. 'checkEmail'
       * 2. 'form/checkEmail'
       */
      return (rule.startsWith('form/') && rule) || 'form/' + rule;
    }

    const rules: Array<(
      val: string | number
    ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string | true | Promise<string | true> | Promise<any>> = [];
    if (this.rules) {
      this.rules.forEach(ruleString => {
        rules.push((val: string | number) =>
          rootDispatch(prepareRuleString(ruleString), val)
        );
      });
    }
    return rules;
  }
}
