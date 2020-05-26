const EitherT = M => {
    const Right = mx =>
        ({
            isLeft: false,
            extract: () => mx,
            chain: f => Right(mx.chain(x => f(x).extract())),   
            map: f => Right(mx.map(f)),
            fold: (_, g) => g(mx)
        })

    const Left = mx =>
        ({
            isLeft: true,
            extract: () => mx,
            chain: _ => Left(mx),
            map: _ => Left(mx),
            fold: (h, _) => h(mx)
        })

    const of = x => Right(M.of(x))
    const tryCatch = f => {
        try {
            return Right(M.of(f()))
        } catch(e) {
            return Left(e)
        }
    }

    const lift = Right

    return {of, tryCatch, lift, Right, Left }
}

module.exports = EitherT

