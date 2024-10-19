import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axiosInstance from '../axiosConfig';

const Performance = () => {
    const [feedbackData, setFeedbackData] = useState({
        totalFeedbacks: 0,
        positiveFeedbacks: 0,
        negativeFeedbacks: 0,
    });

    const [performanceStatus, setPerformanceStatus] = useState('');
    const chartRef = useRef(null); // Ref for the chart

    // Fetch feedback data from the API
    useEffect(() => {
        axiosInstance.get('/user/feedback') // Replace with your actual feedback API endpoint
            .then(response => {
                const { total_feedbacks, positive_feedbacks, negative_feedbacks } = response.data;

                setFeedbackData({
                    totalFeedbacks: total_feedbacks,
                    positiveFeedbacks: positive_feedbacks,
                    negativeFeedbacks: negative_feedbacks,
                });

                // Evaluate performance status based on feedback ratio
                const positiveRatio = positive_feedbacks / total_feedbacks;
                if (positiveRatio > 0.7) {
                    setPerformanceStatus('Good');
                } else if (positiveRatio > 0.4) {
                    setPerformanceStatus('Average');
                } else {
                    setPerformanceStatus('Poor');
                }
            })
            .catch(error => {
                console.error("Error fetching feedback data", error);
            });
    }, []);

    useEffect(() => {
        // Destroy the old chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart instance
        const ctx = document.getElementById('feedbackChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Positive Feedbacks', 'Negative Feedbacks'],
                datasets: [{
                    data: [feedbackData.positiveFeedbacks, feedbackData.negativeFeedbacks],
                    backgroundColor: ['#4CAF50', '#F44336'], // Green for positive, Red for negative
                    hoverOffset: 4
                }]
            },
            options: {
                maintainAspectRatio: false, // Disable aspect ratio to control size
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = feedbackData.totalFeedbacks;
                                return `${label}: ${value} (${((value / total) * 100).toFixed(1)}%)`;
                            }
                        }
                    },
                    // Add the total feedback count in the center of the pie chart
                    beforeDraw: function (chart) {
                        const ctx = chart.ctx;
                        ctx.restore();
                        const fontSize = (chart.height / 160).toFixed(2);
                        ctx.font = `${fontSize}em sans-serif`;
                        ctx.textBaseline = 'middle';

                        const text = `Total: ${feedbackData.totalFeedbacks}`;
                        const textX = Math.round((chart.width - ctx.measureText(text).width) / 2);
                        const textY = chart.height / 2;

                        ctx.fillText(text, textX, textY);
                        ctx.save();
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [feedbackData]);

    return (
        <div className="p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Performance Status: <span className={`text-${performanceStatus === 'Good' ? 'green-500' : performanceStatus === 'Average' ? 'yellow-500' : 'red-500'}`}>
                    {performanceStatus}
                </span>
            </h2>

            <div className="flex justify-center items-center mb-6">
                <div className="w-64 h-64 relative">
                    <canvas id="feedbackChart" width="256" height="256"></canvas>
                </div>
            </div>

            <div className="text-center">
                <h3 className="text-lg font-semibold">Feedback Summary:</h3>
                <p>Total Feedbacks: {feedbackData.totalFeedbacks}</p>
                <p>Positive Feedbacks: {feedbackData.positiveFeedbacks}</p>
                <p>Negative Feedbacks: {feedbackData.negativeFeedbacks}</p>
            </div>
        </div>
    );
};

export default Performance;
