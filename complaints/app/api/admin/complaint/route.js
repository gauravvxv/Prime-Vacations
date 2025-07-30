import { NextResponse } from 'next/server';
import  { connect }  from '../../../../utils/connect';
import Complaint from '../../../../models/complaints';

export async function GET(){
    try {
        await connect();
         const complaints = await Complaint.find().sort({ createdAt: -1 });
    return NextResponse.json(complaints);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching complaints' }, { status: 500 });
    }
}