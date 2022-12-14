<template>
  <div
    ref="reference"
    v-elclickoutside="handleClose"
    :class="[
      disabled ? 'is_disabled' : 'is_valid',
      { is_focus: visible },
      { 'is-default': !$slots.reference }
    ]"
    :style="{ height: `${isNaN(height) ? height || 'auto' : `${height}px`}` }"
    wrap="wrap"
    class="wk-user-select xh-form-border"
    @click="containerClick"
  >
    <slot name="reference" />
    <template v-if="!$slots.reference">
      <div ref="tags" class="el-select__tags">
        <span
          v-for="(item, index) in showSelects"
          :key="index"
          :class="{ 'is-hide': item.isHide }"
          class="user-item text-one-line"
          >{{ item[config.label] }}
          <i
            v-if="!item.disabled"
            class="delete-icon el-icon-close"
            @click.stop="deleteuser(item, index)"
          />
        </span>
      </div>
      <i v-if="selects.length > max && max > 0" class="el-icon-more" />
      <i :class="['el-icon-arrow-up']" />
      <div v-if="selects.length == 0" class="user-placeholder text-one-line">
        {{ placeholder }}
      </div>
    </template>

    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy"
    >
      <wk-select-dropdown
        v-show="visible && !disabled"
        ref="popper"
        :append-to-body="popperAppendToBody"
      >
        <el-scrollbar ref="scrollbar" tag="div">
          <wk-user
            v-if="initView"
            v-model="dataValue"
            v-loading="loading"
            :disabled="disabled"
            :options="optionsList"
            :props="config"
            :radio="radio"
            @change="wkUserChange"
            @close="visible = false"
          />
        </el-scrollbar>
      </wk-select-dropdown>
    </transition>
  </div>
</template>

<script>
import WkSelectDropdown from './src/SelectDropdown.vue'
import WkUser from './src/WkUser.vue'

import Emitter from 'element-ui/lib/mixins/emitter'
import { valueEquals } from 'element-ui/lib/utils/util'

const DefaultWkUserSelect = {
  value: 'userId',
  label: 'realname',
  dataType: '', // ????????? value label ???????????? dataType ??????
  // ???????????????????????? ?????? props ??????????????????????????????????????????
  request: null,
  params: null,
  isList: false // ????????????????????????????????????????????????true
}

