
GAME.GameScreen = function (worldSettings) {
    const canvas = document.querySelector(worldSettings.canvas.selector);
    const ctx = canvas.getContext('2d');
    worldSettings.ctx = ctx;

    canvas.height = worldSettings.canvas.height;
    canvas.width = worldSettings.canvas.width;
    let tileHeight = worldSettings.canvas.height / worldSettings.xTiles;
    let tileWidth = worldSettings.canvas.width / worldSettings.yTiles
    worldSettings.tileHeight = tileHeight;
    worldSettings.tileWidth = tileWidth;


    let gameState = {
        multiSelectMode : false,

        playerEntity: [],
        unitEntityList: [],
        TownEntityList : [],
        creatureEntityList: [],
        currentSelectEntity: [],

        activeEntityTile: [], // all tiles that have entities, and should be listened to.
        currentSelectTile: [], // selected by the user, possibly by click
        currentHoverTile: [], // mouse hover

        timeObject : {
            hour:0,
            day:1,
            week:1,
            month:1,
            year:1053,
            quarter: 1,
            seasonName: 'Spring'
        },
        tickCount:0,


        clearSelectEntityList: function clearSelectEntity(target=null){
            if (target == null) {
                this.currentSelectEntity = [];
            } else {
                let indexToRemove = this.currentSelectEntity.indexOf(target)
                this.currentSelectEntity.splice(indexToRemove, 1);
            }
        },
        addActiveEntityTile: function addActiveEntityTile(tile){
            if(this.activeEntityTile.indexOf(tile) === -1) {
                this.activeEntityTile.push(tile);
            }
        }

    };
    

    let _TileController = GAME.TileController(worldSettings, gameState);
    let _PlayerController = GAME.PlayerController();
    let _InputController = GAME.InputController(worldSettings, 
        {
            onArrowLeft: moveCursorLeft,
            onArrowRight: moveCursorRight,
            onArrowUp: moveCursorUp,
            onArrowDown: moveCursorDown,
            onEscape: clearSelect
        });
    let _EntityController = GAME.EntityController(worldSettings, gameState);
    let _QuestController = GAME.QuestController(worldSettings, gameState)
    let _MarkupController = GAME.MarkupController(worldSettings, gameState);
    let _TaskController = GAME.TaskController(worldSettings, gameState)
    let _TimeController = GAME.TimeController(worldSettings, gameState, 
        {
            onSeasonChange: handleSeasonChange,
            onYearChange: handleYearChange
        });







    function createWorld(settings) {
        //setup world
        createTiles(settings);
        createEntities();
        createQuests();

        // setup eventlisteners
        canvas.onclick = handleMouseClick;
        canvas.onmousemove = handleMouseMove;

        // start timer
        timeTicker();
    }

    function consoleLog(msg){
        console.log("clog: ", msg)
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
    function createEntities(){
        const allEntities = _EntityController.createEntities();

    }

    function createQuests(){
        const allQuest = _QuestController.createQuests();
        _QuestController.assignAllQuestsFromList(allQuest);

    }

    function handleSeasonChange(){
        _MarkupController.renderTimeBar();
    }
    function handleYearChange(){
        _MarkupController.renderTimeBar()
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


    // selection
    function handleMouseClick(e) {
        let cursor = new _TileController.Cursor(e.offsetX, e.offsetY);
        let tile = getTileFromCursor(cursor);
        handleSelectTile(tile)
    }
    function isDefined(thing){
        if (typeof thing != 'undefined'){
            return true;
        } else {
            return false;
        }
    }
    function clearSelect(){
        gameState.currentSelectTile = [];
        _MarkupController.clearSelectTileDOM()
        // _MarkupController.clearSelectEntityDOM()
    }
    function handleSelectTile(tile) {
        console.log("handle select tile:", tile)
        if(isDefined(tile)){
            clearSelect();
            tile.select(gameState);
        }

        let autoSelect = true; // move to some kind of user-seetings
        if(isDefined(tile) && autoSelect){ 
            autoSelectTileEntity(tile)
        }
        
    }
    function autoSelectTileEntity(tile){
        let tileFirstEntity = _TileController.getFirstTileEntity(tile);
        if(isDefined(tileFirstEntity)){
            tileFirstEntity.select()

        }
    }

    function handleSelectEntity(entityList){
        console.log(entityList)
        // gameState.currentSelectEntity.push(entity);
    }

    // movement
    function moveCursorLeft(){
        gameState.currentSelectTile.forEach(oldTile => {
            let tileY = oldTile.y
            let oldX = oldTile.x
            let newX = oldX - 1
            let targetTile = gameState.tileMap[newX][tileY]
            handleSelectTile(targetTile)
        })
        if (gameState.currentSelectEntity.length > 0) {
            moveEntityLeft();
        }
    }
    function moveCursorRight(){
        gameState.currentSelectTile.forEach(oldTile => {
            let tileY = oldTile.y
            let oldX = oldTile.x
            let newX = oldX + 1
            let targetTile = gameState.tileMap[newX][tileY]
            handleSelectTile(targetTile)
        })
        if (gameState.currentSelectEntity.length > 0) {
            moveEntityRight();
        }
    }
    function moveCursorUp(){
        gameState.currentSelectTile.forEach(oldTile => {
            let tileX = oldTile.x
            let oldY = oldTile.y
            let newY = oldY - 1
            let targetTile = gameState.tileMap[tileX][newY]
            handleSelectTile(targetTile)
        })
        if (gameState.currentSelectEntity.length > 0) {
            moveEntityUp();
        }
    }
    function moveCursorDown(){
        gameState.currentSelectTile.forEach(oldTile => {
            let tileX = oldTile.x;
            let oldY = oldTile.y;
            let newY = oldY + 1;
            let targetTile = gameState.tileMap[tileX][newY];
            handleSelectTile(targetTile);
        })
        if (gameState.currentSelectEntity.length > 0) {
            moveEntityDown();
        }
    }

    function moveSelectX(dir, selectTileList) {
        selectTileList.forEach(oldTile => {
            let tileY = oldTile.y
            let oldX = oldTile.x
            let newX = oldX + dir
            let targetTile = gameState.tileMap[newX][tileY]
            
            handleSelectTile(targetTile)
        })
        if (gameState.currentSelectEntity.length > 0) {
            moveEntityUp();
        }
    }


    
    function moveEntityLeft(){
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.currentSelectEntity

        entitiesToMove.forEach(entity =>{
            entity.moveEntityX(-1, gameState)
        });

        // need to specify new select tile - entities to move have moved away from select tile. So if we want to continue moving we have to get new tile :D
        // moveSelectX(-1, gameState.currentSelectTile);

    }
    function moveEntityRight(){
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.currentSelectEntity

        entitiesToMove.forEach(entity =>{
            entity.moveEntityX(1, gameState)
        });

        // need to specify new select tile - entities to move have moved away from select tile. So if we want to continue moving we have to get new tile :D
        // moveSelectX(1, gameState.currentSelectTile);
    }
    function moveEntityUp(){
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.currentSelectEntity

        entitiesToMove.forEach(entity =>{
            
            entity.moveEntityY(-1, gameState)
        });

        // need to specify new select tile - entities to move have moved away from select tile. So if we want to continue moving we have to get new tile :D
        // moveSelectY(-1, gameState.currentSelectTile);
    }
    function moveEntityDown(){
        let relevantTiles = gameState.currentSelectTile;
        // let entitiesToMove = _TileController.getAllTileEntities(relevantTiles);
        let entitiesToMove = gameState.currentSelectEntity

        entitiesToMove.forEach(entity =>{
            console.log("move ENTITY down")

            entity.moveEntityY(1, gameState)
        });

        // need to specify new select tile - entities to move have moved away from select tile. So if we want to continue moving we have to get new tile :D
        // moveSelectY(1, gameState.currentSelectTile);
    }

    


    

    function update() {
        ctx.clearRect(0, 0, worldSettings.canvas.width, worldSettings.canvas.height);

        // keep track of entities
        gameState.TownEntityList.forEach(entity => {
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
            let drawColor = worldSettings.colors.tileFallback;
            let drawThumbnail = null;
            if(tile.inhibits.length > 0){    
                drawColor = tile.inhibits[0].displayColor
                drawThumbnail = tile.inhibits[0].thumbnail
            }
            tile.draw(worldSettings, drawColor, drawThumbnail);
        })

        gameState.currentHoverTile.forEach(tile => {
            if(isDefined(tile)){
                tile.draw(worldSettings, worldSettings.colors.mouseHover);
            }
        });

        gameState.currentSelectTile.forEach(tile => {
            tile.draw(worldSettings, worldSettings.colors.selectTile);
            
        })
        resetStateTurn()
        setTimeout(function () {
            animate()
        }, 56);
    }

    function gameTurn(){
        let entitiesToHandle = [];
        let tilesToHandle = gameState.activeEntityTile;

        tilesToHandle.forEach(tile=>{
            tile.inhibits.forEach(inhibitingEntity=>{
                entitiesToHandle.push(inhibitingEntity);
            });
        });    
        entitiesToHandle.forEach(activeEntity =>{
            activeEntity.handleTurn();
        });

    }
    

    function timeTicker(){
        gameTurn()
        setTimeout(function(){
            _TimeController.handleTimeTick();
            timeTicker()
        }, 50)
    }

    createWorld(worldSettings);






    
    let cStats = {}
    // _EntityController.createcreatureEntity(123123, {xPos: 8, yPos: 2, isPlayer:true}, cStats, worldSettings, gameState);
    let Town1 = _EntityController.createTownEntity(123123, {xPos: 1, yPos: 2}, cStats, worldSettings, gameState);
    _EntityController.createTownEntity(123123, {xPos: 8, yPos: 5}, cStats, worldSettings, gameState);
    // _EntityController.createCreatureEntity(123,{xPos: 2, yPos: 4},cStats, worldSettings, gameState)
    // _EntityController.createCreatureEntity(222,{xPos: 5, yPos: 5},cStats, worldSettings, gameState)
    // gameState.activeEntityTile
    

    let testSubject = gameState.creatureEntityList[0]
    let testTile = gameState.tileMap[1][8];
    let testTile2 = Town1.tile//gameState.tileMap[7][1];
    let testMovementTaskSettings = {
        type: 'movement',
        id: 123,
        entity: testSubject,
        targetTile: testTile
    }
    let testMovementTaskSettings2 = {
        type: 'movement',
        id: 124,
        entity: testSubject,
        targetTile: testTile2
    }

    let testMovementTask = _TaskController.getNewTask(testMovementTaskSettings)
    let testMovementTask2 = _TaskController.getNewTask(testMovementTaskSettings2)
    testSubject.addTask(testMovementTask)
    testSubject.addTask(testMovementTask2)
    
    // Town1.test()
    // gameState.activeEntityTile.push(gameState.tileMap[3][3]);
    

    animate();   
}






// canvas.onclick = animate;


