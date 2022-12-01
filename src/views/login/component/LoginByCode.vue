<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    label-position="top"
    @submit.prevent
  >
    <div class="form-title">登录您的帐户</div>
    <el-form-item label="" prop="username">
      <el-input
        v-if="ruleResult.username.edit"
        v-model.trim="ruleForm.username"
        placeholder="请输入手机号"
      />
      <show-item
        v-else
        :content="ruleForm.username"
        @click.native="editClick('username')"
      />
    </el-form-item>
    <el-form-item v-if="smscodeShow" label="" prop="smscode">
      <el-input v-model.trim="ruleForm.smscode">
        <template #suffix>
          <verify-button
            ref="verifyButton"
            :disabled="!ruleResult.username"
            @success="verifySuccess"
          />
        </template>
      </el-input>
    </el-form-item>
    <div class="handle-bar">
      <el-button
        :loading="loading"
        :disabled="loading"
        type="primary"
        @click="continueClick"
        >{{ loginBtnName }}</el-button
      >
    </div>
    <div class="other-handle">
      <el-button type="text" @click="loginClick('loginPwd')"
        >使用密码登录</el-button
      >
    </div>
  </el-form>
</template>

<script>
import ShowItem from './ShowItem.vue'
import VerifyButton from '@/components/Verify/Button.vue'

import LoginMixin from './LoginMixin'

export default {
  // 验证码登录
  name: 'LoginByCode',

  emits: ['toggle', 'update:username'],

  components: {
    ShowItem,
    VerifyButton
  },

  mixins: [LoginMixin],

  props: {
    username: String
  },

  data() {
    return {
      loading: false,
      ruleForm: {
        username: '',
        smscode: ''
      },
      ruleResult: {
        username: {
          validate: false,
          edit: true
        },
        smscode: {
          validate: false,
          edit: false
        }
      },
      rules: {
        username: [
          { required: true, message: '手机号不能为空', trigger: 'change' }
        ],
        smscode: [
          { required: true, message: '短信验证码不能为空', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    smscodeShow() {
      return !this.ruleResult.username.edit && this.ruleResult.username.validate
    },

    loginBtnName() {
      return this.smscodeShow ? '登录' : '继续'
    }
  },

  watch: {
    ruleForm: {
      handler() {
        this.changeFormState()
      },
      deep: true
    },

    username: {
      handler() {
        this.ruleForm.username = this.username
      },
      immediate: true
    },

    'ruleForm.username': {
      handler(val) {
        this.$emit('update:username', val)
      }
    }
  },

  created() {
    this.debouncedHandleLogin = debounce(300, this.handleLogin)
  },

  mounted() {},

  beforeUnmount() {},

  methods: {
    /**
     * 继续
     */
    continueClick() {
      this.$refs.ruleForm.validate(async (valid) => {
        await this.changeFormState()

        if (this.ruleResult.username.validate) {
          if (!this.ruleResult.smscode.validate) {
            this.ruleResult.username.edit = false
          } else {
            this.loading = true
            const params = {
              ...this.ruleForm,
              loginType: 2
            }

            this.$store
              .dispatch('Login', params)
              .then((res) => {
                const resData = res.data || {}
                // 如果是数组 要区分不同版本登录
                if (isArray(resData)) {
                  this.$emit('toggle', 'multiple', resData, params)
                } else if (resData.hasOwnProperty('companyList')) {
                  this.loading = false
                  this.$emit('toggle', 'multiple', resData.companyList, params)
                } else {
                  this.$router.push({ path: this.redirect || '/' })
                }
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
        return false
      })
    },

    /**
     * 登录页面点击
     */
    loginClick(type) {
      if (type === 'loginPwd') {
        this.$emit('toggle', 'loginPwd')
      }
    },

    /**
     * 编辑
     */
    editClick(prop) {
      this.ruleResult[prop].edit = !this.ruleResult[prop].edit
      this.ruleResult.smscode.validate = false
    },

    /**
     * @description: 验证成功
     * @param {*} params
     * @return {*}
     */
    verifySuccess(params) {
      // params 返回的二次验证参数
      sendSmsAPI({
        telephone: this.ruleForm.username,
        type: 2,
        ...(params || {})
      })
        .then(() => {
          // 开启倒计时
          this.$refs.verifyButton.startTimer()
        })
        .catch()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/index.scss';
</style>
