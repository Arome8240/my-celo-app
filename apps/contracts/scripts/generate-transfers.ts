import { ethers } from "hardhat";

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) {
    throw new Error("Missing TOKEN_ADDRESS env var");
  }

  const [signer] = await ethers.getSigners();
  const recipient = process.env.RECIPIENT_ADDRESS?.trim() || signer.address;
  const txCount = Number(process.env.TX_COUNT ?? "500");
  const amount = ethers.parseUnits(process.env.AMOUNT ?? "0.000001", 18);

  // Validate recipient address
  if (!ethers.isAddress(recipient)) {
    throw new Error(`Invalid recipient address: ${recipient}`);
  }

  if (!Number.isInteger(txCount) || txCount <= 0) {
    throw new Error("TX_COUNT must be a positive integer");
  }

  const token = await ethers.getContractAt("HospitalToken", tokenAddress, signer);

  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Sender: ${signer.address}`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Token: ${tokenAddress}`);
  console.log(`Tx count: ${txCount}`);
  console.log(`Amount each: ${amount.toString()} wei`);

  // Get starting nonce
  let nonce = await ethers.provider.getTransactionCount(signer.address, "pending");
  console.log(`Starting nonce: ${nonce}`);

  for (let i = 1; i <= txCount; i++) {
    try {
      const tx = await token.transfer(recipient, amount, { nonce });
      console.log(`[${i}/${txCount}] sent: ${tx.hash} (nonce: ${nonce})`);
      await tx.wait();
      nonce++; // Increment nonce for next transaction
    } catch (error: any) {
      console.error(`[${i}/${txCount}] failed:`, error.message);
      
      // If nonce error, resync and retry
      if (error.message.includes("nonce")) {
        console.log("Nonce error detected, resyncing...");
        nonce = await ethers.provider.getTransactionCount(signer.address, "pending");
        console.log(`Resynced nonce: ${nonce}`);
        i--; // Retry this transaction
        continue;
      }
      
      throw error;
    }
  }

  console.log(`Completed ${txCount} transfer transactions.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
