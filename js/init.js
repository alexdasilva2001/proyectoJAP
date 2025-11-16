const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
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