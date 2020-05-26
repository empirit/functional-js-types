const TaskT = M => {
	const Task = fork =>
	({
		fork,

		map: f =>
		  Task((rej, res) => fork(rej, mx => res(mx.map(f)))),

		chain: f =>
		  Task((rej, res) =>
			   fork(rej, mx =>
					mx.chain(x => f(x).fork(rej, res))))
	})
	Task.lift = x => Task((rej, res) => res(x))
	Task.of = x => Task((rej, res) => res(M.of(x)))
	Task.rejected = x => Task((rej, res) => rej(x))

	return Task
}

module.exports = TaskT


