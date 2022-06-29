const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },

});
const Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;
