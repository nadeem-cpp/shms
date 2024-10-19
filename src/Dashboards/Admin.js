import React, { useState } from 'react';
import UserList from '../components/UserList';
import Performance from '../components/Performance';
import ReportAdmin from '../components/ReportAdmin';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users'); // default to 'users'

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                // manage users, delete a user, update its role,
                return <UserList />;
            case 'report':
                return <ReportAdmin/>
                case 'performance':
                    return <Performance/>
            default:
                return <UserList />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold text-center">Admin Dashboard</div>
                <nav className="flex flex-col p-4">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'users' ? 'bg-blue-800' : ''}`}
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'report' ? 'bg-blue-800' : ''}`}
                    >
                        {/* view report on the doctor's appointments(how many rescheduled, canceled, fullfilled), no. of patients */}
                        Report
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`py-2 px-4 hover:bg-blue-800 rounded ${activeTab === 'performance' ? 'bg-blue-800' : ''}`}
                    >
                        View Performance
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

export default Admin;
