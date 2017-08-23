<template>
  <div class="idle-view" :class="{isIdle: isIdle}">
    <div class="overlay"></div>
    <sprite spriteId="touch"
      :spriteSrc="require('../assets/touch.png')"
      :spriteW='180'
      :spriteH='215'
      ref='sprite'
    ></sprite>
  </div>
</template>

<script>
'use strict'

import Sprite from './Sprite'

export default {
  components: {
    Sprite
  },
  onIdle () {
    this.$refs.sprite.play()
  },
  onActive () {
    this.$refs.sprite.stop()
  }
}
</script>

<style>
.idle-view {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 8888;

  pointer-events: none;
  display: none;
}
.idle-view.isIdle {
  pointer-events: all;
  display: block;
}
.idle-view .sprite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  height: 10px;
  width: 180px;
  z-index: 9999;
  -webkit-transform: scale(0.7);
}
.idle-view .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 8888;

  background: #000;
  opacity: 0;
  /*-webkit-animation: SlowMo 5s cubic-bezier(0.77, 0, 0.175, 1) infinite;*/
  -webkit-transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1);
}
.idle-view.isIdle .overlay {
  opacity: 0.6;
}
@-webkit-keyframes SlowMo {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>
