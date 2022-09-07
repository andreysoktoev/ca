import { useDispatch } from 'react-redux'
import { reset } from '../lib/slice'

export function NewGame() {
  const dispatch = useDispatch()
  return (
    <div className='center'>
      <button onClick={() => dispatch(reset())}>
        ↺
      </button>
    </div>
  )
}