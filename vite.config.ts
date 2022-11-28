import { fileURLToPath, URL } from 'node:url'

import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

// @ts-ignore
import { wrapperEnv } from './build/utils'
// @ts-ignore
import { createVitePlugins } from './build/plugins'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, './envs')
  const viteEnv = wrapperEnv(env)
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv

  const isBuild = command === 'build'

  return {
    define: {
      'process.env': {}
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.ts', '.js']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/var.scss";
            @import "@/styles/xr-theme.scss";          
            `
        }
      }
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    envDir: './envs',
    server: {
      host: true,
      port: VITE_PORT,
      // strictPort: VITE_PORT,
      proxy: {
        '/api-11': {
          target: 'https://cloud.5kcrm.cn',
          changeOrigin: true,
          secure: false
          // rewrite: (path) => {
          //   return path.replace(/^\/api-11/, '')
          // }
        }
      }
    },

    build: {
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000
    },

    optimizeDeps: {
      include: []
    }
  }
}
