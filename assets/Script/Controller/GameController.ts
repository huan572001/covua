import { Army } from "./../Modal/enum";
import {
  _decorator,
  Camera,
  Component,
  director,
  EventMouse,
  find,
  instantiate,
  Label,
  Node,
  Prefab,
  UITransform,
  Vec3,
} from "cc";
import { BoardController } from "./BoardController";
import { sceneGame, sceneHome } from "../constant";
import { Store } from "../Store";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: BoardController })
  private board: BoardController;

  protected onLoad(): void {}

  protected start(): void {
    this.board.initBoard();
    this.board.onStartGame();
  }
  public resetGame(): void {
    director.loadScene(sceneGame);
  }
  private home(): void {
    director.loadScene(sceneHome);
  }
  protected update(dt: number): void {
    this.board.checkWin();
  }
}
