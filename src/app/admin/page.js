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


export default function AdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vestiga-backend-node.onrender.com'}api/applications`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setApplications(result.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vestiga-backend-node.onrender.com'}api/applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete application: ${response.status}`);
      }
      toast.success('Application deleted successfully!');
      fetchApplications(); // Refresh the list
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error(err.message || 'Failed to delete application.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allApplicationIds = new Set(applications.map((app) => app._id));
      setSelectedApplications(allApplicationIds);
    } else {
      setSelectedApplications(new Set());
    }
  };

  const handleSelectOne = (id, checked) => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vestiga-backend-node.onrender.com'}/api/applications/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedApplications) })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete applications: ${response.status}`);
      }
      
      const result = await response.json();
      toast.success(result.message || `${selectedApplications.size} applications deleted successfully!`);
      setSelectedApplications(new Set()); // Clear selection
      fetchApplications(); // Refresh the list
    } catch (err) {
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
                        onCheckedChange={(checked) => handleSelectAll(checked)}
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
                    <TableRow key={app._id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedApplications.has(app._id)}
                          onCheckedChange={(checked) => handleSelectOne(app._id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-xs">{app._id}</TableCell>
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
                            <Link href={`/admin/edit/${app._id}`}>Edit</Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(app._id)}>
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
