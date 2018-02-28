import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../Reducers'

console.log("Redux start!")
/**
 * applyMiddlewares 是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行
 */
const store = createStore(
    rootReducer,
    applyMiddleware(
    //   thunkMiddleware,
    )
)

// 通过 state 变更通知，更改 audio 的 src 属性值
// state: {
//     musicPlayerReducer: {
//         audio: ...,
//         curMusic:...
//     }
// }
store.subscribe(function() {
    let state = store.getState()
    console.log("subscribe: ", state)
    let audio = state.musicPlayerReducer.audio
    let curMusic = state.musicPlayerReducer.curMusic
    if (curMusic) {
        audio.children[0].src = "http://music.163.com/song/media/outer/url?id=" + curMusic.musicId + ".mp3"
        audio.load()
        audio.addEventListener("canplaythrough",function(){
            // audio.play();
         },false);         
        console.log("State subscribe")        
    }
})

module.exports = store