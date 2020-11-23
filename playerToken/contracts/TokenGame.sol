pragma solidity >=0.4.22 <0.7.0;
/**
 *@author Ben Meagher
 *
 *
 */
contract TokenGame{
    //default state is Create
    enum gameState {Create, Waiting, inGame, Over}
    
    //PlayerStruct used for Game struct
    struct Player{
        uint256 Id;
        //cash out address
        address payable wallet;
    }
    
    
    struct Game{
        Player host;
        Player guest;
        uint buyIn;
        gameState state;
    }
 
    //authority on the account
    address public authority;
    address payable serviceFund;
    //flat fee charged off of every 
    uint private serviceFee = 20;
    mapping(address=>bool) authorizedAccounts;
    
    
    uint private numGames;
    
    
    // gameId => Game Struct
    mapping(uint256 => Game) lobbies;
    
    // list of current players
    mapping(uint256=>bool) currentPlayers;
    
    modifier authorize{
        require(
            isAuthorized(msg.sender),
            "Only a authorized account can call this function"
        );
        _;
    }
    
    constructor(address _authority, address payable _serviceFund) public {
        authority = _authority;
        authorizedAccounts[authority] = true;
        serviceFund = _serviceFund;
    }
    
    
    function hostGame(uint256 playerId) public payable{
        //player can only be in one game at a time
        require(!currentPlayers[playerId], "Player must not already be in a lobby.");
        
        //require that the buyIn is at least the serviceFee
        require(msg.value >= serviceFee, "BuyIn not enough!");
        
        //after all requirements
        uint gameId = numGames++;
        uint playerContribution = msg.value;
        
        //create player
        Player memory p1 = Player(playerId, msg.sender);
        //add player id to current currentPlayers
        currentPlayers[playerId] = true;
        
        //create game
        Game storage g = lobbies[gameId];
        g.host = p1;
        g.buyIn = playerContribution;
        g.state = gameState.Waiting;
        
    }
    
    function joinGame(uint256 playerId, uint256 gameId) public payable{
        //player can only be in one game at a time
        require(!currentPlayers[playerId], "Player must not already be in a lobby.");
        //game must not already be over
        require(lobbies[gameId].state == gameState.Waiting, "Game must be in waiting state.");
        //amount must be buyIn
        require(msg.value==lobbies[gameId].buyIn, "Amount must be buyIn Amount!");
        
        //create player
        Player memory p1 = Player(playerId, msg.sender);
        //add player id to current currentPlayers
        currentPlayers[playerId] = true;
        
        
        Game storage g = lobbies[gameId];
        g.guest = p1;
        g.state = gameState.inGame;
    }
    
    //only authorized accounts can call, ends game and pays out winner and serviceFee. Puts game in end state
    function endGame(uint256 winnerId, uint256 gameId) public authorize {
        require(lobbies[gameId].state == gameState.inGame, "Game must be in inGame state.");
        //require winnerId is one of the games Players
        require(lobbies[gameId].host.Id == winnerId || lobbies[gameId].guest.Id == winnerId, "WinnerId must be a player in the game!" );
        Game memory g = lobbies[gameId];
        address payable  winnerAddress;
        
        //winnerId find address
        if(g.host.Id == winnerId){
            winnerAddress = g.host.wallet;
        }
        else{
            winnerAddress = g.guest.wallet;
        }
        //calculate the winner's earnings
        uint winnerCut = (g.buyIn*2) - serviceFee;
        winnerAddress.transfer(winnerCut);
        serviceFund.transfer(serviceFee);
        
        //Set game to over, players to off currentPlayers
        g.state = gameState.Over;
        currentPlayers[g.host.Id] = false;
        currentPlayers[g.guest.Id] = false;
        
    }
    
    //checks if given account is authorized
    function isAuthorized(address check) private view returns(bool){
        return authorizedAccounts[check];
    }
    
    
    
    //authority account can add authority accounts to list
    function addAuthorizeAccount(address _account) public  {
        require(msg.sender == authority, "Must be head authority to call this function");
        //require account is not already authorized
        require(!authorizedAccounts[_account], "Account must not already be authorized");
        
        //add account to authorizedAccounts
        authorizedAccounts[_account] = true;
        
    }
 
 
    
}