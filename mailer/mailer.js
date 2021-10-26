const amqp = require('amqplib');

let instance;

class MessageBroker {
  async init() {
    this.conn = await amqp.connect('amqp://rabbit');
    this.channel = await this.conn.createChannel();
    return this;
  }

  static async getInstance() {
    if (!instance) {
      const broker = new MessageBroker();
      instance = await broker.init();
    }
    return instance;
  }

  async subscribe({ queue }) {
    if (!this.conn) {
      await this.init();
    }
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(queue, async (msg) => {
      const message = JSON.parse(msg.content.toString());
      console.log('Sending a message to:', message.email);
      console.log('With body:', message.link);
    });
  }
}

(async () => {
  const broker = await MessageBroker.getInstance();
  await broker.subscribe({ queue: 'mail' });
})();
