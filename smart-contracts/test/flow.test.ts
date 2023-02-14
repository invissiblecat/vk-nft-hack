import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractAddressOrInstance } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  ContentCollection,
  ContentRoot,
  CustomErc20,
  ERC20,
} from "../typechain-types";

describe("flow", () => {
  let ContentRoot: ContentRoot;

  let owner: SignerWithAddress;
  const ownerId = 0;
  let ownerCollection: ContentCollection;

  let user1: SignerWithAddress;
  const user1Id = 1;
  let user2: SignerWithAddress;
  const user2Id = 2;

  let erc20: CustomErc20;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const rootFactory = await ethers.getContractFactory("ContentRoot");
    ContentRoot = await rootFactory.deploy();
    await ContentRoot.deployed();

    const erc20Fatory = await ethers.getContractFactory("CustomErc20");
    erc20 = await erc20Fatory.deploy(owner.address);
    await erc20.deployed();
  });

  it(`should allow create collection from owner with id ${ownerId}`, async () => {
    const tx = await ContentRoot.createCollection(
      ownerId,
      "Owner Collection",
      "OWNR"
    );
    await tx.wait();
    const ownerCollectionAddress = await ContentRoot.ownerToCollection(ownerId);
    ownerCollection = await ethers.getContractAt(
      "ContentCollection",
      ownerCollectionAddress
    );
  });

  it(`should not allow create collection from owner with same owner id ${ownerId}`, async () => {
    await expect(
      ContentRoot.createCollection(ownerId, "Owner Collection", "OWNR")
    ).to.be.revertedWith("createCollection: you already have a collection");
  });

  it(`should allow owner createNft`, async () => {
    const tokenId = 0;
    const whitelistPlacesCount = 2;
    const currencies = [erc20.address];
    const prices = [parseUnits("1")];

    const tx = await ownerCollection.createNft(
      tokenId,
      whitelistPlacesCount,
      currencies,
      prices
    );
    await tx.wait();

    expect(await ownerCollection.getPrice(tokenId, currencies[0])).to.be.eq(
      prices[0]
    );
    expect(await ownerCollection.remainingWhitelistPlaces(tokenId)).to.be.eq(
      BigNumber.from(whitelistPlacesCount)
    );
  });
});
