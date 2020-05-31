const test = require ('ava')
const {identity, compose, prop} = require ('ramda')

const Either = require ('../src/either.js')
const StateT = require ('../src/stateT.js')
const StackT = require ('../src/stackT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right, fromNullable} = Either

test ('ap', t => {

    t.plan (2)

    const Model = {
        a: 123,
        b: 456
    }

    // getNode :: NID -> Model -> Either String Node
    const getNode = nid => model =>
        fromNullable ("not found")
                     (prop (nid, model))

    // makeContext :: [Value, State] -> Either String Context
    const makeContext = ([value, state]) => {
        return Right (value + state)
    }

    const TaskEither = TaskT (Either)
    const Nodes = StateT (TaskEither)
    const Transformer = StateT (Nodes)

    const liftEither = compose (Transformer.lift, Nodes.lift, TaskEither.lift)

    const x = Transformer.of (getNode ('a'))
                         .ap (Transformer.lift (Nodes.get))
                         .chain (liftEither)
                         .product (Transformer.get)
                         .map (makeContext)
                         .chain (liftEither)

    x.run (100)
     .run (Model)
     .fork (
         e => t.fail(),
         r => {
             const [[x, s1], s2] = r.fold (t.fail, identity)
             t.is (x, 223)
         }
     )

    const y = Transformer.of (getNode ('c'))
                         .ap (Transformer.lift (Nodes.get))
                         .chain (compose (Transformer.lift, Nodes.lift, TaskEither.lift))

    y.run (0)
     .run (Model)
     .fork (
         e => t.fail(),
         r => {
             r.fold (
                 e => t.is (e, "not found"),
                 _ => t.fail()
             )
         }
     )
})

