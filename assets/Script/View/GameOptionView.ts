import { _decorator, Button, Component, director, Label, Node } from "cc";
import { BoardController } from "../Controller/BoardController";
import { Army } from "../Modal/enum";
import { sceneGame } from "../constant";
const { ccclass, property } = _decorator;

@ccclass("GameOptionView")
export class GameOptionView extends Component {
  @property({ type: Label })
  private timeWhileLabel: Label;
  @property({ type: Label })
  private timeBlackLabel: Label;
  @property({ type: Node })
  private clockWhile: Node;
  @property({ type: Node })
  private clockBlack: Node;
  @property({ type: Node })
  private pauseGame: Node;
  @property({ type: Node })
  private continueGame: Node;
  @property({ type: Node })
  private openAudio: Node;
  @property({ type: Node })
  private closeAudio: Node;
  @property({ type: Node })
  private loading: Node;
  @property({ type: Button })
  private btnReset: Button;
  @property({ type: Button })
  private btnUndo: Button;
  private timeWhile: number = 15 * 60;
  private timeBlack: number = 15 * 60;
  private stoptime: boolean = true;
  private timeSt: Date;
  private army: Army;
  public get timeB(): number {
    return this.timeBlack;
  }
  public get timeW(): number {
    return this.timeWhile;
  }
  public clock(army: Army): void {
    let x = -200;
    if (army === Army.black) {
      x = 200;
    }
    this.clockBlack.setPosition(
      this.clockBlack.position.x + x,
      this.clockBlack.position.y
    );
    this.clockWhile.setPosition(
      this.clockWhile.position.x - x,
      this.clockWhile.position.y
    );
  }
  public intTOStringtime(time: number) {
    return `${Math.floor(time / 60)}:${time % 60}`;
  }
  public timeWString(): string {
    return this.intTOStringtime(this.timeWhile);
  }
  public timeBString(): string {
    return this.intTOStringtime(this.timeBlack);
  }
  public setTurnTime(army: Army) {
    this.army = army;
  }
  public startTimer(): void {
    this.schedule(
      function () {
        if (this.timeWhile > 0 && this.timeBlack > 0 && this.stoptime) {
          if (this.army === Army.black) {
            this.timeWhile--;
            this.timeWhileLabel.string = this.intTOStringtime(this.timeWhile);
          } else if (this.army === Army.while) {
            this.timeBlack--;
            this.timeBlackLabel.string = this.intTOStringtime(this.timeBlack);
          }
        }
      },
      1,
      999999,
      1
    );
  }
  public onStopGame(): void {
    this.pauseGame.active = false;
    this.continueGame.active = true;
    this.onstopButon();
    this.onStopTimeGame();
  }
  public offStopGame(): void {
    this.pauseGame.active = true;
    this.continueGame.active = false;
    this.offstopButon();
    this.offStopTimeGame();
  }
  public onStopTimeGame(): void {
    this.stoptime = false;
  }
  public offStopTimeGame(): void {
    this.stoptime = true;
  }

  public onstopButon(): void {
    this.btnReset.interactable = false;
    this.btnUndo.interactable = false;
  }
  public offstopButon(): void {
    this.btnReset.interactable = true;
    this.btnUndo.interactable = true;
  }
  public ongameResult(): void {
    this.onstopButon();
    this.onStopTimeGame();
    this.pauseGame.getComponent(Button).interactable = false;
    this.continueGame.getComponent(Button).interactable = false;
  }
  public offgameResult(): void {
    this.offStopTimeGame();
    this.offstopButon();
    this.pauseGame.getComponent(Button).interactable = true;
    this.continueGame.getComponent(Button).interactable = true;
  }
  public audioGame(): void {
    this.openAudio.active = !this.openAudio.active;
    this.closeAudio.active = !this.closeAudio.active;
  }
}
