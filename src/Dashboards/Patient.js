import React, { useState } from 'react';
import Home from '../components/Home';
import Appointments from '../components/Appointments';
import AddAppointment from '../components/AddAppointment';
import HealthMetrics from '../components/HealthMetrics';
import Report from '../components/Report';
import Feedback from '../components/Feedback';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const patientData = {
        "latest_metrics": {
            "blood_pressure": 45,
            "date_recorded": "2024-10-17 13:41:51.554015",
            "heart_rate": 34,
            "temperature": 38.0,
            "weight": 50.0
        },
        "medical_history": [
            {
                "date": "2024-10-18 10:34:17.517599",
                "diagnosis": "kjhkj",
                "doctor_id": 1,
                "treatment": [
                    {
                        "end": "2024-10-08",
                        "frequency": "kjh",
                        "medicine": "hkjh",
                        "start": "2024-10-16"
                    }
                ]
            },
            // more history
        ],
        "patient_info": {
            "address": "chuadry park lajpat road shahdara lahore",
            "contact_no": "03067494083",
            "date_of_birth": "2024-10-08",
            "gender": "male",
            "name": "Muhammad Nadeem"
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <>
                        <HealthMetrics />

                        <Home />
                    </>
                );
            case 'appointments':
                return <Appointments />;
            case 'add':
                return <AddAppointment />;
            case 'report':
                return <Report />;
            case 'review':
                return <Feedback/>;
            default:
                return <Home />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold text-center">Patient Dashboard</div>
                <nav className="flex flex-col p-4">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'home' ? 'bg-blue-800' : ''}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'appointments' ? 'bg-blue-800' : ''}`}
                    >
                        Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'add' ? 'bg-blue-800' : ''}`}
                    >
                        Add Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'report' ? 'bg-blue-800' : ''}`}
                    >
                        Generate Report
                    </button>
                    <button
                        onClick={() => setActiveTab('review')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'review' ? 'bg-blue-800' : ''}`}
                    >
                        Leave Feedback
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default PatientDashboard;
