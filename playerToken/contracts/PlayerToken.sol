pragma solidity >=0.4.22 <0.7.0;

import "./ERC721Full.sol";

contract PlayerToken is ERC721Full {
    
    
    //head authority, only account that can add authroized accounts
    address private authority;
    //only authorized accounts can change token variables
    mapping(address=>bool) authorizedAccounts;
    
    
    
    
    constructor(address _authority) ERC721Full("PlayerToken", "PTOKEN") public {
        authority = _authority;
        authorizedAccounts[_authority] = true;
    }
    
    modifier authorize{
        require(
            isAuthorized(msg.sender),
            "Only a authorized account can call this function"
            );
            _;
    }
    
    
    //create new PlayerTokens
    function mint(address _to, string memory _tokenURI, uint8[3] memory stats) public authorize returns (bool){
        //id is the number of token (mint number)
        uint256 _tokenId = totalSupply().add(1);
        
        //call ERC721 mint function to mint a new token
        _mintWithStats(_to, _tokenId, stats);
        
        //set the newly minted token's URI to passed URI
        _setTokenURI(_tokenId, _tokenURI);
        return true;
        
    }
    
    //Change the stats of a given token, must be authroized account
    function changeStats(uint256 tokenId, uint8[3] memory stats) public authorize {
       
       //dont really need this unless we do somthing before calling this
       
       _changeStats(tokenId, stats);
    }
    
    
    //checks if given account is authorized
    function isAuthorized(address check) private view returns(bool){
        return authorizedAccounts[check];
    }
    
    
    
    //add authrized accounts
    function addAuthorizeAccount(address _account) public  {
        require(msg.sender == authority, "Must be head authority to call this function");
        //require account is not already authroized
        require(!authorizedAccounts[_account], "Account must not already be authorized");
        
        //add account to authorizedAccounts
        authorizedAccounts[_account] = true;
        
    }
    
    
}
