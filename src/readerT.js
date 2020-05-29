const {reduce, concat, sequence, reduceRight, ap, map, prepend} = require ('ramda')

const ReaderT = M => {
    const Reader = run =>
        ({
            run,

            map: f => Reader(x => run(x).map(f)),

            chain: f => Reader(x => run(x).chain(y => f(y).run(x))),

            join: y => Reader(x => run(x).join(y.run(x))),

            concat: other => Reader(x => run(x).concat(other.run(x))),

            ap: a => Reader (x => run(x).ap(a.run(x))),

            product: r => Reader (x => sequence (M.of, [run (x), r.run (x)])),

            product2: r1 => r2 => Reader (x => sequence (M.of, [run (x), r1.run (x), r2.run (x)])),

            product3: r1 => r2 => r3 => Reader (x => sequence (M.of, [run (x), r1.run (x), r2.run (x), r3.run (x)])),

        })
    Reader.ask = Reader(x => M.of(x))
    Reader.of = x => Reader(() => M.of(x))
    Reader.lift = x => Reader(() => x)
    return Reader
}

module.exports = ReaderT

