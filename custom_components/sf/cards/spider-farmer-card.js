/*! spider-farmer-card v0.21.44 | MIT */
function t(t,e,s,i){var o,a=arguments.length,n=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(n=(a<3?o(n):a>3?o(e,s,n):o(e,s))||n);return a>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(s,t,i)},r=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,b=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);o?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const a=o.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const a=this.constructor;if(!1===i&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[b("elementProperties")]=new Map,y[b("finalized")]=new Map,v?.({ReactiveElement:y}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,k=w.trustedTypes,O=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+D,T=`<${M}>`,N=document,L=()=>N.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,A="[ \t\n\f\r]",E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,z=/>/g,B=RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,I=/"/g,V=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),Q=W(1),j=W(2),q=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),G=new WeakMap,K=N.createTreeWalker(N,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==O?O.createHTML(e):e}const Y=(t,e)=>{const s=t.length-1,i=[];let o,a=2===e?"<svg>":3===e?"<math>":"",n=E;for(let e=0;e<s;e++){const s=t[e];let r,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===E?"!--"===l[1]?n=F:void 0!==l[1]?n=z:void 0!==l[2]?(V.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=B):void 0!==l[3]&&(n=B):n===B?">"===l[0]?(n=o??E,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?B:'"'===l[3]?I:H):n===I||n===H?n=B:n===F||n===z?n=E:(n=B,o=void 0);const h=n===B&&t[e+1].startsWith("/>")?" ":"";a+=n===E?s+T:c>=0?(i.push(r),s.slice(0,c)+C+s.slice(c)+D+h):s+D+(-2===c?e:h)}return[J(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,a=0;const n=t.length-1,r=this.parts,[l,c]=Y(t,e);if(this.el=X.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&r.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[a++],s=i.getAttribute(t).split(D),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?it:"?"===n[1]?ot:"@"===n[1]?at:st}),i.removeAttribute(t)}else t.startsWith(D)&&(r.push({type:6,index:o}),i.removeAttribute(t));if(V.test(i.tagName)){const t=i.textContent.split(D),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],L()),K.nextNode(),r.push({type:2,index:++o});i.append(t[e],L())}}}else if(8===i.nodeType)if(i.data===M)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(D,t+1));)r.push({type:7,index:o}),t+=D.length-1}o++}}static createElement(t,e){const s=N.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const a=P(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??N).importNode(e,!0);K.currentNode=i;let o=K.nextNode(),a=0,n=0,r=s[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new et(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new nt(o,this,t)),this._$AV.push(e),r=s[++n]}a!==r?.index&&(o=K.nextNode(),a++)}return K.currentNode=N,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),P(t)?t===U||null==t||""===t?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new X(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(L()),this.O(L()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=U}_$AI(t,e=this,s,i){const o=this.strings;let a=!1;if(void 0===o)t=Z(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const i=t;let n,r;for(t=o[0],n=0;n<o.length-1;n++)r=Z(this,i[s+n],e,n),r===q&&(r=this._$AH[n]),a||=!P(r)||r!==this._$AH[n],r===U?t=U:t!==U&&(t+=(r??"")+o[n+1]),this._$AH[n]=r}a&&!i&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class at extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??U)===q)return;const s=this._$AH,i=t===U&&s!==U||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==U&&(s===U||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(X,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(L(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},pt=(t=ht,e,s)=>{const{kind:i,metadata:o}=s;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),a.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,s)=>"object"==typeof s?pt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return ut({...t,state:!0,attribute:!1})}const mt="#ff7a1a",ft=["S","M","T","W","T","F","S"],vt=/^sf_(dp\d+|ac5|ac10|st\d+)_/;function bt(t){return t.split(".")[1]??""}function _t(t,e,s,i){const o=i*Math.PI/180;return[t+s*Math.cos(o),e+s*Math.sin(o)]}function $t(t,e,s,i,o){const a=135+270*i,n=135+270*o,[r,l]=_t(t,e,s,a),[c,d]=_t(t,e,s,n),h=n-a>180?1:0;return`M ${r.toFixed(2)} ${l.toFixed(2)} A ${s} ${s} 0 ${h} 1 ${c.toFixed(2)} ${d.toFixed(2)}`}function xt(t){const e=t.currentTarget,s=e.parentElement?.querySelector(".sl-bub");if(!s)return;const i=Number(e.min||"0"),o=Number(e.max||"100"),a=Number(e.value),n=o>i?(a-i)/(o-i):0,r=function(t){const e=String(t),s=e.indexOf(".");return s>=0?e.length-s-1:0}(Number(e.step||"1")),l=Number.isFinite(a)?a.toFixed(r):e.value;s.textContent="1"===e.dataset.off&&a<=i?"off":`${l}${e.dataset.unit??""}`,s.style.left=`calc(${n} * (100% - 18px) + 9px)`}const yt=n`
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
`;function wt(t){const e=new Set;for(const s of Object.keys(t.states)){const t=bt(s).match(vt);t&&e.add(t[1])}return[...e].sort()}function St(t){return wt(t).filter(e=>/^(ac|st)\d/.test(e)&&!!t.states[`switch.sf_${e}_outlet_1`]||Object.keys(t.states).some(t=>{const s=bt(t);return s===`sf_${e}_temperature`||s===`sf_${e}_soil_avg_temperature`||s===`sf_${e}_light_1`||s===`sf_${e}_fan`||s===`sf_${e}_blower`}))}function kt(t){return wt(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}function Ot(t,e){const s=`sf_${e}_`,i=Object.keys(t.states);return i.find(t=>bt(t)===`sf_${e}_temperature`)??i.find(t=>{const i=bt(t);return i.startsWith(s)&&!i.startsWith(`sf_${e}_env_`)})}function Ct(t,e){const s=Ot(t,e);return s?t.entities?.[s]?.device_id:void 0}function Dt(t,e){if(!e)return[];const s=Ct(t,e);return s?kt(t).filter(i=>{if(i===e)return!1;const o=Ct(t,i),a=o?t.devices?.[o]:void 0;return a?.via_device_id===s}):[]}function Mt(t,e){if(!t||!e)return"";const s=Ot(t,e);if(!s)return"";const i=t.entities?.[s]?.device_id,o=i?t.devices?.[i]:void 0;if(o)return o.name_by_user||o.name||"";const a=(t.states[s].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return a?a[1]:""}const Tt=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","Air VPD","mdi:water-opacity"],["leaf_vpd","Leaf VPD","mdi:leaf"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Nt={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},Lt={temperature:"temp",humidity:"humi",co2:"co2"},Pt="#ff6b6b",Rt="rgba(255,107,107,0.16)",At=(t,e=.16)=>{const s=/^#?([0-9a-fA-F]{6})$/.exec((t||"").trim());if(!s)return`rgba(255,107,107,${e})`;const i=parseInt(s[1],16);return`rgba(${i>>16&255},${i>>8&255},${255&i},${e})`},Et=t=>"string"==typeof t&&/^#[0-9a-fA-F]{6}$/.test(t),Ft=t=>"alarms"===t||"targets"===t||"both"===t,zt=mt,Bt={"Time Slot":["ts_type","ts_start","ts_stop"],Cycle:["cycle_start","cycle_run","cycle_off","cycle_times"],Temperature:["temp_device"],Humidity:["humidity_device"],CO2:["co2_device"],"Drip Irrigation":["drip_soil","drip_avg"],Manual:[]},Ht=[{label:"General device",mode:"Manual",cfg:{dev_type:"0"}},{label:"Timer period",mode:"Time Slot",cfg:{dev_type:"1"}},{label:"Timer loop",mode:"Cycle",cfg:{dev_type:"2"}},{label:"Blower",mode:"Blower (Temperature Priority)",cfg:{dev_type:"3"}},{label:"Humidification",mode:"Humidity",cfg:{dev_type:"4",humidity_device:"Humidifying"}},{label:"Dehumidification",mode:"Humidity",cfg:{dev_type:"5",humidity_device:"Dehumidifying"}},{label:"Heater",mode:"Temperature",cfg:{dev_type:"6",temp_device:"Heating"}},{label:"Cooler",mode:"Temperature",cfg:{dev_type:"7",temp_device:"Cooling"}},{label:"CO2 Injection",mode:"CO2",cfg:{dev_type:"8",co2_device:"Aeration"}},{label:"Exhaust fan",mode:"CO2",cfg:{dev_type:"9",co2_device:"Exhaust"}}],It={"Temperature Priority":"Blower (Temperature Priority)","Humidity Priority":"Blower (Humidity Priority)"},Vt=new Set(["Blower","Humidification","Dehumidification","Heater","Cooler","CO2 Injection","Exhaust fan"]),Wt=mt,Qt=t=>!!t&&("unavailable"===t.state||"unknown"===t.state),jt=t=>{const e=(t||"").match(/^(\d{1,2}):(\d{2})$/);if(!e)return null;const s=+e[1],i=+e[2];return s<=23&&i<=59?60*s+i:null},qt=(t,e,s,i,o="",a=!1)=>Q`<div class="save-bar ${o}">
  ${((t,e,s,i,o=!1)=>Q`
  <button class="save-btn" ?disabled=${!e||o}
    style=${e&&!o?`background:${t}`:""}
    @click=${s}>${o?Q`<span class="save-spin"></span>Saving…`:"Apply"}</button>
  <button class="discard-btn" ?disabled=${!e||o}
    @click=${i}>Discard</button>`)(t,e,s,i,a)}
</div>`,Ut=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],Gt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],Kt=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],Jt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class Yt extends ct{constructor(){super(...arguments),this.tab="overview",this.envSubView=null,this.planDraft=null,this.planEditStage=null,this.planShowAll=!1,this.planTplOpen=null,this.planTplName="",this._tplMsg="",this._tplMsgT=null,this.planDelArm=!1,this.colorMode="off",this.colHi=Pt,this.colLo="#45b6ff",this.colorModeIn="off",this.colIn="#4caf7d",this.colWarn="#ffb300",this.colorSource="alarms",this.showTrend=!1,this.showBand=!1,this.showTargets=!0,this.tileSummary=!1,this.hour12=!1,this.customOutletNames=!1,this.outletNames={},this.showConn=!1,this.connCustom=!1,this.connSignal="",this.showOutletsLog=!1,this.showVpd=!1,this.showLeafVpd=!0,this._colorOpen=!1,this._tsOpen=!1,this._cdOpen=!1,this._setOverviewOpen=!1,this._setExtrasOpen=!1,this._setConnOpen=!1,this._setVpdOpen=!1,this._setDevOpen=!1,this._setOutletOpen=!1,this._setLayoutOpen=!1,this.vpdLeaf=!1,this.vpdStage="veg",this.vpdView="grid",this.vpdHighlight=!1,this.vpdPlanSource=!1,this.vpdCustom=[1,1.4],this.ologRange=24,this.ologOpen=null,this._olog={},this._ologLoading={},this._ologVer=0,this._saving=!1,this._savingT=null,this._savingAt=0,this._savingWatch=[],this.outletCopyOpen=!1,this.outletCopySel={},this.outletCopyFromOpen=!1,this.showOutletQuick=!1,this.outletQuickRemember=!1,this.outletQuickNames=!1,this._olqMem={},this.showDeviceLog=!1,this.showDeviceQuick=!1,this.deviceQuickRemember=!1,this.dlogOpen=null,this._dlqMem={},this._devOff={},this._cdTick=0,this.customLayout=!1,this.cardScale=100,this.tileCols=3,this.tileRadius=12,this.tileBorderW=1,this.tileBorderCol="",this.tileBg="",this.taTiles=!0,this.taDevices=!0,this.taOutlets=!0,this.cooldownShow=!1,this.cooldownDevice=!0,this.cooldownOutlet=!1,this.cooldownSecs=180,this.outletsOnOverview=!1,this.tempSource="sf",this.extTemp="",this.extHumi="",this._smartOpen=!1,this.smart={},this.paramOpen=null,this._hist={},this._graph={},this._graphLoading={},this._graphVer=0,this.graphRange=6,this._graphSel=null,this._graphPin=null,this.hideLight2=!1,this.outletColorMode="off",this.ocManual=zt,this.ocSched="#45b6ff",this.ocEnv="#4caf7d",this.ocDrip="#3cc8d0",this.deviceColorMode="off",this.dcManual=Wt,this.dcSched="#45b6ff",this.dcAuto="#4caf7d",this._colorSynced=!1,this.colorDraft=null,this.alertsDraft=null,this.soilOpen=null,this.soilAllOpen=!1,this.deviceOpen=null,this.outletOpen=null,this.draft={},this.modePick={},this.outletDraft={},this.outletNameDraft={},this.outletCfgDraft={},this._stDt={},this.leafSpots=[],this.leafCalTarget="day",this.logDate=null,this.logDev="all",this.logType="all",this._myTpl=null}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"outlets_log"===e?"olog":"device_log"===e?"dlog":"vpd"===e?"vpd":"calibration"===e||"cali"===e?"cali":"alerts"===e?"alerts":"log"===e?"log":"overview";const s=t.alarm_colors;let i="tile"===s||"text"===s?s:"off";try{const e=localStorage.getItem(`sf-colors-${t.panel}`);if("off"===e||"tile"===e||"text"===e)i=e;else if(e){const t=JSON.parse(e);"off"!==t.mode&&"tile"!==t.mode&&"text"!==t.mode||(i=t.mode),"off"!==t.modeIn&&"tile"!==t.modeIn&&"text"!==t.modeIn||(this.colorModeIn=t.modeIn),Et(t.hi)&&(this.colHi=t.hi),Et(t.lo)&&(this.colLo=t.lo),Et(t.in)&&(this.colIn=t.in),"boolean"==typeof t.hide2&&(this.hideLight2=t.hide2),"off"!==t.omode&&"tile"!==t.omode&&"text"!==t.omode||(this.outletColorMode=t.omode),Et(t.ocManual)&&(this.ocManual=t.ocManual),Et(t.ocSched)&&(this.ocSched=t.ocSched),Et(t.ocEnv)&&(this.ocEnv=t.ocEnv),Et(t.ocDrip)&&(this.ocDrip=t.ocDrip),"off"!==t.dmode&&"tile"!==t.dmode&&"text"!==t.dmode||(this.deviceColorMode=t.dmode),Et(t.dcManual)&&(this.dcManual=t.dcManual),Et(t.dcSched)&&(this.dcSched=t.dcSched),Et(t.dcAuto)&&(this.dcAuto=t.dcAuto),Ft(t.source)&&(this.colorSource=t.source),Et(t.warn)&&(this.colWarn=t.warn),"boolean"==typeof t.showTrend&&(this.showTrend=t.showTrend),"boolean"==typeof t.showBand&&(this.showBand=t.showBand),"boolean"==typeof t.showTargets&&(this.showTargets=t.showTargets),"boolean"==typeof t.tileSummary&&(this.tileSummary=t.tileSummary),"boolean"==typeof t.hour12&&(this.hour12=t.hour12),"boolean"==typeof t.showConn&&(this.showConn=t.showConn),"boolean"==typeof t.connCustom&&(this.connCustom=t.connCustom),"string"==typeof t.connSignal&&(this.connSignal=t.connSignal),"boolean"==typeof t.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog),"boolean"==typeof t.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick),"boolean"==typeof t.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember),"boolean"==typeof t.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames),"boolean"==typeof t.showVpd&&(this.showVpd=t.showVpd),"boolean"==typeof t.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd),"boolean"==typeof t.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf),"boolean"==typeof t.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog),"boolean"==typeof t.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick),"boolean"==typeof t.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember),"boolean"==typeof t.customNames&&(this.customOutletNames=t.customNames),t.outletNames&&"object"==typeof t.outletNames&&(this.outletNames=t.outletNames),"boolean"==typeof t.customLayout&&(this.customLayout=t.customLayout),"number"==typeof t.scale&&t.scale>=70&&t.scale<=150&&(this.cardScale=t.scale),"number"==typeof t.cols&&t.cols>=2&&t.cols<=5&&(this.tileCols=t.cols)}}catch{}this.colorMode=i,this._colorSynced=!1}serverColors(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;if(!t)return{};const e=t=>"off"===t||"tile"===t||"text"===t,s={};if(t.colors&&e(t.colors)&&(s.mode=t.colors),t.colors_in&&e(t.colors_in)&&(s.modeIn=t.colors_in),Ft(t.color_source)&&(s.source=t.color_source),Et(t.color_warn)&&(s.warn=t.color_warn),"1"!==t.show_conn&&"0"!==t.show_conn||(s.showConn="1"===t.show_conn),"1"!==t.conn_custom&&"0"!==t.conn_custom||(s.connCustom="1"===t.conn_custom),"string"==typeof t.conn_signal&&(s.connSignal=t.conn_signal),"1"!==t.outlets_log&&"0"!==t.outlets_log||(s.showOutletsLog="1"===t.outlets_log),"1"!==t.outlet_quick&&"0"!==t.outlet_quick||(s.showOutletQuick="1"===t.outlet_quick),"1"!==t.outlet_quick_remember&&"0"!==t.outlet_quick_remember||(s.outletQuickRemember="1"===t.outlet_quick_remember),"1"!==t.outlet_quick_names&&"0"!==t.outlet_quick_names||(s.outletQuickNames="1"===t.outlet_quick_names),"1"!==t.vpd_graph&&"0"!==t.vpd_graph||(s.showVpd="1"===t.vpd_graph),"1"!==t.vpd_leaf&&"0"!==t.vpd_leaf||(s.vpdLeaf="1"===t.vpd_leaf),"1"!==t.leaf_vpd_tile&&"0"!==t.leaf_vpd_tile||(s.showLeafVpd="1"===t.leaf_vpd_tile),"1"!==t.device_log&&"0"!==t.device_log||(s.showDeviceLog="1"===t.device_log),"1"!==t.device_quick&&"0"!==t.device_quick||(s.showDeviceQuick="1"===t.device_quick),"1"!==t.device_quick_remember&&"0"!==t.device_quick_remember||(s.deviceQuickRemember="1"===t.device_quick_remember),t.graph_range&&(s.graphRange=Number(t.graph_range)||6),void 0!==t.tile_radius&&""!==t.tile_radius&&(s.tileRadius=Number(t.tile_radius)),void 0!==t.tile_border_w&&""!==t.tile_border_w&&(s.tileBorderW=Number(t.tile_border_w)),Et(t.tile_border_col)?s.tileBorderCol=t.tile_border_col:""===t.tile_border_col&&(s.tileBorderCol=""),Et(t.tile_bg)?s.tileBg=t.tile_bg:""===t.tile_bg&&(s.tileBg=""),"1"!==t.ta_tiles&&"0"!==t.ta_tiles||(s.taTiles="1"===t.ta_tiles),"1"!==t.ta_devices&&"0"!==t.ta_devices||(s.taDevices="1"===t.ta_devices),"1"!==t.ta_outlets&&"0"!==t.ta_outlets||(s.taOutlets="1"===t.ta_outlets),"1"!==t.cooldown_show&&"0"!==t.cooldown_show||(s.cooldownShow="1"===t.cooldown_show),"1"!==t.cooldown_device&&"0"!==t.cooldown_device||(s.cooldownDevice="1"===t.cooldown_device),"1"!==t.cooldown_outlet&&"0"!==t.cooldown_outlet||(s.cooldownOutlet="1"===t.cooldown_outlet),void 0!==t.cooldown_secs&&""!==t.cooldown_secs&&(s.cooldownSecs=Number(t.cooldown_secs)),"1"!==t.overview_outlets&&"0"!==t.overview_outlets||(s.outletsOnOverview="1"===t.overview_outlets),"sf"!==t.temp_source&&"external"!==t.temp_source||(s.tempSource=t.temp_source),"string"==typeof t.ext_temp&&(s.extTemp=t.ext_temp),"string"==typeof t.ext_humi&&(s.extHumi=t.ext_humi),"string"==typeof t.smart)try{s.smart=JSON.parse(t.smart)}catch{}"1"!==t.show_trend&&"0"!==t.show_trend||(s.showTrend="1"===t.show_trend),"1"!==t.show_band&&"0"!==t.show_band||(s.showBand="1"===t.show_band),"1"!==t.show_targets&&"0"!==t.show_targets||(s.showTargets="1"===t.show_targets),"1"!==t.tile_summary&&"0"!==t.tile_summary||(s.tileSummary="1"===t.tile_summary),"1"!==t.time_12h&&"0"!==t.time_12h||(s.hour12="1"===t.time_12h),Et(t.color_hi)&&(s.hi=t.color_hi),Et(t.color_lo)&&(s.lo=t.color_lo),Et(t.color_in)&&(s.in=t.color_in),"1"!==t.hide_light2&&"0"!==t.hide_light2||(s.hide2="1"===t.hide_light2),"1"!==t.custom_outlet_names&&"0"!==t.custom_outlet_names||(s.customNames="1"===t.custom_outlet_names),"1"!==t.custom_layout&&"0"!==t.custom_layout||(s.customLayout="1"===t.custom_layout);const i=parseInt(t.card_scale,10);Number.isFinite(i)&&i>=70&&i<=150&&(s.scale=i);const o=parseInt(t.tile_cols,10);return Number.isFinite(o)&&o>=2&&o<=5&&(s.cols=o),t.outlet_colors&&e(t.outlet_colors)&&(s.omode=t.outlet_colors),Et(t.oc_manual)&&(s.ocManual=t.oc_manual),Et(t.oc_sched)&&(s.ocSched=t.oc_sched),Et(t.oc_env)&&(s.ocEnv=t.oc_env),Et(t.oc_drip)&&(s.ocDrip=t.oc_drip),t.device_colors&&e(t.device_colors)&&(s.dmode=t.device_colors),Et(t.dc_manual)&&(s.dcManual=t.dc_manual),Et(t.dc_sched)&&(s.dcSched=t.dc_sched),Et(t.dc_auto)&&(s.dcAuto=t.dc_auto),s}serverOutletNames(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e={};if(!t)return e;for(const[s,i]of Object.entries(t))s.startsWith("outlet_name_")&&"string"==typeof i&&(e[s.slice(12)]=i);return e}connInfo(){let t=null,e=!1,s=!1;if(this.connCustom&&this.connSignal){const s=this.get(this.connSignal);if(s){const i=Number(s.state);Number.isFinite(i)&&(t=i),e="unavailable"!==s.state&&"unknown"!==s.state&&"off"!==s.state}}else{const i=this.get(`sensor.sf_${this.config.panel}_alarm_settings`);if(i){s=!0===i.attributes.eth_online;const o=i.attributes.wifi_rssi;"number"==typeof o&&(t=o);const a=i.attributes.wifi_online;e=s||("boolean"==typeof a?a:"unavailable"!==i.state&&"unknown"!==i.state)}}let i=0,o="var(--secondary-text-color)";return null!=t&&(t>=-60?(i=4,o="#54c06a"):t>=-67?(i=3,o="#54c06a"):t>=-75?(i=2,o="#e0b23a"):(i=1,o="#e2544f")),{online:e,rssi:t,bars:i,color:o,wired:s}}renderConn(){if(!this.showConn)return U;const t=this.connInfo(),e=t.online?"#54c06a":"#e2544f",s=Q`<span class="conn-st" style="color:${e}">
        <span class="conn-dot" style="background:${e}"></span>${t.online?"Online":"Offline"}
      </span>`;if(t.wired)return Q`<span class="conn">${s}
        <ha-icon class="conn-eth" icon="mdi:ethernet"
          style="color:${e}" title="Wired (Ethernet)"></ha-icon>
      </span>`;const i=[1,2,3,4].map(e=>{const s=3+2*e;return j`<rect x=${4*(e-1)} y=${12-s} width="3" height=${s} rx="1"
        fill=${e<=t.bars?t.color:"var(--divider-color, #3a3e44)"}></rect>`});return Q`<span class="conn">${s}
      <svg width="15" height="12" viewBox="0 0 15 12" aria-label="signal">${i}</svg>
    </span>`}signalEntityOptions(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("sensor.")&&"signal_strength"===this.hass.states[t].attributes.device_class).sort().map(t=>({id:t,name:this.hass.states[t].attributes.friendly_name||t})):[]}persistColorOption(t,e){const s=`sensor.sf_${this.config.panel}_alarm_settings`;this.get(s)&&this.hass?.callService("sf","set_card_option",{entity_id:s,key:t,value:e})}cacheColors(){try{localStorage.setItem(`sf-colors-${this.config.panel}`,JSON.stringify({mode:this.colorMode,modeIn:this.colorModeIn,source:this.colorSource,warn:this.colWarn,showTrend:this.showTrend,showBand:this.showBand,showTargets:this.showTargets,tileSummary:this.tileSummary,hour12:this.hour12,showConn:this.showConn,connCustom:this.connCustom,connSignal:this.connSignal,showOutletsLog:this.showOutletsLog,showOutletQuick:this.showOutletQuick,outletQuickRemember:this.outletQuickRemember,outletQuickNames:this.outletQuickNames,showVpd:this.showVpd,vpdLeaf:this.vpdLeaf,showLeafVpd:this.showLeafVpd,showDeviceLog:this.showDeviceLog,showDeviceQuick:this.showDeviceQuick,deviceQuickRemember:this.deviceQuickRemember,hi:this.colHi,lo:this.colLo,in:this.colIn,hide2:this.hideLight2,omode:this.outletColorMode,ocManual:this.ocManual,ocSched:this.ocSched,ocEnv:this.ocEnv,ocDrip:this.ocDrip,dmode:this.deviceColorMode,dcManual:this.dcManual,dcSched:this.dcSched,dcAuto:this.dcAuto,customNames:this.customOutletNames,outletNames:this.outletNames,customLayout:this.customLayout,scale:this.cardScale,cols:this.tileCols}))}catch{}}layoutStyle(){const t=[];return this.customLayout&&(t.push(`--sf-cols:${this.tileCols}`),100!==this.cardScale&&t.push(`zoom:${(this.cardScale/100).toFixed(2)}`)),12!==this.tileRadius&&t.push(`--sf-tile-radius:${this.tileRadius}px`),this.tileBorderW>0&&t.push(`--sf-tile-bw:${this.tileBorderW}px`),this.tileBorderCol&&t.push(`--sf-tile-bc:${this.tileBorderCol}`),this.tileBg&&t.push(`--sf-tile-bg:${this.tileBg}`),t.join(";")}outOfRange(t,e){const s=this.alertsSettings();if(!s||!Number.isFinite(e))return null;const i=[...s.climate||[],...s.substrate||[]].find(e=>e&&e.key===t);if(!i||!i.enabled)return null;const o=Number(i.max),a=Number(i.min);return Number.isFinite(o)&&e>o?"above":Number.isFinite(a)&&e<a?"below":null}colorForOor(t){return"above"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colHi,state:"above"}:"below"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colLo,state:"below"}:"near"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colWarn,state:"near"}:"off"===this.colorModeIn?null:{mode:this.colorModeIn,color:this.colIn,state:"in"}}readingColor(t,e){const s=parseFloat(e);return Number.isFinite(s)?this.colorForOor(t?this.outOfRange(t,s):null):null}leafVpdRange(){const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max")),s=t=>t&&Number.isFinite(+t.state)?+t.state:null;return{min:s(t),max:s(e)}}planStageCurrent(){const t=this.planInfo();if(!t.active||!t.stages.length)return null;const e=t.progress?t.progress.stageId:void 0;return t.stages.find(t=>t.stageId===e)||t.stages[0]}ppfdPlanTargetSub(){let t=!1;try{t=!!this.planInfo().active}catch{t=!1}if(!t)return U;const e=this.config.panel;for(const t of["light_1","light_2"]){const s=this.modeOf(`select.sf_${e}_${t}_mode`,"");if("PPFD"!==s&&"PPFD - Plan"!==s)continue;const i=Number(this.get(`number.sf_${e}_${t}_ppfd_target`)?.state);if(Number.isFinite(i)&&i>0)return Q`<div class="tile-target">target ${Math.round(i)} µmol</div>`}return U}targetInfo(t){const e=Lt[t];if(!e)return null;const s=this.config.panel,i=!1!==this.cycleIsDay(),o=this.planStageCurrent();if(o){const t=o[`${e}_${i?"day":"night"}`];if(null!=t&&Number.isFinite(Number(t))){let i=Number(t),a=Number(o[`${e}_dz`]);if("temp"===e){const t=this.get(`number.sf_${s}_env_temp_day`)?.attributes?.unit_of_measurement;"°F"!==t&&"℉"!==t||(i=9*i/5+32,Number.isFinite(a)&&(a=9*a/5))}return Number.isFinite(a)||(a=Number(this.get(`number.sf_${s}_env_${e}_deadband`)?.state??0)||0),{target:Math.round(10*i)/10,dead:Math.round(10*a)/10}}}const a=this.get(`number.sf_${s}_env_${e}_${i?"day":"night"}`),n=this.get(`number.sf_${s}_env_${e}_deadband`);if(!a||!n)return null;const r=parseFloat(a.state),l=parseFloat(n.state);return Number.isFinite(r)&&Number.isFinite(l)?{target:r,dead:l}:null}vpdRangeNums(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const o=Number(s.state),a=Number(i.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,c="°C"===s.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3));return{lo:Math.max(0,h(d(o-r))*(1-Math.min(100,a+l)/100)),hi:Math.max(0,h(d(o+r))*(1-Math.max(0,a-l)/100))}}airVpdRange(){const t=this.config.panel,e=this.targetInfo("temperature"),s=this.targetInfo("humidity");if(!e||!s){const e=!1!==this.cycleIsDay()?"day":"night";return this.vpdRangeNums(`number.sf_${t}_env_temp_${e}`,`number.sf_${t}_env_humi_${e}`)}const i=this.get(`number.sf_${t}_env_temp_day`)?.attributes?.unit_of_measurement,o="°C"===i,a=t=>.6108*Math.exp(17.27*t/(t+237.3)),n=(t=>o?t:5*(t-32)/9)(e.target),r=o?e.dead:5*e.dead/9,l=Math.max(0,s.target-s.dead),c=Math.min(100,s.target+s.dead),d=Math.max(0,a(n-r)*(1-c/100)),h=Math.max(0,a(n+r)*(1-l/100));return h>d?{lo:d,hi:h}:null}targetBandRaw(t){const e=this.targetInfo(t);if(e)return{lo:e.target-e.dead,hi:e.target+e.dead,margin:e.dead};if("vpd"===t){const t=this.airVpdRange();return t&&t.hi>t.lo?{lo:t.lo,hi:t.hi,margin:.15*(t.hi-t.lo)}:null}if("leaf_vpd"===t){const{min:t,max:e}=this.leafVpdRange();return null!=t&&null!=e&&e>t?{lo:t,hi:e,margin:.15*(e-t)}:null}if(t.startsWith("soil_avg_")){const e=this.alarmRange(t);if(e)return{lo:e.lo,hi:e.hi,margin:.06*(e.hi-e.lo)}}return null}alarmRange(t){const e=Nt[t];if(!e)return null;const s=this.alertsSettings();if(!s)return null;const i=[...s.climate||[],...s.substrate||[]].find(t=>t&&t.key===e);if(!i||!i.enabled)return null;const o=Number(i.min),a=Number(i.max);return Number.isFinite(o)&&Number.isFinite(a)&&a>o?{lo:o,hi:a}:null}metricBand(t){const e=this.targetBandRaw(t);if("leaf_vpd"===t)return e;if("targets"===this.colorSource)return e;const s=this.alarmRange(t),i=s?{lo:s.lo,hi:s.hi,margin:0}:null;return"alarms"===this.colorSource?i:e??i}targetOutOfRange(t,e){const s=this.metricBand(t);return s?e>s.hi+s.margin?"above":e<s.lo-s.margin?"below":e>s.hi||e<s.lo?"near":null:null}targetSubline(t,e){if(!this.showTargets)return U;const s=this.targetInfo(t);if("alarms"!==this.colorSource&&s)return Q`<div class="tile-target">target ${s.target}${e} · ±${s.dead}</div>`;const i=this.metricBand(t);if(!i)return U;const o="alarms"!==this.colorSource||"leaf_vpd"===t?"target":"range",a=Math.abs((i.lo+i.hi)/2),n=e||"",r=/kpa/i.test(n)?2:/ms\/cm/i.test(n)?1:/°|%|ppm|µmol/.test(n)?0:a<10?2:a<100?1:0;return Q`<div class="tile-target">${o} ${i.lo.toFixed(r)}–${i.hi.toFixed(r)} ${e}</div>`}paramEid(t){return`sensor.sf_${this.config.panel}_${t}`}recordHistory(){const t=Date.now();for(const[e]of Tt){const s=this.get(this.paramEid(e)),i=s?parseFloat(s.state):NaN;if(!Number.isFinite(i))continue;const o=this.paramEid(e),a=this._hist[o]||(this._hist[o]=[]),n=a[a.length-1];for((!n||n.v!==i||t-n.t>6e4)&&a.push({t:t,v:i});a.length>60||a.length&&t-a[0].t>12e5;)a.shift()}}trend(t){const e=this._hist[this.paramEid(t)];if(!e||e.length<3)return null;const s=e[0].v,i=e[e.length-1].v,o=e.reduce((t,e)=>Math.max(t,Math.abs(e.v)),0)||1;return Math.abs(i-s)<Math.max(.05,.004*o)?"flat":i>s?"up":"down"}trendIcon(t){if(!this.showTrend)return U;const e=this.trend(t);if(!e)return U;return Q`<ha-icon class="tile-trend" icon=${"up"===e?"mdi:trending-up":"down"===e?"mdi:trending-down":"mdi:trending-neutral"} style="color:${"up"===e?"#ff8a65":"down"===e?"#5db2ff":"var(--secondary-text-color)"}"></ha-icon>`}bandInfo(t){const e=this.metricBand(t);if(!e)return null;const s=e.hi-e.lo;return{min:e.lo-s-e.margin,max:e.hi+s+e.margin,bandLo:e.lo,bandHi:e.hi,warnLo:e.lo-e.margin,warnHi:e.hi+e.margin}}renderBand(t,e){if(!this.showBand||!Number.isFinite(e))return U;const s=this.bandInfo(t);if(!s)return U;let i=s.min,o=s.max;const a=o-i||1;e<i&&(i=e-.06*a),e>o&&(o=e+.06*a);const n=t=>Math.max(0,Math.min(100,(t-i)/(o-i)*100));return Q`<div class="tile-band">
      <div class="bz" style=${`left:${n(s.warnLo)}%;width:${n(s.warnHi)-n(s.warnLo)}%;background:${At(this.colWarn,.28)}`}></div>
      <div class="bz" style=${`left:${n(s.bandLo)}%;width:${n(s.bandHi)-n(s.bandLo)}%;background:${At(this.colIn,.42)}`}></div>
      <div class="bmark" style=${`left:${n(e)}%`}></div>
    </div>`}_gkey(t){return`${t}|${this.graphRange}`}toggleGraph(t){const e=this.paramOpen===t;this.paramOpen=e?null:t,this._graphSel=null,this._graphPin=null,e||this.fetchGraph(this.paramEid(t))}setGraphRange(t){t!==this.graphRange&&(this.graphRange=t,this._graphSel=null,this._graphPin=null,this.persistColorOption("graph_range",String(t)),this.paramOpen&&this.fetchGraph(this.paramEid(this.paramOpen)))}async fetchGraph(t){const e=this._gkey(t);if(!this._graph[e]&&!this._graphLoading[e]&&this.hass){this._graphLoading[e]=!0;try{const s=new Date,i=new Date(s.getTime()-3600*this.graphRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),a=o&&o[t]||[];this._graph[e]=a.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),v:parseFloat(t.s??t.state)})).filter(t=>Number.isFinite(t.v)&&Number.isFinite(t.t))}catch(t){this._graph[e]=[]}finally{this._graphLoading[e]=!1,this._graphVer++}}}renderParamGraph(){const t=this.paramOpen;if(!t)return U;const e=this.paramEid(t),s=this._gkey(e),i=(Tt.find(e=>e[0]===t)||[,t.charAt(0).toUpperCase()+t.slice(1)])[1],o=this.get(e)?.attributes.unit_of_measurement||"",a=Q`<select class="pg-range" @change=${t=>this.setGraphRange(Number(t.target.value))}>
      ${[[6,"6h"],[12,"12h"],[24,"24h"],[168,"7d"]].map(([t,e])=>Q`
        <option value=${t} ?selected=${this.graphRange===t}>${e}</option>`)}
    </select>`;if(this._graphLoading[s])return Q`<div class="param-graph"><div class="pg-head"><span>${i}</span>${a}<span class="pg-now">…</span><ha-icon icon="mdi:close" @click=${()=>this.paramOpen=null}></ha-icon></div><span class="pg-note">Loading history…</span></div>`;const n=this._graph[s];if(!n||n.length<2)return Q`<div class="param-graph"><div class="pg-head"><span>${i}</span>${a}<span class="pg-now"></span><ha-icon icon="mdi:close" @click=${()=>this.paramOpen=null}></ha-icon></div><span class="pg-note">Not enough history yet for ${i} at this range.</span></div>`;const r=n.map(t=>t.v),l=Math.min(...r),c=Math.max(...r),d=r.reduce((t,e)=>t+e,0)/r.length,h=r[r.length-1],p=Math.abs(d)<10?2:Math.abs(d)<100?1:0,u=t=>t.toFixed(p),g=this.bandInfo(t),m="leaf_vpd"===t||"alarms"!==this.colorSource?this.targetOutOfRange(t,h):this.outOfRange(Nt[t],h),f="above"===m?this.colHi:"below"===m?this.colLo:"near"===m?this.colWarn:"var(--primary-text-color)",v=520,b=120,_=n[0].t,$=n[n.length-1].t||_+1;let x=l,y=c;g&&(x=Math.min(x,g.warnLo),y=Math.max(y,g.warnHi));const w=.08*(y-x)||1;x-=w,y+=w;const S=t=>6+(t-_)/($-_)*508,k=t=>114-(t-x)/(y-x)*108,O=n.map((t,e)=>`${e?"L":"M"}${S(t.t).toFixed(1)} ${k(t.v).toFixed(1)}`).join(" "),C=`M${S(_).toFixed(1)} ${114..toFixed(1)} ${O.slice(1)} L${S($).toFixed(1)} ${114..toFixed(1)} Z`,D=this.accent(),M=r.indexOf(l),T=r.indexOf(c),N=(t,e)=>j`<line x1="0" x2=${v} y1=${k(t).toFixed(1)} y2=${k(t).toFixed(1)} stroke=${e} stroke-width="1" stroke-dasharray="3 3" opacity="0.6"></line>`,L=t=>this.graphRange>=168?new Date(t).toLocaleDateString([],{month:"numeric",day:"numeric"}):new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:this.hour12}),P=this.graphRange>=168?7:6,R=Array.from({length:P+1},(t,e)=>_+e/P*($-_)),A=null!=this._graphSel?this._graphSel:null!=this._graphPin?this._graphPin:null,E=null!=A&&A>=0&&A<n.length?A:null,F=(t,e)=>{const s=t.currentTarget.getBoundingClientRect();if(!s.width)return;const i=Math.max(0,Math.min(1,(t.clientX-s.left)/s.width)),o=_+i*($-_);let a=0,r=1/0;for(let t=0;t<n.length;t++){const e=Math.abs(n[t].t-o);e<r&&(r=e,a=t)}this._graphSel=a,e&&(this._graphPin=a)},z=null!=E?n[E].v:h;return Q`<div class="param-graph">
      <div class="pg-head">
        <span>${i}</span>${a}
        <span class="pg-now" style="color:${null!=E?"var(--primary-text-color)":f}">
          ${null!=E?Q`<span class="pg-at">${(t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))(n[E].t)}</span> `:U}${u(z)}<span class="pg-u">${o}</span></span>
        <ha-icon icon="mdi:close" @click=${()=>{this.paramOpen=null,this._graphSel=null,this._graphPin=null}}></ha-icon>
      </div>
      <div class="pg-stats">
        <span>min <b>${u(l)}</b></span><span>avg <b>${u(d)}</b></span>
        <span>max <b>${u(c)}</b></span>
        ${g?Q`<span>band <b>${u(g.bandLo)}–${u(g.bandHi)}</b> ${o}</span>`:U}
      </div>
      <div class="pg-plot">
        <div class="pg-yax"><span>${u(y)}</span><span>${u(x)}</span></div>
        <svg viewBox="0 0 ${v} ${b}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${t=>F(t,!1)}
          @pointerdown=${t=>F(t,!0)}
          @pointerleave=${()=>{this._graphSel=null}}>
          ${R.map(t=>j`<line x1=${S(t).toFixed(1)} x2=${S(t).toFixed(1)} y1="0" y2=${b} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${g?j`
            <rect x="0" y=${k(g.warnHi).toFixed(1)} width=${v} height=${(k(g.bandHi)-k(g.warnHi)).toFixed(1)} fill=${At(this.colWarn,.16)}></rect>
            <rect x="0" y=${k(g.bandLo).toFixed(1)} width=${v} height=${(k(g.warnLo)-k(g.bandLo)).toFixed(1)} fill=${At(this.colWarn,.16)}></rect>
            <rect x="0" y=${k(g.bandHi).toFixed(1)} width=${v} height=${(k(g.bandLo)-k(g.bandHi)).toFixed(1)} fill=${At(this.colIn,.2)}></rect>
            ${N(g.bandHi,this.colIn)}${N(g.bandLo,this.colIn)}`:U}
          <path d=${C} fill=${At(D,.12)} stroke="none"></path>
          <path d=${O} fill="none" stroke=${D} stroke-width="2"></path>
          <circle cx=${S(n[M].t).toFixed(1)} cy=${k(l).toFixed(1)} r="2.5" fill=${this.colLo}></circle>
          <circle cx=${S(n[T].t).toFixed(1)} cy=${k(c).toFixed(1)} r="2.5" fill=${this.colHi}></circle>
          <circle cx=${S(n[n.length-1].t).toFixed(1)} cy=${k(h).toFixed(1)} r="3.5" fill=${D}></circle>
          ${null!=E?j`
            <line x1=${S(n[E].t).toFixed(1)} x2=${S(n[E].t).toFixed(1)} y1="0" y2=${b} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            <circle cx=${S(n[E].t).toFixed(1)} cy=${k(n[E].v).toFixed(1)} r="4" fill="var(--primary-text-color)"></circle>`:U}
          <rect x="0" y="0" width=${v} height=${b} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${R.map(t=>Q`<span>${L(t)}</span>`)}</div>
    </div>`}soilCellStyle(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);if(!s||Qt(s))return"";const i="temperature"===e?"tempSoil":"moisture"===e?"humiSoil":"ECSoil",o=this.readingColor(i,s.state);return o?`color:${o.color}`:""}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?St(t):[])[0]||"dp1",s=t?Dt(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...s.length?{outlets:s}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||mt}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")||t.has("outletDraft")||t.has("outletNameDraft")||t.has("outletCfgDraft")||t.has("_stDt")||t.has("_cdTick")||t.has("alertsDraft")||t.has("deviceOpen")||t.has("outletOpen")||t.has("draft")||t.has("modePick")||t.has("logDate")||t.has("logDev")||t.has("logType")||t.has("colorMode")||t.has("colorModeIn")||t.has("colHi")||t.has("colLo")||t.has("colIn")||t.has("hideLight2")||t.has("colorDraft")||t.has("outletColorMode")||t.has("ocManual")||t.has("ocSched")||t.has("ocEnv")||t.has("ocDrip")||t.has("deviceColorMode")||t.has("dcManual")||t.has("dcSched")||t.has("dcAuto")||t.has("colorSource")||t.has("colWarn")||t.has("showTrend")||t.has("showBand")||t.has("paramOpen")||t.has("_graphVer")||t.has("graphRange")||t.has("_graphSel")||t.has("_graphPin")||t.has("showTargets")||t.has("tileSummary")||t.has("hour12")||t.has("showConn")||t.has("connCustom")||t.has("connSignal")||t.has("showOutletsLog")||t.has("ologRange")||t.has("showVpd")||t.has("vpdLeaf")||t.has("showLeafVpd")||t.has("_colorOpen")||t.has("vpdStage")||t.has("vpdView")||t.has("vpdHighlight")||t.has("vpdPlanSource")||t.has("showDeviceLog")||t.has("showDeviceQuick")||t.has("deviceQuickRemember")||t.has("dlogOpen")||t.has("planDraft")||t.has("planEditStage")||t.has("planShowAll")||t.has("planDelArm")||t.has("envSubView")||t.has("planTplOpen")||t.has("planTplName")||t.has("_tplMsg")||t.has("ologOpen")||t.has("_ologVer")||t.has("_saving")||t.has("outletCopyOpen")||t.has("outletCopySel")||t.has("outletCopyFromOpen")||t.has("showOutletQuick")||t.has("outletQuickRemember")||t.has("outletQuickNames")||t.has("leafSpots")||t.has("leafCalTarget")||t.has("customOutletNames")||t.has("outletNames")||t.has("customLayout")||t.has("cardScale")||t.has("tileCols")||t.has("_devOff")||t.has("tileRadius")||t.has("tileBorderW")||t.has("tileBorderCol")||t.has("tileBg")||t.has("taTiles")||t.has("taDevices")||t.has("taOutlets")||t.has("cooldownShow")||t.has("cooldownDevice")||t.has("cooldownOutlet")||t.has("cooldownSecs")||t.has("_cdOpen")||t.has("outletsOnOverview")||t.has("_setOverviewOpen")||t.has("_setExtrasOpen")||t.has("_setConnOpen")||t.has("_setVpdOpen")||t.has("_setDevOpen")||t.has("_setOutletOpen")||t.has("_setLayoutOpen")||t.has("tempSource")||t.has("extTemp")||t.has("extHumi")||t.has("_tsOpen")||t.has("smart")||t.has("_smartOpen")}willUpdate(t){if(this._saving&&t.has("hass")){const t=Date.now()-this._savingAt,e=this._savingWatch.some(t=>(this.get(t.id)?.state??"")!==t.was);(this._savingWatch.length?e&&t>300||t>5e3:t>3500)&&(this._saving=!1,this._savingWatch=[],clearTimeout(this._savingT))}if(!this._colorSynced){const t=this.serverColors();Object.keys(t).length&&(t.mode&&(this.colorMode=t.mode),t.modeIn&&(this.colorModeIn=t.modeIn),t.source&&(this.colorSource=t.source),t.warn&&(this.colWarn=t.warn),void 0!==t.showTrend&&(this.showTrend=t.showTrend),void 0!==t.showBand&&(this.showBand=t.showBand),void 0!==t.showTargets&&(this.showTargets=t.showTargets),void 0!==t.tileSummary&&(this.tileSummary=t.tileSummary),void 0!==t.hour12&&(this.hour12=t.hour12),void 0!==t.showConn&&(this.showConn=t.showConn),void 0!==t.connCustom&&(this.connCustom=t.connCustom),void 0!==t.connSignal&&(this.connSignal=t.connSignal),void 0!==t.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog),void 0!==t.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick),void 0!==t.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember),void 0!==t.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames),void 0!==t.showVpd&&(this.showVpd=t.showVpd),void 0!==t.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd),void 0!==t.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf),void 0!==t.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog),void 0!==t.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick),void 0!==t.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember),t.hi&&(this.colHi=t.hi),t.lo&&(this.colLo=t.lo),t.in&&(this.colIn=t.in),void 0!==t.hide2&&(this.hideLight2=t.hide2),t.omode&&(this.outletColorMode=t.omode),t.ocManual&&(this.ocManual=t.ocManual),t.ocSched&&(this.ocSched=t.ocSched),t.ocEnv&&(this.ocEnv=t.ocEnv),t.ocDrip&&(this.ocDrip=t.ocDrip),t.dmode&&(this.deviceColorMode=t.dmode),t.dcManual&&(this.dcManual=t.dcManual),t.dcSched&&(this.dcSched=t.dcSched),t.dcAuto&&(this.dcAuto=t.dcAuto),void 0!==t.customNames&&(this.customOutletNames=t.customNames),void 0!==t.customLayout&&(this.customLayout=t.customLayout),t.scale&&(this.cardScale=t.scale),t.cols&&(this.tileCols=t.cols),t.graphRange&&(this.graphRange=t.graphRange),void 0!==t.tileRadius&&(this.tileRadius=t.tileRadius),void 0!==t.tileBorderW&&(this.tileBorderW=t.tileBorderW),void 0!==t.tileBorderCol&&(this.tileBorderCol=t.tileBorderCol),void 0!==t.tileBg&&(this.tileBg=t.tileBg),void 0!==t.taTiles&&(this.taTiles=t.taTiles),void 0!==t.taDevices&&(this.taDevices=t.taDevices),void 0!==t.taOutlets&&(this.taOutlets=t.taOutlets),void 0!==t.cooldownShow&&(this.cooldownShow=t.cooldownShow),void 0!==t.cooldownDevice&&(this.cooldownDevice=t.cooldownDevice),void 0!==t.cooldownOutlet&&(this.cooldownOutlet=t.cooldownOutlet),void 0!==t.cooldownSecs&&Number.isFinite(t.cooldownSecs)&&(this.cooldownSecs=t.cooldownSecs),void 0!==t.outletsOnOverview&&(this.outletsOnOverview=t.outletsOnOverview),void 0!==t.tempSource&&(this.tempSource=t.tempSource),void 0!==t.extTemp&&(this.extTemp=t.extTemp),void 0!==t.extHumi&&(this.extHumi=t.extHumi),void 0!==t.smart&&(this.smart=t.smart),this._colorSynced=!0,this.cacheColors());const e=this.serverOutletNames();Object.keys(e).length&&(this.outletNames=e)}if(t.has("tab")&&(null!==this.colorDraft&&(this.colorDraft=null),null!==this.alertsDraft&&(this.alertsDraft=null),null!==this.envSubView&&(this.envSubView=null),null!==this.planDraft&&(this.planDraft=null),null!==this.planEditStage&&(this.planEditStage=null),this.planShowAll&&(this.planShowAll=!1),this.planDelArm&&(this.planDelArm=!1),Object.keys(this.draft).length&&(this.draft={}),Object.keys(this.outletDraft).length&&(this.outletDraft={}),Object.keys(this.outletNameDraft).length&&(this.outletNameDraft={}),Object.keys(this.outletCfgDraft).length&&(this.outletCfgDraft={}),Object.keys(this.modePick).length&&(this.modePick={})),t.has("hass")&&this.recordHistory(),t.has("hass")&&Object.keys(this.modePick).length){let t=null;for(const[e,s]of Object.entries(this.modePick))this.get(e)?.state===s&&(t=t??{...this.modePick},delete t[e]);t&&(this.modePick=t)}}cleaningActive(){const t=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);return!!t&&"on"===t.state}cleaningRemaining(){const t=this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_time`),e=t?parseInt(t.state,10):NaN;if(!Number.isFinite(e)||e<=0)return"";const s=Math.floor(e/3600),i=Math.floor(e%3600/60);return s?`${s}h ${i}m`:`${i}m`}cleaningCooling(){return"2"===this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_phase`)?.state}cleaningLabel(){return this.cleaningCooling()?"Cooling":"Cleaning"}setCleaning(t){this.hass?.callService("sf","set_sensor_heating",{entity_id:`binary_sensor.sf_${this.config.panel}_sensor_cleaning`,on:t})}renderSensorCleaning(){const t=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);if(!t)return U;const e="on"===t.state,s=this.cleaningCooling(),i=this.cleaningRemaining(),o=this.accent(),a="flex:1;border-radius:8px;padding:9px;font-size:13px;font-weight:500;";return Q`
      <div class="section-label">Sensor Cleaning</div>
      <div style="font-size:12px;color:var(--secondary-text-color);line-height:1.5;margin:0 0 10px;">
        Runs a self-clean heat cycle on the air temp/humidity probe (~2&nbsp;hours). The
        probe's device turns off during it, then a 5-minute cooldown follows — Air Temp,
        Humidity and VPD pause until it finishes.
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:var(--secondary-background-color);border-radius:8px;padding:9px 11px;margin-bottom:10px;">
        <ha-icon icon=${e&&s?"mdi:thermometer-chevron-down":"mdi:broom"}
          style="color:${e?o:"var(--secondary-text-color)"}"></ha-icon>
        <span style="font-size:13px;">${e?s?"Cooling sensor…":"Cleaning sensor…":"Not cleaning"}</span>
        <span style="margin-left:auto;font-size:13px;font-weight:500;color:${o};">${e&&i?i+" left":""}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button ?disabled=${e} @click=${()=>this.setCleaning(!0)}
          style="${a}border:none;cursor:${e?"not-allowed":"pointer"};opacity:${e?".45":"1"};background:${o};color:#fff;">Start cleaning</button>
        <button ?disabled=${!e} @click=${()=>this.setCleaning(!1)}
          style="${a}background:transparent;cursor:${e?"pointer":"not-allowed"};opacity:${e?"1":".45"};color:${o};border:1px solid ${o};">Stop cleaning</button>
      </div>`}renderParam([t,e,s]){if("leaf_vpd"===t&&!this.showLeafVpd)return U;const i=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!i)return U;const o=i.attributes.unit_of_measurement||"",a=t.startsWith("soil_avg_")&&Qt(i),n=["temperature","humidity","vpd","leaf_vpd"].includes(t)&&this.cleaningActive(),r=n?"--":a?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,l=t.startsWith("soil_avg_")?t.slice(9):null,c=!!l&&this.soilProbeRows(l).length>1,d=c&&this.soilOpen===l;let h;const p=this.paramOpen===t;if(a||n)h=null;else{const e=parseFloat(i.state);if(Number.isFinite(e)){const s="targets"!==this.colorSource?this.outOfRange(Nt[t],e):null,i="alarms"!==this.colorSource||"leaf_vpd"===t?this.targetOutOfRange(t,e):null;h=this.colorForOor(s??i)}else h=null}const u=!a&&!c;let g=d||p?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",m="";a?(g=`background:${Rt};box-shadow:inset 0 0 0 1px ${Pt}`,m=`color:${Pt}`):h&&"text"===h.mode?m=`color:${h.color}`:h&&"tile"===h.mode&&(g=`background:${At(h.color)};box-shadow:inset 0 0 0 1px ${h.color}`);const f=c||u;return Q`
      <div class="tile ${f?"clickable":""} ${d||p?"active":""}"
        style=${g||U}
        role=${f?"button":U}
        @click=${c?()=>this.soilOpen=d?null:l:u?()=>this.toggleGraph(t):void 0}>
        <div class="tile-label">
          <span class="tl-name">${e}</span>
          <span class="tl-right">
            ${n?Q`<ha-icon icon="mdi:broom" title="Sensor cleaning"
              style="--mdc-icon-size:15px;color:var(--warning-color,#ff9800)"></ha-icon>`:U}
            ${this.trendIcon(t)}
            ${c?Q`<ha-icon class="tile-more"
                  icon=${d?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:u?Q`<ha-icon class="tile-more"
                  icon=${p?"mdi:chevron-up":"mdi:chart-line"}></ha-icon>`:U}
          </span>
        </div>
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${m||U}>${r}${a||n?U:Q`<span class="unit">${o}</span>`}</div>
        ${n?Q`<div class="tile-target" style="color:var(--warning-color,#ff9800)">${this.cleaningLabel()}${this.cleaningRemaining()?" · "+this.cleaningRemaining():""}</div>`:a?U:this.targetSubline(t,o)}
        ${a||n||"ppfd"!==t?U:this.ppfdPlanTargetSub()}
        ${a||n?U:this.renderBand(t,parseFloat(i.state))}
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),s=[];for(const i of Object.keys(this.hass?.states??{})){const o=bt(i).match(e);o&&s.push({slot:o[1],name:this.soilSensorName(i,t),e:this.hass.states[i]})}return s.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),s.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let s=this.hass?.states[t]?.attributes.friendly_name??"";const i=Mt(this.hass,this.config.panel);i&&s.startsWith(i)&&(s=s.slice(i.length).trim());const o="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return s=s.replace(new RegExp(`\\s*${o}\\s*$`,"i"),"").trim(),s||bt(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return U;const e=this.soilProbeRows(t);if(!e.length)return U;return Q`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:e,e:s})=>{const i=Qt(s),o=s.attributes.unit_of_measurement||"",a=this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(o,"").trim():s.state,n="temperature"===t?"tempSoil":"moisture"===t?"humiSoil":"ECSoil",r=i?null:this.readingColor(n,s.state);return Q`
            <div class="soil-pop-row ${i?"offline":""}">
              <span class="spn">${e}</span>
              <span class="spv" style=${r?`color:${r.color}`:U}>${i?Q`Offline`:Q`${a}<span class="unit">${o}</span>`}</span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}probeOffline(t){const e=this.get(`sensor.sf_${this.config.panel}_${t}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${t}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${t}_ec`);return Qt(e)}soilCellValue(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return s&&"unknown"!==s.state&&"unavailable"!==s.state?this.hass?.formatEntityState?this.hass.formatEntityState(s):`${s.state}${s.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const s=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[s])return this.soilSensorName(s,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const t=this.soilProbeSlots();if(t.length<2)return U;const e=this.soilAllOpen,s=this.accent(),i=t.filter(t=>this.probeOffline(t)).length,o=i?`background:${Rt};box-shadow:inset 0 0 0 1px ${Pt}`:e?`box-shadow:inset 0 0 0 1px ${s}`:"",a=i?`${i} offline`:`${t.length} probes`;return Q`
      <div class="tile clickable ${e?"active":""}" style=${o||U}
        role="button" aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${i?Pt:s}"></ha-icon>
        <div class="tile-val" style=${i?`color:${Pt}`:U}>${a}</div>
      </div>`}renderSoilAllTable(){const t=this.soilProbeSlots();return t.length<2||!this.soilAllOpen?U:Q`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">Probe</span>
          <span class="sa-v">Temp</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${t.map(t=>Q`
            <div class="soil-all-row ${this.probeOffline(t)?"offline":""}">
              <span class="sa-name">${this.probeNameForSlot(t)}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"temperature")||U}>${this.soilCellValue(t,"temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"moisture")||U}>${this.soilCellValue(t,"moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"ec")||U}>${this.soilCellValue(t,"ec")}</span>
            </div>`)}
      </div>`}overviewDevices(){const t=[],e=(e,s)=>{for(const[i,o,a]of s){const s=this.eid(e,i);this.get(s)&&t.push({domain:e,suffix:i,id:s,label:o,icon:a})}};return e("light",Ut),e("fan",Gt),e("switch",Kt),this.hideLight2?t.filter(t=>"light_2"!==t.suffix):t}deviceStateText(t,e){if("unavailable"===e.state||"unknown"===e.state)return"Offline";if("light"===t.domain)return"on"!==e.state?"Off":`${Math.round((e.attributes.brightness??0)/255*100)}%`;if("fan"===t.domain){if("on"!==e.state)return"Off";const t=Math.round(e.attributes.percentage??0);return t?`${t}%`:"On"}if("on"!==e.state)return"Off";const s=this.config.panel;if("dehumidifier"===t.suffix){const t=this.get(`sensor.sf_${s}_dehumidifier_level`)?.state;return t&&"Off"!==t&&"unknown"!==t?t:"On"}if("heater"===t.suffix||"humidifier"===t.suffix){const e=this.get(`sensor.sf_${s}_${t.suffix}_level`)?.state;return e&&"0"!==e&&"unknown"!==e?`L${e}`:"On"}return"On"}deviceFault(t){const e=this.config.panel,s=t=>this.get(`sensor.sf_${e}_${t}`)?.state;return"humidifier"===t&&"Empty"===s("humidifier_tank")?"EMPTY":"dehumidifier"===t&&"Full"===s("dehumidifier_tank")?"FULL":"heater"===t&&"Alarm"===s("heater_status")?"Alarm":null}humiTarget(){const t=this.config.panel,e=Number(this.get(`number.sf_${t}_env_humi_day`)?.state),s=Number(this.get(`number.sf_${t}_env_humi_night`)?.state);return"on"===this.get(`binary_sensor.sf_${t}_is_day`)?.state||"1"===this.get(`sensor.sf_${t}_is_day_env_target`)?.state?Number.isFinite(e)?e:s:Number.isFinite(s)?s:e}cooldownFrom(t,e){const s=this.get(t);if(!s||"off"!==s.state||!s.last_changed)return null;const i=(Date.now()-Date.parse(s.last_changed))/1e3,o=Math.ceil(this.cooldownSecs-i);return o<=0?null:{remaining:o,waiting:e}}dehumCooldown(t){if("dehumidifier"!==t||!this.cooldownShow||!this.cooldownDevice)return null;const e=this.config.panel,s=Number(this.get(`sensor.sf_${e}_humidity`)?.state),i=this.humiTarget(),o=Number.isFinite(s)&&Number.isFinite(i)&&s>i;return this.cooldownFrom(`switch.sf_${e}_dehumidifier`,o)}outletCooldown(t,e){if(!this.cooldownShow||!this.cooldownOutlet)return null;const s=this.get(`select.sf_${t}_outlet_${e}_humidity_device`)?.state,i=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state;if("Humidity"!==i||"Dehumidifying"!==s)return null;const o=Number(this.get(`sensor.sf_${t}_humidity`)?.state),a=this.humiTarget(),n=Number.isFinite(o)&&Number.isFinite(a)&&o>a;return this.cooldownFrom(`switch.sf_${t}_outlet_${e}`,n)}anyCooldownActive(){if(!this.cooldownShow)return!1;if(this.cooldownDevice&&this.dehumCooldown("dehumidifier"))return!0;if(this.cooldownOutlet)for(const t of this.outletSlots())for(const e of this.outletNums(t))if(this.outletCooldown(t,e))return!0;return!1}fmtMMSS(t){return t=Math.max(0,Math.round(t)),`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}cooldownPill(t){if(!t)return U;const e=Math.max(0,Math.min(100,t.remaining/this.cooldownSecs*100)),s="var(--warning-color,#ff9800)";return Q`
      <div class="cd-pill" title="Compressor lockout after turning off — it can't restart until this reaches 0:00">
        <span class="cd-txt" style="color:${s}">
          <ha-icon icon="mdi:timer-sand" style="--mdc-icon-size:14px"></ha-icon>
          ${t.waiting?"Starts in":"Cooldown"} ${this.fmtMMSS(t.remaining)}
        </span>
        <div class="cd-bar"><div class="cd-fill" style="width:${e.toFixed(1)}%;background:${s}"></div></div>
      </div>`}renderCooldownPill(t){return this.cooldownPill(this.dehumCooldown(t))}deviceMode(t){const e=this.config.panel,s="light"===t.domain?`select.sf_${e}_${t.suffix}_mode`:`select.sf_${e}_${t.suffix}_mode_set`;return this.get(s)?this.modeOf(s):""}deviceColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Environment"===t||"Temperature"===t||"Humidity"===t||"PPFD"===t||"PPFD - Plan"===t?"auto":"manual")(t)){case"sched":return this.dcSched;case"auto":return this.dcAuto;default:return this.dcManual}}deviceTile(t){const e=this.get(t.id);if(!e)return U;const s="on"===e.state&&!this.devPendingOff(t.suffix),i=`${t.domain}:${t.suffix}`,o=this.deviceOpen===i,a=this.accent(),n=this.deviceFault(t.suffix),r=!n&&s&&"off"!==this.deviceColorMode?this.deviceColorFor(this.deviceMode(t)):"",l=n?Pt:r||(s?a:"var(--secondary-text-color)");let c="";return n?c=`background:${Rt};box-shadow:inset 0 0 0 1px ${Pt}`:r&&"tile"===this.deviceColorMode&&(c=`background:${At(r)};box-shadow:inset 0 0 0 1px ${r}`),o&&!n&&(c=`box-shadow:inset 0 0 0 1px ${a}`+(r&&"tile"===this.deviceColorMode?`;background:${At(r)}`:"")),Q`
      <div class="tile tile-device clickable ${o?"active":""}"
        style=${c||U}
        role="button" aria-expanded=${o?"true":"false"}
        @click=${()=>this.toggleDevice(o?null:i)}>
        <div class="tile-label">${t.label}
          <ha-icon class="tile-more"
            icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        ${this.tileSummary&&!n?this.deviceSummaryRow(t):U}
        <ha-icon icon=${t.icon} style="color:${s||n?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${n?`color:${Pt}`:s?`color:${l}`:""}>
          ${n??(s?this.deviceStateText(t,e):"Off")}
        </div>
        ${s||n?U:this.renderCooldownPill(t.suffix)}
        ${this.lightDLI(t)}
        ${this.fanBadge(t)}
        ${s||n||!this.dlqHas(t.suffix)?U:Q`<div class="tile-qta" style="color:${a}"
          title="Quick-toggle profile saved — quick-on restores this device's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>`}
      </div>`}lightSchedule(t,e){const s=this.config.panel,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""};let o=i(`text.sf_${s}_${t}_schedule_start`),a=i(`text.sf_${s}_${t}_schedule_stop`);if("PPFD"===e||"PPFD - Plan"===e){const e=i(`text.sf_${s}_${t}_ppfd_start`),n=i(`text.sf_${s}_${t}_ppfd_stop`);e&&n&&("00:00"!==e||"00:00"!==n)&&(o=e,a=n)}return[o,a]}lightDLI(t){if("light"!==t.domain)return U;const e=this.config.panel,s=t.suffix,i=this.modeOf(`select.sf_${e}_${s}_mode`);if("PPFD"!==i&&"PPFD - Plan"!==i)return U;const o=Number(this.get(`number.sf_${e}_${s}_ppfd_target`)?.state);if(!Number.isFinite(o)||o<=0)return U;const[a,n]=this.lightSchedule(s,i),r=/^(\d{1,2}):(\d{2})/.exec(a),l=/^(\d{1,2}):(\d{2})/.exec(n);if(!r||!l)return U;const c=(60*+l[1]+ +l[2]-(60*+r[1]+ +r[2])+1440)%1440/60;if(c<=0)return U;const d=o*c*.0036;return Q`<div class="tile-dli">
      <div>${Math.round(o)} µmol</div>
      <div class="tile-dli-v">DLI ${d.toFixed(1)}</div>
    </div>`}fanBadge(t){if("fan"!==t.suffix)return U;const e=this.config.panel,s=t.suffix,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o=[],a=i(`number.sf_${e}_${s}_oscillation`)||i(`sensor.sf_${e}_${s}_oscillation`);a&&"0"!==a&&o.push(`Osc ${a}`);if("on"===(i(`switch.sf_${e}_${s}_natural_wind`)||i(`binary_sensor.sf_${e}_${s}_natural_wind`))&&o.push("Nat Wind"),"Manual"!==this.modeOf(`select.sf_${e}_${s}_mode_set`)){const t=i(`number.sf_${e}_${s}_standby_speed`);t&&o.push("Stby "+("0"===t?"Off":10*Number(t)+"%"))}return o.length?Q`<div class="tile-dli">${o.map(t=>Q`<div>${t}</div>`)}</div>`:U}deviceSummaryRow(t){const e=this.deviceSummaryLines(t);return e.length?Q`<div class="tile-summary">
          ${e.map(t=>Q`<span>${t}</span>`)}
        </div>`:U}fmtClock(t){if(!this.hour12)return t;const e=/^(\d{1,2}):(\d{2})/.exec(t||"");if(!e)return t;let s=+e[1];const i=s>=12?"pm":"am";return s=s%12||12,`${s}:${e[2]}${i}`}shortDur(t){const e=/^(\d+):(\d{2})(?::(\d{2}))?$/.exec((t||"").trim());if(!e)return t||"";const s=+e[1],i=+e[2],o=+(e[3]??0);return s?i?`${s}h${i}m`:`${s}h`:i?o?`${i}m${o}s`:`${i}m`:`${o}s`}deviceSummaryLines(t){const e=this.config.panel,s=t.suffix,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o={"Prioritize temperature":"Pri Temp","Prioritize humidity":"Pri Humid","Temperature only":"Temp","Humidity only":"Humid","Temperature & humidity":"Temp/Humid"},a=[];if("light"===t.domain){const t=this.modeOf(`select.sf_${e}_${s}_mode`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];a.push(t);const[i,o]=this.lightSchedule(s,t);if(i&&o&&("00:00"!==i||"00:00"!==o)){a.push(`${this.fmtClock(i)}–${this.fmtClock(o)}`);const t=this.hrsText(i,o);t&&a.push(`LD - ${t}`)}return a}if("blower"===s||"fan"===s){const t=this.modeOf(`select.sf_${e}_${s}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;const n=t=>"blower"===s?`${t}%`:`L${t}`,r=i("blower"===s?`number.sf_${e}_blower_running_speed`:`number.sf_${e}_fan_schedule_gear`),l=i(`number.sf_${e}_${s}_standby_speed`),c="0"===r?"Auto":r?n(r):"",d=l&&"0"!==l?n(l):"Off",h="blower"===s&&c?`${c} · Stby ${d}`:"";if("Environment"===t){const t=this.modeOf(`select.sf_${e}_${s}_run_mode`);a.push("Environment"),t&&a.push(o[t]??t),h&&a.push(h)}else if("Time Slot"===t){a.push("Time Slot");const t=i(`text.sf_${e}_${s}_schedule_start`),o=i(`text.sf_${e}_${s}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`),h&&a.push(h)}else if("Cycle"===t){a.push("Cycle");const t=i(`text.sf_${e}_${s}_cycle_run`),o=i(`text.sf_${e}_${s}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`),h&&a.push(h)}return a}if("heater"===s||"humidifier"===s||"dehumidifier"===s){const t=this.modeOf(`select.sf_${e}_${s}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;if("Time Slot"===t){a.push("Time Slot");const t=i(`text.sf_${e}_${s}_schedule_start`),o=i(`text.sf_${e}_${s}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`)}else if("Cycle"===t){a.push("Cycle");const t=i(`text.sf_${e}_${s}_cycle_run`),o=i(`text.sf_${e}_${s}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`)}else{const o=t;let n="";if("humidifier"===s){const t=i(`select.sf_${e}_humidifier_gear`);n=t?"Automatic"===t?"Auto":`L${t}`:""}else if("heater"===s){const t=i(`select.sf_${e}_heater_gear`);n=t?"Automatic"===t?"Auto":`L${t}`:""}else n=i(`select.sf_${e}_dehumidifier_gear`)||i(`select.sf_${e}_dehumidifier_level_set`)||"";a.push(n?`${o} · ${n}`:o)}return a}return[]}relatedControls(t,e){const s=this.config.panel,i=new RegExp(`^(number|select|switch|text)\\.sf_${s}_${t}(_|$)`),o=`switch.sf_${s}_${t}`,a=`number.sf_${s}_${t}_speed`,n=Mt(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(t=>i.test(t)&&t!==o&&!("fan"===e&&t===a)).sort().map(t=>{let e=this.hass?.states[t]?.attributes.friendly_name??"";return n&&e.startsWith(n)&&(e=e.slice(n.length).trim()),this.ctlRow(e||t,t)})}renderDevicePop(){const t=this.deviceOpen;if(!t)return U;const e=this.overviewDevices().find(e=>`${e.domain}:${e.suffix}`===t);if(!e)return U;const s=this.get(e.id);if(!s)return U;const i="light"===e.domain?this.renderLightBody(e,s):"fan"===e.suffix?this.renderFanBody(e,s):"blower"===e.suffix?this.renderBlowerBody(e,s):"heater"===e.suffix?this.renderHeaterBody(e,s):"dehumidifier"===e.suffix?this.renderDehumidifierBody(e,s):"humidifier"===e.suffix?this.renderHumidifierBody(e,s):this.renderGenericBody(e,s);return Q`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${e.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${i}
      </div>`}devOn(t,e){const s=`power:${t}`;return s in this.draft?"on"===this.draft[s]:e}powerRow(t,e,s,i){const o=`power:${t}`,a=this.devOn(t,i),n=this.accent();return Q`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${a?"on":""}"
          style=${a?`background:${n}`:""}
          @click=${()=>this.stage(o,a?"off":"on")}
          aria-label="Toggle ${s}"></button>
      </div>`}deviceBar(t,e,s){const i=Object.keys(this.draft).length>0;return this.saveBar(i,()=>this.deviceApply(t,e,s),()=>this.discardEdits(),"",s.id)}deviceApply(t,e,s){this.commitBundle(t,e);const i=`bri:${s.id}`,o=`pct:${s.id}`,a=`power:${s.id}`;i in this.draft&&this.hass?.callService("light","turn_on",{entity_id:s.id,brightness_pct:Number(this.draft[i])}),o in this.draft&&this.hass?.callService("fan","set_percentage",{entity_id:s.id,percentage:Number(this.draft[o])});for(const t of Object.keys(this.draft)){if(t.includes(":")||t in e)continue;const s=this.draft[t];switch(t.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:t,value:Number(s)});break;case"select":this.hass?.callService("select","select_option",{entity_id:t,option:s});break;case"text":this.hass?.callService("text","set_value",{entity_id:t,value:s});break;case"switch":this.hass?.callService("switch","on"===s?"turn_on":"turn_off",{entity_id:t})}}if(a in this.draft){const t="on"===this.draft[a],e="light"===s.domain&&i in this.draft||"fan"===s.domain&&o in this.draft;if(!t||!e){const e="fan"===s.domain?"fan":"light"===s.domain?"light":"switch";this.hass?.callService(e,t?"turn_on":"turn_off",{entity_id:s.id})}}const n="off"===this.draft[a];this.draft={};const r=s.id.split(".")[1]?.replace(`sf_${this.config.panel}_`,"");r&&this.dlqClear(r),r&&n&&this.markDevOff(r)}renderGenericBody(t,e){const s="on"===e.state,i="fan"===t.domain?"fan":"switch",o=Math.round(e.attributes.percentage??0),a="fan"===t.domain?this.speedRow(t,s?o:0,0,10):U;return Q`${this.powerRow(t.id,i,t.label,s)}${a}${this.relatedControls(t.suffix,t.domain)}${this.deviceBar(`text.sf_${this.config.panel}_${t.suffix}_apply`,{},t)}`}speedRow(t,e,s=0,i=0){const o=`pct:${t.id}`,a=o in this.draft?Number(this.draft[o]):e,n=i>0?Array.from({length:i},(t,e)=>{const s=e+1;return{value:Math.round(s/i*100),label:String(s),sel:Math.round(a/100*i)===s}}):(()=>{const t=[];s<=0&&t.push({value:0,label:"Off",sel:0===a});for(let e=Math.max(s,1);e<=100;e+=1)t.push({value:e,label:e+"%",sel:e===a});return t})();return Q`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Speed</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(o,t.target.value)}>
            ${n.map(t=>Q`<option value=${t.value}
              ?selected=${t.sel}>${t.label}</option>`)}
          </select>
        </span>
      </div>`}brightnessRow(t,e){const s=`bri:${t.id}`,i=s in this.draft?Number(this.draft[s]):e,o=[];for(let t=11;t<=100;t+=1)o.push(t);return Q`
      <div class="dev-row ${s in this.draft?"staged":""}">
        <span class="dev-lbl">Brightness</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(s,t.target.value)}>
            ${o.map(t=>Q`<option value=${t} ?selected=${t===i}>${t+"%"}</option>`)}
          </select>
        </span>
      </div>`}renderHeaterBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_heater_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${s}_heater_level`,l=`text.sf_${s}_heater_apply`,c=this.numOpts(1,10,1,t=>`L${t}`),d=[];if(a&&d.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${s}_heater_schedule_start`,i=`text.sf_${s}_heater_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[r]:"gear"};d.push(this.stagedPeriodRow(e,i,"Schedule")),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${s}_heater_cycle_start`,i=`text.sf_${s}_heater_cycle_run`,a=`text.sf_${s}_heater_cycle_off`,n=`number.sf_${s}_heater_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};d.push(this.stagedRow("Start Time",e,"time")),d.push(this.stagedRow("Run Time",i,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",n)),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,h,t))}else if("Temperature"===n){const e=`select.sf_${s}_heater_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"gear"};d.push(i?this.stagedRow("Gear",e):this.optSelectRow("Gear",r,c)),d.push(this.infoRow("Automatic follows the day/night temperature targets; 1–10 sets a fixed level","")),d.push(this.deviceBar(l,a,t))}return d}renderDehumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_dehumidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`select.sf_${s}_dehumidifier_level`,l=`text.sf_${s}_dehumidifier_apply`,c=[];if(a&&c.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&c.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)c.push(this.ctlRow("Wind Speed",r)),c.push(this.deviceBar(l,{[o]:"mode",[r]:"wind",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${s}_dehumidifier_schedule_start`,i=`text.sf_${s}_dehumidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[r]:"wind"};c.push(this.stagedPeriodRow(e,i,"Schedule")),c.push(this.stagedRow("Wind Speed",r)),c.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${s}_dehumidifier_cycle_start`,i=`text.sf_${s}_dehumidifier_cycle_run`,a=`text.sf_${s}_dehumidifier_cycle_off`,n=`number.sf_${s}_dehumidifier_cycle_times`,d={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"wind"};c.push(this.stagedRow("Start Time",e,"time")),c.push(this.stagedRow("Run Time",i,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",n)),c.push(this.stagedRow("Wind Speed",r)),c.push(this.deviceBar(l,d,t))}else if("Humidity"===n){const e=`select.sf_${s}_dehumidifier_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"wind"};c.push(this.stagedRow("Wind Speed",i?e:r)),c.push(this.infoRow("Runs on the tent's day/night humidity targets, at Low or High power","")),c.push(this.deviceBar(l,a,t))}return c}renderHumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_humidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${s}_humidifier_level`,l=`text.sf_${s}_humidifier_apply`,c=this.numOpts(1,4,1,t=>`L${t}`),d=[];if(a&&d.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===n)d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${s}_humidifier_schedule_start`,i=`text.sf_${s}_humidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[r]:"gear"};d.push(this.stagedPeriodRow(e,i,"Schedule")),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${s}_humidifier_cycle_start`,i=`text.sf_${s}_humidifier_cycle_run`,a=`text.sf_${s}_humidifier_cycle_off`,n=`number.sf_${s}_humidifier_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};d.push(this.stagedRow("Start Time",e,"time")),d.push(this.stagedRow("Run Time",i,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",n)),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,h,t))}else if("Humidity"===n){const e=`select.sf_${s}_humidifier_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"gear"};d.push(i?this.stagedRow("Gear",e):this.optSelectRow("Gear",r,c)),d.push(this.infoRow("Automatic follows the day/night humidity targets; 1–4 sets a fixed level","")),d.push(this.deviceBar(l,a,t))}return d}textState(t){const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}durMinutes(t,e){const s=t=>{const e=/^(\d{1,2}):(\d{2})/.exec(t);return e?60*Number(e[1])+Number(e[2]):null},i=s(this.textState(t)),o=s(this.textState(e));if(null==i||null==o)return null;let a=(o-i+1440)%1440;return 0===a&&(a=1440),a}durationText(t,e){const s=this.durMinutes(t,e);return null==s?null:`${Math.floor(s/60)}h ${String(s%60).padStart(2,"0")}min`}infoRow(t,e){return Q`<div class="dev-row">
      <span class="dev-lbl">${t}</span><span class="dev-spacer"></span>
      <span class="dev-val">${e}</span>
    </div>`}ctlRow(t,e){if(!this.get(e))return U;const s="switch"===e.split(".")[0]?this.stagedSwitch(e):this.stagedInput(e);return Q`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${s}</div>
    </div>`}renderLightBody(t,e){const s=this.config.panel,i=t.suffix,o="on"===e.state,a=`select.sf_${s}_${i}_mode`,n=this.get(a),r=this.modeOf(a),l=this.get(`sensor.sf_${s}_${i}_brightness`),c=this.get(`sensor.sf_${s}_ppfd`),d=l&&Number.isFinite(Number(l.state))?`${Math.round(Number(l.state))}%`:"—",h=c&&Number.isFinite(Number(c.state))?`${Math.round(Number(c.state))} µmol`:"—",p=`text.sf_${s}_${i}_apply`,u=`number.sf_${s}_${i}_go_dark`,g=`number.sf_${s}_${i}_turn_off`,m=[];let f=!1;try{f=!!this.planInfo().active}catch{f=!1}const v=f?["Manual","PPFD - Plan"]:["Manual","Time Slot","PPFD"];if(n&&m.push(this.liveModeRow("Mode",a,void 0,v)),m.push(this.powerRow(t.id,"light",t.label,o)),"Manual"===r){const s=Math.round((e.attributes.brightness??0)/255*100),i={[a]:"mode",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.brightnessRow(t,o?s:0)),m.push(this.infoRow("Current PPFD",h)),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,i,t))}else if("Time Slot"===r){const e=`text.sf_${s}_${i}_schedule_start`,o=`text.sf_${s}_${i}_schedule_stop`,n=`number.sf_${s}_${i}_schedule_brightness`,r=`number.sf_${s}_${i}_fade`,l={[a]:"mode",[e]:"schedule_start",[o]:"schedule_end",[n]:"schedule_brightness",[r]:"fade_minutes",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${d} · ${h}`));const c=this.durationText(e,o);c&&m.push(this.infoRow("Light duration",c)),m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(this.optSelectRow("Target Brightness",n,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,l,t))}else if("PPFD"===r||"PPFD - Plan"===r){const e=`text.sf_${s}_${i}_ppfd_start`,o=`text.sf_${s}_${i}_ppfd_stop`,n=`number.sf_${s}_${i}_ppfd_target`,r=`number.sf_${s}_${i}_ppfd_fade`,l=`number.sf_${s}_${i}_ppfd_min`,c=`number.sf_${s}_${i}_ppfd_max`,f={[a]:"mode",[e]:"ppfd_start",[o]:"ppfd_end",[n]:"ppfd_target",[r]:"ppfd_fade_minutes",[l]:"ppfd_min",[c]:"ppfd_max",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${d} · ${h}`));const v=this.durationText(e,o),b=this.durMinutes(e,o),_=Number(this.get(n)?.state);if(v&&null!=b&&Number.isFinite(_)){const t=_*b*60/1e6;m.push(this.infoRow("DLI · duration",`${t.toFixed(2)} mol/m²/day · ${v}`))}else v&&m.push(this.infoRow("Light duration",v));m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(Q`<div class="dev-row ${n in this.draft?"staged":""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(n,this.numOpts(20,2e3,10,t=>`${t} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",l,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Dimming Range Max",c,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,f,t))}return m}renderFanBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_fan_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${s}_fan_oscillation`,l=`number.sf_${s}_fan_schedule_gear`,c=`number.sf_${s}_fan_standby_speed`,d=`switch.sf_${s}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",l,this.numOpts(1,10,1,t=>`L${t}`)),p=Math.max(1,Math.round(Number(this.draftVal(l))||1)),u=["","0"].includes(String(this.draftVal(l))),g=()=>this.optSelectRow("Standby Speed",c,this.offOpts(1,u?10:p-1)),m=()=>this.optSelectRow("Oscillation",r,this.offOpts(1,10)),f=`text.sf_${s}_fan_apply`,v=[];if(a&&v.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&v.push(this.powerRow(t.id,"fan",t.label,i)),"Manual"===n){const s=Math.round(e.attributes.percentage??0);v.push(this.speedRow(t,i?s:0,0,10)),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,{[o]:"mode"},t))}else if("Time Slot"===n){const e={[o]:"mode",[`text.sf_${s}_fan_schedule_start`]:"schedule_start",[`text.sf_${s}_fan_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${s}_fan_schedule_start`,`text.sf_${s}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,e,t))}else if("Cycle"===n){const e=`text.sf_${s}_fan_cycle_start`,i=`text.sf_${s}_fan_cycle_run`,a=`text.sf_${s}_fan_cycle_off`,n=`number.sf_${s}_fan_cycle_times`,r={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedRow("Start Time",e,"time")),v.push(this.stagedRow("Run Duration",i,"duration")),v.push(this.stagedRow("Off Duration",a,"duration")),v.push(this.stagedRangeRow("Execution Times",n)),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,r,t))}else if("Environment"===n){const e=`select.sf_${s}_fan_run_mode`,i={[o]:"mode",[e]:"env_submode",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedRow("Run Mode",e)),v.push(this.optSelectRow("Gear",l,this.autoOpts(1,10,1,t=>`L${t}`))),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,i,t))}return v}renderBlowerBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_blower_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${s}_blower_running_speed`,l=`number.sf_${s}_blower_standby_speed`,c=`switch.sf_${s}_blower_close_co2`,d=`text.sf_${s}_blower_apply`,h=()=>this.optSelectRow("Running Speed",r,this.numOpts(25,100,1,t=>`${t}%`)),p=["","0"].includes(String(this.draftVal(r))),u=Math.max(25,Math.round(Number(this.draftVal(r))||25)),g=()=>this.optSelectRow("Standby Speed",l,this.offOpts(25,p?100:u-1)),m=[];if(a&&m.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&m.push(this.powerRow(t.id,"fan",t.label,i)),"Manual"===n){const s=Math.round(e.attributes.percentage??0);m.push(this.speedRow(t,i?s:0,25)),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,{[o]:"mode"},t))}else if("Time Slot"===n){const e={[o]:"mode",[`text.sf_${s}_blower_schedule_start`]:"schedule_start",[`text.sf_${s}_blower_schedule_stop`]:"schedule_end",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedPeriodRow(`text.sf_${s}_blower_schedule_start`,`text.sf_${s}_blower_schedule_stop`,"Schedule")),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,e,t))}else if("Cycle"===n){const e=`text.sf_${s}_blower_cycle_start`,i=`text.sf_${s}_blower_cycle_run`,a=`text.sf_${s}_blower_cycle_off`,n=`number.sf_${s}_blower_cycle_times`,p={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Start Time",e,"time")),m.push(this.stagedRow("Run Duration",i,"duration")),m.push(this.stagedRow("Off Duration",a,"duration")),m.push(this.stagedRangeRow("Execution Times",n)),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,p,t))}else if("Environment"===n){const e=`select.sf_${s}_blower_run_mode`,i={[o]:"mode",[e]:"env_submode",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Run Mode",e)),m.push(this.optSelectRow("Running Speed",r,this.autoOpts(25,100,1,t=>`${t}%`))),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,i,t))}return m}cycleIsDay(){const t=this.config.panel,e=this.get(`binary_sensor.sf_${t}_daytime_schedule`);if(e&&("on"===e.state||"off"===e.state))return"on"===e.state;const s=jt(this.get(`text.sf_${t}_env_day_start`)?.state),i=jt(this.get(`text.sf_${t}_env_day_end`)?.state);if(null==s||null==i)return null;const o=new Date,a=60*o.getHours()+o.getMinutes();return s<=i?a>=s&&a<i:a>=s||a<i}lightLeak(){if(!1!==this.cycleIsDay())return{on:!1,text:""};const t=this.config.panel,e=this.get(`sensor.sf_${t}_ppfd`);if(e){const t=Number(e.state);return Number.isFinite(t)&&t>1?{on:!0,text:`Light detected · ${Math.round(t)} µmol`}:{on:!1,text:""}}const s=this.get(`binary_sensor.sf_${t}_daytime_light_sensor`);return s&&"on"===s.state?{on:!0,text:"Light detected"}:{on:!1,text:""}}renderParamsHead(){const t=this.cycleIsDay(),e=this.lightLeak(),s=null===t?U:Q`<span class="cycle-badge"
          style="color:${t?"#e0a83a":"#8f9bd4"};background:${t?"rgba(224,168,58,0.14)":"rgba(143,155,212,0.16)"}">
          <ha-icon icon=${t?"mdi:white-balance-sunny":"mdi:weather-night"}></ha-icon>${t?"Day Cycle":"Night Cycle"}</span>`;return Q`
      <div class="params-head">
        <span class="ph-label">Parameters</span>
        <span class="ph-mid">${e.on?Q`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${e.text}</span>`:U}</span>
        ${s}
      </div>`}renderEnergyTile(){const t=this.config.panel;if(!this.get(`sensor.sf_${t}_power`))return U;const e=(e,s,i)=>{const o=this.get(`sensor.sf_${t}_${e}`),a=o?Number(o.state):NaN;return Number.isFinite(a)?`${a.toFixed(i)}${s}`:"–"},s="power"===this.paramOpen,i=this.accent();return Q`
      <div class="section-label">Energy Usage</div>
      <div class="grid">
        <div class="tile clickable ${s?"active":""}"
          style=${s?`box-shadow:inset 0 0 0 1px ${i}`:U}
          role="button" aria-expanded=${s?"true":"false"}
          @click=${()=>this.toggleGraph("power")}>
          <div class="tile-label"><span class="tl-name">Power</span></div>
          <ha-icon icon="mdi:flash" style="color:${i}"></ha-icon>
          <div class="tile-val">${e("power","",0)}<span class="unit">W</span></div>
          <div class="tile-target">${e("voltage"," V",0)} · ${e("current"," A",2)}</div>
          <div class="tile-target">${e("energy"," kWh",2)}</div>
        </div>
      </div>
      ${s?this.renderParamGraph():U}`}renderOverview(){const t=Tt.map(t=>this.renderParam(t)).filter(t=>t!==U),e=this.soilStatsTile(),s=this.overviewDevices();return Q`
      ${t.length||e!==U?Q`${this.renderParamsHead()}
            <div class="grid">${t}${e}</div>
            ${"power"===this.paramOpen?U:this.renderParamGraph()}
            ${this.renderSoilPop()}
            ${this.renderSoilAllTable()}`:U}
      ${this.renderEnergyTile()}
      ${s.length?Q`<div class="section-label">Devices</div>
            ${this.renderDeviceQuickRow()}
            <div class="grid">${s.map(t=>this.deviceTile(t))}</div>
            ${this.renderDevicePop()}`:U}
      ${this.outletsOnOverview&&this.hasOutlets()?Q`<div class="section-label">Outlets</div>
            <div class="grid">
              ${this.outletSlots().map(t=>this.outletNums(t).map(e=>this.outletTile(t,e)))}
            </div>
            ${this.renderOutletPop()}`:U}`}draftVal(t){if(t in this.draft)return this.draft[t];const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}stage(t,e){this.draft={...this.draft,[t]:e}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(t){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=t}modeOf(t,e="Manual"){return this.modePick[t]??this.get(t)?.state??e}stagedInput(t,e){const s=this.get(t);if(!s)return U;const i=t.split(".")[0],o=this.draftVal(t);if(!e&&"number"===i){const e=s.attributes.min??0,i=s.attributes.max??100,a=s.attributes.step??1,n=s.attributes.unit_of_measurement??"";return Q`<span class="num-box">
        <input type="number" min=${e} max=${i} step=${a} .value=${o}
          @input=${e=>this.stage(t,e.target.value)} />
        <span class="unit">${n}</span></span>`}if(!e&&"select"===i){const e=s.attributes.options??[];return Q`<select @change=${e=>this.stage(t,e.target.value)}>
        ${e.map(t=>Q`<option value=${t} .selected=${t===o}>${t}</option>`)}
      </select>`}if("duration"===e)return this.durationInput(t);const a="time"===e||/^\d{1,2}:\d{2}/.test(o);return Q`<input type=${a?"time":"text"} .value=${o}
      @change=${e=>this.stage(t,e.target.value)} />`}durationInput(t){const e=(this.draftVal(t)||"").trim(),s=/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(e),i=s?+s[1]:0,o=s?+s[2]:0,a=s?+(s[3]??0):0,n=t=>String(t).padStart(2,"0"),r=(e,s,i)=>this.stage(t,`${n(Math.max(0,Math.min(99,e)))}:${n(Math.max(0,Math.min(59,s)))}:${n(Math.max(0,Math.min(59,i)))}`),l=(t,e,s,i)=>Q`
      <span class="dur-box">
        <input type="number" min="0" max=${e} step="1" .value=${String(t)}
          @input=${t=>i(Math.floor(Number(t.target.value)||0))} />
        <span class="dur-unit">${s}</span>
      </span>`;return Q`<span class="dur-input">
      ${l(i,99,"h",t=>r(t,o,a))}
      ${l(o,59,"min",t=>r(i,t,a))}
      ${l(a,59,"s",t=>r(i,o,t))}
    </span>`}numOpts(t,e,s=1,i=String){const o=[],a=(String(s).split(".")[1]||"").length,n=s>0?Math.round((e-t)/s):0;for(let e=0;e<=n;e++){const n=Number((t+e*s).toFixed(a));o.push({label:i(n),value:String(n)})}return o}offOpts(t,e,s=1,i){return[{label:"Off",value:"0"},...this.numOpts(t,e,s,i)]}autoOpts(t,e,s=1,i){return[{label:"Automatic",value:"0"},...this.numOpts(t,e,s,i)]}optSelect(t,e,s=!1){if(!this.get(t))return U;const i=this.draftVal(t),o=e.find(t=>Number(t.value)===Number(i))?.value??e.find(t=>t.value===i)?.value??i;return Q`<select @change=${e=>{const i=e.target.value;s?this.hass?.callService("number","set_value",{entity_id:t,value:Number(i)}):this.stage(t,i)}}>
      ${e.map(t=>Q`
        <option value=${t.value} .selected=${String(t.value)===String(o)}>${t.label}</option>`)}
    </select>`}optSelectRow(t,e,s,i=!1){if(!this.get(e))return U;const o=!i&&e in this.draft?"dev-row staged":"dev-row";return Q`<div class=${o}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.optSelect(e,s,i)}</div>
    </div>`}stagedRow(t,e,s){if(!this.get(e))return U;const i=e in this.draft?"dev-row staged":"dev-row";return Q`<div class=${i}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.stagedInput(e,s)}</div>
    </div>`}stagedRangeRow(t,e,s){const i=this.get(e);if(!i)return U;const o=Math.round(Number(i.attributes.min??1)),a=Math.round(Number(i.attributes.max??100)),n=Math.max(1,Math.round(Number(i.attributes.step??1)));return this.optSelectRow(t,e,this.numOpts(o,a,n,s))}stagedPeriodRow(t,e,s){const i=this.get(t),o=this.get(e);if(!i&&!o)return U;const a=t in this.draft||e in this.draft;return Q`<div class="dev-row period-row ${a?"staged":""}">
      <span class="dev-lbl">${s}</span>
      <div class="period-times">
        ${i?this.stagedInput(t,"time"):U}
        <span class="dash">–</span>
        ${o?this.stagedInput(e,"time"):U}
      </div>
    </div>`}liveModeRow(t,e,s,i){const o=this.get(e);if(!o)return U;const a=i??o.attributes.options??[],n=this.modeOf(e,o.state);return Q`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">
        <select @change=${t=>{const i=t.target.value;this.modePick={...this.modePick,[e]:i},this.draft=s&&"Manual"===i?{[e]:i,[`power:${s}`]:"off"}:{[e]:i}}}>
          ${a.map(t=>Q`
            <option value=${t} .selected=${t===n}>${t}</option>`)}
        </select>
      </div>
    </div>`}commitBundle(t,e){const s={};for(const[t,i]of Object.entries(e))if(t in this.draft){const e=this.draft[t];s[i]="number"===t.split(".")[0]?Number(e):e}if(!Object.keys(s).length)return;const i=t.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),o=i?"light_1"===i[1]?"light":"light_2"===i[1]?"light2":i[1]:null;o&&!this.get(t)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(e)[0],module:o,settings:s}):this.hass?.callService("text","set_value",{entity_id:t,value:JSON.stringify(s)});const a={...this.draft};for(const t of Object.keys(e))delete a[t];this.draft=a}stagedSwitch(t){const e="on"===this.draftVal(t);return Q`<button class="toggle ${e?"on":""}"
      style=${e?`background:${this.accent()}`:""}
      @click=${()=>this.stage(t,e?"off":"on")} aria-label="Toggle"></button>`}stagedCtl(t,e,s){const i=this.get(t);if(!i)return U;const o=e??i.attributes.friendly_name??t.split(".")[1],a="switch"===t.split(".")[0]?this.stagedSwitch(t):this.stagedInput(t,s),n=t in this.draft;return Q`
      <div class="ctl ${n?"staged":""}">
        <div class="ctl-label">${o}</div>
        <div class="ctl-input">${a}</div>
      </div>`}applyStaged(t){for(const e of t){if(!(e in this.draft))continue;const t=this.draft[e];switch(e.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:e,value:Number(t)});break;case"text":this.hass?.callService("text","set_value",{entity_id:e,value:t});break;case"select":this.hass?.callService("select","select_option",{entity_id:e,option:t});break;case"switch":this.hass?.callService("switch","on"===t?"turn_on":"turn_off",{entity_id:e})}}const e={...this.draft};for(const s of t)delete e[s];this.draft=e}discardStaged(t){const e={...this.draft};let s=!1;for(const i of t)i in e&&(delete e[i],s=!0);s&&(this.draft=e)}applyBar(t,e={}){const s=!!e.extraDirty||t.some(t=>t in this.draft);return this.saveBar(s,()=>{this.applyStaged(t),e.onApply?.()},()=>{this.discardStaged(t),e.onDiscard?.()},"apply-bar")}envIds(){const t=this.config.panel,e=[];for(const s of[`text.sf_${t}_env_day_start`,`text.sf_${t}_env_day_end`])this.get(s)&&e.push(s);for(const[,s,i,o]of Jt)for(const a of[i,s,o]){const s=`number.sf_${t}_${a}`;this.get(s)&&e.push(s)}for(const s of["leaf_vpd_min","leaf_vpd_max"]){const i=`number.sf_${t}_${s}`;this.get(i)&&e.push(i)}return e}caliIds(){const t=this.config.panel,e=[];for(const s of["cal_air_temp","cal_air_humidity","cal_ppfd","cal_co2"]){const i=`number.sf_${t}_${s}`;this.get(i)&&e.push(i)}for(const s of this.caliSoilSlots()){for(const i of["cal_temp","cal_moisture","cal_ec"]){const o=`number.sf_${t}_${s}_${i}`;this.get(o)&&e.push(o)}const i=`select.sf_${t}_${s}_substrate`;this.get(i)&&e.push(i)}for(const s of[`number.sf_${t}_leaf_offset`,`number.sf_${t}_leaf_offset_night`])this.get(s)&&e.push(s);return e}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.panel??"",e=this.config.outlets??[];if(!this.hass)return e;const s=[];t&&this.get(`switch.sf_${t}_outlet_1`)&&s.push(t);const i=new Set(Dt(this.hass,t));for(const o of e)o!==t&&i.has(o)&&s.push(o);return s}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}outletOnly(){if(!this.hasOutlets())return!1;const t=!(!this.get(this.eid("sensor","temperature"))&&!this.get(this.eid("sensor","humidity"))),e=!!this.get(this.eid("sensor","soil_avg_temperature")),s=this.overviewDevices().length>0,i=!!this.get(this.eid("number","env_temp_day"));return!(t||e||s||i)}rangeSelect(t){const e=this.get(t);if(!e)return U;const s=Number(e.attributes.min??0),i=Number(e.attributes.max??100),o=Number(e.attributes.step??1)||1,a=e.attributes.unit_of_measurement??"";return this.optSelect(t,this.numOpts(s,i,o,t=>`${t}${a}`),!1)}envControl(t,e){return this.get(t)?Q`
      <div class="ctl">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">${this.rangeSelect(t)}</div>
      </div>`:U}planEntity(){return this.get(`sensor.sf_${this.config.panel}_plan`)}hasPlan(){return!!this.planEntity()}planInfo(){const t=this.planEntity(),e=t?.attributes??{};return{active:!!e.active,stages:Array.isArray(e.stages)?e.stages:[],progress:e.progress&&"object"==typeof e.progress?e.progress:{}}}renderEnv(){if(!this.hasEnv())return Q`<div class="cali-empty">No environment targets reported for this device yet.</div>`;if(!this.hasPlan())return this.renderEnvBody(!0);const t=this.planInfo(),e=this.envSubView??(t.active?"plan":"env"),s=this.accent(),i=(t,i)=>Q`
      <button class="env-seg ${e===t?"active":""}"
        style=${e===t?`color:${s};border-color:${s}`:""}
        @click=${()=>this.envSubView=t}>${i}</button>`;return Q`
      <div class="env-seg-row">
        ${i("env","Environment")}
        ${i("plan","Planting Plan")}
      </div>
      ${"plan"===e?this.renderPlan(t):this.renderEnvBody(!1)}`}renderEnvBody(t){const e=this.config.panel,s=`text.sf_${e}_env_day_start`,i=`text.sf_${e}_env_day_end`,o=this.get(s)||this.get(i);return Q`
      ${t?Q`<div class="section-label">Environment</div>`:U}
      ${o?Q`<div class="env-cycle">
            ${this.stagedCtl(s,"Day Cycle Start","time")}
            ${this.stagedCtl(i,"Day Cycle Stop","time")}
          </div>`:U}
      ${Jt.map(([t,s,i,o,a])=>this.get(`number.sf_${e}_${s}`)?Q`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${a} style="color:${this.accent()}"></ha-icon>
              <span>${t}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${e}_${i}`,"Night")}
              ${this.envControl(`number.sf_${e}_${s}`,"Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${e}_${o}`,"Dead Zone")}
            </div>
          </div>`:U)}
      ${this.renderLeafVpdTargets()}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`}renderPlan(t){if(null!=this.planEditStage&&this.planDraft)return this.renderStageEditor(this.planEditStage);if(this.planTplOpen)return this.renderPlanTemplatePicker();const e=this.accent(),s=`switch.sf_${this.config.panel}_plan_enabled`,i=!!this.get(s),o=t.stages,a=t.progress||{},n=t=>{const e=Math.max(0,o.findIndex(e=>e.stageId===t)),s=this.planShowAll?o.map((t,e)=>e):[e];return Q`
        <div class="section-label">Stages</div>
        ${s.map(e=>this.renderPlanStage(o[e],t,e))}
        ${o.length>1?Q`<button class="plan-editbtn" style="margin:2px 0 6px"
          @click=${()=>{this.planShowAll=!this.planShowAll}}>
          ${this.planShowAll?"Show less":`Show all ${o.length} stages`}</button>`:U}
        <div style="display:flex;gap:10px">
          <button class="plan-btn" style="flex:1" @click=${()=>this.addPlanStage()}>+ Add stage</button>
          <button class="plan-btn" style="flex:1" @click=${()=>{this.planTplOpen="append"}}>+ From template</button>
        </div>`},r=(t,i)=>Q`
      <button class="plan-btn ${i?"stop":"start"}"
        style=${i?"":`background:${e};border-color:${e};color:#0c1f06`}
        @click=${()=>{this.envSubView="plan",this.hass?.callService("switch",i?"turn_off":"turn_on",{entity_id:s}),this.setPlanLights(!i)}}>
        ${t}</button>`;if(!t.active)return o.length?Q`
        <div class="plan-banner">
          <ha-icon icon="mdi:sprout-outline" style="color:var(--secondary-text-color)"></ha-icon>
          <div style="flex:1">
            <div class="plan-banner-title">Planting plan stopped</div>
            <div class="plan-banner-sub">
              ${o.length} stage${1===o.length?"":"s"} · running the manual Environment targets
            </div>
          </div>
        </div>
        ${n(null)}
        ${i?Q`<div class="plan-actions">${r("Start Plan",!1)}</div>`:U}`:Q`
          <div class="plan-empty">
            <ha-icon icon="mdi:sprout-outline"></ha-icon>
            <div class="plan-empty-title">No planting plan running</div>
            <div class="plan-empty-sub">
              Create a plan here, or in the Spider Farmer app. While a plan runs
              the manual Environment targets pause.
            </div>
            <div style="display:flex;gap:10px;max-width:340px;margin:14px auto 0">
              <button class="plan-btn" style="flex:1;background:${e};border-color:${e};color:#0c1f06"
                @click=${()=>{this.planTplOpen="new"}}>From template</button>
              <button class="plan-btn" style="flex:1"
                @click=${()=>this.startPlanEdit(!0)}>Custom</button>
            </div>
          </div>`;const l=o.find(t=>t.stageId===a.stageId)||o[0],c=Number(a.progress),d=Number.isFinite(c),h=[];return null!=a.planted&&h.push(`${this.fmtNum(a.planted)} planted`),null!=a.remain&&h.push(`${this.fmtNum(a.remain)} left`),null!=a.totalDays&&h.push(`${this.fmtNum(a.totalDays)} total`),Q`
      <div class="plan-banner">
        <ha-icon icon="mdi:sprout" style="color:${e}"></ha-icon>
        <div style="flex:1">
          <div class="plan-banner-title">${l&&l.label||"Planting plan active"}</div>
          <div class="plan-banner-sub">
            ${h.length?h.join(" · ")+" days":`${o.length} stage${1===o.length?"":"s"} · managed by the controller`}
          </div>
        </div>
        ${d?Q`<div class="plan-pct" style="color:${e}">${Math.round(c)}%</div>`:U}
      </div>
      ${d?Q`<div class="plan-bar"><div class="plan-bar-fill"
            style="width:${Math.max(0,Math.min(100,c))}%;background:${e}"></div></div>`:U}
      ${n(a.stageId)}
      ${i?Q`<div class="plan-actions">${r("Stop Plan",!0)}</div>`:U}
      <div class="plan-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>While a plan is active the controller sets temperature, humidity
        and CO₂ from the plan schedule. Switch to Environment to see the manual
        targets used when no plan runs.</span>
      </div>`}decodePlanDate(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return null;const s=255&e,i=(e>>8)-494344;if(i<=0||s<1||s>31)return null;const o=new Date(Math.floor((i-1)/12),(i-1)%12,s);return isNaN(o.getTime())?null:o}planStageDates(t){const e=this.decodePlanDate(t.start),s=this.decodePlanDate(t.end);if(!e||!s)return"";const i=t=>t.toLocaleDateString(void 0,{month:"short",day:"numeric"}),o=Math.round((s.getTime()-e.getTime())/864e5)+1,a=e.getFullYear()!==s.getFullYear()?`, ${s.getFullYear()}`:"";return`${i(e)} – ${i(s)}${a} · ${o} day${1===o?"":"s"}`}encodePlanCode(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t||"");if(!e)return null;const s=+e[1],i=+e[2],o=+e[3];return i<1||i>12||o<1||o>31?null:12*s+i+494344<<8|o}codeToInputDate(t){const e=this.decodePlanDate(t);if(!e)return"";const s=t=>String(t).padStart(2,"0");return`${e.getFullYear()}-${s(e.getMonth()+1)}-${s(e.getDate())}`}tempUnitF(){const t=this.get(`number.sf_${this.config.panel}_env_temp_day`)?.attributes?.unit_of_measurement;return"°F"===t||"℉"===t}peSelect(t,e,s){const i=e.find(e=>Number(e.value)===Number(t))?.value??e.find(e=>e.value===String(t))?.value??String(t??"");return Q`<select class="pe-sel" @change=${t=>s(t.target.value)}>
      ${e.map(t=>Q`<option value=${t.value}
        .selected=${String(t.value)===String(i)}>${t.label}</option>`)}
    </select>`}envOptsFor(t){const e=this.get(`number.sf_${this.config.panel}_${t}`),s=Number(e?.attributes?.min??0),i=Number(e?.attributes?.max??100),o=Number(e?.attributes?.step??1)||1,a=e?.attributes?.unit_of_measurement??"";return this.numOpts(s,i,o,t=>`${t}${a}`)}epochToLocalInput(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return"";const s=new Date(1e3*e),i=t=>String(t).padStart(2,"0");return`${s.getFullYear()}-${i(s.getMonth()+1)}-${i(s.getDate())}T${i(s.getHours())}:${i(s.getMinutes())}`}localInputToEpoch(t){const e=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(t||"");if(e)return Math.floor(new Date(+e[1],+e[2]-1,+e[3],+e[4],+e[5]).getTime()/1e3)}threshToDisp(t){const e=Number(t);return Number.isFinite(e)&&0!==e?String(this.tempUnitF()?Math.round(9*e/5+32):Math.round(e)):"0"}threshToC(t){const e=Number(t);return Number.isFinite(e)&&0!==e?this.tempUnitF()?Math.round(5*(e-32)/9*1e4)/1e4:e:0}threshOpts(){const t=this.tempUnitF(),e=t?"°F":"°C";return[{label:"Off",value:"0"},...this.numOpts(t?59:15,t?122:50,1,t=>`${t}${e}`)]}durText(t,e){const s=/^(\d{2}):(\d{2})/.exec(t||""),i=/^(\d{2}):(\d{2})/.exec(e||"");if(!s||!i)return"";let o=(60*+i[1]+ +i[2]-(60*+s[1]+ +s[2])+1440)%1440;0===o&&t===e&&(o=0);return`${Math.floor(o/60)}h ${String(o%60).padStart(2,"0")}m`}hrsText(t,e){const s=/^(\d{1,2}):(\d{2})/.exec(t||""),i=/^(\d{1,2}):(\d{2})/.exec(e||"");if(!s||!i)return"";const o=(60*+i[1]+ +i[2]-(60*+s[1]+ +s[2])+1440)%1440;return`${Math.floor(o/60)}:${String(o%60).padStart(2,"0")}hrs`}startPlanEdit(t=!1){const e=this.tempUnitF(),s=t=>{const s=Number(t);return null!=t&&""!==t&&Number.isFinite(s)?e?Math.round(9*s/5+32):Math.round(10*s)/10:""},i=t=>{const s=Number(t);return null!=t&&""!==t&&Number.isFinite(s)?e?Math.round(9*s/5):Math.round(10*s)/10:""};if(t)return this.planDraft=[{stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}],void(this.planEditStage=0);const o=t=>t?{...t,go_dark:this.threshToDisp(t.go_dark),turn_off:this.threshToDisp(t.turn_off)}:null;this.planDraft=this.planInfo().stages.map(t=>({stageId:t.stageId,label:t.label||"",start:this.codeToInputDate(t.start),end:this.codeToInputDate(t.end),alarm:this.epochToLocalInput(t.alarm),temp_day:s(t.temp_day),temp_night:s(t.temp_night),temp_dz:i(t.temp_dz),humi_day:t.humi_day??"",humi_night:t.humi_night??"",humi_dz:t.humi_dz??"",co2_day:t.co2_day??"",co2_night:t.co2_night??"",co2_dz:t.co2_dz??"",light1:o(t.light1)??{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:o(t.light2)}))}planDraftSet(t,e,s){this.planDraft&&(this.planDraft=this.planDraft.map((i,o)=>o===t?{...i,[e]:s}:i))}addPlanStage(){this.planDraft||this.startPlanEdit();const t={stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:null},e=this.planDraft??[];this.planDraft=[...e,t],this.planEditStage=e.length}removePlanStage(t){this.planDraft&&(this.planDraft=this.planDraft.filter((e,s)=>s!==t),this.planEditStage=null,this.savePlanEdit(this.planInfo().active))}savePlanEdit(t){if(!this.planDraft)return;const e=this.tempUnitF(),s=t=>{const e=Number(t);return""!==t&&null!=t&&Number.isFinite(e)?e:void 0},i=t=>{const i=s(t);if(void 0!==i)return e?Math.round(5*(i-32)/9*1e4)/1e4:i},o=t=>{if(t)return{...t,go_dark:this.threshToC(t.go_dark),turn_off:this.threshToC(t.turn_off)}},a=this.planDraft.map(t=>{const a=this.encodePlanCode(t.start),n=this.encodePlanCode(t.end);let r=this.localInputToEpoch(t.alarm);if(void 0===r){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t.start||"");e&&(r=Math.floor(new Date(+e[1],+e[2]-1,+e[3],12,0,0).getTime()/1e3))}const l={},c=(t,e,s,i)=>{const o={};void 0!==e&&(o.day=e),void 0!==s&&(o.night=s),void 0!==i&&(o.dz=i),Object.keys(o).length&&(l[t]=o)},d=(t,e,s)=>void 0!==t?t:e?void 0:s,h=this.planEnvHas("temp"),p=this.planEnvHas("humi"),u=this.planEnvHas("co2");c("temp",d(i(t.temp_day),h,25),d(i(t.temp_night),h,20),d((t=>{const i=s(t);if(void 0!==i)return e?Math.round(5*i/9*1e4)/1e4:i})(t.temp_dz),h,2)),c("humi",d(s(t.humi_day),p,60),d(s(t.humi_night),p,55),d(s(t.humi_dz),p,5)),c("co2",d(s(t.co2_day),u,500),d(s(t.co2_night),u,500),d(s(t.co2_dz),u,100));const g={stageId:t.stageId,label:t.label,start:a,end:n,alarm:r,target:l};return g.light1=o(this.planLightHas("light1")?t.light1??this.defaultPlanLight():this.offPlanLight()),g.light2=o(this.planLightHas("light2")?t.light2??this.defaultPlanLight():this.offPlanLight()),g});this.hass?.callService("sf","set_plan",{entity_id:`sensor.sf_${this.config.panel}_plan`,stages:a,enabled:t}),t&&this.setPlanLights(!0),this.planDraft=null,this.planEditStage=null}setPlanLights(t){const e=t?"PPFD - Plan":"Manual";for(const s of["light_1","light_2"]){const i=`select.sf_${this.config.panel}_${s}_mode`;if(!this.get(i))continue;this.hass?.callService("select","select_option",{entity_id:i,option:e}),this.modePick={...this.modePick,[i]:e};const o=`light.sf_${this.config.panel}_${s}`;this.get(o)&&this.hass?.callService("light",t?"turn_on":"turn_off",{entity_id:o})}}presetDraftStage(t){const e=this.tempUnitF(),s=t=>e?Math.round(9*t/5+32):Math.round(10*t)/10,i=()=>"dry"===t.key?{mode:"Time Slot",ts_start:"00:00",ts_stop:"00:00",ts_bri:11,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}:{mode:"PPFD",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:t.ppfd??300,ppfd_start:t.on??"05:00",ppfd_stop:t.off??"23:00",ppfd_fade:t.fade??30,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0};return{stageId:null,label:t.label,start:"",end:"",alarm:"",temp_day:s(t.tC),temp_night:s(t.tCn),temp_dz:(t=>e?Math.round(9*t/5):Math.round(10*t)/10)(t.tDz),humi_day:t.hd,humi_night:t.hn,humi_dz:t.hDz,co2_day:t.cd??"",co2_night:t.cn??"",co2_dz:t.cDz??"",light1:i(),light2:i()}}myTemplates(){if(this._myTpl)return this._myTpl;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e=t?.plan_templates;if(e)try{const t=JSON.parse(e);if(Array.isArray(t))return t}catch{}try{const t=JSON.parse(localStorage.getItem(Yt.MY_TPL_KEY)||"[]");return Array.isArray(t)?t:[]}catch{return[]}}saveMyTemplate(t){const e=(t||"").trim();if(!this.planDraft||!e)return;const s=this.myTemplates().filter(t=>t.name!==e);s.push({name:e,stages:JSON.parse(JSON.stringify(this.planDraft))}),this._myTpl=s,this.persistColorOption("plan_templates",JSON.stringify(s)),this.planTplName="",this._tplMsg=`“${e}” saved to My templates`,clearTimeout(this._tplMsgT),this._tplMsgT=setTimeout(()=>{this._tplMsg=""},3e3)}deleteMyTemplate(t){const e=this.myTemplates().filter(e=>e.name!==t);this._myTpl=e,this.persistColorOption("plan_templates",JSON.stringify(e)),this.requestUpdate()}usePreset(t,e){const s=this.presetDraftStage(t);e&&this.planDraft?(this.planDraft=[...this.planDraft,s],this.planEditStage=this.planDraft.length-1):(this.planDraft=[s],this.planEditStage=0),this.planTplOpen=null}useMyTemplate(t,e){const s=this.myTemplates().find(e=>e.name===t);if(!s)return;const i=JSON.parse(JSON.stringify(s.stages));e&&this.planDraft?this.planDraft=[...this.planDraft,...i]:this.planDraft=i,this.planEditStage=0,this.planTplOpen=null}renderPlanTemplatePicker(){const t=this.accent(),e="append"===this.planTplOpen,s=this.tempUnitF()?"°F":"°C",i=t=>this.tempUnitF()?Math.round(9*t/5+32):Math.round(10*t)/10,o=this.myTemplates(),a=(e,s,i,o)=>Q`
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--divider-color,#2a2f31)">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
          <span style="font-weight:600">${e}</span>
          <span style="font-size:12px;color:var(--secondary-text-color)">${s}</span>
        </div>
        <span style="display:flex;gap:6px;flex:none">
          <button class="plan-editbtn" style="border-color:${t};color:${t}" @click=${i}>Use</button>
          ${o?Q`<button class="plan-editbtn" @click=${o}>Delete</button>`:U}
        </span>
      </div>`;return Q`
      <div class="section-label">${e?"Add a stage from a template":"New plan from a template"}</div>
      <div style="font-size:12px;color:var(--secondary-text-color);margin:2px 0 4px">System templates</div>
      ${Yt.PLAN_PRESETS.map(t=>a(`${t.emoji} ${t.label}`,"dry"===t.key?"lights off · dark · set dates on apply":`${i(t.tC)}/${i(t.tCn)}${s} · ${t.hd}/${t.hn}% RH · PPFD ${t.ppfd}`,()=>this.usePreset(t,e)))}
      <div style="font-size:12px;color:var(--secondary-text-color);margin:12px 0 4px">My templates</div>
      ${o.length?o.map(t=>a(`💾 ${t.name}`,`${t.stages.length} stage${1===t.stages.length?"":"s"}`,()=>this.useMyTemplate(t.name,e),()=>this.deleteMyTemplate(t.name))):Q`<div style="font-size:12px;color:var(--secondary-text-color);padding:6px 0">
            No saved templates yet — build or edit a plan, then “Save as template”.</div>`}
      <button class="plan-btn" style="margin-top:12px" @click=${()=>{this.planTplOpen=null}}>Cancel</button>`}renderStageLight(t,e){const s=this.accent(),i=this.planDraft[t][e];if(!i)return U;const o=(s,o)=>this.planDraftSet(t,e,{...i,[s]:o}),a=t=>Q`<input type="time" class="pe-in"
      .value=${String(i[t]??"")} @change=${e=>o(t,e.target.value)}>`,n=(t,e)=>this.peSelect(i[t],e,e=>o(t,e)),r=t=>Q`<button class="pe-modebtn ${i.mode===t?"on":""}"
      style=${i.mode===t?`border-color:${s};color:${s}`:""}
      @click=${()=>o("mode",t)}>${t}</button>`,l="PPFD"===i.mode,c=l?"ppfd_start":"ts_start",d=l?"ppfd_stop":"ts_stop",h=this.durText(i[c],i[d]),p=this.numOpts(11,100,1,t=>`${t}%`),u=this.numOpts(20,2e3,10,t=>`${t} µmol`),g=this.offOpts(1,60,1,t=>`${t} min`),m=(t,e)=>Q`<label class="pe-cell">
      <span>${t}</span>${e}</label>`,f=t=>Q`<div class="pe-cellrow">${t}</div>`,v=m("Go dark",n("go_dark",this.threshOpts())),b=m("Turn off",n("turn_off",this.threshOpts()));return Q`
      <div class="pe-light">
        <div class="pe-light-head"><span>${"light1"===e?"Light 1":"Light 2"}</span>
          <span class="pe-modes">${r("Time Slot")}${r("PPFD")}</span></div>
        <div class="pe-timesrow">
          <label>On${a(c)}</label>
          <label>Off${a(d)}</label>
        </div>
        ${h?Q`<div class="pe-durrow">Light Duration · ${h}</div>`:U}
        ${l?Q`
          ${f([m("Target",n("ppfd_target",u)),m("Dim min",n("ppfd_min",p)),m("Dim max",n("ppfd_max",p)),m("Sunrise/set",n("ppfd_fade",g))])}
          ${f([v,b])}`:Q`
          ${f([m("Brightness",n("ts_bri",p)),m("Sunrise/set",n("ts_fade",g)),v,b])}`}
      </div>`}renderStageEditor(t){const e=this.accent(),s=this.tempUnitF()?"°F":"°C",i=this.planDraft[t],o=(e,s)=>this.planDraftSet(t,e,s),a=t=>Q`<input type="date" class="pe-in"
      .value=${String(i[t]??"")} @change=${e=>o(t,e.target.value)}>`,n=(t,e,s,a)=>Q`
      <div class="pe-row"><span class="pe-lbl">${t}</span>
        <span class="pe-cells">
          ${this.peSelect(i[e+"_night"],s,t=>o(e+"_night",t))}
          ${this.peSelect(i[e+"_day"],s,t=>o(e+"_day",t))}
          ${this.peSelect(i[e+"_dz"],a,t=>o(e+"_dz",t))}
        </span></div>`;return Q`
      ${this.planDelArm?Q`<div class="pe-head pe-delrow">
            <span class="pe-delq">Delete this stage?</span>
            <button class="pe-del-yes" @click=${()=>{this.planDelArm=!1,this.removePlanStage(t)}}>Delete</button>
            <button class="pe-del-no" @click=${()=>{this.planDelArm=!1}}>Cancel</button>
          </div>`:Q`<div class="pe-head">
            <ha-icon icon="mdi:arrow-left" class="pe-back"
              @click=${()=>{this.planEditStage=null,this.planDelArm=!1}}></ha-icon>
            <input class="pe-name" .value=${i.label||""}
              @change=${t=>o("label",t.target.value)}>
            <ha-icon icon="mdi:delete" class="pe-del"
              @click=${()=>{this.planDelArm=!0}}></ha-icon>
          </div>`}
      <div class="pe-dates">
        <label>Start${a("start")}</label>
        <label>End${a("end")}</label>
      </div>
      <div class="pe-alarmrow">
        <label>Alarm<input type="datetime-local" class="pe-in"
          .value=${String(i.alarm??"")}
          @change=${t=>o("alarm",t.target.value)}></label>
      </div>
      <div class="pe-grid-head"><span></span><span class="pe-cells">
        <span>Night</span><span>Day</span><span>Dead</span></span></div>
      ${this.planEnvHas("temp")?n("Temp "+s,"temp",this.envOptsFor("env_temp_day"),this.envOptsFor("env_temp_deadband")):U}
      ${this.planEnvHas("humi")?n("Humidity","humi",this.envOptsFor("env_humi_day"),this.envOptsFor("env_humi_deadband")):U}
      ${this.planEnvHas("co2")?n("CO₂","co2",this.envOptsFor("env_co2_day"),this.envOptsFor("env_co2_deadband")):U}
      ${this.planLightHas("light1")?this.renderStageLight(t,"light1"):U}
      ${this.planLightHas("light2")?this.renderStageLight(t,"light2"):U}
      <div class="plan-actions" style="display:flex;gap:10px">
        <button class="plan-btn" style="flex:1;background:${e};border-color:${e};color:#0c1f06"
          @click=${()=>this.savePlanEdit(this.planInfo().active)}>${this.planInfo().active?"Save & activate":"Save Plan"}</button>
        <button class="plan-btn" style="flex:1"
          @click=${()=>{this.planDraft=null,this.planEditStage=null,this.planDelArm=!1}}>Cancel</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
        <input class="pe-name" style="flex:1;min-width:0" placeholder="Template name"
          .value=${this.planTplName}
          @input=${t=>{this.planTplName=t.target.value}}>
        <button class="plan-btn" style="flex:0 0 auto;width:auto;padding:11px 14px;white-space:nowrap"
          ?disabled=${!this.planTplName.trim()}
          @click=${()=>this.saveMyTemplate(this.planTplName)}>Save as template</button>
      </div>
      ${this._tplMsg?Q`<div style="display:flex;align-items:center;gap:6px;margin-top:8px;
        color:#46c98a;font-size:13px;font-weight:600">
        <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:18px"></ha-icon>${this._tplMsg}</div>`:U}
      <div class="plan-note" style="margin-top:6px">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>“Save as template” stores this whole plan under My templates (on the
        controller, so it syncs across your devices) — it doesn't change the running
        plan. Use “${this.planInfo().active?"Save & activate":"Save Plan"}” to apply it to the controller.</span>
      </div>`}editStage(t){this.planDraft||this.startPlanEdit(),this.planEditStage=t,this.planDelArm=!1}planEnvHas(t){const e="temp"===t?"temperature":"humi"===t?"humidity":"co2";return!!this.get(`sensor.sf_${this.config.panel}_${e}`)}planLightHas(t){return!!this.get(this.eid("light","light1"===t?"light_1":"light_2"))}defaultPlanLight(){return{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}offPlanLight(){return{mode:"Manual",ts_start:"05:00",ts_stop:"23:00",ts_bri:0,ts_fade:0,ppfd_target:0,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:0,ppfd_max:0,go_dark:0,turn_off:0}}renderPlanStage(t,e,s=-1){const i=this.accent(),o=null!=e&&t.stageId===e,a=this.planStageDates(t),n=(t,e,s,i="")=>Q`
      <div class="plan-metric">
        <span class="plan-metric-label">${t}</span>
        <span class="plan-metric-vals">
          <span>N ${this.fmtNum(e)}${i}</span>
          <span>D ${this.fmtNum(s)}${i}</span>
        </span>
      </div>`;return Q`
      <div class="plan-stage ${o?"current":""}"
        style=${o?`border-color:${i}`:""}>
        <div class="plan-stage-head">
          <span class="plan-stage-dot" style="background:${i}"></span>
          <span class="plan-stage-name">${t.label||"Stage"}</span>
          ${o?Q`<span class="plan-stage-badge" style="color:${i};border-color:${i}">Current</span>`:U}
          ${s>=0?Q`<ha-icon icon="mdi:pencil" class="plan-stage-edit"
            @click=${()=>this.editStage(s)}></ha-icon>`:U}
        </div>
        ${a?Q`<div class="plan-stage-dates">${a}</div>`:U}
        <div class="plan-stage-grid">
          ${this.planEnvHas("temp")?n("Temp",this.fmtTemp(t.temp_night),this.fmtTemp(t.temp_day)):U}
          ${this.planEnvHas("humi")?n("Humidity",t.humi_night,t.humi_day,"%"):U}
          ${this.planEnvHas("co2")?n("CO₂",t.co2_night,t.co2_day,""):U}
        </div>
      </div>`}fmtTemp(t){if(null==t||""===t)return"–";const e=Number(t);if(!Number.isFinite(e))return"–";const s=this.get(`number.sf_${this.config.panel}_env_temp_day`),i=s?.attributes?.unit_of_measurement;return"°F"===i||"℉"===i?`${Math.round(9*e/5+32)}°`:`${Math.round(e)}°`}fmtNum(t){if(null==t||""===t)return"–";const e=Number(t);return Number.isFinite(e)?`${Math.round(e)}`:String(t)}vpdRangeFor(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const o=Number(s.state),a=Number(i.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,c="°C"===s.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3)),p=Math.max(0,a-l),u=Math.min(100,a+l),g=Math.max(0,h(d(o-r))*(1-u/100)),m=Math.max(0,h(d(o+r))*(1-p/100));return`${g.toFixed(2)} – ${m.toFixed(2)}`}renderVpd(){const t=this.config.panel,e=this.vpdRangeFor(`number.sf_${t}_env_temp_day`,`number.sf_${t}_env_humi_day`),s=this.vpdRangeFor(`number.sf_${t}_env_temp_night`,`number.sf_${t}_env_humi_night`);return e||s?Q`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${e?Q`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${e}</span>
              </div>`:U}
          ${s?Q`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${s}</span>
              </div>`:U}
        </div>
      </div>`:U}renderLeafVpdTargets(){if(!this.showLeafVpd)return U;const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max"));if(!t||!e)return U;const s=(t,e)=>{const s=this.eid("number",t);return Q`
      <div class="ctl ${s in this.draft?"staged":""}">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">
          <span class="num-box">
            <input type="number" step="0.05" min="0" max="4" .value=${this.draftVal(s)}
              @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&this.stage(s,String(e))}} />
            <span class="unit">kPa</span>
          </span>
        </div>
      </div>`};return Q`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:leaf" style="color:${this.accent()}"></ha-icon>
          <span>Leaf VPD target</span>
        </div>
        <div class="leaf-tgt-grid">
          ${s("leaf_vpd_min","Min")}
          ${s("leaf_vpd_max","Max")}
        </div>
        <div class="set-note" style="margin:8px 2px 0">
          Colours the Leaf VPD tile when it drifts outside this band, using the
          Settings-tab highlight colours.
        </div>
      </div>`}toggleOutlet(t){this.outletOpen=t,this.outletCopyOpen=!1,this.outletCopyFromOpen=!1,this.outletCopySel={}}outletNums(t){const e=[];for(let s=1;s<=10;s++)this.get(`select.sf_${t}_outlet_${s}_mode`)&&e.push(s);return e}outletName(t,e){if(this.customOutletNames){const s=this.outletNames[`${t}_${e}`];if(s&&s.trim())return s.trim()}return`Outlet ${e}`}stageOutletName(t,e,s){this.outletNameDraft={...this.outletNameDraft,[`${t}_${e}`]:s}}outletNameDirty(t,e){const s=`${t}_${e}`;return s in this.outletNameDraft&&this.outletNameDraft[s].trim()!==(this.outletNames[s]??"").trim()}clearOutletNameDraft(t,e){const s=`${t}_${e}`;if(!(s in this.outletNameDraft))return;const i={...this.outletNameDraft};delete i[s],this.outletNameDraft=i}commitOutletName(t,e){const s=`${t}_${e}`;if(!(s in this.outletNameDraft))return;const i=this.outletNameDraft[s].trim(),o={...this.outletNames};i?o[s]=i:delete o[s],this.outletNames=o,this.persistColorOption(`outlet_name_${t}_${e}`,i),this.cacheColors(),this.clearOutletNameDraft(t,e)}ledToggle(t){const e=`switch.sf_${t}_indicator_light`,s=this.get(e);if(!s)return U;const i="on"===s.state,o=this.accent();return Q`
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:400">
        <span style="opacity:.7">Indicator light</span>
        <button class="toggle sm ${i?"on":""}"
          style=${i?`background:${o}`:U}
          title="Indicator Light"
          aria-label="Indicator Light"
          @click=${()=>this.hass?.callService("switch","toggle",{entity_id:e})}></button>
      </span>`}renderOutlets(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return U;const e=this.outletOpen?this.outletOpen.slice(0,this.outletOpen.lastIndexOf("_")):null;return Q`
      ${this.outletOnly()?this.renderEnergyTile():U}
      ${t.map(t=>{const s=Mt(this.hass,t)||(t.startsWith("st")?"S-Station":`${t.toUpperCase()} Power Strip`);return Q`
          <div class="section-label" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span>${s}</span>
            ${this.ledToggle(t)}
          </div>
          ${this.renderQuickRow(t)}
          <div class="grid">
            ${this.outletNums(t).map(e=>this.outletTile(t,e))}
          </div>
          ${e===t?this.renderOutletPop():U}`})}`}ologKey(t){return`${t}|${this.ologRange}`}async fetchOlog(t){const e=this.ologKey(t);if(!this._olog[e]&&!this._ologLoading[e]&&this.hass){this._ologLoading[e]=!0;try{const s=new Date,i=new Date(s.getTime()-3600*this.ologRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),a=o&&o[t]||[];this._olog[e]=a.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),on:"on"===(t.s??t.state)})).filter(t=>Number.isFinite(t.t))}catch{this._olog[e]=[]}finally{this._ologLoading[e]=!1,this._ologVer++}}}ologSegments(t,e,s){const i=this._olog[t]||[],o=s-e,a=[];for(let t=0;t<i.length;t++){if(!i[t].on)continue;const n=Math.max(i[t].t,e),r=t+1<i.length?i[t+1].t:s;r<=n||a.push({left:(n-e)/o*100,width:(r-n)/o*100})}return a}ologEvents(t,e){const s=this._olog[t]||[],i=[];for(let t=s.length-1;t>=0&&i.length<10;t--){const o=t+1<s.length?s[t+1].t:e;i.push({on:s[t].on,t:s[t].t,dur:s[t].on?o-s[t].t:null})}return i}ologAxis(){const t=this.ologRange>=168?["7d","5d","3d","1d","now"]:["24h","18h","12h","6h","now"];return Q`<div class="olog-axis">${t.map(t=>Q`<span>${t}</span>`)}</div>`}ologTickStyle(){const t="rgba(255,255,255,0.12)";return`background-image:repeating-linear-gradient(to right,${t} 0,${t} 1px,transparent 1px,transparent ${(100/(this.ologRange<=24?24:7)).toFixed(4)}%)`}ologTime(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",hour12:this.hour12})}ologDur(t){const e=Math.round(t/6e4);if(e<60)return`${e}m`;const s=Math.floor(e/60),i=e%60;return i?`${s}h${i}m`:`${s}h`}ologAgo(t){const e=Math.round(t/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const s=Math.floor(e/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}ologRow(t,e,s,i){const o=`switch.sf_${t}_outlet_${e}`,a=this.ologKey(o);this._olog[a]||this.fetchOlog(o);const n=this.outletKey(t,e),r=this.ologOpen===n,l="on"===this.get(o)?.state,c=this._olog[a]||[],d=c.length?c[c.length-1].t:null,h=l?"On now":d?`Off · ${this.ologAgo(i-d)}`:"Off",p=!!this._ologLoading[a]&&!this._olog[a],u=this.ologSegments(a,s,i);return Q`
      <div class="olog-row" role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>{this.ologOpen=r?null:n}}>
        <div class="olog-nm">${this.outletName(t,e)}<span class="olog-cur">${h}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${p?Q`<span class="olog-load">Loading…</span>`:u.map(t=>Q`<span class="olog-seg"
                style="left:${t.left.toFixed(2)}%;width:${Math.max(.4,t.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${r?Q`<div class="olog-exp">
        ${(()=>{const t=this.ologEvents(a,i);return t.length?t.map(t=>Q`<div class="olog-ev">
              <span><span class=${t.on?"on":"off"}>${t.on?"On":"Off"}</span> · ${this.ologTime(t.t)}</span>
              <span class="dur">${null!=t.dur?this.ologDur(t.dur):"—"}</span>
            </div>`):Q`<div class="olog-ev" style="color:var(--secondary-text-color)">No switch events in this window.</div>`})()}
      </div>`:U}`}vpdBand(){if(this.vpdPlanSource){const t=this.vpdPlanBand();if(t)return t}switch(this.vpdStage){case"prop":return[.4,.8];case"flower":return[1.2,1.6];case"custom":return this.vpdCustom;default:return[.8,1.2]}}vpdPlanBand(){try{const t=this.planStageCurrent?.(),e=String(t?.name??t?.stageName??"").toLowerCase();if(!e)return null;if(/seed|clone|prop|germ/.test(e))return[.4,.8];if(/veg/.test(e))return[.8,1.2];if(/flow|bloom|fruit|dry/.test(e))return[1.2,1.6]}catch{}return null}vpdPlanName(){try{const t=this.planStageCurrent?.();return String(t?.name??t?.stageName??"")}catch{return""}}vpdReadings(){const t=this.get(`sensor.sf_${this.config.panel}_temperature`),e=this.get(`sensor.sf_${this.config.panel}_humidity`);if(!t||!e)return null;const s=parseFloat(t.state),i=parseFloat(e.state);if(!Number.isFinite(s)||!Number.isFinite(i))return null;const o=t.attributes.unit_of_measurement||"°C",a=/F/i.test(o),n=a?5*(s-32)/9:s,r=t=>610.7*Math.exp(17.27*t/(t+237.3))/1e3,l=r(n)*i/100;return{airT:s,rh:i,isF:a,unit:o,air:r(n)-l,leaf:r(n-2)-l}}async fetchVpdHist(t){if(!this._graph[t]&&!this._graphLoading[t]&&this.hass){this._graphLoading[t]=!0;try{const e=new Date,s=new Date(e.getTime()-864e5),i=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:e.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),o=i&&i[t]||[];this._graph[t]=o.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),v:parseFloat(t.s??t.state)})).filter(t=>Number.isFinite(t.v)&&Number.isFinite(t.t))}catch{this._graph[t]=[]}finally{this._graphLoading[t]=!1,this._graphVer++}}}renderVpdTab(){const t=this.accent(),e=this.vpdReadings();if(!e)return Q`<div style="padding:24px 16px;color:var(--secondary-text-color);text-align:center">
        Waiting for this panel's air temperature and humidity…</div>`;const s=this.vpdBand(),i=e.air>=s[0]&&e.air<=s[1],o=i?"#46c98a":e.air>s[1]?"#e5734b":"#52b6d6",a=i?"rgba(70,201,138,.15)":e.air>s[1]?"rgba(229,115,75,.16)":"rgba(82,182,214,.16)",n=(i?"In range":e.air>s[1]?"Above target":"Below target")+` · ${s[0].toFixed(1)}–${s[1].toFixed(1)} kPa`,r=(()=>{try{return!!this.planInfo?.().active}catch{return!1}})(),l=this.vpdPlanSource&&!!this.vpdPlanBand(),c=(e,s)=>Q`
      <button style="padding:4px 12px;font-size:12px;border:none;cursor:pointer;background:${this.vpdView===e?t:"#1a1e20"};color:${this.vpdView===e?"#151515":"#aeb4b9"}"
        @click=${()=>this.vpdView=e}>${s}</button>`,d=(e,s)=>Q`
      <button style="padding:5px 9px;border-radius:8px;font-size:12px;white-space:nowrap;cursor:${l?"default":"pointer"};
        opacity:${l?".45":"1"};
        background:${this.vpdStage!==e||l?"#1e2224":"rgba(239,139,43,.16)"};
        border:1px solid ${this.vpdStage!==e||l?"#2f3538":t};
        color:${this.vpdStage!==e||l?"#c7cccf":"#fff"}"
        @click=${()=>{l||(this.vpdStage=e)}}>${s}</button>`,h=(t,e)=>()=>{const s=[this.vpdCustom[0],this.vpdCustom[1]];0===e?s[0]=Math.min(s[1]-.1,Math.max(.2,s[0]+.05*t)):s[1]=Math.max(s[0]+.1,Math.min(2,s[1]+.05*t)),this.vpdCustom=[Math.round(100*s[0])/100,Math.round(100*s[1])/100],this.requestUpdate()};return Q`
      <div style="padding:10px 14px 14px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <span style="font-size:12px;letter-spacing:.06em;color:var(--secondary-text-color);font-weight:600">VAPOR PRESSURE DEFICIT</span>
          <div style="display:flex;gap:10px;align-items:center">
            <div style="display:flex;border:1px solid #2f3538;border-radius:8px;overflow:hidden">${c("grid","Grid")}${c("trend","Trend")}</div>
            <span style="font-size:12px;color:#aeb4b9">Highlight</span>
            <button class="toggle ${this.vpdHighlight?"on":""}" style=${this.vpdHighlight?`background:${t}`:U}
              @click=${()=>this.vpdHighlight=!this.vpdHighlight}></button>
          </div>
        </div>
        <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          ${d("prop","🌱 Propagation")}${d("veg","🌿 Vegetative")}${d("flower","🌸 Flowering")}${d("custom","⚙ Custom")}
        </div>
        <div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;align-items:center">
          Target source:
          <span style="color:#c7cccf">${l?`Planting plan · ${this.vpdPlanName()}`:"Growth-stage buttons"}</span>
          ${this.vpdPlanSource?Q`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                @click=${()=>this.vpdPlanSource=!1}>use stage buttons instead →</span>`:r?Q`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                  @click=${()=>this.vpdPlanSource=!0}>use planting plan instead →</span>`:Q`<span style="color:#5a6166;cursor:default" title="No active planting plan for this device">use planting plan instead →</span>`}
        </div>
        ${"custom"!==this.vpdStage||l?U:Q`
          <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:13px;color:#c7cccf">
            Custom band (kPa):
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              min <b style="cursor:pointer;color:${t}" @click=${h(-1,0)}>−</b>${this.vpdCustom[0].toFixed(2)}<b style="cursor:pointer;color:${t}" @click=${h(1,0)}>+</b></span>
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              max <b style="cursor:pointer;color:${t}" @click=${h(-1,1)}>−</b>${this.vpdCustom[1].toFixed(2)}<b style="cursor:pointer;color:${t}" @click=${h(1,1)}>+</b></span>
          </div>`}
        <div style="display:flex;justify-content:center;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap">
          <div><span style="font-size:26px;font-weight:700">${e.air.toFixed(2)}</span> <span style="font-size:13px;color:var(--secondary-text-color)">kPa air VPD</span></div>
          ${this.vpdLeaf?Q`<div><span style="font-size:20px;font-weight:600;color:#c7cccf">${e.leaf.toFixed(2)}</span> <span style="font-size:12px;color:var(--secondary-text-color)">kPa leaf VPD</span></div>`:U}
          <span style="font-size:12px;padding:3px 9px;border-radius:20px;font-weight:600;color:${o};background:${a}">${n}</span>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--secondary-text-color);margin-bottom:10px">Air ${e.airT.toFixed(1)}${e.unit} · RH ${e.rh.toFixed(0)}%</div>
        <div style="background:#121517;border:1px solid #262b2d;border-radius:10px;padding:8px 6px 4px">
          <canvas id="vpdcanvas" style="width:100%;display:block;border-radius:6px"></canvas>
          ${"grid"===this.vpdView?Q`
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:8px 6px 3px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#1f71a1;vertical-align:-1px;margin-right:4px"></i>&lt;0.4</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#23aa9c;vertical-align:-1px;margin-right:4px"></i>0.4–0.8</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#96c55a;vertical-align:-1px;margin-right:4px"></i>0.8–1.2</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#e4c02a;vertical-align:-1px;margin-right:4px"></i>1.2–1.6</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ec8c2d;vertical-align:-1px;margin-right:4px"></i>1.6–2.0</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ce4233;vertical-align:-1px;margin-right:4px"></i>≥2.0</span>
            </div>
            <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:0 6px 4px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#fff;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>air</span>
              ${this.vpdLeaf?Q`<span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#35e08a;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>leaf</span>`:U}
            </div>`:U}
        </div>
      </div>`}drawVpdCanvas(){const t=this.renderRoot?.querySelector("#vpdcanvas");if(!t)return;const e=this.vpdReadings();if(!e)return;const s=t.getContext("2d");if(!s)return;const i=Math.min(2,window.devicePixelRatio||1),o=Math.max(280,Math.round(t.clientWidth||460)),a=210;t.width=o*i,t.height=a*i,t.style.height=a+"px",s.setTransform(i,0,0,i,0,0),s.clearRect(0,0,o,a);const n=32,r=22,l=o-n-10,c=178,d=this.vpdBand(),h=Yt.VPD_TH,p=Yt.VPD_COL,u=(t,e,s)=>{const i=Math.max(0,Math.min(1,(s-t)/(e-t)));return i*i*(3-2*i)},g=t=>610.7*Math.exp(17.27*t/(t+237.3))/1e3;if("trend"===this.vpdView){const t=`sensor.sf_${this.config.panel}_vpd`,e=this._graph[t],i=.2,a=2,h=t=>r+(1-(t-i)/(a-i))*c;if(s.strokeStyle="#242a2c",s.fillStyle="#8b9298",s.font="9px sans-serif",s.textAlign="end",s.lineWidth=1,[.4,.8,1.2,1.6].forEach(t=>{const e=h(t);s.beginPath(),s.moveTo(n,e),s.lineTo(o-10,e),s.stroke(),s.fillText(t.toFixed(1),27,e+3)}),this.vpdHighlight){const t=h(Math.min(d[1],a)),e=h(Math.max(d[0],i));s.fillStyle="rgba(70,201,138,.16)",s.fillRect(n,t,l,e-t)}if(!e||!this._graph[t])return s.fillStyle="#8b9298",s.textAlign="center",void s.fillText("Loading 24h history…",o/2,105);if(e.length<2)return s.fillStyle="#8b9298",s.textAlign="center",void s.fillText("Not enough VPD history yet.",o/2,105);const p=e[0].t,u=e[e.length-1].t,g=Math.max(1,u-p),m=t=>n+(t-p)/g*l;s.beginPath(),e.forEach((t,e)=>{const o=m(t.t),n=h(Math.max(i,Math.min(a,t.v)));e?s.lineTo(o,n):s.moveTo(o,n)}),s.strokeStyle=this.accent(),s.lineWidth=2,s.lineJoin="round",s.stroke();const f=e[e.length-1];return s.beginPath(),s.arc(m(f.t),h(Math.max(i,Math.min(a,f.v))),4,0,7),s.fillStyle=this.accent(),s.fill(),s.fillStyle="#8b9298",void["-24h","-12h","now"].forEach((t,e)=>{const i=n+e/2*l;s.textAlign=0===e?"start":2===e?"end":"center",s.fillText(t,i,203)})}const m=e.isF,f=m?90:32,v=m?60:16,b=t=>m?5*(t-32)/9:t,_=t=>{const e=[p[0][0],p[0][1],p[0][2]];for(let s=0;s<h.length;s++){const i=u(h[s]-.018,h[s]+.018,t),o=p[s+1];e[0]+=(o[0]-e[0])*i,e[1]+=(o[1]-e[1])*i,e[2]+=(o[2]-e[2])*i}return e},$=Math.round(l),x=Math.round(c),y=document.createElement("canvas");y.width=$,y.height=x;const w=y.getContext("2d");if(!w)return;const S=w.createImageData($,x),k=S.data;for(let t=0;t<x;t++)for(let e=0;e<$;e++){const s=90-(e+.5)/$*60,i=b(v+(t+.5)/x*(f-v)),o=g(i)-g(i)*s/100,a=_(o);let n=a[0],r=a[1],l=a[2];if(this.vpdHighlight){const t=.66*(1-u(d[0]-.05,d[0]+.02,o)*(1-u(d[1]-.02,d[1]+.05,o)));n=n*(1-t)+18*t,r=r*(1-t)+21*t,l=l*(1-t)+23*t}const c=4*(t*$+e);k[c]=n,k[c+1]=r,k[c+2]=l,k[c+3]=255}w.putImageData(S,0,0),s.imageSmoothingEnabled=!0,s.imageSmoothingQuality="high",s.drawImage(y,n,r,l,c);const O=t=>n+(90-t)/60*l,C=t=>r+(t-v)/(f-v)*c;s.fillStyle="#eef1f2",s.font="9px sans-serif",s.textAlign="end";(m?[60,68,76,84,90]:[16,20,24,28,32]).forEach(t=>s.fillText(t+"°",27,C(t)+3)),s.textAlign="center",[90,75,60,45,30].forEach(t=>s.fillText(t+"%",O(t),15));const D=O(e.rh),M=C(e.airT);if(s.save(),s.setLineDash([3,4]),s.strokeStyle="rgba(255,255,255,.35)",s.lineWidth=1,s.beginPath(),s.moveTo(n,M),s.lineTo(o-10,M),s.moveTo(D,r),s.lineTo(D,200),s.stroke(),s.restore(),this.vpdLeaf){const t=C(e.airT-(m?3.6:2));s.beginPath(),s.arc(D,t,5,0,7),s.fillStyle="#35e08a",s.fill(),s.strokeStyle="#151515",s.lineWidth=1.3,s.stroke()}s.beginPath(),s.arc(D,M,5,0,7),s.fillStyle="#ffffff",s.fill(),s.strokeStyle="#151515",s.lineWidth=1.3,s.stroke()}updated(t){"vpd"===this.tab&&this.showVpd&&("trend"===this.vpdView&&this.fetchVpdHist(`sensor.sf_${this.config.panel}_vpd`),this.drawVpdCanvas());const e=this.anyCooldownActive();e&&void 0===this._cdTimer?this._cdTimer=setInterval(()=>{this._cdTick++},1e3):e||void 0===this._cdTimer||(clearInterval(this._cdTimer),this._cdTimer=void 0)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._cdTimer&&(clearInterval(this._cdTimer),this._cdTimer=void 0)}renderOutletsLog(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return Q`<div class="set-note">No outlets on this controller.</div>`;const e=Date.now(),s=e-3600*this.ologRange*1e3,i=this.accent(),o=(t,e)=>Q`<button class="olog-rb ${this.ologRange===t?"on":""}"
      style=${this.ologRange===t?`background:${i};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=t}}>${e}</button>`;return Q`
      <div class="olog-range">${o(24,"24h")}${o(168,"7d")}</div>
      ${t.map(i=>Q`
        ${t.length>1?Q`<div class="section-label">${Mt(this.hass,i)||`${i.toUpperCase()} Power Strip`}</div>`:U}
        ${this.outletNums(i).map(t=>this.ologRow(i,t,s,e))}
      `)}
      ${this.ologAxis()}`}renderDeviceLog(){const t=this.overviewDevices();if(!t.length)return Q`<div class="set-note">No devices on this controller.</div>`;const e=this.accent(),s=(t,s)=>Q`<button class="olog-rb ${this.ologRange===t?"on":""}"
      style=${this.ologRange===t?`background:${e};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=t}}>${s}</button>`;return Q`
      <div class="olog-range">${s(24,"24h")}${s(168,"7d")}</div>
      ${t.map(t=>this.dlogRow(t))}
      ${this.ologAxis()}`}dlogRow(t){const e=Date.now(),s=e-3600*this.ologRange*1e3,i=t.id,o=this.ologKey(i);this._olog[o]||this.fetchOlog(i);const a=`${t.domain}:${t.suffix}`,n=this.dlogOpen===a,r="on"===this.get(i)?.state,l=this._olog[o]||[],c=l.length?l[l.length-1].t:null,d=r?"On now":c?`Off · ${this.ologAgo(e-c)}`:"Off",h=!!this._ologLoading[o]&&!this._olog[o],p=this.ologSegments(o,s,e);return Q`
      <div class="olog-row" role="button" aria-expanded=${n?"true":"false"}
        @click=${()=>{this.dlogOpen=n?null:a}}>
        <div class="olog-nm"><ha-icon icon=${t.icon} style="--mdc-icon-size:15px;margin-right:5px;vertical-align:-3px"></ha-icon>${t.label}<span class="olog-cur">${d}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${h?Q`<span class="olog-load">Loading…</span>`:p.map(t=>Q`<span class="olog-seg"
                style="left:${t.left.toFixed(2)}%;width:${Math.max(.4,t.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${n?Q`<div class="olog-exp">
        ${(()=>{const t=this.ologEvents(o,e);return t.length?t.map(t=>Q`<div class="olog-ev">
              <span><span class=${t.on?"on":"off"}>${t.on?"On":"Off"}</span> · ${this.ologTime(t.t)}</span>
              <span class="dur">${null!=t.dur?this.ologDur(t.dur):"—"}</span>
            </div>`):Q`<div class="olog-ev" style="color:var(--secondary-text-color)">No events in this window.</div>`})()}
      </div>`:U}`}deviceModeSelectId(t){const e=this.config.panel;return"light"===t.domain?`select.sf_${e}_${t.suffix}_mode`:`select.sf_${e}_${t.suffix}_mode_set`}dlqRead(t){const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,s=e?.[`dlq_${t}`];if(!s)return null;try{const t=JSON.parse(s);return t&&t.mode?t:null}catch{return null}}dlqHas(t){const e=this._dlqMem[t]||this.dlqRead(t);return!(!e||!e.mode||"Manual"===e.mode)}dlqClear(t){delete this._dlqMem[t];const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;e&&e[`dlq_${t}`]&&this.persistColorOption(`dlq_${t}`,"")}devPendingOff(t){return(this._devOff[t]??0)>Date.now()}markDevOff(t){this._devOff={...this._devOff,[t]:Date.now()+8e3},window.setTimeout(()=>{if((this._devOff[t]??0)<=Date.now()){const{[t]:e,...s}=this._devOff;this._devOff=s}},8100)}deviceEnabled(t){const e="on"===this.get(t.id)?.state,s="Manual"!==(this.deviceMode(t)||"Manual")&&!!this.get(this.deviceModeSelectId(t));return e||s}quickToggleDevice(t){const e="on"===this.get(t.id)?.state,s=t.domain,i=this.deviceMode(t)||"Manual",o=this.deviceModeSelectId(t),a="Manual"!==i&&!!this.get(o);if(e||a){if(this.deviceQuickRemember&&a){const e={mode:i};this._dlqMem[t.suffix]=e,this.persistColorOption(`dlq_${t.suffix}`,JSON.stringify(e))}this.markDevOff(t.suffix),a?(this.hass?.callService("select","select_option",{entity_id:o,option:"Manual"}),setTimeout(()=>this.hass?.callService(s,"turn_off",{entity_id:t.id}),400)):this.hass?.callService(s,"turn_off",{entity_id:t.id})}else{if(t.suffix in this._devOff){const{[t.suffix]:e,...s}=this._devOff;this._devOff=s}const e=this.deviceQuickRemember?this._dlqMem[t.suffix]||this.dlqRead(t.suffix):null;e&&e.mode&&"Manual"!==e.mode&&this.get(o)?(this.hass?.callService("select","select_option",{entity_id:o,option:e.mode}),this.dlqClear(t.suffix)):this.hass?.callService(s,"turn_on",{entity_id:t.id})}}renderDeviceQuickRow(){if(!this.showDeviceQuick)return U;const t=this.overviewDevices();return t.length?Q`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>Quick</span>
      ${t.map(t=>{const e=this.dlqHas(t.suffix),s=this.deviceEnabled(t)&&!this.devPendingOff(t.suffix);return Q`<button class="oq-btn ${e?"on":s?"live":""}"
          title=${t.label} aria-label=${t.label}
          @click=${()=>this.quickToggleDevice(t)}>
          <ha-icon icon=${t.icon} style="--mdc-icon-size:14px"></ha-icon>${t.label}</button>`})}
    </div>`:U}applyWithSaving(t,e){const s=[],i=t=>{t&&this.get(t)&&!s.some(e=>e.id===t)&&s.push({id:t,was:this.get(t)?.state??""})};e&&i(e);for(const t of Object.keys(this.draft)){const e=t.match(/^(?:power|bri|pct):(.+)$/);e?i(e[1]):t.includes(":")||/^(number|text|switch|light|fan)\./.test(t)&&i(t)}t(),this._saving=!0,this._savingAt=Date.now(),this._savingWatch=s,clearTimeout(this._savingT),this._savingT=setTimeout(()=>{this._saving=!1},12e3)}saveBar(t,e,s,i="",o){return qt(this.accent(),t,()=>this.applyWithSaving(e,o),s,i,this._saving)}outletSnapshot(t,e){const s=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"Manual",i={};for(const o of Bt[s]||[])for(const s of["text","number","select","switch"]){const a=this.get(`${s}.sf_${t}_outlet_${e}_${o}`);if(a){i[o]=a.state;break}}return{mode:s,config:i}}copyOutletTo(t,e,s){const i=this.outletSnapshot(t,e),o="Time Slot"===i.mode?this.outletPeriods(t,e):null;for(const t of s){const e=`select.sf_${t.slot}_outlet_${t.n}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:e,mode:i.mode,config:i.config}),o&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:e,periods:o}),this.olqClear(t.slot,t.n)}}renderOutletCopyPanel(t,e){const s=this.hass?kt(this.hass):[],i=[t,...s.filter(e=>e!==t)].filter((t,e,s)=>s.indexOf(t)===e),o=[];for(const s of i){const i=[];for(const o of this.outletNums(s))s===t&&o===e||i.push({slot:s,n:o,key:this.outletKey(s,o),name:this.outletName(s,o),mode:this.get(`select.sf_${s}_outlet_${o}_mode`)?.state||""});i.length&&o.push({slot:s,current:s===t,label:Mt(this.hass,s)||`${s.toUpperCase()} Power Strip`,items:i})}const a=o.flatMap(t=>t.items),n=a.filter(t=>this.outletCopySel[t.key]),r=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"Manual";return Q`<div class="oc-panel">
      <div class="oc-title">Apply ${this.outletName(t,e)}'s settings
        (<span style="color:${this.accent()}">${r}</span>) to:</div>
      ${a.length?Q`<div class="oc-cols">
        ${o.map(t=>Q`<div class="oc-col">
          <div class="oc-colhd">${t.label}${t.current?Q`<span class="oc-cur">current</span>`:U}</div>
          ${t.items.map(t=>Q`
            <label class="oc-ck">
              <input type="checkbox" .checked=${!!this.outletCopySel[t.key]}
                @change=${e=>{this.outletCopySel={...this.outletCopySel,[t.key]:e.target.checked}}}>
              <span>${t.name}${t.mode?Q` <span class="oc-mode">· ${t.mode}</span>`:U}</span>
            </label>`)}
        </div>`)}
      </div>`:Q`<div class="oc-mode">No other outlets.</div>`}
      <button class="oc-apply" ?disabled=${0===n.length}
        @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(t,e,n.map(t=>({slot:t.slot,n:t.n})))),this.outletCopyOpen=!1,this.outletCopySel={}}}>Apply to ${n.length} outlet${1===n.length?"":"s"}</button>
    </div>`}renderOutletCopyFromPanel(t,e){const s=this.hass?kt(this.hass):[],i=[t,...s.filter(e=>e!==t)].filter((t,e,s)=>s.indexOf(t)===e),o=[];for(const s of i){const i=[];for(const o of this.outletNums(s))s===t&&o===e||i.push({slot:s,n:o,name:this.outletName(s,o),mode:this.get(`select.sf_${s}_outlet_${o}_mode`)?.state||""});i.length&&o.push({slot:s,current:s===t,label:Mt(this.hass,s)||`${s.toUpperCase()} Power Strip`,items:i})}const a=o.some(t=>t.items.length);return Q`<div class="oc-panel">
      <div class="oc-title">Copy settings into ${this.outletName(t,e)} from:</div>
      ${a?Q`<div class="oc-cols">
        ${o.map(s=>Q`<div class="oc-col">
          <div class="oc-colhd">${s.label}${s.current?Q`<span class="oc-cur">current</span>`:U}</div>
          ${s.items.map(s=>Q`
            <button class="oc-fromitem"
              @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(s.slot,s.n,[{slot:t,n:e}])),this.outletCopyFromOpen=!1}}>${s.name}${s.mode?Q` <span class="oc-mode">· ${s.mode}</span>`:U}</button>`)}
        </div>`)}
      </div>`:Q`<div class="oc-mode">No other outlets.</div>`}
    </div>`}outletRememberKey(t,e){return`sf-olq-${this.config.panel}-${t}-${e}`}olqRead(t,e){const s=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,i=s?.[`olq_${t}_${e}`];if(!i)return null;try{const t=JSON.parse(i);return t&&t.mode?t:null}catch{return null}}olqHas(t,e){const s=this._olqMem[this.outletRememberKey(t,e)]||this.olqRead(t,e);return!(!s||!s.mode||"Manual"===s.mode)}olqClear(t,e){delete this._olqMem[this.outletRememberKey(t,e)];const s=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;s&&s[`olq_${t}_${e}`]&&this.persistColorOption(`olq_${t}_${e}`,"")}quickToggle(t,e){const s=`switch.sf_${t}_outlet_${e}`,i="on"===this.get(s)?.state;if(!this.outletQuickRemember)return void this.hass?.callService("switch","toggle",{entity_id:s});const o=this.outletRememberKey(t,e);if(i){const i=this.outletSnapshot(t,e);"Time Slot"===i.mode&&(i.periods=this.outletPeriods(t,e)),this._olqMem[o]=i,this.persistColorOption(`olq_${t}_${e}`,JSON.stringify(i)),this.hass?.callService("switch","turn_off",{entity_id:s})}else{const i=this._olqMem[o]||this.olqRead(t,e);if(i&&i.mode&&"Manual"!==i.mode){const s=`select.sf_${t}_outlet_${e}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:s,mode:i.mode,config:i.config}),i.periods&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:s,periods:i.periods}),this.olqClear(t,e)}else this.hass?.callService("switch","turn_on",{entity_id:s})}}renderQuickRow(t){if(!this.showOutletQuick)return U;const e=this.outletNums(t);return e.length?Q`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>Quick</span>
      ${e.map(e=>{const s=this.olqHas(t,e),i="on"===this.get(`switch.sf_${t}_outlet_${e}`)?.state,o=s?"on":i?"live":"",a=this.outletQuickNames&&this.customOutletNames?(this.outletNames[`${t}_${e}`]||"").trim():"";return Q`<button class="oq-btn ${o}"
          title=${this.outletName(t,e)} aria-label=${this.outletName(t,e)}
          @click=${()=>this.quickToggle(t,e)}>${this.outletQuickNames?Q`${a?`${e}-${a}`:String(e)}`:Q`<span class="oq-dot"></span>${e}`}</button>`})}
    </div>`:U}outletColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Temperature"===t||"Humidity"===t||"CO2"===t?"env":"Drip Irrigation"===t?"drip":"manual")(t)){case"sched":return this.ocSched;case"env":return this.ocEnv;case"drip":return this.ocDrip;default:return this.ocManual}}outletModeDetail(t,e,s){const i=`sf_${t}_outlet_${e}`,o=t=>this.get(t)?.state??"";if("Temperature"===s){const t=o(`select.${i}_temp_device`);return"Heating"===t?{text:"Heating",cls:"od-heat"}:"Cooling"===t?{text:"Cooling",cls:"od-cool"}:null}if("Humidity"===s){const t=o(`select.${i}_humidity_device`);return"Humidifying"===t?{text:"Humidifying",cls:"od-hum"}:"Dehumidifying"===t?{text:"Dehumidifying",cls:"od-dehum"}:null}if("CO2"===s){const t=o(`select.${i}_co2_device`);return"Aeration"===t?{text:"Aeration",cls:"od-aer"}:"Exhaust"===t?{text:"Exhaust",cls:"od-exh"}:null}if("Time Slot"===s){const s=this.outletPeriods(t,e);if(s.length){const t=s[0],e=`${this.fmtClock(t.start)}–${this.fmtClock(t.end)}`;return{text:s.length>1?`${e} +${s.length-1}`:e,cls:"od-sched"}}const a=o(`text.${i}_ts_start`),n=o(`text.${i}_ts_stop`);return a&&n?{text:`${this.fmtClock(a)}–${this.fmtClock(n)}`,cls:"od-sched"}:null}if("Cycle"===s){const t=t=>{const e=Number(t);return Number.isFinite(e)&&e>=60&&e%60==0?e/60+"h":`${e}m`},e=o(`number.${i}_cycle_run`),s=o(`number.${i}_cycle_off`);if(e&&s){let a=`${t(e)} on · ${t(s)} off`;const n=o(`number.${i}_cycle_times`);n&&Number(n)>1&&(a+=` · ×${Math.round(Number(n))}`);const r=o(`text.${i}_cycle_start`);return r&&"00:00"!==r&&(a+=` @ ${this.fmtClock(r)}`),{text:a,cls:"od-sched"}}return null}return null}outletTile(t,e){const s="on"===this.draftVal(`switch.sf_${t}_outlet_${e}`),i=this.draftVal(`select.sf_${t}_outlet_${e}_mode`)||"",o=this.outletKey(t,e),a=this.outletOpen===o,n=this.accent(),r=s&&"off"!==this.outletColorMode?this.outletColorFor(i):"",l=r||n;let c="";return r&&"tile"===this.outletColorMode&&(c=`background:${At(r)};box-shadow:inset 0 0 0 1px ${r}`),a&&(c=`box-shadow:inset 0 0 0 1px ${n}`+(r&&"tile"===this.outletColorMode?`;background:${At(r)}`:"")),Q`
      <div class="tile tile-outlet clickable ${a?"active":""}"
        style=${c||U}
        role="button" aria-expanded=${a?"true":"false"}
        @click=${()=>this.toggleOutlet(a?null:o)}>
        <div class="tile-label" title=${this.outletName(t,e)}>${this.outletName(t,e)}
          <ha-icon class="tile-more"
            icon=${a?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${s?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${s?`color:${l}`:U}>${s?"On":"Off"}</div>
        <div class="tile-sub">${i}</div>
        ${(()=>{const s=this.outletModeDetail(t,e,i);return s?Q`<div class="tile-sub2 ${s.cls}">${s.text}</div>`:U})()}
        ${s?U:this.cooldownPill(this.outletCooldown(t,e))}
        ${!s&&this.olqHas(t,e)?Q`<div class="tile-qta" style="color:${n}"
          title="Quick-toggle profile saved — quick-on restores this outlet's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>`:U}
      </div>`}clearOutletCfgDraft(t,e){const s=this.outletKey(t,e);if(!(s in this.outletCfgDraft))return;const i={...this.outletCfgDraft};delete i[s],this.outletCfgDraft=i}renderOutletModeConfig(t,e,s){const i=this.outletKey(t,e),o=this.outletCfgDraft[i]??{},a=(t,e)=>this.outletCfgDraft={...this.outletCfgDraft,[i]:{...o,[t]:e}},n=(t,e,s,i)=>Q`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="num-box">
          <input type="number" min="0" max="1440" .value=${o[e]??String(s)}
            @change=${t=>a(e,t.target.value)} />
          ${i?Q`<span class="unit">${i}</span>`:U}
        </span>
      </div>`,r=(t,e,s)=>Q`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="ctl-input">
          <select @change=${t=>a(e,t.target.value)}>
            ${s.map(t=>Q`<option value=${t}
              ?selected=${(o[e]??s[0])===t}>${t}</option>`)}
          </select>
        </span>
      </div>`;switch(s){case"Cycle":return Q`
        ${l="Start",c="cycle_start",d="12:00",Q`
      <div class="dev-row ${c in o?"staged":""}">
        <span class="dev-lbl">${l}</span>
        <span class="num-box">
          <input type="time" .value=${o[c]??d}
            @change=${t=>a(c,t.target.value)} />
        </span>
      </div>`}
        ${n("Run Duration","cycle_run",60,"min")}
        ${n("Off Duration","cycle_off",60,"min")}
        ${n("Execution Times","cycle_times",1,"")}`;case"Temperature":return r("Device","temp_device",["Heating","Cooling"]);case"Humidity":return r("Device","humidity_device",["Humidifying","Dehumidifying"]);case"CO2":return r("Device","co2_device",["Aeration","Exhaust"]);default:return U}var l,c,d}stDeviceType(t,e){const s=s=>this.get(`select.sf_${t}_outlet_${e}_${s}`)?.state||"",i=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"";return i.startsWith("Blower")?"Blower":"Time Slot"===i?"Timer period":"Cycle"===i?"Timer loop":"Temperature"===i?"Cooling"===s("temp_device")?"Cooler":"Heater":"Humidity"===i?"Dehumidifying"===s("humidity_device")?"Dehumidification":"Humidification":"CO2"===i?"Exhaust"===s("co2_device")?"Exhaust fan":"CO2 Injection":"General device"}stBlowerMode(t,e){return"Blower (Humidity Priority)"===this.get(`select.sf_${t}_outlet_${e}_mode`)?.state?"Humidity Priority":"Temperature Priority"}renderStationDeviceType(t,e){const s=this.outletKey(t,e),i=this._stDt[s]??{},o=this.stDeviceType(t,e),a=i.type??o,n=this.stBlowerMode(t,e),r=i.blower??n,l=t=>this._stDt={...this._stDt,[s]:{...i,...t}},c=void 0!==i.type&&i.type!==o||"Blower"===a&&void 0!==i.blower&&i.blower!==n||"Timer loop"===a&&s in this.outletCfgDraft||"Timer period"===a&&s in this.outletDraft;return Q`
      <div class="toggle-row" style="margin-top:4px">
        <span>Device Type</span>
        <select style="max-width:60%"
          @change=${t=>l({type:t.target.value})}>
          ${Ht.map(t=>Q`
            <option value=${t.label} ?selected=${t.label===a}>${t.label}</option>`)}
        </select>
      </div>
      ${"Blower"===a?Q`
        <div class="toggle-row" style="margin-top:8px">
          <span>Mode</span>
          <select style="max-width:60%"
            @change=${t=>l({blower:t.target.value})}>
            ${Object.keys(It).map(t=>Q`
              <option value=${t} ?selected=${t===r}>${t}</option>`)}
          </select>
        </div>`:U}
      ${"General device"===a?this.stagedCtl(`switch.sf_${t}_outlet_${e}`,"Power"):U}
      ${"Timer period"===a?this.renderOutletSchedule(t,e):U}
      ${"Timer loop"===a?this.renderOutletModeConfig(t,e,"Cycle"):U}
      ${Vt.has(a)?Q`
        <div class="set-note" style="margin-top:8px">
          Runs from your Environment day/night targets (set on the Environment tab).
          There are no separate on/off thresholds here.
        </div>`:U}
      ${this.saveBar(c,()=>{const i=Ht.find(t=>t.label===a);let o=i.mode,n={...i.cfg};"Blower"===a&&(o=It[r]||i.mode),"Timer loop"===a&&(n={...n,...this.outletCfgDraft[s]??{}}),this.hass?.callService("sf","set_outlet_config",{entity_id:`select.sf_${t}_outlet_${e}_mode`,mode:o,config:n}),"Timer period"===a&&this.saveOutlet(t,e),this.clearOutletCfgDraft(t,e);const l={...this._stDt};delete l[s],this._stDt=l,this.modePick={...this.modePick,[`select.sf_${t}_outlet_${e}_mode`]:o}},()=>{const i={...this._stDt};delete i[s],this._stDt=i,this.clearOutletCfgDraft(t,e),this.clearOutletDraft(t,e)},"apply-bar")}`}renderOutletPop(){const t=this.outletOpen;if(!t)return U;const e=t.lastIndexOf("_");if(e<0)return U;const s=t.slice(0,e),i=Number(t.slice(e+1));if(!s||!Number.isFinite(i))return U;const o=`select.sf_${s}_outlet_${i}_mode`;if(!this.get(o))return U;const a=`switch.sf_${s}_outlet_${i}`,n=this.get(a),r=`sf_${s}_outlet_${i}_`,l=this.draftVal(o)||this.get(o)?.state||"",c="Time Slot"===l,d=new Set((Bt[l]||[]).map(t=>`${r}${t}`)),h=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return!!d.has(e)&&(!c||e!==`${r}ts_type`&&e!==`${r}ts_start`&&e!==`${r}ts_stop`)}).sort(),p=this.get(o)?.state||"",u=l!==p&&"Manual"!==l&&!c&&(Bt[l]||[]).length>0&&0===h.length,g=this.outletKey(s,i),m=[...u?[]:[o],...n?[a]:[],...h.filter(t=>/^(switch|number|select|text)\./.test(t))],f=!!this.outletDraft[this.outletKey(s,i)],v=this.outletNameDirty(s,i),b=u;return Q`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${this.outletName(s,i)}</span>
          <span style="display:inline-flex;align-items:center;gap:8px">
            <button class="oc-copybtn" title="Copy this outlet's settings to others"
              @click=${()=>{this.outletCopyOpen=!this.outletCopyOpen,this.outletCopyFromOpen=!1,this.outletCopySel={}}}>
              <ha-icon icon="mdi:content-copy"></ha-icon>Copy to…
            </button>
            <button class="oc-copybtn" title="Copy another outlet's settings into this one"
              @click=${()=>{this.outletCopyFromOpen=!this.outletCopyFromOpen,this.outletCopyOpen=!1}}>
              <ha-icon icon="mdi:content-duplicate"></ha-icon>Copy from…
            </button>
            <ha-icon icon="mdi:close" role="button" aria-label="Close"
              @click=${()=>this.toggleOutlet(null)}></ha-icon>
          </span>
        </div>
        ${this.outletCopyOpen?this.renderOutletCopyPanel(s,i):U}
        ${this.outletCopyFromOpen?this.renderOutletCopyFromPanel(s,i):U}
        ${this.customOutletNames?Q`
          <div class="toggle-row ${this.outletNameDirty(s,i)?"staged":""}">
            <span>Name</span>
            <span class="num-box">
              <input type="text" style="width:140px;text-align:left"
                .value=${this.outletKey(s,i)in this.outletNameDraft?this.outletNameDraft[this.outletKey(s,i)]:this.outletNames[`${s}_${i}`]??""}
                placeholder=${`Outlet ${i}`}
                @input=${t=>this.stageOutletName(s,i,t.target.value)} />
            </span>
          </div>`:U}
        ${s.startsWith("st")?this.renderStationDeviceType(s,i):Q`
        ${this.stagedCtl(o,"Mode")}
        ${n&&!u?this.stagedCtl(a,"Power"):U}
        ${u?this.renderOutletModeConfig(s,i,l):U}
        ${h.map(t=>this.stagedCtl(t))}
        ${c?this.renderOutletSchedule(s,i):U}
        ${this.applyBar(m,{extraDirty:f||v||b,onApply:()=>{const t=this.stripIsExternal(s),e="Humidity"===l?this.outletCfgDraft[g]?.humidity_device||this.draftVal(`select.sf_${s}_outlet_${i}_humidity_device`)||"Humidifying":this.outletCfgDraft[g]?.temp_device||this.draftVal(`select.sf_${s}_outlet_${i}_temp_device`)||"Cooling";if(t&&!this.isEnvOutletMode(l)&&this.applyOutletEnv(s,i,l,e),u){if(this.hass?.callService("sf","set_outlet_config",{entity_id:o,mode:l,config:this.outletCfgDraft[g]??{}}),this.clearOutletCfgDraft(s,i),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}this.modePick={...this.modePick,[o]:l}}this.saveOutlet(s,i),this.commitOutletName(s,i),this.olqClear(s,i)},onDiscard:()=>{if(this.clearOutletDraft(s,i),this.clearOutletNameDraft(s,i),this.clearOutletCfgDraft(s,i),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}}})}`}
      </div>`}outletKey(t,e){return`${t}_${e}`}stripIsExternal(t){return t===this.config.panel&&"external"===this.tempSource}isEnvOutletMode(t){return"Temperature"===t||"Humidity"===t}applyOutletEnv(t,e,s,i){const o=this.isEnvOutletMode(s);this.hass?.callService("sf","set_outlet_env",{entity_id:`select.sf_${t}_outlet_${e}_mode`,enabled:o,mode:o?s:"Temperature",direction:i})}outletPeriods(t,e){const s=this.outletDraft[this.outletKey(t,e)];if(s)return s;const i=this.get(`sensor.sf_${t}_outlet_${e}_ts_schedule`)?.attributes.periods;return Array.isArray(i)?i:[]}editOutlet(t,e,s){const i=this.outletKey(t,e),o=this.outletDraft[i]??this.outletPeriods(t,e),a=JSON.parse(JSON.stringify(o));s(a),this.outletDraft={...this.outletDraft,[i]:a}}clearOutletDraft(t,e){const s=this.outletKey(t,e),i={...this.outletDraft};delete i[s],this.outletDraft=i}saveOutlet(t,e){const s=this.outletDraft[this.outletKey(t,e)];s&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${t}_outlet_${e}_mode`,periods:s}),this.clearOutletDraft(t,e))}renderOutletSchedule(t,e){const s=this.outletPeriods(t,e),i=this.accent();return Q`
      <div class="ts-editor">
        ${s.map((s,o)=>Q`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${o+1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${()=>this.editOutlet(t,e,t=>t.splice(o,1))}>✕</button>
            </div>
            <div class="days">
              ${ft.map((a,n)=>Q`<button
                  class="day ${s.days.includes(n)?"on":""}"
                  style=${s.days.includes(n)?`background:${i};border-color:${i}`:""}
                  @click=${()=>this.editOutlet(t,e,t=>{const e=t[o].days,s=e.indexOf(n);s>=0?e.splice(s,1):e.push(n),e.sort((t,e)=>t-e)})}>${a}</button>`)}
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
      </div>`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let s=e?.attributes.friendly_name??"";const i=Mt(this.hass,this.config.panel);return i&&s.startsWith(i)&&(s=s.slice(i.length).trim()),s=s.replace(/\s*Temp Calibration\s*$/i,"").trim(),s||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.envControl(t,e)).filter(t=>t!==U),s=this.caliSoilSlots().map(e=>{const s=[this.envControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.envControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==U),i=this.stagedCtl(`select.sf_${t}_${e}_substrate`,"Substrate");return Q`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="cali-soil-grid">${s}${i!==U?i:U}</div>
        </div>`}),i=this.renderLeafVpdCalibration();return e.length||s.length||i!==U?Q`
      ${e.length?Q`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:U}
      ${s.length?Q`<div class="section-label">Soil Calibration</div>${s}`:U}
      ${i}
      ${this.renderSensorCleaning()}
      ${this.applyBar(this.caliIds())}`:Q`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}hasAlerts(){return!!this.alertsSettings()}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return t&&"object"==typeof t?t:null}editAlert(t){const e=this.alertsDraft??this.alertsSettings()??{},s=JSON.parse(JSON.stringify(e));t(s),this.alertsDraft=s}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const t=this.alertsSettings();if(!t)return Q`<div class="cali-empty">No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.</div>`;const e=null!==this.alertsDraft;return this.accent(),Q`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(t,"climate","Climate")}
      ${this.renderAlertGroup(t,"substrate","Substrate")}
      ${this.renderAlertOther(t)}
      ${this.saveBar(e,()=>this.saveAlerts(),()=>this.alertsDraft=null,"apply-bar")}`}renderAlertGroup(t,e,s){const i=t[e]||[];return i.length?Q`
      <div class="section-label">${s}</div>
      ${i.map((t,s)=>this.renderAlertMetric(e,s,t))}`:U}tempUnit(){return this.hass?.config?.unit_system?.temperature||"°F"}isCelsius(){return this.tempUnit().includes("C")}tempThresholdOpts(){const t=this.isCelsius();return this.offOpts(t?15:59,t?50:122,1,t=>`${t}${this.tempUnit()}`)}alertBounds(t){switch(t){case"temp":case"tempSoil":return this.isCelsius()?[0,50]:[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(t,e,s){const i=this.accent(),[o,a]=this.alertBounds(s.key),n=Number(s.step??1)||1,r="ppfd"===s.key?Math.max(o,a-100):a,l=(i,l)=>{const c=this.numOpts(o,"min"===l?r:a,n);return Q`
      <label class="av">
        <span class="av-lbl">${i}</span>
        <span class="num-box">
          <select @change=${s=>this.editAlert(i=>{i[t][e][l]=Number(s.target.value)})}>
            ${c.map(t=>Q`
              <option value=${t.value} .selected=${String(t.value)===String(s[l]??"")}>${t.label}</option>`)}
          </select>
          <span class="unit">${s.unit??""}</span>
        </span>
      </label>`};return Q`
      <div class="alert-row ${s.enabled?"":"off"}">
        <div class="alert-head">
          <span class="alert-name">${s.label} <span class="unit">${s.unit??""}</span></span>
          <button class="toggle ${s.enabled?"on":""}"
            style=${s.enabled?`background:${i}`:""}
            @click=${()=>this.editAlert(s=>{const i=s[t][e];i.enabled=i.enabled?0:1})}
            aria-label="Toggle ${s.label} alarm"></button>
        </div>
        <div class="alert-vals">
          ${"range"===s.kind?l("Min","min"):U}
          ${l("Max","max")}
        </div>
      </div>`}renderAlertOther(t){const e=t.other||[];if(!e.length)return U;const s=this.accent();return Q`
      <div class="section-label">Other Device</div>
      ${e.map((t,e)=>Q`<div class="alert-bool">
          <span class="alert-name">${t.label}</span>
          <button class="toggle ${t.enabled?"on":""}"
            style=${t.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(t=>{const s=t.other[e];s.enabled=s.enabled?0:1})}
            aria-label="Toggle ${t.label} alarm"></button>
        </div>`)}`}hasLog(){return this.alarmSources().length>0}alarmSources(){const t=[],e=e=>{const s=this.get(`sensor.sf_${e}_alarms`);s&&t.push({slot:e,ent:s,name:Mt(this.hass,e)||e})};this.config.panel&&e(this.config.panel);for(const t of this.outletSlots())t!==this.config.panel&&e(t);return t}logToday(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}renderLog(){const t=this.alarmSources(),e=this.logDate||this.logToday(),s=this.logDev||"all",i=this.logType||"all";let o=[];for(const e of t){if("all"!==s&&s!==e.slot)continue;const t=e.ent.attributes.events;Array.isArray(t)&&t.forEach(t=>o.push({...t,_src:e.name}))}const a=[...new Set(o.map(t=>t.device).filter(Boolean))].sort(),n=new Date(`${e}T00:00:00`).getTime()/1e3,r=new Date(`${e}T23:59:59.999`).getTime()/1e3,l=new Set;return o=o.filter(t=>(t.epoch||0)>=n&&(t.epoch||0)<=r&&("all"===i||t.device===i)).sort((t,e)=>(e.epoch||0)-(t.epoch||0)).filter(t=>{const e=`${t.epoch}|${t._src}|${t.device||`Device ${t.devType}`}|${t.alarm||""}|${t.alarmType||0}`;return!l.has(e)&&(l.add(e),!0)}).slice(0,50),Q`
      <div class="log-filters">
        ${t.length>1?Q`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${t=>{this.logDev=t.target.value}}>
                  <option value="all" ?selected=${"all"===s}>All</option>
                  ${t.map(t=>Q`
                    <option value=${t.slot} ?selected=${s===t.slot}>${t.name}</option>`)}
                </select>
              </div>
            </div>`:U}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${t=>{this.logType=t.target.value}}>
              <option value="all" ?selected=${"all"===i}>All</option>
              ${a.map(t=>Q`
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
      ${o.length?Q`
            <div class="log-count">${o.length} ${1===o.length?"entry":"entries"}${o.length>10?" — scroll for more":""}</div>
            <div class="log-list">
              ${o.map(e=>Q`
                <div class="log-row ${e.alarmType?"raise":"restore"}">
                  <div class="log-title">${t.length>1&&"all"===s?`${e._src} `:""}${e.device||`Device ${e.devType}`} ${e.alarm||""}</div>
                  <div class="log-time">${e.epoch?(t=>{try{return new Date(1e3*t).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(e.epoch):e.time||""}</div>
                </div>`)}
            </div>`:Q`<div class="cali-empty">No log entries on this date.</div>`}`}render(){if(!this.hass||!this.config)return U;const t=this.hasOutlets(),e=this.outletOnly(),s=!!this.get(this.eid("number","env_temp_day")),i=`sf_${this.config.panel}_`,o=!!this.get(this.eid("number","cal_air_temp"))||Object.keys(this.hass.states).some(t=>t.includes(i)&&/_cal_(temp|moisture|ec)$/.test(t)),a=s,n=o,r=!e,l=this.showVpd&&!e,c=!e,d=e?"outlets":"overview";let h=this.tab;!e||"overview"!==h&&"alerts"!==h&&"vpd"!==h||(h="outlets"),"env"!==h||a||(h=d),"cali"!==h||n||(h=d),"outlets"!==h||t||(h="overview"),"olog"!==h||t&&this.showOutletsLog||(h="overview"),"vpd"!==h||l||(h=d),"dlog"!==h||this.showDeviceLog&&this.overviewDevices().length>0||(h=d);const p=this.accent(),u=(t,e)=>Q`<button class="tab ${h===t?"active":""}"
        style=${h===t?`color:${p};border-color:${p}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,g=Mt(this.hass,this.config.panel),m=[this.taTiles?"":"ta-x-t",this.taDevices?"":"ta-x-d",this.taOutlets?"":"ta-x-o"].filter(Boolean).join(" ");return Q`
      <ha-card class=${m||U} style=${this.layoutStyle()||U}>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${g?Q`<span class="device">${g}</span>`:U}
          ${this.renderConn()}
        </div>
        ${Q`<div class="tabs">
              ${c?u("overview","Overview"):U}
              ${a?u("env","Environment"):U}
              ${t?u("outlets","Outlets"):U}
              ${t&&this.showOutletsLog?u("olog","Outlets Log"):U}
              ${this.showDeviceLog&&this.overviewDevices().length>0?u("dlog","Device Log"):U}
              ${l?u("vpd","VPD"):U}
              ${n?u("cali","Calibration"):U}
              ${r?u("alerts","Alerts"):U}
              ${u("log","Log")}
              ${u("settings","Settings")}
            </div>`}
        ${"env"===h?this.renderEnv():"outlets"===h?this.renderOutlets():"olog"===h?this.renderOutletsLog():"dlog"===h?this.renderDeviceLog():"vpd"===h?this.renderVpdTab():"cali"===h?this.renderCali():"alerts"===h?this.renderAlerts():"log"===h?this.renderLog():"settings"===h?this.renderSettings():this.renderOverview()}
      </ha-card>`}setLeafSpot(t,e){const s=[...this.leafSpots];s[t]=parseFloat(e),this.leafSpots=s}renderLeafVpdCalibration(){if(!this.showLeafVpd)return U;const t=this.eid("number","leaf_offset"),e=this.get(t);if(!e)return U;const s=e.attributes.unit_of_measurement||"°",i=this.get(this.eid("sensor","temperature")),o=i&&Number.isFinite(+i.state)?+i.state:null;if(5!==this.leafSpots.length){const t=o??0;this.leafSpots=Array(5).fill(Math.round(10*t)/10)}const a=this.leafSpots,n=a.filter(t=>Number.isFinite(t)),r=n.length?n.reduce((t,e)=>t+e,0)/n.length:null,l=null!=r&&null!=o?r-o:null,c=t in this.draft,d=e=>this.stage(t,String(Math.round(10*e)/10)),h=this.eid("number","leaf_offset_night"),p=!!this.get(h),u=h in this.draft,g=t=>this.stage(h,String(Math.round(10*t)/10)),m=this.accent(),f=p?this.leafCalTarget:"day";return Q`
      <div class="section-label" style="margin-top:16px">Leaf VPD</div>
      <div class="set-note">
        VPD referenced to the leaf surface, which runs cooler than the air. Under
        the light leaves transpire and sit well below air; lights-off they settle
        near air temp — so set a Day and Night offset. Calibrate the day value
        from measurements if you like, then Apply.
      </div>
      <div class="toggle-row ${c?"staged":""}">
        <span>Leaf offset (day)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(t)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&d(e)}} />
          <span class="unit">${s}</span>
        </span>
      </div>
      ${p?Q`
      <div class="toggle-row ${u?"staged":""}">
        <span>Leaf offset (night)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(h)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&g(e)}} />
          <span class="unit">${s}</span>
        </span>
      </div>`:U}
      <details class="leaf-cal">
        <summary>Calibrate from 5 readings</summary>
        <div class="set-note">
          Point an IR thermometer at 5 leaf spots and enter each. The average
          becomes leaf temp; the implied offset (leaf − air) fills the offset you
          pick below — Apply to save it. Measure under the light for Day, lights-off
          for Night.
        </div>
        ${p?Q`
        <div class="seg-row" style="grid-template-columns:repeat(2,1fr);margin-bottom:8px">
          <button class="seg ${"day"===f?"on":""}"
            style=${"day"===f?`border-color:${m};color:${m}`:U}
            @click=${()=>{this.leafCalTarget="day"}}>
            <ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>Day</span>
          </button>
          <button class="seg ${"night"===f?"on":""}"
            style=${"night"===f?`border-color:${m};color:${m}`:U}
            @click=${()=>{this.leafCalTarget="night"}}>
            <ha-icon icon="mdi:weather-night"></ha-icon><span>Night</span>
          </button>
        </div>`:U}
        <div class="leaf-spots">
          ${a.map((t,e)=>Q`<input type="number" step="0.1"
            .value=${Number.isFinite(t)?String(t):""}
            @input=${t=>this.setLeafSpot(e,t.target.value)} />`)}
        </div>
        <div class="leaf-cal-foot">
          <span>
            Avg ${null!=r?r.toFixed(1)+s:"—"}
            · offset ${null!=l?(t=>(t>=0?"+":"")+t.toFixed(1))(l)+s:"—"}
          </span>
          <button class="leaf-apply" ?disabled=${null==l}
            @click=${()=>null!=l&&(t=>"night"===f?g(t):d(t))(l)}>
            Use for ${"night"===f?"night":"day"}</button>
        </div>
      </details>`}_sensorOptions(t){return this.hass?Object.keys(this.hass.states).filter(e=>e.startsWith("sensor.")&&!e.includes("sf_")&&this.hass.states[e].attributes?.device_class===t).map(t=>({id:t,name:this.hass.states[t].attributes?.friendly_name||t})).sort((t,e)=>t.name.localeCompare(e.name)):[]}_commitTempSource(t){const e=t.tsSource??this.tempSource,s=t.tsTemp??this.extTemp,i=t.tsHumi??this.extHumi;if(e===this.tempSource&&s===this.extTemp&&i===this.extHumi)return;const o=this.get(`switch.sf_${this.config.panel}_indicator_light`)?`switch.sf_${this.config.panel}_indicator_light`:`switch.sf_${this.config.panel}_outlet_1`;this.tempSource=e,this.extTemp=s,this.extHumi=i,this.hass?.callService("sf","set_strip_sensor",{entity_id:o,source:e,temp_entity:"external"===e?s:"",humi_entity:"external"===e?i:""})}renderTempSource(t,e){if(!/^(ac|st)\d/.test(this.config.panel||""))return U;const s=this.accent(),i=t?.tsSource??this.tempSource,o=t?.tsTemp??this.extTemp,a=t?.tsHumi??this.extHumi,n=(t,o)=>Q`
      <button class="seg ${i===t?"on":""}"
        style=${i===t?`border-color:${s};color:${s}`:U}
        @click=${()=>e({tsSource:t})}>${o}</button>`,r=(t,s,i,o)=>Q`
      <div class="toggle-row" style="margin-top:8px">
        <span>${o}</span>
        <select style="max-width:60%"
          @change=${t=>e({[i]:t.target.value})}>
          <option value="" ?selected=${!t}>— choose —</option>
          ${this._sensorOptions(s).map(e=>Q`
            <option value=${e.id} ?selected=${e.id===t}>${e.name}</option>`)}
          ${t&&!this._sensorOptions(s).some(e=>e.id===t)?Q`<option value=${t} selected>${t}</option>`:U}
        </select>
      </div>`;return Q`
      <div class="section-label set-collapse-h"
        @click=${()=>this._tsOpen=!this._tsOpen}>
        <span>Temperature source</span>
        <ha-icon icon=${this._tsOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._tsOpen?Q`
      <div class="set-note">
        This strip has no Spider Farmer air sensor. Use a 3rd-party Home Assistant
        temperature/humidity sensor as its reference — the readings appear on the
        card (and as <code>sensor.sf_${this.config.panel}_temperature</code> /
        <code>_humidity</code>) so you can drive the outlets from your own
        automations.
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        ${n("sf","SF sensor")}
        ${n("external","External sensor")}
      </div>
      ${"external"===i?Q`
        ${r(o,"temperature","tsTemp","Temperature entity")}
        ${r(a,"humidity","tsHumi","Humidity entity")}
      `:U}`:U}`}_commitSmartControl(t){const e=t.sc;if(!e)return;if(JSON.stringify(e)===JSON.stringify(this.smart||{}))return;const s=this.config.panel,i=this.get(`switch.sf_${s}_dehumidifier`)?`switch.sf_${s}_dehumidifier`:`switch.sf_${s}_indicator_light`,{enabled:o,...a}=e;this.smart={...e},this.hass?.callService("sf","set_smart_control",{entity_id:i,enabled:!!o,settings:a})}renderSmartControl(t,e){const s=this.config.panel;if(!this.get(`switch.sf_${s}_dehumidifier`))return U;const i=this.accent(),o={...this.smart||{},...t?.sc??{}},a=t=>e({sc:{...o,...t}}),n=!!o.enabled,r=(t,e)=>Number.isFinite(Number(t))?Number(t):e,l=(t,e,s,i=1)=>Q`
      <div class="toggle-row" style="margin-top:8px">
        <span>${t}</span>
        <input type="number" style="max-width:90px" step=${i}
          .value=${String(r(o[e],s))}
          @change=${t=>a({[e]:Number(t.target.value)})} />
      </div>`,c=(t,e,s)=>Q`
      <div class="toggle-row" style="margin-top:8px">
        <span>${t} <span style="color:var(--secondary-text-color)">(min)</span></span>
        <input type="number" style="max-width:90px" step="0.5" min="0"
          .value=${String(Math.round(r(o[e],s)/60*10)/10)}
          @change=${t=>a({[e]:Math.round(60*Number(t.target.value))})} />
      </div>`;return Q`
      <div class="section-label set-collapse-h"
        @click=${()=>this._smartOpen=!this._smartOpen}>
        <span>Smart control</span>
        <ha-icon icon=${this._smartOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._smartOpen?Q`
      <div class="set-note" style="color:var(--warning-color,#ff9800)">
        ⚠ When enabled, the integration drives the dehumidifier itself (full Manual)
        to hold your humidity target — this overrides Spider Farmer's own automation.
        It runs continuously in Home Assistant (works with no dashboard open). On an
        HA restart the gear holds its last state until HA is back.
      </div>
      <div class="toggle-row">
        <span>Enable smart humidity control</span>
        <button class="toggle ${n?"on":""}"
          style=${n?`background:${i}`:U}
          @click=${()=>a({enabled:!n})}></button>
      </div>
      ${n?Q`
        <div class="toggle-row" style="margin-top:8px">
          <span>Humidity sensor</span>
          <select style="max-width:60%"
            @change=${t=>a({humidity:t.target.value})}>
            <option value="" ?selected=${!o.humidity}>Strip sensor (default)</option>
            ${this._sensorOptions("humidity").map(t=>Q`
              <option value=${t.id} ?selected=${t.id===o.humidity}>${t.name}</option>`)}
            ${o.humidity&&!this._sensorOptions("humidity").some(t=>t.id===o.humidity)?Q`<option value=${o.humidity} selected>${o.humidity}</option>`:U}
          </select>
        </div>
        ${l("Target humidity %","target",55)}
        ${l("Deadband % (turn on above target+this)","deadband",5)}
        ${c("Escalate to High after","escalate_after_s",300)}
        ${l("…if RH hasn't dropped this %","escalate_drop",1,.5)}
        ${l("Ease back to Low within % of target","ease_band",3)}
        ${c("Minimum on time","min_on_s",120)}
        ${c("Minimum off time","min_off_s",120)}
      `:U}`:U}`}setHead(t,e,s){return Q`
      <div class="section-label set-collapse-h" style="margin-top:16px" @click=${s}>
        <span>${e}</span>
        <ha-icon icon=${t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>`}renderSettings(){const t=this.accent(),e=this.colorDraft,s=e?.mode??this.colorMode,i=e?.modeIn??this.colorModeIn,o=e?.hi??this.colHi,a=e?.lo??this.colLo,n=e?.in??this.colIn,r=e?.warn??this.colWarn,l=e?.showTrend??this.showTrend,c=e?.showBand??this.showBand,d=e?.showTargets??this.showTargets,h=e?.tileSummary??this.tileSummary,p=e?.hour12??this.hour12,u=e?.showConn??this.showConn,g=e?.connCustom??this.connCustom,m=e?.connSignal??this.connSignal,f=e?.showOutletsLog??this.showOutletsLog,v=e?.showOutletQuick??this.showOutletQuick,b=e?.outletQuickRemember??this.outletQuickRemember,_=e?.outletQuickNames??this.outletQuickNames,$=e?.showVpd??this.showVpd,x=e?.vpdLeaf??this.vpdLeaf,y=e?.showLeafVpd??this.showLeafVpd,w=e?.showDeviceLog??this.showDeviceLog,S=e?.showDeviceQuick??this.showDeviceQuick,k=e?.deviceQuickRemember??this.deviceQuickRemember,O=e?.customNames??this.customOutletNames,C=e?.customLayout??this.customLayout,D=e?.scale??this.cardScale,M=e?.cols??this.tileCols,T=e?.tileRadius??this.tileRadius,N=e?.tileBorderW??this.tileBorderW,L=e?.tileBorderCol??this.tileBorderCol,P=e?.tileBg??this.tileBg,R=e?.taTiles??this.taTiles,A=e?.taDevices??this.taDevices,E=e?.taOutlets??this.taOutlets,F=e?.cdShow??this.cooldownShow,z=e?.cdDevice??this.cooldownDevice,B=e?.cdOutlet??this.cooldownOutlet,H=e?.cdSecs??this.cooldownSecs,I=e?.ovOutlets??this.outletsOnOverview,V=!!this.get(this.eid("light","light_2")),W=this.outletOnly(),j=e?.omode??this.outletColorMode,q=e?.ocManual??this.ocManual,G=e?.ocSched??this.ocSched,K=e?.ocEnv??this.ocEnv,J=e?.ocDrip??this.ocDrip,Y=this.hasOutlets(),X=e?.dmode??this.deviceColorMode,Z=e?.dcManual??this.dcManual,tt=e?.dcSched??this.dcSched,et=e?.dcAuto??this.dcAuto,st=this.overviewDevices().length>0,it=!!e&&(void 0!==e.mode&&e.mode!==this.colorMode||void 0!==e.modeIn&&e.modeIn!==this.colorModeIn||void 0!==e.source&&e.source!==this.colorSource||void 0!==e.warn&&e.warn!==this.colWarn||void 0!==e.showTrend&&e.showTrend!==this.showTrend||void 0!==e.showBand&&e.showBand!==this.showBand||void 0!==e.showTargets&&e.showTargets!==this.showTargets||void 0!==e.tileSummary&&e.tileSummary!==this.tileSummary||void 0!==e.hour12&&e.hour12!==this.hour12||void 0!==e.showConn&&e.showConn!==this.showConn||void 0!==e.connCustom&&e.connCustom!==this.connCustom||void 0!==e.connSignal&&e.connSignal!==this.connSignal||void 0!==e.showOutletsLog&&e.showOutletsLog!==this.showOutletsLog||void 0!==e.showOutletQuick&&e.showOutletQuick!==this.showOutletQuick||void 0!==e.outletQuickRemember&&e.outletQuickRemember!==this.outletQuickRemember||void 0!==e.outletQuickNames&&e.outletQuickNames!==this.outletQuickNames||void 0!==e.showVpd&&e.showVpd!==this.showVpd||void 0!==e.showLeafVpd&&e.showLeafVpd!==this.showLeafVpd||void 0!==e.showDeviceLog&&e.showDeviceLog!==this.showDeviceLog||void 0!==e.showDeviceQuick&&e.showDeviceQuick!==this.showDeviceQuick||void 0!==e.deviceQuickRemember&&e.deviceQuickRemember!==this.deviceQuickRemember||void 0!==e.vpdLeaf&&e.vpdLeaf!==this.vpdLeaf||void 0!==e.hi&&e.hi!==this.colHi||void 0!==e.lo&&e.lo!==this.colLo||void 0!==e.in&&e.in!==this.colIn||void 0!==e.hide2&&e.hide2!==this.hideLight2||void 0!==e.customNames&&e.customNames!==this.customOutletNames||void 0!==e.customLayout&&e.customLayout!==this.customLayout||void 0!==e.scale&&e.scale!==this.cardScale||void 0!==e.cols&&e.cols!==this.tileCols||void 0!==e.omode&&e.omode!==this.outletColorMode||void 0!==e.ocManual&&e.ocManual!==this.ocManual||void 0!==e.ocSched&&e.ocSched!==this.ocSched||void 0!==e.ocEnv&&e.ocEnv!==this.ocEnv||void 0!==e.ocDrip&&e.ocDrip!==this.ocDrip||void 0!==e.dmode&&e.dmode!==this.deviceColorMode||void 0!==e.dcManual&&e.dcManual!==this.dcManual||void 0!==e.dcSched&&e.dcSched!==this.dcSched||void 0!==e.dcAuto&&e.dcAuto!==this.dcAuto||void 0!==e.tileRadius&&e.tileRadius!==this.tileRadius||void 0!==e.tileBorderW&&e.tileBorderW!==this.tileBorderW||void 0!==e.tileBorderCol&&e.tileBorderCol!==this.tileBorderCol||void 0!==e.tileBg&&e.tileBg!==this.tileBg||void 0!==e.taTiles&&e.taTiles!==this.taTiles||void 0!==e.taDevices&&e.taDevices!==this.taDevices||void 0!==e.taOutlets&&e.taOutlets!==this.taOutlets||void 0!==e.cdShow&&e.cdShow!==this.cooldownShow||void 0!==e.cdDevice&&e.cdDevice!==this.cooldownDevice||void 0!==e.cdOutlet&&e.cdOutlet!==this.cooldownOutlet||void 0!==e.cdSecs&&e.cdSecs!==this.cooldownSecs||void 0!==e.ovOutlets&&e.ovOutlets!==this.outletsOnOverview||void 0!==e.tsSource&&e.tsSource!==this.tempSource||void 0!==e.tsTemp&&e.tsTemp!==this.extTemp||void 0!==e.tsHumi&&e.tsHumi!==this.extHumi||void 0!==e.sc&&JSON.stringify(e.sc)!==JSON.stringify(this.smart||{})),ot=t=>this.colorDraft={...this.colorDraft??{},...t},at=(e,s,i,o,a)=>Q`
      <button class="seg ${e===s?"on":""}"
        style=${e===s?`border-color:${t};color:${t}`:U}
        @click=${a}>
        <ha-icon icon=${o}></ha-icon><span>${i}</span>
      </button>`,nt=e?.source??this.colorSource,rt=(e,s,i)=>Q`
      <button class="seg ${nt===e?"on":""}"
        style=${nt===e?`border-color:${t};color:${t}`:U}
        @click=${()=>ot({source:e})}>
        <ha-icon icon=${i}></ha-icon><span>${s}</span>
      </button>`,lt=(t,e,s)=>Q`
      <label class="color-field">
        <span>${t}</span>
        <input class="pinwheel" type="color" .value=${e}
          @input=${t=>s(t.target.value)} />
      </label>`;return Q`
      ${this.renderTempSource(e,ot)}
      ${this.renderSmartControl(e,ot)}
      <div class="section-label set-collapse-h"
        @click=${()=>this._colorOpen=!this._colorOpen}>
        <span>Colours &amp; tile appearance</span>
        <ha-icon icon=${this._colorOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._colorOpen?Q`
      ${W?U:Q`
      <div class="section-label">Colour by</div>
      <div class="set-note">
        What drives the tile highlight —
        <span style="color:${this.accent()}">Alarms</span> (the controller's alarm
        limits on the Alerts tab),
        <span style="color:${this.accent()}">Targets</span> (the environment
        day/night target ± dead zone), or
        <span style="color:${this.accent()}">Both</span> (an active alarm wins;
        targets colour everything else). Targets add a small “target …” line to
        Temp / Humidity / CO2 tiles.
      </div>
      <div class="seg-row">
        ${rt("alarms","Alarms","mdi:bell-outline")}
        ${rt("targets","Targets","mdi:target")}
        ${rt("both","Both","mdi:set-center")}
      </div>

      <div class="section-label" style="margin-top:16px">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${o}">above max</span>,
        <span style="color:${a}">below min</span>. Saved to the controller, so
        it sticks across upgrades and your other devices.
      </div>
      <div class="seg-row">
        ${at(s,"off","No color","mdi:circle-off-outline",()=>ot({mode:"off"}))}
        ${at(s,"tile","Tile color","mdi:square-rounded",()=>ot({mode:"tile"}))}
        ${at(s,"text","Text color","mdi:format-color-text",()=>ot({mode:"text"}))}
      </div>
      <div class="color-row">
        ${lt("Above max",o,t=>ot({hi:t}))}
        ${lt("Below min",a,t=>ot({lo:t}))}
        ${lt("Near edge",r,t=>ot({warn:t}))}
      </div>

      <div class="section-label" style="margin-top:16px">In-range highlight</div>
      <div class="set-note">
        Colour a reading that's <span style="color:${n}">within</span> its
        limits. Applies to every reading; off by default.
      </div>
      <div class="seg-row">
        ${at(i,"off","No color","mdi:circle-off-outline",()=>ot({modeIn:"off"}))}
        ${at(i,"tile","Tile color","mdi:square-rounded",()=>ot({modeIn:"tile"}))}
        ${at(i,"text","Text color","mdi:format-color-text",()=>ot({modeIn:"text"}))}
      </div>
      <div class="color-row">
        ${lt("In range",n,t=>ot({in:t}))}
      </div>
      `}

      ${V?Q`
            <div class="section-label" style="margin-top:16px">Devices</div>
            <div class="set-note">
              A phantom Light 2 or Fan tile? Manage per-device accessories in the
              integration: Settings → Devices &amp; services → Spider Farmer
              Bridge → Configure → “Device accessories”. HA then skips the
              entity entirely.
            </div>`:U}

      ${Y?Q`
            <div class="section-label" style="margin-top:16px">Outlet active color</div>
            <div class="set-note">
              Colour an outlet tile while it's on, by its mode —
              <span style="color:${q}">Manual</span>,
              <span style="color:${G}">Scheduled</span>,
              <span style="color:${K}">Environment</span>,
              <span style="color:${J}">Drip</span>. Off outlets stay neutral.
            </div>
            <div class="seg-row">
              ${at(j,"off","No color","mdi:circle-off-outline",()=>ot({omode:"off"}))}
              ${at(j,"tile","Tile color","mdi:square-rounded",()=>ot({omode:"tile"}))}
              ${at(j,"text","Text color","mdi:format-color-text",()=>ot({omode:"text"}))}
            </div>
            <div class="color-row">
              ${lt("Manual",q,t=>ot({ocManual:t}))}
              ${lt("Scheduled",G,t=>ot({ocSched:t}))}
            </div>
            <div class="color-row">
              ${lt("Environment",K,t=>ot({ocEnv:t}))}
              ${lt("Drip",J,t=>ot({ocDrip:t}))}
            </div>`:U}

      ${st?Q`
            <div class="section-label" style="margin-top:16px">Device active color</div>
            <div class="set-note">
              Colour a device tile while it's on, by its mode —
              <span style="color:${Z}">Manual</span>,
              <span style="color:${tt}">Scheduled</span>,
              <span style="color:${et}">Auto</span> (Environment / PPFD). A
              <span style="color:${Pt}">fault</span> always overrides.
            </div>
            <div class="seg-row">
              ${at(X,"off","No color","mdi:circle-off-outline",()=>ot({dmode:"off"}))}
              ${at(X,"tile","Tile color","mdi:square-rounded",()=>ot({dmode:"tile"}))}
              ${at(X,"text","Text color","mdi:format-color-text",()=>ot({dmode:"text"}))}
            </div>
            <div class="color-row">
              ${lt("Manual",Z,t=>ot({dcManual:t}))}
              ${lt("Scheduled",tt,t=>ot({dcSched:t}))}
              ${lt("Auto",et,t=>ot({dcAuto:t}))}
            </div>`:U}

      <div class="section-label" style="margin-top:16px">Tile appearance</div>
      <div class="set-note">Edges, border, and background for every tile.</div>
      <div class="set-note" style="margin-top:6px;display:flex;justify-content:space-between">
        <span>Corner radius</span><span style="color:${t};font-weight:500">${T}px</span>
      </div>
      <input type="range" min="0" max="20" step="1" .value=${String(T)} style="width:100%"
        @input=${t=>ot({tileRadius:Number(t.target.value)})} />
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Border width</span><span style="color:${t};font-weight:500">${N}px</span>
      </div>
      <input type="range" min="0" max="4" step="1" .value=${String(N)} style="width:100%"
        @input=${t=>ot({tileBorderW:Number(t.target.value)})} />
      <div class="color-row" style="margin-top:8px">
        ${lt("Border",L||t,t=>ot({tileBorderCol:t}))}
        ${lt("Background",P||"#1e1e1e",t=>ot({tileBg:t}))}
      </div>
      <div class="ta-preview"
        style="border-radius:${T}px;border:${N}px solid ${L||"transparent"};background:${P||"var(--secondary-background-color)"}">
        <span style="color:${P?"#fff":"var(--secondary-text-color)"}">Heater</span>
        <b style="color:${P?"#fff":"var(--primary-text-color)"}">L4</b>
        <span style="font-size:10px;color:var(--secondary-text-color)">preview</span>
      </div>
      <div class="toggle-row" style="margin-top:6px">
        <span style="font-size:13px;color:var(--secondary-text-color)">Reset background &amp; border to theme</span>
        <button class="olog-rb" @click=${()=>ot({tileBg:"",tileBorderCol:"",tileBorderW:1})}>Reset</button>
      </div>
      <div class="set-note" style="margin-top:12px">Apply appearance to</div>
      <div class="toggle-row">
        <span>Sensor tiles</span>
        <button class="toggle ${R?"on":""}"
          style=${R?`background:${t}`:U}
          @click=${()=>ot({taTiles:!R})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device tiles</span>
        <button class="toggle ${A?"on":""}"
          style=${A?`background:${t}`:U}
          @click=${()=>ot({taDevices:!A})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Outlet tiles</span>
        <button class="toggle ${E?"on":""}"
          style=${E?`background:${t}`:U}
          @click=${()=>ot({taOutlets:!E})}></button>
      </div>
      `:U}

      ${this.get(`switch.sf_${this.config.panel}_dehumidifier`)||this.hasOutlets()?Q`
      <div class="section-label set-collapse-h" style="margin-top:16px"
        @click=${()=>this._cdOpen=!this._cdOpen}>
        <span>Dehumidifier cooldown timer</span>
        <ha-icon icon=${this._cdOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._cdOpen?Q`
      <div class="set-note">
        Many dehumidifiers enforce a compressor lockout after switching off — they
        can't restart until it elapses, even when SF or the integration calls for
        them. Show a live countdown so you always know when it can come back on.
      </div>
      <div class="toggle-row">
        <span>Show cooldown timer</span>
        <button class="toggle ${F?"on":""}"
          style=${F?`background:${t}`:U}
          @click=${()=>ot({cdShow:!F})}></button>
      </div>
      ${F?Q`
      <div class="toggle-row" style="margin-top:8px">
        <span>On device tile</span>
        <button class="toggle ${z?"on":""}"
          style=${z?`background:${t}`:U}
          @click=${()=>ot({cdDevice:!z})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>On outlet tiles</span>
        <button class="toggle ${B?"on":""}"
          style=${B?`background:${t}`:U}
          @click=${()=>ot({cdOutlet:!B})}></button>
      </div>
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Cooldown length</span>
        <span style="color:${t};font-weight:500">${(H/60).toFixed(1).replace(/\.0$/,"")} min</span>
      </div>
      <input type="range" min="30" max="900" step="30" .value=${String(H)} style="width:100%"
        @input=${t=>ot({cdSecs:Number(t.target.value)})} />
      `:U}
      `:U}
      `:U}

      ${this.hasOutlets()?Q`
      ${this.setHead(this._setOverviewOpen,"Overview",()=>this._setOverviewOpen=!this._setOverviewOpen)}
      ${this._setOverviewOpen?Q`
      <div class="set-note">
        Show everything in one view: append the outlet tiles to the Overview tab,
        at the bottom under Devices.
      </div>
      <div class="toggle-row">
        <span>Show outlets on Overview</span>
        <button class="toggle ${I?"on":""}"
          style=${I?`background:${t}`:U}
          @click=${()=>ot({ovOutlets:!I})}></button>
      </div>`:U}`:U}

      ${this.setHead(this._setExtrasOpen,"Tile extras",()=>this._setExtrasOpen=!this._setExtrasOpen)}
      ${this._setExtrasOpen?Q`
      <div class="set-note">
        Shown on every Overview tile, independent of the colour mode. Tap any tile
        to open its history graph (6h–7d, selectable).
      </div>
      ${W?U:Q`
      <div class="toggle-row">
        <span>Target / range line</span>
        <button class="toggle ${d?"on":""}"
          style=${d?`background:${t}`:U}
          @click=${()=>ot({showTargets:!d})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Trend arrows</span>
        <button class="toggle ${l?"on":""}"
          style=${l?`background:${t}`:U}
          @click=${()=>ot({showTrend:!l})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Dead-zone band</span>
        <button class="toggle ${c?"on":""}"
          style=${c?`background:${t}`:U}
          @click=${()=>ot({showBand:!c})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device mode summary</span>
        <button class="toggle ${h?"on":""}"
          style=${h?`background:${t}`:U}
          @click=${()=>ot({tileSummary:!h})}></button>
      </div>
      <div class="set-note">
        On each device tile (Blower, Fan, Heater, Humidifier, Dehumidifier,
        Lights), show a small line with its mode and key settings — so you can
        read it without opening the tile.
      </div>`}
      <div class="toggle-row" style="margin-top:8px">
        <span>12-hour time (AM/PM)</span>
        <button class="toggle ${p?"on":""}"
          style=${p?`background:${t}`:U}
          @click=${()=>ot({hour12:!p})}></button>
      </div>
      <div class="set-note">
        Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.
      </div>`:U}

      ${this.setHead(this._setConnOpen,"Header connection info",()=>this._setConnOpen=!this._setConnOpen)}
      ${this._setConnOpen?Q`
      <div class="set-note">
        Show the controller's online status + Wi-Fi signal bars in the top-right
        of the header. Signal comes from the controller's own Wi-Fi — no extra
        entities are created.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show connection info</span>
        <button class="toggle ${u?"on":""}"
          style=${u?`background:${t}`:U}
          @click=${()=>ot({showConn:!u})}></button>
      </div>
      ${u?Q`
        <div class="toggle-row" style="margin-top:8px">
          <span>Use a custom signal source</span>
          <button class="toggle ${g?"on":""}"
            style=${g?`background:${t}`:U}
            @click=${()=>ot({connCustom:!g})}></button>
        </div>
        <div class="set-note">
          Point the signal bars at a different entity — e.g. the controller is on
          another AP or hard-wired, and its dBm is reported by your router/AP
          integration instead of the bundled Wi-Fi AP.
        </div>
        ${g?Q`
          <div class="toggle-row" style="margin-top:6px">
            <span>Signal entity</span>
            <select style="max-width:60%"
              @change=${t=>ot({connSignal:t.target.value})}>
              <option value="" ?selected=${!m}>— none —</option>
              ${this.signalEntityOptions().map(t=>Q`
                <option value=${t.id} ?selected=${m===t.id}>${t.name}</option>`)}
            </select>
          </div>`:U}
      `:U}`:U}

      ${W?U:Q`
      ${this.setHead(this._setVpdOpen,"VPD graph",()=>this._setVpdOpen=!this._setVpdOpen)}
      ${this._setVpdOpen?Q`
      <div class="set-note">
        Adds a "VPD" tab with a vibrant temperature × humidity phase chart (grid
        or trend) plus growth-stage targets. Uses this panel's air temp + humidity
        — no extra entities.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Leaf VPD tile</span>
        <button class="toggle ${y?"on":""}"
          style=${y?`background:${t}`:U}
          @click=${()=>ot({showLeafVpd:!y})}></button>
      </div>
      <div class="set-note">Off hides the Leaf VPD tile and its target settings.</div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Enable VPD graph</span>
        <button class="toggle ${$?"on":""}"
          style=${$?`background:${t}`:U}
          @click=${()=>ot({showVpd:!$})}></button>
      </div>
      ${$?Q`
        <div class="toggle-row" style="margin-top:8px">
          <span>Enable Leaf VPD</span>
          <button class="toggle ${x?"on":""}"
            style=${x?`background:${t}`:U}
            @click=${()=>ot({vpdLeaf:!x})}></button>
        </div>
        <div class="set-note">
          Also plots leaf VPD (from the leaf-VPD sensor) alongside air VPD on the
          tab.
        </div>`:U}`:U}`}

      ${st?Q`
      ${this.setHead(this._setDevOpen,"Devices",()=>this._setDevOpen=!this._setDevOpen)}
      ${this._setDevOpen?Q`
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Device Log tab</span>
        <button class="toggle ${w?"on":""}"
          style=${w?`background:${t}`:U}
          @click=${()=>ot({showDeviceLog:!w})}></button>
      </div>
      <div class="set-note">
        Adds a "Device Log" tab with a 24h/7d on-off timeline per device (lights,
        fan, blower, heater, humidifier, dehumidifier) from Home Assistant's
        recorder history. Tap a row for its recent events.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Quick-toggle devices row</span>
        <button class="toggle ${S?"on":""}"
          style=${S?`background:${t}`:U}
          @click=${()=>ot({showDeviceQuick:!S})}></button>
      </div>
      <div class="set-note">
        Shows a compact row of icon buttons above the device tiles for fast
        on/off toggling.
      </div>
      ${S?Q`
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember device settings on toggle</span>
          <button class="toggle ${k?"on":""}"
            style=${k?`background:${t}`:U}
            @click=${()=>ot({deviceQuickRemember:!k})}></button>
        </div>
        <div class="set-note">
          On quick-off, remember the device's mode; on quick-on, re-select it so the
          controller re-applies that mode's settings (instead of a bare manual on).
          Saved on the controller, so it syncs across your devices.
        </div>`:U}
      `:U}`:U}

      ${Y?Q`
      ${this.setHead(this._setOutletOpen,"Outlets",()=>this._setOutletOpen=!this._setOutletOpen)}
      ${this._setOutletOpen?Q`
      <div class="toggle-row" style="margin-top:12px">
        <span>Custom outlet names</span>
        <button class="toggle ${O?"on":""}"
          style=${O?`background:${t}`:U}
          @click=${()=>ot({customNames:!O})}></button>
      </div>
      <div class="set-note">
        Give each outlet its own name (e.g. "Exhaust Fan", "Veg Light"), shown in
        the Outlets tab in place of "Outlet 1/2/…". Edit each name on its outlet
        after enabling. Saved to the controller, so it sticks across upgrades and
        your other devices.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Outlets Log tab</span>
        <button class="toggle ${f?"on":""}"
          style=${f?`background:${t}`:U}
          @click=${()=>ot({showOutletsLog:!f})}></button>
      </div>
      <div class="set-note">
        Adds an "Outlets Log" tab with a 24h/7d on-off timeline per outlet (from
        Home Assistant's recorder history). Tap a row to see its recent switch
        events.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Quick-toggle outlets row</span>
        <button class="toggle ${v?"on":""}"
          style=${v?`background:${t}`:U}
          @click=${()=>ot({showOutletQuick:!v})}></button>
      </div>
      <div class="set-note">
        Shows a compact row of numbered on/off buttons above the outlet tiles for
        fast toggling.
      </div>
      ${v?Q`
        <div class="toggle-row" style="margin-top:6px">
          <span>Show outlet names on quick buttons</span>
          <button class="toggle ${_?"on":""}"
            style=${_?`background:${t}`:U}
            @click=${()=>ot({outletQuickNames:!_})}></button>
        </div>
        <div class="set-note">
          On: buttons show the outlet number + name (e.g. "4-Heater"), or just the
          number for unnamed outlets. Off: a status dot + number.
        </div>
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember outlet settings on toggle</span>
          <button class="toggle ${b?"on":""}"
            style=${b?`background:${t}`:U}
            @click=${()=>ot({outletQuickRemember:!b})}></button>
        </div>
        <div class="set-note">
          On: quick-on restores the outlet's last mode/config (saved when you
          quick-off it). Off: plain on/off — a bare toggle reverts the outlet to
          Manual, like the device does.
        </div>`:U}`:U}`:U}

      ${this.setHead(this._setLayoutOpen,"Layout",()=>this._setLayoutOpen=!this._setLayoutOpen)}
      ${this._setLayoutOpen?Q`
      <div class="set-note">
        Resize the whole card and choose how many tiles sit per row. Saved to the
        controller, so it sticks across upgrades and your other devices.
      </div>
      <div class="toggle-row">
        <span>Custom layout</span>
        <button class="toggle ${C?"on":""}"
          style=${C?`background:${t}`:U}
          @click=${()=>ot({customLayout:!C})}></button>
      </div>
      ${C?Q`
        <div class="set-note" style="margin-top:10px;display:flex;justify-content:space-between">
          <span>Scale</span><span style="color:${t};font-weight:500">${D}%</span>
        </div>
        <input type="range" min="70" max="150" step="5" .value=${String(D)}
          style="width:100%"
          @input=${t=>ot({scale:Number(t.target.value)})} />
        <div class="set-note" style="margin-top:10px">Tiles per row</div>
        <div class="seg-row" style="grid-template-columns:repeat(4,1fr)">
          ${[2,3,4,5].map(e=>Q`
            <button class="seg ${M===e?"on":""}"
              style=${M===e?`border-color:${t};color:${t}`:U}
              @click=${()=>ot({cols:e})}><span>${e}</span></button>`)}
        </div>`:U}`:U}

      ${this.saveBar(it,()=>{const t=this.colorDraft;t&&(void 0!==t.mode&&t.mode!==this.colorMode&&(this.colorMode=t.mode,this.persistColorOption("colors",t.mode)),void 0!==t.modeIn&&t.modeIn!==this.colorModeIn&&(this.colorModeIn=t.modeIn,this.persistColorOption("colors_in",t.modeIn)),void 0!==t.source&&t.source!==this.colorSource&&(this.colorSource=t.source,this.persistColorOption("color_source",t.source)),void 0!==t.warn&&t.warn!==this.colWarn&&(this.colWarn=t.warn,this.persistColorOption("color_warn",t.warn)),void 0!==t.showTrend&&t.showTrend!==this.showTrend&&(this.showTrend=t.showTrend,this.persistColorOption("show_trend",t.showTrend?"1":"0")),void 0!==t.showBand&&t.showBand!==this.showBand&&(this.showBand=t.showBand,this.persistColorOption("show_band",t.showBand?"1":"0")),void 0!==t.showTargets&&t.showTargets!==this.showTargets&&(this.showTargets=t.showTargets,this.persistColorOption("show_targets",t.showTargets?"1":"0")),void 0!==t.tileSummary&&t.tileSummary!==this.tileSummary&&(this.tileSummary=t.tileSummary,this.persistColorOption("tile_summary",t.tileSummary?"1":"0")),void 0!==t.showConn&&t.showConn!==this.showConn&&(this.showConn=t.showConn,this.persistColorOption("show_conn",t.showConn?"1":"0")),void 0!==t.connCustom&&t.connCustom!==this.connCustom&&(this.connCustom=t.connCustom,this.persistColorOption("conn_custom",t.connCustom?"1":"0")),void 0!==t.connSignal&&t.connSignal!==this.connSignal&&(this.connSignal=t.connSignal,this.persistColorOption("conn_signal",t.connSignal)),void 0!==t.showOutletsLog&&t.showOutletsLog!==this.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog,this.persistColorOption("outlets_log",t.showOutletsLog?"1":"0")),void 0!==t.showOutletQuick&&t.showOutletQuick!==this.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick,this.persistColorOption("outlet_quick",t.showOutletQuick?"1":"0")),void 0!==t.outletQuickRemember&&t.outletQuickRemember!==this.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember,this.persistColorOption("outlet_quick_remember",t.outletQuickRemember?"1":"0")),void 0!==t.outletQuickNames&&t.outletQuickNames!==this.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames,this.persistColorOption("outlet_quick_names",t.outletQuickNames?"1":"0")),void 0!==t.showVpd&&t.showVpd!==this.showVpd&&(this.showVpd=t.showVpd,this.persistColorOption("vpd_graph",t.showVpd?"1":"0")),void 0!==t.vpdLeaf&&t.vpdLeaf!==this.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf,this.persistColorOption("vpd_leaf",t.vpdLeaf?"1":"0")),void 0!==t.showLeafVpd&&t.showLeafVpd!==this.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd,this.persistColorOption("leaf_vpd_tile",t.showLeafVpd?"1":"0")),void 0!==t.showDeviceLog&&t.showDeviceLog!==this.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog,this.persistColorOption("device_log",t.showDeviceLog?"1":"0")),void 0!==t.showDeviceQuick&&t.showDeviceQuick!==this.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick,this.persistColorOption("device_quick",t.showDeviceQuick?"1":"0")),void 0!==t.deviceQuickRemember&&t.deviceQuickRemember!==this.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember,this.persistColorOption("device_quick_remember",t.deviceQuickRemember?"1":"0")),void 0!==t.hour12&&t.hour12!==this.hour12&&(this.hour12=t.hour12,this.persistColorOption("time_12h",t.hour12?"1":"0")),void 0!==t.hi&&t.hi!==this.colHi&&(this.colHi=t.hi,this.persistColorOption("color_hi",t.hi)),void 0!==t.lo&&t.lo!==this.colLo&&(this.colLo=t.lo,this.persistColorOption("color_lo",t.lo)),void 0!==t.in&&t.in!==this.colIn&&(this.colIn=t.in,this.persistColorOption("color_in",t.in)),void 0!==t.hide2&&t.hide2!==this.hideLight2&&(this.hideLight2=t.hide2,this.persistColorOption("hide_light2",t.hide2?"1":"0")),void 0!==t.customNames&&t.customNames!==this.customOutletNames&&(this.customOutletNames=t.customNames,this.persistColorOption("custom_outlet_names",t.customNames?"1":"0")),void 0!==t.customLayout&&t.customLayout!==this.customLayout&&(this.customLayout=t.customLayout,this.persistColorOption("custom_layout",t.customLayout?"1":"0")),void 0!==t.scale&&t.scale!==this.cardScale&&(this.cardScale=t.scale,this.persistColorOption("card_scale",String(t.scale))),void 0!==t.cols&&t.cols!==this.tileCols&&(this.tileCols=t.cols,this.persistColorOption("tile_cols",String(t.cols))),void 0!==t.tileRadius&&t.tileRadius!==this.tileRadius&&(this.tileRadius=t.tileRadius,this.persistColorOption("tile_radius",String(t.tileRadius))),void 0!==t.tileBorderW&&t.tileBorderW!==this.tileBorderW&&(this.tileBorderW=t.tileBorderW,this.persistColorOption("tile_border_w",String(t.tileBorderW))),void 0!==t.tileBorderCol&&t.tileBorderCol!==this.tileBorderCol&&(this.tileBorderCol=t.tileBorderCol,this.persistColorOption("tile_border_col",t.tileBorderCol)),void 0!==t.tileBg&&t.tileBg!==this.tileBg&&(this.tileBg=t.tileBg,this.persistColorOption("tile_bg",t.tileBg)),void 0!==t.taTiles&&t.taTiles!==this.taTiles&&(this.taTiles=t.taTiles,this.persistColorOption("ta_tiles",t.taTiles?"1":"0")),void 0!==t.taDevices&&t.taDevices!==this.taDevices&&(this.taDevices=t.taDevices,this.persistColorOption("ta_devices",t.taDevices?"1":"0")),void 0!==t.taOutlets&&t.taOutlets!==this.taOutlets&&(this.taOutlets=t.taOutlets,this.persistColorOption("ta_outlets",t.taOutlets?"1":"0")),void 0!==t.cdShow&&t.cdShow!==this.cooldownShow&&(this.cooldownShow=t.cdShow,this.persistColorOption("cooldown_show",t.cdShow?"1":"0")),void 0!==t.cdDevice&&t.cdDevice!==this.cooldownDevice&&(this.cooldownDevice=t.cdDevice,this.persistColorOption("cooldown_device",t.cdDevice?"1":"0")),void 0!==t.cdOutlet&&t.cdOutlet!==this.cooldownOutlet&&(this.cooldownOutlet=t.cdOutlet,this.persistColorOption("cooldown_outlet",t.cdOutlet?"1":"0")),void 0!==t.cdSecs&&t.cdSecs!==this.cooldownSecs&&(this.cooldownSecs=t.cdSecs,this.persistColorOption("cooldown_secs",String(t.cdSecs))),void 0!==t.ovOutlets&&t.ovOutlets!==this.outletsOnOverview&&(this.outletsOnOverview=t.ovOutlets,this.persistColorOption("overview_outlets",t.ovOutlets?"1":"0")),void 0!==t.omode&&t.omode!==this.outletColorMode&&(this.outletColorMode=t.omode,this.persistColorOption("outlet_colors",t.omode)),void 0!==t.ocManual&&t.ocManual!==this.ocManual&&(this.ocManual=t.ocManual,this.persistColorOption("oc_manual",t.ocManual)),void 0!==t.ocSched&&t.ocSched!==this.ocSched&&(this.ocSched=t.ocSched,this.persistColorOption("oc_sched",t.ocSched)),void 0!==t.ocEnv&&t.ocEnv!==this.ocEnv&&(this.ocEnv=t.ocEnv,this.persistColorOption("oc_env",t.ocEnv)),void 0!==t.ocDrip&&t.ocDrip!==this.ocDrip&&(this.ocDrip=t.ocDrip,this.persistColorOption("oc_drip",t.ocDrip)),void 0!==t.dmode&&t.dmode!==this.deviceColorMode&&(this.deviceColorMode=t.dmode,this.persistColorOption("device_colors",t.dmode)),void 0!==t.dcManual&&t.dcManual!==this.dcManual&&(this.dcManual=t.dcManual,this.persistColorOption("dc_manual",t.dcManual)),void 0!==t.dcSched&&t.dcSched!==this.dcSched&&(this.dcSched=t.dcSched,this.persistColorOption("dc_sched",t.dcSched)),void 0!==t.dcAuto&&t.dcAuto!==this.dcAuto&&(this.dcAuto=t.dcAuto,this.persistColorOption("dc_auto",t.dcAuto)),this._commitTempSource(t),this._commitSmartControl(t),this._colorSynced=!0,this.cacheColors()),this.colorDraft=null},()=>this.colorDraft=null,"apply-bar")}`}}Yt.PLAN_PRESETS=[{key:"seedling",label:"Seedling cultivation",emoji:"🌱",tC:22.78,tCn:22.78,tDz:2.78,hd:75,hn:75,hDz:10,cd:600,cn:400,cDz:200,ppfd:200,on:"05:00",off:"23:00",fade:30},{key:"clone",label:"Cloning and seedling",emoji:"🌿",tC:23.89,tCn:22.22,tDz:2.78,hd:75,hn:75,hDz:10,cd:400,cn:400,cDz:100,ppfd:150,on:"05:00",off:"23:00",fade:30},{key:"veg",label:"Vegetative growth",emoji:"🌿",tC:29.4444,tCn:23.8889,tDz:2.7778,hd:70,hn:65,hDz:10,cd:1e3,cn:500,cDz:200,ppfd:600,on:"05:00",off:"23:00",fade:30},{key:"flower",label:"Flowering period",emoji:"🌸",tC:25,tCn:22.7778,tDz:2.7778,hd:55,hn:55,hDz:5,cd:1e3,cn:400,cDz:200,ppfd:900,on:"05:00",off:"17:00",fade:30},{key:"dry",label:"Dry",emoji:"🍂",tC:15.56,tCn:15.56,tDz:1.67,hd:55,hn:55,hDz:5,ppfd:0}],Yt.MY_TPL_KEY="sf-plan-templates",Yt.VPD_TH=[.4,.8,1.2,1.6,2],Yt.VPD_COL=[[31,113,161],[35,170,156],[150,197,90],[228,192,42],[236,140,45],[206,66,51]],Yt.styles=n`
    ${yt}
    ha-card { padding: 12px 14px 16px; }
    .header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .header .title { font-size: 18px; font-weight: 500; }
    .header .device { font-size: 12px; color: var(--secondary-text-color); }
    /* Connection info: online dot + signal bars + dBm, pushed to the right edge
       of the header row. Wraps below the name on very narrow cards. */
    .header .conn {
      margin-left: auto; display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; color: var(--secondary-text-color); white-space: nowrap;
      align-self: center;
    }
    .header .conn .conn-st { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; }
    .header .conn .conn-dot { width: 7px; height: 7px; border-radius: 50%; }
    .header .conn svg { display: block; }
    .header .conn .conn-eth { --mdc-icon-size: 16px; width: 16px; height: 16px; }
    /* Outlets Log tab */
    .olog-range { display: flex; gap: 6px; margin: 2px 0 10px; }
    .olog-rb {
      font: inherit; font-size: 11px; padding: 3px 10px; border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color, #333); background: transparent; color: var(--secondary-text-color);
    }
    .olog-row {
      display: flex; align-items: center; gap: 10px; padding: 8px 2px; cursor: pointer;
      border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.1));
    }
    .olog-nm { width: 96px; flex: 0 0 auto; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .olog-nm .olog-cur { display: block; font-size: 10px; color: var(--secondary-text-color); }
    .olog-tl {
      position: relative; flex: 1; height: 14px; border-radius: 4px; overflow: hidden;
      background: var(--secondary-background-color, #24272d);
    }
    .olog-seg { position: absolute; top: 0; bottom: 0; background: #54c06a; border-radius: 2px; }
    .olog-load { position: absolute; left: 6px; top: 0; font-size: 10px; color: var(--secondary-text-color); }
    .olog-chev { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: 0 0 auto; }
    .olog-exp { margin: 2px 0 8px 106px; border-left: 2px solid var(--divider-color, #2f333a); padding-left: 10px; }
    .olog-ev { display: flex; justify-content: space-between; font-size: 11px; color: var(--primary-text-color); padding: 2px 0; }
    .olog-ev .on { color: #54c06a; font-weight: 500; }
    .olog-ev .off { color: var(--secondary-text-color); font-weight: 500; }
    .olog-ev .dur { color: var(--secondary-text-color); }
    .olog-axis { display: flex; justify-content: space-between; font-size: 9px; color: var(--secondary-text-color); margin: 4px 0 0 106px; }
    /* Apply "saving…" spinner */
    .save-spin {
      width: 11px; height: 11px; border-radius: 50%; display: inline-block; margin-right: 6px;
      vertical-align: -1px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
      animation: sf-spin .7s linear infinite;
    }
    @keyframes sf-spin { to { transform: rotate(360deg); } }
    /* Quick-toggle outlets row */
    .oq-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 0 0 8px; }
    .oq-lab { font-size: 10px; color: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 3px; }
    .oq-lab ha-icon { --mdc-icon-size: 14px; }
    .oq-btn {
      font: inherit; font-size: 11px; border-radius: 7px; padding: 4px 9px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 5px;
      border: 1px solid var(--divider-color, #3a3e44); background: var(--secondary-background-color, #26292e);
      color: var(--primary-text-color);
    }
    .oq-btn .oq-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--secondary-text-color); }
    /* saved quick-toggle profile active: full green box (border + bg) + green dot + number */
    .oq-btn.on { border-color: #54c06a; background: rgba(84,192,106,.14); color: #54c06a; }
    .oq-btn.on .oq-dot { background: #54c06a; }
    /* outlet simply on (no saved profile): green dot + green number, no box */
    .oq-btn.live { color: #54c06a; }
    .oq-btn.live .oq-dot { background: #54c06a; }
    /* Copy-outlet-config panel */
    .oc-copybtn {
      font: inherit; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
      border: 1px solid var(--divider-color, #3a3e44); background: var(--secondary-background-color, #26292e);
      color: var(--primary-text-color); border-radius: 6px; padding: 3px 8px;
    }
    .oc-copybtn ha-icon { --mdc-icon-size: 15px; }
    .oc-panel { background: var(--card-background-color, #22252b); border-radius: 8px; padding: 8px 10px; margin: 6px 0 4px; }
    .oc-title { font-size: 11px; color: var(--secondary-text-color); margin-bottom: 6px; }
    .oc-ck { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 3px 0; cursor: pointer; }
    .oc-fromitem {
      display: block; width: 100%; text-align: left; font: inherit; font-size: 12px;
      background: none; border: none; color: var(--primary-text-color);
      padding: 4px 6px; border-radius: 6px; cursor: pointer;
    }
    .oc-fromitem:hover { background: var(--secondary-background-color); }
    .oc-mode { color: var(--secondary-text-color); font-size: 11px; }
    /* One column per strip; wraps to a single column on narrow widths. */
    .oc-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .oc-col { min-width: 0; }
    .oc-colhd {
      font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
      color: var(--secondary-text-color); padding-bottom: 4px; margin-bottom: 6px;
      border-bottom: 1px solid var(--divider-color, #2f333a);
      display: flex; align-items: center; gap: 6px;
    }
    .oc-cur {
      font-size: 9px; color: var(--sf-accent, #ff9800); text-transform: none; letter-spacing: 0;
      border: 1px solid var(--sf-accent, #ff9800); border-radius: 5px; padding: 0 5px;
    }
    .oc-apply {
      margin-top: 8px; background: var(--sf-accent, #ff9800); color: #fff; border: none;
      border-radius: 7px; font-size: 12px; padding: 5px 12px; cursor: pointer;
    }
    .oc-apply[disabled] { background: var(--divider-color, #444); color: var(--secondary-text-color); cursor: default; }
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
    .grid { display: grid; grid-template-columns: repeat(var(--sf-cols, 3), minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 8px; }
    .tile-val { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile {
      background: var(--sf-tile-bg, var(--secondary-background-color));
      border-radius: var(--sf-tile-radius, 12px);
      border: var(--sf-tile-bw, 0px) solid var(--sf-tile-bc, transparent);
      padding: 10px;
      min-width: 0; overflow: hidden; min-height: 138px; box-sizing: border-box;
      position: relative;
    }
    /* Tile-appearance scope: when a category is excluded (.ta-x-* on the card),
       reset the custom-appearance vars to their invalid value on that category's
       tiles so the var() fallbacks (theme defaults) apply. A tile owns the reset
       so it wins over the inherited value from the card's inline style.
       Sensor tiles = .tile that is neither a device nor an outlet tile. */
    .ta-x-t .tile:not(.tile-device):not(.tile-outlet),
    .ta-x-d .tile.tile-device,
    .ta-x-o .tile.tile-outlet {
      --sf-tile-bg: initial;
      --sf-tile-radius: initial;
      --sf-tile-bw: initial;
      --sf-tile-bc: initial;
    }
    /* Device tiles pin their icon + value to the bottom-left so the value lines up
       across tiles regardless of how many summary lines are above it. */
    .tile-device { display: flex; flex-direction: column; }
    /* Higher specificity than ".tile ha-icon" below so the auto margin wins and
       pushes the icon + value to the bottom. */
    .tile.tile-device > ha-icon { margin-top: auto; }
    /* PPFD target + Daily Light Integral badge, lower-right of a PPFD-mode light tile. */
    .tile-dli {
      position: absolute; right: 8px; bottom: 7px; text-align: right;
      font-size: 10px; line-height: 1.4; color: var(--secondary-text-color); white-space: nowrap;
    }
    .tile-dli-v { color: var(--primary-text-color); }
    .tile-label {
      font-size: 11px; color: var(--secondary-text-color);
      display: flex; align-items: center; justify-content: space-between; gap: 3px;
      min-width: 0;
    }
    .tile-label .tl-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile-label .tl-right { display: inline-flex; align-items: center; gap: 2px; flex: 0 0 auto; }
    .tile-trend { --mdc-icon-size: 15px; margin: 0; }
    /* Dead-zone band on a tile. */
    .tile-band {
      height: 5px; border-radius: 3px; margin-top: 7px; position: relative;
      background: var(--card-background-color, #12151a); overflow: hidden;
    }
    .tile-band .bz { position: absolute; top: 0; bottom: 0; }
    .tile-band .bmark {
      position: absolute; top: -2px; width: 2px; height: 9px;
      background: var(--primary-text-color); border-radius: 1px;
      transform: translateX(-50%);
    }
    /* Inline tap-for-graph history sparkline. */
    .param-graph {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-top: 8px;
    }
    .param-graph .pg-head {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px;
    }
    .param-graph .pg-head > span:first-child { flex: 1; }
    .param-graph .pg-now { font-size: 15px; font-weight: 500; }
    .param-graph .pg-now .pg-u { font-size: 10px; color: var(--secondary-text-color); margin-left: 1px; }
    .param-graph .pg-head ha-icon { --mdc-icon-size: 18px; cursor: pointer; }
    .param-graph .pg-stats {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 6px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .param-graph .pg-stats b { color: var(--primary-text-color); font-weight: 500; }
    .param-graph .pg-plot { display: flex; align-items: stretch; gap: 6px; }
    .param-graph .pg-yax {
      display: flex; flex-direction: column; justify-content: space-between;
      font-size: 10px; color: var(--secondary-text-color); text-align: right;
      min-width: 30px; padding: 1px 0;
    }
    .param-graph .pg-svg { flex: 1; width: 100%; height: 120px; display: block; }
    .param-graph .pg-xax {
      display: flex; justify-content: space-between; margin: 3px 0 0 36px;
      font-size: 10px; color: var(--secondary-text-color);
    }
    .param-graph .pg-note { font-size: 13px; color: var(--secondary-text-color); }
    .tile ha-icon { --mdc-icon-size: 20px; display: block; margin: 2px 0; }
    .tile-val { font-size: 17px; font-weight: 500; }
    .tile-sub {
      font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    /* Outlet "full mode" second line: env direction (coloured) or schedule (muted). */
    .tile-qta {
      position: absolute; right: 9px; bottom: 8px; text-align: right;
      line-height: 1.12; pointer-events: none;
    }
    .tile-qta div { font-size: 10px; font-weight: 700; letter-spacing: .03em; }
    .tile-qta .l1 { font-weight: 600; }
    .tile-sub2 {
      font-size: 11px; font-weight: 500; margin-top: 1px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tile-sub2.od-heat { color: #ff7a4a; }
    .tile-sub2.od-cool { color: #45b6ff; }
    .tile-sub2.od-hum { color: #3ec7c2; }
    .tile-sub2.od-dehum { color: #e0a52e; }
    .tile-sub2.od-aer { color: #5bbf6a; }
    .tile-sub2.od-exh { color: #a99bff; }
    .tile-sub2.od-sched { color: var(--secondary-text-color); font-weight: 400; }
    /* Mode summary block right under the tile's expand arrow: 2-3 short,
       centred lines kept light so the tile stays readable. min-height reserves
       two lines so single-line (Manual) tiles match scheduled two-line tiles and
       device tiles stay a uniform height across panels. */
    .tile-summary {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 0;
      margin: 1px 0 2px; width: 100%; min-height: 26px;
    }
    .tile-summary span {
      display: block; max-width: 100%;
      font-size: 10px; line-height: 1.3; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tile-summary span:first-child { font-weight: 500; }
    .unit { font-size: 11px; color: var(--secondary-text-color); margin-left: 2px; }
    .tile-target { font-size: 10px; color: var(--secondary-text-color); margin-top: 3px; }
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

    /* Environment / Planting Plan segmented toggle (v3.19.149). */
    .env-seg-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;
    }
    .env-seg {
      background: var(--secondary-background-color); color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 10px;
      padding: 9px 0; font-size: 14px; font-weight: 500; cursor: pointer;
    }
    .env-seg.active { font-weight: 600; }
    .plan-banner {
      display: flex; align-items: center; gap: 12px;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 12px 14px; margin-bottom: 12px;
    }
    .plan-banner ha-icon { --mdc-icon-size: 26px; }
    .plan-banner-title { font-size: 14px; font-weight: 500; }
    .plan-banner-sub { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
    .plan-pct { font-size: 22px; font-weight: 600; }
    .plan-bar {
      height: 6px; border-radius: 4px; overflow: hidden; margin-bottom: 12px;
      background: var(--card-background-color, rgba(0, 0, 0, 0.25));
    }
    .plan-bar-fill { height: 100%; border-radius: 4px; }
    .plan-stage.current { border: 1px solid; }
    .plan-stage-badge {
      margin-left: auto; font-size: 11px; font-weight: 500;
      border: 1px solid; border-radius: 6px; padding: 1px 7px;
    }
    .plan-actions { margin-top: 12px; }
    .plan-btn {
      width: 100%; padding: 11px 0; font-size: 14px; font-weight: 500;
      border-radius: 10px; cursor: pointer;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color); color: var(--primary-text-color);
    }
    .plan-btn.stop { color: var(--error-color, #e24b4a); border-color: var(--error-color, #e24b4a); }
    .plan-editbtn {
      display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto;
      background: transparent; border: 1px solid var(--divider-color, #444);
      color: var(--secondary-text-color); border-radius: 8px; padding: 5px 10px;
      font-size: 12px; cursor: pointer;
    }
    .plan-editbtn ha-icon { --mdc-icon-size: 15px; }
    .pe-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .pe-name {
      flex: 1; font-size: 14px; font-weight: 500; padding: 6px 8px;
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 6px;
      color: var(--primary-text-color);
    }
    .pe-del { --mdc-icon-size: 20px; color: var(--error-color, #e24b4a); cursor: pointer; flex: 0 0 auto; }
    .pe-delrow { gap: 8px; }
    .pe-delq { flex: 1; min-width: 0; font-size: 13px; font-weight: 500; }
    .pe-delrow button { flex: 0 0 auto; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; border: 1px solid var(--divider-color, #444); background: transparent; }
    .pe-del-yes { color: #fff; background: var(--error-color, #e24b4a) !important; border-color: var(--error-color, #e24b4a) !important; }
    .pe-del-no { color: var(--secondary-text-color); }
    .pe-dates { display: flex; gap: 6px; margin-bottom: 8px; }
    .pe-dates label { flex: 1; min-width: 0; font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; }
    .pe-dates .pe-in { width: 100%; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; }
    /* Alarm reminder on its own centred row beneath Start/End. */
    .pe-alarmrow { display: flex; justify-content: center; margin-bottom: 8px; }
    .pe-alarmrow label { font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .pe-alarmrow .pe-in { width: auto; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; }
    .pe-timesrow { display: flex; justify-content: center; align-items: flex-end; gap: 8px; margin-bottom: 4px; }
    .pe-timesrow label { font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; }
    .pe-timesrow input { width: 100px; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; color: var(--primary-text-color); background: var(--card-background-color, rgba(0,0,0,0.2)); border: 1px solid var(--divider-color, #444); border-radius: 6px; }
    /* Light Duration on its own centred row beneath On/Off. */
    .pe-durrow { text-align: center; font-size: 12px; color: var(--secondary-text-color); margin: 0 0 6px; }
    .pe-cellrow { display: flex; gap: 6px; margin-bottom: 6px; }
    .pe-cell { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: var(--secondary-text-color); }
    .pe-cell .pe-sel { width: 100%; box-sizing: border-box; padding: 6px 4px; }
    .pe-in {
      padding: 6px 8px; font-size: 13px; color: var(--primary-text-color);
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 6px; width: 100%;
    }
    .pe-grid-head, .pe-row { display: grid; grid-template-columns: 84px 1fr; align-items: center; gap: 8px; }
    .pe-grid-head { margin: 4px 0; font-size: 11px; color: var(--secondary-text-color); text-align: center; }
    .pe-row { margin-bottom: 6px; }
    .pe-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .pe-cells { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .pe-cells1 { display: grid; grid-template-columns: 1fr; gap: 6px; }
    .pe-cells2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .pe-light { border-top: 1px solid var(--divider-color, #444); margin-top: 10px; padding-top: 8px; }
    .pe-light-head { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 500; margin-bottom: 8px; }
    .pe-modes { display: inline-flex; gap: 6px; }
    .pe-modebtn {
      background: transparent; border: 1px solid var(--divider-color, #444);
      color: var(--secondary-text-color); border-radius: 6px; padding: 3px 8px;
      font-size: 12px; cursor: pointer;
    }
    .pe-modebtn.on { font-weight: 600; }
    .plan-stage-edit { --mdc-icon-size: 18px; color: var(--secondary-text-color); cursor: pointer; margin-left: auto; flex: 0 0 auto; }
    .pe-back { --mdc-icon-size: 22px; color: var(--secondary-text-color); cursor: pointer; flex: 0 0 auto; }
    .pe-info { font-size: 12px; color: var(--secondary-text-color); margin: 2px 0 6px; }
    .pe-sel {
      width: 100%; padding: 6px 8px; font-size: 13px; border-radius: 6px;
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); color: var(--primary-text-color);
    }
    .plan-stage {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .plan-stage-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .plan-stage-dot { width: 10px; height: 10px; border-radius: 50%; }
    .plan-stage-name { font-size: 14px; font-weight: 500; }
    .plan-stage-dates { font-size: 12px; color: var(--secondary-text-color); margin: 0 0 8px 18px; }
    .plan-stage-grid { display: flex; flex-direction: column; gap: 6px; }
    .plan-metric { display: flex; align-items: center; justify-content: space-between; }
    .plan-metric-label { font-size: 13px; color: var(--secondary-text-color); }
    .plan-metric-vals { display: flex; gap: 8px; }
    .plan-metric-vals > span {
      font-size: 13px; font-weight: 500;
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
      padding: 4px 10px; min-width: 52px; text-align: center;
    }
    .plan-note {
      display: flex; gap: 8px; align-items: flex-start;
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0, 0, 0, 0.15));
      border-radius: 10px; padding: 10px 12px; margin-top: 10px; line-height: 1.45;
    }
    .plan-note ha-icon { --mdc-icon-size: 18px; flex: 0 0 auto; margin-top: 1px; }
    .plan-empty {
      text-align: center; padding: 28px 16px; color: var(--secondary-text-color);
    }
    .plan-empty ha-icon { --mdc-icon-size: 40px; opacity: 0.6; }
    .plan-empty-title { font-size: 15px; font-weight: 500; margin: 8px 0 4px; color: var(--primary-text-color); }
    .plan-empty-sub { font-size: 13px; line-height: 1.45; max-width: 320px; margin: 0 auto; }
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
    .leaf-tgt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
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
    .cd-pill { margin-top: 4px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .cd-txt { font-size: 11px; font-weight: 500; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
    .cd-bar { width: 72%; height: 3px; border-radius: 999px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
    .cd-fill { height: 100%; border-radius: 999px; transition: width .5s linear; }
    .set-sec { font-size: 14px; font-weight: 500; margin: 18px 2px 2px; padding-top: 12px; border-top: 1px solid var(--divider-color, #333); }
    /* Collapsible section bar — a distinct tappable row, not a bare label. */
    .set-collapse-h {
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; user-select: none;
      margin: 14px 0 8px; padding: 10px 12px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color, #333); border-radius: 8px;
    }
    .set-collapse-h ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
    .ta-swatches { display: flex; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
    .ta-sw {
      min-width: 34px; height: 28px; padding: 0 8px; border-radius: 7px; cursor: pointer;
      border: 1px solid var(--divider-color, #444); background: transparent;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .ta-sw.on { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .ta-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .ta-preview {
      margin: 12px auto 4px; width: 120px; min-height: 76px; padding: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      box-sizing: border-box;
    }
    .ta-preview span { font-size: 12px; } .ta-preview b { font-size: 20px; font-weight: 500; }
    .param-graph .pg-range {
      font: inherit; font-size: 11px; padding: 2px 6px; border-radius: 6px;
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #333); margin-left: 8px;
    }
    .param-graph .pg-at { color: var(--secondary-text-color); font-weight: 400; }
    .seg-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .seg {
      display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 7px;
      background: var(--secondary-background-color); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 10px;
      padding: 8px 6px; font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .seg ha-icon { --mdc-icon-size: 16px; flex: none; }
    .seg.on { border-width: 2px; }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 10px;
      padding: 10px 12px; font-size: 14px;
    }
    .toggle-row.staged { box-shadow: inset 2px 0 0 var(--sf-accent, #ff9800); }
    .color-row { display: flex; gap: 10px; margin-top: 10px; }
    .color-field {
      flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 6px;
      background: var(--secondary-background-color); border-radius: 8px;
      padding: 5px 9px; font-size: 12px; color: var(--secondary-text-color);
      cursor: pointer;
    }
    /* Round colour "pinwheel": strip the native swatch chrome to a circle. */
    .pinwheel {
      -webkit-appearance: none; appearance: none;
      width: 20px; height: 20px; padding: 0; cursor: pointer;
      background: none; border: none; border-radius: 50%; flex: none;
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
      display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px;
    }
    /* Soil calibration: temp / moisture / ec (+ substrate) share one row. Each
       control is the same width as an Air Calibration column; with only 3 items
       (non-pro probe) they spread evenly across the row instead of clumping. */
    .cali-soil-grid {
      display: flex; gap: 8px; justify-content: space-between;
    }
    .cali-soil-grid > * { flex: 0 1 calc((100% - 24px) / 4); min-width: 0; }
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
      font-size: 13px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding: 6px 4px;
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
    /* Duration editor: h / min / s spinner boxes (Cycle Run/Off Duration). */
    .dur-input { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
    .dur-box { display: flex; align-items: baseline; gap: 2px; }
    .dur-box input[type="number"] {
      width: 2.6em; flex: 0 0 auto; text-align: center;
      padding-left: 4px; padding-right: 4px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      font-size: 14px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding-top: 6px; padding-bottom: 6px;
      appearance: textfield; -moz-appearance: textfield;
    }
    .dur-box input[type="number"]::-webkit-outer-spin-button,
    .dur-box input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    .dur-unit { flex: 0 0 auto; font-size: 11px; color: var(--secondary-text-color); }
    /* Leaf-VPD calibrator (Settings tab). */
    .leaf-cal { margin-top: 10px; }
    .leaf-cal summary {
      cursor: pointer; font-size: 13px; color: var(--secondary-text-color);
      padding: 4px 2px;
    }
    .leaf-spots {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 6px 0;
    }
    .leaf-spots input[type="number"] {
      width: 100%; text-align: center; padding: 6px 2px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
    }
    .leaf-cal-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      font-size: 13px; color: var(--secondary-text-color);
    }
    .leaf-apply {
      border: none; border-radius: 8px; padding: 6px 16px; cursor: pointer;
      background: var(--sf-accent, #ff9800); color: #1a1207; font-weight: 500;
    }
    .leaf-apply[disabled] {
      background: var(--divider-color, #444); color: var(--secondary-text-color);
      cursor: default;
    }
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
    /* Compact toggle sized to sit inline with 12px label text (e.g. the
       Outlets-tab Indicator Light switch). */
    .toggle.sm { width: 26px; height: 14px; border-radius: 8px; }
    .toggle.sm::after { top: 2px; left: 2px; width: 10px; height: 10px; }
    .toggle.sm.on::after { left: 14px; }
  `,t([ut({attribute:!1})],Yt.prototype,"hass",void 0),t([gt()],Yt.prototype,"config",void 0),t([gt()],Yt.prototype,"tab",void 0),t([gt()],Yt.prototype,"envSubView",void 0),t([gt()],Yt.prototype,"planDraft",void 0),t([gt()],Yt.prototype,"planEditStage",void 0),t([gt()],Yt.prototype,"planShowAll",void 0),t([gt()],Yt.prototype,"planTplOpen",void 0),t([gt()],Yt.prototype,"planTplName",void 0),t([gt()],Yt.prototype,"_tplMsg",void 0),t([gt()],Yt.prototype,"planDelArm",void 0),t([gt()],Yt.prototype,"colorMode",void 0),t([gt()],Yt.prototype,"colHi",void 0),t([gt()],Yt.prototype,"colLo",void 0),t([gt()],Yt.prototype,"colorModeIn",void 0),t([gt()],Yt.prototype,"colIn",void 0),t([gt()],Yt.prototype,"colWarn",void 0),t([gt()],Yt.prototype,"colorSource",void 0),t([gt()],Yt.prototype,"showTrend",void 0),t([gt()],Yt.prototype,"showBand",void 0),t([gt()],Yt.prototype,"showTargets",void 0),t([gt()],Yt.prototype,"tileSummary",void 0),t([gt()],Yt.prototype,"hour12",void 0),t([gt()],Yt.prototype,"customOutletNames",void 0),t([gt()],Yt.prototype,"outletNames",void 0),t([gt()],Yt.prototype,"showConn",void 0),t([gt()],Yt.prototype,"connCustom",void 0),t([gt()],Yt.prototype,"connSignal",void 0),t([gt()],Yt.prototype,"showOutletsLog",void 0),t([gt()],Yt.prototype,"showVpd",void 0),t([gt()],Yt.prototype,"showLeafVpd",void 0),t([gt()],Yt.prototype,"_colorOpen",void 0),t([gt()],Yt.prototype,"_tsOpen",void 0),t([gt()],Yt.prototype,"_cdOpen",void 0),t([gt()],Yt.prototype,"_setOverviewOpen",void 0),t([gt()],Yt.prototype,"_setExtrasOpen",void 0),t([gt()],Yt.prototype,"_setConnOpen",void 0),t([gt()],Yt.prototype,"_setVpdOpen",void 0),t([gt()],Yt.prototype,"_setDevOpen",void 0),t([gt()],Yt.prototype,"_setOutletOpen",void 0),t([gt()],Yt.prototype,"_setLayoutOpen",void 0),t([gt()],Yt.prototype,"vpdLeaf",void 0),t([gt()],Yt.prototype,"vpdStage",void 0),t([gt()],Yt.prototype,"vpdView",void 0),t([gt()],Yt.prototype,"vpdHighlight",void 0),t([gt()],Yt.prototype,"vpdPlanSource",void 0),t([gt()],Yt.prototype,"ologRange",void 0),t([gt()],Yt.prototype,"ologOpen",void 0),t([gt()],Yt.prototype,"_ologVer",void 0),t([gt()],Yt.prototype,"_saving",void 0),t([gt()],Yt.prototype,"outletCopyOpen",void 0),t([gt()],Yt.prototype,"outletCopySel",void 0),t([gt()],Yt.prototype,"outletCopyFromOpen",void 0),t([gt()],Yt.prototype,"showOutletQuick",void 0),t([gt()],Yt.prototype,"outletQuickRemember",void 0),t([gt()],Yt.prototype,"outletQuickNames",void 0),t([gt()],Yt.prototype,"showDeviceLog",void 0),t([gt()],Yt.prototype,"showDeviceQuick",void 0),t([gt()],Yt.prototype,"deviceQuickRemember",void 0),t([gt()],Yt.prototype,"dlogOpen",void 0),t([gt()],Yt.prototype,"_devOff",void 0),t([gt()],Yt.prototype,"_cdTick",void 0),t([gt()],Yt.prototype,"customLayout",void 0),t([gt()],Yt.prototype,"cardScale",void 0),t([gt()],Yt.prototype,"tileCols",void 0),t([gt()],Yt.prototype,"tileRadius",void 0),t([gt()],Yt.prototype,"tileBorderW",void 0),t([gt()],Yt.prototype,"tileBorderCol",void 0),t([gt()],Yt.prototype,"tileBg",void 0),t([gt()],Yt.prototype,"taTiles",void 0),t([gt()],Yt.prototype,"taDevices",void 0),t([gt()],Yt.prototype,"taOutlets",void 0),t([gt()],Yt.prototype,"cooldownShow",void 0),t([gt()],Yt.prototype,"cooldownDevice",void 0),t([gt()],Yt.prototype,"cooldownOutlet",void 0),t([gt()],Yt.prototype,"cooldownSecs",void 0),t([gt()],Yt.prototype,"outletsOnOverview",void 0),t([gt()],Yt.prototype,"tempSource",void 0),t([gt()],Yt.prototype,"extTemp",void 0),t([gt()],Yt.prototype,"extHumi",void 0),t([gt()],Yt.prototype,"_smartOpen",void 0),t([gt()],Yt.prototype,"smart",void 0),t([gt()],Yt.prototype,"paramOpen",void 0),t([gt()],Yt.prototype,"_graphVer",void 0),t([gt()],Yt.prototype,"graphRange",void 0),t([gt()],Yt.prototype,"_graphSel",void 0),t([gt()],Yt.prototype,"_graphPin",void 0),t([gt()],Yt.prototype,"hideLight2",void 0),t([gt()],Yt.prototype,"outletColorMode",void 0),t([gt()],Yt.prototype,"ocManual",void 0),t([gt()],Yt.prototype,"ocSched",void 0),t([gt()],Yt.prototype,"ocEnv",void 0),t([gt()],Yt.prototype,"ocDrip",void 0),t([gt()],Yt.prototype,"deviceColorMode",void 0),t([gt()],Yt.prototype,"dcManual",void 0),t([gt()],Yt.prototype,"dcSched",void 0),t([gt()],Yt.prototype,"dcAuto",void 0),t([gt()],Yt.prototype,"colorDraft",void 0),t([gt()],Yt.prototype,"alertsDraft",void 0),t([gt()],Yt.prototype,"soilOpen",void 0),t([gt()],Yt.prototype,"soilAllOpen",void 0),t([gt()],Yt.prototype,"deviceOpen",void 0),t([gt()],Yt.prototype,"outletOpen",void 0),t([gt()],Yt.prototype,"draft",void 0),t([gt()],Yt.prototype,"modePick",void 0),t([gt()],Yt.prototype,"outletDraft",void 0),t([gt()],Yt.prototype,"outletNameDraft",void 0),t([gt()],Yt.prototype,"outletCfgDraft",void 0),t([gt()],Yt.prototype,"_stDt",void 0),t([gt()],Yt.prototype,"leafSpots",void 0),t([gt()],Yt.prototype,"leafCalTarget",void 0),t([gt()],Yt.prototype,"logDate",void 0),t([gt()],Yt.prototype,"logDev",void 0),t([gt()],Yt.prototype,"logType",void 0);class Xt extends ct{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,s={...this._config};e?s.panel=e:delete s.panel,this._emit(s)}_titleChanged(t){const e=t.target.value.trim(),s={...this._config};e?s.title=e:delete s.title,this._emit(s)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const s=e.target.checked,i=new Set(this._config.outlets??[]);s?i.add(t):i.delete(t);const o=[...i].sort(),a={...this._config};o.length?a.outlets=o:delete a.outlets,this._emit(a)}render(){if(!this.hass)return U;const t=this._config,e=t.default_tab,s=St(this.hass),i=Dt(this.hass,t.panel),o=/^(ac|st)\d+/.test(t.panel||"")||i.length>0,a=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.outlets_log),n=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.vpd_graph),r=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.device_log),l=t=>{const e=Mt(this.hass,t);return e?`${t} — ${e}`:t};return Q`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${s.length?U:Q`<option value="">(no devices found yet)</option>`}
            ${t.panel?U:Q`<option value="" selected>— choose a device —</option>`}
            ${s.map(e=>Q`<option value=${e} ?selected=${e===t.panel}>${l(e)}</option>`)}
            ${t.panel&&!s.includes(t.panel)?Q`<option value=${t.panel} selected>${t.panel} (not found)</option>`:U}
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
            ${o?Q`<option value="outlets" ?selected=${"outlets"===e}>Outlets</option>`:U}
            ${o&&a?Q`<option value="outlets_log" ?selected=${"outlets_log"===e}>Outlets Log</option>`:U}
            ${r?Q`<option value="device_log" ?selected=${"device_log"===e}>Device Log</option>`:U}
            ${n?Q`<option value="vpd" ?selected=${"vpd"===e}>VPD</option>`:U}
            <option value="calibration" ?selected=${"calibration"===e||"cali"===e}>Calibration</option>
            <option value="alerts" ?selected=${"alerts"===e}>Alerts</option>
            <option value="log" ?selected=${"log"===e}>Log</option>
          </select>
        </label>

        ${i.length?Q`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${i.map(e=>Q`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${l(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:U}
      </div>`}}Xt.styles=n`
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
  `,t([ut({attribute:!1})],Xt.prototype,"hass",void 0),t([gt()],Xt.prototype,"_config",void 0);const Zt=/^sf_(se\d+)_light$/;function te(t){const e=new Set;for(const s of Object.keys(t.states)){if(!s.startsWith("light."))continue;const t=bt(s).match(Zt);t&&e.add(t[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}class ee extends ct{constructor(){super(...arguments),this.draft=null,this.ctlDraft={}}setConfig(t){this.config=t}getCardSize(){return 7}static getStubConfig(t){const e=t?te(t):[];return{type:"custom:spider-light-card",...e[0]?{light:e[0]}:{}}}accent(){return this.config.accent||mt}seSlot(){return this.config.light||(this.hass?te(this.hass)[0]:"")||"se1"}get(t){return this.hass?.states[t]}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("draft")||t.has("ctlDraft")}cur(t,e){return t in this.ctlDraft?this.ctlDraft[t]:e}stageCtl(t,e){this.ctlDraft={...this.ctlDraft,[t]:e}}isDirty(){return Object.keys(this.ctlDraft).length>0||null!==this.draft}applyAll(t){const e=this.ctlDraft,s=`light.sf_${t}_light`;if("bri"in e){const t=Number(e.bri);t>0?this.hass?.callService("light","turn_on",{entity_id:s,brightness_pct:t}):this.hass?.callService("light","turn_off",{entity_id:s})}"mode"in e&&this.hass?.callService("select","select_option",{entity_id:`select.sf_${t}_mode`,option:e.mode});for(const t of Object.keys(e))t.includes(".")&&(t.startsWith("number.")?this.hass?.callService("number","set_value",{entity_id:t,value:Number(e[t])}):t.startsWith("text.")&&this.hass?.callService("text","set_value",{entity_id:t,value:e[t]}));if("power"in e){const t="on"===e.power;t&&"bri"in e||this.hass?.callService("light",t?"turn_on":"turn_off",{entity_id:s})}this.draft&&this.saveSchedule(t),this.ctlDraft={}}discardAll(){Object.keys(this.ctlDraft).length&&(this.ctlDraft={}),null!==this.draft&&(this.draft=null)}render(){if(!this.hass||!this.config)return U;const t=this.seSlot(),e=this.get(`light.sf_${t}_light`);if(!e)return Q`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light?` for "${this.config.light}"`:""}.
        </div>
      </ha-card>`;const s="on"===e.state,i=s?Math.max(0,Math.min(100,Math.round((e.attributes.brightness??0)/255*100))):0,o=this.get(`select.sf_${t}_mode`),a=this.cur("mode",o?.state??""),n="bri"in this.ctlDraft,r="on"===this.cur("power",s?"on":"off"),l=n?Number(this.ctlDraft.bri):r?i:0,c=n?l>0:r,d=Mt(this.hass,t),h=this.accent(),p=l/100,[u,g]=_t(100,100,78,135+270*p);return Q`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Light"}</span>
          ${d?Q`<span class="device">${d}</span>`:U}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${$t(100,100,78,0,1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${c&&p>0?j`<path d=${$t(100,100,78,0,p)} fill="none"
                  stroke-linecap="round" stroke=${h} stroke-width="15"></path>`:U}
            ${c?j`<circle cx=${u.toFixed(2)} cy=${g.toFixed(2)} r="10"
                  fill="#fff" stroke=${h} stroke-width="3"></circle>`:U}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${c?h:"var(--secondary-text-color)"}>
              ${c?l+"%":"Off"}
            </text>
          </svg>
          <button class="power ${r?"on":""}"
            style=${r?`background:${h}`:""}
            @click=${()=>this.stageCtl("power",r?"off":"on")}
            aria-label="Toggle light"></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(l)}
            style="accent-color:${h}" data-unit="%"
            @input=${xt}
            @change=${t=>this.stageCtl("bri",t.target.value)} />
          <span class="sl-bub"></span>
        </span>

        ${o?Q`<div class="modes">
              ${(o.attributes.options??["Manual","Automatic"]).map(t=>Q`<button
                  class="mode ${a===t?"active":""}"
                  style=${a===t?`color:${h};border-color:${h}`:""}
                  @click=${()=>this.stageCtl("mode",t)}>${t}</button>`)}
            </div>`:U}

        ${"Automatic"===a?this.renderSchedule(t):U}
        ${qt(h,this.isDirty(),()=>this.applyAll(t),()=>this.discardAll(),"apply-bar")}
      </ha-card>`}periodsFor(t){if(this.draft)return this.draft;const e=this.get(`sensor.sf_${t}_schedule`)?.attributes.periods;return Array.isArray(e)?e:[]}edit(t,e){const s=this.draft??this.periodsFor(t),i=JSON.parse(JSON.stringify(s));e(i),this.draft=i}saveSchedule(t){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${t}_light`,periods:this.draft}),this.draft=null)}renderSchedule(t){if(!this.get(`sensor.sf_${t}_schedule`))return this.renderScheduleLegacy(t);const e=this.periodsFor(t),s=this.accent();return Q`
      <div class="section-label">Schedule</div>
      ${e.map((e,i)=>this.renderPeriod(t,e,i,s))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(t,t=>t.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          + Add period
        </button>
      </div>`}renderPeriod(t,e,s,i){return Q`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${s+1}</span>
          <button class="del" aria-label="Delete period"
            @click=${()=>this.edit(t,t=>t.splice(s,1))}>✕</button>
        </div>
        <div class="days">
          ${ft.map((o,a)=>Q`<button
              class="day ${e.days.includes(a)?"on":""}"
              style=${e.days.includes(a)?`background:${i};border-color:${i}`:""}
              @click=${()=>this.edit(t,t=>{const e=t[s].days,i=e.indexOf(a);i>=0?e.splice(i,1):e.push(a),e.sort((t,e)=>t-e)})}>${o}</button>`)}
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
              @input=${xt}
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
              @input=${xt}
              @change=${e=>this.edit(t,t=>{t[s].fade=Number(e.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${e.fade}m</span>
        </div>
      </div>`}renderScheduleLegacy(t){const e=this.get(`text.sf_${t}_schedule_start`),s=this.get(`text.sf_${t}_schedule_stop`),i=this.get(`number.sf_${t}_schedule_brightness`),o=this.get(`number.sf_${t}_sunrise_sunset_fade`);return e||s||i||o?Q`
      <div class="section-label">Schedule</div>
      ${e||s?Q`<div class="sched-times">
            ${this.timeField(`text.sf_${t}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${t}_schedule_stop`,"Stop")}
          </div>`:U}
      ${i?this.numRow(`number.sf_${t}_schedule_brightness`,"Brightness",i):U}
      ${o?this.numRow(`number.sf_${t}_sunrise_sunset_fade`,"Sunrise / sunset fade",o):U}`:U}timeField(t,e){const s=this.get(t);if(!s)return U;const i="unknown"===s.state||"unavailable"===s.state?"":s.state,o=this.cur(t,i);return Q`<div class="tf">
      <span class="tf-lbl">${e}</span>
      <input type="time" .value=${o}
        @change=${e=>this.stageCtl(t,e.target.value)} />
    </div>`}numRow(t,e,s){const i=s.attributes.min??0,o=s.attributes.max??100,a=s.attributes.step??1,n=s.attributes.unit_of_measurement??"",r="unknown"===s.state||"unavailable"===s.state?"":s.state,l=this.cur(t,r);return Q`<div class="num-row">
      <span class="nr-lbl">${e}</span>
      <span class="sl-live">
        <input type="range" min=${i} max=${o} step=${a} .value=${String(l)}
          style="accent-color:${this.accent()}" data-unit=${n}
          @input=${xt}
          @change=${e=>this.stageCtl(t,e.target.value)} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${l}${n}</span>
    </div>`}}ee.styles=n`
    ${yt}
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
    .save-bar {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 10px 0 2px; border-top: 0.5px solid var(--divider-color, #333);
    }
    .apply-bar { margin-top: 14px; }
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
  `,t([ut({attribute:!1})],ee.prototype,"hass",void 0),t([gt()],ee.prototype,"config",void 0),t([gt()],ee.prototype,"draft",void 0),t([gt()],ee.prototype,"ctlDraft",void 0);const se={SE4500:{name:"SE4500",watts:320,isBar:!0,barCount:3,lW:1.163,lL:.369,ppfd:{8:{c:1800,a:1350,e:900},10:{c:1500,a:1150,e:780},12:{c:1250,a:960,e:650},14:{c:1060,a:820,e:545},16:{c:910,a:700,e:465},18:{c:790,a:610,e:400},20:{c:690,a:530,e:350},22:{c:610,a:470,e:305},24:{c:545,a:420,e:270},26:{c:490,a:375,e:240},28:{c:440,a:340,e:215},30:{c:400,a:305,e:195},32:{c:360,a:275,e:175},36:{c:300,a:230,e:145},42:{c:240,a:184,e:115},48:{c:195,a:149,e:93},60:{c:150,a:115,e:72},72:{c:118,a:90,e:56},84:{c:95,a:72,e:45}}},SF2000:{name:"SF2000",watts:200,isBar:!1,barCount:0,lW:.864,lL:.432,ppfd:{8:{c:1600,a:1050,e:480},10:{c:1320,a:870,e:400},12:{c:1100,a:720,e:330},14:{c:920,a:600,e:275},16:{c:780,a:505,e:230},18:{c:660,a:430,e:193},20:{c:570,a:370,e:165},22:{c:495,a:320,e:143},24:{c:435,a:280,e:125},26:{c:385,a:248,e:110},28:{c:340,a:218,e:97},30:{c:305,a:196,e:87},32:{c:274,a:176,e:78},36:{c:226,a:145,e:64},42:{c:182,a:116,e:51},48:{c:148,a:95,e:42},60:{c:97,a:62,e:27},72:{c:68,a:43,e:19},84:{c:49,a:31,e:14}}},SE5000:{name:"SE5000",watts:480,isBar:!0,barCount:4,lW:.855,lL:.85,ppfd:{8:{c:1561,a:1101,e:597},10:{c:1478,a:1041,e:631},12:{c:1402,a:986,e:661},14:{c:1332,a:935,e:686},16:{c:1267,a:889,e:708},18:{c:1206,a:845,e:727},20:{c:1150,a:805,e:744},22:{c:1098,a:767,e:752},24:{c:1049,a:732,e:718},26:{c:1003,a:700,e:686},28:{c:960,a:669,e:656},30:{c:920,a:640,e:628},32:{c:883,a:614,e:601},36:{c:814,a:565,e:554},42:{c:725,a:502,e:492},48:{c:650,a:449,e:440},60:{c:531,a:366,e:358},72:{c:442,a:303,e:297},84:{c:373,a:256,e:251}}},SF7000:{name:"SF7000",watts:650,isBar:!1,barCount:0,lW:.737,lL:.558,ppfd:{8:{c:2560,a:1105,e:314},10:{c:2298,a:1052,e:359},12:{c:2053,a:983,e:394},14:{c:1881,a:955,e:434},16:{c:1714,a:912,e:465},18:{c:1597,a:903,e:506},20:{c:1441,a:833,e:520},22:{c:1328,a:798,e:543},24:{c:1218,a:752,e:556},26:{c:1138,a:734,e:582},28:{c:1059,a:704,e:598},30:{c:987,a:677,e:613},32:{c:922,a:651,e:626},36:{c:811,a:603,e:591},42:{c:678,a:541,e:530},48:{c:575,a:488,e:478},60:{c:429,a:403,e:395},72:{c:332,a:332,e:325},84:{c:265,a:265,e:259}}},G1000W:{name:"G1000W",watts:1e3,isBar:!0,barCount:8,lW:1.153,lL:1.122,ppfd:{8:{c:2156,a:1822,e:1555},10:{c:2068,a:1769,e:1527},12:{c:1985,a:1720,e:1501},14:{c:1908,a:1672,e:1476},16:{c:1834,a:1626,e:1451},18:{c:1765,a:1582,e:1427},20:{c:1700,a:1540,e:1404},22:{c:1638,a:1499,e:1382},24:{c:1580,a:1460,e:1360},26:{c:1524,a:1422,e:1339},28:{c:1472,a:1386,e:1319},30:{c:1422,a:1352,e:1299},32:{c:1375,a:1318,e:1280},36:{c:1287,a:1255,e:1230},42:{c:1170,a:1168,e:1145},48:{c:1068,a:1068,e:1047},60:{c:901,a:901,e:883},72:{c:770,a:770,e:755},84:{c:666,a:666,e:653}}}};function ie(t,e,s){const i=t.ppfd,o=Object.keys(i).map(Number).sort((t,e)=>t-e);let a=o[0],n=o[o.length-1];for(let t=0;t<o.length-1;t++)if(e>=o[t]&&e<=o[t+1]){a=o[t],n=o[t+1];break}e<=o[0]&&(a=n=o[0]),e>=o[o.length-1]&&(a=n=o[o.length-1]);const r=a===n?0:(e-a)/(n-a),l=(t,e)=>Math.round((t+(e-t)*r)*s/100);return{center:l(i[a].c,i[n].c),avg:l(i[a].a,i[n].a),edge:l(i[a].e,i[n].e)}}function oe(t,e){const s=Math.max(0,Math.min(1,t/e));let i,o,a;if(s<.2){const t=s/.2;i=0,o=Math.round(80*t),a=Math.round(160+95*t)}else if(s<.4){const t=(s-.2)/.2;i=0,o=Math.round(80+175*t),a=Math.round(255-255*t)}else if(s<.6){const t=(s-.4)/.2;i=Math.round(220*t),o=255,a=0}else if(s<.8){const t=(s-.6)/.2;i=Math.round(220+35*t),o=Math.round(255-120*t),a=0}else{const t=(s-.8)/.2;i=255,o=Math.round(135-135*t),a=0}return[i,o,a]}class ae extends ct{constructor(){super(...arguments),this.tab="view",this.rev=0,this.s={tW:.61,tL:1.22,tH:1.981,model:"SE4500",hin:18,plantIn:12,numPlants:2,dim:100,photo:18,metric:!1},this.manualDim=100,this.auto=!1,this.brightSrc="",this.T=null,this.scene=null,this.camera=null,this.renderer=null,this.raf=0,this.o={},this.cam={theta:.52,phi:.36,r:3.8,drag:!1,px:0,py:0},this.dirty=!0,this.needRender=!0,this.fitDone=!1,this.serverSynced=!1,this.localApplied=!1,this.saveT=null,this.saved=null}setConfig(t){this.config=t;const e=t.defaults||{},s=t.tent||{};this.s.model=t.light_model&&se[t.light_model]?t.light_model:"SE4500",this.s.hin=e.height_inches??18,this.s.plantIn=e.plant_height_inches??12,this.s.numPlants=e.num_plants??2,this.s.dim=e.dimmer_percent??100,this.manualDim=this.s.dim,this.s.photo=e.photoperiod_hours??18,this.s.tW=Math.max(.3,.3048*(s.width_ft??2)),this.s.tL=Math.max(.6,.3048*(s.length_ft??4)),this.s.tH=Math.max(.9,.3048*(s.height_ft??6.5)),this.s.metric=this.resolveMetric(),this.serverSynced=!1,this.localApplied=!1,this.dirty=!0,this.fitDone=!1,this.saved=this.blob()}getCardSize(){return 11}static getStubConfig(t){let e;if(t){const s=Object.keys(t.states).filter(t=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(t)).sort(),i=s[0]&&/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(s[0]);i&&(e=i[1])}return{type:"custom:ppfd-3d-card",title:"PPFD Visualizer",light_model:"SE4500",unit_system:"auto",...e?{panel:e}:{},defaults:{height_inches:18,plant_height_inches:12,num_plants:2,dimmer_percent:100,photoperiod_hours:18},tent:{width_ft:2,length_ft:4,height_ft:6.5}}}resolveMetric(){const t=(this.config?.unit_system||"auto").toLowerCase();if("metric"===t)return!0;if("imperial"===t)return!1;const e=this.hass?.config?.unit_system;return!(!e||!e.length)&&"mi"!==e.length}fmtSmall(t){return this.s.metric?`${Math.round(2.54*t)} cm`:`${Math.round(t)}"`}fmtTentDim(t){return this.s.metric?(.3048*t).toFixed(2):(+t).toFixed(1)}tentUnit(){return this.s.metric?"m":"ft"}optKey(){const t=this.config||{};return"ppfd:"+(t.card_id||t.light_model||"main")}panelSlot(){if(this.config?.panel)return this.config.panel;if(this.hass){const t=Object.keys(this.hass.states).filter(t=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(t)).sort();if(t.length){const e=/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(t[0]);if(e)return e[1]}}return null}alarmEntity(){const t=this.panelSlot();if(!t||!this.hass)return null;const e=`sensor.sf_${t}_alarm_settings`;return this.hass.states[e]?e:null}lsKey(){return`ppfd3d:${this.panelSlot()||"nopanel"}:${this.optKey()}`}blob(){return{model:this.s.model,hin:this.s.hin,plantIn:this.s.plantIn,numPlants:this.s.numPlants,photo:this.s.photo,dim:this.manualDim,tW:this.s.tW,tL:this.s.tL,tH:this.s.tH,auto:!!this.auto,src:this.brightSrc||""}}applyBlob(t){t&&(t.model&&se[t.model]&&(this.s.model=t.model),null!=t.hin&&(this.s.hin=t.hin),null!=t.plantIn&&(this.s.plantIn=t.plantIn),null!=t.numPlants&&(this.s.numPlants=t.numPlants),null!=t.photo&&(this.s.photo=t.photo),null!=t.dim&&(this.manualDim=t.dim,this.s.dim=t.dim),null!=t.tW&&(this.s.tW=t.tW),null!=t.tL&&(this.s.tL=t.tL),null!=t.tH&&(this.s.tH=t.tH),this.auto=!!t.auto,this.brightSrc=t.src||"")}hydrateLocal(){if(!this.localApplied){this.localApplied=!0;try{const t=localStorage.getItem(this.lsKey());t&&(this.applyBlob(JSON.parse(t)),this.dirty=!0)}catch{}this.saved=this.blob()}}adoptServer(){if(this.serverSynced)return;const t=this.alarmEntity();if(!t)return;this.serverSynced=!0;const e=this.hass.states[t].attributes.card_options,s=this.optKey();if(e&&void 0!==e[s])try{this.applyBlob(JSON.parse(e[s])),this.dirty=!0}catch{}this.saved=this.blob()}queueSaveView(){clearTimeout(this.saveT),this.saveT=setTimeout(()=>this.saveView(),700)}saveView(){const t=this.blob();if(this.saved)for(const e of ae.SET_FIELDS)t[e]=this.saved[e];this.persistBlob(t),this.saved=t}applySettings(){const t=this.blob();this.persistBlob(t),this.saved=t,this.repaint()}discardSettings(){this.saved&&(this.auto=!!this.saved.auto,this.brightSrc=this.saved.src||"",this.s.numPlants=this.saved.numPlants,this.s.photo=this.saved.photo??this.s.photo,this.s.tW=this.saved.tW,this.s.tL=this.saved.tL,this.s.tH=this.saved.tH,this.auto?this.readLive():this.s.dim=this.manualDim,this.dirty=!0,this.repaint())}settingsDirty(){const t=this.saved;return!!t&&(!!this.auto!=!!t.auto||(this.brightSrc||"")!==(t.src||"")||this.s.numPlants!==t.numPlants||this.s.photo!==(t.photo??this.s.photo)||this.s.tW!==t.tW||this.s.tL!==t.tL||this.s.tH!==t.tH)}persistBlob(t){const e=JSON.stringify(t),s=this.alarmEntity();s&&this.hass?.callService&&this.hass.callService("sf","set_card_option",{entity_id:s,key:this.optKey(),value:e});try{localStorage.setItem(this.lsKey(),e)}catch{try{const t=this.lsKey();for(const e of Object.keys(localStorage))e.startsWith("ppfd3d:")&&e!==t&&localStorage.removeItem(e);localStorage.setItem(t,e)}catch{}}}brightnessOf(t){if(!t)return 0;if(String(t.entity_id).startsWith("light.")){if("on"!==t.state)return 0;const e=t.attributes&&t.attributes.brightness;return null!=e?Math.round(e/255*100):100}const e=parseFloat(t.state);return isNaN(e)?0:Math.max(0,Math.min(100,Math.round(e)))}readLive(){if(!this.hass)return!1;let t=!1;const e=this.config?.entities||{};if(e.dimmer_percent){const s=this.hass.states[e.dimmer_percent];if(s){const e=parseFloat(s.state);if(!isNaN(e)){const s=Math.max(10,Math.min(100,e));s===this.s.dim||this.auto||(this.s.dim=s,this.manualDim=s,t=!0)}}}if(e.height_inches){const s=this.hass.states[e.height_inches];if(s){const e=parseFloat(s.state);if(!isNaN(e)){const s=Math.max(8,e);s!==this.s.hin&&(this.s.hin=s,t=!0)}}}if(this.auto&&this.brightSrc){const e=this.brightnessOf(this.hass.states[this.brightSrc]);e!==this.s.dim&&(this.s.dim=e,t=!0)}return t}willUpdate(t){if(t.has("config")&&this.hydrateLocal(),t.has("hass")&&this.hass){const t=this.resolveMetric();t!==this.s.metric&&(this.s.metric=t,this.dirty=!0),this.hydrateLocal(),this.adoptServer(),this.readLive()&&(this.dirty=!0)}}firstUpdated(){this.loadThree()}updated(){this.dirty&&(this.needRender=!0)}repaint(){this.rev++}tentInches(){return Math.round(this.s.tH/.0254)}onModel(t){this.s.model=t.target.value,this.dirty=!0,this.repaint(),this.queueSaveView()}onSlider(t,e){const s=Number(e.target.value),i=this.tentInches();"hin"===t?this.s.hin=Math.min(s,i):"plantIn"===t?this.s.plantIn=Math.min(s,i):"numPlants"===t?this.s.numPlants=isNaN(s)?1:Math.max(1,Math.min(12,Math.round(s))):"photo"===t?this.s.photo=isNaN(s)?18:Math.max(1,Math.min(24,Math.round(s))):"dim"===t&&(this.auto||(this.s.dim=s,this.manualDim=s)),this.dirty=!0,this.repaint(),"numPlants"!==t&&"photo"!==t&&this.queueSaveView()}photoFollowsLight(){return!!this.auto&&(this.brightSrc||"").startsWith("light.")}lightPhotoperiod(){if(!this.hass)return null;const t=/^light\.sf_(.+)_(light_\d+)$/.exec(this.brightSrc||"");if(!t)return null;const e=t[1],s=t[2],i=t=>{const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""};let o=i(`text.sf_${e}_${s}_ppfd_start`),a=i(`text.sf_${e}_${s}_ppfd_stop`);o&&a&&("00:00"!==o||"00:00"!==a)||(o=i(`text.sf_${e}_${s}_schedule_start`),a=i(`text.sf_${e}_${s}_schedule_stop`));const n=/^(\d{1,2}):(\d{2})/.exec(o),r=/^(\d{1,2}):(\d{2})/.exec(a);if(!n||!r)return null;const l=(60*+r[1]+ +r[2]-(60*+n[1]+ +n[2])+1440)%1440;return Math.round(l/60)}effectivePhoto(){if(this.photoFollowsLight()){const t=this.lightPhotoperiod();if(null!=t)return t}return this.s.photo}onTent(t,e){const s=Number(e.target.value),i=this.s.metric?1:.3048,o=isNaN(s)?this.s[t]:s*i;"tW"===t?this.s.tW=Math.max(.3,o):"tL"===t?this.s.tL=Math.max(.6,o):this.s.tH=Math.max(.9,o);const a=this.tentInches();this.s.hin>a&&(this.s.hin=a),this.s.plantIn>a&&(this.s.plantIn=a),this.dirty=!0,this.repaint()}onAuto(t){if(this.auto=t.target.checked,this.auto){if(!this.brightSrc){const t=this.brightOptions();t.length&&(this.brightSrc=t[0].id)}this.readLive()}else this.s.dim=this.manualDim;this.dirty=!0,this.repaint()}onBrightSrc(t){this.brightSrc=t.target.value,this.auto&&this.readLive(),this.dirty=!0,this.repaint()}brightOptions(){if(!this.hass)return[];return Object.keys(this.hass.states).filter(t=>!!t.startsWith("light.sf_")||!(!t.startsWith("number.sf_")||!/schedule_brightness/i.test(t))).sort().map(t=>({id:t,name:this.hass.states[t].attributes.friendly_name||t}))}loadThree(){if(window.THREE)return void this.initThree();const t=window;if(!t._ppfdCBs){t._ppfdCBs=[];const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",e.onload=()=>t._ppfdCBs.forEach(t=>t()),document.head.appendChild(e)}t._ppfdCBs.push(()=>this.initThree())}canvas(){return this.renderRoot.querySelector("#c")}initThree(){const t=this.T=window.THREE,e=this.canvas();if(!t||!e)return;const s=e.parentElement?.offsetWidth||400;e.style.height="340px";const i=this.scene=new t.Scene;i.background=new t.Color(592914),this.camera=new t.PerspectiveCamera(36,s/340,.01,40);const o=this.renderer=new t.WebGLRenderer({canvas:e,antialias:!0});o.setSize(s,340),o.setPixelRatio(Math.min(devicePixelRatio,2)),i.add(new t.AmbientLight(3359829,1.1));const a=new t.DirectionalLight(16777215,.55);a.position.set(2,5,3),i.add(a),this.attachCam(e),this.dirty=!0,this.needRender=!0;const n=()=>{this.raf=requestAnimationFrame(n),this.dirty&&(this.dirty=!1,this.rebuild(),this.needRender=!0),this.needRender&&(this.needRender=!1,this.updCam(),o.render(i,this.camera))};n()}attachCam(t){t.addEventListener("mousedown",t=>{this.cam.drag=!0,this.cam.px=t.clientX,this.cam.py=t.clientY}),window.addEventListener("mouseup",()=>{this.cam.drag=!1}),window.addEventListener("mousemove",t=>{this.cam.drag&&(this.cam.theta-=.007*(t.clientX-this.cam.px),this.cam.phi=Math.max(.05,Math.min(1.3,this.cam.phi-.005*(t.clientY-this.cam.py))),this.cam.px=t.clientX,this.cam.py=t.clientY,this.needRender=!0)}),t.addEventListener("wheel",t=>{this.cam.r=Math.max(1.2,Math.min(10,this.cam.r+.005*t.deltaY)),this.needRender=!0},{passive:!0});let e=null;t.addEventListener("touchstart",t=>{1===t.touches.length&&(e={x:t.touches[0].clientX,y:t.touches[0].clientY,t:this.cam.theta,p:this.cam.phi})}),t.addEventListener("touchmove",t=>{e&&1===t.touches.length&&(this.cam.theta=e.t-.007*(t.touches[0].clientX-e.x),this.cam.phi=Math.max(.05,Math.min(1.3,e.p-.005*(t.touches[0].clientY-e.y))),this.needRender=!0)},{passive:!0})}updCam(){if(!this.camera)return;const{theta:t,phi:e,r:s}=this.cam,i=this.s.tH;this.camera.position.set(s*Math.cos(e)*Math.sin(t),s*Math.sin(e)+.38*i,s*Math.cos(e)*Math.cos(t)),this.camera.lookAt(0,.3*i,0)}rem(t){this.o[t]&&this.scene&&this.scene.remove(this.o[t]),this.o[t]=null}sprite(t,e){const s=this.T,i=document.createElement("canvas");i.width=128,i.height=64;const o=i.getContext("2d");return o.fillStyle="rgba(255,255,255,0.92)",o.font=`bold ${e}px sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(t,64,32),new s.Sprite(new s.SpriteMaterial({map:new s.CanvasTexture(i),transparent:!0,depthTest:!1}))}rebuild(){const t=this.T,e=this.scene;if(!t||!e)return;const{tW:s,tL:i,tH:o,model:a,hin:n,plantIn:r,numPlants:l,dim:c}=this.s,d=se[a]||se.SE4500,h=Math.max(1,n-r),p=ie(d,h,c),u=.0254*r,g=.0254*n,m=s/2,f=i/2,v=s>i;this.rem("fr");const b=new t.Group,_=[[m,0,f],[m,0,-f],[-m,0,-f],[-m,0,f],[m,o,f],[m,o,-f],[-m,o,-f],[-m,o,f]],$=[];[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([t,e])=>$.push(..._[t],..._[e]));const x=new t.BufferGeometry;x.setAttribute("position",new t.Float32BufferAttribute($,3)),b.add(new t.LineSegments(x,new t.LineBasicMaterial({color:3822178})));const y=new t.Mesh(new t.BoxGeometry(s,o,i),new t.MeshStandardMaterial({color:12304282,side:t.BackSide,transparent:!0,opacity:.055,roughness:1}));y.position.set(0,o/2,0),b.add(y),e.add(b),this.o.fr=b,this.rem("ht");const w=new t.Group,S=Math.max(1.05*p.center,700),k=30,O=[],C=[],D=[],M=(v?d.lW:d.lL)/s,T=(v?d.lL:d.lW)/i,N=v?1:.7,L=v?.7:1;for(let t=0;t<=30;t++)for(let e=0;e<=k;e++){const o=e/k*s-m,a=t/30*i-f,n=2*(e/k-.5),r=2*(t/30-.5);let l;if(d.isBar){const t=Math.max(0,Math.abs(n)-.5*M)/(1-.5*M+.01),e=Math.max(0,Math.abs(r)-.5*T)/(1-.5*T+.01);l=p.edge+(p.center-p.edge)*Math.exp(-(t*t*3.8+e*e*9))}else{const t=Math.sqrt(n*n*N+r*r*L);l=p.edge+(p.center-p.edge)*Math.exp(-t*t*2.6)}l=Math.max(0,l),O.push(o,u+.004,a);const[c,h,g]=oe(l,S);C.push(c/255,h/255,g/255)}for(let t=0;t<30;t++)for(let e=0;e<k;e++){const s=31*t+e;D.push(s,s+31,s+1,s+1,s+31,s+31+1)}const P=new t.BufferGeometry;P.setAttribute("position",new t.Float32BufferAttribute(O,3)),P.setAttribute("color",new t.Float32BufferAttribute(C,3)),P.setIndex(D),P.computeVertexNormals(),w.add(new t.Mesh(P,new t.MeshBasicMaterial({vertexColors:!0,side:t.DoubleSide,transparent:!0,opacity:.9}))),[[0,p.center],[.36*s,p.avg],[.36*-s,p.avg]].forEach(([t,e])=>{const s=this.sprite(Math.round(e)+"",22);s.position.set(t,u+.065,0),s.scale.set(.25,.12,1),w.add(s)}),e.add(w),this.o.ht=w,this.rem("li");const R=new t.Group,A=new t.MeshStandardMaterial({color:5926525,metalness:.55,roughness:.45});if(d.isBar){const e=d.barCount;for(let s=0;s<e;s++){const i=1===e?0:-d.lL/2+d.lL/(e-1)*s,o=new t.Mesh(new t.BoxGeometry(.026,.013,d.lW),A);o.position.set(i,g,0),R.add(o);const a=new t.Mesh(new t.BoxGeometry(.017,.004,.9*d.lW),new t.MeshBasicMaterial({color:16775392}));a.position.set(i,g-.006,0),R.add(a)}[-d.lW/2,d.lW/2].forEach(e=>{const s=new t.Mesh(new t.BoxGeometry(d.lL,.01,.016),new t.MeshStandardMaterial({color:4018012,metalness:.4}));s.position.set(0,g,e),R.add(s)})}else{const e=new t.Mesh(new t.BoxGeometry(d.lL,.02,d.lW),new t.MeshStandardMaterial({color:4873579,metalness:.4,roughness:.6}));e.position.set(0,g,0),R.add(e);const s=new t.MeshBasicMaterial({color:16775392});for(let e=0;e<4;e++)for(let i=0;i<8;i++){const o=new t.Mesh(new t.CircleGeometry(.013,8),s);o.rotation.x=-Math.PI/2,o.position.set(-d.lL/2+(i+.5)*(d.lL/8),g-.009,-d.lW/2+(e+.5)*(d.lW/4)),R.add(o)}}const E=Math.min(o-.02,g+.05);if(E>g+.04){const e=new t.LineBasicMaterial({color:8947848,transparent:!0,opacity:.5});[-d.lL/2+.04,d.lL/2-.04].forEach(s=>{const i=(new t.BufferGeometry).setFromPoints([new t.Vector3(s,E,0),new t.Vector3(s,g,0)]);R.add(new t.Line(i,e))})}const F=new t.PointLight(16772778,.8,2.2);if(F.position.set(0,g,0),R.add(F),R.rotation.y=v?Math.PI/2:0,e.add(R),this.o.li=R,this.rem("bm"),g>u+.01){const o=new t.Group,a=Math.min(.28,.07+p.center/6e3),n=new t.LineBasicMaterial({color:16768341,transparent:!0,opacity:a}),r=.38*d.lL,l=.38*d.lW;[[-r,-l],[r,-l],[r,l],[-r,l]].forEach(([e,a])=>{const r=Math.sign(e)*s/2*.88,l=Math.sign(a)*i/2*.88,c=(new t.BufferGeometry).setFromPoints([new t.Vector3(e,g,a),new t.Vector3(r,u+.005,l)]);o.add(new t.Line(c,n))});const c=(new t.BufferGeometry).setFromPoints([new t.Vector3(0,g+.005,0),new t.Vector3(0,u+.005,0)]);o.add(new t.Line(c,new t.LineBasicMaterial({color:16777215,transparent:!0,opacity:.2}))),o.rotation.y=v?Math.PI/2:0,e.add(o),this.o.bm=o}this.rem("pl");const z=new t.Group,B=.0254*r,H=Math.min(.25,.35*B+.08),I=new t.MeshStandardMaterial({color:1710618,roughness:.9}),V=new t.MeshStandardMaterial({color:4025128,roughness:.8}),W=new t.MeshStandardMaterial({color:3046686,roughness:.85,side:t.DoubleSide}),Q=v?s:i,j=Q/(l+1);for(let e=0;e<l;e++){const s=-Q/2+j*(e+1),i=v?s:0,o=v?0:s,a=new t.Mesh(new t.CylinderGeometry(.06375,.075,H,12),I);a.position.set(i,H/2,o),z.add(a);const n=Math.max(.01,B-H);if(n>.015){const e=new t.Mesh(new t.CylinderGeometry(.011,.015,n,8),V);e.position.set(i,H+n/2,o),z.add(e);const s=Math.max(1,Math.floor(n/.09));for(let e=0;e<s;e++){const a=H+n*(.35+.55*e/Math.max(1,s-1)),r=Math.min(.11,.055+.16*n);for(let s=0;s<3;s++){const n=s*(2*Math.PI/3)+1.1*e,l=new t.Mesh(new t.SphereGeometry(r,6,4),W);l.scale.set(1,.2,.5),l.position.set(i+Math.cos(n)*r*.6,a,o+Math.sin(n)*r*.6),z.add(l)}}}}if(e.add(z),this.o.pl=z,this.rem("hl"),g>u+.01){const i=new t.Group,o=-s/2-.07,a=new t.LineDashedMaterial({color:16777215,transparent:!0,opacity:.45,dashSize:.04,gapSize:.03}),l=(new t.BufferGeometry).setFromPoints([new t.Vector3(o,g,0),new t.Vector3(o,u,0)]),c=new t.Line(l,a);c.computeLineDistances(),i.add(c);const d=this.sprite(this.fmtSmall(n-r),28);d.position.set(o-.11,(g+u)/2,0),d.scale.set(.24,.12,1),i.add(d);const h=new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:.5}),p=new t.Mesh(new t.ConeGeometry(.013,.035,8),h);p.position.set(o,g-.02,0),i.add(p);const m=new t.Mesh(new t.ConeGeometry(.013,.035,8),h);m.rotation.z=Math.PI,m.position.set(o,u+.02,0),i.add(m),e.add(i),this.o.hl=i}this.fitDone||(this.fitDone=!0,this.cam.r=this.fitDistance()),this.updCam()}fitDistance(){return Math.min(10,Math.max(4.2,2+1.8*Math.max(this.s.tW,this.s.tL,this.s.tH)))}disconnectedCallback(){if(super.disconnectedCallback(),this.raf&&cancelAnimationFrame(this.raf),this.renderer)try{this.renderer.dispose()}catch{}}render(){if(!this.config)return U;const t=this.s,e=se[t.model]||se.SE4500,s=Math.max(1,t.hin-t.plantIn),i=ie(e,s,t.dim),o=this.effectivePhoto(),a=(i.avg*o*3600/1e6).toFixed(1),n=(r=i.avg)<200?{label:"Too dim",color:"#4488dd"}:r<400?{label:"Seedling / early veg",color:"#22bbaa"}:r<600?{label:"Vegetative growth",color:"#44bb44"}:r<800?{label:"Transition / early flower",color:"#bbaa22"}:r<1e3?{label:"Peak flower zone",color:"#ee8800"}:{label:"High intensity — watch heat",color:"#dd2222"};var r;const l=this.tentInches(),c=this.tentUnit(),d=this.config.title||"PPFD visualizer",h=this.brightOptions();return Q`
      <div id="w">
        <div class="top">
          <div class="title">${d}</div>
          <select @change=${this.onModel} style="width:auto">
            <option value="SE4500" ?selected=${"SE4500"===t.model}>SE4500 320W</option>
            <option value="SE5000" ?selected=${"SE5000"===t.model}>SE5000 480W</option>
            <option value="SF2000" ?selected=${"SF2000"===t.model}>SF2000 200W</option>
            <option value="SF7000" ?selected=${"SF7000"===t.model}>SF7000 650W</option>
            <option value="G1000W" ?selected=${"G1000W"===t.model}>G1000W 1000W</option>
          </select>
        </div>
        <div class="tabs">
          <div class="tab ${"view"===this.tab?"on":""}" @click=${()=>{this.tab="view",this.needRender=!0}}>View</div>
          <div class="tab ${"set"===this.tab?"on":""}" @click=${()=>{this.tab="set"}}>Settings</div>
        </div>
        <!-- Canvas stays in the DOM across tabs (only hidden) so the WebGL
             context survives the switch — recreating it left the view black. -->
        <div class="vw" style=${"view"===this.tab?"":"display:none"}><canvas id="c" height="340"></canvas></div>
        ${"view"===this.tab?Q`
          <div class="stats">
            <div class="stat"><div class="sl">Center PPFD</div><div class="sv">${i.center.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Avg canopy</div><div class="sv">${i.avg.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Edge PPFD</div><div class="sv">${i.edge.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">DLI @ ${o}h</div><div class="sv">${a}<span class="su">mol/m²/d</span></div></div>
          </div>
          <div class="leg"><span>Low</span><div class="legbar"></div><span>High PPFD</span></div>
          <div class="zone">
            <span class="zbadge" style="background:${n.color}22;color:${n.color};border:1px solid ${n.color}44">${n.label}</span>
            ${this.fmtSmall(s)} light-to-canopy · ${t.dim}% brightness · ${o}h light
          </div>
          <div class="div"></div>
          <div class="sec">Light &amp; plants</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Light height <span class="cv">${this.fmtSmall(t.hin)}</span></span><input type="range" min="8" max=${l} step="1" .value=${String(t.hin)} @input=${t=>this.onSlider("hin",t)}></div>
              <div class="cg"><span class="cl">Plant height <span class="cv">${this.fmtSmall(t.plantIn)}</span></span><input type="range" min="1" max=${l} step="1" .value=${String(t.plantIn)} @input=${t=>this.onSlider("plantIn",t)}></div>
              <div class="cg"><span class="cl">Brightness <span class="cv">${t.dim}%</span></span><input type="range" min="10" max="100" step="5" .value=${String(t.dim)} ?disabled=${this.auto&&!!this.brightSrc} @input=${t=>this.onSlider("dim",t)}></div>
            </div>
          </div>
        `:Q`
          <div class="sec">Brightness</div>
          <div class="set">
            <label class="setrow"><input type="checkbox" .checked=${this.auto} @change=${this.onAuto}> Auto-read brightness from a light</label>
            <div class="cg"><span class="cl">Light source</span>
              <select .value=${this.brightSrc} @change=${this.onBrightSrc}>
                <option value="" ?selected=${!this.brightSrc}>— none —</option>
                ${h.map(t=>Q`<option value=${t.id} ?selected=${this.brightSrc===t.id}>${t.name}</option>`)}
              </select>
            </div>
            <div class="hint">
              ${this.auto&&this.brightSrc?Q`Reading ${this.hass?.states[this.brightSrc]?.attributes.friendly_name||this.brightSrc}: ${t.dim}%`:"Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target) and the value tracks it live."}
            </div>
          </div>
          <div class="div"></div>
          <div class="sec">Plants &amp; photoperiod</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Number of plants</span><input type="number" min="1" max="12" step="1" .value=${String(t.numPlants)} @change=${t=>this.onSlider("numPlants",t)}></div>
              <div class="cg"><span class="cl">Photoperiod (h)</span><input type="number" min="1" max="24" step="1" .value=${String(this.effectivePhoto())} ?disabled=${this.photoFollowsLight()} @change=${t=>this.onSlider("photo",t)}></div>
            </div>
            ${this.photoFollowsLight()?Q`<div class="hint">Auto from the selected light's schedule — ${this.effectivePhoto()}h. Uncheck “Auto-read brightness from a light” to set hours manually.</div>`:U}
          </div>
          <div class="div"></div>
          <div class="sec">Tent dimensions</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Width (${c})</span><input type="number" min=${this.s.metric?"0.3":"1"} max=${this.s.metric?"3.0":"10"} step="0.1" .value=${this.fmtTentDim(t.tW/.3048)} @change=${t=>this.onTent("tW",t)}></div>
              <div class="cg"><span class="cl">Length (${c})</span><input type="number" min=${this.s.metric?"0.3":"1"} max=${this.s.metric?"3.6":"12"} step="0.1" .value=${this.fmtTentDim(t.tL/.3048)} @change=${t=>this.onTent("tL",t)}></div>
              <div class="cg"><span class="cl">Height (${c})</span><input type="number" min=${this.s.metric?"0.9":"3"} max=${this.s.metric?"3.6":"12"} step="0.1" .value=${this.fmtTentDim(t.tH/.3048)} @change=${t=>this.onTent("tH",t)}></div>
            </div>
          </div>
          ${qt("var(--primary-color, #03a9f4)",this.settingsDirty(),()=>this.applySettings(),()=>this.discardSettings(),"ppfd-apply")}
        `}
      </div>
    `}}ae.SET_FIELDS=["auto","src","numPlants","photo","tW","tL","tH"],ae.styles=n`
    :host { display: block; }
    * { box-sizing: border-box; }
    #w {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0,0,0,.1));
      overflow: hidden;
      font-family: var(--primary-font-family, sans-serif);
    }
    .top { padding: 10px 14px 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .title { font-size: 14px; font-weight: 500; color: var(--primary-text-color); }
    select, input[type=number] {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(0,0,0,.15));
      border-radius: 6px; padding: 4px 8px; font-size: 12px; width: 100%;
    }
    input[type=range] { width: 100%; }
    input[type=range]:disabled { opacity: .45; cursor: not-allowed; }
    .vw { background: #090c12; width: 100%; }
    canvas { display: block; width: 100%; cursor: grab; }
    canvas:active { cursor: grabbing; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 8px 12px; }
    .stat { background: var(--secondary-background-color, #f0f0f0); border-radius: 8px; padding: 7px 10px; text-align: center; }
    .sl { font-size: 10px; color: var(--secondary-text-color); margin-bottom: 2px; }
    .sv { font-size: 16px; font-weight: 500; color: var(--primary-text-color); line-height: 1.1; }
    .su { display: block; font-size: 10px; color: var(--secondary-text-color); margin-top: 2px; }
    .leg { display: flex; align-items: center; gap: 6px; padding: 2px 12px 4px; font-size: 11px; color: var(--secondary-text-color); }
    .legbar { flex: 1; height: 7px; border-radius: 4px; background: linear-gradient(to right, #0044ff, #00ccff, #00ff88, #aaff00, #ffcc00, #ff4400); }
    .zone { padding: 2px 12px 6px; font-size: 11px; color: var(--secondary-text-color); }
    .zbadge { display: inline-block; padding: 2px 8px; border-radius: 9px; font-size: 11px; font-weight: 500; margin-right: 6px; }
    .div { height: 1px; background: var(--divider-color, rgba(0,0,0,.1)); }
    .sec { font-size: 10px; font-weight: 500; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .05em; padding: 6px 12px 2px; }
    .ctrls { padding: 6px 12px 8px; display: flex; flex-direction: column; gap: 6px; }
    .r4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .r3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .r2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .cg { display: flex; flex-direction: column; gap: 3px; }
    .cl { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
    .cv { font-size: 12px; font-weight: 500; color: var(--primary-text-color); }
    .tabs { display: flex; gap: 4px; padding: 6px 12px 0; border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.1)); }
    .tab { font-size: 12px; padding: 5px 12px; border-radius: 8px 8px 0 0; cursor: pointer; color: var(--secondary-text-color); }
    .tab.on { color: var(--primary-text-color); background: var(--secondary-background-color, #f0f0f0); font-weight: 500; }
    .set { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
    .setrow { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--primary-text-color); cursor: pointer; }
    .hint { font-size: 11px; color: var(--secondary-text-color); line-height: 1.4; }
    .save-bar { display: flex; justify-content: flex-end; gap: 8px; }
    .save-bar.ppfd-apply { padding: 10px 12px 12px; margin-top: 2px; border-top: 0.5px solid var(--divider-color, rgba(0,0,0,.1)); }
    .save-bar button { font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; border-radius: 8px; padding: 6px 16px; border: none; }
    .save-btn { color: #fff; }
    .save-btn[disabled] { background: var(--divider-color, #444) !important; color: var(--secondary-text-color); cursor: default; }
    .discard-btn { background: transparent; color: var(--secondary-text-color); border: 1px solid var(--divider-color, #444) !important; }
    .discard-btn[disabled] { opacity: .5; cursor: default; }
  `,t([ut({attribute:!1})],ae.prototype,"hass",void 0),t([gt()],ae.prototype,"config",void 0),t([gt()],ae.prototype,"tab",void 0),t([gt()],ae.prototype,"rev",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",Yt),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Xt),customElements.get("spider-light-card")||customElements.define("spider-light-card",ee),customElements.get("ppfd-3d-card")||customElements.define("ppfd-3d-card",ae);const ne=window.customCards=window.customCards||[],re=t=>{ne.some(e=>e&&e.type===t.type)||ne.push(t)};re({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),re({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),re({type:"ppfd-3d-card",name:"PPFD 3D Grow Light Card",description:"3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.21.44 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const t=["spider-farmer-card","spider-light-card","ppfd-3d-card"],e=new Set([...t,...t.map(t=>`custom:${t}`)]),s=()=>{const t=[["spider-farmer-card",Yt],["spider-farmer-card-editor",Xt],["spider-light-card",ee],["ppfd-3d-card",ae]];for(const[e,s]of t)if(!customElements.get(e))try{customElements.define(e,s)}catch{}},i=()=>{let t=0;for(const s of(()=>{const t=[],e=new Set,s=i=>{if(!i||e.has(i))return;e.add(i);let o=[];try{o=i.querySelectorAll("hui-error-card")}catch{return}o.forEach(e=>t.push(e));let a=[];try{a=i.querySelectorAll("*")}catch{return}a.forEach(t=>{const e=t.shadowRoot;e&&s(e)})};return s(document),t})()){const i=s._config||{},o=i.origConfig&&i.origConfig.type||i.type||"";e.has(o)&&(s.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),t++)}return t};let o=0;const a=()=>{s(),i(),++o<12&&setTimeout(a,250)},n=()=>{s(),a()};"complete"===document.readyState?n():window.addEventListener("load",n,{once:!0})})();export{Yt as SpiderFarmerCard,Xt as SpiderFarmerCardEditor,ee as SpiderLightCard,ae as SpiderPpfdCard};
