import React, { Component } from 'react';
import './index.less';
import { connect } from 'dva';
import * as echarts from 'echarts';

class StatisticChart extends Component {
    initPieChart = () => {
        const {statistics = []} = this.props;
        var data = [];
        statistics.length >0 && statistics.map((item)=>{
           return(
               data.push({
                   name:item.supplierName,
                   value:item.total
               })
           ) 
        })
        var statisticChart = echarts.init(document.getElementById('unpaid'))
        let options = this.setOption(data)
        statisticChart.setOption(options)
      }
    setOption = (data) =>{
        // 绘制图表
       return{
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: '38%',
                top: 'middle',
                itemGap: 30,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                formatter:  function(name){
                    var total = 0;
                    var target;
                    for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        target = data[i].value;
                        }
                    }
                    var arr = [
                        '{a|'+name+'}{b| | '+((target/total)*100).toFixed(2)+'%}{c|￥'+target+'}'
                    ]
                    return arr.join('\n')
                },   
                textStyle:{
                    rich:{
                        a:{
                            fontSize:14,
                            color:'rgba(0,0,0,0.85)',
                            padding:[0,0,0,8]
                        },
                        b:{
                            fontSize:14,
                            color:'rgba(0,0,0,0.45)',
                            padding:[0,0,0,8]
                        },
                        c:{
                            fontSize:14,
                            color:'rgba(0,0,0,0.85)',
                            padding:[0,0,0,10]
                        }
                    }
                }
            },
            series: [
                {
                    name:'资源',
                    type: 'pie',
                    radius: ['40%', '80%'],
                    center: ['21%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        borderWidth: 15,
                        borderColor: '#fff',
                    },
                    data: data,
                    color: ['#706EE6', '#FFC009', '#2AC286', '#53C5CE', 'rgb(24, 144, 255)', ' rgb(240, 72, 100)'],
                }
            ]
        };
    }
    componentDidMount() {
        this.initPieChart();
    }
    componentDidUpdate() {
        this.initPieChart();
      }
    render() {
        return (
            <div id='unpaid'></div>
        )
    }
}

export default connect(({ home }) => ({
  home,
}))(StatisticChart);