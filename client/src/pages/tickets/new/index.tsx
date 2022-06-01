import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import DefaultLayout from '../../../components/layouts/default-layout';
import TicketForm from '../../../components/pages/tickets/ticket-form';
import useRequest from '../../../lib/hooks/use-request';
import requests from '../../../lib/requests';
import { FormTypes } from '../../../lib/types/forms';
import { TicketsObjectDataTypes } from '../../../lib/types/objects/data/tickets';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';
import { RequestTypes } from '../../../lib/types/requests';

interface NewTicketProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const NewTicketPage: React.FC<NewTicketProps> = (props) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest<
    RequestTypes.NewTicketBody,
    TicketsObjectDataTypes.NewTicketData
  >({
    endpoint: 'tickets',
    microservice: 'tickets',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const onTicketFormSubmit = useCallback(
    async (form: FormTypes.TicketForm) => {
      const [response, error] = await doRequest({
        data: { newTicket: { title: form.title, price: +form.price } },
      });
      if (error || (response && response.error)) return;
      if (response.data && response.status === 201) router.replace('/');
    },
    [doRequest, router]
  );

  return (
    <DefaultLayout user={props.user}>
      <TicketForm onSubmit={onTicketFormSubmit} errors={errors} />
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<NewTicketProps> = async (
  ctx
) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: `/auth/sign-in/?redirect=${encodeURIComponent(
          '/tickets/new'
        )}`,
      },
    };
  return { props: { user } };
};

export default NewTicketPage;
