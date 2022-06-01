import type { GetServerSideProps } from 'next';
import React from 'react';
import DefaultLayout from '../components/layouts/default-layout';
import TicketsTable from '../components/tickets/tickets-table';
import requests from '../lib/requests';
import { AuthObjectDtoTypes } from '../lib/types/objects/dto/auth';
import { TicketsObjectDtoTypes } from '../lib/types/objects/dto/tickets';

interface HomePageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  tickets: TicketsObjectDtoTypes.BaseTicketDto[] | null;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { user, tickets } = props;

  return (
    <DefaultLayout user={user}>
      {tickets && (
        <div className="container">
          <h1>Tickets</h1>
          <TicketsTable tickets={tickets} />
        </div>
      )}
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
