GAME.DialogueController = function (settings, gameState) {

    let _MarkupController = GAME.MarkupController(settings, gameState);

    function init(){
        console.log('... Init Dialogue Controller.');
        getGameDialogueFromDialogueList(settings.jsonData.dialogue.dialogue)
    };

    class Dialogue {
        constructor(id,entry,response,children){
            this.id = id;
            this.entry = entry;
            this.response = response;
            this.children = children;
            this.entity = null;
            
        }
        
        getDialogueFromId(dialogueId){
            let dialogueArray = gameState.dialogueList; //settings.jsonData.dialogue.dialogue;
            return dialogueObj = dialogueArray.find(obj => obj.id === dialogueId);
        }
    }

    function getGameDialogueFromDialogueList(dialogueListRaw){
        dialogueListRaw.forEach(object => {
            let dialogueObject = new Dialogue(
                object.id,
                object.entry, 
                object.response, 
                object.children
            );
            gameState.dialogueList.push(dialogueObject);
        });
    }
    function getSpeechObject(json){

        let speechObject = {
            speech: ['lol','hehe'],
            options: 2
        }

        // entry : "hej",
        // id: 8,
        // response : "godaw du",
        // actions: [9, 32]

        return speechObject
    }



    init();

    return this;
}