<template>
  <div
    class="shadow-14 bg-brown-1"
    style="width:100%;max-width:1150px;min-height:100vh;height-auto"
  >
    <div class="flex column flex-center q-pt-xl q-mb-md justify-center">
      <div class="f-nano text-h2 w-100 text-center">{{ profile.first_name }} {{ profile.last_name }}</div>
      <p
        class="text-subtitle1 text-center q-pa-sm"
        style="max-width:600px"
      >{{ profile.user && getMsg(profile.user) || noUserMsg }}</p>
    </div>

    <div class="row q-pt-md q-mb-xl justify-center q-gutter-lg">
      <div
        style="height:320px;width:96%;max-width:400px;"
        class="details-panel column no-wrap q-pa-md text-grey-2 shadow-1"
      >
        <div style="width:100%" class="column justify-center items-center">
          <q-avatar style="background-color:rgba(255,255,255,.8)" text-color="dark" size="72px">
            {{ profile.first_name.charAt(0).toUpperCase()
            }}{{ profile.last_name.charAt(0).toUpperCase() }}
          </q-avatar>

          <div
            class="text-h4 text-white q-mt-md q-mb-xs"
          >{{ profile.first_name }} {{ profile.last_name }}</div>
          <div
            class="text-h5 q-mt-md q-mb-xs"
          >{{ profile.position||module==='schoolAdmin'&& 'School Admin'||module}}</div>
          <div class="text-h5 q-mt-md q-mb-xs">ID: {{ profile.national_id }}</div>
          <div
            class="text-h5 q-mt-md q-mb-xs"
          >EMAIL: {{profile.user && profile.user.email || profile.email }}</div>
        </div>
      </div>

      <div style="width:90%;max-width:600px;">
        <q-list bordered>
          <EDetailEdit
            headerClass="bg-secondary text-white text-subtitle1"
            label="Identity"
            :icon="getIcon('national_id')"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateProfile(),
        showCondition: `${module}/detailsChanged`,
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits(module,identity)"
          />
          <q-separator />
          <EDetailEdit
            label="Other"
            :icon="getIcon('join_date')"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateProfile(),
        showCondition: `${module}/detailsChanged`,
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits(module,other)"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1 bg-white"
            label="Address"
            icon="las la-map-marked-alt"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateAddress(),
        showCondition: 'address/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('address')"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1 bg-white"
            label="Next of kin"
            icon="las la-user-friends"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateNOK(),
        showCondition: 'nextOfKin/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('nextOfKin')"
          />
          <q-separator />
          <EDetailEdit
            v-if="profile.user"
            headerClass="text-subtitle1 bg-white"
            label="User Acadx Roles"
            :icon="getIcon('supervisor')"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('userDetail',acadxPermissions)"
          />
          <q-separator />
          <EDetailEdit
            v-if="profile.user"
            icon="las la-user-tie"
            label="User School Roles"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateUser(),
        permission: 'user/group_4',
        showCondition: 'userDetail/detailsChanged'
      }"
            :detailEdits="prepareDetailEdits('userDetail',schoolPermissions)"
          />
          <q-expansion-item
            group="group1"
            :icon="getIcon('student')"
            label="Children"
            header-class="bg-white"
          >
            <q-card class="bg-grey-3">
              <q-card-section class="overflow-hidden" style="min-height:150px">
                <div class="w-100">
                  <q-btn
                    v-if="group4"
                    class="q-ma-sm"
                    color="primary"
                    dense
                    icon="add"
                    @click="createStudent()"
                    label="Create Student"
                    size="md"
                  />
                </div>
                <q-intersection
                  v-for="child in profile.children"
                  :key="child.id"
                  transition="scale"
                  class="list-item"
                >
                  <q-item clickable class="bg-white q-mt-sm">
                    <q-item-section @click="() => studentDetails(child)" avatar top>
                      <q-avatar
                        :icon="getIcon('student')"
                        color="secondary"
                        size="md"
                        text-color="white"
                        font-size="24px"
                      />
                    </q-item-section>

                    <q-item-section @click="() => studentDetails(child)">
                      <q-item-label lines="1">
                        <span
                          class="text-weight-medium"
                        >{{ child.first_name }} {{ child.last_name }}</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section
                      class="q-gutter-x-sm overflow-hidden"
                      side
                    >{{ child.school_class}}</q-item-section>
                  </q-item>
                </q-intersection>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
    <!--row-->
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins } from 'vue-property-decorator';
import { DetailMixin, IconsMixin } from 'src/mixins';
import { push } from 'src/helpers';
import { UserRolesOptions } from '../../../interfaces';

@Component
export default class UserDetails extends Mixins(IconsMixin, DetailMixin) {
  getMsg(user: UserRolesOptions) {
    return (user.is_active && this.activeMsg) || this.inactiveMsg;
  }

  identity = ['first_name', 'last_name', 'national_id'];

  other = [
    'Position',
    'employee_number',
    'phone_number',
    'work_phone_number',
    'home_phone_number',
    'email',
    'join_date',
  ];
  acadxPermissions = ['is_active', 'is_superuser', 'is_supervisor', 'is_staff'];

  schoolPermissions = [
    'is_superadmin',
    'is_school_admin',
    'is_teacher',
    'is_librarian',
    'is_parent',
    'is_student',
  ];
  createStudent() {
    push({ name: 'studentCreate' });
  }
}
</script>
<style lang="stylus" scoped>
.details-panel {
  background: rgb(0, 0, 0, 0.5);
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('../../../assets/e.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

<style lang='stylus'scoped>, .list-item {
  height: 56px;
}
</style>
