<template>
  <flexbox class="message-cell" align="stretch">
    <div class="message-cell__hd">
      <i :class="typeObj.icon" />
    </div>

    <div class="message-cell__bd">
      <div class="message-cell-title">{{ getTitle() }}</div>
      <!-- 9 -->
      <div class="message-cell-des">
        <span>{{ leftContent }}</span>
        <span
          :class="[{ 'is-invalid': isInvalid }, 'click-content']"
          @click="enterDetail"
          >{{ centerCotent }}</span
        >
        <span>{{ rightContent }}</span>
      </div>

      <div class="brief">
        <div class="text-one-line">{{ getBrief() }}</div>
        <div
          v-for="(item, index) in contentFields"
          :key="index"
          class="brief-cell"
        >
          <div class="brief-label">{{ item.name }}</div>
          <div v-if="item.formType === 'relative'" class="brief-value">
            <div
              v-for="(rItem, rIndex) in item.value"
              :key="rIndex"
              class="relative-item"
            >
              <span>{{ `${rItem.label}` }}-</span
              ><span @click="relativeClick(rItem)">{{ rItem.name }}</span>
            </div>
          </div>
          <div
            v-else-if="item.hasDetails"
            class="brief-value text-one-line is-visit"
            @click="relativeClick(item)"
          >
            {{ item.value }}
          </div>
          <div v-else class="brief-value text-one-line">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div class="message-cell__ft">
      <div>{{ data.createTime | formatTime }}</div>
      <flexbox justify="end">
        <el-tooltip
          effect="dark"
          :disabled="data.isRead == 1"
          content="标记为已读"
          placement="left"
        >
          <el-button
            class="check-btn"
            :class="{ 'is-unread': data.isRead == 0 }"
            @click="messageReadClick"
            >{{ '' }}</el-button
          >
        </el-tooltip>
      </flexbox>
      <el-button class="delete-btn" type="link" @click="messageDeleteClick"
        >删除</el-button
      >
    </div>
  </flexbox>
</template>

<script>
import crmTypeModel from '@/views/crm/model/crmTypeModel'

