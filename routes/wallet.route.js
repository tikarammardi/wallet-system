const express = require('express');
const router = express.Router();
const { setupWalletController, transactionWalletController, getWalletInfo, getTransactionInfo } = require('../controllers/wallet.controller')


router.post('/setup', setupWalletController);
router.post('/transact/:walletId', transactionWalletController);
router.get('/wallet/:id', getWalletInfo)
router.get('/transaction', getTransactionInfo)
module.exports = router;
