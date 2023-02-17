import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { ContentCollection, ContentRoot } from "../typechain-types";

describe("flow", () => {
  let ContentRoot: ContentRoot;

  let owner: SignerWithAddress;
  const ownerId = 0;
  let ownerCollection: ContentCollection;

  let user1: SignerWithAddress;
  const user1Id = 1;
  let user2: SignerWithAddress;
  const user2Id = 2;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const rootFactory = await ethers.getContractFactory("ContentRoot");
    ContentRoot = await rootFactory.deploy();
    await ContentRoot.deployed();
  });

  it(`should create collection from owner with id ${ownerId}`, async () => {
    await ContentRoot.createCollection(ownerId, "Owner Collection", "OWNR");

    const ownerCollectionAddress = await ContentRoot.ownerIdToCollection(
      ownerId
    );
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

  it(`should createNft`, async () => {
    const tokenId = 1;
    const whitelistPlacesCount = 2;
    const initialWhitelistMembers = [user1.address];

    await ownerCollection.createNft(
      whitelistPlacesCount,
      initialWhitelistMembers
    );

    expect(await ownerCollection.whitelistLimits(tokenId)).to.be.equal(
      BigNumber.from(1)
    );
    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    expect(await ownerCollection.getAccess(tokenId, user2.address)).to.be.equal(
      false
    );
  });

  it(`should not allow user1 createNft in owner collection`, async () => {
    expect(
      ownerCollection.connect(user1).createNft(ethers.constants.MaxUint256, [])
    ).to.be.revertedWith("access denied");
  });

  it(`should change number of whitelist places`, async () => {
    const tokenId = 1;
    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.changeRemainingWhitelistPlaces(tokenId, 5);

    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(currentRemaining).to.be.greaterThan(previousRemaining);
    expect(currentRemaining).to.be.equal(BigNumber.from(5));
  });

  it(`should not allow user1 change number of whitelist places in owner collection`, async () => {
    const tokenId = 1;

    expect(
      ownerCollection.connect(user1).changeRemainingWhitelistPlaces(tokenId, 5)
    ).to.be.revertedWith("access denied");
  });

  it(`should not allow change number of whitelist places to same number`, async () => {
    const tokenId = 1;

    expect(
      ownerCollection.changeRemainingWhitelistPlaces(tokenId, 5)
    ).to.be.revertedWith(
      "changeRemainingWhitelistPlaces: newRemaningPlacesCount is the same"
    );
  });

  it(`should not allow change number of whitelist places if token not minted`, async () => {
    const tokenId = 0;

    expect(
      ownerCollection.changeRemainingWhitelistPlaces(tokenId, 5)
    ).to.be.revertedWith("ERC721: invalid token ID");
  });

  it(`should set new whitelist members`, async () => {
    const tokenId = 1;
    const newWhitelistMembers = [user2.address];
    expect(await ownerCollection.getAccess(tokenId, user2.address)).to.be.equal(
      false
    );

    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.setWhitelistMembers(tokenId, newWhitelistMembers);

    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(currentRemaining).to.be.lessThan(previousRemaining);
    expect(await ownerCollection.getAccess(tokenId, user2.address)).to.be.equal(
      true
    );
  });

  it(`should not allow set too much members in whitelist`, async () => {
    const tokenId = 1;
    const [owner, user1, user2, user3, user4, user6, user8, user9, user10] =
      await ethers.getSigners();
    const newWhitelistMembers = [
      owner.address,
      user1.address,
      user2.address,
      user3.address,
      user4.address,
      user6.address,
      user8.address,
      user9.address,
      user10.address,
    ];

    expect(
      ownerCollection.setWhitelistMembers(tokenId, newWhitelistMembers)
    ).to.be.revertedWith("setWhitelistMembers: not enough places in whitelist");
  });

  it(`should not decrease remaining whitelist if already existing member is added`, async () => {
    const tokenId = 1;

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.setWhitelistMembers(tokenId, [user1.address]);

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(currentRemaining).to.be.equal(previousRemaining);
  });

  it(`should not add owner in whitelist`, async () => {
    const tokenId = 1;

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.setWhitelistMembers(tokenId, [owner.address]);

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(currentRemaining).to.be.equal(previousRemaining);
  });

  it(`should not allow set whitelist members if token not minted`, async () => {
    const tokenId = 0;

    expect(
      ownerCollection.setWhitelistMembers(tokenId, [owner.address])
    ).to.be.revertedWith("ERC721: invalid token ID");
  });

  it(`should not allow user1 set members to whitelist in owner collection`, async () => {
    const tokenId = 1;

    expect(
      ownerCollection
        .connect(user1)
        .setWhitelistMembers(tokenId, [owner.address])
    ).to.be.revertedWith("access denied");
  });

  it(`should delete members from whitelist`, async () => {
    const tokenId = 1;
    const membersToDelete = [user1.address];

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      true
    );
    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.deleteWhitelistMembers(tokenId, membersToDelete);

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      false
    );
    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(previousRemaining).to.be.lessThan(currentRemaining);
  });

  it(`should not increse remaining places if no one was deleted`, async () => {
    const tokenId = 1;
    const membersToDelete = [user1.address];

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      false
    );
    const previousRemaining = await ownerCollection.whitelistLimits(tokenId);

    await ownerCollection.deleteWhitelistMembers(tokenId, membersToDelete);

    expect(await ownerCollection.getAccess(tokenId, user1.address)).to.be.equal(
      false
    );
    const currentRemaining = await ownerCollection.whitelistLimits(tokenId);

    expect(previousRemaining).to.be.equal(currentRemaining);
  });

  it(`should not delete whitelist members if token not minted`, async () => {
    const tokenId = 0;
    const membersToDelete = [user1.address];

    expect(
      ownerCollection.deleteWhitelistMembers(tokenId, membersToDelete)
    ).to.be.revertedWith("ERC721: invalid token ID");
  });

  it(`should not allow user1 delete members of whitelist in owner collection`, async () => {
    const tokenId = 1;
    const membersToDelete = [user1.address];

    expect(
      ownerCollection
        .connect(user1)
        .deleteWhitelistMembers(tokenId, membersToDelete)
    ).to.be.revertedWith("access denied");
  });
});
