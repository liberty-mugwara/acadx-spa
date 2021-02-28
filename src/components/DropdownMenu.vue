<template>
  <q-btn-dropdown
    stretch
    flat
    :icon="dropdownOptions.icon"
    v-if="perm"
    :label="dropdownOptions.label"
  >
    <q-list>
      <template v-for="(option, index) in dropdownOptions.menus">
        <q-item-label v-if="option.heading" :key="option.heading+index" header>{{reactiveTitle}}</q-item-label>

        <DrawerLink
          v-for="(link, index2) in option.links"
          :key="link.title + index2 + index"
          v-bind="link"
          :dark="false"
        />
        <q-separator :key="index" v-if="index != dropdownOptions.menus.length - 1" inset spaced />
      </template>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { DropdownMenuOptions } from 'src/interfaces';
import DrawerLink from './DrawerLink.vue';
import { ReactiveTitleMixin, PermissionMixin } from 'src/mixins';

@Component({ components: { DrawerLink } })
export default class ADropDown extends Mixins(
  ReactiveTitleMixin,
  PermissionMixin
) {
  @Prop({ required: true })
  readonly dropdownOptions!: DropdownMenuOptions;
  @Prop({ default: false })
  readonly dark?: boolean;

  get titleProp() {
    return this.dropdownOptions.label || '';
  }
  get permProp() {
    return this.dropdownOptions.permission;
  }
}
</script>
