import { Fragment } from 'react';
import BaseUserDto from '../../lib/objects/dto/auth/base-user-dto';

interface DefaultLayoutProps {
  user: BaseUserDto | null;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <Fragment>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default DefaultLayout;
