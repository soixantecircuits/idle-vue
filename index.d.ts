declare module 'idle-vue' {
  import Vue, { PluginFunction } from 'vue'
  export interface IdleVueUseOptions {
    /**
     * Events that "break" idleness. Default value: ['mousemove', 'keydown', 'mousedown', 'touchstart']
     */
    events?: string[]
    /**
     * The Vue instance through which the idle-vue plugin is to send events. The plugin will send idleVue_onIdle and idleVue_onActive events to this instance; all Vue objects created after the plugin is loaded will run their onIdle and onActive hooks when idleVue_onIdle and idleVue_onActive events are sent.
     */
    eventEmitter?: any
    /**
     * The time (in ms) without input before the program is considered idle. For instance, with idleTime: 40000, the module will emit idle events after 40 seconds of inactivity. Default value: 60000 (one minute).
     */
    idleTime?: number
    /**
     * Whether you want to track more than once. Default value: true.
     */
    keepTracking?: boolean
    /**
     * The name of the vuex module (if store is defined), and the prefix of the emitted events (if eventEmitter is defined). Default value: idleVue.
     */
    moduleName?: string
    /**
     * Start in idle state. Default value: true.
     */
    startAtIdle?: boolean
    /**
     * The Vuex instance which stores the state of the app (idle or active); this store has a state idleVue.isIdle and a mutation idleVue/IDLE_CHANGED(isIdle).
     */
    store?: any
  }
  module "vue/types/vue" {
    interface Vue {
      /**
       * The plug-in adds a computed value isAppIdle to every Vue object.
       *
       * It's a shorthand for the current value of store.state.idleVue.isIdle; this value will always be undefined if the options object has no store field.
       *
       * Note that using isAppIdle or using the hooks onIdle and onActive are both different, valid ways of doing the same thing: detecting when your app is idle. You can use either or both of them depending on your needs.
       */
      isAppIdle: boolean
    }
  }
 // In case you want to vue.extend format
  module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
      onIdle?: () => void
      onActive?: () => void
    }
  }
  export function install(): PluginFunction<IdleVueUseOptions>
}
