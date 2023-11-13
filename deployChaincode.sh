# export CORE_PEER_TLS_ENABLED=true
# export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
# export PEER0_ORG1_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
# export PEER0_ORG2_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
# export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

# export PRIVATE_DATA_CONFIG=${PWD}/artifacts/private-data/collections_config.json

# export CHANNEL_NAME=mychannel

# setGlobalsForOrderer() {
#     export CORE_PEER_LOCALMSPID="OrdererMSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
# }

# setGlobalsForPeer0Org1() {
#     export CORE_PEER_LOCALMSPID="Org1MSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
#     export CORE_PEER_ADDRESS=localhost:7051
# }

# setGlobalsForPeer0Org2() {
#     export CORE_PEER_LOCALMSPID="Org2MSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
#     export CORE_PEER_ADDRESS=localhost:9051
# }

# presetup() {
#     echo Vendoring Go dependencies ...
#     pushd ./artifacts/src/github.com/fabcar/go
#     GO111MODULE=on go mod vendor
#     popd
#     echo Finished vendoring Go dependencies
# }

# CHANNEL_NAME="mychannel"
# CC_RUNTIME_LANGUAGE="golang"
# VERSION="1"
# CC_SRC_PATH="./artifacts/src/github.com/fabcar/go"
# CC_NAME="fabcar"

# packageChaincode() {
#     rm -rf ${CC_NAME}.tar.gz
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode package ${CC_NAME}.tar.gz \
#         --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
#         --label ${CC_NAME}_${VERSION}
#     echo "===================== Chaincode is packaged on peer0.org1 ===================== "
# }

# installChaincode() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode install ${CC_NAME}.tar.gz
#     echo "===================== Chaincode is installed on peer0.org1 ===================== "

#     setGlobalsForPeer0Org2
#     peer lifecycle chaincode install ${CC_NAME}.tar.gz
#     echo "===================== Chaincode is installed on peer0.org2 ===================== "
# }

# queryInstalled() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode queryinstalled >&log.txt
#     cat log.txt
#     PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
#     echo PackageID is ${PACKAGE_ID}
#     echo "===================== Query installed successful on peer0.org1 on channel ===================== "
# }

# approveForMyOrg1() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode approveformyorg -o localhost:7050 \
#         --ordererTLSHostnameOverride orderer.example.com --tls \
#         --collections-config $PRIVATE_DATA_CONFIG \
#         --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
#         --init-required --package-id ${PACKAGE_ID} \
#         --sequence ${VERSION}
#     echo "===================== Chaincode approved from org 1 ===================== "
# }

# approveForMyOrg2() {
#     setGlobalsForPeer0Org2
#     peer lifecycle chaincode approveformyorg -o localhost:7050 \
#         --ordererTLSHostnameOverride orderer.example.com --tls \
#         --collections-config $PRIVATE_DATA_CONFIG \
#         --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
#         --init-required --package-id ${PACKAGE_ID} \
#         --sequence ${VERSION}
#     echo "===================== Chaincode approved from org 2 ===================== "
# }

# checkCommitReadiness() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode checkcommitreadiness \
#         --collections-config $PRIVATE_DATA_CONFIG \
#         --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
#         --sequence ${VERSION} --output json --init-required
#     echo "===================== Checking commit readiness from org 1 ===================== "
# }

# commitChaincodeDefinition() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
#         --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
#         --channelID $CHANNEL_NAME --name ${CC_NAME} \
#         --collections-config $PRIVATE_DATA_CONFIG \
#         --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
#         --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
#         --version ${VERSION} --sequence ${VERSION} --init-required
# }

# queryCommitted() {
#     setGlobalsForPeer0Org1
#     peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}
# }

# chaincodeInvokeInit() {
#     setGlobalsForPeer0Org1
#     peer chaincode invoke -o localhost:7050 \
#         --ordererTLSHostnameOverride orderer.example.com \
#         --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
#         -C $CHANNEL_NAME -n ${CC_NAME} \
#         --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
#         --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
#         --isInit -c '{"Args":[]}'
#         sleep 5
# }
# id=1
# chaincodeInvoke() {
#     setGlobalsForPeer0Org1

