import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Home = () => {
    const [patientRecords, setPatientRecords] = useState([]);
    const [edit, setEdit] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null); // Keep track of selected record
    const [newRecord, setNewRecord] = useState({
        patient_id: '',
        uid: localStorage.getItem('uid'),
        diagnosis: '',
        test_result: '',
        prescriptions: [{ medicine: '', frequency: '', start: '', end: '' }],
    });
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);

    const role = localStorage.getItem('role'); // Get user role

    // Fetch patient records from the server
    useEffect(() => {
        async function getRecords() {
            try {
                const resp = await axiosInstance.get(`/records/get?id=${localStorage.getItem('uid')}`,
                    {
                        //     headers: {
                        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
                        // }
                    }
                );
                setPatientRecords(resp.data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        }
        getRecords();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    // Handle prescription field changes
    const handlePrescriptionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPrescriptions = [...newRecord.prescriptions];
        updatedPrescriptions[index][name] = value;
        setNewRecord({ ...newRecord, prescriptions: updatedPrescriptions });
    };

    // Add a new prescription field
    const handleAddPrescription = () => {
        setNewRecord({
            ...newRecord,
            prescriptions: [...newRecord.prescriptions, { medicine: '', frequency: '', start: '', end: '' }],
        });
    };

    // Submit new patient record
    const handleAddRecord = async () => {
        try {
            if (edit) {
                const resp = await axiosInstance.post(`/records/add?id=${selectedRecord.id}`, newRecord);
                // Update the patient record list with the edited record
                setPatientRecords((prevRecords) =>
                    prevRecords.map((record) =>
                        record.id === selectedRecord.id ? { ...record, ...newRecord } : record
                    )
                );
                setEdit(false)
            } else {
                console.log(newRecord)
                const resp = await axiosInstance.post('/records/add', newRecord);
                let record = { ...newRecord, name: resp.data.patient_name, id: resp.data.record_id, record_date: new Date() };
                setPatientRecords([record, ...patientRecords]);
            }
            setShowForm(false);
            setNewRecord({
                patient_id: '',
                uid: localStorage.getItem('uid'),
                diagnosis: '',
                prescriptions: [{ medicine: '', frequency: '', start: '', end: '' }],
            });
        } catch (error) {
            console.error('Error adding record:', error);
            setError('Failed to add the record. Please try again.');
        }
    };

    // Handle delete record
    const handleDeleteRecord = async (recordId) => {
        try {
            await axiosInstance.delete(`/records/delete?id=${recordId}`);
            setPatientRecords(patientRecords.filter(record => record.id !== recordId));
        } catch (error) {
            console.error('Error deleting record:', error);
            setError('Failed to delete the record.');
        }
    };

    // Handle edit record and display prescriptions when a record is clicked
    const handleEditRecord = (record) => {
        setNewRecord(record);
        setEdit(true);
        setShowForm(true);
        setSelectedRecord(record); // Set the selected record
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                {role === 'doctor' ? 'Patient Records' : 'My Records'}
            </h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Conditionally show the 'Add Record' button if the role is doctor */}
            {role === 'doctor' && (
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
                >
                    {showForm ? 'Cancel' : 'Add Record'}
                </button>
            )}

            {showForm && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Add New Record</h3>
                    <label className="block mb-2">Patient ID</label>
                    <input
                        type="text"
                        name="patient_id"
                        value={newRecord.patient_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
                    />

                    <label className="block mb-2">Diagnosis</label>
                    <input
                        type="text"
                        name="diagnosis"
                        value={newRecord.diagnosis}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
                    />

                    <label className="block mb-2">Test Result</label>
                    <input
                        type="text"
                        name="test_result"
                        value={newRecord.test_result}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
                    />

                    <label className="block mb-2">Prescriptions</label>
                    {newRecord.prescriptions.map((prescription, index) => (
                        <div key={index} className="mb-4">
                            <div className="grid grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    name="medicine"
                                    value={prescription.medicine}
                                    placeholder="Medicine"
                                    onChange={(e) => handlePrescriptionChange(index, e)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="frequency"
                                    value={prescription.frequency}
                                    placeholder="Frequency"
                                    onChange={(e) => handlePrescriptionChange(index, e)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="date"
                                    name="start"
                                    value={prescription.start}
                                    onChange={(e) => handlePrescriptionChange(index, e)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="date"
                                    name="end"
                                    value={prescription.end}
                                    onChange={(e) => handlePrescriptionChange(index, e)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddPrescription}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                    >
                        Add Another Prescription
                    </button>

                    <button
                        onClick={handleAddRecord}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save Record
                    </button>
                </div>
            )}

            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className='text-left'>
                        <th className="py-2 px-4">Sr.</th>
                        {role == "doctor" && (
                            <th className="py-2 px-4">Patient ID</th>
                        )}
                        <th className="py-2 px-4">
                            {role === "doctor" ? "Patient " : "Doctor "} Name
                        </th>
                        <th className="py-2 px-4">Diagnosis</th>
                        <th className="py-2 px-4">Test Result</th>
                        <th className="py-2 px-4">Record Date</th>
                        {role === 'doctor' && (
                            <th className="py-2 px-4">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {patientRecords.map((record, index) => (
                        <tr
                            key={record.id}
                            className="hover:bg-gray-200 cursor-pointer"
                            onClick={() => setSelectedRecord(record)} // Set selected record on click
                        >
                            <td className="py-2 px-4">{index}</td>
                            {role == "doctor" && (
                                <td className="py-2 px-4">{record.patient_id}</td>

                            )}
                            <td className="py-2 px-4">{record.name || "NA"}</td>
                            <td className="py-2 px-4">{record.diagnosis}</td>
                            <td className="py-2 px-4">{record.test_result}</td>
                            <td className="py-2 px-4">{new Date(record.record_date).toLocaleDateString() || ""}</td>
                            <td className="py-2 px-4 flex space-x-4">
                                {/* Conditionally show Edit and Delete icons if the role is doctor */}
                                {role === 'doctor' && (
                                    <>
                                        <FaEdit
                                            onClick={() => handleEditRecord(record)}
                                            className="cursor-pointer text-blue-500"
                                        />
                                        <FaTrash
                                            onClick={() => handleDeleteRecord(record.id)}
                                            className="cursor-pointer text-red-500"
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedRecord && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Prescriptions By {selectedRecord.name}</h3>
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className='text-left'>
                                <th className="py-2 px-4">Medicine</th>
                                <th className="py-2 px-4">Frequency(M,A,E)</th>
                                <th className="py-2 px-4">Start</th>
                                <th className="py-2 px-4">End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRecord.prescriptions.map((prescription, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4">{prescription.medicine}</td>
                                    <td className="py-2 px-4">{prescription.frequency}</td>
                                    
                                    <td className="py-2 px-4">
                                        {isNaN(new Date(prescription.start))
                                            ? "not found"
                                            : new Date(prescription.start).toLocaleDateString()}
                                    </td>

                                    <td className="py-2 px-4">
                                        {isNaN(new Date(prescription.end))
                                            ? "not found"
                                            : new Date(prescription.end).toLocaleDateString()}
                                    </td>
                                    {/* <td className="py-2 px-4">{new Date(prescription.start).toLocaleDateString() || " "}</td> */}
                                    {/* <td className="py-2 px-4">{new Date(prescription.end).toLocaleDateString() || " "}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Home;
