const React = require('react')
const ReactDOM = require('react-dom')
const sharp11 = require('sharp11')
const tryInversion = require('./try-inversion')

window.sharp11 = sharp11
const noteSet = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// Precompute all scales (combinatory explosion in memory)
var allScales = noteSet.map((note) => Object.keys(sharp11.scale.scales).map((scaleType) => sharp11.scale.create(note, scaleType)))
allScales = [].concat.apply([], allScales)
console.log('Created some scales %j', allScales)

const Notes = React.createClass({
	getInitialState: function() {
		var noteStates = noteSet.map(function (note) {
			return {id: note, name: note, selected: false}
		})
		return {
			noteSet: noteSet,
			noteStates: noteStates
		}
	},
	render: function() {
	  var checks = this.state.noteStates.map(function (d) {
		return (
		  <span key={d.id} data-id={d.id}>
		    <label>{d.name}</label>
		    <input type="checkbox" data-id={d.id} checked={d.selected} onChange={this.__changeSelection.bind(this, d.id)} />
          </span>
		)
	  }.bind(this))
	  var selectedNotes = this.state.noteStates.filter((d) => d.selected)
	    .map((d) => d.name).map((d) => sharp11.note.create(d))
	  
	  // Get all chords and scales
	  var scales = []
	  var chords = []
	  if (selectedNotes && selectedNotes.length) {
	    scales = allScales.filter((scale) => selectedNotes.reduce((prev, note) => prev && scale.contains(note), true))
	    chords = selectedNotes
	      .map((note, i) => {
	    	return {root: note, bass: selectedNotes[0], notes: selectedNotes.slice(i).concat(selectedNotes.slice(0, i)).slice(1)}
	      }).map(tryInversion).map((inversion) => inversion.symbol)
	  }

	  scales = scales.map(function (d, i) {
		  var key = 'note-scale-' + i
		  return (
	        <div key={key} data-id='note-scale'>
              {d.fullName}
            </div>
          )
	  })

	  chords = chords.sort((a, b) => a.reasonable >= b.reasonable).map(function (d, i) {
		  var key = 'note-chord-' + i
		  return (
	        <div key={key} data-id='note-chord'>
              {d}
            </div>
          )
	  })
	  
	  return (
	    <div data-id='note-component'>
	      <div data-id='notes'>
	        Pitches: {checks}
	      </div>
	      <div>
	        <div>
	          Chords:
	          {chords}
	        </div>
	        <div>
	          Scales:
	          {scales}
	        </div>
	      </div>
	    </div>
	  )
	},
    __changeSelection: function(id) {
        var state = this.state.noteStates.map(function(d) {
            return {
            	id: d.id, 
            	name: d.id,
                selected: (d.id === id ? !d.selected : d.selected)
            };
        });

        this.setState({ noteStates: state });
    }
})

module.exports = Notes