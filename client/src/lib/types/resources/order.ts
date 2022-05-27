import statuses from '../../constants/resources/order/statuses';

export namespace OrderResourceTypes {
  export type Status = typeof statuses[number];
}
