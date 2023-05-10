
GAME.GameScreen = function (jsonData, worldSettings) {


    const canvas = document.querySelector(worldSettings.canvas.selector);
    const ctx = canvas.getContext('2d');
    worldSettings.ctx = ctx;

    canvas.height = worldSettings.canvas.height;
    canvas.width = worldSettings.canvas.width;
    let tileHeight = worldSettings.canvas.height / worldSettings.xTiles;
    let tileWidth = worldSettings.canvas.width / worldSettings.yTiles
    worldSettings.tileHeight = tileHeight
    worldSettings.tileWidth = tileWidth

    let gameState = {
        playerEntity: [],
        unitEntityList: [],
        constructionEntityList : [],
        immortalEntityList: [],

        activeEntityTile: [], // all tiles that have entities, and should be listened to.
        currentSelectTile: [], // selected by the user, possibly by click
        currentHoverTile: [] // mouse hover

        
    };

    let _TileController = GAME.TileController();
    let _PlayerController = GAME.PlayerController();
    let _InputController = GAME.InputController(worldSettings, 
        {
            onArrowLeft: movePlayerLeft,
            onArrowRight:movePlayerRight,
            onArrowUp:movePlayerUp,
            onArrowDown:movePlayerDown,
            onEscape: clearSelect
        });
    let _EntityController = GAME.EntityController();
    let _TimeController = GAME.TimeController();

    function createWorld(settings) {
        createTiles(settings)
        canvas.onclick = handleMouseClick;
        canvas.onmousemove = handleMouseMove;

    }

    function consoleLog(msg){
        console.log("clog: ", msg)
    }
    function movePlayerLeft(){
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.playerEntity;
        // _EntityController.moveEntity()
        // consoleLog(entitiesToMove)
        console.log('actives>',gameState)

        entitiesToMove.forEach(entity =>{

            entity.moveEntityX(-1, gameState)
        });
    }
    function movePlayerRight(){
        // let selectTiles = gameState.currentSelectTile;
        // let entitiesToMove = gameState.playerEntity;//_TileController.getAllTileEntities(selectTiles);
        
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.playerEntity;
        entitiesToMove.forEach(entity =>{
            entity.moveEntityX(1, gameState)
        });
    }
    function movePlayerUp(){
        let entitiesToMove = gameState.playerEntity;
        entitiesToMove.forEach(entity=>{
            entity.moveEntityY(-1, gameState)
        });
    }
    function movePlayerDown(){

    }

    function createTiles(settings) {
        gameState.tileMap = new Array(settings.xTiles);
        // Create your points and add them to the points array.
        for (let x = 0; x < settings.xTiles; x++) {
            gameState.tileMap[x] = new Array(settings.yTiles);
        }
        for (let x = 0; x < settings.xTiles; x++) {
            for (let y = 0; y < settings.yTiles; y++) {
                
                gameState.tileMap[x][y] = _TileController.initTile(x, y, settings, worldSettings.ctx)
            }
        }
    }

    function getTileFromCursor(cursor) {
        let roundedX = Math.floor(cursor.x / tileWidth);
        let roundedY = Math.floor(cursor.y / tileHeight);
        let cursorClickTile = gameState.tileMap[roundedX][roundedY];

        return cursorClickTile
    }
    function handleMouseMove(e) {
        const cursor = new _TileController.Cursor(e.offsetX, e.offsetY);

        gameState.currentHoverTile.push(getTileFromCursor(cursor));
    }

    function handleMouseClick(e) {
        let cursor = new _TileController.Cursor(e.offsetX, e.offsetY);
        let tile = getTileFromCursor(cursor);
        handleSelectTile(tile)
    }
    function clearSelect(){
        gameState.currentSelectTile = [];
        document.querySelector(worldSettings.selectDom.name).innerText = ""
    }
    function handleSelectTile(tile) {
        clearSelect();
        gameState.currentSelectTile.push(tile);
        tile.select();
    }

    

    function update() {
        ctx.clearRect(0, 0, worldSettings.canvas.width, worldSettings.canvas.height);

        // keep track of entities
        gameState.constructionEntityList.forEach(entity => {
            // add to list of entityties to be animated... should I do this every update or only when needed?
            entity.update();
        });
        gameState.unitEntityList.forEach(entity => {
            entity.update();
        });
        // keep track of tiles
        gameState.activeEntityTile.forEach(tile=>{
            tile.update(gameState);
        })
        
    }

    function resetStateTurn() {
        gameState.currentHoverTile = []
    }

    function animate(e) {
        update();

        
        gameState.activeEntityTile.forEach(tile => {
            let drawColor = "red";
            if(tile.inhibits.length > 0){
                // console.log(tile.inhibits)
                drawColor = tile.inhibits[0].displayColor
            }
            // console.log(tile)
            tile.draw(worldSettings, drawColor);
        })

        gameState.currentHoverTile.forEach(tile => {
            if(typeof tile != 'undefined'){
                tile.draw(worldSettings, "green");
            }
            
        });

        gameState.currentSelectTile.forEach(tile => {
            tile.draw(worldSettings, "blue");
            
        })
        

        resetStateTurn()

        setTimeout(function () {
            animate()
        }, 56);


    }

    createWorld(worldSettings);

    
    let cStats = {}
    // _EntityController.createImmortalEntity(123123, {xPos: 8, yPos: 2, isPlayer:true}, cStats, worldSettings, gameState);
    _EntityController.createConstructionEntity(123123, {xPos: 3, yPos: 2}, cStats, worldSettings, gameState);
    _EntityController.createConstructionEntity(123123, {xPos: 4, yPos: 3}, cStats, worldSettings, gameState);
    _EntityController.createImmortalEntity(3123123,{xPos: 5, yPos: 5},cStats, worldSettings, gameState)
    // gameState.activeEntityTile.push(gameState.tileMap[3][3]);
    

    animate();   
}






// canvas.onclick = animate;


