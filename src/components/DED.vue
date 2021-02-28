<template>
  <transition-group
    appear
    enter-active-class="animated bounceInRight"
    leave-active-class="animated bounceOutRight"
  >
    <q-btn
      v-if="show"
      key="1"
      round
      size="10px"
      color="negative"
      icon="delete"
      class="q-mx-sm"
      @click="del()"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">delete</q-tooltip>
    </q-btn>
    <q-btn
      v-if="show"
      key="2"
      round
      @click="edit()"
      size="10px"
      color="positive"
      icon="edit"
      class="q-mx-sm"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">edit</q-tooltip>
    </q-btn>
    <q-btn
      v-if="show"
      key="3"
      @click="details()"
      round
      size="10px"
      color="info"
      icon="description"
      class="q-mx-sm"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">details</q-tooltip>
    </q-btn>
    <q-btn
      key="4"
      @click="show = !show"
      round
      size="12px"
      color="transparent"
      unelevated
      text-color="grey-8"
      icon="more_vert"
    />
  </transition-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class DED extends Vue {
  /* DED (delete, edit, details)*/
  @Prop({ required: true }) readonly del!: () => void;
  @Prop({ required: true }) readonly edit!: () => void;
  @Prop({ required: true }) readonly details!: () => void;
  show = false;
}
</script>
