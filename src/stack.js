const {head, drop, prepend} = require ('ramda')
const State = require ('./state.js')

const Stack = State

Stack.of = x => Stack (s => [x, s])
Stack.get = Stack (s => [s, s])
State.modify = f => Stack(s => [null, f(s)])
State.put = x => Stack(s => [null, x])

Stack.peak = Stack (s => [head (s), s])
Stack.fetch = f => Stack (s => [f (s), s])
Stack.pop = Stack (s => [head (s), drop (1, s)])
Stack.push = x => Stack (s => [null, prepend (x, s)])

module.exports = Stack
