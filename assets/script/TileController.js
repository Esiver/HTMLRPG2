GAME.TileController = function (settings, game) {

    const worldSettings = settings;

    class Point {
        constructor(x, y, ctx) {
            this.x = x;
            this.y = y;
        }
    }

    class Tile extends Point {
        constructor(x, y, ctx, color, hoverColor, settings) {
            super(x, y, ctx);
            this.ctx = ctx
            this.color = color;
            this.hoverColor = hoverColor;
            this.inhibits = [];
            this.settings = settings;
        }

        draw(worldSettings, color) {
            
            worldSettings.ctx.fillStyle ="black"; // fallback
            worldSettings.ctx.fillStyle = color


            worldSettings.ctx.fillRect(
                this.x * worldSettings.tileWidth, 
                this.y * worldSettings.tileHeight, 
                worldSettings.tileWidth, 
                worldSettings.tileHeight
            );
        }
        update(gameState){
            // update the tile, remove it from actileTileList if empty!
            this.checkStatus(gameState);
        }
        checkStatus(gameState){
            // removes a tile from the activeTile list if tile inhibits no entities.
            let isTileEmpty = this.inhibits.length == 0 ? true : false;
            
            if (isTileEmpty && gameState != void 0) {
                console.log('isTileEmpty 。。。 ',gameState)
                let indexToRemove = gameState.activeEntityTile.findIndex(activeTile => activeTile === this);
                if (indexToRemove !== -1){
                    console.log("i want to splice!")
                    gameState.activeEntityTile.splice(indexToRemove, 1);
                }  
            } else {
                
            }
        }
        select(){
            console.log(`selecting (${this.inhibits.length}): `, this.inhibits)
            this.inhibits.forEach(entity => {
                this.displayTileInhibits(entity)
            });
        }
        removeEntity(entity, gameState){
            this.inhibits = this.inhibits.filter(inhibitingEntity => inhibitingEntity != entity);
            
            // this.inhibits = [];
            console.log('removeEntity: ')
        }
        addEntity(entity, gameState){
            this.inhibits.push(entity);
            gameState.activeEntityTile.push(this);
            console.log('adding entity');
            // console.log(gameState.activeEntityTile)
        }
        getImmortalDisplayMarkupString(immortalEntity){
            let html = `todo!`
            

            return html
        }
        getConstructDisplayMarkupString(constructionEntity){
            let html = `
            <div class="">
                <h2 class="entity-header">
                    Name
                </h2>
                <ul class="entity-info-list">
                    <li>wealth</li>
                    <li>population</li>
                </ul>
                
                
                ${constructionEntity.name}
            </div>            
            `
            return html
        }
        displayTileInhibits(entity){
            console.log('displayTileInhibits: ',entity.constructor.name)
            
            if (entity.constructor.name == 'Construction'){
                document.querySelector(this.settings.selectDom.name).innerHTML = this.getConstructDisplayMarkupString(entity)
            }
            if(entity.constructor.name == 'Immortal'){
                document.querySelector(this.settings.selectDom.name).innerHTML = this.getImmortalDisplayMarkupString(entity)

            }
        }
    }


    class Cursor extends Point {
        constructor(x, y, ctx) {
            super(x, y);
        }
    }

    function getAllTileEntities(tileArray){
        let entityList = [];
        
        tileArray.forEach(tile=>{
            tile.inhibits.forEach(entity=>{
                entityList.push(entity);
            })
        })

        return entityList;
    }

    function initTile(x, y, settings, ctx) {
        
        return new Tile(x, y, ctx, "blue", "red", settings)
    }

    


    this.initTile = initTile;
    this.Cursor = Cursor;
    this.getAllTileEntities = getAllTileEntities;

    return this;
}