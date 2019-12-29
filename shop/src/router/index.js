import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/components/Index')
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')

const Users = () => import('@/components/users/Users')

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
        }
      ]
    }
  ]
})
