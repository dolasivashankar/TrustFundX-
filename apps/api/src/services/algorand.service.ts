import algosdk from 'algosdk';
import { logger } from '../utils/logger';

const getAlgodClient = (): algosdk.Algodv2 => {
  const server = process.env.ALGORAND_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
  const port = parseInt(process.env.ALGORAND_ALGOD_PORT || '443');
  const token = process.env.ALGORAND_ALGOD_TOKEN || '';
  return new algosdk.Algodv2(token, server, port);
};

const getIndexerClient = (): algosdk.Indexer => {
  const server = process.env.ALGORAND_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud';
  const port = parseInt(process.env.ALGORAND_INDEXER_PORT || '443');
  const token = process.env.ALGORAND_INDEXER_TOKEN || '';
  return new algosdk.Indexer(token, server, port);
};

export interface AlgorandTransaction {
  txId: string;
  blockRound: number;
  confirmedRound: number;
  amount: number;
  sender: string;
  receiver: string;
  fee: number;
  explorerUrl: string;
}

export const algorandService = {
  getAlgodClient,
  getIndexerClient,

  async getAccountBalance(address: string): Promise<{ balance: number; minBalance: number }> {
    try {
      const algod = getAlgodClient();
      const accountInfo: any = await algod.accountInformation(address).do();
      return {
        balance: Number(accountInfo.amount || 0) / 1_000_000,
        minBalance: Number(accountInfo.minBalance || accountInfo['min-balance'] || 0) / 1_000_000,
      };
    } catch (error) {
      logger.error('Failed to get account balance:', error);
      throw new Error(`Failed to get balance for ${address}`);
    }
  },

  async verifyTransaction(txId: string): Promise<AlgorandTransaction | null> {
    try {
      const algod = getAlgodClient();
      const network = process.env.ALGORAND_NETWORK || 'testnet';
      const explorerBase = network === 'mainnet'
        ? 'https://explorer.perawallet.app'
        : 'https://testnet.explorer.perawallet.app';

      const txInfo: any = await algod.pendingTransactionInformation(txId).do();

      const confirmedRound = txInfo.confirmedRound || txInfo['confirmed-round'];
      if (confirmedRound) {
        const txnObj = txInfo.txn?.txn || txInfo.txn || {};
        const amt = txnObj.amt || txnObj.amount || 0;
        const snd = txnObj.snd ? algosdk.encodeAddress(txnObj.snd) : (txnObj.sender || '');
        const rcv = txnObj.rcv ? algosdk.encodeAddress(txnObj.rcv) : (txnObj.receiver || '');
        const fee = txnObj.fee || 0;

        return {
          txId,
          blockRound: Number(confirmedRound),
          confirmedRound: Number(confirmedRound),
          amount: Number(amt) / 1_000_000,
          sender: snd,
          receiver: rcv,
          fee: Number(fee) / 1_000_000,
          explorerUrl: `${explorerBase}/tx/${txId}`,
        };
      }

      // Try indexer if not in pending
      const indexer = getIndexerClient();
      const indexerTx: any = await indexer.lookupTransactionByID(txId).do();
      if (indexerTx.transaction) {
        const tx = indexerTx.transaction;
        const cRound = tx.confirmedRound || tx['confirmed-round'] || 0;
        const payTx = tx.paymentTransaction || tx['payment-transaction'] || {};
        return {
          txId,
          blockRound: Number(cRound),
          confirmedRound: Number(cRound),
          amount: Number(payTx.amount || 0) / 1_000_000,
          sender: tx.sender || '',
          receiver: payTx.receiver || '',
          fee: Number(tx.fee || 0) / 1_000_000,
          explorerUrl: `${explorerBase}/tx/${txId}`,
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to verify transaction:', error);
      return null;
    }
  },

  async getTransactionsByAddress(
    address: string,
    limit = 50
  ): Promise<any[]> {
    try {
      const indexer = getIndexerClient();
      const result: any = await indexer
        .lookupAccountTransactions(address)
        .limit(limit)
        .do();
      return result.transactions || [];
    } catch (error) {
      logger.error('Failed to get transactions:', error);
      return [];
    }
  },

  getExplorerUrl(txId: string): string {
    const network = process.env.ALGORAND_NETWORK || 'testnet';
    const base = network === 'mainnet'
      ? 'https://explorer.perawallet.app'
      : 'https://testnet.explorer.perawallet.app';
    return `${base}/tx/${txId}`;
  },

  isValidAddress(address: string): boolean {
    try {
      algosdk.decodeAddress(address);
      return true;
    } catch {
      return false;
    }
  },
};
