import React, {useState} from 'react';
import Home from '../components/Home';
import Appointments from '../components/Appointments';
import Availability from '../components/Availability';
import DashboardLayout from '../components/DashboardLayout';
import HealthMetrics from '../components/HealthMetrics';


const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home />;
            case 'matrics':
                return <HealthMetrics />;
            case 'appointments':
                return <Appointments />;
            case 'availability':
                return <Availability />;
            default:
                return <Home />;
        }
    };

    return (
        <DashboardLayout>

        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold text-center">Doctor Dashboard</div>
                <nav className="flex flex-col p-4">
                    <button 
                        onClick={() => setActiveTab('home')} 
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'home' ? 'bg-blue-800' : ''}`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => setActiveTab('matrics')} 
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'matrics' ? 'bg-blue-800' : ''}`}
                    >
                        Health Matrics
                    </button>
                    <button 
                        onClick={() => setActiveTab('appointments')} 
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'appointments' ? 'bg-blue-800' : ''}`}
                    >
                        Appointments
                    </button>

                    <button 
                        onClick={() => setActiveTab('availability')} 
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'availability' ? 'bg-blue-800' : ''}`}
                    >
                        Availability
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


export default DoctorDashboard;
