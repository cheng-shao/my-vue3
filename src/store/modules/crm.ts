export const useCrmStore = defineStore({
  id: 'crm',
  state: () => ({
    // 待办事项消息
    messageNum: {},
    showRing: true,
    showTimer: false,
    showCallOut: false,
    isCall: false, // 呼叫中心权限
    callinTime: '00:00:00'
  }),
  getters: {
    // 权限
    // isCall: (state) => state.isCall, // 当前人权限
    // // 客户管理信息
    // messageNum: (state) => state.messageNum
  },
  actions: {
    // 原有的mutations
    /**
     * 更改待办事项
     */
    SET_MESSAGENUM(messageNum) {
      let totalNum = 0
      for (const key in messageNum) {
        if (key != 'totalNum') {
          totalNum += messageNum[key] || 0
        }
      }
      messageNum.totalNum = totalNum
      this.messageNum = messageNum
    },
    /**
     * 通话计时
     */
    CALL_STATUS(callinTime) {
      this.callinTime = callinTime
    },
    /**
     * 振铃中
     */
    SHOW_RING(showRing) {
      this.showRing = showRing
    },
    /**
     * 是否展示通话
     */
    SHOW_TIMER(showTimer) {
      this.showTimer = showTimer
    },
    /**
     * 展示来电弹框
     */
    SHOW_CALL_OUT(showCallOut) {
      this.showCallOut = showCallOut
    },
    /**
     * 呼叫中心权限
     */
    GET_IS_CALL(isCall) {
      this.isCall = isCall
    },

    // 原有的actions
    // 登录
    GetMessageNum() {
      return new Promise((resolve, reject) => {
        crmMessagNumAPI()
          .then((response) => {
            this.SET_MESSAGENUM(response.data)
            // 待办事项 增加数量提示， 因合并入系统消息，暂时去掉
            // commit('SET_CRMROUTERSNUM', state.messageNum.totalNum)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
