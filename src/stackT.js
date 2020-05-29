const {sequence, head, drop, prepend} = require ('ramda')

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

        product: sm => Stack (x => sequence (M.of, [run (x), sm.run (x)])),

        product2: sm1 => sm2 => Stack (x => sequence (M.of, [run (x), sm1.run (x), sm2.run (x)])),

        product3: sm1 => sm2 => sm3 => Stack (x => sequence (M.of, [run (x), sm1.run (x), sm2.run (x), sm3.run (x)]))

    });

    Stack.lift = m => Stack(s => m.map(x => [x, s]))
    Stack.of = x => Stack(s => M.of([x, s]))
    Stack.get = Stack(x => M.of([x, x]))
    Stack.modify = f => Stack(s => M.of([null, f(s)]))
    Stack.put = x => Stack(s => M.of([null, x]))

    Stack.peak = Stack (s => M.of([head (s), s]))
    Stack.fetch = f => Stack (s => M.of([f (s), s]))
    Stack.pop = Stack (s => M.of([head (s), drop (1, s)]))
    Stack.push = x => Stack (s => M.of([null, prepend (x, s)]))

    return Stack
}

module.exports = StackT

