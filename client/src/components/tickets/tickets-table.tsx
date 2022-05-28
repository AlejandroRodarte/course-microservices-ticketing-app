import { TicketsObjectDtoTypes } from '../../lib/types/objects/dto/tickets';
import TicketRow from './ticket-row';

interface TicketsTableProps {
  tickets: TicketsObjectDtoTypes.BaseTicketDto[];
}

const TicketsTable: React.FC<TicketsTableProps> = (props) => {
  const { tickets } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} />
        ))}
      </tbody>
    </table>
  );
};

export default TicketsTable;
