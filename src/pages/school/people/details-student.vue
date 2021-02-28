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
      >{{ profile.is_active ? activeMsg : inactiveMsg }}</p>
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
            headerClass="text-subtitle1"
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
            headerClass="text-subtitle1"
            label="Elearning"
            :icon="getIcon('join_date')"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateProfile(),
        showCondition: `${module}/detailsChanged`,
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits(module,Elearning)"
          />
          <q-separator />
          <EDetailEdit
            label="Parent"
            icon="las la-user"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateParent(),
        showCondition: `${profile.parent_type}/detailsChanged`,
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits(profile.parent_type)"
          />
          <q-separator />
          <EDetailEdit
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

@Component
export default class UserDetails extends Mixins(IconsMixin, DetailMixin) {
  identity = ['first_name', 'last_name', 'national_id'];

  other = [
    'dob',
    'sex',
    'sponsor',

    'join_date',
    'graduation_date',
    'email',
    'phone_number',
    'comments'
  ];

  Elearning = [
    'current_level',
    'starting_level',
    'starting_term',
    'school_class'
  ];
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
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('../../../assets/e.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
