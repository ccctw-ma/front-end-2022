

var gameState = "setup"
var turnCounter = 1
var tiles = new Array(100)
var player = null
var objectCounters = {
    asteroidsCounter: 0,
    inactiveMinesCounter: 0,
    activeMinesCounter: 0,
    roboticSpaceshipsCounter: 0,
    playerSpaceshipsCounter: 0
}
var playersTurn = true

// instructions
var setupInstructions = "<p>To place an asteroid select a cell and press 'a'" +
    "<br><br>To place a mine select a cell and press 'm'" +
    "<br><br>To place a robotic spaceship select a cell and press 'r'" +
    "<br><br>To place a user's spaceship select a cell and press 'u'" +
    "<br><br>To delete an object press 'delete'</p>"

var playInstructions = "<p> To move one cell up press 'w'"+
    "<br><br>To move one cell to the left press 'a'" +
    "<br><br>To move one cell down press 's'" +
    "<br><br>To move one cell to the right press 'd'</p>"

// prints setup and play instructions in the instructions div on the webpage
function printInstructions(gameState) {
    if(gameState == "setup") {
        document.getElementById("instructions").innerHTML = setupInstructions
    }
    else if(gameState == "play") {
        document.getElementById("instructions").innerHTML = playInstructions
    }
}

function refreshRightPanelInfo(gameState) {
    if(gameState == "setup") {
        setupInfo = "<p>Asteroids: " + 
            objectCounters.asteroidsCounter
            + "<br><br>Mines: " + 
            objectCounters.inactiveMinesCounter
            + "<br><br>Robotic Spaceships: " + 
            objectCounters.roboticSpaceshipsCounter + "</p>"
    }
    else if(gameState = "play") {
        setupInfo = "<p>Turn: " + turnCounter 
        + "<br><br> Inactive Mines: " + 
        objectCounters.inactiveMinesCounter
        + "<br><br>Robotic Spaceships: " + 
        objectCounters.roboticSpaceshipsCounter + "</p>"
    }
    document.getElementById("info").innerHTML = setupInfo
}

// sets text on the button depending on the gameState
function setButton() {
    if(gameState == "setup") {
        document.getElementById("endButton").innerHTML = "End Setup"
    }
    else if(gameState == "play") {
        document.getElementById("endButton").innerHTML = "End Game"
    }    
    else if(gameState = "end") {
        document.getElementById("endButton").innerHTML = "Play Again"
    }
}

function buttonClick() {
    if(gameState == "setup") {
        if(objectCounters.playerSpaceshipsCounter != 1) {
            printNoPlayerErrorMessage()
        }
        else {
            clearErrorMessage()
            gameState = "play"
            play()
        }
    }
    else if(gameState == "play") {
        gameState = "end"
        goToYouStopped()
    }
    else if(gameState == "end") {
        location.reload()
    }
}

// adds gridCells to grid in html
function printGrid() {
    var gridDivContent = ""
    
    for(i = 0; i < 100; i++) {
        var cellId = "c" + i
        gridDivContent += "<div class='gridCell' id='" + cellId +"'></div>"

        if((i + 1) % 10 == 0) {
            gridDivContent += '<div style="clear:both;"></div>'
        }
    }

    document.getElementById("grid").innerHTML = gridDivContent
}

class Tile {
    constructor(tileId) {
        this.tileId = tileId
        this.tileDiv = document.getElementById("c" + i)
        this.isOccupied = false
        this.isSelected = false
        this.objectOnTile = null
        this.playerOnTile = null
        // if there is an active mine in tile's surroundings
        this.isMined = false
        // checks if the tile was already used in a for loop
        this.checked = false
    }
}

// tile that is currently selected, the same for all Tile objects
Tile.selectedTile = null

class RoboticSpaceship {
    constructor(position) {
        this.position = position
        this.offsets = [-11, -10, -9, -1, 1, 9, 10, 11]
    }

