import './style.css'
import { v4 as uuidv4 } from 'uuid'; // const demoId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'


/* STEP 1: ADD INTERFACES AND BASIC FUNCTION IMPLEMENTATION */

enum ECategory {
  ELECTRONICS = "Electronics",
  CLOTHES = "Clothing",
  FOOD = "Food",
  CAR = "Car",
  OTHER = "Other"
}

interface BaseEntity {
  _id: string
}

interface Product extends BaseEntity {
  name: string,
  price: number,
  stock: number,
  category: ECategory
}

interface CartProduct extends BaseEntity { //Q: extend or add product as an attribute? + remove extend BaseEntity or not?
  product: Product;
  count: number;
}

abstract class ProductsHandler<T extends BaseEntity> implements BaseEntity { //T extends BaseEntity IMPORTANT
  public _id: string;
  public products: T[] = [];
  constructor() {
    this._id = uuidv4()
  }
  addProduct(product: T): void {
    this.products.push(product);
  };
  deleteProduct(product_id: string): void {
    this.products = this.products.filter(product_in => product_in._id !== product_id)
  };
  clear(): void {
    // this.products.length = 0;
    this.products = [];
  }
}

class Inventory extends ProductsHandler<Product> {
  // nothing to be added for now.. may add new methods later
}


interface SalesItem extends BaseEntity {
  date: string | number,
  total_price: number,
  items: CartProduct[]
}


class Cart extends ProductsHandler<CartProduct> {
  public cartTotal: number = 0
  constructor() {
    super()
  }
  checkout(sales: Sales): void {

    //calls add of sales ig
    // 1. calculate total price
    // 2. create array of CartProduct items (already mawgouda no need to)

    let totalPrice = 0;
    for (const product of this.products) {
      totalPrice += product.product.price * product.count;
    }

    const saleItem: SalesItem = {
      _id: uuidv4(),
      date: new Date().toISOString(),
      total_price: totalPrice,
      items: this.products
    };

    sales.addSales(saleItem);

  }

}

class Sales implements BaseEntity {
  public _id: string;
  public history: SalesItem[] = [];

  constructor() {
    this._id = uuidv4();
  }

  addSales(newItem: SalesItem): void {
    this.history.push(newItem);
  }

}

/* STEP 2: INTEGRATE WITH UI SOMEHOW */

/*************************************************************/

const mainInventory = new Inventory();
const currentCart = new Cart();
const salesHistory = new Sales();


const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const cancelAddProduct = document.getElementById('cancelAddProduct');
const addProductForm = document.getElementById('addProductForm');

// 1. Add New Product Button 

if (addProductBtn) {
  addProductBtn.addEventListener('click', () => { //Q: leh click: no event, submit: e
    if (addProductModal) {
      addProductModal.style.display = 'block';
    }
  });
}

// a. cancel
if (cancelAddProduct) {
  cancelAddProduct.addEventListener('click', () => {
    if (addProductModal) {
      addProductModal.style.display = 'none';
    }
  });
}

// b. add product logic
if (addProductForm) {
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //create the product, add it to inventory product list then add it to the DOM

    const newProduct = createNewProduct();

    // console.log("Creating new product...");
    // console.log(newProduct);

    mainInventory.addProduct(newProduct);

    // console.log(mainInventory.products);

    //add each of mainInventory.products to the DOM: divID=productsList - class=products-grid
    //call fn add to DOM
    // updateInventoryDOM(mainInventory.products);
    updateContainerDOM(mainInventory.products, "productsList","product-card", renderInventoryProduct)

    if (addProductModal) {
      addProductModal.style.display = 'none';
    }
  });
}


function createNewProduct(): Product {

  // const form = document.getElementById("addProductForm") as HTMLFormElement | null;
  const name = (document.getElementById("productName") as HTMLInputElement).value;
  const price = parseFloat((document.getElementById("productPrice") as HTMLInputElement).value);
  const stock = parseInt((document.getElementById("productStock") as HTMLInputElement).value);
  const category = (document.getElementById("productCategory") as HTMLSelectElement).value as ECategory;

  return { _id: uuidv4(), name, price, stock, category };
}

