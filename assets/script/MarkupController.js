GAME.MarkupController = function (settings) {



    function renderEntityMarker(entity){
        let inhibitsListItemDOM = document.createElement('li');
        let nameField = document.createElement('h4');
        let selectEntityBtn = document.createElement('button')

        nameField.innerText = entity.name;
        selectEntityBtn.innerText = 'select'
        
        selectEntityBtn.addEventListener('click', function selectEntityBtnClick(){
            entity.select()
            renderEntitySelect(entity);
            console.log(gameState)
        })

        inhibitsListItemDOM.append(nameField);
        inhibitsListItemDOM.append(selectEntityBtn);

        return inhibitsListItemDOM
    }
    function renderEntitySelect(){
        
        return 0;
    }


    this.renderEntityMarker = renderEntityMarker;
    this.renderEntitySelect = renderEntitySelect;

    return this;
}