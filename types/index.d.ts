export interface RecipeType {
  //had to add this for create to work. I think it adds any any to recipe property and added data for response of put
    data
    recipe
    title:string;
    description:string;
    cooking_time:number;
    instructions:string;
    category:recipeCategoryType;
    user:string;
    image?:string;
    isDeleted:boolean;
    ingredients: IngredientType[];
}
export interface RecipeTypeID extends RecipeType {
  _id: string;
}
export interface ApiResponse<T> {
  message: string;
  data: T;
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
    // need to populate and connect to the right one
    unit_id:string
    recpes:RecipeTypeID[]
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
  roles: string[]; 
}
export interface IAuthContext {
    signIn: (token:string) => void;
    signOut: () => void;
    session?:string | null;
    isLoading:boolean;
    user:IUser | null
}

export type IResponseType = RecipeTypeID