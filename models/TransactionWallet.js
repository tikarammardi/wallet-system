const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionWalletSchema = new Schema({
    wallet_id: {
        type: String,
        required: true,
        ref: 'Wallet'
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
});
const TransactionWallet = mongoose.model('transaction_wallet', TransactionWalletSchema);
module.exports = TransactionWallet;
