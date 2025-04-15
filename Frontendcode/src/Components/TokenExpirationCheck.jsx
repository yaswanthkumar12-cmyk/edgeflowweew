import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const TokenExpirationCheck = () => {
    const navigate = useNavigate(); // Navigate hook to redirect
    const token = localStorage.getItem('token'); // Get token from localStorage

    // Helper function to check if the token is expired
    const isTokenExpired = (token) => {
        try {
            const { exp } = jwtDecode(token);
            // Compare current time with token's expiration time

            console.log(Date.now() >= exp * 1000);
            return Date.now() >= exp * 1000;
        } catch (error) {
            console.error("Invalid token:", error);
            return true; // Treat as expired if decoding fails
        }
    };

    // Check token validity and manage redirection
    useEffect(() => {
        // Run every 1 minutes or you can adjust interval time
        const intervalId = setInterval(() => {
            isTokenExpired(token);
            if (!token || isTokenExpired(token)) {
                console.log('Token expired or missing. Redirecting to login...');
                localStorage.removeItem('token'); // Clear invalid token
                // Optionally clear other session data
                localStorage.removeItem('email');
                localStorage.removeItem('role');
                localStorage.clear();

                navigate('/login'); // Redirect to login page
            } else {
                console.log('Token is still valid.');
            }
        }, 1 * 60 * 100); // Check every 1 minutes (1 * 60 * 1000 ms)

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [token, navigate]);

    return null; // Since this is just a logic component, it does not render anything
};

export default TokenExpirationCheck;
