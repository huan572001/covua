import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioSource })
    private move: AudioSource;
    @property({ type: AudioSource })
    private check: AudioSource;
    public onAudioMove():void{
        this.move.play();
    }
    public onAudiChecks():void{
        this.check.play();
    }
    public openAudio():void{
        this.move.volume=1;
        this.check.volume=1;
    }   
    public closeAudio():void{
        this.move.volume=0;
        this.check.volume=0;
    }   
}


