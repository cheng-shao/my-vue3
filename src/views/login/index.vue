<template>
  <div class="login">
    <div class="login__content">
      <div class="login-title">
        {{
          companyInfo.name !== null && companyInfo.name !== ''
            ? companyInfo.name
            : '悟空软件'
        }}
      </div>

      <login-by-pwd
        v-if="loginType === 'loginPwd'"
        v-model:username="username"
        @toggle="toggleClick"
      />
      <login-by-code
        v-else-if="loginType === 'loginCode'"
        v-model:username="username"
        @toggle="toggleClick"
      />
      <multiple-company
        v-else-if="loginType === 'multiple'"
        :list="companyList"
        :login-params="loginParams"
        @toggle="toggleClick"
      />
      <forget-pwd
        v-else-if="loginType === 'forgetPwd'"
        v-model:username="username"
        @toggle="toggleClick"
      />

      <!-- <div class="statement">
        <el-button type="text">隐私政策</el-button><span>•</span><el-button type="text">用户声明</el-button>
      </div> -->
    </div>

    <div class="footer">
      <img
        v-if="companyInfo.logo"
        :src="companyInfo.logo"
        class="company-logo"
      />
      <div v-else class="footer-title">
        <img src="@/assets/img/logo.png" class="logo" />
        <span>悟空软件</span>
      </div>
      <div class="footer-des">
        一个账户可以访问 悟空CRM、悟空FS、悟空HRM 以及其他产品
      </div>
    </div>
  </div>
</template>

<script>
import LoginByPwd from './component/LoginByPwd.vue'
import LoginByCode from './component/LoginByCode.vue'
import MultipleCompany from './component/MultipleCompany.vue'
import ForgetPwd from './component/ForgetPwd.vue'

export default {
  // 登录
  name: 'Login',

  components: {
    LoginByPwd,
    LoginByCode,
    MultipleCompany,
    ForgetPwd
  },

  props: {},

  data() {
    return {
      loginType: 'loginPwd', // loginPwd loginCode foregetPwd multiple
      username: '', // 登录账号
      companyList: [],
      companyInfo: {
        name: '',
        logo: ''
      },
      loginParams: null // 登录参数，多企业二次登录需要
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getLogoAndName()
  },

  mounted() {},

  beforeUnmount() {},

  methods: {
    /**
     * 获取logo 和 名称
     */
    getLogoAndName() {
      adminCompanyManagerQueryLogoAPI({
        domain: window.location.hostname
      })
        .then((res) => {
          const resData = res.data
          if (resData) {
            this.companyInfo.logo = resData.companyLoginLogo
            this.companyInfo.name = resData.companyName
          } else {
            if (process.env.VUE_APP_CORRECT_DOMAIN === '1') {
              this.correctDomain()
            }
          }
        })
        .catch(() => {})
    },

    /**
     * 校准域名
     */
    correctDomain() {
      let hostname = window.location.hostname
      const hostnames = hostname.split('.')
      if (hostnames.length >= 2 && hostnames[0] !== 'www') {
        const index = hostname.indexOf('.')
        if (index > 0) {
          hostname = `www${hostname.substring(index)}`
        }
        window.location.href =
          window.location.protocol +
          '//' +
          hostname +
          (window.location.port ? ':' + window.location.port : '')
      }
    },

    /**
     * 切换展示内容
     */
    toggleClick(type, data, loginParams) {
      this.loginType = type
      if (type === 'multiple') {
        this.companyList = data
        this.loginParams = loginParams
      } else {
        this.loginParams = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  .login {
    background-image: none !important;
  }
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-image: url('./img/left.png'), url('./img/right.png');
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-position: left bottom, right bottom;
  background-size: 360px, 480px;
  -webkit-box-pack: justify;

  &__content {
    width: 400px;
    margin: 0 auto;
    text-align: center;
  }

  &-title {
    padding: 40px 0;
    font-size: 25px;
    font-weight: bold;
    line-height: 40px;
    color: $--color-primary;
  }

  .footer {
    width: 400px;
    padding: 24px 0;
    margin: 0 auto;
    font-size: 12px;
    color: $--color-text-secondary;
    text-align: center;

    &-title {
      font-size: 28px;
      font-weight: bold;
      color: $--color-text-regular;
      display: flex;
      justify-content: center;
      align-items: center;

      .logo {
        width: 32px;
        margin-right: $--interval-base;
      }

      .logo,
      span {
        vertical-align: middle;
      }
    }

    > .company-logo {
      width: 160px;
    }

    &-des {
      margin-top: 16px;
      font-size: 12px;
      color: $--color-text-secondary;
    }
  }

  .statement {
    margin-top: 24px;
    text-align: center;

    span {
      padding: 0 8px;
    }
  }
}
</style>
