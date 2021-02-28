<template>
  <div bordered class="rounded-borders q-pt-lg q-pb-xl" style="max-width: 800px; width: 80%;">
    <div class="text-h4 f-trocchi w-100 q-mt-xl text-center">{{title}}</div>
    <div class="q-pa-md q-mx-auto q-mt-sm" style="width: 90%; max-width: 400px;">
      <q-toolbar class="bg-transparent rounded-md text-primary">
        <q-btn
          v-if="module==='schoolAdmin'&&group01 || module!=='schoolAdmin' && group4"
          class="q-mr-sm unelevated"
          dense
          round
          icon="add"
          color="positive"
          @click="create()"
        >
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            content-style="font-size:13px"
          >Create</q-tooltip>
        </q-btn>
        <q-input
          dense
          filled
          standout
          v-model="search"
          input-class="text-right"
          color="purple"
          class="q-ml-md"
          :style="(module==='schoolAdmin'&&group01 || module!=='schoolAdmin' && group4) ? 'width:86%' : 'width:100%'"
        >
          <template v-slot:append>
            <div class="overflow-hidden">
              <transition
                appear
                enter-active-class="animated bounceInRight"
                leave-active-class="animated bounceOutRight"
              >
                <q-icon color="purple" key="s" v-if="search === ''" name="search" />
                <q-icon
                  v-else
                  key="c"
                  name="clear"
                  color="negative"
                  class="cursor-pointer"
                  @click="search = ''"
                />
              </transition>
            </div>
          </template>
        </q-input>
      </q-toolbar>
    </div>
    <q-intersection
      v-for="profile in profiles"
      :key="profile.id"
      transition="scale"
      class="list-item"
    >
      <q-item clickable class="bg-white">
        <q-item-section @click="() => details(profile)" avatar top>
          <q-avatar
            :icon="profile.user && profile.user.is_superadmin
                  && 'mdi-account-cowboy-hat'
                  ||profile.user && profile.user.is_school_admin
                      && 'las la-user-tie'
                      || 'las la-user-cog'"
            color="secondary"
            size="md"
            text-color="white"
            font-size="24px"
          />
        </q-item-section>

        <q-item-section @click="() => details(profile)">
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ profile.first_name }} {{ profile.last_name }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section class="q-gutter-x-sm overflow-hidden" side>
          <DED
            :del="() => del(profile)"
            :edit="() => edit(profile)"
            :details="() => details(profile)"
          />
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { user, school, page } from 'src/store/modules';
import DED from 'components/DED.vue';
import { SchoolAdminOptions } from 'src/interfaces';
import { getState, setState, push, rootDispatch } from 'src/helpers';
import { UserRolesMixin } from 'src/mixins';

@Component({ components: { DED } })
export default class SchoolUsers extends Mixins(UserRolesMixin) {
  search = '';

  get school() {
    return school;
  }

  get module() {
    return user.profile;
  }

  get title() {
    if (this.module == 'schoolAdmin') return `${this.school.name} Admins`;
    else return `${this.school.name} ${this.module}s`;
  }

  get profiles(): Array<SchoolAdminOptions> {
    return getState(`${this.module}/list`);
  }
  get page() {
    return page.currentPage;
  }
  get pagination() {
    return page.pagination;
  }

  create() {
    setState('user/profile', this.module);
    push({ name: 'schoolUsersCreate' });
  }

  created() {
    user.authR();
    rootDispatch(`${this.module}/getList`);
  }

  @Watch('page')
  getItems(newVal: number, oldVal: number) {
    if (this.pagination && oldVal != 0) rootDispatch(`${this.module}/getList`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edit(selectedProfile: any) {
    rootDispatch(`${this.module}/edit`, selectedProfile);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details(selectedProfile: any) {
    rootDispatch(`${this.module}/detail`, selectedProfile);
  }
}
</script>
<style lang="stylus" scoped>
.list-item {
  height: 56px;
}
</style>
