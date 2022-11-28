import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function componentsPlugin() {
  // 组件注册
  const components = Components({
    dirs: ['src/views/**/components'],
    directoryAsNamespace: true,
    allowOverrides: true,
    include: [/\.vue$/, /\.vue\?vue/],
    resolvers: [ElementPlusResolver()],
    dts: 'types/components.d.ts'
  })
  return components
}
