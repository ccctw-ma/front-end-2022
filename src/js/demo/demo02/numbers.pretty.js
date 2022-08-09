

var gameState = "first-setup"; // First setup  Second setup Third setup Play End
var states = {
    firstSetup: "first-setup",
    secondSetup: "second-setup",
    thirdSetup: "third-setup",
    play: "play",
    end: "end"
}

var turnCounter = 1
var tiles = new Array(25)
var player = null
var playerTurn = true;
var setupInfo;
var objectCounters = {
    blockCounter: 0,
    redCounter: 0,
    blackCounter: 0,
}

class Tile {
    constructor(id) {
        this.tileId = id
        this.tileDiv = document.getElementById("c" + id)
        this.isOccupied = false
        this.isSelected = false
        // this.objectOnTile = null
        // this.playerOnTile = null
        // if there is an active mine in tile's surroundings
        // this.isMined = false
        // checks if the tile was already used in a for loop
        // this.checked = false;
        this.isBlock = false;
        this.isRed = false;
        this.isBlack = false;
        this.value = 0;
    }
}

Tile.selectedTile = null;

// instructions
var FirstSetupInstructions = "<p> places an arbitrary number of blocks on the grid" +
    "<br><br>To place a block select a cell and press 'b'";

var SecondSetupInstructions = "<p>Please select at least one and at most eight red pieces" +
    "<br><br>To place a red piece select a cell and press one of the numbers 1 to 4" +
    "<br><br>There are at most 3 number 1, at most 2 number 2, at most 2 number 3, and at most 1  number 4" +
    "<br><br>Don't try to change an object already on the grid</p>"

var ThirdSetupInstructions = "<p>Please select at least one and at most eight black pieces" +
    "<br><br>To place a black piece select a cell and press one of the numbers 1 to 4" +
    "<br><br>There are at most 3 number 1, at most 2 number 2, at most 2 number 3, and at most 1  number 4" +
    "<br><br>Don't try to change an object already on the grid</p>"

var playInstructions = "<p>Please select one red pieces and move it" +
    "<br><br>To move one cell up press 'w'" +
    "<br><br>To move one cell to the left press 'a'" +
    "<br><br>To move one cell down press 's'" +
    "<br><br>To move one cell to the right press 'd'</p>"


// prints setup and play instructions in the instructions div on the webpage
function printInstructions(gameState) {
    if (gameState == states.firstSetup) {
        document.getElementById("instructions").innerHTML = FirstSetupInstructions;
    } else if (gameState === states.secondSetup) {
        document.getElementById("instructions").innerHTML = SecondSetupInstructions;
    } else if (gameState === states.thirdSetup) {
        document.getElementById("instructions").innerHTML = ThirdSetupInstructions;
    }
    else if (gameState == states.play) {
        document.getElementById("instructions").innerHTML = playInstructions
    }
}


function refreshRightPanelInfo(gameState) {
    if (gameState === "first-setup" || gameState === "second-setup" || gameState === 'third-setup') {
        setupInfo = "<p>Blocks: " +
            objectCounters.blockCounter
            + "<br><br>Red: " +
            objectCounters.redCounter
            + "<br><br>Black: " +
            objectCounters.blackCounter + "</p>"
    }
    else if (gameState === states.play) {

        const curPlayer = playerTurn ? "user" : "computer";
        setupInfo = "<p>Turn: " +
            turnCounter
            + "<br><br> player: " +
            curPlayer
            + "<br><br>Red: " +
            objectCounters.redCounter
            + "<br><br>Black: " +
            objectCounters.blackCounter + "</p>"
    }
    document.getElementById("info").innerHTML = setupInfo
}
function setButton(gameState) {
    if (gameState == "first-setup") {
        document.getElementById("endButton").innerHTML = "End First SetUp"
    }
    else if (gameState == "second-setup") {
        document.getElementById("endButton").innerHTML = "End Second SetUp"
    }
    else if (gameState == "third-setup") {
        document.getElementById("endButton").innerHTML = "Play"
    }
    else if (gameState == "play") {
        document.getElementById("endButton").innerHTML = "End Game"
    }
    else if (gameState = "end") {
        document.getElementById("endButton").innerHTML = "Play Again"
    }
}
function printGrid() {
    var gridDivContent = ""

    for (i = 0; i < 25; i++) {
        var cellId = "c" + i
        gridDivContent += "<div class='gridCell' id='" + cellId + "'></div>"

        if ((i + 1) % 5 == 0) {
            gridDivContent += '<div style="clear:both;"></div>'
        }
    }

    document.getElementById("grid").innerHTML = gridDivContent
}



