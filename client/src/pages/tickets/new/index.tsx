import { GetServerSideProps } from 'next';
import DefaultLayout from '../../../components/layouts/default-layout';
import TicketForm from '../../../components/pages/tickets/ticket-form';
import requests from '../../../lib/requests';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';

interface NewTicketProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const NewTicketPage: React.FC<NewTicketProps> = (props) => {
  return (
    <DefaultLayout user={props.user}>
      <TicketForm />
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<NewTicketProps> = async (
  ctx
) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  return { props: { user } };
};

export default NewTicketPage;
