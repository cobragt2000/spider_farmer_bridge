/**
 * PPFD 3D Grow Light Lovelace Card  v4.0
 * Spider Farmer SE4500 / SF2000
 *
 * Install: /config/www/ppfd-3d-card.js
 * Resource: /local/ppfd-3d-card.js?v=5
 *
 * type: custom:ppfd-3d-card
 * title: Flower tent
 * light_model: SE4500
 * entities:
 *   dimmer_percent: sensor.se4500_dimmer
 *   height_inches:  sensor.light_height_in
 * defaults:
 *   height_inches:         18
 *   plant_height_inches:   12
 *   num_plants:            2
 *   dimmer_percent:        100
 *   photoperiod_hours:     18
 * tent:
 *   width_ft:  2
 *   length_ft: 4
 *   height_ft: 6.5
 */

const _THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

const _LIGHTS = {
  SE4500: {
    name:'SE4500', watts:320, isBar:true, barCount:3, lW:1.163, lL:0.369,
    ppfd:{
       8:{c:1800,a:1350,e:900}, 10:{c:1500,a:1150,e:780}, 12:{c:1250,a:960,e:650},
      14:{c:1060,a:820,e:545}, 16:{c:910,a:700,e:465},   18:{c:790,a:610,e:400},
      20:{c:690,a:530,e:350},  22:{c:610,a:470,e:305},   24:{c:545,a:420,e:270},
      26:{c:490,a:375,e:240},  28:{c:440,a:340,e:215},   30:{c:400,a:305,e:195},
      32:{c:360,a:275,e:175},  36:{c:300,a:230,e:145},   42:{c:240,a:184,e:115},
      48:{c:195,a:149,e:93},   60:{c:150,a:115,e:72},    72:{c:118,a:90,e:56},
      84:{c:95,a:72,e:45},
    }
  },
  SF2000: {
    name:'SF2000', watts:200, isBar:false, barCount:0, lW:0.864, lL:0.432,
    ppfd:{
       8:{c:1600,a:1050,e:480}, 10:{c:1320,a:870,e:400},  12:{c:1100,a:720,e:330},
      14:{c:920,a:600,e:275},  16:{c:780,a:505,e:230},   18:{c:660,a:430,e:193},
      20:{c:570,a:370,e:165},  22:{c:495,a:320,e:143},   24:{c:435,a:280,e:125},
      26:{c:385,a:248,e:110},  28:{c:340,a:218,e:97},    30:{c:305,a:196,e:87},
      32:{c:274,a:176,e:78},   36:{c:226,a:145,e:64},    42:{c:182,a:116,e:51},
      48:{c:148,a:95,e:42},    60:{c:97,a:62,e:27},      72:{c:68,a:43,e:19},
      84:{c:49,a:31,e:14},
    }
  }
};

function _getPPFD(light, hin, dim) {
  const t = light.ppfd, ks = Object.keys(t).map(Number).sort((a,b)=>a-b);
  let lo=ks[0], hi=ks[ks.length-1];
  for (let i=0; i<ks.length-1; i++) {
    if (hin>=ks[i] && hin<=ks[i+1]) { lo=ks[i]; hi=ks[i+1]; break; }
  }
  if (hin<=ks[0]) lo=hi=ks[0];
  if (hin>=ks[ks.length-1]) lo=hi=ks[ks.length-1];
  const f=lo===hi?0:(hin-lo)/(hi-lo);
  const ip=(a,b)=>Math.round((a+(b-a)*f)*dim/100);
  return{center:ip(t[lo].c,t[hi].c),avg:ip(t[lo].a,t[hi].a),edge:ip(t[lo].e,t[hi].e)};
}

