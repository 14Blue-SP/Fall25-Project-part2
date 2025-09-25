game = new Chess();

function isUpperCase(str) {
  return str === str.toUpperCase();
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