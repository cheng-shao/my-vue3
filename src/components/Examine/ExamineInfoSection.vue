<template>
  <wk-head-section
    v-if="examineFlowList && examineFlowList.length > 0"
    v-loading="loading"
    label="审批流信息"
  >
    <template #right>
      <el-popover
        ref="popover"
        v-model="showFlowPopover"
        :placement="placement"
        width="300"
        trigger="click"
      >
        <check-flow
          :id="recordId"
          ref="checkFlow"
          :show="showFlowPopover"
          :examine-type="examineType"
          @close="showFlowPopover = false"
        />
        <template #reference>
          <el-button style="margin-right: 8px" type="text" @click.stop=""
            >查看历史审批流程
          </el-button>
        </template>
      </el-popover>
    </template>

    <!-- 固定 -->
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in examineFlowList"
        :key="index"
        hide-timestamp
      >
        <template #dot>
          <i
            v-if="item.examineType != 7"
            :class="getStatusIcon(item.examineStatus)"
            :style="{
              color: getStatusColor(item.examineStatus)
            }"
            class="examine-item-icon"
          />
          <i
            v-else
            style="color: #5e6c84"
            class="examine-item-icon wk wk-source-line"
          />
        </template>
        <div class="examine-item">
          <div class="examine-item__hd ei">
            <div>
              <span class="ei-status"
                >{{ item.name ? item.name + '：' : ''
                }}{{
                  item.examineType == 7
                    ? '抄送'
                    : getStatusName(item.examineStatus)
                }}</span
              >
              <el-tag
                v-if="
                  examineCategory(item.type) &&
                  item.examineType != 7 &&
                  item.userList &&
                  item.userList.length > 1
                "
                :disable-transitions="true"
                >{{ examineCategory(item.type) }}</el-tag
              >
              <flexbox
                v-if="
                  item.userList.length === 1 &&
                  (item.userList[0].realname || item.userList[0].outerUserEmail)
                "
                style="margin-top: 10px"
              >
                <xr-avatar :name="getDetailName(item)" :size="20" />
                <span class="ei-name"
                  >{{ getDetailName(item) }}
                  <span
                    v-if="
                      item.userList[0].hasOwnProperty('seekUser') &&
                      item.userList[0].seekUser
                    "
                    class="other-people"
                  >
                    <i class="wk wk-new-employee" />
                    已征求他人意见</span
                  >
                </span>
              </flexbox>
            </div>
            <div v-if="item.userList.length === 1" class="ei-time">
              <span>{{ item.userList[0].examineTime }}</span>
              <div v-if="item.passFlag == 102" class="examine-error">
                <i class="el-icon-warning" />未找到审批人，已自动同意
              </div>
              <div v-if="item.passFlag == 202" class="examine-error">
                <i class="el-icon-warning" />未找到审批人，已自动转交给
                {{ item.userList.map((item) => item.realname).join() }}
              </div>
              <div
                v-if="
                  (item.userList[0].duration || item.userList[0].passFlag) &&
                  examineAdvancedConfigVO.advancedLimitTimeVO &&
                  examineAdvancedConfigVO.advancedLimitTimeVO.handleType != 1
                "
                class="ei-time-limit"
                :style="
                  autoExamineText(
                    item.userList[0].duration,
                    item.userList[0].examineStatus,
                    item.userList[0].passFlag
                  )['class']
                "
              >
                {{
                  autoExamineText(
                    item.userList[0].duration,
                    item.userList[0].examineStatus,
                    item.userList[0].passFlag
                  )['text']
                }}
              </div>
            </div>
            <div
              v-if="
                item.remarks &&
                item.userList[0].hasOwnProperty('seekUser') &&
                item.userList[0].seekUser &&
                item.userList.length == 1
              "
              class="remarks"
            >
              {{ item.remarks }}
            </div>
          </div>
          <div v-if="item.userList.length > 1" class="examine-item__bd">
            <div
              v-for="(subItem, subIndex) in item.userList"
              :key="subIndex"
              class="examine-item__hd ei"
            >
              <flexbox
                :class="
                  subItem.hasOwnProperty('handlerType') &&
                  subItem.handlerType == 1
                    ? 'examine-care-of'
                    : ''
                "
              >
                <i
                  v-if="
                    subItem.hasOwnProperty('handlerType') &&
                    subItem.handlerType == 1
                  "
                  class="wk wk-icon-reply"
                  :class="
                    subItem.hasOwnProperty('handlerType') &&
                    subItem.handlerType == 1
                      ? 'care-of'
                      : ''
                  "
                />
                <xr-avatar :name="subItem.realname" :size="20" />
                <span class="ei-name"
                  >{{ subItem.realname || subItem.outerUserEmail }}
                  <span
                    v-if="
                      subItem.hasOwnProperty('seekUser') && subItem.seekUser
                    "
                    class="other-people"
                  >
                    <i class="wk wk-new-employee" />
                    已征求他人意见</span
                  >
                </span>
                <span
                  v-if="subItem.examineStatus != 11 && item.examineType != 7"
                  class="ei-status"
                  >{{ getStatusName(subItem.examineStatus) }}</span
                >
                <span v-if="subItem.examineStatus == 11" class="ei-status"
                  >已转审</span
                >
              </flexbox>
              <div class="ei-time">{{ subItem.examineTime }}</div>
              <div
                v-if="
                  (subItem.duration || subItem.passFlag) &&
                  examineAdvancedConfigVO.advancedLimitTimeVO &&
                  examineAdvancedConfigVO.advancedLimitTimeVO.handleType != 1
                "
                class="ei-time-limit"
                :style="
                  autoExamineText(
                    subItem.duration,
                    subItem.examineStatus,
                    subItem.passFlag
                  )['class']
                "
              >
                {{
                  autoExamineText(
                    subItem.duration,
                    subItem.examineStatus,
                    subItem.passFlag
                  )['text']
                }}
              </div>
              <div
                v-if="
                  item.remarks &&
                  subItem.hasOwnProperty('seekUser') &&
                  subItem.seekUser
                "
                class="remarks"
              >
                {{ item.remarks }}
              </div>
            </div>
            <!-- 102 自动自动同意  202 异常自动转交 -->
            <div v-if="item.passFlag == 102" class="examine-error">
              <i class="el-icon-warning" />未找到审批人，已自动同意
            </div>
            <div v-if="item.passFlag == 202" class="examine-error">
              <i class="el-icon-warning" />未找到审批人，已自动转交给
              {{ item.userList.map((item) => item.realname).join() }}
            </div>
          </div>
        </div>
        <!-- <flexbox align="stretch" class="examine-item">
          <div class="examine-item-label">{{ getDetailName(item) }}</div>
          <div class="examine-item-subs">
            <div
              v-for="(subItem, subIndex) in item.userList"
              :key="subIndex"
              class="examine-sub">
              <i :style="{ color: getStatusColor(subItem.examineStatus) }" :class="['examine-icon', getStatusIcon(subItem.examineStatus)] " />
              <span class="examine-realname">{{ subItem.realname }}</span><span class="examine-status">{{ getStatusName(subItem.examineStatus) }}</span>
            </div>
          </div>
        </flexbox> -->
      </el-timeline-item>
    </el-timeline>

    <div
      class="handle"
      :style="!examineMoreHandle.length ? 'justify-content: start;' : ''"
    >
      <el-button
        v-if="examineInfo.isCheck == 1"
        type="success"
        icon="wk wk-success"
        @click="examineHandle(1)"
        >通过</el-button
      >
      <el-button
        v-if="examineInfo.isCheck == 1"
        type="danger"
        :style="!examineMoreHandle.length ? 'margin-left: 10px;' : ''"
        icon="wk wk-close"
        @click="examineHandle(2)"
        >拒绝</el-button
      >

      <el-dropdown
        v-if="examineMoreHandle.length"
        class="more-handle"
        @command="moreHandler"
      >
        <el-button>更多操作</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in examineMoreHandle"
              :key="index"
              :command="item.value"
            >
              <template v-if="item.value == 'forwardOthers'">
                <el-dropdown class="more-handle" @command="moreHandler">
                  <div>转他人处理</div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="selectUser">
                        选择员工
                      </el-dropdown-item>
                      <el-dropdown-item command="external">
                        选择外部联系人
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
              <template v-else>
                {{ item.label }}
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 操作 -->
    <examine-handle
      :id="id"
      ref="examineHandleRef"
      :show="examineHandleShow"
      :record-id="recordId"
      :examine-type="examineType"
      :detail="examineInfo"
      :flow-id="flowId"
      :status="examineHandleInfo.status"
      @close="examineHandleShow = false"
      @emailExamine="emailExamineHandle"
      @save="examineHandleClick"
    />

    <!-- 转他人处理 -->
    <wk-dep-user-dialog
      v-if="userViewDialogShow"
      :props="{
        showUser: true,
        showDept: false,
        showDisableUser: false,
        disableUserLabel: '员工'
      }"
      radio
      v-model:visible="userViewDialogShow"
      @change="selectUserChange"
    />

    <!-- 征求他人意见 -->
    <solicit-others
      v-if="solicitOthersShow"
      v-model="solicitOthersShow"
      @submitParams="solicitOthersHandler"
    />

    <!-- 选择外部联系人 -->
    <el-dialog
      v-if="externalDialogShow"
      v-model:visible="externalDialogShow"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="外部联系人"
      width="30%"
    >
      <span>请输入外部联系人邮箱</span>
      <el-input v-model="email" style="margin-top: 10px" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="externalDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="verifyEmail">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </wk-head-section>
