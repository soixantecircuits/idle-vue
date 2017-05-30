'use strict'

import IdleJs from 'idle-js'
import IdleView from "./src/Idle"

export default {
  IdleView,

  install (Vue, options) {
    const {
      eventEmitter,
      store = Vue.$store,

      idleTime = 60 * 1000,
      events = ['mousemove', 'keydown', 'mousedown', 'touchstart'],
      keepTracking = true,
      startAtIdle = true,
      moduleName = 'idle'
    } = options || {}

    if (!options) {
      throw Error("`options` must be a valid JS object")
    }

    if (!eventEmitter) {
      throw Error("`options.eventEmitter` must be a valid Vue instance")
    }
    if (store === undefined) {
      throw Error("`options.store` is undefined\n"
      + "`options.store` must be null or a valid Vuex store instance")
    }

    store && store.registerModule(moduleName, {
      state: { isIdle: false },

      mutations: {
        [`${moduleName}/IDLE_CHANGED`]: function (state, isIdle) {
          state.isIdle = isIdle
        }
      }
    })

    const idle = new IdleJs({
      idle: idleTime,
      events,
      keepTracking,
      startAtIdle,

      onIdle: () => {
        eventEmitter.$emit(`${moduleName}_onIdle`)
        store && store.commit(`${moduleName}/IDLE_CHANGED`, true)
      },
      onActive: () => {
        eventEmitter && eventEmitter.$emit(`${moduleName}_onActive`)
        store && store.commit(`${moduleName}/IDLE_CHANGED`, false)
      }
    })
    idle.start()

    Vue.component("IdleView", IdleView)

    Vue.mixin({
      data () { return {
        idleVue_onIdle: null,
        idleVue_onActive: null
      }},
      created () {
        const options = this.$options

        this.idleVue_onIdle = () => options.onIdle && options.onIdle()
        this.idleVue_onActive = () => options.onActive && options.onActive()
        eventEmitter.$on(`${moduleName}_onIdle`, this.idleVue_onIdle)
        eventEmitter.$on(`${moduleName}_onActive`, this.idleVue_onActive)
      },
      destroyed () {
        eventEmitter.$off(`${moduleName}_onIdle`, this.idleVue_onIdle)
        eventEmitter.$off(`${moduleName}_onActive`, this.idleVue_onActive)
      },
      computed: {
        isAppIdle () {
          return store.state.idle
        }
      }
    })
  }
}
