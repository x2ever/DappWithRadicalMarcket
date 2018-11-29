var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var privateKey = null;
var myAccount = null;

var Web3 = require('web3');
var web3 = new Web3("ws://localhost:8545");
var contractAddress = "0x6fd391fb2e8f135da6cb6c73e67fa030201b9454"
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

var app = express();

var items = [];
var person = null;

app.locals.items = items;
app.locals.person = person;

app.use(logger("dev"));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/renew", function(req, res) {
    function renew(){
        myContract.methods.viewItemInfo(a).call().then(function(result){
            result[0];
        })
    }
    
  res.redirect("/");
});

app.get("/new-item", function(req, res) {
  res.render("new-item");
});

app.post("/new-item", function(req, res) {
    // newItem .then
    app.locals.items.push({
        name: req.body.name,
        price: req.body.price,
        id: req.body.id,
        address: req.body.address,
        published: new Date()
    });
    let tx_builder = myContract.methods.newItem(req.body.name, Number(req.body.price), Number(req.body.id), req.body.address);
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

  res.redirect("/renew");
});

app.get("/new-person", function(req, res) {
  res.render("new-person");
});

app.post("/new-person", function(req, res) {
  app.locals.person = [{
    name: req.body.name,
    id: req.body.id,
    private: req.body.private,
    address: req.body.address
  }];
    privateKey = req.body.private;
    myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    
    let tx_builder = myContract.methods.newPerson(req.body.name, Number(req.body.id), req.body.address);
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

  res.redirect("/renew");
});

app.use(function(req, res) {
  res.status(404).render("404");
});

http.createServer(app).listen(3000, function() {
  console.log("Decentralized app started.");
});
