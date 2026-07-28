/*! spider-farmer-card v0.17.23 | MIT */
function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,m=g?g.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[b("elementProperties")]=new Map,y[b("finalized")]=new Map,v?.({ReactiveElement:y}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,k=w.trustedTypes,O=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,R="?"+C,E=`<${R}>`,M=document,D=()=>M.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,T="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,B=/>/g,F=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,U=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=U(1),V=U(2),G=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),J=new WeakMap,K=M.createTreeWalker(M,129);function Z(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==O?O.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===z?"!--"===l[1]?n=I:void 0!==l[1]?n=B:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=F):void 0!==l[3]&&(n=F):n===F?">"===l[0]?(n=o??z,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?F:'"'===l[3]?L:H):n===L||n===H?n=F:n===I||n===B?n=z:(n=F,o=void 0);const p=n===F&&t[e+1].startsWith("/>")?" ":"";r+=n===z?s+E:c>=0?(i.push(a),s.slice(0,c)+A+s.slice(c)+C+p):s+C+(-2===c?e:p)}return[Z(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=X(t,e);if(this.el=Y.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(A)){const e=c[r++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?it:"?"===n[1]?ot:"@"===n[1]?rt:st}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],D()),K.nextNode(),a.push({type:2,index:++o});i.append(t[e],D())}}}else if(8===i.nodeType)if(i.data===R)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===G)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=N(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);K.currentNode=i;let o=K.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=K.nextNode(),r++)}return K.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Y(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(D()),this.O(D()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!N(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,i[s+n],e,n),a===G&&(a=this._$AH[n]),r||=!N(a)||a!==this._$AH[n],a===q?t=q:t!==q&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class rt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===G)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Y,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(D(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},ht=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,s)=>"object"==typeof s?ht(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ft(t){return ut({...t,state:!0,attribute:!1})}const gt="#ff7a1a",mt=["S","M","T","W","T","F","S"],vt=/^sf_(dp\d+|ac5|ac10)_/;function bt(t){return t.split(".")[1]??""}function _t(t,e,s,i){const o=i*Math.PI/180;return[t+s*Math.cos(o),e+s*Math.sin(o)]}function $t(t,e,s,i,o){const r=135+270*i,n=135+270*o,[a,l]=_t(t,e,s,r),[c,d]=_t(t,e,s,n),p=n-r>180?1:0;return`M ${a.toFixed(2)} ${l.toFixed(2)} A ${s} ${s} 0 ${p} 1 ${c.toFixed(2)} ${d.toFixed(2)}`}function xt(t){const e=String(t),s=e.indexOf(".");return s>=0?e.length-s-1:0}function yt(t){const e=t.currentTarget,s=e.parentElement?.querySelector(".sl-bub");if(!s)return;const i=Number(e.min||"0"),o=Number(e.max||"100"),r=Number(e.value),n=o>i?(r-i)/(o-i):0,a=xt(Number(e.step||"1")),l=Number.isFinite(r)?r.toFixed(a):e.value;s.textContent="1"===e.dataset.off&&r<=i?"off":`${l}${e.dataset.unit??""}`,s.style.left=`calc(${n} * (100% - 18px) + 9px)`}const wt=n`
  .sl-live {
    position: relative; flex: 1 1 auto; min-width: 0;
    display: flex; align-items: center;
  }
  .sl-live > input[type="range"] { flex: 1; min-width: 0; width: 100%; }
  .sl-bub {
    position: absolute; bottom: calc(100% + 6px); transform: translateX(-50%);
    padding: 1px 7px; border-radius: 8px; font-size: 12px; font-weight: 600;
    line-height: 1.5; white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 0.1s ease;
    background: var(--primary-color, #3391ff);
    color: var(--text-primary-color, #fff);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); z-index: 3;
  }
  .sl-live > input[type="range"]:active ~ .sl-bub,
  .sl-live > input[type="range"]:focus-visible ~ .sl-bub { opacity: 1; }
`;function St(t){const e=new Set;for(const s of Object.keys(t.states)){const t=bt(s).match(vt);t&&e.add(t[1])}return[...e].sort()}function kt(t){return St(t).filter(e=>Object.keys(t.states).some(t=>{const s=bt(t);return s===`sf_${e}_temperature`||s===`sf_${e}_soil_avg_temperature`||s===`sf_${e}_light_1`||s===`sf_${e}_fan`||s===`sf_${e}_blower`}))}function Ot(t,e){const s=`sf_${e}_`,i=Object.keys(t.states);return i.find(t=>bt(t)===`sf_${e}_temperature`)??i.find(t=>{const i=bt(t);return i.startsWith(s)&&!i.startsWith(`sf_${e}_env_`)})}function At(t,e){const s=Ot(t,e);return s?t.entities?.[s]?.device_id:void 0}function Ct(t,e){if(!e)return[];const s=At(t,e);return function(t){return St(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}(t).filter(i=>{if(i===e)return!0;if(!s)return!1;const o=At(t,i),r=o?t.devices?.[o]:void 0;return r?.via_device_id===s})}function Rt(t,e){if(!t||!e)return"";const s=Ot(t,e);if(!s)return"";const i=t.entities?.[s]?.device_id,o=i?t.devices?.[i]:void 0;if(o)return o.name_by_user||o.name||"";const r=(t.states[s].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return r?r[1]:""}const Et=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","VPD","mdi:water-opacity"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Mt={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},Dt="#ff6b6b",Nt="rgba(255,107,107,0.16)",Pt=t=>"string"==typeof t&&/^#[0-9a-fA-F]{6}$/.test(t),Tt=t=>!!t&&("unavailable"===t.state||"unknown"===t.state),zt=t=>{const e=(t||"").match(/^(\d{1,2}):(\d{2})$/);if(!e)return null;const s=+e[1],i=+e[2];return s<=23&&i<=59?60*s+i:null},It=(t,e,s,i,o="")=>W`<div class="save-bar ${o}">
  ${((t,e,s,i)=>W`
  <button class="save-btn" ?disabled=${!e}
    style=${e?`background:${t}`:""}
    @click=${s}>Apply</button>
  <button class="discard-btn" ?disabled=${!e}
    @click=${i}>Discard</button>`)(t,e,s,i)}
</div>`,Bt=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],Ft=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],Ht=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],Lt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class jt extends ct{constructor(){super(...arguments),this.tab="overview",this.colorMode="off",this.colHi=Dt,this.colLo="#45b6ff",this.colorModeIn="off",this.colIn="#4caf7d",this._colorSynced=!1,this.colorDraft=null,this.alertsDraft=null,this.soilOpen=null,this.soilAllOpen=!1,this.deviceOpen=null,this.outletOpen=null,this.draft={},this.modePick={},this.outletDraft={},this.logDate=null,this.logDev="all",this.logType="all"}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"calibration"===e||"cali"===e?"cali":"alerts"===e?"alerts":"log"===e?"log":"overview";const s=t.alarm_colors;let i="tile"===s||"text"===s?s:"off";try{const e=localStorage.getItem(`sf-colors-${t.panel}`);if("off"===e||"tile"===e||"text"===e)i=e;else if(e){const t=JSON.parse(e);"off"!==t.mode&&"tile"!==t.mode&&"text"!==t.mode||(i=t.mode),"off"!==t.modeIn&&"tile"!==t.modeIn&&"text"!==t.modeIn||(this.colorModeIn=t.modeIn),Pt(t.hi)&&(this.colHi=t.hi),Pt(t.lo)&&(this.colLo=t.lo),Pt(t.in)&&(this.colIn=t.in)}}catch{}this.colorMode=i,this._colorSynced=!1}serverColors(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;if(!t)return{};const e=t=>"off"===t||"tile"===t||"text"===t,s={};return t.colors&&e(t.colors)&&(s.mode=t.colors),t.colors_in&&e(t.colors_in)&&(s.modeIn=t.colors_in),Pt(t.color_hi)&&(s.hi=t.color_hi),Pt(t.color_lo)&&(s.lo=t.color_lo),Pt(t.color_in)&&(s.in=t.color_in),s}persistColorOption(t,e){const s=`sensor.sf_${this.config.panel}_alarm_settings`;this.get(s)&&this.hass?.callService("sf","set_card_option",{entity_id:s,key:t,value:e})}cacheColors(){try{localStorage.setItem(`sf-colors-${this.config.panel}`,JSON.stringify({mode:this.colorMode,modeIn:this.colorModeIn,hi:this.colHi,lo:this.colLo,in:this.colIn}))}catch{}}outOfRange(t,e){const s=this.alertsSettings();if(!s||!Number.isFinite(e))return null;const i=[...s.climate||[],...s.substrate||[]].find(e=>e&&e.key===t);if(!i||!i.enabled)return null;const o=Number(i.max),r=Number(i.min);return Number.isFinite(o)&&e>o?"above":Number.isFinite(r)&&e<r?"below":null}readingColor(t,e){const s=parseFloat(e);if(!Number.isFinite(s))return null;const i=t?this.outOfRange(t,s):null;return"above"===i?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colHi,state:"above"}:"below"===i?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colLo,state:"below"}:"off"===this.colorModeIn?null:{mode:this.colorModeIn,color:this.colIn,state:"in"}}soilCellStyle(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);if(!s||Tt(s))return"";const i="temperature"===e?"tempSoil":"moisture"===e?"humiSoil":"ECSoil",o=this.readingColor(i,s.state);return o?`color:${o.color}`:""}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?kt(t):[])[0]||"dp1",s=t?Ct(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...s.length?{outlets:s}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||gt}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")||t.has("outletDraft")||t.has("alertsDraft")||t.has("deviceOpen")||t.has("outletOpen")||t.has("draft")||t.has("modePick")||t.has("logDate")||t.has("logDev")||t.has("logType")||t.has("colorMode")||t.has("colorModeIn")||t.has("colHi")||t.has("colLo")||t.has("colIn")||t.has("colorDraft")}willUpdate(t){if(!this._colorSynced){const t=this.serverColors();Object.keys(t).length&&(t.mode&&(this.colorMode=t.mode),t.modeIn&&(this.colorModeIn=t.modeIn),t.hi&&(this.colHi=t.hi),t.lo&&(this.colLo=t.lo),t.in&&(this.colIn=t.in),this._colorSynced=!0,this.cacheColors())}if(t.has("hass")&&Object.keys(this.modePick).length){let t=null;for(const[e,s]of Object.entries(this.modePick))this.get(e)?.state===s&&(t=t??{...this.modePick},delete t[e]);t&&(this.modePick=t)}}renderParam([t,e,s]){const i=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!i)return q;const o=i.attributes.unit_of_measurement||"",r=t.startsWith("soil_avg_")&&Tt(i),n=r?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,a=t.startsWith("soil_avg_")?t.slice(9):null,l=!!a&&this.soilProbeRows(a).length>1,c=l&&this.soilOpen===a,d=r?null:this.readingColor(Mt[t],i.state);let p=c?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",h="";return r?(p=`background:${Nt};box-shadow:inset 0 0 0 1px ${Dt}`,h=`color:${Dt}`):d&&"text"===d.mode?h=`color:${d.color}`:d&&"tile"===d.mode&&(p=`background:${((t,e=.16)=>{const s=/^#?([0-9a-fA-F]{6})$/.exec((t||"").trim());if(!s)return`rgba(255,107,107,${e})`;const i=parseInt(s[1],16);return`rgba(${i>>16&255},${i>>8&255},${255&i},${e})`})(d.color)};box-shadow:inset 0 0 0 1px ${d.color}`),W`
      <div class="tile ${l?"clickable":""} ${c?"active":""}"
        style=${p||q}
        role=${l?"button":q}
        @click=${l?()=>this.soilOpen=c?null:a:void 0}>
        <div class="tile-label">
          ${e}${l?W`<ha-icon class="tile-more"
                icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:q}
        </div>
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${h||q}>${n}${r?q:W`<span class="unit">${o}</span>`}</div>
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),s=[];for(const i of Object.keys(this.hass?.states??{})){const o=bt(i).match(e);o&&s.push({slot:o[1],name:this.soilSensorName(i,t),e:this.hass.states[i]})}return s.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),s.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let s=this.hass?.states[t]?.attributes.friendly_name??"";const i=Rt(this.hass,this.config.panel);i&&s.startsWith(i)&&(s=s.slice(i.length).trim());const o="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return s=s.replace(new RegExp(`\\s*${o}\\s*$`,"i"),"").trim(),s||bt(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return q;const e=this.soilProbeRows(t);if(!e.length)return q;return W`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:e,e:s})=>{const i=Tt(s),o=s.attributes.unit_of_measurement||"",r=this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(o,"").trim():s.state,n="temperature"===t?"tempSoil":"moisture"===t?"humiSoil":"ECSoil",a=i?null:this.readingColor(n,s.state);return W`
            <div class="soil-pop-row ${i?"offline":""}">
              <span class="spn">${e}</span>
              <span class="spv" style=${a?`color:${a.color}`:q}>${i?W`Offline`:W`${r}<span class="unit">${o}</span>`}</span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}probeOffline(t){const e=this.get(`sensor.sf_${this.config.panel}_${t}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${t}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${t}_ec`);return Tt(e)}soilCellValue(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return s&&"unknown"!==s.state&&"unavailable"!==s.state?this.hass?.formatEntityState?this.hass.formatEntityState(s):`${s.state}${s.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const s=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[s])return this.soilSensorName(s,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const t=this.soilProbeSlots();if(t.length<2)return q;const e=this.soilAllOpen,s=this.accent(),i=t.filter(t=>this.probeOffline(t)).length,o=i?`background:${Nt};box-shadow:inset 0 0 0 1px ${Dt}`:e?`box-shadow:inset 0 0 0 1px ${s}`:"",r=i?`${i} offline`:`${t.length} probes`;return W`
      <div class="tile clickable ${e?"active":""}" style=${o||q}
        role="button" aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${i?Dt:s}"></ha-icon>
        <div class="tile-val" style=${i?`color:${Dt}`:q}>${r}</div>
      </div>`}renderSoilAllTable(){const t=this.soilProbeSlots();return t.length<2||!this.soilAllOpen?q:W`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">Probe</span>
          <span class="sa-v">Temp</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${t.map(t=>W`
            <div class="soil-all-row ${this.probeOffline(t)?"offline":""}">
              <span class="sa-name">${this.probeNameForSlot(t)}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"temperature")||q}>${this.soilCellValue(t,"temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"moisture")||q}>${this.soilCellValue(t,"moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"ec")||q}>${this.soilCellValue(t,"ec")}</span>
            </div>`)}
      </div>`}overviewDevices(){const t=[],e=(e,s)=>{for(const[i,o,r]of s){const s=this.eid(e,i);this.get(s)&&t.push({domain:e,suffix:i,id:s,label:o,icon:r})}};return e("light",Bt),e("fan",Ft),e("switch",Ht),t}deviceStateText(t,e){if("unavailable"===e.state||"unknown"===e.state)return"Offline";if("light"===t)return"on"!==e.state?"Off":`${Math.round((e.attributes.brightness??0)/255*100)}%`;if("fan"===t){if("on"!==e.state)return"Off";const t=Math.round(e.attributes.percentage??0);return t?`${t}%`:"On"}return"on"===e.state?"On":"Off"}deviceFault(t){const e=this.config.panel,s=t=>this.get(`sensor.sf_${e}_${t}`)?.state;return"humidifier"===t&&"Empty"===s("humidifier_tank")?"EMPTY":"dehumidifier"===t&&"Full"===s("dehumidifier_tank")?"FULL":"heater"===t&&"Alarm"===s("heater_status")?"Alarm":null}deviceTile(t){const e=this.get(t.id);if(!e)return q;const s="on"===e.state,i=`${t.domain}:${t.suffix}`,o=this.deviceOpen===i,r=this.accent(),n=this.deviceFault(t.suffix),a=n?Dt:s?r:"var(--secondary-text-color)";return W`
      <div class="tile clickable ${o?"active":""}"
        style=${(n?`background:${Nt};box-shadow:inset 0 0 0 1px ${Dt}`:o?`box-shadow:inset 0 0 0 1px ${r}`:"")||q}
        role="button" aria-expanded=${o?"true":"false"}
        @click=${()=>this.toggleDevice(o?null:i)}>
        <div class="tile-label">${t.label}
          <ha-icon class="tile-more"
            icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon=${t.icon} style="color:${a}"></ha-icon>
        <div class="tile-val" style=${n?`color:${Dt}`:s?`color:${r}`:""}>
          ${n??this.deviceStateText(t.domain,e)}
        </div>
      </div>`}relatedControls(t,e){const s=this.config.panel,i=new RegExp(`^(number|select|switch|text)\\.sf_${s}_${t}(_|$)`),o=`switch.sf_${s}_${t}`,r=`number.sf_${s}_${t}_speed`,n=Rt(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(t=>i.test(t)&&t!==o&&!("fan"===e&&t===r)).sort().map(t=>{let e=this.hass?.states[t]?.attributes.friendly_name??"";return n&&e.startsWith(n)&&(e=e.slice(n.length).trim()),this.ctlRow(e||t,t)})}renderDevicePop(){const t=this.deviceOpen;if(!t)return q;const e=this.overviewDevices().find(e=>`${e.domain}:${e.suffix}`===t);if(!e)return q;const s=this.get(e.id);if(!s)return q;const i="light"===e.domain?this.renderLightBody(e,s):"fan"===e.suffix?this.renderFanBody(e,s):"blower"===e.suffix?this.renderBlowerBody(e,s):"heater"===e.suffix?this.renderHeaterBody(e,s):"dehumidifier"===e.suffix?this.renderDehumidifierBody(e,s):"humidifier"===e.suffix?this.renderHumidifierBody(e,s):this.renderGenericBody(e,s);return W`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${e.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${i}
      </div>`}powerRow(t,e,s,i){const o=this.accent();return W`
      <div class="dev-row">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${i?"on":""}"
          style=${i?`background:${o}`:""}
          @click=${()=>this.hass?.callService(e,"toggle",{entity_id:t})}
          aria-label="Toggle ${s}"></button>
      </div>`}renderGenericBody(t,e){const s="on"===e.state,i=this.accent(),o="fan"===t.domain?"fan":"switch";let r=q;if("fan"===t.domain){const o=Math.round(e.attributes.percentage??0);r=W`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(s?o:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${s?o+"%":"off"}</span>
        </div>`}return W`${this.powerRow(t.id,o,t.label,s)}${r}${this.relatedControls(t.suffix,t.domain)}`}renderHeaterBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_heater_mode_set`,r=this.get(o),n=this.modeOf(o),a=`number.sf_${s}_heater_level`,l=`text.sf_${s}_heater_apply`,c=this.numOpts(1,10,1,t=>`L${t}`),d=[];if(r&&d.push(this.liveModeRow("Mode",o)),d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)d.push(this.optSelectRow("Gear",a,c,!0));else if("Time Slot"===n){const t=`text.sf_${s}_heater_schedule_start`,e=`text.sf_${s}_heater_schedule_stop`,i={[o]:"mode",[t]:"schedule_start",[e]:"schedule_end",[a]:"gear"};d.push(this.stagedPeriodRow(t,e,"Schedule")),d.push(this.optSelectRow("Gear",a,c)),d.push(this.saveBar(l,i))}else if("Cycle"===n){const t=`text.sf_${s}_heater_cycle_start`,e=`text.sf_${s}_heater_cycle_run`,i=`text.sf_${s}_heater_cycle_off`,r=`number.sf_${s}_heater_cycle_times`,n={[o]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[r]:"cycle_times",[a]:"gear"};d.push(this.stagedRow("Start Time",t,"time")),d.push(this.stagedRow("Run Time",e,"duration")),d.push(this.stagedRow("Closing Time",i,"duration")),d.push(this.stagedRangeRow("Execution Times",r)),d.push(this.optSelectRow("Gear",a,c)),d.push(this.saveBar(l,n))}else if("Temperature"===n){const t={[o]:"mode",[a]:"gear"};d.push(this.optSelectRow("Gear",a,c)),d.push(this.infoRow("Runs on the tent's day/night temperature targets","")),d.push(this.saveBar(l,t))}return d}renderDehumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_dehumidifier_mode_set`,r=this.get(o),n=this.modeOf(o),a=`select.sf_${s}_dehumidifier_level`,l=`text.sf_${s}_dehumidifier_apply`,c=[];if(r&&c.push(this.liveModeRow("Mode",o)),c.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)c.push(this.ctlRow("Wind Speed",a));else if("Time Slot"===n){const t=`text.sf_${s}_dehumidifier_schedule_start`,e=`text.sf_${s}_dehumidifier_schedule_stop`,i={[o]:"mode",[t]:"schedule_start",[e]:"schedule_end",[a]:"wind"};c.push(this.stagedPeriodRow(t,e,"Schedule")),c.push(this.stagedRow("Wind Speed",a)),c.push(this.saveBar(l,i))}else if("Cycle"===n){const t=`text.sf_${s}_dehumidifier_cycle_start`,e=`text.sf_${s}_dehumidifier_cycle_run`,i=`text.sf_${s}_dehumidifier_cycle_off`,r=`number.sf_${s}_dehumidifier_cycle_times`,n={[o]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[r]:"cycle_times",[a]:"wind"};c.push(this.stagedRow("Start Time",t,"time")),c.push(this.stagedRow("Run Time",e,"duration")),c.push(this.stagedRow("Closing Time",i,"duration")),c.push(this.stagedRangeRow("Execution Times",r)),c.push(this.stagedRow("Wind Speed",a)),c.push(this.saveBar(l,n))}else if("Humidity"===n){const t={[o]:"mode",[a]:"wind"};c.push(this.stagedRow("Wind Speed",a)),c.push(this.infoRow("Runs on the tent's day/night humidity targets","")),c.push(this.saveBar(l,t))}return c}renderHumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_humidifier_mode_set`,r=this.get(o),n=this.modeOf(o),a=`number.sf_${s}_humidifier_level`,l=`text.sf_${s}_humidifier_apply`,c=this.numOpts(1,4,1,t=>`L${t}`),d=[];if(r&&d.push(this.liveModeRow("Mode",o)),d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)d.push(this.optSelectRow("Gear",a,c,!0));else if("Time Slot"===n){const t=`text.sf_${s}_humidifier_schedule_start`,e=`text.sf_${s}_humidifier_schedule_stop`,i={[o]:"mode",[t]:"schedule_start",[e]:"schedule_end",[a]:"gear"};d.push(this.stagedPeriodRow(t,e,"Schedule")),d.push(this.optSelectRow("Gear",a,c)),d.push(this.saveBar(l,i))}else if("Cycle"===n){const t=`text.sf_${s}_humidifier_cycle_start`,e=`text.sf_${s}_humidifier_cycle_run`,i=`text.sf_${s}_humidifier_cycle_off`,r=`number.sf_${s}_humidifier_cycle_times`,n={[o]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[r]:"cycle_times",[a]:"gear"};d.push(this.stagedRow("Start Time",t,"time")),d.push(this.stagedRow("Run Time",e,"duration")),d.push(this.stagedRow("Closing Time",i,"duration")),d.push(this.stagedRangeRow("Execution Times",r)),d.push(this.optSelectRow("Gear",a,c)),d.push(this.saveBar(l,n))}else if("Humidity"===n){const t={[o]:"mode",[a]:"gear"};d.push(this.optSelectRow("Gear",a,c)),d.push(this.infoRow("Runs on the tent's day/night humidity targets","")),d.push(this.saveBar(l,t))}return d}textState(t){const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}durMinutes(t,e){const s=t=>{const e=/^(\d{1,2}):(\d{2})/.exec(t);return e?60*Number(e[1])+Number(e[2]):null},i=s(this.textState(t)),o=s(this.textState(e));if(null==i||null==o)return null;let r=(o-i+1440)%1440;return 0===r&&(r=1440),r}durationText(t,e){const s=this.durMinutes(t,e);return null==s?null:`${Math.floor(s/60)}h ${String(s%60).padStart(2,"0")}min`}infoRow(t,e){return W`<div class="dev-row">
      <span class="dev-lbl">${t}</span><span class="dev-spacer"></span>
      <span class="dev-val">${e}</span>
    </div>`}ctlRow(t,e){const s=this.get(e);if(!s)return q;const i=e.split(".")[0];let o;return o="number"===i?this.numberControl(e,s):"select"===i?this.selectControl(e,s):"text"===i?this.textControl(e,s):"switch"===i?this.switchControl(e,s):W`<span class="ctl-val">${s.state}</span>`,W`<div class="dev-row">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${o}</div>
    </div>`}renderLightBody(t,e){const s=this.config.panel,i=t.suffix,o=this.accent(),r="on"===e.state,n=`select.sf_${s}_${i}_mode`,a=this.get(n),l=this.modeOf(n),c=this.get(`sensor.sf_${s}_${i}_brightness`),d=this.get(`sensor.sf_${s}_ppfd`),p=c&&Number.isFinite(Number(c.state))?`${Math.round(Number(c.state))}%`:"—",h=d&&Number.isFinite(Number(d.state))?`${Math.round(Number(d.state))} µmol`:"—",u=`text.sf_${s}_${i}_apply`,f=`number.sf_${s}_${i}_go_dark`,g=`number.sf_${s}_${i}_turn_off`,m=[];if(a&&m.push(this.liveModeRow("Mode",n)),m.push(this.powerRow(t.id,"light",t.label,r)),"Manual"===l){const s=Math.round((e.attributes.brightness??0)/255*100);m.push(W`
        <div class="dev-row">
          <span class="dev-lbl">Brightness</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${r?String(s):"0"}
              style="accent-color:${o}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setBrightness(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${r?s+"%":"off"}</span>
        </div>`),m.push(this.infoRow("Current PPFD",h))}else if("Time Slot"===l){const t=`text.sf_${s}_${i}_schedule_start`,e=`text.sf_${s}_${i}_schedule_stop`,o=`number.sf_${s}_${i}_schedule_brightness`,r=`number.sf_${s}_${i}_fade`,a={[n]:"mode",[t]:"schedule_start",[e]:"schedule_end",[o]:"schedule_brightness",[r]:"fade_minutes",[f]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${p} · ${h}`));const l=this.durationText(t,e);l&&m.push(this.infoRow("Light duration",l)),m.push(this.stagedPeriodRow(t,e,"Lighting period")),m.push(this.optSelectRow("Target Brightness",o,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",f,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.optSelectRow("Turn off",g,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.saveBar(u,a))}else if("PPFD"===l){const t=`text.sf_${s}_${i}_ppfd_start`,e=`text.sf_${s}_${i}_ppfd_stop`,o=`number.sf_${s}_${i}_ppfd_target`,r=`number.sf_${s}_${i}_ppfd_fade`,a=`number.sf_${s}_${i}_ppfd_min`,l=`number.sf_${s}_${i}_ppfd_max`,c={[n]:"mode",[t]:"ppfd_start",[e]:"ppfd_end",[o]:"ppfd_target",[r]:"ppfd_fade_minutes",[a]:"ppfd_min",[l]:"ppfd_max",[f]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${p} · ${h}`));const d=this.durationText(t,e),v=this.durMinutes(t,e),b=Number(this.get(o)?.state);if(d&&null!=v&&Number.isFinite(b)){const t=b*v*60/1e6;m.push(this.infoRow("DLI · duration",`${t.toFixed(2)} mol/m²/day · ${d}`))}else d&&m.push(this.infoRow("Light duration",d));m.push(this.stagedPeriodRow(t,e,"Lighting period")),m.push(W`<div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(o,this.numOpts(20,2e3,10,t=>`${t} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",a,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Dimming Range Max",l,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",f,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.optSelectRow("Turn off",g,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.saveBar(u,c))}return m}renderFanBody(t,e){const s=this.config.panel,i=this.accent(),o="on"===e.state,r=`select.sf_${s}_fan_mode_set`,n=this.get(r),a=this.modeOf(r),l=`number.sf_${s}_fan_oscillation`,c=`number.sf_${s}_fan_schedule_gear`,d=`number.sf_${s}_fan_standby_speed`,p=`switch.sf_${s}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",c,this.numOpts(1,10,1,t=>`L${t}`)),u=Math.max(1,Math.round(Number(this.draftVal(c))||1)),f=()=>this.optSelectRow("Standby Speed",d,this.offOpts(1,u-1)),g=()=>this.optSelectRow("Oscillation",l,this.offOpts(1,10),!0),m=`text.sf_${s}_fan_apply`,v=[];if(n&&v.push(this.liveModeRow("Mode",r)),v.push(this.powerRow(t.id,"fan",t.label,o)),"Manual"===a){const s=Math.round(e.attributes.percentage??0);v.push(W`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(o?s:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${o?s+"%":"off"}</span>
        </div>`)}else if("Time Slot"===a){const t={[r]:"mode",[`text.sf_${s}_fan_schedule_start`]:"schedule_start",[`text.sf_${s}_fan_schedule_stop`]:"schedule_end",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${s}_fan_schedule_start`,`text.sf_${s}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,t))}else if("Cycle"===a){const t=`text.sf_${s}_fan_cycle_start`,e=`text.sf_${s}_fan_cycle_run`,i=`text.sf_${s}_fan_cycle_off`,o=`number.sf_${s}_fan_cycle_times`,n={[r]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[o]:"cycle_times",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Start Time",t,"time")),v.push(this.stagedRow("Run Duration",e,"duration")),v.push(this.stagedRow("Off Duration",i,"duration")),v.push(this.stagedRangeRow("Execution Times",o)),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,n))}else if("Environment"===a){const t=`select.sf_${s}_fan_run_mode`,e={[r]:"mode",[t]:"env_submode",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Run Mode",t)),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,e))}return v}renderBlowerBody(t,e){const s=this.config.panel,i=this.accent(),o="on"===e.state,r=`select.sf_${s}_blower_mode_set`,n=this.get(r),a=this.modeOf(r),l=`number.sf_${s}_blower_running_speed`,c=`number.sf_${s}_blower_standby_speed`,d=`switch.sf_${s}_blower_close_co2`,p=`text.sf_${s}_blower_apply`,h=()=>this.optSelectRow("Running Speed",l,this.numOpts(25,100,1,t=>`${t}%`)),u=Math.max(25,Math.round(Number(this.draftVal(l))||25)),f=()=>this.optSelectRow("Standby Speed",c,this.offOpts(25,u-1)),g=[];if(n&&g.push(this.liveModeRow("Mode",r)),g.push(this.powerRow(t.id,"fan",t.label,o)),"Manual"===a){const s=Math.round(e.attributes.percentage??0);g.push(W`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(o?s:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${o?s+"%":"off"}</span>
        </div>`),g.push(this.ctlRow("Close CO2 Device",d))}else if("Time Slot"===a){const t={[r]:"mode",[`text.sf_${s}_blower_schedule_start`]:"schedule_start",[`text.sf_${s}_blower_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedPeriodRow(`text.sf_${s}_blower_schedule_start`,`text.sf_${s}_blower_schedule_stop`,"Schedule")),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,t))}else if("Cycle"===a){const t=`text.sf_${s}_blower_cycle_start`,e=`text.sf_${s}_blower_cycle_run`,i=`text.sf_${s}_blower_cycle_off`,o=`number.sf_${s}_blower_cycle_times`,n={[r]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[o]:"cycle_times",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedRow("Start Time",t,"time")),g.push(this.stagedRow("Run Duration",e,"duration")),g.push(this.stagedRow("Off Duration",i,"duration")),g.push(this.stagedRangeRow("Execution Times",o)),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,n))}else if("Environment"===a){const t=`select.sf_${s}_blower_run_mode`,e={[r]:"mode",[t]:"env_submode",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedRow("Run Mode",t)),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,e))}return g}setBrightness(t,e){const s=Number(e.target.value);s<=0?this.hass?.callService("light","turn_off",{entity_id:t}):this.hass?.callService("light","turn_on",{entity_id:t,brightness_pct:s})}setPercent(t,e){const s=Number(e.target.value);this.hass?.callService("fan","set_percentage",{entity_id:t,percentage:s})}cycleIsDay(){const t=this.config.panel,e=this.get(`binary_sensor.sf_${t}_daytime_schedule`);if(e&&("on"===e.state||"off"===e.state))return"on"===e.state;const s=zt(this.get(`text.sf_${t}_env_day_start`)?.state),i=zt(this.get(`text.sf_${t}_env_day_end`)?.state);if(null==s||null==i)return null;const o=new Date,r=60*o.getHours()+o.getMinutes();return s<=i?r>=s&&r<i:r>=s||r<i}lightLeak(){if(!1!==this.cycleIsDay())return{on:!1,text:""};const t=this.config.panel,e=this.get(`sensor.sf_${t}_ppfd`);if(e){const t=Number(e.state);return Number.isFinite(t)&&t>1?{on:!0,text:`Light detected · ${Math.round(t)} µmol`}:{on:!1,text:""}}const s=this.get(`binary_sensor.sf_${t}_daytime_light_sensor`);return s&&"on"===s.state?{on:!0,text:"Light detected"}:{on:!1,text:""}}renderParamsHead(){const t=this.cycleIsDay(),e=this.lightLeak(),s=null===t?q:W`<span class="cycle-badge"
          style="color:${t?"#e0a83a":"#8f9bd4"};background:${t?"rgba(224,168,58,0.14)":"rgba(143,155,212,0.16)"}">
          <ha-icon icon=${t?"mdi:white-balance-sunny":"mdi:weather-night"}></ha-icon>${t?"Day Cycle":"Night Cycle"}</span>`;return W`
      <div class="params-head">
        <span class="ph-label">Parameters</span>
        <span class="ph-mid">${e.on?W`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${e.text}</span>`:q}</span>
        ${s}
      </div>`}renderOverview(){const t=Et.map(t=>this.renderParam(t)).filter(t=>t!==q),e=this.soilStatsTile(),s=this.overviewDevices();return W`
      ${t.length||e!==q?W`${this.renderParamsHead()}
            <div class="grid">${t}${e}</div>
            ${this.renderSoilPop()}
            ${this.renderSoilAllTable()}`:q}
      ${s.length?W`<div class="section-label">Devices</div>
            <div class="grid">${s.map(t=>this.deviceTile(t))}</div>
            ${this.renderDevicePop()}`:q}`}numberControl(t,e){const s=e.attributes.min??0,i=e.attributes.max??100,o=e.attributes.step??1,r=e.attributes.unit_of_measurement??"",n="slider"===e.attributes.mode,a=function(t,e){return""===t||"unknown"===t||"unavailable"===t?"":Number.isFinite(Number(t))?Number(t).toFixed(xt(e)):t}(e.state,o);return n?W`
        <div class="slider-wrap">
          <span class="sl-live">
            <input type="range" min=${s} max=${i} step=${o}
              .value=${a} style="accent-color:${this.accent()}" data-unit=${r}
              @input=${yt}
              @change=${e=>this.setNumber(t,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="slider-val" style="color:${this.accent()}">${a}${r}</span>
        </div>`:W`
      <span class="num-box">
        <input type="number" min=${s} max=${i} step=${o}
          .value=${a} @change=${e=>this.setNumber(t,e)} />
        <span class="unit">${r}</span>
      </span>`}selectControl(t,e){const s=e.attributes.options??[];return W`
      <select .value=${e.state} @change=${e=>this.setSelect(t,e)}>
        ${s.map(t=>W`<option value=${t} ?selected=${t===e.state}>${t}</option>`)}
      </select>`}textControl(t,e){const s="unknown"===e.state||"unavailable"===e.state?"":e.state,i=/^\d{1,2}:\d{2}$/.test(s);return W`
      <input type=${i?"time":"text"} .value=${s}
        @change=${e=>this.setText(t,e)} />`}switchControl(t,e){const s="on"===e.state;return W`
      <button class="toggle ${s?"on":""}"
        style=${s?`background:${this.accent()}`:""}
        @click=${()=>this.hass?.callService("switch","toggle",{entity_id:t})}
        aria-label="Toggle"></button>`}setNumber(t,e){const s=Number(e.target.value);Number.isNaN(s)||this.hass?.callService("number","set_value",{entity_id:t,value:s})}setSelect(t,e){const s=e.target.value;this.hass?.callService("select","select_option",{entity_id:t,option:s})}setText(t,e){const s=e.target.value;this.hass?.callService("text","set_value",{entity_id:t,value:s})}draftVal(t){if(t in this.draft)return this.draft[t];const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}stage(t,e){this.draft={...this.draft,[t]:e}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(t){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=t}modeOf(t,e="Manual"){return this.modePick[t]??this.get(t)?.state??e}stagedInput(t,e){const s=this.get(t);if(!s)return q;const i=t.split(".")[0],o=this.draftVal(t);if(!e&&"number"===i){const e=s.attributes.min??0,i=s.attributes.max??100,r=s.attributes.step??1,n=s.attributes.unit_of_measurement??"";return W`<span class="num-box">
        <input type="number" min=${e} max=${i} step=${r} .value=${o}
          @input=${e=>this.stage(t,e.target.value)} />
        <span class="unit">${n}</span></span>`}if(!e&&"select"===i){const e=s.attributes.options??[];return W`<select .value=${o} @change=${e=>this.stage(t,e.target.value)}>
        ${e.map(t=>W`<option value=${t} ?selected=${t===o}>${t}</option>`)}
      </select>`}const r="time"===e||"duration"===e||/^\d{1,2}:\d{2}/.test(o);return W`<input type=${r?"time":"text"}
      step=${"duration"===e?"1":q} .value=${o}
      @change=${e=>this.stage(t,e.target.value)} />`}numOpts(t,e,s=1,i=String){const o=[],r=(String(s).split(".")[1]||"").length,n=s>0?Math.round((e-t)/s):0;for(let e=0;e<=n;e++){const n=Number((t+e*s).toFixed(r));o.push({label:i(n),value:String(n)})}return o}offOpts(t,e,s=1,i){return[{label:"Off",value:"0"},...this.numOpts(t,e,s,i)]}optSelect(t,e,s=!1){if(!this.get(t))return q;const i=this.draftVal(t),o=e.find(t=>Number(t.value)===Number(i))?.value??e.find(t=>t.value===i)?.value??i;return W`<select .value=${String(o)} @change=${e=>{const i=e.target.value;s?this.hass?.callService("number","set_value",{entity_id:t,value:Number(i)}):this.stage(t,i)}}>
      ${e.map(t=>W`
        <option value=${t.value} ?selected=${String(t.value)===String(o)}>${t.label}</option>`)}
    </select>`}optSelectRow(t,e,s,i=!1){if(!this.get(e))return q;const o=!i&&e in this.draft?"dev-row staged":"dev-row";return W`<div class=${o}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.optSelect(e,s,i)}</div>
    </div>`}stagedRow(t,e,s){if(!this.get(e))return q;const i=e in this.draft?"dev-row staged":"dev-row";return W`<div class=${i}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.stagedInput(e,s)}</div>
    </div>`}stagedRangeRow(t,e,s){const i=this.get(e);if(!i)return q;const o=Math.round(Number(i.attributes.min??1)),r=Math.round(Number(i.attributes.max??100)),n=Math.max(1,Math.round(Number(i.attributes.step??1)));return this.optSelectRow(t,e,this.numOpts(o,r,n,s))}stagedPeriodRow(t,e,s){const i=this.get(t),o=this.get(e);if(!i&&!o)return q;const r=t in this.draft||e in this.draft;return W`<div class="dev-row period-row ${r?"staged":""}">
      <span class="dev-lbl">${s}</span>
      <div class="period-times">
        ${i?this.stagedInput(t,"time"):q}
        <span class="dash">–</span>
        ${o?this.stagedInput(e,"time"):q}
      </div>
    </div>`}liveModeRow(t,e){const s=this.get(e);if(!s)return q;const i=s.attributes.options??[];return W`<div class="dev-row">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">
        <select .value=${this.modeOf(e,s.state)} @change=${t=>{const s=t.target.value;this.modePick={...this.modePick,[e]:s},"Manual"===s?(this.draft={},this.setSelect(e,t)):this.draft={[e]:s}}}>
          ${i.map(t=>W`
            <option value=${t} ?selected=${t===this.modeOf(e,s.state)}>${t}</option>`)}
        </select>
      </div>
    </div>`}saveBar(t,e){const s=Object.keys(this.draft).some(t=>t in e);return It(this.accent(),s,()=>this.commitBundle(t,e),()=>this.discardEdits())}commitBundle(t,e){const s={};for(const[t,i]of Object.entries(e))if(t in this.draft){const e=this.draft[t];s[i]="number"===t.split(".")[0]?Number(e):e}if(!Object.keys(s).length)return;const i=t.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),o=i?"light_1"===i[1]?"light":"light_2"===i[1]?"light2":i[1]:null;o&&!this.get(t)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(e)[0],module:o,settings:s}):this.hass?.callService("text","set_value",{entity_id:t,value:JSON.stringify(s)});const r={...this.draft};for(const t of Object.keys(e))delete r[t];this.draft=r}stagedSwitch(t){const e="on"===this.draftVal(t);return W`<button class="toggle ${e?"on":""}"
      style=${e?`background:${this.accent()}`:""}
      @click=${()=>this.stage(t,e?"off":"on")} aria-label="Toggle"></button>`}stagedCtl(t,e,s){const i=this.get(t);if(!i)return q;const o=e??i.attributes.friendly_name??t.split(".")[1],r="switch"===t.split(".")[0]?this.stagedSwitch(t):this.stagedInput(t,s),n=t in this.draft;return W`
      <div class="ctl ${n?"staged":""}">
        <div class="ctl-label">${o}</div>
        <div class="ctl-input">${r}</div>
      </div>`}applyStaged(t){for(const e of t){if(!(e in this.draft))continue;const t=this.draft[e];switch(e.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:e,value:Number(t)});break;case"text":this.hass?.callService("text","set_value",{entity_id:e,value:t});break;case"select":this.hass?.callService("select","select_option",{entity_id:e,option:t});break;case"switch":this.hass?.callService("switch","on"===t?"turn_on":"turn_off",{entity_id:e})}}const e={...this.draft};for(const s of t)delete e[s];this.draft=e}discardStaged(t){const e={...this.draft};let s=!1;for(const i of t)i in e&&(delete e[i],s=!0);s&&(this.draft=e)}applyBar(t,e={}){const s=!!e.extraDirty||t.some(t=>t in this.draft);return It(this.accent(),s,()=>{this.applyStaged(t),e.onApply?.()},()=>{this.discardStaged(t),e.onDiscard?.()},"apply-bar")}envIds(){const t=this.config.panel,e=[];for(const s of[`text.sf_${t}_env_day_start`,`text.sf_${t}_env_day_end`])this.get(s)&&e.push(s);for(const[,s,i,o]of Lt)for(const r of[i,s,o]){const s=`number.sf_${t}_${r}`;this.get(s)&&e.push(s)}return e}caliIds(){const t=this.config.panel,e=[];for(const s of["cal_air_temp","cal_air_humidity","cal_ppfd","cal_co2"]){const i=`number.sf_${t}_${s}`;this.get(i)&&e.push(i)}for(const s of this.caliSoilSlots()){for(const i of["cal_temp","cal_moisture","cal_ec"]){const o=`number.sf_${t}_${s}_${i}`;this.get(o)&&e.push(o)}const i=`select.sf_${t}_${s}_substrate`;this.get(i)&&e.push(i)}return e}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.outlets??[];if(!this.hass)return t;const e=new Set(Ct(this.hass,this.config.panel));return t.filter(t=>e.has(t))}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}rangeSelect(t){const e=this.get(t);if(!e)return q;const s=Number(e.attributes.min??0),i=Number(e.attributes.max??100),o=Number(e.attributes.step??1)||1,r=e.attributes.unit_of_measurement??"";return this.optSelect(t,this.numOpts(s,i,o,t=>`${t}${r}`),!1)}envControl(t,e){return this.get(t)?W`
      <div class="ctl">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">${this.rangeSelect(t)}</div>
      </div>`:q}renderEnv(){const t=this.config.panel;if(!this.hasEnv())return q;const e=`text.sf_${t}_env_day_start`,s=`text.sf_${t}_env_day_end`,i=this.get(e)||this.get(s);return W`
      <div class="section-label">Environment</div>
      ${i?W`<div class="env-cycle">
            ${this.stagedCtl(e,"Day Cycle Start","time")}
            ${this.stagedCtl(s,"Day Cycle Stop","time")}
          </div>`:q}
      ${Lt.map(([e,s,i,o,r])=>this.get(`number.sf_${t}_${s}`)?W`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${r} style="color:${this.accent()}"></ha-icon>
              <span>${e}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${t}_${i}`,"Night")}
              ${this.envControl(`number.sf_${t}_${s}`,"Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${t}_${o}`,"Dead Zone")}
            </div>
          </div>`:q)}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`}vpdRangeFor(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const o=Number(s.state),r=Number(i.state);if(!Number.isFinite(o)||!Number.isFinite(r))return null;const n=this.config.panel,a=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,c="°C"===s.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,p=t=>.6108*Math.exp(17.27*t/(t+237.3)),h=Math.max(0,r-l),u=Math.min(100,r+l),f=Math.max(0,p(d(o-a))*(1-u/100)),g=Math.max(0,p(d(o+a))*(1-h/100));return`${f.toFixed(2)} – ${g.toFixed(2)}`}renderVpd(){const t=this.config.panel,e=this.vpdRangeFor(`number.sf_${t}_env_temp_day`,`number.sf_${t}_env_humi_day`),s=this.vpdRangeFor(`number.sf_${t}_env_temp_night`,`number.sf_${t}_env_humi_night`);return e||s?W`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${e?W`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${e}</span>
              </div>`:q}
          ${s?W`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${s}</span>
              </div>`:q}
        </div>
      </div>`:q}toggleOutlet(t){this.outletOpen=t}outletNums(t){const e=[];for(let s=1;s<=10;s++)this.get(`select.sf_${t}_outlet_${s}_mode`)&&e.push(s);return e}renderOutlets(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return q;const e=this.outletOpen?this.outletOpen.slice(0,this.outletOpen.lastIndexOf("_")):null;return W`
      ${t.map(t=>{const s=Rt(this.hass,t)||`${t.toUpperCase()} Power Strip`;return W`
          <div class="section-label">${s}</div>
          <div class="grid">
            ${this.outletNums(t).map(e=>this.outletTile(t,e))}
          </div>
          ${e===t?this.renderOutletPop():q}`})}`}outletTile(t,e){const s="on"===this.draftVal(`switch.sf_${t}_outlet_${e}`),i=this.draftVal(`select.sf_${t}_outlet_${e}_mode`)||"",o=this.outletKey(t,e),r=this.outletOpen===o,n=this.accent();return W`
      <div class="tile clickable ${r?"active":""}"
        style=${r?`box-shadow:inset 0 0 0 1px ${n}`:q}
        role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>this.toggleOutlet(r?null:o)}>
        <div class="tile-label">Outlet ${e}
          <ha-icon class="tile-more"
            icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${s?n:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${s?`color:${n}`:q}>${s?"On":"Off"}</div>
        <div class="tile-sub">${i}</div>
      </div>`}renderOutletPop(){const t=this.outletOpen;if(!t)return q;const e=t.lastIndexOf("_");if(e<0)return q;const s=t.slice(0,e),i=Number(t.slice(e+1));if(!s||!Number.isFinite(i))return q;const o=`select.sf_${s}_outlet_${i}_mode`;if(!this.get(o))return q;const r=`switch.sf_${s}_outlet_${i}`,n=this.get(r),a=`sf_${s}_outlet_${i}_`,l="Time Slot"===(this.draftVal(o)||this.get(o)?.state||"")&&!!this.get(`sensor.${a}ts_schedule`),c=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return!(!e.startsWith(a)||e===`${a}mode`)&&(e!==`${a}ts_schedule`&&(!l||e!==`${a}ts_type`&&e!==`${a}ts_start`&&e!==`${a}ts_stop`))}).sort(),d=[...n?[r]:[],o,...c.filter(t=>/^(switch|number|select|text)\./.test(t))],p=!!this.outletDraft[this.outletKey(s,i)];return W`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>Outlet ${i}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleOutlet(null)}></ha-icon>
        </div>
        ${n?this.stagedCtl(r,"Power"):q}
        ${this.stagedCtl(o,"Mode")}
        ${c.map(t=>this.stagedCtl(t))}
        ${l?this.renderOutletSchedule(s,i):q}
        ${this.applyBar(d,{extraDirty:p,onApply:()=>this.saveOutlet(s,i),onDiscard:()=>this.clearOutletDraft(s,i)})}
      </div>`}outletKey(t,e){return`${t}_${e}`}outletPeriods(t,e){const s=this.outletDraft[this.outletKey(t,e)];if(s)return s;const i=this.get(`sensor.sf_${t}_outlet_${e}_ts_schedule`)?.attributes.periods;return Array.isArray(i)?i:[]}editOutlet(t,e,s){const i=this.outletKey(t,e),o=this.outletDraft[i]??this.outletPeriods(t,e),r=JSON.parse(JSON.stringify(o));s(r),this.outletDraft={...this.outletDraft,[i]:r}}clearOutletDraft(t,e){const s=this.outletKey(t,e),i={...this.outletDraft};delete i[s],this.outletDraft=i}saveOutlet(t,e){const s=this.outletDraft[this.outletKey(t,e)];s&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${t}_outlet_${e}_mode`,periods:s}),this.clearOutletDraft(t,e))}renderOutletSchedule(t,e){const s=this.outletPeriods(t,e),i=this.accent();return W`
      <div class="ts-editor">
        ${s.map((s,o)=>W`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${o+1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${()=>this.editOutlet(t,e,t=>t.splice(o,1))}>✕</button>
            </div>
            <div class="days">
              ${mt.map((r,n)=>W`<button
                  class="day ${s.days.includes(n)?"on":""}"
                  style=${s.days.includes(n)?`background:${i};border-color:${i}`:""}
                  @click=${()=>this.editOutlet(t,e,t=>{const e=t[o].days,s=e.indexOf(n);s>=0?e.splice(s,1):e.push(n),e.sort((t,e)=>t-e)})}>${r}</button>`)}
            </div>
            <div class="sched-times">
              <div class="tf">
                <span class="tf-lbl">Start</span>
                <input type="time" .value=${s.start}
                  @change=${s=>this.editOutlet(t,e,t=>{t[o].start=s.target.value})} />
              </div>
              <span class="dash">—</span>
              <div class="tf">
                <span class="tf-lbl">Stop</span>
                <input type="time" .value=${s.end}
                  @change=${s=>this.editOutlet(t,e,t=>{t[o].end=s.target.value})} />
              </div>
            </div>
          </div>`)}
        <div class="sched-actions">
          <button class="add"
            @click=${()=>this.editOutlet(t,e,t=>t.push({days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00"}))}>
            + Add slot
          </button>
        </div>
      </div>`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let s=e?.attributes.friendly_name??"";const i=Rt(this.hass,this.config.panel);return i&&s.startsWith(i)&&(s=s.slice(i.length).trim()),s=s.replace(/\s*Temp Calibration\s*$/i,"").trim(),s||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.envControl(t,e)).filter(t=>t!==q),s=this.caliSoilSlots().map(e=>{const s=[this.envControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.envControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==q),i=this.stagedCtl(`select.sf_${t}_${e}_substrate`,"Substrate");return W`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="env-grid">${s}</div>
          ${i!==q?W`<div class="cali-sub">${i}</div>`:q}
        </div>`});return e.length||s.length?W`
      ${e.length?W`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:q}
      ${s.length?W`<div class="section-label">Soil Calibration</div>${s}`:q}
      ${this.applyBar(this.caliIds())}`:W`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}hasAlerts(){return!!this.alertsSettings()}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return t&&"object"==typeof t?t:null}editAlert(t){const e=this.alertsDraft??this.alertsSettings()??{},s=JSON.parse(JSON.stringify(e));t(s),this.alertsDraft=s}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const t=this.alertsSettings();if(!t)return q;const e=null!==this.alertsDraft,s=this.accent();return W`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(t,"climate","Climate")}
      ${this.renderAlertGroup(t,"substrate","Substrate")}
      ${this.renderAlertOther(t)}
      ${It(s,e,()=>this.saveAlerts(),()=>this.alertsDraft=null,"apply-bar")}`}renderAlertGroup(t,e,s){const i=t[e]||[];return i.length?W`
      <div class="section-label">${s}</div>
      ${i.map((t,s)=>this.renderAlertMetric(e,s,t))}`:q}alertBounds(t){switch(t){case"temp":case"tempSoil":return[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(t,e,s){const i=this.accent(),[o,r]=this.alertBounds(s.key),n=Number(s.step??1)||1,a="ppfd"===s.key?Math.max(o,r-100):r,l=(i,l)=>{const c=this.numOpts(o,"min"===l?a:r,n);return W`
      <label class="av">
        <span class="av-lbl">${i}</span>
        <span class="num-box">
          <select .value=${String(s[l]??"")}
            @change=${s=>this.editAlert(i=>{i[t][e][l]=Number(s.target.value)})}>
            ${c.map(t=>W`
              <option value=${t.value} ?selected=${String(t.value)===String(s[l]??"")}>${t.label}</option>`)}
          </select>
          <span class="unit">${s.unit??""}</span>
        </span>
      </label>`};return W`
      <div class="alert-row ${s.enabled?"":"off"}">
        <div class="alert-head">
          <span class="alert-name">${s.label} <span class="unit">${s.unit??""}</span></span>
          <button class="toggle ${s.enabled?"on":""}"
            style=${s.enabled?`background:${i}`:""}
            @click=${()=>this.editAlert(s=>{const i=s[t][e];i.enabled=i.enabled?0:1})}
            aria-label="Toggle ${s.label} alarm"></button>
        </div>
        <div class="alert-vals">
          ${"range"===s.kind?l("Min","min"):q}
          ${l("Max","max")}
        </div>
      </div>`}renderAlertOther(t){const e=t.other||[];if(!e.length)return q;const s=this.accent();return W`
      <div class="section-label">Other Device</div>
      ${e.map((t,e)=>W`<div class="alert-bool">
          <span class="alert-name">${t.label}</span>
          <button class="toggle ${t.enabled?"on":""}"
            style=${t.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(t=>{const s=t.other[e];s.enabled=s.enabled?0:1})}
            aria-label="Toggle ${t.label} alarm"></button>
        </div>`)}`}hasLog(){return this.alarmSources().length>0}alarmSources(){const t=[],e=e=>{const s=this.get(`sensor.sf_${e}_alarms`);s&&t.push({slot:e,ent:s,name:Rt(this.hass,e)||e})};e(this.config.panel);for(const t of this.outletSlots())t!==this.config.panel&&e(t);return t}logToday(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}renderLog(){const t=this.alarmSources(),e=this.logDate||this.logToday(),s=this.logDev||"all",i=this.logType||"all";let o=[];for(const e of t){if("all"!==s&&s!==e.slot)continue;const t=e.ent.attributes.events;Array.isArray(t)&&t.forEach(t=>o.push({...t,_src:e.name}))}const r=[...new Set(o.map(t=>t.device).filter(Boolean))].sort(),n=new Date(`${e}T00:00:00`).getTime()/1e3,a=new Date(`${e}T23:59:59.999`).getTime()/1e3;return o=o.filter(t=>(t.epoch||0)>=n&&(t.epoch||0)<=a&&("all"===i||t.device===i)).sort((t,e)=>(e.epoch||0)-(t.epoch||0)).slice(0,50),W`
      <div class="log-filters">
        ${t.length>1?W`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${t=>{this.logDev=t.target.value}}>
                  <option value="all" ?selected=${"all"===s}>All</option>
                  ${t.map(t=>W`
                    <option value=${t.slot} ?selected=${s===t.slot}>${t.name}</option>`)}
                </select>
              </div>
            </div>`:q}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${t=>{this.logType=t.target.value}}>
              <option value="all" ?selected=${"all"===i}>All</option>
              ${r.map(t=>W`
                <option value=${t} ?selected=${i===t}>${t}</option>`)}
            </select>
          </div>
        </div>
        <div class="ctl">
          <div class="ctl-label">Date</div>
          <div class="ctl-input">
            <input type="date" .value=${e} @change=${t=>{this.logDate=t.target.value||null}} />
          </div>
        </div>
      </div>
      ${o.length?W`
            <div class="log-count">${o.length} ${1===o.length?"entry":"entries"}${o.length>10?" — scroll for more":""}</div>
            <div class="log-list">
              ${o.map(e=>W`
                <div class="log-row ${e.alarmType?"raise":"restore"}">
                  <div class="log-title">${t.length>1&&"all"===s?`${e._src} `:""}${e.device||`Device ${e.devType}`} ${e.alarm||""}</div>
                  <div class="log-time">${e.epoch?(t=>{try{return new Date(1e3*t).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(e.epoch):e.time||""}</div>
                </div>`)}
            </div>`:W`<div class="cali-empty">No log entries on this date.</div>`}`}render(){if(!this.hass||!this.config)return q;const t=this.hasEnv(),e=this.hasOutlets(),s=this.hasCali(),i=this.hasAlerts(),o=this.hasLog();let r=this.tab;"env"!==r||t||(r="overview"),"outlets"!==r||e||(r="overview"),"cali"!==r||s||(r="overview"),"alerts"!==r||i||(r="overview"),"log"!==r||o||(r="overview"),"settings"!==r||i||(r="overview");const n=t||e||s||i||o,a=this.accent(),l=(t,e)=>W`<button class="tab ${r===t?"active":""}"
        style=${r===t?`color:${a};border-color:${a}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,c=Rt(this.hass,this.config.panel);return W`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${c?W`<span class="device">${c}</span>`:q}
        </div>
        ${n?W`<div class="tabs">
              ${l("overview","Overview")}
              ${t?l("env","Environment"):q}
              ${e?l("outlets","Outlets"):q}
              ${s?l("cali","Calibration"):q}
              ${i?l("alerts","Alerts"):q}
              ${o?l("log","Log"):q}
              ${i?l("settings","Settings"):q}
            </div>`:q}
        ${"env"===r?this.renderEnv():"outlets"===r?this.renderOutlets():"cali"===r?this.renderCali():"alerts"===r?this.renderAlerts():"log"===r?this.renderLog():"settings"===r?this.renderSettings():this.renderOverview()}
      </ha-card>`}renderSettings(){const t=this.accent(),e=this.colorDraft,s=e?.mode??this.colorMode,i=e?.modeIn??this.colorModeIn,o=e?.hi??this.colHi,r=e?.lo??this.colLo,n=e?.in??this.colIn,a=!!e&&(void 0!==e.mode&&e.mode!==this.colorMode||void 0!==e.modeIn&&e.modeIn!==this.colorModeIn||void 0!==e.hi&&e.hi!==this.colHi||void 0!==e.lo&&e.lo!==this.colLo||void 0!==e.in&&e.in!==this.colIn),l=t=>this.colorDraft={...this.colorDraft??{},...t},c=(e,s,i,o,r)=>W`
      <button class="seg ${e===s?"on":""}"
        style=${e===s?`border-color:${t};color:${t}`:q}
        @click=${r}>
        <ha-icon icon=${o}></ha-icon><span>${i}</span>
      </button>`,d=(t,e,s)=>W`
      <label class="color-field">
        <span>${t}</span>
        <input class="pinwheel" type="color" .value=${e}
          @input=${t=>s(t.target.value)} />
      </label>`;return W`
      <div class="section-label">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${o}">above max</span>,
        <span style="color:${r}">below min</span>. Saved to the controller, so
        it sticks across upgrades and your other devices.
      </div>
      <div class="seg-row">
        ${c(s,"off","No color","mdi:circle-off-outline",()=>l({mode:"off"}))}
        ${c(s,"tile","Tile color","mdi:square-rounded",()=>l({mode:"tile"}))}
        ${c(s,"text","Text color","mdi:format-color-text",()=>l({mode:"text"}))}
      </div>
      <div class="color-row">
        ${d("Above max",o,t=>l({hi:t}))}
        ${d("Below min",r,t=>l({lo:t}))}
      </div>

      <div class="section-label" style="margin-top:16px">In-range highlight</div>
      <div class="set-note">
        Colour a reading that's <span style="color:${n}">within</span> its
        limits. Applies to every reading; off by default.
      </div>
      <div class="seg-row">
        ${c(i,"off","No color","mdi:circle-off-outline",()=>l({modeIn:"off"}))}
        ${c(i,"tile","Tile color","mdi:square-rounded",()=>l({modeIn:"tile"}))}
        ${c(i,"text","Text color","mdi:format-color-text",()=>l({modeIn:"text"}))}
      </div>
      <div class="color-row">
        ${d("In range",n,t=>l({in:t}))}
      </div>
      ${It(t,a,()=>{const t=this.colorDraft;t&&(void 0!==t.mode&&t.mode!==this.colorMode&&(this.colorMode=t.mode,this.persistColorOption("colors",t.mode)),void 0!==t.modeIn&&t.modeIn!==this.colorModeIn&&(this.colorModeIn=t.modeIn,this.persistColorOption("colors_in",t.modeIn)),void 0!==t.hi&&t.hi!==this.colHi&&(this.colHi=t.hi,this.persistColorOption("color_hi",t.hi)),void 0!==t.lo&&t.lo!==this.colLo&&(this.colLo=t.lo,this.persistColorOption("color_lo",t.lo)),void 0!==t.in&&t.in!==this.colIn&&(this.colIn=t.in,this.persistColorOption("color_in",t.in)),this._colorSynced=!0,this.cacheColors()),this.colorDraft=null},()=>this.colorDraft=null,"apply-bar")}`}}jt.styles=n`
    ${wt}
    ha-card { padding: 12px 14px 16px; }
    .header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .header .title { font-size: 18px; font-weight: 500; }
    .header .device { font-size: 12px; color: var(--secondary-text-color); }
    .tabs {
      display: flex; gap: 4px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      margin-bottom: 6px;
      /* v0.17.1: with six tabs a narrow card can't fit one row. Wrap to a
         second row rather than scrolling — a half-clipped tab reads as a
         rendering bug and hides that the tab is even there. */
      flex-wrap: wrap; row-gap: 0;
    }
    .tab {
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 12px; cursor: pointer; margin-bottom: -1px;
      white-space: nowrap; flex: 0 0 auto;
    }
    /* ── Log tab ── */
    .log-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 10px; }
    .log-filters .ctl { flex: 1 1 130px; }
    .log-count {
      font-size: 12px; color: var(--secondary-text-color); margin: 0 0 6px;
    }
    /* Cap the list at ~10 rows and scroll the rest, so a long history can't
       run past the bottom of the card. */
    .log-list { max-height: 560px; overflow-y: auto; padding-right: 2px; }
    .log-list::-webkit-scrollbar { width: 6px; }
    .log-list::-webkit-scrollbar-thumb {
      background: var(--divider-color, #555); border-radius: 3px;
    }
    .log-row {
      background: rgba(255,255,255,.04); border-left: 3px solid;
      border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;
    }
    .log-row.raise { border-left-color: #f85149; }
    .log-row.restore { border-left-color: #3fb950; }
    .log-title { font-size: 14px; }
    .log-time {
      font-size: 12px; color: var(--secondary-text-color); margin-top: 2px;
    }
    .tab.active { border-bottom-width: 2px; border-style: solid; }
    .section-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 2px 8px;
    }
    /* Parameters header: label | centred light-leak alert | day/night pill. */
    .params-head { display: flex; align-items: center; gap: 8px; margin: 14px 2px 8px; }
    .params-head .ph-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap;
    }
    .ph-mid { flex: 1; display: flex; justify-content: center; min-width: 0; }
    .cycle-badge, .leak-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 500; line-height: 1;
      padding: 3px 9px; border-radius: 999px; white-space: nowrap;
    }
    .cycle-badge { flex: none; }
    .cycle-badge ha-icon, .leak-badge ha-icon { --mdc-icon-size: 14px; }
    .leak-badge {
      color: #ff6b6b; background: rgba(255,107,107,0.16);
      max-width: 100%; min-width: 0; overflow: hidden; text-overflow: ellipsis;
    }
    /* minmax(0,1fr) so a wide value (e.g. "Offline") can't push a column past
       the card and clip the third column off-screen on narrow mobile. */
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .tile-val { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile {
      background: var(--secondary-background-color); border-radius: 12px; padding: 10px;
      min-width: 0; overflow: hidden;
    }
    .tile-label {
      font-size: 11px; color: var(--secondary-text-color);
      display: flex; align-items: center; gap: 3px;
      min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tile ha-icon { --mdc-icon-size: 20px; display: block; margin: 2px 0; }
    .tile-val { font-size: 17px; font-weight: 500; }
    .tile-sub {
      font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .unit { font-size: 11px; color: var(--secondary-text-color); margin-left: 2px; }
    .tile.clickable { cursor: pointer; }
    .tile.clickable:hover { box-shadow: inset 0 0 0 1px var(--divider-color, #555); }
    .tile-more { --mdc-icon-size: 14px; opacity: 0.55; margin: 0; }
    .soil-pop {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-top: 8px;
    }
    .soil-pop-head {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;
    }
    .soil-pop-head ha-icon { cursor: pointer; --mdc-icon-size: 18px; }
    .soil-pop-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 0; font-size: 14px;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .soil-pop-row:first-of-type { border-top: none; }
    .spn { color: var(--primary-text-color); }
    .spv { font-weight: 500; }
    /* Offline probe row (v0.17.8): red backing + red text, both breakdowns. */
    .soil-pop-row.offline, .soil-all-row.offline {
      background: rgba(255, 107, 107, 0.16); border-radius: 8px;
    }
    .soil-pop-row.offline .spn, .soil-pop-row.offline .spv,
    .soil-all-row.offline .sa-name, .soil-all-row.offline .sa-v {
      color: #ff6b6b;
    }
    /* Expanded device-tile controls */
    .dev-row {
      display: flex; align-items: center; gap: 10px; padding: 8px 0;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .dev-row:first-of-type { border-top: none; }
    .dev-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .dev-spacer { flex: 1; }
    .dev-row .sl-live { flex: 1; }
    .dev-val {
      font-size: 13px; font-weight: 500; min-width: 34px; text-align: right;
    }
    .dev-row .ctl-input { margin-left: auto; flex: 0 0 auto; min-width: 0; }
    .dev-row .ctl-input select { max-width: 150px; }
    /* A row with an uncommitted (staged) edit gets a subtle left accent bar. */
    .dev-row.staged { position: relative; }
    .dev-row.staged::before {
      content: ""; position: absolute; left: -8px; top: 6px; bottom: 6px;
      width: 2px; border-radius: 2px; background: var(--sf-accent, #ff9800);
    }
    /* Save/Discard bar at the bottom of a schedule/cycle/env tile. */
    .save-bar {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 10px 0 2px; border-top: 0.5px solid var(--divider-color, #333);
    }
    /* Tab-level Apply bar (Environment / Calibration / Outlets / Settings). */
    .apply-bar { margin-top: 14px; }
    /* A staged (uncommitted) .ctl edit gets a subtle left accent bar. */
    .ctl.staged { position: relative; }
    .ctl.staged::before {
      content: ""; position: absolute; left: -8px; top: 6px; bottom: 6px;
      width: 2px; border-radius: 2px; background: var(--sf-accent, #ff9800);
    }
    .save-bar button {
      font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      border-radius: 8px; padding: 6px 16px; border: none;
    }
    .save-btn { color: #fff; }
    .save-btn[disabled] {
      background: var(--divider-color, #444) !important; color: var(--secondary-text-color);
      cursor: default;
    }
    .discard-btn {
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444) !important;
    }
    .discard-btn[disabled] { opacity: 0.5; cursor: default; }
    .period-times {
      margin-left: auto; display: flex; align-items: center; gap: 6px;
      min-width: 0; flex-wrap: wrap;
    }
    .period-times .dash { color: var(--secondary-text-color); flex: 0 0 auto; }
    /* Stack the period under its label on narrow (mobile) widths so the two
       time inputs share the full row instead of clipping. */
    .period-row { flex-direction: column; align-items: stretch; gap: 6px; }
    .period-row .period-times { margin-left: 0; }
    /* Keep each time field wide enough for the native HH:MM (+AM/PM) control:
       flex-basis floors the width and the row wraps rather than clipping. */
    .period-times input[type="time"] {
      flex: 1 1 110px; min-width: 104px; box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px;
      padding: 6px 8px; font-size: 14px;
    }
    .soil-pop .ctl { padding: 8px 0; border-top: 0.5px solid var(--divider-color, #333); }
    .soil-all-head {
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; user-select: none;
    }
    .soil-all-head ha-icon { --mdc-icon-size: 18px; }
    .soil-all {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 6px 12px; margin-top: 2px;
    }
    .soil-all-row {
      display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 6px;
      align-items: center; padding: 6px 0; font-size: 13px;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .soil-all-row:first-of-type { border-top: none; }
    .soil-all-hd {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .sa-name {
      color: var(--primary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .sa-v { text-align: right; font-weight: 500; }
    .soil-all-hd .sa-v, .soil-all-hd .sa-name { font-weight: 400; }
    .controls { display: flex; flex-direction: column; gap: 8px; }
    .row {
      display: flex; align-items: center; gap: 10px;
      background: var(--secondary-background-color); border-radius: 12px; padding: 12px;
    }
    .row ha-icon { --mdc-icon-size: 22px; }
    .row-body { flex: 1; }
    .row-label { font-size: 14px; margin-bottom: 4px; }
    .row input[type="range"] { width: 100%; }
    .row-val { font-size: 13px; font-weight: 500; min-width: 34px; text-align: right; }

    .env-cycle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
    .env-row {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .env-row-head {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 500; margin-bottom: 8px;
    }
    .env-row-head ha-icon { --mdc-icon-size: 20px; }
    /* Night / Day size to their box on the left; a flexible spacer pushes the
       Dead Zone control to the right edge, where it keeps a compact fixed width
       instead of stretching across the whole row. */
    .env-grid {
      display: grid; grid-template-columns: auto auto 1fr auto;
      gap: 8px; align-items: start;
    }
    .env-spacer { min-width: 0; }
    .env-grid > .ctl:last-child { width: 104px; }
    .vpd-grid { display: flex; flex-direction: column; gap: 8px; }
    .vpd-line { display: flex; align-items: center; justify-content: space-between; }
    .vpd-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .vpd-val {
      font-size: 14px; font-weight: 500; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
      padding: 6px 14px; min-width: 96px; text-align: center;
    }
    .outlet {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .outlet-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    }
    .outlet-name { font-size: 14px; font-weight: 500; }
    .outlet-body { display: flex; flex-direction: column; gap: 8px; }
    .ts-editor { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
    .ts-editor .period {
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border-radius: 10px; padding: 8px 10px;
    }
    .ts-editor .period-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px;
    }
    .ts-editor .period-name { font-size: 13px; font-weight: 500; }
    .ts-editor .del {
      background: none; border: none; color: var(--secondary-text-color);
      font-size: 15px; cursor: pointer; line-height: 1; padding: 2px 4px;
    }
    .ts-editor .days {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px;
    }
    .ts-editor .day {
      aspect-ratio: 1; min-width: 0; box-sizing: border-box; border-radius: 50%;
      border: 1px solid var(--divider-color, #555); background: none;
      color: var(--secondary-text-color); font-size: 12px; font-weight: 500;
      cursor: pointer; padding: 0;
    }
    .ts-editor .day.on { color: #fff; }
    .ts-editor .sched-times { display: flex; align-items: flex-end; gap: 8px; }
    .ts-editor .tf { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .ts-editor .tf-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .ts-editor .dash { color: var(--secondary-text-color); padding-bottom: 8px; }
    .ts-editor .tf input[type="time"] {
      width: 100%; box-sizing: border-box; font-size: 14px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 6px 8px;
    }
    .ts-editor .sched-actions { display: flex; gap: 8px; }
    .ts-editor .add {
      flex: 1; background: none; border: 1px dashed var(--divider-color, #555);
      border-radius: 8px; color: var(--secondary-text-color); font-size: 13px;
      padding: 7px; cursor: pointer;
    }

    .alert-note { font-size: 13px; color: var(--secondary-text-color); margin: 4px 2px 0; }
    .set-note { font-size: 13px; color: var(--secondary-text-color); margin: 4px 2px 12px; line-height: 1.5; }
    .seg-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .seg {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      background: var(--secondary-background-color); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 12px;
      padding: 14px 8px; font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .seg ha-icon { --mdc-icon-size: 22px; }
    .seg.on { border-width: 2px; }
    .color-row { display: flex; gap: 10px; margin-top: 10px; }
    .color-field {
      flex: 1; display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 10px;
      padding: 8px 12px; font-size: 13px; color: var(--secondary-text-color);
      cursor: pointer;
    }
    /* Round colour "pinwheel": strip the native swatch chrome to a circle. */
    .pinwheel {
      -webkit-appearance: none; appearance: none;
      width: 30px; height: 30px; padding: 0; cursor: pointer;
      background: none; border: none; border-radius: 50%;
    }
    .pinwheel::-webkit-color-swatch-wrapper { padding: 0; }
    .pinwheel::-webkit-color-swatch {
      border: 2px solid var(--divider-color, #555); border-radius: 50%;
    }
    .pinwheel::-moz-color-swatch {
      border: 2px solid var(--divider-color, #555); border-radius: 50%;
    }
    .alert-row {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .alert-row.off { opacity: 0.6; }
    .alert-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 8px;
    }
    .alert-name { font-size: 14px; font-weight: 500; }
    .alert-vals { display: flex; gap: 14px; }
    .av { display: flex; flex-direction: column; gap: 4px; }
    .av-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .alert-bool {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 12px; margin-bottom: 8px; font-size: 14px;
    }
    .sched-actions { display: flex; align-items: center; gap: 8px; }

    .cali-air {
      display: flex; flex-direction: column; gap: 8px;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px;
    }
    .cali-sub { margin-top: 8px; }
    .cali-empty {
      font-size: 13px; color: var(--secondary-text-color);
      padding: 16px 4px; line-height: 1.4;
    }

    .ctl { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .ctl-label { font-size: 11px; color: var(--secondary-text-color); }
    .ctl-input { display: flex; align-items: center; min-width: 0; }
    .ctl-input input[type="number"],
    .ctl-input input[type="text"],
    .ctl-input input[type="time"],
    .ctl-input select {
      width: 100%; box-sizing: border-box; min-width: 0;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      font-size: 14px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding: 6px 8px;
    }
    /* Mobile browsers render number spin buttons that eat the box width and
       clip the value (e.g. "62" shows as "6"). Remove them. */
    .ctl-input input[type="number"] { appearance: textfield; -moz-appearance: textfield; }
    .ctl-input input[type="number"]::-webkit-outer-spin-button,
    .ctl-input input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    .num-box { display: flex; align-items: center; gap: 4px; }
    /* Wide enough for a 4-digit CO2 target (e.g. 2000) even on mobile. */
    .num-box input[type="number"] {
      width: 4.2em; flex: 0 0 auto; text-align: center; padding-left: 4px; padding-right: 4px;
    }
    .num-box .unit { flex: 0 0 auto; }
    .slider-wrap { display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0; }
    .slider-wrap input[type="range"] { flex: 1; min-width: 0; }
    /* Calibration: slider on the left, editable box on the right, in sync. */
    .slider-box { display: flex; align-items: center; gap: 10px; width: 100%; }
    .slider-box input[type="range"] { flex: 1 1 auto; min-width: 0; }
    .slider-box .num-box { flex: 0 0 auto; }
    .slider-val { font-size: 13px; font-weight: 500; min-width: 40px; text-align: right; }
    .ctl-val { font-size: 14px; }

    .toggle {
      width: 42px; height: 24px; border-radius: 14px; border: none;
      background: var(--disabled-color, #888); position: relative; cursor: pointer;
      transition: background 0.15s; flex: 0 0 auto;
    }
    .toggle::after {
      content: ""; position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left 0.15s;
    }
    .toggle.on::after { left: 21px; }
  `,t([ut({attribute:!1})],jt.prototype,"hass",void 0),t([ft()],jt.prototype,"config",void 0),t([ft()],jt.prototype,"tab",void 0),t([ft()],jt.prototype,"colorMode",void 0),t([ft()],jt.prototype,"colHi",void 0),t([ft()],jt.prototype,"colLo",void 0),t([ft()],jt.prototype,"colorModeIn",void 0),t([ft()],jt.prototype,"colIn",void 0),t([ft()],jt.prototype,"colorDraft",void 0),t([ft()],jt.prototype,"alertsDraft",void 0),t([ft()],jt.prototype,"soilOpen",void 0),t([ft()],jt.prototype,"soilAllOpen",void 0),t([ft()],jt.prototype,"deviceOpen",void 0),t([ft()],jt.prototype,"outletOpen",void 0),t([ft()],jt.prototype,"draft",void 0),t([ft()],jt.prototype,"modePick",void 0),t([ft()],jt.prototype,"outletDraft",void 0),t([ft()],jt.prototype,"logDate",void 0),t([ft()],jt.prototype,"logDev",void 0),t([ft()],jt.prototype,"logType",void 0);class Ut extends ct{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,s={...this._config};e?s.panel=e:delete s.panel,this._emit(s)}_titleChanged(t){const e=t.target.value.trim(),s={...this._config};e?s.title=e:delete s.title,this._emit(s)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const s=e.target.checked,i=new Set(this._config.outlets??[]);s?i.add(t):i.delete(t);const o=[...i].sort(),r={...this._config};o.length?r.outlets=o:delete r.outlets,this._emit(r)}render(){if(!this.hass)return q;const t=this._config,e=t.default_tab,s=kt(this.hass),i=Ct(this.hass,t.panel),o=t=>{const e=Rt(this.hass,t);return e?`${t} — ${e}`:t};return W`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${s.length?q:W`<option value="">(no devices found yet)</option>`}
            ${t.panel?q:W`<option value="" selected>— choose a device —</option>`}
            ${s.map(e=>W`<option value=${e} ?selected=${e===t.panel}>${o(e)}</option>`)}
            ${t.panel&&!s.includes(t.panel)?W`<option value=${t.panel} selected>${t.panel} (not found)</option>`:q}
          </select>
          <span class="hint">Which display panel this card shows.</span>
        </label>

        <label class="field">
          <span class="flabel">Title</span>
          <input type="text" .value=${t.title??""} placeholder="Spider Farmer"
            @change=${this._titleChanged} />
        </label>

        <label class="field">
          <span class="flabel">Default tab</span>
          <select @change=${this._tabChanged}>
            <option value="overview" ?selected=${!e||"overview"===e}>Overview</option>
            <option value="environment" ?selected=${"environment"===e||"config"===e}>Environment</option>
            <option value="outlets" ?selected=${"outlets"===e}>Outlets</option>
            <option value="calibration" ?selected=${"calibration"===e||"cali"===e}>Calibration</option>
            <option value="alerts" ?selected=${"alerts"===e}>Alerts</option>
            <option value="log" ?selected=${"log"===e}>Log</option>
          </select>
        </label>

        ${i.length?W`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${i.map(e=>W`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${o(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:q}
      </div>`}}Ut.styles=n`
    .form { display: flex; flex-direction: column; gap: 16px; padding: 8px 4px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .flabel { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .hint { font-size: 12px; color: var(--secondary-text-color); }
    select, input[type="text"] {
      width: 100%; box-sizing: border-box; font-size: 14px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 8px 10px;
    }
    .checks { display: flex; flex-direction: column; gap: 8px; }
    .check {
      display: flex; align-items: center; gap: 8px; font-size: 14px;
      color: var(--primary-text-color); cursor: pointer;
    }
    .check input { width: 18px; height: 18px; }
  `,t([ut({attribute:!1})],Ut.prototype,"hass",void 0),t([ft()],Ut.prototype,"_config",void 0);const Wt=/^sf_(se\d+)_light$/;function Vt(t){const e=new Set;for(const s of Object.keys(t.states)){if(!s.startsWith("light."))continue;const t=bt(s).match(Wt);t&&e.add(t[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}class Gt extends ct{constructor(){super(...arguments),this.draft=null}setConfig(t){this.config=t}getCardSize(){return 7}static getStubConfig(t){const e=t?Vt(t):[];return{type:"custom:spider-light-card",...e[0]?{light:e[0]}:{}}}accent(){return this.config.accent||gt}seSlot(){return this.config.light||(this.hass?Vt(this.hass)[0]:"")||"se1"}get(t){return this.hass?.states[t]}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("draft")}setBrightness(t){const e=`light.sf_${this.seSlot()}_light`;t<=0?this.hass?.callService("light","turn_off",{entity_id:e}):this.hass?.callService("light","turn_on",{entity_id:e,brightness_pct:t})}toggle(){this.hass?.callService("light","toggle",{entity_id:`light.sf_${this.seSlot()}_light`})}setMode(t){this.hass?.callService("select","select_option",{entity_id:`select.sf_${this.seSlot()}_mode`,option:t})}render(){if(!this.hass||!this.config)return q;const t=this.seSlot(),e=this.get(`light.sf_${t}_light`);if(!e)return W`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light?` for "${this.config.light}"`:""}.
        </div>
      </ha-card>`;const s="on"===e.state,i=s?Math.max(0,Math.min(100,Math.round((e.attributes.brightness??0)/255*100))):0,o=this.get(`select.sf_${t}_mode`),r=o?.state??"",n=Rt(this.hass,t),a=this.accent(),l=i/100,[c,d]=_t(100,100,78,135+270*l);return W`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Light"}</span>
          ${n?W`<span class="device">${n}</span>`:q}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${$t(100,100,78,0,1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${s&&l>0?V`<path d=${$t(100,100,78,0,l)} fill="none"
                  stroke-linecap="round" stroke=${a} stroke-width="15"></path>`:q}
            ${s?V`<circle cx=${c.toFixed(2)} cy=${d.toFixed(2)} r="10"
                  fill="#fff" stroke=${a} stroke-width="3"></circle>`:q}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${s?a:"var(--secondary-text-color)"}>
              ${s?i+"%":"Off"}
            </text>
          </svg>
          <button class="power ${s?"on":""}"
            style=${s?`background:${a}`:""}
            @click=${()=>this.toggle()} aria-label="Toggle light"></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(i)}
            style="accent-color:${a}" data-unit="%"
            @input=${yt}
            @change=${t=>this.setBrightness(Number(t.target.value))} />
          <span class="sl-bub"></span>
        </span>

        ${o?W`<div class="modes">
              ${(o.attributes.options??["Manual","Automatic"]).map(t=>W`<button
                  class="mode ${r===t?"active":""}"
                  style=${r===t?`color:${a};border-color:${a}`:""}
                  @click=${()=>this.setMode(t)}>${t}</button>`)}
            </div>`:q}

        ${"Automatic"===r?this.renderSchedule(t):q}
      </ha-card>`}periodsFor(t){if(this.draft)return this.draft;const e=this.get(`sensor.sf_${t}_schedule`)?.attributes.periods;return Array.isArray(e)?e:[]}edit(t,e){const s=this.draft??this.periodsFor(t),i=JSON.parse(JSON.stringify(s));e(i),this.draft=i}saveSchedule(t){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${t}_light`,periods:this.draft}),this.draft=null)}renderSchedule(t){if(!this.get(`sensor.sf_${t}_schedule`))return this.renderScheduleLegacy(t);const e=this.periodsFor(t),s=null!==this.draft,i=this.accent();return W`
      <div class="section-label">Schedule</div>
      ${e.map((e,s)=>this.renderPeriod(t,e,s,i))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(t,t=>t.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          + Add period
        </button>
        ${s?W`<button class="save-btn" style="background:${i}"
                @click=${()=>this.saveSchedule(t)}>Apply</button>
              <button class="discard-btn" @click=${()=>this.draft=null}>Discard</button>`:q}
      </div>`}renderPeriod(t,e,s,i){return W`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${s+1}</span>
          <button class="del" aria-label="Delete period"
            @click=${()=>this.edit(t,t=>t.splice(s,1))}>✕</button>
        </div>
        <div class="days">
          ${mt.map((o,r)=>W`<button
              class="day ${e.days.includes(r)?"on":""}"
              style=${e.days.includes(r)?`background:${i};border-color:${i}`:""}
              @click=${()=>this.edit(t,t=>{const e=t[s].days,i=e.indexOf(r);i>=0?e.splice(i,1):e.push(r),e.sort((t,e)=>t-e)})}>${o}</button>`)}
        </div>
        <div class="sched-times">
          <div class="tf">
            <span class="tf-lbl">Start</span>
            <input type="time" .value=${e.start}
              @change=${e=>this.edit(t,t=>{t[s].start=e.target.value})} />
          </div>
          <span class="dash">—</span>
          <div class="tf">
            <span class="tf-lbl">Stop</span>
            <input type="time" .value=${e.end}
              @change=${e=>this.edit(t,t=>{t[s].end=e.target.value})} />
          </div>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Brightness</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${String(e.brightness)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.edit(t,t=>{t[s].brightness=Number(e.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${e.brightness}%</span>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Sun fade</span>
          <span class="sl-live">
            <input type="range" min="0" max="30" .value=${String(e.fade)}
              style="accent-color:${i}" data-unit="m"
              @input=${yt}
              @change=${e=>this.edit(t,t=>{t[s].fade=Number(e.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${e.fade}m</span>
        </div>
      </div>`}renderScheduleLegacy(t){const e=this.get(`text.sf_${t}_schedule_start`),s=this.get(`text.sf_${t}_schedule_stop`),i=this.get(`number.sf_${t}_schedule_brightness`),o=this.get(`number.sf_${t}_sunrise_sunset_fade`);return e||s||i||o?W`
      <div class="section-label">Schedule</div>
      ${e||s?W`<div class="sched-times">
            ${this.timeField(`text.sf_${t}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${t}_schedule_stop`,"Stop")}
          </div>`:q}
      ${i?this.numRow(`number.sf_${t}_schedule_brightness`,"Brightness",i):q}
      ${o?this.numRow(`number.sf_${t}_sunrise_sunset_fade`,"Sunrise / sunset fade",o):q}`:q}timeField(t,e){const s=this.get(t);if(!s)return q;const i="unknown"===s.state||"unavailable"===s.state?"":s.state;return W`<div class="tf">
      <span class="tf-lbl">${e}</span>
      <input type="time" .value=${i}
        @change=${e=>this.hass?.callService("text","set_value",{entity_id:t,value:e.target.value})} />
    </div>`}numRow(t,e,s){const i=s.attributes.min??0,o=s.attributes.max??100,r=s.attributes.step??1,n=s.attributes.unit_of_measurement??"",a="unknown"===s.state||"unavailable"===s.state?"":s.state;return W`<div class="num-row">
      <span class="nr-lbl">${e}</span>
      <span class="sl-live">
        <input type="range" min=${i} max=${o} step=${r} .value=${String(a)}
          style="accent-color:${this.accent()}" data-unit=${n}
          @input=${yt}
          @change=${e=>this.hass?.callService("number","set_value",{entity_id:t,value:Number(e.target.value)})} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${a}${n}</span>
    </div>`}}Gt.styles=n`
    ${wt}
    ha-card { padding: 12px 14px 16px; }
    .header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .header .title { font-size: 18px; font-weight: 500; }
    .header .device { font-size: 12px; color: var(--secondary-text-color); }
    .empty { color: var(--secondary-text-color); font-size: 14px; padding: 16px 4px; }
    .gauge { position: relative; width: 100%; max-width: 300px; margin: 0 auto; }
    .gauge svg { width: 100%; height: auto; display: block; }
    .gauge .track { stroke: var(--divider-color, #444); stroke-width: 15; }
    .gauge .gval { font-size: 34px; font-weight: 500; }
    .power {
      position: absolute; left: 50%; bottom: 6%; transform: translateX(-50%);
      width: 54px; height: 28px; border-radius: 16px; border: none; cursor: pointer;
      background: var(--disabled-color, #666); transition: background 0.15s;
    }
    .power::after {
      content: ""; position: absolute; top: 3px; left: 3px;
      width: 22px; height: 22px; border-radius: 50%; background: #fff;
      transition: left 0.15s;
    }
    .power.on::after { left: 29px; }
    .bri { width: 100%; margin: 4px 0 12px; }
    .modes {
      display: flex; gap: 4px; background: var(--secondary-background-color);
      border-radius: 20px; padding: 4px; margin-bottom: 4px;
    }
    .mode {
      flex: 1; background: none; border: 1px solid transparent; border-radius: 16px;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 4px; cursor: pointer;
    }
    .mode.active { background: var(--card-background-color, rgba(0,0,0,0.2)); }
    .section-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 2px 8px;
    }
    .sched-times { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 10px; }
    .tf { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .tf-lbl, .nr-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .dash { color: var(--secondary-text-color); padding-bottom: 8px; }
    .tf input[type="time"], .num-row input[type="range"] { width: 100%; box-sizing: border-box; }
    .tf input[type="time"] {
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px;
      padding: 6px 8px; font-size: 14px;
    }
    .num-row {
      display: grid; grid-template-columns: auto 1fr auto; gap: 10px;
      align-items: center; padding: 6px 0;
    }
    .nr-val { font-size: 14px; font-weight: 500; min-width: 46px; text-align: right; }
    .period {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .period-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 8px;
    }
    .period-name { font-size: 14px; font-weight: 500; }
    .del {
      background: none; border: none; color: var(--secondary-text-color);
      font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;
    }
    .days {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
      margin-bottom: 10px;
    }
    .day {
      aspect-ratio: 1; min-width: 0; box-sizing: border-box; border-radius: 50%;
      border: 1px solid var(--divider-color, #555); background: none;
      color: var(--secondary-text-color); font-size: 12px; font-weight: 500;
      cursor: pointer; padding: 0;
    }
    .day.on { color: #fff; }
    .sched-actions { display: flex; gap: 8px; margin-top: 4px; }
    .add {
      flex: 1; background: none; border: 1px dashed var(--divider-color, #555);
      border-radius: 8px; color: var(--secondary-text-color); font-size: 14px;
      padding: 8px; cursor: pointer;
    }
    .save-btn, .discard-btn {
      font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      border-radius: 8px; padding: 6px 16px; border: none;
    }
    .save-btn { color: #fff; }
    .save-btn[disabled] {
      background: var(--divider-color, #444) !important; color: var(--secondary-text-color);
      cursor: default;
    }
    .discard-btn {
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444) !important;
    }
    .discard-btn[disabled] { opacity: 0.5; cursor: default; }
  `,t([ut({attribute:!1})],Gt.prototype,"hass",void 0),t([ft()],Gt.prototype,"config",void 0),t([ft()],Gt.prototype,"draft",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",jt),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Ut),customElements.get("spider-light-card")||customElements.define("spider-light-card",Gt),window.customCards=window.customCards||[],window.customCards.push({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),window.customCards.push({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.17.23 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const t=["spider-farmer-card","spider-light-card"],e=new Set([...t,...t.map(t=>`custom:${t}`)]),s=()=>{const t=[["spider-farmer-card",jt],["spider-farmer-card-editor",Ut],["spider-light-card",Gt]];for(const[e,s]of t)if(!customElements.get(e))try{customElements.define(e,s)}catch{}},i=()=>{let t=0;for(const s of(()=>{const t=[],e=new Set,s=i=>{if(!i||e.has(i))return;e.add(i);let o=[];try{o=i.querySelectorAll("hui-error-card")}catch{return}o.forEach(e=>t.push(e));let r=[];try{r=i.querySelectorAll("*")}catch{return}r.forEach(t=>{const e=t.shadowRoot;e&&s(e)})};return s(document),t})()){const i=s._config||{},o=i.origConfig&&i.origConfig.type||i.type||"";e.has(o)&&(s.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),t++)}return t};let o=0;const r=()=>{s(),i(),++o<12&&setTimeout(r,250)},n=()=>{s(),r()};"complete"===document.readyState?n():window.addEventListener("load",n,{once:!0})})();export{jt as SpiderFarmerCard,Ut as SpiderFarmerCardEditor,Gt as SpiderLightCard};
