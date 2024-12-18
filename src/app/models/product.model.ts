import { BaseModel } from './base.model';
import { BrandModel } from './brand.model';
import { CategoryModel } from './category.model';
import { ProductImageModel } from './product-image.model';

export class ProductModel extends BaseModel {
  name: string = '';
  categoryId: string = '';
  category: CategoryModel = new CategoryModel();
  brandId: string = '';
  brand: BrandModel = new BrandModel();
  model: string = '';
  description: string = '';
  url: string = '';
  price: number = 0;
  stock: number = 0;
  productImages: ProductImageModel[] = [];
}