#     while true; do
#         # Generate random values for humidity and temperature within a specific range
#         humidity=$(shuf -i 40-80 -n 1)
#         temperature=$(shuf -i 80-120 -n 1)

      
#         # Check if either humidity or temperature exceeds their threshold values
#         if [ "$humidity" -gt 70 ] || [ "$temperature" -gt 100 ]; then
#           # Invoke the 'recordSensorData' function with the generated values
#          peer chaincode invoke -o localhost:7050 \
#             --ordererTLSHostnameOverride orderer.example.com \
#             --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
#             -C $CHANNEL_NAME -n ${CC_NAME} \
#             --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
#             --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
#          -c '{"function":"recordSensorData","Args":["'"$id"'", "Vijayawada", "'"$humidity"'", "'"$temperature"'"]}'
#             sleep 600 
#         fi
#         id=$((id+1))
#         sleep 1  # Wait for 1 second before generating new values
#     done
# }




# chaincodeQuery() {
#     setGlobalsForPeer0Org1
#     peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"getSensorData","Args":["'"$id"'"]}'
# }

# presetup
# packageChaincode
#  installChaincode
# queryInstalled
# approveForMyOrg1
# checkCommitReadiness
# approveForMyOrg2
# checkCommitReadiness
# commitChaincodeDefinition
# queryCommitted
# chaincodeInvokeInit
# sleep 5
# chaincodeInvoke
# sleep 3
# chaincodeQuery

#!/bin/bash

#!/bin/bash

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_ORG1_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export PEER0_ORG2_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export PRIVATE_DATA_CONFIG=${PWD}/artifacts/private-data/collections_config.json

export CHANNEL_NAME=mychannel

setGlobalsForOrderer() {
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
}

setGlobalsForPeer0Org1() {
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0Org2() {
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}

presetup() {
    echo Vendoring Go dependencies ...
    pushd ./artifacts/src/github.com/fabcar/go
    GO111MODULE=on go mod vendor
    popd
    echo Finished vendoring Go dependencies
}

CHANNEL_NAME="mychannel"
CC_RUNTIME_LANGUAGE="golang"
VERSION="1"
CC_SRC_PATH="./artifacts/src/github.com/fabcar/go"
CC_NAME="fabcar"

packageChaincode() {
    rm -rf ${CC_NAME}.tar.gz
    setGlobalsForPeer0Org1
    peer lifecycle chaincode package ${CC_NAME}.tar.gz \
        --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME}_${VERSION}
    echo "===================== Chaincode is packaged on peer0.org1 ===================== "
}

installChaincode() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.org1 ===================== "

    setGlobalsForPeer0Org2
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.org2 ===================== "
}

queryInstalled() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.org1 on channel ===================== "
}

approveForMyOrg1() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --init-required --package-id ${PACKAGE_ID} \
        --sequence ${VERSION}
    echo "===================== Chaincode approved from org 1 ===================== "
}

approveForMyOrg2() {
    setGlobalsForPeer0Org2
    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com --tls \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --init-required --package-id ${PACKAGE_ID} \
        --sequence ${VERSION}
    echo "===================== Chaincode approved from org 2 ===================== "
}

checkCommitReadiness() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode checkcommitreadiness \
        --collections-config $PRIVATE_DATA_CONFIG \
        --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --sequence ${VERSION} --output json --init-required
    echo "===================== Checking commit readiness from org 1 ===================== "
}

commitChaincodeDefinition() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        --version ${VERSION} --sequence ${VERSION} --init-required
}

queryCommitted() {
    setGlobalsForPeer0Org1
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}
}

chaincodeInvokeInit() {
    setGlobalsForPeer0Org1
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        --isInit -c '{"Args":[]}'
    sleep 5
}

# # Add a new function to get the latest ID from the ledger
# getLatestID() {
#     setGlobalsForPeer0Org1
#     latestID=$(peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"getSensorData","Args":["latestID"]}')
#     if [ -z "$latestID" ]; then
#         latestID=0
#     fi
#     echo "$latestID"
# }

