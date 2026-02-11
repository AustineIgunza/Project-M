import { useState } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import TwoFactorForm from '@/components/auth/TwoFactorForm';

const LoginPage = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  return (
    <AuthLayout>
      {showTwoFactor ? (
        <TwoFactorForm />
      ) : (
        <LoginForm />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
