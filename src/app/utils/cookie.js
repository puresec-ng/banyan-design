import Cookie from "js-cookie";

const dev = process.env.NODE_ENV === "development";
const parentDomain = dev ? "localhost" : "banyanclaims.com";

const cookie = () => {
  /**
   * use to set cookie
   * @param {*} key
   * @param {*} value
   */
  const setCookie = (key, value) => {
    return Cookie.set(key, value, {
      path: "/",
      expires: 2,
      domain: parentDomain,
      secure: !dev,
      sameSite: 'strict'
    });
  };

  /**
   * use to get cookie
   * @param {*} key
   */
  const getCookie = (key) => {
    return Cookie.get(key);
  };

  /**
   * use to delete cookie
   * @param {*} key
   */
  const deleteCookie = (key) => {
    return Cookie.remove(key, {
      path: "/",
      domain: parentDomain,
      secure: !dev,
      sameSite: 'strict'
    });
  };

  return { setCookie, getCookie, deleteCookie };
};

export default cookie;


