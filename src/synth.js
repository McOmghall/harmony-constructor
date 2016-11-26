const React = require('react')
const ReactDOM = require('react-dom')
const AudioContext = window.AudioContext || window.webkitAudioContext

const createDefaultOscillator = function createDefaultOscillator(context) {
  const oscillator = context.createOscillator()
  oscillator.frequency.value = 440
  oscillator.connect(context.destination)
  
  return oscillator
}

const Synth = React.createClass({
  getInitialState: function () {
	const ctx = new AudioContext()
    const oscillator = createDefaultOscillator(ctx)
	
    return {
      inputs: null, 
      network: [oscillator],
      context: ctx,
      playing: false
    }
  },
  __togglePlay: function() {
    const toggled = (this.state.playing ? false : true)
    const network = this.state.network.map(function (element) {
      var oscillator = element
      try {
        oscillator.stop()
      } catch (e) {
        console.log('Avoided crash on stop ' + e)
      }
      if (toggled) {
    	oscillator = createDefaultOscillator(this.state.context)
        oscillator.start()
      }
      
      return oscillator
    }, this)
    this.setState({playing: toggled, network: network})
  },
  render: function() {
    return (
      <div>
      	<menu>
      	  <a href="#" onClick={this.__togglePlay}>{(this.state.playing ? 'Stop All' : 'Play All')}</a>
      	</menu>
        <canvas>
        </canvas>
      </div>
    )
  }
})

module.exports = Synth