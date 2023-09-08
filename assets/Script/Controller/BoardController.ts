import { SquareView } from "./../View/SquareView";
import {
  Army,
  Coordinates,
  Moves,
  Category,
  ChessPiece,
  Undo,
} from "./../Modal/enum";
import {
  _decorator,
  Camera,
  Component,
  director,
  EventMouse,
  find,
  Node,
  Vec3,
} from "cc";
import { GameModel } from "../Modal/GameModel";
import { GameOptionView } from "../View/GameOptionView";
import { GamePlayView } from "../View/GamePlayView";
import { GameWinView } from "../View/GameWinView";
import { ChessPieceControler } from "./ChessPieceControler";
import { BoardView } from "../View/BoardView";
import { Store } from "../Store";
import { AudioController } from "./AudioController";
const { ccclass, property } = _decorator;

@ccclass("BoardController")
export class BoardController extends Component {
  @property({ type: Node })
  private chessboard: Node = null;
  @property({ type: ChessPieceControler })
  private chessPieceControler: ChessPieceControler;
  @property({ type: BoardView })
  private boardView: BoardView;
  @property({ type: Camera })
  private camera: Camera;
  @property({ type: GameModel })
  private model: GameModel;
  @property({ type: GameOptionView })
  private opsionView: GameOptionView;
  @property({ type: GamePlayView })
  private playView: GamePlayView;
  @property({ type: GameWinView })
  private winView: GameWinView;
  @property({ type: AudioController })
  private audio: AudioController;
  private startingCoordinates: any = null;
  private arrChess: ChessPiece[][] = [];
  private turn: Army = Army.while;
  private moves: Undo[] = [];
  private movesRedo: Undo[] = [];
  private kingWhile: Coordinates = { x: 3, y: 7 };
  private kingBlack: Coordinates = { x: 3, y: 0 };
  private statusCheckKing: boolean = false;
  private level: number = 5;
  static moveBot: Moves;
  static turnBot: number = 0;
  static pause: boolean = false;
  start() {
    // this.initChessboard();
    // this.onStartGame();
  }
  update(deltaTime: number) {}

