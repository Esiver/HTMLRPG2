GAME.EntityController = function (settings){

    class Entity {
        constructor(id, tile, entitySettings){
            this.id = id;
            this.tile = tile;
            this.name = name;
            this.color;
            this.isPlayer = entitySettings != void 0 ? entitySettings.isPlayer : false;
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
        moveEntityX(dir, gameState){
            let entitySelf = this;
            let currentTile = this.tile;
            let currentCoordinateX = currentTile.x;
            let currentCoordinateY = currentTile.y

            let targetCoordinateX = currentCoordinateX + dir;
            let targetTile = gameState.tileMap[targetCoordinateX][currentCoordinateY]


            // remove self from current tile
            console.log(currentTile,`move from ${currentCoordinateX} to ${targetCoordinateX}`)
            // currentTile.x = targetCoordinateX
            this.tile = targetTile;

            currentTile.removeEntity(entitySelf, gameState);
            targetTile.addEntity(entitySelf, gameState);
            currentTile.update()
            targetTile.update();
            // console.log(currentTile, targetTile)
            // currentTile.inhibits.filter()
            // currentTile.inhibits.forEach((inhibitingEntity, index) => {

            //     if(entitySelf == inhibitingEntity) {
            //         console.log('its me!')
            //     }
            // });
            // targetTile.inhibits.push(this)

        }
        moveEntity(toTile, gameState){
            console.log('moveEntity', toTile, this)
            toTile.inhibits.push(this)

        }
    }

    class Unit extends Entity {

    }
    class Immortal extends Entity {
        constructor(id,tile,entitySettings){
            super();
            this.id = id;
            this.tile = tile;
            this.displayColor = entitySettings.displayColor
            this.name = entitySettings.name;
            this.age = entitySettings.age;
            this.wealth = entitySettings.wealth;
            this.isPlayer = entitySettings.isPlayer;
        }
    }
    class Construction extends Entity {
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
    }

    function moveEntity(Entity, toTile){

    }

    function createUnitEntity(settings){

    };
    function createImmortalEntity (id, settings, stats, worldSettings, gameState){
        let xPos = settings.xPos;
        let yPos = settings.yPos;
        let entitySettingsObject = {
            name : "Zu Zhu",
            wealth: 1,
            age: 1,
            displayColor: "hotpink",
            isPlayer: true,
        };
        let newImmortalEntityObject = new Immortal(id, gameState.tileMap[xPos][yPos],entitySettingsObject)
        if (typeof newImmortalEntityObject.tile != 'undefined'){
            newImmortalEntityObject.tile.inhibits.push(newImmortalEntityObject);
            gameState.activeEntityTile.push(newImmortalEntityObject.tile);
            gameState.immortalEntityList.push(newImmortalEntityObject);
        }
        if(newImmortalEntityObject.isPlayer){

            gameState.playerEntity.push(newImmortalEntityObject);
            console.log('I AM ALIVE',newImmortalEntityObject)
        }
    }
    function createConstructionEntity(id, settings, stats, worldSettings, gameState){
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
        let newConstructionEntityObject = new Construction(id, gameState.tileMap[xPos][yPos], "Harry");

        if (typeof newConstructionEntityObject.tile != 'undefined') {
            newConstructionEntityObject.tile.inhibits.push(newConstructionEntityObject);
            gameState.activeEntityTile.push(newConstructionEntityObject.tile)
            gameState.constructionEntityList.push(newConstructionEntityObject);
        }
    }

    this.createConstructionEntity = createConstructionEntity;
    this.createImmortalEntity = createImmortalEntity;
    this.createUnitEntity = createUnitEntity;
    this.moveEntity = moveEntity;

    return this;
}