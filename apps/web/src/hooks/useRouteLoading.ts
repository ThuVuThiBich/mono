import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useEffect, useRef } from 'react';

nProgress.configure({ showSpinner: false });

export const useRouteLoading = () => {
  const router = useRouter();
  const prePath = useRef('');

  useEffect(() => {
    const handleStart = (nextPath: any) => {
      if (prePath.current.includes(`exchange`) && nextPath.includes(`exchange`)) return;
      prePath.current = nextPath;
      nProgress.start();
    };
    const handleStop = () => {
      nProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
};
