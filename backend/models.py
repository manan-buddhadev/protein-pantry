from pydantic import BaseModel, Field
from typing import List, Optional


class Ingredient(BaseModel):
    id: str
    name: str
    proteinPer100g: float = Field(..., gt=0)
    proteinPerUnit: Optional[float] = None
    unit: Optional[str] = None
    category: str


class RecipeIngredient(BaseModel):
    ingredientId: str
    grams: float = Field(..., gt=0)


class Recipe(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    ingredients: List[RecipeIngredient]


class RecipeIngredientDetail(BaseModel):
    ingredientId: str
    ingredientName: str
    grams: float
    proteinGrams: float


class RecipeWithDetails(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    ingredients: List[RecipeIngredientDetail]
    totalProteinGrams: float
