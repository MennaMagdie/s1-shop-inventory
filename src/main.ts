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

interface CartProduct extends Product {
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

  constructor() {
    super()
  }
  checkout(sales: Sales): void {

    //calls add of sales ig
    // 1. calculate total price
    // 2. create array of CartProduct items (already mawgouda no need to)

    let totalPrice = 0;
    for (const product of this.products) {
      totalPrice += product.price * product.count;
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
  addProductBtn.addEventListener('click', () => {
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

    const newProduct = createNewProduct(); //PROBLEM: choosing car but output clothing for some reason

    // console.log("Creating new product...");
    // console.log(newProduct);

    mainInventory.addProduct(newProduct);

    // console.log(mainInventory.products);

    //add each of mainInventory.products to the DOM: divID=productsList - class=products-grid
    //call fn add to DOM
    updateInventoryDOM(mainInventory.products);

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
  const category = (document.getElementById("productCategory") as HTMLSelectElement).value as ECategory; //choosing car but output clothing for some reason :)))

  return { _id: uuidv4(), name, price, stock, category };
}


function updateInventoryDOM(productsList: Product[]): void {

  const InventoryContainer = document.querySelector("#productsList");
  if (InventoryContainer) {
    InventoryContainer.innerHTML = ""

    productsList.forEach((product) => {

      const newElement = document.createElement("div");
      newElement.classList.add("product-card");
      renderProduct(product, newElement);

      InventoryContainer.append(newElement);
    }
    )

  }

}

function renderProduct(product: Product, newElement: HTMLDivElement) {

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

  newElementButton.innerText = "Add to Cart";
    
  newElement.append(newElementName);
  newElement.append(newElementPrice);
  newElement.append(newElementStock);
  newElement.append(newElementCategory);
  newElement.append(newElementButton);
}

/*************************************************************/

// 2. Add To Cart Button
// 3. Checkout


/* STEP 3: VALIDATION */
