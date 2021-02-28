<template>
  <FancyForm :fancy="fancy" />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import FancyForm from 'components/FancyForm.vue';
import { FancyFormOptions } from 'src/interfaces';

@Component({ components: { FancyForm } })
export default class CreateUsers extends Vue {
  fancy: FancyFormOptions = {
    title: 'user/toCreate.user_type',
    submitIcon: 'person_add',
    onSubmit: () => user.createUser(),
    inputs: [
      {
        label: 'national Id',
        hint: 'eg 00-000000Y00',
        store: 'user/toCreate.national_id',
        debounce: '0',
        rules: ['checkId']
      },
      {
        label: 'Email',
        store: 'user/toCreate.email',
        hint: 'eg mugs@impressi.com',
        rules: ['checkEmail']
      },
      {
        label: 'First name',
        store: 'user/toCreate.first_name',
        hint: 'e.g Tadiwa',
        rules: ['checkNamePlusInitials']
      },
      {
        label: 'Last name',
        store: 'user/toCreate.last_name',
        hint: 'e.g Gava',
        rules: ['checkName']
      },

      {
        label: 'Password',
        store: 'user/toCreate.password',
        hint:
          'must have at least 8 characters, 2 uppercase letters, 1 number and might contain special characters.',
        type: 'password',
        rules: ['checkPassword']
      },
      {
        label: 'Password again',
        store: 'user/toCreate.password2',
        hint: 'enter same password as before',
        type: 'password',
        rules: ['passwordsMatch']
      }
    ]
  };
}
</script>
