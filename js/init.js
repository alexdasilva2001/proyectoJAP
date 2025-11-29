const CATEGORIES_URL = "http://localhost:3000/cats/cat.json";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/buy.json";
const EXT_TYPE = ".json";

const showSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "block";
};

const hideSpinner = () => {
  document.getElementById("spinner-wrapper").style.display = "none";
};

const getJSONData = (url) => {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(response => {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(error => {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
};