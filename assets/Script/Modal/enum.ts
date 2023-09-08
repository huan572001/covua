export enum Category {
  pawn = 'pawn',
  castle = 'castle',
  bishop = 'bishop',
  knight = 'knight',
  queen = 'queen',
  king = 'king',
}
export enum Army {
  while = 'while',
  black = 'Black',
}

export type ChessPiece = {
  chess: Category;
  army: Army;
};
export type Coordinates = {
  x: number;
  y: number;
};
export type Moves = {
  start: Coordinates;
  end: Coordinates;
};
export type Undo = {
  start: Coordinates;
  end: Coordinates;
  type:Category;
  army: Army;
};