export default {
  // 消息cell
  name: 'MessageCell',
  components: {},
  props: {
    data: Object,
    dataIndex: Number
  },
  data() {
    return {}
  },
  computed: {
    typeObj() {
      const typesObj = {
        leads: {
          icon: 'wk wk-leads',
          color: '#6995FF',
          type: 'leads'
        },
        customer: {
          icon: 'wk wk-customer',
          color: '#6995FF',
          type: 'customer'
        },
        contacts: {
          icon: 'wk wk-contacts',
          color: '#6995FF',
          type: 'contacts'
        },
        business: {
          icon: 'wk wk-business',
          color: '#6995FF',
          type: 'business'
        },
        contract: {
          icon: 'wk wk-contract',
          color: '#6995FF',
          type: 'contract'
        },
        receivables: {
          icon: 'wk wk-receivables',
          color: '#6995FF',
          type: 'receivables'
        },
        product: {
          icon: 'wk wk-product',
          color: '#6995FF',
          type: 'product'
        },
        stage_examine: {
          icon: 'wk wk-approve',
          color: '#6995FF',
          type: 'stage_examine'
        },
        log: {
          icon: 'wk wk-log',
          color: '#6995FF',
          type: 'log'
        },
        examine: {
          icon: 'wk wk-approve',
          color: '#6995FF',
          type: 'examine'
        },
        task: {
          icon: 'wk wk-o-task',
          color: '#6995FF',
          type: 'task'
        },
        announcement: {
          icon: 'wk wk-announcement',
          color: '#6995FF',
          type: 'announcement'
        },
        schedule: {
          icon: 'wk wk-schedule',
          color: '#6995FF',
          type: 'schedule'
        },
        invoice: {
          icon: 'wk wk-invoice',
          color: '#6995FF',
          type: 'invoice'
        },
        knowledge: {
          icon: 'wk wk-book',
          color: '#6995FF',
          type: 'knowledge'
        },
        hrm: {
          icon: 'wk wk-employees',
          color: '#6995FF',
          type: 'hrm'
        },
        jxc_purchase: {
          icon: 'wk wk-icon-shop-cart',
          color: '#ffb940',
          type: 'jxc_purchase'
        },
        jxc_retreat: {
          icon: 'wk wk-drafts',
          color: '#fd964a',
          type: 'jxc_retreat'
        },
        jxc_sale: {
          icon: 'wk wk-record',
          color: '#23bbfb',
          type: 'jxc_sale'
        },
        jxc_saleReturn: {
          icon: 'wk wk-approval-13',
          color: '#fd964a',
          type: 'jxc_saleReturn'
        },
        jxc_payment: {
          icon: 'wk wk-icon-category-note',
          color: '#33d08f',
          type: 'jxc_payment'
        },
        jxc_collection: {
          icon: 'wk wk-l-record',
          color: '#00e4bc',
          type: 'jxc_collection'
        },
        jxc_inventory: {
          icon: 'wk wk-icon-search-note',
          color: '#fd5b4a',
          type: 'jxc_inventory'
        },
        jxc_allocation: {
          icon: 'wk wk-approval-11',
          color: '#23bbfb',
          type: 'jxc_allocation'
        }
      }

      // 1 任务 2 日志 3 oa审批 4公告 5 日程 6 客户管理 8 人资 9 进销存
      // label 20 阶段审批提醒 133 审批通知 134 通过通知 135 拒绝通知  content 内的 type 是CRM对应模块 remarks 是阶段名称
      let key = ''
      if (
        this.data.label &&
        (this.data.label <= 5 || [8, 9].includes(this.data.label))
      ) {
        if (this.data.label <= 5) {
          key = ['task', 'log', 'examine', 'announcement', 'schedule'][
            this.data.label - 1
          ]
        } else if (this.data.label === 9) {
          if ([53, 54, 55].includes(this.data.type)) {
            key = 'jxc_purchase'
          } else if ([56, 57, 58].includes(this.data.type)) {
            key = 'jxc_retreat'
          } else if ([59, 60, 61].includes(this.data.type)) {
            key = 'jxc_sale'
          } else if ([62, 63, 64].includes(this.data.type)) {
            key = 'jxc_saleReturn'
          } else if ([65, 66, 67].includes(this.data.type)) {
            key = 'jxc_payment'
          } else if ([68, 69, 70].includes(this.data.type)) {
            key = 'jxc_collection'
          } else if ([71, 72, 73].includes(this.data.type)) {
            key = 'jxc_inventory'
          } else if ([74, 75, 76].includes(this.data.type)) {
            key = 'jxc_allocation'
          }
        } else if (this.data.label === 8) {
          key = 'hrm'
        }
      } else if (this.data.label === 20) {
        key = 'stage_examine' // 阶段审批
      } else {
        if ([1, 2, 3].includes(this.data.type)) {
          key = 'task'
        } else if ([4, 5, 34].includes(this.data.type)) {
          key = 'log'
        } else if ([6, 7, 25].includes(this.data.type)) {
          key = 'examine'
        } else if ([8].includes(this.data.type)) {
          key = 'announcement'
        } else if ([10, 11, 24, 26, 30, 33].includes(this.data.type)) {
          key = 'contract'
        } else if ([12, 13, 27].includes(this.data.type)) {
          key = 'receivables'
        } else if ([14, 15, 23, 29, 32].includes(this.data.type)) {
          key = 'customer'
        } else if ([16, 17].includes(this.data.type)) {
          key = 'contacts'
        } else if ([18, 19].includes(this.data.type)) {
          key = 'leads'
        } else if ([20, 21].includes(this.data.type)) {
          key = 'product'
        } else if ([22, 28, 31].includes(this.data.type)) {
          key = 'business'
        } else if ([35, 36, 37].includes(this.data.type)) {
          key = 'invoice'
        } else if ([41].includes(this.data.type)) {
          key = 'knowledge'
        }
      }

      return typesObj[key]
    },

    leftContent() {
      return {
        1: `${this.data.realname} 将`,
        2: `${this.data.realname} 邀请您参与`,
        3: `${this.data.realname} 将`,
        4: `${this.data.realname} 评论了您的`,
        5: `${this.data.realname} 将日志`,
        6: `${this.data.realname} 拒绝您的`,
        7: `${this.data.realname} 已经审核通过您的`,
        8: '您有一个新公告',
        9: `${this.data.realname} 邀请您参与`,
        10: `${this.data.realname} 拒绝您的`,
        11: `${this.data.realname} 已经审核通过您的`,
        12: `${this.data.realname} 拒绝您的`,
        13: `${this.data.realname} 已经审核通过您的`,
        14: `${this.data.realname} 导入客户数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        15: `${this.data.realname} 取消导入客户数据，已导入${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        16: `${this.data.realname} 导入联系人数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        17: `${this.data.realname} 取消导入联系人数据，已导入${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        18: `${this.data.realname} 导入线索数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        19: `${this.data.realname} 取消导入线索数据，已导入${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        20: `${this.data.realname} 导入产品数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        21: `${this.data.realname} 取消导入产品数据，已导入${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        22: `${this.data.realname} 将您添加为商机`,
        23: `${this.data.realname} 将您添加为客户`,
        24: `${this.data.realname} 将您添加为合同`,
        25: `${this.data.realname} 提交了`,
        26: `${this.data.realname} 提交了`,
        27: `${this.data.realname} 提交了`,
        28: `${this.data.realname} 退出了您商机`,
        29: `${this.data.realname} 退出了您客户`,
        30: `${this.data.realname} 退出了您合同`,
        31: `${this.data.realname} 将您移出了商机`,
        32: `${this.data.realname} 将您移出了客户`,
        33: `${this.data.realname} 将您移出了合同`,
        34: `${this.data.realname} 回复了您评论的日志`,
        35: `${this.data.realname} 拒绝您的`,
        36: `${this.data.realname} 已经审核通过您的`,
        37: `${this.data.realname} 提交了`,
        41: `${this.data.realname} 将文档`,
        50: `${this.data.realname} 导入员工数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        53: `${this.data.realname} 提交了`,
        54: `${this.data.realname} 拒绝您的`,
        55: `${this.data.realname} 已经审核通过您的`,
        56: `${this.data.realname} 提交了`,
        57: `${this.data.realname} 拒绝您的`,
        58: `${this.data.realname} 已经审核通过您的`,
        59: `${this.data.realname} 提交了`,
        60: `${this.data.realname} 拒绝您的`,
        61: `${this.data.realname} 已经审核通过您的`,
        62: `${this.data.realname} 提交了`,
        63: `${this.data.realname} 拒绝您的`,
        64: `${this.data.realname} 已经审核通过您的`,
        65: `${this.data.realname} 提交了`,
        66: `${this.data.realname} 拒绝您的`,
        67: `${this.data.realname} 已经审核通过您的`,
        68: `${this.data.realname} 提交了`,
        69: `${this.data.realname} 拒绝您的`,
        70: `${this.data.realname} 已经审核通过您的`,
        71: `${this.data.realname} 提交了`,
        72: `${this.data.realname} 拒绝您的`,
        73: `${this.data.realname} 已经审核通过您的`,
        74: `${this.data.realname} 提交了`,
        75: `${this.data.realname} 拒绝您的`,
        76: `${this.data.realname} 已经审核通过您的`,
        77: `${this.data.realname} 点赞了您的`,
        80: `${this.data.realname} 更新了您`,
        81: `${this.data.realname} 导入定薪数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        82: `${this.data.realname} 导入调薪数据${
          this.data.title
        }条，${this.getImportContent(this.data)}`,
        83: `${this.data.realname} 邀请您填写`,
        84: `${this.data.realname} 已经审核通过您的`,
        85: `${this.data.realname} 拒绝您的`,
        86: `${this.data.realname} 提交了`,
        // 人资绩效考核
        87: '您有新的绩效目标',
        88: `待确认${this.data.realname}的绩效目标`,
        89: `待评定${this.data.realname}的考核`,
        90: '待确认考核结果',
        91: '您的绩效考核',
        92: '您的绩效目标',
        93: `您评定的${this.data.realname}的考核`,
        94: '您发起的考核',
        95: '您发起的考核',
        96: '您发起的考核',
        97: `${this.data.realname}已为您开通`,
        98: '您的',
        99: `您有新的面试安排，候选人${this.data.title}`,
        120: `${this.data.realname}将您添加为联系人`,
        121: `${this.data.realname}将您添加为回款`,
        122: `${this.data.realname}退出了您联系人`,
        123: `${this.data.realname}退出了您回款`,
        124: `${this.data.realname}将您移出了联系人`,
        125: `${this.data.realname}将您移出了回款`,
        133: `${this.data.realname}提交了`,
        134: `${this.data.realname}通过了`,
        135: `${this.data.realname}拒绝了`,
        136: `${this.data.realname}评论了`,
        137: `${this.data.realname}评论了`
      }[this.data.type]
    },

    centerCotent() {
      // 导入提示与其他不一样
      if (this.isImportType) {
        // title 是总数 content 是错误数据 valid 错误文件是否有效 1 有效 0 失效
        const list = this.data.content.split(',') || []
        const errSize = Number(list[0] || 0)
        if (errSize > 0) {
          return this.data.valid === 0 ? '已失效' : '点击下载错误数据'
        }
        return ''
      } else {
        if (this.data.type === 80) {
          const datas = this.data.content.split(',')
          if (datas && datas.length > 1) {
            return `《${datas[0]}年${datas[1]}月的工资条》`
          }
        } else if (this.data.type === 83) {
          return '《我的档案》'
        } else if (this.data.type === 97) {
          return '人力资源'
        } else if (this.data.type === 99) {
          return ''
        }
        return `《${this.data.title}》`
      }
    },

    isInvalid() {
      if (this.isImportType) {
        // title 是总数 content 是错误数据 valid 错误文件是否有效 1 有效 0 失效
        return this.data.valid == 0
      } else {
        return false
      }
    },

    /**
     * 是导入type
     * 50 人资导入类型
     */
    isImportType() {
      return (
        (this.data.type >= 14 && this.data.type <= 21) ||
        this.data.type == 50 ||
        this.data.type == 81 ||
        this.data.type == 82
      )
    },

    rightContent() {
      return (
        {
          1: '任务分配给您，请及时查看',
          2: '任务，请及时查看',
          3: '任务标记结束',
          4: '日志，请及时查看',
          5: '发送给您，请及时查看',
          6: '，请及时处理',
          7: '，请及时查看',
          8: '，请及时查看',
          9: '的日程，请及时查看',
          10: '，请及时处理',
          11: '合同，请及时查看',
          12: '，请及时处理',
          13: '回款，请及时查看',
          14: '',
          15: '',
          16: '',
          17: '',
          18: '',
          19: '',
          20: '',
          21: '',
          22: '的成员',
          23: '的成员',
          24: '的成员',
          25: '，请及时处理',
          26: '合同审批，请及时处理',
          27: '回款审批，请及时处理',
          28: '的团队',
          29: '的团队',
          30: '的团队',
          31: '的团队',
          32: '的团队',
          33: '的团队',
          34: `：“${this.data.content}”，请及时查看`,
          35: '，请及时处理',
          36: '发票审批，请及时查看',
          37: '发票审批，请及时处理',
          41: '分享给您，请及时查看',
          53: '采购订单审批，请及时处理',
          54: '，请及时处理',
          55: '采购订单，请及时查看',
          56: '采购退货单审批，请及时处理',
          57: `采购退货单审批，拒绝理由：“${this.data.content}”，请及时处理`,
          58: '采购退货单，请及时查看',
          59: '销售订单审批，请及时处理',
          60: `销售订单审批，拒绝理由：“${this.data.content}”，请及时处理`,
          61: '销售订单，请及时查看',
          62: '销售退货单审批，请及时处理',
          63: `销售退货单审批，拒绝理由：“${this.data.content}”，请及时处理`,
          64: '销售退货单，请及时查看',
          65: '付款单审批，请及时处理',
          66: `付款单审批，拒绝理由：“${this.data.content}”，请及时处理`,
          67: '付款单，请及时查看',
          68: '回款单审批，请及时处理',
          69: `回款单审批，拒绝理由：“${this.data.content}”，请及时处理`,
          70: '回款单，请及时查看',
          71: '盘点审批，请及时处理',
          72: `盘点审批，拒绝理由：“${this.data.content}”，请及时处理`,
          73: '盘点，请及时查看',
          74: '调拨审批，请及时处理',
          75: `调拨审批，拒绝理由：“${this.data.content}”，请及时处理`,
          76: '调拨，请及时查看',
          77: '日志，请及时查看',
          80: `，有问题请及时与${this.data.realname}反馈`,
          81: '',
          82: '',
          83: '，请及时处理',
          84: '薪资审批，请及时查看',
          85: `薪资审批，拒绝理由：“${this.data.content}”，请及时处理`,
          86: '薪资审批，请及时处理',
          // 人资绩效考核
          87: '待填写，请及时处理',
          88: '，请及时处理',
          89: '，请及时处理',
          90: '，请及时处理',
          91: '已完成，请及时查看',
          92: `被${this.data.content}驳回，请重新填写`,
          93: `被${this.data.content}驳回，请重新评定`,
          94: '已全部完成填写，请及时开启评定',
          95: '已全部完成评定，请及时开启结果确认',
          96: '已完成结果确认，请及时归档',
          97: '员工端，请及时查看',
          98: '已生成，请及时查看',
          99: '，请及时查看',
          120: '的成员',
          121: '的成员',
          122: '的团队',
          123: '的团队',
          124: '的团队',
          125: '的团队',
          132: '导出成功',
          136: '任务，请及时查看',
          137: '任务，请及时查看'
        }[this.data.type] || this.getRightContent(this.data.type)
      )
    },

    // 简介字段
    contentFields() {
      return this.getContentFields()
    },

    // 展示文件简介
    showBrief() {
      // 日志 4 5 77
      return [4, 5, 77].includes(this.data.type)
    }
  },
  watch: {},
  mounted() {},

  beforeUnmount() {},
  methods: {
    enterDetail() {
      if (this.isInvalid) {
        return
      }

      // 是导入提醒
      if (this.isImportType) {
        this.$emit('download', this.data.messageId, this.dataIndex)
      } else {
        // 未读触发读
        if (this.data.isRead == 0) {
          this.$emit('read', this.data.messageId, this.dataIndex)
        }

        let type = this.typeObj.type // 默认type
        if (type === 'stage_examine') {
          // 根据content 内容的type 校准为 CRM模块关键词
          const contentObj = JSON.parse(this.data.content) || {}
          type = crmTypeModel.typeToKeyData[contentObj.type]
        }
        this.$emit('detail', type, this.data.typeId, this.dataIndex, this.data)
      }
    },

    /**
     * @description: 相关详情查看
     * @param {*}
     * @return {*}
     */
    relativeClick(item) {
      this.$emit('detail', item.type, item.id, this.dataIndex, this.data)
    },

    /**
     * 标记已读
     */
    messageReadClick() {
      if (this.data.isRead == 0) {
        this.$emit('read', this.data.messageId, this.dataIndex)
      }
    },

    /**
     * 消息删除
     */
    messageDeleteClick() {
      this.$emit('delete', this.data.messageId, this.dataIndex)
    },

    getImportContent({ title, content }) {
      const countList = [14, 15, 16, 17, 18, 19, 20, 21, 50, 81, 82]
      if (!countList.includes(this.data.type)) {
        return
      }
      const list = content.split(',') || []
      const totalSize = Number(title || '0')
      const updateSize = Number(list[1] || '0')
      const errSize = Number(list[0] || '0')
      return `覆盖${updateSize}条，导入成功${
        totalSize - errSize
      }条，导入失败${errSize}条。`
    },

    /**
     * @description: 获取标题
     * @param {*}
     * @return {*}
     */
    getTitle() {
      return {
        1: '任务分配提醒',
        2: '任务邀请提醒',
        3: '任务完成提醒',
        4: '日志评论提醒',
        5: '日志发送提醒',
        6: '审批拒绝提醒',
        7: '审批通过提醒',
        8: '公告提醒',
        9: '日程提醒',
        10: '审批拒绝提醒',
        11: '审批通过提醒',
        12: '审批拒绝提醒',
        13: '审批通过提醒',
        14: '导入提醒',
        15: '取消导入提醒',
        16: '导入提醒',
        17: '取消导入提醒',
        18: '导入提醒',
        19: '取消导入提醒',
        20: '导入提醒',
        21: '取消导入提醒',
        22: '添加团队成员提醒',
        23: '添加团队成员提醒',
        24: '添加团队成员提醒',
        25: '待审批提醒',
        26: '待审批提醒',
        27: '待审批提醒',
        28: '退出团队成员提醒',
        29: '退出团队成员提醒',
        30: '退出团队成员提醒',
        31: '移出团队提醒',
        32: '移出团队提醒',
        33: '移出团队提醒',
        34: '日志评论提醒',
        35: '审批拒绝提醒',
        36: '审批通过提醒',
        37: '待审批提醒',
        41: '文档分享提醒',
        50: '导入提醒',
        53: '待审批提醒',
        54: '审批拒绝提醒',
        55: '审批通过提醒',
        56: '待审批提醒',
        57: '审批拒绝提醒',
        58: '审批通过提醒',
        59: '待审批提醒',
        60: '审批拒绝提醒',
        61: '审批通过提醒',
        62: '待审批提醒',
        63: '审批拒绝提醒',
        64: '审批通过提醒',
        65: '待审批提醒',
        66: '审批拒绝提醒',
        67: '审批通过提醒',
        68: '待审批提醒',
        69: '审批拒绝提醒',
        70: '审批通过提醒',
        71: '待审批提醒',
        72: '审批拒绝提醒',
        73: '审批通过提醒',
        74: '待审批提醒',
        75: '审批拒绝提醒',
        76: '审批通过提醒',
        77: '日志点赞提醒',
        80: '个人档案更新提醒',
        81: '导入提醒',
        82: '导入提醒',
        83: '个人档案填写提醒',
        84: '审批通过提醒',
        85: '审批拒绝提醒',
        86: '待审批提醒',
        // 人资绩效考核
        87: '考核目标待填写提醒',
        88: '考核目标待确认提醒',
        89: '考核目标待评定提醒',
        90: '考核结果待确认提醒',
        91: '考核完成提醒',
        92: '考核目标被驳回提醒',
        93: '考核评定被驳回提醒',
        94: '考核评定待开启提醒',
        95: '考核结果确认待开启提醒',
        96: '考核待归档提醒',
        97: '员工端开通提醒',
        98: '社保核算提醒', // 员工社保提醒
        99: '候选人面试提醒',
        120: '添加团队成员提醒',
        121: '添加团队成员提醒',
        122: '退出团队成员提醒',
        123: '退出团队成员提醒',
        124: '移出团队提醒',
        125: '移出团队提醒',
        133: '待审批提醒',
        134: '审批通过提醒',
        135: '审批拒绝提醒'
      }[this.data.type]
    },

    /**
     * @description: 获取特殊的右侧内容
     * @return {*}
     */
    getRightContent() {
      const { content, type } = this.data
      if ([133, 134, 135].includes(type)) {
        const contentObj = JSON.parse(content) || {}
        const typeName = crmTypeModel.typeToNameData[contentObj.type]
        return {
          133: `${typeName}阶段审批，请及时处理`,
          134: `${typeName}阶段审批，请及时查看`,
          135: `${typeName}阶段审批，请及时处理`
        }[type]
      }
      return ''
    },

    /**
     * @description: 获取概要
     * @param {*}
     * @return {*}
     */
    getBrief() {
      const { type } = this.data
      // 136 137 任务评论 4 日志评论
      if ([4, 136, 137].includes(type)) {
        return `评论内容 ${this.data.content || ''}`
      } else if (type == 5) {
        return `日志内容 ${this.data.content || ''}`
      }
      return ''
    },

    /**
     * @description: 获取展示字段
     * formType relative 相关
     * hasDetails true 能查看  module 大模块 type 是小模块
     * @param {*}
     * @return {*}
     */
    getContentFields() {
      const { type, content, title } = this.data
      const contentObj = strToJSON(content) || {}
      if (type == 9) {
        // 日程
        return [
          { name: '日程内容', formType: 'text', value: contentObj.content },
          { name: '日程类型', formType: 'text', value: contentObj.type },
          {
            name: '起止时间',
            formType: 'text',
            value: `${timeToFormatTime(
              contentObj.startTime,
              'YYYY-MM-DD HH:mm:ss'
            )}-${timeToFormatTime(contentObj.endTime, 'YYYY-MM-DD HH:mm:ss')}`
          },
          {
            name: '关联业务',
            formType: 'relative',
            value: this.getRelativeList(contentObj)
          }
        ]
      } else if (type == 1 || type == 2 || type == 3) {
        // 任务 分配 邀请 完成
        return [
          { name: '任务标题', formType: 'text', value: title },
          { name: '开始时间', formType: 'text', value: contentObj.startTime },
          { name: '结束时间', formType: 'text', value: contentObj.endTime },
          {
            name: '关联业务',
            formType: 'relative',
            value: this.getRelativeList(contentObj)
          }
        ]
      } else if (type == 10 || type == 11 || type == 26) {
        // 合同 拒绝 通过 待审核
        const customer = isObject(contentObj.customer)
          ? contentObj.customer
          : null
        const products = isArray(contentObj.products) ? contentObj.products : []
        const data = [
          { name: '合同名称', formType: 'text', value: title },
          { name: '合同金额', formType: 'text', value: contentObj.money },
          {
            name: '关联客户',
            module: 'crm',
            hasDetails: true,
            type: 'customer',
            id: customer ? customer.id : '',
            value: customer ? customer.name : ''
          },
          {
            name: '关联产品',
            formType: 'text',
            value: products.map((item) => item.name).join('、')
          }
        ]
        if (type == 10) {
          data.push({
            name: '拒绝理由',
            formType: 'text',
            value: contentObj.remarks
          })
        }
        return data
      } else if (type == 12 || type == 13 || type == 27) {
        // 回款 拒绝 通过 待审核
        const customer = isObject(contentObj.customer)
          ? contentObj.customer
          : null
        const contract = isObject(contentObj.contract)
          ? contentObj.contract
          : null
        const data = [
          { name: '回款名称', formType: 'text', value: title },
          { name: '回款金额', formType: 'text', value: contentObj.money },
          {
            name: '关联客户',
            module: 'crm',
            hasDetails: true,
            type: 'customer',
            id: customer ? customer.id : '',
            value: customer ? customer.name : ''
          },
          {
            name: '关联合同',
            module: 'crm',
            hasDetails: true,
            type: 'contract',
            id: contract ? contract.id : '',
            value: contract ? contract.name : ''
          }
        ]
        if (type == 12) {
          data.push({
            name: '拒绝理由',
            formType: 'text',
            value: contentObj.remarks
          })
        }
        return data
      } else if (type == 35 || type == 36 || type == 37) {
        // 发票 拒绝 通过 待审核
        const customer = isObject(contentObj.customer)
          ? contentObj.customer
          : null
        const contract = isObject(contentObj.contract)
          ? contentObj.contract
          : null
        const data = [
          { name: '发票名称', formType: 'text', value: title },
          { name: '开票金额', formType: 'text', value: contentObj.money },
          {
            name: '关联客户',
            module: 'crm',
            hasDetails: true,
            type: 'customer',
            id: customer ? customer.id : '',
            value: customer ? customer.name : ''
          },
          {
            name: '关联合同',
            module: 'crm',
            hasDetails: true,
            type: 'contract',
            id: contract ? contract.id : '',
            value: contract ? contract.name : ''
          },
          { name: '开票日期', formType: 'text', value: contentObj.createTime }
        ]
        if (type == 35) {
          data.push({
            name: '拒绝理由',
            formType: 'text',
            value: contentObj.remarks
          })
        }
        return data
      } else if (type == 6 || type == 7 || type == 25) {
        // OA 拒绝 通过 待审核
        const oaType = contentObj.type
        let data = []
        if (oaType == 6) {
          // 借款
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '借款事由', formType: 'text', value: contentObj.content },
            { name: '借款金额', formType: 'text', value: contentObj.money }
          ]
        } else if (oaType == 2) {
          // 请假
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '请假事由', formType: 'text', value: contentObj.content },
            {
              name: '请假起止时间',
              formType: 'text',
              value: `${timeToFormatTime(
                contentObj.startTime,
                'YYYY-MM-DD HH:mm:ss'
              )}-${timeToFormatTime(contentObj.endTime, 'YYYY-MM-DD HH:mm:ss')}`
            },
            { name: '请假时长', formType: 'text', value: contentObj.duration }
          ]
        } else if (oaType == 3) {
          // 出差
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '出差事由', formType: 'text', value: contentObj.content },
            { name: '出差总天数', formType: 'text', value: contentObj.duration }
          ]
        } else if (oaType == 4) {
          // 加班
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '加班原因', formType: 'text', value: contentObj.content },
            {
              name: '加班起止时间',
              formType: 'text',
              value: `${timeToFormatTime(
                contentObj.startTime,
                'YYYY-MM-DD HH:mm:ss'
              )}-${timeToFormatTime(contentObj.endTime, 'YYYY-MM-DD HH:mm:ss')}`
            },
            { name: '加班总天数', formType: 'text', value: contentObj.duration }
          ]
        } else if (oaType == 5) {
          // 差旅
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '差旅事由', formType: 'text', value: contentObj.content },
            { name: '报销总金额', formType: 'text', value: contentObj.money }
          ]
        } else {
          // 1 普通审批 和 自定义审批
          data = [
            {
              name: '审批类型',
              formType: 'text',
              value: contentObj.examineName
            },
            { name: '审批内容', formType: 'text', value: contentObj.content }
          ]
        }

        if (type == 6) {
          data.push({
            name: '拒绝理由',
            formType: 'text',
            value: contentObj.remarks
          })
        }
        return data
      } else if (type == 99) {
        // 安排面试
        return [
          { name: '面试时间', formType: 'text', value: contentObj.createTime },
          { name: '面试轮次', formType: 'text', value: contentObj.content }
        ]
      } else if ([133, 134, 135].includes(type)) {
        const temps = [
          { name: '阶段名称', formType: 'text', value: contentObj.name }
        ]

        if (type === 135)
          temps.push({
            name: '拒绝理由',
            formType: 'text',
            value: contentObj.remarks
          })
        return temps
      }
      return []
    },

    /**
     * @description: 获取关联信息数据
     * @param {*}
     * @return {*}
     */
    getRelativeList(data) {
      const typeList = [
        {
          fieldName: 'customers',
          type: 'customer',
          label: '客户'
        },
        {
          fieldName: 'contactss',
          type: 'contacts',
          label: '联系人'
        },
        {
          fieldName: 'businesss',
          type: 'business',
          label: '商机'
        },
        {
          fieldName: 'contracts',
          type: 'contract',
          label: '合同'
        }
      ]
      const relativeList = []
      for (let index = 0; index < typeList.length; index++) {
        const typeItem = typeList[index]
        const list = data[typeItem.fieldName]
        if (isArray(list) && list.length > 0) {
          list.forEach((item) => {
            relativeList.push({
              ...typeItem,
              ...item
            })
          })
        }
      }

      return relativeList
    }
  }
}
</script>

