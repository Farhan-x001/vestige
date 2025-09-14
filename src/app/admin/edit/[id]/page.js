'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner'; // Import toast


const formSchema = z.object({
  name.string().min(2, { message'Name must be at least 2 characters.' }),
  idNumber.string().min(5, { message'ID Number must be at least 5 characters.' }),
  address.string().min(10, { message'Address must be at least 10 characters.' }),
  mobile.string().regex(/^\d{10}$/, { message'Mobile number must be 10 digits.' }),
  email.string().email({ message'Invalid email address.' }),
  photo.string().optional(),
  paymentStatus.string().optional(),
});

export default function EditApplicationPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver(formSchema),
    defaultValues{
      name'',
      idNumber'',
      address'',
      mobile'',
      email'',
      photo'',
      paymentStatus'PENDING',
    },
  });

  useEffect(() => {
    if (id) {
      fetchApplicationDetails(id as string);
    }
  }, [id, fetchApplicationDetails]); // Added fetchApplicationDetails to dependency array

  const fetchApplicationDetails = async (applicationId) => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${applicationId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch application details${response.status}`);
      }
      const data = await response.json();
      form.reset(data); // Pre-fill the form with fetched data
    } catch (err) { // Changed 'any' to 'unknown'
      console.error('Error fetching application details:', err);
      setError((err as Error).message || 'Failed to load application details.'); // Safely cast err to Error
    } finally {
      setInitialLoading(false);
    }
  };

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${id}`, {
        method'PUT',
        headers{ 'Content-Type''application/json' },
        body.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status${response.status} - ${errorText}`);
      }

      const updatedApplication = await response.json();
      form.reset(updatedApplication);
      toast.success('Application updated successfully!');
      router.push('/admin'); // Redirect back to admin dashboard

    } catch (err) { // Changed 'any' to 'unknown'
      console.error('Error updating application:', err);
      toast.error((err as Error).message || 'Failed to update application. Please try again.'); // Safely cast err to Error
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg bg-red-100 border-red-400 text-red-700">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchApplicationDetails(id as string)}>Retry</Button>
            <Button variant="outline" className="ml-2" onClick={() => router.push('/admin')}>Back to Admin</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity, y }}
      animate={{ opacity, y }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12"
    >
      <Card className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 mb-2">Edit Application</CardTitle>
          <CardDescription className="text-center text-gray-600 mb-6">Update the details for the application.</CardDescription>
        </CardHeader>
        <CardContent>
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
                render={({ field{ value, onChange, ...fieldProps } }) => (
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
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            onChange('');
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="DONE">DONE</SelectItem>
                        <SelectItem value="FAILED">FAILED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' 'Update Application'}
              </Button>
              <Button type="button" variant="outline" className="w-full mt-2" onClick={() => router.push('/admin')}>
                Cancel
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
