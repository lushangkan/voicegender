import Recorder from 'recorder-core'
import 'recorder-core/src/extensions/waveview'
import 'recorder-core/src/engine/wav'
import 'recorder-core/src/extensions/waveview'
import type {Ref} from "vue";

export class Record {

    private rec: typeof Recorder;
    private success: Function;
    private timer: Function | null;
    private timerDelay: number;
    private timerID: number;
    private waveform: any;

    constructor(success: Function) {
        this.success = success;
        this.timer = null;
        this.timerDelay = 1;
        this.timerID = -1;

        this.rec = Recorder({
            type:"wav",
            sampleRate:32000,
            bitRate:16,
            onProcess: (buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd) => {
                this.waveform.input(buffers[buffers.length-1],powerLevel,bufferSampleRate);
            }
        });

        this.requestPermission(success)

    }

    setWaveView(className: String) {
        this.waveform = Recorder.WaveView({
            elem: "." + className,
            width: "100%",
            height: "100%",
            fps: 120,
            keep: false,

            scale:2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
            speed:15, //移动速度系数，越大越快
            phase:31, //相位，调整了速度后，调整这个值得到一个看起来舒服的波形

            lineWidth: 3,
            linear1:[0,"rgb(230,108,0)",0.2,"rgb(250,93,28)",1,"rgb(255,180,3)"], //线条渐变色1，从左到右
            linear2:[0,"rgb(218,88,57)",1,"rgb(240,208,0)"] ,//线条渐变色2，从左到右
            linearBg:[0,"rgba(255,120,0,0.62)",1,"rgba(245,200,214,0.64)"] //背景渐变色，从上到下
        });
    }


    setTimer(fun:Function ,time: number):void {
        this.timer = fun;
        this.timerDelay = time;
    }

    requestPermission(success: Function):boolean {
        this.rec.open(() => {
            success&&success();
            return true;
        },(msg,isUserNotAllow) => {//用户拒绝未授权或不支持
            console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
            return false;
        });
        return false;
    }

    start():void {
        this.rec.start();
        if (this.timer != null) {
            this.timerID = setInterval(this.timer, this.timerDelay);
        }
    }

    pause():void {
        this.rec.pause();
        if (this.timer != null && this.timerID != null) {
            clearInterval(this.timerID);
        }
    }

    resume():void {
        this.rec.resume();
        if (this.timer != null && this.timerID != null) {
            this.timerID = setInterval(this.timer, this.timerDelay);
        }
    }

    stop():void {
        this.rec.stop();
        if (this.timer != null && this.timerID != null) {
            clearInterval(this.timerID);
        }
    }

    isOpen():boolean {
        return Recorder.IsOpen();
    }

}

