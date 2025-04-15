import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

function LeaveRequestForm(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState(
        () =>
            location.state || {
                firstName: "",
                lastName: "",
                employeeId: "",
                email: "",
                managerId: "",
                managerEmail: "",
                leaveRequestFor: "Days",
                leaveType: "",
                leaveStartDate: "",
                leaveEndDate: "",
                duration: "",
                comments: "",
                medicalDocument: null,
                LOP: false,
            }
    );
    const [selectedFile, setSelectedFile] = useState(null); // New state for file upload
    const [errors, setErrors] = useState(false);
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [leaveError, setLeaveError] = useState(""); // To set leave balance error from backend
    const [loading, setLoading] = useState(false);
    const [remainingLeaveDays, setRemainingLeaveDays] = useState(null); // State for remaining leave days
    const [showLop, setShowLop] = useState(false);

    // use useeffect to populate formdata when the component loads
    useEffect(() => {
        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName");
        const email = localStorage.getItem("email");
        const employeeId = localStorage.getItem("employeeId");
        console.log("localstorage:", {firstName, lastName, email, employeeId});
        if (firstName && lastName && email && employeeId) {
            //set the retrieved data in the form state
            setFormData((prevData) => ({
                ...prevData,
                firstName: prevData.firstName || firstName,
                lastName: prevData.lastName || lastName,
                email: prevData.email || email,
                employeeId: prevData.employeeId || employeeId,
            }));
        } else {
            // If the data is not found in localStorage, you can redirect or show an error
            navigate("/login"); // Redirect to login if not found
        }
    }, [navigate]); // this will run once wen the component mounts

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeId = localStorage.getItem("employeeId");
                if (!employeeId) {
                    console.error("Employee ID not found in localStorage");
                    return;
                }
                const token = localStorage.getItem("token");

                const [originResponse] = await Promise.all([
                    axios.get(
                        `https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/origin/${employeeId}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    ),
                ]);

                // Log the data to the console
                console.log("hello");
                console.log("API Response:", originResponse);

                const responseData = originResponse.data;
                console.log("response data: ", responseData);

                const currentEmployee = responseData.find(
                    (emp) => emp.employeeId === employeeId
                );
                console.log("manager id:", currentEmployee.reportingTo);
                if (currentEmployee) {
                    const managerId = currentEmployee.reportingTo;
                    const manager = responseData.find(
                        (emp) => emp.employeeId === managerId
                    );
                    console.log("Manager Details:", manager);

                    setFormData((prevData) => ({
                        ...prevData,
                        // employeeId: prevData.employeeId,
                        managerId: prevData.managerId || managerId,
                        managerEmail: prevData.managerEmail || manager?.email,
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures the effect runs once on component mount

    useEffect(() => {
        const fetchRemainingLeaveDays = async (
            employeeId,
            leaveType,
            leaveStartDate,
            leaveEndDate
        ) => {
            try {
                const token = localStorage.getItem("token");
                console.log(token);
                const response = await axios.get(
                    "https://ssitcloudbackend.azurewebsites.net/api/leaves/remaining-leaves",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        params: {employeeId, leaveType, leaveStartDate, leaveEndDate},
                    }
                );
                console.log("Fetching remaining leave days...");
                console.log("Employee ID:", employeeId);
                console.log("Leave Type:", leaveType);
                console.log("Leave Start Date:", leaveStartDate);
                console.log("Leave End Date:", leaveEndDate);
                console.log(leaveStartDate);
                console.log(leaveEndDate);

                // Ensure the response is a valid number
                console.log(response);
                const remainingDays = response.data;
                console.log("remain:", remainingDays);
                if (typeof remainingDays === "number" && !isNaN(remainingDays)) {
                    const currentDuration = calculateDuration(
                        leaveStartDate,
                        leaveEndDate
                    );
                    if (remainingDays >= currentDuration) {
                        // const remain = remainingDays - formData.duration;
                        setRemainingLeaveDays(remainingDays - currentDuration);
                        showLop(false); // Set the remaining leave days in state
                    } else {
                        setShowLop(true);
                        setRemainingLeaveDays(
                            "You don't have enough remaining leave days."
                        );
                        setErrors(true);
                    }
                } else {
                    setRemainingLeaveDays("Invalid data received from the server.");
                    setErrors(true);
                }
            } catch (error) {
                console.error("Error fetching remaining leave days:", error);
                setRemainingLeaveDays("Error fetching leave data.");
                setErrors(true);
            }
        };
        if (location.state && location.state.edit) {
            setIsEditing(true);
            const {
                employeeId,
                leaveType,
                leaveStartDate,
                leaveEndDate,
                medicalDocument,
            } = location.state;

            // Initialize formData and selectedFile
            setFormData((prevData) => ({
                ...prevData,
                ...location.state,
                leaveStartDate: leaveStartDate || "",
                leaveEndDate: leaveEndDate || "",
                leaveType: leaveType || "",
            }));
            if (medicalDocument) {
                setSelectedFile(medicalDocument);
            }

            // Fetch remaining leave days initially
            fetchRemainingLeaveDays(
                employeeId,
                leaveType,
                leaveStartDate,
                leaveEndDate
            );
        }
    }, [location.state, showLop]);

    const handleChange = (e) => {
        const {name, value, checked} = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "LOP" ? checked : value,
        }));
        if (["leaveType", "leaveStartDate", "leaveEndDate"].includes(name)) {
            fetchRemainingLeaveDays(
                formData.employeeId,
                name === "leaveType" ? value : formData.leaveType,
                name === "leaveStartDate" ? value : formData.leaveStartDate,
                name === "leaveEndDate" ? value : formData.leaveEndDate
            );
        }

        if (name === "leaveType") {
            setIsCommentsEnabled(value === "OTHERS");
        }
    };

    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);

    const handleFileChange = (event) => {
        //  const { name} = event.target;
        const file = event.target.files[0];
        setSelectedFile(file);
        setFormData((prevData) => ({
            ...prevData,
            medicalDocument: file,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLeaveError(""); // Reset error messages
        setErrors(false); // Reset error state

        // Validation: Check for medical document if leave type is "SICK" and duration > 2
        if (
            formData.leaveType === "SICK" &&
            formData.duration > 2 &&
            !formData.medicalDocument &&
            !location.state?.medicalDocument
        ) {
            setLeaveError("Please upload a document");
            return;
        }

        // Validation: Check if all required fields are filled
        const requiredFields = ["leaveStartDate", "leaveEndDate", "leaveType"];

        const hasEmptyFields = requiredFields.some((field) => !formData[field]);
        console.log("Checking required fields:", requiredFields);
        requiredFields.forEach((field) => {
            console.log(`${field}: ${formData[field]}`);
        });

        if (hasEmptyFields) {
            setLeaveError("");
            setErrors(true);
            return;
        }

        // Check if Start Date is after End Date
        if (new Date(formData.leaveStartDate) > new Date(formData.leaveEndDate)) {
            setLeaveError(
                "Inappropriate dates: Start date cannot be after the End date."
            );
            setErrors(true);
            return;
        }

        // Check if LOP is required but not acknowledged
        if (
            remainingLeaveDays === "You don't have enough remaining leave days." &&
            !formData.LOP
        ) {
            setLeaveError("You must acknowledge LOP to proceed.");
            setErrors(true);
            return;
        }

        // Prepare FormData for submission
        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                //Check if value exists before appending
                data.append(key, formData[key]);
            }
        }
        if (selectedFile) {
            data.append("medicalDocument", selectedFile); // Attach medical document if provided
        } else if (location.state?.medicalDocument) {
            data.append("medicalDocument", location.state.medicalDocument); // Keep the previous document if editing
        }

        setLoading(true); // Indicate loading state

        try {
            const token = localStorage.getItem("token");
            console.log(formData);
            const url = isEditing
                ? `https://ssitcloudbackend.azurewebsites.net/api/leaves/update/${formData.id}`
                : `https://ssitcloudbackend.azurewebsites.net/api/leaves/submit`;

            let response;
            if (!isEditing) {
                console.log("POST Request:", formData);
                response = await axios({
                    method: "POST",
                    url,
                    data,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                console.log("PUT Request:", formData);
                response = await axios({
                    method: "PUT",
                    url,
                    data: formData,
                    // headers : {
                    //   'Content-Type' :  'multipart/form-data',
                    // },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            // Handle success
            if (response.status === 200) {
                if (isEditing) {
                    navigate("/LeaveManagement");
                } else {
                    props.close();
                }
            } else {
                setLeaveError("Error processing the request. Please try again.");
            }
        } catch (error) {
            // Handle errors
            console.log(error);
            if (error.response?.data?.leavesCompleted) {
                setShowLop(true);
            }
            if (error.response.data === "An internal error occurred") {
                setLeaveError("managerId not found" || "Error occured");
            } else {
                setLeaveError(error.response.data || "Error occurred");
            }
            console.log(error.response.data);

            setErrors(true);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const fetchRemainingLeaveDays = async (
        employeeId,
        leaveType,
        leaveStartDate,
        leaveEndDate
    ) => {
        try {
            const token = localStorage.getItem("token");
            console.log(token);
            const response = await axios.get(
                "https://ssitcloudbackend.azurewebsites.net/api/leaves/remaining-leaves",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: {employeeId, leaveType, leaveStartDate, leaveEndDate},
                }
            );
            console.log("Fetching remaining leave days...");
            console.log("Employee ID:", employeeId);
            console.log("Leave Type:", leaveType);
            console.log("Leave Start Date:", leaveStartDate);
            console.log("Leave End Date:", leaveEndDate);
            console.log(leaveStartDate);
            console.log(leaveEndDate);

            // Ensure the response is a valid number
            const remainingDays = response.data;
            console.log("remain:", remainingDays);
            if (typeof remainingDays === "number" && !isNaN(remainingDays)) {
                const currentDuration = calculateDuration(leaveStartDate, leaveEndDate);
                if (remainingDays >= currentDuration) {
                    // const remain = remainingDays - formData.duration;
                    setRemainingLeaveDays(remainingDays - currentDuration); // Set the remaining leave days in state
                } else {
                    setRemainingLeaveDays("You don't have enough remaining leave days.");
                    setErrors(true);
                }
            } else {
                setRemainingLeaveDays("Invalid data received from the server.");
                setErrors(true);
            }
        } catch (error) {
            console.error("Error fetching remaining leave days:", error);
            setRemainingLeaveDays("fetching....");
            setErrors(true);
        }
    };

    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        let totalDays = 0;

        for (
            let date = new Date(start);
            date <= end;
            date.setDate(date.getDate() + 1)
        ) {
            const day = date.getDay();
            if (day !== 0 && day !== 6) {
                // Exclude weekends (0 is Sunday, 6 is Saturday)
                totalDays++;
            }
        }

        return totalDays;
    };

    // Disable weekends and holidays in the date picker
    const disableDate = (date) => {
        const day = date.getDay();
        return day === 0 && day === 6; // Disable weekends and holidays
    };

    // Update duration when both dates are set
    useEffect(() => {
        const calculateDuration = (startDate, endDate) => {
            if (!startDate || !endDate) return 0;

            const start = new Date(startDate);
            const end = new Date(endDate);
            let totalDays = 0;

            for (
                let date = new Date(start);
                date <= end;
                date.setDate(date.getDate() + 1)
            ) {
                const day = date.getDay();
                if (day !== 0 && day !== 6) {
                    // Exclude weekends (0 is Sunday, 6 is Saturday)
                    totalDays++;
                }
            }

            return totalDays;
        };
        if (formData.leaveStartDate && formData.leaveEndDate) {
            const duration = calculateDuration(
                formData.leaveStartDate,
                formData.leaveEndDate
            );
            setFormData((prevData) => ({
                ...prevData,
                duration,
            }));
        }
    }, [formData.leaveStartDate, formData.leaveEndDate]);

    //const md = formData.medicalDocument
    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8"
            >
                <h1 className="text-2xl font-bold text-center font-Playfair-Display mb-6">
                    {isEditing ? "EDIT LEAVE REQUEST" : "NEW LEAVE REQUEST"}
                </h1>

                {/* Leave Dates */}
                {/* Leave Start and End Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label htmlFor="leaveStartDate" className="mb-1">
                            Leave Start Date
                        </label>
                        <input
                            type="date"
                            name="leaveStartDate"
                            className="p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm"
                            value={formData.leaveStartDate}
                            onChange={handleChange}
                            // min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                            disabled={disableDate(new Date(formData.leaveStartDate))}
                        />
                        {errors && formData.leaveStartDate === "" && (
                            <span className="text-red-600 text-sm">
                Leave Start Date is required
              </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="leaveEndDate" className="mb-1">
                            Leave End Date
                        </label>
                        <input
                            type="date"
                            name="leaveEndDate"
                            className="p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm"
                            value={formData.leaveEndDate}
                            onChange={handleChange}
                            // min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                            disabled={disableDate(new Date(formData.leaveEndDate))}
                        />
                        {errors && formData.leaveEndDate === "" && (
                            <span className="text-red-600 text-sm">
                Leave End Date is required
              </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    {/* Duration */}
                    <div className="flex flex-col">
                        <label htmlFor="duration" className="mb-1">
                            Duration (Days)
                        </label>
                        <input
                            type="text"
                            name="duration"
                            className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                            value={formData.duration}
                            readOnly
                        />
                        {/* {errors && formData.duration === '' &&
                        <span className="text-red-600 text-sm">Duration is required</span>} */}
                    </div>

                    {/* Leave Type */}
                    <div className="flex flex-col">
                        <label htmlFor="leaveType" className="mb-1">
                            Leave Type
                        </label>
                        <div className="flex items-center space-x-2">
                            <select
                                name="leaveType"
                                className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                                onChange={handleChange}
                                value={formData.leaveType}
                            >
                                <option value="">Select Leave Type</option>
                                <option value="SICK">Sick Leave</option>
                                <option value="CASUAL">Casual Leave</option>
                                <option value="VACATION">Vacation Leave</option>
                                <option value="MARRIAGE">Marriage Leave</option>
                                <option value="MATERNITY">Maternity Leave</option>
                                <option value="PATERNITY">Paternity Leave</option>
                                <option value="OTHERS">Others</option>
                            </select>
                        </div>
                        {errors && formData.leaveType === "" && (
                            <span className="text-red-600 text-sm">
                Leave Type is required
              </span>
                        )}
                    </div>

                    {formData.leaveType === "SICK" && formData.duration > 2 && (
                        <div className="flex flex-col">
                            <label htmlFor="document" className="mb-1">
                                Upload Document
                            </label>

                            {selectedFile ? (
                                <a
                                    href={
                                        typeof selectedFile === "string"
                                            ? selectedFile
                                            : URL.createObjectURL(selectedFile)
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline mb-2"
                                >
                                    View document
                                </a>
                            ) : (
                                <span className="text-red-600 mb-2">No document</span>
                            )}

                            <input
                                type="file"
                                name="document"
                                onChange={handleFileChange}
                                className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="remainingLeaveDays" className="mb-1">
                            Remaining Leave Days
                        </label>
                        <input
                            type="text"
                            name="remainingLeaveDays"
                            className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                            value={remainingLeaveDays || "N/A"} // Show remaining leave days or N/A if not available
                            readOnly
                        />
                    </div>

                    {/* Comments for "OTHERS" Leave Type */}
                    {isCommentsEnabled && (
                        <div className="flex flex-col">
                            <label htmlFor="comments" className="mb-1">
                                Comments
                            </label>
                            <textarea
                                name="comments"
                                rows="4"
                                className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                                onChange={handleChange}
                                value={formData.comments}
                            ></textarea>
                        </div>
                    )}

                    {leaveError && (
                        <span className="text-red-600 text-sm">{leaveError}</span>
                    )}
                </div>
                {remainingLeaveDays ===
                    "You don't have enough remaining leave days." && (
                        <div>
                            <input type="checkbox" onChange={handleChange} name="LOP"/>
                            <label>LOP</label>
                        </div>
                    )}

                <button
                    type="submit"
                    className={`w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : isEditing
                            ? "Update Leave"
                            : "Submit Leave"}
                </button>
            </form>
        </div>
    );
}

export default LeaveRequestForm;