# # Add a new function to send a message using the chaincode
# chaincodeSendMessage() {
#     setGlobalsForPeer0Org1

#     # Generate a unique ID for the message
#     id=$(date +%s)

#     # Specify the sender, receiver, and message content
#     from="Sender"
#     to="Receiver"
#     message="Hello, this is a test message."

#     # Invoke the 'sendMessage' function to send the message
#     peer chaincode invoke -o localhost:7050 \
#         --ordererTLSHostnameOverride orderer.example.com \
#         --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
#         -C $CHANNEL_NAME -n ${CC_NAME} \
#         --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
#         --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
#         -c '{"function":"sendMessage","Args":["'"$id"'",  "'"$from"'", "'"$to"'", "'"$message"'"]}'
# }

# # Add a new function to retrieve messages using the chaincode
# chaincodeGetMessages() {
#     setGlobalsForPeer0Org1

#     # Specify the ID of the recipient
#     recipientID="Receiver"

#     # Query the 'getMessages' function to retrieve messages for the recipient
#     peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"getMessages","Args":["'"$recipientID"'"]}'
# }

chaincodeInvoke() {
    setGlobalsForPeer0Org1

    while true; do
      

        # Generate random values for humidity, temperature, and tensiometer within specific ranges
        humidity=$(shuf -i 40-80 -n 1)
        temperature=$(shuf -i 20-60 -n 1)
        tensiometer=$(shuf -i 1-100 -n 1)
        photoresistor=$(shuf -i 1-100 -n 1)
        gps=$(shuf -i 3-100 -n 1)
        accelerometer=$(shuf -i 1-25 -n 1)
        airflow=$(shuf -i 1-25 -n 1)
        electronic=$(shuf -i 0-10 -n 1)
        leaf=$(shuf -i 0-100 -n 1)
        optical=$(shuf -i 25-250 -n 1)
        nutrient=$(shuf -i 10-500 -n 1)
        windspeed=$(shuf -i 1-50 -n 1)
        co2=$(shuf -i 350-2000 -n 1)
        # Invoke the 'recordSensorData' function with the generated values for humidity and temperature
        peer chaincode invoke -o localhost:7050 \
            --ordererTLSHostnameOverride orderer.example.com \
            --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
            -C $CHANNEL_NAME -n ${CC_NAME} \
            --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
            --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
            -c '{"function":"recordSensorData","Args":["'"$id"'",  "'"$humidity"'", "'"$temperature"'","'"$tensiometer"'","'"$photoresistor"'","'"$gps"'","'"$accelerometer"'","'"$airflow"'","'"$electronic"'","'"$leaf"'","'"$optical"'","'"$nutrient"'","'"$windspeed"'","'"$co2"'"]}'
        sleep 1  # Wait for 1 second before generating new values

        # # Invoke the 'recordTensiometerData' function with the generated value for tensiometer
        # peer chaincode invoke -o localhost:7050 \
        #     --ordererTLSHostnameOverride orderer.example.com \
        #     --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        #     -C $CHANNEL_NAME -n ${CC_NAME} \
        #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
        #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
        #     -c '{"function":"recordTensiometerData","Args":["'"$id"'",  "'"$tensiometer"'"]}'
        # sleep 1  # Wait for 1 second before generating new values

        # Sleep for a few seconds before generating new sensor data
        sleep 10
    done
}

chaincodeQuery() {
    setGlobalsForPeer0Org1
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"getSensorData","Args":["'"$id"'"]}'

    # peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"getTensiometerData","Args":["'"$id"'"]}'
}

presetup
packageChaincode
installChaincode
queryInstalled
approveForMyOrg1
checkCommitReadiness
approveForMyOrg2
checkCommitReadiness
commitChaincodeDefinition
queryCommitted
chaincodeInvokeInit
sleep 5
chaincodeInvoke
sleep 3
chaincodeQuery
# # Send a test message using the chaincode
# chaincodeSendMessage

# # Retrieve messages using the chaincode
# chaincodeGetMessages
