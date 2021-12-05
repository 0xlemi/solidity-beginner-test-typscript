import hre from "hardhat";
const ethers = hre.ethers;

export default class SharedWallet {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();

    const person0 = provider.getSigner(0);
    const person1 = provider.getSigner(1);
    const person2 = provider.getSigner(2);

    const MyTestToken = await ethers.getContractFactory("MyTestToken", person0);

    const jc = await MyTestToken.deploy("JuanchoCoin", "JC");
    await jc.deployed();

    const pp = await MyTestToken.deploy("PepeCoin", "PP");
    await pp.deployed();

    const ContractSwap = await ethers.getContractFactory("TokenSwap", person1);
    const cs = await ContractSwap.deploy(
      jc.address,
      await person1.getAddress(),
      pp.address,
      await person2.getAddress()
    );
    await cs.deployed();

    await jc.transfer(
      await person1.getAddress(),
      ethers.utils.parseEther("20.0")
    );

    await pp.transfer(
      await person2.getAddress(),
      ethers.utils.parseEther("40.0")
    );

    let balanceP0 = await jc.balanceOf(await person0.getAddress());
    let balanceP1 = await jc.balanceOf(await person1.getAddress());
    let balanceP2 = await jc.balanceOf(await person2.getAddress());
    console.log("JuachoCoin Balances:");
    console.log(`P0: ${ethers.utils.formatEther(balanceP0)}`);
    console.log(`P1: ${ethers.utils.formatEther(balanceP1)}`);
    console.log(`P2: ${ethers.utils.formatEther(balanceP2)}`);

    balanceP0 = await pp.balanceOf(await person0.getAddress());
    balanceP1 = await pp.balanceOf(await person1.getAddress());
    balanceP2 = await pp.balanceOf(await person2.getAddress());
    console.log("PepeCoin Balances:");
    console.log(`P0: ${ethers.utils.formatEther(balanceP0)}`);
    console.log(`P1: ${ethers.utils.formatEther(balanceP1)}`);
    console.log(`P2: ${ethers.utils.formatEther(balanceP2)}`);

    // Should print:
    // 80
    // 20
    // 0
    // --
    // 60
    // 0
    // 40

    await jc
      .connect(person1)
      .approve(cs.address, ethers.utils.parseEther("05.0"));

    await pp
      .connect(person2)
      .approve(cs.address, ethers.utils.parseEther("40.0"));

    // Person1 with jc <---> person2 with pp
    await cs.swap(
      ethers.utils.parseEther("5.0"),
      ethers.utils.parseEther("10.0")
    );

    balanceP0 = await jc.balanceOf(await person0.getAddress());
    balanceP1 = await jc.balanceOf(await person1.getAddress());
    balanceP2 = await jc.balanceOf(await person2.getAddress());
    console.log("JuachoCoin Balances:");
    console.log(`P0: ${ethers.utils.formatEther(balanceP0)}`);
    console.log(`P1: ${ethers.utils.formatEther(balanceP1)}`);
    console.log(`P2: ${ethers.utils.formatEther(balanceP2)}`);

    balanceP0 = await pp.balanceOf(await person0.getAddress());
    balanceP1 = await pp.balanceOf(await person1.getAddress());
    balanceP2 = await pp.balanceOf(await person2.getAddress());
    console.log("PepeCoin Balances:");
    console.log(`P0: ${ethers.utils.formatEther(balanceP0)}`);
    console.log(`P1: ${ethers.utils.formatEther(balanceP1)}`);
    console.log(`P2: ${ethers.utils.formatEther(balanceP2)}`);

    // Should print:
    // 80
    // 15
    // 5
    // --
    // 60
    // 10
    // 30
  }
}
