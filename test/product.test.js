const test = require ('ava')

const Either = require ('../src/either.js')
const ReaderT = require ('../src/readerT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right} = Either

test ('readerT product', t => {

    t.plan (2)

    const Transformer = ReaderT (Either)

    const x = Transformer.of(1)
        .product (Transformer.of(2))


    x.run (0)
    .fold (
        e => t.failed(),
        r => {
            t.is (r[0], 1)
            t.is (r[1], 2)
        }
    )
})

test ('readerT product2', t => {

    t.plan (1)

    const Transformer = ReaderT (Either)

    const x = Transformer.of(1)
        .product2 (Transformer.of(2))
                  (Transformer.lift (Left ("err")))

    x.run (0)
    .fold (
        e => t.is (e, "err"),
        r => t.fail()
    )
})

test ('readerT product3', t => {

    t.plan (2)

    const TaskEither = TaskT (Either)
    const Transformer = ReaderT (TaskEither)

    const x = Transformer.of(1)
        .product3 (Transformer.of(2))
                  (Transformer.of(3))
                  (Transformer.lift (TaskEither.of (4)))

    x.run (0)
     .fork(
        _ => t.fail(),
        ei => ei.fold (
            e => t.fail (),
            r => t.deepEqual (r, [1,2,3,4])
        )
    )

    const y = Transformer.of(1)
        .product3 (Transformer.of(2))
                  (Transformer.lift (TaskEither.of (3)))
                  (Transformer.lift (TaskEither.lift (Left ("error"))))

    y.run (0)
     .fork(
        _ => t.fail(),
        ei => ei.fold (
            e => t.is (e, "error"),
            r => t.fail()
        )
    )


})
