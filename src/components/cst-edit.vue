<template>
  <q-item :clickable="clickable">
    <q-item-section>
      {{
      subjectName
      }}
    </q-item-section>
    <q-item-section side>
      {{
      teacherName
      }}
    </q-item-section>
    <q-popup-edit
      v-if="subjectTeacher && perm"
      v-model="data.teacher"
      @save="updateTeacher()"
      :cover="false"
      :offset="[0, 10]"
      buttons
    >
      <q-select
        v-model="data.teacher"
        label="Teacher"
        :options="teachers"
        input-class="text-h6"
        color="purple"
        transition-show="jump-down"
        transition-hide="jump-up"
        :filled="true"
        :emit-value="true"
        :map-options="true"
      />
    </q-popup-edit>
  </q-item>
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator';
import { PermissionMixin } from 'src/mixins';
import { ClassSubjectTeacherOptions, SelectOptions } from 'src/interfaces';
import { classSubjectTeacher } from 'src/store/modules';

@Component
export default class CSTEdit extends Mixins(PermissionMixin) {
  @Prop({ required: true }) readonly permission!: boolean | string;
  @Prop() readonly subject!: number;
  @Prop() readonly teacher?: number;
  @Prop() readonly subjectTeacher?: Partial<ClassSubjectTeacherOptions>;

  get data(){
    return { teacher: this.teacher || 0, cstId: this.subjectTeacher?.id || 0 }
  };

  get teachers() {
    return classSubjectTeacher.teachers;
  }

  get subjects(): SelectOptions[] {
    return classSubjectTeacher.subjects;
  }

  get teacherName() {
    if (this.subjectTeacher) {
      const selectList: SelectOptions[] = classSubjectTeacher.teachers;
      const teacher = selectList.find(
        teacher => teacher.value == this.data.teacher
      );
      return teacher?.label;
    }
    return '';
  }

  get subjectName() {
    const subject = this.subjects.find(
      subject => subject.value == this.subject
    );
    return subject?.label;
  }

  updateTeacher() {
    this.data.teacher && classSubjectTeacher.commit(this.data);
  }

  get clickable() {
    return (this.perm && this.subjectTeacher && true) || false;
  }
}
</script>
