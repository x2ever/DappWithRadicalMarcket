pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Chap1 {

    address owner;
    uint globalIndex;

    struct Item {
        address owner;
        uint time;
        string name;
        uint idNumber;
        string where;
        uint value;
        bool valid;
    }
    struct Person {
        string name;
        uint idNumber;
        string where;
    }

    mapping(uint => Item) private itemInfo;
    mapping(address => Person) private personInfo;
    mapping(address => bool) private isResisered;

    event resister(address who, Item what);
    event buy_item(address from, address to, uint index);

    constructor() public {
        owner = msg.sender;
        globalIndex = 0;
    }

    function newPerson(string memory name, uint idNumber, string memory where) public{
        // require(msg.sender == owner);  //only Admin can resister. (prevent scam id)
        require(!isResisered[msg.sender]);
        personInfo[msg.sender].name = name;
        personInfo[msg.sender].idNumber = idNumber;
        personInfo[msg.sender].where = where;
        isResisered[msg.sender] = true;
    }
    function renewPerson(string memory name, uint idNumber, string memory where) public{
        // require(msg.sender == owner);  //only Admin can resister. (prevent scam id)
        require(isResisered[msg.sender]);
        personInfo[msg.sender].name = name;
        personInfo[msg.sender].idNumber = idNumber;
        personInfo[msg.sender].where = where;
    }
    function newItem(string memory name, uint value, uint idNumber, string memory where) public {
        // require(msg.sender == owner);  //only Admin can resister. (prevent scam item)
        require(isResisered[msg.sender]);
        itemInfo[globalIndex].name = name;
        itemInfo[globalIndex].owner = msg.sender;
        itemInfo[globalIndex].value = value;
        itemInfo[globalIndex].idNumber = idNumber;
        itemInfo[globalIndex].where = where;
        itemInfo[globalIndex].time = now;
        itemInfo[globalIndex].valid = true;
        emit resister(msg.sender, itemInfo[globalIndex]);
        globalIndex++;
    }
    function renewItem(uint index, string memory name, uint value) public {
        require(isResisered[msg.sender]);
        require(itemInfo[index].valid);
        require(itemInfo[index].owner == msg.sender);
        require(itemInfo[index].time < now-60);
        itemInfo[index].name = name;
        itemInfo[index].value = value;
        itemInfo[index].time = now;
        itemInfo[index].valid = true;
    }
    function buyItem(address from, uint index) public{
        require(isResisered[from]);
        require(isResisered[msg.sender]);
        require(itemInfo[index].valid);
        itemInfo[index].valid = false;
        emit buy_item(from, msg.sender, index);
        // return 등기문서 데이터;


    }
    function viewItemInfo(uint index) public view returns (Item memory){
        return itemInfo[index];
    }
}
