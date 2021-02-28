<template v-if="authenticated">
  <q-layout view="lHh Lpr lFf">
    <q-ajax-bar position="top" color="accent" size="5px" />
    <q-header>
      <q-toolbar class="bg-white text-h6 text-grey-8 shadow-2">
        <q-btn flat round dense icon="menu" class="xs q-mr-sm" @click="page.toggleLeftDrawer()" />
        <q-btn
          flat
          round
          dense
          :icon="mini && leftDrawerOpen && 'las la-list'||'las la-ellipsis-v'"
          :class="`gt-xs q-mr-sm ${mini &&'q-ml-xl'}`"
          @click="page.toggleMiniMode()"
        />
        <q-separator vertical inset />
        <q-btn
          class="text-h5 f-nano"
          text-color="primary"
          stretch
          flat
          :to="school.id &&  { name: 'schoolDetails' } ||{ name: 'home' }"
          :label="school.name ? school.name : 'ACADX'"
        />
        <q-space />
        <DropdownMenu class="gt-sm" :dropdownOptions="dropdownSchool" />
        <DropdownMenu class="gt-xs" :dropdownOptions="dropdownUser" />
        <q-btn v-if="authenticated" stretch flat icon="notifications_active" />
        <DropdownMenu :dropdownOptions="dropdownAccount" />
        <q-btn stretch flat label="ACADX v1.0.0" class="gt-sm" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="240"
      :breakpoint="500"
      :overlay="mini"
      :mini="miniState"
      @mouseover="page.miniStateOff()"
      @mouseout="page.miniStateOn()"
      side="left"
      elevated
      content-class
      no-swipe-open
      no-swipe-close
    >
      <q-list :class="`${!miniState && 'column items-center'} text-white drawer h-100`">
        <DrawerLink :dark="true" v-bind="drawerUser" :icon="userIcon" />
        <q-separator dark inset />
        <DrawerLink
          :dark="true"
          v-if="group2"
          v-bind="drawerAcadx"
          :class="`menu-heading q-mt-md q-mb-xs rounded-sm ${activeHeading=='acadx' && 'active-heading'}`"
          :style="!miniState && 'width:210px '"
          @active="activeMenu=1"
        />
        <DrawerLink
          v-for="(link, index) in drawerLinksA"
          :key="`${link.title}${index}`"
          :dark="true"
          v-bind="link"
          :class="`menu q-my-xs rounded-sm ${activeMenu==link.id && 'active-menu'}`"
          :style="!miniState && 'width:210px'"
          @active="activeMenu=link.id"
          :iconColor="activeMenu==link.id && 'white' || 'grey-5'"
        />
        <template v-if="school.id">
          <DrawerLink
            :dark="true"
            v-bind="drawerSchool"
            :class="`menu-heading q-mt-md q-mb-xs rounded-sm ${activeHeading=='school' && 'active-heading'}`"
            :style="!miniState && 'width:210px '"
            @active="activeMenu=3"
          />
          <DrawerLink
            v-for="link in drawerLinksB"
            :key="link.title"
            v-bind="link"
            :dark="true"
            :class="`menu q-my-xs rounded-sm ${activeMenu==link.id && 'active-menu'}`"
            :style="!miniState && 'width:210px'"
            @active="activeMenu=link.id"
            :iconColor="activeMenu==link.id && 'white' || 'grey-5'"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="flex column flex-center bg-brown-1">
        <router-view />
        <div v-if="page.pagination" class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="model"
            color="purple"
            :max="page.maxPages"
            :max-pages="6"
            :boundary-numbers="true"
          ></q-pagination>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-fab
            v-model="fab"
            vertical-actions-align="right"
            color="primary"
            icon="build"
            direction="up"
          >
            <q-fab-action color="accent" icon="search" />
            <q-fab-action color="secondary" @click="edit" icon="edit" />
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Mixins, Component, Watch } from 'vue-property-decorator';
import DrawerLink from 'components/DrawerLink.vue';
import DropdownMenu from 'components/DropdownMenu.vue';
import { DrawerLinkOptions, DropdownMenuOptions } from 'src/interfaces';
import { user, school, form, page, data } from '../store/modules';
import { UserRolesMixin } from 'src/mixins';
import { setState, getState } from 'src/helpers';
@Component({
  components: {
    DrawerLink,
    DropdownMenu
  }
})
export default class MainLayout extends Mixins(UserRolesMixin) {
  store = 'page/currentPage';
  fab = false;
  drawerHeading: 'acadx' | 'school' = 'acadx';

  get model() {
    return getState(this.store);
  }
  set model(val: string | number | boolean) {
    setState(this.store, val);
  }

  setActiveMenu(id: number) {
    setState('page/leftDrawerOpen', true);
    setState('page/activeMenu', id);
  }

  get mini() {
    return page.mini;
  }

