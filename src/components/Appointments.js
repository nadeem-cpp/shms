import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { FaEdit } from 'react-icons/fa'; // Importing icons from React Icons

const Appointments = () => {
    const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [selectedAppointment, setSelectedAppointment] = useState(null); // State to hold the selected appointment for editing
    const [newStatus, setNewStatus] = useState(''); // State to hold the new status selected by the doctor
    const [newDate, setNewDate] = useState(''); // State to hold the new date for reschedule
    const [newTime, setNewTime] = useState(''); // State to hold the new time for reschedule
    const role = localStorage.getItem('role')

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let resp;
                const role = localStorage.getItem('role');
                const uid = localStorage.getItem('uid');
                if (role === "doctor") {
                    resp = await axiosInstance.get(`/appointment/get?id=${uid}&d=true`);
                } else {
                    resp = await axiosInstance.get(`/appointment/get?id=${uid}`);
                }
                setAppointments(resp.data); // Update state with fetched appointments
            } catch (error) {
                console.log('Error fetching appointments:', error);
                setError('Failed to fetch appointments.');
            }
        };

        fetchAppointments();
    }, []); // Empty dependency array to run only once


    const handleUpdateAppointment = (appointment) => {
        setSelectedAppointment(appointment); // Set the selected appointment
        setNewStatus(appointment.status); // Pre-fill the current status in the modal
        setNewDate(appointment.date); // Pre-fill the current date
        setNewTime(appointment.time); // Pre-fill the current time
        setShowModal(true); // Show the modal
    };

    const handleSaveStatus = async () => {
        try {
            // Construct the updated data
            const updateData = {
                id: selectedAppointment.id,
                status: newStatus,
            };

            // If rescheduling, add new date and time
            if (newStatus === "reschedule") {
                updateData.date = newDate;
                updateData.time = newTime;
            }
            // Update the appointment with the new status, date, and time
            const resp = await axiosInstance.put(`/appointment/update`, updateData);
            console.log('Updated appointment with ID:', selectedAppointment.id);

            // Update the state with the new status, date, and time
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === selectedAppointment.id
                        ? { ...appointment, status: newStatus, date: newDate, time: newTime }
                        : appointment
                )
            );
            setShowModal(false); // Hide the modal
        } catch (error) {
            console.log('Error updating appointment:', error);
            setError('Failed to update appointment.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full bg-gray-200 text-left">
                            <th className="py-2 px-4">Sr.</th>
                            {role === "doctor" && (
                            <th className="py-2 px-4">ID</th>
                            )}
                            <th className="py-2 px-4">{role==="patient" ? "Doctor": "Patient"} Name</th>
                            {role === "patient" && (
                            <th className="py-2 px-4">Speciality</th>
                            )}
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Time</th>
                            <th className="py-2 px-4">Status</th>
                            {role === 'doctor' && (
                                <th className="py-2 px-4">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={appointment.id} className="border-t">
                                <td className="py-2 px-4">{index}</td>
                                {role === "doctor" && (
                            <th className="py-2 px-4">{appointment.patient_id}</th>
                            )}
                                <td className="py-2 px-4">{appointment.name}</td>
                                {role === "patient" && (
                            <td className="py-2 px-4">{appointment.speciality || "N/A"}</td>

                            )}
                                <td className="py-2 px-4">{appointment.date.split(' ')[0]}</td>
                                <td className="py-2 px-4">{new Date(appointment.date).toLocaleTimeString()}</td>
                                <td className="py-2 px-4">{appointment.status}</td>
                                {role === 'doctor' && (
                                    <td className="py-2 px-4">
                                        <div className="flex space-x-4">
                                            {/* Update Icon */}
                                            <FaEdit
                                                className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                onClick={() => handleUpdateAppointment(appointment)}
                                                title="Edit Appointment"
                                            />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for updating the appointment status */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Update Appointment Status
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Select Status:
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="approved">Approved</option>
                                        <option value="reschedule">Reschedule</option>
                                        <option value="cancel">Cancel</option>
                                    </select>
                                </div>

                                {/* Conditionally render Date and Time pickers if Reschedule is selected */}
                                {newStatus === "reschedule" && (
                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Select New Date:
                                            </label>
                                            <input
                                                type="date"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Select New Time:
                                            </label>
                                            <input
                                                type="time"
                                                value={newTime}
                                                onChange={(e) => setNewTime(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleSaveStatus}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
