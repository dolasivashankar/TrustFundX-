"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.algorandService = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const logger_1 = require("../utils/logger");
const getAlgodClient = () => {
    const server = process.env.ALGORAND_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
    const port = parseInt(process.env.ALGORAND_ALGOD_PORT || '443');
    const token = process.env.ALGORAND_ALGOD_TOKEN || '';
    return new algosdk_1.default.Algodv2(token, server, port);
};
const getIndexerClient = () => {
    const server = process.env.ALGORAND_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud';
    const port = parseInt(process.env.ALGORAND_INDEXER_PORT || '443');
    const token = process.env.ALGORAND_INDEXER_TOKEN || '';
    return new algosdk_1.default.Indexer(token, server, port);
};
exports.algorandService = {
    getAlgodClient,
    getIndexerClient,
    async getAccountBalance(address) {
        try {
            const algod = getAlgodClient();
            const accountInfo = await algod.accountInformation(address).do();
            return {
                balance: Number(accountInfo.amount || 0) / 1000000,
                minBalance: Number(accountInfo.minBalance || accountInfo['min-balance'] || 0) / 1000000,
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get account balance:', error);
            throw new Error(`Failed to get balance for ${address}`);
        }
    },
    async verifyTransaction(txId) {
        try {
            const algod = getAlgodClient();
            const network = process.env.ALGORAND_NETWORK || 'testnet';
            const explorerBase = network === 'mainnet'
                ? 'https://explorer.perawallet.app'
                : 'https://testnet.explorer.perawallet.app';
            const txInfo = await algod.pendingTransactionInformation(txId).do();
            const confirmedRound = txInfo.confirmedRound || txInfo['confirmed-round'];
            if (confirmedRound) {
                const txnObj = txInfo.txn?.txn || txInfo.txn || {};
                const amt = txnObj.amt || txnObj.amount || 0;
                const snd = txnObj.snd ? algosdk_1.default.encodeAddress(txnObj.snd) : (txnObj.sender || '');
                const rcv = txnObj.rcv ? algosdk_1.default.encodeAddress(txnObj.rcv) : (txnObj.receiver || '');
                const fee = txnObj.fee || 0;
                return {
                    txId,
                    blockRound: Number(confirmedRound),
                    confirmedRound: Number(confirmedRound),
                    amount: Number(amt) / 1000000,
                    sender: snd,
                    receiver: rcv,
                    fee: Number(fee) / 1000000,
                    explorerUrl: `${explorerBase}/tx/${txId}`,
                };
            }
            // Try indexer if not in pending
            const indexer = getIndexerClient();
            const indexerTx = await indexer.lookupTransactionByID(txId).do();
            if (indexerTx.transaction) {
                const tx = indexerTx.transaction;
                const cRound = tx.confirmedRound || tx['confirmed-round'] || 0;
                const payTx = tx.paymentTransaction || tx['payment-transaction'] || {};
                return {
                    txId,
                    blockRound: Number(cRound),
                    confirmedRound: Number(cRound),
                    amount: Number(payTx.amount || 0) / 1000000,
                    sender: tx.sender || '',
                    receiver: payTx.receiver || '',
                    fee: Number(tx.fee || 0) / 1000000,
                    explorerUrl: `${explorerBase}/tx/${txId}`,
                };
            }
            return null;
        }
        catch (error) {
            logger_1.logger.error('Failed to verify transaction:', error);
            return null;
        }
    },
    async getTransactionsByAddress(address, limit = 50) {
        try {
            const indexer = getIndexerClient();
            const result = await indexer
                .lookupAccountTransactions(address)
                .limit(limit)
                .do();
            return result.transactions || [];
        }
        catch (error) {
            logger_1.logger.error('Failed to get transactions:', error);
            return [];
        }
    },
    getExplorerUrl(txId) {
        const network = process.env.ALGORAND_NETWORK || 'testnet';
        const base = network === 'mainnet'
            ? 'https://explorer.perawallet.app'
            : 'https://testnet.explorer.perawallet.app';
        return `${base}/tx/${txId}`;
    },
    isValidAddress(address) {
        try {
            algosdk_1.default.decodeAddress(address);
            return true;
        }
        catch {
            return false;
        }
    },
};
//# sourceMappingURL=algorand.service.js.map