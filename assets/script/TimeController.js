GAME.TimeController = function (worldSettings) {


    let state = {
        timePointArray:[]
    }

    function init() {
        recordTimePoint(0 , "start Time");
        startTime();

    }

    function startTime(){
    }

    function pauseTime(){

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

    return this;
}