import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // For creating tables easily
import axiosInstance from '../axiosConfig';

const Report = () => {
    const [reportData, setReportData] = useState(null); // State to store report data
    const [loading, setLoading] = useState(true); // State for loading status

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await axiosInstance.get(`/records/summary?id=${localStorage.getItem('uid')}`);
                setReportData(response.data); // Store the fetched data
                setLoading(false); // Update loading state
            } catch (error) {
                console.log(error);
                setLoading(false); // Update loading state
            }
        };

        fetchReportData();
    }, []);

    const generatePDF = () => {
        if (!reportData) return; // If there's no report data, exit

        const { patient_info, latest_metrics, medical_history } = reportData;

        const doc = new jsPDF();

        // Add Patient Info
        doc.setFontSize(18);
        doc.text('Patient Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Name: ${patient_info.name}`, 14, 30);
        doc.text(`Gender: ${patient_info.gender}`, 14, 36);
        doc.text(`Contact: ${patient_info.contact_no}`, 14, 42);
        doc.text(`Address: ${patient_info.address}`, 14, 48);
        doc.text(`Date of Birth: ${patient_info.date_of_birth}`, 14, 54);

        // Add Health Metrics
        doc.setFontSize(14);
        doc.text('Health Metrics', 14, 64);
        doc.setFontSize(12);
        doc.text(`Blood Pressure: ${latest_metrics.blood_pressure}`, 14, 70);
        doc.text(`Heart Rate: ${latest_metrics.heart_rate}`, 14, 76);
        doc.text(`Temperature: ${latest_metrics.temperature}`, 14, 82);
        doc.text(`Weight: ${latest_metrics.weight}`, 14, 88);
        doc.text(`Recorded Date: ${new Date(latest_metrics.date_recorded).toLocaleDateString()}`, 14, 94);

        // Add Medical History
        doc.setFontSize(14);
        doc.text('Medical History', 14, 104);

        // Use autoTable for medical history table
        const medicalHistoryRows = medical_history.map((record) => [
            new Date(record.date).toLocaleDateString(),
            record.diagnosis,
            record.treatment.map(t => `${t.medicine} (Start: ${t.start}, End: ${t.end})`).join(', ')
        ]);

        doc.autoTable({
            startY: 110,
            head: [['Date', 'Diagnosis', 'Treatment']],
            body: medicalHistoryRows,
            theme: 'striped',  // You can apply different themes
            styles: { fontSize: 10 },
        });

        // Save the generated PDF
        doc.save('patient_report.pdf');
    };

    if (loading) {
        return <div>Loading report...</div>;
    }

    if (!reportData) {
        return <div>Error fetching report data.</div>;
    }

    const { patient_info, latest_metrics, medical_history } = reportData;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Report</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Patient Info</h2>
                <p><strong>Name:</strong> {patient_info.name}</p>
                <p><strong>Gender:</strong> {patient_info.gender}</p>
                <p><strong>Contact:</strong> {patient_info.contact_no}</p>
                <p><strong>Address:</strong> {patient_info.address}</p>
                <p><strong>Date of Birth:</strong> {patient_info.date_of_birth}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-semibold mb-2">Health Metrics</h2>
                <p><strong>Blood Pressure:</strong> {latest_metrics.blood_pressure}</p>
                <p><strong>Heart Rate:</strong> {latest_metrics.heart_rate}</p>
                <p><strong>Temperature:</strong> {latest_metrics.temperature}</p>
                <p><strong>Weight:</strong> {latest_metrics.weight}</p>
                <p><strong>Recorded Date:</strong> {new Date(latest_metrics.date_recorded).toLocaleDateString()}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-semibold mb-2">Medical History</h2>
                {medical_history.map((record, index) => (
                    <div key={index} className="mb-4">
                        <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                        <p><strong>Treatment:</strong>
                            {record.treatment.map((treatment, idx) => (
                                <span key={idx}>{treatment.medicine} (Start: {treatment.start}, End: {treatment.end})</span>
                            ))}
                        </p>
                    </div>
                ))}
            </div>

            <button
                onClick={generatePDF}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Download Report as PDF
            </button>
        </div>
    );
};

export default Report;
