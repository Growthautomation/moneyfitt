"use client"

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const Auth = () => {
  const superbase = createClient();
  const handleGoogleSignIn = () => {
    superbase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/callback'
        }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Image
              src="/google-logo.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            <span>Sign in with Google</span>
          </Button>
          {/* Add more SSO buttons here */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