export default {
  name: 'WkUserSelect',

  components: {
    WkSelectDropdown,
    WkUser
  },

  mixins: [Emitter],

  props: {
    radio: Boolean,
    // ???????????? 0 ??????????????????
    max: {
      type: Number,
      default: 2
    },
    // ???????????? ?????????????????? ?????? props ??????
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    placeholder: {
      type: String,
      default() {
        return '?????????'
      }
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    // ?????????????????? ??????
    request: Function,
    params: Object,
    options: Array,
    disabled: {
      type: Boolean,
      default: false
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      visible: false,
      dataValue: [], // ???????????????
      loading: false,
      height: 34,

      initView: false
    }
  },

  computed: {
    ...mapState(useUserStore, ['userList']),
    // ...mapGetters(['userList', 'hrmUserList']),
    optionsList() {
      if (this.options) {
        return this.options
      }

      // ????????????????????????????????????????????????????????????????????? options
      if (this.config.isList && this.config.request) {
        return null
      }

      if (this.config.dataType === 'manage') {
        return this.userList
      } else if (this.config.dataType === 'hrm') {
        return null // ?????????????????????????????????????????????
      }
      return null
    },
    // ?????????????????????
    showSelects() {
      if (
        this.max &&
        this.max > 0 &&
        this.selects &&
        this.selects.length > this.max
      ) {
        return this.selects.slice(0, this.max)
      }
      return this.selects
    },

    // ???????????????
    selects() {
      let optionsList = []
      if (this.config.dataType === 'manage') {
        optionsList = this.userList
      } else if (this.config.dataType === 'hrm') {
        optionsList = this.hrmUserList
      }

      return optionsList.filter((item) =>
        this.dataValue.includes(item[this.config.value])
      )
    },

    // ?????? props
    config() {
      const props = merge({ ...DefaultWkUserSelect }, this.props || {})
      if (this.request) {
        props.request = this.request
      }

      if (isEmpty(props.dataType)) {
        if (props.value === 'userId') {
          props.dataType = 'manage'
        } else if (props.value === 'employeeId') {
          props.dataType = 'hrm'
        }
      }

      if (this.params) {
        props.params = this.params
      }
      return props
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.broadcast('WkSelectDropdown', 'destroyPopper')
      } else {
        this.broadcast('WkSelectDropdown', 'updatePopper')
      }
      this.$emit('visible-change', val)
    },

    value(newVal, oldVal) {
      this.verifyValue()
    },

    props: {
      handler() {
        this.requestUserList()
      },
      immediate: true
    },

    /**
     * ?????????
     */
    dataValue() {
      if (this.radio) {
        this.$emit(
          'input',
          this.dataValue && this.dataValue.length ? this.dataValue[0] : ''
        )
      } else {
        this.$emit('input', this.dataValue)
      }
    },

    showSelects: {
      handler() {
        this.resetHeight()
      },
      immediate: true
    }
  },

  created() {
    this.verifyValue()
  },

  methods: {
    resetHeight() {
      const tags = this.$refs.tags
      if (tags) {
        this.$nextTick(() => {
          this.height = tags.clientHeight > 34 ? tags.clientHeight + 6 : 34
        })
      } else {
        this.height = 34
      }
    },

    /**
     * ???????????????
     */
    verifyValue() {
      // ?????????????????? ???????????????  ???????????????number
      if (!this.radio && !Array.isArray(this.value)) {
        this.$emit('input', [])
      }

      if (
        this.radio &&
        (Array.isArray(this.value) ||
          this.value === null ||
          this.value === undefined)
      ) {
        this.$emit('input', '')
      }

      if (this.radio) {
        if (this.value !== this.dataValue) {
          if (!isEmpty(this.value)) {
            this.dataValue = [this.value]
          } else {
            this.dataValue = []
          }
        }
      } else {
        if (!valueEquals(this.value, this.dataValue)) {
          if (this.value && this.value.length) {
            const firstItem = this.value[0]
            if (firstItem[this.config.value]) {
              this.dataValue = this.value.map((item) => item[this.config.value])
            } else {
              this.dataValue = objDeepCopy(this.value)
            }
          } else {
            this.dataValue = []
          }
        }
      }
    },

    /**
     * ????????????
     */
    requestUserList() {
      if (this.config.dataType === 'manage') {
        // ??????????????????????????????id???????????????
        store.dispatch('debounceGetUserList')
      } else if (this.config.dataType === 'hrm') {
        store.dispatch('debounceGetHrmUserList')
      }
    },

    handleClose() {
      this.visible = false
    },

    handleMenuEnter() {
      // ???????????????????????????
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },

    /**
     * ??????
     */
    deleteuser(item) {
      if (!item.disabled && !this.disabled) {
        for (let index = 0; index < this.dataValue.length; index++) {
          const id = this.dataValue[index]
          if (id == item[this.config.value]) {
            this.dataValue.splice(index, 1)
            // this.$emit('change', this.dataValue, this.selects)
            this.wkUserChange()
            break
          }
        }
      }
    },

    /**
     * ????????????
     */
    focusClick() {
      this.$emit('focus')
    },

    /**
     * chang ??????
     */
    wkUserChange() {
      this.$nextTick(() => {
        if (this.radio) {
          this.dispatch(
            'ElFormItem',
            'el.form.change',
            this.dataValue && this.dataValue.length > 0 ? this.dataValue[0] : ''
          )
        } else {
          this.dispatch('ElFormItem', 'el.form.change', this.dataValue)
        }
      })
      this.$emit('change', this.dataValue, this.selects)
    },

    containerClick() {
      if (!this.disabled) {
        this.initView = true
        this.visible = !this.visible
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wk-user-select {
  cursor: pointer;

  &.is-default {
    // display: inline-block;
    position: relative;
    width: 180px;
    height: $--input-height;
    padding: 0 20px 0 5px;
    font-size: $--font-size-base;
    color: $--form-field-default-text-color;
    background-color: $--input-background-color;
    border: $--border-medium;
    border-radius: $--border-radius-base;
  }

  .user-item {
    position: relative;
    max-width: 80px;
    padding: 2px 15px 2px 5px;
    margin: 3px;
    background-color: #f3f7ff;
    border-radius: $--border-radius-base;

    &.is-hide {
      color: $--color-text-secondary;
      background-color: #f2f2f2;
    }
  }

  .user-placeholder {
    font-weight: $--font-weight-primary;
    line-height: $--input-height;
    color: $--input-placeholder-color;
    cursor: pointer;
    user-select: none;
  }

  .delete-icon {
    position: absolute;
    top: 6px;
    right: 2px;
    color: $--color-text-secondary;
    cursor: pointer;

    &:hover {
      color: $--color-primary;
    }
  }

  &:hover {
    color: $--form-field-hover-text-color;
    background-color: $--form-field-hover-bg-color;
    border-color: $--form-field-hover-border-color;
  }
}

.wk-user-select.is_disabled {
  cursor: not-allowed;
  background-color: #f5f7fa;
  border-color: #e4e7ed;

  .user-item {
    color: #c0c4cc;
    cursor: not-allowed;
    background-color: #f0f4f8ea;
  }

  .delete-icon {
    color: #c0c4cc;
    cursor: not-allowed;
  }

  .user-placeholder {
    color: #c0c4cc;
    cursor: not-allowed;
  }
}

.wk-user-select.is_valid:hover {
  border-color: #c0c4cc;
}

.wk-user-select.is_focus {
  border-color: $--color-primary !important;
}

.el-select__tags {
  padding-right: 30px;
}

.el-icon-more {
  position: absolute;
  top: 2px;
  right: 20px;
  padding: 6px 10px;
  font-size: 12px;
  color: $--color-text-regular;
  background-color: #f3f7ff;
  border-radius: $--border-radius-base;

  &:hover {
    color: white;
    background-color: $--color-primary;
  }
}

.el-icon-arrow-up {
  position: absolute;
  top: calc(50% - 7px);
  right: 5px;
  font-weight: bold;
  color: $--input-icon-color;
  cursor: pointer;
  transition: transform 0.3s;
  transform: rotate(180deg);
}

.el-icon-arrow-up.is-reverse {
  transform: rotate(0deg);
}
</style>
