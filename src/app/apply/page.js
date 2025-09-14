'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Import toast

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  idNumber: z.string().min(5, { message: 'ID Number must be at least 5 characters.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Mobile number must be 10 digits.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  photo: z.string().optional(), // Changed from z.any().optional()
});

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      idNumber: '',
      address: '',
      mobile: '',
      email: '',
      photo: '',
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    console.log('Application submitted:', values);

    try {
      // Validate photo size before sending
      if (values.photo && values.photo.length > 10000000) { // 10MB limit
        throw new Error('Photo is too large. Please use an image smaller than 5MB.');
      }

      // API call to Node.js backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vestiga-backend-node.onrender.com'}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Backend now returns JSON with success and data fields
      const result = await response.json();
      const appId = result.data;
      console.log('Application submitted:', { ...values, appId });
      toast.success('Application submitted successfully!');

      // Redirect to the summary page with only the appId
      router.push(`/summary?appId=${appId}`);

    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Apply for Vestiga</h1>
        <p className="text-center text-gray-600 mb-8">Fill out the form below to submit your application.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, Anytown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Photo Upload (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          // Check file size (5MB limit)
                          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                          if (file.size > maxSize) {
                            alert('File size must be less than 5MB');
                            event.target.value = ''; // Clear the input
                            return;
                          }
                          
                          setImageProcessing(true);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            try {
                              onChange(reader.result); // Send Base64 string
                              setImageProcessing(false);
                            } catch (error) {
                              console.error('Error processing image:', error);
                              alert('Error processing image. Please try a different file.');
                              event.target.value = ''; // Clear the input
                              setImageProcessing(false);
                            }
                          };
                          reader.onerror = () => {
                            console.error('Error reading file');
                            alert('Error reading file. Please try again.');
                            event.target.value = ''; // Clear the input
                            setImageProcessing(false);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          onChange(''); // Clear the field if no file is selected
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
                  {imageProcessing && (
                    <p className="text-sm text-blue-500">Processing image...</p>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
