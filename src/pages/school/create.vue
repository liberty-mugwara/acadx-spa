<template>
  <FancyForm :fancy="fancy" />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import { user, school } from 'src/store/modules';
import FancyForm from 'components/FancyForm.vue';
import { FancyFormOptions } from 'src/interfaces';
import { push } from 'src/helpers';

@Component({ components: { FancyForm } })
export default class CreateUsers extends Vue {
  fancy: FancyFormOptions = {
    title: 'Create School',
    submitIcon: 'add',
    onSubmit: () => school.create(),
    inputs: [
      {
        label: 'name',
        hint: 'at least two letters',
        store: 'school/toCreate.name',
        rules: ['checkNameMulti']
      },
      {
        label: 'classification',
        store: 'school//createClassificationName/toCreate.classification',
        optionsStore: 'school/classifications',
        hint: 'primary, secondary ...',
        rules: []
      }
    ]
  };

  created() {
    user.authR();
    if (!user.group_1) {
      push('/schools/');
    }
  }
}
</script>
