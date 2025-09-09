// import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '../../components/forms/loginForm';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div></div>
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}