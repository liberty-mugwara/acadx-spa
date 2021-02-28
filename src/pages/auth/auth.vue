<template>
  <q-page class="flex column flex-center header fullscreen">
    <q-spinner-gears color="primary" size="10em" />
  </q-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import { ToRouterOptions } from '../../interfaces';

@Component
export default class Auth extends Vue {
  created() {
    user.auth();
  }
}
</script>
<style lang="stylus" scoped>
.header {
  background-color: #fff;
}
</style>
