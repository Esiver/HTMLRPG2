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
        userTileSelectContainerSelector: "#tile-select-list"
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
            updateEntitySelectListDOM();
            // inhibitsListItemDOM.classList.add(domClass.tileSelectItemActive)
            
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
    function renderEntitySelect(entity){
        let entitySelectDOM = document.createElement('li');
        let entityNameDOM = document.createElement('h3');
        let entityStatListDOM = document.createElement('ul');
        let entityWealthDOM = document.createElement('li');
        let buttonClickCallback = handleSelectEntityClearButton;
        let entityUnselectButtonDOM = getButton({buttonText:'Clear', buttonClickCallback:buttonClickCallback})
        
        entityNameDOM.innerHTML = entity.name;
        entityWealthDOM.innerHTML = 'Wealth: '+entity.wealth;
        
        entitySelectDOM.append(entityNameDOM);
        entitySelectDOM.append(entityStatListDOM)
        entityStatListDOM.append(entityWealthDOM);
        entitySelectDOM.append(entityUnselectButtonDOM)

        document.querySelector(domSelect.userEntitySelectContainerSelector).append(entitySelectDOM);

        return 0;
    }


    this.clearSelectEntityDOM = clearSelectEntityDOM;
    this.clearSelectTileDOM = clearSelectTileDOM;
    this.renderTileInhibits = renderTileInhibits;
    this.renderEntityMarker = renderTileSelect;
    this.renderEntitySelect = renderEntitySelect;

    return this;
}