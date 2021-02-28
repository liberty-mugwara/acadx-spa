import { getModule } from 'vuex-module-decorators';
import { Data } from 'src/store/modules/data';
import Loader from 'src/store/modules/loader';
import Notifications from 'src/store/modules/notify';
import { Address, NextOfKin } from 'src/store/modules/common';
import { User, UserDetail } from 'src/store/modules/users';
import {
  School,
  CurrentTerm,
  Classes,
  SchoolAdmin,
  ClassSubjectTeacher
} from 'src/store/modules/school';
import Form from 'src/store/modules/forms';
import Delete from 'src/store/modules/delete';
import { Pagination } from './pagination';
import { Constants } from './constants';
import { Router } from './router';

export const router = getModule(Router);
export const constants = getModule(Constants);
export const data = getModule(Data);
export const page = getModule(Pagination);
export const address = getModule(Address);
export const nextOfKin = getModule(NextOfKin);
export const loader = getModule(Loader);
export const notifs = getModule(Notifications);
export const user = getModule(User);
export const userDetail = getModule(UserDetail);
export const form = getModule(Form);
export const del = getModule(Delete);
export const school = getModule(School);
export const classes = getModule(Classes);
export const classSubjectTeacher = getModule(ClassSubjectTeacher);
export const currentTerm = getModule(CurrentTerm);
export const schoolAdmin = getModule(SchoolAdmin);
