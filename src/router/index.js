import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error=>error)
}

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/error-page/404'),
  //   hidden: true
  // },
  // {
  //   path: '/401',
  //   component: () => import('@/views/error-page/401'),
  //   hidden: true
  // },
  {
    path: '/',
		component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页',pinyin:'shouye',icon: 'dashboard', affix: true }
      }
    ]
	},
	 {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: '新手指引',pinyin:'xinshouzhiyin',icon: 'guide', noCache: true }
      }
    ]
  },
]

export const asyncRoutes=[
	{
    path: '/slider',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/slider/index'),
        name: 'Slider',
        meta: { title: '轮播图',pinyin:'lunbotu', icon: 'icon', noCache: true }
      }
    ]
	},
	{
    path: '/product',
		component: Layout,
		name: 'Product',
		redirect: '/product/index',
    meta: {
      title: '商品管理',
      icon: 'example'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/product/index'),
        name: 'ProductList',
        meta: { title: '商品列表',pinyin:'shangpinguanli', icon: 'list', noCache: true }
			},
			{
        path: 'tab',
        component: () => import('@/views/product/tab'),
        name: 'ProductTab',
        meta: { title: '活动板块',pinyin:'huodongbankuai', icon: 'list', noCache: true }
			},
			{
        path: 'add',
        component: () => import('@/views/product/form'),
        name: 'ProductAdd',
        meta: { title: '添加商品',pinyin:'tianjiashangpin', icon: 'list', noCache: true }
      },
			{
        path: 'edit/:id',
        component: () => import('@/views/product/form'),
				name: 'ProductEdit',
				hidden: true,
        meta: { title: '编辑商品', icon: 'list', noCache: true }
      }
    ]
  }
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

