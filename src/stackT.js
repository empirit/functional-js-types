const {over, lensIndex, sequence, head, drop, prepend} = require ('ramda')

const StackT = M => {
    const Stack = run => ({
        run,

        chain: f => Stack(x => run(x).chain(([y, s]) => f(y).run(s))), 

        join: y => Stack(x => run(x).chain(([_, s]) => y.run(s))), 

        ap: a => Stack(x => run(x).chain(([f, s]) => a.map(f).run(s))),

        map: f => Stack(x => run(x).map(([y, s]) => [f(y), s])),

        concat: other =>
          Stack(x =>
              run(x).chain(([y, s]) =>
                other.run(x).map(([y1, s1]) =>
                  [y.concat(y1), s]
                )
              )
          ),

        product: sm => Stack (x =>
            run (x).chain (([a, s]) =>
                sm.run (x).chain (([b]) =>
                    M.of ([[a, b], s])))),

        product2: sm1 => sm2 => Stack (x =>
            run (x).chain (([a, s]) =>
                sm1.run (x).chain (([b]) => 
                    sm2.run (x).chain (([c]) => 
                        M.of ([[a, b, c], s]))))),

        product3: sm1 => sm2 => sm3 => Stack (x =>
            run (x).chain (([a, s]) =>
                sm1.run (x).chain (([b]) => 
                    sm2.run (x).chain (([c]) => 
                        sm3.run (x).chain (([d]) => 
                            M.of ([[a, b, c, d], s]))))))

    });

    Stack.lift = m => Stack(s => m.map(x => [x, s]))
    Stack.of = x => Stack(s => M.of([x, s]))
    Stack.get = Stack(x => M.of([x, x]))
    Stack.modify = f => Stack(s => M.of([null, f(s)]))
    Stack.put = x => Stack(s => M.of([null, x]))

    Stack.peek = Stack (s => M.of([head (s), s]))
    Stack.update = f => Stack (s => M.of([null, over (lensIndex (0), f, s)]))
    Stack.fetch = f => Stack (s => M.of([f (s), s]))
    Stack.pop = Stack (s => M.of([head (s), drop (1, s)]))
    Stack.push = x => Stack (s => M.of([null, prepend (x, s)]))

    return Stack
}

module.exports = StackT

