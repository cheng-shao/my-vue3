<template>
  <div class="main">
    <div class="main-title">提供反馈</div>
    <div class="main-body feedback">
      <div class="text">
        如果您在使用过程中遇到任何困难或发现任何缺陷，可在此处提出反馈意见或<a
          :href="WKConfig.contactUrl"
          target="_blank"
          >联系我们</a
        >，悟空会尽快做出回应，给您更好的使用体验。
      </div>
      <div class="field-item">
        <div class="lable">我的反馈关于：</div>
        <el-select
          v-model="feedbackValue"
          multiple
          clearable
          placeholder="选择一个选项"
        >
          <el-option-group
            v-for="group in feedbackOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </div>
      <div class="field-item">
        <div class="lable">我的反馈是：</div>
        <el-input
          v-model="idea"
          style="max-width: 500px"
          :rows="4"
          :maxlength="2000"
          type="textarea"
          placeholder="告诉我们你的想法"
        />
      </div>
      <div class="field-item">
        <add-image-list
          :data="imgFiles"
          @delete="deleteImage"
          @delete-all="deleteAllFile(2)"
          @upload="uploadFile"
        />
      </div>
      <div class="field-item">
        <flexbox>
          <el-checkbox v-model="checked">悟空CRM可就此反馈联系我。</el-checkbox>
          <!-- <span class="link" @click="openPrivacy()">隐私政策</span> -->
          <!-- <el-button type="text">隐私政策</el-button> -->
        </flexbox>
      </div>
      <div class="feedback-footer">
        <el-button type="primary" @click="sendClick">发送反馈</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feedback', // 问题反馈
  components: {},
  props: {},
  data() {
    return {
      feedbackValue: '', // 反馈关于
      feedbackOptions: [
        {
          label: '分组标题',
          options: [
            {
              value: 1,
              label: 'UI界面、布局'
            },
            {
              value: 2,
              label: '技术问题'
            },
            {
              value: 3,
              label: '计费和定价'
            },
            {
              value: 4,
              label: '产品问题'
            }
          ]
        },
        {
          label: '产品',
          options: [
            {
              value: 5,
              label: '仪表盘'
            },
            {
              value: 6,
              label: '客户'
            },
            {
              value: 7,
              label: '联系人'
            },
            {
              value: 8,
              label: '商机'
            },
            {
              value: 9,
              label: '合同'
            },
            {
              value: 10,
              label: '回款'
            },
            {
              value: 11,
              label: '其他'
            }
          ]
        }
      ],
      idea: '', // 想法
      checked: false, // 反馈勾选
      imgFiles: [], // 图片信息
      batchId: guid() // 批次ID
    }
  },
  computed: {},
  methods: {
    /**
     * 访问网站
     */
    target() {},

    /**
     * 打开隐私政策
     */
    openPrivacy() {},

    /**
     * 发送
     */
    sendClick() {},

    /**
     * 图片附件删除
     */
    deleteImage(item, index) {
      this.deleteImgOrFile('image', item, index)
    },

    deleteImgOrFile(type, item, index) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crmFileDeleteAPI({
            id: item.fileId
          })
            .then((res) => {
              if (type == 'image') {
                this.imgFiles.splice(index, 1)
              }
              this.$message.success('操作成功')
            })
            .catch(() => {})
        })
        .catch(() => {})
    },

    /**
     * 删除全部 type 1 是附件 2 是图片
     */
    deleteAllFile(type) {
      if (this.batchId) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileRemoveByBatchIdAPI({
              batchId: this.batchId,
              type
            })
              .then((res) => {
                if (type == 2) {
                  this.imgFiles = []
                }
                this.$message.success('操作成功')
              })
              .catch(() => {})
          })
          .catch(() => {})
      }
    },

    /**
     * 图片选择出发
     */
    uploadFile(event) {
      const files = event.target.files
      if (files.length) {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (
            file.type.indexOf('image') == -1 &&
            this.showRelativeType == 'img'
          ) {
            this.$message.error('请上传正确的文件类型')
            return
          }
        }

        const type = event.target.accept == 'image/*' ? 'img' : 'file'
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          this.uploadFileRequest(file, type)
        }
        event.target.value = ''
      }
    },

    /**
     * 文件上传
     */
    uploadFileRequest(file, type, result) {
      this.$wkUploadFile
        .upload({
          file: file,
          params: {
            type: type,
            batchId: this.batchId
          }
        })
        .then(({ res }) => {
          const data = res.data || {}
          data.size = fileSize(file.size)
          if (type == 'img') {
            if (this.imgFiles.length >= 5) {
              this.$message.warning('只能上传5张图片！')
              return
            }
            this.imgFiles.push(data)
          } else {
            data['icon'] = getFileTypeIcon(file)
            // this.files.push(data)
          }
          if (result) {
            result()
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';

.feedback {
  .text {
    margin-bottom: 8px;
    line-height: 17px;
    color: $--color-black;

    .link {
      color: $--color-primary;
      cursor: pointer;
    }

    a {
      color: $--color-primary;
    }
  }

  .field-item {
    margin-top: 16px;

    .lable {
      margin-bottom: 8px;
      font-size: 12px;
      color: $--color-n300;
    }

    .el-select {
      width: 100%;
    }

    .el-checkbox__label {
      color: $--color-black;
    }

    .link {
      color: $--color-primary;
      cursor: pointer;
    }

    .img-cont {
      padding: 0;
    }
  }

  &-footer {
    margin-top: 16px;
  }
}

.el-select-group__wrap:not(:last-of-type)::after {
  display: none;
}
</style>
