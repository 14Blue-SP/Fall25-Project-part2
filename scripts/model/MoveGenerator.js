class MoveGenerator{
  
  possibleKing(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possibleKing - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new KingMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd();}
    return list;
  }

  possibleQueen(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possibleQueen - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new QueenMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd();}
    return list;
  }

  possibleBishop(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possibleBishop - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new BishopMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd();}
    return list;
  }

  possibleRook(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possibleRook - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new RookMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd();}
    return list;
  }

  possibleKnight(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possibleKnight - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new KnightMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd();}
    return list;
  }

  possiblePawn(index){
    var list = [];
    let square = GM.getCoordinates(index);
    if(DEBUG){console.groupCollapsed(`possiblePawn - {file: ${square.file}, rank: ${square.rank}}`);}
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newSquare = GM.getCoordinates(i);
      const move = new PawnMove(square.file,square.rank,newSquare.file,newSquare.rank,GM.getChessBoard()[GM.getIndex(newSquare.file,newSquare.rank)]);
      if(CS.isLegalMove(move) && CS.isSafeMove(move)){
        list.push(move);
      }
    }
    if(DEBUG){console.groupEnd(`possiblePawn - {file: ${square.file}, rank: ${square.rank}}`);}
    return list;
  }
}