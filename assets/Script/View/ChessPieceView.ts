import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
import { Army, Category, Coordinates } from "../Modal/enum";
import { knightMoves } from "../constant";
const { ccclass, property } = _decorator;

@ccclass("ChessPieceView")
export class ChessPieceView extends Component {
  @property({ type: Sprite })
  private chessSprite: Sprite;
  @property({ type: Sprite })
  private moves: Sprite;
  @property({ type: [SpriteFrame] })
  private chessPiece: SpriteFrame[] = [];
  @property({ type: [SpriteFrame] })
  private arrXY: Coordinates[] = [];
  public get ArrXY(): Coordinates[] {
    return this.arrXY;
  }
  public set ArrXY(value: Coordinates[]) {
    this.arrXY = value;
  }
  start() {}
  update(deltaTime: number) {}
  public reset(): void {
    this.arrXY = [];
    // this.chessSprite.spriteFrame = null;
  }
  public checkXY(XY: Coordinates): boolean {
    const isIncluded = this.arrXY.some(
      (item) => item.x === XY.x && item.y === XY.y
    );

    return isIncluded;
  }
  public highlightChessP(): void {
    this.moves.enabled = true;
  }
  public offhighlightChessP(): void {
    this.moves.enabled = false;
  }
  public initChessPiece(
    typeChessPiece?: Category,
    army?: Army,
    x?: number,
    y?: number
  ): void {
    let tmp = 0; //army black have index is even
    if (army === Army.while) {
      tmp += 1;
    }
    if (!Category) {
      this.arrXY = [];
    } else {
      switch (typeChessPiece) {
        case Category.bishop: {
          this.chessSprite.spriteFrame = this.chessPiece[0 + tmp];
          break;
        }
        case Category.castle: {
          this.chessSprite.spriteFrame = this.chessPiece[2 + tmp];
          break;
        }
        case Category.knight: {
          this.chessSprite.spriteFrame = this.chessPiece[4 + tmp];
          break;
        }
        case Category.pawn: {
          this.chessSprite.spriteFrame = this.chessPiece[6 + tmp];
          break;
        }
        case Category.queen: {
          this.chessSprite.spriteFrame = this.chessPiece[8 + tmp];
          break;
        }
        case Category.king: {
          this.chessSprite.spriteFrame = this.chessPiece[10 + tmp];
          break;
        }
        default: {
          this.chessSprite.spriteFrame = null;
          break;
        }
      }
    }
  }
}
