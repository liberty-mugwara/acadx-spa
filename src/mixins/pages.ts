import { Vue, Component, Mixins } from 'vue-property-decorator';
import {
  user,
  school,
  currentTerm,
  form,
  address,
  userDetail,
  nextOfKin
} from 'src/store/modules';
import DetailEdit from 'components/DetailEdit.vue';
import EDetailEdit from 'components/ExpansionDetailEdit.vue';
import SaveBtn from 'components/SaveBtn.vue';
import { SchoolOptions } from 'src/interfaces';
import {
  prepareDetailEdits,
  getState,
  rootDispatch,
  rootCommit,
  setState
} from 'src/helpers';
import { DetailModules, ModuleIndexType } from 'src/store';
import { UserRolesMixin } from './utils';

@Component({ components: { DetailEdit, EDetailEdit, SaveBtn } })
export class DetailMixin extends Mixins(UserRolesMixin) {
  activeMsg =
    'This user is active and can easily access Acadx.' +
    ' To modify this user click the floating action button and then edit.' +
    'Navigate to and click on the property you would like to change,save your changes';

  inactiveMsg =
    'This user is  inactive and can not access Acadx.' +
    ' To activate this user click the floating action button and then edit.' +
    ' Navigate to Acadx Permissions, click on Active, activate the user and save your changes';

  noUserMsg = 'This profile has no registered user account.';
  get school() {
    return school;
  }
  get module() {
    return user.profile;
  }
  get profile() {
    return getState(this.module);
  }

  get userDetail() {
    return userDetail;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  studentDetails(student: any, parent: Record<string, ModuleIndexType>) {
    setState('student/parent_type', this.module);
    rootDispatch('student/detail', student);
    rootCommit(this.module + '/update', parent);
  }
  get user() {
    return user;
  }

  get form() {
    return form;
  }
  get address() {
    return address;
  }
  get currentTerm() {
    return currentTerm;
  }

  updateProfile() {
    rootDispatch(this.module + '/commit');
  }

  updateSchool() {
    school.commit();
  }
  updateUser() {
    userDetail.commit();
  }

  updateNOK() {
    nextOfKin.commit();
  }

  updateAddress() {
    address.commit();
  }
  updateCurrentTerm(school: SchoolOptions) {
    this.currentTerm.changeCurrentTerm(school);
  }
  prepareDetailEdits(
    module: DetailModules,
    filter?: string[],
    startsWith?: boolean
  ) {
    return prepareDetailEdits(module, filter, startsWith);
  }
}
