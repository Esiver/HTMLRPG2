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

    function createQuests(questJson){
        let questList = [];
        console.log("createQ Quests", questList)
        return questList;
    }

    init();

    this.createQuests = createQuests;
    return this;
}