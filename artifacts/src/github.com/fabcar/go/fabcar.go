// package main

// import (
// 	"encoding/json"
// 	"fmt"
// 	"strconv"

// 	"github.com/hyperledger/fabric-chaincode-go/shim"
// 	sc "github.com/hyperledger/fabric-protos-go/peer"
// )

// // SmartContract represents the smart contract for sensor data monitoring
// type SmartContract struct {
// }

// type SensorData struct {
// 	ID          string `json:"id"`
// 	Location    string `json:"location"`
// 	Humidity    int    `json:"humidity"`
// 	Temperature int    `json:"temperature"`
// }

// // Init initializes the smart contract
// func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
// 	return shim.Success(nil)
// }

// // Invoke handles invocations of the smart contract
// func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
// 	function, args := APIstub.GetFunctionAndParameters()

// 	switch function {
// 	case "recordSensorData":
// 		return s.recordSensorData(APIstub, args)
// 	case "getSensorData":
// 		return s.getSensorData(APIstub, args)
// 	default:
// 		return shim.Error("Invalid Smart Contract function name.")
// 	}
// }

// // recordSensorData records the sensor data on the ledger
// func (s *SmartContract) recordSensorData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 4 {
// 		return shim.Error("Incorrect number of arguments. Expecting 4.")
// 	}

// 	humidity, err := strconv.Atoi(args[2])
// 	if err != nil {
// 		return shim.Error("Invalid humidity data value. Must be an integer.")
// 	}

// 	temperature, err := strconv.Atoi(args[3])
// 	if err != nil {
// 		return shim.Error("Invalid temperature data value. Must be an integer.")
// 	}

// 	fmt.Printf("Received humidity: %d, temperature: %d\n", humidity, temperature)

// 	sensorData := SensorData{
// 		ID:          args[0],
// 		Location:    args[1],
// 		Humidity:    humidity,
// 		Temperature: temperature,
// 	}

// 	sensorDataAsBytes, err := json.Marshal(sensorData)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	err = APIstub.PutState(args[0], sensorDataAsBytes)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	// Check if the humidity or temperature data is outside of a specified range
// 	thresholdHumidity := 70 // Change this to your desired threshold
// 	thresholdTemperature := 100 // Change this to your desired threshold
// 	if humidity > thresholdHumidity || temperature > thresholdTemperature {
// 		// Notify the farmer through the web portal
// 		err = notifyFarmer(args[0])
// 		if err != nil {
// 			fmt.Printf("Error notifying farmer: %s\n", err.Error())
// 		}
// 	}

// 	return shim.Success(sensorDataAsBytes)
// }



// // getSensorData retrieves the sensor data from the ledger
// // getSensorData retrieves the sensor data from the ledger
// func (s *SmartContract) getSensorData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	fmt.Printf("Received arguments: %v\n", args) // Add this line to print the arguments received

// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	sensorDataAsBytes, err := APIstub.GetState(args[0])
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	if sensorDataAsBytes == nil {
// 		return shim.Error("Sensor data not found.")
// 	}

// 	return shim.Success(sensorDataAsBytes)
// }


// // notifyFarmer simulates the notification process to the farmer's web portal
// func notifyFarmer(sensorID string) error {
// 	// Simulate sending a notification to the farmer's web portal
// 	fmt.Printf("Notification sent to farmer: Sensor ID - %s\n", sensorID)
// 	return nil
// }

// func main() {
// 	err := shim.Start(new(SmartContract))
// 	if err != nil {
// 		fmt.Printf("Error creating new Smart Contract: %s", err)
// 	}
// }


package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
)

// SmartContract represents the smart contract for sensor data monitoring
type SmartContract struct {
}

type SensorData struct {
	ID          string `json:"id"`
	Timestamp   string `json:"timestamp"`
	Humidity    int    `json:"humidity"`
	Temperature int    `json:"temperature"`
	Tensiometer int    `json:"tensiometer"`
	Photoresistor int    `json:"photoresistor"`
	GPS           int    `json:"gps"`
	Accelerometer           int    `json:"accelerometer"`
	Airflow          int    `json:"airflow"`
	Electronic          int    `json:"electronic"`
	Leaf          int    `json:"leaf"`
	Optical          int    `json:"optical"`
	Nutrient         int    `json:"nutrient"`
	Windspeed        int    `json:"windspeed"`
	CO2        int    `json:"co2"`
}

// type Message struct {
// 	ID        string `json:"id"`
// 	From      string `json:"from"`
// 	To        string `json:"to"`
// 	Message   string `json:"message"`
// 	Timestamp string `json:"timestamp"`
// }

