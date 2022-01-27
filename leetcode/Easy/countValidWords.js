/**
 * @param {string} sentence
 * @return {number}
 *
 * 2047. 句子中的有效单词数
 */
var countValidWords = function (sentence) {
  return sentence.split(" ").reduce((count, s) => {
    if (s.length > 0 && /^([a-z]+-?[a-z]+[!.,]?|[a-z]*[!.,]?)$/.test(s)) {
      count++;
    }
    return count;
  }, 0);
};

const sentence = "cat an-d1  dog";

// console.log("an-d1".match(/[a-z]+-?[a-z]+[!.,]?|[a-z]*[!.,]?/));
console.log(countValidWords(sentence));

console.log( /^([a-z]+-?[a-z]+[!.,]?|[a-z]*[!.,]?)$/.test('and'));



console.log(/<([^>]+)>[^<]*<\/\1>/.exec("<div>hello world</div>"));