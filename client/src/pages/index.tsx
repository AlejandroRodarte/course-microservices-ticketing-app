import type { GetServerSideProps } from 'next';
import DefaultLayout from '../components/layouts/default-layout';
import requests from '../lib/requests';
import { AuthObjectDtoTypes } from '../lib/types/objects/dto/auth';
import { TicketsObjectDtoTypes } from '../lib/types/objects/dto/tickets';

interface HomePageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  tickets: TicketsObjectDtoTypes.BaseTicketDto[] | null;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { user, tickets } = props;

  const ticketList =
    tickets === null
      ? null
      : tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
          </tr>
        ));

  return (
    <DefaultLayout user={user}>
      <div className="container">
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  const tickets = await requests.tickets.getTickets();
  return { props: { user, tickets } };
};

export default HomePage;
