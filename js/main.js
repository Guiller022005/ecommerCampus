import { menulistCategoryIndex } from "./components/menu.js";
import { galleryIndex } from "./components/gallery.js";
import { getAllProductsName, getAllCategory, getAllProductRandom } from "./module/app.js";
import { getProductId } from "./module/detail.js";
import { footerIndex } from "./components/footer.js";

/*let header__information = document.querySelector(".header__information")
let [p, span]= header__information.children;

span.innerHTML = "Guillermo Paúl";*/

let input__search = document.querySelector("#input_search");
let main__article = document.querySelector(".main__article");
let nav__ul = document.querySelector(".nav__ul");
let footer__ul = document.querySelector(".footer__ul")

let searchProducts = async e => {

    let params = new URLSearchParams(location.search);
    let dataSearch = { search : e.target.value, id: params.get('id')}
    input__search.value = null;
    let res = ""
    if(input__search.dataset.opc == "random"){
        res = await getAllProductRandom({})
        delete input__search.dataset.opc
        history.pushState(null, "", "?id=aps");
        console.log(dataSearch);
    }
    else {
        res = await getAllProductsName(dataSearch)
        console.log(dataSearch);
    }
    console.log(res);
    main__article.innerHTML = galleryIndex(res, params.get('id'));

    let {data: {products}} = res;
    let asin = products.map(value => {return {id: value.asin}});

    let proceso = new Promise(async(resolve, reject)=>{
        for (let i = 0; i < asin.length; i++) {
            if(localStorage.getItem(asin[i].id)) continue;
            let data = await getProductId(asin[i])
            localStorage.setItem(asin[i].id, JSON.stringify(data))
        }
        resolve({message: "Datos buscados correctamente" });
    })
    Promise.all([proceso]).then(res => {console.log(res);})

}

addEventListener("DOMContentLoaded", async e=>{
    if(!localStorage.getItem("getAllCategory")) localStorage.setItem("getAllCategory", JSON.stringify(await getAllCategory()));
    nav__ul.innerHTML = await menulistCategoryIndex(JSON.parse(localStorage.getItem("getAllCategory")));
    history.pushState(null, "", "?id=fashion");
    input__search.value = "zapato"
    const eventoChange = new Event('change');
    input__search.dispatchEvent(eventoChange);
    footer__ul.innerHTML = await footerIndex(sessionStorage);
    console.log(footerIndex(sessionStorage));
})

input__search.addEventListener("change", searchProducts);

const updateSessionStorage = (counterValue, index) => {
    let currentValue = parseInt(counterValue.textContent);
    let sessionStorageValues = Object.values(sessionStorage);
    sessionStorageValues.forEach((element) => {
        if (element !== null && typeof element === 'string') {
            const data = JSON.parse(element);
            let info = data.data;
            if (data.status === 'OK' && data.request_id && info) {
                info.quantity = currentValue;
                sessionStorage.setItem(info.asin, JSON.stringify(data));
            }
        }
    });

    // Actualizar el contador de productos en el carrito en el footer
    let productCount = Object.keys(sessionStorage).length;
    const footerCartCounter = document.querySelector('.cart-counter');
    if (footerCartCounter) {
        footerCartCounter.textContent = productCount.toString();
    }
};
