import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/components/Index')
const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')

const Users = () => import('@/components/users/Users')
const Rights = () => import('@/components/power/Rights')
const Roles = () => import('@/components/power/Roles')

const Cate = () => import('@/components/goods/Cate')
const Params = () => import('@/components/goods/Params')
const List = () => import('@/components/goods/List')
const GoodsAddPage = () => import('@/components/goods/list/GoodsAddPage')

const Order = () => import('@/components/order/Order')

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
        },
        {
          path: '/categories',
          name: 'categories',
          component: Cate,
          meta: {
            breadcrumb: [
              { name: '商品管理' },
              { name: '商品分类', path: '/categories' }
            ]
          }
        },
        {
          path: '/params',
          name: 'params',
          component: Params,
          meta: {
            breadcrumb: [
              { name: '商品管理' },
              { name: '参数列表', path: '/params' }
            ]
          }
        },
        {
          path: '/goods',
          name: 'goods',
          component: List,
          meta: {
            breadcrumb: [
              { name: '商品管理' },
              { name: '商品列表', path: '/goods' }
            ]
          }
        },
        {
          path: '/goods/add',
          name: 'goods/add',
          component: GoodsAddPage,
          meta: {
            breadcrumb: [
              { name: '商品管理' },
              { name: '商品列表' },
              { name: '添加商品', path: '/goods/add' }
            ]
          }
        },
        {
          path: '/orders',
          name: 'orders',
          component: Order,
          meta: {
            breadcrumb: [
              { name: '订单管理' },
              { name: '订单列表', path: '/orders' }
            ]
          }
        }
      ]
    }
  ]
})
