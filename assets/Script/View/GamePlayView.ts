import { _decorator, Component, Node } from "cc";
import { Army } from "../Modal/enum";
const { ccclass, property } = _decorator;

@ccclass("GamePlayView")
export class GamePlayView extends Component {
  @property({ type: Node })
  private check: Node;
  @property({ type: Node })
  private help: Node;
  protected start(): void {
    this.scheduleOnce(() => {
      this.help.active = false;
    }, 1.5);
  }
  public onCheck(option?: Army): void {
    if (option === Army.black) {
      this.check.setPosition(-120, -355);
    } else if (option === Army.while) {
      this.check.setPosition(-120, 370);
    } else {
      this.check.setPosition(-1850, -355);
    }
  }
}