    // calculating legal moves for the robotic spaceship
    calculateLegalMoves() {
        var legalMoves = []
        for (i = 0; i < this.offsets.length; i++) {
            let candidateDestinationCoordinate = this.position + this.offsets[i]
            // if destination is valid and the tile is not occupied by
            // an asteroid or a robotic spaceship 
            if (isValidCoordinate(candidateDestinationCoordinate) && ( 
                !(tiles[candidateDestinationCoordinate].objectOnTile 
                instanceof Asteroid) && 
                !(tiles[candidateDestinationCoordinate].objectOnTile
                instanceof RoboticSpaceship))) {
                if (isFirstColumnException(this.position) && 
                    (this.offsets[i] == -11 || this.offsets[i] == -1 ||
                    this.offsets[i] == 9)) {
                    continue
                }
                else if (isTenthColumnException(this.position) &&
                    (this.offsets[i] == -9 || this.offsets[i] == 1 ||
                    this.offsets[i] == 11)) {
                    continue
                }
                else {
                    legalMoves.push(candidateDestinationCoordinate)
                }
            }
        }
        return legalMoves
    }
}

class PlayerSpaceship {
    constructor(position) {
        this.position = position
        // coordinates of legal moves for the player 
        // for example if the position is 20 legal moves are 10, 19, 21 and 30
        this.offsets = [-10, -1, 1, 10]
    }

    // calculating legal moves for the player's spaceship
    calculateLegalMoves() {
        var legalMoves = []
        for (i = 0; i < this.offsets.length; i++) {
            let candidateDestinationCoordinate = this.position + this.offsets[i]
            // if destination is valid and the tile is not occupied by
            // an asteroid or a robotic spaceship 
            if (isValidCoordinate(candidateDestinationCoordinate) && ( 
                !(tiles[candidateDestinationCoordinate].objectOnTile 
                instanceof Asteroid) && 
                !(tiles[candidateDestinationCoordinate].objectOnTile
                instanceof RoboticSpaceship))) {
                if (isFirstColumnException(this.position) && 
                    this.offsets[i] == -1) {
                    continue
                }
                else if (isTenthColumnException(this.position) &&
                    this.offsets[i] == 1) {
                    continue
                }
                else {
                    legalMoves.push(candidateDestinationCoordinate)
                }
            }
        }
        return legalMoves
    }
}

class Asteroid {
    constructor(position) {
        this.position = position
    }
}

class Mine {
    constructor(position) {
        this.position = position
        this.isActive = false
    }
}

// helper methods for calculating spaceships legal moves
function isValidCoordinate(position) {
    return (position >= 0 && position < 100)
}

function isFirstColumnException(position) {
     return (position % 10 == 0)
}

function isTenthColumnException(position) {
    return ((position + 1) % 10 == 0)
}

// creates array of tiles
function createTiles() {
    for(i = 0; i < 100; i++) {
        tile = new Tile(i)
        tiles[i] = tile
    }
}

// adds event listeners to the tiles
function gridAddEventListeners(){
    tiles.forEach(tile => {
        tile.tileDiv.addEventListener("click", 
            function() { tileClicked(tile.tileId) })
    });
}

// when the tile is clicked...
// changes highlighting and the current selectedTile
function tileClicked(tileId) {
    tile = tiles[tileId]

    // there is no  selected tile
    if(Tile.selectedTile == null) {
        Tile.selectedTile = tile
        tile.isSelected = true
        tile.tileDiv.style.border = "3px solid white"
    }
    // other tile is selected
    else if(Tile.selectedTile != tile) {
        Tile.selectedTile.isSelected = false
        Tile.selectedTile.tileDiv.style.border = "3px solid #777777"
        Tile.selectedTile = tile
        tile.isSelected = true
        tile.tileDiv.style.border = "3px solid white"
        // tile.tileDiv.innerText = "HI"
    }
    // the same tile has been selected
    else if(tile.isSelected) {
        Tile.selectedTile = null
        tile.tileDiv.style.border = "3px solid #777777"
    }
}

