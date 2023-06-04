GAME.TaskController = function(settings, gameState) {


    class Task {
        constructor(id, entity){
            this.id = id;
            this.entity = entity;
        }
    }

    class MovementTask extends Task {
        constructor(id, entity, targetTile){
            super();
            this.id = id;
            this.entity = entity;
            this.targetTile = targetTile;
        }
    }

    function getNewTask(taskSettings){
        let newTask;
        if (taskSettings.type == 'movement') {
            newTask = new MovementTask(taskSettings.id, taskSettings.entity, taskSettings.targetTile)
        }
        return newTask
    }

    function getNewMovementTask(taskSettings) {
        let newMovementTask;
        // Todo? 
        return newTask;
    }

    function getEntityGoHomeTask(entity){
        let gohome
    }

    this.getNewTask = getNewTask;

    return this
}