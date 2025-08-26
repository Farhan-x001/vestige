'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { Input } from '@/components/ui/input'; // Import Input
import { toast } from 'sonner'; // Corrected Import toast

interface Application {
  id: string;
  name: string;
  idNumber: string;
  address: string;
  mobile: string;
  email: string;
  photo?: string;
  paymentStatus: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Application[] = await response.json();
      setApplications(data);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete application: ${response.status}`);
      }
      toast.success('Application deleted successfully!');
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting application:', err);
      toast.error(err.message || 'Failed to delete application.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allApplicationIds = new Set(applications.map((app) => app.id));
      setSelectedApplications(allApplicationIds);
    } else {
      setSelectedApplications(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelectedApplications = new Set(selectedApplications);
    if (checked) {
      newSelectedApplications.add(id);
    } else {
      newSelectedApplications.delete(id);
    }
    setSelectedApplications(newSelectedApplications);
  };

  const handleDeleteSelected = async () => {
    if (selectedApplications.size === 0) {
      toast.info('Please select at least one application to delete.');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedApplications.size} selected applications?`)) {
      return;
    }

    setLoading(true);
    try {
      const deletePromises = Array.from(selectedApplications).map(id =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${id}`, {
          method: 'DELETE',
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to delete application ${id}: ${response.status}`);
          }
          return response.text();
        })
      );
      await Promise.all(deletePromises);
      toast.success(`${selectedApplications.size} applications deleted successfully!`);
      setSelectedApplications(new Set()); // Clear selection
      fetchApplications(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting selected applications:', err);
      toast.error(err.message || 'Failed to delete selected applications.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      app.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      app.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      app.mobile.includes(lowerCaseSearchTerm) ||
      app.idNumber.includes(lowerCaseSearchTerm) ||
      app.address.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Loading applications...</p>
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
            <Button onClick={fetchApplications}>Retry</Button>
          </CardContent>
        </Card>
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
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>Manage all submitted applications.</CardDescription>
          </div>
          <div className="flex space-x-2">
            {selectedApplications.size > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected} disabled={loading}>
                Delete Selected ({selectedApplications.size})
              </Button>
            )}
            <Button asChild>
              <Link href="/admin/add">Add New Application</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, mobile, ID number, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {filteredApplications.length === 0 ? (
            <p className="text-center text-gray-500">No applications found matching your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-center">
                      <Checkbox
                        checked={selectedApplications.size === applications.length && applications.length > 0}
                        onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                        disabled={applications.length === 0}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedApplications.has(app.id)}
                          onCheckedChange={(checked: boolean) => handleSelectOne(app.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-xs">{app.id}</TableCell>
                      <TableCell className="text-xs">{app.name}</TableCell>
                      <TableCell className="text-xs">{app.idNumber}</TableCell>
                      <TableCell className="text-xs">{app.address}</TableCell>
                      <TableCell className="text-xs">{app.email}</TableCell>
                      <TableCell className="text-xs">{app.mobile}</TableCell>
                      <TableCell>
                        {app.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.photo} alt="Applicant Photo" className="w-10 h-10 object-cover rounded-full" />
                        ) : (
                          <span className="text-xs text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{app.paymentStatus}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/edit/${app.id}`}>Edit</Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(app.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
