const test = require ('ava')

const Stack = require ('../src/stack.js')

test ('Stack, map', t => {

    t.plan (2)

    const x = Stack.of (1).map (x => x + 3)

    const [a, res] = x.run ([])
    t.is (a, 4)
    t.deepEqual (res, [])

})

test ('Stack, push, peak', t => {

    t.plan (1)

    const x = Stack.push (2)
                   .join (Stack.push (3))
                   .join (Stack.peak)

    const res = x.run ([])
    t.deepEqual (res, [3, [3, 2]])

})

test ('Stack, pop', t => {

    t.plan (1)

    const x = Stack.push (2)
                   .join (Stack.push (3))
                   .join (Stack.pop)

    const res = x.run ([])
    t.deepEqual (res, [3, [2]])

})
