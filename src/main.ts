import './style.css'
import { v4 as uuidv4 } from 'uuid';
// export
// export default  --> one time at a file --> import SomeName from './somefile' --> default
// export const X --> could be repeated --> import { X } from './somefile' --> named export


// 
enum ECategory {
  ELECTRONICS = "electronics",
  CLOTHES = "clothes",
  FOOD = "food",
  CAR = "car",
  OTHER = "other"
}

const demoId = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'