GAME.InputController = function (worldSettings, callbackObject) {
    
    function init(){
        initEventListeners()
        console.log('... Init Input Controller. ',callbackObject)
    }


    function initEventListeners(){
        document.addEventListener('keydown', handleKeydown)
    }

    function handleKeydown(event){
        // console.log('keydown', event)
        let key = event.key;

        switch (key) {
            case 'ArrowLeft':
                try {
                    callbackObject.onArrowLeft()
                    
                } catch (error) {
                    console.error(error)
                }
                break;

            case 'ArrowRight':
                try {
                    callbackObject.onArrowRight()
                } catch (error) {
                    console.error(error)
                }
                break;
            case 'ArrowUp':
                try {
                    callbackObject.onArrowUp()
                } catch (error) {

                }
                break;
            case 'ArrowDown':
                try {
                    callbackObject.onArrowDown()
                } catch (error) {

                }
                break;
            case 'Escape':
                try {
                    callbackObject.onEscape();
                } catch(errpr){

                }
            break;
            default:
                
                console.log('unknown command')
                break;
        }
    }

    init();

}