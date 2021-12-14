// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
// eslint-disable-next-line node/no-missing-import
// import CovertedCall from "./exercices/CovertedCall";

const ethers = hre.ethers;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run("compile");
  // const call = new CovertedCall();
  // call.test();
  //
  const provider = new ethers.providers.JsonRpcProvider();
  const person0 = provider.getSigner(0);
  const person1 = provider.getSigner(1);
  const person2 = provider.getSigner(2);
  const person3 = provider.getSigner(3);
  const person4 = provider.getSigner(4);

  const MSContract = await ethers.getContractFactory("MultiSigWallet", person1);
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
