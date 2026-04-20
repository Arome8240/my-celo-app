import { ethers } from "hardhat";

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) {
    throw new Error("Missing TOKEN_ADDRESS env var");
  }

  const [signer] = await ethers.getSigners();
  const recipient = process.env.RECIPIENT_ADDRESS ?? signer.address;
  const txCount = Number(process.env.TX_COUNT ?? "20");
  const amount = ethers.parseUnits(process.env.AMOUNT ?? "0.000001", 18);

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

  for (let i = 1; i <= txCount; i++) {
    const tx = await token.transfer(recipient, amount);
    console.log(`[${i}/${txCount}] sent: ${tx.hash}`);
    await tx.wait();
  }

  console.log(`Completed ${txCount} transfer transactions.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
