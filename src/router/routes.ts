import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/NoLoginFixed.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayoutFooter.vue'),
    children: [
      {
        path: 'register',
        name: 'acadxRegister',
        component: () => import('pages/auth/register.vue')
      },
      {
        path: 'signin',
        name: 'acadxSignin',
        component: () => import('pages/auth/login.vue')
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('pages/contact.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/about.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: 'acadxAuth',
        component: () => import('pages/auth/auth.vue')
      }
    ]
  },
  {
    path: '/acadx/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/home.vue')
      },
      {
        path: 'user-index',
        name: 'userIndex',
        component: () => import('pages/users/index.vue')
      },
      {
        path: 'create-user',
        name: 'createUser',
        component: () => import('pages/users/create.vue')
      },
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('pages/users/list.vue')
      },
      {
        path: 'special-user-detail',
        name: 'specialUserDetail',
        component: () => import('pages/users/details.vue')
      }
    ]
  },
  {
    path: '/schools/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'schoolsList',
        component: () => import('pages/school/index.vue')
      },
      {
        path: 'details',
        name: 'schoolDetails',
        component: () => import('pages/school/details.vue')
      },
      {
        path: 'create',
        name: 'createSchool',
        component: () => import('pages/school/create.vue')
      },
      {
        path: 'users',
        name: 'schoolUsers',
        component: () => import('pages/school/people/index.vue')
      },
      {
        path: 'user-list/',
        name: 'schoolUsersList',
        component: () => import('pages/school/people/list.vue')
      },
      {
        path: 'users/create',
        name: 'schoolUsersCreate',
        component: () => import('pages/school/people/create.vue')
      },
      {
        path: 'students/create',
        name: 'studentCreate',
        component: () => import('pages/school/people/create-student.vue')
      },
      {
        path: 'students/detail',
        name: 'studentDetails',
        component: () => import('pages/school/people/details-student.vue')
      },
      {
        path: 'users/detail',
        name: 'schoolUsersDetail',
        component: () => import('pages/school/people/details.vue')
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
