<template>
  <el-form ref="ruleForm" label-width="100px" label-position="top">
    <div class="form-title">登录您的帐户</div>
    <multiple-company-select v-model="companyId" :list="list" />
    <div class="handle-bar">
      <el-button
        :loading="loading"
        :disabled="loading || !companyId"
        type="primary"
        @click="continueClick"
        >进入企业</el-button
      >
    </div>
    <div class="other-handle">
      <el-button type="text" @click="loginClick('loginPwd')"
        >返回登录页面</el-button
      >
    </div>
  </el-form>
</template>

<script>
import MultipleCompanySelect from './MultipleCompanySelect.vue'
import LoginMixin from './LoginMixin'

export default {
  // 多企业
  name: 'MultipleCompany',

  components: {
    MultipleCompanySelect
  },

  mixins: [LoginMixin],

  props: {
    list: {
      type: Array,
      default: () => []
    },
    loginParams: Object
  },

  data() {
    return {
      loading: false,
      companyId: ''
    }
  },

  computed: {
    company() {
      return this.list.find((item) => item.companyId === this.companyId)
    }
  },

  watch: {
    list: {
      handler() {
        if (this.list && this.list.length > 0) {
          this.companyId = this.list[0].companyId
        }
      },
      immediate: true
    }
  },

  created() {},

  mounted() {},

  beforeUnmount() {},

  methods: {
    /**
     * 继续
     */
    continueClick() {
      if (this.company) {
        this.loading = true
        this.$store
          .dispatch('Login', {
            ...this.loginParams,
            companyId: this.companyId
          })
          .then((res) => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    /**
     * 登录页面点击
     */
    loginClick(type) {
      if (type === 'loginPwd') {
        this.$emit('toggle', 'loginPwd')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/index.scss';
</style>
