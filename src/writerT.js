const {concat, over, lensIndex} = require ('ramda')

const WriterT = M => {
    const Writer = run =>
    ({
        run,

        map: f => 
            Writer (run.map (([a, w]) => [f(a), w])),

        chain: mf => 
            Writer (run.chain (([a, w1]) => 
                mf (a).run.map (([b, w2]) => [b, concat (w1) (w2)]))),

        join: m => 
            Writer (run.chain (([_, w1]) => 
                m.run.map (([b, w2]) => [b, concat (w1) (w2)]))),

        ap: ma => 
            Writer (run.chain (([f, w1]) => 
                ma.run.map (([b, w2]) => [f(b), concat (w1) (w2)])))


    })

    Writer.lift = m => Writer(m.map (x => [x, []]))
    Writer.tell = w => Writer(M.of([null, [w]]))
    Writer.of = x => Writer(M.of([x, []]))

    return Writer
}

module.exports = WriterT

