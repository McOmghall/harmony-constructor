// copied from https://github.com/jsrmath/sharp11/blob/master/lib/chord.js

module.exports = function tryInversion (inversion) {
  var root = inversion.root
  var bass = inversion.bass
  var notes = inversion.notes

  // We designate an inversion "reasonable" if we think it is
  // likely to be the correct inversion (default to true)
  var reasonable = true

  // Return true if interval is present in this chord
  var hasInt = function (interval) {
    return notes.find(function (n) {
      return root.transpose(interval).enharmonic(n)
    })
  }

  var symbol = ''

  var noThird = false

  if (hasInt('M3')) {
    if (hasInt('aug5') && !(hasInt('M7') || hasInt('m7'))) {
      symbol += '+'
    }
  } else if (hasInt('m3')) {
    if (hasInt('dim5') && !hasInt('P5') && !hasInt('M7')) {
      if (hasInt('dim7') && !hasInt('m7')) {
        symbol += 'dim7'
      } else if (hasInt('m7')) {
        symbol += 'm'
      } else {
        symbol += 'dim'
      }
    } else {
      symbol += 'm'
    }
  } else {
    if (hasInt('P4')) {
      symbol += 'sus4'
    } else if (hasInt('M2')) {
      symbol += 'sus2'
    } else {
      noThird = true
    }
  }

  if (hasInt('M7') || hasInt('m7')) {
    if (hasInt('M7')) {
      symbol += 'M'
    }
    if (hasInt('M6')) {
      symbol += '13'
    } else if (hasInt('P4') && (hasInt('M3') || hasInt('m3'))) {
      symbol += '11'
    } else if (hasInt('M2') && (hasInt('M3') || hasInt('m3'))) {
      symbol += '9'
    } else {
      symbol += '7'
    }
  } else if (hasInt('M3') || hasInt('m3')) {
    if (hasInt('M6') && !hasInt('dim5')) {
      symbol += '6'
      if (hasInt('M2')) {
        symbol += '/9'
      }
    }
    if (hasInt('P4')) {
      symbol += 'add11'
    }
    if (!hasInt('M6') && hasInt('M2')) {
      symbol += 'add9'
    }
  }

  if ((hasInt('M3') || hasInt('m3')) && hasInt('dim5') && !hasInt('P5') && (hasInt('M7') || hasInt('m7'))) {
    symbol += 'b5'
  }
  if (hasInt('M3') && hasInt('aug5') && !hasInt('P5') && (hasInt('M7') || hasInt('m7'))) {
    symbol += '#5'
  }
  if (hasInt('m2')) {
    symbol += 'b9'
  }
  if (hasInt('M3') && hasInt('aug2')) {
    symbol += '#9'
  }
  if ((hasInt('M3') || hasInt('m3')) && hasInt('dim5') && hasInt('P5') && (hasInt('M7') || hasInt('m7'))) {
    symbol += '#11'
  }
  if ((hasInt('M3') || hasInt('m3')) && hasInt('m6') && hasInt('P5') && (hasInt('M7') || hasInt('m7'))) {
    symbol += 'b13'
  }

  if (noThird) {
    if (symbol === '') {
      symbol = '5'
    } else {
      symbol += 'no3'
    }
  }

  if (!root.enharmonic(bass)) {
    symbol += '/' + bass.name
  }

  // Check if symbol is not reasonable
  if (!symbol.match(/b5|#5|dim/) && !hasInt('P5')) {
    reasonable = false // Catches most things
  }
  if ((hasInt('P5') || hasInt('dim5')) && hasInt('m3') && hasInt('m6')) {
    reasonable = false // Catches E, G, B(b), C
  }
  if (symbol.match(/6add11/)) {
    reasonable = false // Catches G, B(b), C, D, E
  }

  return {
    symbol: root.name + symbol,
    reasonable: reasonable
  }
}