function createTiles() {
    for (let i = 0; i < 25; i++) {
        let tile = new Tile(i);
        tiles[i] = tile;
    }
}
// adds event listeners to the tiles
function gridAddEventListeners() {
    tiles.forEach(tile => {
        tile.tileDiv.addEventListener("click",
            function () { tileClicked(tile.tileId) })
    });
}

// when the tile is clicked...
// changes highlighting and the current selectedTile
function tileClicked(tileId) {
    if (gameState === states.end) {
        return;
    }
    tile = tiles[tileId]
    // there is no  selected tile
    if (Tile.selectedTile === null) {
        Tile.selectedTile = tile
        tile.isSelected = true
        tile.tileDiv.style.border = "6px solid white"
    }
    // other tile is selected
    else if (Tile.selectedTile != tile) {
        Tile.selectedTile.isSelected = false
        const preTile = Tile.selectedTile;
        if (preTile.isRed) {
            preTile.tileDiv.style.border = "6px solid red"
        } else if (preTile.isBlack) {
            preTile.tileDiv.style.border = "6px solid black"
        } else if (preTile.isBlock) {
            preTile.tileDiv.style.border = "6px solid gray"
        } else {
            preTile.tileDiv.style.border = null;
        }
        Tile.selectedTile = tile
        tile.isSelected = true
        tile.tileDiv.style.border = "6px solid white"
        // tile.tileDiv.innerText = "HI"
    }
    // the same tile has been selected
    else if (tile.isSelected) {
        Tile.selectedTile = null
        tile.isSelected = false;
        if (tile.isRed) {
            tile.tileDiv.style.border = "6px solid red"
        } else if (tile.isBlack) {
            tile.tileDiv.style.border = "6px solid black"
        } else if (tile.isBlock) {
            tile.tileDiv.style.border = "6px solid gray"
        } else {
            tile.tileDiv.style.border = null;
        }

    }
}

function checkRedPiecesNumber(key) {
    const arr = [0, 0, 0, 0];
    let n = 0;
    tiles.forEach(tile => {
        if (tile.isRed) {
            arr[tile.value - 1]++;
            n++;
        }
    })
    if (n === 8) {
        return "There are at most 8 red pieces"
    } else if (key === '1' && arr[0] === 3) {
        return "There are at most 3 red pieces with the number 1";
    } else if (key === '2' && arr[1] === 2) {
        return "There are at most 2 red pieces with the number 2";
    } else if (key === '3' && arr[2] === 2) {
        return "There are at most 2 red pieces with the number 3";
    } else if (key === '4' && arr[3] === 1) {
        return "There are at most 1 red pieces with the number 4";
    } else {
        return "";
    }
}

function checkBlackPiecesNumber(key) {
    const arr = [0, 0, 0, 0];
    let n = 0;
    tiles.forEach(tile => {
        if (tile.isBlack) {
            arr[tile.value - 1]++;
            n++;
        }
    })
    if (n === 8) {
        return "There are at most 8 black pieces"
    } else if (key === '1' && arr[0] === 3) {
        return "There are at most 3 black pieces with the number 1";
    } else if (key === '2' && arr[1] === 2) {
        return "There are at most 2 black pieces with the number 2";
    } else if (key === '3' && arr[2] === 2) {
        return "There are at most 2 black pieces with the number 3";
    } else if (key === '4' && arr[3] === 1) {
        return "There are at most 1 black pieces with the number 4";
    } else {
        return "";
    }
}

