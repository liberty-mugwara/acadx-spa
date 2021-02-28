<template>
  <q-layout>
    <q-page-container>
      <q-ajax-bar position="top" color="teal" size="5px" />
      <router-view />
    </q-page-container>

    <q-footer class="bg-blue-grey-6 justify-center text-white row">
      <div class="row overflow-auto q-pt-sm" style="max-width:800px; width:100%;">
        <div class="q-gutter-x-sm q-gutter-y-sm">
          <q-btn flat size="sm" color="white" label="About" :to="{ name: 'about' }" />
          <q-btn flat size="sm" color="white" label="Contact Us" :to="{ name: 'contact' }" />
          <q-btn flat size="sm" color="white" label="Register" :to="{ name: 'acadxRegister' }" />
          <q-btn flat size="sm" color="white" label="login" :to="{ name: 'acadxSignin' }" />
          <q-btn flat size="sm" color="white" label="Landing Page" to="/" />
          <q-btn flat size="sm" color="white" label="Schools" />
          <q-btn flat size="sm" color="white" label="FAQs" />
          <q-btn flat size="sm" color="white" label="Team" />
          <q-btn flat size="sm" color="white" label="Privacy Policy" />
          <q-btn flat size="sm" color="white" label="Terms And Conditions" />
          <q-btn flat size="sm" color="white" label="Place Your School On Acadx" />
        </div>
        <div class="w-100 q-pa-md">2020 © Estuhardt pvt ltd</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {};
</script>
