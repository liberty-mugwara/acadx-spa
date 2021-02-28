<template>
  <transition
    appear
    enter-active-class="animated bounceInLeft"
    leave-active-class="animated bounceOutLeft"
  >
    <q-btn
      class="q-ma-sm"
      color="primary"
      dense
      icon="save"
      v-if="condition"
      @click="clickEvent()"
      :label="label||'Save Changes'"
      size="md"
    />
  </transition>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Emit } from 'vue-property-decorator';
import { SaveButtonOptions } from 'src/interfaces';
import { ClickableMixin, PermissionMixin } from 'src/mixins';
import { getState } from 'src/helpers';

@Component
export default class SaveBtn extends Mixins(ClickableMixin, PermissionMixin)
  implements SaveButtonOptions {
  @Prop({ required: true }) readonly permission!: boolean | string;
  @Prop({ required: true }) readonly showCondition!: string | boolean;
  @Prop() readonly label?: string;

  get condition() {
    if (typeof this.showCondition === 'string')
      return getState(this.showCondition);
    else return this.showCondition;
  }

  @Emit('save')
  clickEvent() {
    this.click && this.click();
  }
}
</script>
