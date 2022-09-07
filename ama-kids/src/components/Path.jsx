import { random } from '../lib/random'
import { useSelector } from 'react-redux'

export function Path() {
  const { path } = useSelector((state) => state.point)
  const arrows = ['↑', '→', '↓', '←']
  const cells = []
  for (let i of path) {
    cells.push(
      <div key={'path' + random()}>
        {arrows[i]}
      </div>
    )
  }
  return <div className='arrows'>{cells}</div>
}