GAME.MarkupController = function (settings, gameState) {

    const userHoverEntityContainerSelector = "#hover-container";
    const userSelectEntityContainerSelector = "#hover-container";

    const domClass = {
        button:'button', 
        buttonText:'button__text',

        entityStatList : 'entity__stat-list',
        entityStatItem: 'entity__stat-item',
        entityProfileContainer: 'entity__profile',
        entityPortraitWrapper: 'entity__portrait-wrapper',
        entitySpeech: 'entity__speech-bubble',


        dialogueList: 'dialogue__list',
        dialogueOption: 'dialogue__list-item',
        dialogueOptionNull: 'null-option',
        dialogueText : 'dialogue__text',

        tileSelectItem: 'select__list-item',
        tileSelectItemActive: 'active',
        
    }
    const domSelect = {
        userEntitySelectContainerSelector:"#entity-select-list",
        userTileSelectContainerSelector: "#tile-select-list",

        timebarYear: "#time-year",
        timebarSeason: "#time-season",
        timebarDay: "#time-day",

        enititySpeech: `.${domClass.entitySpeech}`,

        dialogueList: `.${domClass.dialogueList}`

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
    function getDialogue(dialogueObject){
        let dialogueDOM = document.createElement("div");
        dialogueDOM.innerText = "xD"
        console.log("GET DIALOGUE", dialogueObject )
        return dialogueDOM;
    }
    function getEntityDialogueOptionListDOM(dialogueOptionObjectList){
        let dialogueListDOM = document.createElement('ul');
        dialogueListDOM.classList.add(domClass.dialogueList);

        if(isDefined(dialogueOptionObjectList)) {
            dialogueOptionObjectList.forEach(dialogueObject => {
                let dialogueOptionDOM = getDialogueOptionDOM(dialogueObject);
                dialogueListDOM.append(dialogueOptionDOM)
            })

        } else {
            renderNoDialogueOptions()

        }

        return dialogueListDOM
    }

    function getDialogueOptionDOM(dialogueObject) {
        let dialogueOptionDOM = document.createElement('a');
        let text = "...";
        if (isDefined(dialogueObject) && isDefined(dialogueObject.entry)) {
            text = dialogueObject.entry;

            dialogueOptionDOM.addEventListener('click', function handleDialogueOptionClick(){
                let dialogueOptionResponse = dialogueObject.response;
                let dialogueChildrenRefs = dialogueObject.childrenRefs;
                let dialogueChildrenObjectList = [];
                let parentNodeList = this.parentNode;
                
                if (isDefined(dialogueChildrenRefs) && dialogueChildrenRefs != null) {
                    dialogueChildrenRefs.forEach(id => {
                        let dialogueChildObject = dialogueObject.getDialogueFromId(id);
                        dialogueChildrenObjectList.push(dialogueChildObject);
                    })    
                } else {
                    renderNoDialogueOptions();
                }
                
                renderDialogueText(dialogueOptionResponse);
                renderDialogueOptions(parentNodeList, dialogueChildrenObjectList);
            })
        } else {
            return null
        }

        dialogueOptionDOM.innerText = text;
        dialogueOptionDOM.classList.add(domClass.dialogueOption);

        
        
        return  dialogueOptionDOM
    }
    function renderDialogueText(text){
        let speechBubble = document.querySelector(domSelect.enititySpeech);
        speechBubble.innerText = text;
        
    }
    function renderDialogueOptions(container, dialogueObjectList){
        container.innerText = "";
    
        dialogueObjectList.forEach(dialogueObject => {
            let updatedDialogueOptionDOM = getDialogueOptionDOM(dialogueObject);
            if(updatedDialogueOptionDOM != null){
                container.append(updatedDialogueOptionDOM)
            } 
        })

    }
    function renderNoDialogueOptions(){
        document.querySelector(domSelect.dialogueList).remove();
    }

    function renderTileSelect(entity){
        let inhibitsListItemDOM = document.createElement('li');
        let nameField = document.createElement('h4');
        let buttonClickCallback = function selectEntityBtnClick(){
            entity.select();
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

        if(isDefined(entity.taskList)  || entity.taskList.length == 0){
            entity.taskList.forEach(task => {
                let taskItemDOM = document.createElement('li');
                taskListDOM.innerHTML = task.constructor.name;
                taskListDOM.append(taskItemDOM);
            })
        }
        
        return taskListDOM
    }
    function renderEntitySelect(entity){
       // declaring 
        let entitySelectDOM = document.createElement('li');

        let entityProfileContainerDOM = document.createElement('div');

        let entityPortraitWrapperDOM = document.createElement('div');
        let entityPortraitDOM = document.createElement('img');
        let entitySpeechDOM = document.createElement('div');

        let entityNameDOM = document.createElement('h3');
        let entityStatListDOM = document.createElement('ul');
        let entityWealthDOM = document.createElement('li');
        
        let entityDialogueOptionList = entity.getDialogueChildrenRefList()
        let entityDialogueOptionListDOM = getEntityDialogueOptionListDOM(entityDialogueOptionList);
        let entityTaskListDOM = getTaskListDOM(entity);
        let buttonClickCallback = handleSelectEntityClearButton; // todo: redo?
        let entityUnselectButtonDOM = getButton({buttonText:'Leave', buttonClickCallback:buttonClickCallback})
        
        //classes
        entitySelectDOM.classList.add(domClass.tileSelectItem);
        entityProfileContainerDOM.classList.add(domClass.entityProfileContainer);
        entityPortraitWrapperDOM.classList.add(domClass.entityPortraitWrapper);
        entitySpeechDOM.classList.add(domClass.entitySpeech);

        // attributes & values
        entityPortraitDOM.setAttribute('src', entity.getEntityPortrait());
        entityNameDOM.innerHTML = entity.name;
        entityWealthDOM.innerHTML = 'Wealth: ' + entity.wealth;
        entitySpeechDOM.innerHTML = entity.getDialogueEntryString();

        // appending
        entityPortraitWrapperDOM.append(entityPortraitDOM)
        entityPortraitWrapperDOM.append(entitySpeechDOM)

        entityProfileContainerDOM.append(entityNameDOM);
        entityProfileContainerDOM.append(entityPortraitWrapperDOM);
        entityProfileContainerDOM.append(entityStatListDOM);        

        entitySelectDOM.append(entityProfileContainerDOM);
        entitySelectDOM.append(entityTaskListDOM)
        entitySelectDOM.append(entityDialogueOptionListDOM)
        entitySelectDOM.append(entityUnselectButtonDOM)

        document.querySelector(domSelect.userEntitySelectContainerSelector).append(entitySelectDOM);
        

        return 0;
    }

    function renderTimeBar(){
        let timebarYear = document.querySelector(domSelect.timebarYear);
        let timebarSeason = document.querySelector(domSelect.timebarSeason);
        
        if(isDefined(gameState) && isDefined(gameState.timeObject)){
            timebarYear.innerHTML = 'year '+gameState.timeObject.year;
            timebarSeason.innerHTML = ' - '+gameState.timeObject.seasonName;
        }
        
    }

    function isDefined(thing){
        if (typeof thing != 'undefined'){
            return true;
        } else {
            return false;
        }
    }

    this.getDialogue = getDialogue;
    this.renderTimeBar = renderTimeBar;
    this.clearSelectEntityDOM = clearSelectEntityDOM;
    this.clearSelectTileDOM = clearSelectTileDOM;
    this.renderTileInhibits = renderTileInhibits;
    this.renderEntityMarker = renderTileSelect;
    this.renderEntitySelect = renderEntitySelect;
    this.updateEntitySelectListDOM = updateEntitySelectListDOM;

    return this;
}