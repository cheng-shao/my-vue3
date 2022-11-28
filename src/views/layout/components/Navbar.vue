<template>
  <div class="navbar">
    <flexbox style="width: auto">
      <el-popover
        v-if="dropMenus && dropMenus.length > 0"
        placement="bottom"
        width="320"
        trigger="click"
        popper-class="no-padding-popover"
      >
        <div class="drop-wrap">
          <div class="drop-wrap__section">
            <div class="drop-wrap__title">切换到</div>
            <div class="drop-wrap__content">
              <flexbox
                v-for="(item, index) in dropMenus"
                :key="index"
                class="drop-cell is-interval"
                :class="[currentModule === item.module ? 'is-select' : '']"
                @click="dropClick(item)"
              >
                <flexbox class="drop-cell__hd" justify="center">
                  <i :class="item.icon" />
                </flexbox>
                <div class="drop-cell__bd">
                  <div>{{ item.title }}</div>
                  <div class="des">{{ item.des }}</div>
                </div>
              </flexbox>
            </div>
          </div>
        </div>
        <template #reference>
          <!-- <el-button class="more" type="bg-icon" circle> -->
          <el-button class="more" circle>
            <i class="wk wk-grid" />
          </el-button>
        </template>
      </el-popover>
      <img :key="getLogo" v-src="getLogo" class="logo" @click="enterMainPage" />
      <div v-if="title" class="title">{{ title }}</div>
      <div class="menus">
        <el-tabs
          v-model="menuTab"
          class="header-menu"
          @tab-click="navItemsClick"
        >
          <el-tab-pane
            v-for="(item, index) in menus"
            :key="index"
            :index="item.path"
            :name="item.path"
            :label="item.label"
          >
            <!-- <i :style="{ fontSize: item.fontSize }" :class="item.icon" /> -->
            <template #label>
              <router-link class="router-link" :to="{ path: item.fullPath }">
                <span class="label">{{ item.label }}</span> </router-link
              ><span
                v-if="item.num"
                type="primary"
                class="el-badge__content el-badge__content--undefined"
                >{{ item.num }}</span
              >
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <slot name="left" />
    </flexbox>

    <flexbox style="width: auto">
      <div class="log-menus">
        <el-tooltip
          v-for="(item, index) in logMenus"
          :key="index"
          :content="item.label"
          effect="dark"
          placement="bottom"
        >
          <el-button
            :class="{ 'is-current': $route.path.includes(item.type) }"
            type="bg-icon"
            circle
            @click="logClick(item)"
          >
            <i :class="item.icon" />
          </el-button>
        </el-tooltip>
      </div>

      <!-- <el-badge
        :value="unreadNums.announceCount"
        :hidden="!unreadNums.announceCount || unreadNums.announceCount == 0"
        :max="99"
        type="primary">
        <el-button type="bg-icon" circle @click="checkMessageDetail(true)">
          <i class="wk wk-announcement" />
        </el-button>
      </el-badge> -->
      <el-tooltip content="通知/待办" effect="dark" placement="bottom">
        <el-badge
          class="nav-badge"
          :value="messageCount"
          :hidden="messageCount === 0"
          :max="99"
          type="primary"
        >
          <!-- <el-button type="bg-icon" circle @click="checkMessageDetail(false)"> -->
          <el-button circle @click="checkMessageDetail(false)">
            <i class="wk wk-bell" />
          </el-button>
        </el-badge>
      </el-tooltip>

      <el-tooltip content="帮助" effect="dark" placement="bottom">
        <!-- <el-button type="bg-icon" circle @click="enterHelp"> -->
        <el-button circle @click="enterHelp">
          <i class="wk wk-help" />
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="manage"
        content="系统设置"
        effect="dark"
        placement="bottom"
      >
        <!-- type="bg-icon" -->

        <el-button style="margin-left: 0" circle @click="enterSystemSet">
          <i class="wk wk-manage" />
        </el-button>
      </el-tooltip>

      <!-- <system-message
        :visible.sync="sysMessageShow"
        :unread-nums="unreadNums"
        :only-announcement="mesOnlyAnnouncement"
        @update-count="sendSystemUnreadNum" /> -->
      <!-- <messages
        v-if="sysMessageShow"
        :unread-nums="unreadNums"
        @close="sysMessageShow = false"
        @update-unread="sendSystemUnreadNum"
      /> -->

      <el-dropdown
        trigger="click"
        style="margin-left: 6px"
        @command="moreMenuClick"
      >
        <!-- v-if="userInfo && Object.keys(userInfo).length > 0" -->
        <xr-avatar
          disabled
          :name="userInfo.realname"
          :size="24"
          :src="userInfo.img"
        />

        <!-- <i class="el-icon-caret-bottom mark" /> -->
        <template #dropdown>
          <el-dropdown-menu class="el-dropdown-unarrow">
            <el-dropdown-item
              v-for="(item, index) in moreMenu"
              :key="index"
              :command="item.command"
              :divided="item.divided"
              :disabled="item.disabled"
              style="white-space: nowrap"
            >
              <i :class="item.icon"></i>
              {{ item.label }}
            </el-dropdown-item>
            <!-- <div v-if="manage" class="handel-box">
              <el-button
                type="primary"
                class="handel-button"
                @click="enterSystemSet()"
                >企业管理后台</el-button
              >
            </div> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </flexbox>
    <!-- 帮助中心 -->
    <help-side
      v-if="helpSideShow"
      :props="helpSideProps"
      @close="helpSideShow = false"
    />

    <!-- 增值服务 -->
    <appreciation-side
      v-if="appreciationSideShow"
      :props="appSideProps"
      @close="appreciationSideShow = false"
    />
  </div>
