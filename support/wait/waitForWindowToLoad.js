module.exports = () => {
  var retries = 3;
  var maxRetries = 20;
  
  const pageSource = () => {
    return browser.$('body').getHTML()
  }

  var source = pageSource();
  const check = () => {
    maxRetries--;
    const newSource = pageSource();
    if (maxRetries < 1) {
      console.log(`max retry count reached. Won't resume waiting`)
      return true;
    }

    if (newSource === source) {
      if (retries <= 0) {
        console.log('finished waiting')
        return true;
      }
      retries--;
      return false;
    }
    
    else {
      retries = 3;
      source = newSource;
      return false;
    }
  }

  browser.waitUntil(
    () => { return check()}, 
    {
      timeout: 40000, 
      timeoutMsg: 'Page didnt load in 40s',
      interval: 700
    })
}
