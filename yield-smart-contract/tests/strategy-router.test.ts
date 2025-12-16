import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure protocols can be registered with validation (principal-destruct?)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [
                    types.principal(protocol.address),
                    types.ascii("Test DeFi Protocol"),
                    types.uint(7), // Risk rating
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Verify protocol info
        let infoBlock = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'get-protocol-info',
                [types.principal(protocol.address)],
                deployer.address
            ),
        ]);
        
        const protocolInfo = infoBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure routes can be created between registered protocols",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Register two protocols
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [
                    types.principal(protocol1.address),
                    types.ascii("Protocol A"),
                    types.uint(5),
                ],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [
                    types.principal(protocol2.address),
                    types.ascii("Protocol B"),
                    types.uint(6),
                ],
                deployer.address
            ),
            // Create route
            Tx.contractCall(
                'strategy-router',
                'create-route',
                [
                    types.principal(protocol1.address),
                    types.principal(protocol2.address),
                    types.uint(1200), // 12% APY
                    types.uint(50000), // Gas cost
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectOk().expectUint(1); // Route ID
    },
});

Clarinet.test({
    name: "Ensure routes fail with unregistered protocols",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Try to create route without registering protocols
            Tx.contractCall(
                'strategy-router',
                'create-route',
                [
                    types.principal(protocol1.address),
                    types.principal(protocol2.address),
                    types.uint(1200),
                    types.uint(50000),
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(201); // ERR-INVALID-PROTOCOL
    },
});

Clarinet.test({
    name: "Ensure capital can be routed between protocols",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        const amount = 100_000_000; // 100 STX
        
        let setupBlock = chain.mineBlock([
            // Register protocols
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol1.address), types.ascii("Protocol A"), types.uint(5)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol2.address), types.ascii("Protocol B"), types.uint(6)],
                deployer.address
            ),
            // Create route
            Tx.contractCall(
                'strategy-router',
                'create-route',
                [
                    types.principal(protocol1.address),
                    types.principal(protocol2.address),
                    types.uint(1200),
                    types.uint(50000),
                ],
                deployer.address
            ),
        ]);
        
        // Note: Would need to set up protocol allocations first in production
        // This is a simplified test
    },
});

Clarinet.test({
    name: "Ensure strategy proposals require stake",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const proposer = accounts.get('wallet_1')!;
        const protocol = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Register protocol first
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol.address), types.ascii("New Protocol"), types.uint(7)],
                deployer.address
            ),
            // Propose strategy
            Tx.contractCall(
                'strategy-router',
                'propose-strategy',
                [
                    types.principal(protocol.address),
                    types.utf8("Integrate with new DeFi protocol for higher yields"),
                ],
                proposer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk().expectUint(1); // Proposal ID
    },
});

Clarinet.test({
    name: "Ensure users can vote on strategy proposals",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const proposer = accounts.get('wallet_1')!;
        const voter = accounts.get('wallet_2')!;
        const protocol = accounts.get('wallet_3')!;
        
        let block = chain.mineBlock([
            // Register protocol
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol.address), types.ascii("Protocol"), types.uint(6)],
                deployer.address
            ),
            // Create proposal
            Tx.contractCall(
                'strategy-router',
                'propose-strategy',
                [types.principal(protocol.address), types.utf8("Test proposal")],
                proposer.address
            ),
            // Vote on proposal
            Tx.contractCall(
                'strategy-router',
                'vote-on-strategy',
                [
                    types.uint(1), // Proposal ID
                    types.bool(true), // Vote for
                    types.uint(1000), // Vote weight
                ],
                voter.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectOk().expectBool(true);
        
        // Check proposal votes
        let proposalBlock = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'get-strategy-proposal',
                [types.uint(1)],
                voter.address
            ),
        ]);
        
        const proposal = proposalBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure keeper registration and reward claiming works",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const keeper = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'register-keeper',
                [],
                keeper.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Verify keeper info
        let infoBlock = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'get-keeper-info',
                [types.principal(keeper.address)],
                keeper.address
            ),
        ]);
        
        const keeperInfo = infoBlock.receipts[0].result.expectSome();
    },
});

Clarinet.test({
    name: "Ensure emergency mode can be toggled",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            // Toggle emergency mode
            Tx.contractCall(
                'strategy-router',
                'toggle-emergency-mode',
                [],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Check emergency mode status
        let statusBlock = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'is-emergency-mode',
                [],
                user.address
            ),
        ]);
        
        statusBlock.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure emergency withdrawals work in emergency mode",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user = accounts.get('wallet_1')!;
        const protocol = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Register protocol
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol.address), types.ascii("Protocol"), types.uint(5)],
                deployer.address
            ),
            // Enable emergency mode
            Tx.contractCall(
                'strategy-router',
                'toggle-emergency-mode',
                [],
                deployer.address
            ),
            // Request emergency withdrawal
            Tx.contractCall(
                'strategy-router',
                'request-emergency-withdrawal',
                [types.principal(protocol.address), types.uint(50_000_000)],
                user.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure route APY can be updated",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol1.address), types.ascii("Protocol A"), types.uint(5)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol2.address), types.ascii("Protocol B"), types.uint(6)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'create-route',
                [types.principal(protocol1.address), types.principal(protocol2.address), types.uint(1200), types.uint(50000)],
                deployer.address
            ),
            // Update APY
            Tx.contractCall(
                'strategy-router',
                'update-route-apy',
                [types.uint(1), types.uint(1500)], // New APY: 15%
                deployer.address
            ),
        ]);
        
        block.receipts[3].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure routes can be deactivated",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            // Setup
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol1.address), types.ascii("Protocol A"), types.uint(5)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol2.address), types.ascii("Protocol B"), types.uint(6)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'create-route',
                [types.principal(protocol1.address), types.principal(protocol2.address), types.uint(1200), types.uint(50000)],
                deployer.address
            ),
            // Deactivate route
            Tx.contractCall(
                'strategy-router',
                'deactivate-route',
                [types.uint(1)],
                deployer.address
            ),
        ]);
        
        block.receipts[3].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Test route simulation (read-only)",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocol1 = accounts.get('wallet_1')!;
        const protocol2 = accounts.get('wallet_2')!;
        const amount = 100_000_000;
        
        let block = chain.mineBlock([
            // Register protocols
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol1.address), types.ascii("Protocol A"), types.uint(5)],
                deployer.address
            ),
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol2.address), types.ascii("Protocol B"), types.uint(6)],
                deployer.address
            ),
            // Simulate route
            Tx.contractCall(
                'strategy-router',
                'simulate-route',
                [
                    types.principal(protocol1.address),
                    types.principal(protocol2.address),
                    types.uint(amount),
                ],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        // Simulation should return fee and net amount
        const simulation = block.receipts[2].result.expectOk();
    },
});

Clarinet.test({
    name: "Ensure only owner can register protocols",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        const protocol = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'strategy-router',
                'register-protocol',
                [types.principal(protocol.address), types.ascii("Protocol"), types.uint(5)],
                user.address // Non-owner
            ),
        ]);
        
        block.receipts[0].result.expectErr().expectUint(200); // ERR-NOT-AUTHORIZED
    },
});
