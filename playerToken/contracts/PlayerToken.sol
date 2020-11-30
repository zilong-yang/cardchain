pragma solidity >=0.4.22 <0.7.0;

import "./ERC721Full.sol";

contract PlayerToken is ERC721Full {
    
    struct Listing{
        uint256 id;
        uint price;
        address payable lister;
        uint256 tokenId;
        //uint256 tokenIndex;
    }

    //head authority, only account that can add authorized accounts
    address private authority;
    //only authorized accounts can change token variables
    mapping(address => bool) authorizedAccounts;
    
    //tokenId => isListed
    mapping(uint256 => bool) listedTokens;
    
    //listingId => listing Struct
    mapping(uint256 => Listing) listings;
    //ListingId => isListed
    mapping(uint256 => bool) currentListings;
    //array of lisitng's ids. Has removed listing Ids too. 
    uint256[] private listingIds;
    
    uint256 private listingIdCounter;

    constructor(address _authority) ERC721Full("PlayerToken", "PTOKEN") public {
        authority = _authority;
        authorizedAccounts[_authority] = true;
        listingIdCounter = 0;
    }
    
    //creates new listing and adds it to list. 
    function addListing(uint256 tokenId, uint amount) public {
         require(msg.sender != address(0), "Account Error: Attempted to create listing for invalid account");
         require(amount > 0, "Amount must be greater than 0");
         require(ownerOf(tokenId) == msg.sender, "Lister must own Token");
         require(!listedTokens[tokenId], "Token must not already be listed.");
         

        
         
         listedTokens[tokenId] = true;
        
        //Increment and set unique listing id (There is a better way to do this with enumeruable interface I believe) 
        listingIdCounter = listingIdCounter + 1;
        uint256 id = listingIdCounter;
        
        
        Listing memory newListing = Listing(id, amount, msg.sender, tokenId);
        listingIds.push(id); 
        currentListings[id] = true;
        
        listings[id] = newListing;
        
        //set contract to authrized account for given token 
        //This is so contract can authrize transfer of token. 
        setApprovalForAll(address(this), true);
    
    }
    
    
    //Returns given ListingId listing
    //returns integer array of structure (listingId, tokenId, price, (stats))
    //stats are in same order as with previous implementations
    function getListingData(uint256 listingId) public view authorize returns (uint[] memory){
        require(currentListings[listingId], "Listing is not currently active");
        Listing storage tempListing = listings[listingId];
        uint[] memory returnList = new uint[](6);
        returnList[0] = tempListing.id;
        returnList[1] = tempListing.tokenId;
        returnList[2] = tempListing.price;
        uint8[] memory stats = _getStats(tempListing.tokenId);
        returnList[3] = stats[0];
        returnList[4] = stats[1];
        returnList[5] = stats[2];
        
        return returnList;

    }
    
    //reutns list of current Listing Ids
    //This is inefficent. It returns the whole history of listings, both active and inactive. In the DApp, it relies on getListingData to throw and error when it detects the listing is not active. 
    //
    function getCurrentListingIds() public view authorize returns (uint256[] memory){
        return listingIds;
    }
    
    function purchaseToken(uint256 listingId) public payable {
        require(currentListings[listingId], "Listing must be currently listed");
        
        Listing storage tempListing = listings[listingId];
        require(tempListing.price == msg.value, "Must pay the full listing amount");
        require(msg.sender != tempListing.lister, "Lister cannot buy own listing");
        //require(getApproved(tempListing.tokenId)==address(this), "Contract must  be approved account on Token for Transfer");
        
        //UNSAFE, Should have all transfer methods in seperate contract, then call that from this contract
        //Needed to change so that it does not check for msg.sender to be the token owner or approved because the buyer is not approved or owner. 
        transferFromNoRequirement(tempListing.lister, msg.sender, tempListing.tokenId);
        tempListing.lister.transfer(tempListing.price);
        
        //Remove listing from current listings
        listedTokens[tempListing.tokenId] = false;
        currentListings[listingId] = false;
        
        //Where I should be removing the listing Id from listingIds.
        
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

}