import AutoImport from 'unplugin-auto-import/vite'
import {
  ElementPlusResolver,
  VueUseComponentsResolver
} from 'unplugin-vue-components/resolvers'

export default function autoImportPlugin() {
  // 按需导入
  const autoImport = AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/ // .md
    ],
    imports: [
      'vue',
      'pinia',
      'vue-router',
      '@vueuse/core',
      {
        'element-plus': ['ElLoading', 'ElMessageBox', 'ElMessage'],
        axios: [['default', 'axios']],
        lockr: ['get', 'set', 'rm'],
        'throttle-debounce': ['debounce'],
        'js-cookie': [['default', 'Cookies']]
      }
    ],
    dirs: ['src/utils', 'src/api/**', 'src/store/**'],
    resolvers: [ElementPlusResolver(), VueUseComponentsResolver()],
    dts: 'types/auto-imports.d.ts',
    eslintrc: {
      enabled: true
    }
  })

  return autoImport
}
