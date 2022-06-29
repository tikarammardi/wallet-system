const { TRANSACTION_TYPE } = require('../lib/constants')
const Wallet = require('../models/Wallet')
const TransactionWallet = require('../models/TransactionWallet')
class WalletService {

    async getWalletInfoById(params) {
        try {
            const attributes = {
                _id: 1,
                name: 1,
                created_at: 1,
            }
            return await Wallet.findById({ _id: params?.wallet_id }).select(attributes)

        } catch (error) {

            return error;
        }
    }

    async createWallet(params) {
        try {
            return await Wallet.create(params);
        } catch (error) {

            throw error;
        }
    }


    async transaction(params) {
        try {

            return await TransactionWallet.create({
                wallet_id: params?.wallet_id,
                amount: params?.amount,
                balance: params?.balance,
                description: params?.description,
                type: params?.type
            });
        } catch (error) {
            throw error;
        }
    }

    async getWalletBalance(params) {
        try {
            const attributes = {
                _id: 1,
                balance: 1,
                amount: 1,
                created_at: 1
            }
            return TransactionWallet.findOne({ wallet_id: params?.wallet_id }).select(attributes)
                .sort({ _id: -1 })
        } catch (error) {
            return error
        }
    }

    async getTransactionWallet(params) {
        try {
            const attributes = {
                _id: 1,
                wallet_id: 1,
                description: 1,
                balance: 1,
                amount: 1,
                type: 1,
                created_at: 1
            }
            const transactionInfo = TransactionWallet.find({
                wallet_id: params?.wallet_id
            }).select(
                attributes)
                .sort({ _id: -1 }).limit(params?.limit).skip(params?.skip)

            return transactionInfo;
        } catch (error) {
            return error;
        }
    }
    async credit(params) {
        return await this.transaction(params);
    }

    async debit(params) {
        return await this.transaction(params);
    }

    async depositTransactionAmount(params) {
        switch (params?.type) {
            case TRANSACTION_TYPE.CREDIT: {
                return await this.credit(params);

            }
            case TRANSACTION_TYPE.DEBIT: {
                return await this.debit(params);

            }

        }
    }
}

module.exports = {
    WalletService
}