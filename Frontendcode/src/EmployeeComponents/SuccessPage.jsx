import React from 'react';

const SuccessPage = ({ formData, onCancel }) => {
    const { credentials } = formData; // Assuming formData has credentials


    return (
        <div className="success-page p-6">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">Success!</h2>
            <p className="mt-2 text-sm text-gray-600">The employee has been successfully registered.</p>

            {credentials && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Login Credentials</h3>
                    <p className="mt-2 text-sm text-gray-700">
                        <strong>Corporate Email:</strong> {credentials.corporateEmail}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        <strong>Password:</strong> {credentials.password || "No password is available"}
                    </p>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    className="text-sm font-semibold text-indigo-600 hover:underline"
                    onClick={onCancel}

                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
