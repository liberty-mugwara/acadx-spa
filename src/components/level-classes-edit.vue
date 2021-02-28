<template>
  <q-list bordered>
    <template v-for="(level, index) in levels">
      <q-expansion-item
        icon="mdi-check-decagram"
        group="level-classes"
        expand-separator
        @show="selectThisLevel(level)"
        :label="`${level.name} Classes`"
        :key="level.name + `${index}`"
        header-class="text-subtitle1 bg-grey-2"
      >
        <q-card>
          <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            move-class="mugs-move"
          >
            <q-card-section key="trans1">
              <q-list separator>
                <q-item
                  v-for="(classToCreate,
                              index) in classesToCreate"
                  :key="classToCreate.name + `${index}`"
                >
                  <q-item-section>
                    {{
                    classToCreate.name
                    }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-section v-if="perm" key="trans2">
              <q-input
                :bottom-slots="true"
                placeholder="Enter class name"
                v-if="perm"
                label="Class"
                v-model="className"
                ref="addclass"
                :input-class="`text-h5 ${success ? `text-${successColor}` : ''}`"
                :color="success ? successColor : 'cyan-8'"
                :autofocus="true"
                filled
                :rules="[]"
              >
                <template v-slot:hint>
                  <div :class="success ? `text-${successColor}` : ''">
                    {{
                    success ? successText : '1A5, 1Green, 1A etc'
                    }}
                  </div>
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions v-if="perm" key="trans3" align="right">
              <q-btn v-if="perm" flat color="cyan-6" @click="addClass()" label="add more" />
              <q-btn
                v-if="perm"
                flat
                color="teal-6"
                @click="classes.create(cacheIndex)"
                label="save"
              />
            </q-card-actions>

            <q-card-section key="trans4">
              <q-list bordered>
                <template v-for="(myclass, index) in level.school_classes">
                  <class-edit
                    :key="myclass.name+index"
                    permission="user/group_4"
                    :schoolClass="myclass"
                  />

                  <q-separator
                    v-if="index<level.school_classes.length-1"
                    :key="myclass.name + `${index}-sep`"
                  />
                </template>
              </q-list>
            </q-card-section>
          </transition-group>
        </q-card>
      </q-expansion-item>
      <q-separator :key="level.name + `${index}-sep`" />
    </template>
  </q-list>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Mixins, Component, Watch } from 'vue-property-decorator';
import { SelectOptions, LevelOptions } from 'src/interfaces';
import { classes, school } from 'src/store/modules';
import { InputSuccessMixin } from 'src/mixins';
import ClassEdit from './class-edit.vue';
import { getState, setState } from 'src/helpers';

@Component({ components: { ClassEdit } })
export default class LevelClassesEdit extends Mixins(InputSuccessMixin) {
  classN = '';
  levelId = 0;
  lockClassAdition = true;
  classesToCreateLength = 1;
  classesToCreateIndex = 0;

  get perm() {
    return getState('user/group_4');
  }
  get cacheIndex() {
    return school.cacheIndex;
  }

  get classesToCreate() {
    return classes.toCreate;
  }
  get classes() {
    return classes;
  }

  get levels() {
    return classes.levels;
  }
  get level() {
    return classes.level;
  }
  set level(val: Partial<LevelOptions>) {
    classes.setLevel(val);
  }

  get className() {
    return this.classN;
  }
  set className(val: string) {
    this.classN = val;
  }

  subjectName(val: number, selectList: SelectOptions[]) {
    const subject = selectList.find(subject => subject.value == val);
    return subject?.label;
  }
  addClass(): void {
    if (!this.lockClassAdition) {
      this.classesToCreateLength++;
      this.classesToCreateIndex++;
      this.lockClassAdition = true;
    }
  }
  selectThisLevel(level: LevelOptions): void {
    this.levelId = level.id;
    classes.setLevel(level);
  }

  @Watch('classN')
  addOrUpdateClass(val: string) {
    this.lockClassAdition = false;
    if (this.classesToCreate.length == 0 && this.classesToCreateLength > 1) {
      this.classesToCreateLength = 1;
      this.classesToCreateIndex = 0;
    }

    if (this.classesToCreate.length < this.classesToCreateLength)
      setState('classes/toCreate.', {
        index: this.classesToCreateIndex,
        name: val,
        level_id: this.levelId
      });
    else
      setState('classes/toCreate.name', {
        index: this.classesToCreateIndex,
        name: val,
        level_id: this.levelId
      });
  }
}
</script>
