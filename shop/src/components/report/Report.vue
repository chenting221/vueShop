<template>
  <div
    style="min-height: calc(100vh - 100px)"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div
      class="main"
      style="margin-bottom: 20px;"
    >
      <div
        id="myChart"
        :style="{minWidth: '700px', height: '480px'}"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引用线状、饼状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
export default {
  name: 'Report',
  data () {
    return {
      loading: false,
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['华东', '华南', '华北', '西部', '其他']
        },
        yAxis: [{ type: 'value' }],
        xAxis: [
          {
            data: [
              '2017-12-27',
              '2017-12-28',
              '2017-12-29',
              '2017-12-30',
              '2017-12-31',
              '2018-1-1'
            ]
          }
        ],
        series: [
          {
            name: '华东',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [2999, 3111, 4100, 3565, 3528, 6000]
          },
          {
            name: '华南',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [5090, 2500, 3400, 6000, 6400, 7800]
          },
          {
            name: '华北',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [6888, 4000, 8010, 12321, 13928, 12984]
          },
          {
            name: '西部',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [9991, 4130, 7777, 12903, 13098, 14028]
          },
          {
            name: '其他',
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: [15212, 5800, 10241, 14821, 15982, 14091]
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      stateApi: state => state.api
    })
  },
  // 此时页面上的元素已经被渲染完毕了
  mounted () {
    const _self = this
    let myChart = echarts.init(document.getElementById('myChart'))
    _self
      .$axios({
        method: 'get',
        url: _self.stateApi.sys.report.report
      })
      .then(response => {
        const { data } = response
        _self.loading = false
        if (data.meta.status === 200) {
          const merge = _.merge(data.data, _self.options)
          myChart.setOption(merge)
        } else {
          _self.$message.error(data.meta.msg)
        }
      })
      .catch(() => {
        _self.loading = false
      })
  }
}
</script>

<style scoped>
.main {
  padding: 20px;
  background: #ffffff;
}
</style>
