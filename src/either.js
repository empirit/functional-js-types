const Either = (() => {
    const Right = x =>
        ({
            isLeft: false,

            chain: f => f(x),

            ap: other => other.map(x),

            alt: other => Right(x),

            extend: f => f(Right(x)),

            concat: other => other.fold(x => other, y => Right(x.concat(y))),

            traverse: (of, f) => f(x).map(Right),

            map: f => Right(f(x)),

            fold: (_, g) => g(x),

            toString: () => `Right(${x})`
        })

    const Left = x =>
        ({
            isLeft: true,

            chain: f => Left(x),

            ap: _ => Left(x),

            extend: _ => Left(x),

            alt: other => other,

            concat: _ => Left(x),

            traverse: (of, _) => of(Left(x)),

            map: _ => Left(x),

            fold: (f, _) => f(x),

            toString: () => `Left(${x})`
        })

    const of = Right;
    const tryCatch = f => {
        try {
            return Right(f())
        } catch(e) {
            return Left(e)
        }
    }

    const fromNullable = err => x =>
        x != null ? Right(x) : Left(err)

    return {Right, Left, of, tryCatch, fromNullable }
})()

module.exports = Either

