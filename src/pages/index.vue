<template>
  <q-page class="flex column flex-center header fullscreen">
    <div class="q-px-sm text-white text-h3 f-trocchi text-center">ACADX BY ESTUHARDT</div>
    <p class="text-h6 q-px-sm text-center text-white">Access your school from Anywhere @ Anytime!</p>
    <div class="flex justify-evenly" style="width: 300px;">
      <q-btn
        stretch
        icon="person_add"
        :to="{ name: 'acadxRegister' }"
        label="Register"
        color="primary"
      />
      <q-btn stretch icon="input" label="Login" color="secondary" :to="{ name: 'acadxSignin' }" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'landing'
};
</script>
<style lang="stylus" scoped>
.header {
  padding-top: 0;
  margin-top: 0;
  background: rgb(197, 189, 188);
  overflow: hidden;
  background: linear-gradient(rgba(2, 33, 39, 0.7), rgba(39, 8, 2, 0.6), rgba(39, 8, 2, 0.7), rgba(2, 33, 39, 0.7)), url('../assets/b.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

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
    max-width: 1200px;
  }
}

img {
  object-fit: cover;
}
</style>
