import React, { useState } from 'react';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here, you would typically send the feedback to an API for processing
        console.log({ feedback, rating });

        // Simulate feedback submission
        setSubmitted(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Leave Your Feedback</h2>

            {submitted ? (
                <div className="text-green-600 font-semibold">
                    Thank you for your feedback!
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                            Your Feedback
                        </label>
                        <textarea
                            id="feedback"
                            rows="4"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                            Your Satisfaction Rating
                        </label>
                        <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border rounded-md"
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num} - {['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'][num - 1]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit Feedback
                    </button>
                </form>
            )}
        </div>
    );
};

export default Feedback;
