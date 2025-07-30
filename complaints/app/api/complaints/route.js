import { NextResponse } from 'next/server';
import { connect } from '../../../utils/connect';
import Complaint from '../../../models/complaints';
import User from '../../../models/user';
import { sendEmail } from '../../../utils/mailer'; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, category, priority,email } = body;

    if (!title || !description || !category || !priority || !email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connect();
     const user = await User.findOne({ email });

    const newComplaint = new Complaint({
      title,
      description,
      category,
      priority,
       submittedBy: user._id,
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
        Submitted By: ${user.email}
      `,
    });

  await sendEmail({
  to: user.email,
  subject: `Complaint Submitted Successfully - ${newComplaint.title}`,
  text: `
Hi ${user.fullName || 'User'},

Thank you for submitting your complaint. We have successfully received it and our support team will review it shortly.

📌 Complaint Details:
• Title: ${newComplaint.title}
• Category: ${newComplaint.category}
• Priority: ${newComplaint.priority}
• Description: ${newComplaint.description}
• Status: ${newComplaint.status}

You can expect a response from our team within 24–48 hours depending on the priority level.

We appreciate your patience and will keep you updated on the progress.

Best regards,  
Support Team  
Prime Vacations
  `,
});


    return NextResponse.json({ message: 'Complaint submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/complaints:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
