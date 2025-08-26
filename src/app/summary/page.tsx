'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const appId = searchParams.get('appId');

    if (!appId) {
      setError('Application ID is missing. Please return to the application form.');
      return;
    }

    const fetchApplicationData = async (applicationId: string) => {
      setLoadingPayment(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${applicationId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch application data: ${response.status}`);
        }
        const data = await response.json();
        setApplicationData(data);
      } catch (err: any) {
        console.error('Error fetching application data:', err);
        setError(err.message || 'Failed to load application data. Please try again.');
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchApplicationData(appId as string);
  }, [searchParams]);

  // const handlePayment = async () => {
  //   if (!applicationData || !applicationData.appId) {
  //     setError('Application ID is missing. Cannot initiate payment.');
  //     return;
  //   }

  //   setLoadingPayment(true);
  //   setError(null);

  //   try {
  //     const paymentDetails = {
  //       applicationId: applicationData.appId,
  //       amount: 100, // Example amount, you might want to make this dynamic
  //       productInfo: 'Vestiga Application Fee',
  //       firstName: applicationData.name,
  //       email: applicationData.email,
  //     };

  //     const response = await fetch('http://localhost:8080/api/payments/initiate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(paymentDetails),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     window.location.href = data.paymentUrl; // Redirect to PayU

  //   } catch (err: any) {
  //     console.error('Payment initiation failed:', err);
  //     setError(err.message || 'Failed to initiate payment. Please try again.');
  //   } finally {
  //     setLoadingPayment(false);
  //   }
  // };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Card className="max-w-2xl mx-auto shadow-lg bg-red-100 border-red-400 text-red-700">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/apply')}>Return to Application</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!applicationData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Loading summary...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Review Your Application</CardTitle>
          <CardDescription>Please verify the details before proceeding to payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {applicationData.photo && (
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={applicationData.photo}
                alt="Applicant Photo"
                className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Application ID:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.appId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ID Number:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.idNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mobile:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.mobile}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email:</p>
            <p className="text-lg font-semibold text-gray-900">{applicationData.email}</p>
          </div>
          <Button
            // onClick={handlePayment}
            className="w-full mt-6"
            // disabled={loadingPayment}
          >
            {/* {loadingPayment ? 'Processing Payment...' : 'Proceed to Pay with PayU'} */}
            PayU integration temporarily disabled.
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
