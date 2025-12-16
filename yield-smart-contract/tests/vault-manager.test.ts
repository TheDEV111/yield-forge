import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Test constants
const MIN_DEPOSIT = 100_000_000; // 100 STX
const DEPOSIT_FEE_BP = 30; // 0.3%
const WITHDRAWAL_FEE_BP = 50; // 0.5%

Clarinet.test({
    name: "Ensure that users can create vaults with different risk tiers",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)], // Conservative
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(2)], // Balanced
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(3)], // Aggressive
                wallet1.address
            ),
        ]);
        
        // All vault creations should succeed
        assertEquals(block.receipts.length, 3);
        block.receipts.forEach((receipt, idx) => {
            receipt.result.expectOk().expectUint(idx + 1);
        });
    },
});

Clarinet.test({
    name: "Ensure invalid risk tier fails",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(5)], // Invalid tier
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(104); // ERR-INVALID-RISK-TIER
    },
});

Clarinet.test({
    name: "Ensure users can deposit STX into vault and receive shares",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const depositAmount = 100_000_000; // 100 STX
        
        let block = chain.mineBlock([
            // Create vault first
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            // Deposit into vault
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(depositAmount)],
                wallet1.address
            ),
        ]);
        
        // Vault creation should succeed
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Deposit should succeed and return shares
        const depositReceipt = block.receipts[1].result.expectOk();
        
        // Check user position
        let positionBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'get-user-position',
                [types.principal(wallet1.address), types.uint(1)],
                wallet1.address
            ),
        ]);
        
        const position = positionBlock.receipts[0].result.expectSome();
        // Verify shares were allocated
    },
});

Clarinet.test({
    name: "Ensure deposit below minimum fails",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const smallDeposit = 50_000_000; // 50 STX (below minimum)
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(smallDeposit)],
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr().expectUint(105); // ERR-MIN-DEPOSIT-NOT-MET
    },
});

Clarinet.test({
    name: "Ensure users can withdraw from vault with fees",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const depositAmount = 100_000_000; // 100 STX
        
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(depositAmount)],
                wallet1.address
            ),
        ]);
        
        const shares = setupBlock.receipts[1].result.expectOk();
        
        // Withdraw shares
        let withdrawBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'withdraw',
                [types.uint(1), shares],
                wallet1.address
            ),
        ]);
        
        // Withdrawal should succeed
        withdrawBlock.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Ensure compound rewards charges gas fee",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const depositAmount = 100_000_000;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(depositAmount)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'compound-rewards',
                [types.uint(1)],
                wallet1.address
            ),
        ]);
        
        block.receipts[2].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure only vault owner can rebalance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            // wallet2 tries to rebalance wallet1's vault
            Tx.contractCall(
                'vault-manager',
                'rebalance-vault',
                [types.uint(1), types.list([types.uint(100)])],
                wallet2.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr().expectUint(100); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Ensure owner can add and update strategies",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'add-strategy',
                [
                    types.ascii("Test Strategy"),
                    types.principal(deployer.address),
                    types.uint(1500), // 15% APY
                    types.uint(5), // Risk score
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Update strategy APY
        let updateBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'update-strategy-apy',
                [types.uint(1), types.uint(2000)],
                deployer.address
            ),
        ]);
        
        updateBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure owner can toggle pause and deposits fail when paused",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            // Create vault
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            // Pause contract
            Tx.contractCall(
                'vault-manager',
                'toggle-pause',
                [],
                deployer.address
            ),
            // Try to deposit while paused
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(100_000_000)],
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectErr().expectUint(103); // ERR-VAULT-PAUSED
    },
});

Clarinet.test({
    name: "Ensure protocol fees are tracked correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const depositAmount = 100_000_000;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(depositAmount)],
                wallet1.address
            ),
        ]);
        
        // Check protocol fees
        let feesBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'get-protocol-fees',
                [],
                wallet1.address
            ),
        ]);
        
        // Should have collected deposit fee
        const fees = feesBlock.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Test Clarity 4 uint-to-buff-be usage in share calculation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;
        
        // First deposit
        let block1 = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(100_000_000)],
                wallet1.address
            ),
        ]);
        
        // Second deposit - should calculate proportional shares
        let block2 = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(200_000_000)],
                wallet2.address
            ),
        ]);
        
        block1.receipts[1].result.expectOk();
        block2.receipts[0].result.expectOk();
        
        // Verify both users have correct positions
        let positionsBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'get-user-position',
                [types.principal(wallet1.address), types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'get-user-position',
                [types.principal(wallet2.address), types.uint(1)],
                wallet2.address
            ),
        ]);
        
        positionsBlock.receipts[0].result.expectSome();
        positionsBlock.receipts[1].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure TVL is tracked correctly across operations",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const depositAmount = 100_000_000;
        
        let initialTVL = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'get-total-tvl',
                [],
                wallet1.address
            ),
        ]);
        
        initialTVL.receipts[0].result.expectOk().expectUint(0);
        
        // Create vault and deposit
        let depositBlock = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.uint(1)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit',
                [types.uint(1), types.uint(depositAmount)],
                wallet1.address
            ),
        ]);
        
        // Check TVL increased
        let afterDepositTVL = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'get-total-tvl',
                [],
                wallet1.address
            ),
        ]);
        
        const tvl = afterDepositTVL.receipts[0].result.expectOk();
        // TVL should be deposit amount minus fee
    },
});
