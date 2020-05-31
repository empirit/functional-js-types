const {over, lensIndex, head, drop, prepend} = require ('ramda')

const Stack = run => ({
    run,

    chain: f => Stack(x => { const [y, s] = run(x); return f(y).run(s) }),

    join: y => Stack(x => { const [_, s] = run(x); return y.run(s) }),

    ap: a => Stack(x => { const [f, s] = run(x); return a.map(f).run(s) }),

    map: f => Stack(x => { const [y, s] = run(x); return [f(y), s] }),

    concat: other =>
        Stack(x => {
            const [y, s] = run(x);
            const [y1, _s1] = other.run(x);

            return [y.concat(y1), s];
        }),

    product: sm => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm.run (x)

        return [[a, b], s]
    }),

    product2: sm1 => sm2 => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm1.run (x)
        const [c]    = sm2.run (x)

        return [[a, b, c], s]
    }),

    product3: sm1 => sm2 => sm3 => Stack (x => {
        const [a, s] = run (x)
        const [b]    = sm1.run (x)
        const [c]    = sm2.run (x)
        const [d]    = sm3.run (x)

        return [[a, b, c, d], s]
    })
});


Stack.of = x => Stack (s => [x, s])
Stack.get = Stack (s => [s, s])
Stack.modify = f => Stack(s => [null, f(s)])
Stack.put = x => Stack(s => [null, x])

Stack.peek = Stack (s => [head (s), s])
Stack.update = f => Stack (s => [null, over (lensIndex(0), f, s)])
Stack.fetch = f => Stack (s => [f (s), s])
Stack.pop = Stack (s => [head (s), drop (1, s)])
Stack.push = x => Stack (s => [null, prepend (x, s)])

module.exports = Stack

