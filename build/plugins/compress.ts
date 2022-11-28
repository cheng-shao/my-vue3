import type { PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default function compressPlugin(): PluginOption | PluginOption[] {
  const compress = viteCompression({
    verbose: false,
    deleteOriginFile: false,
    ext: '.gz'
  })

  return compress
}
