<template>
  <q-card v-if="perm" class="item shadow-1 rounded-lg">
    <q-card-section key="1" class="flex flex-center q-pb-none q-pt-sm">
      <q-avatar
        :icon="icon||'las la-user'"
        color="teal-14"
        font-size="60px"
        size="80px"
        text-color="white"
      />
    </q-card-section>
    <q-card-section class="text-center text-h5 text-weight-light w-100">{{title}}</q-card-section>
    <q-separator />
    <q-card-actions align="around">
      <q-btn @click="onList()" color="primary" dense flat label="list" />

      <q-btn @click="onCreate()" color="teal" dense flat label="create" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { ToRouterOptions, UserCreateMenuOptions } from 'src/interfaces';
import { PermissionMixin } from 'src/mixins';
import { push } from '../helpers';
@Component
export default class UserCreateMenu extends Mixins(PermissionMixin)
  implements UserCreateMenuOptions {
  @Prop({ required: true }) readonly createLink!: ToRouterOptions | string;
  @Prop({ required: true }) readonly listLink!: ToRouterOptions | string;
  @Prop({ required: true }) readonly permission!: boolean | string;
  @Prop({ required: true }) readonly title!: string;
  @Prop() readonly createOnClick?: (arg?: unknown) => unknown;
  @Prop() readonly icon?: string;
  @Prop() readonly listOnClick?: (arg?: unknown) => unknown;

  onCreate() {
    if (this.createOnClick) this.createOnClick();
    push(this.createLink);
  }

  onList() {
    if (this.listOnClick) this.listOnClick();
    push(this.listLink);
  }
}
</script>
<style lang="stylus" scoped>
.item {
  ---webkit-transition: ease-out 1s;
  transition: ease-out 0.3s;
  width: 210px;
  height: 190px;
}

.item:hover {
  transform: scale(1.2);
}
</style>
