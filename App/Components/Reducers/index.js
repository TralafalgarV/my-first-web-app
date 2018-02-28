import {combineReducers, createStore, applyMiddleware} from "redux"

function musicPlayerReducer(state = {}, action) {
    // if (state.musicPlayerReducer) {
    //     console.log("musicPlayerReducer is undefined") 
    //     // return state       
    // }
    switch (action.type) {
        case "start":
            console.log("Redux start", state)
            if (state.audio) {
                state.audio.play()
            }
            return state;
        case "stop":
            console.log("Redux stop", state)
            if (state.audio) {
                state.audio.pause()
            }            
            return state;
        case "back":
            console.log("Redux back")
            return state;
        case "next":
            console.log("Redux next")
            return state;
        case "update":
            console.log("Redux update", action.curMusic)
            return Object.assign({}, state, {curMusic: action.curMusic}); 
        case "initAudio":
            console.log("Redux initAudio", action)
            return Object.assign({}, state, {audio: action.audio, source: action.source});               
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    musicPlayerReducer,
})

module.exports = rootReducer