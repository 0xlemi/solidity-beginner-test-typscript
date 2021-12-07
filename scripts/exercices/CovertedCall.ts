import hre from "hardhat";
const ethers = hre.ethers;

export default class CovertedCall {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();
    // const person0 = provider.getSigner(0);
    const person1 = provider.getSigner(1);
    const person2 = provider.getSigner(2);

    const HelloToken = await ethers.getContractFactory("HelloToken", person1);
    const ht = await HelloToken.deploy();
    await ht.deployed();

    const CallOptionSeller = await ethers.getContractFactory(
      "CallOptionSeller",
      person1
    );

    console.log();
    const cos = await CallOptionSeller.deploy(
      ethers.utils.parseUnits("100"),
      ethers.utils.parseEther("3"),
      ethers.utils.parseEther("0.1"),
      ethers.BigNumber.from(2), // time until expiration in seconds
      ht.address
    );
    await cos.deployed();

    console.log("Hello Token Balance:");
    console.log(
      `P1: ${ethers.utils.formatUnits(
        await ht.balanceOf(await person1.getAddress())
      )}`
    );
    console.log(
      `P2: ${ethers.utils.formatUnits(
        await ht.balanceOf(await person2.getAddress())
      )}`
    );
    console.log(
      `COS: ${ethers.utils.formatUnits(await ht.balanceOf(cos.address))}`
    );
    console.log("Ether Balance:");
    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(
      `COS: ${ethers.utils.formatEther(await provider.getBalance(cos.address))}`
    );

    await ht.transfer(cos.address, ethers.utils.parseUnits("100"));

    await cos.connect(person2).purchase({
      value: ethers.utils.parseEther("0.1"),
    });

    console.log("-----");
    console.log("Hello Token Balance:");
    console.log(
      `P1: ${ethers.utils.formatEther(
        await ht.balanceOf(await person1.getAddress())
      )}`
    );
    console.log(
      `P2: ${ethers.utils.formatEther(
        await ht.balanceOf(await person2.getAddress())
      )}`
    );
    console.log(
      `COS: ${ethers.utils.formatEther(await ht.balanceOf(cos.address))}`
    );
    console.log("Ether Balance:");
    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(
      `COS: ${ethers.utils.formatEther(await provider.getBalance(cos.address))}`
    );

    // await cos.connect(person2).execute({
    //   value: ethers.utils.parseEther("3.0"),
    // });

    await cos.connect(person1).refund();

    // // Don't know how to keep the blockchain running without running operations 
    // console.log((await cos.timeLeft()).toNumber());

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    // console.log((await cos.timeLeft()).toNumber());

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    // console.log((await cos.timeLeft()).toNumber());


    // console.log((await cos.expiryTS()).toNumber());
    // console.log((await cos.blockTS()).toNumber());

    // console.log((await cos.blockTS()).toNumber());
    // console.log((await cos.expiryTS()).toNumber());

    console.log("-----");
    console.log("Hello Token Balance:");
    console.log(
      `P1: ${ethers.utils.formatEther(
        await ht.balanceOf(await person1.getAddress())
      )}`
    );
    console.log(
      `P2: ${ethers.utils.formatEther(
        await ht.balanceOf(await person2.getAddress())
      )}`
    );
    console.log(
      `COS: ${ethers.utils.formatEther(await ht.balanceOf(cos.address))}`
    );
    console.log("Ether Balance:");
    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(
      `COS: ${ethers.utils.formatEther(await provider.getBalance(cos.address))}`
    );

    // console.log(ethers.utils.formatUnits(await cos.timeLeft()));
  }
}
