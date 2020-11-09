// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    //baseNavigator: true,
  },
  // dynamicImport: {
  //   loading: '@/components/PageLoading/index',
  // },
  targets: {
    ie: 11,
  },
  routes: [{
    path: '/',
    routes: [
      {
        path: '/sign',
        component: '../layouts/UserLayout',
      
        routes: [
          {
            path: '/sign',
            redirect: '/sign/user/login',
          }, {
            path: '/sign/user',
            routes: [{
              path: '/sign/user/login',
              component: './user/login/index',
            }
            ],
          }
        
        ],
      },
      {
        path: '/page',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/page',
            redirect: '/page/seek/index',
          },
          {
            path: '/page/seek',
            name: '统计页',
            icon: 'dashboard',
            routes: [
              {
                path: '/page/seek/index',
                name: '数据统计',
                icon: 'setting',
                component: './DashBoard/index',
              }
             
            ],
          },

          {
            path: '/page/settings_controls',
            name: '管理页',
            icon: 'crown',
            //authority: ['admin'],
            routes: [
              {
                path: '/page/settings_controls/goods-class-tags-management',
                name: '类别管理',
                icon: 'setting',
                component: './GoodsManagement/GoodsTags/GoodsClassIndex',
              //authority: ['admin'],
              },
              {
                path: '/page/settings_controls/goods-tags-management',
                name: '标签管理',
                icon: 'setting',
                component: './GoodsManagement/GoodsTags/GoodsTagsIndex',
              },
              {
                path: '/page/settings_controls/rolling_picture_index',
                name: '轮播图管理',
                icon: 'smile',
                component: './settings_controls/rolling_picture_index',
              //authority: ['admin'],
              },
              {
                path: '/page/settings_controls/icon_setting',
                name: '图标管理',
                icon: 'smile',
                component: './settings_controls/icon_setting',
              }
             
            ],
          },
          {
            path: '/page/goods',
            name: '商品管理',
            icon: 'setting',
            //authority: ['admin'],
            routes: [
              {
                path: '/page/goods/goods-list',
                name: '商品列表',
                icon: 'smile',
                component: './GoodsManagement/GoodsListTable',
              //authority: ['admin'],
              },
              {
                path: '/page/goods/add-goods',
                name: '添加商品',
                icon: 'add',
                component: './GoodsManagement/GoodsAddEditor',
              // authority: ['admin'],
              },
               
              {
                path: '/page/goods/goods-models-management',
                name: '商品模版',
                icon: 'setting',
                component: './GoodsManagement/GoodsModels/GoodsModelsList',
              // authority: ['admin'],
              }
            ],
          },
          {
            path: '/page/goodspayment',
            name: '订单管理',
            icon: 'table',
            //authority: ['admin'],
            routes: [
              {
                path: '/page/goodspayment/list',
                name: '订单列表',
                icon: 'smile',
                component: './Bill/bills_list',
              //authority: ['admin'],
              },
              {
                path: '/page/goodspayment/express_list',
                name: '快递查询',
                icon: 'smile',
                component: './Bill/express_list',
              //authority: ['admin'],
              },
              {
                path: '/page/goodspayment/check_list',
                name: '对单表',
                icon: 'smile',
                component: './Bill/check_list',
              //authority: ['admin'],
              }
              
            ],
          },          
          {
            path: '/page/study',
            name: '研学模块',
            icon: 'aim',
            routes: [
              {
                path: '/page/study/list',
                name: '课程列表',
                icon: 'setting',
                component: './Course/course_list',
              },
              {
                path: '/page/study/tags',
                name: '课程标签',
                icon: 'setting',
                component: './Course/course_tags_setting',
              }
             
            ],
          },
          {
            path: '/page/test',
            name: '测试组件',
            icon: 'dashboard',
            routes: [
              // {
              //   path: '/page/test/table',
              //   name: '数据统计',
              //   icon: 'setting',
              //   component: './Charts/test_charts',
              // }
             
            ],
          },
          {
            component: './404',
          }
        ],
      },
      {
        component: './user/login/index',
      }
    ],
  }
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  externals: {
    '@antv/data-set': 'DataSet',
    //bizcharts: 'bizCharts',
  },
});
