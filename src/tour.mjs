import{chapterAt,tourDuration}from'./motion.mjs';
import{muxMP4}from'./mp4.mjs';
const chapters=[
 ['TWO SHADOWS. ONE SCULPTURE.','Start with the shadows. Discover the form between them.'],
 ['01 / A HEART IN THE LIGHT','The front projection reveals the first target.'],
 ['02 / ANOTHER SIDE TO THE STORY','The same object casts a crescent from the other direction.'],
 ['03 / DESIGN THROUGH THE SHADOWS','Change either silhouette. The sculpture rebuilds immediately.'],
 ['04 / MAKE IT YOURS','Turn lettering into a sculpture with two readings.'],
 ['05 / SEE WHAT CANNOT WORK','Erase rows from one target. Missing pixels turn red in the other.'],
 ['06 / REPAIR WITH INTENT','Add the missing row support and inspect the changed design.'],
 ['07 / LESS MATERIAL, SAME PROJECTIONS','Preserve both shadows while exploring a lighter construction.'],
 ['08 / KEEP THE REAL GEOMETRY','Export the sculpture, editable project, image and shadow proof.'],
 ['UMBRA / MAKE LIGHT YOUR MATERIAL','Open the studio. Draw two silhouettes. Discover what they can become.']
];
function compose(ctx,world,state,time){
 const index=chapterAt(time),{n,masks,result,mesh}=state;
 ctx.fillStyle='#101817';ctx.fillRect(0,0,1280,720);
 ctx.fillStyle='#d6b278';ctx.font='600 27px Arial';ctx.fillText('umbra.',30,45);
 ctx.fillStyle='#8da795';ctx.font='11px Arial';ctx.fillText('LIGHT / FORM / POSSIBILITY',1000,40);
 ctx.drawImage(world.renderer.domElement,300,65,950,515);
 for(let k=0;k<2;k++){
  ctx.fillStyle='#96aa9b';ctx.font='12px Arial';ctx.fillText(k?'B / SIDE TARGET':'A / FRONT TARGET',32,87+k*232);
  ctx.fillStyle='#1b2922';ctx.fillRect(30,100+k*232,235,190);
  const scale=172/n,ox=61,oy=109+k*232;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const p=y*n+x;if(!masks[k][p])continue;ctx.fillStyle=result.projections[k][p]?(k?'#a9cec6':'#d6b278'):'#ed7869';ctx.fillRect(ox+x*scale,oy+y*scale,scale+.2,scale+.2);}
  ctx.fillStyle='#c9d7c7';ctx.font='12px Arial';ctx.fillText(`${(result.scores[k]*100).toFixed(1)}% grid agreement`,35,303+k*232);
 }
 ctx.fillStyle='#d6b278';ctx.font='15px Arial';ctx.fillText(`${result.count.toLocaleString()} voxels  /  ${(mesh.vertices.length/9).toLocaleString()} surface triangles`,340,558);
 ctx.fillStyle='#101817';ctx.fillRect(0,582,1280,138);
 ctx.fillStyle='#d6b278';ctx.font='600 25px Arial';ctx.fillText(chapters[index][0],32,623);
 ctx.fillStyle='#c5d3c7';ctx.font='17px Arial';ctx.fillText(chapters[index][1],32,658);
 ctx.fillStyle='#53674f';ctx.fillRect(32,692,1216,2);ctx.fillStyle='#d6b278';ctx.fillRect(32,692,1216*time/tourDuration,2);
 ctx.fillStyle='#718a76';ctx.font='10px Arial';ctx.fillText('ARBITER HACKS V1 / GENERAL TRACK',32,711);
 ctx.fillText(`${Math.floor(time/60)}:${String(Math.floor(time%60)).padStart(2,'0')} / 2:06`,1150,711);
}
export async function recordTour({world,getState,step,onFinish,onProgress=()=>{},duration=tourDuration}){
 if(!window.VideoEncoder||!window.VideoFrame)throw new Error('Smooth export requires a browser with WebCodecs support.');
 const fps=60,total=Math.round(duration*fps),canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;const ctx=canvas.getContext('2d',{alpha:false});
 const config={codec:'avc1.42002a',width:1280,height:720,bitrate:6500000,framerate:fps,latencyMode:'realtime',avc:{format:'avc'}};
 const support=await VideoEncoder.isConfigSupported(config);if(!support.supported)throw new Error('This browser cannot encode the requested H.264 video.');
 const samples=[];let avcc=null,failure=null,index=-1;
 const encoder=new VideoEncoder({output:(chunk,metadata)=>{const data=new Uint8Array(chunk.byteLength);chunk.copyTo(data);samples.push({data,key:chunk.type==='key',timestamp:chunk.timestamp});if(metadata?.decoderConfig?.description)avcc=new Uint8Array(metadata.decoderConfig.description);},error:e=>{failure=e;}});
 encoder.configure(config);world.beginCapture(1280,694);
 try{
  for(let frame=0;frame<total;frame++){
   if(failure)throw failure;
   const time=frame/fps,next=chapterAt(time);if(next!==index){index=next;step(index);}
   world.renderAt(time);compose(ctx,world,getState(),time);
   const videoFrame=new VideoFrame(canvas,{timestamp:Math.round(frame*1000000/fps),duration:Math.round(1000000/fps)});
   encoder.encode(videoFrame,{keyFrame:frame%(fps*2)===0});videoFrame.close();
   if(frame%30===29){await encoder.flush();onProgress(Math.round((frame+1)*100/total));await new Promise(requestAnimationFrame);}
  }
  await encoder.flush();if(failure)throw failure;
  if(samples.length!==total)throw new Error(`Expected ${total} video frames; received ${samples.length}.`);
  for(let i=1;i<samples.length;i++)if(samples[i].timestamp<=samples[i-1].timestamp)throw new Error('Encoder reordered frames unexpectedly.');
  onFinish(new Blob([muxMP4(samples,avcc,1280,720,fps)],{type:'video/mp4'}),{name:duration===tourDuration?'umbra-smooth-demo.mp4':'umbra-motion-test.mp4',type:'video/mp4',frames:total,fps,duration});
 }finally{if(encoder.state!=='closed')encoder.close();world.endCapture();}
}
