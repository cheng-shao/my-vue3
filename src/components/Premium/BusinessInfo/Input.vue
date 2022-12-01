<template>
  <el-autocomplete
    v-model.trim="content"
    v-bind="$attrs"
    :fetch-suggestions="queryCustomerName"
    @select="select"
  />
</template>

<script>
import { crmEnterpriseListAPI } from '@/api/premium/businessInfo'

export default {
  // 工商信息输入框
  name: 'WkBusinessInfoInput',

  components: {},

  inheritAttrs: false,

  props: {
    value: String
  },

  data() {
    return {
      content: '',
      search: '', // 搜索是传的字符串
      businessList: []
    }
  },

  computed: {},

  watch: {
    value: {
      handler() {
        if (this.value !== this.content) {
          this.content = this.value
        }
      },
      immediate: true
    },
    content() {
      if (this.value !== this.content) {
        this.$emit('input', this.content)
      }
    }
  },

  created() {},

  mounted() {},

  beforeUnmount() {},

  methods: {
    /**
     * @description: 客户名称搜索
     * @param {*} queryString 搜索字符串
     * @param {*} cb 结果回调方法
     * @return {*}
     */
    queryCustomerName(queryString, cb) {
      if (queryString !== '') {
        if (this.search !== queryString) {
          this.search = queryString
          crmEnterpriseListAPI(queryString)
            .then((res) => {
              const reaData = res.data || []
              this.businessList = reaData
              cb(reaData)
            })
            .catch(() => {
              cb([])
            })
        } else {
          cb(this.businessList)
        }
      } else {
        cb([])
      }
    },

    /**
     * @description: 下拉选择
     * @param {*} item
     * @return {*}
     */
    select(item) {
      this.search = this.content // 选择之后，不再重复发送请求，校准为一致
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
