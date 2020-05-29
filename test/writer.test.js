const test = require ('ava')

const Either = require ('../src/either.js')
const Writer = require ('../src/writer.js')
const WriterT = require ('../src/writerT.js')
const TaskT = require ('../src/taskT.js')
const {Left, Right} = Either

test ('Writer, map', t => {

    t.plan (2)

    const x = Writer.of (1).map (x => x + 3)

    const [a, res] = x.run
    t.is (a, 4)
    t.deepEqual (res, [])

})

test ('Writer, chain', t => {

    t.plan (1)

    const x = Writer.of (1).chain (x => Writer.tell (x + 3))
                           .join (Writer.tell (2))

    const [_, res] = x.run
    t.deepEqual (res, [4, 2])

})

test ('Writer, ap', t => {

    t.plan (1)

    const x = Writer.tell (3)
                    .join (Writer.of (x => x * 2))
                    .ap (Writer.of (5))
                    .chain (Writer.tell)

    const [_, res] = x.run
    t.deepEqual (res, [3, 10])

})

