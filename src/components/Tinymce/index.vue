<template>
  <editor
    v-if="active"
    :id="id"
    ref="mceEditor"
    v-model="dataValue"
    v-bind="$attrs"
    :init="showInit"
    :plugins="showPlugins"
    :toolbar="showToolbar"
    tinymce-script-src="https://www.72crm.com/npm/tinymce/tinymce.min.js"
  />
</template>

<script>
import { webFileSaveAPI } from '@/api/common'
import Editor from '@tinymce/tinymce-vue'

import plugins from './plugins'
import toolbar from './toolbar'
import watermark from './watermark'

let unique = 0

export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  inheritAttrs: false,
  props: {
    /**
     *  apiKey: String,
        cloudChannel: String,
        id: String,
        init: Object,
        initialValue: String,
        inline: Boolean,
        modelEvents: [String, Array],
        plugins: [String, Array],
        tagName: String,
        toolbar: [String, Array],
        value: String,
        disabled: Boolean,
        tinymceScriptSrc: String,
        outputFormat: {
          type: String,
          validator: (prop: string) => prop === 'html' || prop === 'text'
        }
     */
    value: String,
    init: Object,
    height: [String, Number],
    plugins: [String, Array],
    toolbar: [String, Array],
    menubar: [String, Array]
  },
  data() {
    return {
      // https://github.com/tinymce/tinymce-vue/issues/48
      active: false,
      id: this.uuid(),
      dataValue: '',
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es_MX',
        ja: 'ja'
      },
      showInit: {}
    }
  },
  computed: {
    editor() {
      return window.tinymce.get(this.id)
    },

    showToolbar() {
      return this.toolbar != undefined ? this.toolbar : toolbar
    },

    showPlugins() {
      return this.plugins != undefined ? this.plugins : plugins
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val != this.dataValue) {
          this.dataValue = val
        }
      },
      immediate: true,
      deep: true
    },
    dataValue() {
      this.$emit('input', this.dataValue)
    },
    init: {
      handler() {
        this.initTinymce()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.active = true
    })
  },
  methods: {
    initTinymce() {
      const initDefault = {
        skin: 'wukong',
        resize: false,
        branding: false,
        language: this.languageTypeList['zh'],
        menubar: this.menubar ? this.menubar : false,
        body_class: 'panel-body',
        image_advtab: true,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        content_css: ['./static/tinymce/css/tiny-wukong.css'],
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['72crm.com', '5kcrm.com'],
        imagetools_proxy: 'https://www.72crm.com/file.php',
        default_link_target: '_blank',
        link_assume_external_targets: true,
        link_title: false,
        target_list: false,
        quickbars_insert_toolbar: false,
        nonbreaking_force_tab: true,
        convert_urls: false,
        toolbar_mode: 'sliding',
        images_upload_handler: function (blobInfo, success, failure, progress) {
          progress(0)
          webFileSaveAPI({
            file: blobInfo.blob()
          })
            .then((res) => {
              success(res.data.url)
              progress(100)
            })
            .catch(() => {
              failure('出现未知问题，刷新页面，或者联系管理员')
            })
        },
        watermark_click: () => {
          this.addWaterMark()
        },
        ...this.init
      }

      /**
       * statusbar 隐藏底部状态栏
       */

      if (this.height != undefined) {
        initDefault.height = this.height
      }

      this.showInit = initDefault

      // 整合七牛上传
      // images_dataimg_filter(img) {
      //   setTimeout(() => {
      //     const $image = $(img);
      //     $image.removeAttr('width');
      //     $image.removeAttr('height');
      //     if ($image[0].height && $image[0].width) {
      //       $image.attr('data-wscntype', 'image');
      //       $image.attr('data-wscnh', $image[0].height);
      //       $image.attr('data-wscnw', $image[0].width);
      //       $image.addClass('wscnph');
      //     }
      //   }, 0);
      //   return img
      // },
      // images_upload_handler(blobInfo, success, failure, progress) {
      //   progress(0);
      //   const token = _this.$store.getters.token;
      //   getToken(token).then(response => {
      //     const url = response.data.qiniu_url;
      //     const formData = new FormData();
      //     formData.append('token', response.data.qiniu_token);
      //     formData.append('key', response.data.qiniu_key);
      //     formData.append('file', blobInfo.blob(), url);
      //     upload(formData).then(() => {
      //       success(url);
      //       progress(100);
      //     })
      //   }).catch(err => {
      //     failure('出现未知问题，刷新页面，或者联系程序员')
      //     console.log(err);
      //   });
      // },
    },
    uuid() {
      const time = Date.now()
      const random = Math.floor(Math.random() * 1000000000)

      unique++

      return 'wukong_' + random + unique + String(time)
    },

    /**
     * @description: 增加水印
     * @return {*}
     */
    addWaterMark() {
      this.$prompt('请输入水印文字', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{1,20}$/
      })
        .then(({ value }) => {
          const iframeWindow = this.editor.contentWindow
          watermark.init({
            watermark_txt: value,
            window: iframeWindow,
            document: iframeWindow.document
          })
          // 插入完成 触发input 事件
          this.$nextTick(() => {
            this.$emit(
              'input',
              this.editor.getContent({
                format: this.$refs.mceEditor.$props.outputFormat
              })
            )
          })
        })
        .catch(() => {})
    },

    imageSuccessCBK(arr) {
      arr.forEach((v) => {
        this.editor.insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style lang="scss">
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-textarea {
  z-index: -1;
  visibility: hidden;
}

.tox-tinymce-aux {
  z-index: 10001 !important;
}
</style>
