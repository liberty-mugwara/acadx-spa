<template>
  <q-page class="column justify-center items-center bg-brown-1" style="min-height:100vh">
    <div class="text-h4 f-trocchi text-primary q-my-sm text-weight-bolder">ACADX</div>
    <q-card class="login-card rounded-lg text-positive q-px-lg" style="width:80%;max-width:300px;">
      <q-card-section class="flex column flex-center">
        <div class="text-h6 f-nano text-grey-9 font-weight-bolder">Account Login</div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-form @submit="login">
          <Iinput
            :autofocus="true"
            :mask="inputMask"
            v-model="loginData.username"
            :label="label"
            :placeholder="'Enter '+label"
            :color="btnColor"
            :rules="['required']"
            class="q-mb-xs"
          />
          <Iinput
            type="password"
            v-model="loginData.password"
            label="Password"
            placeholder="Enter password"
            class="q-mb-xs"
            :rules="['required']"
          />

          <q-btn type="submit" color="primary" class="full-width q-mb-lg" label="login" />
          <q-btn
            @click="toggleMask()"
            :color="btnColor"
            class="full-width q-mb-lg"
            :label="btnTxt"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import Iinput from 'components/i-input.vue';

@Component({ components: { Iinput } })
export default class Signin extends Vue {
  mask = 'nationalId';
  loginData = {
    password: '',
    username: '',
  };

  login() {
    user.login(this.loginData);
  }
  toggleMask() {
    if (this.mask === '') this.mask = 'nationalId';
    else this.mask = '';
  }
  get inputMask() {
    return this.mask;
  }
  get btnTxt() {
    if (this.mask === '') return 'use national id';
    return 'use birth number';
  }

  get btnColor() {
    if (this.mask === '') return 'positive';
    return 'purple';
  }

  get label() {
    if (this.mask === '') return 'Enter Birth Entry Number';
    return 'Enter National Id';
  }

  created() {
    this.loginData = {
      password: '',
      username: '',
    };
  }
}
</script>

<style lang="stylus" scoped>
.login-card {
  background: rgba(255, 255, 255, 0.95);
}
</style>
