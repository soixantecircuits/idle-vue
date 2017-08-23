'use strict'

import IdleJs from 'idle-js'
import IdleView from './components/Idle'

export default {
  IdleView,
  install (Vue, options) {
    const {
      eventEmitter,
      store,
      moduleName = 'idleVue',
      idleTime = 60 * 1000,
      events = ['mousemove', 'keydown', 'mousedown', 'touchstart'],
      keepTracking = true,
      startAtIdle = true
    } = options || {}

    if (!eventEmitter && !store) {
      throw Error('Either `eventEmitter` or `store` must be passed in options')
    }

    store && store.registerModule(moduleName, {
      state: { isIdle: startAtIdle },
      mutations: {
        [`${moduleName}/IDLE_CHANGED`]: function (state, isIdle) {
          state.isIdle = isIdle
        }
      }
    })

    const onIdleStr = `${moduleName}_onIdle`
    const onActiveStr = `${moduleName}_onActive`

    const idle = new IdleJs({
      idle: idleTime,
      events,
      keepTracking,
      startAtIdle,

      onIdle () {
        eventEmitter && eventEmitter.$emit(onIdleStr)
        store && store.commit(`${moduleName}/IDLE_CHANGED`, true)
      },
      onActive () {
        eventEmitter && eventEmitter.$emit(onActiveStr)
        store && store.commit(`${moduleName}/IDLE_CHANGED`, false)
      }
    })
    idle.start()

    Vue.component('IdleView', IdleView)

    Vue.mixin({
      data () {
        return {
          [onIdleStr]: null,
          [onActiveStr]: null
        }
      },
      created () {
        if (eventEmitter && this.$options.onIdle) {
          this[onIdleStr] = this.$options.onIdle.bind(this)
          eventEmitter.$on(onIdleStr, this[onIdleStr])
        }
        if (eventEmitter && this.$options.onActive) {
          this[onActiveStr] = this.$options.onActive.bind(this)
          eventEmitter.$on(onActiveStr, this[onActiveStr])
        }
      },
      destroyed () {
        if (eventEmitter && this[onIdleStr]) {
          eventEmitter.$off(onIdleStr, this[onIdleStr])
        }
        if (eventEmitter && this[onActiveStr]) {
          eventEmitter.$off(onActiveStr, this[onActiveStr])
        }
      },
      computed: {
        isAppIdle () {
          return store && store.state[moduleName].isIdle
        }
      }
    })
  }
}
