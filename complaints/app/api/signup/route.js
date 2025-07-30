import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../models/user';
import  {connect}  from '../../../utils/connect';

export async function POST(req) {
  await connect();
  const { fullName, email, password, role } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, email, password: hashedPassword, role });
  await newUser.save();

  return NextResponse.json({ success: 'Signup Successfull' });
}