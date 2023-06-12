GAME.QuestController = function (worldSettings, gameState) {

    let _MarkupController = GAME.MarkupController(worldSettings);
    
    class Quest {
        constructor(name, description){
            this.name = name;
            this.description = description
        }

        init(){
            console.log("init", this)
        }
    }

    function init(){
        console.log("init quest controller");
    }
    function assignAllQuestsFromList(questObjList){
        questObjList.forEach(quest => {
            
            switch (quest.start.type) {
                case 'entity':
                    assignQuestToEntity(quest);
                    break;
                case 'tile':
                    assignQuestToTile(quest);
                    break;
                default:
                    break;
            }
        });
    }
    function assignQuestToEntity(questObj){
        console.log(questObj.start.target)
        console.log(gameState.creatureEntityList) // cannot assign quests to entities before entities have been made!
        // need to make entity generator happen.
    }
    function assignQuestToTile(questObj){

    }
    function createQuestObject(questRaw){
        // // todo ?
        return questRaw
    }

    function createQuests(){
        let questJson = Array.from(worldSettings.jsonData.questList.questlist)
        let questList = [];
        for (let q = 0; q < questJson.length; q++) {
            let questObj = createQuestObject(questJson[q])
            questList.push(questObj)
        }
        
        return questList;
    }

    init();

    this.assignAllQuestsFromList = assignAllQuestsFromList
    this.createQuests = createQuests;
    return this;
} 