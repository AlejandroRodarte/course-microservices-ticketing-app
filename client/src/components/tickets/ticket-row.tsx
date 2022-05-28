import Link from 'next/link';
import React from 'react';
import { TicketsObjectDtoTypes } from '../../lib/types/objects/dto/tickets';

interface TicketRowProps {
  ticket: TicketsObjectDtoTypes.BaseTicketDto;
}

const TicketRow: React.FC<TicketRowProps> = (props) => {
  const { ticket } = props;

  return (
    <tr>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`}>
          <a>View Details</a>
        </Link>
      </td>
    </tr>
  );
};

export default TicketRow;
