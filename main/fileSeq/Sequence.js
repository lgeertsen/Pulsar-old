let sequence = {
  [Symbol.iterator](){
    let pre = 0, cur = 1
    return {
      next(){
        [pre, cur] = [cur, pre + cur]
        return {done: false, value: cur}
      }
    }
  }
}

class FileSequence {
  constructor() {

  }

  /**
  * @param {very_long_type} name           Description.
  * @param {type}           very_long_name Description.
  */
  format(string template){

  }

}