function _ppfdColor(v,mx){
  const t=Math.max(0,Math.min(1,v/mx));
  let r,g,b;
  if      (t<0.2){const s=t/0.2;       r=0;              g=Math.round(s*80);        b=Math.round(160+s*95);}
  else if (t<0.4){const s=(t-0.2)/0.2; r=0;              g=Math.round(80+s*175);    b=Math.round(255-s*255);}
  else if (t<0.6){const s=(t-0.4)/0.2; r=Math.round(s*220); g=255;                  b=0;}
  else if (t<0.8){const s=(t-0.6)/0.2; r=Math.round(220+s*35); g=Math.round(255-s*120); b=0;}
  else            {const s=(t-0.8)/0.2; r=255;            g=Math.round(135-s*135);  b=0;}
  return[r,g,b];
}

function _zoneInfo(avg){
  if(avg<200)  return{label:'Too dim',                    color:'#4488dd'};
  if(avg<400)  return{label:'Seedling / early veg',       color:'#22bbaa'};
  if(avg<600)  return{label:'Vegetative growth',          color:'#44bb44'};
  if(avg<800)  return{label:'Transition / early flower',  color:'#bbaa22'};
  if(avg<1000) return{label:'Peak flower zone',           color:'#ee8800'};
  return              {label:'High intensity — watch heat',color:'#dd2222'};
}

const _CSS = `
  :host{display:block;}
  *{box-sizing:border-box;margin:0;padding:0;}
  #w{
    background:var(--ha-card-background,var(--card-background-color,#fff));
    border-radius:var(--ha-card-border-radius,12px);
    border:1px solid var(--divider-color,rgba(0,0,0,.1));
    overflow:hidden;
    font-family:var(--primary-font-family,sans-serif);
  }
  .top{padding:10px 14px 0;display:flex;align-items:center;justify-content:space-between;gap:8px;}
  .title{font-size:14px;font-weight:500;color:var(--primary-text-color);}
  .sub{font-size:11px;color:var(--secondary-text-color);margin-top:1px;}
  select,input[type=number]{
    background:var(--secondary-background-color,#f0f0f0);
    color:var(--primary-text-color);
    border:1px solid var(--divider-color,rgba(0,0,0,.15));
    border-radius:6px;padding:4px 8px;font-size:12px;width:100%;
  }
  input[type=range]{width:100%;}
  .vw{background:#090c12;width:100%;}
  canvas{display:block;width:100%;cursor:grab;}
  canvas:active{cursor:grabbing;}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 12px;}
  .stat{background:var(--secondary-background-color,#f0f0f0);border-radius:8px;padding:7px 10px;}
  .sl{font-size:10px;color:var(--secondary-text-color);margin-bottom:2px;}
  .sv{font-size:16px;font-weight:500;color:var(--primary-text-color);line-height:1;}
  .su{font-size:10px;color:var(--secondary-text-color);}
  .leg{display:flex;align-items:center;gap:6px;padding:2px 12px 4px;font-size:11px;color:var(--secondary-text-color);}
  .legbar{flex:1;height:7px;border-radius:4px;background:linear-gradient(to right,#0044ff,#00ccff,#00ff88,#aaff00,#ffcc00,#ff4400);}
  .zone{padding:2px 12px 6px;font-size:11px;color:var(--secondary-text-color);}
  .zbadge{display:inline-block;padding:2px 8px;border-radius:9px;font-size:11px;font-weight:500;margin-right:6px;}
  .div{height:1px;background:var(--divider-color,rgba(0,0,0,.1));}
  .sec{font-size:10px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.05em;padding:6px 12px 2px;}
  .ctrls{padding:6px 12px 8px;display:flex;flex-direction:column;gap:6px;}
  .r4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
  .r3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
  .r2{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
  .cg{display:flex;flex-direction:column;gap:3px;}
  .cl{font-size:11px;color:var(--secondary-text-color);}
  .cv{font-size:12px;font-weight:500;color:var(--primary-text-color);}
`;

