<template>
  <div class="shadow-14 bg-grey-1" style="width:100%;max-width:1150px;min-height:100vh;height-auto">
    <q-card class="no-shadow no-border-radius intro my-card w-100">
      <q-card-section>
        <div class="row items-center justify-between q-gutter-md">
          <div>
            <div class="text-h3 text-grey-3 f-nano q-mb-sm">{{ school.name }}</div>
            <div class="text-h5 text-positive">
              {{
              school.clasification == 1
              ? 'Pre-school'
              : school.classification == 2
              ? 'Primary School'
              : 'Secondary School'
              }}
            </div>
          </div>
          <div class="text-h4 f-trocchi text-grey-5">{{ school.code.code }}</div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-toolbar class="toolbar">
          <q-btn flat @click="updateCurrentTerm(school)" round dense>
            <q-icon name="refresh" />
            <q-tooltip content-style="font-size: 14px">Update current term</q-tooltip>
          </q-btn>
          <q-toolbar-title>{{ currentTerm.term.name }}</q-toolbar-title>
          <q-toggle
            v-model="production"
            checked-icon="check"
            color="secondary"
            label="Apply to system"
            unchecked-icon="clear"
          />
        </q-toolbar>
      </q-card-section>
    </q-card>

    <div class="row q-pt-xl q-mb-xl justify-center q-gutter-lg">
      <q-markup-table class="self-start" style="width:90%; max-width:420px;">
        <thead class="bg-primary text-white">
          <tr>
            <th :colspan="school.acadx_schoollevels.length + 1" class="text-h2 f-nano">
              <div class="text-h5 text-center q-my-lg">Terms and Levels Offered</div>
            </th>
          </tr>
          <tr>
            <th class="text-left">
              <div class="text-h6 f-trocchi">Level</div>
            </th>
            <th :colspan="school.acadx_schoollevels.length - 1" class="text-right">
              <div class="text-h6 f-trocchi">Terms</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(level, index) in school.acadx_schoollevels">
            <tr :key="index" :class="index % 2 == 0 ? 'bg-grey-3' : 'bg-white'">
              <td :class="edit ? 'text-left hover' : 'text-left'">
                {{ level.name }}
                <q-popup-edit
                  v-if="edit"
                  v-model="levelName"
                  @before-show="() => (levelName = level.name)"
                  @save="
                    val => {
                      school.updateState({module:'school',state:'acadx_schoollevels',
                        value: `${level.id}||${val}||${level.position}` });
                    }
                  "
                  :validate="validate"
                  :cover="false"
                  :offset="[0, 10]"
                  buttons
                >
                  <q-input
                    :bottom-slots="true"
                    placeholder="Enter level name"
                    label="level"
                    v-model="levelName"
                    :input-class="
                      `text-h5 ${success ? `text-${successColor}` : ''}`
                    "
                    debounce="500"
                    :color="success ? successColor : 'cyan-8'"
                    :autofocus="true"
                    :rules="[]"
                  >
                    <template v-slot:hint>
                      <div
                        :class="success ? `text-${successColor}` : ''"
                      >{{ success ? successText : '' }}</div>
                    </template>
                  </q-input>
                </q-popup-edit>
              </td>
              <td
                v-for="term in school.acadx_schoolterms"
                :key="term.id"
                :class="edit
                    ? 'text-right hover'
                    : 'text-right'
                "
              >
                <q-icon v-if=" currentTerm.term.id == term.id" name="mdi-seal" color="accent" />
                {{term.name }}
                <q-popup-edit
                  v-if="edit"
                  v-model="termName"
                  @before-show="() => (termName = term.name)"
                  @save="
                    val => {
                      school.updateState({module:'school',state:'acadx_schoolterms',
                        value: `${term.id}||${val}||${term.position}` });
                    }
                  "
                  :validate="validate"
                  :cover="false"
                  :offset="[0, 10]"
                  buttons
                >
                  <q-input
                    :bottom-slots="true"
                    placeholder="Enter term name"
                    label="level"
                    v-model="termName"
                    :input-class="
                      `text-h5 ${success ? `text-${successColor}` : ''}`
                    "
                    debounce="500"
                    :color="success ? successColor : 'cyan-8'"
                    :autofocus="true"
                    :rules="[]"
                  >
                    <template v-slot:hint>
                      <div
                        :class="success ? `text-${successColor}` : ''"
                      >{{ success ? successText : '' }}</div>
                    </template>
                  </q-input>
                </q-popup-edit>
              </td>
            </tr>
          </template>
          <tr>
            <th v-if="saveTermsLevelsBtn" :colspan="school.acadx_schoollevels.length + 1">
              <SaveBtn
                permission="user/group_4"
                :click="() =>updateSchool()"
                showCondition="school//levelsChanged|termsChanged"
              />
            </th>
          </tr>
        </tbody>
      </q-markup-table>

      <div style="width:90%;max-width:600px;">
        <q-list bordered>
          <EDetailEdit
            headerClass="bg-secondary text-white text-subtitle1"
            :label="school.name + ' details'"
            icon="school"
            permission="user/group_2"
            :saveBtnOptions="{
        click: () => updateSchool(),
        showCondition: 'school/baseChanged',
        permission: 'user/group_2'
      }"
            :detailEdits="prepareDetailEdits('school')"
          />
          <q-separator />
          <EDetailEdit
            label="Address"
            icon="las la-map-marked-alt"
            permission="user/group_4"
            :saveBtnOptions="{
        click: () => updateAddress(),
        showCondition: 'address/detailsChanged',
        permission: 'user/group_4'
      }"
            :detailEdits="prepareDetailEdits('address')"
          />
          <q-separator />
          <EDetailEdit
            label="Subjects"
            icon="las la-book-reader"
            permission="user/group_4"
            :subjects="{
        permission: 'user/group_4',
        store: 'school/acadx_subjects',
        optionsStore: 'school/subjects',
        saveBtnOptions: {
          click: () => updateSchool(),
          showCondition: 'school/subjectsChanged',
          permission: 'user/group_4'
        }
      }"
          />
          <q-separator />

          <EDetailEdit
            label="Classes"
            icon="las la-chalkboard-teacher"
            permission="user/group_4"
            :classes="true"
          />
        </q-list>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins } from 'vue-property-decorator';
import { DetailMixin, PopupEditMixin } from 'src/mixins';
import { getState, setState } from 'src/helpers';

@Component
export default class SchoolDetails extends Mixins(DetailMixin, PopupEditMixin) {
  termN = '';
  levelN = '';

  get saveTermsLevelsBtn() {
    return getState('school//levelsChanged|termsChanged');
  }
  get termName() {
    return this.termN;
  }
  set termName(val: string) {
    this.termN = val;
  }
  get levelName() {
    return this.levelN;
  }
  set levelName(val: string) {
    this.levelN = val;
  }

  get production(): boolean {
    return this.school.production;
  }
  set production(val: boolean) {
    setState('school/production', val);
  }

  created() {
    this.user.authR();
  }
}
</script>
<style lang="stylus" scoped>
.intro {
  padding-top: 0;
  margin-top: 0;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.95)), url('../../assets/f.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left bottom;
  background-attachment: fixed;
}

.toolbar {
  background: rgba(255, 255, 255, 0.8);
}

.mugs-move {
  transition: 0.4s ease-in;
}
</style>
