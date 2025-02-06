import './style.css'
import { v4 as uuidv4 } from 'uuid'; // const demoId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'


/* STEP 1: ADD INTERFACES AND BASIC FUNCTION IMPLEMENTATION */

enum ECategory {
  ELECTRONICS = "electronics",
  CLOTHES = "clothes",
  FOOD = "food",
  CAR = "car",
  OTHER = "other"
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

class Inventory extends ProductsHandler<Product>{
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
  checkout(sales: Sales):void{
    //implementation later: done
    //calls add of sales ig
    // 1. calculate total price
    // 2. create array of CartProduct items (la heyya already mawgouda no need to)
    
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

  addSales(newItem: SalesItem):void {
    this.history.push(newItem);
  }

}

/* STEP 2: INTEGRATE WITH UI SOMEHOW */
/* STEP 3: VALIDATION */
