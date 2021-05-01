import { Bar, Line, Pie } from 'react-chartjs-2';
import React, { useState } from 'react';
const DemoDualAxes = () => {
   
    const [barData, setBarData] = useState({
        labels: ['Legal', 'Correspondence', 'Budget', 'Miscellaneous','Personnel'],
        datasets: [
            {
                label: '',
                data: [
                    48,
                    35,
                    73,
                    82,
                    100
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(75, 206, 192, 0.6)',
                ],
                borderWidth: 3
            }
        ]
    });
    // // set options
    // const [barOptions, setBarOptions] = useState({
    //     options: {
    //         scales: {
    //             yAxes: [
    //                 {
    //                     ticks: {
    //                         beginAtZero: true
    //                     }
    //                 }
    //             ]
    //         },
    //         title: {
    //             display: true,
    //             text: 'Data Orgranized In Bars',
    //             fontSize: 18
    //         },
    //         legend: {
    //             display: true,
    //             position: 'top'
    //         },
    //         maintainAspectRatio: false 
    //     }
    // });

   
    return <Line
	data={barData}
	width={100}
	height={350}
	options={{ maintainAspectRatio: false }}
/>
};
export default DemoDualAxes;