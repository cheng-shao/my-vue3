<template>
  <div class="tag">
    <flexbox class="header">
      <span class="title">选择标签</span>
      <i class="el-icon-close close" @click="close" />
    </flexbox>
    <div class="body">
      <div class="search">
        <el-input
          v-model="searchInput"
          prefix-icon="el-icon-search"
          placeholder="搜索标签"
        />
      </div>
      <div v-empty="options.length === 0" class="content">
        <div v-for="(item, index) in showList" :key="index" class="group">
          <div class="group-name">{{ item.name }}</div>
          <flexbox wrap="wrap" class="group-content">
            <div
              v-for="(subItem, subIndex) in item.labelList"
              :key="subIndex"
              :style="{ 'background-color': subItem.color }"
              class="group-item"
              @click="select(subItem)"
            >
              {{ subItem.name }}
              <span v-if="subItem.isCheck" class="clearable">
                <i class="el-icon-close" @click.stop="clear(subItem)" />
              </span>
            </div>
          </flexbox>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click.stop="submit">确定</el-button>
      <el-button @click.stop="close">取消</el-button>
    </div>
  </div>
</template>

<script>
import PinyinMatch from 'pinyin-match'
import { objDeepCopy } from '../../../utils'

export default {
  name: 'Tag', // 标签选择
  emits: ['update:show', 'changeCheckout'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedData: {
      // 选中数据
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      // 选项
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      list: [], // 列表数据
      searchInput: '' // 搜索值
    }
  },
  computed: {
    // 筛选值
    showList() {
      const showList = []
      this.list.forEach((item) => {
        const obj = {
          name: item.name,
          labelList: item.labelList.filter((subItem) => {
            return PinyinMatch.match(subItem.name || '', this.searchInput)
          })
        }
        showList.push(obj)
      })
      return showList
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.checkItems(this.selectedData)
        }
      },
      immediate: true
    },
    selectedData: {
      handler(val) {
        if (this.show) {
          this.checkItems(val)
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 标记勾选
     */
    checkItems(items) {
      this.list = objDeepCopy(this.options)
      this.list.forEach((item) => {
        item.labelList.forEach((subItem) => {
          items.forEach((thirdItem) => {
            if (thirdItem.name == subItem.name) {
              subItem.isCheck = true
            }
          })
        })
      })
    },
    /**
     * 选择标签
     */
    select(subItem) {
      this.$set(subItem, 'isCheck', true)
      this.$forceUpdate()
    },
    /**
     * 取消选择
     */
    clear(subItem) {
      this.$set(subItem, 'isCheck', false)
      this.$forceUpdate()
    },
    /**
     * 关闭
     */
    close() {
      this.$emit('update:show', false)
    },
    /**
     * 确定
     */
    submit() {
      const selectedData = []
      this.list.forEach((item) => {
        item.labelList.forEach((subItem) => {
          if (subItem.isCheck) {
            selectedData.push({ name: subItem.name, value: subItem.color })
          }
        })
      })
      this.$emit('changeCheckout', selectedData)
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  .header {
    height: 45px;
    padding: 0 15px;
    line-height: 40px;
    border-bottom: 1px solid $--border-color-base;

    .title {
      flex: 1;
      font-size: 16px;
    }

    .close {
      display: block;
      padding: 10px;
      margin-right: -10px;
      font-size: 20px;
      color: #909399;
      cursor: pointer;
    }

    .close:hover {
      color: $--color-primary;
    }
  }

  .body {
    padding: 10px 12px;

    .search {
      :deep(.el-input input) {
        background-color: #f4f4f4;
        border: none;
      }
    }

    .content {
      height: 280px;
      margin: 10px 0;
      overflow-y: auto;

      .group {
        padding: 5px 0;

        &-content {
          margin-top: $--interval-base;
        }

        .group-item {
          position: relative;
          height: 25px;
          padding: 0 20px 0 10px;
          margin: 0 5px 5px 0;
          font-size: 12px;
          line-height: 25px;
          color: #fff;
          cursor: pointer;
          border-radius: $--border-radius-base;

          .clearable {
            position: absolute;
            top: 0;
            right: 2px;

            .el-icon-close {
              margin-left: 5px;
              color: $--color-white;

              &:hover {
                color: $--color-primary;
              }
            }
          }

          // .clearable{
          //   position: absolute;
          //   top: -10px;
          //   right: -6px;
          //   color: $--color-text-secondary;
          //   font-size: 15px;
          //   .el-icon-close{
          //     margin-left:5px;
          //     color:$--color-text-secondary;
          //       &:hover {
          //         color:$--color-text-regular;
          //     }
          //   }
          // }
        }
      }

      :deep(.empty-mask) {
        height: 100px;
      }
    }
  }

  .footer {
    padding: 8px;
    text-align: right;
    background-color: #f7f8fa;
    border-top: 1px solid $--border-color-base;
  }
}
</style>
