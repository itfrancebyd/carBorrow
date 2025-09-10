// import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '../../components/forms/loginForm';
import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="font-extrabold text-2xl mb-10">MMCar</div>
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}