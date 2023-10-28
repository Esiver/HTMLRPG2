GAME.EntityController = function (worldSettings,gameState){
    const settings = worldSettings;

    let _MarkupController = GAME.MarkupController(worldSettings);
    let _TaskController = GAME.TaskController(worldSettings, gameState)

    class Entity {
        constructor(id, tile, entitySettings){
            this.id = id;
            this.tile = tile;
            this.name = name;
            this.color;
            this.isPlayer = entitySettings != void 0 ? entitySettings.isPlayer : false;
            this.taskList = [];
            this.inventory = [];
            
            
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
            this.moveEntityX(movementVectorX) // move diagonally?
        }

        finishTask(task){
            this.removeTask(task);
        }
        getDialogueEntryString(){
            let string = '...';
            // if(this.dialogue)
            if(isDefined(this.dialogue) && this.dialogue.entry.length > 0){
                string = this.dialogue.entry
            }
            
            return string;
        }
        getDialogueChildrenRefList(){
            let childList = []
            if(isDefined(this.dialogue)){
                console.log('lol', this.dialogue)
                this.dialogue.childrenRefs.forEach(childId => {
                    childList.push(getMatchingDialogueFromId(childId))
                })
            }
            return childList;
        }
        getEntityDialogueObject(dialogueId){
            let dialogueObject = getMatchingDialogueFromId(dialogueId);
            
            return dialogueObject;
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
            if (typeof entitySettings != 'undefined'){
                
                this.portrait = '/assets/img/' + entitySettings.portraitImage;
                this.thumbnail = '/assets/img/' + entitySettings.thumbnailImage;    
            } else {
                this.portrait = '/assets/img/aleph.png';
                this.thumbnail = '/assets/img/aleph.png';
                
            }
            this.name = entitySettings.name;
            this.age = entitySettings.age;
            this.wealth = entitySettings.wealth;
            this.isPlayer = entitySettings.isPlayer;
            this.homeTile = tile;   
            this.dialogue = entitySettings.dialogue;
        }
        getGoHomeTask(){
            let taskSettings = {
                id: this.id + '-movement',
                type:'movement',
                entity: this,
                targetTile: this.homeTile
            }
            let goHomeTask = _TaskController.getNewTask(taskSettings);

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
            this.id = id;
            this.tile = tile;
            if (typeof entitySettings != 'undefined'){
                
                this.portrait = '/assets/img/' + entitySettings.portraitImage;
                this.thumbnail = '/assets/img/' + entitySettings.thumbnailImage;    
            } else {
                this.portrait = '/assets/img/aleph.png';
                this.thumbnail = '/assets/img/aleph.png';
                
            }
            this.population = entitySettings.population;
            this.wealth = entitySettings.wealth;
            this.estYear = gameState.timeObject.year ;
            this.mayor = entitySettings.mayor;
            this.resources = entitySettings.resources;
        }
        handleSeasonChange(){

        }
        handleIdle(){
            // town does nothing on idle
            // this.produceWealth()
        }
        produceWealth(){
            console.log('produce wealth');
        }
        
    }

    function moveEntity(Entity, toTile){

    }

    function createEntities(entityJSON = worldSettings.jsonData.entityList){
        
        let jsonEntityList = entityJSON//.entityList
        let entityList = [];
        
        jsonEntityList.forEach(entityJSON => {
            let entity = null;
            let entityType = entityJSON.type
            switch (entityType) {
                case 'creature':
                    entity = createCreatureEntity(entityJSON)
                    break;
                case 'town':
                    
                    entity = createTownEntity(entityJSON)
                    break;
                default:
                    break;
            }
            if (entity != null) {
                entityList.push(entity);
            } else {
                console.warn('Entity not setup properly - couldnt create entity Object ');
            }

        });
        
        
        return entityList;
    }
    function createUnitEntity(settings){

    };
    function rollTownStats(entityJSON){
        // let baseStatsObj = worldSettings.jsonData.entityBase[entityJSON.class].stats;

        return {gold: 10, population: 1000};
    }
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
    function getEntityDialogueObjectList(entityJson){
        let dialogueObj = null;
        
        let entityBase = worldSettings.jsonData.entityBase;
        let soldierBase = entityBase.soldier;
        let peasantBase = entityBase.peasant;
        let sageBase = entityBase.sage;
        
        let dialogueId = entityJson.dialogue;
        dialogueObj = getMatchingDialogueFromId(dialogueId[0]);
        
        // switch (classType) {
        //     case 'peasant':
                
        //         dialogueObj = {
        //             start: peasantBase.dialogue.start,
        //             exit: peasantBase.dialogue.exit
        //         }
        //         break;
        //     case 'soldier':
        //         break;
        //     case 'sage':
        //         break;
        //     default:
        //         break;
        // }

        return dialogueObj
    }
    function getMatchingDialogueFromId(dialogueId){
        let dialogueArray = gameState.dialogueList; //settings.jsonData.dialogue.dialogue;
        return dialogueObj = dialogueArray.find(obj => obj.id === dialogueId);
    }

    function getEntityPortrait(entityJSON){
        let portraitImage = 'default_portrait.png'
        if (typeof entityJSON.portraitImage != 'undefined'){
            portraitImage = entityJSON.portraitImage;
        }
        return portraitImage;
    }
    function getEntityThumbnail(entityJSON){
        let thumbnailImage = 'default_thumbnail.png'
        console.log("HEHE",entityJSON)
        if (typeof entityJSON.thumbnailImage != 'undefined'){
            thumbnailImage = entityJSON.thumbnailImage;
        }
        return thumbnailImage;
    }
    function createCreatureEntity(entityJSON){
        // prepare creature for game.

        let entityId = entityJSON.id;
        let name = entityJSON.name;
        let xPos = entityJSON.homeTile[0]; 
        let yPos = entityJSON.homeTile[1];
        let statObj = {wealth: 1, age: 1};
        let entityClass = entityJSON.class;

        let portraitImage = getEntityPortrait(entityJSON)//'defaultPortrait.png'; 
        let thumbnailImage = getEntityThumbnail(entityJSON);//'defaultThumbnail.png';
        console.log("HAHA", thumbnailImage, entityJSON)

        let dialogueObj;
        
        statObj = rollCreatureStats(entityJSON);
        dialogueObj = getEntityDialogueObjectList(entityJSON);

        let entitySettingsObject = {
            id: entityId,
            name : name,
            stats:statObj,
            wealth: 1,
            age: 1,
            portraitImage: portraitImage,
            thumbnailImage: thumbnailImage,
            displayColor: worldSettings.colors.unitEntity,
            isPlayer: true,
            dialogue: dialogueObj,
            homeTile: gameState.tileMap[xPos][yPos]
        };
        
        let newCreatureEntityObject = new Creature(entityId, gameState.tileMap[xPos][yPos], entitySettingsObject)

        if (typeof newCreatureEntityObject.tile != 'undefined'){
            newCreatureEntityObject.tile.inhibits.push(newCreatureEntityObject);

            gameState.addActiveEntityTile(newCreatureEntityObject.tile);
            gameState.creatureEntityList.push(newCreatureEntityObject);
        }
        
    }
    function createTownEntity(entityJSON){
        let entityId = entityJSON.id;
        let name = entityJSON.name;
        let xPos = entityJSON.homeTile[0]; 
        let yPos = entityJSON.homeTile[1];
        
        let statObj = rollTownStats(entityJSON);
        let portraitImage = getEntityPortrait(entityJSON)//'defaultPortrait.png'; 
        let thumbnailImage = getEntityThumbnail(entityJSON);//'defaultThumbnail.png';

        if (typeof entityJSON.thumbnailImage != 'undefined'){
            thumbnailImage = entityJSON.thumbnailImage;
        }
        
        if (typeof entityJSON.portraitImage != 'undefined'){
            portraitImage = entityJSON.portraitImage;
        }
        
        let entitySettingsObject = {
            id: entityId,
            name: name,
            portraitImage: portraitImage,
            thumbnailImage: thumbnailImage,
            population : 1,
            wealth: 1,
            estYear: 1,
            mayor: "harry",
            resources : {
                grain : 1,
                stone : 1,
                iron : 1,
            },
            homeTile: gameState.tileMap[xPos][yPos]

        }
        let newTownEntityObject = new Town(entityId, gameState.tileMap[xPos][yPos], entitySettingsObject);

        if (typeof newTownEntityObject.tile != 'undefined') {
            newTownEntityObject.tile.inhibits.push(newTownEntityObject);
            gameState.activeEntityTile.push(newTownEntityObject.tile)
            gameState.TownEntityList.push(newTownEntityObject);
        }

        return newTownEntityObject;
    }

    function isDefined(thing){
        if (typeof thing != 'undefined'){
            return true;
        } else {
            return false;
        }
    }
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    this.createEntities = createEntities;
    this.createTownEntity = createTownEntity;
    this.createCreatureEntity = createCreatureEntity;
    this.createUnitEntity = createUnitEntity;
    this.moveEntity = moveEntity;

    return this;
}