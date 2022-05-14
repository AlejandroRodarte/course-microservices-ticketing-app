import nats from 'node-nats-streaming';
import { TicketCreatedEvent, TicketCreatedEventData } from '../types';
import Listener from './listener';

export default class TickerCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = 'ticket:created';
  readonly ackWait: number = 5 * 1000;
  readonly durableName: string = 'payments-service';
  readonly queueGroupName: string = 'payments-service';

  onMessage(msg: nats.Message, data: TicketCreatedEventData): void {
    console.log(
      `Received event #${msg.getSequence()}, with data ${JSON.stringify(
        data,
        undefined,
        2
      )}.`
    );
    msg.ack();
  }
}
