pragma solidity >=0.4.22 <0.7.0;

import "./ERC721Full.sol";

contract PlayerToken is ERC721Full {

    struct Listing {
        uint256 id;
        uint price;
        address payable lister;
        uint256 tokenId;
        //uint256 tokenIndex;
        bool sold;
    }

    //head authority, only account that can add authorized accounts
    address private authority;

    //only authorized accounts can change token variables
    mapping(address => bool) authorizedAccounts;

    // the last token's ID on the blockchain; should never be decremented
    uint256 private lastTokenId;

    //tokenId => isListed
    mapping(uint256 => bool) listedTokens;

    //listingId => listing Struct
    mapping(uint256 => Listing) listings;

    //ListingId => isListed
    mapping(uint256 => bool) currentListings;

    //array of listing's ids. Has removed listing Ids too.
    uint256[] private listingIds;

    // current number of listings
    uint256 private listingIdCounter;

    constructor(address _authority) ERC721Full("PlayerToken", "PTOKEN") public {
        authority = _authority;
        authorizedAccounts[_authority] = true;
        lastTokenId = 0;
        listingIdCounter = 0;
    }

    //creates new listing and adds it to list. 
    function addListing(uint256 tokenId, uint amount) public {
        require(msg.sender != address(0), "Account Error: Attempted to create listing for invalid account");
        require(amount > 0, "Amount must be greater than 0");
        require(ownerOf(tokenId) == msg.sender, "Lister must own Token");
        require(!listedTokens[tokenId], "Token must not already be listed.");

        listedTokens[tokenId] = true;

        //Increment and set unique listing id (There is a better way to do this with enumerable interface I believe)
        listingIdCounter = listingIdCounter + 1;
        uint256 id = listingIdCounter;

        Listing memory newListing = Listing(id, amount, msg.sender, tokenId, false);
        listingIds.push(id);
        currentListings[id] = true;

        listings[id] = newListing;

        //set contract to authorized account for given token
        //This is so contract can authorize transfer of token.
        setApprovalForAll(address(this), true);

    }


    //Returns given ListingId listing
    //returns integer array of structure (listingId, tokenId, price, (stats))
    //stats are in same order as with previous implementations
    function getListingData(uint256 listingId) public view authorize returns (uint, uint, uint, bool, uint, uint, uint){
        //        require(currentListings[listingId], "Listing is not currently active");
        Listing storage listing = listings[listingId];
        //        uint[] memory returnList = new uint[](6);
        //        returnList[0] = tempListing.id;
        //        returnList[1] = tempListing.tokenId;
        //        returnList[2] = tempListing.price;
        uint8[] memory stats = _getStats(listing.tokenId);
        //        returnList[3] = stats[0];
        //        returnList[4] = stats[1];
        //        returnList[5] = stats[2];

        return (listing.id, listing.price, listing.tokenId, listing.sold, stats[0], stats[1], stats[2]);

    }

    // returns list of current Listing Ids
    // This is inefficient. It returns the whole history of listings, both active and inactive. In the DApp, it
    // relies on getListingData to throw and error when it detects the listing is not active.
    function getCurrentListingIds() public view authorize returns (uint256[] memory){
        return listingIds;
    }

    function purchaseToken(uint256 listingId) public payable {
        require(currentListings[listingId], "Listing must be currently listed");

        Listing storage listing = listings[listingId];
        require(listing.price <= msg.value, "Must pay the full listing amount");
        require(msg.sender != listing.lister, "Lister cannot buy own listing");
        //require(getApproved(tempListing.tokenId)==address(this), "Contract must  be approved account on Token for Transfer");

        //UNSAFE, Should have all transfer methods in separate contract, then call that from this contract
        //Needed to change so that it does not check for msg.sender to be the token owner or approved because the buyer is not approved or owner. 
        transferFromNoRequirement(listing.lister, msg.sender, listing.tokenId);
        listing.lister.transfer(listing.price);

        //Remove listing from current listings
        listedTokens[listing.tokenId] = false;
        currentListings[listingId] = false;
        listing.sold = true;
        listingIdCounter--;
    }

    function isListed(uint256 tokenId) public view returns (bool) {
        return listedTokens[tokenId];
    }

    modifier authorize{
        require(
            isAuthorized(msg.sender),
            "Only an authorized account can call this function"
        );
        _;
    }

    //create new PlayerTokens
    function mint(address _to, uint8[3] memory stats) public authorize returns (uint256) {
        // increment the current ID
        lastTokenId++;

        //call IERC721Enumerable mint function to mint a new token
        _mintWithStats(_to, lastTokenId, stats);

        return lastTokenId;
    }

    function burn(uint256 tokenId) public {
        // call _burn in ERC721Enumerable
        _burn(msg.sender, tokenId);
    }

    //Change the stats of a given token, must be authorized account
    function changeStats(uint256 tokenId, uint8[3] memory stats) internal authorize {
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