</template>

<script>
// import Messages from './Messages.vue'
import HelpSide from './Help/HelpSide.vue'
import AppreciationSide from './Appreciation/AppreciationSide.vue'

import { getNavMenus } from './utils'

const emitter = mitt()

export default {
  emits: ['select'],
  filters: {
    langName: function (value) {
      if (value) {
        return { cn: '中文', en: 'English' }[value]
      } else {
        return '中文'
      }
    }
  },
  components: {
    // Messages,
    HelpSide,
    AppreciationSide
  },
  props: {
    title: String,
    menus: Array // 中间菜单数据
  },
  data() {
    return {
      unreadNums: {
        allCount: 0,
        announceCount: 0,
        crmCount: 0,
        examineCount: 0,
        eventCount: 0,
        logCount: 0,
        taskCount: 0
      },
      mesOnlyAnnouncement: false,
      sysMessageShow: false,
      intervalId: null,
      menuTab: '',
      helpSideProps: null,
      appSideProps: null,
      helpSideShow: false, // 帮助中心
      appreciationSideShow: false // 增值服务
    }
  },
  computed: {
    ...mapState(useUserStore, [
      'userInfo',
      'crm',
      'bi',
      'manage',
      'oa',
      'project',
      'email',
      'knowledge',
      'hrm',
      'jxc',
      'finance'
    ]),

    ...mapState(useAppStore, [
      'getApp',
      'getLogo',
      'lang',
      'moduleAuth',
      'moduleData'
    ]),

    ...mapState(usePermissionStore, ['oaRouters']),

    ...mapState(useCrmStore, ['messageNum']),
    // ...mapGetters([
    //   'hrmUserInfo',
    // ]),
    // 通知 + 代办事项总数量
    messageCount() {
      return (this.messageNum.totalNum || 0) + (this.unreadNums.allCount || 0)
    },
    moreMenu() {
      const temps = [
        {
          command: 'baseInfo',
          divided: false,
          label: '基本信息',
          icon: 'wk wk-user'
        }
      ]
      if (this.userInfo && this.userInfo.isAdmin) {
        temps.push({
          command: 'myOrder',
          divided: false,
          label: '订单管理',
          icon: 'wk wk-icon-shop-cart'
        })
      }
      temps.push({
        command: 'recommended',
        divided: false,
        label: '推荐悟空云',
        icon: 'wk wk-good'
      })

      return temps.concat([
        {
          command: 'logOut',
          divided: false,
          label: '退出登录',
          icon: 'wk wk-logout'
        },
        {
          command: 'version',
          divided: false,
          label: `版本 ${WKConfig.version}`,
          icon: 'wk wk-version',
          disabled: true
        }
      ])
    },
    //  左侧下拉数据
    dropMenus() {
      const allList = []
      for (const key in this.allItemsObj) {
        allList.push(this.allItemsObj[key])
      }
      return allList
    },
    allItemsObj() {
      const tempsItems = {}

      tempsItems.crm = {
        title: 'CRM',
        des: '客户关系管理系统',
        type: 1,
        module: 'crm',
        path: '/crm',
        icon: 'wk wk-customer',
        fontSize: '17px'
      }

      return tempsItems
    },

    /**
     * 日志菜单
     */
    logMenus() {
      const temps = []

      return temps
    },

    logLeftMenus() {
      return getNavMenus(this.oaRouters || [], '/oa')
    },

    // 获取当前模块关键字
    currentModule() {
      const { path, query } = this.$route
      let module = query.module
      if (!module) {
        const paths = path.split('/')
        paths.forEach((o) => {
          if (o && !module) {
            module = o
          }
        })
      }
      module = module ? module.toLowerCase() : ''
      const vilidModules = this.dropMenus.map((item) => item.module)
      if (!vilidModules.includes(module)) {
        module = ''
      }
      return module
    }
  },
  watch: {
    $route: {
      handler(val) {
        const { path, query } = this.$route

        // 子菜单逻辑 解决这部分之前的 当做菜单
        if (path.includes('/subs/')) {
          this.menuTab = path.split('/subs/')[0]
        } else {
          this.menuTab = path
        }

        // 有些多个地方对应一个位置 query 里传入 navActiveMenu
        if (query && query.navActiveMenu) {
          this.menuTab = query.navActiveMenu
        }

        if (this.menus) {
          const isOa = path.includes('/oa')
          const menu = (isOa ? this.logLeftMenus : this.menus).find(
            (item) => item.path === this.menuTab
          )
          menu && this.$emit('select', menu, isOa)
        }
      },
      immediate: true
    }
  },
  created() {
    // this.menuTab = this.menus[0].path
    // this.$store.dispatch('QueryMarketing')
  },

  mounted() {
    on(document, 'mousedown', this.handleDocumentClick)

    // 消息数
    this.getSystemUnreadNum('visible')

    emitter.on('document-visibility', (state) => {
      this.getSystemUnreadNum(state)
    })
  },
  beforeUnmount() {
    emitter.off('document-visibility')
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    off(document, 'mousedown', this.handleDocumentClick)
  },
  methods: {
    ...mapActions(useUserStore, ['LogOut']),
    navItemsClick(tab) {
      const menu = this.menus[parseInt(tab.index)]
      this.$router.push(menu.fullPath)
    },

    /**
     * 验证页面进入信息
     */
    validateEnterData(type) {
      return new Promise((resolve) => {
        if (type.includes('hrm')) {
          if (this.hrm) {
            if (this.hrmUserInfo) {
              resolve(true)
            } else {
              // this.$store.commit('CLEAR_CANCELTOKENARR') // 取消之前的请求，保证切换的流畅

              this.$store
                .dispatch('GetHrmUserInfo')
                .then(() => {
                  resolve(true)
                })
                .catch(() => {
                  resolve(false)
                })
            }
          } else {
            this.$router.push({
              name: 'hrmTips'
            })
            resolve(false)
          }
        } else {
          resolve(true)
        }
      })
    },

    enterSystemSet() {
      this.$router.push({
        name: 'manage'
      })
    },
    switchLang(item) {
      this.$store.commit('SET_LANG', item.lang)
      this.langName = item.name
    },

    /**
     * 获取系统未读消息数
     */
    getSystemUnreadNum(state) {
      // if (this.intervalId) {
      //   clearInterval(this.intervalId)
      //   this.intervalId = null
      // }
      // if (state == 'visible') {
      //   this.sendSystemUnreadNum()
      //   this.intervalId = setInterval(() => {
      //     this.sendSystemUnreadNum()
      //   }, 600000)
      // }
    },

    sendSystemUnreadNum() {
      systemMessageUnreadCountAPI()
        .then((res) => {
          this.unreadNums = res.data
        })
        .catch(() => {
          if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
          }
        })
    },

    /**
     * 有客户权限点击logo 进入仪表盘
     */
    enterMainPage() {
      this.$router.push('/')
    },

    moreMenuClick(command) {
      if (command == 'baseInfo') {
        const time = Date.parse(new Date())
        this.$router.push({
          name: 'person',
          query: {
            selectedIndex: 0,
            time
          }
        })
      } else if (command == 'myOrder') {
        const time = Date.parse(new Date())
        this.$router.push({
          name: 'person',
          query: {
            selectedIndex: 2,
            time
          }
        })
      } else if (command == 'recommended') {
        const time = Date.parse(new Date())
        this.$router.push({
          name: 'person',
          query: {
            selectedIndex: 3,
            time
          }
        })
      } else if (command == 'logOut') {
        ElMessageBox.confirm('退出登录？', 'Warning', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = ElLoading.service({
              target: document.getElementById('#app')
            })
            this.LogOut()
              .then(() => {
                loading.close()
                location.reload()
              })
              .catch(() => {
                loading.close()
                location.reload()
              })
          })
          .catch(() => {})
      }
    },

    /**
     * 控制导航管理隐藏
     */
    handleDocumentClick(e) {
      if (typeof e.target.className !== 'string') return

      if (e.target.className.includes('wk-icon-fill-help')) {
        const type = e.target.dataset.type
        const id = e.target.dataset.id
        if (type && id) {
          this.helpSideProps = {
            menuIndex: 'Question',
            type: parseInt(type),
            id: parseInt(id)
          }
          this.helpSideShow = true
        }
      }
      if (e.target.className.includes('wk-premium-info')) {
        const type = e.target.dataset.type
        const force = e.target.dataset.force // 如果等于1 强制查看
        if (type) {
          // 如果已经开启不查看简介 也就是数量大于0
          if (type === 'BusinessInformation' && force !== '1') {
            const enterprise = this.moduleData.find(
              (item) => item.module === 'enterprise'
            )
            if (enterprise.number > 0) {
              return
            }
          }

          this.appSideProps = {
            type
          }
          this.appreciationSideShow = true
        }
      }
    },

    /**
     * 查看消息详情
     */
    checkMessageDetail(onlyAnnouncement) {
      this.mesOnlyAnnouncement = onlyAnnouncement
      this.sysMessageShow = true
    },

    /**
     * 模块切换
     */
    dropClick(item) {
      this.validateEnterData(item.path).then((result) => {
        if (result) {
          this.$router.push(item.path)
        }
      })
    },

    /**
     * 日志点击
     */
    logClick(item) {
      let module = ''
      const { path, query } = this.$route
      // 获取path中的模块关键词 一般是第一个
      if (path) {
        const paths = path.split('/')
        paths.forEach((o) => {
          if (o && !module) {
            module = o
          }
        })
      }

      if (module === 'oa') {
        module = query.module ? query.module : this.getAuthModule()
      } else if (!module) {
        module = this.getAuthModule()
      }

      let nextPath = `${item.path}?module=${module}`
      if (module === 'hrm') {
        // 区分是管理还是员工
        // 1 管理 2 员工
        const role =
          query.module === 'hrm' && query.role
            ? query.role
            : this.$route.fullPath.includes('self-server')
            ? '2'
            : '1'
        nextPath = `${nextPath}&role=${['1', '2'].includes(role) ? role : '1'}`
      }

      this.$router.push(nextPath)
    },

    /**
     * 获取有权限的模块
     */
    getAuthModule() {
      if (this.crm) {
        return 'crm'
      } else if (this.moduleAuth && this.moduleAuth.hrm) {
        return 'hrm'
      } else if (
        this.moduleAuth &&
        this.moduleAuth.finance &&
        this.finance &&
        !isEmpty(this.finance)
      ) {
        return 'finance'
      } else if (this.oa) {
        return 'oa'
      } else if (this.knowledge) {
        return 'knowledge'
      } else if (this.jxc) {
        return 'jxc'
      }
      return ''
    },

    /**
     * 展示help
     */
    enterHelp() {
      this.helpSideProps = null
      this.helpSideShow = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.header-menu {
  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__item {
    height: 56px;
    padding: 0 12px !important;
    line-height: 56px;

    .router-link {
      display: inline-block;
      user-select: none;
    }

    .label {
      position: relative;

      &:hover {
        color: $--color-primary;
      }
    }

    .label:hover::before {
      position: absolute;
      top: -4px;
      right: -4px;
      bottom: -4px;
      left: -4px;
      z-index: -1;
      content: '';
      background-color: $--color-b50;
      border-radius: $--border-radius-base;
    }
  }

  .el-tabs__active-bar {
    height: 3px;
  }

  .el-button--bg-text {
    padding-right: 4px;
    padding-left: 4px;
    font-weight: bold;

    [class^='el-icon-'] {
      margin-left: 2px;
      font-size: 12px;
      font-weight: bold;
      color: #97a0ae;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'style';

.navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 12px;
  background-color: white;

  .more + .logo {
    margin-left: 8px;
  }

  .logo {
    display: block;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-left: $--interval-base;
    cursor: pointer;
    background-color: white;
  }

  .title {
    margin-right: 20px;
    margin-left: 8px;
    font-size: 18px;
    color: $--color-n600;
  }

  .menus {
  }

  // 模块切换图标
  .wk-grid {
    font-size: 16px;
  }

  .xr-avatar {
    cursor: pointer;
  }

  // .is-circle-bg {
  //   cursor: pointer;
  //   &:hover::before {
  //     left: -4px;
  //     right: -3px;
  //     top: -4px;
  //     bottom: -3px;
  //     border-radius: 16px;
  //     width: 32px;
  //     height: 32px;
  //   }
  // }
  // .user-container {
  //   display: flex;
  //   align-items: center;
  //   flex-shrink: 0;
  //   cursor: pointer;
  // .user-img {
  //   margin-right: 8px;
  // }
  // .mark {
  //   font-size: 15px;
  //   color: $--color-text-secondary;
  // }
  // }

  // .user-container:hover {
  //   .mark {
  //     color: #2486e4;
  //   }
  // }
}

// 菜单
// .el-menu {
//   overflow: hidden;

//   /deep/ .el-submenu__icon-arrow {
//     display: none;
//   }

//   /deep/ .el-submenu {
//     .el-submenu__title {
//       i {
//         color: #5c6075;
//       }
//     }
//   }

//   /deep/ .el-submenu.is-active {
//     .el-submenu__title {
//       i {
//         color: $--color-primary;
//       }
//     }
//   }
// }

// .el-menu.el-menu--horizontal {
//   border-bottom: none;
// }

// .el-menu-item {
//   padding: 0;
//   margin: 0 20px;
//   font-size: 16px;
//   font-weight: 500;
//   color: #2a304d;
//   i {
//     color: #5c6075;
//   }
// }

// .el-menu-item:hover {
//   i {
//     color: $--color-primary;
//   }
// }

// .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
//   color: $--color-primary;
// }

// .el-menu-item.is-active {
//   border-width: 3px;
//   i {
//     color: $--color-primary;
//   }
// }

// 右侧操作
.handel-box {
  padding: 0 15px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;

  .handel-button {
    width: 100%;
    background-color: #2362fb;
    border-color: #2362fb;
    border-radius: $--border-radius-base;
  }
}

.hr-top {
  padding-top: 3px;
  margin-top: 8px;
  border-top: 1px solid #f4f4f4;
}

// .nav-lang {
//   cursor: pointer;
//   color: #888;
//   padding: 20px;
//   &:hover {
//     color: #2362fb;
//   }
//   &.active {
//     font-weight: bold;
//     color: #2362fb;
//   }
// }

// 系统消息
.wk-icon-gift,
.wk-announcement,
.wk-bell {
  font-size: 20px;
}

.el-badge {
  margin-right: 4px;
}

.wk-announcement:hover,
.wk-bell:hover {
  color: $--color-primary;
}

.el-dropdown-menu {
  :deep(.popper__arrow) {
    display: none;
  }
}

:deep(.nav-badge) {
  .el-badge__content.is-fixed {
    top: 8px;
    right: 18px;
  }
}

.el-button.is-circle {
  padding: 6px;
  border: none;

  i {
    font-size: 20px;
  }

  &:hover {
    background-color: rgba($color: $--color-b50, $alpha: 0.9);
  }
}

.log-menus {
  position: relative;
  flex-shrink: 0;
  padding-right: $--interval-base;
  margin-right: $--interval-base;

  &::after {
    position: absolute;
    top: 6px;
    right: 0;
    bottom: 6px;
    width: 1px;
    content: ' ';
    background-color: $--border-color-base;
  }
}

.el-button.is-current {
  color: $--color-primary;
  background-color: rgba(222, 235, 255, 0.9);
}

// .top-btn {
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-start;
//   align-items: center;
//   color: $--color-primary;
//   .gift {
//     color: $--color-primary;
//     margin-right: 5px;
//   }
// }
</style>
