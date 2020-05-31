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

        product: sm => State (x =>
            run (x).chain (([a, s]) =>
                sm.run (x).chain (([b]) => M.of ([[a, b], s])))),

        product2: sm1 => sm2 => State (x =>
            run (x).chain (([a, s]) =>
                sm1.run (x).chain (([b]) => 
                    sm2.run (x).chain (([c]) => 
                        M.of ([[a, b, c], s]))))),

        product3: sm1 => sm2 => sm3 => State (x =>
            run (x).chain (([a, s]) =>
                sm1.run (x).chain (([b]) => 
                    sm2.run (x).chain (([c]) => 
                        sm3.run (x).chain (([d]) => 
                            M.of ([[a, b, c, d], s]))))))
    });

    State.lift = m => State(s => m.map(x => [x, s]))
    State.of = x => State(s => M.of([x, s]))
    State.get = State(x => M.of([x, x]))
    State.modify = f => State(s => M.of([null, f(s)]))
    State.put = x => State(s => M.of([null, x]))

    return State
}

module.exports = StateT

