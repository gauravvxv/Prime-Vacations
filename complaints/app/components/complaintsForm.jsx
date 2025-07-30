'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ComplaintForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Product');
  const [priority, setPriority] = useState('Low');
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !category || !priority) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
           title,
           description, 
           category,
            priority,
            email
           }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Complaint submitted successfully!');
        setTitle('');
        setDescription('');
        setCategory('Product');
        setPriority('Low');
        router.refresh();
      } else {
        setMessage(data.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Try again later.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-blue-100 px-4">
      <div className="w-full max-w-4xl flex justify-end mt-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Submit a Complaint</h2>

        <motion.input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Complaint Title"
          className="w-full px-4 py-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          whileFocus={{ scale: 1.01 }}
        />

        <motion.textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full px-4 py-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          whileFocus={{ scale: 1.01 }}
        />

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="Support">Support</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Priority</label>
          <div className="flex gap-6">
            {['Low', 'Medium', 'High'].map((level) => (
              <label key={level} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={priority === level}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-radio text-blue-500"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </motion.button>
         <p className='text-blue-500 flex justify-center pt-5'>
          {message}
        </p>
      </motion.div>
    </div>
  );
}
