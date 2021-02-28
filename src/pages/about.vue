<template>
  <q-page class="flex column flex-center text-h6" style="min-height:100vh">
    <div
      class="w-80 q-pt-xl q-px-sm text-h3 f-trocchi text-accent text-center text-weight-bolder"
    >ACADX</div>
    <p
      class="w-80 text-subtitle2 q-px-sm text-center"
      style="max-width:500px"
    >We are Estuhardt Pvt Ltd, an Information Technology Company and we have developed our school management with the following platforms:</p>

    <div class="w-100 q-mt-xl relative" style="height:auto;max-width:600px">
      <div class="flex flex-center q-mb-xs">
        <div class="text-h3 text-grey-8 text-weight-bolder">Elearning</div>
      </div>
      <q-img
        src="../assets/elearning.jpg"
        spinner-color="accent"
        style="height:auto; max-width:600px"
      />
    </div>

    <div class="w-100 q-mt-xl relative" style="height:auto;max-width:600px">
      <div class="flex flex-center q-mb-xs">
        <div class="text-h3 text-grey-8 text-weight-bolder">Online Library</div>
      </div>
      <q-img
        src="../assets/library.png"
        spinner-color="accent"
        style="height: auto; max-width:600px"
      />
    </div>

    <div class="w-100 q-mt-xl relative" style="height:auto;max-width:600px">
      <div class="flex flex-center q-mb-xs">
        <div class="text-h3 text-grey-8 text-weight-bolder">School Management System</div>
      </div>
      <q-img
        src="../assets/database.png"
        spinner-color="accent"
        style="height: auto; max-width:600px"
      />
    </div>

    <p
      class="w-80 text-subtitle2 q-mt-lg q-mb-xl q-pb-xl text-grey-8 q-px-sm text-center"
      style="max-width: 500px"
    >
      Something you need at the moment to get along with distance learning in the wake of increasing COVID-19 transmissions and also to reduce the chance of the emergence of informal academic tutorials (extra-lessons) which again exposes your students to the pandemic.
      <br />Contact us for more information
    </p>
  </q-page>
</template>

<script>
export default {
  name: 'about'
};
</script>
<style lang="stylus" scoped>
.header {
  padding-top: 20px;
  margin-top: 30px;
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
