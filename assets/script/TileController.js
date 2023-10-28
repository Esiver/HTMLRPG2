GAME.TileController = function (settings, gameState) {

    const worldSettings = settings;
    let _MarkupController = GAME.MarkupController(settings);


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

        draw(worldSettings, color, thumbnail= null) {
            
            worldSettings.ctx.fillStyle = worldSettings.colors.tileFallback; // fallback
            if (typeof color != 'undefined'){
                worldSettings.ctx.fillStyle = color
            }

            worldSettings.ctx.fillRect(
                this.x * worldSettings.tileWidth, 
                this.y * worldSettings.tileHeight, 
                worldSettings.tileWidth, 
                worldSettings.tileHeight
            );
            if (thumbnail != null && typeof thumbnail != 'undefined') {
                this.drawImg(worldSettings, thumbnail)
            }
        }
        drawImg(worldSettings, imgPath){
            let thumbImage = new Image();
            thumbImage.src = imgPath;
            console.log(imgPath, "hej hej")
            worldSettings.ctx.drawImage(
                thumbImage,
                this.x * worldSettings.tileWidth, 
                this.y * worldSettings.tileHeight, 
                worldSettings.tileWidth, 
                worldSettings.tileHeight
            )
        }
        update(gameState){
            // update the tile, remove it from actileTileList if empty!
            this.checkStatus(gameState);
        }
        checkStatus(gameState){
            // removes a tile from the activeTile list if tile inhibits no entities.
            let isTileEmpty = this.inhibits.length == 0 ? true : false;
            
            if (isTileEmpty && gameState != void 0) {
                let indexToRemove = gameState.activeEntityTile.findIndex(activeTile => activeTile === this);
                if (indexToRemove !== -1){
                    gameState.activeEntityTile.splice(indexToRemove, 1);
                }  
            } else {
                
            }
        }
        select(gameState){
            console.log(`selecting (${this.inhibits.length}): `, this.inhibits)
            gameState.currentSelectTile.push(this);
            this.renderTileInhibitsDOM()
        }
        
        removeEntity(entity, gameState){
            this.inhibits = this.inhibits.filter(inhibitingEntity => inhibitingEntity != entity);
        }
        addEntity(entity, gameState){
            this.inhibits.push(entity);
            gameState.activeEntityTile.push(this);
        }
        getCreatureDisplayMarkupString(CreatureEntity){
            let html = `todo!`
            

            return html
        }
        getConstructDisplayMarkupString(constructionEntity){
            console.log("make display maekup")
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
        renderTileInhibitsDOM(){
            _MarkupController.renderTileInhibits(this.inhibits)

        }

    }
    
    
    class Cursor extends Point {
        constructor(x, y, ctx) {
            super(x, y);
        }
    }
    function getFirstTileEntity(tile){
        return tile.inhibits[0]
    }
    function getAllTileEntities(tileArray){
        let entityList = [];
        console.log(tileArray)
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

    function generateCurrentSelectDom(selectEntityList){
        selectEntityList.forEach(selectEntity=> {
            // selectEntity.
        })
    }
    


    this.initTile = initTile;
    this.Cursor = Cursor;
    this.getFirstTileEntity = getFirstTileEntity;
    this.getAllTileEntities = getAllTileEntities;

    return this;
}