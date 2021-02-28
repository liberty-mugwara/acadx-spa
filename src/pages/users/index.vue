<template>
  <div class="column flex-center w-100 q-mt-lg">
    <div class="text-h4 f-trocchi w-100 text-center">Create Special Users</div>
    <div class="q-pa-md q-mx-auto q-mt-sm" style="width: 90%; max-width: 400px;">
      <q-toolbar class="bg-transparent rounded-md text-primary">
        <q-btn
          v-if="group1"
          class="q-mr-sm unelevated"
          dense
          round
          icon="las la-users"
          color="info"
          :to="{ name: 'userList' }"
        >
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            content-style="font-size:13px"
          >list</q-tooltip>
        </q-btn>
        <q-input
          dense
          filled
          standout
          v-model="search"
          input-class="text-right"
          color="purple"
          class="q-ml-md rounded-md"
          :style="group1 ? 'width:92%' : 'width:100%'"
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

    <transition-group
      appear
      enter-active-class="animated zoomInRight"
      leave-active-class="animated fadeOutLeftBig"
      class="row flex-center q-gutter-xl q-mt-xs"
      style="width:100%;max-width:1200px;"
    >
      <div
        key="1"
        v-if="group0"
        class="row item q-pa-sm bg-white shadow-1 rounded-md"
        v-on:click="createUser(1)"
      >
        <div key="1" class="q-gutter-y-md" style="width:150px;height:150px;">
          <div class="flex a-icon justify-center" style="width:150px;height:80px;">
            <q-avatar color="red-14" text-color="white" icon="star" size="80px" font-size="60px" />
          </div>
          <div
            style="width:100%"
            class="text-center text-h5 a-label text-weight-light text-red-14"
          >SUPERUSER</div>
        </div>
      </div>
      <div
        key="2"
        v-if="group0"
        class="row item q-pa-sm bg-white shadow-1 rounded-md"
        v-on:click="createUser(2)"
      >
        <div key="2" class="q-gutter-y-md" style="width:150px;height:150px;">
          <div class="flex a-icon items-end justify-center" style="width:150px;height:80px;">
            <q-avatar
              color="cyan-14"
              text-color="white"
              icon="verified_user"
              size="80px"
              font-size="60px"
            />
          </div>
          <div
            style="width:100%"
            class="text-center text-h5 text-grey-10 a-label text-weight-light"
          >SUPERVISOR</div>
        </div>
      </div>
      <div
        key="3"
        v-if="group1"
        class="row q-pa-sm item bg-white shadow-1 rounded-md"
        v-on:click="createUser(3)"
      >
        <div class="q-gutter-y-md" style="width:150px;height:150px;">
          <div class="flex items-end a-icon justify-center" style="width:150px;height:80px;">
            <q-avatar
              color="pink-14"
              text-color="white"
              icon="how_to_reg"
              size="80px"
              font-size="60px"
            />
          </div>
          <div
            style="width:100%"
            class="text-center text-h5 a-label text-weight-light text-grey-10"
          >STAFF</div>
        </div>
      </div>
      <div
        key="4"
        v-if="group1"
        class="row item q-pa-sm bg-white shadow-1 rounded-md"
        v-on:click="createUser(4)"
      >
        <div key="4" class="q-gutter-md" style="width:auto;height:150px;">
          <div class="flex a-icon a-icon items-end justify-center" style="width:150px;height:80px;">
            <q-avatar
              color="teal-14"
              text-color="white"
              icon="person"
              size="80px"
              font-size="60px"
            />
          </div>
          <div
            hstyle="width:100%"
            class="text-center a-label text-h5 text-weight-light text-grey-10"
          >SUPERADMIN</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import { UserRolesMixin } from 'src/mixins';
import { setState, push } from '../../helpers';

@Component
export default class UserIndex extends Mixins(UserRolesMixin) {
  search = '';

  createUser = (userType: number) => {
    setState('user/toCreate.user_type', userType);
    push('/acadx/create-user');
  };

  created() {
    user.authR();
    if (!this.superuser && !this.supervisor) {
      if (this.staff) push('/acadx/user-list');
      else push('/acadx/');
    }
  }
}
</script>
<style lang="stylus" scoped>
.header {
  @media (max-width: $breakpoint-sm-max) {
    h1 {
      font-size: 2.125rem;
      font-weight: 400;
      line-height: 3.75rem;
      letter-spacing: -0.00735em;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 400;
      line-height: 0rem;
      letter-spacing: -0.00735em;
    }

    @media (min-width: $breakpoint-sm-min) {
      h1 {
        font-size: 3rem;
        color: red;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.00833em;
      }

      h2 {
        font-size: 1.525rem;
        font-weight: 400;
        line-height: 1;
        letter-spacing: -0.00735em;
      }
    }

    h1, h2 {
      width: 90%;
      max-width: 1200px;
    }
  }

  img {
    object-fit: cover;
  }
}

.a-icon {
  cursor: pointer;
}

.a-label {
  cursor: pointer;
}

.item {
  ---webkit-transition: ease-out 1s;
  transition: ease-out 0.3s;
}

.item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.2);
}
</style>
