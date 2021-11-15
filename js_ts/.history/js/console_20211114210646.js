
console.log(
    '%cThis text is styled!',
    'color: red; background: yellow; font-size: 24px;'
  )

  console.log(Date);

  ['log', 'info', 'warn', 'error'].forEach(function(method) {
    console[method] = console[method].bind(
      console,
      new Date().toISOString()
    );
  });
  
  console.log("出错了！");
  // 2014-05-18T09:00.000Z 出错了！

  var languages = [
    { name: "JavaScript", fileExtension: ".js" },
    { name: "TypeScript", fileExtension: ".ts" },
    { name: "CoffeeScript", fileExtension: ".coffee" }
  ];
  
  console.table(languages);


  console.dir(languages)


  console.assert(false, '判断条件不成立')
  console.info('info')
  console.