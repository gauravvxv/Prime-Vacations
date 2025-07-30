'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message,setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

   if (res.ok && data.role) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role); 
    localStorage.setItem('email',data.email)
    localStorage.setItem('userID',data._id)


    if (data.role === 'admin') {
      router.push('/admin'); 
    } else {
      router.push('/'); 
    }
  } else {
    setMessage(data.message || 'Login failed');
  }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          whileFocus={{ scale: 1.02 }}
        />

        <div className="relative mb-6">
          <motion.input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-12"
            whileFocus={{ scale: 1.02 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <motion.button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold py-3 rounded-lg shadow-md"
          whileTap={{ scale: 0.95 }}
        >
          Log In
        </motion.button>

        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
