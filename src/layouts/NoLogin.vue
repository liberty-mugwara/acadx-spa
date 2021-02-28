<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-ajax-bar position="top" color="positive" size="5px" />
      <q-toolbar class="bg-primary text-white">
        <q-btn
          stretch
          flat
          label="ACADX"
          class="f-trocchi text-accent text-h5 text-weight-bold"
          to="/"
        />
        <q-space />
        <q-btn flat round icon="ring_volume" class="xs q-mr-sm" :to="{ name: 'contact' }" />
        <q-separator dark vertical inset class="xs" />
        <q-btn flat round icon="info" class="xs q-ml-sm" :to="{ name: 'about' }" />
        <q-btn
          stretch
          flat
          icon="ring_volume"
          label="CONTACT"
          class="gt-xs"
          :to="{ name: 'contact' }"
        />
        <q-btn stretch flat icon="info" label="ABOUT" class="gt-xs" :to="{ name: 'about' }" />
        <q-btn stretch flat icon="school" label="SCHOOLS" class="gt-xs" />
        <q-space class="gt-sm" />
        <q-btn
          stretch
          flat
          label="REGISTER"
          class="gt-sm"
          color="positive"
          :to="{ name: 'acadxRegister' }"
        />

        <q-separator dark inset vertical class="gt-sm" />
        <q-btn stretch flat label="LOGIN" class="gt-sm" :to="{ name: 'acadxSignin' }" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="transparent text-white z-top">
      <q-toolbar>
        <q-btn stretch flat label="Place your school on ACADX" color="grey-5" class="gt-sm" />
        <q-btn stretch flat icon="school" label="Schools" class="sm" />
        <q-btn round outline icon="school" class="xs" color="positive" />
        <q-space />
        <q-btn
          stretch
          flat
          label="2020 © Estuhardt pvt ltd"
          color="grey-5"
          class="text-h6"
          :to="{ name: 'about' }"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { data } from '../store/modules';
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class NoLoginLayout extends Vue {
  getData() {
    Promise.all([data.getSchoolData(), data.getAddressData()]);
  }

  created() {
    this.getData();
  }
}
</script>
