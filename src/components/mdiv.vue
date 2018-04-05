<template>
  <div class="mdiv">
    <div class="head" @mousedown="mousedown">{{ title }}</div>
    <div class="menu">
      <div style="float: right; margin: 0 7px" @click="menuClick">
        <span class="fas fa-ellipsis-v" v-show="isedit"></span>
      </div>
      <div style="float: right; margin: 0 3px"  @click="expand">
        <span class="fas" v-bind:class="{ 'fa-expand': !isexpand, 'fa-compress': isexpand }"></span>
      </div>
      <slot name="contextmenu"></slot>
    </div>
    <slot name="container"></slot>
    <div class="resize" @mousedown="rmousedown"></div>
  </div>
</template>

<script>
// import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    // [X, Y, W, H]
    outline: {
      type: Array,
      required: true
    },
    isedit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isexpand: false,
      // 空间位置相关
      pos: {
        left: this.outline[0],
        top: this.outline[1],
        height: this.outline[2],
        width: this.outline[3]
      },
      posNew: {
        left: this.outline[0],
        top: this.outline[1],
        height: this.outline[2],
        width: this.outline[3]
      },
      // DIV相关临时变量
      down: null,
      room: null
    }
  },
  methods: {
    expand () {
      this.isexpand = !this.isexpand
      if (this.isexpand) { // isexpand === true 变全屏
        this.$el.style.left = '1px'
        this.$el.style.top = '1px'
        this.$el.style.height = 'calc(100% - 2px)'
        this.$el.style.width = 'calc(100% - 2px)'
      } else {
        this.$el.style.left = this.pos.left + 'px'
        this.$el.style.top = this.pos.top + 'px'
        this.$el.style.width = this.pos.width + 'px'
        this.$el.style.height = this.pos.height + 'px'
      }
    },
    menuClick () {
      this.$emit('mdiv', 'menu')
    },
    outlineUpdate () {
      let room = this.$el.parentElement.getBoundingClientRect()

      let left = this.outline[0] > room.right ? room.right - 2 : this.outline[0]
      let top = this.outline[1] > room.top ? room.top - 2 : this.outline[1]
      let width = this.outline[0] + this.outline[2] // x + width
      let height = this.outline[1] + this.outline[3] // y + height
      width = width < room.width ? width : room.width - this.outline[0] - 4
      height = height < room.height ? height : room.height - this.outline[1] - 4
      this.$el.style.height = height + 'px'
      this.$el.style.width = width + 'px'
      this.$el.style.left = left + 'px'
      this.$el.style.top = top + 'px'
    },
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
      this.$emit('mdiv', 'resize')
    }
  },
  watch: {
    outline () {
      this.outlineUpdate()
      this.pos = {
        left: this.outline[0],
        top: this.outline[1],
        height: this.outline[2],
        width: this.outline[3]
      }
      this.$emit('mdiv', 'resize')
    }
  },
  computed: {
    title () {
      return this.name
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$el.style.left = this.outline[0] + 'px' // x
      this.$el.style.top = this.outline[1] + 'px' // y
      this.$el.style.width = this.outline[2] + 'px' // w
      this.$el.style.height = this.outline[3] + 'px' // h
    })
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
    padding-left: 5px;
    line-height: 30px;
    width: calc(100% - 45px);
    background: whitesmoke;
    cursor: move;
    z-index: 10;
  }

  .container {
    float: left;
    min-height: calc(100% - 30px);
    min-width: 300px;
    height: calc(100% - 30px);
    width: 100%
  }

  .menu {
    position: relative;
    float: left;
    height: 16px;
    width: 40px;
    text-align: center;
    padding: 7px 0px;
    background: whitesmoke;
    cursor: pointer;
  }
  .menu span:hover {
    color: darkseagreen;
  }
  .contextmenu {
    position: absolute;
    width: 20px;
    top: 31px;
    right: 0px;
    z-index: 10;
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