  private allmoves(arr: ChessPiece[][], army: Army): Moves[] {
    let square: ChessPiece;
    let allmove: Moves[] = [];
    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        square = arr[i][j];
        if (count === 16) return allmove;
        if (square?.army === army) {
          count++;
          let moves = this.chessPieceControler.movesChessPiece(
            { x: i, y: j },
            arr
          );
          moves.forEach((e) => {
            // if (this.statusCheckKing) {
            //   if (!this.checkPreventCheckKing(i, j, e.x, e.y, army, arr)) {
            //     allmove.push({ start: { x: i, y: j }, end: e });
            //   }
            // } else {
            allmove.push({ start: { x: i, y: j }, end: e });
            // }
          });
        }
      }
    }
    return allmove;
  }
  private async miniMax(node: ChessPiece[][], depth, maximizingplayer) {
    await this.alphabeta(
      node,
      depth,
      -10000,
      10000,
      maximizingplayer,
      this.delayAync
    );
  }
  private async alphabeta(
    node: ChessPiece[][],
    depth,
    a,
    b,
    maximizingplayer,
    delayAync
  ) {
    BoardController.turnBot++;
    if (BoardController.turnBot % 10000 === 0) {
      await delayAync();
    }
    if (BoardController.pause) {
      while (BoardController.pause) {
        await delayAync();
      }
    }
    let moves: Moves[] = this.allmoves(
      node,
      maximizingplayer ? Army.black : Army.while
    );
    let tmp;
    if (depth === 0) {
      return this.scoreBoard(node);
    }

    if (maximizingplayer) {
      for (let i = 0; i < moves.length; i++) {
        tmp = node[moves[i].end.x][moves[i].end.y];
        node[moves[i].end.x][moves[i].end.y] =
          node[moves[i].start.x][moves[i].start.y];
        node[moves[i].start.x][moves[i].start.y] = null;
        let max = await this.alphabeta(node, depth - 1, a, b, false, delayAync);
        if (a < max) {
          a = max;
          if (depth === 5) {
            BoardController.moveBot = moves[i];
          }
        }
        node[moves[i].start.x][moves[i].start.y] =
          node[moves[i].end.x][moves[i].end.y];
        node[moves[i].end.x][moves[i].end.y] = tmp;
        if (a >= b) {
          break;
        }
      }
      return a;
    } else {
      for (let i = 0; i < moves.length; i++) {
        tmp = node[moves[i].end.x][moves[i].end.y];
        node[moves[i].end.x][moves[i].end.y] =
          node[moves[i].start.x][moves[i].start.y];
        node[moves[i].start.x][moves[i].start.y] = null;
        let min = await this.alphabeta(node, depth - 1, a, b, true, delayAync);
        if (b >= min) {
          b = min;
          if (depth === 3) {
            BoardController.moveBot = moves[i];
          }
        }
        node[moves[i].start.x][moves[i].start.y] =
          node[moves[i].end.x][moves[i].end.y];
        node[moves[i].end.x][moves[i].end.y] = tmp;
        if (a >= b) {
          break;
        }
      }
      return b;
    }
  }
  private scoreBoard(arr: ChessPiece[][]): number {
    let score = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (arr[i][j]) {
          if (arr[i][j]?.army === Army.while) {
            score -= this.getScoreChess(arr[i][j].chess);
          } else {
            score += this.getScoreChess(arr[i][j].chess);
          }
        }
      }
    }
    return score;
  }
  private getScoreChess(type: Category): number {
    switch (type) {
      case Category.bishop: {
        return 10;
      }
      case Category.castle: {
        return 50;
      }
      case Category.knight: {
        return 30;
      }
      case Category.pawn: {
        return 30;
      }
      case Category.queen: {
        return 90;
      }
      case Category.king: {
        return 900;
      }
      default: {
        break;
      }
    }
  }

  private async onClickBoard(event: EventMouse) {
    let pos = new Vec3();
    pos = this.camera.screenToWorld(
      new Vec3(event.getLocationX(), event.getLocationY(), 0),
      pos
    );
    let localPos = new Vec3();
    this.chessboard.inverseTransformPoint(localPos, pos);
    let x = Math.floor(localPos.x / this.model.size);
    let y = Math.floor(-localPos.y / this.model.size);
    this.onClickSquare(x, y);
  }
  private onClickSquare(x: number, y: number) {
    let square = this.arrChess[x][y];
    let st = this.startingCoordinates;

    if (square !== null && square.army === this.turn) {
      // square.movesChessPiece({ x: x, y: y }, this.arrSquare);
      let moves = this.chessPieceControler.movesChessPiece(
        { x: x, y: y },
        this.arrChess
      );

      if (st !== null) {
        if (st.x === x && st.y === y) {
          this.startingCoordinates = null;
          this.boardView.offHighlight(moves);
          return;
        }
        let tmp = this.chessPieceControler.movesChessPiece(
          { x: st.x, y: st.y },
          this.arrChess
        );
        this.boardView.offHighlight(tmp);
      }
      this.boardView.highlight(moves);
      this.startingCoordinates = {
        x: x,
        y: y,
      };
    } else {
      if (this.startingCoordinates !== null) {
        this.checkMove(st.x, st.y, x, y);
        if (this.checkTie() && !this.statusCheckKing) {
          this.winView.initPopupWin(
            null,
            this.opsionView.timeWString(),
            this.opsionView.timeBString(),
            "Hòa"
          );
          this.opsionView.ongameResult();
        }
      }
    }
  }
  private checkMove(x1: number, y1: number, x2: number, y2: number) {
    let squareStart = this.arrChess[x1][y1];
    let moves: Coordinates[] = this.chessPieceControler.movesChessPiece(
      { x: x1, y: y1 },
      this.arrChess
    );
    if (this.chessPieceControler.checkXY({ x: x2, y: y2 }, moves)) {
      //close highlight
      this.boardView.offHighlight(moves);
      if (squareStart.chess === Category.bishop) {
        if (
          (this.turn === Army.black && y2 === 7) ||
          (this.turn === Army.while && y2 === 0)
        ) {
          squareStart.chess = Category.queen;
          this.boardView.upQueen(x1, y1, this.turn);
        }
      }
      if (
        !this.checkPreventCheckKing(x1, y1, x2, y2, this.turn, this.arrChess)
      ) {
        //save moves game
        this.moves.push({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          type: this.arrChess[x2][y2]?.chess
            ? this.arrChess[x2][y2].chess
            : null,
          army: this.arrChess[x2][y2]?.army ? this.arrChess[x2][y2].army : null,
        });
        this.movesRedo = [];
        if (this.statusCheckKing) {
          this.statusCheckKing = false;
          this.chessPieceControler.checkKing = false;
          this.playView.onCheck();
        }
        if (squareStart.chess === Category.castle) {
          if (this.turn === Army.black) {
            if (x1 === 0 && !this.chessPieceControler.castleBL) {
              this.chessPieceControler.castleBL = true;
            } else if (x1 === 7 && !this.chessPieceControler.castleBR) {
              this.chessPieceControler.castleBR = true;
            }
          } else {
            if (x1 === 0 && !this.chessPieceControler.castleWL) {
              this.chessPieceControler.castleWL = true;
            } else if (x1 === 7 && !this.chessPieceControler.castleWR) {
              this.chessPieceControler.castleWR = true;
            }
          }
        } else if (squareStart.chess === Category.king) {
          let king = this.turn === Army.black ? this.kingBlack : this.kingWhile;
          if (king.x + 2 === x2) {
            this.arrChess[x2 - 1][y2] = this.arrChess[x2 + 2][y2];
            this.arrChess[x2 + 2][y2] = null;
            this.boardView.gotoXY(x2 + 2, y2, x2 + -1, y2);
          } else if (king.x - 2 === x2) {
            this.arrChess[x2 + 1][y2] = this.arrChess[x2 - 1][y2];
            this.arrChess[x2 - 1][y2] = null;
            this.boardView.gotoXY(x2 - 1, y2, x2 + 1, y2);
          }
          this.moveKing(x2, y2, this.turn);
          if (this.turn === Army.black) {
            this.chessPieceControler.kingB = true;
          } else {
            this.chessPieceControler.kingW = true;
          }
        }
        //move chessPiece
        this.boardView.gotoXY(x1, y1, x2, y2);
        this.arrChess[x2][y2] = this.arrChess[x1][y1];
        this.arrChess[x1][y1] = null;
        this.checkKing(this.arrChess[x2][y2]);
        // update turn player
        this.onTurn();

        if (
          !find("store").getComponent(Store).playerG &&
          this.turn === Army.black
        ) {
          this.moveBot();
        }
      }
      this.startingCoordinates = null;
    }
  }
  private async delayAync(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1);
    });
  }
  private async bot() {
    return new Promise(async () => {
      let tmp: ChessPiece[][] = [];

      for (let i = 0; i < this.arrChess.length; i++) {
        tmp.push([...this.arrChess[i]]);
      }
      await this.miniMax(tmp, this.level, true);
      let tmps = BoardController.moveBot;
      if (tmps === undefined) {
        this.winView.initPopupWin(
          null,
          this.opsionView.timeWString(),
          this.opsionView.timeBString()
        );
        this.opsionView.ongameResult();
      }
      this.onClickSquare(tmps.start.x, tmps.start.y);
      this.onClickSquare(tmps.end.x, tmps.end.y);
    });

    // return BoardController.moveBot;
  }
  private async moveBot() {
    BoardController.turnBot = 0;
    this.bot();
  }
  public initBoard(): void {
    this.boardView.initChessboard(this.model.size, this.chessboard);
    for (let i = 0; i < 8; i++) {
      this.arrChess[i] = [];
      for (let j = 0; j < 8; j++) {
        if (
          this.boardView.arrSquareView[i][j].getComponent(SquareView).typeChess
        ) {
          this.arrChess[i][j] = {
            chess:
              this.boardView.arrSquareView[i][j].getComponent(SquareView)
                .typeChess,
            army: this.boardView.arrSquareView[i][j].getComponent(SquareView)
              .typeArmy,
          };
        } else {
          this.arrChess[i][j] = null;
        }
      }
    }
  }

  public onStartGame(): void {
    this.chessboard.on(Node.EventType.MOUSE_UP, this.onClickBoard, this);
    this.opsionView.startTimer();
    this.audio.closeAudio();
    this.scheduleOnce(function () {
      this.audio.openAudio();
    }, 1);
  }
  public onStopGame(): void {
    this.chessboard.off(Node.EventType.MOUSE_UP);
    BoardController.pause = true;
  }
  public offStopGame(): void {
    this.chessboard.on(Node.EventType.MOUSE_UP, this.onClickBoard, this);
    BoardController.pause = false;
  }
  private checkTie() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.arrChess[i][j]?.army === this.turn) {
          let tmp: Coordinates[] = this.chessPieceControler.movesChessPiece(
            { x: i, y: j },
            this.arrChess
          );
          for (let k = 0; k < tmp.length; k++) {
            if (
              !this.checkPreventCheckKing(
                i,
                j,
                tmp[k].x,
                tmp[k].y,
                this.turn,
                this.arrChess
              )
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  private moveKing(x: number, y: number, army: Army): void {
    if (army === Army.black) {
      this.kingBlack = { x: x, y: y };
    } else {
      this.kingWhile = { x: x, y: y };
    }
  }
  private checkPreventCheckKing(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    army: Army,
    arrChess: ChessPiece[][]
  ): boolean {
    let tmp = false;
    let square1 = arrChess[x1][y1];
    if (square1?.chess === Category.king) {
      this.moveKing(x2, y2, square1.army);
    }
    let tmpSquare2 = arrChess[x2][y2];
    arrChess[x2][y2] = arrChess[x1][y1];
    arrChess[x1][y1] = null;
    let king: Coordinates;
    if (army === Army.black) {
      king = this.kingBlack;
    } else {
      king = this.kingWhile;
    }

    //check your king have checkKing
    tmp = this.movesKingWhenCheck(square1.army, king);
    arrChess[x1][y1] = arrChess[x2][y2];
    arrChess[x2][y2] = tmpSquare2;
    if (square1.chess === Category.king) {
      this.moveKing(x1, y1, square1.army);
    }

    return tmp;
  }
  private movesKingWhenCheck(army: Army, king: Coordinates): boolean {
    let square: ChessPiece;
    let tmp: Coordinates[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        square = this.arrChess[i][j];
        if (square?.army !== army && square) {
          tmp = this.chessPieceControler.movesChessPiece(
            { x: i, y: j },
            this.arrChess
          );
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].x === king.x && tmp[i].y === king.y) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  private checkMate(arrChess: ChessPiece[][], army: Army): boolean {
    let square: ChessPiece;
    // let check=false;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        square = arrChess[i][j];
        if (square?.army !== this.turn && square) {
          let moves = this.chessPieceControler.movesChessPiece(
            { x: i, y: j },
            arrChess
          );
          for (let k = 0; k < moves.length; k++) {
            if (
              !this.checkPreventCheckKing(
                i,
                j,
                moves[k].x,
                moves[k].y,
                army === Army.black ? Army.while : Army.black,
                arrChess
              )
            ) {
              this.audio.onAudiChecks();
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  private onTurn() {
    if (this.turn === Army.black) {
      this.turn = Army.while;
      this.opsionView.setTurnTime(Army.while);
    } else {
      this.turn = Army.black;
      this.opsionView.setTurnTime(Army.black);
    }
    this.opsionView.clock(this.turn);
  }
  public checkKing(square: ChessPiece): void {
    let king: Coordinates;
    if (square?.army === Army.while) {
      king = this.kingBlack;
    } else {
      king = this.kingWhile;
    }
    let square1: ChessPiece;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        square1 = this.arrChess[i][j];
        if (square1?.army === square?.army && square1) {
          let moves = this.chessPieceControler.movesChessPiece(
            { x: i, y: j },
            this.arrChess
          );
          if (moves.length > 0) {
            moves.forEach((e) => {
              if (e.x === king.x && e.y === king.y) {
                this.playView.onCheck(square1?.army);
                this.statusCheckKing = true;
                this.chessPieceControler.checkKing = true;
                this.boardView.checkking(i, j);
                if (this.checkMate(this.arrChess, this.turn)) {
                  this.winView.initPopupWin(
                    square1?.army === Army.while ? Army.while : Army.black,
                    this.opsionView.timeWString(),
                    this.opsionView.timeBString()
                  );
                  this.opsionView.ongameResult();
                }
                return;
              }
            });
          }
        }
      }
    }
  }

  public checkWin(): void {
    if (this.opsionView.timeW === 0 || this.opsionView.timeB === 0) {
      this.winView.initPopupWin(
        this.opsionView.timeW === 0 ? Army.while : Army.black,
        this.opsionView.timeWString(),
        this.opsionView.timeBString(),
        "Hết giờ"
      );
      this.opsionView.ongameResult();
    }
  }
  private undo(): void {
    let num = 1;
    if (!find("store").getComponent(Store).playerG) {
      num = 2;
    }
    if (this.moves.length > 0) {
      for (let i = 0; i < num; i++) {
        let undo = this.moves[this.moves.length - 1];
        this.arrChess[undo.start.x][undo.start.y] =
          this.arrChess[undo.end.x][undo.end.y];
        if (undo.type) {
          this.arrChess[undo.end.x][undo.end.y] = {
            chess: undo.type,
            army: undo.army,
          };
        } else {
          this.arrChess[undo.end.x][undo.end.y] = null;
        }

        this.boardView.initBoardView(this.arrChess);
        this.boardView.offHighlightMove(
          undo.end.x,
          undo.end.y,
          undo.start.x,
          undo.start.y
        );
        if (this.moves.length - 2 >= 0) {
          this.boardView.onHighlightMove(
            this.moves[this.moves.length - 2].end.x,
            this.moves[this.moves.length - 2].end.y,
            this.moves[this.moves.length - 2].start.x,
            this.moves[this.moves.length - 2].start.y
          );
        }

        this.movesRedo.push(undo);
        this.moves.splice(this.moves.length - 1, 1);
        this.onTurn();
      }
    }
    this.boardView.offHLWhenUndo();
    this.startingCoordinates = null;
  }
  private redo(): void {
    if (this.movesRedo.length > 0) {
      let redo = this.movesRedo[this.movesRedo.length - 1];
      this.boardView.gotoXY(redo.start.x, redo.start.y, redo.end.x, redo.end.y);
      this.moves.push(redo);
      this.movesRedo.splice(this.movesRedo.length - 1, 1);
      this.onTurn();
    }
  }
}
