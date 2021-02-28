/* eslint-disable @typescript-eslint/camelcase */

<template>
  <q-card class="my-card transparent no-shadow">
    <q-card-section class="q-gutter-y-md flex column flex-center text-white">
      <div style="max-width:400px;" class="text-h5 text-center text-primary">
        Welcome
        <br />
        <span class="text-h4 f-nano text-accent">{{ firstName }} {{ lastName }}!</span>
        <br />
        Your main role is {{ userRole }}. Let's dive in, what do you want to do
        first.
      </div>
    </q-card-section>

    <q-card-actions align="center">
      <q-btn
        stretch
        :icon="icon_1"
        :label="label_1"
        :to="{ name: to_1 }"
        color="info"
        class="q-mb-md"
      />
      <q-btn
        stretch
        :icon="icon_2"
        :label="label_2"
        color="accent"
        :to="{ name: to_2 }"
        class="q-mb-md"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import { UserRolesMixin } from 'src/mixins';

@Component
export default class Home extends Mixins(UserRolesMixin) {
  icon_1 = '';
  icon_2 = '';
  label_1 = '';
  label_2 = '';
  to_1 = '';
  to_2 = '';

  get firstName(): string {
    return user.first_name;
  }
  get lastName(): string {
    return user.last_name;
  }

  created() {
    user.authR();
    if (this.group2) {
      this.icon_1 = 'people';
      this.icon_2 = 'school';
      this.label_1 = 'users';
      this.label_2 = 'schools';
      this.to_1 = 'userIndex';
      this.to_2 = 'schoolsList';
    } else if (this.group01) {
      this.icon_1 = 'people';
      this.icon_2 = 'account_balance';
      this.label_1 = 'School staff';
      this.label_2 = 'school account';
      this.to_1 = 'school_lists';
      this.to_2 = 'school_bank';
    } else if (this.group5) {
      this.icon_1 = 'local_library';
      this.icon_2 = 'create_new_folder';
      this.label_1 = 'School staff';
      this.label_2 = 'add book';
      this.to_1 = 'library';
      this.to_2 = 'create_book';
    } else if (this.group4) {
      this.icon_1 = 'people';
      this.icon_2 = 'receipt';
      this.label_1 = 'School staff';
      this.label_2 = 'transactions';
      this.to_1 = 'school_lists';
      this.to_2 = 'transactions';
    } else if (this.group7) {
      this.icon_1 = 'local_library';
      this.icon_2 = 'local_library';
      this.label_1 = 'Assignments';
      this.label_2 = 'library';
      this.to_1 = 'e-lists';
      this.to_2 = 'e-lists';
    } else if (this.group8) {
      this.icon_1 = 'people';
      this.icon_2 = 'receipt';
      this.label_1 = 'children';
      this.label_2 = 'transactions';
      this.to_1 = 'parent';
      this.to_2 = 'transactions';
    }
  }
}
</script>
<style lang="stylus" scoped>
.header {
  @media (max-width: $breakpoint-sm-max) {
    h1 {
      font-size: 2.125rem;
      font-weight: 400;
      line-height: 1.5rem;
      letter-spacing: -0.00735em;
    }
  }

  @media (min-width: $breakpoint-sm-min) {
    h1 {
      font-size: 3.75rem;
      font-weight: 400;
      line-height: 1.75rem;
      letter-spacing: -0.00833em;
    }
  }

  h1 {
    width: 90%;
    max-width: 900px;
  }

  p {
    width: 80%;
    max-width: 600px;
  }

  img {
    object-fit: cover;
  }
}
</style>
