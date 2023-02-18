import { ethers } from "hardhat";

async function main() {
  const contentRoot = await ethers.getContractAt(
    "ContentRoot",
    process.env.CONTENT_ROOT_ADDRESS!
  );
  const ownerId = "67135042"; //67135042
  await contentRoot.deleteCollection(ownerId);
  // console.log(await contentRoot.ownerToCollection(ownerId));

  console.log(`Collection of owner ${ownerId} deleted`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