// handling keyboard events
function handleKeyboardEvents(event) {

    if(gameState == "setup" && Tile.selectedTile != null) {
        clearErrorMessage()
        if(event.key == 'a') {
            putObjectInCell('a')
        }
        else if(event.key == 'm') {
            putObjectInCell('m')
        }
        else if(event.key == 'r') {
            putObjectInCell('r')
        }
        else if(event.key == 'u') {
            putObjectInCell('u')
        }
        else if(event.keyCode == 46) {
            deleteObjectFromCell()
        }
        else {
            printSetupWrongKeyErrorMessage()
        }
    }
    if(gameState == "play" && playersTurn) {
        clearErrorMessage()
        if(event.key == 'w') {
            playerMove("w")
        }
        else if(event.key == 'a') {
            playerMove("a")
        }
        else if(event.key == 's') {
            playerMove("s")        
        }
        else if(event.key == 'd') {
            playerMove("d")
        }
        else {
            printPlayWrongKeyErrorMessage()
        }
    }
}

// changing inner text of a cell depending on the key pressed
function putObjectInCell(char) {
    tile = Tile.selectedTile

    if(tile.isOccupied) {
        deleteObjectFromCell()
    }
    
    if(char == 'a') {
        tile.tileDiv.innerText = "A"
        objectCounters.asteroidsCounter++
        tile.isOccupied = true
    }
    else if(char == 'm') {
        tile.tileDiv.innerText = "M"
        objectCounters.inactiveMinesCounter++
        tile.isOccupied = true
    }
    else if(char == 'r') {
        tile.tileDiv.innerText = "R"
        objectCounters.roboticSpaceshipsCounter++
        tile.isOccupied = true
    }
    else if(char == 'u' && objectCounters.playerSpaceshipsCounter == 0) {
        tile.tileDiv.innerText = "U"
        objectCounters.playerSpaceshipsCounter++
        tile.isOccupied = true
    }
    refreshRightPanelInfo("setup")
}

// deleting text representing object from a cell 
function deleteObjectFromCell() {
    tile = Tile.selectedTile
    currentObject = tile.tileDiv.innerText

    if(currentObject == "A") {
        objectCounters.asteroidsCounter--
        tile.tileDiv.innerText = ""
        tile.isOccupied = false
    }
    else if(currentObject == "M") {
        objectCounters.inactiveMinesCounter--
        tile.tileDiv.innerText = ""
        tile.isOccupied = false
    }
    else if(currentObject == "R") {
        objectCounters.roboticSpaceshipsCounter--
        tile.tileDiv.innerText = ""
        tile.isOccupied = false
    }
    else if(currentObject == "U") {
        objectCounters.playerSpaceshipsCounter--
        tile.tileDiv.innerText = ""
        tile.isOccupied = false
    }
    refreshRightPanelInfo("setup")
}

// error messages
function printSetupWrongKeyErrorMessage() {
    document.getElementById("error_messages").innerHTML = 
        "You pressed the wrong key. Press a m r u or delete"
}

function printPlayWrongKeyErrorMessage() {
    document.getElementById("error_messages").innerHTML = 
        "You pressed the wrong key. Press w a s or d"
}

function printNoPlayerErrorMessage() {
    document.getElementById("error_messages").innerHTML = 
        "You must put the player's spaceship on the grid to play!"
}

// clearing error messages panel
function clearErrorMessage() {
    document.getElementById("error_messages").innerHTML = ""
}

// checks if the numbers of objects make sense
function checkNumbers() {
    if(objectCounters.roboticSpaceshipsCounter == 0) {
        goToYouWon()
    } 
    else if(objectCounters.inactiveMinesCounter == 0) {
        goToYouLost()
    }
}

// transitions to different end state screens
function goToYouWon() {
    gameState = "end"
    document.getElementById("grid").innerHTML = "YOU WON"
    setButton("end")
}

function goToYouLost() {
    gameState = "end"
    document.getElementById("grid").innerHTML = "YOU LOST"
    setButton("end")
}

