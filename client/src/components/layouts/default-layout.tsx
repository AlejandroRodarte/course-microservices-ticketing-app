import { Fragment } from 'react';
import MainHeader from '../ui/headers/main-header';
import { AuthObjectDtoTypes } from '../../lib/types/objects/dto/auth';

interface DefaultLayoutProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <Fragment>
      <MainHeader user={props.user} />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default DefaultLayout;
