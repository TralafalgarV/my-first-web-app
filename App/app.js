import React, {Component} from 'react'
import {render} from 'react-dom'
import {
    Router,
    Route,
    hashHistory,
    Link,
    IndexRoute,
    Redirect,
    browserHistory
} from 'react-router'
import {IndexList, Create, Music, Game} from './Config/route-config'

const rootRoute = {
    component: require('./Components/main').default,
    childRoutes: [{
        path: '/',
        indexRoute: {
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./Components/IndexList'))
                })
            }
        },
        childRoutes: [
            IndexList, 
            Create,
            Music,
            Game,
        ]
    }]
}

let root = document.getElementById('app')
render(<Router routes={rootRoute} history={hashHistory} />, root)