/**
 * PPFD 3D Grow Light Lovelace Card  v4.2
 * Spider Farmer SE4500 / SE5000 / SF2000 / SF7000 / G1000W
 *
 * Install: /config/www/ppfd-3d-card.js
 * Resource: /local/ppfd-3d-card.js?v=5
 *
 * type: custom:ppfd-3d-card
 * title: Flower tent
 * light_model: SE4500
 * unit_system: auto      # auto (follow HA) | metric | imperial
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
  },
  // Below: PPFD tables derived from Spider Farmer's published PPFD maps (100%
  // dimming). center = geometric-center reading, avg = whole-canopy mean, edge =
  // perimeter-ring mean. Measured heights are exact; other heights are modeled
  // (center/avg inverse-square, edge as a height-dependent fraction of avg).
  SE5000: {
    name:'SE5000', watts:480, isBar:true, barCount:4, lW:0.855, lL:0.85,
    // measured 10" & 12" in a 4x4 ft tent
    ppfd:{
       8:{c:1561,a:1101,e:597}, 10:{c:1478,a:1041,e:631}, 12:{c:1402,a:986,e:661},
      14:{c:1332,a:935,e:686},  16:{c:1267,a:889,e:708},  18:{c:1206,a:845,e:727},
      20:{c:1150,a:805,e:744},  22:{c:1098,a:767,e:752},  24:{c:1049,a:732,e:718},
      26:{c:1003,a:700,e:686},  28:{c:960,a:669,e:656},   30:{c:920,a:640,e:628},
      32:{c:883,a:614,e:601},   36:{c:814,a:565,e:554},   42:{c:725,a:502,e:492},
      48:{c:650,a:449,e:440},   60:{c:531,a:366,e:358},   72:{c:442,a:303,e:297},
      84:{c:373,a:256,e:251},
    }
  },
  SF7000: {
    name:'SF7000', watts:650, isBar:false, barCount:0, lW:0.737, lL:0.558,
    // measured 12"/18"/24" in a 5x5 ft tent
    ppfd:{
       8:{c:2560,a:1105,e:314}, 10:{c:2298,a:1052,e:359}, 12:{c:2053,a:983,e:394},
      14:{c:1881,a:955,e:434},  16:{c:1714,a:912,e:465},  18:{c:1597,a:903,e:506},
      20:{c:1441,a:833,e:520},  22:{c:1328,a:798,e:543},  24:{c:1218,a:752,e:556},
      26:{c:1138,a:734,e:582},  28:{c:1059,a:704,e:598},  30:{c:987,a:677,e:613},
      32:{c:922,a:651,e:626},   36:{c:811,a:603,e:591},   42:{c:678,a:541,e:530},
      48:{c:575,a:488,e:478},   60:{c:429,a:403,e:395},   72:{c:332,a:332,e:325},
      84:{c:265,a:265,e:259},
    }
  },
  G1000W: {
    name:'G1000W', watts:1000, isBar:true, barCount:8, lW:1.153, lL:1.122,
    // measured 12" & 16" in a 4x4 ft tent
    ppfd:{
       8:{c:2156,a:1822,e:1555}, 10:{c:2068,a:1769,e:1527}, 12:{c:1985,a:1720,e:1501},
      14:{c:1908,a:1672,e:1476}, 16:{c:1834,a:1626,e:1451}, 18:{c:1765,a:1582,e:1427},
      20:{c:1700,a:1540,e:1404}, 22:{c:1638,a:1499,e:1382}, 24:{c:1580,a:1460,e:1360},
      26:{c:1524,a:1422,e:1339}, 28:{c:1472,a:1386,e:1319}, 30:{c:1422,a:1352,e:1299},
      32:{c:1375,a:1318,e:1280}, 36:{c:1287,a:1255,e:1230}, 42:{c:1170,a:1168,e:1145},
      48:{c:1068,a:1068,e:1047}, 60:{c:901,a:901,e:883},    72:{c:770,a:770,e:755},
      84:{c:666,a:666,e:653},
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
    this._s={tW:0.61,tL:1.22,tH:1.981,lightKey:'SE4500',hin:18,plantIn:12,numPlants:2,dim:100,photo:18,metric:false};
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
    this._s.metric = this._resolveMetric();
    if(!this.shadowRoot.querySelector('#w')) this._buildDOM();
  }

  // Resolve the display unit system. Config `unit_system` wins (metric|imperial);
  // otherwise (auto/unset) follow the HA instance's configured length unit.
  _resolveMetric(){
    const u=(this._cfg.unit_system||'auto').toLowerCase();
    if(u==='metric')   return true;
    if(u==='imperial') return false;
    const us=this._hass&&this._hass.config&&this._hass.config.unit_system;
    if(us&&us.length) return us.length!=='mi';   // metric length unit -> km
    return false;
  }
  _fmtSmall(inches){                     // light/plant heights
    return this._s.metric ? `${Math.round(inches*2.54)} cm` : `${Math.round(inches)}"`;
  }
  _fmtTentDim(feet){                     // one tent dimension, no unit suffix
    return this._s.metric ? (feet*0.3048).toFixed(2) : (+feet).toFixed(1);
  }
  _tentUnit(){ return this._s.metric ? 'm' : 'ft'; }

  set hass(hass){
    this._hass=hass;
    const m=this._resolveMetric();
    if(m!==this._s.metric){this._s.metric=m;this._applyUnits();if(this._scene)this._update();}
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

  // No getConfigElement: a visual editor element was never shipped, so returning
  // one here made the card's "Edit" pane error. Fall back to HA's YAML editor.
  static getStubConfig(){
    return{type:'custom:ppfd-3d-card',title:'PPFD Visualizer',light_model:'SE4500',unit_system:'auto',
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
          <option value="SE5000">SE5000 480W</option>
          <option value="SF2000">SF2000 200W</option>
          <option value="SF7000">SF7000 650W</option>
          <option value="G1000W">G1000W 1000W</option>
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
          <div class="cg"><span class="cl" id="tl-w">Width (ft)</span><input type="number" id="t-w" value="2" min="1" max="10" step="0.5"></div>
          <div class="cg"><span class="cl" id="tl-l">Length (ft)</span><input type="number" id="t-l" value="4" min="1" max="12" step="0.5"></div>
          <div class="cg"><span class="cl" id="tl-h">Height (ft)</span><input type="number" id="t-h" value="6.5" min="3" max="12" step="0.5"></div>
        </div>
      </div>
    </div>`;
    this._applyUnits();
    this._loadThree();
    this._attachEvents();
  }

  _syncLightMax(){this._syncSliderMaxes();}
  _syncSliderMaxes(){
    const sr=this.shadowRoot;
    const tentHIn=Math.round(this._s.tH/0.0254);   // internal metres -> inches (unit-agnostic)
    const slHt=sr.getElementById('sl-ht');
    if(slHt){
      slHt.max=tentHIn;
      if(+slHt.value>tentHIn){
        slHt.value=tentHIn;this._s.hin=tentHIn;
        const lbl=sr.getElementById('l-ht');if(lbl)lbl.textContent=this._fmtSmall(tentHIn);
      }
    }
    const slPt=sr.getElementById('sl-pt');
    if(slPt){
      slPt.max=tentHIn;
      if(+slPt.value>tentHIn){
        slPt.value=tentHIn;this._s.plantIn=tentHIn;
        const lbl=sr.getElementById('l-pt');if(lbl)lbl.textContent=this._fmtSmall(tentHIn);
      }
    }
  }

  _syncSliders(){
    const sr=this.shadowRoot,s=this._s;
    const sv=(id,v)=>{const e=sr.getElementById(id);if(e)e.value=v;};
    const st=(id,v)=>{const e=sr.getElementById(id);if(e)e.textContent=v;};
    sv('sel',s.lightKey);
    sv('sl-ht',s.hin);       st('l-ht',this._fmtSmall(s.hin));
    sv('sl-pt',s.plantIn);   st('l-pt',this._fmtSmall(s.plantIn));
    sv('sl-np',s.numPlants); st('l-np',s.numPlants);
    sv('sl-dim',s.dim);      st('l-dim',s.dim+'%');
    sv('sl-pp',s.photo);     st('l-pp',s.photo+'h');
    sv('t-w',this._fmtTentDim(s.tW/0.3048));
    sv('t-l',this._fmtTentDim(s.tL/0.3048));
    sv('t-h',this._fmtTentDim(s.tH/0.3048));
    this._syncSliderMaxes();
  }

  // Update the unit-dependent bits of the UI (tent input labels + ranges) and
  // re-sync values. Called after DOM build and whenever the unit system flips.
  _applyUnits(){
    const sr=this.shadowRoot,m=this._s.metric,u=this._tentUnit();
    const setLbl=(id,txt)=>{const e=sr.getElementById(id);if(e)e.textContent=txt;};
    setLbl('tl-w',`Width (${u})`);setLbl('tl-l',`Length (${u})`);setLbl('tl-h',`Height (${u})`);
    // number-input ranges: metric metres vs imperial feet
    const rng=(id,mnFt,mxFt)=>{const e=sr.getElementById(id);if(!e)return;
      e.min=m?(mnFt*0.3048).toFixed(1):mnFt; e.max=m?(mxFt*0.3048).toFixed(1):mxFt; e.step=m?0.1:0.5;};
    rng('t-w',1,10);rng('t-l',1,12);rng('t-h',3,12);
    this._syncSliders();
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
      const mult=this._s.metric?1:0.3048;   // tent inputs are metres (metric) or feet
      const gtd=(id,defM)=>{const v=+sr.getElementById(id).value;return isNaN(v)?defM:v*mult;};
      this._s.tW=Math.max(0.3,gtd('t-w',0.61));
      this._s.tL=Math.max(0.6,gtd('t-l',1.22));
      this._s.tH=Math.max(0.9,gtd('t-h',1.98));
      const stx=(id,txt)=>{const e=sr.getElementById(id);if(e)e.textContent=txt;};
      stx('l-ht',this._fmtSmall(this._s.hin));stx('l-pt',this._fmtSmall(this._s.plantIn));
      stx('l-np',''+this._s.numPlants);stx('l-dim',this._s.dim+'%');stx('l-pp',this._s.photo+'h');
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
      const sp=this._sprite(this._fmtSmall(hin-plantIn),28);sp.position.set(lx-0.11,(y+pY)/2,0);sp.scale.set(0.24,0.12,1);hG2.add(sp);
      const arrMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.5});
      const au=new T.Mesh(new T.ConeGeometry(0.013,0.035,8),arrMat);au.position.set(lx,y-0.02,0);hG2.add(au);
      const ad=new T.Mesh(new T.ConeGeometry(0.013,0.035,8),arrMat);ad.rotation.z=Math.PI;ad.position.set(lx,pY+0.02,0);hG2.add(ad);
      scene.add(hG2);this._o['hl']=hG2;
    }

    // stats
    const dli=((ppfd.avg*photo*3600)/1e6).toFixed(1);
    const zone=_zoneInfo(ppfd.avg);
    const td=v=>this._fmtTentDim(v/0.3048);
    const sub=this.shadowRoot.getElementById('sub');
    if(sub)sub.textContent=`${light.name} · ${td(tW)}×${td(tL)}×${td(tH)} ${this._tentUnit()} · ${numPlants} plant${numPlants>1?'s':''}`;
    const statsEl=this.shadowRoot.getElementById('stats');
    if(statsEl)statsEl.innerHTML=`
      <div class="stat"><div class="sl">Center PPFD</div><div class="sv">${ppfd.center.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">Avg canopy</div><div class="sv">${ppfd.avg.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">Edge PPFD</div><div class="sv">${ppfd.edge.toLocaleString()}<span class="su"> μmol/m²/s</span></div></div>
      <div class="stat"><div class="sl">DLI @ ${photo}h</div><div class="sv">${dli}<span class="su"> mol/m²/d</span></div></div>`;
    const zoneEl=this.shadowRoot.getElementById('zone');
    if(zoneEl)zoneEl.innerHTML=`<span class="zbadge" style="background:${zone.color}22;color:${zone.color};border:1px solid ${zone.color}44">${zone.label}</span>${this._fmtSmall(effectiveH)} light-to-canopy · ${dim}% power`;
    this._updCam();
  }

  disconnectedCallback(){
    if(this._raf)cancelAnimationFrame(this._raf);
    if(this._renderer)this._renderer.dispose();
  }
}

// Register the element. Do NOT gate on customElements.get() first: on some hard
// refreshes that guard misfired (the tag read as "taken" while it was actually
// free) and the define was silently skipped, so the card rendered as a
// "Configuration error" until the next refresh. Instead attempt the define
// directly, swallow the harmless "already defined" if another load beat us, and
// self-heal on the off chance it still didn't take.
function _defPPFD(){
  // Attempt the define unconditionally — never gate on customElements.get(),
  // which is exactly what misfired. If the name is free it registers; if another
  // load already registered it, define throws "already defined" and we swallow it.
  try{ customElements.define('ppfd-3d-card',PPFD3DCard); }catch(e){}
  return !!customElements.get('ppfd-3d-card');
}
if(!_defPPFD()){
  let _n=0; const _iv=setInterval(()=>{ if(_defPPFD()||++_n>40) clearInterval(_iv); },50);
}
window.customCards=window.customCards||[];
if(!window.customCards.find(c=>c.type==='ppfd-3d-card')){
  window.customCards.push({type:'ppfd-3d-card',name:'PPFD 3D Grow Light Card',
    description:'3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W.',preview:true});
}
