import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Footer from './comp/Footer'
import Home from './comp/Home'
import Category from './comp/Category'
import Work from './comp/Work'

import data from './func/data'

import SITE_SETTING from './const/SITE_SETTING'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  async getData () {
    const categoryCsv = await window.fetch(SITE_SETTING.data.categoryCsv)
      .then((res) => res.text())
    const workCsv = await window.fetch(SITE_SETTING.data.workCsv)
      .then((res) => res.text())
    const tagCsv = await window.fetch(SITE_SETTING.data.tagCsv)
      .then((res) => res.text())
    this.setState(data({workCsv, tagCsv, categoryCsv}))
  }

  componentDidMount () {
    this.getData()
  }

  render () {

    const {
      categoryObj,
      tagObj,
      tagWorkMapper,
      workObj,
      tagCategory
    } = {...this.state}

    return (
      <Router basename={`/${SITE_SETTING.repo}`}>
        <div className='App'>
          <Switch>
            <Route exact path='/' render={() => Home({categoryObj, tagCategory, tagObj, tagWorkMapper})} />
            <Route path='/work/:workId?' render={({match}) => Work({params: match.params, categoryObj, tagObj, tagWorkMapper, workObj, tagCategory})} />
            <Route path='/:categoryId/:tagId?' render={({match}) => Category({params: match.params, tagObj, tagWorkMapper, categoryObj, workObj, tagCategory})} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
