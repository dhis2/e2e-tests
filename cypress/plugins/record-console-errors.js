const CDP = require('chrome-remote-interface'); 

let messages = []
function install(on, options) {
  on('before:browser:launch', (browser = {}, launchOptions) => {
      const port = getRemoteDebuggingPort( launchOptions.args || launchOptions );

      const tryConnect = () => {
        new CDP({
          port: port
        })
        .then((cdp) => {
          log('Connected to Chrome Debugging Protocol')
    
          /** captures logs from the browser */
          cdp.Console.enable();
          cdp.Console.messageAdded(recordMessage );
          // Captures network logs
          cdp.Log.enable()
          cdp.Log.entryAdded(recordMessage)
          cdp.on('disconnect', () => {
            log('Chrome Debugging Protocol disconnected')
          })
        })
        .catch(() => {
          setTimeout(tryConnect, 100)
        })
       
      }

      tryConnect();
  })
  on('task', {
    'console:logs'() {
      return messages;
    },

    'console:clear'() {
      messages = []
      return null
    }
  })
}


function recordMessage( params) {
  let message;
  if (params.entry) {
    message = params.entry;
  }

  else {
    message = params.message;
  }

  let level = message.level;
  if ( level == 'error' ) {
    messages.push(message)
  }  
}

function log(message) {
  console.log('[record-console-errors] ' + message)
}

function getRemoteDebuggingPort(args) {
  const existing = args.find(arg => arg.slice(0, 23) === '--remote-debugging-port')

  if (existing) {
    return Number(existing.split('=')[1])
  }
  const port = 40000 + Math.round(Math.random() * 25000)
  args.push(`--remote-debugging-port=${port}`)
  return port
}

module.exports = {
  install
}