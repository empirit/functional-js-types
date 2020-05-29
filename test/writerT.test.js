const test = require ('ava')

const Either = require ('../src/either.js')
const WriterT = require ('../src/writerT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right} = Either

test ('WriterT, map', t => {

    t.plan (1)

    const Transformer = WriterT (Either)

    const x = Transformer.of (1).map (x => x + 3)

    x.run.fold (
        e => t.fail(),
        r => t.deepEqual (r, [4, []])
    )

})

test ('WriterT, chain', t => {

    t.plan (1)

    const TaskEither = TaskT (Either)
    const Transformer = WriterT (TaskEither)

    const x = Transformer.tell ("hello, ")
                .join (Transformer.lift (TaskEither.lift (Right ("world!"))))
                .chain (Transformer.tell)

    x.run.fork (
        rej => t.fail(),
        res => res.fold (
            e => t.fail(),
            r => t.is (r[1].join (""), "hello, world!")
        )
    )

})

test ('WriterT, ap', t => {

    t.plan (1)

    const TaskEither = TaskT (Either)
    const Transformer = WriterT (TaskEither)

    const x = Transformer.tell ("hello")
                .join (Transformer.of (x => ", " + x))
                .ap (Transformer.of ("world!"))
                .chain (Transformer.tell)

    x.run.fork (
        rej => t.fail(),
        res => res.fold (
            e => t.fail(),
            r => t.is (r[1].join (""), "hello, world!")
        )
    )

})
