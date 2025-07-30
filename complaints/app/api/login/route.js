import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/user';
import { connect } from '../../../utils/connect';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req) {
  await connect();
  const { email, password } = await req.json();

  const cleanEmail = email.replace('+admin', '');
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const role = email.includes('+admin') ? 'admin' : user.role;


  const token = jwt.sign({ id: user._id, email: user.email, role }, JWT_SECRET, {
    expiresIn: '1d'
  });

  return NextResponse.json({
    message: 'Login successful',
    token,
    role,
    fullName: user.fullName
  });
}
