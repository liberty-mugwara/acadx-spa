<template>
  <q-item clickable @click="clickEvent()" v-ripple v-close-popup v-if="perm" :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :color="iconColor? iconColor:dark ? 'grey-5' : 'grey-9'" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="dark ? 'text-white' : 'text-dark'">{{reactiveTitle }}</q-item-label>

      <q-item-label v-if="caption" :class="dark ? 'text-grey-5' : 'text-grey-8'">{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Emit } from 'vue-property-decorator';
import { ToRouterOptions } from 'src/interfaces';
import { PermissionMixin, ReactiveTitleMixin } from 'src/mixins';

@Component
export default class DrawerLink extends Mixins(
  PermissionMixin,
  ReactiveTitleMixin
) {
  @Prop() readonly title!: string;
  @Prop({ default: '' }) readonly caption?: string;
  @Prop({ required: true }) readonly link!: ToRouterOptions;
  @Prop({ default: '' }) readonly icon!: string;
  @Prop() readonly click?: () => void;
  @Prop({ default: false })
  readonly dark?: boolean;
  @Prop() readonly iconColor?: string;

  @Emit('active')
  clickEvent() {
    if (this.click) this.click();
  }
}
</script>
