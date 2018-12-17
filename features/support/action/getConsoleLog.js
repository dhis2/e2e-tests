module.exports = () => {
  const logs = browser.log('browser').value.filter((log) => {
    return log.level === 'SEVERE';
  });

  return logs;
};
