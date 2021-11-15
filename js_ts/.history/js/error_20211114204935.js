function throwit() {
    throw new Error('');
  }
  
  function catchit() {
    try {
      throwit();
    } catch(e) {
      console.log(e.stack); // print stack trace
    }
  }
