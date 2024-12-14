export interface RecipeType {
    title:string;
    description:string;
    cooking_time:number;
    instructions:string;
    category:recipeCategoryType;
    image?:string;
    ingredients: IngredientType[];
}
export interface RecipeTypeID extends RecipeType {
  _id: string;
}

export interface IngredientType {
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
  export interface recipeCategoryType{
    _id: string;
    name: string;
}
export interface IAuthContext {
    signIn: (token:string) => void;
    signOut: () => void;
    session?:string | null;
    isLoading:boolean;
}
export type IResponseType = RecipeTypeID