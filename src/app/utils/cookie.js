import Cookie from "js-cookie";

const dev = process.env.NODE_ENV === "development";
const parentDomain = dev ? "localhost" : "banyanclaims.com";

const cookie = () => {
  /**
   * use to set cookie
   * @param {*} key
   * @param {*} value
   * @param {*} options - Optional: { expires: number } - if expires is undefined, cookie is session-only
   */
  const setCookie = (key, value, options = {}) => {
    const cookieOptions = {
      path: "/",
      domain: parentDomain,
      secure: !dev,
      sameSite: 'strict'
    };
    
    // Only set expires if provided (undefined = session cookie)
    if (options.expires !== undefined) {
      cookieOptions.expires = options.expires;
    }
    
    return Cookie.set(key, value, cookieOptions);
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


