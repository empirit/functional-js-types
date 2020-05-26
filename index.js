const State = require ('./src/state.js')
const StateT = require ('./src/stateT.js')
const Reader = require ('./src/reader.js')
const ReaderT = require ('./src/readerT.js')
const Task = require ('./src/task.js')
const TaskT = require ('./src/taskT.js')
const Either = require ('./src/either.js')
const EitherT = require ('./src/eitherT.js')

module.exports = {
    State,  StateT,
    Reader, ReaderT,
    Task,   TaskT,
    Either, EitherT
}

