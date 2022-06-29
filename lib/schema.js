const Joi = require('joi');

const WalletSetupSchema = Joi.object({
    balance: Joi.number().positive().precision(4).required().strict(),
    name: Joi.string().required(),
})

const WalletTransactSchema = Joi.object({
    amount: Joi.number().strict().precision(4).required().when('type', { is: 'CREDIT', then: Joi.number().positive(), otherwise: Joi.number().negative() }),
    description: Joi.string().required(),
    type: Joi.string().valid('CREDIT', 'DEBIT').required(),
})

const WalletGetTransactionSchema = Joi.object({
    wallet_id: Joi.string().required(),
    skip: Joi.number().required(),
    limit: Joi.number().required(),
})
module.exports = {
    WalletSetupSchema,
    WalletTransactSchema
}