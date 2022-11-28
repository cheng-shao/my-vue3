<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        v-if="menus && menus.length > 0"
        :menus="menus"
        title="CRM"
        @select="menuSelect"
      >
      </navbar>
    </el-header>

    <wk-container :menu="sideMenus" :header-obj="headerCellObj">
      <el-main id="crm-main-container" style="padding: 0">
        <app-main />
      </el-main>
    </wk-container>
  </el-container>
</template>

<script>
// import { Navbar, AppMain } from './components/index'
// import Navbar from './components/Navbar.vue'
// import AppMain from './components/AppMain.vue'
// import WkContainer from './components/WkContainer.vue'

import { getNavMenus } from './components/utils'
import path from 'path-browserify'

export default {
  name: 'CrmLayout',

  components: {
    // Navbar,
    // AppMain,
    // CRMAllCreate,
    // WkContainer
  },

  data() {
    return {
      isCreate: false,
      createAction: null,
      createCRMType: '',
      sideChildRouter: null, // 包含child的路由对象
      sideMenus: []
    }
  },

  computed: {
    ...mapState(useUserStore, ['crm']),
    ...mapState(usePermissionStore, ['crmRouters']),

    menus() {
      return getNavMenus(this.crmRouters || [], '/crm')
    },
    headerCellObj() {
      const { path } = this.$route

      if (path.includes('customer')) {
        return {
          icon: 'wk wk-customer',
          label: '客户',
          des: '客户管理'
        }
      } else if (path.includes('receivables')) {
        return {
          icon: 'wk wk-receivables',
          label: '回款',
          des: '回款管理'
        }
      } else if (path.includes('message')) {
        return {
          icon: 'wk wk-todo-solid',
          label: '待办事项',
          des: '待办事项管理'
        }
      }
      return null
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    /**
     * 菜单选择
     */
    menuSelect(menu) {
      const router = this.crmRouters[menu.index]
      if (router && router.children && router.children.length > 1) {
        this.sideChildRouter = router
        this.sideMenus = this.getSideMenus(router.path, router.children)
      } else {
        this.sideChildRouter = null
        this.sideMenus = []
      }
    },

    /**
     * 获取siderMenus
     */
    getSideMenus(mainPath, children) {
      const sideMenus = []
      children.forEach((item) => {
        let auth = true
        if (item.permissions) {
          auth = this.$auth(item.permissions.join('.'))
        }
        if (!item.hidden && auth) {
          sideMenus.push({
            ...item,
            path: path.resolve(mainPath, item.path)
          })
        }
      })
      return sideMenus
    },

    navClick(index) {},

    addSkip(item) {
      this.createAction = {
        type: 'save',
        id: '',
        data: {}
      }
      this.createCRMType = item.index
      this.isCreate = true
    },

    /**
     * 新建客户同时新建联系人
     */
    createSaveSuccess(data) {
      if (data && data.createContacts) {
        if (data.type == 'customer') {
          this.createCRMType = 'contacts'
          this.createAction = {
            type: 'relative',
            crmType: 'customer',
            data: {
              customer: data.data
            }
          }
          this.isCreate = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/style';
@import './styles/common.scss';

.el-container {
  height: 100%;
  min-height: 0;
}

.nav-container {
  min-width: 1200px;
  padding: 0;
  box-shadow: 0 1px 2px #dbdbdb;
}

// 公共新建按钮
.common-create-btn {
  margin-left: #{$--interval-base * 2};
}
</style>
