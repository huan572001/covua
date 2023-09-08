import {
  _decorator,
  Color,
  Component,
  Node,
  Sprite,
  SpriteFrame,
  UITransform,
} from "cc";
import { ChessPieceView } from "./ChessPieceView";
import { Army, Category, Coordinates } from "../Modal/enum";
import { knightMoves } from "../constant";
const { ccclass, property } = _decorator;

@ccclass("SquareView")
export class SquareView extends Component {
  @property({ type: Sprite })
  private square: Sprite;
  @property({ type: ChessPieceView })
  private chessPiece: ChessPieceView;
  @property({ type: UITransform })
  private UI: UITransform;
  @property({ type: [SpriteFrame] })
  private typeSquare: SpriteFrame[] = [];
  private colerSquare: number;
  public haveChessPiece: boolean = false;
  public typeChess: Category;
  public typeArmy: Army;
  public get chessP(): ChessPieceView {
    return this.chessPiece;
  }
  start() {}
  public onhighlightOldChess(x: number) {
    this.square.spriteFrame = this.typeSquare[2];
    this.UI.setContentSize(x, x);
  }
  public offhighlightOldChess(x: number) {
    this.square.spriteFrame = this.typeSquare[this.colerSquare];
    this.UI.setContentSize(x, x);
  }
  public onHLCheckKing(x: number) {
    this.square.spriteFrame = this.typeSquare[3];
    this.UI.setContentSize(x, x);
  }
  public offHLCheckKing(x: number) {
    this.square.spriteFrame = null;
    this.UI.setContentSize(x, x);
  }
  public reset(): void {
    this.typeArmy = undefined;
    this.typeChess = undefined;
    this.haveChessPiece = false;
    this.chessP.reset();
  }
  public setChessPiece(army?: Army, chess?: Category): void {
    this.typeArmy = army;
    this.typeChess = chess;
    if (chess) {
      this.haveChessPiece = true;
    } else {
      this.haveChessPiece = false;
    }
  }
  public openChessPiece(type?: Category, army?: Army, x?: number, y?: number) {
    this.chessPiece.initChessPiece(type, army, x, y);
    this.typeChess = type;
    this.typeArmy = army;

    //if not data "type" then haveChessPiece = false
    if (type) {
      this.haveChessPiece = true;
    } else {
      this.haveChessPiece = false;
    }
  }
  public movesChessPiece(XY: Coordinates, node: Node[][]): void {
    switch (this.typeChess) {
      case Category.bishop: {
        this.bishopMoves(XY, node);
        break;
      }
      case Category.castle: {
        this.chessPiece.ArrXY = this.castleMoves(XY, node);
        break;
      }
      case Category.knight: {
        this.knightMovesXY(XY, node);
        break;
      }
      case Category.pawn: {
        this.chessPiece.ArrXY = this.pawnMoves(XY.x, XY.y, node);
        break;
      }
      case Category.queen: {
        this.chessPiece.ArrXY = [
          ...this.castleMoves(XY, node),
          ...this.pawnMoves(XY.x, XY.y, node),
        ];
        break;
      }
      case Category.king: {
        this.kingMoves(XY, node);
        break;
      }
      default: {
        break;
      }
    }
  }
  public highlight(node: Node[][]) {
    if (this.haveChessPiece)
      this.chessPiece.ArrXY.forEach((e) => {
        node[e.x][e.y].getComponent(SquareView).chessPiece.highlightChessP();
      });
  }
  public castleMoves(XY: Coordinates, node: Node[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    for (let i = XY.x - 1; i >= 0; i--) {
      const chessPiece = node[i][XY.y].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: XY.y });
        }

