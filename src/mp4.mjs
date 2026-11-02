// Minimal ISO BMFF muxer for one constant-rate AVC track (no reordered frames).
const bytes=(...parts)=>{const out=new Uint8Array(parts.reduce((s,p)=>s+p.length,0));let i=0;for(const p of parts){out.set(p,i);i+=p.length;}return out;};
const u32=(...v)=>{const a=new Uint8Array(v.length*4),d=new DataView(a.buffer);v.forEach((x,i)=>d.setUint32(i*4,x));return a;};
const u16=(...v)=>{const a=new Uint8Array(v.length*2),d=new DataView(a.buffer);v.forEach((x,i)=>d.setUint16(i*2,x));return a;};
const text=s=>new TextEncoder().encode(s),zeros=n=>new Uint8Array(n);
const box=(type,...p)=>{const data=bytes(...p);return bytes(u32(data.length+8),text(type),data);};
const full=(type,flags,...p)=>box(type,u32(flags),...p);
const matrix=u32(65536,0,0,0,65536,0,0,0,1073741824);
export function muxMP4(samples,avcc,width,height,fps=60){
 if(!samples.length||!avcc?.length)throw new Error('Encoder produced no AVC track');
 const count=samples.length,scale=60000,delta=scale/fps,duration=count*delta;
 if(!Number.isInteger(delta))throw new Error('Unsupported frame rate');
 const ftyp=box('ftyp',text('isom'),u32(512),text('isomiso2avc1mp41'));
 const payload=bytes(...samples.map(s=>s.data)),mdat=box('mdat',payload),offset=ftyp.length+8;
 const mvhd=full('mvhd',0,u32(0,0,scale,duration,65536),u16(256,0),zeros(8),matrix,zeros(24),u32(2));
 const tkhd=full('tkhd',7,u32(0,0,1,0,duration),zeros(8),u16(0,0,0,0),matrix,u32(width*65536,height*65536));
 const mdhd=full('mdhd',0,u32(0,0,scale,duration),u16(0x55c4,0));
 const hdlr=full('hdlr',0,u32(0),text('vide'),zeros(12),text('Umbra Video\0'));
 const avc1=box('avc1',zeros(6),u16(1),zeros(16),u16(width,height),u32(72*65536,72*65536,0),u16(1),zeros(32),u16(24,65535),box('avcC',new Uint8Array(avcc)));
 const stsd=full('stsd',0,u32(1),avc1),stts=full('stts',0,u32(1,count,delta)),stsc=full('stsc',0,u32(1,1,count,1));
 const stsz=full('stsz',0,u32(0,count,...samples.map(s=>s.data.length))),stco=full('stco',0,u32(1,offset));
 const keys=samples.flatMap((s,i)=>s.key?[i+1]:[]),stss=full('stss',0,u32(keys.length,...keys));
 const stbl=box('stbl',stsd,stts,stsc,stsz,stco,stss),dinf=box('dinf',full('dref',0,u32(1),full('url ',1)));
 const minf=box('minf',full('vmhd',1,u16(0,0,0,0)),dinf,stbl);
 return bytes(ftyp,mdat,box('moov',mvhd,box('trak',tkhd,box('mdia',mdhd,hdlr,minf))));
}
