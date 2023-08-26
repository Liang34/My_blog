function test(str) {
    const a = str.split('.')
    let str1 = ''
    for(let i of a) {
        str1+=Number(i).toString(2)
    }
    console.log(str1)
    return parseInt(str1, 2)
}
console.log(test('192.168.0.1'))