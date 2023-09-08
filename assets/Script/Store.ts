import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Store')
export class Store extends Component {
  private player: boolean = false;
  private level: number = 1;

  public get playerG(): boolean {
    return this.player;
  }
  public set playerG(value: boolean) {
    this.player = value;
  }
  public get levelG(): number {
    return this.level;
  }
  public set levelG(value: number) {
    this.level = value;
  }
}