function handleKeyboardEvents(event) {
    if (gameState === states.firstSetup) {
        if (event.key === 'b') {
            if (Tile.selectedTile !== null && !Tile.selectedTile.isOccupied) {
                if (objectCounters.blockCounter >= 23) {
                    printErrorMessage('There are at most 1 red piece and at most 1 blakc piece');
                    return;
                }
                const selectedTileDom = Tile.selectedTile.tileDiv;
                // console.log(selectedTileDom.style);
                Tile.selectedTile.isOccupied = true;
                Tile.selectedTile.isBlock = true;
                selectedTileDom.style.border = "6px solid gray";
                selectedTileDom.style.backgroundColor = "gray";
                objectCounters.blockCounter += 1;
                refreshRightPanelInfo(gameState);

            }
        } else {
            printErrorMessage('You pressed the wrong key. Please press "b"');
        }
    } else if (gameState === states.secondSetup) {
        if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
            clearErrorMessage();
            if (Tile.selectedTile === null) {
                printErrorMessage('Please select a cell');
                return;
            }
            if (Tile.selectedTile.isOccupied) {
                printErrorMessage("Don't try to change an object already on the grid");
                return;
            }
            const checkRes = checkRedPiecesNumber(event.key);
            if (checkRes.length === 0) {
                Tile.selectedTile.isRed = true;
                Tile.selectedTile.isOccupied = true;
                Tile.selectedTile.value = Number(event.key);
                const dom = Tile.selectedTile.tileDiv;
                dom.style.backgroundColor = 'red';
                dom.style.border = "6px solid red";
                dom.innerText = event.key;
                objectCounters.redCounter += 1;
                refreshRightPanelInfo(gameState);
            } else {
                printErrorMessage(checkRes);
            }

        } else {
            printErrorMessage('You pressed the wrong key. Please press numbers 1 to 4');
        }

    } else if (gameState === states.thirdSetup) {
        if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
            clearErrorMessage();
            if (Tile.selectedTile === null) {
                printErrorMessage('Please select a cell');
                return;
            }
            if (Tile.selectedTile.isOccupied) {
                printErrorMessage("Don't try to change an object already on the grid");
                return;
            }
            const checkRes = checkBlackPiecesNumber(event.key);
            if (checkRes.length === 0) {
                Tile.selectedTile.isBlack = true;
                Tile.selectedTile.isOccupied = true;
                Tile.selectedTile.value = Number(event.key);
                const dom = Tile.selectedTile.tileDiv;
                dom.style.backgroundColor = 'black';
                dom.style.border = "6px solid black";
                dom.innerText = event.key;
                objectCounters.blackCounter += 1;
                refreshRightPanelInfo(gameState);
            } else {
                printErrorMessage(checkRes);
            }

        } else {
            printErrorMessage('You pressed the wrong key. Please press numbers 1 to 4');
        }
    } else if (gameState === states.play) {
        clearErrorMessage();
        if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
            if (Tile.selectedTile === null || !Tile.selectedTile.isRed) {
                printErrorMessage('Please select a red cell');
                return;
            }
            if (!playerTurn) {
                printErrorMessage("computer's turn");
                return;
            }
            let canMove = redCanMove(Tile.selectedTile.tileId, event.key);
            if (!canMove) {
                printErrorMessage("the selected red piece can't move");
                return;
            }
            playerMove(Tile.selectedTile.tileId, event.key);
            let status = checkGameStatus();
            if (status === 1) {
                printErrorMessage('User Win !!!');
                gameState = states.end;
                setButton(gameState);
                return;
            } else if (status === -1) {
                printErrorMessage('Computer Win !!!');
                gameState = states.end;
                setButton(gameState);
                return;
            }
            playerTurn = false;
            refreshRightPanelInfo(gameState);
            setTimeout(() => {
                computerMove();
            }, 750);
        } else {
            printErrorMessage('You pressed the wrong key. Please press "w", "a", "s", "d"');
        }
    } else {

    }

}

