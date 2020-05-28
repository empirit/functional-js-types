const {sequence} = require ('ramda')

const StateT = M => {
    const State = run => ({
        run,

        chain: f => State(x => run(x).chain(([y, s]) => f(y).run(s))), 

        join: y => State(x => run(x).chain(([_, s]) => y.run(s))), 

        ap: a => State(x => run(x).chain(([f, s]) => a.map(f).run(s))),

        map: f => State(x => run(x).map(([y, s]) => [f(y), s])),

        concat: other =>
          State(x =>
              run(x).chain(([y, s]) =>
                other.run(x).map(([y1, s1]) =>
                  [y.concat(y1), s]
                )
              )
          ),

        product: sm => State (x => sequence (M.of, [run (x), sm.run (x)])),

        product2: sm1 => sm2 => State (x => sequence (M.of, [run (x), sm1.run (x), sm2.run (x)])),

        product3: sm1 => sm2 => sm3 => State (x => sequence (M.of, [run (x), sm1.run (x), sm2.run (x), sm3.run (x)]))

    });

    State.lift = m => State(s => m.map(x => [x, s]))
    State.of = x => State(s => M.of([x, s]))
    State.get = State(x => M.of([x, x]))
    State.modify = f => State(s => M.of([null, f(s)]))
    State.put = x => State(s => M.of([null, x]))

    return State
}

module.exports = StateT

