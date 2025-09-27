class Move {
  constructor(col, row, newCol, newRow){
    this.coords = [col, row, newCol, newRow];
    this.piece = GM.getElement(col, row)
    this.capture = GM.getElement(newCol, newRow);
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
    return `${this.coords[0]}${this.coords[1]}${this.coords[2]}${this.coords[3]}${this.capture}`;
  }
}

class KingMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    let castle = this.isWhite ? GM.castle.white:GM.castle.black;
    let check = this.isWhite ? GM.checks.white:GM.checks.black;
    // castling king side
    if(this.coords[2]===this.coords[0]+2 && this.coords[3]==this.coords[1]
      && GM.getElement(this.coords[0]+1, this.coords[1])===' '
      && GM.getElement(this.coords[0]+2, this.coords[1])===' '
      && !check && castle)
    {
      this.special="0-0"
      return true;
    }
    // castling queen side
    if(this.coords[2]===this.coords[0]-2 && this.coords[3]==this.coords[1]
      && GM.getElement(this.coords[0]-1, this.coords[1])===' '
      && GM.getElement(this.coords[0]-2, this.coords[1])===' '
      && GM.getElement(this.coords[0]-3, this.coords[1])===' '
      && !check && castle)
    {
      this.special="0-0-0"
      return true;
    }
    
    return Math.abs(this.coords[0]-this.coords[2])<=1 && Math.abs(this.coords[1]-this.coords[3])<=1;
  }
}

class QueenMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    return this.coords[0]==this.coords[2] || this.coords[1]==this.coords[3] || Math.abs(this.coords[0]-this.coords[2])==Math.abs(this.coords[1]-this.coords[3]);
  }

  pieceCollision() {
    return isVerticalCollision(this) || isHorizontalCollision(this) || isDiagonalCollision(this);
  }
}

class BishopMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    return Math.abs(this.coords[0]-this.coords[2])==Math.abs(this.coords[1]-this.coords[3]);
  }

  pieceCollision() {
    return isDiagonalCollision(this);
  }
}

class RookMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    return this.coords[0]==this.coords[2] || this.coords[1]==this.coords[3];
  }

  pieceCollision() {
    return isVerticalCollision(this) || isHorizontalCollision(this);
  }
}

class KnightMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    return Math.abs(this.coords[0]-this.coords[2]) * Math.abs(this.coords[1]-this.coords[3]) == 2;
  }
}

class PawnMove extends Move{
  constructor(col, row, newCol, newRow){
    super(col, row, newCol, newRow)
  }

  isValidMove(){
    let direction = this.isWhite ? -1:1;

    //Promotion
    if(this.coords[3] == (this.isWhite?0:7)){
      this.special = "=";
    }

    //Standard Move
    if(this.coords[0]===this.coords[2] && this.coords[3]===this.coords[1]+direction && GM.getElement(this.coords[2], this.coords[3])===' '){
      return true;
    }

    //First Double Move
    if(this.coords[1]===(this.isWhite?6:1) && this.coords[0]===this.coords[2] && this.coords[1]+2*direction===this.coords[3] && GM.getElement(this.coords[2], this.coords[3])===' ' && GM.getElement(this.coords[2], this.coords[1]+direction)===' ') {
      return true;
    }

    //Capture
    if(Math.abs(this.coords[0]-this.coords[2])==1 && this.coords[1]+direction==this.coords[3] && GM.getElement(this.coords[2], this.coords[3])!==' '){
      return true;
    }

    //enPassant
    if(GM.enPassantSquare==GM.getIndex(this.coords[2], this.coords[3]) && this.coords[1]!==(this.isWhite?6:1) && Math.abs(this.coords[0]-this.coords[2])==1 && this.coords[1]+direction==this.coords[3]){
      this.special = "e.p.";
      return true;
    }
    return false;
  }
}
