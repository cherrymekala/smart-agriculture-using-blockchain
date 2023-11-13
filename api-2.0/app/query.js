const { Gateway, Wallets } = require('fabric-network');
const helper = require('./helper');

const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {
  try {
    const ccp = await helper.getCCP(org_name);
    const walletPath = await helper.getWalletPath(org_name);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(username);
    if (!identity) {
      console.log(`An identity for the user ${username} does not exist in the wallet.`);
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    if (fcn === 'getSensorData') {
      if (args.length !== 1) {
        console.log('Incorrect number of arguments. Expecting 1.');
        return;
      }
      const result = await contract.evaluateTransaction(fcn, args[0]);
      const sensorData = JSON.parse(result.toString());
      console.log(sensorData);
      return sensorData;
    } else {
      console.log('Invalid function name. Expecting "getSensorData".');
      return;
    }
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return error.message;
  }
};

exports.query = query;

