GAME.MarkupController = function (settings, gameState) {

    const userHoverEntityContainerSelector = "#hover-container";
    const userSelectEntityContainerSelector = "#hover-container";

    const domClass = {
        button:'button', 
        buttonText:'button__text',

        entityStatList : 'entity__stat-list',
        entityStatItem: 'entity__stat-item',

        tileSelectItem: 'select__list-item',
        tileSelectItemActive: 'active',


        
    }
    const domSelect = {
        userEntitySelectContainerSelector:"#entity-select-list",
        userTileSelectContainerSelector: "#tile-select-list",
        timebarYear: "#time-year",
        timebarSeason: "#time-season",
        timebarDay: "#time-day"

    }
    function placeMarkup(markup,destination){

    }
    function clearContainer(containerSelector){
        let container = document.querySelector(containerSelector)
        let containerNodes = container != null ? container.childNodes : null;
        if(containerNodes != null && containerNodes.length > 0){
            let nodeArray = Array.from(containerNodes);
            nodeArray.forEach(node=>node.remove());
        }
    }
    function clearSelectTileDOM(){
        clearContainer(domSelect.userTileSelectContainerSelector);
    }
    function clearSelectEntityDOM(){
        clearContainer(domSelect.userEntitySelectContainerSelector)
    }

    function renderTileInhibits(entityList) {
        entityList.forEach(entity => {
            renderTileSelect(entity);
        });
    }

    function getButton(buttonSettings={buttonText:'click', buttonClickCallback: null}){
        let buttonDOM = document.createElement('a');
        let buttonTextDOM = document.createElement('span');
        buttonDOM.classList.add(domClass.button)
        buttonTextDOM.classList.add(domClass.buttonText);

        buttonTextDOM.innerHTML = buttonSettings.buttonText;
        if (buttonSettings.buttonClickCallback != null) {
            buttonDOM.addEventListener('click', buttonSettings.buttonClickCallback);
        }
        buttonDOM.append(buttonTextDOM);

        return buttonDOM
    }
    function renderTileSelect(entity){
        let inhibitsListItemDOM = document.createElement('li');
        let nameField = document.createElement('h4');
        let buttonClickCallback = function selectEntityBtnClick(){
            // tilføj til valgte
            // rendér liste af valgte 
            entity.select();
            // updateEntitySelectListDOM();
            console.log("now selected entities: ", gameState.currentSelectEntity)
        }

        let selectEntityButton = getButton({buttonText: 'select', buttonClickCallback: buttonClickCallback});
        
        nameField.innerText = entity.name;

        inhibitsListItemDOM.classList.add(domClass.tileSelectItem)

        inhibitsListItemDOM.append(nameField);
        inhibitsListItemDOM.append(selectEntityButton);

        document.querySelector(domSelect.userTileSelectContainerSelector).append(inhibitsListItemDOM);
    }
    
    function updateEntitySelectListDOM(){
        let entitiesToRender = gameState.currentSelectEntity;
        clearSelectEntityDOM();
        entitiesToRender.forEach(entity=> {
            console.log("rendering:" , entity)
            renderEntitySelect(entity);
        })
    }
    function handleSelectEntityClearButton(){
        gameState.clearSelectEntityList();
        clearSelectEntityDOM();
        updateEntitySelectListDOM();
    }
    function getTaskListDOM(entity){
        let taskListDOM = document.createElement('ul');

        if(typeof entity.taskList != 'undefined' || entity.taskList.length == 0){
            entity.taskList.forEach(task => {
                let taskItemDOM = document.createElement('li');
                taskListDOM.innerHTML = task.constructor.name;
                taskListDOM.append(taskItemDOM);
            })
        }
        
        return taskListDOM
    }
    function renderEntitySelect(entity){
        let entitySelectDOM = document.createElement('li');
        let entityPortraitDOM = document.createElement('img');
        let entityNameDOM = document.createElement('h3');
        let entityStatListDOM = document.createElement('ul');
        let entityWealthDOM = document.createElement('li');
        let entityTaskListDOM = getTaskListDOM(entity);
        let buttonClickCallback = handleSelectEntityClearButton;
        let entityUnselectButtonDOM = getButton({buttonText:'Clear', buttonClickCallback:buttonClickCallback})
        
        entitySelectDOM.classList.add(domClass.tileSelectItem)

        entityPortraitDOM.setAttribute('src', entity.getEntityPortrait())
        entityNameDOM.innerHTML = entity.name;
        entityWealthDOM.innerHTML = 'Wealth: '+entity.wealth;
        
        entitySelectDOM.append(entityPortraitDOM)
        entitySelectDOM.append(entityNameDOM);
        entitySelectDOM.append(entityStatListDOM)
        entityStatListDOM.append(entityWealthDOM);
        entitySelectDOM.append(entityTaskListDOM)
        entitySelectDOM.append(entityUnselectButtonDOM)

        document.querySelector(domSelect.userEntitySelectContainerSelector).append(entitySelectDOM);

        return 0;
    }

    function renderTimeBar(){
        let timebarYear = document.querySelector(domSelect.timebarYear);
        let timebarSeason = document.querySelector(domSelect.timebarSeason);
        
        timebarYear.innerHTML = 'year '+gameState.timeObject.year;
        console.log(gameState.timeObject)
        timebarSeason.innerHTML = ' - '+gameState.timeObject.seasonName;
    }

    this.renderTimeBar = renderTimeBar;
    this.clearSelectEntityDOM = clearSelectEntityDOM;
    this.clearSelectTileDOM = clearSelectTileDOM;
    this.renderTileInhibits = renderTileInhibits;
    this.renderEntityMarker = renderTileSelect;
    this.renderEntitySelect = renderEntitySelect;
    this.updateEntitySelectListDOM = updateEntitySelectListDOM;

    return this;
}