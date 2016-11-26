const React = require('react')
const ReactDOM = require('react-dom')
const Notes = require('./notes')
const Synth = require('./synth')

const Index = React.createClass({
  getInitialState: function () { return null },
  render: function () {
    return (
      <div className='index'>
        <Notes />
        <Synth />
      </div>
    )
  }
})

ReactDOM.render(<Index />, document.getElementById('main'))
