import { _decorator, Component, Node } from 'cc';
import { Category, ChessPiece, Coordinates, Army } from '../Modal/enum';
import { knightMoves } from '../constant';
const { ccclass, property } = _decorator;

@ccclass('ChessPieceControler')
export class ChessPieceControler extends Component {
  private kingWhite: boolean = false;
  private castleWhiteL: boolean = false;
  private castleWhiteR: boolean = false;
  private kingBlack: boolean = false;
  private castleBlackL: boolean = false;
  private castleBlackR: boolean = false;
  private check: boolean = false;
  public get checkKing(): boolean {
    return this.check;
  }
  public set checkKing(value: boolean) {
    this.check = value;
  }
  public get castleBR(): boolean {
    return this.castleBlackR;
  }
  public set castleBR(value: boolean) {
    this.castleBlackR = value;
  }
  public get castleBL(): boolean {
    return this.castleBlackL;
  }
  public set castleBL(value: boolean) {
    this.castleBlackL = value;
  }
  public get castleWR(): boolean {
    return this.castleWhiteR;
  }
  public set castleWR(value: boolean) {
    this.castleWhiteR = value;
  }
  public get kingW(): boolean {
    return this.kingWhite;
  }
  public set kingW(value: boolean) {
    this.kingWhite = value;
  }
  public get kingB(): boolean {
    return this.kingBlack;
  }
  public set kingB(value: boolean) {
    this.kingBlack = value;
  }
  public get castleWL(): boolean {
    return this.castleWhiteL;
  }
  public set castleWL(value: boolean) {
    this.castleWhiteL = value;
  }
  public movesChessPiece(
    XY: Coordinates,
    chess: ChessPiece[][]
  ): Coordinates[] {
    switch (chess[XY.x][XY.y]?.chess) {
      case Category.bishop: {
        return this.bishopMoves(XY, chess);
      }
      case Category.castle: {
        return this.castleMoves(XY, chess);
      }
      case Category.knight: {
        return this.knightMovesXY(XY, chess);
      }
      case Category.pawn: {
        return this.pawnMoves(XY.x, XY.y, chess);
      }
      case Category.queen: {
        return [
          ...this.castleMoves(XY, chess),
          ...this.pawnMoves(XY.x, XY.y, chess),
        ];
      }
      case Category.king: {
        return this.kingMoves(XY, chess);
      }
      default: {
        return [];
      }
    }
  }
  public checkXY(XY: Coordinates, chess: Coordinates[]): boolean {
    const isIncluded = chess.some((item) => item.x === XY.x && item.y === XY.y);

    return isIncluded;
  }
  public castleMoves(XY: Coordinates, chess: ChessPiece[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    for (let i = XY.x - 1; i >= 0; i--) {
      const chessPiece = chess[i][XY.y];
      if (chessPiece) {
        if (chessPiece.army !== chess[XY.x][XY.y].army) {
          arrXY.push({ x: i, y: XY.y });
        }
        break;
      }
      arrXY.push({ x: i, y: XY.y });
    }
    for (let i = XY.x + 1; i <= 7; i++) {
      const chessPiece = chess[i][XY.y];
      if (chessPiece) {
        if (chessPiece.army !== chess[XY.x][XY.y].army) {
          arrXY.push({ x: i, y: XY.y });
        }
        break;
      }
      arrXY.push({ x: i, y: XY.y });
    }
    for (let j = XY.y + 1; j <= 7; j++) {
      const chessPiece = chess[XY.x][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[XY.x][XY.y].army) {
          arrXY.push({ x: XY.x, y: j });
        }
        break;
      }
      arrXY.push({ x: XY.x, y: j });
    }
    for (let j = XY.y - 1; j >= 0; j--) {
      const chessPiece = chess[XY.x][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[XY.x][XY.y].army) {
          arrXY.push({ x: XY.x, y: j });
        }
        break;
      }
      arrXY.push({ x: XY.x, y: j });
    }
    return arrXY;
  }
  public pawnMoves(x: number, y: number, chess: ChessPiece[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    // Move diagonally to the left up
    for (let i = x - 1, j = y + 1; i >= 0 && j <= 7; i--, j++) {
      const chessPiece = chess[i][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[x][y].army) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally to the right up
    for (let i = x + 1, j = y + 1; i <= 7 && j <= 7; i++, j++) {
      const chessPiece = chess[i][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[x][y].army) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally left and down
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
      const chessPiece = chess[i][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[x][y].army) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally right down
    for (let i = x + 1, j = y - 1; i <= 7 && j >= 0; i++, j--) {
      const chessPiece = chess[i][j];
      if (chessPiece) {
        if (chessPiece.army !== chess[x][y].army) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }

    return arrXY;
  }
  public knightMovesXY(XY: Coordinates, chess: ChessPiece[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    let x = 0;
    let y = 0;
    for (const move of knightMoves) {
      x = XY.x + move.x;
      y = XY.y + move.y;
      if (x < 0 || y < 0 || x > 7 || y > 7) continue;
      const chessPiece = chess[x][y];
      if (chessPiece?.army === chess[XY.x][XY.y].army) continue;
      arrXY.push({ x: x, y: y });
    }

    return arrXY;
  }
  public bishopMoves(XY: Coordinates, chess: ChessPiece[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    let army = -1;
    if (chess[XY.x][XY.y].army === Army.while) {
      army = 1;
    }
    if (XY.x - 1 >= 0 && chess[XY.x - 1][XY.y - 1 * army]) {
      if (chess[XY.x - 1][XY.y - 1 * army].army !== chess[XY.x][XY.y].army)
        arrXY.push({ x: XY.x - 1, y: XY.y - 1 * army });
    }
    if (XY.x + 1 < 8 && chess[XY.x + 1][XY.y - 1 * army]) {
      if (chess[XY.x + 1][XY.y - 1 * army].army !== chess[XY.x][XY.y].army)
        arrXY.push({ x: XY.x + 1, y: XY.y - 1 * army });
    }
    if (XY.y === 6 || XY.y == 1) {
      if (chess[XY.x][XY.y - 1 * army] === null) {
        arrXY.push({ x: XY.x, y: XY.y - 1 * army });
        if (XY.y - 2 * army <= 7 && XY.y - 2 * army >= 0) {
          if (chess[XY.x][XY.y - 2 * army] === null) {
            arrXY.push({ x: XY.x, y: XY.y - 2 * army });
          }
        }
      }
    } else {
      if (chess[XY.x][XY.y - 1 * army] === null) {
        arrXY.push({ x: XY.x, y: XY.y - 1 * army });
      }
    }
    return arrXY;
  }
  public kingMoves(XY: Coordinates, chess: ChessPiece[][]) {
    let arrXY: Coordinates[] = [];
    let castleL =
      chess[XY.x][XY.y]?.army === Army.black ? this.castleBL : this.castleWL;
    let castleR =
      chess[XY.x][XY.y]?.army === Army.black ? this.castleBR : this.castleWR;
    let king =
      chess[XY.x][XY.y]?.army === Army.black ? this.kingBlack : this.kingWhite;
    if (!king && !this.checkKing && XY.x === 3) {
      if (!castleL) {
        if (chess[XY.x - 1][XY.y] === null && chess[XY.x - 2][XY.y] === null) {
          arrXY.push({ x: XY.x - 2, y: XY.y });
        }
      }
      if (!castleR) {
        if (
          chess[XY.x + 1][XY.y] === null &&
          chess[XY.x + 2][XY.y] === null &&
          chess[XY.x + 3][XY.y] === null
        ) {
          arrXY.push({ x: XY.x + 2, y: XY.y });
        }
      }
    }
    for (let i = XY.x - 1; i < XY.x + 2; i++) {
      for (let j = XY.y - 1; j < XY.y + 2; j++) {
        if ((i === XY.x && j === XY.y) || i < 0 || i > 7 || j < 0 || j > 7)
          continue;
        if (chess[i][j] === null) arrXY.push({ x: i, y: j });
        else {
          if (chess[i][j].army != chess[XY.x][XY.y].army) {
            arrXY.push({ x: i, y: j });
          }
        }
      }
    }
    return arrXY;
  }
}
