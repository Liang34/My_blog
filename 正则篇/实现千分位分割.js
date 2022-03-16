var a = '19,351,235.235767'
const numFormat = (str) => {
  const reg = /(?!^)(?=(\d{3})+$)/g
  const num1 = str.split('.')[0]
  const num2 = str.split('.')[1]
  num1.replace(reg, ',')
  return num1 + '.' + num2
}
console.log(numFormat(a))
// const reg = /(?!^)(?=(\d{3})+$)/g
// console.log(a.replace(reg, ','))