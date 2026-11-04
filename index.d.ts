declare module 'idle-vue' {
  import Vue, { PluginFunction } from 'vue'
  export interface IdleVueUseOptions {
    /**
     * Events that "break" idleness. Default value: ['mousemove', 'keydown', 'mousedown', 'touchstart']
     */
    events?: string[]
    /**
     * The Vue instance through which the idle-vue plugin is to send events.
     */
    eventEmitter?: any
    /**
     * The time (in ms) without input before the program is considered idle. Default value: 60000.
     */
    idleTime?: number
    /**
     * Whether you want to track more than once. Default value: true.
     */
    keepTracking?: boolean
    /**
     * The name of the vuex module (if store is defined), and the prefix of the emitted events. Default: idleVue.
     */
    moduleName?: string
    /**
     * Start in idle state. Default value: true (legacy; v3 changes to false).
     */
    startAtIdle?: boolean
    /**
     * The Vuex instance which stores the state of the app.
     */
    store?: any
  }
  module 'vue/types/vue' {
    interface Vue {
      isAppIdle: boolean
      startAppIdleTimeout(): any
      stopAppIdleTimeout(): any
      resetAppIdleTimeout(): any
      $resetIdle(): any
      setIdleTime(ms: number): any
    }
  }
  module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
      onIdle?: () => void
      onActive?: () => void
    }
  }
  export function install(): PluginFunction<IdleVueUseOptions>
}
