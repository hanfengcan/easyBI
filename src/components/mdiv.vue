<template>
  <div class="mdiv">
    <div class="head" v-drag>
      <div style="width: calc(100% - 50px); line-height: 30px; margin-left: 2px;">{{title}}</div>
      <slot name="head"></slot>
    </div>
    <div class="container">
      <slot name="container"></slot>
    </div>
    <div class="resize" v-resize="resizeFinish"></div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '未命名'
    }
  },
  data () {
    return {
      title: null
    }
  },
  directives: {
    drag: {
      update: function (el) {
        // console.log(el)
        let div = el
        let translate = {x: 0, y: 0}
        div.onmousedown = function (down) {
          // 上次的位置
          let translateNew = {x: 0, y: 0}
          translateNew.x = translate.x
          translateNew.y = translateNew.y
          console.log('down', translateNew)
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
            // div.parentElement.style.transform = `translate(${translateNew.x}px, ${translateNew.y}px)`
            translate = translateNew
            console.log('up', translate)
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
          document.onmousemove = function (move) {
            let displacement = {x: move.clientX - down.clientX, y: move.clientY - down.clientY}
            parent.style.height = room.height + displacement.y + 'px'
            parent.style.width = room.width + displacement.x + 'px'
          }
          document.onmouseup = function (move) {
            document.onmousemove = null
            document.onmouseup = null
            bind.value()
          }
        }
      }
    }
  },
  methods: {
    resizeFinish () {
      this.$emit('mdiv', 'resize')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.title = this.name
    })
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
    width: 300px;
    height: 400px;
    border: 1px solid transparent;
  }

  .head {
    position: relative;
    height: 30px;
    background-color: #EEEEEE;
    cursor: move;
    user-select: none;
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
