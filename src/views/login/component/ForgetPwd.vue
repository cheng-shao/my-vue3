<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    label-width="100px"
    label-position="top"
    @submit.prevent
  >
    <div class="form-title">重置您的帐户密码</div>
    <el-form-item label="" prop="phone">
      <el-input
        v-if="ruleResult.phone.edit"
        v-model.trim="ruleForm.phone"
        placeholder="请输入手机号"
        @keyup.enter="continueClick"
      />
      <show-item
        v-else
        :content="ruleForm.phone"
        @click.native="editClick('phone')"
      />
    </el-form-item>
    <el-form-item v-if="smscodeShow" label="" prop="smscode">
      <el-input v-model.trim="ruleForm.smscode">
        <template #suffix>
          <verify-button
            ref="verifyButton"
            :disabled="!ruleResult.phone"
            @success="verifySuccess"
          />
        </template>
      </el-input>
    </el-form-item>
    <multiple-company-select
      v-if="companyList.length > 0"
      v-model="companyId"
      :list="companyList"
    />
    <el-form-item v-if="passwordShow" label="" prop="password">
      <el-input
        v-model.trim="ruleForm.password"
        :type="passwordType"
        placeholder="请输入密码"
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
    <div class="other-handle">
      <el-button type="text" @click="loginClick('loginPwd')"
        >返回登录页面</el-button
      >
    </div>
  </el-form>
</template>

<script>
import ShowItem from './ShowItem.vue'
import MultipleCompanySelect from './MultipleCompanySelect.vue'
import VerifyButton from '@/components/Verify/Button.vue'

import LoginMixin from './LoginMixin'

export default {
  // 忘记密码
  name: 'ForgetPwd',

  emits: ['toggle', 'update:username'],

  components: {
    ShowItem,
    VerifyButton,
    MultipleCompanySelect
  },

  mixins: [LoginMixin],

  props: {
    username: String
  },

  data() {
    const validateSmscode = (rule, value, callback) => {
      this.smscodePass || this.loading
        ? callback()
        : callback(new Error('短信验证码错误'))
    }

    const validatePassword = (rule, value, callback) => {
      if (this.passwordShow) {
        value.length > 0 ? callback() : callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      ruleForm: {
        phone: '',
        smscode: '',
        password: ''
      },
      ruleResult: {
        phone: {
          validate: false,
          edit: true
        },
        smscode: {
          validate: false,
          edit: false
        },
        password: {
          validate: false,
          edit: false
        }
      },
      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'change' }
        ],
        smscode: [{ validator: validateSmscode, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }]
      },

      smscodePass: false,
      companyList: [],
      companyId: '',
      passwordType: 'password'
    }
  },

  computed: {
    smscodeShow() {
      return (
        !this.ruleResult.phone.edit &&
        this.ruleResult.phone.validate &&
        !this.passwordShow
      )
    },
    loginBtnName() {
      // if (this.companyId) {
      //   return '重置密码'
      // }
      if (this.smscodeShow) {
        return '验证'
      }
      return this.ruleResult.phone.edit ? '继续' : '重置密码'
    },
    passwordShow() {
      return !!this.companyId // 有公司id，就到修改密码
    }
  },

  watch: {
    ruleForm: {
      handler() {
        this.$nextTick(() => {
          const form = this.$refs.ruleForm
          form.$children.forEach((item) => {
            if (item.prop) {
              this.ruleResult[item.prop].validate =
                item.validateState === 'success'
            }
          })
        })
      },
      deep: true
    },

    username: {
      handler() {
        this.ruleForm.phone = this.username
      },
      immediate: true
    },

    'ruleForm.phone': {
      handler(val) {
        this.$emit('update:username', val)
      }
    }
  },

  created() {
    this.debouncedHandleLogin = debounce(300, this.handleLogin)
  },

  mounted() {},

  beforeUnmount() {
    this.clearTimer()
  },

  methods: {
    /**
     * 继续
     */
    continueClick() {
      if (this.smscodeShow) {
        this.loading = true
        verfySmsAPI({
          phone: this.ruleForm.phone,
          smsCode: this.ruleForm.smscode
        })
          .then((res) => {
            if (res.data === 1) {
              this.getCompany()
              this.smscodePass = true
            } else {
              this.smscodePass = false
            }
            this.loading = false
            this.$refs.ruleForm.validateField('smscode')
          })
          .catch((this.loading = false))
      } else {
        this.$refs.ruleForm.validate(async (valid) => {
          await this.changeFormState()
          if (this.ruleResult.phone.validate) {
            if (!this.smscodePass) {
              this.ruleResult.phone.edit = false
              this.clearTimer()
            } else {
              if (this.passwordShow) {
                this.loading = true
                resetPwdAPI({
                  ...this.ruleForm,
                  companyId: this.companyId
                })
                  .then(() => {
                    this.$message.success('修改成功')
                    this.loginClick('loginPwd')
                    this.loading = false
                  })
                  .catch(() => {
                    this.loading = false
                  })
              }
            }
          }
          return false
        })
      }
    },

    /**
     * @description: 清理验证按钮定时器
     * @return {*}
     */
    clearTimer() {
      this.$refs.verifyButton && this.$refs.verifyButton.resetTimer()
    },

    /**
     * 获取公司id
     */
    getCompany() {
      forgetPwdAPI({
        phone: this.ruleForm.phone,
        smscode: this.ruleForm.smscode
      })
        .then((res) => {
          const companyList = res.data || []
          if (companyList.length > 1) {
            this.companyList = companyList
          }

          if (companyList.length > 0) {
            this.companyId = companyList[0].companyId
          }
        })
        .catch(() => {})
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
      this.companyList = []
      this.companyId = ''
      this.ruleResult.smscode = ''
      this.ruleResult.password = ''

      this.smscodePass = false

      this.$refs.ruleForm.clearValidate()
    },

    /**
     * 获取验证码
     */
    verifySuccess(params) {
      sendSmsAPI({
        telephone: this.ruleForm.phone,
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

.multiple-company-select {
  margin-bottom: 22px;
}
</style>
