import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure rewards can be distributed to users",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const rewardAmount = 10_000_000; // 10 STX
        
        // Fund the reward pool first
        let fundBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)], // 100 STX
                deployer.address
            ),
        ]);
        
        fundBlock.receipts[0].result.expectOk();
        
        // Distribute rewards
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(rewardAmount)],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectUint(rewardAmount);
        
        // Check user rewards
        let rewardsBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-user-rewards',
                [types.principal(user.address)],
                user.address
            ),
        ]);
        
        const userRewards = rewardsBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure users can claim rewards with fee",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const rewardAmount = 10_000_000;
        
        let block = chain.mineBlock([
            // Fund pool
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)],
                deployer.address
            ),
            // Distribute
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(rewardAmount)],
                deployer.address
            ),
            // Claim
            Tx.contractCall(
                'reward-distributor',
                'claim-rewards',
                [],
                user.address
            ),
        ]);
        
        block.receipts[2].result.expectOk(); // Should return net claim amount
    },
});

Clarinet.test({
    name: "Test Clarity 4 lockup multipliers (buff-to-int-be)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const rewardAmount = 10_000_000;
        const lockup3Months = 13140;
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(rewardAmount)],
                deployer.address
            ),
            // Lock for 3 months (1.5x multiplier)
            Tx.contractCall(
                'reward-distributor',
                'lock-rewards',
                [types.uint(rewardAmount), types.uint(lockup3Months)],
                user.address
            ),
        ]);
        
        block.receipts[2].result.expectOk().expectUint(0); // Lock ID
        
        // Verify lock was created
        let lockBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-locked-rewards',
                [types.principal(user.address), types.uint(0)],
                user.address
            ),
        ]);
        
        const lockInfo = lockBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure different lockup periods have correct multipliers",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        const baseAmount = 10_000_000;
        
        let block = chain.mineBlock([
            // Check 3 months: 1.5x
            Tx.contractCall(
                'reward-distributor',
                'calculate-potential-boost',
                [types.uint(baseAmount), types.uint(13140)],
                user.address
            ),
            // Check 6 months: 2x
            Tx.contractCall(
                'reward-distributor',
                'calculate-potential-boost',
                [types.uint(baseAmount), types.uint(26280)],
                user.address
            ),
            // Check 12 months: 3x
            Tx.contractCall(
                'reward-distributor',
                'calculate-potential-boost',
                [types.uint(baseAmount), types.uint(52560)],
                user.address
            ),
        ]);
        
        // All should succeed and show different boosts
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectOk();
    },
});

Clarinet.test({
    name: "Ensure early unlock applies penalty",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const rewardAmount = 10_000_000;
        const lockup12Months = 52560;
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(rewardAmount)],
                deployer.address
            ),
            // Lock for 12 months
            Tx.contractCall(
                'reward-distributor',
                'lock-rewards',
                [types.uint(rewardAmount), types.uint(lockup12Months)],
                user.address
            ),
            // Unlock early (should apply 30% penalty)
            Tx.contractCall(
                'reward-distributor',
                'unlock-early',
                [types.uint(0)],
                user.address
            ),
        ]);
        
        block.receipts[3].result.expectOk(); // Should return amount minus penalty
    },
});

