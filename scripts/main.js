game = new Chess();

function isUpperCase(str) {
  return str === str.toUpperCase();
}

function toBoolean(s){
  return s==="true";
}

function getType(str){
  str = str.toLowerCase();
  switch(str.charAt(0)){
    case 'b' : return "bishop"; break;
    case 'k' : return "king"; break;
    case 'n' : return "knight"; break;
    case 'p' : return "pawn"; break;
    case 'q' : return "queen"; break;
    case 'r' : return "rook"; break;
  }
}

function getCoordinate(col, row){
  return `${String.fromCharCode(97+col)}${GM.ranks-row}`;
}

function drag(ev){
  const piece = ev.target;
  if(GM.isWhiteTurn === toBoolean(piece.dataset.isWhite)){
    ev.dataTransfer.setData("text",piece.id);
  }
  piece.parentElement.classList.remove("hover");
}

function endDrag(ev){
  ev.preventDefault();
}

function drop(ev){
  ev.preventDefault();
  const _target = ev.currentTarget;
  const data = ev.dataTransfer.getData("text");
  if(data===""){return}
  const piece=document.getElementById(data);
  let position = data.split(" ")[1];
  position = position.split(""); 
  position[0] = position[0].charCodeAt(0)-97;
  position[1] = parseInt(GM.ranks-position[1]);
  let target = _target.id;
  target = target.split("");
  target[0] = target[0].charCodeAt(0)-97;
  target[1] = parseInt(GM.ranks-target[1]);

  _target.replaceChildren(piece);
  piece.id =`${data.split(" ")[0]} ${piece.parentElement.id}`;
  GM.isWhiteTurn=!GM.isWhiteTurn;
  //latestMove=move;
}