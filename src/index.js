const React = require('react')
const ReactDOM = require('react-dom')
const Notes = require('./notes')

const Index = React.createClass({
	getInitialState: function() {return null},
	render: function() {
		return (
          <div className="index">
          	<Notes />
          </div>
        )
	}
})

ReactDOM.render(<Index />, document.getElementById('main'))