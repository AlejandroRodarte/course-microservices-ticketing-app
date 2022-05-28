import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import DefaultLayout from '../../../components/layouts/default-layout';
import TicketDetails from '../../../components/tickets/ticket-details';
import useRequest from '../../../lib/hooks/use-request';
import requests from '../../../lib/requests';
import { OrdersObjectDataTypes } from '../../../lib/types/objects/data/orders';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';
import { TicketsObjectDtoTypes } from '../../../lib/types/objects/dto/tickets';
import { RequestTypes } from '../../../lib/types/requests';

interface TicketDetailsPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  ticket: TicketsObjectDtoTypes.BaseTicketDto | null;
}

const TicketDetailsPage: React.FC<TicketDetailsPageProps> = (props) => {
  const { user, ticket } = props;
  const router = useRouter();

  const { doRequest, errors } = useRequest<
    RequestTypes.NewOrderBody,
    OrdersObjectDataTypes.CreateOrderData
  >({
    endpoint: 'orders',
    microservice: 'orders',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const onPurchase = useCallback(async () => {
    if (!router.query.id || typeof router.query.id !== 'string') return;

    const [response, error] = await doRequest({
      data: { newOrder: { ticketId: router.query.id } },
    });
    if (error || (response && response.error)) return;
    if (response && response.status === 201 && response.data)
      router.push(`/orders/${response.data.newOrder.id}`);
  }, [doRequest, router.query.id]);

  return (
    <DefaultLayout user={user}>
      {ticket && (
        <div className="container">
          <TicketDetails ticket={ticket} onPurchase={onPurchase} />
          {errors}
        </div>
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  TicketDetailsPageProps
> = async (ctx) => {
  const id = ctx.params
    ? ctx.params.id && typeof ctx.params.id === 'string'
      ? ctx.params.id
      : undefined
    : undefined;

  if (!id) return { redirect: { permanent: false, destination: '/' } };

  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  const ticket = await requests.tickets.getTicket(id);

  if (!ticket) return { redirect: { permanent: false, destination: '/' } };
  return { props: { user, ticket } };
};

export default TicketDetailsPage;
