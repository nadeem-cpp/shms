import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportAdmin = () => {
    const [doctors, setDoctors] = useState([]); // List of doctors based on search
    const [searchQuery, setSearchQuery] = useState(''); // Search query input
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Selected doctor
    const [doctorData, setDoctorData] = useState(null); // Selected doctor's report data
    const [performance, setPerformance] = useState(''); // Performance status

    // Fetch doctors based on search query
    const handleSearch = async () => {
        if (searchQuery) {
            try {
                const response = await axiosInstance.get(`/doctor/search?query=${searchQuery}`); // Search API
                setDoctors(response.data); // Set the available doctors
            } catch (error) {
                console.error("Error searching doctors:", error);
            }
        } else {
            setDoctors([]); // Clear the doctor list if the search query is empty
        }
    };

    // Fetch the selected doctor's report data
    const fetchDoctorData = (doctorId) => {
        axiosInstance.get(`appointment/report?id=${doctorId}`)
            .then(response => {
                const data = response.data;
                setDoctorData(data);
                calculatePerformance(data);
            })
            .catch(error => {
                console.error("Error fetching doctor's appointment data:", error);
            });
    };

    // Handle doctor selection from the dropdown
    const handleDoctorSelect = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        fetchDoctorData(doctorId);
    };

    // Calculate performance status based on the appointment data
    const calculatePerformance = (data) => {
        const { fulfilled_appointments, canceled_appointments, total_appointments } = data;
        const fulfilledRate = (fulfilled_appointments / total_appointments) * 100;
        const canceledRate = (canceled_appointments / total_appointments) * 100;

        if (fulfilledRate >= 80 && canceledRate <= 10) {
            setPerformance('Good');
        } else if (fulfilledRate >= 50 && canceledRate <= 30) {
            setPerformance('Normal');
        } else {
            setPerformance('Bad');
        }
    };

    // Chart Data
    const chartData = doctorData ? {
        labels: ['Fulfilled Appointments', 'Rescheduled Appointments', 'Canceled Appointments'],
        datasets: [
            {
                label: 'Appointments Breakdown',
                data: [
                    doctorData.fulfilled_appointments,
                    doctorData.rescheduled_appointments,
                    doctorData.canceled_appointments
                ],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                hoverOffset: 4,
            },
        ],
    } : null;

    // Chart options to reduce size
    const chartOptions = {
        maintainAspectRatio: false, // Disable aspect ratio to allow custom size
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Doctor's Appointment Report</h2>

            {/* Search Doctor by Name or Specialty */}
            <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Doctor:</label>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Search on Enter key press
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md"
                    placeholder="Enter doctor name or specialty"
                />
            </div>

            {/* Doctor selection dropdown */}
            {doctors.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Select Doctor:</label>
                    <select
                        id="doctor"
                        value={selectedDoctor || ''}
                        onChange={handleDoctorSelect}
                        className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md"
                    >
                        <option value="" disabled>Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Show doctor's appointment data after selection */}
            {doctorData ? (
                <div className="bg-white shadow-md p-4 rounded-lg">
                    {/* Performance Status */}
                    <div className="mb-4 text-lg font-semibold">
                        Performance Status: <span className={`text-${performance === 'Good' ? 'green' : performance === 'Normal' ? 'yellow' : 'red'}-600`}>{performance}</span>
                    </div>

                    {/* Smaller Pie Chart */}
                    <div className="w-1/3 h-64 mx-auto">
                        <Pie data={chartData} options={chartOptions} />
                    </div>

                    {/* Appointment Data */}
                    <h3 className="text-lg font-semibold mt-6 mb-4">
                        Report for Dr. {doctors.find(d => d.id === selectedDoctor)?.name}
                    </h3>
                    <ul className="space-y-2">
                        <li><strong>Total Appointments:</strong> {doctorData.total_appointments}</li>
                        <li><strong>Rescheduled Appointments:</strong> {doctorData.rescheduled_appointments}</li>
                        <li><strong>Canceled Appointments:</strong> {doctorData.canceled_appointments}</li>
                        <li><strong>Fulfilled Appointments:</strong> {doctorData.fulfilled_appointments}</li>
                        <li><strong>Total Patients:</strong> {doctorData.total_patients}</li>
                    </ul>
                </div>
            ) : (
                <p className="text-gray-600">Select a doctor to view the report.</p>
            )}
        </div>
    );
};

export default ReportAdmin;