</template>
<script type="text/javascript">
import { examineRecordQueryListAPI } from '@/api/examine' // 审批步骤
import {
  examineRecordList,
  forwardOthersAPI,
  solicitOthersAPI,
  useExamineEmailSend,
  actionExamine
} from '@/api/oa/superExamine'

import { examineSuperExaminesUseExamineEmailTokenForAuditExamineAPI } from '@/api/examine/superExamine.js'
import ExamineHandle from './ExamineHandle' // 审批操作理由
import CheckFlow from './CheckFlow' // 审批流程
import WkHeadSection from '@/components/NewCom/WkHeadSection'
import WkDepUserDialog from '@/components/NewCom/WkUserDialogSelect/Dialog'
import SolicitOthers from './SolicitOthers' // 征求他人意见

import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { wayTypeObj } from '@/components/ApprovalFlow/nodeModel'
import { regexIsCRMEmail } from '@/utils'
import { isEmpty } from '@/utils/types'
import moment from 'moment'
import NP from 'number-precision'

// 审核信息 config 1 固定 0 自选
export default {
  name: 'ExamineInfoSection', // 合同审核操作
  emits: ['success', 'on-handle'],
  components: {
    ExamineHandle,
    CheckFlow,
    WkHeadSection,
    WkDepUserDialog,
    SolicitOthers
  },
  mixins: [CheckStatusMixin],
  props: {
    examineType: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    id: [String, Number],
    // 审批流id
    recordId: [String, Number],
    ownerUserId: [String, Number],
    config: {
      type: Object,
      default: () => {}
    },
    examineRecord: {
      type: Object,
      default: () => {}
    },
    externalMailbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      examineInfo: {}, // 审核信息
      showFlowPopover: false,
      examineHandleInfo: { status: 1 }, // 1 审核通过 2 审核拒绝 4 已撤回
      examineHandleShow: false, // 审核操作
      userViewDialogShow: false, // 转他人处理
      solicitOthersShow: false, // 征求他人意见
      externalDialogShow: false, // 选择外部联系人
      email: '', // 外部联系人邮箱
      flowId: '', // 当前审批节点flowId
      moreActions: [
        { label: '转他人处理', value: 'forwardOthers' },
        { label: '征求他人意见', value: 'solicitOthers' },
        { label: '终止', value: 'termination' }
      ],

      examineAdvancedConfigVO: {}
    }
  },
  computed: {
    examineFlowList() {
      return this.examineInfo.examineFlowList
        ? this.examineInfo.examineFlowList
        : []
    },

    examineMoreHandle() {
      let moreActions = [
        { label: '转他人处理', value: 'forwardOthers' },
        { label: '征求他人意见', value: 'solicitOthers' },
        { label: '终止', value: 'termination' }
      ]

      const isCheck = this.examineInfo.isCheck
      const isRecheck = this.examineInfo.isRecheck
      if (this.externalMailbox) {
        if (isCheck) {
          moreActions = [{ label: '终止', value: 'termination' }]
        } else {
          moreActions = []
        }
      } else if (isCheck && isRecheck) {
        moreActions.push(
          { label: '邮件催办', value: 'emailReminder' },
          { label: '归档', value: 'archive' },
          { label: '作废', value: 'cancellation' },
          { label: '撤回', value: 'retract' }
        )
      } else if (!isCheck && isRecheck) {
        moreActions = [
          { label: '邮件催办', value: 'emailReminder' },
          { label: '撤回', value: 'retract' },
          { label: '归档', value: 'archive' },
          { label: '作废', value: 'cancellation' }
        ]
      } else if (!isCheck && !isRecheck) {
        moreActions = []
      }

      if (this.examineType == 'hrm_salary') {
        const hrmHandler = []
        moreActions.forEach((item, index) => {
          if (item.value != 'termination' && item.value != 'cancellation') {
            hrmHandler.push(item)
          }
        })
        moreActions = hrmHandler
      }

      return moreActions
    },

    examineCategory() {
      return function (type) {
        return wayTypeObj[type]
      }
    }
  },
  watch: {
    recordId: {
      handler(val) {
        if (val) {
          this.examineInfo = {}
          this.getFlowStepOAList()
          if (this.$refs.checkFlow) {
            this.$refs.checkFlow.getDetail()
          }
        }
      },
      deep: true,
      immediate: true
    },
    examineFlowList: {
      handler(val) {
        val.forEach((item) => {
          item.userList.forEach((sItem) => {
            if (sItem.examineStatus == 3) {
              this.flowId = item.flowId
            }
          })
        })
      },
      immediate: true,
      deep: true
    },
    examineRecord: {
      handler(val) {
        if (!isEmpty(val)) {
          this.examineInfo = this.examineRecord
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    emailExamineHandle(content, flag) {
      if (flag) {
        this.$message.error('请输入审批意见（必填）')
        return
      }
      examineSuperExaminesUseExamineEmailTokenForAuditExamineAPI({
        emailToken: this.$route.query.k,
        status: this.examineHandleInfo.status,
        remarks: content
      })
        .then((res) => {
          this.$message.success('操作成功')
          this.$refs.examineHandleRef.resetInfo()
          this.examineHandleShow = false
          this.$emit('success')
        })
        .catch((e) => {})
    },
    /**
     * 详情
     */
    getFlowStepList() {
      if (!this.recordId) {
        return
      }
      this.loading = true
      examineRecordQueryListAPI({
        recordId: this.recordId,
        ownerUserId: this.ownerUserId
      })
        .then((res) => {
          this.loading = false
          const resData = res.data || {}
          this.examineInfo = resData
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 详情
     */
    getFlowStepOAList() {
      this.loading = true
      examineRecordList({ recordId: this.recordId })
        .then((res) => {
          this.loading = false
          const resData = res.data || {}
          this.examineAdvancedConfigVO = resData.examineAdvancedConfigVO
          this.examineInfo = resData
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 更多操作
     */
    moreHandler(command) {
      if (command == 'selectUser') {
        // 转他人处理(选择员工)
        this.userViewDialogShow = true
      } else if (command == 'external') {
        // 转他人处理(外部联系人)
        this.externalDialogShow = true
      } else if (command == 'solicitOthers') {
        // 征求他人意见
        this.solicitOthersShow = true
      } else if (command == 'termination') {
        // 终止
        this.examineHandle(13)
      } else if (command == 'emailReminder') {
        // 邮件催办
        this.emailReminder()
      } else if (command == 'archive') {
        // 归档
        this.examineHandle(14)
      } else if (command == 'cancellation') {
        // 作废
        this.examineHandle(8)
      } else if (command == 'retract') {
        // 撤回
        this.examineHandle(4)
      }
    },

    /**
     * 撤回审核 通过 拒绝 归档 作废
     */
    examineHandle(status) {
      this.examineHandleInfo.status = status
      this.examineHandleShow = true
    },

    /**
     * @description: 归档/作废
     * @param {*} status 3归档  4作废
     * @return {*}
     */
    archivedObsolete(status, type) {
      const params = {
        archiveOrVoidFlag: status,
        recordId: this.recordId
      }
      actionExamine(params).then((res) => {
        this.$message.success('操作成功')
        this.getFlowStepOAList()
        this.$emit('on-handle', type)
      })
    },

    /**
     * @description: 邮件催办
     * @return {*}
     */
    emailReminder() {
      useExamineEmailSend({ examineRecordId: this.recordId }).then((res) => {
        this.$message.success('操作成功')
        this.getFlowStepOAList()
      })
    },

    /**
     * 审批操作点击
     */
    examineHandleClick(data) {
      this.getFlowStepOAList()
      if (this.$refs.checkFlow) {
        this.$refs.checkFlow.getDetail()
      }
      this.$emit('on-handle', data)
    },

    /**
     * 获取名称
     */
    getDetailName(data) {
      if (!data.userList || data.userList.length === 0) {
        return 'XX'
      } else if (data.userList.length === 1) {
        return data.userList[0].realname
          ? data.userList[0].realname
          : data.userList[0].outerUserEmail
      } else if (data.examineType === 5) {
        return `${data.userList.length}人${wayTypeObj[1]}`
      } else {
        return `${data.userList.length}人${wayTypeObj[data.type]}`
      }
    },

    /**
     * 转他人处理
     */
    selectUserChange(usersIds) {
      const params = {
        examineFlowFinalUser: {
          userId: usersIds[0]
        },
        flowFinalId: this.flowId,
        recordId: this.recordId
      }

      forwardOthersAPI(params).then((res) => {
        this.getFlowStepOAList()
      })
    },

    /**
     * 验证邮箱
     */
    verifyEmail() {
      if (regexIsCRMEmail(this.email)) {
        const params = {
          examineFlowFinalUser: {
            email: this.email
          },
          flowFinalId: this.flowId,
          recordId: this.recordId
        }

        forwardOthersAPI(params).then((res) => {
          this.getFlowStepOAList()
        })
        this.email = null
        this.externalDialogShow = false
      } else {
        this.$message.error('邮箱格式有误')
      }
    },

    /**
     * 征求他人意见
     */
    solicitOthersHandler(data) {
      const params = {
        ...data,
        insertTarget: this.flowId,
        recordId: this.recordId
      }
      solicitOthersAPI(params).then(() => {
        this.getFlowStepOAList()
      })
    },

    /**
     * 自动审批提示文本
     */
    autoExamineText(millimeter, examineStatus, passFlag) {
      const time = Number(millimeter)
      const limitTimeVO = this.examineAdvancedConfigVO?.advancedLimitTimeVO
      if (!limitTimeVO) return {}

      const { handleType, handleUserList, limitTime } = limitTimeVO
      const timeType = limitTimeVO.limitTimeUnit

      const minuteTime = Number(NP.minus(NP.times(limitTime, 60, 1000), time))
      const hourTime = Number(NP.minus(NP.times(limitTime, 60, 60, 1000), time))
      const dayTime = Number(
        NP.minus(NP.times(limitTime, 24, 60, 60, 1000), time)
      )
      const timeObj = {
        minute: NP.minus(NP.times(limitTime, 60, 1000), time),
        hour: NP.minus(NP.times(limitTime, 60, 60, 1000), time),
        day: NP.minus(NP.times(limitTime, 24, 60, 60, 1000), time)
      }

      const timeTypeObj = {
        minute: '分钟',
        hour: '小时',
        day: '天'
      }

      if (passFlag == 103) {
        return {
          text: `【限时审批】流程在审批人处停留超过${limitTime}${timeTypeObj[timeType]}，系统已自动同意`,
          class: 'background-color: #EBECF0;color:#999'
        }
      } else if (passFlag == 203) {
        return {
          text: `【限时审批】流程在审批人处停留超过${limitTime}${
            timeTypeObj[timeType]
          }，系统已【自动转交】给${handleUserList
            .map((item) => item.realname)
            .join()}`,
          class: 'background-color: #EBECF0;color:#999'
        }
      }

      if (
        (timeType == 'minute' && minuteTime > 0) ||
        (timeType == 'hour' && hourTime > 0) ||
        (timeType == 'day' && dayTime > 0)
      ) {
        const day = moment.duration(timeObj[timeType]).days()
          ? moment.duration(timeObj[timeType]).days() + '天'
          : ''
        const hour = moment.duration(timeObj[timeType]).hours()
          ? moment.duration(timeObj[timeType]).hours() + '小时'
          : ''
        const minuter = moment.duration(timeObj[timeType]).minutes()
          ? moment.duration(timeObj[timeType]).minutes() + '分钟'
          : ''
        if (handleType == 3) {
          return {
            text:
              !day && !hour && !minuter
                ? '1分钟后自动同意'
                : day + hour + minuter + '后自动同意',
            class: 'color: red'
          }
        } else if (handleType == 2) {
          return {
            text:
              !day && !hour && !minuter
                ? '1分钟后自动转交给' +
                  handleUserList.map((item) => item.realname).join()
                : day +
                  hour +
                  minuter +
                  '后自动转交给' +
                  handleUserList.map((item) => item.realname).join(),
            class: 'color: red'
          }
        }
      } else {
        if (handleType == 2) {
          return {
            text: `【限时审批】流程在审批人处停留超过${limitTime}${
              timeTypeObj[timeType]
            }，系统${
              examineStatus == 1 ? '已' : '将'
            }【自动转交】给${handleUserList
              .map((item) => item.realname)
              .join()}`,
            class: 'background-color: #EBECF0;color:#999'
          }
        } else if (handleType == 3) {
          return {
            text: `【限时审批】流程在审批人处停留超过${limitTime}${
              timeTypeObj[timeType]
            }，系统${examineStatus == 1 ? '已' : '将'}自动同意`,
            class: 'background-color: #EBECF0;color:#999'
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-timeline) {
  .el-timeline-item {
    .el-timeline-item__dot {
      i {
        margin-top: -5px;
      }
    }
  }
}

.wk-head-section {
  :deep(.section-body) {
    max-height: 60vh;
    overflow: auto;
  }

  .handle {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    background-color: $--color-n0;

    .el-button + .el-button {
      margin-left: unset;
    }

    .more-handle {
      display: flex;

      :deep(.el-button.el-button--default) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 74px;
      }
    }

    .el-button.el-button--danger {
      margin-left: unset;
    }

    .xr-btn--green,
    .xr-btn--red {
      color: white;
    }
  }
}

/** 审核流程 */
.check-items {
  overflow-x: auto;
  line-height: 2;
}

.check-item {
  flex-shrink: 0;
  width: auto;

  .check-item-name {
    margin-right: $--interval-base;
    font-size: 16px;
  }

  .check-item-status {
    color: $--color-text-secondary;
  }

  .check-item-arrow {
    margin: 0 #{$--interval-base * 2};
    font-size: 13px;
  }
}

// 固定审批流详情
.examine-item {
  &-icon {
    margin-left: -4px;
    font-size: 18px;
    background-color: white;
  }

  .ei {
    &-name {
      font-size: 16px;
      color: $--color-black;
    }

    &-status {
      font-size: 14px;
      color: $--color-text-secondary;
    }

    &-time {
      margin-top: 4px;
      font-size: 12px;
      color: $--color-n70;
    }

    &-time-limit {
      padding: 5px 0;
      font-size: $--font-size-small;
    }

    span + span {
      margin-left: 4px;
    }
  }

  .ei + .ei {
    margin-top: 4px;
  }

  &__bd {
    margin-top: 4px;

    .examine-care-of {
      margin-left: 10px;
    }

    .care-of {
      margin-right: 5px;
      color: $--color-n200;
      transform: rotate(180deg);
    }

    .ei-name {
      font-size: 14px;
    }

    .ei-status {
      font-size: 12px;
    }
  }

  // &-label {
  //   width: 80px;
  //   color: $--color-text-secondary;
  // }

  // &-subs {
  //   .examine-sub + .examine-sub {
  //     margin-top: 4px;
  //   }
  //   .examine-icon {
  //     width: 12px;
  //   }
  //   .examine-realname {
  //     margin-left: 8px;
  //   }

  //   .examine-status {
  //     margin-left: 8px;
  //     color: $--color-text-secondary;
  //   }
  // }

  .other-people {
    font-size: 14px;
    color: $--color-n200;

    i {
      margin-left: 4px;
      font-size: 14px;
      color: $--color-y300;
    }
  }

  .remarks {
    padding: 8px;
    margin: 10px 0;
    font-size: 12px;
    line-height: 18px;
    color: #6b778c;
    background-color: #f4f5f7;
    border-radius: 3px;
  }
}

.examine-error {
  padding: 5px;
  margin-top: 10px;
  background-color: $--color-n20;

  i {
    margin-right: 5px;
    color: #f56c6c;
  }
}
</style>
