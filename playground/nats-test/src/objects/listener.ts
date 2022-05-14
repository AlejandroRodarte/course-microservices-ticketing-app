import nats from 'node-nats-streaming';
import { Event } from '../types';

export default abstract class Listener<E extends Event> {
  abstract subject: E['subject'];
  abstract ackWait: number;
  abstract durableName: string;
  abstract queueGroupName: string;
  abstract onMessage(msg: nats.Message, data: E['data']): void;

  private client: nats.Stan;

  constructor(client: nats.Stan) {
    this.client = client;
  }

  listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.getSubscriptionOptions()
    );

    subscription.on('message', (msg: nats.Message) => {
      const data = this.parseMessage(msg);
      this.onMessage(msg, data);
    });
  }

  private getSubscriptionOptions(): nats.SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName(this.durableName)
      .setAckWait(this.ackWait);
  }

  private parseMessage(msg: nats.Message): E['data'] {
    const data = msg.getData();
    return (
      typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'))
    ) as E['data'];
  }
}
