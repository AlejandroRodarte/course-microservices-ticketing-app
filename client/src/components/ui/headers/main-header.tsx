import Link from 'next/link';
import BaseUserDto from '../../../lib/objects/dto/auth/base-user-dto';

interface MainHeaderProps {
  user: BaseUserDto | null;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  return (
    <nav className="p-3 navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {props.user ? 'Sign Out' : 'Sign In/Sign Up'}
        </ul>
      </div>
    </nav>
  );
};

export default MainHeader;