// func (s *SmartContract) sendMessage(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 4 {
// 		return shim.Error("Incorrect number of arguments. Expecting 4.")
// 	}

// 	id := args[0]
// 	from := args[1]
// 	to := args[2]
// 	message := args[3]

// 	currentTimeUTC := time.Now().UTC()
// 	currentTimeIST := currentTimeUTC.Add(5*time.Hour + 30*time.Minute)
// 	timestamp := currentTimeIST.Format("2006-01-02 15:04:05.000 MST")

// 	messageObj := Message{
// 		ID:        id,
// 		From:      from,
// 		To:        to,
// 		Message:   message,
// 		Timestamp: timestamp,
// 	}

// 	messageAsBytes, err := json.Marshal(messageObj)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	// Save the message on the ledger
// 	err = APIstub.PutState(id, messageAsBytes)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	return shim.Success(messageAsBytes)
// }

// func (s *SmartContract) getMessages(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	id := args[0]

// 	resultsIterator, err := APIstub.GetHistoryForKey(id)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	defer resultsIterator.Close()

// 	var messages []Message
// 	for resultsIterator.HasNext() {
// 		response, err := resultsIterator.Next()
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}

// 		var message Message
// 		err = json.Unmarshal(response.Value, &message)
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}
// 		messages = append(messages, message)
// 	}

// 	messagesAsBytes, err := json.Marshal(messages)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	return shim.Success(messagesAsBytes)
// }

// Init initializes the smart contract
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	switch function {
	case "recordSensorData":
		return s.recordSensorData(APIstub, args)
	case "getSensorData":
		return s.getSensorData(APIstub, args)
	// case "recordTensiometerData": // New function to record Tensiometer data
	// 	return s.recordTensiometerData(APIstub, args)
	// case "getTensiometerData": // New function to retrieve Tensiometer data
	// 	return s.getTensiometerData(APIstub, args)
	// case "sendMessage":
	// 	return s.sendMessage(APIstub, args)
	// case "getMessages":
	// 	return s.getMessages(APIstub, args)
	default:
		return shim.Error("Invalid Smart Contract function name.")
	}
}

// recordSensorData records the sensor data on the ledger
func (s *SmartContract) recordSensorData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 14 {
		return shim.Error("Incorrect number of arguments. Expecting 13.")
	}

	humidity, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("Invalid humidity data value. Must be an integer.")
	}

	temperature, err := strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Invalid temperature data value. Must be an integer.")
	}

	tensiometer, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("Invalid tensiometer data value. Must be an integer.")
	}
	
photoresistor, err := strconv.Atoi(args[4])
	if err != nil {
		return shim.Error("Invalid photoresistor data value. Must be an integer.")
	}

	gps, err := strconv.Atoi(args[5])
	if err != nil {
		return shim.Error("Invalid gps data value. Must be an integer.")
	}

	accelerometer, err := strconv.Atoi(args[6])
	if err != nil {
		return shim.Error("Invalid accelerometer data value. Must be an integer.")
	}

	airflow, err := strconv.Atoi(args[7])
	if err != nil {
		return shim.Error("Invalid airflow data value. Must be an integer.")
	}

electronic, err := strconv.Atoi(args[8])
	if err != nil {
		return shim.Error("Invalid electronic data value. Must be an integer.")
	}

leaf, err := strconv.Atoi(args[9])
	if err != nil {
		return shim.Error("Invalid leaf data value. Must be an integer.")
	}

	optical, err := strconv.Atoi(args[10])
	if err != nil {
		return shim.Error("Invalid optical data value. Must be an integer.")
	}

nutrient, err := strconv.Atoi(args[11])
	if err != nil {
		return shim.Error("Invalid nutrient data value. Must be an integer.")
	}

windspeed, err := strconv.Atoi(args[12])
	if err != nil {
		return shim.Error("Invalid windspeed data value. Must be an integer.")
	}

