import { Button } from '@cross/ui';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div className="page_notfound_container">
      <h1>500 - Internal Server Error.</h1>
      <Link href="/" passHref>
        <Button type="turqoise">Go to home page</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