  get miniState() {
    return page.miniState;
  }

  get leftDrawerOpen() {
    return page.leftDrawerOpen;
  }

  set leftDrawerOpen(val: boolean) {
    setState('page/leftDrawerOpen', val);
  }

  get activeMenu() {
    return page.activeMenu;
  }

  set activeMenu(id: number) {
    this.setActiveMenu(id);
  }

  get activeHeading(): 'school' | 'acadx' {
    return (
      (this.activeMenu && ((this.activeMenu > 2 && 'school') || 'acadx')) ||
      this.drawerHeading
    );
  }

  set activeHeading(val: 'school' | 'acadx') {
    this.drawerHeading = val;
  }

  get page() {
    return page;
  }

  get school() {
    return school;
  }

  edit(): void {
    if (form.edit) form.stopEditing();
    else form.startEditing();
  }

  drawerUser: DrawerLinkOptions = {
    title: 'user//fullname',
    icon: '',
    caption: '',
    link: { name: '' },
    permission: true
  };

  drawerAcadx: DrawerLinkOptions = {
    title: 'Acadx Actions',
    icon: 'las la-hashtag',
    iconColor: 'white',
    caption: '',
    link: { name: 'userIndex' },
    permission: true
  };

  drawerSchool: DrawerLinkOptions = {
    title: 'School Actions',
    icon: 'las la-hashtag',
    iconColor: 'white',
    caption: '',
    link: { name: 'schoolDetails' },
    permission: true
  };

  dropdownSchool: DropdownMenuOptions = {
    permission: 'school/id',
    label: 'school',
    menus: [
      {
        heading: 'school/name',
        links: [
          {
            title: 'Details',
            caption: '',
            icon: 'las la-file-alt',
            link: { name: 'schoolDetails' },
            permission: true,
            id: 3
          },
          {
            title: 'Users',
            caption: '',
            icon: 'las la-user-friends',
            link: { name: 'schoolUsers' },
            permission: 'user/group_4',
            id: 4
          },

          {
            title: 'Library',
            caption: '',
            icon: 'las la-book-reader',
            link: { name: '' },
            permission: 'user/group_8',
            id: 5
          },
          {
            title: 'Payments',
            caption: '',
            icon: 'las la-money-check-alt',
            link: { name: '' },
            permission: 'user/group_8',
            id: 6
          },
          {
            title: 'elearning',
            caption: '',
            icon: 'las la-chalkboard-teacher',
            link: { name: '' },
            permission: 'user/group_8',
            id: 7
          }
        ]
      }
    ]
  };

  drawerLinksA: Array<DrawerLinkOptions> = [
    {
      title: 'Users',
      caption: '',
      icon: 'las la-user-tie',
      link: { name: 'userIndex' },
      permission: 'user/group_2',
      id: 1
    },
    {
      title: 'Schools',
      caption: '',
      icon: 'school',
      link: { name: 'schoolsList' },
      permission: 'user/group_2',
      id: 2
    }
  ];
  drawerLinksB: Array<DrawerLinkOptions> = this.dropdownSchool.menus[0].links;

  dropdownUser: DropdownMenuOptions = {
    permission: 'user/user_id',
    label: this.userRole,
    menus: [
      {
        heading: 'User Type Actions',
        links: [this.drawerLinksA[0]]
      },
      {
        heading: 'Advanced School Actions',
        links: [this.drawerLinksA[1]]
      }
    ]
  };

  dropdownAccount: DropdownMenuOptions = {
    permission: 'user/user_id',
    icon: 'las la-user-circle',
    menus: [
      {
        links: [
          {
            title: 'Profile',
            caption: '',
            icon: 'description',
            link: { name: '' },
            permission: true
          }
        ]
      },
      {
        links: [
          {
            title: 'Logout',
            caption: '',
            icon: 'exit_to_app',
            link: { name: '' },
            permission: true,
            click: () => user.logout()
          }
        ]
      }
    ]
  };

  get authenticated(): boolean {
    return user.user_id != 0;
  }
  get userRole(): string {
    return user.user_role;
  }
  get fullname(): string {
    return `${user.first_name} ${user.last_name}`;
  }

  getData() {
    Promise.all([data.getSchoolData(), data.getAddressData()]);
  }

  created() {
    this.drawerHeading = (this.group2 && 'acadx') || 'school';
    user.authR();
    this.getData();
  }
}
</script>
<style lang="stylus" scoped>
.drawer {
  padding: 0, 10px, 0, 10px;
  margin-top: 0;
  background: rgb(197, 189, 188);
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.98)), url('../assets/b.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.active-heading {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.active-menu {
  background-color: #E7007D;
  color: #fff;
}

.menu {
  transition: background-color 0.6s ease-out;
}

.menu-heading {
  transition: background-color 0.4s ease-out;
}

.h-100 {
  height: 100%;
}
</style>
