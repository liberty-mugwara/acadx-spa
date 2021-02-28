<template>
  <q-scroll-area
    class="q-px-sm"
    :thumb-style="thumbStyle"
    :bar-style="barStyle"
    style="height: 400px; width:100%;"
  >
    <ISelect
      v-if="perm"
      :filled="false"
      label="Offered Subjects"
      :optionsStore="optionsStore"
      :store="store"
      class="q-my-sm"
      :multiple="true"
      color="purple"
      :toggle="true"
      :dense="true"
    />
    <SaveBtn
      v-if="perm"
      :permission="permission"
      @save="saveBtnOptions.click()"
      :showCondition="saveBtnOptions.showCondition"
    />

    <q-list v-if="model.length > 0" separator>
      <CSTEdit
        v-for="(val, index) in model"
        :key="index"
        :permission="permission"
        :subject="val"
        :subjectTeacher="getSubjectTeacher(val)"
        :teacher="getTeacher(val)"
      />
      <q-separator />
    </q-list>
    <div v-else class="q-ma-auto">There are no subjects please select.</div>
  </q-scroll-area>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import {
  SaveButtonOptions,
  SubjectsEditOptions,
  ClassSubjectTeacherOptions,
  SchoolClassOptions
} from 'src/interfaces';
import { PermissionMixin, VModelMixin } from 'src/mixins';
import { classes } from 'src/store/modules';
import DetailEdit from './DetailEdit.vue';
import ISelect from './i-select.vue';
import SaveBtn from './SaveBtn.vue';
import CSTEdit from './cst-edit.vue';

@Component({ components: { DetailEdit, ISelect, SaveBtn, CSTEdit } })
export default class SubjectsEdit extends Mixins(PermissionMixin, VModelMixin)
  implements SubjectsEditOptions {
  @Prop({ required: true }) readonly store!: string;
  @Prop({ required: true }) readonly permission!: boolean | string;
  @Prop({ required: true }) readonly saveBtnOptions!: SaveButtonOptions;
  @Prop({ required: true }) optionsStore!: string;
  @Prop() schoolClass?: SchoolClassOptions;

  cst: Partial<ClassSubjectTeacherOptions> = {};

  thumbStyle = {
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#027be3',
    width: '5px',
    opacity: 0.75
  };

  barStyle = {
    right: '2px',
    borderRadius: '9px',
    backgroundColor: '#027be3',
    width: '9px',
    opacity: 0.2
  };

  get subjectsTeachers(): Partial<ClassSubjectTeacherOptions>[] {
    return classes.subjects_teachers;
  }

  getSubjectTeacher(subject: number) {
    return this.subjectsTeachers?.find(st => st.subject?.subject == subject);
  }

  getTeacher(subject: number) {
    const st = this.getSubjectTeacher(subject);
    if (st) {
      const teacher = st.teacher || 0;
      return teacher;
    }
    return 0;
  }
}
</script>
