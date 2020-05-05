module.exports = () => {
  var retries = 10;
  var maxRetries = 50;
  
  const pageSource = () => {
    return browser.getPageSource();
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
      console.log(`It's a match! retries ${retries}`)
      retries--;
      return false;
    }
    
    else {
      console.log(`not a match!`)
      retries = 10;
      source = newSource;
      return false;
    }
  }
  browser.waitUntil(() => {
    return check()
  }, 40000, 'Page didnt load in 40s', 200)
}
