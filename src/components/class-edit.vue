<template>
  <q-expansion-item
    header-class="bg-grey-2"
    group="classes"
    expand-separator
    :label="`${schoolClass.name}`"
    icon="las la-certificate"
  >
    <q-scroll-area
      class="q-px-sm"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 400px; width:100%;"
    >
      <i-select
        v-if="perm"
        :filled="false"
        label="Offered Subjects"
        :selectOptions="sOptions"
        v-model="subjects"
        class="q-my-sm"
        :multiple="true"
        color="purple"
        :toggle="true"
        :dense="true"
      />
      <save-btn
        v-if="perm"
        :permission="permission"
        @save="addSubjects()"
        :showCondition="detailsChanged"
      />

      <q-list v-if="subjects.length > 0" separator>
        <CSTEdit
          v-for="(val, index) in subjects"
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
  </q-expansion-item>
</template>
              

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { classes, school } from 'src/store/modules';
import { SchoolClassOptions } from 'src/interfaces';
import { InputSuccessMixin, PermissionMixin } from 'src/mixins';
import CSTEdit from './cst-edit.vue';
import ISelect from './i-select.vue';
import SaveBtn from './SaveBtn.vue';

@Component({ components: { CSTEdit, ISelect, SaveBtn } })
export default class ClassEdit extends Mixins(
  InputSuccessMixin,
  PermissionMixin
) {
  @Prop() readonly schoolClass!: SchoolClassOptions;

  subj: number[] = [];
  detailsChanged = false;
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

  get subjects() {
    return this.subj || [];
  }
  set subjects(val: number[]) {
    this.subj = val;
    this.detailsChanged = true;
  }

  get sOptions() {
    return school.subjectsOffered;
  }
  get subjectsTeachers() {
    return this.schoolClass.subjects_teachers;
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

  async addSubjects() {
    const response = await classes.addSubjects({
      classId: this.schoolClass.id,
      subjects: this.subjects
    });
    if (response) this.detailsChanged = false;
  }

  created() {
    for (const subject of this.schoolClass.subjects)
      this.subj.push(subject.subject);
  }
}
</script>
