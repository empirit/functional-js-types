const TaskT = M => {
	const Task = fork =>
	({
		fork,

        ap: other => Task((rej, res) => fork(rej, mf => other.fork (rej, mx => res (mf.ap(mx))))),

		map: f => Task((rej, res) => fork(rej, mx => res(mx.map(f)))),

		chain: f => Task((rej, res) => fork(rej, mx => mx.chain(x => f(x).fork(rej, res)))),

            // concat: other => Reader(x => run(x).concat(other.run(x))),
        //concat: other => Task((rej, res) => fork(rej, mx => other.fork(rej, my => res(my.concat(mx))))),

	})
	Task.lift = x => Task((rej, res) => res(x))
	Task.of = x => Task((rej, res) => res(M.of(x)))
	Task.rejected = x => Task((rej, res) => rej(x))

	return Task
}

module.exports = TaskT


