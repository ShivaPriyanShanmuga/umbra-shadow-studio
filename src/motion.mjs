export const chapterDurations=[8,9,9,12,13,15,12,14,18,16];
export const tourDuration=chapterDurations.reduce((a,b)=>a+b,0);
export const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
export function chapterAt(time){let end=0;for(let i=0;i<chapterDurations.length;i++){end+=chapterDurations[i];if(time<end)return i;}return chapterDurations.length-1;}
// A fixed timeline gives the same pose at a timestamp regardless of render speed.
const poses=[[0,.76,1.19,13],[8,.18,1.40,11.1],[17,1.39,1.40,11.1],[26,.79,1.16,12.8],[38,.54,1.10,12.4],[51,.81,1.18,12.8],[66,.72,1.14,12.6],[78,.80,.65,14.5],[92,.68,1.16,12.8],[110,.90,1.12,13],[126,.61,1.17,12.7]];
export function tourPose(time){const t=Math.max(0,Math.min(tourDuration,time));let i=0;while(i<poses.length-2&&t>poses[i+1][0])i++;const a=poses[i],b=poses[i+1],s=ease((t-a[0])/(b[0]-a[0]));const theta=a[1]+(b[1]-a[1])*s,phi=a[2]+(b[2]-a[2])*s,r=a[3]+(b[3]-a[3])*s;return[r*Math.sin(phi)*Math.sin(theta),r*Math.cos(phi)-.1,r*Math.sin(phi)*Math.cos(theta)];}
