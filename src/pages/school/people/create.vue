<template>
  <FancyForm :fancy="fancy" />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import FancyForm from 'components/FancyForm.vue';
import { FancyFormOptions } from 'src/interfaces';
import { rootDispatch, getState, setState, push } from '../../../helpers';

@Component({ components: { FancyForm } })
export default class Create extends Vue {
  get module() {
    return user.profile;
  }
  get title() {
    if (this.module == 'schoolAdmin') return 'Create School Admin';
    else return `create ${this.module}`;
  }

  fancy: FancyFormOptions = {
    title: this.title,
    submitIcon: 'add',
    onSubmit: () => rootDispatch(`${this.module}/create`),
    inputs: [
      {
        label: 'National id',
        hint: 'eg 00-000000Y00',
        store: `${this.module}/toCreate.national_id`,
        rules: ['checkId']
      },
      {
        label: 'First name',
        hint: 'at least two letters',
        store: `${this.module}/toCreate.first_name`,
        rules: ['checkNamePlusInitials']
      },
      {
        label: 'Last name',
        hint: 'at least two letters',
        store: `${this.module}/toCreate.last_name`,
        rules: ['checkName']
      }
    ]
  };

  created() {
    user.authR();
    if (!user.group_4) {
      push('/schools/users');
    }
    setState(`${this.module}/toCreate.school_id`, getState('school/id'));
  }
}
</script>
