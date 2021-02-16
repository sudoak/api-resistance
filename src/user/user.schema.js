const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const apiUserSchema = new Schema({
    userId: {
      type: String,
      required: true
    },
    ip: {
      type: Number,
      required: true
    }
},
    { 
        timestamps: { 
            createdAt: 'created_at' ,
            updatedAt: 'updated_at'
        } 
    }
);

module.exports = mongoose.model('api-user', apiUserSchema);