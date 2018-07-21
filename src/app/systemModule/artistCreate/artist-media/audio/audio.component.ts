import { Component, OnInit, Input } from '@angular/core';

declare var SC:any;

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  @Input('Audio') Audio:any;
  @Input() index:number;

  status:string = 'play';
  duration:number = 0;
  currentTime:number = 0;
  

  constructor() { }

  ngOnInit() {
  }

  playAudio(s:string){
    // console.log(s);
    SC.resolve(s).then((res)=>{
      // console.log(res);
      SC.stream('/tracks/'+res.id).then((player)=>{

        // console.log(`is actual`,player.isActuallyPlaying());
        player.play();
        
        player.on('play-start',()=>{
           this.duration = player.getDuration();
        })

        player.on('state-change',(val)=>{
          // console.log(val);
        })

        player.on('no_streams',(val)=>{
          // console.log(`no_streams`,val);
        })

        player.on('no_connection',()=>{
          // console.log(`no_connection`);
        })
        
        setInterval(()=>{
           this.currentTime = player.currentTime();
        },100)
        
        setTimeout(()=>{
          player.pause()
          player.seek(0)
        },10000)
  
      });

    },(err)=>{
      // console.log(`ERROR`)
    })
  }

}
