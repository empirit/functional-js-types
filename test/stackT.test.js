const test = require ('ava')

const StackT = require ('../src/stackT.js')
const Either = require ('../src/either.js')

test ('StackT, map', t => {

    t.plan (2)

    const Transformer = StackT (Either)

    const x = Transformer.of (1).map (x => x + 3)

    x.run ([])
     .fold (
         e => t.fail(),
         ([a, res]) => {
             t.is (a, 4)
             t.deepEqual (res, [])
         }
     )


})

test ('StackT, push, peek', t => {

    t.plan (1)

    const Transformer = StackT (Either)

    const x = Transformer.push (2)
                   .join (Transformer.push (3))
                   .join (Transformer.peek)

    x.run ([])
     .fold (
         e => t.fail(),
         res => t.deepEqual (res, [3, [3, 2]])
     )

})

test ('StackT, pop', t => {

    t.plan (1)

    const Transformer = StackT (Either)

    const x = Transformer.push (2)
                   .join (Transformer.push (3))
                   .join (Transformer.pop)

    x.run ([])
     .fold (
         e => t.fail(),
         res => t.deepEqual (res, [3, [2]])
     )

})

