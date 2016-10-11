
var quotes = function() {
  const words = [
    'Believe in U',
    'Let it goooo',
    'Nobody is perfect',
    'Live the moment',
    'NEVER stop dreaming',
    'Let it be',
    'Get on up',
    'Keep it cool',
    'Go to bed',
    'Yes we can',
    'It is possible',
    'Passion. Strength. Fire.',
    'Enjoy this pain',
    "Don't look at me",
    'Still love ya',
    'Learn from yesterday',
    'Embrace the void',
    "I've had better",
    "Shhh don't cry",
    'Hold me close',
  ]
  index = Math.floor(Math.random() * (words.length - 0))
  return words[index]
}

export default quotes;
