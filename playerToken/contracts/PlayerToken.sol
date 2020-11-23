pragma solidity >=0.4.22 <0.7.0;

import "./ERC721Full.sol";

contract PlayerToken is ERC721Full {
    
    struct Listing{
        uint price;
        address payable lister;
        uint256 tokenId;
        uint256 tokenIndex;
    }
    
    
    //head authority, only account that can add authorized accounts
    address private authority;
    //only authorized accounts can change token variables
    mapping(address => bool) authorizedAccounts;
    
    mapping(uint256 => bool) tokensForSale;
    mapping(uint256 => Listing) tokenListing;
    uint256[] private tokensListed;

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

        // new method to mint
        _mint(_to, _tokenId);
        changeStats(_tokenId, stats);

        //call ERC721 mint function to mint a new token
//        _mintWithStats(_to, _tokenId, stats);

        //set the newly minted token's URI to passed URI
        _setTokenURI(_tokenId, _tokenURI);
        return true;
    }

    //Change the stats of a given token, must be authorized account
    function changeStats(uint256 tokenId, uint8[3] memory stats) public authorize {
        //dont really need this unless we do something before calling this
        _changeStats(tokenId, stats);
    }

    // Returns a list of tokenIDs owned by owner
    function tokensOfOwner(address owner) public view authorize returns (uint256[] memory) {
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
    
    //Call when listing wants to be added to the marketplace
    function addListing(address payable lister, uint256 tokenId, uint amount) public authorize {
         require(lister != address(0), "Account Error: Attempted to create listing for invalid account");
         require(ownerOf(tokenId) == lister, "Lister must own Token");
         require(!tokensForSale[tokenId], "Token must not already be listed.");

        
         
         tokensForSale[tokenId] = true;
         
        
        tokensListed.add(tokenId);
        //keep track of token's position in tokensListed for removal. 
        uint256 tokenIndex = tokensListed.length() - 1;
        
         Listing storage tempListing = (amount, lister, tokenId, tokenIndex);
         
        tokenListing[tokenId] = tempListing;
         
    }

    //
    function purchaseToken(address buyer, uint256 tokenId)public payable{
    
        require(tokensForSale[tokenId], "Token must already be listed.");
        
        Listing storage currentListing = tokenListing[tokenId];
        require(currentListing.price == msg.value, "Must pay the full listing amount");
        require(currentListing.lister != buyer, "Lister cannot buy own listing");
        
        //transferToken to buyer;
        safeTransferFrom(currentListing.lister, buyer, tokenId);
        
        //remove token From sale
        tokensForSale[tokenId] = false;
        
        //remove listing from  tokensListed, delete, move last element to gap, change movedListings index
        uint256 index = currentListing.tokenIndex;
        
        delete tokensListed(index);
        uint256 tokenMovedFromEnd = tokensListed.pop();
        tokensListed[index] = tokenMovedFromEnd;
        Listing memory listingMovedFromEnd = tokenListing[tokenMovedFromEnd];
        listingMovedFromEnd.tokenIndex = index;
        
        
        //pay out the price of the sale to the lister
        currentListing.lister.transfer(currentListing.amount);
        
        
    }
    
    
    //Retrieves listing information for given tokenId
    function getListing(uint256 tokenId) public view returns (Listing memory){
        require(tokensForSale[tokenId], "Token must already be listed.");
        
        return(tokenListing[tokenId]);
    }
    //Retrieves all tokens listed
    function getTokensListed() public view authorize returns (uint256[] memory){
        return(tokensListed);
    }

}
