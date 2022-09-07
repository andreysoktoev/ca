import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import App from './components/App'
import { store } from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)