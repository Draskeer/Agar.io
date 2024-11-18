const mongoose = require('mongoose');

const InviteTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    expiresAt: { type: Date, required: true },
});
InviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('InviteToken', InviteTokenSchema);