import React from 'react';
import { GoogleLogin } from 'react-google-login';


const GoogleSignIn = () => {
    const handleSuccess = async (response: any) => {
        const { tokenId } = response;

        try {
            const res = await fetch('/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_token: tokenId }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log('User created:', data);
                // Handle successful user creation here, like redirecting or updating state
            } else {
                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleError = (error: any) => {
        console.error('Google Sign-In Error:', error);
    };

    return (
        <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={handleSuccess}
            // onError={handleError}
            cookiePolicy={'single_host_origin'}
        />
    );
};

export default GoogleSignIn;
