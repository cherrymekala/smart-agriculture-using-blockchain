// const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
// const log4js = require('log4js');
// const logger = log4js.getLogger('BasicNetwork');
// const util = require('util');

// const helper = require('./helper');

// const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
//     try {
//         logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

//         const ccp = await helper.getCCP(org_name);

//         const walletPath = await helper.getWalletPath(org_name);
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         let identity = await wallet.get(username);
//         if (!identity) {
//             console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
//             await helper.getRegisteredUser(username, org_name, true);
//             identity = await wallet.get(username);
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         const connectOptions = {
//             wallet,
//             identity: username,
//             discovery: { enabled: true, asLocalhost: true },
//             eventHandlerOptions: {
//                 commitTimeout: 100,
//                 strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
//             }
//         };

//         const gateway = new Gateway();
//         await gateway.connect(ccp, connectOptions);

//         const network = await gateway.getNetwork(channelName);
//         const contract = network.getContract(chaincodeName);

//         let result;
//         let message;

//         if (fcn === "recordSensorData") {
//             if (args.length !== 2) {
//                 return { error: "Incorrect number of arguments. Expecting 2." };
//             }

//             const humidity = parseInt(args[0]);
//             const temperature = parseInt(args[1]);
//             const timestamp = Math.floor(Date.now() / 1000);

//             result = await contract.submitTransaction(fcn, humidity.toString(), temperature.toString(), timestamp.toString());
//             message = `Successfully recorded sensor data with ID: ${timestamp}`;
//         }
//         else if (fcn === "getSensorData") {
//             if (args.length !== 1) {
//                 return { error: "Incorrect number of arguments. Expecting 1." };
//             }

//             result = await contract.evaluateTransaction(fcn, args[0]);
//             message = `Successfully retrieved sensor data with ID: ${args[0]}`;
//         }
//         else {
//             return { error: `Invocation requires either recordSensorData or getSensorData as function, but got ${fcn}` };
//         }

//         await gateway.disconnect();

//         result = JSON.parse(result.toString());

//         let response = {
//             message: message,
//             result: result
//         };

//         // Format the result for better readability
//         const formattedResult = {
//             message: response.message,
//             humidity: result.humidity,
//             temperature: result.temperature,
//             timestamp: result.timestamp
//         };

//         console.log(formattedResult);

//         return response;
//     } catch (error) {
//         console.log(`Getting error: ${error}`);
//         return {
//             error: error.message,
//             errorData: error.data
//         };
//     }
// };

// exports.invokeTransaction = invokeTransaction;


const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
const fs = require('fs');
const path = require("path");
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');

const helper = require('./helper');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        const ccp = await helper.getCCP(org_name);

        const walletPath = await helper.getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true);
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const connectOptions = {
            wallet,
            identity: username,
            discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
        };

        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        let result;
        let message;
        if (fcn === "recordSensorData") {
            if (args.length !== 4) {
                return { error: "Incorrect number of arguments. Expecting 4." };
            }
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2],args[3]);
            message = `Successfully recorded sensor data with ID: ${args[0]}`;
        } else if (fcn === "getSensorData") {
            if (args.length !== 1) {
                return { error: "Incorrect number of arguments. Expecting 1." };
            }
            result = await contract.evaluateTransaction(fcn, args[0]);
            message = `Successfully retrieved sensor data with ID: ${args[0]}`;
            return result;
        }//else if (fcn === "recordTensiometerData") {
        //     if (args.length !== 2) {
        //         return { error: "Incorrect number of arguments. Expecting 2." };
        //     }
        //     result = await contract.submitTransaction(fcn, args[0], args[1]);
        //     message = `Successfully recorded tensiometer data with ID: ${args[0]}`;
        // } else if (fcn === "getTensiometerData") {
        //     if (args.length !== 1) {
        //         return { error: "Incorrect number of arguments. Expecting 1." };
        //     }
        //     result = await contract.evaluateTransaction(fcn, args[0]);
        //     message = `Successfully retrieved tensiometer data with ID: ${args[0]}`;
        //     return result;
        // }
        else {
            return { error: `Invocation requires either recordSensorData or getSensorData as function, but got ${fcn}` };
        }

        await gateway.disconnect();

        result = JSON.parse(result.toString());

        let response = {
            message: message,
            result: result
        };

        // Format the result for better readability
        const formattedResult = {
            message: response.message,
            humidity: result.humidity,
            id: result.id,
            Timestamp: result.Timestamp,
            temperature: result.temperature
        };

        console.log(formattedResult);

        return response;
    } catch (error) {
        console.log(`Getting error: ${error}`);
        return {
            error: error.message,
            errorData: error.data
        };
    }
};

exports.invokeTransaction = invokeTransaction

