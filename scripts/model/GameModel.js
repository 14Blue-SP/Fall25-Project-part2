class GameModel {
  static #INSTANCE = new GameModel();
  files=8; ranks=8;

  static getInstance(){
    return this.#INSTANCE;
  }
}