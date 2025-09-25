class Move {
  constructor(col, row, newCol, newRow, capture){
    this.coords = [col, row, newCol, newRow];
    this.piece = GM.getChessBoard()[GM.getIndex(col, row)];
    this.capture = GM.getChessBoard()[GM.getIndex(newCol, newRow)];
    this.isWhite = isUpperCase(this.piece);
    this.special = "";
  }
  isValidMove(){
    return true;
  }
  pieceCollision(){
    return false;
  }
  
  toString(){
    let str = `${this.coords}${this.capture}`;
    if(this.special!==""){str = str+this.special}
    if(this.special==="0-0" || this.special==="0-0-0"){str=this.special}
    return str;
  }
}