function handleButtonClick() {
    if (gameState === states.firstSetup) {
        setButton(states.secondSetup);
        printInstructions(states.secondSetup);
        gameState = states.secondSetup;
    } else if (gameState === states.secondSetup) {
        let n = 0;
        tiles.forEach(tile => {
            if (tile.isRed) n++;
        })
        if (n === 0) {
            printErrorMessage('Please select at least one red pieces');
            return;
        }
        setButton(states.thirdSetup);
        printInstructions(states.thirdSetup);
        clearErrorMessage();
        gameState = states.thirdSetup;
    } else if (gameState === states.thirdSetup) {
        let n = 0;
        tiles.forEach(tile => {
            if (tile.isBlack) n++;
        })
        if (n === 0) {
            printErrorMessage('Please select at least one black pieces');
            return;
        }
        setButton(states.play);
        printInstructions(states.play);
        clearErrorMessage();
        gameState = states.play;
        refreshRightPanelInfo(gameState);
    } else if (gameState === states.play) {
        let status = checkGameStatus();
        console.log(status);
        if (status === 1) {
            printErrorMessage('User Win !!!');
        } else if (status === 0) {
            printErrorMessage('Draw !!!');
        } else if (status === -1) {
            printErrorMessage('Computer Win !!!');
        }
        gameState = states.end;
    } else {
        console.log('end');
    }
}

function printErrorMessage(message) {
    document.getElementById("error_messages").innerHTML = message;
}

function clearErrorMessage() {
    document.getElementById("error_messages").innerHTML = '';
}


function initSetup() {
    printInstructions(states.firstSetup);
    refreshRightPanelInfo(states.firstSetup);
    setButton(states.firstSetup);
}

function playerMove(index, direction) {
    let pos = index2xy(index);
    let x = pos[0], y = pos[1];
    let nx, ny;
    if (direction === 'w') {
        nx = x - 1;
        ny = y;
    } else if (direction === 'a') {
        nx = x;
        ny = y - 1;
    } else if (direction === 's') {
        nx = x + 1;
        ny = y;
    } else if (direction === 'd') {
        nx = x;
        ny = y + 1;
    }
    let tarIndex = xy2index(nx, ny);
    let curTile = tiles[index];
    let targetTile = tiles[tarIndex];
    if (!targetTile.isOccupied) {
        Tile.selectedTile = null;
        targetTile.isOccupied = true;
        targetTile.isSelected = false;
        targetTile.isRed = true;
        targetTile.value = curTile.value;
        targetTile.tileDiv.innerText = targetTile.value;
        targetTile.tileDiv.style.backgroundColor = 'red';
        targetTile.tileDiv.style.border = "6px solid red";
        curTile.isOccupied = false;
        curTile.isRed = false;
        curTile.value = 0;
        curTile.tileDiv.innerText = null;
        curTile.tileDiv.style.backgroundColor = null;
        curTile.tileDiv.style.border = null;
    } else {
        // black piece  is eliminated
        if (curTile.value > targetTile.value || (curTile.value === 1 && targetTile.value == 4)) {
            Tile.selectedTile = null;
            targetTile.isOccupied = true;
            targetTile.isSelected = false;
            targetTile.isRed = true;
            targetTile.isBlack = false;
            targetTile.value = curTile.value;
            targetTile.tileDiv.innerText = targetTile.value;
            targetTile.tileDiv.style.backgroundColor = 'red';
            targetTile.tileDiv.style.border = "6px solid red";
            curTile.isOccupied = false;
            curTile.isRed = false;
            curTile.value = 0;
            curTile.tileDiv.innerText = null;
            curTile.tileDiv.style.backgroundColor = null;
            curTile.tileDiv.style.border = null;
            objectCounters.blackCounter -= 1;
        } else {
            // red piece  is eliminated
            Tile.selectedTile = null;
            targetTile.isSelected = false;
            // targetTile.tileDiv.style.border = "6px solid red";
            curTile.isOccupied = false;
            curTile.isRed = false;
            curTile.value = 0;
            curTile.tileDiv.innerText = null;
            curTile.tileDiv.style.backgroundColor = null;
            curTile.tileDiv.style.border = null;
            objectCounters.redCounter -= 1;
        }
    }
}

