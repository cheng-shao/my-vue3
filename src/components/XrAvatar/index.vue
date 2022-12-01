<template>
  <div>
    <el-popover
      v-if="id"
      :key="src"
      v-model:visible="popoverShow"
      :visible-arrow="false"
      :trigger="trigger"
      :disabled="popoverDisabled"
      class="xr-avatar"
      placement="bottom"
      width="250"
      popper-class="no-padding-popover"
    >
      <!-- <div v-loading="loading"> -->
      <xr-user-view
        v-loading="loading"
        :data="userData"
        :src="imageCache[src] || defaultHead"
      />
      <!-- </div> -->
      <template #reference>
        <el-avatar
          :key="src"
          v-bind="$attrs"
          :src="imageCache[src] || defaultHead"
          :style="{ fontSize: fontSize, background: background }"
          :class="{ 'cursor-pointer': !disabled }"
          :size="size"
          fit="fill"
        />
      </template>
    </el-popover>

    <el-popover
      v-else-if="previewType && !disabled"
      :key="src + 'two'"
      placement="bottom"
      class="xr-avatar"
      width="196px"
      popper-class="no-padding-popover"
      :trigger="trigger"
    >
      <el-image
        style="width: 180px; height: 180px; padding: 8px"
        :src="imageCache[src] || defaultHead"
        fit="fill"
      />
      <template #reference>
        <el-avatar
          :key="src"
          v-bind="$attrs"
          :src="imageCache[src] || defaultHead"
          :style="{ fontSize: fontSize, background: background }"
          :class="{ 'cursor-pointer': !disabled }"
          :size="size"
          class="xr-avatar"
          fit="fill"
        />
      </template>
    </el-popover>

    <el-tooltip
      v-else
      class="xr-avatar"
      :content="name"
      effect="dark"
      placement="top"
    >
      <el-avatar
        :key="src"
        v-bind="$attrs"
        :src="imageCache[src] || defaultHead"
        :style="{ fontSize: fontSize, background: background }"
        :class="{ 'cursor-pointer': !disabled }"
        :size="size"
        class="xr-avatar"
        fit="fill"
      />
    </el-tooltip>
  </div>
</template>

<script>
// import XRTheme from '@/styles/xr-theme.scss'
import headImg from '@/assets/img/head.png'

export default {
  // Avatar 头像
  name: 'XrAvatar',
  components: {
    XrUserView: defineAsyncComponent(() => import('../XrUserView/index.vue'))
  },
  inheritAttrs: false,
  props: {
    name: String,
    id: [Number, String],
    size: {
      type: [Number, String],
      default: 38
    },
    src: String,
    previewType: {
      type: Boolean,
      default: true
    }, // 如果是预览
    disabled: {
      type: Boolean,
      default: false
    }, // 仅看文字
    trigger: {
      type: String,
      default: 'click'
    },
    background: {
      type: String,
      // default: XRTheme.colorPrimary
      default: ''
    }
  },
  data() {
    return {
      popoverShow: false,
      loading: false,
      userData: null,
      defaultHead: headImg
    }
  },
  computed: {
    ...mapState(useAppStore, ['imageCache']),

    fontSize() {
      if (this.size <= 30) {
        return '12px'
      }
      return '14px'
    },

    showName() {
      return this.name && this.name.length > 2 ? this.name.slice(-2) : this.name
    },

    popoverDisabled() {
      if (this.disabled) {
        return true
      }

      return !this.id
    }
  },
  watch: {
    popoverShow(val) {
      if (!this.userData) {
        this.getUserData()
      }
    },
    src: {
      handler() {
        this.handleImage()
      },
      immediate: true
    }
  },
  created() {},

  beforeUnmount() {},
  methods: {
    ...mapActions(useAppStore, ['SET_IMAGECACHE']),

    handleImage() {
      if (this.src) {
        if (!this.imageCache.hasOwnProperty(this.src)) {
          this.$set(this.imageCache, this.src, '')
          this.SET_IMAGECACHE(this.imageCache)
          if (this.src.startsWith('data:')) return
          getImageData(this.src)
            .then((data) => {
              this.$set(this.imageCache, this.src, data.src)
              this.SET_IMAGECACHE(this.imageCache)
            })
            .catch(() => {
              delete this.imageCache[this.src]
              this.SET_IMAGECACHE(this.imageCache)
            })
        }
      }
    },

    getUserData() {
      systemUserInfoAPI({
        userId: this.id
      })
        .then((res) => {
          this.userData = res.data
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.el-avatar {
  :deep(img) {
    width: 100%;
    background: white !important;
  }
}
</style>
