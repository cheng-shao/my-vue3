import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import WindiCSS from 'vite-plugin-windicss'
import autoImportPlugin from './autoImport'
import componentsPlugin from './components'
import compressPlugin from './compress'

export function createVitePlugins(viteEnv: ImportMetaEnv, isBuild: boolean) {
  const { VITE_LEGACY } = viteEnv
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()]

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-windicss
  vitePlugins.push(WindiCSS())

  // unplugin-auto-import/vite
  vitePlugins.push(autoImportPlugin())

  // unplugin-vue-components/vite
  vitePlugins.push(componentsPlugin())

  // vite-plugin-compression
  isBuild && vitePlugins.push(compressPlugin())

  return vitePlugins
}
