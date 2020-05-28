const test = require ('ava')

const Either = require ('../src/either.js')
const ReaderT = require ('../src/readerT.js')

test ('readerT product', t => {

    t.plan (1)

    const Transformer = ReaderT (Either)

    const x = Transformer.of(1)
        .product (Transformer.of(2))


    x.run (0)
    .fold (
        e => t.failed(),
        r => {
            t.is ([1,2], r)
        }
    )
})
