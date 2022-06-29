const { TRANSACTION_TYPE } = require('../lib/constants')
const Wallet = require('../models/Wallet')
const TransactionWallet = require('../models/TransactionWallet')
class WalletService {




    async getWalletInfoById(params) {
        try {
            return await Wallet.findById({ _id: params?.wallet_id })

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
            return TransactionWallet.findOne({ wallet_id: params?.wallet_id }).sort({ _id: -1 })
        } catch (error) {
            return error
        }
    }

    async history(page = 1, pageSize = this.paginationLimit) {
        try {


            let start = 0;
            if (page !== 1) {
                page--;
                start = page * pageSize;
            }
            let end = start + pageSize + 1;

            //getting transactions list
            let TransactionWalletInfo = await TransactionWallet.findAll({
                attributes: ['transaction_type_id', 'created_at', 'amount', 'order_id'],
                where: { wallet_id: this.wallet_id },
                order: [['id', 'DESC']],
                offset: start,
                limit: end
            });
            let transactions = [];
            let records = 0;
            let has_more = 0;
            TransactionWalletInfo.map((transaction) => {
                if (records === pageSize) {
                    has_more = true;
                    return;
                }
                transactions.push({
                    type: transaction.type,
                    date: transaction.created_at
                        ? transaction.created_at
                        : null,
                    amount: transaction.amount,
                    order_id: transaction.order_id
                });
                records++;
            });

            //getting ballance
            let balance = await this.ballance();
            return {
                transactions,
                balance,
                has_more
            };
        } catch (error) {
            let errorMessage = `Wallet Txn failed(b), ${error.message} ${this.wallet_id}`;
            throw new Error(errorMessage);
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