import { ethers } from "hardhat";
import { getContractsEnv } from "@my-celo-app/config";
import { getLogger, logTransaction, logTransactionSuccess, logTransactionFailure } from "@my-celo-app/utils/logger";

const logger = getLogger();

async function main() {
  // Get validated environment
  const env = getContractsEnv();
  
  const tokenAddress = env.TOKEN_ADDRESS;
  if (!tokenAddress) {
    logger.fatal("Missing TOKEN_ADDRESS environment variable");
    throw new Error("Missing TOKEN_ADDRESS env var");
  }

  const [signer] = await ethers.getSigners();
  const recipient = env.RECIPIENT_ADDRESS?.trim() || signer.address;
  const txCount = env.TX_COUNT;
  const amount = ethers.parseUnits(env.AMOUNT, 18);

  // Validate recipient address
  if (!ethers.isAddress(recipient)) {
    logger.fatal("Invalid recipient address", undefined, { recipient });
    throw new Error(`Invalid recipient address: ${recipient}`);
  }

  if (!Number.isInteger(txCount) || txCount <= 0) {
    logger.fatal("Invalid transaction count", undefined, { txCount });
    throw new Error("TX_COUNT must be a positive integer");
  }

  const token = await ethers.getContractAt("HospitalToken", tokenAddress, signer);

  const network = await ethers.provider.getNetwork();
  logger.info("Starting token transfer generation", {
    network: network.name,
    sender: signer.address,
    recipient,
    tokenAddress,
    txCount,
    amount: amount.toString(),
  });

  // Get starting nonce
  let nonce = await ethers.provider.getTransactionCount(signer.address, "pending");
  logger.debug("Starting nonce retrieved", { nonce });

  for (let i = 1; i <= txCount; i++) {
    try {
      const tx = await token.transfer(recipient, amount, { nonce });
      
      logTransaction(`Transfer ${i}/${txCount} sent`, {
        txHash: tx.hash,
        from: signer.address,
        to: recipient,
        value: amount.toString(),
        network: network.name,
      });
      
      await tx.wait();
      logTransactionSuccess(tx.hash, { nonce });
      nonce++; // Increment nonce for next transaction
    } catch (error: any) {
      logTransactionFailure(undefined, error, {
        from: signer.address,
        to: recipient,
        value: amount.toString(),
        nonce,
        attempt: i,
      });
      
      // If nonce error, resync and retry
      if (error.message.includes("nonce")) {
        logger.warn("Nonce error detected, resyncing", { oldNonce: nonce });
        nonce = await ethers.provider.getTransactionCount(signer.address, "pending");
        logger.info("Nonce resynced", { newNonce: nonce });
        i--; // Retry this transaction
        continue;
      }
      
      throw error;
    }
  }

  logger.info("Transfer generation completed successfully", {
    totalTransactions: txCount,
    recipient,
    totalAmount: (BigInt(amount.toString()) * BigInt(txCount)).toString(),
  });
}

main().catch((error) => {
  logger.fatal("Script execution failed", error);
  process.exitCode = 1;
});
