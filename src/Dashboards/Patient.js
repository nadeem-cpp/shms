import React, { useState } from 'react';
import Records from '../components/Home';
import Appointments from '../components/Appointments';
import AddAppointment from '../components/AddAppointment';
import HealthMetrics from '../components/HealthMetrics';
import Report from '../components/Report';
import Feedback from '../components/Feedback';
import DashboardLayout from '../components/DashboardLayout';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <HealthMetrics/>
                );
            case 'records':
                return <Records/>
            case 'appointments':
                return <Appointments />;
            case 'add':
                return <AddAppointment />;
            case 'report':
                return <Report />;
            case 'review':
                return <Feedback/>;
            default:
                return <HealthMetrics />;
        }
    };

    return (
        <DashboardLayout>
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
                        onClick={() => setActiveTab('records')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'records' ? 'bg-blue-800' : ''}`}
                    >
                        Records
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
                        Book Appointment
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
        </DashboardLayout>
    );
};

export default PatientDashboard;
