GAME.MarkupController = function (settings, gameState) {

    const userHoverEntityContainerSelector = "#hover-container";
    const userSelectEntityContainerSelector = "#hover-container";

    const domClass = {button:'button', buttonText:'button__text'}
    const domSelect = {
        userHoverEntityContainerSelector:"#hover-container",
        userSelectEntityContainerSelector: "#hover-container"
    }

    function placeMarkup(markup,destination){

    }
    function clearContainer(containerSelector){
        let container = document.querySelector(containerSelector)
        let containerNodes = container.childNodes;
        if(containerNodes.length > 0 && containerNodes != null){
            let nodeArray = Array.from(containerNodes);
            nodeArray.forEach(node=>node.remove());
        }
    }
    function clearSelect(){
        // let selectContainer = document.querySelector(userHoverEntityContainerSelector);
        // let selectNodes = selectContainer.childNodes;

        // if (selectNodes.length > 0 && selectNodes != null) {
        //     let nodeArray = Array.from(selectNodes);
        //     nodeArray.forEach(node=>node.remove());
        // }
        clearContainer(domSelect.userSelectEntityContainerSelector);
    }
    function clearHover(){
        // let hoverContainer = document.querySelector(domSelect.hoverContainer);
        // let hoverNodes = hoverContainer.childNodes;

        // if (hoverNodes.length > 0 && hoverNodes != null) {
        //     let nodeArray = Array.from(selectNodes);
        //     nodeArray.forEach(node=>node.remove());
        // } 
    }

    function renderTileInhibits(entityList) {
        entityList.forEach(entity => {
            renderEntityMarker(entity);
        });
    }

    function getButton(buttonSettings){
        let buttonDOM = document.createElement('a');
        let buttonTextDOM = document.createElement('span');
        buttonDOM.classList.add(domClass.button)
        buttonTextDOM.classList.add(domClass.buttonText);

        buttonTextDOM.innerHTML = buttonSettings.buttonText;
        buttonDOM.addEventListener('click', buttonSettings.buttonClickCallback);
        buttonDOM.append(buttonTextDOM);

        return buttonDOM
    }
    function renderEntityMarker(entity){
        let inhibitsListItemDOM = document.createElement('li');
        let nameField = document.createElement('h4');
        let buttonClickCallback = function selectEntityBtnClick(){
            renderEntitySelect(entity);
            entity.select();
        }
        let selectEntityButton = getButton({buttonText: 'select', buttonClickCallback: buttonClickCallback})//document.createElement('button')
        
        nameField.innerText = entity.name;

        inhibitsListItemDOM.append(nameField);
        inhibitsListItemDOM.append(selectEntityButton);

        document.querySelector(userHoverEntityContainerSelector).append(inhibitsListItemDOM);
    }
    function renderEntitySelect(entity){
        let entitySelectDOM = document.createElement('li');
        let entityNameDOM = document.createElement('h3');

        entityNameDOM.innerHTML = entity.name

        entitySelectDOM.append(entityNameDOM);
        console.log(document.querySelector(domSelect.userSelectEntityContainerSelector))
        document.querySelector(domSelect.userSelectEntityContainerSelector).append(entitySelectDOM);
        return 0;
    }

    this.clearHover = clearHover;
    this.clearSelect = clearSelect;
    this.renderTileInhibits = renderTileInhibits;
    this.renderEntityMarker = renderEntityMarker;
    this.renderEntitySelect = renderEntitySelect;

    return this;
}