import { random } from '../lib/random'
import { useSelector, useDispatch } from 'react-redux'
import { pick, solve } from '../lib/slice'

export function Maze() {
  const dispatch = useDispatch()
  const {choice, path, solution, start } = useSelector((state) => state.point)
  const tmp = new Map([
    [0, -3],
    [1, 1],
    [2, 3],
    [3, -1]
  ])
  const cells = []
  for (let i = 0; i < 9; i++) {
    cells.push(
      <div
        id={i}
        key={'maze' + random()}
        onClick={() => f(i)}
      >
        {
          solution === i
            ? '🟢'
            : choice === i
              ? '🔴'
              : start === i
                ? '🟡'
                : null
        }
      </div>
    )
  }
  function f(cell) {
    dispatch(pick(cell))
    let x = start
    for (const i of path) {
      const y = tmp.get(i)
      const pow = Math.pow(y, 2)
      if (pow === 9) {
        if (x + y >= 0 && x + y < 9) {
          x += y
        }
      } else if (pow === 1) {
        if (x % 3 + y >= 0 && x % 3 + y < 3) {
          x += y
        }
      }
    }
    dispatch(solve(x))
  }
  return <div className='grid'>{cells}</div>
}