<template lang="html">
  <div class="sprite">
    <canvas :id='spriteId' :width="spriteW" :height="spriteH"></canvas>
  </div>
</template>

<script>
export default {
  name: 'sprite',
  props: {
    spriteSrc: {
      type: String,
      default: ''
    },
    spriteId: {
      type: String,
      default: 'sprite'
    },
    spriteW: {
      type: Number,
      default: 1
    },
    spriteH: {
      type: Number,
      default: 1
    },
    spriteSpeed: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      visible: true,
      frameIndex: 0,
      tickCount: 0,
      frameLength: 0,
      ticksPerFrame: 0,
      numberOfFrames: 0,
      frameRate: 20,
      ctx: '',
      canvas: '',
      mySprite: '',
      animationFrameId: -1
    }
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      vm.mySprite = new Image()
      vm.mySprite.onload = e => {
        vm.spriteInit(e.target)
      }
      vm.mySprite.src = vm.spriteSrc
    })
  },
  methods: {
    spriteInit (img) {
      this.canvas = this.$el.querySelector(`#${this.spriteId}`)
      this.ctx = this.canvas.getContext('2d')
      this.ticksPerFrame = this.spriteSpeed
      this.frameLength = img.width
      this.numberOfFrames = img.width / this.spriteW
      this.spriteLoop()
    },
    spriteUpdate () {
      this.tickCount ++
      if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0
        // If the current frame index is in range
        if (this.frameIndex < this.numberOfFrames - 1) {
        // Go to the next frame
          this.frameIndex ++
        } else {
          this.frameIndex = 0
        }
      }
    },
    spriteRender () {
      this.ctx.clearRect(0, 0, this.spriteW, this.spriteH)
      // Draw the animation
      const toDraw = this.frameIndex * this.spriteW
      this.ctx.drawImage(
        this.mySprite,
        toDraw, 0, this.spriteW, this.spriteH,
        0, 0, this.spriteW, this.spriteH
      )
    },
    spriteLoop () {
      this.animationFrameId = window.requestAnimationFrame(this.spriteLoop)
      this.spriteUpdate()
      this.spriteRender()
    },
    stop () {
      window.cancelAnimationFrame(this.animationFrameId)
    },
    play () {
      this.spriteLoop()
    }
  }
}
</script>

<style lang="css">
</style>
