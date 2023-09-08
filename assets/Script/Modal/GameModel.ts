import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
  @property({ type: CCInteger })
  private sizeSquare: number;
  public get size(): number {
    return this.sizeSquare;
  }
  public set size(value: number) {
    this.sizeSquare = value;
  }
}
