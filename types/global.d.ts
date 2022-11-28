import type { ComponentRenderProxy, VNode } from 'vue'
declare global {
  declare interface Window {
    WKConfig: any
  }

  declare type Recordable<T = any> = Record<string, T>
  namespace JSX {
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
  }
}
