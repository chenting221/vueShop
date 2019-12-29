import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/components/Index')
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')

const Users = () => import('@/components/users/Users')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '*', redirect: '/home' },
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        { path: '/home', name: 'home', component: Home },
        {
          path: '/users',
          name: 'users',
          component: Users,
          meta: {
            breadcrumb: [
              { name: '用户管理' },
              { name: '用户列表', path: '/users' }
            ]
          }
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights,
          meta: {
            breadcrumb: [
              { name: '权限管理' },
              { name: '权限列表', path: '/rights' }
            ]
          }
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles,
          meta: {
            breadcrumb: [
              { name: '权限管理' },
              { name: '角色列表', path: '/roles' }
            ]
          }
        }
      ]
    }
  ]
})
