GAME.PlayerController = function (settings, TileController) {
    function init(){

    }

    function movePlayerX(e){
        console.log('move player x' ,e);
    }
    function movePlayerY(){

    }
    init();

    this.MovePlayerX = movePlayerX;
    this.MovePlayerY = movePlayerY;

    return this;
}
