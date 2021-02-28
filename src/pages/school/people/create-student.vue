<template>
  <q-form style="width: 90%;
  max-width: 600px;" @submit="next">
    <q-card class="min-form">
      <q-card-section class="title text-grey-4">
        <div class="text-h6">{{ fancy.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="width:100%;height:200px;position:relative;"
        class="flex column flex-center overflow-hidden"
      >
        <transition
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutLeft"
        >
          <template v-for="(input, index) in fancy.inputs">
            <IInput
              :filled="true"
              :autofocus="true"
              v-if="active == index + 1"
              v-bind="input"
              :color="active===1&&btnColor||'primary'"
              :key="index"
              :placeholder="
                input.placeholder ? input.placeholder : `Enter ${label}`
              "
              class="w-80 absolute"
              :label="label"
              :mask="mask"
              :rules="rules"
            />
          </template>
        </transition>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <q-linear-progress :stripe="true" :value="progress" color="primary" style="width:100%" />
      </q-card-section>
      <q-separator class="q-mt-none" />
      <q-card-actions align="right">
        <transition-group
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutRight"
          move-class="mugs-move"
          class="q-gutter-x-sm overflow-hidden"
        >
          <q-btn
            dense
            key="3"
            v-if="active === 1"
            :color="btnColor"
            :label="btnTxt"
            @click="toggleBEN()"
          />
          <q-btn
            key="1"
            dense
            color="secondary"
            v-if="active > 1"
            label="back"
            icon="arrow_back_ios"
            @click="prev()"
          />
          <q-btn
            key="2"
            type="submit"
            dense
            :disable="inputLoading"
            :color="active != fancy.inputs.length ? 'primary' : 'info'"
            :icon="active == fancy.inputs.length ? fancy.submitIcon : ''"
            :label="active != fancy.inputs.length ? 'next' : 'create'"
            :icon-right="
              active < fancy.inputs.length ? 'arrow_forward_ios' : ''
            "
          />
        </transition-group>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import { user, form } from 'src/store/modules';
import { FancyFormOptions } from 'src/interfaces';
import { rootDispatch, getState, setState, push } from '../../../helpers';
import IInput from 'components/i-input.vue';
import ISelect from 'components/i-select.vue';

@Component({ components: { IInput, ISelect } })
export default class Create extends Vue {
  active = 1;
  stage = 0;
  max = 0;
  isPwd = true;
  notTouched = true;
  error = false;
  errorMsg = '';

  get useBirthEntryNumber() {
    return user.useBirthEntryNumber;
  }

  get label() {
    if (this.active === 1 && this.useBirthEntryNumber)
      return "Student's Birth Entry Number";
    return this.fancy.inputs[this.active - 1].label;
  }
  get mask() {
    if (this.active === 1 && this.useBirthEntryNumber) return '';
    return this.fancy.inputs[this.active - 1].mask;
  }

  get rules() {
    if (this.active === 1 && this.useBirthEntryNumber) return ['checkBEN'];
    return this.fancy.inputs[this.active - 1].rules;
  }

  get btnColor() {
    if (this.useBirthEntryNumber) return 'positive';
    return 'purple';
  }

  get btnTxt() {
    if (this.useBirthEntryNumber) return 'use id';
    return 'use birth number';
  }

  toggleBEN() {
    user.useBEN(!this.useBirthEntryNumber);
  }

  get userType() {
    return user.toRegister.user_type;
  }
  get formSuccess() {
    return form.success;
  }
  get progress() {
    return this.active / this.fancy.inputs.length;
  }

  get inputLoading(): boolean {
    return form.loading;
  }

  fancy: FancyFormOptions = {
    title: 'Create Student',
    submitIcon: 'add',
    onSubmit: () => rootDispatch('student/create'),
    inputs: [
      {
        // eslint-disable-next-line quotes
        label: "Student's National id",
        hint: 'eg 00-000000Y00',
        store: 'student/toCreate.national_id',
        rules: ['checkId'],
      },
      {
        // eslint-disable-next-line quotes
        label: "Parent's National id",
        hint: 'eg 00-000000Y00',
        store: 'student/toCreate.parent_national_id',
        rules: ['parentExists'],
      },
      {
        // eslint-disable-next-line quotes
        label: "Student's First name",
        hint: 'at least two letters',
        store: 'student/toCreate.first_name',
        rules: ['checkNamePlusInitials'],
      },
      {
        // eslint-disable-next-line quotes
        label: "Student's last name",
        hint: 'at least two letters',
        store: 'student/toCreate.last_name',
        rules: ['checkName'],
      },
    ],
  };

  next(): void {
    if (this.active < this.fancy.inputs.length) {
      this.active++;
      if (this.useBirthEntryNumber) user.useBEN(false);
      form.hideSuccess();
    } else {
      this.active++;
      this.fancy.onSubmit();
    }
  }

  prev(): void {
    if (this.active > 1) {
      this.active--;
    }
    form.hideSuccess();
  }

  created() {
    user.useBEN(false);
    user.authR();
    if (!user.group_4) {
      push('/schools/users');
    }
    setState('student/toCreate.school_id', getState('school/id'));
  }

  mounted() {
    setState(
      'student/toCreate.parent_national_id',
      getState(`${getState('user/profile')}/national_id`)
    );
  }
}
</script>
<style lang="stylus" scoped>
.title {
  background: $cyan-8;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('../../../assets/b.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>
