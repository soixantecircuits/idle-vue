<template>
  <div class="idle-view" :class="{active: isAppIdle}">
    <div class="overlay" :class="{active: isAppIdle}"></div>
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
  .idle-vue {
    display: none;
  }
  .idle-vue.active {
    pointer-events: all;
    display: block;
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
