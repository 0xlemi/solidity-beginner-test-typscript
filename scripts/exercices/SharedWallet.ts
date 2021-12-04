import hre from "hardhat";
const ethers = hre.ethers;

export default class SharedWallet {
  async test() {
    const provider = new ethers.providers.JsonRpcProvider();
    const SharedWallet = await ethers.getContractFactory("SharedWallet");
    const sharedWallet = await SharedWallet.deploy();
    await sharedWallet.deployed();

    // const sharedWalletSig0 = await (
    //   await SharedWallet.connect(signer0).deploy()
    // ).deployed();
    const sharedWalletSig0 = sharedWallet.connect(provider.getSigner(0));
    const sharedWalletSig1 = sharedWallet.connect(provider.getSigner(1));
    const sharedWalletSig2 = sharedWallet.connect(provider.getSigner(2));

    let sig1 = sharedWalletSig1.signer;
    let sig2 = sharedWalletSig2.signer;
    let sig3 = provider.getSigner(3);

    await sharedWalletSig0.addOwner(await sig1.getAddress());
    await sharedWalletSig0.addOwner(await sig2.getAddress());

    console.log("---");
    console.log(ethers.utils.formatEther(await sig1.getBalance()));
    console.log(ethers.utils.formatEther(await sig2.getBalance()));
    console.log(ethers.utils.formatEther(await sig3.getBalance()));

    await sharedWalletSig0.fallback({
      value: ethers.utils.parseEther("3.0"),
    });

    await sharedWalletSig1.fallback({
      value: ethers.utils.parseEther("2.0"),
    });

    await sharedWalletSig2.fallback({
      value: ethers.utils.parseEther("1.0"),
    });

    console.log("---");
    console.log(ethers.utils.formatEther(await sig1.getBalance()));
    console.log(ethers.utils.formatEther(await sig2.getBalance()));
    console.log(ethers.utils.formatEther(await sig3.getBalance()));

    await sharedWalletSig1.withdraw(ethers.utils.parseEther("2.0"));
    await sharedWalletSig2.withdraw(ethers.utils.parseEther("1.0"));

    await sharedWalletSig2.transferTo(
      await sig3.getAddress(),
      ethers.utils.parseEther("1.0")
    );

    console.log("---");
    console.log(ethers.utils.formatEther(await sig1.getBalance()));
    console.log(ethers.utils.formatEther(await sig2.getBalance()));
    console.log(ethers.utils.formatEther(await sig3.getBalance()));
  }
}
