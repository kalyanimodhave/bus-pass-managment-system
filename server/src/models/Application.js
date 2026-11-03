import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  college: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  course: { type: String, required: true },
  startStop: { type: String, required: true },
  endStop: { type: String, required: true },
  routeName: { type: String, required: true },
  duration: { type: String, enum: ['Monthly', 'Quarterly', 'Yearly'], default: 'Monthly' },
  documents: {
    bonafide: { type: String, required: true },
    idCard: { type: String, required: true },
    photo: { type: String, required: true }
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  passNumber: { type: String, default: '' },
  validUntil: Date
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
