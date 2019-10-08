import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)


export const routes = [{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [{
			path: '/redirect/:path*',
			component: () => import('@/views/redirect/index')
		}]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},
	{
	  path: '/404',
	  component: () => import('@/views/error-page/404'),
	  hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			component: () => import('@/views/dashboard/index'),
			name: 'Dashboard',
			meta: {
				title: '首页',
				pinyin: 'shouye',
				icon: 'dashboard',
				affix: true,
				code: 'kl_index'
			}
		}]
	},
	{
		path: '/slider',
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/slider/index'),
			name: 'Slider',
			meta: {
				title: '轮播图',
				icon: 'icon',
				noCache: true,
				code: 'kl_slider'
			}
		}]
	},
	{
		path: '/product',
		component: Layout,
		name: 'Product',
		redirect: '/product/index',
		meta: {
			title: '商品管理',
			icon: 'example',
			code:'kl_product_manage'
		},
		children: [{
				path: 'index',
				component: () => import('@/views/product/index'),
				name: 'ProductList',
				meta: {
					title: '商品列表',
					code:'kl_product_index'
				}
			},
			{
				path: 'tab',
				component: () => import('@/views/product/tab'),
				name: 'ProductTab',
				meta: {
					title: '活动板块',
					code:'kl_product_tab'
				}
			},
			{
				path: 'add',
				component: () => import('@/views/product/form'),
				name: 'ProductAdd',
				meta: {
					title: '添加商品',
					noCache: true,
					code:'kl_product_add'
				}
			},
			{
				path: 'edit/:id',
				component: () => import('@/views/product/form'),
				name: 'ProductEdit',
				hidden: true,
				meta: {
					title: '编辑商品',
					noCache: true,
					code:'kl_product_edit'
				}
			}
		]
	},
	{
		path: '/authority',
		component: Layout,
		name: 'Authority',
		meta: {
			title: '权限管理',
			icon: 'documentation',
			code:'kl_authority_manage'
		},
		redirect: '/authority/user/list',
		children: [{
				path: 'user/list',
				component: () => import('@/views/user/list'),
				name: 'AuthorityUserList',
				meta: {
					title: '管理员列表',
					noCache: true,
					code: 'kl_user_list'
				}
			},
			{
				path: 'group/list',
				component: () => import('@/views/group/list'),
				name: 'AuthorityGroupList',
				meta: {
					title: '用户组列表',
					noCache: true,
					code: 'kl_group_list'
				},
			},
			{
				path: 'node/list',
				component: () => import('@/views/node/list'),
				name: 'AuthorityNodeList',
				meta: {
					title: '结点列表',
					noCache: true,
					code: 'kl_node_list'
				},
			}
		]
	},
	{ path: '*', redirect: '/404', hidden: true }
]



const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({
		y: 0
	}),
	routes: routes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router