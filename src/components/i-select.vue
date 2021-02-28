<template>
  <q-select
    v-model="model"
    :label="label||''"
    :options="options"
    :input-class="inputClass||'text-h6'"
    :color="color||'cyan-8'"
    :transition-show="transitionShow||'jump-down'"
    :transition-hide="transitionHide||'jump-up'"
    :filled="filled||true"
    :emit-value="emit||true"
    :map-options="map||false"
    :multiple="multiple||false"
    :dense="dense"
  >
    <template v-if="toggle" v-slot:option="scope">
      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section>
          <q-item-label v-html="scope.opt.label"></q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="model" :color="color||'cyan-8'" :val="scope.opt.value" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function*/
import { Component, Mixins, Prop, Emit } from 'vue-property-decorator';
import { ImpressiSelectOptions } from 'src/interfaces';
import { InputsMixin } from 'src/mixins';

@Component
export default class ISelect extends Mixins(InputsMixin)
  implements ImpressiSelectOptions {}
</script>
