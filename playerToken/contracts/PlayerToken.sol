pragma solidity >=0.4.22 <0.7.0;

import "./ERC721Full.sol";

contract PlayerToken is ERC721Full {

    //head authority, only account that can add authorized accounts
    address private authority;
    //only authorized accounts can change token variables
    mapping(address => bool) authorizedAccounts;

    uint public tokenCount;

    constructor(address _authority) ERC721Full("PlayerToken", "PTOKEN") public {
        authority = _authority;
        authorizedAccounts[_authority] = true;
        tokenCount = 0;
    }

    modifier authorize{
        require(
            isAuthorized(msg.sender),
            "Only a authorized account can call this function"
        );
        _;
    }

//    function test(address owner) public pure returns (uint) {
//        return 5;
//    }

    //create new PlayerTokens
    function mint(address _to, string memory _tokenURI, uint8[3] memory stats) public authorize returns (bool){
        //id is the number of token (mint number)
        uint256 _tokenId = totalSupply().add(1);

        //call ERC721 mint function to mint a new token
        _mintWithStats(_to, _tokenId, stats);

        //set the newly minted token's URI to passed URI
//        _setTokenURI(_tokenId, _tokenURI);
        tokenCount++;
        return true;
    }

    //Change the stats of a given token, must be authorized account
    function changeStats(uint256 tokenId, uint8[3] memory stats) public authorize {

        //dont really need this unless we do something before calling this

        _changeStats(tokenId, stats);
    }

    // Returns a list of tokenIDs owned by owner
    function tokensOf(address owner) public authorize returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

    //checks if given account is authorized
    function isAuthorized(address check) private view returns (bool){
        return authorizedAccounts[check];
    }

    //add authorized accounts
    function addAuthorizeAccount(address _account) public {
        require(msg.sender == authority, "Must be head authority to call this function");
        //require account is not already authorized
        require(!authorizedAccounts[_account], "Account must not already be authorized");

        //add account to authorizedAccounts
        authorizedAccounts[_account] = true;

    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

}
