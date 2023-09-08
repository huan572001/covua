import { _decorator, Component, Label, Node } from "cc";
import { Army } from "../Modal/enum";
const { ccclass, property } = _decorator;

@ccclass("GameWinView")
export class GameWinView extends Component {
  @property({ type: Label })
  private labelChessWin: Label;
  @property({ type: Label })
  private timeWhile: Label;
  @property({ type: Label })
  private timeBlack: Label;
  @property({ type: Label })
  private title: Label;
  @property({ type: Node })
  private popup: Node;
  public initPopupWin(
    chess: Army,
    timeW: string,
    timeB: string,
    title?: string
  ): void {
    this.popup.active = true;
    if (title) {
      this.title.string = title;
    }
    if (chess === Army.black) {
      this.labelChessWin.string = "(Đen thắng)";
    } else if (chess === Army.while) {
      this.labelChessWin.string = "(Trắng thắng)";
    } else {
      this.labelChessWin.string = "(Hòa)";
    }
    this.timeWhile.string = timeB;
    this.timeBlack.string = timeW;
  }
}
