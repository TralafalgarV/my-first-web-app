import {combineReducers, createStore, applyMiddleware} from "redux"

// music 相关的 reducer
function musicPlayerReducer(state = {}, action) {
    switch (action.type) {
        case "update":
            console.log("Redux update", action)
            return Object.assign({}, state, {
                curMusicUrl: action.curMusicUrl, 
                option: action.option,
                curMusic: action.curMusic
            });            
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    musicPlayerReducer,
})

module.exports = rootReducer