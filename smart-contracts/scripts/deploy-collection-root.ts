import { appendFileSync, writeFileSync } from "fs";
import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("ContentRoot");

  const contentRoot = await factory.deploy();
  await contentRoot.deployed();

  console.log(`Content Root deployed: ${contentRoot.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
