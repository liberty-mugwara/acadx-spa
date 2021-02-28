<template>
  <q-page class="flex column flex-center bg-white" style="min-height:100vh">
    <div class="q-px-sm q-mt-xl text-primary text-h5 f-trocchi text-center">CONTACT US</div>
    <div class="w-80 q-pa-md flex column flex-center">
      <div class="text-grey-7 text-subtitle1 q-pa-sm" style="max-width:600px;width:100%">
        <span class="f-nano text-h6">"</span>One day I got a phone call, and Johnny and Dee Dee asked me if I wanted to join their band. I said, 'Yeah.'
        <span
          class="f-nano text-h6"
        >"</span>
        <span class="f-nano text-subtitle2 text-info">- Joey Ramone</span>
      </div>
      <div class="w-100 q-pt-sm q-mt-md flex flex-center">
        <div class="q-gutter-x-sm q-gutter-y-sm w-80">
          <span class="text-h6 text-grey-9 q-pa-sm">
            <q-avatar class="q-mr-xs" size="sm" color="green" text-color="white" icon="phone" />Denzel
            <small class="f-trocchi">0785449375</small>
          </span>
          <span class="text-h6 text-grey-9 q-pa-sm">
            <q-avatar class="q-mr-xs" size="sm" color="green" text-color="white" icon="phone" />Tariro
            <small class="f-trocchi">0777510159</small>
          </span>
          <span class="text-h6 text-grey-9 q-pa-sm">
            <q-avatar class="q-mr-xs" size="sm" color="green" text-color="white" icon="phone" />Liberty
            <small class="f-trocchi">0783807321</small>
          </span>
        </div>
      </div>
    </div>

    <div class="w-80 q-mt-xl q-pa-md flex column flex-center">
      <div class="text-grey-7 text-subtitle1 q-pa-sm" style="max-width:600px;width:100%">
        <span class="f-nano text-h6">"</span>I'm very hands-on about social media. That's my voice.
        <span class="f-nano text-h6">"</span>
        <span class="f-nano text-subtitle2 text-info">- Alexandria Ocasio-Cortez</span>
      </div>
      <div class="row overflow-auto q-px-md q-py-xl" style="max-width:800px; width:100%;">
        <div class="q-gutter-x-md q-gutter-y-sm">
          <q-btn round color="green" icon="mdi-whatsapp" @click="whatsapp()" />
          <q-btn round color="blue" icon="mdi-facebook" @click="facebook()" />
          <q-btn round color="purple" icon="mdi-instagram" @click="instagram()" />
          <q-btn round color="info" icon="mdi-twitter" @click="twitter()" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Contact extends Vue {
  whatsapp() {
    window.open('https://api.whatsapp.com/send?phone=263715511606‬', '_blank');
  }
  twitter() {
    window.open('https://twitter.com/Estuhardt1', '_blank');
  }
  facebook() {
    window.open(
      'https://www.facebook.com/Estuhardt-Pvt-Ltd-110110773990600',
      '_blank'
    );
  }
  instagram() {
    window.open('https://www.instagram.com/Estuhardtzimbabwe ', '_blank');
  }
}
</script>
