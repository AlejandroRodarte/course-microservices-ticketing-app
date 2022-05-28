import React from 'react';
import { TicketsObjectDtoTypes } from '../../lib/types/objects/dto/tickets';

interface TicketDetailsProps {
  ticket: TicketsObjectDtoTypes.BaseTicketDto;
  onPurchase: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = (props) => {
  const { ticket, onPurchase } = props;

  return (
    <React.Fragment>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <h4>Status: {ticket.orderId ? 'Reserved' : 'Available'}</h4>
      <button
        disabled={!!ticket.orderId}
        className="btn btn-primary"
        onClick={onPurchase}
      >
        Purchase
      </button>
    </React.Fragment>
  );
};

export default TicketDetails;
