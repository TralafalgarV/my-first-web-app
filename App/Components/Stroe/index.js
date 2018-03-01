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

module.exports = store