import React, { useState, useEffect } from 'react';
import { fetchDailyData } from '../../api';
import { Line, Bar } from 'react-chartjs-2';

import styles from './Chart.module.css';

//const Chart = ( {data: { confirmed, deaths, recovered}, country}) => {
const Chart = ( {data,country}) => {
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            setDailyData(await fetchDailyData(country));
        }

        fetchAPI();
    }, [country]);

    if (data === undefined) {
        return 'Loading... ';
    }

    const lineChart = (
        !(dailyData === undefined)
            ? (
            <Line 
            data = {{
                labels: dailyData.map(({ date})=> date),
                datasets: [{
                    data: dailyData.map(({ confirmed}) => confirmed),
                    label: 'Infected',
                    borderColor: 'blue',
                    //backgroundColor: 'rgba(0,0,255,0.3)',
                    fill: true,
                },{
                    data: dailyData.map(({recovered})=> recovered),
                    label: 'Recovered',
                    borderColor: 'green',
                    //backgroundColor: 'rgba(0,255,0,0.3)',
                    fill: true,
                },{
                    data: dailyData.map(({ deaths}) => deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.3)',
                    fill: true,
                }],
            }}
            />) : null
    );
    
    const barChart = (
        data.confirmed
            ? (
                <Bar 
                    data={{
                        labels: ['Infected','Recovered','Deaths'],
                        datasets: [{
                            label: 'People',
                            backgroundColor: [
                                'rgba(0,0,255,0.5)',
                                'rgba(0,255,0,0.5)',
                                'rgba(255,0,0,0.5)',
                            ],
                            data: [data.confirmed, data.recovered, data.deaths]
                        }]
                    }}
                    options={{
                        legend: {display : false},
                        title: {display: true, text: `Current state in ${country}`},
                    }}
                />
            ) : null
    )

    return (
        <div className={styles.container}>
            {lineChart}
        </div>
    )
}

export default Chart;