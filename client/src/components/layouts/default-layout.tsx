import { Fragment } from 'react';

interface DefaultLayoutProps {}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <Fragment>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default DefaultLayout;
