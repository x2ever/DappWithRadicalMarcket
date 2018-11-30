var Web3 = require('web3');
var web3 = new Web3("ws://localhost:8545");

var privateKey = "0xf390a5abbb376b294ea47f0b27ae599e1499b0770484d7c5973121fbc0544772";
var myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
var contractAddress = "0xdc2e5de9b6c7ab859b7a45bae4b098693a2ce8b3"
console.log(myAccount.address, privateKey);
var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "idNumber",
				"type": "uint256"
			},
			{
				"name": "where",
				"type": "string"
			}
		],
		"name": "renewPerson",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "renewItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "value",
				"type": "uint256"
			},
			{
				"name": "idNumber",
				"type": "uint256"
			},
			{
				"name": "where",
				"type": "string"
			}
		],
		"name": "newItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "buyItem",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "idNumber",
				"type": "uint256"
			},
			{
				"name": "where",
				"type": "string"
			}
		],
		"name": "newPerson",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "viewItemInfo",
		"outputs": [
			{
				"components": [
					{
						"name": "owner",
						"type": "address"
					},
					{
						"name": "time",
						"type": "uint256"
					},
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "idNumber",
						"type": "uint256"
					},
					{
						"name": "where",
						"type": "string"
					},
					{
						"name": "value",
						"type": "uint256"
					},
					{
						"name": "valid",
						"type": "bool"
					}
				],
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "who",
				"type": "address"
			},
			{
				"components": [
					{
						"name": "owner",
						"type": "address"
					},
					{
						"name": "time",
						"type": "uint256"
					},
					{
						"name": "name",
						"type": "string"
					},
					{
						"name": "idNumber",
						"type": "uint256"
					},
					{
						"name": "where",
						"type": "string"
					},
					{
						"name": "value",
						"type": "uint256"
					},
					{
						"name": "valid",
						"type": "bool"
					}
				],
				"indexed": false,
				"name": "what",
				"type": "tuple"
			}
		],
		"name": "resister",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "buy_item",
		"type": "event"
	}
];
var myContract = new web3.eth.Contract(abi, contractAddress);
/*
let tx_builder = myContract.methods.newPerson("Bob", 950928, "경기도 안양시");
let encoded_tx = tx_builder.encodeABI();
let transactionObject = {
    gas: 3000000,
    data: encoded_tx,
    from: myAccount.address,
    to: contractAddress
};
web3.eth.accounts.signTransaction(transactionObject, privateKey, function (error, signedTx) {
    if (error) {
        console.log(error);
    } else {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', function (receipt) {
            console.log(receipt);
        });
    }
});
*/
var a = 123;
myContract.methods.viewItemInfo(0).call().then(function(result){
    console.log(result);
    if (result[6] ==  true){
        a = {
            "name": result[2],
            "price": Number(result[5]),
            "id": Number(result[3]),
            "address": result[4],
            "published": new Date(1000 * Number(result[1]))
        };
        console.log(a);
    }
})