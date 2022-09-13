import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const getCookies = (key: string, ctx?: any) => {
  const cookie = parseCookies(ctx);
  return cookie[key];
};

export const setCookies = (key: string, value: any) => {
  setCookie(null, key, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

export const removeCookies = (key: string) => {
  destroyCookie(null, key, {
    path: '/',
  });
};

export const parseJson = (str: string) => {
  try {
    const data = JSON.parse(str);
    return data;
  } catch (err) {
    return null;
  }
};
