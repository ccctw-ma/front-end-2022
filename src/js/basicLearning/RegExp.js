
var r = /abc/igm;

console.log(r.ignoreCase);
console.log(r.global);
console.log(r.multiline);
console.log(r.flags);
console.log(r.lastIndex);
console.log(r.source);

console.log(/cat/.test('hello world cat and swift'));
 r = /x/g;
let s = '_x_x';
r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false
console.log(r.lastIndex);

console.log(s.match(/x/));
console.log(s.match(/y/));
console.log('xaxb'.match(/a|b/g));
console.log('aaa'.replace(/a/g,'b'));
// search, match , split , replace 这些均可以使用正则表达式进行匹配


// 匹配规则 
// 点字符（.）匹配除回车（\r）、换行(\n) 、行分隔符（\u2028）和段分隔符（\u2029）以外的所有字符
console.log('  c-t'.match(/c.t/));
//^ 表示字符串的开始位置 $ 表示字符串的结束位置
console.log(/^test/.test('23test')); //false
console.log(/^test/.test('test233')); //true
console.log(/test$/.test('233test')); //true
//竖线符号（|）在正则表达式中表示“或关系”（OR），即cat|dog表示匹配cat或dog。
console.log(/cat|dog/.test('adksjhfakjcatdaskjfhkjddog')); //true

//转义符
console.log(/1\+1/.test('1+1')); // \+转译为'+'
//正则表达式中，需要反斜杠转义的，一共有12个字符：^、.、[、$、(、)、|、*、+、?、{和\。
//需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

//字符类
//字符类（class）表示有一系列字符可供选择，只要匹配其中一个就可以了。所有可供选择的字符都放在方括号内，比如[xyz] 表示x、y、z之中任选一个匹配。

console.log(/[abc]/.test('hello world')); //false
//脱字符（^）
//如果方括号内的第一个字符是[^]，则表示除了字符类之中的字符，其他字符都可以匹配。比如，[^xyz]表示除了x、y、z之外都可以匹配。
console.log(/[^abc]/.test('bbc news')); // true

//连字符（-）
console.log(/a-z/.test('b')); // false
console.log(/[a-z]/.test('b')); //true
console.log(/[0-9]/.test('dsfasd45fadsf'));//ture

// 预定义模式指的是某些常见模式的简写方式。

//\d 匹配0-9之间的任一数字，相当于[0-9]。
//\D 匹配所有0-9以外的字符，相当于[^0-9]。
//\w 匹配任意的字母、数字和下划线，相当于[A-Za-z0-9_]。
//\W 除所有字母、数字和下划线以外的字符，相当于[^A-Za-z0-9_]。
//\s 匹配空格（包括换行符、制表符、空格符等），相等于[ \t\r\n\v\f]。
//\S 匹配非空格的字符，相当于[^ \t\r\n\v\f]。
//\b 匹配词的边界。
//\B 匹配非词边界，即在词的内部。
console.log(/\s\w*/.exec('hello world'));
console.log(/.*/.exec('<b>Hello</b>\n<i>world!</i>'));
console.log(/[\S\s]*/.exec("<b>Hello</b>\n<i>world!</i>"));

//重复类
//模式的精确匹配次数，使用大括号（{}）表示。{n}表示恰好重复n次，{n,}表示至少重复n次，{n,m}表示重复不少于n次，不多于m次。
console.log(/lo{2}k/.test('look'));
console.log(/lo{2,5}k/.test('looooook'));

// 量词符 量词符用来设定某个模式出现的次数。

//? 问号表示某个模式出现0次或1次，等同于{0, 1}。
// *星号表示某个模式出现0次或多次，等同于{0,}。
//+ 加号表示某个模式出现1次或多次，等同于{1,}。


//非贪婪模式

//+?：表示某个模式出现1次或多次，匹配时采用非贪婪模式。
//*?：表示某个模式出现0次或多次，匹配时采用非贪婪模式。
//??：表格某个模式出现0次或1次，匹配时采用非贪婪模式。



// 修饰符

//g 修饰符

//默认情况下，第一次匹配成功后，正则对象就停止向下匹配了。
//g修饰符表示全局匹配（global），加上它以后，正则对象将匹配全部符合条件的结果，主要用于搜索和替换。


//i 修饰符

// 默认情况下，正则对象区分字母的大小写，加上i修饰符以后表示忽略大小写（ignoreCase）。

console.log(/abc/i.test('ABC')); //true

//m 修饰符

// m修饰符表示多行模式（multiline），会修改^和$的行为。默认情况下（即不加m修饰符时）
// ，^和$匹配字符串的开始处和结尾处，加上m修饰符以后，^和$还会匹配行首和行尾，即^和$会识别换行符（\n）。



let m = 'abcabc'.match(/(.)b(.)/)
console.log(m);


console.log(/y(..)(.)\2\1/.test('yabccab')); // (..)匹配ab (.)匹配c 那么 \1 对应 ab \2 对应 c


let tagName = /<([^>]+)>[^<]*<\/\1>/ 
console.log(tagName.exec('<span>name</span>')); // 妙呀

console.log(/.*?/g.exec('hello world'));

var html = '<b class="hello">Hello world</b><i>world</i>';
var tag = /<(\w+)([^>]*)>(.*?)<\/\1>/g;

var match = tag.exec(html);
console.log(match);

var url =/(?:http|ftp):\/\/([^\/\r\n]+)(\/[^\r\n]*)?/
console.log(url.exec('http://www.baidu.com/'));


// 这个是真的难呀