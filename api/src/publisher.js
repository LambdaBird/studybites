import amqp from 'amqplib';

let instance;

export class MessageBroker {
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

  async send({ queue, msg }) {
    if (!this.conn) {
      await this.init();
    }
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.sendToQueue(queue, msg);
  }
}
