import { Button, Modal } from '@cross/ui';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import { getAuthModal, setAuthModal } from 'store/ducks/system/slice';
import styles from './styles.module.less';

const AuthModal: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const state = useAppSelector(getAuthModal);

  const handleClose = () => {
    dispatch(setAuthModal(null));
  };

  const get = useMemo(() => {
    switch (state) {
      case 'login':
        return {
          title: t('login.title'),
          button: t('login.button.login'),
          url: '/api/auth/login',
        };
      case '2fa':
        return {
          title: 'SET UP 2FA',
          button: 'Setup 2FA',
          url: 'two-factor-auth',
        };
      case 'signup':
        return {
          title: t('login.button.register'),
          button: t('login.button.register'),
          url: '/api/auth/signup',
        };
      default:
        return {
          title: t('login.registration_required'),
          button: t('login.button.register'),
          url: '/api/auth/signup',
        };
    }
  }, [state, t]);

  const handleNavigate = () => {
    if (state === '2fa') {
      router.push('/mfa/enable');
    } else {
      window.location.href = get.url;
    }
  };

  return (
    <Modal width={325} centered visible={!!state} onCancel={handleClose}>
      <div className={styles.header}>
        <p className="primary bold uppercase">{get.title}</p>
        <span className="text-16">Setup 2FA to add extra security level to your account</span>
      </div>
      <div className="f-center">
        <Button onClick={handleNavigate} className={styles.btnSubmit} type="primary">
          {get.button}
        </Button>
      </div>

      {/* {state === 'auth' && (
        <div className={styles.outerModal}>
          <p className="text-12 m-0">{t('login.already_have_an_account')}</p>
          <a href={`/api/auth/login?returnTo=${router.pathname}`}>
            <Button type="text">
              <span className="primary">{t('login.title')}</span>
              <FontAwesomeIcon color="#fff" icon={faArrowRight} />
            </Button>
          </a>
        </div>
      )} */}
    </Modal>
  );
};

export default AuthModal;
