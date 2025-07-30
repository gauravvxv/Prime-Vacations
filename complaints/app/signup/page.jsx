'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message,setMessage] = useState('')
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role: "user"}),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('Signup successful. Please log in.');
      router.push('/login');
    } else {
      setMessage(data.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

        <motion.input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.button
          onClick={handleSignup}
          className="w-full bg-purple-500 hover:bg-purple-600 transition-colors text-white font-semibold py-3 rounded-lg shadow-md"
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 hover:underline">
            Log In
          </Link>
        </p>

         <p className="mt-4 text-center text-sm text-gray-600">
         {message}
        </p>
      </motion.div>
    </div>
  );
}
