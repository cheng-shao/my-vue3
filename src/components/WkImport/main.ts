import WkImportVue from './index.vue'

const WkImport = {} as any

WkImport.install = (Vue) => {
  const WkCRMImportConstructor = Vue.extend(WkImportVue)
  const instance = new WkCRMImportConstructor({
    el: document.createElement('div')
  })
  document.body.appendChild(instance.$el)

  Vue.prototype.$wkImport = instance
}

export default WkImport
