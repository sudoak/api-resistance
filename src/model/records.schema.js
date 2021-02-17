import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    device_id: String,
    e1: Number,
    e2: Number,
    e3: Number,
    e4: Number,
    e5: Number,
    recordedTime: String,
    date: String,
});

module.exports = mongoose.model('records', recordSchema);

