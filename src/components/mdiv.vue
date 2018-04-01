<template>
  <div class="mdiv">
    <div class="head" @mousedown="mousedown"></div>
    <div class="menu"><font-awesome-icon :icon="['fas', 'ellipsis-v']" /></div>
    <div class="container">
      <slot name="container"></slot>
    </div>
    <div class="resize" @mousedown="rmousedown"></div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      pos: {
        top: 0,
        left: 0,
        height: 400,
        width: 300
      },
      posNew: {
        top: 0,
        left: 0,
        height: 400,
        width: 300
      },
      // DIV相关临时变量
      down: null,
      room: null
    }
  },
  methods: {
    // 移动DIV
    mousedown (down) {
      this.down = down
      document.onmousemove = this.mousemove
      document.onmouseup = this.mouseup
    },
    mousemove (move) {
      // move.client 当前鼠标位置
      // down.client 按下鼠标位置
      // down.clientY - down.clientY 位移
      let diff = {x: move.clientX - this.down.clientX, y: move.clientY - this.down.clientY}
      this.posNew.left = this.pos.left + diff.x
      this.posNew.top = this.pos.top + diff.y
      this.$el.style.left = this.posNew.left + 'px'
      this.$el.style.top = this.posNew.top + 'px'
    },
    mouseup () {
      let parent = this.$el.parentElement.getBoundingClientRect()
      let self = this.$el.getBoundingClientRect()
      let diff = {
        left: self.left - parent.left - 2,
        top: self.top - parent.top - 2,
        right: parent.right - self.right - 2,
        bottom: parent.bottom - self.bottom - 2
      }
      if (diff.left < 0) {
        this.posNew.left -= diff.left
      }
      if (diff.top < 0) {
        this.posNew.top -= diff.top
      }
      if (diff.right < 0) {
        this.posNew.left += diff.right
      }
      if (diff.bottom < 0) {
        this.posNew.top += diff.bottom
      }
      this.$el.style.left = this.posNew.left + 'px'
      this.$el.style.top = this.posNew.top + 'px'
      // 更新位置
      Object.assign(this.pos, this.posNew)
      document.onmousemove = null
      document.onmouseup = null
    },
    // 缩放DIV
    rmousedown (down) {
      this.down = down
      this.room = this.$el.parentElement.getBoundingClientRect()
      this.room.width = this.room.width - this.pos.width - this.pos.left - 4
      this.room.height = this.room.height - this.pos.height - this.pos.top - 4
      console.log(this.room)
      document.onmouseup = this.rmouseup
      document.onmousemove = this.rmousemove
    },
    rmousemove (move) {
      let diff = {x: move.clientX - this.down.clientX, y: move.clientY - this.down.clientY}
      let x = diff.x < this.room.width ? diff.x : this.room.width
      let y = diff.y < this.room.height ? diff.y : this.room.height
      this.posNew.width = this.pos.width + x
      this.posNew.height = this.pos.height + y
      this.$el.style.width = this.posNew.width + 'px'
      this.$el.style.height = this.posNew.height + 'px'
    },
    rmouseup () {
      document.onmousemove = null
      document.onmouseup = null
      // 更新大小
      Object.assign(this.pos, this.posNew)
    }
  }
}
</script>

<style scoped>
  .mdiv {
    position: relative;
    float: left;
    min-width: 300px;
    min-height: 400px;
    background: white;
    border: 1px solid rgb(201, 208, 219);
    border-radius: 4px;
    border-bottom-right-radius: 0px;
    box-shadow: 2px 2px 6px #646464;
  }

  .head {
    float: left;
    height: 30px;
    width: calc(100% - 30px);
    background: whitesmoke;
    cursor: move;
  }

  .container {
    min-height: calc(100% - 30px);
    min-width: 300px;
    height: calc(100% - 30px);
    width: 100%
  }

  .menu {
    float: left;
    height: 16px;
    width: 30px;
    text-align: center;
    padding: 7px 0px;
    background: whitesmoke;
    cursor: pointer;
  }

  .resize {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 0px;
    height: 0px;
    border-bottom: 8px solid rgba(0, 0, 0, 0.5);
    border-left: 8px solid transparent;
    cursor: nw-resize;
  }
</style>