function goToDraw() {
    gameState = "end"
    document.getElementById("grid").innerHTML = "DRAW"
    setButton("end")
}

function goToYouStopped() {
    document.getElementById("grid").innerHTML = "YOU STOPPED THE GAME"
    setButton("end")
}

// creating objects in place of text on the grid
function createObjects() {
    for(let i = 0; i < 100; i++) {
        tile = tiles[i]
        content = tile.tileDiv.innerText
        if(content != "") {
            if(content == "A") {
                tile.objectOnTile = new Asteroid(i)
            }
            else if(content == "M") {
                tile.objectOnTile = new Mine(i)
            }
            else if(content == "R") {
                tile.objectOnTile = new RoboticSpaceship(i)
            }
            else if(content == "U") {
                tile.playerOnTile = new PlayerSpaceship(i)
                player = tile.playerOnTile
            }
        }
    }
}

// starts play state
function play() {
    preparePlay()
}

// prepares play state
function preparePlay() {
    printInstructions("play")
    refreshRightPanelInfo("play")
    checkNumbers()
    setButton()
    createObjects()
}

// computer tries to make a move
function computerMove() {
    for(let i = 0; i < 100; i++) {
        if(tiles[i].objectOnTile instanceof RoboticSpaceship 
            && !tiles[i].checked) {
            roboticSpaceship = tiles[i].objectOnTile
            legalMoves = roboticSpaceship.calculateLegalMoves()
            console.log(legalMoves)
            // if the computer can destroy player's spaceship
            if(legalMoves.includes(player.position)) {
                console.log("yes")
                changeComputerPosition(roboticSpaceship.position, 
                    player.position)
                tiles[player.position].checked = true
            }
            else {
                moveMade = false
                // if there are any inactive mines around 
                for(let i = 0; i < legalMoves.length; i++) {
                    if(tiles[legalMoves[i]].objectOnTile instanceof Mine && 
                        !tiles[legalMoves[i]].objectOnTile.isActive && 
                        !moveMade) {
                        changeComputerPosition(roboticSpaceship.position, 
                            legalMoves[i])
                            moveMade = true
                            tiles[legalMoves[i]].checked = true
                    } 
                }
                // choose a random move from legal moves
                if(!moveMade) {
                    move = legalMoves[Math.floor(Math.random() * 
                        legalMoves.length)]
                    changeComputerPosition(roboticSpaceship.position, move)
                    tiles[move].checked = true
                }
            }
        }
    }
    // clear checked values for new move
    for(let i = 0; i < 100; i++) {
        tiles[i].checked = false
    }
}

// changing postion of a robotic spaceship
function changeComputerPosition(position, destination) {
    tile = tiles[position]
    roboticSpaceship = tile.objectOnTile
    newTile = tiles[destination]

    // if the destination tile is the player
    if(newTile.playerOnTile != null) {
        newTile.playerOnTile = null
        newTile.objectOnTile = roboticSpaceship
        tile.objectOnTile = null
        roboticSpaceship.postion = destination
        tile.tileDiv.innerText = ""
        newTile.tileDiv.innerText = "R"
        if(newTile.isMined) {
            destroyRoboticSpaceship(roboticSpaceship)
            if(objectCounters.roboticSpaceshipsCounter > 0) {
                goToYouLost()
            }
            else {
                goToDraw()
            }
        }
        else {
            goToYouLost()
        }
    }
    else {
        // we know the mine is inactive because if it was active the spaceship
        // would be able to step on cell surrounding it
        if(newTile.objectOnTile instanceof Mine) {
            objectCounters.inactiveMinesCounter--
            checkNumbers()
        }
        newTile.objectOnTile = roboticSpaceship
        tile.objectOnTile = null
        roboticSpaceship.position = destination
        tile.tileDiv.innerText = ""
        newTile.tileDiv.innerText = "R"
        if(newTile.isMined) {
            destroyRoboticSpaceship(roboticSpaceship)
            if(objectCounters.roboticSpaceshipsCounter <= 0) {
                goToYouWon()
            }
        }
    }   
}

