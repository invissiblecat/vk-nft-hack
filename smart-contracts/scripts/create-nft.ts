import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const contentRoot = await ethers.getContractAt(
    "ContentRoot",
    process.env.CONTENT_ROOT_ADDRESS!
  );
  const ownerId = "123";
  const collectionAddress = await contentRoot.ownerIdToCollection(ownerId);
  console.log({ collectionAddress });

  const collection = await ethers.getContractAt(
    "ContentCollection",
    collectionAddress
  );
  const whitelistPlaces = 1;
  await collection.createNft(whitelistPlaces, []);

  const res = await collection.getBatchAccess([1, 2], owner.address);
  console.log({ res });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
