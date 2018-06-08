import React, { Fragment } from 'react'

import split from './split'

export default class Foo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this._load().then(() => {
      this.setState({
        split: true,
      })
      this.renderToSplit()
    })
  }

  render() {
    return (
      <Fragment>
        <h1>this</h1>
        {this.state.split && this.renderToSplit()}
      </Fragment>
    )
  }

  @split
  renderToSplit() {
    return 1
  }
}
