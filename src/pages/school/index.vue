<template>
  <div bordered class="q-pb-md q-pt-xl" style="max-width: 800px; width: 80%;  min-height:100vh">
    <div class="text-h4 f-trocchi w-100 text-center">All Schools</div>
    <div class="q-pa-md q-mx-auto q-mt-sm" style="width: 90%; max-width: 400px;">
      <q-toolbar class="bg-transparent rounded-md text-primary">
        <q-btn
          v-if="group1"
          class="q-mr-sm unelevated"
          dense
          round
          icon="add"
          color="positive"
          :to="{ name: 'createSchool' }"
        >
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            content-style="font-size:13px"
          >Create</q-tooltip>
        </q-btn>
        <q-input
          dense
          filled
          standout
          v-model="search"
          input-class="text-right"
          color="purple"
          class="q-ml-md"
          :style="group1 ? 'width:86%' : 'width:100%'"
        >
          <template v-slot:append>
            <div class="overflow-hidden">
              <transition
                appear
                enter-active-class="animated bounceInRight"
                leave-active-class="animated bounceOutRight"
              >
                <q-icon color="purple" key="s" v-if="search === ''" name="search" />
                <q-icon
                  v-else
                  key="c"
                  name="clear"
                  color="negative"
                  class="cursor-pointer"
                  @click="search = ''"
                />
              </transition>
            </div>
          </template>
        </q-input>
      </q-toolbar>
    </div>
    <q-intersection v-for="school in schools" :key="school.id" transition="scale" class="list-item">
      <q-item clickable class="bg-white">
        <q-item-section @click="() => details(school)" avatar top>
          <q-avatar icon="school" color="primary" size="md" text-color="white" font-size="24px" />
        </q-item-section>

        <q-item-section @click="() => details(school)">
          <q-item-label lines="1">
            <span class="text-weight-medium">
              {{ school.name }}
              {{
              school.classification == 1
              ? 'pre-school'
              : school.classification == 2
              ? 'primary school'
              : 'secondary school'
              }}
            </span>
          </q-item-label>
        </q-item-section>

        <q-item-section class="q-gutter-x-sm overflow-hidden" side>
          <DED
            :del="() => del(school)"
            :edit="() => edit(school)"
            :details="() => details(school)"
          />
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import DED from 'components/DED.vue';
import { SchoolOptions } from 'src/interfaces';
import { user, school, del, page } from 'src/store/modules';
import { UserRolesMixin } from 'src/mixins';
@Component({ components: { DED } })
export default class SpecialschoolsList extends Mixins(UserRolesMixin) {
  search = '';

  get pagination() {
    return page.pagination;
  }

  get page() {
    return page.currentPage;
  }

  get schools(): SchoolOptions[] {
    return school.list;
  }
  del(selectedSchool: SchoolOptions): void {
    del.deleteSchool(selectedSchool);
  }

  edit(selectedSchool: SchoolOptions) {
    school.edit(selectedSchool);
  }
  details(selectedSchool: SchoolOptions) {
    school.detail(selectedSchool);
  }
  @Watch('page')
  getItems(newVal: number, oldVal: number) {
    if (this.pagination && oldVal != 0) school.getList();
  }

  created() {
    user.authR();
    school.getList();
  }
}
</script>
<style lang="stylus" scoped>
.list-item {
  height: 56px;
}
</style>
