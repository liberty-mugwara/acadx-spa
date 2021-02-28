<template>
  <q-form style="width: 90%;
  max-width: 600px;" @submit="next">
    <q-card class="min-form">
      <q-card-section class="title text-grey-4">
        <div class="text-h6">{{ reactiveTitle }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="width:100%;height:200px;position:relative;"
        class="flex column flex-center overflow-hidden"
      >
        <transition
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutLeft"
        >
          <template v-for="(input, index) in fancy.inputs">
            <IInput
              :filled="true"
              v-if="active == index + 1 && !input.optionsStore"
              v-bind="input"
              :key="index"
              :placeholder="
                input.placeholder ? input.placeholder : `Enter ${input.label}`
              "
              class="w-80 absolute"
              :autofocus="true"
            />
            <ISelect
              v-if="active == index + 1 && input.optionsStore"
              :key="index"
              v-bind="input"
              class="w-80 absolute"
            />
          </template>
          <q-spinner-tail
            v-if="active ==fancy.inputs.length+1"
            key="spinner__"
            color="primary"
            size="2em"
            class="absolute"
          />
        </transition>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <q-linear-progress :stripe="true" :value="progress" color="accent" style="width:100%" />
      </q-card-section>
      <q-separator class="q-mt-none" />
      <q-card-actions align="right">
        <transition-group
          appear
          enter-active-class="animated fadeInRight"
          leave-active-class="animated fadeOutRight"
          move-class="mugs-move"
          class="q-gutter-x-sm overflow-hidden"
        >
          <q-btn
            dense
            key="1"
            color="secondary"
            v-if="active > 1"
            label="back"
            icon="arrow_back_ios"
            @click="prev()"
          />
          <q-btn
            key="3"
            type="submit"
            dense
            :disable="inputLoading"
            :color="active != fancy.inputs.length ? 'positive' : 'primary'"
            :icon="active == fancy.inputs.length ? fancy.submitIcon : ''"
            :label="active != fancy.inputs.length ? 'next' : 'create'"
            :icon-right="
              active < fancy.inputs.length ? 'arrow_forward_ios' : ''
            "
          />
        </transition-group>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { FancyFormOptions } from 'src/interfaces';
import { form } from 'src/store/modules';
import IInput from './i-input.vue';
import ISelect from './i-select.vue';
import { ReactiveTitleMixin } from 'src/mixins';

@Component({ components: { IInput, ISelect } })
export default class FancyForm extends Mixins(ReactiveTitleMixin) {
  @Prop({ required: true }) readonly fancy!: FancyFormOptions;
  isPwd = true;
  active = 1;
  notTouched = true;
  error = false;
  errorMsg = '';

  get titleProp() {
    return this.fancy.title;
  }

  get progress() {
    return this.active / this.fancy.inputs.length;
  }

  get inputLoading(): boolean {
    return form.loading;
  }

  next(): void {
    if (this.active < this.fancy.inputs.length) {
      this.active++;
      form.hideSuccess();
    } else {
      this.active++;
      this.fancy.onSubmit();
    }
  }

  prev(): void {
    if (this.active > 1) {
      this.active--;
    }
    form.hideSuccess();
  }
}
</script>
<style lang="stylus" scoped>
.min-form {
  width: 100%;
  max-width: 600px;
}

.bg-grad-blue {
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}

.w-80 {
  width: 80%;
}

.mugs-move {
  transition: 0.4s;
}

.title {
  background: $cyan-8;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('../assets/c.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>
