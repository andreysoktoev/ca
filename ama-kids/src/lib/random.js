export function random(max, length) {
  const randomNumber = () => {
    return max
      ? Math.floor(Math.random() * max)
      : Math.random()
  }
  if (length > 0) {
    let randomArray = []
    for (let i = 0; i < length; i++) {
      randomArray.push(randomNumber())
    }
    return randomArray
  } else {
    return randomNumber()
  }
}