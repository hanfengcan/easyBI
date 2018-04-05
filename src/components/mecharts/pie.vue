<template>
  <mdiv @mdiv='resize' :outline="outline" :isedit="isedit">
    <div slot="container" class="container" ref="pie"></div>
    <div slot="contextmenu" class="contextmenu" v-show="ishid && isedit">
      <span class="fas fa-edit fa-fw"></span>
      <span class="fas fa-trash-alt fa-fw"></span>
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
      isedit: true,
      outline: [10, 50, 400, 400],
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

</style>
