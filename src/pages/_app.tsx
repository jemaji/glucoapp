'use client'
import React from 'react';
import { AppProps } from 'next/app';
import RootLayout from '../app/layout';
import '../app/styles/globals.scss';
import { AuthProvider } from '@/app/services/firebaseService';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <AuthProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </AuthProvider>
    );
};

export default MyApp;
