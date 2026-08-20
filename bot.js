const mineflayer = require('mineflayer')

const HOST = 'DDragonSMP.play.hosting'
const PORT = 16037 // ⚠️ поменяй на реальный порт из панели play.hosting (Primary), если не 25565
const VERSION = '1.21.11' // пробуем через ViaVersion/ViaBackwards, если сервер их поддерживает

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

function createBot() {
  log('📡 Подключаюсь...')
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: 'KeepAliveBot',
    version: VERSION,
    hideErrors: false,
    closeTimeout: 240000,
    checkTimeoutInterval: 60000
  })

  bot._client.on('connect', () => {
    log('🔗 TCP соединение установлено')
  })

  bot._client.on('add_resource_pack', (packet) => {
    log('🎨 Принимаю ресурспак...')
    bot._client.write('resource_pack_receive', {
      uuid: packet.uuid,
      result: 0
    })
    log('✅ Ресурспак принят')
  })

  bot.on('login', () => {
    log('🟢 Залогинился!')
  })

  bot.on('messagestr', (message) => {
    log(`💬 ${message}`)
  })

  bot.on('spawn', () => {
    log('✅ Бот заспавнился!')
    setInterval(() => {
      bot.setControlState('forward', true)
      setTimeout(() => bot.setControlState('forward', false), 1000)
    }, 30000)
  })

  bot.on('kicked', (reason) => {
    log(`❌ Кикнут: ${reason}`)
    setTimeout(createBot, 15000)
  })

  bot.on('error', (err) => {
    log(`⚠️ Ошибка: ${err.message}`)
    setTimeout(createBot, 15000)
  })

  bot.on('end', (reason) => {
    log(`🔄 Конец: ${reason}`)
    setTimeout(createBot, 15000)
  })
}

log('🔌 Запуск...')
createBot()
