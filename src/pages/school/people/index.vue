<template>
  <div class="column flex-center w-100">
    <transition-group
      appear
      enter-active-class="animated zoomInRight"
      leave-active-class="animated fadeOutLeftBig"
      class="row flex-center q-gutter-xl"
      style="width:100%;max-width:1200px;"
    >
      <UserCreateMenu v-for="menu in createMenus" :key="menu.title" v-bind="menu" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { user } from 'src/store/modules';
import { UserRolesMixin } from 'src/mixins';
import { UserCreateMenuOptions } from 'src/interfaces';
import UserCreateMenu from 'components/i-user-create-menu.vue';
import { getIcon, setState, push } from 'src/helpers';

@Component({ components: { UserCreateMenu } })
export default class UserIndex extends Mixins(UserRolesMixin) {
  search = '';

  createUser = (userType: number) => {
    user.toCreateUser(userType);
  };

  createMenus: UserCreateMenuOptions[] = [
    {
      title: 'SUPERADMIN',
      icon: getIcon('superadmin'),
      permission: 'user/group_1',
      createLink: {
        name: 'schoolUsersCreate'
      },
      createOnClick: () => setState('user/profile', 'schoolAdmin'),
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'schoolAdmin')
    },
    {
      title: 'ADMIN',
      icon: getIcon('school admin'),
      permission: 'user/group_1|group_0_1',
      createLink: {
        name: 'schoolUsersCreate'
      },
      createOnClick: () => setState('user/profile', 'schoolAdmin'),
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'schoolAdmin')
    },
    {
      title: 'LIBRARIAN',
      icon: getIcon('librarian'),
      permission: 'user/group_4',
      createLink: {
        name: 'schoolUsersCreate'
      },
      createOnClick: () => setState('user/profile', 'librarian'),
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'librarian')
    },
    {
      title: 'TEACHER',
      icon: getIcon('teacher'),
      permission: 'user/group_4',
      createLink: {
        name: 'schoolUsersCreate'
      },
      createOnClick: () => setState('user/profile', 'teacher'),
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'teacher')
    },
    {
      title: 'PARENT',
      icon: getIcon('parent'),
      permission: 'user/group_4',
      createLink: {
        name: 'schoolUsersCreate'
      },
      createOnClick: () => setState('user/profile', 'parent'),
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'parent')
    },
    {
      title: 'STUDENT',
      icon: getIcon('student'),
      permission: 'user/group_4',
      createLink: {
        name: 'studentCreate'
      },
      listLink: {
        name: 'schoolUsersList'
      },
      listOnClick: () => setState('user/profile', 'student')
    }
  ];

  created() {
    user.authR();
    if (!this.superuser && !this.supervisor) {
      if (this.staff) push('/acadx/user-list');
    }
  }
}
</script>
