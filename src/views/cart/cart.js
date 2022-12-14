/*
  - 장바구니 관련 기능
    - [x] 장바구니 관련 데이터는 백엔드 데이터베이스가 아닌, 프론트단(localStorage, sessionStorage, indexedDB 등)에서 관리된다.
    - [x] 프론트 단에, 장바구니에 속한 상품 관련 데이터가 저장되어서, 페이지를 새로고침해도 장바구니에 상품들이 그대로 남아 있다.
    - [x] 장바구니 추가 - 사용자는 상품을 장바구니에 추가할 수 있다.
      -[x] 장바구니 추가 버튼을 이미 눌렀으면 '이미 담겨있는 상품입니다.'라는 alert를 띄운다
    - [ ] 장바구니 수정 - 사용자는 장바구니에 속한 상품의 수량을 수정할 수 있다.
    - [x] 장바구니 전체 삭제 - 사용자는 장바구니에서, 버튼 1번의 클릭으로, 장바구니 상의 전체 상품을 제거할 수 있다.
    - [x] 장바구니 부분 삭제 - 사용자는 장바구니에서, 일부 상품을 골라서 제거할 수 있다.
                        - 부분삭제 시 로컬스토리지에서도 같이 삭제되야한다.
                        - 새로고침을 해야됨..
    - [x] 장바구니 조회 - 사용자는 장바구니에 담긴 상품 목록을 확인할 수 있다.
    - [x] 장바구니 가격 조회 - 사용자는 장바구니에 담긴 상품들의 총 가격을 확인할 수 있다.

  - 상세페이지에서 장바구니 버튼 클릭 시 id 값만 배열형태로 로컬스토리지 저장
  - 장바구니페이지에서 1번에서의 같은 api를 다시 요청하여 id 값과 매치시켜서 제목 이미지 가격 받아오기

*/
import * as Api from "../../api.js";
import $ from "../../utils/dom.js";
import store from "../../utils/store.js";
import { navigate, addCommas } from "../../useful-functions.js";
import { renderProduct } from "./render.js";

// reduce로 될듯?
let totalPrice = 0;
const sumBookPrice = (price) => {
  totalPrice += Number(price);
  return totalPrice;
};

// const changeQuantity = () => {
//   console.log("plus");
//   $("#quantity").innerText++;
// };

const initCart = async () => {
  const productList = store.getLocalStorage()?.map((book) => book.id);
  console.log(store.getLocalStorage());
  //[1,2,3] -> [new Promise(1), ...] -> [{title: 1, ...}, {title: 2, ...}, ...]
  // 병렬적으로 데이터를 받지 않는다면 순서가 랜덤하게 들어오기 때문에 병렬화
  const bookList = await Promise.all(
    productList.map((productId) => {
      return Api.get(`/api/products/${productId}`);
    })
  );
  console.log(productList);
  renderBooks(bookList);
};

const renderBooks = (bookList) => {
  bookList.forEach((book) => {
    renderProduct(book);
    // console.log($(`#quantity-${id}`).value);
    let totalPrice = sumBookPrice(Number(book.price));
    window.localStorage.setItem("totalPrice", totalPrice);
    $("#productsTotal").innerHTML = addCommas(totalPrice) + "원";
    $("#orderTotal").innerHTML = addCommas(totalPrice) + "원";
  });
};

const deleteAllProduct = () => {
  localStorage.clear();
  const productList = $(".product-list");
  while (productList.firstChild) {
    productList.removeChild(productList.firstChild);
  }
};

initCart();

const deleteSelectProduct = () => {
  console.log($(".product-list").children);
  // [<div1>, <div 2>, ...] -> [1, 2, 3]
  const productIdList = Array.from($(".product-list").children).reduce(
    (productIdList, product) => {
      console.log(productIdList);
      console.log(product);
      const checkbox = product.querySelector('input[type="checkbox"]');
      console.log(checkbox);
      const isChecked = checkbox?.checked;

      if (isChecked) {
        product.remove();
        return productIdList;
      } else {
        return [...productIdList, product.id];
      }
    },
    []
  );
  store.setLocalStorage(
    productIdList.map((book) => ({
      id: book,
    }))
  );
  // location.reload();
};

$(".allDeletebox").addEventListener("click", deleteAllProduct);
$(".partDeletebox").addEventListener("click", deleteSelectProduct);
$("#purchaseButton").addEventListener("click", navigate("/order"));
// $("#plus").addEventListener.on("click", changeQuantity);
// $("#minus").addEventListener("click", changeQuantity);