function computerMove() {
    let blackIndexs = [];
    let mustMove = [];
    for (let i = 0; i < 25; i++) {
        if (tiles[i].isBlack && (blackCanMove(i, 'w') || blackCanMove(i, 'a') || blackCanMove(i, 's') || blackCanMove(i, 'd'))) {
            blackIndexs.push(i);
        }
        if (tiles[i].isBlack) {
            let res = redNearBlack(i);
            if (res.length !== 0) {
                mustMove.push(...res);
            }
        }
    }
    let index, direction;
    if (mustMove.length !== 0) {
        let must = mustMove[Math.floor(Math.random() * mustMove.length)];
        index = must[0];
        direction = must[1];
    } else {
        index = blackIndexs[Math.floor(Math.random() * blackIndexs.length)];
        let directions = ['w', 'a', 's', 'd'];
        let moveDirections = [];
        for (let i = 0; i < 4; i++) {
            if (blackCanMove(index, directions[i])) {
                moveDirections.push(directions[i]);
            }
        }
        direction = moveDirections[Math.floor(Math.random() * moveDirections.length)];
    }

    let pos = index2xy(index);
    let x = pos[0], y = pos[1];
    let nx, ny;
    if (direction === 'w') {
        nx = x - 1;
        ny = y;
    } else if (direction === 'a') {
        nx = x;
        ny = y - 1;
    } else if (direction === 's') {
        nx = x + 1;
        ny = y;
    } else if (direction === 'd') {
        nx = x;
        ny = y + 1;
    }
    let tarIndex = xy2index(nx, ny);
    let curTile = tiles[index];
    let targetTile = tiles[tarIndex];
    if (!targetTile.isOccupied) {
        Tile.selectedTile = null;
        targetTile.isOccupied = true;
        targetTile.isSelected = false;
        targetTile.isBlack = true;
        targetTile.value = curTile.value;
        targetTile.tileDiv.innerText = targetTile.value;
        targetTile.tileDiv.style.backgroundColor = 'black';
        targetTile.tileDiv.style.border = "6px solid black";
        curTile.isOccupied = false;
        curTile.isBlack = false;
        curTile.value = 0;
        curTile.tileDiv.innerText = null;
        curTile.tileDiv.style.backgroundColor = null;
        curTile.tileDiv.style.border = null;
    } else {
        // red piece  is eliminated
        if (curTile.value > targetTile.value || (curTile.value === 1 && targetTile.value == 4)) {
            Tile.selectedTile = null;
            targetTile.isOccupied = true;
            targetTile.isSelected = false;
            targetTile.isBlack = true;
            targetTile.isRed = false;
            targetTile.value = curTile.value;
            targetTile.tileDiv.innerText = targetTile.value;
            targetTile.tileDiv.style.backgroundColor = 'black';
            targetTile.tileDiv.style.border = "6px solid black";
            curTile.isOccupied = false;
            curTile.isBlack = false;
            curTile.value = 0;
            curTile.tileDiv.innerText = null;
            curTile.tileDiv.style.backgroundColor = null;
            curTile.tileDiv.style.border = null;
            objectCounters.redCounter -= 1;
        } else {
            // black piece  is eliminated
            Tile.selectedTile = null;
            targetTile.isSelected = true;
            // targetTile.tileDiv.style.border = "6px solid white";
            curTile.isOccupied = false;
            curTile.isBlack = false;
            curTile.value = 0;
            curTile.tileDiv.innerText = null;
            curTile.tileDiv.style.backgroundColor = null;
            curTile.tileDiv.style.border = null;
            objectCounters.blackCounter -= 1;
        }
    }
    playerTurn = true;
    turnCounter++;
    refreshRightPanelInfo(gameState);
    let status = checkGameStatus();
    if (status === 1) {
        printErrorMessage('User Win !!!');
        gameState = states.end;
        setButton(gameState);
        return;
    } else if (status === -1) {
        printErrorMessage('Computer Win !!!');
        gameState = states.end;
        setButton(gameState);
        return;
    }
}



