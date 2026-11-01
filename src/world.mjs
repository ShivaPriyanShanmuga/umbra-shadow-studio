import * as THREE from'three';
import{OrbitControls}from'three/addons/controls/OrbitControls.js';
export function createWorld(host){
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor('#101a19');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive sculpture with two real-time orthographic shadow projections');
 const scene=new THREE.Scene();scene.fog=new THREE.Fog('#101a19',17,35);
 const camera=new THREE.PerspectiveCamera(37,1,.1,65);camera.position.set(8,5,10);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,-.1,0);controls.enableDamping=true;controls.minDistance=6;controls.maxDistance=23;controls.maxPolarAngle=Math.PI*.88;
 const ambient=new THREE.AmbientLight('#bac9d1',.48);scene.add(ambient);
 const hemi=new THREE.HemisphereLight('#d1e6dc','#202b2c',1.5);scene.add(hemi);
 const wallMaterial=new THREE.MeshStandardMaterial({color:'#b7c9bc',roughness:.92,side:THREE.DoubleSide});
 const wallA=new THREE.Mesh(new THREE.PlaneGeometry(5.35,5.35),wallMaterial);wallA.position.set(0,0,-2.72);wallA.receiveShadow=true;scene.add(wallA);
 const wallB=new THREE.Mesh(new THREE.PlaneGeometry(5.35,5.35),wallMaterial.clone());wallB.position.set(-2.72,0,0);wallB.rotation.y=Math.PI/2;wallB.receiveShadow=true;scene.add(wallB);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#182522',roughness:.85}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.85;floor.receiveShadow=true;scene.add(floor);
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.62,.18,80),new THREE.MeshStandardMaterial({color:'#293a34',metalness:.3,roughness:.45}));pedestal.position.y=-2.7;pedestal.receiveShadow=true;scene.add(pedestal);
 const lights=[];for(const pos of[[0,0,10],[10,0,0]]){const l=new THREE.DirectionalLight('#ffefce',3);l.position.set(...pos);l.castShadow=true;l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-2.7,right:2.7,top:2.7,bottom:-2.7,near:.1,far:22});l.shadow.bias=-.00003;l.shadow.normalBias=.007;scene.add(l,l.target);lights.push(l);}
 const rim=new THREE.DirectionalLight('#d3e8ff',2);rim.position.set(1,8,3);scene.add(rim);
 const material=new THREE.MeshStandardMaterial({color:'#cda15c',metalness:.72,roughness:.29,side:THREE.FrontSide});let sculpture=null,targetCamera=null,auto=false,sweeping=false,wallVisible=true;
 const positions={orbit:[8,5,10],a:[1.6,1.15,10],b:[10,1.15,1.6],top:[7,11,7]};
 const label=(text,pos)=>{const c=document.createElement('canvas');c.width=512;c.height=64;const ctx=c.getContext('2d');ctx.font='22px Arial';ctx.fillStyle='#d9e6d8';ctx.textAlign='center';ctx.fillText(text,256,42);const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false});const sp=new THREE.Sprite(m);sp.position.set(...pos);sp.scale.set(2.5,.3125,1);scene.add(sp);return sp;};
 const labels=[label('A  /  FRONT PROJECTION',[0,3,-2.72]),label('B  /  SIDE PROJECTION',[-2.72,3,0])];
 const resize=()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(host);resize();
 let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(targetCamera){camera.position.lerp(targetCamera,.065);if(camera.position.distanceTo(targetCamera)<.015)targetCamera=null;}if(auto&&!targetCamera){const v=camera.position.clone().sub(controls.target);v.applyAxisAngle(new THREE.Vector3(0,1,0),dt*.18);camera.position.copy(controls.target).add(v);}if(sweeping){const t=(Math.sin(now*.00045)+1)*Math.PI/4;lights[0].position.set(Math.sin(t)*10,0,Math.cos(t)*10);lights[1].intensity=0;}controls.update();renderer.render(scene,camera);}requestAnimationFrame(frame);
 return{
  renderer,scene,camera,
  setGeometry(mesh){if(sculpture){scene.remove(sculpture);sculpture.geometry.dispose();}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(mesh.vertices,3));g.setAttribute('normal',new THREE.BufferAttribute(mesh.normals,3));g.computeBoundingSphere();sculpture=new THREE.Mesh(g,material);sculpture.castShadow=true;sculpture.receiveShadow=true;scene.add(sculpture);},
  view(name){targetCamera=new THREE.Vector3(...(positions[name]||positions.orbit));auto=false;},
  spin(value){auto=value;},
  sweep(value){sweeping=value;if(!value){lights[0].position.set(0,0,10);lights[1].intensity=3;}},
  walls(value){wallVisible=value;wallA.visible=wallB.visible=value;labels.forEach(l=>l.visible=value);},
  color(hex){material.color.set(hex);},
  screenshot(){renderer.render(scene,camera);return new Promise(resolve=>renderer.domElement.toBlob(resolve,'image/png'));}
 };
}
