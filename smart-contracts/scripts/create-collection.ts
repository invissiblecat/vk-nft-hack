import { ethers } from "hardhat";

async function main() {
  const contentRoot = await ethers.getContractAt(
    "ContentRoot",
    process.env.CONTENT_ROOT_ADDRESS!
  );
  const ownerId = "123";
  const tx = await contentRoot.createCollection(ownerId, "Name", "NAME");
  console.log({ tx });
  const a = await tx.wait();

  console.log({ a });
  console.log(`Collection deployed`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
