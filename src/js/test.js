const lyrics =
    "[ti:不哭]\r\n[ar:王心凌]\n[00:00.00]歌曲名 不哭 歌手名 王心凌\n[00:02.00]作词：吴本伟\r\n[00:05.00]作曲：秀智\r\n[00:21.71]起初相信爱的路\r\n[00:23.91]终点是指向幸福\r\n[00:27.47]才会一而再的选择让步\r\n[00:31.42]太固执而盲目忘了停下来\r\n[00:35.95]心疼自己的无助\r\n[00:42.53]无辜你拿手演出\r\n[00:44.78]终于我可以麻木\r\n[00:48.28]从这里分割出两个国度\r\n[00:51.68]挥霍多少时间\r\n[00:54.88]折磨多少痛苦\r\n[00:57.48]才累积出的领悟\r\n[01:02.93]忍住不哭我要忍住不哭\r\n[01:08.29]望向天空不让眼泪流出\r\n[01:12.44]抬头看进云深处\r\n[01:17.01]等待那日出把故事结束\r\n[01:21.25]把从前一笔消除\r\n[01:23.85]忍住不哭我要忍住不哭\r\n[01:29.10]不能认输\r\n[01:31.01]因为我相信彩虹总跟着薄雾\r\n[01:36.69]会带来幸福\r\n[01:39.29]在下一个叉路\r\n[01:42.09]陪我跳全新的舞\r\n[02:05.99]起初相信爱的路\r\n[02:08.24]终点是指向幸福\r\n[02:11.79]才会一而再的选择让步\r\n[02:15.80]太固执而盲目忘了停下来\r\n[02:20.30]心疼自己的无助\r\n[02:26.90]无辜你拿手演出\r\n[02:29.10]终于我可以麻木\r\n[02:32.70]从这里分割出两个国度\r\n[02:36.00]挥霍多少时间\r\n[02:39.25]折磨多少痛苦\r\n[02:41.93]才累积出的领悟\r\n[02:47.29]忍住不哭我要忍住不哭\r\n[02:52.59]望向天空不让眼泪流出\r\n[02:56.79]抬头看进云深处\r\n[03:01.39]等待那日出把故事结束\r\n[03:05.54]把从前一笔消除\r\n[03:08.19]忍住不哭我要忍住不哭\r\n[03:13.45]不能认输\r\n[03:15.40]因为我相信彩虹总跟着薄雾\r\n[03:20.97]会带来幸福\r\n[03:23.62]在下一个叉路\r\n[03:26.44]陪我跳全新的舞\r\n[03:38.90]啦\r\n";


// "@migu music@\r\n大眠 - 王心凌 (Cyndi Wang)\r\n词：施人诚\r\n曲：张简君伟\r\n编曲：游政豪\r\n感谢他把我 当成傻子\r\n每天都哄我 上当一次\r\n清醒一辈子 也就那样子\r\n不介意用爱 来醉生梦死\r\n原来被催眠 真有意思\r\n我乐于作个 敬业人质\r\n没空再去对谁解释\r\n是我自己把自己挟持\r\n不关他的事\r\n都快忘了怎样恋一个爱\r\n我被虚度了的青春\r\n也许还能活过来\r\n说心疼我的更应该明白\r\n我当然会沉醉个痛快\r\n就让我陪他恋完这场爱\r\n只求心花终于盛开\r\n就没有别的期待\r\n等梦完醒来 再去收拾残骸\r\n原来被催眠 真有意思\r\n我乐于作个 敬业人质\r\n没空再去对谁解释\r\n是我自己把自己挟持\r\n不关他的事\r\n都快忘了怎样恋一个爱\r\n我被虚度了的青春\r\n也许还能活过来\r\n说心疼我的更应该明白\r\n我当然会沉醉个痛快\r\n就让我陪他恋完这场爱\r\n只求心花终于盛开\r\n就没有别的期待\r\n等梦完醒来 再去收拾残骸\r\n如果不失去理智\r\n爱情要从何开始\r\n傻傻的骗子\r\n和骗人的傻子\r\n才可能一生一世\r\n都快忘了怎样恋一个爱\r\n我被虚度了的青春\r\n也许还能活过来\r\n说心疼我的更应该明白\r\n我当然会沉醉个痛快\r\n就让我陪他恋完这场爱\r\n只求心花终于盛开\r\n就没有别的期待\r\n等梦完醒来\r\n再去收拾残骸\r\n"
let sentencs = lyrics.split(/\r\n|\n/);
// console.log(sentencs);
let res = [];
sentencs.forEach((s) => {
    if (s.length) {
        let temp = /\[(\d+):(\d+)\.(\d+)](.*)/.exec(s);
        if (temp) {
            res.push({
                minute: temp[1],
                second: temp[2],
                millisecond: temp[3],
                sentence: temp[4]
            })
        }
    }
});

console.log(res);
