class MoveGenerator{
  possibleKing(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new KingMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleQueen(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new QueenMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleBishop(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new BishopMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleRook(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new RookMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possibleKnight(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new KnightMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }

  possiblePawn(index){
    var list = [];
    let square = GM.getCoordinates(index);
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new PawnMove(square.file,square.rank,newSquare.file,newSquare.rank);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    return list;
  }
}