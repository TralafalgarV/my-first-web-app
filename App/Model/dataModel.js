const API = 'http://localhost:4545/'
// const API = 'http://47.96.183.75/'

const USER_LOGIN = 'userLogin'
// 引入 whatwg-fetch 模块，解决fetch兼容性问题
import 'whatwg-fetch'
import { win32 } from 'path';

/**
 * fetch请求数据Model
 * @param _method
 * @param _api
 * @param _params
 * @param _onSuccess
 * @param _onError
 * @private
 */
function _request(_method, _api, _params, _onSuccess, _onError) {
    console.log("[Model] _request: " + _api)
    if (_method == 'POST') {
        console.log("[Model] post _params: ", _params)
    }
    let _options = {
        method: _method,
        mode: "cors",
        headers: {                                // headers 后面有s啊！！！
            'Content-Type': 'application/json',
            credentials: "include"
        },
        body: (_method.toLowerCase() == 'get')
            ? null
            : JSON.stringify(_params)
    }

    if (_method.toLowerCase() == 'get') {
        _api += Tools._getSearchFromObject(_params)
    }

    fetch(_api, _options)
    .then(Tools.checkStates)
    .then(Tools.parseJSON)
    .then((data) => {
        _onSuccess(data)
    }).catch((err) => {
        console.log("[Model] catch error: " ,err)
        if (err.state === 401) {
            alert("登陆过期，清重新登录")
            location.hash = "login"
            return
        }
        if (err.response) {
            err.response.json().then((data) => {
                console.log("[Model] respone error",data)
                if (data.message) {
                    alert(data.message)
                }
            })
        }
    })
}

let Tools = {
    // 检查响应数据
    checkStates : function (response) {
        if (response.ok) {
            return response
        } else {
            let error = new Error(response.statusText);
            error.state = response.status;
            error.response = response;
            throw error;          
        }
    },
    parseJSON: function(response) {
        return response.json()
    },
    _getSearchFromObject: function(param, key) {
        if(param == null) {
            return ''
        }
        let _search = '?'
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                _search += `${key}=${encodeURIComponent(param[key])}&`
            }
        }
        return _search.slice(0, -1)
    }
}

// Upload Image
function _upload(_api, _formdata, _onSuccess, _onError) {
    // Manual XHR & FormData
    let oReq = new XMLHttpRequest()
    oReq.open("POST", _api)
    // oReq.setRequestHeader("Content-type", "multipart/form-data")
    oReq.onload = (e) => {
        let ret = JSON.parse(oReq.responseText)
        if (oReq.status == 200) {
            _onSuccess(ret)
        } else {
            let err = ret
            if (err.message) alert(err.message)
            //_onError(err);
        }
    }
    // oReq.upload.onprogress = updateProgress;
    oReq.send(_formdata)
}

let ArticleModel = {
    fetchList:(_params, _success, _error) => {
        _request('GET', `${API}article/fetchList`, _params, _success, _error)
    },
    publish:(_params, _success, _error) => {
        _request('POST', `${API}article/publish`, _params, _success, _error)
    },
    fetchArticle: (_id, _success, _error) => {
        _request('GET', `${API}article/fetchArticle/${_id}`, null, _success, _error)
    },
    comment: (_params, _success, _error) => {
        _request('POST', `${API}article/comment`, _params, _success, _error)
    },
    delete: (_id, _success, _error) => {
        _request('GET', `${API}article/delete/${_id}`, null, _success, _error)
    },
    delCommet: (_params, _success, _error) => {
        _request('GET', `${API}article/delete`, _params, _success, _error)
    },    
    fetchImg: (_params, _success, _error) => {
        _upload(`${API}article/fetchImg`, _params, _success, _error)
    }, 
    fetchUsrArticle:(_params, _success, _error) => {
        _request('POST', `${API}article/fetchUsrArticle`, _params, _success, _error)
    },    
}

let UserModel = {
    fetchLogin:() => {
        return localStorage.getItem(USER_LOGIN)
    },    
    storeLogin: (login) => {
        localStorage.setItem(USER_LOGIN, login)
    }, 
    register: (_params, _success, _error) => {
        _request('POST', `${API}user/register`, _params, _success, _error)
    },
    login: (_params, _success, _error) => {
        _request('POST', `${API}user/login`, _params, _success, _error)
    },     
}

let MusicModel = {
    fetchList:(_params, _success, _error) => {
        _request('GET', `${API}music/fetchList`, _params, _success, _error)
    },    
}
export {ArticleModel, UserModel, MusicModel}