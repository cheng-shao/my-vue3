<template>
  <el-container :class="className">
    <template v-if="menu && menu.length > 0">
      <wk-side-menu v-if="sideType === 'simple'" :menus="menu">
        <template #header>
          <flexbox v-if="headerObj" class="header-cell">
            <flexbox justify="center" class="header-cell__hd">
              <i :class="headerObj.icon" />
            </flexbox>
            <div class="header-cell__bd">
              <div class="header-cell--label">{{ headerObj.label }}</div>
              <div class="header-cell--des">{{ headerObj.des }}</div>
            </div>
          </flexbox>
        </template>
      </wk-side-menu>

      <sidebar v-else-if="sideType === 'normal'" :items="menu">
        <template #header>
          <flexbox v-if="headerObj" class="header-cell is-normal">
            <flexbox justify="center" class="header-cell__hd">
              <i :class="headerObj.icon" />
            </flexbox>
            <div class="header-cell__bd">
              <div class="header-cell--label text-one-line">
                {{ headerObj.label }}
              </div>
              <div class="header-cell--des text-one-line">
                {{ headerObj.des }}
              </div>
            </div>
          </flexbox>
        </template>
      </sidebar>
    </template>

    <slot />
    <slot name="right" />
  </el-container>
</template>

<script>
import WkSideMenu from './Sidebar/Menu.vue'
import Sidebar from './Sidebar/index.vue'

export default {
  // 容器
  name: 'WkContainer',

  components: {
    WkSideMenu,
    Sidebar
  },

  props: {
    sideType: {
      type: String,
      default: 'simple' // simple 一级简单效果  normal 正常的左侧菜单
    },
    menu: Array,
    headerObj: Object,
    className: String
  },

  data() {
    return {}
  },

  computed: {
    showGuideBtn() {
      const { path } = this.$route
      if (path.includes('crm/')) {
        return true
      }
      return false
    }
  },

  watch: {},

  created() {},

  mounted() {},

  beforeUnmount() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
@import 'style';
</style>
