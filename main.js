let img = ["1", "2", "3", "4", "5", "6"];
let board = [];
let rows = 9;
let columns = 9;
let score = 0;

let currTile;
let otherTile;

window.onload = () => {
    const music = document.getElementById("bgMusic");

    // Попытка запустить сразу (сработает редко)
    music.volume = 0.3;
    music.play().catch(err => console.log("Автоплей заблокирован:", err));

    // Запуск при первом клике где угодно на странице
    document.addEventListener("click", () => {
        if (music.paused) {
            music.play();
        }
    }, { once: true });
    //  ↑ once: true — обработчик сработает только один раз и удалится сам

    startGame();

    window.setInterval(function () {
        crushImg();
        slideImg();
        generateImg();
    }, 100);
}

const randomImg = () => {
    return img[Math.floor(Math.random() * img.length)];
}

const startGame = () => {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomImg() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);


            document.querySelector("#board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }


}

function crushImg() {
    crushTree();
    document.getElementById("score").innerText = score;
}

function crushTree() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let img1 = board[r][c];
            let img2 = board[r][c + 1];
            let img3 = board[r][c + 2];
            if (img1.src == img2.src && img2.src == img3.src && !img1.src.includes("blank")) {
                img1.src = "./images/blank.png";
                img2.src = "./images/blank.png";
                img3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let img1 = board[r][c];
            let img2 = board[r + 1][c];
            let img3 = board[r + 2][c];
            if (img1.src == img2.src && img2.src == img3.src && !img1.src.includes("blank")) {
                img1.src = "./images/blank.png";
                img2.src = "./images/blank.png";
                img3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let img1 = board[r][c];
            let img2 = board[r][c + 1];
            let img3 = board[r][c + 2];
            if (img1.src == img2.src && img2.src == img3.src && !img1.src.includes("blank")) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let img1 = board[r][c];
            let img2 = board[r + 1][c];
            let img3 = board[r + 2][c];
            if (img1.src == img2.src && img2.src == img3.src && !img1.src.includes("blank")) {
                return true
            }
        }
    }

    return false;
}

function slideImg() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateImg() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomImg() + ".png";
        }
    }
}