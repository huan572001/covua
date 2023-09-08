import { Army, Category, ChessPiece, Coordinates } from "./../Modal/enum";
import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  UITransform,
} from "cc";
import { SquareView } from "./SquareView";
import { AudioController } from "../Controller/AudioController";
const { ccclass, property } = _decorator;

@ccclass("BoardView")
export class BoardView extends Component {
  @property({ type: Prefab })
  private square: Prefab = null;
  @property({ type: AudioController })
  private audio: AudioController;
  private arrSquare: Node[][] = [];
  private moveCheckedHL: Coordinates;
  private movesHL: Coordinates[];
  public get arrSquareView(): Node[][] {
    return this.arrSquare;
  }
  private oldChessPieces: { start: Coordinates; end: Coordinates };

  public initChessboard(size: number, chessboard: Node): void {
    let tmp: boolean = true;
    for (let i = 0; i < 8; i++) {
      this.arrSquare[i] = [];
      tmp = !tmp;
      for (let j = 0; j < 8; j++) {
        this.arrSquare[i][j] = instantiate(this.square);
        // this.arrSquare[i][j].getComponent(SquareView).initSquare(tmp);
        chessboard.addChild(this.arrSquare[i][j]);
        this.arrSquare[i][j].setPosition(
          i * size + size / 2,
          -j * size - size / 2
        );
        this.arrSquare[i][j]
          .getComponent(UITransform)
          .setContentSize(size, size);
        tmp = !tmp;
      }
    }
    this.initChessPieces();
  }
  public initChessPieces(): void {
    let arr = [
      Category.castle,
      Category.knight,
      Category.pawn,
      Category.king,
      Category.queen,
      Category.pawn,
      Category.knight,
      Category.castle,
    ];
    for (let i = 0; i < 8; i++) {
      this.arrSquare[i][0]
        .getComponent(SquareView)
        .openChessPiece(arr[i], Army.black, i, 0);
      this.arrSquare[i][7]
        .getComponent(SquareView)
        .openChessPiece(arr[i], Army.while, i, 7);
    }
    for (let i = 0; i < 8; i++) {
      this.arrSquare[i][1]
        .getComponent(SquareView)
        .openChessPiece(Category.bishop, Army.black, i, 1);
      this.arrSquare[i][6]
        .getComponent(SquareView)
        .openChessPiece(Category.bishop, Army.while, i, 6);
    }
  }
  public initBoardView(arr: ChessPiece[][]): void {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (arr[i][j]) {
          this.arrSquare[i][j]
            .getComponent(SquareView)
            .openChessPiece(arr[i][j].chess, arr[i][j].army, i, j);
        } else {
          this.arrSquare[i][j].getComponent(SquareView).openChessPiece();
        }
      }
    }
  }
  public checkking(x: number, y: number) {
    this.moveCheckedHL = { x: x, y: y };
    this.arrSquare[x][y].getComponent(SquareView).onHLCheckKing(80);
  }
  public highlightMove(x1: number, y1: number, x2: number, y2: number) {
    if (this.moveCheckedHL) {
      this.arrSquare[this.moveCheckedHL.x][this.moveCheckedHL.y]
        .getComponent(SquareView)
        .offHLCheckKing(80);
      this.moveCheckedHL = null;
    }
    let squareStart = this.arrSquare[x1][y1].getComponent(SquareView);
    let squareEnd = this.arrSquare[x2][y2].getComponent(SquareView);
    if (this.oldChessPieces) {
      this.arrSquare[this.oldChessPieces.start.x][this.oldChessPieces.start.y]
        .getComponent(SquareView)
        .offhighlightOldChess(80);
      this.arrSquare[this.oldChessPieces.end.x][this.oldChessPieces.end.y]
        .getComponent(SquareView)
        .offhighlightOldChess(80);
    }
    squareStart.onhighlightOldChess(80);
    squareEnd.onhighlightOldChess(80);
    this.oldChessPieces = { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } };
  }
  public onHighlightMove(x1: number, y1: number, x2: number, y2: number) {
    let squareStart = this.arrSquare[x1][y1].getComponent(SquareView);
    let squareEnd = this.arrSquare[x2][y2].getComponent(SquareView);
    squareStart.onhighlightOldChess(80);
    squareEnd.onhighlightOldChess(80);
    this.oldChessPieces = { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } };
  }
  public offHighlightMove(x1: number, y1: number, x2: number, y2: number) {
    let squareStart = this.arrSquare[x1][y1].getComponent(SquareView);
    let squareEnd = this.arrSquare[x2][y2].getComponent(SquareView);
    squareStart.getComponent(SquareView).offhighlightOldChess(80);
    squareEnd.getComponent(SquareView).offhighlightOldChess(80);
    this.oldChessPieces = { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } };
  }
  public gotoXY(x1: number, y1: number, x2: number, y2: number) {
    this.audio.onAudioMove();
    let squareStart = this.arrSquare[x1][y1].getComponent(SquareView);
    let squareEnd = this.arrSquare[x2][y2].getComponent(SquareView);
    this.highlightMove(x1, y1, x2, y2);
    squareEnd.openChessPiece(
      squareStart.typeChess,
      squareStart.typeArmy,
      x2,
      y2
    );
    squareStart.openChessPiece();
  }
  public upQueen(x: number, y: number, army: Army): void {
    this.arrSquare[x][y]
      .getComponent(SquareView)
      .openChessPiece(Category.queen, army, x, y);
  }
  public highlight(chessMove: Coordinates[]) {
    this.movesHL = chessMove;
    chessMove.forEach((e) => {
      this.arrSquare[e.x][e.y]
        .getComponent(SquareView)
        .chessP.highlightChessP();
    });
  }
  public offHighlight(chessMove: Coordinates[]) {
    this.movesHL = null;
    chessMove.forEach((e) => {
      this.arrSquare[e.x][e.y]
        .getComponent(SquareView)
        .chessP.offhighlightChessP();
    });
  }
  public offHLWhenUndo() {
    this.movesHL?.forEach((e) => {
      this.arrSquare[e.x][e.y]
        .getComponent(SquareView)
        .chessP.offhighlightChessP();
    });
    this.movesHL = null;
  }
}
