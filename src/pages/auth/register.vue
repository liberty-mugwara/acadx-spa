<template>
  <q-page class="flex flex-center bg-brown-1" style="min-height:100vh">
    <q-form style="width: 90%;
  max-width: 600px;" @submit="next">
      <q-card class="min-form">
        <q-card-section class="title text-grey-4">
          <div class="text-h6">{{ title }}</div>
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
                :hint="hint"
                class="w-80 absolute"
                :label="label"
                :mask="mask"
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
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Watch, Vue } from 'vue-property-decorator';
import { user, form } from 'src/store/modules';
import { FancyFormOptions } from 'src/interfaces';
import IInput from 'components/i-input.vue';
import ISelect from 'components/i-select.vue';

@Component({ components: { IInput, ISelect } })
export default class CreateUsers extends Vue {
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
      return 'Birth Entry Number';
    return this.fancy.inputs[this.active - 1].label;
  }
  get mask() {
    if (this.active === 1 && this.useBirthEntryNumber) return '';
    return this.fancy.inputs[this.active - 1].mask;
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

  get hint() {
    return user.toRegister.hint;
  }

  get title() {
    return (
      (user.toRegister.first_name &&
        user.toRegister.first_name + ' ' + user.toRegister.last_name) ||
      user.toRegister.message
    );
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

  get verified() {
    return user.toRegister.verified;
  }

  fancy: FancyFormOptions = {
    title: this.title,
    submitIcon: 'person_add',
    onSubmit: () => this.registerUser(),
    inputs: [
      {
        label: 'national Id',
        hint: 'Your national id',
        store: 'user/toRegister.national_id',
        debounce: '0',
        rules: ['registrationStage1'],
      },
      {
        label: 'Date of birth',
        store: 'user/toRegister.dob',
        date: true,
        rules: ['registrationStage2'],
      },
      {
        label: 'AEN',
        store: 'user/toRegister.employee_number',
        hint: `${this.title} enter AEN`,
        rules: ['registrationStage2'],
        debounce: '2000',
      },
      {
        label: 'email',
        store: 'user/toRegister.email',
        hint: 'your email address',
        rules: ['checkEmail'],
      },

      {
        label: 'Password',
        store: 'user/toRegister.password',
        hint:
          'must have at least 8 characters, 2 uppercase letters, 1 number and might contain special characters.',
        type: 'password',
        rules: ['checkPassword'],
      },
      {
        label: 'Password again',
        store: 'user/toRegister.password2',
        hint: 'enter same password as before',
        type: 'password',
        rules: ['passwordsMatch'],
      },
    ],
  };

  next(): void {
    if (this.active < 6) {
      if (this.userType && this.active < 3) {
        const roles = ['School Admin', 'Teacher', 'Librarian'];
        if (roles.includes(this.userType) && this.active == 1) {
          this.active = 3;
          form.hideSuccess();
          return;
        }
        if (!roles.includes(this.userType) && this.active == 2) {
          this.active = 4;
          form.hideSuccess();
          return;
        }
      }
      this.active++;
      form.hideSuccess();
    } else {
      user.register();
    }
  }

  prev(): void {
    if (this.active > 1) {
      if (this.userType && this.active > 2) {
        const roles = ['School Admin', 'Teacher', 'Librarian'];

        if (roles.includes(this.userType) && this.active == 3) {
          this.active = 1;
          form.hideSuccess();
          return;
        }

        if (!roles.includes(this.userType) && this.active == 4) {
          this.active = 2;
          form.hideSuccess();
          return;
        }
      }

      this.active--;
      form.hideSuccess();
    }
  }
  registerUser = () => {
    user.register();
  };

  created() {
    user.useBEN(false);
  }

  @Watch('formSuccess')
  nextStep(val: boolean) {
    if (val) {
      if (this.userType && this.active < 2) {
        const roles = ['School Admin', 'Teacher', 'Librarian'];
        if (roles.includes(this.userType)) this.active = 3;
        else this.next();
        form.hideSuccess();
      }
      if (this.verified && this.active < 4) {
        this.active = 4;
        form.hideSuccess();
      }
    }
  }
}
</script>
 <style lang="stylus" scoped>
 .min-form {
   width: 100%;
   max-width: 600px;
 }

 .bg-grad-blue {
   background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
 }

 .w-80 {
   width: 80%;
 }

 .mugs-move {
   transition: 0.4s;
 }

 .header {
   padding-top: 0;
   margin-top: 0;
   background: rgb(197, 189, 188);
   overflow: hidden;
   background: linear-gradient(rgba(2, 33, 39, 0.7), rgba(39, 8, 2, 0.6), rgba(39, 8, 2, 0.7), rgba(2, 33, 39, 0.7)), url('../../assets/c.jpg');
   background-repeat: no-repeat;
   background-size: cover;
   background-position: center;
   background-attachment: fixed;
 }

 .title {
   background: $cyan-8;
   overflow: hidden;
   background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('../../assets/b.jpg');
   background-repeat: no-repeat;
   background-size: cover;
   background-attachment: fixed;
 }
</style>

