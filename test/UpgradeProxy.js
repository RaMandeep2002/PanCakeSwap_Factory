const { expect } = require('chai');
const { ethers } = require('hardhat');
// d/w ->lp token -> withdraw lp token ->
describe('PanCakeSwap Contract', async () => {
  let masterChef;
  let cakeToken;
  let syrupBar;
  let lpToken1;
  let lpToken2;
  let factory;
  let factory2;
  let masterColab;
  let upgradeProxy;

  beforeEach(async () => {
    signer = await ethers.getSigners();

    const CakeToken = await ethers.getContractFactory('CakeToken');
    cakeToken = await CakeToken.connect(signer[0]).deploy();

    const SyrupBar = await ethers.getContractFactory('SyrupBar');
    syrupBar = await SyrupBar.connect(signer[0]).deploy(cakeToken.target);

    const MasterChef = await ethers.getContractFactory('MasterChef');
    masterChef = await MasterChef.connect(signer[0]).deploy(
      cakeToken.target,
      syrupBar.target,
      signer[0].address,
      10000,
      1
    );

    const MockBEP20 = await ethers.getContractFactory('MockBEP20');
    lpToken1 = await MockBEP20.connect(signer[0]).deploy(
      'LP Token 1',
      'LP1',
      1000
    );

    const MasterColab = await ethers.getContractFactory('masterColab');
    masterColab = await MasterColab.connect(signer[0]).deploy();

    const Factory = await ethers.getContractFactory('Factory');
    factory = await Factory.connect(signer[0]).deploy();

    const Proxy = await ethers.getContractFactory('OwnedUpgradeabilityProxy');
    upgradeProxy = await Proxy.deploy();

    lpToken2 = await MockBEP20.connect(signer[0]).deploy(
      'LP Token 2',
      'LP2',
      1000
    );

    await cakeToken.transferOwnership(masterChef.target);
    await syrupBar.transferOwnership(masterChef.target);
  });

  it('Test :', async () => {
    await upgradeProxy.upgradeTo(factory.target);
    let proxyfactory = await factory.connect(signer[0]).attach(upgradeProxy);
    console.log('Porxy Factory:- ', proxyfactory.target);
    await proxyfactory
      .connect(signer[0])
      .initialize(masterColab.target, masterChef.target);
    await proxyfactory.createChild();

    console.log(await proxyfactory.getData());

    expect(await upgradeProxy.target).to.be.equal(
      '0x0165878A594ca255338adfa4d48449f69242Eb8F'
    );
  });

  // it('  factory test  ', async () => {

  //   await factory.createChild();
  //   let first = await factory.getData()

  //   await factory.createChild();
  //  let second = await factory.getData()

  //  expect(first).to.not.equal(second);
  // });
  // it("  masterColab test  ",async()=>{
  //   await factory.createChild();
  //   let master = await masterColab.attach(await factory.getData());

  //   expect(await factory.getData()).to.be.equal(master.target);

  //   let a = await master.get();
  //   expect(a[0]).to.be.equal(masterChef.target)
  //   expect(a[1]).to.be.equal(factory.target)

  //   await master.newFarm(100,lpToken1.target,true);

  //   await lpToken1.connect(signer[0]).approve(master.target,300);

  //   let initial = await cakeToken.balanceOf(signer[0].address);

  //  await master.depositit(1,10,lpToken1.target);

  //  await master.withdraw(1,10,lpToken1.target,cakeToken.target);

  //  let final = await cakeToken.balanceOf(signer[0].address);

  //  expect(final).to.be.greaterThan(initial);
  // })
});