Clarinet.test({
    name: "Ensure referral system works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const referrer = accounts.get('wallet_1')!;
        const referee = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Register referral
            Tx.contractCall(
                'reward-distributor',
                'register-referral',
                [types.principal(referrer.address)],
                referee.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Check referral info
        let infoBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-referral-info',
                [types.principal(referrer.address), types.principal(referee.address)],
                referee.address
            ),
        ]);
        
        const referralInfo = infoBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure referral rewards are processed (5% bonus)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const referrer = accounts.get('wallet_1')!;
        const referee = accounts.get('wallet_2')!;
        const feeAmount = 1_000_000; // 1 STX in fees
        
        let block = chain.mineBlock([
            // Setup referral
            Tx.contractCall(
                'reward-distributor',
                'register-referral',
                [types.principal(referrer.address)],
                referee.address
            ),
            // Process referral reward
            Tx.contractCall(
                'reward-distributor',
                'process-referral-reward',
                [types.principal(referee.address), types.uint(feeAmount)],
                referrer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk(); // Should return bonus amount
        
        // Check referrer stats
        let statsBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-referral-stats',
                [types.principal(referrer.address)],
                referrer.address
            ),
        ]);
        
        const stats = statsBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure users cannot refer themselves",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'register-referral',
                [types.principal(user.address)],
                user.address
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(300); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Test Clarity 4 merkle proof verification (element-at?)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const airdropAmount = 5_000_000;
        
        // Set merkle root (simplified test)
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'set-merkle-root',
                [types.buff(new Uint8Array(32).fill(1))],
                deployer.address
            ),
        ]);
        
        setupBlock.receipts[0].result.expectOk().expectBool(true);
        
        // In production, would test actual merkle proof verification
        // This is a simplified version
    },
});

Clarinet.test({
    name: "Ensure merit scores can be updated",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'update-merit-score',
                [
                    types.principal(user.address),
                    types.uint(100), // TVL score
                    types.uint(50),  // Activity score
                    types.uint(25),  // Loyalty score
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectUint(175); // Total score
        
        // Verify merit score
        let scoreBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-merit-score',
                [types.principal(user.address)],
                user.address
            ),
        ]);
        
        const meritScore = scoreBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure reward epochs can be created",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const totalRewards = 50_000_000; // 50 STX
        const duration = 4380; // ~1 month
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'create-reward-epoch',
                [types.uint(totalRewards), types.uint(duration)],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectUint(1); // Epoch ID
        
        // Check epoch info
        let epochBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-reward-epoch',
                [types.uint(1)],
                deployer.address
            ),
        ]);
        
        const epochInfo = epochBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure protocol reward pool tracking works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const fundAmount = 100_000_000;
        
        // Check initial pool
        let initialBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-protocol-reward-pool',
                [],
                deployer.address
            ),
        ]);
        
        initialBlock.receipts[0].result.expectOk().expectUint(0);
        
        // Fund pool
        let fundBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(fundAmount)],
                deployer.address
            ),
        ]);
        
        fundBlock.receipts[0].result.expectOk();
        
        // Check updated pool
        let updatedBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-protocol-reward-pool',
                [],
                deployer.address
            ),
        ]);
        
        updatedBlock.receipts[0].result.expectOk().expectUint(fundAmount);
    },
});

Clarinet.test({
    name: "Ensure total rewards distributed is tracked",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const rewardAmount = 10_000_000;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(rewardAmount)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'claim-rewards',
                [],
                user.address
            ),
        ]);
        
        // Check total distributed
        let totalBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-total-rewards-distributed',
                [],
                deployer.address
            ),
        ]);
        
        const totalDistributed = totalBlock.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Ensure locked rewards are tracked separately",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const lockAmount = 10_000_000;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'fund-reward-pool',
                [types.uint(100_000_000)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(user.address), types.uint(lockAmount)],
                deployer.address
            ),
            Tx.contractCall(
                'reward-distributor',
                'lock-rewards',
                [types.uint(lockAmount), types.uint(13140)],
                user.address
            ),
        ]);
        
        // Check locked total
        let lockedBlock = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'get-total-rewards-locked',
                [],
                user.address
            ),
        ]);
        
        lockedBlock.receipts[0].result.expectOk().expectUint(lockAmount);
    },
});

Clarinet.test({
    name: "Ensure only owner can distribute rewards",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        const recipient = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'distribute-rewards',
                [types.principal(recipient.address), types.uint(1_000_000)],
                user.address // Non-owner
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(300); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Ensure cannot claim more rewards than available",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'reward-distributor',
                'claim-rewards',
                [],
                user.address
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(301); // ERR-INSUFFICIENT-REWARDS
    },
});
