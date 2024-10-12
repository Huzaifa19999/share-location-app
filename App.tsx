import React from 'react'
import StackNavigation from './config/StackNavigation'
import { Provider } from 'react-redux'
import store from './store/store'

function App() {
  return (
    <Provider store={store}>
      <StackNavigation/>
    </Provider>
  )
}

export default App