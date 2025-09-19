const board=document.getElementById("chessBoard");
const GM=GameModel.getInstance();

game = new Chess();

// Create squares
function createBoard(){
  for(let rank=0; rank<GM.files; rank++){
    for(let file=0; file<GM.ranks; file++){
      let square = document.createElement("div");
      square.className="square";
      if((file+rank)%2===0)square.classList.add("light");
      else square.classList.add("dark");
      square.style.width=100/GM.files+"%";
      square.style.height=100/GM.ranks+"%";
      spaces.push(square);
      board.appendChild(square);
    }
  }
  console.log(spaces);
}