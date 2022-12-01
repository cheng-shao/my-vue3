<template>
  <div v-show="visible" class="full-container">
    <component
      :is="tabName"
      v-if="id && showDetail"
      :id="id"
      v-bind="$attrs"
      :crm-type="crmType"
      :model-data="modelData"
      class="d-view"
      @handle="detailHandle"
      @hide-view="hiddenView"
    />
  </div>
</template>

<script type="text/javascript">
import { getMaxIndex } from '@/utils/index'
import LeadsDetail from '@/views/crm/leads/Detail'
import CustomerDetail from '@/views/crm/customer/Detail'
import ContactsDetail from '@/views/crm/contacts/Detail'
import BusinessDetail from '@/views/crm/business/Detail'
import ContractDetail from '@/views/crm/contract/Detail'
import ProductDetail from '@/views/crm/product/Detail'
import ReceivablesDetail from '@/views/crm/receivables/Detail'
import ReceivablesPlanDetail from '@/views/crm/receivablesPlan/Detail'
import ExamineDetail from '@/views/oa/taskExamine/superExamine/Detail'
import TaskDetail from '@/views/oa/taskExamine/task/components/TaskDetail'
import LogDetail from '@/views/oa/workLog/components/LogDetail'
import LogList from '@/views/oa/workLog/components/LogList'
import NoticeDetail from '@/views/oa/notice/NoticeDetail'
import VisitDetail from '@/views/crm/visit/Detail'
import InvoiceDetail from '@/views/crm/invoice/Detail'

export default {
  name: 'CRMFullScreenDetail', // 客户管理下 重要提醒 回款计划提醒
  emits: ['update:visible', 'handle'],
  components: {
    LeadsDetail,
    CustomerDetail,
    ContactsDetail,
    BusinessDetail,
    ContractDetail,
    ProductDetail,
    ReceivablesDetail,
    ReceivablesPlanDetail,
    ExamineDetail,
    TaskDetail,
    LogDetail,
    NoticeDetail,
    VisitDetail,
    InvoiceDetail,
    LogList
  },
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    /** 呼出信息 */
    modelData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showDetail: false
    }
  },
  computed: {
    tabName() {
      if (this.crmType == 'leads') {
        return 'LeadsDetail'
      } else if (this.crmType == 'customer') {
        return 'CustomerDetail'
      } else if (this.crmType == 'contacts') {
        return 'ContactsDetail'
      } else if (this.crmType == 'business') {
        return 'BusinessDetail'
      } else if (this.crmType == 'contract') {
        return 'ContractDetail'
      } else if (this.crmType == 'product') {
        return 'ProductDetail'
      } else if (this.crmType == 'receivables') {
        return 'ReceivablesDetail'
      } else if (this.crmType == 'receivablesPlan') {
        return 'ReceivablesPlanDetail'
      } else if (this.crmType == 'examine') {
        return 'ExamineDetail'
      } else if (this.crmType == 'task') {
        return 'TaskDetail'
      } else if (this.crmType == 'log') {
        return 'LogDetail'
      } else if (this.crmType == 'list') {
        return 'LogList'
      } else if (this.crmType == 'announcement') {
        return 'NoticeDetail'
      } else if (this.crmType == 'visit') {
        return 'VisitDetail'
      } else if (this.crmType == 'invoice') {
        return 'InvoiceDetail'
      }
      return ''
    }
  },
  watch: {
    visible(val) {
      this.showDetail = val
      if (val) {
        document.body.appendChild(this.$el)
        this.$el.style.zIndex = getMaxIndex()
      }
    },
    showDetail(val) {
      if (!val) {
        setTimeout(() => {
          this.$emit('update:visible', false)
        }, 350)
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.appendChild(this.$el)
      this.$el.style.zIndex = getMaxIndex()
    }
  },

  beforeUnmount() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    hiddenView() {
      this.showDetail = false
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (
        data.type === 'alloc' ||
        data.type === 'get' ||
        data.type === 'transfer' ||
        data.type === 'transform' ||
        data.type === 'delete' ||
        data.type === 'put_seas'
      ) {
        this.showDetail = false
      }
      this.$emit('handle', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.full-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.3);
}

.d-view {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: $--detail-width-base;
  min-width: 950px;
}
</style>
