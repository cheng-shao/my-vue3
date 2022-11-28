/** 客户管理路由 */
import Layout from '@/views/layout/CrmLayout.vue'

const layout = function (meta = {}) {
  return {
    path: '/crm',
    component: shallowRef(Layout),
    meta: {
      requiresAuth: true,
      ...meta
    }
  }
}

export const crmRouter = [
  {
    ...layout({
      permissions: ['crm', 'contract']
    }),
    children: [
      {
        path: 'contract', // 合同列表
        component: () => import('@/views/crm/contract/index.vue'),
        meta: {
          title: '合同',
          icon: 'contract-line'
        }
      }
    ]
  },
  {
    ...layout({
      permissionList: [
        ['crm', 'receivables'],
        ['crm', 'receivablesPlan']
      ],
      title: '回款',
      icon: 'receivables-line'
    }),
    children: [
      {
        path: 'receivables/subs/receivables', // 回款
        component: () => import('@/views/crm/receivables/index.vue'),
        permissions: ['crm', 'receivables'],
        meta: {
          title: '回款',
          icon: 'receivables-line'
        }
      },
      {
        path: 'receivables/subs/plan', // 回款计划
        component: () => import('@/views/crm/receivablesPlan/index.vue'),
        permissions: ['crm', 'receivablesPlan'],
        meta: {
          title: '回款计划',
          icon: 'plan'
        }
      }
    ]
  }
]
