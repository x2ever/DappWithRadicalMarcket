var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var privateKey = null;
var myAccount = null;

var Web3 = require('web3');
var web3 = new Web3("ws://localhost:8545");
var contractAddress = "0x6fd391fb2e8f135da6cb6c73e67fa030201b9454";
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
		"constant": true,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "viewPersonInfo",
		"outputs": [
			{
				"components": [
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
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
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
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "buyItem",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
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
				"name": "buyer",
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
var person = [];
var Tempindex = null;

app.locals.items = items;
app.locals.person = person;
app.locals.buyLog = null; 

app.use(logger("dev"));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));


myContract.methods.viewItemInfo(0).call().then(function(result){
    if (result[6] ==  true){
        app.locals.items.push({
            name: result[2],
            price: Number(result[5]),
            id: Number(result[3]),
            address: result[4],
            published: new Date(1000 * Number(result[1]))
        });
    }
});
myContract.methods.viewItemInfo(1).call().then(function(result){
    if (result[6] ==  true){
        app.locals.items.push({
            name: result[2],
            price: Number(result[5]),
            id: Number(result[3]),
            address: result[4],
            published: new Date(1000 * Number(result[1]))
        });
    }
});
myContract.methods.viewItemInfo(2).call().then(function(result){
    if (result[6] ==  true){
        app.locals.items.push({
            name: result[2],
            price: Number(result[5]),
            id: Number(result[3]),
            address: result[4],
            published: new Date(1000 * Number(result[1]))
        });
    }
});
myContract.methods.viewItemInfo(3).call().then(function(result){
    if (result[6] ==  true){
        app.locals.items.push({
            name: result[2],
            price: Number(result[5]),
            id: Number(result[3]),
            address: result[4],
            published: new Date(1000 * Number(result[1]))
        });
    }
});
myContract.methods.viewItemInfo(4).call().then(function(result){
    if (result[6] ==  true){
        app.locals.items.push({
            name: result[2],
            price: Number(result[5]),
            id: Number(result[3]),
            address: result[4],
            published: new Date(1000 * Number(result[1]))
        });
    }
});

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/renew", function(req, res) {
    app.locals.items = [];
    myContract.methods.viewItemInfo(0).call().then(function(result){
        if (result[6] ==  true){
            app.locals.items.push({
                name: result[2],
                price: Number(result[5]),
                id: Number(result[3]),
                address: result[4],
                published: new Date(1000 * Number(result[1])),
                index: 0
            });
        }
    });
    myContract.methods.viewItemInfo(1).call().then(function(result){
        if (result[6] ==  true){
            app.locals.items.push({
                name: result[2],
                price: Number(result[5]),
                id: Number(result[3]),
                address: result[4],
                published: new Date(1000 * Number(result[1])),
                index: 1
            });
        }
    });
    myContract.methods.viewItemInfo(2).call().then(function(result){
        if (result[6] ==  true){
            app.locals.items.push({
                name: result[2],
                price: Number(result[5]),
                id: Number(result[3]),
                address: result[4],
                published: new Date(1000 * Number(result[1])),
                index: 2
            });
        }
    });
    myContract.methods.viewItemInfo(3).call().then(function(result){
        if (result[6] ==  true){
            app.locals.items.push({
                name: result[2],
                price: Number(result[5]),
                id: Number(result[3]),
                address: result[4],
                published: new Date(1000 * Number(result[1])),
                index: 3
            });
        }
    });
    myContract.methods.viewItemInfo(4).call().then(function(result){
        if (result[6] ==  true){
            app.locals.items.push({
                name: result[2],
                price: Number(result[5]),
                id: Number(result[3]),
                address: result[4],
                published: new Date(1000 * Number(result[1])),
                index: 4
            });
        }
        res.redirect("/");
    });
});

app.get("/logout", function(req, res){
    app.locals.person = [];
    privateKey = null;
    res.redirect("/renew");
});

app.post("/buy", function(req, res){
    var tx_builder = myContract.methods.buyItem(Number(req.body.buy));
    var encoded_tx = tx_builder.encodeABI();
    var transactionObject = {
        gas: 3000000,
        data: encoded_tx,
        from: myAccount.address,
        to: contractAddress
    };
    web3.eth.accounts.signTransaction(transactionObject, privateKey, function (error, signedTx) {
        if (error) {
            console.log(error);
        } else {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(function(result){
                myContract.methods.viewPersonInfo(Number(req.body.buy)).call().then(function(result){
                    app.locals.buyLog = {
                        seller: {
                            name: result[0],
                            idNumber: result[1],
                            where: result[2]
                        },
                        buyer: {
                            name: app.locals.person[0].name,
                            idNumber: app.locals.person[0].id,
                            where: app.locals.person[0].address
                        },
                        item: {
                            name: null,
                            price: null,
                            id: null,
                            address: null,
                            published: null
                        }
                    };
                    myContract.methods.viewItemInfo(Number(req.body.buy)).call().then(function(result){
                        app.locals.buyLog.item = {
                            name: result[2],
                            price: Number(result[5]),
                            id: Number(result[3]),
                            address: result[4],
                            published: new Date(1000 * Number(result[1]))
                        };
                        console.log(app.locals.buyLog);
                        res.render("paper");
                    });
                });
            });
        }
    });
});

app.post("/revise", function(req, res){
    Tempindex = req.body.index;
    res.render("renew-item");
});

app.post("/revise/send", function(req, res){
    var tx_builder = myContract.methods.renewItem(Number(Tempindex), req.body.name, Number(req.body.price));
    var encoded_tx = tx_builder.encodeABI();
    var transactionObject = {
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


app.get("/new-item", function(req, res) {
  res.render("new-item");
});

app.post("/new-item", function(req, res) {

    var tx_builder = myContract.methods.newItem(req.body.name, Number(req.body.price), Number(req.body.id), req.body.address);
    var encoded_tx = tx_builder.encodeABI();
    var transactionObject = {
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
