import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Spinner from './Spinner'
import registerServiceWorker from './registerServiceWorker'
import firebase from './firebase'
import { rootReducer } from './reducers'
import { setUser, clearUser } from './actions'

import 'semantic-ui-css/semantic.min.css'

import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { Route, withRouter } from 'react-router-dom'

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const store = createStore(rootReducer, composeWithDevTools())

function Root(props) {
  const { history, setUser, clearUser, isLoading } = props

  useEffect(
    function() {
      let didCancel = false
      function fetchUser() {
        if (!didCancel) {
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              // console.log(user)
              setUser(user)
              history.push('/')
            } else {
              history.push('/login')
              clearUser()
            }
          })
        }
      }
      fetchUser()

      return function() {
        didCancel = true
      }
    },
    [history, setUser, clearUser]
  )

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Switch>
  )
}

function mapStateToProps(state) {
  return {
    isLoading: state.user.isLoading,
  }
}

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
