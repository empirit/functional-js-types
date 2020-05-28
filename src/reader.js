const Reader = g =>
({
    run: g,

    map: f => Reader (x => f(g(x))),

    chain: f => Reader (x => f(g(x)).run(x)),

    join: y => Reader (x => y.run(x)),

    concat: other => Reader (x => g(x).concat(other.run(x))),

    ap: a => Reader (x => a.map(g(x)).run(x))

})
Reader.ask = Reader(x => x)
Reader.of = x => Reader(() => x)

module.exports = Reader

