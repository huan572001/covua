import { Store } from './../Store';
import { _decorator, Component, director, find, Node } from 'cc';
import { sceneGame } from '../constant';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
  private store: Store;
  protected start(): void {
    // console.log(this.storeClass.playerG);
  }
  private twoPlayer(): void {
    if (find('store') === null) {
      const storeNode = new Node('store');
      director.addPersistRootNode(storeNode);
      this.store = storeNode.addComponent(Store);
    } else {
      this.store = find('store').getComponent(Store);
    }
    this.store.playerG = true;
    director.loadScene(sceneGame);
  }
  private onePlayer(): void {
    if (find('store') === null) {
      const storeNode = new Node('store');
      director.addPersistRootNode(storeNode);
      this.store = storeNode.addComponent(Store);
    } else {
      this.store = find('store').getComponent(Store);
    }
    this.store.playerG = false;
    director.loadScene(sceneGame);
  }
  private level(event, customEventData: string): void {
    if (find('store') === null) {
      const storeNode = new Node('store');
      director.addPersistRootNode(storeNode);
      this.store = storeNode.addComponent(Store);
    } else {
      this.store = find('store').getComponent(Store);
    }
    this.store.levelG = Number(customEventData);
  }
}
