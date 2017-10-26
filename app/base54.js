const alphabet = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ'
const base = alphabet.length

const encode = (num) => {
  let encoding = '',
    symbol = ''
  while (num) {
    symbol =  alphabet[num % base]
    num = Math.floor(num / base)
    encoding = symbol.toString() + encoding
  }
  return encoding
}

const decode = (str) => {
  let decoding = 0
  let index, power
  while (str){
    index = alphabet.indexOf(str[0])
    power = str.length - 1
    decoding += index * (Math.pow(base, power))
    str = str.slice(1)
  }
  return decoding
}

module.exports.encode = encode
module.exports.decode = decode