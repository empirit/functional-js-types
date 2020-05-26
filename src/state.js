const State = run => ({
    run,
    chain: f =>
        State(x => {
            const [y, s] = run(x);
            return f(y).run(s)
        }), 
    join: y =>
        State(x => {
            const [_, s] = run(x);
            return y.run(s)
        }), 
    ap: a =>
        State(x => {
            const [f, s] = run(x);
            return a.map(f).run(s)
        }), 
    map: f =>
        State(x => {
            const [y, s] = run(x);
            return [f(y), s];
        }),
    concat: other =>
        State(x => {
            const [y, s] = run(x);
            const [y1, _s1] = other.run(x);

            return [y.concat(y1), s];
        })
});

State.of = x => State(s => [x, s])
State.get = State(s => [s, s])
State.modify = f => State(s => [null, f(s)])
State.put = x => State(s => [null, x])

module.exports = State

