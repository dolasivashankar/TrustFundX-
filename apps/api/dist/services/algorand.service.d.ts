import algosdk from 'algosdk';
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
export declare const algorandService: {
    getAlgodClient: () => algosdk.Algodv2;
    getIndexerClient: () => algosdk.Indexer;
    getAccountBalance(address: string): Promise<{
        balance: number;
        minBalance: number;
    }>;
    verifyTransaction(txId: string): Promise<AlgorandTransaction | null>;
    getTransactionsByAddress(address: string, limit?: number): Promise<any[]>;
    getExplorerUrl(txId: string): string;
    isValidAddress(address: string): boolean;
};
//# sourceMappingURL=algorand.service.d.ts.map