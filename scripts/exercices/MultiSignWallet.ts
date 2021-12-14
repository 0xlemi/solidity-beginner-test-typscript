import hre from "hardhat";

const ethers = hre.ethers;

export default class EtherGame {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();
    const person0 = provider.getSigner(0);
    const person1 = provider.getSigner(1);
    const person2 = provider.getSigner(2);
    const person3 = provider.getSigner(3);
    const person4 = provider.getSigner(4);

    const MSContract = await ethers.getContractFactory(
      "MultiSigWallet",
      person1
    );
    const ms = await MSContract.deploy();
    await ms.deployed();

    await ms.addOwner(await person2.getAddress());
    await ms.addOwner(await person3.getAddress());
    await ms.addOwner(await person4.getAddress());

    await ms.connect(person0).fallback({
      value: ethers.utils.parseEther("3.0"),
    });

    await ms.fallback({
      value: ethers.utils.parseEther("4.0"),
    });

    // Preson 1 created it.
    await ms.createTransaction(
      await person4.getAddress(),
      ethers.utils.parseEther("3.5")
    );

    // Preson 3 created it.
    await ms
      .connect(person3)
      .createTransaction(
        await person3.getAddress(),
        ethers.utils.parseEther("2.5")
      );

    console.log(await ms.getPendingTransactions());
    console.log(await ms.getTransactionInfo(0));
    console.log(await ms.getTransactionInfo(1));


    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`P3: ${ethers.utils.formatEther(await person3.getBalance())}`);
    console.log(`P4: ${ethers.utils.formatEther(await person4.getBalance())}`);
    console.log("---");

    // await ms.signTransaction(1);
    // await ms.connect(person4).signTransaction(1);
    await ms.connect(person3).signTransaction(0);
    await ms.connect(person2).signTransaction(0);

    console.log("---");
    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`P3: ${ethers.utils.formatEther(await person3.getBalance())}`);
    console.log(`P4: ${ethers.utils.formatEther(await person4.getBalance())}`);
    console.log("---");

    await ms.signTransaction(1);
    await ms.connect(person4).signTransaction(1);

    console.log("---");
    console.log(`P1: ${ethers.utils.formatEther(await person1.getBalance())}`);
    console.log(`P2: ${ethers.utils.formatEther(await person2.getBalance())}`);
    console.log(`P3: ${ethers.utils.formatEther(await person3.getBalance())}`);
    console.log(`P4: ${ethers.utils.formatEther(await person4.getBalance())}`);
  }
}
