const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  targetModel: {
    type: String,
  },
  details: {
    type: Object,
  },
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
