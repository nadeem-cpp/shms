import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddAppointment = () => {
    const [doctors, setDoctors] = useState([]); // List of doctors
    const [selectedDoctor, setSelectedDoctor] = useState(''); // Selected doctor
    const [doctorSchedule, setDoctorSchedule] = useState(null); // Doctor's available schedule
    const [selectedDate, setSelectedDate] = useState(''); // Selected date
    const [selectedTime, setSelectedTime] = useState(''); // Selected time slot
    const [timeSlots, setTimeSlots] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState({
        uid: localStorage.getItem('uid'),
        doctorId: '',
        date: '',
        time:''
    });

    useEffect(() => {
        // Fetch all doctors from the API
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get('/doctor'); // Fetch doctors
                setDoctors(response.data);
            } catch (error) {
                console.log('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    // Fetch doctor's schedule when a doctor is selected
    const fetchDoctorSchedule = async (doctorId) => {
        try {
            const response = await axiosInstance.get(`/doctor?id=${doctorId}`);
            setDoctorSchedule(response.data);

            // Generate time slots based on startTime and endTime from the doctor's schedule
            const { startTime, endTime } = response.data;
            const slots = generateTimeSlots(startTime, endTime);
            setTimeSlots(slots); // Update time slots for dropdown
        } catch (error) {
            console.log('Error fetching doctor schedule:', error);
        }
    };

    const handleDoctorChange = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
        setAppointmentDetails({ ...appointmentDetails, doctorId: doctorId });
        fetchDoctorSchedule(doctorId); // Fetch doctor's schedule when selected
    };

    // Format the selected date to YYYY-MM-DD
    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)
        setSelectedDate(formattedDate);
        // setAppointmentDetails({ ...appointmentDetails, date: formattedDate });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const time = selectedTime.split(" -")[0]; // Extract only the start time of the selected slot
            // const fullDateTime = selectedDate + " " + convertToTime(time); // Combine selected date and time
            const details = {
                ...appointmentDetails,
                date: selectedDate, // Save the full datetime for submission
                time: convertToTime(time)
            };
            console.log(details);
            // Call the API to add the appointment
            const response = await axiosInstance.post('/appointment/add', details);

            console.log('Appointment successfully added:', response.data);
            // Navigate to the patient dashboard or show a success message
        } catch (error) {
            console.log('Error adding appointment:', error);
        }
    };

    // Helper function to restrict selectable dates to allowed days
    const isDayAllowed = (date) => {
        if (!doctorSchedule || !doctorSchedule.days) return false;

        const allowedDays = doctorSchedule.days.map(day => day.toLowerCase());
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        return allowedDays.includes(dayOfWeek);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Schedule an Appointment</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="" disabled>Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>

                {doctorSchedule && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Select a Date</label>
                            <DatePicker
                                selected={selectedDate ? new Date(selectedDate) : null}
                                onChange={handleDateChange}
                                filterDate={isDayAllowed}
                                minDate={new Date()} // Restrict to dates from current day onwards
                                placeholderText="Select an allowed date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                dateFormat="yyyy-MM-dd" // Ensure the selected date is formatted as YYYY-MM-DD
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Available Time Slots</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="" disabled>Select a time slot</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4"
                >
                    Schedule Appointment
                </button>
            </form>
        </div>
    );
};


// Helper function to generate 30-minute time slots
const generateTimeSlots = (startTime, endTime, slotDuration = 30) => {
    const slots = [];
    let start = new Date();
    let [startHour, startMinute] = startTime.split(':');
    start.setHours(startHour, startMinute, 0, 0);

    let end = new Date();
    let [endHour, endMinute] = endTime.split(':');
    end.setHours(endHour, endMinute, 0, 0);

    while (start < end) {
        let slotStart = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        start.setMinutes(start.getMinutes() + slotDuration);
        let slotEnd = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        slots.push(`${slotStart} - ${slotEnd}`);
    }

    return slots;
};

function convertToTime(timeString) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours}:${minutes}`;
}

export default AddAppointment;