class PPFD3DCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this._cfg={};this._hass=null;this._T=null;
    this._scene=null;this._camera=null;this._renderer=null;this._raf=null;
    this._o={};
    this._s={tW:0.61,tL:1.22,tH:1.981,lightKey:'SE4500',hin:18,plantIn:12,numPlants:2,dim:100,photo:18};
    this._cam={theta:0.52,phi:0.36,r:3.8,drag:false,px:0,py:0};
  }

  setConfig(cfg){
    this._cfg=cfg;
    const d=cfg.defaults||{},tent=cfg.tent||{};
    this._s.lightKey  = cfg.light_model||'SE4500';
    this._s.hin       = d.height_inches||18;
    this._s.plantIn   = d.plant_height_inches||12;
    this._s.numPlants = d.num_plants||2;
    this._s.dim       = d.dimmer_percent||100;
    this._s.photo     = d.photoperiod_hours||18;
    this._s.tW = Math.max(0.3,(tent.width_ft||2)*0.3048);
    this._s.tL = Math.max(0.6,(tent.length_ft||4)*0.3048);
    this._s.tH = Math.max(0.9,(tent.height_ft||6.5)*0.3048);
    if(!this.shadowRoot.querySelector('#w')) this._buildDOM();
  }

  set hass(hass){
    this._hass=hass;
    const ents=this._cfg.entities||{};
    let chg=false;
    if(ents.dimmer_percent){
      const st=hass.states[ents.dimmer_percent];
      if(st){const v=parseFloat(st.state);if(!isNaN(v)){this._s.dim=Math.max(10,Math.min(100,v));chg=true;}}
    }
    if(ents.height_inches){
      const st=hass.states[ents.height_inches];
      if(st){const v=parseFloat(st.state);if(!isNaN(v)){this._s.hin=Math.max(8,v);chg=true;}}
    }
    if(chg&&this._scene){this._syncSliders();this._update();}
  }

  static getConfigElement(){return document.createElement('ppfd-3d-card-editor');}
  static getStubConfig(){
    return{type:'custom:ppfd-3d-card',title:'PPFD Visualizer',light_model:'SE4500',
      defaults:{height_inches:18,plant_height_inches:12,num_plants:2,dimmer_percent:100,photoperiod_hours:18},
      tent:{width_ft:2,length_ft:4,height_ft:6.5}};
  }

  _buildDOM(){
    const title=this._cfg.title||'PPFD visualizer';
    this.shadowRoot.innerHTML=`<style>${_CSS}</style>
    <div id="w">
      <div class="top">
        <div><div class="title">${title}</div><div class="sub" id="sub">Loading…</div></div>
        <select id="sel">
          <option value="SE4500">SE4500 320W</option>
          <option value="SF2000">SF2000 200W</option>
        </select>
      </div>
      <div class="vw"><canvas id="c" height="340"></canvas></div>
      <div class="stats" id="stats"></div>
      <div class="leg"><span>Low</span><div class="legbar"></div><span>High PPFD</span></div>
      <div class="zone" id="zone"></div>
      <div class="div"></div>
      <div class="sec">Light &amp; plants</div>
      <div class="ctrls">
        <div class="r4">
          <div class="cg"><span class="cl">Light height <span class="cv" id="l-ht">18"</span></span><input type="range" id="sl-ht" min="8" max="78" step="1" value="18"></div>
          <div class="cg"><span class="cl">Plant height <span class="cv" id="l-pt">12"</span></span><input type="range" id="sl-pt" min="1" max="78" step="1" value="12"></div>
          <div class="cg"><span class="cl">Plants <span class="cv" id="l-np">2</span></span><input type="range" id="sl-np" min="1" max="4" step="1" value="2"></div>
          <div class="cg"><span class="cl">Dimmer <span class="cv" id="l-dim">100%</span></span><input type="range" id="sl-dim" min="10" max="100" step="5" value="100"></div>
        </div>
        <div class="r2">
          <div class="cg"><span class="cl">Photoperiod <span class="cv" id="l-pp">18h</span></span><input type="range" id="sl-pp" min="12" max="24" step="1" value="18"></div>
        </div>
      </div>
      <div class="div"></div>
      <div class="sec">Tent dimensions</div>
      <div class="ctrls">
        <div class="r3">
          <div class="cg"><span class="cl">Width (ft)</span><input type="number" id="t-w" value="2" min="1" max="10" step="0.5"></div>
          <div class="cg"><span class="cl">Length (ft)</span><input type="number" id="t-l" value="4" min="1" max="12" step="0.5"></div>
          <div class="cg"><span class="cl">Height (ft)</span><input type="number" id="t-h" value="6.5" min="3" max="12" step="0.5"></div>
        </div>
      </div>
    </div>`;
    this._syncSliders();
    this._loadThree();
    this._attachEvents();
  }

  _syncLightMax(){this._syncSliderMaxes();}
  _syncSliderMaxes(){
    const sr=this.shadowRoot;
    const tentHIn=Math.round((+sr.getElementById('t-h').value||6.5)*12);
    const slHt=sr.getElementById('sl-ht');
    if(slHt){
      slHt.max=tentHIn;
      if(+slHt.value>tentHIn){
        slHt.value=tentHIn;this._s.hin=tentHIn;
        const lbl=sr.getElementById('l-ht');if(lbl)lbl.textContent=tentHIn+'"';
      }
    }
    const slPt=sr.getElementById('sl-pt');
    if(slPt){
      slPt.max=tentHIn;
      if(+slPt.value>tentHIn){
        slPt.value=tentHIn;this._s.plantIn=tentHIn;
        const lbl=sr.getElementById('l-pt');if(lbl)lbl.textContent=tentHIn+'"';
      }
    }
  }

  _syncSliders(){
    const sr=this.shadowRoot,s=this._s;
    const sv=(id,v)=>{const e=sr.getElementById(id);if(e)e.value=v;};
    const st=(id,v)=>{const e=sr.getElementById(id);if(e)e.textContent=v;};
    sv('sel',s.lightKey);
    sv('sl-ht',s.hin);       st('l-ht',s.hin+'"');
    sv('sl-pt',s.plantIn);   st('l-pt',s.plantIn+'"');
    sv('sl-np',s.numPlants); st('l-np',s.numPlants);
    sv('sl-dim',s.dim);      st('l-dim',s.dim+'%');
    sv('sl-pp',s.photo);     st('l-pp',s.photo+'h');
    sv('t-w',+(s.tW/0.3048).toFixed(1));
    sv('t-l',+(s.tL/0.3048).toFixed(1));
    sv('t-h',+(s.tH/0.3048).toFixed(1));
    this._syncSliderMaxes();
  }

  _attachEvents(){
    const sr=this.shadowRoot;
    const onChg=()=>{
      const gv=id=>+(sr.getElementById(id).value);
      this._s.lightKey  = sr.getElementById('sel').value;
      this._s.hin       = gv('sl-ht');
      this._s.plantIn   = gv('sl-pt');
      this._s.numPlants = gv('sl-np');
      this._s.dim       = gv('sl-dim');
      this._s.photo     = gv('sl-pp');
      this._s.tW=Math.max(0.3,(gv('t-w')||2)*0.3048);
      this._s.tL=Math.max(0.6,(gv('t-l')||4)*0.3048);
      this._s.tH=Math.max(0.9,(gv('t-h')||6.5)*0.3048);
      const gt=(id,v,sfx)=>{const e=sr.getElementById(id);if(e)e.textContent=v+sfx;};
      gt('l-ht',this._s.hin,'"');gt('l-pt',this._s.plantIn,'"');
      gt('l-np',this._s.numPlants,'');gt('l-dim',this._s.dim,'%');gt('l-pp',this._s.photo,'h');
      this._syncSliderMaxes();
      if(this._scene)this._update();
    };
    ['sel','sl-ht','sl-pt','sl-np','sl-dim','sl-pp','t-w','t-l','t-h'].forEach(id=>{
      const el=sr.getElementById(id);
      if(el){el.addEventListener('input',onChg);el.addEventListener('change',onChg);}
    });
    const canvas=sr.getElementById('c');
    canvas.addEventListener('mousedown',e=>{this._cam.drag=true;this._cam.px=e.clientX;this._cam.py=e.clientY;});
    window.addEventListener('mouseup',()=>this._cam.drag=false);
    window.addEventListener('mousemove',e=>{
      if(!this._cam.drag)return;
      this._cam.theta-=(e.clientX-this._cam.px)*0.007;
      this._cam.phi=Math.max(0.05,Math.min(1.3,this._cam.phi-(e.clientY-this._cam.py)*0.005));
      this._cam.px=e.clientX;this._cam.py=e.clientY;this._updCam();
    });
    canvas.addEventListener('wheel',e=>{this._cam.r=Math.max(1.2,Math.min(10,this._cam.r+e.deltaY*0.005));this._updCam();},{passive:true});
    let ts=null;
    canvas.addEventListener('touchstart',e=>{if(e.touches.length===1)ts={x:e.touches[0].clientX,y:e.touches[0].clientY,t:this._cam.theta,p:this._cam.phi};});
    canvas.addEventListener('touchmove',e=>{
      if(!ts||e.touches.length!==1)return;
      this._cam.theta=ts.t-(e.touches[0].clientX-ts.x)*0.007;
      this._cam.phi=Math.max(0.05,Math.min(1.3,ts.p-(e.touches[0].clientY-ts.y)*0.005));
      this._updCam();},{passive:true});
  }

  _loadThree(){
    if(window.THREE){this._initThree();return;}
    if(!window._ppfdCBs){
      window._ppfdCBs=[];
      const s=document.createElement('script');s.src=_THREE_SRC;
      s.onload=()=>window._ppfdCBs.forEach(cb=>cb());
      document.head.appendChild(s);
    }
    window._ppfdCBs.push(()=>this._initThree());
  }

  _initThree(){
    const T=this._T=window.THREE;
    const canvas=this.shadowRoot.getElementById('c');
    const W=canvas.parentElement.offsetWidth||400,H=340;
    canvas.style.height=H+'px';
    const scene=this._scene=new T.Scene();scene.background=new T.Color(0x090c12);
    this._camera=new T.PerspectiveCamera(36,W/H,0.01,40);
    const renderer=this._renderer=new T.WebGLRenderer({canvas,antialias:true});
    renderer.setSize(W,H);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    scene.add(new T.AmbientLight(0x334455,1.1));
    const sun=new T.DirectionalLight(0xffffff,0.55);sun.position.set(2,5,3);scene.add(sun);
    this._update();this._updCam();
    const anim=()=>{this._raf=requestAnimationFrame(anim);renderer.render(scene,this._camera);};anim();
  }

  _updCam(){
    if(!this._camera)return;
    const{theta,phi,r}=this._cam,tH=this._s.tH;
    this._camera.position.set(r*Math.cos(phi)*Math.sin(theta),r*Math.sin(phi)+tH*0.38,r*Math.cos(phi)*Math.cos(theta));
    this._camera.lookAt(0,tH*0.3,0);
  }

  _rem(k){if(this._o[k]&&this._scene){this._scene.remove(this._o[k]);}this._o[k]=null;}

  _sprite(text,sz){
    const T=this._T,c=document.createElement('canvas');c.width=128;c.height=64;
    const ctx=c.getContext('2d');
    ctx.fillStyle='rgba(255,255,255,0.92)';ctx.font=`bold ${sz}px sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,64,32);
    return new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthTest:false}));
  }

  _update(){
    const T=this._T,scene=this._scene;if(!T||!scene)return;
    const{tW,tL,tH,lightKey,hin,plantIn,numPlants,dim,photo}=this._s;
    const light=_LIGHTS[lightKey];
    const effectiveH=Math.max(1,hin-plantIn);
    const ppfd=_getPPFD(light,effectiveH,dim);
    const pY=plantIn*0.0254,y=hin*0.0254;
    const hw=tW/2,hl=tL/2;

    // tent frame
    this._rem('fr');
    const fG=new T.Group();
    const cor=[[hw,0,hl],[hw,0,-hl],[-hw,0,-hl],[-hw,0,hl],[hw,tH,hl],[hw,tH,-hl],[-hw,tH,-hl],[-hw,tH,hl]];
    const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const lp=[];edges.forEach(([a,b])=>lp.push(...cor[a],...cor[b]));
    const fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
    fG.add(new T.LineSegments(fg,new T.LineBasicMaterial({color:0x3a5262})));
    const bx=new T.Mesh(new T.BoxGeometry(tW,tH,tL),new T.MeshStandardMaterial({color:0xbbbf9a,side:T.BackSide,transparent:true,opacity:0.055,roughness:1}));
    bx.position.set(0,tH/2,0);fG.add(bx);scene.add(fG);this._o['fr']=fG;

    // heat plane
    this._rem('ht');
    const hG=new T.Group();
    const maxV=Math.max(ppfd.center*1.05,700);
    const RX=30,RZ=30,verts=[],cols=[],idxs=[];
    const barW=light.lL/tW,barL=light.lW/tL;
    for(let zi=0;zi<=RZ;zi++)for(let xi=0;xi<=RX;xi++){
      const x=-hw+(xi/RX)*tW,z=-hl+(zi/RZ)*tL;
      const nx=(xi/RX-0.5)*2,nz=(zi/RZ-0.5)*2;
      let val;
      if(light.isBar){
        const dw=Math.max(0,Math.abs(nx)-barW*0.5)/(1-barW*0.5+0.01);
        const dl=Math.max(0,Math.abs(nz)-barL*0.5)/(1-barL*0.5+0.01);
        val=ppfd.edge+(ppfd.center-ppfd.edge)*Math.exp(-(dw*dw*3.8+dl*dl*9));
      }else{
        const d=Math.sqrt(nx*nx*0.7+nz*nz);
        val=ppfd.edge+(ppfd.center-ppfd.edge)*Math.exp(-d*d*2.6);
      }
      val=Math.max(0,val);verts.push(x,pY+0.004,z);
      const[r,g,b]=_ppfdColor(val,maxV);cols.push(r/255,g/255,b/255);
    }
    for(let zi=0;zi<RZ;zi++)for(let xi=0;xi<RX;xi++){const a=zi*(RX+1)+xi;idxs.push(a,a+(RX+1),a+1,a+1,a+(RX+1),a+(RX+1)+1);}
    const hgeo=new T.BufferGeometry();
    hgeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));
    hgeo.setAttribute('color',new T.Float32BufferAttribute(cols,3));
    hgeo.setIndex(idxs);hgeo.computeVertexNormals();
    hG.add(new T.Mesh(hgeo,new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide,transparent:true,opacity:0.90})));
    [[0,ppfd.center],[tW*0.36,ppfd.avg],[-tW*0.36,ppfd.avg]].forEach(([xo,val])=>{
      const sp=this._sprite(Math.round(val)+'',22);sp.position.set(xo,pY+0.065,0);sp.scale.set(0.25,0.12,1);hG.add(sp);
    });
    scene.add(hG);this._o['ht']=hG;

    // light fixture
    this._rem('li');
    const lG=new T.Group();
    const barMat=new T.MeshStandardMaterial({color:0x5a6e7d,metalness:0.55,roughness:0.45});
    if(light.isBar){
      const n=light.barCount;
      for(let i=0;i<n;i++){
        const xo=n===1?0:-light.lL/2+(light.lL/(n-1))*i;
        const bar=new T.Mesh(new T.BoxGeometry(0.026,0.013,light.lW),barMat);bar.position.set(xo,y,0);lG.add(bar);
        const led=new T.Mesh(new T.BoxGeometry(0.017,0.004,light.lW*0.9),new T.MeshBasicMaterial({color:0xfff8e0}));led.position.set(xo,y-0.006,0);lG.add(led);
      }
      [-light.lW/2,light.lW/2].forEach(z=>{
        const r=new T.Mesh(new T.BoxGeometry(light.lL,0.01,0.016),new T.MeshStandardMaterial({color:0x3d4f5c,metalness:0.4}));r.position.set(0,y,z);lG.add(r);
      });
    }else{
      const panel=new T.Mesh(new T.BoxGeometry(light.lL,0.02,light.lW),new T.MeshStandardMaterial({color:0x4a5d6b,metalness:0.4,roughness:0.6}));
      panel.position.set(0,y,0);lG.add(panel);
      const ledMat=new T.MeshBasicMaterial({color:0xfff8e0});
      for(let r=0;r<4;r++)for(let c=0;c<8;c++){
        const led=new T.Mesh(new T.CircleGeometry(0.013,8),ledMat);led.rotation.x=-Math.PI/2;
        led.position.set(-light.lL/2+(c+0.5)*(light.lL/8),y-0.009,-light.lW/2+(r+0.5)*(light.lW/4));lG.add(led);
      }
    }
    // hanging ropes to ceiling
    const ropeY=Math.min(tH-0.02,y+0.05);
    if(ropeY>y+0.04){
      const ropeMat=new T.LineBasicMaterial({color:0x888888,transparent:true,opacity:0.5});
      [-light.lL/2+0.04,light.lL/2-0.04].forEach(rx=>{
        const rg=new T.BufferGeometry().setFromPoints([new T.Vector3(rx,ropeY,0),new T.Vector3(rx,y,0)]);
        lG.add(new T.Line(rg,ropeMat));
      });
    }
    const glow=new T.PointLight(0xffeeaa,0.8,2.2);glow.position.set(0,y,0);lG.add(glow);
    scene.add(lG);this._o['li']=lG;

    // light cone
    this._rem('bm');
    if(y>pY+0.01){
      const bG=new T.Group();
      const op=Math.min(0.28,0.07+ppfd.center/6000);
      const lmat=new T.LineBasicMaterial({color:0xffdd55,transparent:true,opacity:op});
      const hw2=light.lL*0.38,hl2=light.lW*0.38;
      [[-hw2,-hl2],[hw2,-hl2],[hw2,hl2],[-hw2,hl2]].forEach(([bx2,bz2])=>{
        const ex=Math.sign(bx2)*tW/2*0.88,ez=Math.sign(bz2)*tL/2*0.88;
        const geo=new T.BufferGeometry().setFromPoints([new T.Vector3(bx2,y,bz2),new T.Vector3(ex,pY+0.005,ez)]);
        bG.add(new T.Line(geo,lmat));
      });
      const vg=new T.BufferGeometry().setFromPoints([new T.Vector3(0,y+0.005,0),new T.Vector3(0,pY+0.005,0)]);
      bG.add(new T.Line(vg,new T.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.2})));
      scene.add(bG);this._o['bm']=bG;
    }

    // plants along Z axis
    this._rem('pl');
    const pG=new T.Group();
    const pH=plantIn*0.0254,potH=Math.min(0.25,pH*0.35+0.08),potR=0.075;
    const potMat=new T.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9});
    const stemMat=new T.MeshStandardMaterial({color:0x3d6b28,roughness:0.8});
    const leafMat=new T.MeshStandardMaterial({color:0x2e7d1e,roughness:0.85,side:T.DoubleSide});
    const spacing=tL/(numPlants+1);
    for(let i=0;i<numPlants;i++){
      const pz=-tL/2+spacing*(i+1);
      const pot=new T.Mesh(new T.CylinderGeometry(potR*0.85,potR,potH,12),potMat);
      pot.position.set(0,potH/2,pz);pG.add(pot);
      const stemH=Math.max(0.01,pH-potH);
      if(stemH>0.015){
        const stem=new T.Mesh(new T.CylinderGeometry(0.011,0.015,stemH,8),stemMat);
        stem.position.set(0,potH+stemH/2,pz);pG.add(stem);
        const lvls=Math.max(1,Math.floor(stemH/0.09));
        for(let lv=0;lv<lvls;lv++){
          const ly=potH+stemH*(0.35+lv*0.55/Math.max(1,lvls-1));
          const lr=Math.min(0.11,0.055+stemH*0.16);
          for(let a=0;a<3;a++){
            const ang=a*(Math.PI*2/3)+lv*1.1;
            const leaf=new T.Mesh(new T.SphereGeometry(lr,6,4),leafMat);
            leaf.scale.set(1,0.2,0.5);
            leaf.position.set(Math.cos(ang)*lr*0.6,ly,pz+Math.sin(ang)*lr*0.6);
            pG.add(leaf);
          }
        }
      }
    }
    scene.add(pG);this._o['pl']=pG;

    // height indicator
    this._rem('hl');
    if(y>pY+0.01){
      const hG2=new T.Group();
      const lx=-tW/2-0.07;
      const mat=new T.LineDashedMaterial({color:0xffffff,transparent:true,opacity:0.45,dashSize:0.04,gapSize:0.03});
      const geo=new T.BufferGeometry().setFromPoints([new T.Vector3(lx,y,0),new T.Vector3(lx,pY,0)]);
      const dl=new T.Line(geo,mat);dl.computeLineDistances();hG2.add(dl);
      const sp=this._sprite(Math.round(hin-plantIn)+'"',28);sp.position.set(lx-0.11,(y+pY)/2,0);sp.scale.set(0.24,0.12,1);hG2.add(sp);
      const arrMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.5});
      const au=new T.Mesh(new T.ConeGeometry(0.013,0.035,8),arrMat);au.position.set(lx,y-0.02,0);hG2.add(au);
      const ad=new T.Mesh(new T.ConeGeometry(0.013,0.035,8),arrMat);ad.rotation.z=Math.PI;ad.position.set(lx,pY+0.02,0);hG2.add(ad);
      scene.add(hG2);this._o['hl']=hG2;
    }

    // stats
    const dli=((ppfd.avg*photo*3600)/1e6).toFixed(1);
    const zone=_zoneInfo(ppfd.avg);
    const tWft=(tW/0.3048).toFixed(1),tLft=(tL/0.3048).toFixed(1),tHft=(tH/0.3048).toFixed(1);
    const sub=this.shadowRoot.getElementById('sub');
    if(sub)sub.textContent=`${light.name} · ${tWft}×${tLft}×${tHft} ft · ${numPlants} plant${numPlants>1?'s':''}`;
    const statsEl=this.shadowRoot.getElementById('stats');
    if(statsEl)statsEl.innerHTML=`
      <div class="stat"><div class="sl">Center PPFD</div><div class="sv">${ppfd.center.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">Avg canopy</div><div class="sv">${ppfd.avg.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">Edge PPFD</div><div class="sv">${ppfd.edge.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">DLI @ ${photo}h</div><div class="sv">${dli}<span class="su"> mol/m²/d</span></div></div>`;
    const zoneEl=this.shadowRoot.getElementById('zone');
    if(zoneEl)zoneEl.innerHTML=`<span class="zbadge" style="background:${zone.color}22;color:${zone.color};border:1px solid ${zone.color}44">${zone.label}</span>${effectiveH}" light-to-canopy · ${dim}% power`;
    this._updCam();
  }

  disconnectedCallback(){
    if(this._raf)cancelAnimationFrame(this._raf);
    if(this._renderer)this._renderer.dispose();
  }
}

customElements.define('ppfd-3d-card',PPFD3DCard);
window.customCards=window.customCards||[];
if(!window.customCards.find(c=>c.type==='ppfd-3d-card')){
  window.customCards.push({type:'ppfd-3d-card',name:'PPFD 3D Grow Light Card',
    description:'3D PPFD visualizer for Spider Farmer SE4500 & SF2000.',preview:true});
}
