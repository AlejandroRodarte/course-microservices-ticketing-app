import Link from 'next/link';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';
import { UIComponentTypes } from '../../../lib/types/components/ui';
import { useRouter } from 'next/router';

interface MainHeaderProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const router = useRouter();
  const { redirect } = router.query;

  const links: UIComponentTypes.HeaderLink[] = [
    {
      href: '/auth/sign-up',
      label: 'Sign Up',
      show: !!!props.user,
    },
    {
      href: '/auth/sign-in',
      label: 'Sign In',
      show: !!!props.user,
    },
    {
      href: '/tickets/new',
      label: 'Sell Tickets',
      show: !!props.user,
    },
    {
      href: '/orders',
      label: 'My Orders',
      show: !!props.user,
    },
    {
      href: '/auth/sign-out',
      label: 'Sign Out',
      show: !!props.user,
    },
  ];

  return (
    <nav className="p-3 navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map(
            (link) =>
              link.show && (
                <li className="nav-item" key={link.label}>
                  <Link
                    href={{
                      pathname: link.href,
                      query: redirect ? { redirect } : undefined,
                    }}
                  >
                    <a className="nav-link">{link.label}</a>
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default MainHeader;