<style lang="scss" scoped>
.message-cell {
  position: relative;
  padding: 16px 24px 8px;
  font-size: 14px;
  line-height: 1.5;

  &-title {
    color: $--color-text-regular;
  }

  &-des {
    margin-top: 4px;
    color: $--color-text-primary;
  }

  &__hd {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    margin-right: 16px;
    line-height: 28px;
    text-align: center;
    background-color: $--color-n90;
    border-radius: 14px;

    .wk {
      font-size: 13px;
      color: white;
    }
  }

  &__bd {
    flex: 1;
    overflow: hidden;
  }

  &__ft {
    position: relative;
    flex-shrink: 0;
    width: 100px;
    margin-left: 24px;
    color: $--color-text-regular;
    text-align: right;

    .delete-btn {
      padding: 0;
      visibility: hidden;
    }

    :deep(.check-btn) {
      display: flex;
      padding: 3px;
      cursor: auto;
      background-color: transparent;
      border-radius: 8px;

      span {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: $--color-n90;
        border-radius: 4px;
      }

      &.is-unread {
        cursor: pointer;

        span {
          background-color: $--color-primary;
        }

        &:hover {
          background-color: rgba($color: $--color-b50, $alpha: 0.9);
        }
      }
    }
  }

  &:hover {
    background-color: #f7f8fa;

    .delete-btn {
      visibility: visible;
    }
  }
}

.click-content {
  color: $--color-primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.is-invalid {
  color: $--color-text-secondary;
  pointer-events: none;
  cursor: initial;
}

.brief {
  margin-top: 4px;
  color: $--color-text-secondary;

  &-cell {
    display: flex;
    color: $--color-text-secondary;

    & + & {
      margin-top: 4px;
    }
  }

  &-label {
    flex-shrink: 0;
  }

  &-value {
    flex: 1;
    padding-left: 8px;

    &.is-visit {
      color: $--color-primary;
      cursor: pointer;
    }
  }
}

.relative {
  &-item {
    span:nth-child(2) {
      color: $--color-primary;
      cursor: pointer;
    }

    & + & {
      margin-top: 4px;
    }
  }
}
</style>
