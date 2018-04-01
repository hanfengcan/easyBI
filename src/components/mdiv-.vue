<template>
  <div class="mdiv" v-bind:style="space">
    <div class="head" v-drag="moveFinish">
      <div style="width: calc(100% - 50px); line-height: 30px; margin-left: 10px;">{{title}}</div>
    </div>
    <div class="container">
      <slot name="container"></slot>
    </div>
    <div class="resize" v-resize="resizeFinish"></div>
    <div @click="menuClick" class="right"></div>
    <slot name="head"></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '未命名'
    },
    outline: {
      type: Array,
      default: function () {
        return [2, 2, 300, 400] // x y w h
      }
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      title: null,
      space: {
        width: this.outline[2] + 'px',
        height: this.outline[3] + 'px',
        top: this.outline[1] + 'px',
        left: this.outline[0] + 'px'
      },
      // 记录最新的大小和位置
      pos: {
        width: this.outline[2],
        height: this.outline[3],
        top: this.outline[1],
        left: this.outline[0]
      }
    }
  },
  directives: {
    drag: {
      update: function (el, bind) {
        // console.log(el)
        let div = el
        let translate = {x: 0, y: 0}
        div.onmousedown = function (down) {
          // 上次的位置
          let translateNew = {x: 0, y: 0}
          // translateNew.x = translate.x
          // translateNew.y = translateNew.y
          Object.assign(translateNew, translate)
          // console.log('down', translateNew)
          document.onmousemove = function (move) {
            // console.log(diff)
            // move.client 当前鼠标位置
            // down.client 按下鼠标位置
            // move.clientY - down.clientY 位移
            let displacement = {x: move.clientX - down.clientX, y: move.clientY - down.clientY}
            translateNew.x = translate.x + displacement.x
            translateNew.y = translate.y + displacement.y
            div.parentElement.style.top = translateNew.y + 'px'
            div.parentElement.style.left = translateNew.x + 'px'
            // div.parentElement.style.transform = `translate(${translateNew.x}px, ${translateNew.y}px)`
          }

          document.onmouseup = function (up) {
            // 计算离父元素的距离,超出过贴边处理
            let parent = el.parentElement.parentElement.getBoundingClientRect()
            let self = el.parentElement.getBoundingClientRect()
            let diff = {
              left: self.left - parent.left - 2,
              top: self.top - parent.top - 2,
              right: parent.right - self.right - 2,
              bottom: parent.bottom - self.bottom - 2
            }
            if (diff.left < 0) {
              translateNew.x = translateNew.x - diff.left
            }
            if (diff.top < 0) {
              translateNew.y = translateNew.y - diff.top
            }
            if (diff.right < 0) {
              translateNew.x = translateNew.x + diff.right
            }
            if (diff.bottom < 0) {
              translateNew.y = translateNew.y + diff.bottom
            }
            div.parentElement.style.top = translateNew.y + 'px'
            div.parentElement.style.left = translateNew.x + 'px'
            // div.parentElement.style.transform = `translate(${translateNew.x}px, ${translateNew.y}px)`
            translate = translateNew
            bind.value(translate.y, translate.x)
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    },
    resize: {
      update: function (el, bind) {
        let div = el
        let parent = el.parentElement
        div.onmousedown = function (down) {
          let room = parent.getBoundingClientRect()
          let space = parent.parentElement.getBoundingClientRect()
          let diff = {x: space.right - room.right - 2, y: space.bottom - room.bottom - 2}
          // console.log(room, space, diff)
          let width, height
          document.onmousemove = function (move) {
            let displacement = {x: move.clientX - down.clientX, y: move.clientY - down.clientY}
            let x = displacement.x < diff.x ? displacement.x : diff.right
            let y = displacement.y < diff.y ? displacement.y : diff.bottom
            width = room.width + x
            height = room.height + y
            parent.style.height = height + 'px'
            parent.style.width = width + 'px'
          }
          document.onmouseup = function (move) {
            document.onmousemove = null
            document.onmouseup = null
            bind.value(width, height)
          }
        }
      }
    }
  },
  methods: {
    moveFinish (top, left) {
      this.pos.top = top
      this.pos.left = left
    },
    /**
     * @param width
     * @param height
     */
    resizeFinish (width = this.pos.width, height = this.pos.height) {
      this.$emit('mdiv', 'resize')
      this.pos.height = height
      this.pos.width = width
    },
    menuClick () {
      this.$emit('mdiv', 'menu')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.title = this.name
    })
  },
  watch: {
    fullScreen: function (arg) {
      // console.log(this.$parent.$el.getBoundingClientRect())
      if (arg === true) {
        let parentSpace = this.$parent.$el.parentElement.getBoundingClientRect()
        console.log(parentSpace)
        this.$parent.$el.style.top = '0px'
        this.$parent.$el.style.left = '0px'
        this.$parent.$el.style.height = (parentSpace.height - 4) + 'px'
        this.$parent.$el.style.width = (parentSpace.width - 4) + 'px'
        setTimeout(() => {
          this.resizeFinish()
        }, 100)
      } else {
        this.$parent.$el.style.width = this.pos.width + 'px'
        this.$parent.$el.style.height = this.pos.height + 'px'
        this.$parent.$el.style.top = this.pos.top + 'px'
        this.$parent.$el.style.left = this.pos.left + 'px'
        setTimeout(() => {
          this.resizeFinish()
        }, 100)
      }
    }
  }
}
</script>

<style scoped>
  .mdiv {
    float: left;
    overflow: hidden;
    position: absolute;
    min-width: 300px;
    min-height: 400px;
    border: 1px solid transparent;
  }

  .head {
    position: relative;
    height: 30px;
    background-color: #EEEEEE;
    cursor: move;
    user-select: none;
  }

  .right {
    position: absolute;
    top: 5px;
    right: 5px;
    height: 20px;
    width: 20px;
    /* background-color: greenyellow; */
    cursor: pointer;
    /* z-index: 100; */
  }

  .container {
    min-height: calc(100% - 30px);
    min-width: 300px;
    height: calc(100% - 30px);
    width: 100%
  }

  .resize {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 0px;
    height: 0px;
    border-bottom: 8px solid rgba(108, 118, 131, 0.5);;
    border-left: 8px solid transparent;
    cursor: nw-resize;
  }
</style>
