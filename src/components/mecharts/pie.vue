<template>
  <mdiv @mdiv='resize' :fullScreen="fullScreen" :position="{x: 10, y: 10, width: 350, height: 600}">
    <div slot="container" style="height: 100%" ref="pie"></div>
    <div slot="head" class="menu" v-bind:class="{hide: ishid, show: !ishid}">
      <div class="menuItem" @click="menuItem(0)">切换</div>
      <div class="menuItem" @click="menuItem(1)">设置</div>
    </div>
  </mdiv>
</template>

<script>
import mdiv from '../mdiv'
import echarts from 'echarts'

export default {
  components: {
    mdiv
  },
  data () {
    return {
      ishid: false,
      fullScreen: false,
      e: null,
      option: {
        legend: {},
        dataset: {
          source: [
            ['name', 'apple', 'orange', 'pear', 'lemon'],
            ['2018', 234, 446, 230, 124]
          ]
        },
        series: [{
          type: 'pie',
          radius: ['30%', '55%'],
          seriesLayoutBy: 'row'
        }]
      }
    }
  },
  methods: {
    resize (arg) {
      if (arg === 'resize') {
        this.e.resize()
        console.log('resize')
      } else if (arg === 'menu') {
        this.ishid = !this.ishid
      }
    },
    menuItem (arg) {
      console.log(arg)
      if (arg === 0) {
        this.fullScreen = !this.fullScreen
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.e = echarts.init(this.$refs.pie, 'light')
      this.e.setOption(this.option)
    })
  }
}
</script>

<style scoped>
  .menu {
    position: absolute;
    top: 30px;
    right: 0px;
    text-align: right;
    z-index: 10;
  }

  .hide {
    display: none;
  }

  .menuItem {
    /* width: 30px; */
    height: 20px;
    line-height: 20px;
    background-color: #EEEEEE;
    cursor: auto;
  }

  .menuItem:hover {
    background-color: white;
  }
</style>
