<template>
  <q-expansion-item
    :group="group|| 'group1'"
    :icon="icon"
    :label="label"
    :header-class="headerClass||''"
  >
    <q-card>
      <q-card-section class="overflow-hidden">
        <template v-if="detailEdits">
          <DetailEdit
            v-for="(detailEdit, index) in detailEdits"
            :key="index"
            :class="index % 2 == 1 ? 'bg-grey-3' : 'bg-white'"
            v-bind="detailEdit"
          />
        </template>
        <SubjectsEdit v-if="subjects" v-bind="subjects" />
        <LevelClassesEdit v-if="classes" :permission="permission" />
        <SaveBtn :permission="permission" v-if="saveBtnOptions" v-bind="saveBtnOptions" />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  DetailEditOptions,
  SaveButtonOptions,
  EDetailEditOptions,
  SubjectsEditOptions
} from 'src/interfaces';
import DetailEdit from './DetailEdit.vue';
import SubjectsEdit from './SubjectsEdit.vue';
import LevelClassesEdit from './level-classes-edit.vue';
import SaveBtn from './SaveBtn.vue';

@Component({
  components: { DetailEdit, SaveBtn, SubjectsEdit, LevelClassesEdit }
})
export default class EDetailEdit extends Vue implements EDetailEditOptions {
  @Prop({ required: true }) readonly icon!: string;
  @Prop({ required: true }) readonly label!: string;
  @Prop({ required: true, default: false })
  readonly permission!: boolean | string;
  @Prop() readonly saveBtnOptions?: SaveButtonOptions;
  @Prop() readonly detailEdits?: DetailEditOptions[];
  @Prop() readonly classes?: boolean;
  @Prop() readonly group?: string;
  @Prop() readonly headerClass?: string;
  @Prop() readonly subjects?: SubjectsEditOptions;
}
</script>
