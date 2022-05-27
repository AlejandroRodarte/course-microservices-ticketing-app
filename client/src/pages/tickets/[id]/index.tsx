import { GetServerSideProps } from 'next';
import React from 'react';
import DefaultLayout from '../../../components/layouts/default-layout';
import requests from '../../../lib/requests';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';

interface TicketDetailsPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const TicketDetailsPage: React.FC<TicketDetailsPageProps> = (props) => {
  return (
    <DefaultLayout user={props.user}>
      <h1>TicketDetailsPage</h1>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  TicketDetailsPageProps
> = async (ctx) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  return { props: { user } };
};

export default TicketDetailsPage;
