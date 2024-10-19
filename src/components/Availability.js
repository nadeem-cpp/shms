import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const Availability = () => {
    const [availability, setAvailability] = useState({
        days: [],
        startTime: '',
        endTime: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Fetch the schedule from the server
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const uid = localStorage.getItem('uid');
                const resp = await axiosInstance.get(`/doctor?id=${uid}`);

                if (resp.data && resp.data.days) {
                    // If schedule exists
                    setAvailability({
                        days: resp.data.days || [],
                        startTime: resp.data.startTime || '',
                        endTime: resp.data.endTime || '',
                    });
                } else {
                    // No schedule found (new user)
                    throw new Error('No schedule found');
                }
            } catch (error) {
                // Schedule not found or failed to load
                console.error('Error fetching schedule:', error);
                setError('No schedule set yet. Please set your availability.');
                setAvailability({
                    days: [],
                    startTime: '',
                    endTime: '',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const handleCheckboxChange = (day) => {
        if (availability.days.includes(day)) {
            setAvailability({ ...availability, days: availability.days.filter(d => d !== day) });
        } else {
            setAvailability({ ...availability, days: [...availability.days, day] });
        }
    };

    const handleInputChange = (e) => {
        setAvailability({ ...availability, [e.target.name]: e.target.value });
    };

    const handleSetAvailability = async () => {
        try {
            const uid = localStorage.getItem('uid');
            const resp = await axiosInstance.post(`/doctor/update_schedule/${uid}`, availability);
            console.log('Schedule updated:', resp.data);
            alert("Schedule updated successfully");
        } catch (error) {
            console.error('Error updating schedule:', error);
            setError('Failed to update schedule.');
        }
    };

    if (loading) {
        return <div>Loading schedule...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Set Availability</h2>

            {/* Display Error or Info Message */}
            {error && (
                <div className="text-red-600 mb-4">
                    {error} {/* Display friendly message if schedule hasn't been set */}
                </div>
            )}

            {/* Days selection */}
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Select Days of the Week</label>
                <div className="grid grid-cols-2 gap-4">
                    {daysOfWeek.map((day) => (
                        <label key={day} className="flex items-center">
                            <input
                                type="checkbox"
                                value={day}
                                checked={availability.days.includes(day)}
                                onChange={() => handleCheckboxChange(day)}
                                className="mr-2"
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2">Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={availability.startTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block mb-2">End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={availability.endTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* Submit button */}
            <button
                onClick={handleSetAvailability}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                Set Availability
            </button>
        </div>
    );
};

export default Availability;
