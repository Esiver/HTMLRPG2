GAME.EntityController = function (worldSettings,gameState){

    let _MarkupController = GAME.MarkupController(worldSettings);
    let _TaskController = GAME.TaskController(worldSettings, gameState)

    class Entity {
        constructor(id, tile, entitySettings){
            this.id = id;
            this.tile = tile;
            this.name = name;
            this.portrait = '/assets/img/emilmonster.png';
            this.thumbnail = '/assets/img/emilmonster.png';
            this.color;
            this.isPlayer = entitySettings != void 0 ? entitySettings.isPlayer : false;
            this.taskList = [];
            this.inventory = [];
            
            // if (entitySettings && entitySettings.isPlayer != void 0){
            //     this.isPlayer = entitySettings.isPlayer
            // } else {
            //     this.isPlayer = false
            // }

        };
        
        update() {

            // console.log(this)
        }

        handleChangeState(state, amount){

        }
        getEntityPortrait(){
            return this.portrait;
        }

        moveEntityX(dir=0){
            let entitySelf = this;
            let currentTile = this.tile;
            let currentCoordinateX = currentTile.x;
            let currentCoordinateY = currentTile.y

            let targetCoordinateX = currentCoordinateX + dir;
            let targetTile = gameState.tileMap[targetCoordinateX][currentCoordinateY]

            this.tile = targetTile;

            currentTile.removeEntity(entitySelf, gameState);
            targetTile.addEntity(entitySelf, gameState);
            currentTile.update()
            targetTile.update();
        }

        moveEntityY(dir){
            let entitySelf = this;
            let currentTile = this.tile;
            let currentCoordinateX = currentTile.x;
            let currentCoordinateY = currentTile.y

            let targetCoordinateY = currentCoordinateY + dir;
            let targetTile = gameState.tileMap[currentCoordinateX][targetCoordinateY]

            if (typeof targetTile != 'undefined'){
                this.tile = targetTile;

                currentTile.removeEntity(entitySelf, gameState);
                targetTile.addEntity(entitySelf, gameState);
                currentTile.update()
                targetTile.update();
            }

        }

        moveEntity(toTile, gameState){
            console.log('moveEntity', toTile, this)
            toTile.inhibits.push(this)

        }
        select(){
            // this is now our selected!
            if (!gameState.currentSelectEntity.some(entity => entity === this)){ // only if not already selected
                gameState.clearSelectEntityList()
                gameState.currentSelectEntity.push(this)

                _MarkupController.updateEntitySelectListDOM();
            }
        }
        handleTurn(){
            if ( this.taskList.length > 0) {
                this.handleTask(this.taskList[0])
            } else {
                this.handleIdle()
            }
        }
        addTask(task){
            this.taskList.push(task);
        }
        removeTask(task=null){
            if (task != null){
                let indexToRemove = this.taskList.indexOf(task)
                this.taskList.splice(indexToRemove, 1);
            }
        }
        handleTask(task){
            
            switch (task.constructor.name) {
                case 'MovementTask':
                    if (this.checkMovementTask(this, task)){
                        this.finishTask(task)
                    } else {
                        this.resolveMovementTask(task);
                    }
                    break;            
                default:
                    break;
            }
        }
        checkMovementTask(entity, movementTask){
            if (entity.tile == movementTask.targetTile){
                return true
            } else {
                return false
            }
        }
        resolveMovementTask(task){
            let currentX = this.tile.x;
            let currentY = this.tile.y;
            let targetX = task.targetTile.x;
            let targetY = task.targetTile.y;
            let movementVectorX, movementVectorY = 0;
            
            if (currentX > targetX){
                movementVectorX = -1;
            } else if (currentX < targetX) {
                movementVectorX = 1;
            }

            if (currentY > targetY){
                movementVectorY = -1;
            } else if (currentY  < targetY) {
                movementVectorY = 1;
            }
            this.moveEntityY(movementVectorY)
            this.moveEntityX(movementVectorX)
        }
        finishTask(task){
            this.removeTask(task)
        }

    }

    

    class Unit extends Entity {

    }
    class Monster extends Entity {

    }
    class Peasent extends Entity {

    }
    class Creature extends Entity {
        constructor(id,tile,entitySettings){
            super();
            this.id = id;
            this.tile = tile;
            this.displayColor = entitySettings.displayColor
            this.name = entitySettings.name;
            this.age = entitySettings.age;
            this.wealth = entitySettings.wealth;
            this.isPlayer = entitySettings.isPlayer;
            this.homeTile = tile;
        }
        getGoHomeTask(){
            let taskSettings = {
                id: this.id + '-movement',
                type:'movement',
                entity: this,
                targetTile: this.homeTile
            }
            let goHomeTask = _TaskController.getNewTask(taskSettings)
            return goHomeTask;
        }
        handleIdle(){
            // Creates go home on idle?
            if(this.tile != this.homeTile) {
                let idleTask = this.getGoHomeTask();                
                this.addTask(idleTask)
            }
            
        }
    }
    class Town extends Entity {
        constructor(id, tile, entitySettings){
            super();
            // population
            // population mood?
            // wealth
            // established year
            // mayor
            // resources
            // produces - uses
            this.id = id;
            this.tile = tile;
            this.population = entitySettings.population;
            this.wealth = entitySettings.wealth;
            this.estYear = entitySettings.estYear;
            this.mayor = entitySettings.mayor;
            this.resources = entitySettings.resources;
        }
        handleSeasonChange(){

        }
        handleIdle(){
            // town does nothing on idle
            
        }
        produceWealth(){
            console.log('produce wealth')
        }
        
    }

    function moveEntity(Entity, toTile){

    }
    function createEntities(entityJSON = worldSettings.jsonData.entityList){
        
        let jsonEntityList = entityJSON.entityList
        let entityList = [];
        
        jsonEntityList.forEach(entityJSON => {
            let entity = null;

            let eId = entityJSON.id
            let name = entityJSON.name;
            let x = entityJSON.homeTile[0]; let y = entityJSON.homeTile[1];
            let posObj = {xPos: x, yPos: y};
            let entityType = entityJSON.type
            let statObj = {}

            console.log(1123,entityJSON)

            switch (entityType) {
                case 'creature':
                    statObj = rollCreatureStats(entityJSON);
                    let entityClass = entityJSON.class;
                    let entityObj = {
                        id: eId,
                        name:name,
                        type:entityType,
                        posObj:posObj,
                        statObj:statObj,
                        class: entityClass
                    }
                    entity = createCreatureEntity(entityObj)
                    console.log('entity:', entityObj)
                    break;
                case 'town':
                    console.log('--- should create town entity')
                    break;
                default:
                    break;
            }
 
            entityList.push(entity);

        });
        
        
        return entityList;
    }
    function createUnitEntity(settings){

    };
    function rollCreatureStats(entityJSON){
        let baseStatsObj = worldSettings.jsonData.entityBase[entityJSON.class].stats

        let baseBody = baseStatsObj.body;
        let baseMind = baseStatsObj.mind;
        let baseSoul = baseStatsObj.soul;
        
        let bodyStat = baseBody +  randomIntFromInterval((baseBody*0.25)*-1,baseBody*0.25);
        let mindStat = baseMind + randomIntFromInterval((baseMind*0.25)*-1,baseMind*0.25);
        let soulStat = baseSoul + randomIntFromInterval((baseSoul*0.25)*-1,baseSoul*0.25);
        
        return {body: bodyStat, mind: mindStat, soul: soulStat};
    }
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
      
    function createCreatureEntity (entityObj){
        console.log(99,entityObj)
        let xPos = entityObj.posObj.xPos;
        let yPos = entityObj.posObj.yPos;

        let entitySettingsObject = {
            name : entityObj.name,
            wealth: 1,
            age: 1,
            displayColor: worldSettings.colors.unitEntity,
            isPlayer: true,
        };
        let newCreatureEntityObject = new Creature(entityObj.id, gameState.tileMap[xPos][yPos], entitySettingsObject)
        if (typeof newCreatureEntityObject.tile != 'undefined'){
            newCreatureEntityObject.tile.inhibits.push(newCreatureEntityObject);

            gameState.addActiveEntityTile(newCreatureEntityObject.tile);
            gameState.creatureEntityList.push(newCreatureEntityObject);
        }
        if(newCreatureEntityObject.isPlayer){

            // gameState.playerEntity.push(newCreatureEntityObject);
            console.log('I AM ALIVE',newCreatureEntityObject)
        }
    }
    function createTownEntity(id, settings, stats, worldSettings, gameState){
        let xPos = settings.xPos;
        let yPos = settings.yPos;
        let entitySettingsObject = {
            population : 1,
            wealth: 1,
            estYear: 1,
            mayor: "harry",
            resources : {
                grain : 1,
                stone : 1,
                iron : 1,
            }
        }
        let newTownEntityObject = new Town(id, gameState.tileMap[xPos][yPos], "Harry");

        if (typeof newTownEntityObject.tile != 'undefined') {
            newTownEntityObject.tile.inhibits.push(newTownEntityObject);
            gameState.activeEntityTile.push(newTownEntityObject.tile)
            gameState.TownEntityList.push(newTownEntityObject);
        }

        return newTownEntityObject;
    }

    this.createEntities = createEntities;
    this.createTownEntity = createTownEntity;
    this.createCreatureEntity = createCreatureEntity;
    this.createUnitEntity = createUnitEntity;
    this.moveEntity = moveEntity;

    return this;
}