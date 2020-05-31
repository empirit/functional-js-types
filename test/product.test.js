const {last} = require ('ramda')
const test = require ('ava')

const Either = require ('../src/either.js')
const ReaderT = require ('../src/readerT.js')
const WriterT = require ('../src/writerT.js')
const StateT = require ('../src/stateT.js')
const StackT = require ('../src/stackT.js')
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

test ('StateT (Either) product2', t => {

    const Transformer = StateT  (Either)

    const x = 
        Transformer
        .of      (11)
        .product2 (Transformer.of (22))
                  (Transformer.of (33))

    x
    .run  ([1])
    .fold (
        e => t.failed(),
        ([x, state]) => {
            t.deepEqual (x, [11, 22, 33])
        }
    )
})

test ('StackT (Either) product2', t => {

    const Transformer = StackT  (Either)

    const x = 
        Transformer
        .of      (11)
        .product2 (Transformer.of (22))
                  (Transformer.of (33))

    x
    .run  ([1])
    .fold (
        e => t.failed(),
        ([x, state]) => {
            t.deepEqual (x, [11, 22, 33])
        }
    )
})

test ('StackT (StackT (ReaderT (WriterT (Either)))) product', t => {

    const T1  = WriterT (Either)
    const T2  = ReaderT (T1)
    const T3  = StackT  (T2)
    const Transformer = StackT  (T3)

    const x = 
        Transformer
        .of      (11)
        .product (Transformer.lift (T3.lift (T2.of (22))))

    x
    .run  ([1])
    .run  ([2])
    .run  ([3])
    .run
    .fold (
        e => t.failed(),
        ([[[x, stack1], stack2], writer]) => {
            t.deepEqual (stack1, [1])
            t.deepEqual (stack2, [2])
            t.deepEqual (writer, [])
            t.deepEqual (x, [11, 22])
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
