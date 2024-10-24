import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiH1 } from 'react-icons/ri';

const AddAppointment = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Search query input
    const [doctors, setDoctors] = useState([]); // List of doctors based on search
    const [doctorSchedule, setDoctorSchedule] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(''); // Selected doctor
    const [selectedDate, setSelectedDate] = useState(''); // Selected date
    const [selectedTime, setSelectedTime] = useState(''); // Selected time slot
    const [timeSlots, setTimeSlots] = useState([]); // Available time slots
    const [appointmentDetails, setAppointmentDetails] = useState({
        uid: localStorage.getItem('uid'),
        doctorId: '',
        date: '',
        time: ''
    });

    const [error, setError] = useState('')
    // Fetch doctors based on search query
    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get(`/doctor/search?query=${searchQuery}`); // Search API
            if(response.data.length == 0){
            setError("No Doctor Found")
            }
            else{
                setError("")
            }
            setDoctors(response.data); // Set the available doctors
        } catch (error) {
            console.log('Error searching doctors:', error);
        }
    };

    const handleDoctorChange = (doctor) => {
        setSelectedDoctor(doctor.id);
        setAppointmentDetails({ ...appointmentDetails, doctorId: doctor.id });
        if (doctor.schedule != null){
            console.log("Schedule found")
            setDoctorSchedule(doctor.schedule)
            // Generate time slots based on the doctor's schedule
            const { startTime, endTime } = doctor.schedule;
            const slots = generateTimeSlots(startTime, endTime);
            setTimeSlots(slots); // Update time slots for the selected doctor
        }
        else{
            setDoctorSchedule([])
            setError("Schedule not found for selected doctor")
        }
        
    };

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        setSelectedDate(formattedDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const time = selectedTime.split(" -")[0]; // Extract only the start time of the selected slot
            const details = {
                ...appointmentDetails,
                date: selectedDate,
                time: convertToTime(time) // Save time in correct format
            };
            console.log(details);

            // Call the API to add the appointment
            const response = await axiosInstance.post('/appointment/add', details);
            alert('Appointment added successfully');
            console.log('Appointment successfully added:', response.data);
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

            <div className="mb-4">
                <label className="block mb-2 font-semibold">Search Doctor by Name or Speciality</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter doctor name or speciality"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
                >
                    Search
                </button>
            </div>
            <h1 className='text-red-500'>{error}</h1>
            {doctors.length > 0 && (
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Select Doctor</label>
                    <select
                        onChange={(e) => handleDoctorChange(doctors.find(doc => doc.id == e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedDoctor  && timeSlots.length > 0 && (
                <>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Select a Date</label>
                        <DatePicker
                            selected={selectedDate ? new Date(selectedDate) : null}
                            onChange={handleDateChange}
                            filterDate={isDayAllowed}
                            minDate={new Date()} // Restrict to dates from current day onwards
                            placeholderText="Select a date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            dateFormat="yyyy-MM-dd"
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
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4"
            >
                Schedule Appointment
            </button>
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
