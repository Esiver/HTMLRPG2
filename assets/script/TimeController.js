GAME.TimeController = function (worldSettings, gameState, callbacks) {


    let state = {
        timePointArray:[]
    }

    function init() {
        recordTimePoint(0 , "start Time");
        

    }

    function startTime(){
    }

    function pauseTime(){

    }
    function getSeason(quarter){
        let seasonString = 'LIMBO';

        switch (quarter) {
            case 1:
                seasonString = 'Spring'
                break;
            case 2:
                seasonString = 'Summer';
                break;
            case 3:
                seasonString = 'Autumn';
                break;
            case 4: 
                seasonString = 'Winther';
                break;
            default:
                break;
        }

        return seasonString
    }
    function handleTimeTick(){
        gameState.timeTicker ++;
        gameState.timeObject.day ++;
        let dayObj = gameState.timeObject.day;
        let daysInYear = worldSettings.daysInYear
        let quarterDur = daysInYear / 4

        if(dayObj > daysInYear) {
            gameState.timeObject.day = 0
            gameState.timeObject.quarter = 0
            gameState.timeObject.year ++;
            callbacks.onYearChange()
        }

        if(dayObj < quarterDur) {
            if (gameState.timeObject.quarter != 1){
                gameState.timeObject.quarter = 1;
                callbacks.onSeasonChange();
            }
        } else if (dayObj > quarterDur && dayObj < quarterDur*2) {
            if (gameState.timeObject.quarter != 2){
                gameState.timeObject.quarter = 2;
                callbacks.onSeasonChange();
            }
        } else if (dayObj > quarterDur*2 && dayObj < (daysInYear - quarterDur)) {
            if (gameState.timeObject.quarter != 3){
                gameState.timeObject.quarter = 3;
                callbacks.onSeasonChange();
            }
        } else if (dayObj > (daysInYear - quarterDur)) {
            if (gameState.timeObject.quarter != 4){
                gameState.timeObject.quarter = 4;
                callbacks.onSeasonChange();
            }
        }
    }

    function recordTimePoint(refId, description) {
        let tObj = {
            timestamp : Date.now(),
            id: refId,
            description : ""
        }
        console.log(state)
        state.timePointArray.push()
    }

    init();

    this.getSeason = getSeason;
    this.handleTimeTick = handleTimeTick;
    return this;
}