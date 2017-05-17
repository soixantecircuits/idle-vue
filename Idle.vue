<template>
  <div class="idle-vue" :class="{active: appIdle}">
    <div class="overlay" :class="{active: appIdle}"></div>
    <sprite spriteId="touch"
      :spriteSrc="require('./assets/touch.png')"
      :spriteW='180'
      :spriteH='215'
      ref='sprite'
    ></sprite>
  </div>
</template>

<script>
'use strict'

import IdleJs from 'idle-js'
import Sprite from './src/Sprite'

export default {
  components: {
      Sprite
  },
  props: [
    'eventEmitter',
    'idleTime', 'events', 'keepTracking', 'startAtIdle', 'moduleName'
  ],
  computed: {
    appIdle() {
      return this.$store.state.idle && this.$store.state.idle.isIdle
    }
  },
  watch: {
    'appIdle': {
      deep: true,
      handler: function (idle) {
        if (idle) {
          this.$refs.sprite.play()
        } else {
          this.$refs.sprite.stop()
        }
      }
    }
  },
  created() {
    idleSync(this.$store, this.eventEmitter, this, this.$props)
  }
}

function idleSync (store, eventEmitter, component, options) {
  const {
    idleTime = 60 * 1000,
    events = ['mousemove', 'keydown', 'mousedown', 'touchstart'],
    keepTracking = true,
    startAtIdle = true,
    moduleName = 'idle'
  } = options

  store.registerModule(moduleName, {
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
      component.$emit('idle')
      eventEmitter && eventEmitter.$emit(`${moduleName}_onIdle`)
      store.commit(`${moduleName}/IDLE_CHANGED`, true)
    },
    onActive: () => {
      component.$emit('active')
      eventEmitter && eventEmitter.$emit(`${moduleName}_onActive`)
      store.commit(`${moduleName}/IDLE_CHANGED`, false)
    }
  })
  idle.start()
}
</script>

<style>
  .idle-vue {
    opacity: 0;
  }
  .idle-vue.active {
    pointer-events: all;
    opacity: 1;
  }
  .idle-vue .sprite {
    top: 700px;
    bottom: 0px;
    margin: auto;
    position: absolute;
    height: 10px;
    width: 180px;
    left: 0px;
    right: 0px;
    z-index: 9999;
    -webkit-transform: scale(0.7);
  }
  .idle-vue .overlay {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    background: #000;
    pointer-events:none;
    z-index: 8888;
    opacity: 0;
    /*-webkit-animation: SlowMo 5s cubic-bezier(0.77, 0, 0.175, 1) infinite;*/
    -webkit-transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1);
  }
  .idle-vue .overlay.active {
    pointer-events: all;
    opacity: 0.6;
  }
  @-webkit-keyframes SlowMo {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
</style>
