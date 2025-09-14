'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, Suspense } from 'react';

function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appId = searchParams.get('appId');

  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appId) {
      setError('Application ID is missing. Please return to the application form.');
      setLoading(false);
      return;
    }

    const fetchApplicationData = async (applicationId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vestiga-backend-node.onrender.com'}/api/applications/${applicationId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch application data: ${response.status}`);
        }
        const result = await response.json();
        setApplicationData(result.data ?? result);
      } catch (err) {
        console.error('Error fetching application data:', err);
        setError(err.message || 'Failed to load application data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData(appId);
  }, [appId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Loading summary...</p>
      </div>
    );
  }

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
            <p className="text-lg font-semibold text-gray-900">{applicationData._id}</p>
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
          <Button className="w-full mt-6" disabled>
            PayU integration temporarily disabled.
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SummaryClient() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading...</div>}>
      <SummaryContent />
    </Suspense>
  );
}
