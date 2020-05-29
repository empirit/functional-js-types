const {concat, over, lensIndex} = require ('ramda')

const Writer = run =>
({
    run,
        
    map: f => Writer (over (lensIndex(0)) (f) (run)),

    ap: ma => {
        const [f, w1] = run
        const [b, w2] = ma.run
        return Writer ([f(b), concat (w1) (w2)])
    },

    chain: f => {
        const [a, w1] = run
        const [b, w2] = f(a).run
        return Writer ([b, concat (w1) (w2)])
    },

    join: other => {
        const [_, w1] = run
        const [b, w2] = other.run
        return Writer ([b, concat (w1) (w2)])
    }

})

Writer.tell = w => Writer([null, [w]])
Writer.of = x => Writer([x, []])

module.exports = Writer

