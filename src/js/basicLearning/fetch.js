/**
 * @Author: msc
 * @Date: 2022-08-29 20:32:29
 * @LastEditTime: 2022-08-30 21:44:10
 * @LastEditors: msc
 * @Description: 
 */


(async () => {

    const args = process.argv.splice(2);
    console.log(args);
    const trial = "demo";
    const url = `https://evaal.aaloa.org/evaalapi/${trial}/nextdata?position=1,1,1&horizon=0.5`;
    const res = await fetch(url);
    // console.log(res);
    console.log(res.status);
    const data = await res.text();
    console.log(data);
})();