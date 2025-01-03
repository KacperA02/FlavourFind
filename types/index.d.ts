export interface RecipeType {
    title:string;
    description:string;
    cooking_time:number;
    instructions:string;
    category:recipeCategoryType;
    user:string;
    image?:string;
    isDeleted:boolean;
    ingredients: RecipeIngredientType[];
}
export interface RecipeTypeID extends RecipeType {
  _id: string;
}
export interface ApiResponse<T> {
  message: string;
  data: T;
  users:[];
}
export interface RecipeIngredientType {
    ingredient: {
      _id: string;
      name: string;
      calories: number;
      category_id: {
        _id: string;
        name: string;
      };
      unit_id: {
        _id: string;
        name: string;
        abbreviation: string;
      };
    };
    quantity: number;
  }
  export interface IIngredientType{
    _id:string,
    name:string,
    calories:number,
    category_id:string,
    unit_id: string;
  }
  export interface IngredientRecipe extends RecipeIngredientType {
    ingredient: string; 
    quantity: number; 
  }
  export interface recipeCategoryType{
    _id: string;
    name: string;
}
export interface IUser {
  _id: string;
  first_name: string;
  last_name:string
  firstName:string;
  lastName:string;
  email: string;
  recipes: RecipeTypeID[];
  users:IUser[];
  roles: [{name:string}]; 
}
export interface IngredientType {
  _id: string;
  name: string;
  calories: number ;
  category_id: {
    _id: string;
    name: string;
  };
  unit_id: {
    _id: string;
    name: string;
    abbreviation: string;
  };
  recipes:[];
  isDeleted:boolean;
  createdAt:string;
  updatedAt:string;
}
export interface IUnitType {
  _id: string;
  name: string;
  abbreviation: string;
  isDeleted: boolean;
}
export interface ICategoryIngredientType {
  _id: string;
  name: string;
  isDeleted: boolean;
}
export interface IAuthContext {
    signIn: (token:string) => void;
    signOut: () => void;
    session?:string | null;
    isLoading:boolean;
    user:IUser | null
}

export interface IResponseType<T> {
  message: string;
  data: T; 
}