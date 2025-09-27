class MoveGenerator{
  possibleKing(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new KingMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleQueen(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new QueenMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleBishop(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new BishopMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleRook(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new RookMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleKnight(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new KnightMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possiblePawn(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      let move = new PawnMove(square.col,square.row,newSquare.col,newSquare.row);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }
}