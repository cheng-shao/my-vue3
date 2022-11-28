/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 公共
  readonly VITE_PORT: number

  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_LOCATION_ORIGIN: string
  readonly VITE_APP_CALL_SOCKET: string
  readonly VITE_APP_REGISTER_URL: string
  readonly VITE_APP_HOME_URL: string
  readonly VITE_APP_MARKETING_FOLDER: string

  // 是否开启域名校准
  readonly VITE_APP_CORRECT_DOMAIN: string

  // scrm
  readonly VITE_APP_MAIN_DOMAIN: string
  readonly VITE_APP_SIDE_DOMAIN: string
  readonly VITE_APP_DOMAIN_IP: string

  // 删除console、debugger
  readonly VITE_DROP_CONSOLE: boolean

  // 是否打包时兼容传统浏览器
  readonly VITE_LEGACY: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