        break;
      }
      arrXY.push({ x: i, y: XY.y });
    }
    for (let i = XY.x + 1; i <= 7; i++) {
      const chessPiece = node[i][XY.y].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: XY.y });
        }
        break;
      }
      arrXY.push({ x: i, y: XY.y });
    }
    for (let j = XY.y + 1; j <= 7; j++) {
      const chessPiece = node[XY.x][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: XY.x, y: j });
        }
        break;
      }
      arrXY.push({ x: XY.x, y: j });
    }
    for (let j = XY.y - 1; j >= 0; j--) {
      const chessPiece = node[XY.x][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: XY.x, y: j });
        }
        break;
      }
      arrXY.push({ x: XY.x, y: j });
    }
    return arrXY;
  }
  public pawnMoves(x: number, y: number, node: Node[][]): Coordinates[] {
    let arrXY: Coordinates[] = [];
    // Move diagonally to the left up
    for (let i = x - 1, j = y + 1; i >= 0 && j <= 7; i--, j++) {
      const chessPiece = node[i][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally to the right up
    for (let i = x + 1, j = y + 1; i <= 7 && j <= 7; i++, j++) {
      const chessPiece = node[i][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally left and down
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
      const chessPiece = node[i][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }
    // Move diagonally right down
    for (let i = x + 1, j = y - 1; i <= 7 && j >= 0; i++, j--) {
      const chessPiece = node[i][j].getComponent(SquareView);
      if (chessPiece.haveChessPiece) {
        if (chessPiece.typeArmy !== this.typeArmy) {
          arrXY.push({ x: i, y: j });
        }
        break;
      }
      arrXY.push({ x: i, y: j });
    }

    return arrXY;
  }
  public knightMovesXY(XY: Coordinates, node: Node[][]): void {
    let arrXY: Coordinates[] = [];
    let x = 0;
    let y = 0;
    for (const move of knightMoves) {
      x = XY.x + move.x;
      y = XY.y + move.y;
      if (x < 0 || y < 0 || x > 7 || y > 7) continue;
      const chessPiece = node[x][y].getComponent(SquareView);
      if (chessPiece.typeArmy === this.typeArmy) continue;
      arrXY.push({ x: x, y: y });
    }

    this.chessPiece.ArrXY = arrXY;
  }
  public bishopMoves(XY: Coordinates, node: Node[][]) {
    let arrXY: Coordinates[] = [];
    let army = -1;
    if (this.typeArmy === Army.while) {
      army = 1;
    }
    if (
      XY.x - 1 >= 0 &&
      node[XY.x - 1][XY.y - 1 * army]?.getComponent(SquareView).haveChessPiece
    ) {
      if (
        node[XY.x - 1][XY.y - 1 * army]?.getComponent(SquareView).typeArmy !==
        this.typeArmy
      )
        arrXY.push({ x: XY.x - 1, y: XY.y - 1 * army });
    }
    if (
      XY.x + 1 < 8 &&
      node[XY.x + 1][XY.y - 1 * army]?.getComponent(SquareView).haveChessPiece
    ) {
      if (
        node[XY.x + 1][XY.y - 1 * army]?.getComponent(SquareView).typeArmy !==
        this.typeArmy
      )
        arrXY.push({ x: XY.x + 1, y: XY.y - 1 * army });
    }
    if (XY.y === 6 || XY.y == 1) {
      if (
        !node[XY.x][XY.y - 1 * army].getComponent(SquareView).haveChessPiece
      ) {
        arrXY.push({ x: XY.x, y: XY.y - 1 * army });
        if (XY.y - 2 * army <= 7 && XY.y - 2 * army >= 0) {
          if (
            !node[XY.x][XY.y - 2 * army].getComponent(SquareView).haveChessPiece
          ) {
            arrXY.push({ x: XY.x, y: XY.y - 2 * army });
          }
        }
      }
    } else {
      if (
        !node[XY.x][XY.y - 1 * army].getComponent(SquareView).haveChessPiece
      ) {
        arrXY.push({ x: XY.x, y: XY.y - 1 * army });
      }
    }
    this.chessPiece.ArrXY = arrXY;
  }
  public kingMoves(XY: Coordinates, node: Node[][]) {
    let arrXY: Coordinates[] = [];
    for (let i = XY.x - 1; i < XY.x + 2; i++) {
      for (let j = XY.y - 1; j < XY.y + 2; j++) {
        if ((i === XY.x && j === XY.y) || i < 0 || i > 7 || j < 0 || j > 7)
          continue;
        if (!node[i][j].getComponent(SquareView).haveChessPiece)
          arrXY.push({ x: i, y: j });
        else {
          if (node[i][j].getComponent(SquareView).typeArmy != this.typeArmy) {
            arrXY.push({ x: i, y: j });
          }
        }
      }
    }
    this.chessPiece.ArrXY = arrXY;
  }
  public checkStep(XY: Coordinates): boolean {
    return this.chessPiece.checkXY(XY);
  }
  public initSquare(type: boolean): void {
    if (type) {
      this.colerSquare = 0;
      this.square.spriteFrame = this.typeSquare[0];
    } else {
      this.colerSquare = 1;
      this.square.spriteFrame = this.typeSquare[1];
    }
  }
  update(deltaTime: number) {}
}
