package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"log"
	"math/big"
	"net/http"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
)

const (
	Success     = 0
	Error       = 1
	ErrorExceed = 2
)

const (
	DefaultHttpAddressFaucet     = ":8189"
	DefaultBlockUrlFaucet        = "http://testnet.ylem.network"
	DefaultContractAddressFaucet = "0x3e70c24D98c8FEa3b2c3Adb799075df09f6dE050"
	DefaultPrivateKeyFaucet      = "<private key>"
)

func Claim(c *gin.Context) {
	receiver := strings.TrimSpace(c.Query("receiver"))
	r := strings.TrimSpace(c.Query("r"))
	s := strings.TrimSpace(c.Query("s"))
	v := strings.TrimSpace(c.Query("v"))

	if receiver == "" || r == "" || s == "" || v == "" {
		c.String(http.StatusBadRequest, "invalid parameters of the request")
		return
	}

	response := struct {
		Code    int         `json:"code"`
		Message string      `json:"message"`
		Data    interface{} `json:"data"`
	}{}

	privateKey, err := crypto.HexToECDSA(DefaultPrivateKeyFaucet)
	if err != nil {
		log.Println("fail to load private key: ", err)
		response.Code = Error
		response.Message = "fail to load private key"
		c.JSON(http.StatusOK, response)
		return
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Println("fail to load public key ")
		response.Code = Error
		response.Message = "fail to load public key"
		c.JSON(http.StatusOK, response)
		return
	}

	account := crypto.PubkeyToAddress(*publicKeyECDSA)
	log.Println("caller account: ", account.Hex())

	contractABI, err := abi.JSON(strings.NewReader(`
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Claim",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "nonce",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
`))

	if err != nil {
		log.Println("fail to parse abi: ", err)
		response.Code = Error
		response.Message = "fail to load public key"
		c.JSON(http.StatusOK, response)
		return
	}

	contractAddress := common.HexToAddress(DefaultContractAddressFaucet)
	client, err := ethclient.Dial(DefaultBlockUrlFaucet)
	if err != nil {
		log.Println(err)
		response.Code = Error
		response.Message = "fail to dial ethclient"
		c.JSON(http.StatusOK, response)
		return
	}

	nonce, err := client.PendingNonceAt(context.Background(), account)
	if err != nil {
		log.Println(err)
		response.Code = Error
		response.Message = "fail to get nonce"
		c.JSON(http.StatusOK, response)
		return
	}

	receiverAddress := common.HexToAddress(receiver)
	var rBytes [32]byte
	var sBytes [32]byte
	rBytesSlice, _ := hex.DecodeString(r[2:])
	copy(rBytes[:], rBytesSlice)
	sBytesSlice, _ := hex.DecodeString(s[2:])
	copy(sBytes[:], sBytesSlice)

	val, _ := strconv.ParseInt(v, 10, 64)
	data, err := contractABI.Pack("claim", receiverAddress, uint8(val), rBytes, sBytes)
	if err != nil {
		log.Println("fail to pack abi: ", err)
		response.Code = Error
		response.Message = "fail to pack abi"
		c.JSON(http.StatusOK, response)
		return
	}

	gasLimit, err := client.EstimateGas(context.Background(), ethereum.CallMsg{
		From: account,
		To:   &contractAddress,
		Data: data,
	})
	if err != nil {
		log.Println("fail to estimate gas: ", err)
		response.Code = ErrorExceed
		response.Message = "fail to estimate gas"
		c.JSON(http.StatusOK, response)
		return
	}
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Println("fail to suggest GasPrice: ", err)
		response.Code = Error
		response.Message = "fail to suggest GasPrice"
		c.JSON(http.StatusOK, response)
		return
	}
	tx := types.NewTx(&types.LegacyTx{
		Nonce:    nonce,
		GasPrice: gasPrice,
		Gas:      gasLimit,
		To:       &contractAddress,
		Value:    big.NewInt(0),
		Data:     data,
		V:        nil,
		R:        nil,
		S:        nil,
	})

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(big.NewInt(181869)), privateKey)
	if err != nil {
		log.Println("fail to sign tx: ", err)
		response.Code = Error
		response.Message = "fail to sign tx"
		c.JSON(http.StatusOK, response)
		return
	}

	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		log.Println("fail to send tx: ", err)
		response.Code = Error
		response.Message = "fail to send tx"
		c.JSON(http.StatusOK, response)
		return
	}

	s = signedTx.Hash().Hex()
	response.Code = Success
	response.Message = "success"
	c.JSON(http.StatusOK, response)
}

func main() {
	app := gin.Default()
	app.GET("/faucet/api/claim", Claim)
	app.Run(DefaultHttpAddressFaucet)
}
