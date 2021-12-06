import hre from "hardhat";

const ethers = hre.ethers;

export default class EtherGame {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();
    const person0 = provider.getSigner(0);
    const person1 = provider.getSigner(1);
    const person2 = provider.getSigner(2);

    const EtherGame = await ethers.getContractFactory("EtherGame");
    const eg = await EtherGame.deploy();
    await eg.deployed();

    eg.connect(person0).fallback({
      value: ethers.utils.parseEther("100.0"),
    });

    await this.play(3, person1, eg);
    await this.play(4, person2, eg);
    await this.play(2, person1, eg);
    await this.play(3, person2, eg);
    await this.play(2, person1, eg);

    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`C: ${ethers.utils.formatEther(await eg.currentBalance())}`);
    console.log(
      `CReal: ${ethers.utils.formatEther(
        await provider.getBalance(eg.address)
      )}`
    );

    console.log(await eg.winner());
    console.log("---");

    await eg.connect(person1).claimReward();
    // await eg.connect(person1).claimReward();

    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`C: ${ethers.utils.formatEther(await eg.currentBalance())}`);
    console.log(
      `CReal: ${ethers.utils.formatEther(
        await provider.getBalance(eg.address)
      )}`
    );

    await this.play(3, person1, eg);
    await this.play(4, person2, eg);
    await this.play(2, person1, eg);
    await this.play(3, person2, eg);
    await this.play(2, person1, eg);

    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`C: ${ethers.utils.formatEther(await eg.currentBalance())}`);
    console.log(
      `CReal: ${ethers.utils.formatEther(
        await provider.getBalance(eg.address)
      )}`
    );

    console.log(await eg.winner());
    console.log("---");

    // Not able to hackit :(
    // I think because hardhat is inherently syncronous
    eg.connect(person1).hackableClaimReward();
    eg.connect(person1).hackableClaimReward();
    await eg.connect(person1).hackableClaimReward();
    // eg.connect(person1).claimReward();

    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`C: ${ethers.utils.formatEther(await eg.currentBalance())}`);
    console.log(
      `CReal: ${ethers.utils.formatEther(
        await provider.getBalance(eg.address)
      )}`
    );
  }

  async play(times: number, person: any, contract: any) {
    for (let i = 0; i < times; i++) {
      await contract.connect(person).play({
        value: ethers.utils.parseEther("1.0"),
      });
    }
  }
}
