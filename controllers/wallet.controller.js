const Wallet = require('../models/Wallet')
const TransactionWallet = require('../models/TransactionWallet')
const { connectDB } = require('../lib/connection')
const { WalletService } = require('../service/wallet.service')
const { TRANSACTION_TYPE } = require('../lib/constants')
const { WalletSetupSchema, WalletTransactSchema, WalletGetTransactionSchema } = require('../lib/validation.schema')
const { Mutex } = require('async-mutex')

const mutex = new Mutex();

const setupWalletController = async (req, res) => {

    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const payload = req?.body;
        await WalletSetupSchema.validateAsync(payload);
        const wallet = new WalletService()
        const walletInfo = await wallet.createWallet(payload)
        const transactionWalletInfo = await wallet.credit({
            wallet_id: walletInfo?._id,
            amount: payload?.balance, //initially both amount deposit and balance will be same
            balance: payload?.balance,
            description: 'Setup',
            type: TRANSACTION_TYPE?.CREDIT
        }
        )
        await session.commitTransaction();
        session.endSession();
        const response = {
            id: walletInfo?.id,
            balance: transactionWalletInfo?.balance,
            name: walletInfo?.name,
            transactionId: transactionWalletInfo?._id,
            date: walletInfo?.created_at
        }

        return res.status(200).json(response);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send(error?.message);
    }
}


const transactionWalletController = async (req, res) => {
    try {
        const wallet_id = req?.params?.walletId
        if (!wallet_id) {
            throw new Error('wallet_id missing')
        }
        const payload = req?.body;
        await WalletTransactSchema.validateAsync(payload)

        const wallet = new WalletService();
        const walletInfo = await wallet.getWalletInfoById({ wallet_id })
        if (!walletInfo) {
            return res.status(404).json({
                message: 'No wallet found'
            });
        }


        const getTransactionInfo = await wallet.getWalletBalance({ wallet_id });
        let balance = 0;
        if (getTransactionInfo) {
            balance = Number(getTransactionInfo?.balance + payload?.amount).toFixed(4);
            console.log('amount Difference', Number(balance), typeof Number(balance))

            if (payload?.type === TRANSACTION_TYPE.DEBIT && Number(balance) < 0) {
                return res.status(400).json({
                    message: 'insufficient balance',
                    debit_amount: payload?.amount,
                    available_balance: getTransactionInfo?.balance
                });
            }
        }


        const transactionWalletInfo = await wallet.depositTransactionAmount(
            {
                wallet_id: wallet_id,
                amount: payload?.amount,
                balance: balance,
                description: payload?.description,
                type: payload?.type
            }
        )


        const response = {
            balance: transactionWalletInfo?.balance,
            tranactionId: transactionWalletInfo?._id,
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).send(error?.message);
    }
}


const getWalletInfo = async (req, res) => {
    try {

        const wallet_id = req?.params?.id

        if (!wallet_id) {
            throw new Error('wallet_id missing')
        }
        const wallet = new WalletService();
        const walletInfo = await wallet.getWalletInfoById({ wallet_id })
        if (!walletInfo) {
            return res.status(404).json({
                message: 'No wallet found'
            });
        }

        const walletBalanceInfo = await wallet.getWalletBalance({ wallet_id });
        const response = {
            id: walletInfo?._id,
            balance: walletBalanceInfo?.balance,
            name: walletInfo?.name,
            date: walletBalanceInfo?.created_at
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).send(error?.message);
    }
}

const getTransactionInfo = async (req, res) => {
    try {
        const payload = req?.query

        await WalletGetTransactionSchema.validateAsync(payload)
        const wallet = new WalletService();
        const walletInfo = await wallet.getWalletInfoById({ wallet_id: payload?.walletId })
        if (!walletInfo) {
            return res.status(404).json({
                message: 'No wallet found'
            });
        }

        const transactionInfo = await wallet.getTransactionWallet({
            wallet_id: payload?.walletId,
            skip: payload?.skip,
            limit: payload?.limit
        });


        const response = transactionInfo.map((transaction) => {
            return {
                id: transaction?._id,
                walletId: transaction?.wallet_id,
                amount: transaction?.amount,
                balance: transaction?.balance,
                description: transaction?.description,
                date: transaction?.created_at,
                type: transaction?.type
            }
        })

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).send(error?.message);
    }
}

module.exports = {
    setupWalletController,
    transactionWalletController,
    getWalletInfo,
    getTransactionInfo
}