import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral';

const casesTypeColors = {
    cases: {
        hex: '#cc1034', 
        rgba: 'rgba(204,16,52,0.5)',
    },
    recovered: {
        hex: '#7dd71d',
        rgba: 'rgba(125,215,29,0.5)',
    },
    deaths: {
        hex: '#fb4443',
        rgba: 'rgba(251,68,67,0.5)',
    },
}


const chartOptions = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: 0,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function( tooltipItem, data ){
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            
            {    
                gridLines: {
                    display: false
                },
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    //include a doller sign in the tick
                    callback: function(value, index, values){
                        return numeral(value).format('0a');
                    }
                }
            }
        ]
    }
}

const LineGraph = ({className,casesType='cases'}) => {

    const [data, setData] = useState({});

    //https://disease.sh/v3/covid19/historical/all?lastdays=120

    const buildChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases){
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }
    useEffect(() => {
        const fetchChartData = async () => {
          await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(res=> res.json())
            .then(data=>{
                let chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }
        fetchChartData();
    }, [casesType])

    
    return (
        <div className={className}>
            { data?.length > 0 && ( 
           <Line 
           options ={chartOptions}
            data = {{
                datasets: [{
                    backgroundColor: casesTypeColors[casesType].rgba,
                    borderColor: casesTypeColors[casesType].hex ,
                    data: data,
                }]
            }}
           /> 
            )}
        </div>
    )
}

export default LineGraph
