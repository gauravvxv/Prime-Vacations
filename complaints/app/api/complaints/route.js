import { NextResponse } from 'next/server';
import { connect } from '../../../utils/connect';
import Complaint from '../../../models/complaints';
import { sendEmail } from '../../../utils/mailer'; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, category, priority } = body;

    if (!title || !description || !category || !priority) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connect();

    const newComplaint = new Complaint({
      title,
      description,
      category,
      priority,
    });

    await newComplaint.save(); 


    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Complaint Submitted: ${newComplaint.title}`,
      text: `
        A new complaint has been submitted.
        Title: ${newComplaint.title}
        Category: ${newComplaint.category}
        Priority: ${newComplaint.priority}
        Description: ${newComplaint.description}
      `,
    });

    return NextResponse.json({ message: 'Complaint submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/complaints:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
