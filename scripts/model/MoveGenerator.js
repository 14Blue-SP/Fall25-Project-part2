class MoveGenerator{
  
  possibleKing(index){
    let file = index%GM.files;
    let rank = parseInt(index/GM.ranks);
    console.log("possibleKing:", {file, rank});
    var list = [];
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newFile = i%GM.files;
      let newRank = parseInt(i/GM.ranks);
      const move = new KingMove(file,rank,newFile,newRank,GM.getChessBoard()[GM.getIndex(newFile,newRank)]);
      if(CS.isLegalMove(move) && !CS.checkMove(move,i)){
        list.push(move);
      }
    }
    return list;
  }

  possibleQueen(index){
    let file = index%GM.files;
    let rank = parseInt(index/GM.ranks);
    console.log("possibleQueen", {file, rank});
    var list = [];
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newFile = i%GM.files;
      let newRank = parseInt(i/GM.ranks);
      const move = new QueenMove(file,rank,newFile,newRank,GM.getChessBoard()[GM.getIndex(newFile,newRank)]);
      if(CS.isLegalMove(move) && !CS.checkMove(move,i)){
        list.push(move);
      }
    }
    return list;
  }

  possibleBishop(index){
    let file = index%GM.files;
    let rank = parseInt(index/GM.ranks);
    console.log("possibleQueen", {file, rank});
    var list = [];
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newFile = i%GM.files;
      let newRank = parseInt(i/GM.ranks);
      const move = new BishopMove(file,rank,newFile,newRank,GM.getChessBoard()[GM.getIndex(newFile,newRank)]);
      if(CS.isLegalMove(move) && !CS.checkMove(move,i)){
        list.push(move);
      }
    }
    return list;
  }

  possibleRook(index){
    let file = index%GM.files;
    let rank = parseInt(index/GM.ranks);
    console.log("possibleQueen", {file, rank});
    var list = [];
    for(let i=0; i<GM.getChessBoard().length; i++){
      let newFile = i%GM.files;
      let newRank = parseInt(i/GM.ranks);
      const move = new RookMove(file,rank,newFile,newRank,GM.getChessBoard()[GM.getIndex(newFile,newRank)]);
      if(CS.isLegalMove(move) && !CS.checkMove(move,i)){
        list.push(move);
      }
    }
    return list;
  }
}