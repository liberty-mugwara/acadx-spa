<template>
  <div class="shadow-14 bg-grey-1" style="width:100%;max-width:1150px;min-height:100vh;height-auto">
    <div class="flex column flex-center q-pt-xl q-mb-md justify-center">
      <div
        class="f-nano text-h2 w-100 text-center"
      >{{ userDetail.first_name }} {{ userDetail.last_name }}</div>
      <p
        class="text-subtitle1 text-center q-pa-sm"
        style="max-width:600px"
      >{{ userDetail.is_active ? activeMsg : inactiveMsg }}</p>
    </div>
    <div class="row q-pt-md q-mb-xl justify-center q-gutter-lg">
      <div
        style="height:300px;width:96%;max-width:400px;"
        class="details-panel column no-wrap q-pa-md text-grey-2 shadow-1"
      >
        <div style="width:100%" class="column justify-center items-center">
          <q-avatar style="background-color:rgba(255,255,255,.8)" text-color="dark" size="72px">
            {{ userDetail.first_name.charAt(0).toUpperCase()
            }}{{ userDetail.last_name.charAt(0).toUpperCase() }}
          </q-avatar>

          <div
            class="text-h4 text-white q-mt-md q-mb-xs"
          >{{ userDetail.first_name }} {{ userDetail.last_name }}</div>
          <div class="text-h5 q-mt-md q-mb-xs">ID: {{ userDetail.national_id }}</div>
          <div class="text-h5 q-mt-md q-mb-xs">EMAIL: {{ userDetail.email }}</div>
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
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('userDetail',identity)"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1"
            label="Email and join date"
            :icon="getIcon('join_date')"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('userDetail',other)"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1"
            label="Acadx Permissions"
            icon="las la-user-lock"
            permission="user/group_1"
            :saveBtnOptions="{
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: 'user/group_1'
      }"
            :detailEdits="prepareDetailEdits('userDetail',acadxPermissions)"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1"
            label="School Permissions"
            icon="las la-shield-alt"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('userDetail',schoolPermissions)"
          />
          <q-separator />
          <EDetailEdit
            headerClass="text-subtitle1"
            label="Groups"
            icon="las la-users"
            :permission="false"
            :saveBtnOptions="{
        click: () => updateUser(),
        showCondition: 'userDetail/detailsChanged',
        permission: false
      }"
            :detailEdits="prepareDetailEdits('userDetail',['group_'],true)"
          />
        </q-list>
      </div>
    </div>
    <!--row-->
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins } from 'vue-property-decorator';
import { UserOptions } from 'src/interfaces';
import { DetailMixin, IconsMixin } from 'src/mixins';
import { del } from 'src/store/modules';

@Component
export default class UserDetails extends Mixins(DetailMixin, IconsMixin) {
  del(user: UserOptions): void {
    del.deleteSpecialUser(user);
  }
  identity = ['first_name', 'last_name', 'national_id'];

  other = ['email', 'join_date'];

  acadxPermissions = ['is_superuser', 'is_supervisor', 'is_staff'];

  schoolPermissions = [
    'is_superadmin',
    'is_school_admin',
    'is_teacher',
    'is_librarian',
    'is_parent',
    'is_student'
  ];
}
</script>
<style lang="stylus" scoped>
.details-panel {
  background: rgb(0, 0, 0, 0.5);
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('../../assets/e.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
