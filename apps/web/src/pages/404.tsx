import { Button } from '@cross/ui';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="page_notfound_container">
      <h1>404 - Page Not Found</h1>
      <Link href="/" passHref>
        <Button type="turqoise">Go to home page</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
