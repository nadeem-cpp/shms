import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthMetrics = () => {
    const [metrics, setMetrics] = useState({
        id: localStorage.getItem('uid'),
        bloodPressure: '',
        heartRate: '',
        weight: '',
        temperature: ''
    });

    // const [submittedMetrics, setSubmittedMetrics] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [metricHistory, setMetricHistory] = useState([]);  // State to store the history of metrics for graph

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'bloodPressure' || name === 'heartRate') {
            if (!/^\d*$/.test(value)) return; // Allow only integers
        }

        setMetrics({
            ...metrics,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const resp = axiosInstance.post('/records/metrics', metrics)
            .then((response) => {
                console.log(response.data);
                fetchMetricsHistory(); // Fetch updated history after submission
            })
            .catch((error) => {
                console.error("There was an error submitting the metrics!", error);
            });

        // setSubmittedMetrics(metrics);
        setMetrics({
            bloodPressure: '',
            heartRate: '',
            weight: '',
            temperature: ''
        });
        setShowForm(false); // Hide form after submission
    };

    // Function to fetch historical health metrics data
    const fetchMetricsHistory = () => {
        setMetricHistory(
            [
                {
                    "date": "2024-10-01",
                    "bloodPressure": 120,
                    "heartRate": 70,
                    "weight": 75,
                    "temperature": 36.5
                },
                {
                    "date": "2024-10-02",
                    "bloodPressure": 118,
                    "heartRate": 72,
                    "weight": 76,
                    "temperature": 36.7
                },
            
            ]
            
        );

        axiosInstance.get('/records/metrics', { params: { id: localStorage.getItem('uid') } })
            .then((response) => {
                setMetricHistory(response.data);
            })
            .catch((error) => {
                console.error("Error fetching health metric history", error);
            });
    };

    useEffect(() => {
        fetchMetricsHistory();
    }, []); // Fetch metrics history when component mounts

    // Data for the Line chart
    const chartData = {
        labels: metricHistory.map(item => new Date(item.date).toLocaleString()), // Dates for x-axis
        datasets: [
            {
                label: 'Blood Pressure (mmHg)',
                data: metricHistory.map(item => item.bloodPressure),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: false,
            },
            {
                label: 'Heart Rate (bpm)',
                data: metricHistory.map(item => item.heartRate),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                fill: false,
            },
            {
                label: 'Weight (kg)',
                data: metricHistory.map(item => item.weight),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                fill: false,
            },
            {
                label: 'Temperature (°C)',
                data: metricHistory.map(item => item.temperature),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                fill: false,
            }
        ],
    };

    return (
        <div className="bg-white p-6 rounded shadow-md mt-4">
            <h2 className="text-xl font-bold mb-4">Health Metrics</h2>
            
            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Add Metrics
                </button>
            )}

            {/* Conditionally render form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block font-medium text-gray-700">Blood Pressure (mmHg):</label>
                        <input 
                            type="text"
                            name="bloodPressure"
                            value={metrics.bloodPressure}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="e.g., 120/80"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Heart Rate (bpm):</label>
                        <input 
                            type="number"
                            name="heartRate"
                            value={metrics.heartRate}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="e.g., 72"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Weight (kg):</label>
                        <input 
                            type="number"
                            name="weight"
                            value={metrics.weight}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="e.g., 70"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Temperature (°C):</label>
                        <input 
                            type="number"
                            name="temperature"
                            value={metrics.temperature}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="e.g., 36.5"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button 
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                            Submit
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowForm(false)} // Cancel button to hide form
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Display submitted metrics */}
            {/* {submittedMetrics && (
                <div className="mt-6 bg-gray-100 p-4 rounded">
                    <h3 className="text-lg font-bold">Submitted Metrics</h3>
                    <p>Blood Pressure: {submittedMetrics.bloodPressure} mmHg</p>
                    <p>Heart Rate: {submittedMetrics.heartRate} bpm</p>
                    <p>Weight: {submittedMetrics.weight} kg</p>
                    <p>Temperature: {submittedMetrics.temperature} °C</p>
                </div>
            )} */}

            {/* Line Chart for health metrics history */}
            {metricHistory.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold">Health Metrics Over Time</h3>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default HealthMetrics;
