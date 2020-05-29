const test = require ('ava')

const Either = require ('../src/either.js')
const StateT = require ('../src/stateT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right} = Either

test ('Either concat', t => {

    t.plan (1)

    const x = Right ([1]).concat (Right ([2]))

    x.fold (
        e => t.failed(),
        r => {
            t.deepEqual (r, [1,2])
        }
    )

})

test ('StateT (Either) concat', t => {

    t.plan (2)

    const Transformer = StateT (Either)

    const x = Transformer.of([1])
                .concat (Transformer.of([2]))


    x.run (0)
    .fold (
        e => t.failed(),
        ([r, s]) => {
            t.deepEqual (r, [1,2])
        }
    )

    const y = Transformer.of([1])
                .concat (Transformer.lift (Left ("err")))


    y.run (0)
    .fold (
        e => t.is (e, "err"),
        _ => t.fail()
    )
})

test ('StateT (TaskT (Either)) concat', t => {

    t.plan (1)

    const TaskEither = TaskT (Either)
    const Transformer = StateT (TaskEither)

    const x = Transformer.of([1])
                .concat (Transformer.lift (TaskEither.of([2])))

    x.run (0)
     .fork (
         rej => t.fail(),
         res => res.fold (
            e => t.fail(),
            ([r, s]) => {
                t.deepEqual (r, [1,2])
            }
         )
     )
})

