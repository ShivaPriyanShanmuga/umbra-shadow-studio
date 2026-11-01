// Orthogonal visual hull. Grid masks are row-major, top row first.
export function validateMask(mask,n){if(!Number.isInteger(n)||n<4||n>96||!mask||mask.length!==n*n)throw new Error('Invalid mask dimensions');for(const v of mask)if(v!==0&&v!==1)throw new Error('Masks must be binary');}
export function reconstruct(a,b,n){
  validateMask(a,n);validateMask(b,n);
  const voxels=new Uint8Array(n*n*n),conflicts=[];let count=0;
  for(let y=0;y<n;y++){
    const xs=[],zs=[];for(let x=0;x<n;x++){if(a[y*n+x])xs.push(x);if(b[y*n+x])zs.push(x);}
    if(Boolean(xs.length)!==Boolean(zs.length))conflicts.push({row:y,missing:xs.length?'B':'A',lostPixels:xs.length||zs.length});
    for(const x of xs)for(const z of zs){voxels[(y*n+z)*n+x]=1;count++;}
  }
  const projections=project(voxels,n);
  return {n,voxels,count,conflicts,projections,scores:[iou(a,projections[0]),iou(b,projections[1])]};
}
export function project(voxels,n){const a=new Uint8Array(n*n),b=new Uint8Array(n*n);for(let y=0;y<n;y++)for(let z=0;z<n;z++)for(let x=0;x<n;x++)if(voxels[(y*n+z)*n+x]){a[y*n+x]=1;b[y*n+z]=1;}return[a,b];}
export function iou(a,b){let intersection=0,union=0;for(let i=0;i<a.length;i++){intersection+=a[i]&&b[i]?1:0;union+=a[i]||b[i]?1:0;}return union?intersection/union:1;}
export function repairRows(a,b,n){validateMask(a,n);validateMask(b,n);const masks=[a.slice(),b.slice()],added=[0,0];for(let y=0;y<n;y++){const has=masks.map(m=>m.subarray(y*n,(y+1)*n).some(Boolean));if(has[0]!==has[1]){const side=has[0]?1:0;masks[side][y*n+Math.floor(n/2)]=1;added[side]++;}}return{masks,added};}
// Keep paired samples in each occupied row, preserving both endpoint projections.
// This reduces material, but does NOT promise connectivity or manufacturability.
export function reduceMaterial(result){const {n}=result,v=new Uint8Array(n*n*n);for(let y=0;y<n;y++){const xs=[],zs=[];for(let i=0;i<n;i++){if(result.projections[0][y*n+i])xs.push(i);if(result.projections[1][y*n+i])zs.push(i);}for(let i=0;i<Math.max(xs.length,zs.length);i++){const x=xs[Math.floor(i*xs.length/Math.max(xs.length,zs.length))],z=zs[Math.floor(i*zs.length/Math.max(xs.length,zs.length))];if(x!==undefined&&z!==undefined)v[(y*n+z)*n+x]=1;}}
  let count=0;for(const k of v)count+=k;return{...result,voxels:v,count,projections:project(v,n)};
}
export function components(voxels,n){const seen=new Uint8Array(voxels.length);let count=0;const stack=[];for(let i=0;i<voxels.length;i++){if(!voxels[i]||seen[i])continue;count++;seen[i]=1;stack.push(i);while(stack.length){const p=stack.pop(),x=p%n,z=Math.floor(p/n)%n,y=Math.floor(p/(n*n));for(const [dx,dy,dz]of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const xx=x+dx,yy=y+dy,zz=z+dz;if(xx<0||xx>=n||yy<0||yy>=n||zz<0||zz>=n)continue;const q=(yy*n+zz)*n+xx;if(voxels[q]&&!seen[q]){seen[q]=1;stack.push(q);}}}}return count;}
// Emit only boundary faces. Coordinates have Y up, target B reads along +Z.
export function surface(voxels,n,size=4){
  const vertices=[],normals=[],s=size/n;
  const faces=[{d:[1,0,0],v:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{d:[-1,0,0],v:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},{d:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]},{d:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},{d:[0,0,1],v:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]]},{d:[0,0,-1],v:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]}];
  const at=(x,y,z)=>x>=0&&x<n&&y>=0&&y<n&&z>=0&&z<n&&voxels[(y*n+z)*n+x];
  for(let y=0;y<n;y++)for(let z=0;z<n;z++)for(let x=0;x<n;x++){if(!at(x,y,z))continue;for(const f of faces){if(at(x+f.d[0],y-f.d[1],z+f.d[2]))continue;for(const k of[0,1,2,0,2,3]){const p=f.v[k];vertices.push((x+p[0])*s-size/2,(n-1-y+p[1])*s-size/2,(z+p[2])*s-size/2);normals.push(...f.d);}}}
  return{vertices:new Float32Array(vertices),normals:new Float32Array(normals)};
}
export function binarySTL(mesh){const triangles=mesh.vertices.length/9,buffer=new ArrayBuffer(84+triangles*50),view=new DataView(buffer);new Uint8Array(buffer,0,80).set(new TextEncoder().encode('Umbra voxel surface - disconnected components possible'));view.setUint32(80,triangles,true);let p=84;for(let t=0;t<triangles;t++){for(let c=0;c<3;c++,p+=4)view.setFloat32(p,mesh.normals[t*9+c],true);for(let c=0;c<9;c++,p+=4)view.setFloat32(p,mesh.vertices[t*9+c],true);view.setUint16(p,0,true);p+=2;}return buffer;}
export function parseProject(raw){if(!raw||raw.format!=='umbra-v1'||!Array.isArray(raw.masks)||raw.masks.length!==2)throw new Error('Not an Umbra v1 project');validateMask(raw.masks[0],raw.n);validateMask(raw.masks[1],raw.n);return{n:raw.n,masks:raw.masks.map(m=>Uint8Array.from(m)),mode:raw.mode==='sparse'?'sparse':'solid'};}
