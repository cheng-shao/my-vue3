export default defineComponent({
  data() {
    return {
      redirect: undefined
    }
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },

  methods: {
    /**
     * 更新form状态
     */
    changeFormState(form) {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const { ruleForm } = this.$refs

          for (const item of form) {
            ruleForm.validateField(item, (valid: boolean) => {
              if (valid) {
                this.ruleResult[item].validate = true
              }
            })
          }

          // form.$children.forEach((item) => {
          //   if (item.prop) {
          //     this.ruleResult[item.prop].validate =
          //       item.validateState === 'success'
          //   }
          // })
          resolve(this.ruleResult)
        })
      })
    }
  }
})
