class MoveGenerator{
  
  possibleKing(index){
    let file = index%GM.files;
    let rank = parseInt(index/GM.ranks);
    console.log("possibleKing:", {file, rank});
    var list = [];
    for(let i=0; i<GM.getChessBoard().length; i++){
      //console.log(i,GM.getChessBoard()[i]);
      let newFile = i%GM.files;
      let newRank = parseInt(i/GM.ranks);
      const move = new KingMove(file,rank,newFile,newRank,GM.getChessBoard()[GM.getIndex(newFile,newRank)]);
      if(CS.isLegalMove(move) && !CS.checkMove(move,i)){
        list.push(move);
      }
    }
    return list;
  }
}