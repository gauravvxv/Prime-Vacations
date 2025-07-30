'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/complaints', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus)=> {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/complaints/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchComplaints(); // refresh list
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    return (
      (!filterStatus || c.status === filterStatus) &&
      (!filterPriority || c.priority === filterPriority)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Complaint Dashboard</h2>

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
                <td className="py-2 px-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
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
                <td className="py-2 px-4">
                  <button
                    onClick={() => alert(complaint.description)}
                    className="text-blue-600 hover:underline"
                  >
                    View
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