function redCanMove(index, direction) {
    let pos = index2xy(index);
    let x = pos[0], y = pos[1];
    let nx, ny;
    if (direction === 'w') {
        nx = x - 1;
        ny = y;
    } else if (direction === 'a') {
        nx = x;
        ny = y - 1;
    } else if (direction === 's') {
        nx = x + 1;
        ny = y;
    } else if (direction === 'd') {
        nx = x;
        ny = y + 1;
    }
    if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
        let targetTile = tiles[xy2index(nx, ny)];
        if (targetTile.isBlack || !targetTile.isOccupied) {
            return true;
        }
    }
    return false;
}

function blackCanMove(index, direction) {
    let pos = index2xy(index);
    let x = pos[0], y = pos[1];
    let nx, ny;
    if (direction === 'w') {
        nx = x - 1;
        ny = y;
    } else if (direction === 'a') {
        nx = x;
        ny = y - 1;
    } else if (direction === 's') {
        nx = x + 1;
        ny = y;
    } else if (direction === 'd') {
        nx = x;
        ny = y + 1;
    }
    if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
        let targetTile = tiles[xy2index(nx, ny)];
        if (targetTile.isRed || !targetTile.isOccupied) {
            return true;
        }
    }
    return false;
}

function redNearBlack(index) {
    let res = [];
    let pos = index2xy(index);
    let x = pos[0], y = pos[1];
    let nx, ny;
    let directions = ['w', 'a', 's', 'd'];
    for (let i = 0; i < 4; i++) {
        let direction = directions[i];
        if (direction === 'w') {
            nx = x - 1;
            ny = y;
        } else if (direction === 'a') {
            nx = x;
            ny = y - 1;
        } else if (direction === 's') {
            nx = x + 1;
            ny = y;
        } else if (direction === 'd') {
            nx = x;
            ny = y + 1;
        }
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
            let targetTile = tiles[xy2index(nx, ny)];
            if (targetTile.isRed) {
                res.push([index, direction]);
            }
        }
    }
    return res;
}

function index2xy(index) {
    let x = Math.floor(index / 5);
    let y = index % 5;
    return [x, y];
}

function xy2index(x, y) {
    return x * 5 + y;
}


function checkGameStatus() {
    let isOver = 0;
    if (objectCounters.redCounter === 0) {
        return -1;
    }
    if (objectCounters.blackCounter === 0) {
        return 1;
    }
    if (playerTurn) {
        let canMove = false;
        for (let i = 0; i < 25; i++) {
            if (tiles[i].isRed) {
                let tempCanMove = redCanMove(i, 'w') || redCanMove(i, 'a') || redCanMove(i, 's') || redCanMove(i, 'd');
                canMove = canMove || tempCanMove;
                if (canMove) {
                    break;
                }
            }
        }
        isOver = canMove ? 0 : -1;
    } else {
        let canMove = false;
        for (let i = 0; i < 25; i++) {
            if (tiles[i].isBlack) {
                let tempCanMove = blackCanMove(i, 'w') || blackCanMove(i, 'a') || blackCanMove(i, 's') || blackCanMove(i, 'd');
                canMove = canMove || tempCanMove;
                if (canMove) {
                    break;
                }
            }
        }
        isOver = canMove ? 0 : 1;
    }
    return isOver;
}


function start() {
    printGrid();
    createTiles();
    gridAddEventListeners();
    initSetup();
    document.getElementById('endButton').addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleKeyboardEvents)
}


window.onload = start();