// destroys spaceship if it steps on a mined field
function destroyRoboticSpaceship(roboticSpaceship) {
    tiles[roboticSpaceship.position].tileDiv.innerText = ""
    tiles[roboticSpaceship.position].isOccupied = false
    tiles[roboticSpaceship.position].objectOnTile = null
    objectCounters.roboticSpaceshipsCounter--
    refreshRightPanelInfo("play")
}

// player makes a move depending on keyboard input
function playerMove(direction) {
    legalMoves = player.calculateLegalMoves()

    if(direction == "w" && legalMoves.includes(player.position - 10)) {
        changePlayersPosition(player.position, player.position - 10)
        playersTurn = false
        setTimeout(function() { playTurns() }, 750);
    }
    else if(direction == "a" && legalMoves.includes(player.position - 1)) {
        changePlayersPosition(player.position, player.position - 1)
        playersTurn = false
        setTimeout(function() { playTurns() }, 750);
    }
    else if(direction == "s" && legalMoves.includes(player.position + 10)) {
        changePlayersPosition(player.position, player.position + 10)
        playersTurn = false
        setTimeout(function() { playTurns() }, 750);
    }
    else if(direction == "d" && legalMoves.includes(player.position + 1)) {
        changePlayersPosition(player.position, player.position + 1)
        playersTurn = false
        setTimeout(function() { playTurns() }, 750);
    }
}

// changing players position
function changePlayersPosition(position, destination) {
    tile = tiles[position]
    newTile = tiles[destination]

    newTile.playerOnTile = player
    player.position = destination
    
    if(tile.objectOnTile == null) {
        tile.isOccupied = false
        tile.tileDiv.innerText = ""
    }
    else if(tile.objectOnTile instanceof Mine) {
        tile.tileDiv.innerText = "M"
    }
    
    if(newTile.objectOnTile instanceof Mine) {
        console.log("stepped on mine")
        console.log(newTile.objectOnTile)
        activateMine(newTile.objectOnTile)
    }
    newTile.tileDiv.innerText = "U"
    
    tile.playerOnTile = null
}

// activating mine if the player has stepped on it
function activateMine(mine) {
    tiles[mine.position].isMined = true
    tiles[mine.position].tileDiv.style = "border: 3px solid red"
    surroundings = [-11, -10, -9, -1, 1, 9, 10, 11]
    for(let i = 0; i < surroundings.length; i++) {
        offset = surroundings[i]
        if(isValidCoordinate(mine.position + offset)) {
            if (isFirstColumnException(mine.position) && 
                (surroundings[i] == -11 || surroundings[i] == -1 ||
                surroundings[i] == 9)) {
                continue
            }
            else if (isTenthColumnException(mine.position + offset) &&
                (surroundings[i] == -9 || surroundings[i] == 1 ||
                surroundings[i] == 11)) {
                continue
            }
            else {
                tiles[mine.position + offset].isMined = true
                tiles[mine.position + offset].tileDiv.
                    style = "border: 3px solid red"
            }
        }  
    }
    if(!mine.isActive) {
        mine.isActive = true
        objectCounters.inactiveMinesCounter--
        refreshRightPanelInfo("play")
    }
}

function checkIfGameOver() {
    if(objectCounters.inactiveMinesCounter == 0) {
        goToYouWon()
    }
    if(objectCounters.roboticSpaceshipsCounter == 0) {
        goToYouLost()
    }
}

function playTurns() {
    if(!playersTurn) {
        computerMove()
        turnCounter++
        playersTurn = true
    }        
    refreshRightPanelInfo("play")
    checkIfGameOver()
}

// called when the website is loaded
function start() {
    printInstructions("setup")
    printGrid()
    refreshRightPanelInfo("setup")
    setButton()
    createTiles()
    document.addEventListener('keydown', 
        function(event) {handleKeyboardEvents(event)})
    gridAddEventListeners()
}

window.onload = start()
