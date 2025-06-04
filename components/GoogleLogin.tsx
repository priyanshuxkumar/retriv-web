import { GoogleLogin } from '@react-oauth/google';
import { redirect } from 'next/navigation';

export default function GoogleLoginButton() {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;
    return (
        <GoogleLogin
            text="continue_with"
            shape="square"
            logo_alignment="center"
            theme="filled_blue"
            onSuccess={async (credentialResponse) => {
                const res = await fetch(`${SERVER_URL}/api/v1/auth/google`, {
                    method: 'POST',
                    body: JSON.stringify({ credential: credentialResponse.credential }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (res.ok) {
                    redirect('/agent');
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
}
