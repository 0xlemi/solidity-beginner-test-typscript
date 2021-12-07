import hre from "hardhat";

const ethers = hre.ethers;

export default class DelagateCall {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();
    const person0 = provider.getSigner(0);
    const person1 = provider.getSigner(1);
    const person2 = provider.getSigner(2);

    const DelegateContract = await ethers.getContractFactory(
      "DelegateContract"
    );
    const dc = await DelegateContract.deploy();
    await dc.deployed();

    const Satellite1 = await ethers.getContractFactory("Satellite1", person1);
    const s1 = await Satellite1.deploy();
    await s1.deployed();

    const Satellite2 = await ethers.getContractFactory("Satellite2", person2);
    const s2 = await Satellite2.deploy();
    await s2.deployed();

    console.log("s1:");
    console.log(
      ethers.utils.formatUnits(await s1.num()),
      await s1.sender(),
      ethers.utils.formatEther(await s1.value()),
      await s1.owner()
    );

    console.log("s2:");
    console.log(
      ethers.utils.formatUnits(await s2.num()),
      await s2.sender(),
      ethers.utils.formatEther(await s2.value()),
      await s2.owner()
    );

    console.log("del:");
    console.log(
      ethers.utils.formatUnits(await dc.num()),
      await dc.sender(),
      ethers.utils.formatEther(await dc.value())
    );

    await dc.setVars(s1.address, ethers.utils.parseUnits("5"), {
      value: ethers.utils.parseEther("10.0"),
    });

    await dc.setVars(s2.address, ethers.utils.parseUnits("50"), {
      value: ethers.utils.parseEther("100.0"),
    });

    console.log("---");

    console.log("s1:");
    console.log(
      ethers.utils.formatUnits(await s1.num()),
      await s1.sender(),
      ethers.utils.formatEther(await s1.value()),
      await s1.owner()
    );

    console.log("s2:");
    console.log(
      ethers.utils.formatUnits(await s2.num()),
      await s2.sender(),
      ethers.utils.formatEther(await s2.value()),
      await s2.owner()
    );

    console.log("del:");
    console.log(
      ethers.utils.formatUnits(await dc.num()),
      await dc.sender(),
      ethers.utils.formatEther(await dc.value())
    );
  }
}
