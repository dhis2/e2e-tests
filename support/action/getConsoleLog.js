module.exports = () => {
  const logs = browser.getLogs('browser').filter((log) => {
    return log.level === 'SEVERE';
  });
  return logs;
};
