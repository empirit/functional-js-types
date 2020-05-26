const Task = fork =>
({
    fork,

    ap: other => Task((rej, res) => fork(rej, f => other.fork(rej, x => res(f(x))))),

    map: f => Task((rej, res) => fork(rej, x => res(f(x)))),

    chain: f => Task((rej, res) => fork(rej, x => f(x).fork(rej, res))),

    join: y => Task((rej, res) => fork(rej, _ => y.fork(rej, res))),

    concat: other => Task((rej, res) => fork(rej, x => other.fork(rej, y => res(x.concat(y))))),
    
    fold: (f, g) => Task((rej, res) => fork(x => f(x).fork(rej, res), x => g(x).fork(rej, res)))

})
Task.of = x => Task((rej, res) => res(x))
Task.rejected = x => Task((rej, res) => rej(x))
Task.fromPromised = fn => (...args) => Task((rej, res) => fn(...args).then(res).catch(rej))

module.exports = Task