co2, err := strconv.Atoi(args[13])
	if err != nil {
		return shim.Error("Invalid co2 data value. Must be an integer.")
	}

	// Get the current time in UTC
	currentTimeUTC := time.Now().UTC()

	// Add the IST time zone offset (+05:30)
	currentTimeIST := currentTimeUTC.Add(5*time.Hour + 30*time.Minute)

	// Format the timestamp in IST
	timestamp := currentTimeIST.Format("2006-01-02 15:04:05.000 MST")

	// Get the latest ID from the ledger
	latestIDBytes, err := APIstub.GetState("latestID")
	if err != nil {
		return shim.Error(err.Error())
	}
	latestID := 1 // Default to 1 if no latestID exists in the ledger
	if latestIDBytes != nil {
		latestID, err = strconv.Atoi(string(latestIDBytes))
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	latestID++ // Increment the latestID

	// Store the latest ID in the ledger
	err = APIstub.PutState("latestID", []byte(strconv.Itoa(latestID)))
	if err != nil {
		return shim.Error(err.Error())
	}

	sensorData := SensorData{
		ID:          strconv.Itoa(latestID),
		Timestamp:   timestamp,
		Humidity:    humidity,
		Temperature: temperature,
		Tensiometer: tensiometer,
		Photoresistor: photoresistor,
		GPS: gps,
		Accelerometer: accelerometer,
		Airflow: airflow,
		Electronic: electronic,
		Leaf: leaf,
		Optical: optical,
		Nutrient: nutrient,
		Windspeed: windspeed,
		CO2: co2,
	}

	sensorDataAsBytes, err := json.Marshal(sensorData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = APIstub.PutState(strconv.Itoa(latestID), sensorDataAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// // Check if the humidity or temperature data is outside of a specified range
	// thresholdHumidity := 70 // Change this to your desired threshold
	// thresholdTemperature := 100 // Change this to your desired threshold
	// if humidity > thresholdHumidity || temperature > thresholdTemperature {
	// 	// Notify the farmer through the web portal
	// 	err = notifyFarmer(strconv.Itoa(latestID))
	// 	if err != nil {
	// 		fmt.Printf("Error notifying farmer: %s\n", err.Error())
	// 	}
	// }

	return shim.Success(sensorDataAsBytes)
}

func (s *SmartContract) getSensorData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1.")
	}

	sensorDataAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	if sensorDataAsBytes == nil {
		return shim.Error("Sensor data not found.")
	}

	return shim.Success(sensorDataAsBytes)
}

// // recordTensiometerData records the sensor data on the ledger for Tensiometer
// func (s *SmartContract) recordTensiometerData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 2 {
// 		return shim.Error("Incorrect number of arguments. Expecting 2.")
// 	}

// 	tensiometer, err := strconv.Atoi(args[1])
// 	if err != nil {
// 		return shim.Error("Invalid tensiometer data value. Must be an integer.")
// 	}

// 	fmt.Printf("Received tensiometer data: %d\n", tensiometer)

// 	// Get the current time in UTC
// 	currentTimeUTC := time.Now().UTC()

// 	// Add the IST time zone offset (+05:30)
// 	currentTimeIST := currentTimeUTC.Add(5*time.Hour + 30*time.Minute)

// 	// Format the timestamp in IST
// 	timestamp := currentTimeIST.Format("2006-01-02 15:04:05.000 MST")

// 	// Get the latest ID from the ledger
// 	latestIDBytes, err := APIstub.GetState("latestID")
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	latestID := 1 // Default to 1 if no latestID exists in the ledger
// 	if latestIDBytes != nil {
// 		latestID, err = strconv.Atoi(string(latestIDBytes))
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}
// 	}
// 	latestID++ // Increment the latestID

// 	// Store the latest ID in the ledger
// 	err = APIstub.PutState("latestID", []byte(strconv.Itoa(latestID)))
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	sensorData := SensorData{
// 		ID:          strconv.Itoa(latestID),
// 		Timestamp:   timestamp,
// 		Tensiometer: tensiometer,
// 	}

// 	sensorDataAsBytes, err := json.Marshal(sensorData)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	err = APIstub.PutState(strconv.Itoa(latestID), sensorDataAsBytes)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	// Check if the tensiometer data is outside of a specified range
// 	thresholdTensiometer := 500 // Change this to your desired threshold
// 	if tensiometer > thresholdTensiometer {
// 		// Notify the farmer through the web portal
// 		err = notifyFarmer(strconv.Itoa(latestID))
// 		if err != nil {
// 			fmt.Printf("Error notifying farmer: %s\n", err.Error())
// 		}
// 	}

// 	return shim.Success(sensorDataAsBytes)
// }

// // getTensiometerData retrieves the tensiometer data from the ledger
// func (s *SmartContract) getTensiometerData(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1.")
// 	}

// 	sensorDataAsBytes, err := APIstub.GetState(args[0])
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	if sensorDataAsBytes == nil {
// 		return shim.Error("Tensiometer data not found.")
// 	}

// 	return shim.Success(sensorDataAsBytes)
// }

// // notifyFarmer simulates the notification process to the farmer's web portal
// func notifyFarmer(sensorID string) error {
// 	// Simulate sending a notification to the farmer's web portal
// 	fmt.Printf("Notification sent to farmer: Sensor ID - %s\n", sensorID)
// 	return nil
// }

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

