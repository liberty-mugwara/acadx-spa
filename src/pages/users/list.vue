<template>
  <div bordered class="q-pb-md q-pt-xl" style="max-width: 800px; width: 80%;  min-height:100vh">
    <div class="text-h4 f-trocchi w-100 text-center">Users</div>
    <div class="q-pa-md q-mx-auto q-mt-sm" style="width: 90%; max-width: 400px;">
      <q-toolbar class="bg-transparent rounded-md text-primary">
        <q-btn
          v-if="group1"
          class="q-mr-sm unelevated"
          dense
          round
          icon="add"
          color="positive"
          :to="{ name: 'createUser' }"
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
          :style="group1 ? 'width:86%' : 'width:100%'"
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
    <q-intersection v-for="user in users" :key="user.id" transition="scale" class="list-item">
      <q-item clickable class="bg-white">
        <q-item-section @click="() => details(user)" avatar top>
          <q-avatar
            :icon="getUserIcon(user)"
            color="white"
            size="md"
            :text-color="user.is_superuser?'accent':'primary'"
            font-size="24px"
          />
        </q-item-section>

        <q-item-section @click="() => details(user)">
          <q-item-label lines="1">
            <span class="text-weight-medium">{{ user.first_name }} {{ user.last_name }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section class="q-gutter-x-sm overflow-hidden" side>
          <DED :del="() => del(user)" :edit="() => edit(user)" :details="() => details(user)" />
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { user, userDetail, del, page } from 'src/store/modules';
import DED from 'components/DED.vue';
import { UserRolesOptions, UserOptions } from 'src/interfaces';
import { UserRolesMixin, IconsMixin } from 'src/mixins';

@Component({ components: { DED } })
export default class SpecialUsersList extends Mixins(
  UserRolesMixin,
  IconsMixin
) {
  search = '';
  created() {
    user.authR();
    userDetail.getList();
  }

  get page() {
    return page.currentPage;
  }
  get pagination() {
    return page.pagination;
  }

  get users(): UserRolesOptions[] {
    return userDetail.list;
  }
  del(user: UserOptions): void {
    del.deleteSpecialUser(user);
  }

  edit(selectedUser: UserRolesOptions) {
    userDetail.edit(selectedUser);
  }
  details(selectedUser: UserRolesOptions) {
    userDetail.detail(selectedUser);
  }
  @Watch('page')
  getItems(newVal: number, oldVal: number) {
    if (this.pagination && oldVal != 0) userDetail.getList();
  }
}
</script>
<style lang="stylus" scoped>
.list-item {
  height: 56px;
}
</style>
