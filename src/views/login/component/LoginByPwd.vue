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
        ref="userInput"
        v-model.trim="ruleForm.username"
        :disabled="loading"
        placeholder="请输入手机号"
        @keyup.enter="continueClick"
      />
      <show-item
        v-else
        :content="ruleForm.username"
        @click="editClick('username')"
      />
    </el-form-item>
    <el-form-item v-if="passwordShow" label="" prop="password">
      <el-input
        ref="passwordInput"
        v-model.trim="ruleForm.password"
        :type="passwordType"
        placeholder="请输入密码"
        @keyup.enter="continueClick"
      >
        <template #suffix>
          <i
            :style="{ color: passwordType === '' ? '#243858' : '#C1C7D0' }"
            class="wk wk-icon-eye-solid"
            @click="passwordType = passwordType === '' ? 'password' : ''"
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
    <div class="other-login">
      <div class="other-login-or">或</div>
      <el-button type="text" @click="loginClick('loginCode')">
        使用验证码登录
      </el-button>
    </div>
    <div class="other-handle">
      <el-button type="text" @click="loginClick('forgetPwd')">
        忘记密码
      </el-button>
      <span>•</span>
      <el-button type="text" @click="loginClick('register')">
        注册账号
      </el-button>
    </div>
  </el-form>
</template>

<script>
import ShowItem from './ShowItem.vue'

import LoginMixin from './LoginMixin'

export default {
  emits: ['editClick', 'update:username'],
  // 密码登录
  name: 'LoginByPwd',

  components: {
    ShowItem
  },

  mixins: [LoginMixin],

  props: {
    username: String
  },

  data() {
    const validateUsername = (rule, value, callback) => {
      if (!this.loading) {
        callback()
      } else if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        this.loading = true
        adminUserQueryUserNumInfoAPI({
          username: value
        })
          .then((res) => {
            this.loading = false
            res.data === 0 ? callback(new Error('手机号未注册')) : callback()
          })
          .catch(() => {
            this.loading = false
          })
      }
    }

    return {
      loading: false,
      ruleForm: {
        username: '',
        password: ''
      },
      ruleResult: {
        username: {
          validate: false,
          edit: true
        },
        password: {
          validate: false,
          edit: false
        }
      },
      rules: {
        username: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { validator: validateUsername, trigger: '' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ]
      },
      passwordType: 'password'
    }
  },

  computed: {
    passwordShow() {
      return !this.ruleResult.username.edit && this.ruleResult.username.validate
    },
    loginBtnName() {
      return this.passwordShow ? '登录' : '继续'
    }
  },

  watch: {
    ruleForm: {
      handler() {
        this.$nextTick(() => {
          const propField = this.getProps()
          this.changeFormState(propField)
        })
      },
      deep: true
    },

    passwordShow() {
      if (this.passwordShow) {
        this.$nextTick(() => {
          this.$refs.passwordInput.focus()
        })
      }
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
    // 允许进入登录页面  1005 需要完善信息 不能清除登录信息
    if (!window.accessLogin) {
      removeAuth()
    }
    this.debouncedHandleLogin = debounce(300, this.handleLogin)
  },

  mounted() {},

  beforeUnmount() {},

  methods: {
    ...mapActions(useUserStore, ['Login']),
    getProps() {
      const { passwordInput } = this.$refs
      const propField = ['username']
      if (passwordInput) {
        propField.push('password')
      }

      return propField
    },
    /**
     * 继续
     */
    continueClick() {
      this.loading = true
      this.$refs.ruleForm.validate(async (valid) => {
        this.loading = false
        const propField = this.getProps()
        await this.changeFormState(propField)
        if (this.ruleResult.username.validate) {
          if (!this.ruleResult.password.validate) {
            this.ruleResult.username.edit = false
          } else {
            this.loading = true
            // this.$store
            //   .dispatch('Login', this.ruleForm)
            this.Login(this.ruleForm)
              .then((res) => {
                this.loading = false
                const resData = res.data
                // 如果是数组 要区分不同版本登录
                if (isArray(resData)) {
                  this.$emit('toggle', 'multiple', resData, this.ruleForm)
                } else if (resData.hasOwnProperty('companyList')) {
                  this.$emit(
                    'toggle',
                    'multiple',
                    resData.companyList,
                    this.ruleForm
                  )
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
      if (type === 'register') {
        this.correctDomain()
      } else if (type === 'forgetPwd') {
        this.$emit('toggle', 'forgetPwd')
      } else if (type === 'loginCode') {
        this.$emit('toggle', 'loginCode')
      }
    },

    /**
     * 校准地址
     */
    correctDomain() {
      if (process.env.VUE_APP_CORRECT_DOMAIN === '1') {
        window.location.href = WKConfig.registerUrl
      } else {
        this.$router.push('/register')
      }
    },

    /**
     * 编辑
     */
    editClick(prop) {
      this.ruleResult[prop].edit = !this.ruleResult[prop].edit
      this.ruleResult.password.validate = false
      if (prop === 'username' && this.ruleResult[prop].edit) {
        this.$nextTick(() => {
          this.$refs.userInput.focus()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/index.scss';
</style>
