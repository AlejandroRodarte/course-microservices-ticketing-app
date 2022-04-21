import { Fragment } from 'react';
import BaseUserDto from '../../lib/objects/dto/auth/base-user-dto';
import MainHeader from '../ui/headers/main-header';

interface DefaultLayoutProps {
  user: BaseUserDto | null;
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
