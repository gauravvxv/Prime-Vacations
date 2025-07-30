import { NextResponse } from 'next/server';
import { connect } from '../../../../../utils/connect';
import Complaint from '../../../../../models/complaints';
import { sendEmail } from '../../../../../utils/mailer'; 

export async function PUT(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  try {
    await connect();

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Complaint Status Updated: ${updatedComplaint.title}`,
      text: `
        The status of the complaint "${updatedComplaint.title}" has been updated.
        New Status: ${updatedComplaint.status}
        Updated At: ${new Date().toLocaleString()}
      `,
    });

    return NextResponse.json(updatedComplaint);
  } catch (err) {
    console.error('Error updating complaint:', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = params;
    await Complaint.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete complaint' }, { status: 500 });
  }
}