function updateContainerDOM<T>(productsList: T[], containerID: string, cardClassName: string, renderFunction: (item: T, element: HTMLDivElement) => void): void {
  const container = document.querySelector(`#${containerID}`);

  if(container) {
    container.innerHTML = "";
    if(container.nextElementSibling)
      container.nextElementSibling.remove();

    productsList.forEach((product) => {
      
      const newElement = document.createElement("div");
      newElement.classList.add(cardClassName);
      renderFunction(product, newElement);

      container.append(newElement);
    });

    if(containerID == "cartItems") {
      const newElementTotal = document.createElement("p");
      newElementTotal.innerText = "Total: $" + currentCart.cartTotal;
      newElementTotal.classList.add("cart-total");
      container.insertAdjacentElement("afterend", newElementTotal); //repeats itself
    }
  }
}

function renderInventoryProduct(product: Product, newElement: HTMLDivElement): void {

  const newElementName = document.createElement("p");
  newElementName.innerText = product.name;
  newElementName.classList.add("product-name");

  const newElementPrice = document.createElement("p");
  newElementPrice.innerText = "Price: $" + product.price;

  const newElementStock = document.createElement("p");
  newElementStock.innerText = "Stock: " + product.stock;

  const newElementCategory = document.createElement("p");
  newElementCategory.innerText = "Category: " + product.category;

  const newElementButton = document.createElement("button");
  newElementButton.classList.add("btn")
  newElementButton.classList.add("primary")
  newElementButton.classList.add("addToCartBtn")
  newElementButton.id = product._id
  newElementButton.innerText = "Add to Cart";

  newElement.append(newElementName);
  newElement.append(newElementPrice);
  newElement.append(newElementStock);
  newElement.append(newElementCategory);
  newElement.append(newElementButton);
}


/*************************************************************/

// 2. Add To Cart Button

// const addToCartBtn = document.getElementById("addToCartBtn"); //Q: won't work??
//   addToCartBtn.addEventListener('click', () => {
//     //1. get id of clicked button
//     const product_id = addToCartBtn.id;
//     var addedProduct: Product;


// EVENT DELEGATION
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("addToCartBtn")) {
    const product_id = target.id;
    addProductToCart(product_id);
  }
});


function addProductToCart(product_id: string): void {
  const chosen_product = mainInventory.products.find(p => p._id === product_id);

  if (chosen_product) {
    if (chosen_product.stock <= 0) { //will be removed later after validation
      alert("Out of stock!");
      return;
    }

    const cartItem = currentCart.products.find(p => p._id === product_id); //q: cartProduct has id wala product heyya elly 3andaha id???
    if (cartItem)
      cartItem.count++; //keda baghayyar felmain item or not? YES
    else
      currentCart.addProduct(createCartProduct(chosen_product));

    chosen_product.stock--;
    currentCart.cartTotal += chosen_product.price;
  }

    updateContainerDOM(mainInventory.products, "productsList","product-card", renderInventoryProduct)
    updateContainerDOM(currentCart.products, "cartItems", "cart-item", renderCartProduct);

}


function createCartProduct(product: Product): CartProduct {
  return {
    _id: product._id,
    product: product,
    count: 1
  }
}

function renderCartProduct(product: CartProduct, newElement: HTMLDivElement): void {
  const container = document.createElement("div");
  container.style.display = "flex"; 
  container.style.justifyContent = "space-between"; 
  container.style.width = "100%"; 

  const productInfo = document.createElement("span");
  productInfo.innerText = `${product.product.name} x ${product.count}`;

  const totalPrice = document.createElement("span");
  totalPrice.innerText = `${product.product.price * product.count} $`;

  container.append(productInfo, totalPrice);
  newElement.append(container);
}


// 3. Checkout


/* STEP 3: VALIDATION */
