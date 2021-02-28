<template>
  <q-item :clickable="edit && perm" class="q-my-sm" dense :v-ripple="edit && perm">
    <q-item-section avatar>
      <q-avatar v-if="!icon" size="md" color="cyan-3" text-color="grey-8">
        {{
        avatarTxt
        ? avatarTxt
        : model.charAt(0).toUpperCase()
        }}
      </q-avatar>
      <q-icon v-if="icon" style="font-size:1.5em" :name="icon" class="text-grey-8" />
    </q-item-section>
    <q-item-section>
      <q-item-label style="font-size:1.05rem" class="text-subtitle1">
        {{
        inputType == 'toggle' ?label : model
        }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label v-if="inputType != 'toggle'" class="text-body1 text-grey-6">
        {{
        label
        }}
      </q-item-label>
      <q-icon
        v-if="inputType == 'toggle'"
        :name="model ? 'check_circle' : 'highlight_off'"
        :color="model ? 'positive' : 'negative'"
      />
    </q-item-section>
    <q-popup-edit
      v-if="edit && perm"
      @save="registerChange"
      :validate="validate"
      v-model="model"
      :cover="false"
      :offset="[0, 10]"
      buttons
    >
      <ImpressiInput
        v-if="inputType !='toggle' && !optionsStore"
        :type="inputType"
        :placeholder="`Enter ${label}`"
        :label="label"
        :debounce="500"
        :store="store"
        :autofocus="true"
        :rules="rules"
        :filled="false"
        :date="date"
        color="accent"
      />
      <q-toggle
        v-if="inputType == 'toggle'"
        v-model="model"
        color="accent"
        checked-icon="check"
        :label="label"
        unchecked-icon="clear"
      />
      <ISelect
        v-if="inputType == 'select'"
        :filled="false"
        :label="label"
        :optionsStore="optionsStore"
        :store="store"
        color="accent"
      />
    </q-popup-edit>
  </q-item>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { DetailEditOptions } from 'src/interfaces';
import { VModelMixin, PopupEditMixin, PermissionMixin } from 'src/mixins';
import ImpressiInput from './impressi-input.vue';
import ISelect from './i-select.vue';

@Component({ components: { ISelect, ImpressiInput } })
export default class DetailEdit
  extends Mixins(PopupEditMixin, PermissionMixin, VModelMixin)
  implements DetailEditOptions {
  @Prop({ required: true }) readonly label!: string;
  @Prop() readonly avatarTxt?: string;
  @Prop() readonly hint?: string;
  @Prop() type?: string;
  @Prop() icon?: string;
  @Prop() rules?: Array<unknown>;
  @Prop() date?: boolean;

  get inputType() {
    if (this.optionsStore) return 'select';
    if (typeof this.model === 'boolean') return 'toggle';
    return 'text';
  }
}
</script>
