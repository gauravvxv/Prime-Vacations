'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchComplaints = async (token) => {
    try {
      const res = await fetch('/api/admin/complaint', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    try {
     const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        router.push('/'); 
        return;
      }

      fetchComplaints(token);
    } catch (err) {
      console.error('Invalid token');
      router.push('/login');
    }
  }, [router]);

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/complaint/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchComplaints(token); 
    }
  };

  const handleDelete = async (id) => {
  const confirm = window.confirm('Are you sure you want to delete this complaint?');
  if (!confirm) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/admin/complaint/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchComplaints(token); 
    } else {
      console.error('Failed to delete complaint');
    }
  } catch (error) {
    console.error('Error deleting complaint:', error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };


  const filteredComplaints = complaints.filter((c) => {
    return (
      (!filterStatus || c.status === filterStatus) &&
      (!filterPriority || c.priority === filterPriority)
    );
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
  
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Complaint Dashboard</h2>

           <div className="w-full max-w-4xl flex justify-center pl-68">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id} className="border-t">
                <td className="py-2 px-4 font-medium">{complaint.title}</td>
                <td className="py-2 px-4">{complaint.category}</td>
                <td className="py-2 px-4">{complaint.priority}</td>
                <td className="py-2 px-4">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <select
                    value={complaint.status}
                    onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              <td className="py-2 px-4 flex gap-2">
  <button
    onClick={() => handleDelete(complaint._id)}
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
