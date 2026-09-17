/*! spider-farmer-card v0.21.61 | MIT */
function t(t,e,i,s){var o,a=arguments.length,n=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(n=(a<3?o(n):a>3?o(e,i,n):o(e,i))||n);return a>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);o?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const a=o.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const a=this.constructor;if(!1===s&&(o=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,v?.({ReactiveElement:y}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,k=w.trustedTypes,O=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,D="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,T=`<${M}>`,L=document,N=()=>L.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,R="[ \t\n\f\r]",A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,z=/>/g,B=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,I=/"/g,V=/^(?:script|style|textarea|title)$/i,Q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=Q(1),j=Q(2),q=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),G=new WeakMap,K=L.createTreeWalker(L,129);function J(t,e){if(!E(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==O?O.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let o,a=2===e?"<svg>":3===e?"<math>":"",n=A;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===A?"!--"===l[1]?n=F:void 0!==l[1]?n=z:void 0!==l[2]?(V.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=B):void 0!==l[3]&&(n=B):n===B?">"===l[0]?(n=o??A,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?B:'"'===l[3]?I:H):n===I||n===H?n=B:n===F||n===z?n=A:(n=B,o=void 0);const h=n===B&&t[e+1].startsWith("/>")?" ":"";a+=n===A?i+T:c>=0?(s.push(r),i.slice(0,c)+D+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[J(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,a=0;const n=t.length-1,r=this.parts,[l,c]=Y(t,e);if(this.el=X.createElement(l,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(D)){const e=c[a++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?ot:"@"===n[1]?at:it}),s.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:o}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),K.nextNode(),r.push({type:2,index:++o});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===M)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)r.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=P(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),a=0,n=0,r=i[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new et(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new nt(o,this,t)),this._$AV.push(e),r=i[++n]}a!==r?.index&&(o=K.nextNode(),a++)}return K.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),P(t)?t===U||null==t||""===t?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new X(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=U}_$AI(t,e=this,i,s){const o=this.strings;let a=!1;if(void 0===o)t=Z(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const s=t;let n,r;for(t=o[0],n=0;n<o.length-1;n++)r=Z(this,s[i+n],e,n),r===q&&(r=this._$AH[n]),a||=!P(r)||r!==this._$AH[n],r===U?t=U:t!==U&&(t+=(r??"")+o[n+1]),this._$AH[n]=r}a&&!s&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class at extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??U)===q)return;const i=this._$AH,s=t===U&&i!==U||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==U&&(i===U||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(X,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(N(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},pt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return ut({...t,state:!0,attribute:!1})}const mt="#ff7a1a",ft=["S","M","T","W","T","F","S"],vt=/^sf_(dp\d+|ac5|ac10|st\d+)_/;function _t(t){return t.split(".")[1]??""}function bt(t,e,i,s){const o=s*Math.PI/180;return[t+i*Math.cos(o),e+i*Math.sin(o)]}function $t(t,e,i,s,o){const a=135+270*s,n=135+270*o,[r,l]=bt(t,e,i,a),[c,d]=bt(t,e,i,n),h=n-a>180?1:0;return`M ${r.toFixed(2)} ${l.toFixed(2)} A ${i} ${i} 0 ${h} 1 ${c.toFixed(2)} ${d.toFixed(2)}`}function xt(t){const e=t.currentTarget,i=e.parentElement?.querySelector(".sl-bub");if(!i)return;const s=Number(e.min||"0"),o=Number(e.max||"100"),a=Number(e.value),n=o>s?(a-s)/(o-s):0,r=function(t){const e=String(t),i=e.indexOf(".");return i>=0?e.length-i-1:0}(Number(e.step||"1")),l=Number.isFinite(a)?a.toFixed(r):e.value;i.textContent="1"===e.dataset.off&&a<=s?"off":`${l}${e.dataset.unit??""}`,i.style.left=`calc(${n} * (100% - 18px) + 9px)`}const yt=n`
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
`;function wt(t){const e=new Set;for(const i of Object.keys(t.states)){const t=_t(i).match(vt);t&&e.add(t[1])}return[...e].sort()}function St(t){return wt(t).filter(e=>/^(ac|st)\d/.test(e)&&!!t.states[`switch.sf_${e}_outlet_1`]||Object.keys(t.states).some(t=>{const i=_t(t);return i===`sf_${e}_temperature`||i===`sf_${e}_soil_avg_temperature`||i===`sf_${e}_light_1`||i===`sf_${e}_fan`||i===`sf_${e}_blower`}))}function kt(t){return wt(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}function Ot(t,e){const i=`sf_${e}_`,s=Object.keys(t.states);return s.find(t=>_t(t)===`sf_${e}_temperature`)??s.find(t=>{const s=_t(t);return s.startsWith(i)&&!s.startsWith(`sf_${e}_env_`)})}function Dt(t,e){const i=Ot(t,e);return i?t.entities?.[i]?.device_id:void 0}function Ct(t,e){if(!e)return[];const i=Dt(t,e);return i?kt(t).filter(s=>{if(s===e)return!1;const o=Dt(t,s),a=o?t.devices?.[o]:void 0;return a?.via_device_id===i}):[]}function Mt(t,e){if(!t||!e)return"";const i=Ot(t,e);if(!i)return"";const s=t.entities?.[i]?.device_id,o=s?t.devices?.[s]:void 0;if(o)return o.name_by_user||o.name||"";const a=(t.states[i].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return a?a[1]:""}const Tt=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","Air VPD","mdi:water-opacity"],["leaf_vpd","Leaf VPD","mdi:leaf"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Lt={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},Nt={temperature:"temp",humidity:"humi",co2:"co2"},Pt="#ff6b6b",Et="rgba(255,107,107,0.16)",Rt=(t,e=.16)=>{const i=/^#?([0-9a-fA-F]{6})$/.exec((t||"").trim());if(!i)return`rgba(255,107,107,${e})`;const s=parseInt(i[1],16);return`rgba(${s>>16&255},${s>>8&255},${255&s},${e})`},At=t=>"string"==typeof t&&/^#[0-9a-fA-F]{6}$/.test(t),Ft=t=>"alarms"===t||"targets"===t||"both"===t,zt=mt,Bt={"Time Slot":["ts_type","ts_start","ts_stop"],Cycle:["cycle_start","cycle_run","cycle_off","cycle_times"],Temperature:["temp_device"],Humidity:["humidity_device"],CO2:["co2_device"],"Drip Irrigation":["drip_soil","drip_avg"],Manual:[]},Ht=[{label:"General device",mode:"Manual",cfg:{dev_type:"0"}},{label:"Timer period",mode:"Time Slot",cfg:{dev_type:"1"}},{label:"Timer loop",mode:"Cycle",cfg:{dev_type:"2"}},{label:"Blower",mode:"Blower (Temperature Priority)",cfg:{dev_type:"3"}},{label:"Humidification",mode:"Humidity",cfg:{dev_type:"4",humidity_device:"Humidifying"}},{label:"Dehumidification",mode:"Humidity",cfg:{dev_type:"5",humidity_device:"Dehumidifying"}},{label:"Heater",mode:"Temperature",cfg:{dev_type:"6",temp_device:"Heating"}},{label:"Cooler",mode:"Temperature",cfg:{dev_type:"7",temp_device:"Cooling"}},{label:"CO2 Injection",mode:"CO2",cfg:{dev_type:"8",co2_device:"Aeration"}},{label:"Exhaust fan",mode:"CO2",cfg:{dev_type:"9",co2_device:"Exhaust"}},{label:"Light Env",mode:"Light Env",cfg:{}}],It={"Temperature Priority":"Blower (Temperature Priority)","Humidity Priority":"Blower (Humidity Priority)"},Vt=new Set(["Blower","Humidification","Dehumidification","Heater","Cooler","CO2 Injection","Exhaust fan"]),Qt=mt,Wt=t=>!!t&&("unavailable"===t.state||"unknown"===t.state),jt=t=>{const e=(t||"").match(/^(\d{1,2}):(\d{2})$/);if(!e)return null;const i=+e[1],s=+e[2];return i<=23&&s<=59?60*i+s:null},qt=(t,e,i,s,o="",a=!1)=>W`<div class="save-bar ${o}">
  ${((t,e,i,s,o=!1)=>W`
  <button class="save-btn" ?disabled=${!e||o}
    style=${e&&!o?`background:${t}`:""}
    @click=${i}>${o?W`<span class="save-spin"></span>Saving…`:"Apply"}</button>
  <button class="discard-btn" ?disabled=${!e||o}
    @click=${s}>Discard</button>`)(t,e,i,s,a)}
</div>`,Ut=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],Gt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],Kt=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],Jt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class Yt extends ct{constructor(){super(...arguments),this.tab="overview",this.envSubView=null,this.planDraft=null,this.planEditStage=null,this.planShowAll=!1,this.planTplOpen=null,this.planTplName="",this._tplMsg="",this._tplMsgT=null,this.planDelArm=!1,this._planPending="",this.colorMode="off",this.colHi=Pt,this.colLo="#45b6ff",this.colorModeIn="off",this.colIn="#4caf7d",this.colWarn="#ffb300",this.colorSource="alarms",this.showTrend=!1,this.showBand=!1,this.showTargets=!0,this.tileSummary=!1,this.hour12=!1,this.customOutletNames=!1,this.outletNames={},this.showConn=!1,this.connCustom=!1,this.connSignal="",this.showOutletsLog=!1,this.showVpd=!1,this.showLeafVpd=!0,this._colorOpen=!1,this._tsOpen=!1,this._cdOpen=!1,this._setOverviewOpen=!1,this._setExtrasOpen=!1,this._setConnOpen=!1,this._setVpdOpen=!1,this._setDevOpen=!1,this._setOutletOpen=!1,this._setLayoutOpen=!1,this.vpdLeaf=!1,this.vpdStage="veg",this.vpdView="grid",this.vpdHighlight=!1,this.vpdPlanSource=!1,this.vpdCustom=[1,1.4],this.ologRange=24,this.ologOpen=null,this._olog={},this._ologLoading={},this._ologVer=0,this._saving=!1,this._savingT=null,this._savingAt=0,this._savingWatch=[],this.outletCopyOpen=!1,this.outletCopySel={},this.outletCopyFromOpen=!1,this.showOutletQuick=!1,this.outletQuickRemember=!1,this.outletQuickNames=!1,this._olqMem={},this.showDeviceLog=!1,this.showDeviceQuick=!1,this.deviceQuickRemember=!1,this.dlogOpen=null,this._dlqMem={},this._devOff={},this._cdTick=0,this._cdOffAt={},this._cdLastState={},this.customLayout=!1,this.cardScale=100,this.tileCols=3,this.tileRadius=12,this.tileBorderW=1,this.tileBorderCol="",this.tileBg="",this.taTiles=!0,this.taDevices=!0,this.taOutlets=!0,this.cooldownShow=!1,this.cooldownDevice=!0,this.cooldownOutlet=!1,this.cooldownSecs=180,this.outletsOnOverview=!1,this.outletQuickOverview=!1,this.hideEnergyTile=!1,this.tempSource="sf",this.extTemp="",this.extHumi="",this._smartOpen=!1,this.smart={},this.paramOpen=null,this._hist={},this._graph={},this._graphLoading={},this._graphVer=0,this.graphRange=6,this._graphSel=null,this._graphPin=null,this.hideLight2=!1,this.outletColorMode="off",this.ocManual=zt,this.ocSched="#45b6ff",this.ocEnv="#4caf7d",this.ocDrip="#3cc8d0",this.deviceColorMode="off",this.dcManual=Qt,this.dcSched="#45b6ff",this.dcAuto="#4caf7d",this._colorSynced=!1,this.colorDraft=null,this.alertsDraft=null,this.soilOpen=null,this.soilAllOpen=!1,this.deviceOpen=null,this.outletOpen=null,this.draft={},this.modePick={},this.dirPick={},this.outletLightDir={},this.outletDraft={},this.outletNameDraft={},this.outletCfgDraft={},this._stDt={},this.leafSpots=[],this.leafCalTarget="day",this.logDate=null,this.logDev="all",this.logType="all",this._myTpl=null}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"outlets_log"===e?"olog":"device_log"===e?"dlog":"vpd"===e?"vpd":"calibration"===e||"cali"===e?"cali":"alerts"===e?"alerts":"log"===e?"log":"overview";const i=t.alarm_colors;let s="tile"===i||"text"===i?i:"off";try{const e=localStorage.getItem(`sf-colors-${t.panel}`);if("off"===e||"tile"===e||"text"===e)s=e;else if(e){const t=JSON.parse(e);"off"!==t.mode&&"tile"!==t.mode&&"text"!==t.mode||(s=t.mode),"off"!==t.modeIn&&"tile"!==t.modeIn&&"text"!==t.modeIn||(this.colorModeIn=t.modeIn),At(t.hi)&&(this.colHi=t.hi),At(t.lo)&&(this.colLo=t.lo),At(t.in)&&(this.colIn=t.in),"boolean"==typeof t.hide2&&(this.hideLight2=t.hide2),"off"!==t.omode&&"tile"!==t.omode&&"text"!==t.omode||(this.outletColorMode=t.omode),At(t.ocManual)&&(this.ocManual=t.ocManual),At(t.ocSched)&&(this.ocSched=t.ocSched),At(t.ocEnv)&&(this.ocEnv=t.ocEnv),At(t.ocDrip)&&(this.ocDrip=t.ocDrip),"off"!==t.dmode&&"tile"!==t.dmode&&"text"!==t.dmode||(this.deviceColorMode=t.dmode),At(t.dcManual)&&(this.dcManual=t.dcManual),At(t.dcSched)&&(this.dcSched=t.dcSched),At(t.dcAuto)&&(this.dcAuto=t.dcAuto),Ft(t.source)&&(this.colorSource=t.source),At(t.warn)&&(this.colWarn=t.warn),"boolean"==typeof t.showTrend&&(this.showTrend=t.showTrend),"boolean"==typeof t.showBand&&(this.showBand=t.showBand),"boolean"==typeof t.showTargets&&(this.showTargets=t.showTargets),"boolean"==typeof t.tileSummary&&(this.tileSummary=t.tileSummary),"boolean"==typeof t.hour12&&(this.hour12=t.hour12),"boolean"==typeof t.showConn&&(this.showConn=t.showConn),"boolean"==typeof t.connCustom&&(this.connCustom=t.connCustom),"string"==typeof t.connSignal&&(this.connSignal=t.connSignal),"boolean"==typeof t.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog),"boolean"==typeof t.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick),"boolean"==typeof t.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember),"boolean"==typeof t.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames),"boolean"==typeof t.showVpd&&(this.showVpd=t.showVpd),"boolean"==typeof t.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd),"boolean"==typeof t.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf),"boolean"==typeof t.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog),"boolean"==typeof t.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick),"boolean"==typeof t.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember),"boolean"==typeof t.customNames&&(this.customOutletNames=t.customNames),t.outletNames&&"object"==typeof t.outletNames&&(this.outletNames=t.outletNames),"boolean"==typeof t.customLayout&&(this.customLayout=t.customLayout),"number"==typeof t.scale&&t.scale>=70&&t.scale<=150&&(this.cardScale=t.scale),"number"==typeof t.cols&&t.cols>=2&&t.cols<=5&&(this.tileCols=t.cols)}}catch{}this.colorMode=s,this._colorSynced=!1}serverColors(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;if(!t)return{};const e=t=>"off"===t||"tile"===t||"text"===t,i={};if(t.colors&&e(t.colors)&&(i.mode=t.colors),t.colors_in&&e(t.colors_in)&&(i.modeIn=t.colors_in),Ft(t.color_source)&&(i.source=t.color_source),At(t.color_warn)&&(i.warn=t.color_warn),"1"!==t.show_conn&&"0"!==t.show_conn||(i.showConn="1"===t.show_conn),"1"!==t.conn_custom&&"0"!==t.conn_custom||(i.connCustom="1"===t.conn_custom),"string"==typeof t.conn_signal&&(i.connSignal=t.conn_signal),"1"!==t.outlets_log&&"0"!==t.outlets_log||(i.showOutletsLog="1"===t.outlets_log),"1"!==t.outlet_quick&&"0"!==t.outlet_quick||(i.showOutletQuick="1"===t.outlet_quick),"1"!==t.outlet_quick_remember&&"0"!==t.outlet_quick_remember||(i.outletQuickRemember="1"===t.outlet_quick_remember),"1"!==t.outlet_quick_names&&"0"!==t.outlet_quick_names||(i.outletQuickNames="1"===t.outlet_quick_names),"1"!==t.vpd_graph&&"0"!==t.vpd_graph||(i.showVpd="1"===t.vpd_graph),"1"!==t.vpd_leaf&&"0"!==t.vpd_leaf||(i.vpdLeaf="1"===t.vpd_leaf),"1"!==t.leaf_vpd_tile&&"0"!==t.leaf_vpd_tile||(i.showLeafVpd="1"===t.leaf_vpd_tile),"1"!==t.device_log&&"0"!==t.device_log||(i.showDeviceLog="1"===t.device_log),"1"!==t.device_quick&&"0"!==t.device_quick||(i.showDeviceQuick="1"===t.device_quick),"1"!==t.device_quick_remember&&"0"!==t.device_quick_remember||(i.deviceQuickRemember="1"===t.device_quick_remember),t.graph_range&&(i.graphRange=Number(t.graph_range)||6),void 0!==t.tile_radius&&""!==t.tile_radius&&(i.tileRadius=Number(t.tile_radius)),void 0!==t.tile_border_w&&""!==t.tile_border_w&&(i.tileBorderW=Number(t.tile_border_w)),At(t.tile_border_col)?i.tileBorderCol=t.tile_border_col:""===t.tile_border_col&&(i.tileBorderCol=""),At(t.tile_bg)?i.tileBg=t.tile_bg:""===t.tile_bg&&(i.tileBg=""),"1"!==t.ta_tiles&&"0"!==t.ta_tiles||(i.taTiles="1"===t.ta_tiles),"1"!==t.ta_devices&&"0"!==t.ta_devices||(i.taDevices="1"===t.ta_devices),"1"!==t.ta_outlets&&"0"!==t.ta_outlets||(i.taOutlets="1"===t.ta_outlets),"1"!==t.cooldown_show&&"0"!==t.cooldown_show||(i.cooldownShow="1"===t.cooldown_show),"1"!==t.cooldown_device&&"0"!==t.cooldown_device||(i.cooldownDevice="1"===t.cooldown_device),"1"!==t.cooldown_outlet&&"0"!==t.cooldown_outlet||(i.cooldownOutlet="1"===t.cooldown_outlet),void 0!==t.cooldown_secs&&""!==t.cooldown_secs&&(i.cooldownSecs=Number(t.cooldown_secs)),"1"!==t.overview_outlets&&"0"!==t.overview_outlets||(i.outletsOnOverview="1"===t.overview_outlets),"1"!==t.overview_quick&&"0"!==t.overview_quick||(i.outletQuickOverview="1"===t.overview_quick),"1"!==t.hide_energy_tile&&"0"!==t.hide_energy_tile||(i.hideEnergyTile="1"===t.hide_energy_tile),"sf"!==t.temp_source&&"external"!==t.temp_source||(i.tempSource=t.temp_source),"string"==typeof t.ext_temp&&(i.extTemp=t.ext_temp),"string"==typeof t.ext_humi&&(i.extHumi=t.ext_humi),"string"==typeof t.smart)try{i.smart=JSON.parse(t.smart)}catch{}"1"!==t.show_trend&&"0"!==t.show_trend||(i.showTrend="1"===t.show_trend),"1"!==t.show_band&&"0"!==t.show_band||(i.showBand="1"===t.show_band),"1"!==t.show_targets&&"0"!==t.show_targets||(i.showTargets="1"===t.show_targets),"1"!==t.tile_summary&&"0"!==t.tile_summary||(i.tileSummary="1"===t.tile_summary),"1"!==t.time_12h&&"0"!==t.time_12h||(i.hour12="1"===t.time_12h),At(t.color_hi)&&(i.hi=t.color_hi),At(t.color_lo)&&(i.lo=t.color_lo),At(t.color_in)&&(i.in=t.color_in),"1"!==t.hide_light2&&"0"!==t.hide_light2||(i.hide2="1"===t.hide_light2),"1"!==t.custom_outlet_names&&"0"!==t.custom_outlet_names||(i.customNames="1"===t.custom_outlet_names),"1"!==t.custom_layout&&"0"!==t.custom_layout||(i.customLayout="1"===t.custom_layout);const s=parseInt(t.card_scale,10);Number.isFinite(s)&&s>=70&&s<=150&&(i.scale=s);const o=parseInt(t.tile_cols,10);return Number.isFinite(o)&&o>=2&&o<=5&&(i.cols=o),t.outlet_colors&&e(t.outlet_colors)&&(i.omode=t.outlet_colors),At(t.oc_manual)&&(i.ocManual=t.oc_manual),At(t.oc_sched)&&(i.ocSched=t.oc_sched),At(t.oc_env)&&(i.ocEnv=t.oc_env),At(t.oc_drip)&&(i.ocDrip=t.oc_drip),t.device_colors&&e(t.device_colors)&&(i.dmode=t.device_colors),At(t.dc_manual)&&(i.dcManual=t.dc_manual),At(t.dc_sched)&&(i.dcSched=t.dc_sched),At(t.dc_auto)&&(i.dcAuto=t.dc_auto),i}serverOutletNames(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e={};if(!t)return e;for(const[i,s]of Object.entries(t))i.startsWith("outlet_name_")&&"string"==typeof s&&(e[i.slice(12)]=s);return e}serverOutletLightDirs(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e={};if(!t)return e;for(const[i,s]of Object.entries(t))!i.startsWith("oletdir_")||"Day"!==s&&"Night"!==s||(e[i.slice(8)]=s);return e}connInfo(){let t=null,e=!1,i=!1;if(this.connCustom&&this.connSignal){const i=this.get(this.connSignal);if(i){const s=Number(i.state);Number.isFinite(s)&&(t=s),e="unavailable"!==i.state&&"unknown"!==i.state&&"off"!==i.state}}else{const s=this.get(`sensor.sf_${this.config.panel}_alarm_settings`);if(s){i=!0===s.attributes.eth_online;const o=s.attributes.wifi_rssi;"number"==typeof o&&(t=o);const a=s.attributes.wifi_online;e=i||("boolean"==typeof a?a:"unavailable"!==s.state&&"unknown"!==s.state)}}let s=0,o="var(--secondary-text-color)";return null!=t&&(t>=-60?(s=4,o="#54c06a"):t>=-67?(s=3,o="#54c06a"):t>=-75?(s=2,o="#e0b23a"):(s=1,o="#e2544f")),{online:e,rssi:t,bars:s,color:o,wired:i}}renderConn(){if(!this.showConn)return U;const t=this.connInfo(),e=t.online?"#54c06a":"#e2544f",i=W`<span class="conn-st" style="color:${e}">
        <span class="conn-dot" style="background:${e}"></span>${t.online?"Online":"Offline"}
      </span>`;if(t.wired)return W`<span class="conn">${i}
        <ha-icon class="conn-eth" icon="mdi:ethernet"
          style="color:${e}" title="Wired (Ethernet)"></ha-icon>
      </span>`;const s=[1,2,3,4].map(e=>{const i=3+2*e;return j`<rect x=${4*(e-1)} y=${12-i} width="3" height=${i} rx="1"
        fill=${e<=t.bars?t.color:"var(--divider-color, #3a3e44)"}></rect>`});return W`<span class="conn">${i}
      <svg width="15" height="12" viewBox="0 0 15 12" aria-label="signal">${s}</svg>
    </span>`}signalEntityOptions(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("sensor.")&&"signal_strength"===this.hass.states[t].attributes.device_class).sort().map(t=>({id:t,name:this.hass.states[t].attributes.friendly_name||t})):[]}persistColorOption(t,e){const i=`sensor.sf_${this.config.panel}_alarm_settings`;this.get(i)&&this.hass?.callService("sf","set_card_option",{entity_id:i,key:t,value:e})}cacheColors(){try{localStorage.setItem(`sf-colors-${this.config.panel}`,JSON.stringify({mode:this.colorMode,modeIn:this.colorModeIn,source:this.colorSource,warn:this.colWarn,showTrend:this.showTrend,showBand:this.showBand,showTargets:this.showTargets,tileSummary:this.tileSummary,hour12:this.hour12,showConn:this.showConn,connCustom:this.connCustom,connSignal:this.connSignal,showOutletsLog:this.showOutletsLog,showOutletQuick:this.showOutletQuick,outletQuickRemember:this.outletQuickRemember,outletQuickNames:this.outletQuickNames,showVpd:this.showVpd,vpdLeaf:this.vpdLeaf,showLeafVpd:this.showLeafVpd,showDeviceLog:this.showDeviceLog,showDeviceQuick:this.showDeviceQuick,deviceQuickRemember:this.deviceQuickRemember,hi:this.colHi,lo:this.colLo,in:this.colIn,hide2:this.hideLight2,omode:this.outletColorMode,ocManual:this.ocManual,ocSched:this.ocSched,ocEnv:this.ocEnv,ocDrip:this.ocDrip,dmode:this.deviceColorMode,dcManual:this.dcManual,dcSched:this.dcSched,dcAuto:this.dcAuto,customNames:this.customOutletNames,outletNames:this.outletNames,customLayout:this.customLayout,scale:this.cardScale,cols:this.tileCols}))}catch{}}layoutStyle(){const t=[];return this.customLayout&&(t.push(`--sf-cols:${this.tileCols}`),100!==this.cardScale&&t.push(`zoom:${(this.cardScale/100).toFixed(2)}`)),12!==this.tileRadius&&t.push(`--sf-tile-radius:${this.tileRadius}px`),this.tileBorderW>0&&t.push(`--sf-tile-bw:${this.tileBorderW}px`),this.tileBorderCol&&t.push(`--sf-tile-bc:${this.tileBorderCol}`),this.tileBg&&t.push(`--sf-tile-bg:${this.tileBg}`),t.join(";")}outOfRange(t,e){const i=this.alertsSettings();if(!i||!Number.isFinite(e))return null;const s=[...i.climate||[],...i.substrate||[]].find(e=>e&&e.key===t);if(!s||!s.enabled)return null;const o=Number(s.max),a=Number(s.min);return Number.isFinite(o)&&e>o?"above":Number.isFinite(a)&&e<a?"below":null}colorForOor(t){return"above"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colHi,state:"above"}:"below"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colLo,state:"below"}:"near"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colWarn,state:"near"}:"off"===this.colorModeIn?null:{mode:this.colorModeIn,color:this.colIn,state:"in"}}readingColor(t,e){const i=parseFloat(e);return Number.isFinite(i)?this.colorForOor(t?this.outOfRange(t,i):null):null}leafVpdRange(){const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max")),i=t=>t&&Number.isFinite(+t.state)?+t.state:null;return{min:i(t),max:i(e)}}planStageCurrent(){const t=this.planInfo();if(!t.active||!t.stages.length)return null;const e=t.progress?t.progress.stageId:void 0;return t.stages.find(t=>t.stageId===e)||t.stages[0]}ppfdPlanTargetSub(){let t=!1;try{t=!!this.planInfo().active}catch{t=!1}if(!t)return U;const e=this.config.panel;for(const t of["light_1","light_2"]){const i=this.modeOf(`select.sf_${e}_${t}_mode`,"");if("PPFD"!==i&&"PPFD - Plan"!==i)continue;const s=Number(this.get(`number.sf_${e}_${t}_ppfd_target`)?.state);if(Number.isFinite(s)&&s>0)return W`<div class="tile-target">target ${Math.round(s)} µmol</div>`}return U}targetInfo(t){const e=Nt[t];if(!e)return null;const i=this.config.panel,s=!1!==this.cycleIsDay(),o=this.planStageCurrent();if(o){const t=o[`${e}_${s?"day":"night"}`];if(null!=t&&Number.isFinite(Number(t))){let s=Number(t),a=Number(o[`${e}_dz`]);if("temp"===e){const t=this.get(`number.sf_${i}_env_temp_day`)?.attributes?.unit_of_measurement;"°F"!==t&&"℉"!==t||(s=9*s/5+32,Number.isFinite(a)&&(a=9*a/5))}return Number.isFinite(a)||(a=Number(this.get(`number.sf_${i}_env_${e}_deadband`)?.state??0)||0),{target:Math.round(10*s)/10,dead:Math.round(10*a)/10}}}const a=this.get(`number.sf_${i}_env_${e}_${s?"day":"night"}`),n=this.get(`number.sf_${i}_env_${e}_deadband`);if(!a||!n)return null;const r=parseFloat(a.state),l=parseFloat(n.state);return Number.isFinite(r)&&Number.isFinite(l)?{target:r,dead:l}:null}vpdRangeNums(t,e){const i=this.get(t),s=this.get(e);if(!i||!s)return null;const o=Number(i.state),a=Number(s.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,c="°C"===i.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3));return{lo:Math.max(0,h(d(o-r))*(1-Math.min(100,a+l)/100)),hi:Math.max(0,h(d(o+r))*(1-Math.max(0,a-l)/100))}}airVpdRange(){const t=this.config.panel,e=this.targetInfo("temperature"),i=this.targetInfo("humidity");if(!e||!i){const e=!1!==this.cycleIsDay()?"day":"night";return this.vpdRangeNums(`number.sf_${t}_env_temp_${e}`,`number.sf_${t}_env_humi_${e}`)}const s=this.get(`number.sf_${t}_env_temp_day`)?.attributes?.unit_of_measurement,o="°C"===s,a=t=>.6108*Math.exp(17.27*t/(t+237.3)),n=(t=>o?t:5*(t-32)/9)(e.target),r=o?e.dead:5*e.dead/9,l=Math.max(0,i.target-i.dead),c=Math.min(100,i.target+i.dead),d=Math.max(0,a(n-r)*(1-c/100)),h=Math.max(0,a(n+r)*(1-l/100));return h>d?{lo:d,hi:h}:null}targetBandRaw(t){const e=this.targetInfo(t);if(e)return{lo:e.target-e.dead,hi:e.target+e.dead,margin:e.dead};if("vpd"===t){const t=this.airVpdRange();return t&&t.hi>t.lo?{lo:t.lo,hi:t.hi,margin:.15*(t.hi-t.lo)}:null}if("leaf_vpd"===t){const{min:t,max:e}=this.leafVpdRange();return null!=t&&null!=e&&e>t?{lo:t,hi:e,margin:.15*(e-t)}:null}if(t.startsWith("soil_avg_")){const e=this.alarmRange(t);if(e)return{lo:e.lo,hi:e.hi,margin:.06*(e.hi-e.lo)}}return null}alarmRange(t){const e=Lt[t];if(!e)return null;const i=this.alertsSettings();if(!i)return null;const s=[...i.climate||[],...i.substrate||[]].find(t=>t&&t.key===e);if(!s||!s.enabled)return null;const o=Number(s.min),a=Number(s.max);return Number.isFinite(o)&&Number.isFinite(a)&&a>o?{lo:o,hi:a}:null}metricBand(t){const e=this.targetBandRaw(t);if("leaf_vpd"===t)return e;if("targets"===this.colorSource)return e;const i=this.alarmRange(t),s=i?{lo:i.lo,hi:i.hi,margin:0}:null;return"alarms"===this.colorSource?s:e??s}targetOutOfRange(t,e){const i=this.metricBand(t);return i?e>i.hi+i.margin?"above":e<i.lo-i.margin?"below":e>i.hi||e<i.lo?"near":null:null}targetSubline(t,e){if(!this.showTargets)return U;const i=this.targetInfo(t);if("alarms"!==this.colorSource&&i)return W`<div class="tile-target">target ${i.target}${e} · ±${i.dead}</div>`;const s=this.metricBand(t);if(!s)return U;const o="alarms"!==this.colorSource||"leaf_vpd"===t?"target":"range",a=Math.abs((s.lo+s.hi)/2),n=e||"",r=/kpa/i.test(n)?2:/ms\/cm/i.test(n)?1:/°|%|ppm|µmol/.test(n)?0:a<10?2:a<100?1:0;return W`<div class="tile-target">${o} ${s.lo.toFixed(r)}–${s.hi.toFixed(r)} ${e}</div>`}paramEid(t){return`sensor.sf_${this.config.panel}_${t}`}recordHistory(){const t=Date.now();for(const[e]of Tt){const i=this.get(this.paramEid(e)),s=i?parseFloat(i.state):NaN;if(!Number.isFinite(s))continue;const o=this.paramEid(e),a=this._hist[o]||(this._hist[o]=[]),n=a[a.length-1];for((!n||n.v!==s||t-n.t>6e4)&&a.push({t:t,v:s});a.length>60||a.length&&t-a[0].t>12e5;)a.shift()}}trend(t){const e=this._hist[this.paramEid(t)];if(!e||e.length<3)return null;const i=e[0].v,s=e[e.length-1].v,o=e.reduce((t,e)=>Math.max(t,Math.abs(e.v)),0)||1;return Math.abs(s-i)<Math.max(.05,.004*o)?"flat":s>i?"up":"down"}trendIcon(t){if(!this.showTrend)return U;const e=this.trend(t);if(!e)return U;return W`<ha-icon class="tile-trend" icon=${"up"===e?"mdi:trending-up":"down"===e?"mdi:trending-down":"mdi:trending-neutral"} style="color:${"up"===e?"#ff8a65":"down"===e?"#5db2ff":"var(--secondary-text-color)"}"></ha-icon>`}bandInfo(t){const e=this.metricBand(t);if(!e)return null;const i=e.hi-e.lo;return{min:e.lo-i-e.margin,max:e.hi+i+e.margin,bandLo:e.lo,bandHi:e.hi,warnLo:e.lo-e.margin,warnHi:e.hi+e.margin}}renderBand(t,e){if(!this.showBand||!Number.isFinite(e))return U;const i=this.bandInfo(t);if(!i)return U;let s=i.min,o=i.max;const a=o-s||1;e<s&&(s=e-.06*a),e>o&&(o=e+.06*a);const n=t=>Math.max(0,Math.min(100,(t-s)/(o-s)*100));return W`<div class="tile-band">
      <div class="bz" style=${`left:${n(i.warnLo)}%;width:${n(i.warnHi)-n(i.warnLo)}%;background:${Rt(this.colWarn,.28)}`}></div>
      <div class="bz" style=${`left:${n(i.bandLo)}%;width:${n(i.bandHi)-n(i.bandLo)}%;background:${Rt(this.colIn,.42)}`}></div>
      <div class="bmark" style=${`left:${n(e)}%`}></div>
    </div>`}_gkey(t){return`${t}|${this.graphRange}`}toggleGraph(t){const e=this.paramOpen===t;this.paramOpen=e?null:t,this._graphSel=null,this._graphPin=null,e||this.fetchGraph(this.paramEid(t))}setGraphRange(t){t!==this.graphRange&&(this.graphRange=t,this._graphSel=null,this._graphPin=null,this.persistColorOption("graph_range",String(t)),this.paramOpen&&this.fetchGraph(this.paramEid(this.paramOpen)))}async fetchGraph(t){const e=this._gkey(t);if(!this._graph[e]&&!this._graphLoading[e]&&this.hass){this._graphLoading[e]=!0;try{const i=new Date,s=new Date(i.getTime()-3600*this.graphRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),a=o&&o[t]||[];this._graph[e]=a.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),v:parseFloat(t.s??t.state)})).filter(t=>Number.isFinite(t.v)&&Number.isFinite(t.t))}catch(t){this._graph[e]=[]}finally{this._graphLoading[e]=!1,this._graphVer++}}}renderParamGraph(){const t=this.paramOpen;if(!t)return U;const e=this.paramEid(t),i=this._gkey(e),s=(Tt.find(e=>e[0]===t)||[,t.charAt(0).toUpperCase()+t.slice(1)])[1],o=this.get(e)?.attributes.unit_of_measurement||"",a=W`<select class="pg-range" @change=${t=>this.setGraphRange(Number(t.target.value))}>
      ${[[6,"6h"],[12,"12h"],[24,"24h"],[168,"7d"]].map(([t,e])=>W`
        <option value=${t} ?selected=${this.graphRange===t}>${e}</option>`)}
    </select>`;if(this._graphLoading[i])return W`<div class="param-graph"><div class="pg-head"><span>${s}</span>${a}<span class="pg-now">…</span><ha-icon icon="mdi:close" @click=${()=>this.paramOpen=null}></ha-icon></div><span class="pg-note">Loading history…</span></div>`;const n=this._graph[i];if(!n||n.length<2)return W`<div class="param-graph"><div class="pg-head"><span>${s}</span>${a}<span class="pg-now"></span><ha-icon icon="mdi:close" @click=${()=>this.paramOpen=null}></ha-icon></div><span class="pg-note">Not enough history yet for ${s} at this range.</span></div>`;const r=n.map(t=>t.v),l=Math.min(...r),c=Math.max(...r),d=r.reduce((t,e)=>t+e,0)/r.length,h=r[r.length-1],p=Math.abs(d)<10?2:Math.abs(d)<100?1:0,u=t=>t.toFixed(p),g=this.bandInfo(t),m="leaf_vpd"===t||"alarms"!==this.colorSource?this.targetOutOfRange(t,h):this.outOfRange(Lt[t],h),f="above"===m?this.colHi:"below"===m?this.colLo:"near"===m?this.colWarn:"var(--primary-text-color)",v=520,_=120,b=n[0].t,$=n[n.length-1].t||b+1;let x=l,y=c;g&&(x=Math.min(x,g.warnLo),y=Math.max(y,g.warnHi));const w=.08*(y-x)||1;x-=w,y+=w,l>=0&&(!g||g.warnLo>=0)&&(x=Math.max(0,x));const S=t=>6+(t-b)/($-b)*508,k=t=>114-(t-x)/(y-x)*108,O=n.map((t,e)=>`${e?"L":"M"}${S(t.t).toFixed(1)} ${k(t.v).toFixed(1)}`).join(" "),D=`M${S(b).toFixed(1)} ${114..toFixed(1)} ${O.slice(1)} L${S($).toFixed(1)} ${114..toFixed(1)} Z`,C=this.accent(),M=r.indexOf(l),T=r.indexOf(c),L=(t,e)=>j`<line x1="0" x2=${v} y1=${k(t).toFixed(1)} y2=${k(t).toFixed(1)} stroke=${e} stroke-width="1" stroke-dasharray="3 3" opacity="0.6"></line>`,N=t=>this.graphRange>=168?new Date(t).toLocaleDateString([],{month:"numeric",day:"numeric"}):new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:this.hour12}),P=this.graphRange>=168?7:6,E=Array.from({length:P+1},(t,e)=>b+e/P*($-b)),R=null!=this._graphSel?this._graphSel:null!=this._graphPin?this._graphPin:null,A=null!=R&&R>=0&&R<n.length?R:null,F=(t,e)=>{const i=t.currentTarget.getBoundingClientRect();if(!i.width)return;const s=Math.max(0,Math.min(1,(t.clientX-i.left)/i.width)),o=b+s*($-b);let a=0,r=1/0;for(let t=0;t<n.length;t++){const e=Math.abs(n[t].t-o);e<r&&(r=e,a=t)}this._graphSel=a,e&&(this._graphPin=a)},z=null!=A?n[A].v:h;return W`<div class="param-graph">
      <div class="pg-head">
        <span>${s}</span>${a}
        <span class="pg-now" style="color:${null!=A?"var(--primary-text-color)":f}">
          ${null!=A?W`<span class="pg-at">${(t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))(n[A].t)}</span> `:U}${u(z)}<span class="pg-u">${o}</span></span>
        <ha-icon icon="mdi:close" @click=${()=>{this.paramOpen=null,this._graphSel=null,this._graphPin=null}}></ha-icon>
      </div>
      <div class="pg-stats">
        <span>min <b>${u(l)}</b></span><span>avg <b>${u(d)}</b></span>
        <span>max <b>${u(c)}</b></span>
        ${g?W`<span>band <b>${u(g.bandLo)}–${u(g.bandHi)}</b> ${o}</span>`:U}
      </div>
      <div class="pg-plot">
        <div class="pg-yax"><span>${u(y)}</span><span>${u(x)}</span></div>
        <svg viewBox="0 0 ${v} ${_}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${t=>F(t,!1)}
          @pointerdown=${t=>F(t,!0)}
          @pointerleave=${()=>{this._graphSel=null}}>
          ${E.map(t=>j`<line x1=${S(t).toFixed(1)} x2=${S(t).toFixed(1)} y1="0" y2=${_} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${g?j`
            <rect x="0" y=${k(g.warnHi).toFixed(1)} width=${v} height=${(k(g.bandHi)-k(g.warnHi)).toFixed(1)} fill=${Rt(this.colWarn,.16)}></rect>
            <rect x="0" y=${k(g.bandLo).toFixed(1)} width=${v} height=${(k(g.warnLo)-k(g.bandLo)).toFixed(1)} fill=${Rt(this.colWarn,.16)}></rect>
            <rect x="0" y=${k(g.bandHi).toFixed(1)} width=${v} height=${(k(g.bandLo)-k(g.bandHi)).toFixed(1)} fill=${Rt(this.colIn,.2)}></rect>
            ${L(g.bandHi,this.colIn)}${L(g.bandLo,this.colIn)}`:U}
          <path d=${D} fill=${Rt(C,.12)} stroke="none"></path>
          <path d=${O} fill="none" stroke=${C} stroke-width="2"></path>
          <circle cx=${S(n[M].t).toFixed(1)} cy=${k(l).toFixed(1)} r="2.5" fill=${this.colLo}></circle>
          <circle cx=${S(n[T].t).toFixed(1)} cy=${k(c).toFixed(1)} r="2.5" fill=${this.colHi}></circle>
          <circle cx=${S(n[n.length-1].t).toFixed(1)} cy=${k(h).toFixed(1)} r="3.5" fill=${C}></circle>
          ${null!=A?j`
            <line x1=${S(n[A].t).toFixed(1)} x2=${S(n[A].t).toFixed(1)} y1="0" y2=${_} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            <circle cx=${S(n[A].t).toFixed(1)} cy=${k(n[A].v).toFixed(1)} r="4" fill="var(--primary-text-color)"></circle>`:U}
          <rect x="0" y="0" width=${v} height=${_} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${E.map(t=>W`<span>${N(t)}</span>`)}</div>
    </div>`}soilCellStyle(t,e){const i=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);if(!i||Wt(i))return"";const s="temperature"===e?"tempSoil":"moisture"===e?"humiSoil":"ECSoil",o=this.readingColor(s,i.state);return o?`color:${o.color}`:""}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?St(t):[])[0]||"dp1",i=t?Ct(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...i.length?{outlets:i}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||mt}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")||t.has("outletDraft")||t.has("outletNameDraft")||t.has("outletCfgDraft")||t.has("_stDt")||t.has("_cdTick")||t.has("alertsDraft")||t.has("deviceOpen")||t.has("outletOpen")||t.has("draft")||t.has("modePick")||t.has("dirPick")||t.has("outletLightDir")||t.has("logDate")||t.has("logDev")||t.has("logType")||t.has("colorMode")||t.has("colorModeIn")||t.has("colHi")||t.has("colLo")||t.has("colIn")||t.has("hideLight2")||t.has("colorDraft")||t.has("outletColorMode")||t.has("ocManual")||t.has("ocSched")||t.has("ocEnv")||t.has("ocDrip")||t.has("deviceColorMode")||t.has("dcManual")||t.has("dcSched")||t.has("dcAuto")||t.has("colorSource")||t.has("colWarn")||t.has("showTrend")||t.has("showBand")||t.has("paramOpen")||t.has("_graphVer")||t.has("graphRange")||t.has("_graphSel")||t.has("_graphPin")||t.has("showTargets")||t.has("tileSummary")||t.has("hour12")||t.has("showConn")||t.has("connCustom")||t.has("connSignal")||t.has("showOutletsLog")||t.has("ologRange")||t.has("showVpd")||t.has("vpdLeaf")||t.has("showLeafVpd")||t.has("_colorOpen")||t.has("vpdStage")||t.has("vpdView")||t.has("vpdHighlight")||t.has("vpdPlanSource")||t.has("showDeviceLog")||t.has("showDeviceQuick")||t.has("deviceQuickRemember")||t.has("dlogOpen")||t.has("planDraft")||t.has("planEditStage")||t.has("planShowAll")||t.has("planDelArm")||t.has("envSubView")||t.has("_planPending")||t.has("planTplOpen")||t.has("planTplName")||t.has("_tplMsg")||t.has("ologOpen")||t.has("_ologVer")||t.has("_saving")||t.has("outletCopyOpen")||t.has("outletCopySel")||t.has("outletCopyFromOpen")||t.has("showOutletQuick")||t.has("outletQuickRemember")||t.has("outletQuickNames")||t.has("leafSpots")||t.has("leafCalTarget")||t.has("customOutletNames")||t.has("outletNames")||t.has("customLayout")||t.has("cardScale")||t.has("tileCols")||t.has("_devOff")||t.has("tileRadius")||t.has("tileBorderW")||t.has("tileBorderCol")||t.has("tileBg")||t.has("taTiles")||t.has("taDevices")||t.has("taOutlets")||t.has("cooldownShow")||t.has("cooldownDevice")||t.has("cooldownOutlet")||t.has("cooldownSecs")||t.has("_cdOpen")||t.has("outletsOnOverview")||t.has("outletQuickOverview")||t.has("hideEnergyTile")||t.has("_setOverviewOpen")||t.has("_setExtrasOpen")||t.has("_setConnOpen")||t.has("_setVpdOpen")||t.has("_setDevOpen")||t.has("_setOutletOpen")||t.has("_setLayoutOpen")||t.has("tempSource")||t.has("extTemp")||t.has("extHumi")||t.has("_tsOpen")||t.has("smart")||t.has("_smartOpen")}willUpdate(t){if(this._saving&&t.has("hass")){const t=Date.now()-this._savingAt,e=this._savingWatch.some(t=>(this.get(t.id)?.state??"")!==t.was);(this._savingWatch.length?e&&t>300||t>5e3:t>3500)&&(this._saving=!1,this._savingWatch=[],clearTimeout(this._savingT))}if(!this._colorSynced){const t=this.serverColors();Object.keys(t).length&&(t.mode&&(this.colorMode=t.mode),t.modeIn&&(this.colorModeIn=t.modeIn),t.source&&(this.colorSource=t.source),t.warn&&(this.colWarn=t.warn),void 0!==t.showTrend&&(this.showTrend=t.showTrend),void 0!==t.showBand&&(this.showBand=t.showBand),void 0!==t.showTargets&&(this.showTargets=t.showTargets),void 0!==t.tileSummary&&(this.tileSummary=t.tileSummary),void 0!==t.hour12&&(this.hour12=t.hour12),void 0!==t.showConn&&(this.showConn=t.showConn),void 0!==t.connCustom&&(this.connCustom=t.connCustom),void 0!==t.connSignal&&(this.connSignal=t.connSignal),void 0!==t.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog),void 0!==t.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick),void 0!==t.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember),void 0!==t.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames),void 0!==t.showVpd&&(this.showVpd=t.showVpd),void 0!==t.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd),void 0!==t.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf),void 0!==t.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog),void 0!==t.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick),void 0!==t.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember),t.hi&&(this.colHi=t.hi),t.lo&&(this.colLo=t.lo),t.in&&(this.colIn=t.in),void 0!==t.hide2&&(this.hideLight2=t.hide2),t.omode&&(this.outletColorMode=t.omode),t.ocManual&&(this.ocManual=t.ocManual),t.ocSched&&(this.ocSched=t.ocSched),t.ocEnv&&(this.ocEnv=t.ocEnv),t.ocDrip&&(this.ocDrip=t.ocDrip),t.dmode&&(this.deviceColorMode=t.dmode),t.dcManual&&(this.dcManual=t.dcManual),t.dcSched&&(this.dcSched=t.dcSched),t.dcAuto&&(this.dcAuto=t.dcAuto),void 0!==t.customNames&&(this.customOutletNames=t.customNames),void 0!==t.customLayout&&(this.customLayout=t.customLayout),t.scale&&(this.cardScale=t.scale),t.cols&&(this.tileCols=t.cols),t.graphRange&&(this.graphRange=t.graphRange),void 0!==t.tileRadius&&(this.tileRadius=t.tileRadius),void 0!==t.tileBorderW&&(this.tileBorderW=t.tileBorderW),void 0!==t.tileBorderCol&&(this.tileBorderCol=t.tileBorderCol),void 0!==t.tileBg&&(this.tileBg=t.tileBg),void 0!==t.taTiles&&(this.taTiles=t.taTiles),void 0!==t.taDevices&&(this.taDevices=t.taDevices),void 0!==t.taOutlets&&(this.taOutlets=t.taOutlets),void 0!==t.cooldownShow&&(this.cooldownShow=t.cooldownShow),void 0!==t.cooldownDevice&&(this.cooldownDevice=t.cooldownDevice),void 0!==t.cooldownOutlet&&(this.cooldownOutlet=t.cooldownOutlet),void 0!==t.cooldownSecs&&Number.isFinite(t.cooldownSecs)&&(this.cooldownSecs=t.cooldownSecs),void 0!==t.outletsOnOverview&&(this.outletsOnOverview=t.outletsOnOverview),void 0!==t.outletQuickOverview&&(this.outletQuickOverview=t.outletQuickOverview),void 0!==t.hideEnergyTile&&(this.hideEnergyTile=t.hideEnergyTile),void 0!==t.tempSource&&(this.tempSource=t.tempSource),void 0!==t.extTemp&&(this.extTemp=t.extTemp),void 0!==t.extHumi&&(this.extHumi=t.extHumi),void 0!==t.smart&&(this.smart=t.smart),this._colorSynced=!0,this.cacheColors());const e=this.serverOutletNames();Object.keys(e).length&&(this.outletNames=e);const i=this.serverOutletLightDirs();Object.keys(i).length&&(this.outletLightDir=i)}if(t.has("tab")&&(null!==this.colorDraft&&(this.colorDraft=null),null!==this.alertsDraft&&(this.alertsDraft=null),null!==this.envSubView&&(this.envSubView=null),null!==this.planDraft&&(this.planDraft=null),null!==this.planEditStage&&(this.planEditStage=null),this.planShowAll&&(this.planShowAll=!1),this.planDelArm&&(this.planDelArm=!1),Object.keys(this.draft).length&&(this.draft={}),Object.keys(this.outletDraft).length&&(this.outletDraft={}),Object.keys(this.outletNameDraft).length&&(this.outletNameDraft={}),Object.keys(this.outletCfgDraft).length&&(this.outletCfgDraft={}),Object.keys(this.modePick).length&&(this.modePick={})),t.has("hass")&&this.recordHistory(),t.has("hass")&&Object.keys(this.modePick).length){let t=null;for(const[e,i]of Object.entries(this.modePick))this.get(e)?.state===i&&(t=t??{...this.modePick},delete t[e]);t&&(this.modePick=t)}}cleaningActive(){const t=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);return!!t&&"on"===t.state}cleaningRemaining(){const t=this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_time`),e=t?parseInt(t.state,10):NaN;if(!Number.isFinite(e)||e<=0)return"";const i=Math.floor(e/3600),s=Math.floor(e%3600/60);return i?`${i}h ${s}m`:`${s}m`}cleaningCooling(){return"2"===this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_phase`)?.state}cleaningLabel(){return this.cleaningCooling()?"Cooling":"Cleaning"}setCleaning(t){this.hass?.callService("sf","set_sensor_heating",{entity_id:`binary_sensor.sf_${this.config.panel}_sensor_cleaning`,on:t})}renderSensorCleaning(){const t=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);if(!t)return U;const e="on"===t.state,i=this.cleaningCooling(),s=this.cleaningRemaining(),o=this.accent(),a="flex:1;border-radius:8px;padding:9px;font-size:13px;font-weight:500;";return W`
      <div class="section-label">Sensor Cleaning</div>
      <div style="font-size:12px;color:var(--secondary-text-color);line-height:1.5;margin:0 0 10px;">
        Runs a self-clean heat cycle on the air temp/humidity probe (~2&nbsp;hours). The
        probe's device turns off during it, then a 5-minute cooldown follows — Air Temp,
        Humidity and VPD pause until it finishes.
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:var(--secondary-background-color);border-radius:8px;padding:9px 11px;margin-bottom:10px;">
        <ha-icon icon=${e&&i?"mdi:thermometer-chevron-down":"mdi:broom"}
          style="color:${e?o:"var(--secondary-text-color)"}"></ha-icon>
        <span style="font-size:13px;">${e?i?"Cooling sensor…":"Cleaning sensor…":"Not cleaning"}</span>
        <span style="margin-left:auto;font-size:13px;font-weight:500;color:${o};">${e&&s?s+" left":""}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button ?disabled=${e} @click=${()=>this.setCleaning(!0)}
          style="${a}border:none;cursor:${e?"not-allowed":"pointer"};opacity:${e?".45":"1"};background:${o};color:#fff;">Start cleaning</button>
        <button ?disabled=${!e} @click=${()=>this.setCleaning(!1)}
          style="${a}background:transparent;cursor:${e?"pointer":"not-allowed"};opacity:${e?"1":".45"};color:${o};border:1px solid ${o};">Stop cleaning</button>
      </div>`}renderParam([t,e,i]){if("leaf_vpd"===t&&!this.showLeafVpd)return U;const s=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!s)return U;const o=s.attributes.unit_of_measurement||"",a=t.startsWith("soil_avg_")&&Wt(s),n=["temperature","humidity","vpd","leaf_vpd"].includes(t)&&this.cleaningActive(),r=n?"--":a?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(o,"").trim():s.state,l=t.startsWith("soil_avg_")?t.slice(9):null,c=!!l&&this.soilProbeRows(l).length>1,d=c&&this.soilOpen===l;let h;const p=this.paramOpen===t;if(a||n)h=null;else{const e=parseFloat(s.state);if(Number.isFinite(e)){const i="targets"!==this.colorSource?this.outOfRange(Lt[t],e):null,s="alarms"!==this.colorSource||"leaf_vpd"===t?this.targetOutOfRange(t,e):null;h=this.colorForOor(i??s)}else h=null}const u=!a&&!c;let g=d||p?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",m="";a?(g=`background:${Et};box-shadow:inset 0 0 0 1px ${Pt}`,m=`color:${Pt}`):h&&"text"===h.mode?m=`color:${h.color}`:h&&"tile"===h.mode&&(g=`background:${Rt(h.color)};box-shadow:inset 0 0 0 1px ${h.color}`);const f=c||u;return W`
      <div class="tile ${f?"clickable":""} ${d||p?"active":""}"
        style=${g||U}
        role=${f?"button":U}
        @click=${c?()=>this.soilOpen=d?null:l:u?()=>this.toggleGraph(t):void 0}>
        <div class="tile-label">
          <span class="tl-name">${e}</span>
          <span class="tl-right">
            ${n?W`<ha-icon icon="mdi:broom" title="Sensor cleaning"
              style="--mdc-icon-size:15px;color:var(--warning-color,#ff9800)"></ha-icon>`:U}
            ${this.trendIcon(t)}
            ${c?W`<ha-icon class="tile-more"
                  icon=${d?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:u?W`<ha-icon class="tile-more"
                  icon=${p?"mdi:chevron-up":"mdi:chart-line"}></ha-icon>`:U}
          </span>
        </div>
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${m||U}>${r}${a||n?U:W`<span class="unit">${o}</span>`}</div>
        ${n?W`<div class="tile-target" style="color:var(--warning-color,#ff9800)">${this.cleaningLabel()}${this.cleaningRemaining()?" · "+this.cleaningRemaining():""}</div>`:a?U:this.targetSubline(t,o)}
        ${a||n||"ppfd"!==t?U:this.ppfdPlanTargetSub()}
        ${a||n?U:this.renderBand(t,parseFloat(s.state))}
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),i=[];for(const s of Object.keys(this.hass?.states??{})){const o=_t(s).match(e);o&&i.push({slot:o[1],name:this.soilSensorName(s,t),e:this.hass.states[s]})}return i.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),i.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let i=this.hass?.states[t]?.attributes.friendly_name??"";const s=Mt(this.hass,this.config.panel);s&&i.startsWith(s)&&(i=i.slice(s.length).trim());const o="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return i=i.replace(new RegExp(`\\s*${o}\\s*$`,"i"),"").trim(),i||_t(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return U;const e=this.soilProbeRows(t);if(!e.length)return U;return W`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:e,e:i})=>{const s=Wt(i),o=i.attributes.unit_of_measurement||"",a=this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,n="temperature"===t?"tempSoil":"moisture"===t?"humiSoil":"ECSoil",r=s?null:this.readingColor(n,i.state);return W`
            <div class="soil-pop-row ${s?"offline":""}">
              <span class="spn">${e}</span>
              <span class="spv" style=${r?`color:${r.color}`:U}>${s?W`Offline`:W`${a}<span class="unit">${o}</span>`}</span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const i of Object.keys(this.hass?.states??{})){const s=_t(i).match(t);s&&e.add(s[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}probeOffline(t){const e=this.get(`sensor.sf_${this.config.panel}_${t}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${t}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${t}_ec`);return Wt(e)}soilCellValue(t,e){const i=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return i&&"unknown"!==i.state&&"unavailable"!==i.state?this.hass?.formatEntityState?this.hass.formatEntityState(i):`${i.state}${i.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const i=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[i])return this.soilSensorName(i,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const t=this.soilProbeSlots();if(t.length<2)return U;const e=this.soilAllOpen,i=this.accent(),s=t.filter(t=>this.probeOffline(t)).length,o=s?`background:${Et};box-shadow:inset 0 0 0 1px ${Pt}`:e?`box-shadow:inset 0 0 0 1px ${i}`:"",a=s?`${s} offline`:`${t.length} probes`;return W`
      <div class="tile clickable ${e?"active":""}" style=${o||U}
        role="button" aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${s?Pt:i}"></ha-icon>
        <div class="tile-val" style=${s?`color:${Pt}`:U}>${a}</div>
      </div>`}renderSoilAllTable(){const t=this.soilProbeSlots();return t.length<2||!this.soilAllOpen?U:W`
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
              <span class="sa-v" style=${this.soilCellStyle(t,"temperature")||U}>${this.soilCellValue(t,"temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"moisture")||U}>${this.soilCellValue(t,"moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"ec")||U}>${this.soilCellValue(t,"ec")}</span>
            </div>`)}
      </div>`}overviewDevices(){const t=[],e=(e,i)=>{for(const[s,o,a]of i){const i=this.eid(e,s);this.get(i)&&t.push({domain:e,suffix:s,id:i,label:o,icon:a})}};return e("light",Ut),e("fan",Gt),e("switch",Kt),this.hideLight2?t.filter(t=>"light_2"!==t.suffix):t}deviceStateText(t,e){if("unavailable"===e.state||"unknown"===e.state)return"Offline";if("light"===t.domain)return"on"!==e.state?"Off":`${Math.round((e.attributes.brightness??0)/255*100)}%`;if("fan"===t.domain){if("on"!==e.state)return"Off";const t=Math.round(e.attributes.percentage??0);return t?`${t}%`:"On"}if("on"!==e.state)return"Off";const i=this.config.panel;if("dehumidifier"===t.suffix){const t=this.get(`sensor.sf_${i}_dehumidifier_level`)?.state;return t&&"Off"!==t&&"unknown"!==t?t:"On"}if("heater"===t.suffix||"humidifier"===t.suffix){const e=this.get(`sensor.sf_${i}_${t.suffix}_level`)?.state;return e&&"0"!==e&&"unknown"!==e?`L${e}`:"On"}return"On"}deviceFault(t){const e=this.config.panel,i=t=>this.get(`sensor.sf_${e}_${t}`)?.state;return"humidifier"===t&&"Empty"===i("humidifier_tank")?"EMPTY":"dehumidifier"===t&&"Full"===i("dehumidifier_tank")?"FULL":"heater"===t&&"Alarm"===i("heater_status")?"Alarm":null}envIsDay(t){const e=(t,e)=>{const i=/^(\d{1,2}):(\d{2})/.exec(this.get(t)?.state||"");return i?60*+i[1]+ +i[2]:e},i=e(`text.sf_${t}_env_day_start`,300),s=e(`text.sf_${t}_env_day_end`,1200),o=new Date,a=60*o.getHours()+o.getMinutes();return i<=s?a>=i&&a<s:a>=i||a<s}humiTarget(t=this.config.panel){const e=Number(this.get(`number.sf_${t}_env_humi_day`)?.state),i=Number(this.get(`number.sf_${t}_env_humi_night`)?.state),s=this.get(`binary_sensor.sf_${t}_is_day`)?.state,o=this.get(`sensor.sf_${t}_is_day_env_target`)?.state;return"on"===s||"1"===o||"off"!==s&&"0"!==o&&this.envIsDay(t)?Number.isFinite(e)?e:i:Number.isFinite(i)?i:e}humiDeadband(t){const e=Number(this.get(`number.sf_${t}_env_humi_deadband`)?.state);return Number.isFinite(e)?e:0}cooldownFrom(t,e){const i=this.get(t);if(!i||"off"!==i.state||!i.last_changed)return null;const s=this._cdOffAt[t],o=null!=s?s:e?Date.parse(i.last_changed):null;if(null==o)return null;const a=(Date.now()-o)/1e3,n=Math.ceil(this.cooldownSecs-a);return n<=0?null:{remaining:n,waiting:e}}cooldownSwitchIds(){const t=[],e=this.config.panel;this.get(`switch.sf_${e}_dehumidifier`)&&t.push(`switch.sf_${e}_dehumidifier`);for(const e of this.outletSlots())for(const i of this.outletNums(e)){const s=this.get(`select.sf_${e}_outlet_${i}_mode`)?.state,o=this.get(`select.sf_${e}_outlet_${i}_humidity_device`)?.state;"Humidity"===s&&"Dehumidifying"===o&&t.push(`switch.sf_${e}_outlet_${i}`)}return t}trackCooldownTransitions(){for(const t of this.cooldownSwitchIds()){const e=this.get(t)?.state;if(null==e)continue;const i=this._cdLastState[t];i!==e&&("off"===e&&"on"===i?this._cdOffAt[t]=Date.now():"on"===e&&delete this._cdOffAt[t],this._cdLastState[t]=e)}}dehumCooldown(t){if("dehumidifier"!==t||!this.cooldownShow||!this.cooldownDevice)return null;const e=this.config.panel,i=Number(this.get(`sensor.sf_${e}_humidity`)?.state),s=this.humiTarget(),o=Number.isFinite(i)&&Number.isFinite(s)&&i>s+this.humiDeadband(e);return this.cooldownFrom(`switch.sf_${e}_dehumidifier`,o)}outletCooldown(t,e){if(!this.cooldownShow||!this.cooldownOutlet)return null;const i=this.get(`select.sf_${t}_outlet_${e}_humidity_device`)?.state,s=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state;if("Humidity"!==s||"Dehumidifying"!==i)return null;const o=Number(this.get(`sensor.sf_${t}_humidity`)?.state),a=this.humiTarget(t),n=Number.isFinite(o)&&Number.isFinite(a)&&o>a+this.humiDeadband(t);return this.cooldownFrom(`switch.sf_${t}_outlet_${e}`,n)}hasDehumidifier(){if(this.get(`switch.sf_${this.config.panel}_dehumidifier`))return!0;for(const t of this.outletSlots()){if(this.get(`switch.sf_${t}_dehumidifier`))return!0;for(const e of this.outletNums(t)){const i=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state,s=this.get(`select.sf_${t}_outlet_${e}_humidity_device`)?.state||this.dirPick[`${t}_${e}`];if("Humidity"===i&&"Dehumidifying"===s)return!0}}return!1}anyCooldownActive(){if(!this.cooldownShow)return!1;if(this.cooldownDevice&&this.dehumCooldown("dehumidifier"))return!0;if(this.cooldownOutlet)for(const t of this.outletSlots())for(const e of this.outletNums(t))if(this.outletCooldown(t,e))return!0;return!1}fmtMMSS(t){return t=Math.max(0,Math.round(t)),`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}cooldownPill(t,e=""){if(!t)return U;const i=Math.max(0,Math.min(100,t.remaining/this.cooldownSecs*100)),s="var(--warning-color,#ff9800)";return W`
      <div class="cd-pill ${e}" title="Compressor lockout after turning off — it can't restart until this reaches 0:00">
        <span class="cd-txt" style="color:${s}">
          <ha-icon icon="mdi:timer-sand" style="--mdc-icon-size:14px"></ha-icon>
          ${t.waiting?"Starts in":"Cooldown"} ${this.fmtMMSS(t.remaining)}
        </span>
        <div class="cd-bar"><div class="cd-fill" style="width:${i.toFixed(1)}%;background:${s}"></div></div>
      </div>`}renderCooldownPill(t){return this.cooldownPill(this.dehumCooldown(t))}deviceMode(t){const e=this.config.panel,i="light"===t.domain?`select.sf_${e}_${t.suffix}_mode`:`select.sf_${e}_${t.suffix}_mode_set`;return this.get(i)?this.modeOf(i):""}deviceColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Environment"===t||"Temperature"===t||"Humidity"===t||"PPFD"===t||"PPFD - Plan"===t?"auto":"manual")(t)){case"sched":return this.dcSched;case"auto":return this.dcAuto;default:return this.dcManual}}deviceTile(t){const e=this.get(t.id);if(!e)return U;const i="on"===e.state&&!this.devPendingOff(t.suffix),s=`${t.domain}:${t.suffix}`,o=this.deviceOpen===s,a=this.accent(),n=this.deviceFault(t.suffix),r=!n&&i&&"off"!==this.deviceColorMode?this.deviceColorFor(this.deviceMode(t)):"",l=n?Pt:r||(i?a:"var(--secondary-text-color)");let c="";return n?c=`background:${Et};box-shadow:inset 0 0 0 1px ${Pt}`:r&&"tile"===this.deviceColorMode&&(c=`background:${Rt(r)};box-shadow:inset 0 0 0 1px ${r}`),o&&!n&&(c=`box-shadow:inset 0 0 0 1px ${a}`+(r&&"tile"===this.deviceColorMode?`;background:${Rt(r)}`:"")),W`
      <div class="tile tile-device clickable ${o?"active":""}"
        style=${c||U}
        role="button" aria-expanded=${o?"true":"false"}
        @click=${()=>this.toggleDevice(o?null:s)}>
        <div class="tile-label">${t.label}
          <ha-icon class="tile-more"
            icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        ${this.tileSummary&&!n?this.deviceSummaryRow(t):U}
        <ha-icon icon=${t.icon} style="color:${i||n?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${n?`color:${Pt}`:i?`color:${l}`:""}>
          ${n??(i?this.deviceStateText(t,e):"Off")}
        </div>
        ${i||n?U:this.renderCooldownPill(t.suffix)}
        ${this.lightDLI(t)}
        ${this.fanBadge(t)}
        ${i||n||!this.dlqHas(t.suffix)?U:W`<div class="tile-qta" style="color:${a}"
          title="Quick-toggle profile saved — quick-on restores this device's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>`}
      </div>`}lightSchedule(t,e){const i=this.config.panel,s=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""};if("PPFD - Plan"===e){const e=this.planActiveLight(t);if(e&&e.ppfd_start&&e.ppfd_stop)return[e.ppfd_start,e.ppfd_stop]}let o=s(`text.sf_${i}_${t}_schedule_start`),a=s(`text.sf_${i}_${t}_schedule_stop`);if("PPFD"===e||"PPFD - Plan"===e){const e=s(`text.sf_${i}_${t}_ppfd_start`),n=s(`text.sf_${i}_${t}_ppfd_stop`);e&&n&&("00:00"!==e||"00:00"!==n)&&(o=e,a=n)}return[o,a]}planActiveLight(t){let e;try{e=this.planInfo()}catch{return null}if(!e.active||!e.stages.length)return null;const i=e.progress?.stageId,s=e.stages.find(t=>t.stageId===i)||e.stages[0],o="light_2"===t?"light2":"light1";return s&&s[o]&&"object"==typeof s[o]?s[o]:null}lightDLI(t){if("light"!==t.domain)return U;const e=this.config.panel,i=t.suffix,s=this.modeOf(`select.sf_${e}_${i}_mode`);if("PPFD"!==s&&"PPFD - Plan"!==s)return U;let o=Number(this.get(`number.sf_${e}_${i}_ppfd_target`)?.state);if((!Number.isFinite(o)||o<=0)&&"PPFD - Plan"===s){const t=this.planActiveLight(i);t&&(o=Math.max(20,Number(t.ppfd_target)||0))}if(!Number.isFinite(o)||o<=0)return U;let[a,n]=this.lightSchedule(i,s);if(!("PPFD - Plan"!==s||/^\d/.test(a)&&/^\d/.test(n))){const t=this.planActiveLight(i);t&&t.ppfd_start&&t.ppfd_stop&&(a=t.ppfd_start,n=t.ppfd_stop)}const r=/^(\d{1,2}):(\d{2})/.exec(a),l=/^(\d{1,2}):(\d{2})/.exec(n);if(!r||!l)return U;const c=(60*+l[1]+ +l[2]-(60*+r[1]+ +r[2])+1440)%1440/60;if(c<=0)return U;const d=o*c*.0036;return W`<div class="tile-dli">
      <div>${Math.round(o)} µmol</div>
      <div class="tile-dli-v">DLI ${d.toFixed(1)}</div>
    </div>`}fanBadge(t){if("fan"!==t.suffix)return U;const e=this.config.panel,i=t.suffix,s=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o=[],a=s(`number.sf_${e}_${i}_oscillation`)||s(`sensor.sf_${e}_${i}_oscillation`);a&&"0"!==a&&o.push(`Osc ${a}`);if("on"===(s(`switch.sf_${e}_${i}_natural_wind`)||s(`binary_sensor.sf_${e}_${i}_natural_wind`))&&o.push("Nat Wind"),"Manual"!==this.modeOf(`select.sf_${e}_${i}_mode_set`)){const t=s(`number.sf_${e}_${i}_standby_speed`);t&&o.push("Stby "+("0"===t?"Off":10*Number(t)+"%"))}return o.length?W`<div class="tile-dli">${o.map(t=>W`<div>${t}</div>`)}</div>`:U}deviceSummaryRow(t){const e=this.deviceSummaryLines(t);return e.length?W`<div class="tile-summary">
          ${e.map(t=>W`<span>${t}</span>`)}
        </div>`:U}fmtClock(t){if(!this.hour12)return t;const e=/^(\d{1,2}):(\d{2})/.exec(t||"");if(!e)return t;let i=+e[1];const s=i>=12?"pm":"am";return i=i%12||12,`${i}:${e[2]}${s}`}shortDur(t){const e=/^(\d+):(\d{2})(?::(\d{2}))?$/.exec((t||"").trim());if(!e)return t||"";const i=+e[1],s=+e[2],o=+(e[3]??0);return i?s?`${i}h${s}m`:`${i}h`:s?o?`${s}m${o}s`:`${s}m`:`${o}s`}deviceSummaryLines(t){const e=this.config.panel,i=t.suffix,s=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o={"Prioritize temperature":"Pri Temp","Prioritize humidity":"Pri Humid","Temperature only":"Temp","Humidity only":"Humid","Temperature & humidity":"Temp/Humid"},a=[];if("light"===t.domain){const t=this.modeOf(`select.sf_${e}_${i}_mode`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if(a.push(t),"Manual"!==t){const[e,s]=this.lightSchedule(i,t);if(e&&s&&("00:00"!==e||"00:00"!==s)){a.push(`${this.fmtClock(e)}–${this.fmtClock(s)}`);const t=this.hrsText(e,s);t&&a.push(`LD - ${t}`)}}return a}if("blower"===i||"fan"===i){const t=this.modeOf(`select.sf_${e}_${i}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;const n=t=>"blower"===i?`${t}%`:`L${t}`,r=s("blower"===i?`number.sf_${e}_blower_running_speed`:`number.sf_${e}_fan_schedule_gear`),l=s(`number.sf_${e}_${i}_standby_speed`),c="0"===r?"Auto":r?n(r):"",d=l&&"0"!==l?n(l):"Off",h="blower"===i&&c?`${c} · Stby ${d}`:"";if("Environment"===t){const t=this.modeOf(`select.sf_${e}_${i}_run_mode`);a.push("Environment"),t&&a.push(o[t]??t),h&&a.push(h)}else if("Time Slot"===t){a.push("Time Slot");const t=s(`text.sf_${e}_${i}_schedule_start`),o=s(`text.sf_${e}_${i}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`),h&&a.push(h)}else if("Cycle"===t){a.push("Cycle");const t=s(`text.sf_${e}_${i}_cycle_run`),o=s(`text.sf_${e}_${i}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`),h&&a.push(h)}return a}if("heater"===i||"humidifier"===i||"dehumidifier"===i){const t=this.modeOf(`select.sf_${e}_${i}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;if("Time Slot"===t){a.push("Time Slot");const t=s(`text.sf_${e}_${i}_schedule_start`),o=s(`text.sf_${e}_${i}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`)}else if("Cycle"===t){a.push("Cycle");const t=s(`text.sf_${e}_${i}_cycle_run`),o=s(`text.sf_${e}_${i}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`)}else{const o=t;let n="";if("humidifier"===i){const t=s(`select.sf_${e}_humidifier_gear`);n=t?"Automatic"===t?"Auto":`L${t}`:""}else if("heater"===i){const t=s(`select.sf_${e}_heater_gear`);n=t?"Automatic"===t?"Auto":`L${t}`:""}else n=s(`select.sf_${e}_dehumidifier_gear`)||s(`select.sf_${e}_dehumidifier_level_set`)||"";a.push(n?`${o} · ${n}`:o)}return a}return[]}relatedControls(t,e){const i=this.config.panel,s=new RegExp(`^(number|select|switch|text)\\.sf_${i}_${t}(_|$)`),o=`switch.sf_${i}_${t}`,a=`number.sf_${i}_${t}_speed`,n=Mt(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(t=>s.test(t)&&t!==o&&!("fan"===e&&t===a)).sort().map(t=>{let e=this.hass?.states[t]?.attributes.friendly_name??"";return n&&e.startsWith(n)&&(e=e.slice(n.length).trim()),this.ctlRow(e||t,t)})}renderDevicePop(){const t=this.deviceOpen;if(!t)return U;const e=this.overviewDevices().find(e=>`${e.domain}:${e.suffix}`===t);if(!e)return U;const i=this.get(e.id);if(!i)return U;const s="light"===e.domain?this.renderLightBody(e,i):"fan"===e.suffix?this.renderFanBody(e,i):"blower"===e.suffix?this.renderBlowerBody(e,i):"heater"===e.suffix?this.renderHeaterBody(e,i):"dehumidifier"===e.suffix?this.renderDehumidifierBody(e,i):"humidifier"===e.suffix?this.renderHumidifierBody(e,i):this.renderGenericBody(e,i);return W`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${e.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${s}
      </div>`}devOn(t,e){const i=`power:${t}`;return i in this.draft?"on"===this.draft[i]:e}powerRow(t,e,i,s){const o=`power:${t}`,a=this.devOn(t,s),n=this.accent();return W`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${a?"on":""}"
          style=${a?`background:${n}`:""}
          @click=${()=>this.stage(o,a?"off":"on")}
          aria-label="Toggle ${i}"></button>
      </div>`}deviceBar(t,e,i){const s=Object.keys(this.draft).length>0;return this.saveBar(s,()=>this.deviceApply(t,e,i),()=>this.discardEdits(),"",i.id)}deviceApply(t,e,i){this.commitBundle(t,e);const s=`bri:${i.id}`,o=`pct:${i.id}`,a=`power:${i.id}`;s in this.draft&&this.hass?.callService("light","turn_on",{entity_id:i.id,brightness_pct:Number(this.draft[s])}),o in this.draft&&this.hass?.callService("fan","set_percentage",{entity_id:i.id,percentage:Number(this.draft[o])});for(const t of Object.keys(this.draft)){if(t.includes(":")||t in e)continue;const i=this.draft[t];switch(t.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:t,value:Number(i)});break;case"select":this.hass?.callService("select","select_option",{entity_id:t,option:i});break;case"text":this.hass?.callService("text","set_value",{entity_id:t,value:i});break;case"switch":this.hass?.callService("switch","on"===i?"turn_on":"turn_off",{entity_id:t})}}if(a in this.draft){const t="on"===this.draft[a],e="light"===i.domain&&s in this.draft||"fan"===i.domain&&o in this.draft;if(!t||!e){const e="fan"===i.domain?"fan":"light"===i.domain?"light":"switch";this.hass?.callService(e,t?"turn_on":"turn_off",{entity_id:i.id})}}const n="off"===this.draft[a];this.draft={};const r=i.id.split(".")[1]?.replace(`sf_${this.config.panel}_`,"");r&&this.dlqClear(r),r&&n&&this.markDevOff(r)}renderGenericBody(t,e){const i="on"===e.state,s="fan"===t.domain?"fan":"switch",o=Math.round(e.attributes.percentage??0),a="fan"===t.domain?this.speedRow(t,i?o:0,0,10):U;return W`${this.powerRow(t.id,s,t.label,i)}${a}${this.relatedControls(t.suffix,t.domain)}${this.deviceBar(`text.sf_${this.config.panel}_${t.suffix}_apply`,{},t)}`}speedRow(t,e,i=0,s=0){const o=`pct:${t.id}`,a=o in this.draft?Number(this.draft[o]):e,n=s>0?Array.from({length:s},(t,e)=>{const i=e+1;return{value:Math.round(i/s*100),label:String(i),sel:Math.round(a/100*s)===i}}):(()=>{const t=[];i<=0&&t.push({value:0,label:"Off",sel:0===a});for(let e=Math.max(i,1);e<=100;e+=1)t.push({value:e,label:e+"%",sel:e===a});return t})();return W`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Speed</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(o,t.target.value)}>
            ${n.map(t=>W`<option value=${t.value}
              ?selected=${t.sel}>${t.label}</option>`)}
          </select>
        </span>
      </div>`}brightnessRow(t,e){const i=`bri:${t.id}`,s=i in this.draft?Number(this.draft[i]):e,o=[];for(let t=11;t<=100;t+=1)o.push(t);return W`
      <div class="dev-row ${i in this.draft?"staged":""}">
        <span class="dev-lbl">Brightness</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(i,t.target.value)}>
            ${o.map(t=>W`<option value=${t} ?selected=${t===s}>${t+"%"}</option>`)}
          </select>
        </span>
      </div>`}renderHeaterBody(t,e){const i=this.config.panel,s="on"===e.state,o=`select.sf_${i}_heater_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_heater_level`,l=`text.sf_${i}_heater_apply`,c=this.numOpts(1,10,1,t=>`L${t}`),d=[];if(a&&d.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&d.push(this.powerRow(t.id,"switch",t.label,s)),"Manual"===n)d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${i}_heater_schedule_start`,s=`text.sf_${i}_heater_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[s]:"schedule_end",[r]:"gear"};d.push(this.stagedPeriodRow(e,s,"Schedule")),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${i}_heater_cycle_start`,s=`text.sf_${i}_heater_cycle_run`,a=`text.sf_${i}_heater_cycle_off`,n=`number.sf_${i}_heater_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};d.push(this.stagedRow("Start Time",e,"time")),d.push(this.stagedRow("Run Time",s,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",n)),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,h,t))}else if("Temperature"===n){const e=`select.sf_${i}_heater_gear`,s=!!this.get(e),a=s?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"gear"};d.push(s?this.stagedRow("Gear",e):this.optSelectRow("Gear",r,c)),d.push(this.infoRow("Automatic follows the day/night temperature targets; 1–10 sets a fixed level","")),d.push(this.deviceBar(l,a,t))}return d}renderDehumidifierBody(t,e){const i=this.config.panel,s="on"===e.state,o=`select.sf_${i}_dehumidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`select.sf_${i}_dehumidifier_level`,l=`text.sf_${i}_dehumidifier_apply`,c=[];if(a&&c.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&c.push(this.powerRow(t.id,"switch",t.label,s)),"Manual"===n)c.push(this.ctlRow("Wind Speed",r)),c.push(this.deviceBar(l,{[o]:"mode",[r]:"wind",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${i}_dehumidifier_schedule_start`,s=`text.sf_${i}_dehumidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[s]:"schedule_end",[r]:"wind"};c.push(this.stagedPeriodRow(e,s,"Schedule")),c.push(this.stagedRow("Wind Speed",r)),c.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${i}_dehumidifier_cycle_start`,s=`text.sf_${i}_dehumidifier_cycle_run`,a=`text.sf_${i}_dehumidifier_cycle_off`,n=`number.sf_${i}_dehumidifier_cycle_times`,d={[o]:"mode",[e]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"wind"};c.push(this.stagedRow("Start Time",e,"time")),c.push(this.stagedRow("Run Time",s,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",n)),c.push(this.stagedRow("Wind Speed",r)),c.push(this.deviceBar(l,d,t))}else if("Humidity"===n){const e=`select.sf_${i}_dehumidifier_gear`,s=!!this.get(e),a=s?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"wind"};c.push(this.stagedRow("Wind Speed",s?e:r)),c.push(this.infoRow("Runs on the tent's day/night humidity targets, at Low or High power","")),c.push(this.deviceBar(l,a,t))}return c}renderHumidifierBody(t,e){const i=this.config.panel,s="on"===e.state,o=`select.sf_${i}_humidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_humidifier_level`,l=`text.sf_${i}_humidifier_apply`,c=this.numOpts(1,4,1,t=>`L${t}`),d=[];if(a&&d.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&d.push(this.powerRow(t.id,"switch",t.label,s)),"Manual"===n)d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${t.id}`]:"onoff"},t));else if("Time Slot"===n){const e=`text.sf_${i}_humidifier_schedule_start`,s=`text.sf_${i}_humidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[s]:"schedule_end",[r]:"gear"};d.push(this.stagedPeriodRow(e,s,"Schedule")),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,a,t))}else if("Cycle"===n){const e=`text.sf_${i}_humidifier_cycle_start`,s=`text.sf_${i}_humidifier_cycle_run`,a=`text.sf_${i}_humidifier_cycle_off`,n=`number.sf_${i}_humidifier_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};d.push(this.stagedRow("Start Time",e,"time")),d.push(this.stagedRow("Run Time",s,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",n)),d.push(this.optSelectRow("Gear",r,c)),d.push(this.deviceBar(l,h,t))}else if("Humidity"===n){const e=`select.sf_${i}_humidifier_gear`,s=!!this.get(e),a=s?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[r]:"gear"};d.push(s?this.stagedRow("Gear",e):this.optSelectRow("Gear",r,c)),d.push(this.infoRow("Automatic follows the day/night humidity targets; 1–4 sets a fixed level","")),d.push(this.deviceBar(l,a,t))}return d}textState(t){const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}durMinutes(t,e){const i=t=>{const e=/^(\d{1,2}):(\d{2})/.exec(t);return e?60*Number(e[1])+Number(e[2]):null},s=i(this.textState(t)),o=i(this.textState(e));if(null==s||null==o)return null;let a=(o-s+1440)%1440;return 0===a&&(a=1440),a}durationText(t,e){const i=this.durMinutes(t,e);return null==i?null:`${Math.floor(i/60)}h ${String(i%60).padStart(2,"0")}min`}infoRow(t,e){return W`<div class="dev-row">
      <span class="dev-lbl">${t}</span><span class="dev-spacer"></span>
      <span class="dev-val">${e}</span>
    </div>`}ctlRow(t,e){if(!this.get(e))return U;const i="switch"===e.split(".")[0]?this.stagedSwitch(e):this.stagedInput(e);return W`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${i}</div>
    </div>`}renderLightBody(t,e){const i=this.config.panel,s=t.suffix,o="on"===e.state,a=`select.sf_${i}_${s}_mode`,n=this.get(a),r=this.modeOf(a),l=this.get(`sensor.sf_${i}_${s}_brightness`),c=this.get(`sensor.sf_${i}_ppfd`),d=l&&Number.isFinite(Number(l.state))?`${Math.round(Number(l.state))}%`:"—",h=c&&Number.isFinite(Number(c.state))?`${Math.round(Number(c.state))} µmol`:"—",p=`text.sf_${i}_${s}_apply`,u=`number.sf_${i}_${s}_go_dark`,g=`number.sf_${i}_${s}_turn_off`,m=[];let f=!1;try{f=!!this.planInfo().active}catch{f=!1}const v=f?["Manual","PPFD - Plan"]:["Manual","Time Slot","PPFD"];if(n&&m.push(this.liveModeRow("Mode",a,void 0,v)),m.push(this.powerRow(t.id,"light",t.label,o)),"Manual"===r){const i=Math.round((e.attributes.brightness??0)/255*100),s={[a]:"mode",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.brightnessRow(t,o?i:0)),m.push(this.infoRow("Current PPFD",h)),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,s,t))}else if("Time Slot"===r){const e=`text.sf_${i}_${s}_schedule_start`,o=`text.sf_${i}_${s}_schedule_stop`,n=`number.sf_${i}_${s}_schedule_brightness`,r=`number.sf_${i}_${s}_fade`,l={[a]:"mode",[e]:"schedule_start",[o]:"schedule_end",[n]:"schedule_brightness",[r]:"fade_minutes",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${d} · ${h}`));const c=this.durationText(e,o);c&&m.push(this.infoRow("Light duration",c)),m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(this.optSelectRow("Target Brightness",n,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,l,t))}else if("PPFD"===r||"PPFD - Plan"===r){const e=`text.sf_${i}_${s}_ppfd_start`,o=`text.sf_${i}_${s}_ppfd_stop`,n=`number.sf_${i}_${s}_ppfd_target`,r=`number.sf_${i}_${s}_ppfd_fade`,l=`number.sf_${i}_${s}_ppfd_min`,c=`number.sf_${i}_${s}_ppfd_max`,f={[a]:"mode",[e]:"ppfd_start",[o]:"ppfd_end",[n]:"ppfd_target",[r]:"ppfd_fade_minutes",[l]:"ppfd_min",[c]:"ppfd_max",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${d} · ${h}`));const v=this.durationText(e,o),_=this.durMinutes(e,o),b=Number(this.get(n)?.state);if(v&&null!=_&&Number.isFinite(b)){const t=b*_*60/1e6;m.push(this.infoRow("DLI · duration",`${t.toFixed(2)} mol/m²/day · ${v}`))}else v&&m.push(this.infoRow("Light duration",v));m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(W`<div class="dev-row ${n in this.draft?"staged":""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(n,this.numOpts(20,2e3,10,t=>`${t} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",l,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Dimming Range Max",c,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,f,t))}return m}renderFanBody(t,e){const i=this.config.panel,s="on"===e.state,o=`select.sf_${i}_fan_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_fan_oscillation`,l=`number.sf_${i}_fan_schedule_gear`,c=`number.sf_${i}_fan_standby_speed`,d=`switch.sf_${i}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",l,this.numOpts(1,10,1,t=>`L${t}`)),p=Math.max(1,Math.round(Number(this.draftVal(l))||1)),u=["","0"].includes(String(this.draftVal(l))),g=()=>this.optSelectRow("Standby Speed",c,this.offOpts(1,u?10:p-1)),m=()=>this.optSelectRow("Oscillation",r,this.offOpts(1,10)),f=`text.sf_${i}_fan_apply`,v=[];if(a&&v.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&v.push(this.powerRow(t.id,"fan",t.label,s)),"Manual"===n){const i=Math.round(e.attributes.percentage??0);v.push(this.speedRow(t,s?i:0,0,10)),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,{[o]:"mode"},t))}else if("Time Slot"===n){const e={[o]:"mode",[`text.sf_${i}_fan_schedule_start`]:"schedule_start",[`text.sf_${i}_fan_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${i}_fan_schedule_start`,`text.sf_${i}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,e,t))}else if("Cycle"===n){const e=`text.sf_${i}_fan_cycle_start`,s=`text.sf_${i}_fan_cycle_run`,a=`text.sf_${i}_fan_cycle_off`,n=`number.sf_${i}_fan_cycle_times`,r={[o]:"mode",[e]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedRow("Start Time",e,"time")),v.push(this.stagedRow("Run Duration",s,"duration")),v.push(this.stagedRow("Off Duration",a,"duration")),v.push(this.stagedRangeRow("Execution Times",n)),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,r,t))}else if("Environment"===n){const e=`select.sf_${i}_fan_run_mode`,s={[o]:"mode",[e]:"env_submode",[l]:"schedule_speed",[c]:"standby_speed"};v.push(this.stagedRow("Run Mode",e)),v.push(this.optSelectRow("Gear",l,this.autoOpts(1,10,1,t=>`L${t}`))),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",d)),v.push(this.deviceBar(f,s,t))}return v}renderBlowerBody(t,e){const i=this.config.panel,s="on"===e.state,o=`select.sf_${i}_blower_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_blower_running_speed`,l=`number.sf_${i}_blower_standby_speed`,c=`switch.sf_${i}_blower_close_co2`,d=`text.sf_${i}_blower_apply`,h=()=>this.optSelectRow("Running Speed",r,this.numOpts(25,100,1,t=>`${t}%`)),p=["","0"].includes(String(this.draftVal(r))),u=Math.max(25,Math.round(Number(this.draftVal(r))||25)),g=()=>this.optSelectRow("Standby Speed",l,this.offOpts(25,p?100:u-1)),m=[];if(a&&m.push(this.liveModeRow("Mode",o,t.id)),"Manual"===n&&m.push(this.powerRow(t.id,"fan",t.label,s)),"Manual"===n){const i=Math.round(e.attributes.percentage??0);m.push(this.speedRow(t,s?i:0,25)),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,{[o]:"mode"},t))}else if("Time Slot"===n){const e={[o]:"mode",[`text.sf_${i}_blower_schedule_start`]:"schedule_start",[`text.sf_${i}_blower_schedule_stop`]:"schedule_end",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedPeriodRow(`text.sf_${i}_blower_schedule_start`,`text.sf_${i}_blower_schedule_stop`,"Schedule")),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,e,t))}else if("Cycle"===n){const e=`text.sf_${i}_blower_cycle_start`,s=`text.sf_${i}_blower_cycle_run`,a=`text.sf_${i}_blower_cycle_off`,n=`number.sf_${i}_blower_cycle_times`,p={[o]:"mode",[e]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Start Time",e,"time")),m.push(this.stagedRow("Run Duration",s,"duration")),m.push(this.stagedRow("Off Duration",a,"duration")),m.push(this.stagedRangeRow("Execution Times",n)),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,p,t))}else if("Environment"===n){const e=`select.sf_${i}_blower_run_mode`,s={[o]:"mode",[e]:"env_submode",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Run Mode",e)),m.push(this.optSelectRow("Running Speed",r,this.autoOpts(25,100,1,t=>`${t}%`))),m.push(g()),m.push(this.ctlRow("Close CO2 Device",c)),m.push(this.deviceBar(d,s,t))}return m}cycleIsDay(){const t=this.config.panel,e=this.get(`binary_sensor.sf_${t}_daytime_schedule`);if(e&&("on"===e.state||"off"===e.state))return"on"===e.state;const i=jt(this.get(`text.sf_${t}_env_day_start`)?.state),s=jt(this.get(`text.sf_${t}_env_day_end`)?.state);if(null==i||null==s)return null;const o=new Date,a=60*o.getHours()+o.getMinutes();return i<=s?a>=i&&a<s:a>=i||a<s}lightLeak(){if(!1!==this.cycleIsDay())return{on:!1,text:""};const t=this.config.panel,e=this.get(`sensor.sf_${t}_ppfd`);if(e){const t=Number(e.state);return Number.isFinite(t)&&t>1?{on:!0,text:`Light detected · ${Math.round(t)} µmol`}:{on:!1,text:""}}const i=this.get(`binary_sensor.sf_${t}_daytime_light_sensor`);return i&&"on"===i.state?{on:!0,text:"Light detected"}:{on:!1,text:""}}renderParamsHead(){const t=this.cycleIsDay(),e=this.lightLeak(),i=null===t?U:W`<span class="cycle-badge"
          style="color:${t?"#e0a83a":"#8f9bd4"};background:${t?"rgba(224,168,58,0.14)":"rgba(143,155,212,0.16)"}">
          <ha-icon icon=${t?"mdi:white-balance-sunny":"mdi:weather-night"}></ha-icon>${t?"Day Cycle":"Night Cycle"}</span>`;return W`
      <div class="params-head">
        <span class="ph-label">Parameters</span>
        <span class="ph-mid">${e.on?W`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${e.text}</span>`:U}</span>
        ${i}
      </div>`}renderEnergyTile(){if(this.hideEnergyTile)return U;const t=this.config.panel;if(!this.get(`sensor.sf_${t}_power`))return U;const e=(e,i,s)=>{const o=this.get(`sensor.sf_${t}_${e}`),a=o?Number(o.state):NaN;return Number.isFinite(a)?`${a.toFixed(s)}${i}`:"–"},i="power"===this.paramOpen,s=this.accent();return W`
      <div class="section-label">Energy Usage</div>
      <div class="grid">
        <div class="tile clickable ${i?"active":""}"
          style=${i?`box-shadow:inset 0 0 0 1px ${s}`:U}
          role="button" aria-expanded=${i?"true":"false"}
          @click=${()=>this.toggleGraph("power")}>
          <div class="tile-label"><span class="tl-name">Power</span></div>
          <ha-icon icon="mdi:flash" style="color:${s}"></ha-icon>
          <div class="tile-val">${e("power","",0)}<span class="unit">W</span></div>
          <div class="tile-target">${e("voltage"," V",0)} · ${e("current"," A",2)}</div>
          <div class="tile-target">${e("energy"," kWh",2)}</div>
        </div>
      </div>
      ${i?this.renderParamGraph():U}`}renderOverview(){const t=Tt.map(t=>this.renderParam(t)).filter(t=>t!==U),e=this.soilStatsTile(),i=this.overviewDevices();return W`
      ${t.length||e!==U?W`${this.renderParamsHead()}
            <div class="grid">${t}${e}</div>
            ${"power"===this.paramOpen?U:this.renderParamGraph()}
            ${this.renderSoilPop()}
            ${this.renderSoilAllTable()}`:U}
      ${this.renderEnergyTile()}
      ${i.length?W`<div class="section-label">Devices</div>
            ${this.renderDeviceQuickRow()}
            <div class="grid">${i.map(t=>this.deviceTile(t))}</div>
            ${this.renderDevicePop()}`:U}
      ${(this.outletsOnOverview||this.outletQuickOverview)&&this.hasOutlets()?W`<div class="section-label">Outlets</div>
            ${this.outletQuickOverview?this.outletSlots().map(t=>this.renderQuickRow(t)):U}
            ${this.outletsOnOverview?W`
            <div class="grid">
              ${this.outletSlots().map(t=>this.outletNums(t).map(e=>this.outletTile(t,e)))}
            </div>
            ${this.renderOutletPop()}`:U}`:U}`}draftVal(t){if(t in this.draft)return this.draft[t];const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}stage(t,e){this.draft={...this.draft,[t]:e}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(t){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=t}modeOf(t,e="Manual"){return this.modePick[t]??this.get(t)?.state??e}stagedInput(t,e){const i=this.get(t);if(!i)return U;const s=t.split(".")[0],o=this.draftVal(t);if(!e&&"number"===s){const e=i.attributes.min??0,s=i.attributes.max??100,a=i.attributes.step??1,n=i.attributes.unit_of_measurement??"";return W`<span class="num-box">
        <input type="number" min=${e} max=${s} step=${a} .value=${o}
          @input=${e=>this.stage(t,e.target.value)} />
        <span class="unit">${n}</span></span>`}if(!e&&"select"===s){const e=i.attributes.options??[];return W`<select @change=${e=>this.stage(t,e.target.value)}>
        ${e.map(t=>W`<option value=${t} .selected=${t===o}>${t}</option>`)}
      </select>`}if("duration"===e)return this.durationInput(t);const a="time"===e||/^\d{1,2}:\d{2}/.test(o);return W`<input type=${a?"time":"text"} .value=${o}
      @change=${e=>this.stage(t,e.target.value)} />`}durationInput(t){const e=(this.draftVal(t)||"").trim(),i=/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(e),s=i?+i[1]:0,o=i?+i[2]:0,a=i?+(i[3]??0):0,n=t=>String(t).padStart(2,"0"),r=(e,i,s)=>this.stage(t,`${n(Math.max(0,Math.min(99,e)))}:${n(Math.max(0,Math.min(59,i)))}:${n(Math.max(0,Math.min(59,s)))}`),l=(t,e,i,s)=>W`
      <span class="dur-box">
        <input type="number" min="0" max=${e} step="1" .value=${String(t)}
          @input=${t=>s(Math.floor(Number(t.target.value)||0))} />
        <span class="dur-unit">${i}</span>
      </span>`;return W`<span class="dur-input">
      ${l(s,99,"h",t=>r(t,o,a))}
      ${l(o,59,"min",t=>r(s,t,a))}
      ${l(a,59,"s",t=>r(s,o,t))}
    </span>`}numOpts(t,e,i=1,s=String){const o=[],a=(String(i).split(".")[1]||"").length,n=i>0?Math.round((e-t)/i):0;for(let e=0;e<=n;e++){const n=Number((t+e*i).toFixed(a));o.push({label:s(n),value:String(n)})}return o}offOpts(t,e,i=1,s){return[{label:"Off",value:"0"},...this.numOpts(t,e,i,s)]}autoOpts(t,e,i=1,s){return[{label:"Automatic",value:"0"},...this.numOpts(t,e,i,s)]}optSelect(t,e,i=!1){if(!this.get(t))return U;const s=this.draftVal(t),o=e.find(t=>Number(t.value)===Number(s))?.value??e.find(t=>t.value===s)?.value??s;return W`<select @change=${e=>{const s=e.target.value;i?this.hass?.callService("number","set_value",{entity_id:t,value:Number(s)}):this.stage(t,s)}}>
      ${e.map(t=>W`
        <option value=${t.value} .selected=${String(t.value)===String(o)}>${t.label}</option>`)}
    </select>`}optSelectRow(t,e,i,s=!1){if(!this.get(e))return U;const o=!s&&e in this.draft?"dev-row staged":"dev-row";return W`<div class=${o}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.optSelect(e,i,s)}</div>
    </div>`}stagedRow(t,e,i){if(!this.get(e))return U;const s=e in this.draft?"dev-row staged":"dev-row";return W`<div class=${s}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.stagedInput(e,i)}</div>
    </div>`}stagedRangeRow(t,e,i){const s=this.get(e);if(!s)return U;const o=Math.round(Number(s.attributes.min??1)),a=Math.round(Number(s.attributes.max??100)),n=Math.max(1,Math.round(Number(s.attributes.step??1)));return this.optSelectRow(t,e,this.numOpts(o,a,n,i))}stagedPeriodRow(t,e,i){const s=this.get(t),o=this.get(e);if(!s&&!o)return U;const a=t in this.draft||e in this.draft;return W`<div class="dev-row period-row ${a?"staged":""}">
      <span class="dev-lbl">${i}</span>
      <div class="period-times">
        ${s?this.stagedInput(t,"time"):U}
        <span class="dash">–</span>
        ${o?this.stagedInput(e,"time"):U}
      </div>
    </div>`}liveModeRow(t,e,i,s){const o=this.get(e);if(!o)return U;const a=s??o.attributes.options??[],n=this.modeOf(e,o.state);return W`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">
        <select @change=${t=>{const s=t.target.value;this.modePick={...this.modePick,[e]:s},this.draft=i&&"Manual"===s?{[e]:s,[`power:${i}`]:"off"}:{[e]:s}}}>
          ${a.map(t=>W`
            <option value=${t} .selected=${t===n}>${t}</option>`)}
        </select>
      </div>
    </div>`}commitBundle(t,e){const i={};for(const[t,s]of Object.entries(e))if(t in this.draft){const e=this.draft[t];i[s]="number"===t.split(".")[0]?Number(e):e}if(!Object.keys(i).length)return;const s=t.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),o=s?"light_1"===s[1]?"light":"light_2"===s[1]?"light2":s[1]:null;o&&!this.get(t)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(e)[0],module:o,settings:i}):this.hass?.callService("text","set_value",{entity_id:t,value:JSON.stringify(i)});const a={...this.draft};for(const t of Object.keys(e))delete a[t];this.draft=a}stagedSwitch(t){const e="on"===this.draftVal(t);return W`<button class="toggle ${e?"on":""}"
      style=${e?`background:${this.accent()}`:""}
      @click=${()=>this.stage(t,e?"off":"on")} aria-label="Toggle"></button>`}stagedCtl(t,e,i){const s=this.get(t);if(!s)return U;const o=e??s.attributes.friendly_name??t.split(".")[1],a="switch"===t.split(".")[0]?this.stagedSwitch(t):this.stagedInput(t,i),n=t in this.draft;return W`
      <div class="ctl ${n?"staged":""}">
        <div class="ctl-label">${o}</div>
        <div class="ctl-input">${a}</div>
      </div>`}applyStaged(t){for(const e of t){if(!(e in this.draft))continue;const t=this.draft[e];switch(e.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:e,value:Number(t)});break;case"text":this.hass?.callService("text","set_value",{entity_id:e,value:t});break;case"select":this.hass?.callService("select","select_option",{entity_id:e,option:t});break;case"switch":this.hass?.callService("switch","on"===t?"turn_on":"turn_off",{entity_id:e})}}const e={...this.draft};for(const i of t)delete e[i];this.draft=e}discardStaged(t){const e={...this.draft};let i=!1;for(const s of t)s in e&&(delete e[s],i=!0);i&&(this.draft=e)}applyBar(t,e={}){const i=!!e.extraDirty||t.some(t=>t in this.draft);return this.saveBar(i,()=>{this.applyStaged(t),e.onApply?.()},()=>{this.discardStaged(t),e.onDiscard?.()},"apply-bar")}envIds(){const t=this.config.panel,e=[];for(const i of[`text.sf_${t}_env_day_start`,`text.sf_${t}_env_day_end`])this.get(i)&&e.push(i);for(const[,i,s,o]of Jt)for(const a of[s,i,o]){const i=`number.sf_${t}_${a}`;this.get(i)&&e.push(i)}for(const i of["leaf_vpd_min","leaf_vpd_max"]){const s=`number.sf_${t}_${i}`;this.get(s)&&e.push(s)}return e}caliIds(){const t=this.config.panel,e=[];for(const i of["cal_air_temp","cal_air_humidity","cal_ppfd","cal_co2"]){const s=`number.sf_${t}_${i}`;this.get(s)&&e.push(s)}for(const i of this.caliSoilSlots()){for(const s of["cal_temp","cal_moisture","cal_ec"]){const o=`number.sf_${t}_${i}_${s}`;this.get(o)&&e.push(o)}const s=`select.sf_${t}_${i}_substrate`;this.get(s)&&e.push(s)}for(const i of[`number.sf_${t}_leaf_offset`,`number.sf_${t}_leaf_offset_night`])this.get(i)&&e.push(i);return e}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.panel??"",e=this.config.outlets??[];if(!this.hass)return e;const i=[];t&&this.get(`switch.sf_${t}_outlet_1`)&&i.push(t);const s=new Set(Ct(this.hass,t));for(const o of e)o!==t&&s.has(o)&&i.push(o);return i}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}outletOnly(){if(!this.hasOutlets())return!1;const t=!(!this.get(this.eid("sensor","temperature"))&&!this.get(this.eid("sensor","humidity"))),e=!!this.get(this.eid("sensor","soil_avg_temperature")),i=this.overviewDevices().length>0,s=!!this.get(this.eid("number","env_temp_day"));return!(t||e||i||s)}rangeSelect(t){const e=this.get(t);if(!e)return U;const i=Number(e.attributes.min??0),s=Number(e.attributes.max??100),o=Number(e.attributes.step??1)||1,a=e.attributes.unit_of_measurement??"";return this.optSelect(t,this.numOpts(i,s,o,t=>`${t}${a}`),!1)}envControl(t,e){return this.get(t)?W`
      <div class="ctl">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">${this.rangeSelect(t)}</div>
      </div>`:U}planEntity(){return this.get(`sensor.sf_${this.config.panel}_plan`)}hasPlan(){return!!this.planEntity()}planInfo(){const t=this.planEntity(),e=t?.attributes??{};return{active:!!e.active,stages:Array.isArray(e.stages)?e.stages:[],progress:e.progress&&"object"==typeof e.progress?e.progress:{}}}renderEnv(){if(!this.hasEnv())return W`<div class="cali-empty">No environment targets reported for this device yet.</div>`;if(!this.hasPlan())return this.renderEnvBody(!0);const t=this.planInfo(),e=this.envSubView??(t.active?"plan":"env"),i=this.accent(),s=(t,s)=>W`
      <button class="env-seg ${e===t?"active":""}"
        style=${e===t?`color:${i};border-color:${i}`:""}
        @click=${()=>this.envSubView=t}>${s}</button>`;return W`
      <div class="env-seg-row">
        ${s("env","Environment")}
        ${s("plan","Planting Plan")}
      </div>
      ${"plan"===e?this.renderPlan(t):this.renderEnvBody(!1)}`}renderEnvBody(t){const e=this.config.panel,i=`text.sf_${e}_env_day_start`,s=`text.sf_${e}_env_day_end`,o=this.get(i)||this.get(s);return W`
      ${t?W`<div class="section-label">Environment</div>`:U}
      ${o?W`<div class="env-cycle">
            ${this.stagedCtl(i,"Day Cycle Start","time")}
            ${this.stagedCtl(s,"Day Cycle Stop","time")}
          </div>`:U}
      ${Jt.map(([t,i,s,o,a])=>this.get(`number.sf_${e}_${i}`)?W`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${a} style="color:${this.accent()}"></ha-icon>
              <span>${t}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${e}_${s}`,"Night")}
              ${this.envControl(`number.sf_${e}_${i}`,"Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${e}_${o}`,"Dead Zone")}
            </div>
          </div>`:U)}
      ${this.renderLeafVpdTargets()}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`}renderPlan(t){if(null!=this.planEditStage&&this.planDraft)return this.renderStageEditor(this.planEditStage);if(this.planTplOpen)return this.renderPlanTemplatePicker();const e=this.accent(),i=`switch.sf_${this.config.panel}_plan_enabled`,s=!!this.get(i),o=t.stages,a=t.progress||{},n=t=>{const e=Math.max(0,o.findIndex(e=>e.stageId===t)),i=this.planShowAll?o.map((t,e)=>e):[e];return W`
        <div class="section-label">Stages</div>
        ${i.map(e=>this.renderPlanStage(o[e],t,e))}
        ${o.length>1?W`<button class="plan-editbtn" style="margin:2px 0 6px"
          @click=${()=>{this.planShowAll=!this.planShowAll}}>
          ${this.planShowAll?"Show less":`Show all ${o.length} stages`}</button>`:U}
        <div style="display:flex;gap:10px">
          <button class="plan-btn" style="flex:1" @click=${()=>this.addPlanStage()}>+ Add stage</button>
          <button class="plan-btn" style="flex:1" @click=${()=>{this.planTplOpen="append"}}>+ From template</button>
        </div>`},r=(t,s)=>"start"===this._planPending&&!s||"stop"===this._planPending&&s?W`
          <button class="plan-btn ${s?"stop":"start"}" disabled
            style="opacity:.7;cursor:default${s?"":`;background:${e};border-color:${e};color:#0c1f06`}">
            ${"start"===this._planPending?"Starting — Please Wait…":"Stopping — Please Wait…"}
          </button>`:W`
        <button class="plan-btn ${s?"stop":"start"}"
          style=${s?"":`background:${e};border-color:${e};color:#0c1f06`}
          @click=${()=>{this.envSubView="plan",this._planPending=s?"stop":"start",this._planPendTimer&&clearTimeout(this._planPendTimer),this._planPendTimer=setTimeout(()=>{this._planPending="",this.requestUpdate()},15e3),this.hass?.callService("switch",s?"turn_off":"turn_on",{entity_id:i}),this.setPlanLights(!s)}}>
          ${t}</button>`;if(!t.active)return o.length?W`
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
        ${s?W`<div class="plan-actions">${r("Start Plan",!1)}</div>`:U}`:W`
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
          </div>`;const l=o.find(t=>t.stageId===a.stageId)||o[0],c=Number(a.progress),d=Number.isFinite(c),h=[];return null!=a.planted&&h.push(`${this.fmtNum(a.planted)} planted`),null!=a.remain&&h.push(`${this.fmtNum(a.remain)} left`),null!=a.totalDays&&h.push(`${this.fmtNum(a.totalDays)} total`),W`
      <div class="plan-banner">
        <ha-icon icon="mdi:sprout" style="color:${e}"></ha-icon>
        <div style="flex:1">
          <div class="plan-banner-title">${l&&l.label||"Planting plan active"}</div>
          <div class="plan-banner-sub">
            ${h.length?h.join(" · ")+" days":`${o.length} stage${1===o.length?"":"s"} · managed by the controller`}
          </div>
        </div>
        ${d?W`<div class="plan-pct" style="color:${e}">${Math.round(c)}%</div>`:U}
      </div>
      ${d?W`<div class="plan-bar"><div class="plan-bar-fill"
            style="width:${Math.max(0,Math.min(100,c))}%;background:${e}"></div></div>`:U}
      ${n(a.stageId)}
      ${s?W`<div class="plan-actions">${r("Stop Plan",!0)}</div>`:U}
      <div class="plan-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>While a plan is active the controller sets temperature, humidity
        and CO₂ from the plan schedule. Switch to Environment to see the manual
        targets used when no plan runs.</span>
      </div>`}decodePlanDate(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return null;const i=255&e,s=(e>>8)-494344;if(s<=0||i<1||i>31)return null;const o=new Date(Math.floor((s-1)/12),(s-1)%12,i);return isNaN(o.getTime())?null:o}planStageDates(t){const e=this.decodePlanDate(t.start),i=this.decodePlanDate(t.end);if(!e||!i)return"";const s=t=>t.toLocaleDateString(void 0,{month:"short",day:"numeric"}),o=Math.round((i.getTime()-e.getTime())/864e5)+1,a=e.getFullYear()!==i.getFullYear()?`, ${i.getFullYear()}`:"";return`${s(e)} – ${s(i)}${a} · ${o} day${1===o?"":"s"}`}encodePlanCode(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t||"");if(!e)return null;const i=+e[1],s=+e[2],o=+e[3];return s<1||s>12||o<1||o>31?null:12*i+s+494344<<8|o}codeToInputDate(t){const e=this.decodePlanDate(t);if(!e)return"";const i=t=>String(t).padStart(2,"0");return`${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}`}tempUnitF(){const t=this.get(`number.sf_${this.config.panel}_env_temp_day`)?.attributes?.unit_of_measurement;return"°F"===t||"℉"===t}peSelect(t,e,i){const s=e.find(e=>Number(e.value)===Number(t))?.value??e.find(e=>e.value===String(t))?.value??String(t??"");return W`<select class="pe-sel" @change=${t=>i(t.target.value)}>
      ${e.map(t=>W`<option value=${t.value}
        .selected=${String(t.value)===String(s)}>${t.label}</option>`)}
    </select>`}envOptsFor(t){const e=this.get(`number.sf_${this.config.panel}_${t}`),i=Number(e?.attributes?.min??0),s=Number(e?.attributes?.max??100),o=Number(e?.attributes?.step??1)||1,a=e?.attributes?.unit_of_measurement??"";return this.numOpts(i,s,o,t=>`${t}${a}`)}epochToLocalInput(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return"";const i=new Date(1e3*e),s=t=>String(t).padStart(2,"0");return`${i.getFullYear()}-${s(i.getMonth()+1)}-${s(i.getDate())}T${s(i.getHours())}:${s(i.getMinutes())}`}localInputToEpoch(t){const e=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(t||"");if(e)return Math.floor(new Date(+e[1],+e[2]-1,+e[3],+e[4],+e[5]).getTime()/1e3)}threshToDisp(t){const e=Number(t);return Number.isFinite(e)&&0!==e?String(this.tempUnitF()?Math.round(9*e/5+32):Math.round(e)):"0"}threshToC(t){const e=Number(t);return Number.isFinite(e)&&0!==e?this.tempUnitF()?Math.round(5*(e-32)/9*1e4)/1e4:e:0}threshOpts(){const t=this.tempUnitF(),e=t?"°F":"°C";return[{label:"Off",value:"0"},...this.numOpts(t?59:15,t?122:50,1,t=>`${t}${e}`)]}durText(t,e){const i=/^(\d{2}):(\d{2})/.exec(t||""),s=/^(\d{2}):(\d{2})/.exec(e||"");if(!i||!s)return"";let o=(60*+s[1]+ +s[2]-(60*+i[1]+ +i[2])+1440)%1440;0===o&&t===e&&(o=0);return`${Math.floor(o/60)}h ${String(o%60).padStart(2,"0")}m`}hrsText(t,e){const i=/^(\d{1,2}):(\d{2})/.exec(t||""),s=/^(\d{1,2}):(\d{2})/.exec(e||"");if(!i||!s)return"";const o=(60*+s[1]+ +s[2]-(60*+i[1]+ +i[2])+1440)%1440;return`${Math.floor(o/60)}:${String(o%60).padStart(2,"0")}hrs`}startPlanEdit(t=!1){const e=this.tempUnitF(),i=t=>{const i=Number(t);return null!=t&&""!==t&&Number.isFinite(i)?e?Math.round(9*i/5+32):Math.round(10*i)/10:""},s=t=>{const i=Number(t);return null!=t&&""!==t&&Number.isFinite(i)?e?Math.round(9*i/5):Math.round(10*i)/10:""};if(t)return this.planDraft=[{stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}],void(this.planEditStage=0);const o=t=>t?{...t,go_dark:this.threshToDisp(t.go_dark),turn_off:this.threshToDisp(t.turn_off)}:null;this.planDraft=this.planInfo().stages.map(t=>({stageId:t.stageId,label:t.label||"",start:this.codeToInputDate(t.start),end:this.codeToInputDate(t.end),alarm:this.epochToLocalInput(t.alarm),temp_day:i(t.temp_day),temp_night:i(t.temp_night),temp_dz:s(t.temp_dz),humi_day:t.humi_day??"",humi_night:t.humi_night??"",humi_dz:t.humi_dz??"",co2_day:t.co2_day??"",co2_night:t.co2_night??"",co2_dz:t.co2_dz??"",light1:o(t.light1)??{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:o(t.light2)}))}planDraftSet(t,e,i){this.planDraft&&(this.planDraft=this.planDraft.map((s,o)=>o===t?{...s,[e]:i}:s))}addPlanStage(){this.planDraft||this.startPlanEdit();const t={stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:null},e=this.planDraft??[];this.planDraft=[...e,t],this.planEditStage=e.length}removePlanStage(t){this.planDraft&&(this.planDraft=this.planDraft.filter((e,i)=>i!==t),this.planEditStage=null,this.savePlanEdit(this.planInfo().active))}savePlanEdit(t){if(!this.planDraft)return;const e=this.tempUnitF(),i=t=>{const e=Number(t);return""!==t&&null!=t&&Number.isFinite(e)?e:void 0},s=t=>{const s=i(t);if(void 0!==s)return e?Math.round(5*(s-32)/9*1e4)/1e4:s},o=t=>{if(t)return{...t,go_dark:this.threshToC(t.go_dark),turn_off:this.threshToC(t.turn_off)}},a=this.planDraft.map(t=>{const a=this.encodePlanCode(t.start),n=this.encodePlanCode(t.end);let r=this.localInputToEpoch(t.alarm);if(void 0===r){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t.start||"");e&&(r=Math.floor(new Date(+e[1],+e[2]-1,+e[3],12,0,0).getTime()/1e3))}const l={},c=(t,e,i,s)=>{const o={};void 0!==e&&(o.day=e),void 0!==i&&(o.night=i),void 0!==s&&(o.dz=s),Object.keys(o).length&&(l[t]=o)},d=(t,e,i)=>void 0!==t?t:e?void 0:i,h=this.planEnvHas("temp"),p=this.planEnvHas("humi"),u=this.planEnvHas("co2");c("temp",d(s(t.temp_day),h,25),d(s(t.temp_night),h,20),d((t=>{const s=i(t);if(void 0!==s)return e?Math.round(5*s/9*1e4)/1e4:s})(t.temp_dz),h,2)),c("humi",d(i(t.humi_day),p,60),d(i(t.humi_night),p,55),d(i(t.humi_dz),p,5)),c("co2",d(i(t.co2_day),u,500),d(i(t.co2_night),u,500),d(i(t.co2_dz),u,100));const g={stageId:t.stageId,label:t.label,start:a,end:n,alarm:r,target:l};return g.light1=o(this.planLightHas("light1")?t.light1??this.defaultPlanLight():this.offPlanLight()),g.light2=o(this.planLightHas("light2")?t.light2??this.defaultPlanLight():this.offPlanLight()),g});this.hass?.callService("sf","set_plan",{entity_id:`sensor.sf_${this.config.panel}_plan`,stages:a,enabled:t}),t&&this.setPlanLights(!0),this.planDraft=null,this.planEditStage=null}setPlanLights(t){const e=t?"PPFD - Plan":"Manual";for(const i of["light_1","light_2"]){const s=`select.sf_${this.config.panel}_${i}_mode`;if(!this.get(s))continue;this.hass?.callService("select","select_option",{entity_id:s,option:e}),this.modePick={...this.modePick,[s]:e};const o=`light.sf_${this.config.panel}_${i}`;this.get(o)&&this.hass?.callService("light",t?"turn_on":"turn_off",{entity_id:o})}}presetDraftStage(t){const e=this.tempUnitF(),i=t=>e?Math.round(9*t/5+32):Math.round(10*t)/10,s=()=>"dry"===t.key?{mode:"Time Slot",ts_start:"00:00",ts_stop:"00:00",ts_bri:11,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}:{mode:"PPFD",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:t.ppfd??300,ppfd_start:t.on??"05:00",ppfd_stop:t.off??"23:00",ppfd_fade:t.fade??30,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0};return{stageId:null,label:t.label,start:"",end:"",alarm:"",temp_day:i(t.tC),temp_night:i(t.tCn),temp_dz:(t=>e?Math.round(9*t/5):Math.round(10*t)/10)(t.tDz),humi_day:t.hd,humi_night:t.hn,humi_dz:t.hDz,co2_day:t.cd??"",co2_night:t.cn??"",co2_dz:t.cDz??"",light1:s(),light2:s()}}myTemplates(){if(this._myTpl)return this._myTpl;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e=t?.plan_templates;if(e)try{const t=JSON.parse(e);if(Array.isArray(t))return t}catch{}try{const t=JSON.parse(localStorage.getItem(Yt.MY_TPL_KEY)||"[]");return Array.isArray(t)?t:[]}catch{return[]}}saveMyTemplate(t){const e=(t||"").trim();if(!this.planDraft||!e)return;const i=this.myTemplates().filter(t=>t.name!==e);i.push({name:e,stages:JSON.parse(JSON.stringify(this.planDraft))}),this._myTpl=i,this.persistColorOption("plan_templates",JSON.stringify(i)),this.planTplName="",this._tplMsg=`“${e}” saved to My templates`,clearTimeout(this._tplMsgT),this._tplMsgT=setTimeout(()=>{this._tplMsg=""},3e3)}deleteMyTemplate(t){const e=this.myTemplates().filter(e=>e.name!==t);this._myTpl=e,this.persistColorOption("plan_templates",JSON.stringify(e)),this.requestUpdate()}usePreset(t,e){const i=this.presetDraftStage(t);e&&this.planDraft?(this.planDraft=[...this.planDraft,i],this.planEditStage=this.planDraft.length-1):(this.planDraft=[i],this.planEditStage=0),this.planTplOpen=null}useMyTemplate(t,e){const i=this.myTemplates().find(e=>e.name===t);if(!i)return;const s=JSON.parse(JSON.stringify(i.stages));e&&this.planDraft?this.planDraft=[...this.planDraft,...s]:this.planDraft=s,this.planEditStage=0,this.planTplOpen=null}renderPlanTemplatePicker(){const t=this.accent(),e="append"===this.planTplOpen,i=this.tempUnitF()?"°F":"°C",s=t=>this.tempUnitF()?Math.round(9*t/5+32):Math.round(10*t)/10,o=this.myTemplates(),a=(e,i,s,o)=>W`
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--divider-color,#2a2f31)">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
          <span style="font-weight:600">${e}</span>
          <span style="font-size:12px;color:var(--secondary-text-color)">${i}</span>
        </div>
        <span style="display:flex;gap:6px;flex:none">
          <button class="plan-editbtn" style="border-color:${t};color:${t}" @click=${s}>Use</button>
          ${o?W`<button class="plan-editbtn" @click=${o}>Delete</button>`:U}
        </span>
      </div>`;return W`
      <div class="section-label">${e?"Add a stage from a template":"New plan from a template"}</div>
      <div style="font-size:12px;color:var(--secondary-text-color);margin:2px 0 4px">System templates</div>
      ${Yt.PLAN_PRESETS.map(t=>a(`${t.emoji} ${t.label}`,"dry"===t.key?"lights off · dark · set dates on apply":`${s(t.tC)}/${s(t.tCn)}${i} · ${t.hd}/${t.hn}% RH · PPFD ${t.ppfd}`,()=>this.usePreset(t,e)))}
      <div style="font-size:12px;color:var(--secondary-text-color);margin:12px 0 4px">My templates</div>
      ${o.length?o.map(t=>a(`💾 ${t.name}`,`${t.stages.length} stage${1===t.stages.length?"":"s"}`,()=>this.useMyTemplate(t.name,e),()=>this.deleteMyTemplate(t.name))):W`<div style="font-size:12px;color:var(--secondary-text-color);padding:6px 0">
            No saved templates yet — build or edit a plan, then “Save as template”.</div>`}
      <button class="plan-btn" style="margin-top:12px" @click=${()=>{this.planTplOpen=null}}>Cancel</button>`}renderStageLight(t,e){const i=this.accent(),s=this.planDraft[t][e];if(!s)return U;const o=(i,o)=>this.planDraftSet(t,e,{...s,[i]:o}),a=t=>W`<input type="time" class="pe-in"
      .value=${String(s[t]??"")} @change=${e=>o(t,e.target.value)}>`,n=(t,e)=>this.peSelect(s[t],e,e=>o(t,e)),r=t=>W`<button class="pe-modebtn ${s.mode===t?"on":""}"
      style=${s.mode===t?`border-color:${i};color:${i}`:""}
      @click=${()=>o("mode",t)}>${t}</button>`,l="PPFD"===s.mode,c=l?"ppfd_start":"ts_start",d=l?"ppfd_stop":"ts_stop",h=this.durText(s[c],s[d]),p=this.numOpts(11,100,1,t=>`${t}%`),u=this.numOpts(20,2e3,10,t=>`${t} µmol`),g=this.offOpts(1,60,1,t=>`${t} min`),m=(t,e)=>W`<label class="pe-cell">
      <span>${t}</span>${e}</label>`,f=t=>W`<div class="pe-cellrow">${t}</div>`,v=m("Go dark",n("go_dark",this.threshOpts())),_=m("Turn off",n("turn_off",this.threshOpts()));return W`
      <div class="pe-light">
        <div class="pe-light-head"><span>${"light1"===e?"Light 1":"Light 2"}</span>
          <span class="pe-modes">${r("Time Slot")}${r("PPFD")}</span></div>
        <div class="pe-timesrow">
          <label>On${a(c)}</label>
          <label>Off${a(d)}</label>
        </div>
        ${h?W`<div class="pe-durrow">Light Duration · ${h}</div>`:U}
        ${l?W`
          ${f([m("Target",n("ppfd_target",u)),m("Dim min",n("ppfd_min",p)),m("Dim max",n("ppfd_max",p)),m("Sunrise/set",n("ppfd_fade",g))])}
          ${f([v,_])}`:W`
          ${f([m("Brightness",n("ts_bri",p)),m("Sunrise/set",n("ts_fade",g)),v,_])}`}
      </div>`}renderStageEditor(t){const e=this.accent(),i=this.tempUnitF()?"°F":"°C",s=this.planDraft[t],o=(e,i)=>this.planDraftSet(t,e,i),a=t=>W`<input type="date" class="pe-in"
      .value=${String(s[t]??"")} @change=${e=>o(t,e.target.value)}>`,n=(t,e,i,a)=>W`
      <div class="pe-row"><span class="pe-lbl">${t}</span>
        <span class="pe-cells">
          ${this.peSelect(s[e+"_night"],i,t=>o(e+"_night",t))}
          ${this.peSelect(s[e+"_day"],i,t=>o(e+"_day",t))}
          ${this.peSelect(s[e+"_dz"],a,t=>o(e+"_dz",t))}
        </span></div>`;return W`
      ${this.planDelArm?W`<div class="pe-head pe-delrow">
            <span class="pe-delq">Delete this stage?</span>
            <button class="pe-del-yes" @click=${()=>{this.planDelArm=!1,this.removePlanStage(t)}}>Delete</button>
            <button class="pe-del-no" @click=${()=>{this.planDelArm=!1}}>Cancel</button>
          </div>`:W`<div class="pe-head">
            <ha-icon icon="mdi:arrow-left" class="pe-back"
              @click=${()=>{this.planEditStage=null,this.planDelArm=!1}}></ha-icon>
            <input class="pe-name" .value=${s.label||""}
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
          .value=${String(s.alarm??"")}
          @change=${t=>o("alarm",t.target.value)}></label>
      </div>
      <div class="pe-grid-head"><span></span><span class="pe-cells">
        <span>Night</span><span>Day</span><span>Dead</span></span></div>
      ${this.planEnvHas("temp")?n("Temp "+i,"temp",this.envOptsFor("env_temp_day"),this.envOptsFor("env_temp_deadband")):U}
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
      ${this._tplMsg?W`<div style="display:flex;align-items:center;gap:6px;margin-top:8px;
        color:#46c98a;font-size:13px;font-weight:600">
        <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:18px"></ha-icon>${this._tplMsg}</div>`:U}
      <div class="plan-note" style="margin-top:6px">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>“Save as template” stores this whole plan under My templates (on the
        controller, so it syncs across your devices) — it doesn't change the running
        plan. Use “${this.planInfo().active?"Save & activate":"Save Plan"}” to apply it to the controller.</span>
      </div>`}editStage(t){this.planDraft||this.startPlanEdit(),this.planEditStage=t,this.planDelArm=!1}planEnvHas(t){const e="temp"===t?"temperature":"humi"===t?"humidity":"co2";return!!this.get(`sensor.sf_${this.config.panel}_${e}`)}planLightHas(t){return!!this.get(this.eid("light","light1"===t?"light_1":"light_2"))}defaultPlanLight(){return{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}offPlanLight(){return{mode:"Manual",ts_start:"05:00",ts_stop:"23:00",ts_bri:0,ts_fade:0,ppfd_target:0,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:0,ppfd_max:0,go_dark:0,turn_off:0}}renderPlanStage(t,e,i=-1){const s=this.accent(),o=null!=e&&t.stageId===e,a=this.planStageDates(t),n=(t,e,i,s="")=>W`
      <div class="plan-metric">
        <span class="plan-metric-label">${t}</span>
        <span class="plan-metric-vals">
          <span>N ${this.fmtNum(e)}${s}</span>
          <span>D ${this.fmtNum(i)}${s}</span>
        </span>
      </div>`,r=(t,e)=>{if(!e||"object"!=typeof e)return U;const i=e.mode||"";let s="",o="";if("Manual"===i){const t=Number(e.ts_bri)||0;s=t>0?`${t}%`:"Off"}else"PPFD"===i?(s=`${e.ppfd_start}–${e.ppfd_stop}`,o=`PPFD ${Math.max(20,Math.round(Number(e.ppfd_target)||0))}`):(s=`${e.ts_start}–${e.ts_stop}`,o=`${Math.round(Number(e.ts_bri)||0)}%`);return W`
        <div class="plan-metric">
          <span class="plan-metric-label">${t}</span>
          <span class="plan-metric-vals">
            ${s?W`<span>${s}</span>`:U}
            ${o?W`<span>${o}</span>`:U}
          </span>
        </div>`},l=this.planLightHas("light1"),c=this.planLightHas("light2");return W`
      <div class="plan-stage ${o?"current":""}"
        style=${o?`border-color:${s}`:""}>
        <div class="plan-stage-head">
          <span class="plan-stage-dot" style="background:${s}"></span>
          <span class="plan-stage-name">${t.label||"Stage"}</span>
          ${o?W`<span class="plan-stage-badge" style="color:${s};border-color:${s}">Current</span>`:U}
          ${i>=0?W`<ha-icon icon="mdi:pencil" class="plan-stage-edit"
            @click=${()=>this.editStage(i)}></ha-icon>`:U}
        </div>
        ${a?W`<div class="plan-stage-dates">${a}</div>`:U}
        <div class="plan-stage-grid">
          ${this.planEnvHas("temp")?n("Temp",this.fmtTemp(t.temp_night),this.fmtTemp(t.temp_day)):U}
          ${this.planEnvHas("humi")?n("Humidity",t.humi_night,t.humi_day,"%"):U}
          ${this.planEnvHas("co2")?n("CO₂",t.co2_night,t.co2_day,""):U}
          ${l?r(c?"Light 1":"Light",t.light1):U}
          ${c?r("Light 2",t.light2):U}
        </div>
      </div>`}fmtTemp(t){if(null==t||""===t)return"–";const e=Number(t);if(!Number.isFinite(e))return"–";const i=this.get(`number.sf_${this.config.panel}_env_temp_day`),s=i?.attributes?.unit_of_measurement;return"°F"===s||"℉"===s?`${Math.round(9*e/5+32)}°`:`${Math.round(e)}°`}fmtNum(t){if(null==t||""===t)return"–";const e=Number(t);return Number.isFinite(e)?`${Math.round(e)}`:String(t)}vpdRangeFor(t,e){const i=this.get(t),s=this.get(e);if(!i||!s)return null;const o=Number(i.state),a=Number(s.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,c="°C"===i.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3)),p=Math.max(0,a-l),u=Math.min(100,a+l),g=Math.max(0,h(d(o-r))*(1-u/100)),m=Math.max(0,h(d(o+r))*(1-p/100));return`${g.toFixed(2)} – ${m.toFixed(2)}`}renderVpd(){const t=this.config.panel,e=this.vpdRangeFor(`number.sf_${t}_env_temp_day`,`number.sf_${t}_env_humi_day`),i=this.vpdRangeFor(`number.sf_${t}_env_temp_night`,`number.sf_${t}_env_humi_night`);return e||i?W`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${e?W`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${e}</span>
              </div>`:U}
          ${i?W`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${i}</span>
              </div>`:U}
        </div>
      </div>`:U}renderLeafVpdTargets(){if(!this.showLeafVpd)return U;const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max"));if(!t||!e)return U;const i=(t,e)=>{const i=this.eid("number",t);return W`
      <div class="ctl ${i in this.draft?"staged":""}">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">
          <span class="num-box">
            <input type="number" step="0.05" min="0" max="4" .value=${this.draftVal(i)}
              @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&this.stage(i,String(e))}} />
            <span class="unit">kPa</span>
          </span>
        </div>
      </div>`};return W`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:leaf" style="color:${this.accent()}"></ha-icon>
          <span>Leaf VPD target</span>
        </div>
        <div class="leaf-tgt-grid">
          ${i("leaf_vpd_min","Min")}
          ${i("leaf_vpd_max","Max")}
        </div>
        <div class="set-note" style="margin:8px 2px 0">
          Colours the Leaf VPD tile when it drifts outside this band, using the
          Settings-tab highlight colours.
        </div>
      </div>`}toggleOutlet(t){this.outletOpen=t,this.outletCopyOpen=!1,this.outletCopyFromOpen=!1,this.outletCopySel={}}outletNums(t){const e=[];for(let i=1;i<=10;i++)this.get(`select.sf_${t}_outlet_${i}_mode`)&&e.push(i);return e}outletName(t,e){if(this.customOutletNames){const i=this.outletNames[`${t}_${e}`];if(i&&i.trim())return i.trim()}return`Outlet ${e}`}stageOutletName(t,e,i){this.outletNameDraft={...this.outletNameDraft,[`${t}_${e}`]:i}}outletNameDirty(t,e){const i=`${t}_${e}`;return i in this.outletNameDraft&&this.outletNameDraft[i].trim()!==(this.outletNames[i]??"").trim()}clearOutletNameDraft(t,e){const i=`${t}_${e}`;if(!(i in this.outletNameDraft))return;const s={...this.outletNameDraft};delete s[i],this.outletNameDraft=s}commitOutletName(t,e){const i=`${t}_${e}`;if(!(i in this.outletNameDraft))return;const s=this.outletNameDraft[i].trim(),o={...this.outletNames};s?o[i]=s:delete o[i],this.outletNames=o,this.persistColorOption(`outlet_name_${t}_${e}`,s),this.cacheColors(),this.clearOutletNameDraft(t,e)}ledToggle(t){const e=`switch.sf_${t}_indicator_light`,i=this.get(e);if(!i)return U;const s="on"===i.state,o=this.accent();return W`
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:400">
        <span style="opacity:.7">Indicator light</span>
        <button class="toggle sm ${s?"on":""}"
          style=${s?`background:${o}`:U}
          title="Indicator Light"
          aria-label="Indicator Light"
          @click=${()=>this.hass?.callService("switch","toggle",{entity_id:e})}></button>
      </span>`}renderOutlets(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return U;const e=this.outletOpen?this.outletOpen.slice(0,this.outletOpen.lastIndexOf("_")):null;return W`
      ${this.outletOnly()?this.renderEnergyTile():U}
      ${t.map(t=>{const i=Mt(this.hass,t)||(t.startsWith("st")?"S-Station":`${t.toUpperCase()} Power Strip`);return W`
          <div class="section-label" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span>${i}</span>
            ${this.ledToggle(t)}
          </div>
          ${this.renderQuickRow(t)}
          <div class="grid">
            ${this.outletNums(t).map(e=>this.outletTile(t,e))}
          </div>
          ${e===t?this.renderOutletPop():U}`})}`}ologKey(t){return`${t}|${this.ologRange}`}async fetchOlog(t){const e=this.ologKey(t);if(!this._olog[e]&&!this._ologLoading[e]&&this.hass){this._ologLoading[e]=!0;try{const i=new Date,s=new Date(i.getTime()-3600*this.ologRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),a=o&&o[t]||[];this._olog[e]=a.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),on:"on"===(t.s??t.state)})).filter(t=>Number.isFinite(t.t))}catch{this._olog[e]=[]}finally{this._ologLoading[e]=!1,this._ologVer++}}}ologSegments(t,e,i){const s=this._olog[t]||[],o=i-e,a=[];for(let t=0;t<s.length;t++){if(!s[t].on)continue;const n=Math.max(s[t].t,e),r=t+1<s.length?s[t+1].t:i;r<=n||a.push({left:(n-e)/o*100,width:(r-n)/o*100})}return a}ologEvents(t,e){const i=this._olog[t]||[],s=[];for(let t=i.length-1;t>=0&&s.length<10;t--){const o=t+1<i.length?i[t+1].t:e;s.push({on:i[t].on,t:i[t].t,dur:i[t].on?o-i[t].t:null})}return s}ologAxis(){const t=this.ologRange>=168?["7d","5d","3d","1d","now"]:["24h","18h","12h","6h","now"];return W`<div class="olog-axis">${t.map(t=>W`<span>${t}</span>`)}</div>`}ologTickStyle(){const t="rgba(255,255,255,0.12)";return`background-image:repeating-linear-gradient(to right,${t} 0,${t} 1px,transparent 1px,transparent ${(100/(this.ologRange<=24?24:7)).toFixed(4)}%)`}ologTime(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",hour12:this.hour12})}ologDur(t){const e=Math.round(t/6e4);if(e<60)return`${e}m`;const i=Math.floor(e/60),s=e%60;return s?`${i}h${s}m`:`${i}h`}ologAgo(t){const e=Math.round(t/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const i=Math.floor(e/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}ologRow(t,e,i,s){const o=`switch.sf_${t}_outlet_${e}`,a=this.ologKey(o);this._olog[a]||this.fetchOlog(o);const n=this.outletKey(t,e),r=this.ologOpen===n,l="on"===this.get(o)?.state,c=this._olog[a]||[],d=c.length?c[c.length-1].t:null,h=l?"On now":d?`Off · ${this.ologAgo(s-d)}`:"Off",p=!!this._ologLoading[a]&&!this._olog[a],u=this.ologSegments(a,i,s);return W`
      <div class="olog-row" role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>{this.ologOpen=r?null:n}}>
        <div class="olog-nm">${this.outletName(t,e)}<span class="olog-cur">${h}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${p?W`<span class="olog-load">Loading…</span>`:u.map(t=>W`<span class="olog-seg"
                style="left:${t.left.toFixed(2)}%;width:${Math.max(.4,t.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${r?W`<div class="olog-exp">
        ${(()=>{const t=this.ologEvents(a,s);return t.length?t.map(t=>W`<div class="olog-ev">
              <span><span class=${t.on?"on":"off"}>${t.on?"On":"Off"}</span> · ${this.ologTime(t.t)}</span>
              <span class="dur">${null!=t.dur?this.ologDur(t.dur):"—"}</span>
            </div>`):W`<div class="olog-ev" style="color:var(--secondary-text-color)">No switch events in this window.</div>`})()}
      </div>`:U}`}vpdBand(){if(this.vpdPlanSource){const t=this.vpdPlanBand();if(t)return t}switch(this.vpdStage){case"prop":return[.4,.8];case"flower":return[1.2,1.6];case"custom":return this.vpdCustom;default:return[.8,1.2]}}vpdPlanBand(){try{const t=this.planStageCurrent?.(),e=String(t?.name??t?.stageName??"").toLowerCase();if(!e)return null;if(/seed|clone|prop|germ/.test(e))return[.4,.8];if(/veg/.test(e))return[.8,1.2];if(/flow|bloom|fruit|dry/.test(e))return[1.2,1.6]}catch{}return null}vpdPlanName(){try{const t=this.planStageCurrent?.();return String(t?.name??t?.stageName??"")}catch{return""}}vpdReadings(){const t=this.get(`sensor.sf_${this.config.panel}_temperature`),e=this.get(`sensor.sf_${this.config.panel}_humidity`);if(!t||!e)return null;const i=parseFloat(t.state),s=parseFloat(e.state);if(!Number.isFinite(i)||!Number.isFinite(s))return null;const o=t.attributes.unit_of_measurement||"°C",a=/F/i.test(o),n=a?5*(i-32)/9:i,r=t=>610.7*Math.exp(17.27*t/(t+237.3))/1e3,l=r(n)*s/100;return{airT:i,rh:s,isF:a,unit:o,air:r(n)-l,leaf:r(n-2)-l}}async fetchVpdHist(t){if(!this._graph[t]&&!this._graphLoading[t]&&this.hass){this._graphLoading[t]=!0;try{const e=new Date,i=new Date(e.getTime()-864e5),s=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:e.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),o=s&&s[t]||[];this._graph[t]=o.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),v:parseFloat(t.s??t.state)})).filter(t=>Number.isFinite(t.v)&&Number.isFinite(t.t))}catch{this._graph[t]=[]}finally{this._graphLoading[t]=!1,this._graphVer++}}}renderVpdTab(){const t=this.accent(),e=this.vpdReadings();if(!e)return W`<div style="padding:24px 16px;color:var(--secondary-text-color);text-align:center">
        Waiting for this panel's air temperature and humidity…</div>`;const i=this.vpdBand(),s=e.air>=i[0]&&e.air<=i[1],o=s?"#46c98a":e.air>i[1]?"#e5734b":"#52b6d6",a=s?"rgba(70,201,138,.15)":e.air>i[1]?"rgba(229,115,75,.16)":"rgba(82,182,214,.16)",n=(s?"In range":e.air>i[1]?"Above target":"Below target")+` · ${i[0].toFixed(1)}–${i[1].toFixed(1)} kPa`,r=(()=>{try{return!!this.planInfo?.().active}catch{return!1}})(),l=this.vpdPlanSource&&!!this.vpdPlanBand(),c=(e,i)=>W`
      <button style="padding:4px 12px;font-size:12px;border:none;cursor:pointer;background:${this.vpdView===e?t:"#1a1e20"};color:${this.vpdView===e?"#151515":"#aeb4b9"}"
        @click=${()=>this.vpdView=e}>${i}</button>`,d=(e,i)=>W`
      <button style="padding:5px 9px;border-radius:8px;font-size:12px;white-space:nowrap;cursor:${l?"default":"pointer"};
        opacity:${l?".45":"1"};
        background:${this.vpdStage!==e||l?"#1e2224":"rgba(239,139,43,.16)"};
        border:1px solid ${this.vpdStage!==e||l?"#2f3538":t};
        color:${this.vpdStage!==e||l?"#c7cccf":"#fff"}"
        @click=${()=>{l||(this.vpdStage=e)}}>${i}</button>`,h=(t,e)=>()=>{const i=[this.vpdCustom[0],this.vpdCustom[1]];0===e?i[0]=Math.min(i[1]-.1,Math.max(.2,i[0]+.05*t)):i[1]=Math.max(i[0]+.1,Math.min(2,i[1]+.05*t)),this.vpdCustom=[Math.round(100*i[0])/100,Math.round(100*i[1])/100],this.requestUpdate()};return W`
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
          ${this.vpdPlanSource?W`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                @click=${()=>this.vpdPlanSource=!1}>use stage buttons instead →</span>`:r?W`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                  @click=${()=>this.vpdPlanSource=!0}>use planting plan instead →</span>`:W`<span style="color:#5a6166;cursor:default" title="No active planting plan for this device">use planting plan instead →</span>`}
        </div>
        ${"custom"!==this.vpdStage||l?U:W`
          <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:13px;color:#c7cccf">
            Custom band (kPa):
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              min <b style="cursor:pointer;color:${t}" @click=${h(-1,0)}>−</b>${this.vpdCustom[0].toFixed(2)}<b style="cursor:pointer;color:${t}" @click=${h(1,0)}>+</b></span>
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              max <b style="cursor:pointer;color:${t}" @click=${h(-1,1)}>−</b>${this.vpdCustom[1].toFixed(2)}<b style="cursor:pointer;color:${t}" @click=${h(1,1)}>+</b></span>
          </div>`}
        <div style="display:flex;justify-content:center;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap">
          <div><span style="font-size:26px;font-weight:700">${e.air.toFixed(2)}</span> <span style="font-size:13px;color:var(--secondary-text-color)">kPa air VPD</span></div>
          ${this.vpdLeaf?W`<div><span style="font-size:20px;font-weight:600;color:#c7cccf">${e.leaf.toFixed(2)}</span> <span style="font-size:12px;color:var(--secondary-text-color)">kPa leaf VPD</span></div>`:U}
          <span style="font-size:12px;padding:3px 9px;border-radius:20px;font-weight:600;color:${o};background:${a}">${n}</span>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--secondary-text-color);margin-bottom:10px">Air ${e.airT.toFixed(1)}${e.unit} · RH ${e.rh.toFixed(0)}%</div>
        <div style="background:#121517;border:1px solid #262b2d;border-radius:10px;padding:8px 6px 4px">
          <canvas id="vpdcanvas" style="width:100%;display:block;border-radius:6px"></canvas>
          ${"grid"===this.vpdView?W`
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
              ${this.vpdLeaf?W`<span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#35e08a;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>leaf</span>`:U}
            </div>`:U}
        </div>
      </div>`}drawVpdCanvas(){const t=this.renderRoot?.querySelector("#vpdcanvas");if(!t)return;const e=this.vpdReadings();if(!e)return;const i=t.getContext("2d");if(!i)return;const s=Math.min(2,window.devicePixelRatio||1),o=Math.max(280,Math.round(t.clientWidth||460)),a=210;t.width=o*s,t.height=a*s,t.style.height=a+"px",i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,o,a);const n=32,r=22,l=o-n-10,c=178,d=this.vpdBand(),h=Yt.VPD_TH,p=Yt.VPD_COL,u=(t,e,i)=>{const s=Math.max(0,Math.min(1,(i-t)/(e-t)));return s*s*(3-2*s)},g=t=>610.7*Math.exp(17.27*t/(t+237.3))/1e3;if("trend"===this.vpdView){const t=`sensor.sf_${this.config.panel}_vpd`,e=this._graph[t],s=.2,a=2,h=t=>r+(1-(t-s)/(a-s))*c;if(i.strokeStyle="#242a2c",i.fillStyle="#8b9298",i.font="9px sans-serif",i.textAlign="end",i.lineWidth=1,[.4,.8,1.2,1.6].forEach(t=>{const e=h(t);i.beginPath(),i.moveTo(n,e),i.lineTo(o-10,e),i.stroke(),i.fillText(t.toFixed(1),27,e+3)}),this.vpdHighlight){const t=h(Math.min(d[1],a)),e=h(Math.max(d[0],s));i.fillStyle="rgba(70,201,138,.16)",i.fillRect(n,t,l,e-t)}if(!e||!this._graph[t])return i.fillStyle="#8b9298",i.textAlign="center",void i.fillText("Loading 24h history…",o/2,105);if(e.length<2)return i.fillStyle="#8b9298",i.textAlign="center",void i.fillText("Not enough VPD history yet.",o/2,105);const p=e[0].t,u=e[e.length-1].t,g=Math.max(1,u-p),m=t=>n+(t-p)/g*l;i.beginPath(),e.forEach((t,e)=>{const o=m(t.t),n=h(Math.max(s,Math.min(a,t.v)));e?i.lineTo(o,n):i.moveTo(o,n)}),i.strokeStyle=this.accent(),i.lineWidth=2,i.lineJoin="round",i.stroke();const f=e[e.length-1];return i.beginPath(),i.arc(m(f.t),h(Math.max(s,Math.min(a,f.v))),4,0,7),i.fillStyle=this.accent(),i.fill(),i.fillStyle="#8b9298",void["-24h","-12h","now"].forEach((t,e)=>{const s=n+e/2*l;i.textAlign=0===e?"start":2===e?"end":"center",i.fillText(t,s,203)})}const m=e.isF,f=m?90:32,v=m?60:16,_=t=>m?5*(t-32)/9:t,b=t=>{const e=[p[0][0],p[0][1],p[0][2]];for(let i=0;i<h.length;i++){const s=u(h[i]-.018,h[i]+.018,t),o=p[i+1];e[0]+=(o[0]-e[0])*s,e[1]+=(o[1]-e[1])*s,e[2]+=(o[2]-e[2])*s}return e},$=Math.round(l),x=Math.round(c),y=document.createElement("canvas");y.width=$,y.height=x;const w=y.getContext("2d");if(!w)return;const S=w.createImageData($,x),k=S.data;for(let t=0;t<x;t++)for(let e=0;e<$;e++){const i=90-(e+.5)/$*60,s=_(v+(t+.5)/x*(f-v)),o=g(s)-g(s)*i/100,a=b(o);let n=a[0],r=a[1],l=a[2];if(this.vpdHighlight){const t=.66*(1-u(d[0]-.05,d[0]+.02,o)*(1-u(d[1]-.02,d[1]+.05,o)));n=n*(1-t)+18*t,r=r*(1-t)+21*t,l=l*(1-t)+23*t}const c=4*(t*$+e);k[c]=n,k[c+1]=r,k[c+2]=l,k[c+3]=255}w.putImageData(S,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(y,n,r,l,c);const O=t=>n+(90-t)/60*l,D=t=>r+(t-v)/(f-v)*c;i.fillStyle="#eef1f2",i.font="9px sans-serif",i.textAlign="end";(m?[60,68,76,84,90]:[16,20,24,28,32]).forEach(t=>i.fillText(t+"°",27,D(t)+3)),i.textAlign="center",[90,75,60,45,30].forEach(t=>i.fillText(t+"%",O(t),15));const C=O(e.rh),M=D(e.airT);if(i.save(),i.setLineDash([3,4]),i.strokeStyle="rgba(255,255,255,.35)",i.lineWidth=1,i.beginPath(),i.moveTo(n,M),i.lineTo(o-10,M),i.moveTo(C,r),i.lineTo(C,200),i.stroke(),i.restore(),this.vpdLeaf){const t=D(e.airT-(m?3.6:2));i.beginPath(),i.arc(C,t,5,0,7),i.fillStyle="#35e08a",i.fill(),i.strokeStyle="#151515",i.lineWidth=1.3,i.stroke()}i.beginPath(),i.arc(C,M,5,0,7),i.fillStyle="#ffffff",i.fill(),i.strokeStyle="#151515",i.lineWidth=1.3,i.stroke()}updated(t){"vpd"===this.tab&&this.showVpd&&("trend"===this.vpdView&&this.fetchVpdHist(`sensor.sf_${this.config.panel}_vpd`),this.drawVpdCanvas()),this.trackCooldownTransitions();const e=this.anyCooldownActive();if(e&&void 0===this._cdTimer?this._cdTimer=setInterval(()=>{this._cdTick++},1e3):e||void 0===this._cdTimer||(clearInterval(this._cdTimer),this._cdTimer=void 0),this._planPending){const t=this.planInfo().active;("start"===this._planPending&&t||"stop"===this._planPending&&!t)&&(this._planPending="",this._planPendTimer&&(clearTimeout(this._planPendTimer),this._planPendTimer=void 0))}}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._cdTimer&&(clearInterval(this._cdTimer),this._cdTimer=void 0),this._planPendTimer&&(clearTimeout(this._planPendTimer),this._planPendTimer=void 0)}renderOutletsLog(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return W`<div class="set-note">No outlets on this controller.</div>`;const e=Date.now(),i=e-3600*this.ologRange*1e3,s=this.accent(),o=(t,e)=>W`<button class="olog-rb ${this.ologRange===t?"on":""}"
      style=${this.ologRange===t?`background:${s};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=t}}>${e}</button>`;return W`
      <div class="olog-range">${o(24,"24h")}${o(168,"7d")}</div>
      ${t.map(s=>W`
        ${t.length>1?W`<div class="section-label">${Mt(this.hass,s)||`${s.toUpperCase()} Power Strip`}</div>`:U}
        ${this.outletNums(s).map(t=>this.ologRow(s,t,i,e))}
      `)}
      ${this.ologAxis()}`}renderDeviceLog(){const t=this.overviewDevices();if(!t.length)return W`<div class="set-note">No devices on this controller.</div>`;const e=this.accent(),i=(t,i)=>W`<button class="olog-rb ${this.ologRange===t?"on":""}"
      style=${this.ologRange===t?`background:${e};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=t}}>${i}</button>`;return W`
      <div class="olog-range">${i(24,"24h")}${i(168,"7d")}</div>
      ${t.map(t=>this.dlogRow(t))}
      ${this.ologAxis()}`}dlogRow(t){const e=Date.now(),i=e-3600*this.ologRange*1e3,s=t.id,o=this.ologKey(s);this._olog[o]||this.fetchOlog(s);const a=`${t.domain}:${t.suffix}`,n=this.dlogOpen===a,r="on"===this.get(s)?.state,l=this._olog[o]||[],c=l.length?l[l.length-1].t:null,d=r?"On now":c?`Off · ${this.ologAgo(e-c)}`:"Off",h=!!this._ologLoading[o]&&!this._olog[o],p=this.ologSegments(o,i,e);return W`
      <div class="olog-row" role="button" aria-expanded=${n?"true":"false"}
        @click=${()=>{this.dlogOpen=n?null:a}}>
        <div class="olog-nm"><ha-icon icon=${t.icon} style="--mdc-icon-size:15px;margin-right:5px;vertical-align:-3px"></ha-icon>${t.label}<span class="olog-cur">${d}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${h?W`<span class="olog-load">Loading…</span>`:p.map(t=>W`<span class="olog-seg"
                style="left:${t.left.toFixed(2)}%;width:${Math.max(.4,t.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${n?W`<div class="olog-exp">
        ${(()=>{const t=this.ologEvents(o,e);return t.length?t.map(t=>W`<div class="olog-ev">
              <span><span class=${t.on?"on":"off"}>${t.on?"On":"Off"}</span> · ${this.ologTime(t.t)}</span>
              <span class="dur">${null!=t.dur?this.ologDur(t.dur):"—"}</span>
            </div>`):W`<div class="olog-ev" style="color:var(--secondary-text-color)">No events in this window.</div>`})()}
      </div>`:U}`}deviceModeSelectId(t){const e=this.config.panel;return"light"===t.domain?`select.sf_${e}_${t.suffix}_mode`:`select.sf_${e}_${t.suffix}_mode_set`}dlqRead(t){const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,i=e?.[`dlq_${t}`];if(!i)return null;try{const t=JSON.parse(i);return t&&t.mode?t:null}catch{return null}}dlqHas(t){const e=this._dlqMem[t]||this.dlqRead(t);return!(!e||!e.mode||"Manual"===e.mode)}dlqClear(t){delete this._dlqMem[t];const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;e&&e[`dlq_${t}`]&&this.persistColorOption(`dlq_${t}`,"")}devPendingOff(t){return(this._devOff[t]??0)>Date.now()}markDevOff(t){this._devOff={...this._devOff,[t]:Date.now()+8e3},window.setTimeout(()=>{if((this._devOff[t]??0)<=Date.now()){const{[t]:e,...i}=this._devOff;this._devOff=i}},8100)}deviceEnabled(t){const e="on"===this.get(t.id)?.state,i="Manual"!==(this.deviceMode(t)||"Manual")&&!!this.get(this.deviceModeSelectId(t));return e||i}quickToggleDevice(t){const e="on"===this.get(t.id)?.state,i=t.domain,s=this.deviceMode(t)||"Manual",o=this.deviceModeSelectId(t),a="Manual"!==s&&!!this.get(o);if(e||a){if(this.deviceQuickRemember&&a){const e={mode:s};this._dlqMem[t.suffix]=e,this.persistColorOption(`dlq_${t.suffix}`,JSON.stringify(e))}this.markDevOff(t.suffix),a?(this.hass?.callService("select","select_option",{entity_id:o,option:"Manual"}),setTimeout(()=>this.hass?.callService(i,"turn_off",{entity_id:t.id}),400)):this.hass?.callService(i,"turn_off",{entity_id:t.id})}else{if(t.suffix in this._devOff){const{[t.suffix]:e,...i}=this._devOff;this._devOff=i}const e=this.deviceQuickRemember?this._dlqMem[t.suffix]||this.dlqRead(t.suffix):null;e&&e.mode&&"Manual"!==e.mode&&this.get(o)?(this.hass?.callService("select","select_option",{entity_id:o,option:e.mode}),this.dlqClear(t.suffix)):this.hass?.callService(i,"turn_on",{entity_id:t.id})}}renderDeviceQuickRow(){if(!this.showDeviceQuick)return U;const t=this.overviewDevices();return t.length?W`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>Quick</span>
      ${t.map(t=>{const e=this.dlqHas(t.suffix),i=this.deviceEnabled(t)&&!this.devPendingOff(t.suffix);return W`<button class="oq-btn ${e?"on":i?"live":""}"
          title=${t.label} aria-label=${t.label}
          @click=${()=>this.quickToggleDevice(t)}>
          <ha-icon icon=${t.icon} style="--mdc-icon-size:14px"></ha-icon>${t.label}</button>`})}
    </div>`:U}applyWithSaving(t,e){const i=[],s=t=>{t&&this.get(t)&&!i.some(e=>e.id===t)&&i.push({id:t,was:this.get(t)?.state??""})};e&&s(e);for(const t of Object.keys(this.draft)){const e=t.match(/^(?:power|bri|pct):(.+)$/);e?s(e[1]):t.includes(":")||/^(number|text|switch|light|fan)\./.test(t)&&s(t)}t(),this._saving=!0,this._savingAt=Date.now(),this._savingWatch=i,clearTimeout(this._savingT),this._savingT=setTimeout(()=>{this._saving=!1},12e3)}saveBar(t,e,i,s="",o){return qt(this.accent(),t,()=>this.applyWithSaving(e,o),i,s,this._saving)}outletSnapshot(t,e){const i=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"Manual",s={};for(const o of Bt[i]||[])for(const i of["text","number","select","switch"]){const a=this.get(`${i}.sf_${t}_outlet_${e}_${o}`);if(a){s[o]=a.state;break}}return{mode:i,config:s}}copyOutletTo(t,e,i){const s=this.outletSnapshot(t,e),o="Time Slot"===s.mode?this.outletPeriods(t,e):null;for(const t of i){const e=`select.sf_${t.slot}_outlet_${t.n}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:e,mode:s.mode,config:s.config}),o&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:e,periods:o}),this.olqClear(t.slot,t.n)}}renderOutletCopyPanel(t,e){const i=this.hass?kt(this.hass):[],s=[t,...i.filter(e=>e!==t)].filter((t,e,i)=>i.indexOf(t)===e),o=[];for(const i of s){const s=[];for(const o of this.outletNums(i))i===t&&o===e||s.push({slot:i,n:o,key:this.outletKey(i,o),name:this.outletName(i,o),mode:this.get(`select.sf_${i}_outlet_${o}_mode`)?.state||""});s.length&&o.push({slot:i,current:i===t,label:Mt(this.hass,i)||`${i.toUpperCase()} Power Strip`,items:s})}const a=o.flatMap(t=>t.items),n=a.filter(t=>this.outletCopySel[t.key]),r=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"Manual";return W`<div class="oc-panel">
      <div class="oc-title">Apply ${this.outletName(t,e)}'s settings
        (<span style="color:${this.accent()}">${r}</span>) to:</div>
      ${a.length?W`<div class="oc-cols">
        ${o.map(t=>W`<div class="oc-col">
          <div class="oc-colhd">${t.label}${t.current?W`<span class="oc-cur">current</span>`:U}</div>
          ${t.items.map(t=>W`
            <label class="oc-ck">
              <input type="checkbox" .checked=${!!this.outletCopySel[t.key]}
                @change=${e=>{this.outletCopySel={...this.outletCopySel,[t.key]:e.target.checked}}}>
              <span>${t.name}${t.mode?W` <span class="oc-mode">· ${t.mode}</span>`:U}</span>
            </label>`)}
        </div>`)}
      </div>`:W`<div class="oc-mode">No other outlets.</div>`}
      <button class="oc-apply" ?disabled=${0===n.length}
        @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(t,e,n.map(t=>({slot:t.slot,n:t.n})))),this.outletCopyOpen=!1,this.outletCopySel={}}}>Apply to ${n.length} outlet${1===n.length?"":"s"}</button>
    </div>`}renderOutletCopyFromPanel(t,e){const i=this.hass?kt(this.hass):[],s=[t,...i.filter(e=>e!==t)].filter((t,e,i)=>i.indexOf(t)===e),o=[];for(const i of s){const s=[];for(const o of this.outletNums(i))i===t&&o===e||s.push({slot:i,n:o,name:this.outletName(i,o),mode:this.get(`select.sf_${i}_outlet_${o}_mode`)?.state||""});s.length&&o.push({slot:i,current:i===t,label:Mt(this.hass,i)||`${i.toUpperCase()} Power Strip`,items:s})}const a=o.some(t=>t.items.length);return W`<div class="oc-panel">
      <div class="oc-title">Copy settings into ${this.outletName(t,e)} from:</div>
      ${a?W`<div class="oc-cols">
        ${o.map(i=>W`<div class="oc-col">
          <div class="oc-colhd">${i.label}${i.current?W`<span class="oc-cur">current</span>`:U}</div>
          ${i.items.map(i=>W`
            <button class="oc-fromitem"
              @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(i.slot,i.n,[{slot:t,n:e}])),this.outletCopyFromOpen=!1}}>${i.name}${i.mode?W` <span class="oc-mode">· ${i.mode}</span>`:U}</button>`)}
        </div>`)}
      </div>`:W`<div class="oc-mode">No other outlets.</div>`}
    </div>`}outletRememberKey(t,e){return`sf-olq-${this.config.panel}-${t}-${e}`}olqRead(t,e){const i=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,s=i?.[`olq_${t}_${e}`];if(!s)return null;try{const t=JSON.parse(s);return t&&t.mode?t:null}catch{return null}}olqHas(t,e){const i=this._olqMem[this.outletRememberKey(t,e)]||this.olqRead(t,e);return!(!i||!i.mode||"Manual"===i.mode)}olqClear(t,e){delete this._olqMem[this.outletRememberKey(t,e)];const i=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;i&&i[`olq_${t}_${e}`]&&this.persistColorOption(`olq_${t}_${e}`,"")}quickToggle(t,e){const i=`switch.sf_${t}_outlet_${e}`,s="on"===this.get(i)?.state;if(!this.outletQuickRemember)return void this.hass?.callService("switch","toggle",{entity_id:i});const o=this.outletRememberKey(t,e);if(s){const s=this.outletSnapshot(t,e);"Time Slot"===s.mode&&(s.periods=this.outletPeriods(t,e)),this._olqMem[o]=s,this.persistColorOption(`olq_${t}_${e}`,JSON.stringify(s)),this.hass?.callService("switch","turn_off",{entity_id:i})}else{const s=this._olqMem[o]||this.olqRead(t,e);if(s&&s.mode&&"Manual"!==s.mode){const i=`select.sf_${t}_outlet_${e}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:i,mode:s.mode,config:s.config}),s.periods&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:i,periods:s.periods}),this.olqClear(t,e)}else this.hass?.callService("switch","turn_on",{entity_id:i})}}renderQuickRow(t){if(!this.showOutletQuick)return U;const e=this.outletNums(t);return e.length?W`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>Quick</span>
      ${e.map(e=>{const i=this.olqHas(t,e),s="on"===this.get(`switch.sf_${t}_outlet_${e}`)?.state,o=i?"on":s?"live":"",a=this.outletQuickNames&&this.customOutletNames?(this.outletNames[`${t}_${e}`]||"").trim():"";return W`<button class="oq-btn ${o}"
          title=${this.outletName(t,e)} aria-label=${this.outletName(t,e)}
          @click=${()=>this.quickToggle(t,e)}>${this.outletQuickNames?W`${a?`${e}-${a}`:String(e)}`:W`<span class="oq-dot"></span>${e}`}</button>`})}
    </div>`:U}outletColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Temperature"===t||"Humidity"===t||"CO2"===t||"Light Env"===t?"env":"Drip Irrigation"===t?"drip":"manual")(t)){case"sched":return this.ocSched;case"env":return this.ocEnv;case"drip":return this.ocDrip;default:return this.ocManual}}outletModeDetail(t,e,i){const s=`sf_${t}_outlet_${e}`,o=t=>this.get(t)?.state??"",a=this.dirPick[`${t}_${e}`]||"";if("Light Env"===i){return"Night"===(a||this.outletLightDir[`${t}_${e}`]||"Day")?{text:"Night",cls:"od-night"}:{text:"Day",cls:"od-day"}}if("Temperature"===i){const t=o(`select.${s}_temp_device`)||a;return"Heating"===t?{text:"Heating",cls:"od-heat"}:"Cooling"===t?{text:"Cooling",cls:"od-cool"}:null}if("Humidity"===i){const t=o(`select.${s}_humidity_device`)||a;return"Humidifying"===t?{text:"Humidifying",cls:"od-hum"}:"Dehumidifying"===t?{text:"Dehumidifying",cls:"od-dehum"}:null}if("CO2"===i){const t=o(`select.${s}_co2_device`);return"Aeration"===t?{text:"Aeration",cls:"od-aer"}:"Exhaust"===t?{text:"Exhaust",cls:"od-exh"}:null}if("Time Slot"===i){const i=this.outletPeriods(t,e);if(i.length){const t=i[0],e=`${this.fmtClock(t.start)}–${this.fmtClock(t.end)}`;return{text:i.length>1?`${e} +${i.length-1}`:e,cls:"od-sched"}}const a=o(`text.${s}_ts_start`),n=o(`text.${s}_ts_stop`);return a&&n?{text:`${this.fmtClock(a)}–${this.fmtClock(n)}`,cls:"od-sched"}:null}if("Cycle"===i){const t=t=>{const e=Number(t);return Number.isFinite(e)&&e>=60&&e%60==0?e/60+"h":`${e}m`},e=o(`number.${s}_cycle_run`),i=o(`number.${s}_cycle_off`);if(e&&i){let a=`${t(e)} on · ${t(i)} off`;const n=o(`number.${s}_cycle_times`);n&&Number(n)>1&&(a+=` · ×${Math.round(Number(n))}`);const r=o(`text.${s}_cycle_start`);return r&&"00:00"!==r&&(a+=` @ ${this.fmtClock(r)}`),{text:a,cls:"od-sched"}}return null}return null}outletTile(t,e){const i="on"===this.draftVal(`switch.sf_${t}_outlet_${e}`),s=this.draftVal(`select.sf_${t}_outlet_${e}_mode`)||"",o=this.outletKey(t,e),a=this.outletOpen===o,n=this.accent(),r=i&&"off"!==this.outletColorMode?this.outletColorFor(s):"",l=r||n;let c="";return r&&"tile"===this.outletColorMode&&(c=`background:${Rt(r)};box-shadow:inset 0 0 0 1px ${r}`),a&&(c=`box-shadow:inset 0 0 0 1px ${n}`+(r&&"tile"===this.outletColorMode?`;background:${Rt(r)}`:"")),W`
      <div class="tile tile-outlet clickable ${a?"active":""}"
        style=${c||U}
        role="button" aria-expanded=${a?"true":"false"}
        @click=${()=>this.toggleOutlet(a?null:o)}>
        <div class="tile-label" title=${this.outletName(t,e)}>${this.outletName(t,e)}
          <ha-icon class="tile-more"
            icon=${a?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${i?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${i?`color:${l}`:U}>${i?"On":"Off"}</div>
        ${i?U:this.cooldownPill(this.outletCooldown(t,e),"cd-outlet")}
        <div class="tile-sub">${s}</div>
        ${(()=>{const i=this.outletModeDetail(t,e,s);return i?W`<div class="tile-sub2 ${i.cls}">${i.text}</div>`:U})()}
        ${!i&&this.olqHas(t,e)?W`<div class="tile-qta" style="color:${n}"
          title="Quick-toggle profile saved — quick-on restores this outlet's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>`:U}
      </div>`}clearOutletCfgDraft(t,e){const i=this.outletKey(t,e);if(!(i in this.outletCfgDraft))return;const s={...this.outletCfgDraft};delete s[i],this.outletCfgDraft=s}renderLightEnvConfig(t,e){const i=this.outletKey(t,e),s=this.outletCfgDraft[i]??{},o=s.light_device??this.outletLightDir[i]??"Day",a="light_device"in s&&s.light_device!==(this.outletLightDir[i]??"Day");return W`
      <div class="set-note" style="margin-top:6px">
        Follows the environment day/night cycle (from Environment/Planting Plan):
        on during the selected phase, off in the other. The integration drives it.
      </div>
      <div class="dev-row ${a?"staged":""}">
        <span class="dev-lbl">Follows</span>
        <span class="ctl-input">
          <select @change=${t=>this.outletCfgDraft={...this.outletCfgDraft,[i]:{...s,light_device:t.target.value}}}>
            ${["Day","Night"].map(t=>W`<option value=${t} ?selected=${o===t}>${t}</option>`)}
          </select>
        </span>
      </div>`}renderOutletModeConfig(t,e,i){const s=this.outletKey(t,e),o=this.outletCfgDraft[s]??{},a=(t,e)=>this.outletCfgDraft={...this.outletCfgDraft,[s]:{...o,[t]:e}},n=(t,e,i,s)=>W`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="num-box">
          <input type="number" min="0" max="1440" .value=${o[e]??String(i)}
            @change=${t=>a(e,t.target.value)} />
          ${s?W`<span class="unit">${s}</span>`:U}
        </span>
      </div>`,r=(t,e,i)=>W`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="ctl-input">
          <select @change=${t=>a(e,t.target.value)}>
            ${i.map(t=>W`<option value=${t}
              ?selected=${(o[e]??i[0])===t}>${t}</option>`)}
          </select>
        </span>
      </div>`;switch(i){case"Cycle":return W`
        ${l="Start",c="cycle_start",d="12:00",W`
      <div class="dev-row ${c in o?"staged":""}">
        <span class="dev-lbl">${l}</span>
        <span class="num-box">
          <input type="time" .value=${o[c]??d}
            @change=${t=>a(c,t.target.value)} />
        </span>
      </div>`}
        ${n("Run Duration","cycle_run",60,"min")}
        ${n("Off Duration","cycle_off",60,"min")}
        ${n("Execution Times","cycle_times",1,"")}`;case"Temperature":return r("Device","temp_device",["Heating","Cooling"]);case"Humidity":return r("Device","humidity_device",["Humidifying","Dehumidifying"]);case"CO2":return r("Device","co2_device",["Aeration","Exhaust"]);default:return U}var l,c,d}stDeviceType(t,e){const i=i=>this.get(`select.sf_${t}_outlet_${e}_${i}`)?.state||"",s=this.get(`select.sf_${t}_outlet_${e}_mode`)?.state||"";return"Light Env"===s?"Light Env":s.startsWith("Blower")?"Blower":"Time Slot"===s?"Timer period":"Cycle"===s?"Timer loop":"Temperature"===s?"Cooling"===i("temp_device")?"Cooler":"Heater":"Humidity"===s?"Dehumidifying"===i("humidity_device")?"Dehumidification":"Humidification":"CO2"===s?"Exhaust"===i("co2_device")?"Exhaust fan":"CO2 Injection":"General device"}stBlowerMode(t,e){return"Blower (Humidity Priority)"===this.get(`select.sf_${t}_outlet_${e}_mode`)?.state?"Humidity Priority":"Temperature Priority"}renderStationDeviceType(t,e){const i=this.outletKey(t,e),s=this._stDt[i]??{},o=this.stDeviceType(t,e),a=s.type??o,n=this.stBlowerMode(t,e),r=s.blower??n,l=this.outletLightDir[i]??"Day",c=s.light??l,d=`select.sf_${t}_outlet_${e}_mode`,h=t=>this._stDt={...this._stDt,[i]:{...s,...t}},p=void 0!==s.type&&s.type!==o||"Blower"===a&&void 0!==s.blower&&s.blower!==n||"Light Env"===a&&void 0!==s.light&&s.light!==l||"Timer loop"===a&&i in this.outletCfgDraft||"Timer period"===a&&i in this.outletDraft||this.outletNameDirty(t,e);return W`
      <div class="toggle-row" style="margin-top:4px">
        <span>Device Type</span>
        <select style="max-width:60%"
          @change=${t=>h({type:t.target.value})}>
          ${Ht.map(t=>W`
            <option value=${t.label} ?selected=${t.label===a}>${t.label}</option>`)}
        </select>
      </div>
      ${"Blower"===a?W`
        <div class="toggle-row" style="margin-top:8px">
          <span>Mode</span>
          <select style="max-width:60%"
            @change=${t=>h({blower:t.target.value})}>
            ${Object.keys(It).map(t=>W`
              <option value=${t} ?selected=${t===r}>${t}</option>`)}
          </select>
        </div>`:U}
      ${"Light Env"===a?W`
        <div class="toggle-row" style="margin-top:8px">
          <span>Follows</span>
          <select style="max-width:60%"
            @change=${t=>h({light:t.target.value})}>
            ${["Day","Night"].map(t=>W`
              <option value=${t} ?selected=${t===c}>${t}</option>`)}
          </select>
        </div>
        <div class="set-note" style="margin-top:8px">
          Follows the environment day/night cycle (from Environment/Planting Plan):
          on during the selected phase, off in the other. The integration drives it.
        </div>`:U}
      ${"General device"===a?this.stagedCtl(`switch.sf_${t}_outlet_${e}`,"Power"):U}
      ${"Timer period"===a?this.renderOutletSchedule(t,e):U}
      ${"Timer loop"===a?this.renderOutletModeConfig(t,e,"Cycle"):U}
      ${Vt.has(a)?W`
        <div class="set-note" style="margin-top:8px">
          Runs from your Environment day/night targets (set on the Environment tab).
          There are no separate on/off thresholds here.
        </div>`:U}
      ${this.saveBar(p,()=>{if(this.commitOutletName(t,e),"Light Env"===o&&"Light Env"!==a){this.hass?.callService("sf","set_outlet_env",{entity_id:d,enabled:!1}),this.persistColorOption(`oletdir_${i}`,"");const t={...this.outletLightDir};delete t[i],this.outletLightDir=t}if("Light Env"===a){this.hass?.callService("sf","set_outlet_config",{entity_id:d,mode:"Manual",config:{}}),this.applyOutletEnv(t,e,"Light Env",c),this.outletLightDir={...this.outletLightDir,[i]:c},this.dirPick={...this.dirPick,[i]:c},this.persistColorOption(`oletdir_${i}`,c),this.clearOutletCfgDraft(t,e);const s={...this._stDt};return delete s[i],this._stDt=s,void(this.modePick={...this.modePick,[d]:"Light Env"})}const s=Ht.find(t=>t.label===a);let n=s.mode,l={...s.cfg};"Blower"===a&&(n=It[r]||s.mode),"Timer loop"===a&&(l={...l,...this.outletCfgDraft[i]??{}}),this.hass?.callService("sf","set_outlet_config",{entity_id:d,mode:n,config:l}),"Timer period"===a&&this.saveOutlet(t,e),this.clearOutletCfgDraft(t,e);const h={...this._stDt};delete h[i],this._stDt=h,this.modePick={...this.modePick,[d]:n}},()=>{const s={...this._stDt};delete s[i],this._stDt=s,this.clearOutletCfgDraft(t,e),this.clearOutletDraft(t,e),this.clearOutletNameDraft(t,e)},"apply-bar")}`}renderOutletPop(){const t=this.outletOpen;if(!t)return U;const e=t.lastIndexOf("_");if(e<0)return U;const i=t.slice(0,e),s=Number(t.slice(e+1));if(!i||!Number.isFinite(s))return U;const o=`select.sf_${i}_outlet_${s}_mode`;if(!this.get(o))return U;const a=`switch.sf_${i}_outlet_${s}`,n=this.get(a),r=`sf_${i}_outlet_${s}_`,l=this.draftVal(o)||this.get(o)?.state||"",c="Time Slot"===l,d=new Set((Bt[l]||[]).map(t=>`${r}${t}`)),h=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return!!d.has(e)&&(!c||e!==`${r}ts_type`&&e!==`${r}ts_start`&&e!==`${r}ts_stop`)}).sort(),p=this.get(o)?.state||"",u=l!==p&&"Manual"!==l&&!c&&(Bt[l]||[]).length>0&&0===h.length,g=this.outletKey(i,s),m=[...u?[]:[o],...n?[a]:[],...h.filter(t=>/^(switch|number|select|text)\./.test(t))],f=!!this.outletDraft[this.outletKey(i,s)],v=this.outletNameDirty(i,s),_="Light Env"===l&&"light_device"in(this.outletCfgDraft[g]??{})&&this.outletCfgDraft[g].light_device!==(this.outletLightDir[g]??"Day"),b=u||_;return W`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${this.outletName(i,s)}</span>
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
        ${this.outletCopyOpen?this.renderOutletCopyPanel(i,s):U}
        ${this.outletCopyFromOpen?this.renderOutletCopyFromPanel(i,s):U}
        ${this.customOutletNames?W`
          <div class="toggle-row ${this.outletNameDirty(i,s)?"staged":""}">
            <span>Name</span>
            <span class="num-box">
              <input type="text" style="width:140px;text-align:left"
                .value=${this.outletKey(i,s)in this.outletNameDraft?this.outletNameDraft[this.outletKey(i,s)]:this.outletNames[`${i}_${s}`]??""}
                placeholder=${`Outlet ${s}`}
                @input=${t=>this.stageOutletName(i,s,t.target.value)} />
            </span>
          </div>`:U}
        ${i.startsWith("st")?this.renderStationDeviceType(i,s):W`
        ${this.stagedCtl(o,"Mode")}
        ${n&&!u&&"Light Env"!==l?this.stagedCtl(a,"Power"):U}
        ${u?this.renderOutletModeConfig(i,s,l):U}
        ${"Light Env"===l?this.renderLightEnvConfig(i,s):U}
        ${"Light Env"===l?U:h.map(t=>this.stagedCtl(t))}
        ${c?this.renderOutletSchedule(i,s):U}
        ${this.applyBar(m,{extraDirty:f||v||b,onApply:()=>{const t=this.stripIsExternal(i),e="Light Env"===p,a="Light Env"===l,n=a?this.outletCfgDraft[g]?.light_device||this.outletLightDir[g]||"Day":"Humidity"===l?this.outletCfgDraft[g]?.humidity_device||this.draftVal(`select.sf_${i}_outlet_${s}_humidity_device`)||"Humidifying":this.outletCfgDraft[g]?.temp_device||this.draftVal(`select.sf_${i}_outlet_${s}_temp_device`)||"Cooling";if(a)this.applyOutletEnv(i,s,"Light Env",n),this.outletLightDir={...this.outletLightDir,[g]:n},this.dirPick={...this.dirPick,[g]:n},this.persistColorOption(`oletdir_${g}`,n),this.clearOutletCfgDraft(i,s),this.modePick={...this.modePick,[o]:"Light Env"};else{if(e){this.hass?.callService("sf","set_outlet_env",{entity_id:o,enabled:!1}),this.persistColorOption(`oletdir_${g}`,"");const t={...this.outletLightDir};delete t[g],this.outletLightDir=t}else t&&!this.isEnvOutletMode(l)&&this.applyOutletEnv(i,s,l,n);if(this.isEnvOutletMode(l)&&(this.dirPick={...this.dirPick,[g]:n}),u){if(this.hass?.callService("sf","set_outlet_config",{entity_id:o,mode:l,config:this.outletCfgDraft[g]??{}}),this.clearOutletCfgDraft(i,s),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}this.modePick={...this.modePick,[o]:l}}}this.saveOutlet(i,s),this.commitOutletName(i,s),this.olqClear(i,s)},onDiscard:()=>{if(this.clearOutletDraft(i,s),this.clearOutletNameDraft(i,s),this.clearOutletCfgDraft(i,s),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}}})}`}
      </div>`}outletKey(t,e){return`${t}_${e}`}stripIsExternal(t){return t===this.config.panel&&"external"===this.tempSource}isEnvOutletMode(t){return"Temperature"===t||"Humidity"===t||"Light Env"===t}applyOutletEnv(t,e,i,s){const o=this.isEnvOutletMode(i);this.hass?.callService("sf","set_outlet_env",{entity_id:`select.sf_${t}_outlet_${e}_mode`,enabled:o,mode:o?i:"Temperature",direction:s})}outletPeriods(t,e){const i=this.outletDraft[this.outletKey(t,e)];if(i)return i;const s=this.get(`sensor.sf_${t}_outlet_${e}_ts_schedule`)?.attributes.periods;return Array.isArray(s)?s:[]}editOutlet(t,e,i){const s=this.outletKey(t,e),o=this.outletDraft[s]??this.outletPeriods(t,e),a=JSON.parse(JSON.stringify(o));i(a),this.outletDraft={...this.outletDraft,[s]:a}}clearOutletDraft(t,e){const i=this.outletKey(t,e),s={...this.outletDraft};delete s[i],this.outletDraft=s}saveOutlet(t,e){const i=this.outletDraft[this.outletKey(t,e)];i&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${t}_outlet_${e}_mode`,periods:i}),this.clearOutletDraft(t,e))}renderOutletSchedule(t,e){const i=this.outletPeriods(t,e),s=this.accent();return W`
      <div class="ts-editor">
        ${i.map((i,o)=>W`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${o+1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${()=>this.editOutlet(t,e,t=>t.splice(o,1))}>✕</button>
            </div>
            <div class="days">
              ${ft.map((a,n)=>W`<button
                  class="day ${i.days.includes(n)?"on":""}"
                  style=${i.days.includes(n)?`background:${s};border-color:${s}`:""}
                  @click=${()=>this.editOutlet(t,e,t=>{const e=t[o].days,i=e.indexOf(n);i>=0?e.splice(i,1):e.push(n),e.sort((t,e)=>t-e)})}>${a}</button>`)}
            </div>
            <div class="sched-times">
              <div class="tf">
                <span class="tf-lbl">Start</span>
                <input type="time" .value=${i.start}
                  @change=${i=>this.editOutlet(t,e,t=>{t[o].start=i.target.value})} />
              </div>
              <span class="dash">—</span>
              <div class="tf">
                <span class="tf-lbl">Stop</span>
                <input type="time" .value=${i.end}
                  @change=${i=>this.editOutlet(t,e,t=>{t[o].end=i.target.value})} />
              </div>
            </div>
          </div>`)}
        <div class="sched-actions">
          <button class="add"
            @click=${()=>this.editOutlet(t,e,t=>t.push({days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00"}))}>
            + Add slot
          </button>
        </div>
      </div>`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const i of Object.keys(this.hass?.states??{})){const s=_t(i).match(t);s&&e.add(s[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let i=e?.attributes.friendly_name??"";const s=Mt(this.hass,this.config.panel);return s&&i.startsWith(s)&&(i=i.slice(s.length).trim()),i=i.replace(/\s*Temp Calibration\s*$/i,"").trim(),i||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.envControl(t,e)).filter(t=>t!==U),i=this.caliSoilSlots().map(e=>{const i=[this.envControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.envControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==U),s=this.stagedCtl(`select.sf_${t}_${e}_substrate`,"Substrate");return W`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="cali-soil-grid">${i}${s!==U?s:U}</div>
        </div>`}),s=this.renderLeafVpdCalibration();return e.length||i.length||s!==U?W`
      ${e.length?W`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:U}
      ${i.length?W`<div class="section-label">Soil Calibration</div>${i}`:U}
      ${s}
      ${this.renderSensorCleaning()}
      ${this.applyBar(this.caliIds())}`:W`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}hasAlerts(){return!!this.alertsSettings()}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return t&&"object"==typeof t?t:null}editAlert(t){const e=this.alertsDraft??this.alertsSettings()??{},i=JSON.parse(JSON.stringify(e));t(i),this.alertsDraft=i}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const t=this.alertsSettings();if(!t)return W`<div class="cali-empty">No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.</div>`;const e=null!==this.alertsDraft;return this.accent(),W`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(t,"climate","Climate")}
      ${this.renderAlertGroup(t,"substrate","Substrate")}
      ${this.renderAlertOther(t)}
      ${this.saveBar(e,()=>this.saveAlerts(),()=>this.alertsDraft=null,"apply-bar")}`}renderAlertGroup(t,e,i){const s=t[e]||[];return s.length?W`
      <div class="section-label">${i}</div>
      ${s.map((t,i)=>this.renderAlertMetric(e,i,t))}`:U}tempUnit(){return this.hass?.config?.unit_system?.temperature||"°F"}isCelsius(){return this.tempUnit().includes("C")}tempThresholdOpts(){const t=this.isCelsius();return this.offOpts(t?15:59,t?50:122,1,t=>`${t}${this.tempUnit()}`)}alertBounds(t){switch(t){case"temp":case"tempSoil":return this.isCelsius()?[0,50]:[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(t,e,i){const s=this.accent(),[o,a]=this.alertBounds(i.key),n=Number(i.step??1)||1,r="ppfd"===i.key?Math.max(o,a-100):a,l=(s,l)=>{const c=this.numOpts(o,"min"===l?r:a,n);return W`
      <label class="av">
        <span class="av-lbl">${s}</span>
        <span class="num-box">
          <select @change=${i=>this.editAlert(s=>{s[t][e][l]=Number(i.target.value)})}>
            ${c.map(t=>W`
              <option value=${t.value} .selected=${String(t.value)===String(i[l]??"")}>${t.label}</option>`)}
          </select>
          <span class="unit">${i.unit??""}</span>
        </span>
      </label>`};return W`
      <div class="alert-row ${i.enabled?"":"off"}">
        <div class="alert-head">
          <span class="alert-name">${i.label} <span class="unit">${i.unit??""}</span></span>
          <button class="toggle ${i.enabled?"on":""}"
            style=${i.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(i=>{const s=i[t][e];s.enabled=s.enabled?0:1})}
            aria-label="Toggle ${i.label} alarm"></button>
        </div>
        <div class="alert-vals">
          ${"range"===i.kind?l("Min","min"):U}
          ${l("Max","max")}
        </div>
      </div>`}renderAlertOther(t){const e=t.other||[];if(!e.length)return U;const i=this.accent();return W`
      <div class="section-label">Other Device</div>
      ${e.map((t,e)=>W`<div class="alert-bool">
          <span class="alert-name">${t.label}</span>
          <button class="toggle ${t.enabled?"on":""}"
            style=${t.enabled?`background:${i}`:""}
            @click=${()=>this.editAlert(t=>{const i=t.other[e];i.enabled=i.enabled?0:1})}
            aria-label="Toggle ${t.label} alarm"></button>
        </div>`)}`}hasLog(){return this.alarmSources().length>0}alarmSources(){const t=[],e=e=>{const i=this.get(`sensor.sf_${e}_alarms`);i&&t.push({slot:e,ent:i,name:Mt(this.hass,e)||e})};this.config.panel&&e(this.config.panel);for(const t of this.outletSlots())t!==this.config.panel&&e(t);return t}logToday(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}renderLog(){const t=this.alarmSources(),e=this.logDate||this.logToday(),i=this.logDev||"all",s=this.logType||"all";let o=[];for(const e of t){if("all"!==i&&i!==e.slot)continue;const t=e.ent.attributes.events;Array.isArray(t)&&t.forEach(t=>o.push({...t,_src:e.name}))}const a=[...new Set(o.map(t=>t.device).filter(Boolean))].sort(),n=new Date(`${e}T00:00:00`).getTime()/1e3,r=new Date(`${e}T23:59:59.999`).getTime()/1e3,l=new Set;return o=o.filter(t=>(t.epoch||0)>=n&&(t.epoch||0)<=r&&("all"===s||t.device===s)).sort((t,e)=>(e.epoch||0)-(t.epoch||0)).filter(t=>{const e=`${t.epoch}|${t._src}|${t.device||`Device ${t.devType}`}|${t.alarm||""}|${t.alarmType||0}`;return!l.has(e)&&(l.add(e),!0)}).slice(0,50),W`
      <div class="log-filters">
        ${t.length>1?W`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${t=>{this.logDev=t.target.value}}>
                  <option value="all" ?selected=${"all"===i}>All</option>
                  ${t.map(t=>W`
                    <option value=${t.slot} ?selected=${i===t.slot}>${t.name}</option>`)}
                </select>
              </div>
            </div>`:U}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${t=>{this.logType=t.target.value}}>
              <option value="all" ?selected=${"all"===s}>All</option>
              ${a.map(t=>W`
                <option value=${t} ?selected=${s===t}>${t}</option>`)}
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
                  <div class="log-title">${t.length>1&&"all"===i?`${e._src} `:""}${e.device||`Device ${e.devType}`} ${e.alarm||""}</div>
                  <div class="log-time">${e.epoch?(t=>{try{return new Date(1e3*t).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(e.epoch):e.time||""}</div>
                </div>`)}
            </div>`:W`<div class="cali-empty">No log entries on this date.</div>`}`}render(){if(!this.hass||!this.config)return U;const t=this.hasOutlets(),e=this.outletOnly(),i=!!this.get(this.eid("number","env_temp_day")),s=`sf_${this.config.panel}_`,o=!!this.get(this.eid("number","cal_air_temp"))||Object.keys(this.hass.states).some(t=>t.includes(s)&&/_cal_(temp|moisture|ec)$/.test(t)),a=i,n=o,r=!e,l=this.showVpd&&!e,c=!e,d=e?"outlets":"overview";let h=this.tab;!e||"overview"!==h&&"alerts"!==h&&"vpd"!==h||(h="outlets"),"env"!==h||a||(h=d),"cali"!==h||n||(h=d),"outlets"!==h||t||(h="overview"),"olog"!==h||t&&this.showOutletsLog||(h="overview"),"vpd"!==h||l||(h=d),"dlog"!==h||this.showDeviceLog&&this.overviewDevices().length>0||(h=d);const p=this.accent(),u=(t,e)=>W`<button class="tab ${h===t?"active":""}"
        style=${h===t?`color:${p};border-color:${p}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,g=Mt(this.hass,this.config.panel),m=[this.taTiles?"":"ta-x-t",this.taDevices?"":"ta-x-d",this.taOutlets?"":"ta-x-o"].filter(Boolean).join(" ");return W`
      <ha-card class=${m||U} style=${this.layoutStyle()||U}>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${g?W`<span class="device">${g}</span>`:U}
          ${this.renderConn()}
        </div>
        ${W`<div class="tabs">
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
      </ha-card>`}setLeafSpot(t,e){const i=[...this.leafSpots];i[t]=parseFloat(e),this.leafSpots=i}renderLeafVpdCalibration(){if(!this.showLeafVpd)return U;const t=this.eid("number","leaf_offset"),e=this.get(t);if(!e)return U;const i=e.attributes.unit_of_measurement||"°",s=this.get(this.eid("sensor","temperature")),o=s&&Number.isFinite(+s.state)?+s.state:null;if(5!==this.leafSpots.length){const t=o??0;this.leafSpots=Array(5).fill(Math.round(10*t)/10)}const a=this.leafSpots,n=a.filter(t=>Number.isFinite(t)),r=n.length?n.reduce((t,e)=>t+e,0)/n.length:null,l=null!=r&&null!=o?r-o:null,c=t in this.draft,d=e=>this.stage(t,String(Math.round(10*e)/10)),h=this.eid("number","leaf_offset_night"),p=!!this.get(h),u=h in this.draft,g=t=>this.stage(h,String(Math.round(10*t)/10)),m=this.accent(),f=p?this.leafCalTarget:"day";return W`
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
          <span class="unit">${i}</span>
        </span>
      </div>
      ${p?W`
      <div class="toggle-row ${u?"staged":""}">
        <span>Leaf offset (night)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(h)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&g(e)}} />
          <span class="unit">${i}</span>
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
        ${p?W`
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
          ${a.map((t,e)=>W`<input type="number" step="0.1"
            .value=${Number.isFinite(t)?String(t):""}
            @input=${t=>this.setLeafSpot(e,t.target.value)} />`)}
        </div>
        <div class="leaf-cal-foot">
          <span>
            Avg ${null!=r?r.toFixed(1)+i:"—"}
            · offset ${null!=l?(t=>(t>=0?"+":"")+t.toFixed(1))(l)+i:"—"}
          </span>
          <button class="leaf-apply" ?disabled=${null==l}
            @click=${()=>null!=l&&(t=>"night"===f?g(t):d(t))(l)}>
            Use for ${"night"===f?"night":"day"}</button>
        </div>
      </details>`}_sensorOptions(t){return this.hass?Object.keys(this.hass.states).filter(e=>e.startsWith("sensor.")&&!e.includes("sf_")&&this.hass.states[e].attributes?.device_class===t).map(t=>({id:t,name:this.hass.states[t].attributes?.friendly_name||t})).sort((t,e)=>t.name.localeCompare(e.name)):[]}_commitTempSource(t){const e=t.tsSource??this.tempSource,i=t.tsTemp??this.extTemp,s=t.tsHumi??this.extHumi;if(e===this.tempSource&&i===this.extTemp&&s===this.extHumi)return;const o=this.get(`switch.sf_${this.config.panel}_indicator_light`)?`switch.sf_${this.config.panel}_indicator_light`:`switch.sf_${this.config.panel}_outlet_1`;this.tempSource=e,this.extTemp=i,this.extHumi=s,this.hass?.callService("sf","set_strip_sensor",{entity_id:o,source:e,temp_entity:"external"===e?i:"",humi_entity:"external"===e?s:""})}renderTempSource(t,e){if(!/^(ac|st)\d/.test(this.config.panel||""))return U;const i=this.accent(),s=t?.tsSource??this.tempSource,o=t?.tsTemp??this.extTemp,a=t?.tsHumi??this.extHumi,n=(t,o)=>W`
      <button class="seg ${s===t?"on":""}"
        style=${s===t?`border-color:${i};color:${i}`:U}
        @click=${()=>e({tsSource:t})}>${o}</button>`,r=(t,i,s,o)=>W`
      <div class="toggle-row" style="margin-top:8px">
        <span>${o}</span>
        <select style="max-width:60%"
          @change=${t=>e({[s]:t.target.value})}>
          <option value="" ?selected=${!t}>— choose —</option>
          ${this._sensorOptions(i).map(e=>W`
            <option value=${e.id} ?selected=${e.id===t}>${e.name}</option>`)}
          ${t&&!this._sensorOptions(i).some(e=>e.id===t)?W`<option value=${t} selected>${t}</option>`:U}
        </select>
      </div>`;return W`
      <div class="section-label set-collapse-h"
        @click=${()=>this._tsOpen=!this._tsOpen}>
        <span>Temperature source</span>
        <ha-icon icon=${this._tsOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._tsOpen?W`
      <div class="set-note">
        This strip has no Spider Farmer air sensor. Use a 3rd-party Home Assistant
        temperature/humidity sensor as its reference — the readings appear on the
        card (and as <code>sensor.sf_${this.config.panel}_temperature</code> /
        <code>_humidity</code>) so you can drive the outlets from your own
        automations.
      </div>
      <div class="set-note" style="font-weight:700;color:var(--warning-color,#ff9800);margin-top:6px">
        ⚠ Important: while a 3rd-party (External) sensor is in use, control this
        device from Home Assistant only — you CANNOT use the Spider Farmer app.
        The app has no access to your 3rd-party sensor and will fight the
        integration's control.
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        ${n("sf","SF sensor")}
        ${n("external","External sensor")}
      </div>
      ${"external"===s?W`
        ${r(o,"temperature","tsTemp","Temperature entity")}
        ${r(a,"humidity","tsHumi","Humidity entity")}
      `:U}`:U}`}_commitSmartControl(t){const e=t.sc;if(!e)return;if(JSON.stringify(e)===JSON.stringify(this.smart||{}))return;const i=this.config.panel,s=this.get(`switch.sf_${i}_dehumidifier`)?`switch.sf_${i}_dehumidifier`:`switch.sf_${i}_indicator_light`,{enabled:o,...a}=e;this.smart={...e},this.hass?.callService("sf","set_smart_control",{entity_id:s,enabled:!!o,settings:a})}renderSmartControl(t,e){const i=this.config.panel;if(!this.get(`switch.sf_${i}_dehumidifier`))return U;const s=this.accent(),o={...this.smart||{},...t?.sc??{}},a=t=>e({sc:{...o,...t}}),n=!!o.enabled,r=(t,e)=>Number.isFinite(Number(t))?Number(t):e,l=(t,e,i,s=1)=>W`
      <div class="toggle-row" style="margin-top:8px">
        <span>${t}</span>
        <input type="number" style="max-width:90px" step=${s}
          .value=${String(r(o[e],i))}
          @change=${t=>a({[e]:Number(t.target.value)})} />
      </div>`,c=(t,e,i)=>W`
      <div class="toggle-row" style="margin-top:8px">
        <span>${t} <span style="color:var(--secondary-text-color)">(min)</span></span>
        <input type="number" style="max-width:90px" step="0.5" min="0"
          .value=${String(Math.round(r(o[e],i)/60*10)/10)}
          @change=${t=>a({[e]:Math.round(60*Number(t.target.value))})} />
      </div>`;return W`
      <div class="section-label set-collapse-h"
        @click=${()=>this._smartOpen=!this._smartOpen}>
        <span>Smart control</span>
        <ha-icon icon=${this._smartOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._smartOpen?W`
      <div class="set-note" style="color:var(--warning-color,#ff9800)">
        ⚠ When enabled, the integration drives the dehumidifier itself (full Manual)
        to hold your humidity target — this overrides Spider Farmer's own automation.
        It runs continuously in Home Assistant (works with no dashboard open). On an
        HA restart the gear holds its last state until HA is back.
      </div>
      <div class="toggle-row">
        <span>Enable smart humidity control</span>
        <button class="toggle ${n?"on":""}"
          style=${n?`background:${s}`:U}
          @click=${()=>a({enabled:!n})}></button>
      </div>
      ${n?W`
        <div class="toggle-row" style="margin-top:8px">
          <span>Humidity sensor</span>
          <select style="max-width:60%"
            @change=${t=>a({humidity:t.target.value})}>
            <option value="" ?selected=${!o.humidity}>Strip sensor (default)</option>
            ${this._sensorOptions("humidity").map(t=>W`
              <option value=${t.id} ?selected=${t.id===o.humidity}>${t.name}</option>`)}
            ${o.humidity&&!this._sensorOptions("humidity").some(t=>t.id===o.humidity)?W`<option value=${o.humidity} selected>${o.humidity}</option>`:U}
          </select>
        </div>
        ${l("Target humidity %","target",55)}
        ${l("Deadband % (turn on above target+this)","deadband",5)}
        ${c("Escalate to High after","escalate_after_s",300)}
        ${l("…if RH hasn't dropped this %","escalate_drop",1,.5)}
        ${l("Ease back to Low within % of target","ease_band",3)}
        ${c("Minimum on time","min_on_s",120)}
        ${c("Minimum off time","min_off_s",120)}
      `:U}`:U}`}setHead(t,e,i){return W`
      <div class="section-label set-collapse-h" style="margin-top:16px" @click=${i}>
        <span>${e}</span>
        <ha-icon icon=${t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>`}renderSettings(){const t=this.accent(),e=this.colorDraft,i=e?.mode??this.colorMode,s=e?.modeIn??this.colorModeIn,o=e?.hi??this.colHi,a=e?.lo??this.colLo,n=e?.in??this.colIn,r=e?.warn??this.colWarn,l=e?.showTrend??this.showTrend,c=e?.showBand??this.showBand,d=e?.showTargets??this.showTargets,h=e?.tileSummary??this.tileSummary,p=e?.hour12??this.hour12,u=e?.showConn??this.showConn,g=e?.connCustom??this.connCustom,m=e?.connSignal??this.connSignal,f=e?.showOutletsLog??this.showOutletsLog,v=e?.showOutletQuick??this.showOutletQuick,_=e?.outletQuickRemember??this.outletQuickRemember,b=e?.outletQuickNames??this.outletQuickNames,$=e?.showVpd??this.showVpd,x=e?.vpdLeaf??this.vpdLeaf,y=e?.showLeafVpd??this.showLeafVpd,w=e?.showDeviceLog??this.showDeviceLog,S=e?.showDeviceQuick??this.showDeviceQuick,k=e?.deviceQuickRemember??this.deviceQuickRemember,O=e?.customNames??this.customOutletNames,D=e?.customLayout??this.customLayout,C=e?.scale??this.cardScale,M=e?.cols??this.tileCols,T=e?.tileRadius??this.tileRadius,L=e?.tileBorderW??this.tileBorderW,N=e?.tileBorderCol??this.tileBorderCol,P=e?.tileBg??this.tileBg,E=e?.taTiles??this.taTiles,R=e?.taDevices??this.taDevices,A=e?.taOutlets??this.taOutlets,F=e?.cdShow??this.cooldownShow,z=e?.cdDevice??this.cooldownDevice,B=e?.cdOutlet??this.cooldownOutlet,H=e?.cdSecs??this.cooldownSecs,I=e?.ovOutlets??this.outletsOnOverview,V=e?.ovQuick??this.outletQuickOverview,Q=e?.hideEnergy??this.hideEnergyTile,j=!!this.get(this.eid("light","light_2")),q=this.outletOnly(),G=e?.omode??this.outletColorMode,K=e?.ocManual??this.ocManual,J=e?.ocSched??this.ocSched,Y=e?.ocEnv??this.ocEnv,X=e?.ocDrip??this.ocDrip,Z=this.hasOutlets(),tt=e?.dmode??this.deviceColorMode,et=e?.dcManual??this.dcManual,it=e?.dcSched??this.dcSched,st=e?.dcAuto??this.dcAuto,ot=this.overviewDevices().length>0,at=!!e&&(void 0!==e.mode&&e.mode!==this.colorMode||void 0!==e.modeIn&&e.modeIn!==this.colorModeIn||void 0!==e.source&&e.source!==this.colorSource||void 0!==e.warn&&e.warn!==this.colWarn||void 0!==e.showTrend&&e.showTrend!==this.showTrend||void 0!==e.showBand&&e.showBand!==this.showBand||void 0!==e.showTargets&&e.showTargets!==this.showTargets||void 0!==e.tileSummary&&e.tileSummary!==this.tileSummary||void 0!==e.hour12&&e.hour12!==this.hour12||void 0!==e.showConn&&e.showConn!==this.showConn||void 0!==e.connCustom&&e.connCustom!==this.connCustom||void 0!==e.connSignal&&e.connSignal!==this.connSignal||void 0!==e.showOutletsLog&&e.showOutletsLog!==this.showOutletsLog||void 0!==e.showOutletQuick&&e.showOutletQuick!==this.showOutletQuick||void 0!==e.outletQuickRemember&&e.outletQuickRemember!==this.outletQuickRemember||void 0!==e.outletQuickNames&&e.outletQuickNames!==this.outletQuickNames||void 0!==e.showVpd&&e.showVpd!==this.showVpd||void 0!==e.showLeafVpd&&e.showLeafVpd!==this.showLeafVpd||void 0!==e.showDeviceLog&&e.showDeviceLog!==this.showDeviceLog||void 0!==e.showDeviceQuick&&e.showDeviceQuick!==this.showDeviceQuick||void 0!==e.deviceQuickRemember&&e.deviceQuickRemember!==this.deviceQuickRemember||void 0!==e.vpdLeaf&&e.vpdLeaf!==this.vpdLeaf||void 0!==e.hi&&e.hi!==this.colHi||void 0!==e.lo&&e.lo!==this.colLo||void 0!==e.in&&e.in!==this.colIn||void 0!==e.hide2&&e.hide2!==this.hideLight2||void 0!==e.customNames&&e.customNames!==this.customOutletNames||void 0!==e.customLayout&&e.customLayout!==this.customLayout||void 0!==e.scale&&e.scale!==this.cardScale||void 0!==e.cols&&e.cols!==this.tileCols||void 0!==e.omode&&e.omode!==this.outletColorMode||void 0!==e.ocManual&&e.ocManual!==this.ocManual||void 0!==e.ocSched&&e.ocSched!==this.ocSched||void 0!==e.ocEnv&&e.ocEnv!==this.ocEnv||void 0!==e.ocDrip&&e.ocDrip!==this.ocDrip||void 0!==e.dmode&&e.dmode!==this.deviceColorMode||void 0!==e.dcManual&&e.dcManual!==this.dcManual||void 0!==e.dcSched&&e.dcSched!==this.dcSched||void 0!==e.dcAuto&&e.dcAuto!==this.dcAuto||void 0!==e.tileRadius&&e.tileRadius!==this.tileRadius||void 0!==e.tileBorderW&&e.tileBorderW!==this.tileBorderW||void 0!==e.tileBorderCol&&e.tileBorderCol!==this.tileBorderCol||void 0!==e.tileBg&&e.tileBg!==this.tileBg||void 0!==e.taTiles&&e.taTiles!==this.taTiles||void 0!==e.taDevices&&e.taDevices!==this.taDevices||void 0!==e.taOutlets&&e.taOutlets!==this.taOutlets||void 0!==e.cdShow&&e.cdShow!==this.cooldownShow||void 0!==e.cdDevice&&e.cdDevice!==this.cooldownDevice||void 0!==e.cdOutlet&&e.cdOutlet!==this.cooldownOutlet||void 0!==e.cdSecs&&e.cdSecs!==this.cooldownSecs||void 0!==e.ovOutlets&&e.ovOutlets!==this.outletsOnOverview||void 0!==e.ovQuick&&e.ovQuick!==this.outletQuickOverview||void 0!==e.hideEnergy&&e.hideEnergy!==this.hideEnergyTile||void 0!==e.tsSource&&e.tsSource!==this.tempSource||void 0!==e.tsTemp&&e.tsTemp!==this.extTemp||void 0!==e.tsHumi&&e.tsHumi!==this.extHumi||void 0!==e.sc&&JSON.stringify(e.sc)!==JSON.stringify(this.smart||{})),nt=t=>this.colorDraft={...this.colorDraft??{},...t},rt=(e,i,s,o,a)=>W`
      <button class="seg ${e===i?"on":""}"
        style=${e===i?`border-color:${t};color:${t}`:U}
        @click=${a}>
        <ha-icon icon=${o}></ha-icon><span>${s}</span>
      </button>`,lt=e?.source??this.colorSource,ct=(e,i,s)=>W`
      <button class="seg ${lt===e?"on":""}"
        style=${lt===e?`border-color:${t};color:${t}`:U}
        @click=${()=>nt({source:e})}>
        <ha-icon icon=${s}></ha-icon><span>${i}</span>
      </button>`,dt=(t,e,i)=>W`
      <label class="color-field">
        <span>${t}</span>
        <input class="pinwheel" type="color" .value=${e}
          @input=${t=>i(t.target.value)} />
      </label>`,ht=this.renderTempSource(e,nt),pt=this.renderSmartControl(e,nt),ut=W`
      <div class="section-label set-collapse-h"
        @click=${()=>this._colorOpen=!this._colorOpen}>
        <span>Colours &amp; tile appearance</span>
        <ha-icon icon=${this._colorOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._colorOpen?W`
      ${q?U:W`
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
        ${ct("alarms","Alarms","mdi:bell-outline")}
        ${ct("targets","Targets","mdi:target")}
        ${ct("both","Both","mdi:set-center")}
      </div>

      <div class="section-label" style="margin-top:16px">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${o}">above max</span>,
        <span style="color:${a}">below min</span>. Saved to the controller, so
        it sticks across upgrades and your other devices.
      </div>
      <div class="seg-row">
        ${rt(i,"off","No color","mdi:circle-off-outline",()=>nt({mode:"off"}))}
        ${rt(i,"tile","Tile color","mdi:square-rounded",()=>nt({mode:"tile"}))}
        ${rt(i,"text","Text color","mdi:format-color-text",()=>nt({mode:"text"}))}
      </div>
      <div class="color-row">
        ${dt("Above max",o,t=>nt({hi:t}))}
        ${dt("Below min",a,t=>nt({lo:t}))}
        ${dt("Near edge",r,t=>nt({warn:t}))}
      </div>

      <div class="section-label" style="margin-top:16px">In-range highlight</div>
      <div class="set-note">
        Colour a reading that's <span style="color:${n}">within</span> its
        limits. Applies to every reading; off by default.
      </div>
      <div class="seg-row">
        ${rt(s,"off","No color","mdi:circle-off-outline",()=>nt({modeIn:"off"}))}
        ${rt(s,"tile","Tile color","mdi:square-rounded",()=>nt({modeIn:"tile"}))}
        ${rt(s,"text","Text color","mdi:format-color-text",()=>nt({modeIn:"text"}))}
      </div>
      <div class="color-row">
        ${dt("In range",n,t=>nt({in:t}))}
      </div>
      `}

      ${j?W`
            <div class="section-label" style="margin-top:16px">Devices</div>
            <div class="set-note">
              A phantom Light 2 or Fan tile? Manage per-device accessories in the
              integration: Settings → Devices &amp; services → Spider Farmer
              Bridge → Configure → “Device accessories”. HA then skips the
              entity entirely.
            </div>`:U}

      ${Z?W`
            <div class="section-label" style="margin-top:16px">Outlet active color</div>
            <div class="set-note">
              Colour an outlet tile while it's on, by its mode —
              <span style="color:${K}">Manual</span>,
              <span style="color:${J}">Scheduled</span>,
              <span style="color:${Y}">Environment</span>,
              <span style="color:${X}">Drip</span>. Off outlets stay neutral.
            </div>
            <div class="seg-row">
              ${rt(G,"off","No color","mdi:circle-off-outline",()=>nt({omode:"off"}))}
              ${rt(G,"tile","Tile color","mdi:square-rounded",()=>nt({omode:"tile"}))}
              ${rt(G,"text","Text color","mdi:format-color-text",()=>nt({omode:"text"}))}
            </div>
            <div class="color-row">
              ${dt("Manual",K,t=>nt({ocManual:t}))}
              ${dt("Scheduled",J,t=>nt({ocSched:t}))}
            </div>
            <div class="color-row">
              ${dt("Environment",Y,t=>nt({ocEnv:t}))}
              ${dt("Drip",X,t=>nt({ocDrip:t}))}
            </div>`:U}

      ${ot?W`
            <div class="section-label" style="margin-top:16px">Device active color</div>
            <div class="set-note">
              Colour a device tile while it's on, by its mode —
              <span style="color:${et}">Manual</span>,
              <span style="color:${it}">Scheduled</span>,
              <span style="color:${st}">Auto</span> (Environment / PPFD). A
              <span style="color:${Pt}">fault</span> always overrides.
            </div>
            <div class="seg-row">
              ${rt(tt,"off","No color","mdi:circle-off-outline",()=>nt({dmode:"off"}))}
              ${rt(tt,"tile","Tile color","mdi:square-rounded",()=>nt({dmode:"tile"}))}
              ${rt(tt,"text","Text color","mdi:format-color-text",()=>nt({dmode:"text"}))}
            </div>
            <div class="color-row">
              ${dt("Manual",et,t=>nt({dcManual:t}))}
              ${dt("Scheduled",it,t=>nt({dcSched:t}))}
              ${dt("Auto",st,t=>nt({dcAuto:t}))}
            </div>`:U}

      <div class="section-label" style="margin-top:16px">Tile appearance</div>
      <div class="set-note">Edges, border, and background for every tile.</div>
      <div class="set-note" style="margin-top:6px;display:flex;justify-content:space-between">
        <span>Corner radius</span><span style="color:${t};font-weight:500">${T}px</span>
      </div>
      <input type="range" min="0" max="20" step="1" .value=${String(T)} style="width:100%"
        @input=${t=>nt({tileRadius:Number(t.target.value)})} />
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Border width</span><span style="color:${t};font-weight:500">${L}px</span>
      </div>
      <input type="range" min="0" max="4" step="1" .value=${String(L)} style="width:100%"
        @input=${t=>nt({tileBorderW:Number(t.target.value)})} />
      <div class="color-row" style="margin-top:8px">
        ${dt("Border",N||t,t=>nt({tileBorderCol:t}))}
        ${dt("Background",P||"#1e1e1e",t=>nt({tileBg:t}))}
      </div>
      <div class="ta-preview"
        style="border-radius:${T}px;border:${L}px solid ${N||"transparent"};background:${P||"var(--secondary-background-color)"}">
        <span style="color:${P?"#fff":"var(--secondary-text-color)"}">Heater</span>
        <b style="color:${P?"#fff":"var(--primary-text-color)"}">L4</b>
        <span style="font-size:10px;color:var(--secondary-text-color)">preview</span>
      </div>
      <div class="toggle-row" style="margin-top:6px">
        <span style="font-size:13px;color:var(--secondary-text-color)">Reset background &amp; border to theme</span>
        <button class="olog-rb" @click=${()=>nt({tileBg:"",tileBorderCol:"",tileBorderW:1})}>Reset</button>
      </div>
      <div class="set-note" style="margin-top:12px">Apply appearance to</div>
      <div class="toggle-row">
        <span>Sensor tiles</span>
        <button class="toggle ${E?"on":""}"
          style=${E?`background:${t}`:U}
          @click=${()=>nt({taTiles:!E})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device tiles</span>
        <button class="toggle ${R?"on":""}"
          style=${R?`background:${t}`:U}
          @click=${()=>nt({taDevices:!R})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Outlet tiles</span>
        <button class="toggle ${A?"on":""}"
          style=${A?`background:${t}`:U}
          @click=${()=>nt({taOutlets:!A})}></button>
      </div>
      `:U}`,gt=this.hasDehumidifier()?W`
      <div class="section-label set-collapse-h" style="margin-top:16px"
        @click=${()=>this._cdOpen=!this._cdOpen}>
        <span>Dehumidifier cooldown timer</span>
        <ha-icon icon=${this._cdOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._cdOpen?W`
      <div class="set-note">
        Many dehumidifiers enforce a compressor lockout after switching off — they
        can't restart until it elapses, even when SF or the integration calls for
        them. Show a live countdown so you always know when it can come back on.
      </div>
      <div class="toggle-row">
        <span>Show cooldown timer</span>
        <button class="toggle ${F?"on":""}"
          style=${F?`background:${t}`:U}
          @click=${()=>nt({cdShow:!F})}></button>
      </div>
      ${F?W`
      <div class="toggle-row" style="margin-top:8px">
        <span>On device tile</span>
        <button class="toggle ${z?"on":""}"
          style=${z?`background:${t}`:U}
          @click=${()=>nt({cdDevice:!z})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>On outlet tiles</span>
        <button class="toggle ${B?"on":""}"
          style=${B?`background:${t}`:U}
          @click=${()=>nt({cdOutlet:!B})}></button>
      </div>
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Cooldown length</span>
        <span style="color:${t};font-weight:500">${(H/60).toFixed(1).replace(/\.0$/,"")} min</span>
      </div>
      <input type="range" min="30" max="900" step="30" .value=${String(H)} style="width:100%"
        @input=${t=>nt({cdSecs:Number(t.target.value)})} />
      `:U}
      `:U}
      `:U,mt=this.hasOutlets()?W`
      ${this.setHead(this._setOverviewOpen,"Overview",()=>this._setOverviewOpen=!this._setOverviewOpen)}
      ${this._setOverviewOpen?W`
      <div class="set-note">
        Show everything in one view: append the outlet tiles to the Overview tab,
        at the bottom under Devices.
      </div>
      <div class="toggle-row">
        <span>Show outlets on Overview</span>
        <button class="toggle ${I?"on":""}"
          style=${I?`background:${t}`:U}
          @click=${()=>nt({ovOutlets:!I})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show quick-toggle row on Overview</span>
        <button class="toggle ${V?"on":""}"
          style=${V?`background:${t}`:U}
          @click=${()=>nt({ovQuick:!V})}></button>
      </div>
      ${this.get(`sensor.sf_${this.config.panel}_power`)?W`
      <div class="toggle-row" style="margin-top:8px">
        <span>Hide Energy Usage tile</span>
        <button class="toggle ${Q?"on":""}"
          style=${Q?`background:${t}`:U}
          @click=${()=>nt({hideEnergy:!Q})}></button>
      </div>`:U}`:U}`:U,ft=W`
      ${this.setHead(this._setExtrasOpen,"Tile extras",()=>this._setExtrasOpen=!this._setExtrasOpen)}
      ${this._setExtrasOpen?W`
      <div class="set-note">
        Shown on every Overview tile, independent of the colour mode. Tap any tile
        to open its history graph (6h–7d, selectable).
      </div>
      ${q?U:W`
      <div class="toggle-row">
        <span>Target / range line</span>
        <button class="toggle ${d?"on":""}"
          style=${d?`background:${t}`:U}
          @click=${()=>nt({showTargets:!d})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Trend arrows</span>
        <button class="toggle ${l?"on":""}"
          style=${l?`background:${t}`:U}
          @click=${()=>nt({showTrend:!l})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Dead-zone band</span>
        <button class="toggle ${c?"on":""}"
          style=${c?`background:${t}`:U}
          @click=${()=>nt({showBand:!c})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device mode summary</span>
        <button class="toggle ${h?"on":""}"
          style=${h?`background:${t}`:U}
          @click=${()=>nt({tileSummary:!h})}></button>
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
          @click=${()=>nt({hour12:!p})}></button>
      </div>
      <div class="set-note">
        Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.
      </div>`:U}`,vt=W`
      ${this.setHead(this._setConnOpen,"Header connection info",()=>this._setConnOpen=!this._setConnOpen)}
      ${this._setConnOpen?W`
      <div class="set-note">
        Show the controller's online status + Wi-Fi signal bars in the top-right
        of the header. Signal comes from the controller's own Wi-Fi — no extra
        entities are created.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show connection info</span>
        <button class="toggle ${u?"on":""}"
          style=${u?`background:${t}`:U}
          @click=${()=>nt({showConn:!u})}></button>
      </div>
      ${u?W`
        <div class="toggle-row" style="margin-top:8px">
          <span>Use a custom signal source</span>
          <button class="toggle ${g?"on":""}"
            style=${g?`background:${t}`:U}
            @click=${()=>nt({connCustom:!g})}></button>
        </div>
        <div class="set-note">
          Point the signal bars at a different entity — e.g. the controller is on
          another AP or hard-wired, and its dBm is reported by your router/AP
          integration instead of the bundled Wi-Fi AP.
        </div>
        ${g?W`
          <div class="toggle-row" style="margin-top:6px">
            <span>Signal entity</span>
            <select style="max-width:60%"
              @change=${t=>nt({connSignal:t.target.value})}>
              <option value="" ?selected=${!m}>— none —</option>
              ${this.signalEntityOptions().map(t=>W`
                <option value=${t.id} ?selected=${m===t.id}>${t.name}</option>`)}
            </select>
          </div>`:U}
      `:U}`:U}`,_t=q?U:W`
      ${this.setHead(this._setVpdOpen,"VPD graph",()=>this._setVpdOpen=!this._setVpdOpen)}
      ${this._setVpdOpen?W`
      <div class="set-note">
        Adds a "VPD" tab with a vibrant temperature × humidity phase chart (grid
        or trend) plus growth-stage targets. Uses this panel's air temp + humidity
        — no extra entities.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Leaf VPD tile</span>
        <button class="toggle ${y?"on":""}"
          style=${y?`background:${t}`:U}
          @click=${()=>nt({showLeafVpd:!y})}></button>
      </div>
      <div class="set-note">Off hides the Leaf VPD tile and its target settings.</div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Enable VPD graph</span>
        <button class="toggle ${$?"on":""}"
          style=${$?`background:${t}`:U}
          @click=${()=>nt({showVpd:!$})}></button>
      </div>
      ${$?W`
        <div class="toggle-row" style="margin-top:8px">
          <span>Enable Leaf VPD</span>
          <button class="toggle ${x?"on":""}"
            style=${x?`background:${t}`:U}
            @click=${()=>nt({vpdLeaf:!x})}></button>
        </div>
        <div class="set-note">
          Also plots leaf VPD (from the leaf-VPD sensor) alongside air VPD on the
          tab.
        </div>`:U}`:U}`,bt=ot?W`
      ${this.setHead(this._setDevOpen,"Devices",()=>this._setDevOpen=!this._setDevOpen)}
      ${this._setDevOpen?W`
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Device Log tab</span>
        <button class="toggle ${w?"on":""}"
          style=${w?`background:${t}`:U}
          @click=${()=>nt({showDeviceLog:!w})}></button>
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
          @click=${()=>nt({showDeviceQuick:!S})}></button>
      </div>
      <div class="set-note">
        Shows a compact row of icon buttons above the device tiles for fast
        on/off toggling.
      </div>
      ${S?W`
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember device settings on toggle</span>
          <button class="toggle ${k?"on":""}"
            style=${k?`background:${t}`:U}
            @click=${()=>nt({deviceQuickRemember:!k})}></button>
        </div>
        <div class="set-note">
          On quick-off, remember the device's mode; on quick-on, re-select it so the
          controller re-applies that mode's settings (instead of a bare manual on).
          Saved on the controller, so it syncs across your devices.
        </div>`:U}
      `:U}`:U,$t=Z?W`
      ${this.setHead(this._setOutletOpen,"Outlets",()=>this._setOutletOpen=!this._setOutletOpen)}
      ${this._setOutletOpen?W`
      <div class="toggle-row" style="margin-top:12px">
        <span>Custom outlet names</span>
        <button class="toggle ${O?"on":""}"
          style=${O?`background:${t}`:U}
          @click=${()=>nt({customNames:!O})}></button>
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
          @click=${()=>nt({showOutletsLog:!f})}></button>
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
          @click=${()=>nt({showOutletQuick:!v})}></button>
      </div>
      <div class="set-note">
        Shows a compact row of numbered on/off buttons above the outlet tiles for
        fast toggling.
      </div>
      ${v?W`
        <div class="toggle-row" style="margin-top:6px">
          <span>Show outlet names on quick buttons</span>
          <button class="toggle ${b?"on":""}"
            style=${b?`background:${t}`:U}
            @click=${()=>nt({outletQuickNames:!b})}></button>
        </div>
        <div class="set-note">
          On: buttons show the outlet number + name (e.g. "4-Heater"), or just the
          number for unnamed outlets. Off: a status dot + number.
        </div>
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember outlet settings on toggle</span>
          <button class="toggle ${_?"on":""}"
            style=${_?`background:${t}`:U}
            @click=${()=>nt({outletQuickRemember:!_})}></button>
        </div>
        <div class="set-note">
          On: quick-on restores the outlet's last mode/config (saved when you
          quick-off it). Off: plain on/off — a bare toggle reverts the outlet to
          Manual, like the device does.
        </div>`:U}`:U}`:U,xt=W`
      ${this.setHead(this._setLayoutOpen,"Layout",()=>this._setLayoutOpen=!this._setLayoutOpen)}
      ${this._setLayoutOpen?W`
      <div class="set-note">
        Resize the whole card and choose how many tiles sit per row. Saved to the
        controller, so it sticks across upgrades and your other devices.
      </div>
      <div class="toggle-row">
        <span>Custom layout</span>
        <button class="toggle ${D?"on":""}"
          style=${D?`background:${t}`:U}
          @click=${()=>nt({customLayout:!D})}></button>
      </div>
      ${D?W`
        <div class="set-note" style="margin-top:10px;display:flex;justify-content:space-between">
          <span>Scale</span><span style="color:${t};font-weight:500">${C}%</span>
        </div>
        <input type="range" min="70" max="150" step="5" .value=${String(C)}
          style="width:100%"
          @input=${t=>nt({scale:Number(t.target.value)})} />
        <div class="set-note" style="margin-top:10px">Tiles per row</div>
        <div class="seg-row" style="grid-template-columns:repeat(4,1fr)">
          ${[2,3,4,5].map(e=>W`
            <button class="seg ${M===e?"on":""}"
              style=${M===e?`border-color:${t};color:${t}`:U}
              @click=${()=>nt({cols:e})}><span>${e}</span></button>`)}
        </div>`:U}`:U}`;return W`
      ${[{label:"Colours & tile appearance",tpl:ut},{label:"Dehumidifier cooldown timer",tpl:gt},{label:"Devices",tpl:bt},{label:"Header connection info",tpl:vt},{label:"Layout",tpl:xt},{label:"Outlets",tpl:$t},{label:"Overview",tpl:mt},{label:"Smart control",tpl:pt},{label:"Temperature source",tpl:ht},{label:"Tile extras",tpl:ft},{label:"VPD graph",tpl:_t}].sort((t,e)=>t.label.localeCompare(e.label)).map(t=>t.tpl)}
      ${this.saveBar(at,()=>{const t=this.colorDraft;t&&(void 0!==t.mode&&t.mode!==this.colorMode&&(this.colorMode=t.mode,this.persistColorOption("colors",t.mode)),void 0!==t.modeIn&&t.modeIn!==this.colorModeIn&&(this.colorModeIn=t.modeIn,this.persistColorOption("colors_in",t.modeIn)),void 0!==t.source&&t.source!==this.colorSource&&(this.colorSource=t.source,this.persistColorOption("color_source",t.source)),void 0!==t.warn&&t.warn!==this.colWarn&&(this.colWarn=t.warn,this.persistColorOption("color_warn",t.warn)),void 0!==t.showTrend&&t.showTrend!==this.showTrend&&(this.showTrend=t.showTrend,this.persistColorOption("show_trend",t.showTrend?"1":"0")),void 0!==t.showBand&&t.showBand!==this.showBand&&(this.showBand=t.showBand,this.persistColorOption("show_band",t.showBand?"1":"0")),void 0!==t.showTargets&&t.showTargets!==this.showTargets&&(this.showTargets=t.showTargets,this.persistColorOption("show_targets",t.showTargets?"1":"0")),void 0!==t.tileSummary&&t.tileSummary!==this.tileSummary&&(this.tileSummary=t.tileSummary,this.persistColorOption("tile_summary",t.tileSummary?"1":"0")),void 0!==t.showConn&&t.showConn!==this.showConn&&(this.showConn=t.showConn,this.persistColorOption("show_conn",t.showConn?"1":"0")),void 0!==t.connCustom&&t.connCustom!==this.connCustom&&(this.connCustom=t.connCustom,this.persistColorOption("conn_custom",t.connCustom?"1":"0")),void 0!==t.connSignal&&t.connSignal!==this.connSignal&&(this.connSignal=t.connSignal,this.persistColorOption("conn_signal",t.connSignal)),void 0!==t.showOutletsLog&&t.showOutletsLog!==this.showOutletsLog&&(this.showOutletsLog=t.showOutletsLog,this.persistColorOption("outlets_log",t.showOutletsLog?"1":"0")),void 0!==t.showOutletQuick&&t.showOutletQuick!==this.showOutletQuick&&(this.showOutletQuick=t.showOutletQuick,this.persistColorOption("outlet_quick",t.showOutletQuick?"1":"0")),void 0!==t.outletQuickRemember&&t.outletQuickRemember!==this.outletQuickRemember&&(this.outletQuickRemember=t.outletQuickRemember,this.persistColorOption("outlet_quick_remember",t.outletQuickRemember?"1":"0")),void 0!==t.outletQuickNames&&t.outletQuickNames!==this.outletQuickNames&&(this.outletQuickNames=t.outletQuickNames,this.persistColorOption("outlet_quick_names",t.outletQuickNames?"1":"0")),void 0!==t.showVpd&&t.showVpd!==this.showVpd&&(this.showVpd=t.showVpd,this.persistColorOption("vpd_graph",t.showVpd?"1":"0")),void 0!==t.vpdLeaf&&t.vpdLeaf!==this.vpdLeaf&&(this.vpdLeaf=t.vpdLeaf,this.persistColorOption("vpd_leaf",t.vpdLeaf?"1":"0")),void 0!==t.showLeafVpd&&t.showLeafVpd!==this.showLeafVpd&&(this.showLeafVpd=t.showLeafVpd,this.persistColorOption("leaf_vpd_tile",t.showLeafVpd?"1":"0")),void 0!==t.showDeviceLog&&t.showDeviceLog!==this.showDeviceLog&&(this.showDeviceLog=t.showDeviceLog,this.persistColorOption("device_log",t.showDeviceLog?"1":"0")),void 0!==t.showDeviceQuick&&t.showDeviceQuick!==this.showDeviceQuick&&(this.showDeviceQuick=t.showDeviceQuick,this.persistColorOption("device_quick",t.showDeviceQuick?"1":"0")),void 0!==t.deviceQuickRemember&&t.deviceQuickRemember!==this.deviceQuickRemember&&(this.deviceQuickRemember=t.deviceQuickRemember,this.persistColorOption("device_quick_remember",t.deviceQuickRemember?"1":"0")),void 0!==t.hour12&&t.hour12!==this.hour12&&(this.hour12=t.hour12,this.persistColorOption("time_12h",t.hour12?"1":"0")),void 0!==t.hi&&t.hi!==this.colHi&&(this.colHi=t.hi,this.persistColorOption("color_hi",t.hi)),void 0!==t.lo&&t.lo!==this.colLo&&(this.colLo=t.lo,this.persistColorOption("color_lo",t.lo)),void 0!==t.in&&t.in!==this.colIn&&(this.colIn=t.in,this.persistColorOption("color_in",t.in)),void 0!==t.hide2&&t.hide2!==this.hideLight2&&(this.hideLight2=t.hide2,this.persistColorOption("hide_light2",t.hide2?"1":"0")),void 0!==t.customNames&&t.customNames!==this.customOutletNames&&(this.customOutletNames=t.customNames,this.persistColorOption("custom_outlet_names",t.customNames?"1":"0")),void 0!==t.customLayout&&t.customLayout!==this.customLayout&&(this.customLayout=t.customLayout,this.persistColorOption("custom_layout",t.customLayout?"1":"0")),void 0!==t.scale&&t.scale!==this.cardScale&&(this.cardScale=t.scale,this.persistColorOption("card_scale",String(t.scale))),void 0!==t.cols&&t.cols!==this.tileCols&&(this.tileCols=t.cols,this.persistColorOption("tile_cols",String(t.cols))),void 0!==t.tileRadius&&t.tileRadius!==this.tileRadius&&(this.tileRadius=t.tileRadius,this.persistColorOption("tile_radius",String(t.tileRadius))),void 0!==t.tileBorderW&&t.tileBorderW!==this.tileBorderW&&(this.tileBorderW=t.tileBorderW,this.persistColorOption("tile_border_w",String(t.tileBorderW))),void 0!==t.tileBorderCol&&t.tileBorderCol!==this.tileBorderCol&&(this.tileBorderCol=t.tileBorderCol,this.persistColorOption("tile_border_col",t.tileBorderCol)),void 0!==t.tileBg&&t.tileBg!==this.tileBg&&(this.tileBg=t.tileBg,this.persistColorOption("tile_bg",t.tileBg)),void 0!==t.taTiles&&t.taTiles!==this.taTiles&&(this.taTiles=t.taTiles,this.persistColorOption("ta_tiles",t.taTiles?"1":"0")),void 0!==t.taDevices&&t.taDevices!==this.taDevices&&(this.taDevices=t.taDevices,this.persistColorOption("ta_devices",t.taDevices?"1":"0")),void 0!==t.taOutlets&&t.taOutlets!==this.taOutlets&&(this.taOutlets=t.taOutlets,this.persistColorOption("ta_outlets",t.taOutlets?"1":"0")),void 0!==t.cdShow&&t.cdShow!==this.cooldownShow&&(this.cooldownShow=t.cdShow,this.persistColorOption("cooldown_show",t.cdShow?"1":"0")),void 0!==t.cdDevice&&t.cdDevice!==this.cooldownDevice&&(this.cooldownDevice=t.cdDevice,this.persistColorOption("cooldown_device",t.cdDevice?"1":"0")),void 0!==t.cdOutlet&&t.cdOutlet!==this.cooldownOutlet&&(this.cooldownOutlet=t.cdOutlet,this.persistColorOption("cooldown_outlet",t.cdOutlet?"1":"0")),void 0!==t.cdSecs&&t.cdSecs!==this.cooldownSecs&&(this.cooldownSecs=t.cdSecs,this.persistColorOption("cooldown_secs",String(t.cdSecs))),void 0!==t.ovOutlets&&t.ovOutlets!==this.outletsOnOverview&&(this.outletsOnOverview=t.ovOutlets,this.persistColorOption("overview_outlets",t.ovOutlets?"1":"0")),void 0!==t.ovQuick&&t.ovQuick!==this.outletQuickOverview&&(this.outletQuickOverview=t.ovQuick,this.persistColorOption("overview_quick",t.ovQuick?"1":"0")),void 0!==t.hideEnergy&&t.hideEnergy!==this.hideEnergyTile&&(this.hideEnergyTile=t.hideEnergy,this.persistColorOption("hide_energy_tile",t.hideEnergy?"1":"0")),void 0!==t.omode&&t.omode!==this.outletColorMode&&(this.outletColorMode=t.omode,this.persistColorOption("outlet_colors",t.omode)),void 0!==t.ocManual&&t.ocManual!==this.ocManual&&(this.ocManual=t.ocManual,this.persistColorOption("oc_manual",t.ocManual)),void 0!==t.ocSched&&t.ocSched!==this.ocSched&&(this.ocSched=t.ocSched,this.persistColorOption("oc_sched",t.ocSched)),void 0!==t.ocEnv&&t.ocEnv!==this.ocEnv&&(this.ocEnv=t.ocEnv,this.persistColorOption("oc_env",t.ocEnv)),void 0!==t.ocDrip&&t.ocDrip!==this.ocDrip&&(this.ocDrip=t.ocDrip,this.persistColorOption("oc_drip",t.ocDrip)),void 0!==t.dmode&&t.dmode!==this.deviceColorMode&&(this.deviceColorMode=t.dmode,this.persistColorOption("device_colors",t.dmode)),void 0!==t.dcManual&&t.dcManual!==this.dcManual&&(this.dcManual=t.dcManual,this.persistColorOption("dc_manual",t.dcManual)),void 0!==t.dcSched&&t.dcSched!==this.dcSched&&(this.dcSched=t.dcSched,this.persistColorOption("dc_sched",t.dcSched)),void 0!==t.dcAuto&&t.dcAuto!==this.dcAuto&&(this.dcAuto=t.dcAuto,this.persistColorOption("dc_auto",t.dcAuto)),this._commitTempSource(t),this._commitSmartControl(t),this._colorSynced=!0,this.cacheColors()),this.colorDraft=null},()=>this.colorDraft=null,"apply-bar")}`}}Yt.PLAN_PRESETS=[{key:"seedling",label:"Seedling cultivation",emoji:"🌱",tC:22.78,tCn:22.78,tDz:2.78,hd:75,hn:75,hDz:10,cd:600,cn:400,cDz:200,ppfd:200,on:"05:00",off:"23:00",fade:30},{key:"clone",label:"Cloning and seedling",emoji:"🌿",tC:23.89,tCn:22.22,tDz:2.78,hd:75,hn:75,hDz:10,cd:400,cn:400,cDz:100,ppfd:150,on:"05:00",off:"23:00",fade:30},{key:"veg",label:"Vegetative growth",emoji:"🌿",tC:29.4444,tCn:23.8889,tDz:2.7778,hd:70,hn:65,hDz:10,cd:1e3,cn:500,cDz:200,ppfd:600,on:"05:00",off:"23:00",fade:30},{key:"flower",label:"Flowering period",emoji:"🌸",tC:25,tCn:22.7778,tDz:2.7778,hd:55,hn:55,hDz:5,cd:1e3,cn:400,cDz:200,ppfd:900,on:"05:00",off:"17:00",fade:30},{key:"dry",label:"Dry",emoji:"🍂",tC:15.56,tCn:15.56,tDz:1.67,hd:55,hn:55,hDz:5,ppfd:0}],Yt.MY_TPL_KEY="sf-plan-templates",Yt.VPD_TH=[.4,.8,1.2,1.6,2],Yt.VPD_COL=[[31,113,161],[35,170,156],[150,197,90],[228,192,42],[236,140,45],[206,66,51]],Yt.styles=n`
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
    .tile-sub2.od-day { color: #f2b632; }
    .tile-sub2.od-night { color: #7b8cff; }
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
    /* Outlet-tile cooldown: absolute overlay pinned to the middle-right so it
       never changes the tile's height (the tile content is left-aligned, so the
       right half is free). Compact + smaller font to fit. */
    .cd-pill.cd-outlet {
      position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
      width: auto; margin: 0; align-items: flex-end; gap: 2px; max-width: 54%; z-index: 1;
    }
    .cd-pill.cd-outlet .cd-txt { font-size: 9px; gap: 2px; }
    .cd-pill.cd-outlet .cd-txt ha-icon { --mdc-icon-size: 11px; }
    .cd-pill.cd-outlet .cd-bar { width: 56px; }
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
  `,t([ut({attribute:!1})],Yt.prototype,"hass",void 0),t([gt()],Yt.prototype,"config",void 0),t([gt()],Yt.prototype,"tab",void 0),t([gt()],Yt.prototype,"envSubView",void 0),t([gt()],Yt.prototype,"planDraft",void 0),t([gt()],Yt.prototype,"planEditStage",void 0),t([gt()],Yt.prototype,"planShowAll",void 0),t([gt()],Yt.prototype,"planTplOpen",void 0),t([gt()],Yt.prototype,"planTplName",void 0),t([gt()],Yt.prototype,"_tplMsg",void 0),t([gt()],Yt.prototype,"planDelArm",void 0),t([gt()],Yt.prototype,"_planPending",void 0),t([gt()],Yt.prototype,"colorMode",void 0),t([gt()],Yt.prototype,"colHi",void 0),t([gt()],Yt.prototype,"colLo",void 0),t([gt()],Yt.prototype,"colorModeIn",void 0),t([gt()],Yt.prototype,"colIn",void 0),t([gt()],Yt.prototype,"colWarn",void 0),t([gt()],Yt.prototype,"colorSource",void 0),t([gt()],Yt.prototype,"showTrend",void 0),t([gt()],Yt.prototype,"showBand",void 0),t([gt()],Yt.prototype,"showTargets",void 0),t([gt()],Yt.prototype,"tileSummary",void 0),t([gt()],Yt.prototype,"hour12",void 0),t([gt()],Yt.prototype,"customOutletNames",void 0),t([gt()],Yt.prototype,"outletNames",void 0),t([gt()],Yt.prototype,"showConn",void 0),t([gt()],Yt.prototype,"connCustom",void 0),t([gt()],Yt.prototype,"connSignal",void 0),t([gt()],Yt.prototype,"showOutletsLog",void 0),t([gt()],Yt.prototype,"showVpd",void 0),t([gt()],Yt.prototype,"showLeafVpd",void 0),t([gt()],Yt.prototype,"_colorOpen",void 0),t([gt()],Yt.prototype,"_tsOpen",void 0),t([gt()],Yt.prototype,"_cdOpen",void 0),t([gt()],Yt.prototype,"_setOverviewOpen",void 0),t([gt()],Yt.prototype,"_setExtrasOpen",void 0),t([gt()],Yt.prototype,"_setConnOpen",void 0),t([gt()],Yt.prototype,"_setVpdOpen",void 0),t([gt()],Yt.prototype,"_setDevOpen",void 0),t([gt()],Yt.prototype,"_setOutletOpen",void 0),t([gt()],Yt.prototype,"_setLayoutOpen",void 0),t([gt()],Yt.prototype,"vpdLeaf",void 0),t([gt()],Yt.prototype,"vpdStage",void 0),t([gt()],Yt.prototype,"vpdView",void 0),t([gt()],Yt.prototype,"vpdHighlight",void 0),t([gt()],Yt.prototype,"vpdPlanSource",void 0),t([gt()],Yt.prototype,"ologRange",void 0),t([gt()],Yt.prototype,"ologOpen",void 0),t([gt()],Yt.prototype,"_ologVer",void 0),t([gt()],Yt.prototype,"_saving",void 0),t([gt()],Yt.prototype,"outletCopyOpen",void 0),t([gt()],Yt.prototype,"outletCopySel",void 0),t([gt()],Yt.prototype,"outletCopyFromOpen",void 0),t([gt()],Yt.prototype,"showOutletQuick",void 0),t([gt()],Yt.prototype,"outletQuickRemember",void 0),t([gt()],Yt.prototype,"outletQuickNames",void 0),t([gt()],Yt.prototype,"showDeviceLog",void 0),t([gt()],Yt.prototype,"showDeviceQuick",void 0),t([gt()],Yt.prototype,"deviceQuickRemember",void 0),t([gt()],Yt.prototype,"dlogOpen",void 0),t([gt()],Yt.prototype,"_devOff",void 0),t([gt()],Yt.prototype,"_cdTick",void 0),t([gt()],Yt.prototype,"customLayout",void 0),t([gt()],Yt.prototype,"cardScale",void 0),t([gt()],Yt.prototype,"tileCols",void 0),t([gt()],Yt.prototype,"tileRadius",void 0),t([gt()],Yt.prototype,"tileBorderW",void 0),t([gt()],Yt.prototype,"tileBorderCol",void 0),t([gt()],Yt.prototype,"tileBg",void 0),t([gt()],Yt.prototype,"taTiles",void 0),t([gt()],Yt.prototype,"taDevices",void 0),t([gt()],Yt.prototype,"taOutlets",void 0),t([gt()],Yt.prototype,"cooldownShow",void 0),t([gt()],Yt.prototype,"cooldownDevice",void 0),t([gt()],Yt.prototype,"cooldownOutlet",void 0),t([gt()],Yt.prototype,"cooldownSecs",void 0),t([gt()],Yt.prototype,"outletsOnOverview",void 0),t([gt()],Yt.prototype,"outletQuickOverview",void 0),t([gt()],Yt.prototype,"hideEnergyTile",void 0),t([gt()],Yt.prototype,"tempSource",void 0),t([gt()],Yt.prototype,"extTemp",void 0),t([gt()],Yt.prototype,"extHumi",void 0),t([gt()],Yt.prototype,"_smartOpen",void 0),t([gt()],Yt.prototype,"smart",void 0),t([gt()],Yt.prototype,"paramOpen",void 0),t([gt()],Yt.prototype,"_graphVer",void 0),t([gt()],Yt.prototype,"graphRange",void 0),t([gt()],Yt.prototype,"_graphSel",void 0),t([gt()],Yt.prototype,"_graphPin",void 0),t([gt()],Yt.prototype,"hideLight2",void 0),t([gt()],Yt.prototype,"outletColorMode",void 0),t([gt()],Yt.prototype,"ocManual",void 0),t([gt()],Yt.prototype,"ocSched",void 0),t([gt()],Yt.prototype,"ocEnv",void 0),t([gt()],Yt.prototype,"ocDrip",void 0),t([gt()],Yt.prototype,"deviceColorMode",void 0),t([gt()],Yt.prototype,"dcManual",void 0),t([gt()],Yt.prototype,"dcSched",void 0),t([gt()],Yt.prototype,"dcAuto",void 0),t([gt()],Yt.prototype,"colorDraft",void 0),t([gt()],Yt.prototype,"alertsDraft",void 0),t([gt()],Yt.prototype,"soilOpen",void 0),t([gt()],Yt.prototype,"soilAllOpen",void 0),t([gt()],Yt.prototype,"deviceOpen",void 0),t([gt()],Yt.prototype,"outletOpen",void 0),t([gt()],Yt.prototype,"draft",void 0),t([gt()],Yt.prototype,"modePick",void 0),t([gt()],Yt.prototype,"dirPick",void 0),t([gt()],Yt.prototype,"outletLightDir",void 0),t([gt()],Yt.prototype,"outletDraft",void 0),t([gt()],Yt.prototype,"outletNameDraft",void 0),t([gt()],Yt.prototype,"outletCfgDraft",void 0),t([gt()],Yt.prototype,"_stDt",void 0),t([gt()],Yt.prototype,"leafSpots",void 0),t([gt()],Yt.prototype,"leafCalTarget",void 0),t([gt()],Yt.prototype,"logDate",void 0),t([gt()],Yt.prototype,"logDev",void 0),t([gt()],Yt.prototype,"logType",void 0);class Xt extends ct{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,i={...this._config};e?i.panel=e:delete i.panel,this._emit(i)}_titleChanged(t){const e=t.target.value.trim(),i={...this._config};e?i.title=e:delete i.title,this._emit(i)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const i=e.target.checked,s=new Set(this._config.outlets??[]);i?s.add(t):s.delete(t);const o=[...s].sort(),a={...this._config};o.length?a.outlets=o:delete a.outlets,this._emit(a)}render(){if(!this.hass)return U;const t=this._config,e=t.default_tab,i=St(this.hass),s=Ct(this.hass,t.panel),o=/^(ac|st)\d+/.test(t.panel||"")||s.length>0,a=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.outlets_log),n=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.vpd_graph),r=!(!t.panel||"1"!==this.hass.states[`sensor.sf_${t.panel}_alarm_settings`]?.attributes?.card_options?.device_log),l=t=>{const e=Mt(this.hass,t);return e?`${t} — ${e}`:t};return W`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${i.length?U:W`<option value="">(no devices found yet)</option>`}
            ${t.panel?U:W`<option value="" selected>— choose a device —</option>`}
            ${i.map(e=>W`<option value=${e} ?selected=${e===t.panel}>${l(e)}</option>`)}
            ${t.panel&&!i.includes(t.panel)?W`<option value=${t.panel} selected>${t.panel} (not found)</option>`:U}
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
            ${o?W`<option value="outlets" ?selected=${"outlets"===e}>Outlets</option>`:U}
            ${o&&a?W`<option value="outlets_log" ?selected=${"outlets_log"===e}>Outlets Log</option>`:U}
            ${r?W`<option value="device_log" ?selected=${"device_log"===e}>Device Log</option>`:U}
            ${n?W`<option value="vpd" ?selected=${"vpd"===e}>VPD</option>`:U}
            <option value="calibration" ?selected=${"calibration"===e||"cali"===e}>Calibration</option>
            <option value="alerts" ?selected=${"alerts"===e}>Alerts</option>
            <option value="log" ?selected=${"log"===e}>Log</option>
          </select>
        </label>

        ${s.length?W`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${s.map(e=>W`
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
  `,t([ut({attribute:!1})],Xt.prototype,"hass",void 0),t([gt()],Xt.prototype,"_config",void 0);const Zt=/^sf_(se\d+)_light$/;function te(t){const e=new Set;for(const i of Object.keys(t.states)){if(!i.startsWith("light."))continue;const t=_t(i).match(Zt);t&&e.add(t[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}class ee extends ct{constructor(){super(...arguments),this.draft=null,this.ctlDraft={}}setConfig(t){this.config=t}getCardSize(){return 7}static getStubConfig(t){const e=t?te(t):[];return{type:"custom:spider-light-card",...e[0]?{light:e[0]}:{}}}accent(){return this.config.accent||mt}seSlot(){return this.config.light||(this.hass?te(this.hass)[0]:"")||"se1"}get(t){return this.hass?.states[t]}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("draft")||t.has("ctlDraft")}cur(t,e){return t in this.ctlDraft?this.ctlDraft[t]:e}stageCtl(t,e){this.ctlDraft={...this.ctlDraft,[t]:e}}isDirty(){return Object.keys(this.ctlDraft).length>0||null!==this.draft}applyAll(t){const e=this.ctlDraft,i=`light.sf_${t}_light`;if("bri"in e){const t=Number(e.bri);t>0?this.hass?.callService("light","turn_on",{entity_id:i,brightness_pct:t}):this.hass?.callService("light","turn_off",{entity_id:i})}"mode"in e&&this.hass?.callService("select","select_option",{entity_id:`select.sf_${t}_mode`,option:e.mode});for(const t of Object.keys(e))t.includes(".")&&(t.startsWith("number.")?this.hass?.callService("number","set_value",{entity_id:t,value:Number(e[t])}):t.startsWith("text.")&&this.hass?.callService("text","set_value",{entity_id:t,value:e[t]}));if("power"in e){const t="on"===e.power;t&&"bri"in e||this.hass?.callService("light",t?"turn_on":"turn_off",{entity_id:i})}this.draft&&this.saveSchedule(t),this.ctlDraft={}}discardAll(){Object.keys(this.ctlDraft).length&&(this.ctlDraft={}),null!==this.draft&&(this.draft=null)}render(){if(!this.hass||!this.config)return U;const t=this.seSlot(),e=this.get(`light.sf_${t}_light`);if(!e)return W`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light?` for "${this.config.light}"`:""}.
        </div>
      </ha-card>`;const i="on"===e.state,s=i?Math.max(0,Math.min(100,Math.round((e.attributes.brightness??0)/255*100))):0,o=this.get(`select.sf_${t}_mode`),a=this.cur("mode",o?.state??""),n="bri"in this.ctlDraft,r="on"===this.cur("power",i?"on":"off"),l=n?Number(this.ctlDraft.bri):r?s:0,c=n?l>0:r,d=Mt(this.hass,t),h=this.accent(),p=l/100,[u,g]=bt(100,100,78,135+270*p);return W`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Light"}</span>
          ${d?W`<span class="device">${d}</span>`:U}
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

        ${o?W`<div class="modes">
              ${(o.attributes.options??["Manual","Automatic"]).map(t=>W`<button
                  class="mode ${a===t?"active":""}"
                  style=${a===t?`color:${h};border-color:${h}`:""}
                  @click=${()=>this.stageCtl("mode",t)}>${t}</button>`)}
            </div>`:U}

        ${"Automatic"===a?this.renderSchedule(t):U}
        ${qt(h,this.isDirty(),()=>this.applyAll(t),()=>this.discardAll(),"apply-bar")}
      </ha-card>`}periodsFor(t){if(this.draft)return this.draft;const e=this.get(`sensor.sf_${t}_schedule`)?.attributes.periods;return Array.isArray(e)?e:[]}edit(t,e){const i=this.draft??this.periodsFor(t),s=JSON.parse(JSON.stringify(i));e(s),this.draft=s}saveSchedule(t){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${t}_light`,periods:this.draft}),this.draft=null)}renderSchedule(t){if(!this.get(`sensor.sf_${t}_schedule`))return this.renderScheduleLegacy(t);const e=this.periodsFor(t),i=this.accent();return W`
      <div class="section-label">Schedule</div>
      ${e.map((e,s)=>this.renderPeriod(t,e,s,i))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(t,t=>t.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          + Add period
        </button>
      </div>`}renderPeriod(t,e,i,s){return W`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${i+1}</span>
          <button class="del" aria-label="Delete period"
            @click=${()=>this.edit(t,t=>t.splice(i,1))}>✕</button>
        </div>
        <div class="days">
          ${ft.map((o,a)=>W`<button
              class="day ${e.days.includes(a)?"on":""}"
              style=${e.days.includes(a)?`background:${s};border-color:${s}`:""}
              @click=${()=>this.edit(t,t=>{const e=t[i].days,s=e.indexOf(a);s>=0?e.splice(s,1):e.push(a),e.sort((t,e)=>t-e)})}>${o}</button>`)}
        </div>
        <div class="sched-times">
          <div class="tf">
            <span class="tf-lbl">Start</span>
            <input type="time" .value=${e.start}
              @change=${e=>this.edit(t,t=>{t[i].start=e.target.value})} />
          </div>
          <span class="dash">—</span>
          <div class="tf">
            <span class="tf-lbl">Stop</span>
            <input type="time" .value=${e.end}
              @change=${e=>this.edit(t,t=>{t[i].end=e.target.value})} />
          </div>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Brightness</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${String(e.brightness)}
              style="accent-color:${s}" data-unit="%"
              @input=${xt}
              @change=${e=>this.edit(t,t=>{t[i].brightness=Number(e.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${e.brightness}%</span>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Sun fade</span>
          <span class="sl-live">
            <input type="range" min="0" max="30" .value=${String(e.fade)}
              style="accent-color:${s}" data-unit="m"
              @input=${xt}
              @change=${e=>this.edit(t,t=>{t[i].fade=Number(e.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${e.fade}m</span>
        </div>
      </div>`}renderScheduleLegacy(t){const e=this.get(`text.sf_${t}_schedule_start`),i=this.get(`text.sf_${t}_schedule_stop`),s=this.get(`number.sf_${t}_schedule_brightness`),o=this.get(`number.sf_${t}_sunrise_sunset_fade`);return e||i||s||o?W`
      <div class="section-label">Schedule</div>
      ${e||i?W`<div class="sched-times">
            ${this.timeField(`text.sf_${t}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${t}_schedule_stop`,"Stop")}
          </div>`:U}
      ${s?this.numRow(`number.sf_${t}_schedule_brightness`,"Brightness",s):U}
      ${o?this.numRow(`number.sf_${t}_sunrise_sunset_fade`,"Sunrise / sunset fade",o):U}`:U}timeField(t,e){const i=this.get(t);if(!i)return U;const s="unknown"===i.state||"unavailable"===i.state?"":i.state,o=this.cur(t,s);return W`<div class="tf">
      <span class="tf-lbl">${e}</span>
      <input type="time" .value=${o}
        @change=${e=>this.stageCtl(t,e.target.value)} />
    </div>`}numRow(t,e,i){const s=i.attributes.min??0,o=i.attributes.max??100,a=i.attributes.step??1,n=i.attributes.unit_of_measurement??"",r="unknown"===i.state||"unavailable"===i.state?"":i.state,l=this.cur(t,r);return W`<div class="num-row">
      <span class="nr-lbl">${e}</span>
      <span class="sl-live">
        <input type="range" min=${s} max=${o} step=${a} .value=${String(l)}
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
  `,t([ut({attribute:!1})],ee.prototype,"hass",void 0),t([gt()],ee.prototype,"config",void 0),t([gt()],ee.prototype,"draft",void 0),t([gt()],ee.prototype,"ctlDraft",void 0);const ie={SE4500:{name:"SE4500",watts:320,isBar:!0,barCount:3,lW:1.163,lL:.369,ppfd:{8:{c:1800,a:1350,e:900},10:{c:1500,a:1150,e:780},12:{c:1250,a:960,e:650},14:{c:1060,a:820,e:545},16:{c:910,a:700,e:465},18:{c:790,a:610,e:400},20:{c:690,a:530,e:350},22:{c:610,a:470,e:305},24:{c:545,a:420,e:270},26:{c:490,a:375,e:240},28:{c:440,a:340,e:215},30:{c:400,a:305,e:195},32:{c:360,a:275,e:175},36:{c:300,a:230,e:145},42:{c:240,a:184,e:115},48:{c:195,a:149,e:93},60:{c:150,a:115,e:72},72:{c:118,a:90,e:56},84:{c:95,a:72,e:45}}},SF2000:{name:"SF2000",watts:200,isBar:!1,barCount:0,lW:.864,lL:.432,ppfd:{8:{c:1600,a:1050,e:480},10:{c:1320,a:870,e:400},12:{c:1100,a:720,e:330},14:{c:920,a:600,e:275},16:{c:780,a:505,e:230},18:{c:660,a:430,e:193},20:{c:570,a:370,e:165},22:{c:495,a:320,e:143},24:{c:435,a:280,e:125},26:{c:385,a:248,e:110},28:{c:340,a:218,e:97},30:{c:305,a:196,e:87},32:{c:274,a:176,e:78},36:{c:226,a:145,e:64},42:{c:182,a:116,e:51},48:{c:148,a:95,e:42},60:{c:97,a:62,e:27},72:{c:68,a:43,e:19},84:{c:49,a:31,e:14}}},SE5000:{name:"SE5000",watts:480,isBar:!0,barCount:4,lW:.855,lL:.85,ppfd:{8:{c:1561,a:1101,e:597},10:{c:1478,a:1041,e:631},12:{c:1402,a:986,e:661},14:{c:1332,a:935,e:686},16:{c:1267,a:889,e:708},18:{c:1206,a:845,e:727},20:{c:1150,a:805,e:744},22:{c:1098,a:767,e:752},24:{c:1049,a:732,e:718},26:{c:1003,a:700,e:686},28:{c:960,a:669,e:656},30:{c:920,a:640,e:628},32:{c:883,a:614,e:601},36:{c:814,a:565,e:554},42:{c:725,a:502,e:492},48:{c:650,a:449,e:440},60:{c:531,a:366,e:358},72:{c:442,a:303,e:297},84:{c:373,a:256,e:251}}},SF7000:{name:"SF7000",watts:650,isBar:!1,barCount:0,lW:.737,lL:.558,ppfd:{8:{c:2560,a:1105,e:314},10:{c:2298,a:1052,e:359},12:{c:2053,a:983,e:394},14:{c:1881,a:955,e:434},16:{c:1714,a:912,e:465},18:{c:1597,a:903,e:506},20:{c:1441,a:833,e:520},22:{c:1328,a:798,e:543},24:{c:1218,a:752,e:556},26:{c:1138,a:734,e:582},28:{c:1059,a:704,e:598},30:{c:987,a:677,e:613},32:{c:922,a:651,e:626},36:{c:811,a:603,e:591},42:{c:678,a:541,e:530},48:{c:575,a:488,e:478},60:{c:429,a:403,e:395},72:{c:332,a:332,e:325},84:{c:265,a:265,e:259}}},G1000W:{name:"G1000W",watts:1e3,isBar:!0,barCount:8,lW:1.153,lL:1.122,ppfd:{8:{c:2156,a:1822,e:1555},10:{c:2068,a:1769,e:1527},12:{c:1985,a:1720,e:1501},14:{c:1908,a:1672,e:1476},16:{c:1834,a:1626,e:1451},18:{c:1765,a:1582,e:1427},20:{c:1700,a:1540,e:1404},22:{c:1638,a:1499,e:1382},24:{c:1580,a:1460,e:1360},26:{c:1524,a:1422,e:1339},28:{c:1472,a:1386,e:1319},30:{c:1422,a:1352,e:1299},32:{c:1375,a:1318,e:1280},36:{c:1287,a:1255,e:1230},42:{c:1170,a:1168,e:1145},48:{c:1068,a:1068,e:1047},60:{c:901,a:901,e:883},72:{c:770,a:770,e:755},84:{c:666,a:666,e:653}}}};function se(t,e,i){const s=t.ppfd,o=Object.keys(s).map(Number).sort((t,e)=>t-e);let a=o[0],n=o[o.length-1];for(let t=0;t<o.length-1;t++)if(e>=o[t]&&e<=o[t+1]){a=o[t],n=o[t+1];break}e<=o[0]&&(a=n=o[0]),e>=o[o.length-1]&&(a=n=o[o.length-1]);const r=a===n?0:(e-a)/(n-a),l=(t,e)=>Math.round((t+(e-t)*r)*i/100);return{center:l(s[a].c,s[n].c),avg:l(s[a].a,s[n].a),edge:l(s[a].e,s[n].e)}}function oe(t,e){const i=Math.max(0,Math.min(1,t/e));let s,o,a;if(i<.2){const t=i/.2;s=0,o=Math.round(80*t),a=Math.round(160+95*t)}else if(i<.4){const t=(i-.2)/.2;s=0,o=Math.round(80+175*t),a=Math.round(255-255*t)}else if(i<.6){const t=(i-.4)/.2;s=Math.round(220*t),o=255,a=0}else if(i<.8){const t=(i-.6)/.2;s=Math.round(220+35*t),o=Math.round(255-120*t),a=0}else{const t=(i-.8)/.2;s=255,o=Math.round(135-135*t),a=0}return[s,o,a]}class ae extends ct{constructor(){super(...arguments),this.tab="view",this.rev=0,this.s={tW:.61,tL:1.22,tH:1.981,model:"SE4500",hin:18,plantIn:12,numPlants:2,dim:100,photo:18,metric:!1},this.manualDim=100,this.auto=!1,this.brightSrc="",this.T=null,this.scene=null,this.camera=null,this.renderer=null,this.raf=0,this.o={},this.cam={theta:.52,phi:.36,r:3.8,drag:!1,px:0,py:0},this.dirty=!0,this.needRender=!0,this.fitDone=!1,this.serverSynced=!1,this.localApplied=!1,this.saveT=null,this.saved=null}setConfig(t){this.config=t;const e=t.defaults||{},i=t.tent||{};this.s.model=t.light_model&&ie[t.light_model]?t.light_model:"SE4500",this.s.hin=e.height_inches??18,this.s.plantIn=e.plant_height_inches??12,this.s.numPlants=e.num_plants??2,this.s.dim=e.dimmer_percent??100,this.manualDim=this.s.dim,this.s.photo=e.photoperiod_hours??18,this.s.tW=Math.max(.3,.3048*(i.width_ft??2)),this.s.tL=Math.max(.6,.3048*(i.length_ft??4)),this.s.tH=Math.max(.9,.3048*(i.height_ft??6.5)),this.s.metric=this.resolveMetric(),this.serverSynced=!1,this.localApplied=!1,this.dirty=!0,this.fitDone=!1,this.saved=this.blob()}getCardSize(){return 11}static getStubConfig(t){let e;if(t){const i=Object.keys(t.states).filter(t=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(t)).sort(),s=i[0]&&/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(i[0]);s&&(e=s[1])}return{type:"custom:ppfd-3d-card",title:"PPFD Visualizer",light_model:"SE4500",unit_system:"auto",...e?{panel:e}:{},defaults:{height_inches:18,plant_height_inches:12,num_plants:2,dimmer_percent:100,photoperiod_hours:18},tent:{width_ft:2,length_ft:4,height_ft:6.5}}}resolveMetric(){const t=(this.config?.unit_system||"auto").toLowerCase();if("metric"===t)return!0;if("imperial"===t)return!1;const e=this.hass?.config?.unit_system;return!(!e||!e.length)&&"mi"!==e.length}fmtSmall(t){return this.s.metric?`${Math.round(2.54*t)} cm`:`${Math.round(t)}"`}fmtTentDim(t){return this.s.metric?(.3048*t).toFixed(2):(+t).toFixed(1)}tentUnit(){return this.s.metric?"m":"ft"}optKey(){const t=this.config||{};return"ppfd:"+(t.card_id||t.light_model||"main")}panelSlot(){if(this.config?.panel)return this.config.panel;if(this.hass){const t=Object.keys(this.hass.states).filter(t=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(t)).sort();if(t.length){const e=/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(t[0]);if(e)return e[1]}}return null}alarmEntity(){const t=this.panelSlot();if(!t||!this.hass)return null;const e=`sensor.sf_${t}_alarm_settings`;return this.hass.states[e]?e:null}lsKey(){return`ppfd3d:${this.panelSlot()||"nopanel"}:${this.optKey()}`}blob(){return{model:this.s.model,hin:this.s.hin,plantIn:this.s.plantIn,numPlants:this.s.numPlants,photo:this.s.photo,dim:this.manualDim,tW:this.s.tW,tL:this.s.tL,tH:this.s.tH,auto:!!this.auto,src:this.brightSrc||""}}applyBlob(t){t&&(t.model&&ie[t.model]&&(this.s.model=t.model),null!=t.hin&&(this.s.hin=t.hin),null!=t.plantIn&&(this.s.plantIn=t.plantIn),null!=t.numPlants&&(this.s.numPlants=t.numPlants),null!=t.photo&&(this.s.photo=t.photo),null!=t.dim&&(this.manualDim=t.dim,this.s.dim=t.dim),null!=t.tW&&(this.s.tW=t.tW),null!=t.tL&&(this.s.tL=t.tL),null!=t.tH&&(this.s.tH=t.tH),this.auto=!!t.auto,this.brightSrc=t.src||"")}hydrateLocal(){if(!this.localApplied){this.localApplied=!0;try{const t=localStorage.getItem(this.lsKey());t&&(this.applyBlob(JSON.parse(t)),this.dirty=!0)}catch{}this.saved=this.blob()}}adoptServer(){if(this.serverSynced)return;const t=this.alarmEntity();if(!t)return;this.serverSynced=!0;const e=this.hass.states[t].attributes.card_options,i=this.optKey();if(e&&void 0!==e[i])try{this.applyBlob(JSON.parse(e[i])),this.dirty=!0}catch{}this.saved=this.blob()}queueSaveView(){clearTimeout(this.saveT),this.saveT=setTimeout(()=>this.saveView(),700)}saveView(){const t=this.blob();if(this.saved)for(const e of ae.SET_FIELDS)t[e]=this.saved[e];this.persistBlob(t),this.saved=t}applySettings(){const t=this.blob();this.persistBlob(t),this.saved=t,this.repaint()}discardSettings(){this.saved&&(this.auto=!!this.saved.auto,this.brightSrc=this.saved.src||"",this.s.numPlants=this.saved.numPlants,this.s.photo=this.saved.photo??this.s.photo,this.s.tW=this.saved.tW,this.s.tL=this.saved.tL,this.s.tH=this.saved.tH,this.auto?this.readLive():this.s.dim=this.manualDim,this.dirty=!0,this.repaint())}settingsDirty(){const t=this.saved;return!!t&&(!!this.auto!=!!t.auto||(this.brightSrc||"")!==(t.src||"")||this.s.numPlants!==t.numPlants||this.s.photo!==(t.photo??this.s.photo)||this.s.tW!==t.tW||this.s.tL!==t.tL||this.s.tH!==t.tH)}persistBlob(t){const e=JSON.stringify(t),i=this.alarmEntity();i&&this.hass?.callService&&this.hass.callService("sf","set_card_option",{entity_id:i,key:this.optKey(),value:e});try{localStorage.setItem(this.lsKey(),e)}catch{try{const t=this.lsKey();for(const e of Object.keys(localStorage))e.startsWith("ppfd3d:")&&e!==t&&localStorage.removeItem(e);localStorage.setItem(t,e)}catch{}}}brightnessOf(t){if(!t)return 0;if(String(t.entity_id).startsWith("light.")){if("on"!==t.state)return 0;const e=t.attributes&&t.attributes.brightness;return null!=e?Math.round(e/255*100):100}const e=parseFloat(t.state);return isNaN(e)?0:Math.max(0,Math.min(100,Math.round(e)))}readLive(){if(!this.hass)return!1;let t=!1;const e=this.config?.entities||{};if(e.dimmer_percent){const i=this.hass.states[e.dimmer_percent];if(i){const e=parseFloat(i.state);if(!isNaN(e)){const i=Math.max(10,Math.min(100,e));i===this.s.dim||this.auto||(this.s.dim=i,this.manualDim=i,t=!0)}}}if(e.height_inches){const i=this.hass.states[e.height_inches];if(i){const e=parseFloat(i.state);if(!isNaN(e)){const i=Math.max(8,e);i!==this.s.hin&&(this.s.hin=i,t=!0)}}}if(this.auto&&this.brightSrc){const e=this.brightnessOf(this.hass.states[this.brightSrc]);e!==this.s.dim&&(this.s.dim=e,t=!0)}return t}willUpdate(t){if(t.has("config")&&this.hydrateLocal(),t.has("hass")&&this.hass){const t=this.resolveMetric();t!==this.s.metric&&(this.s.metric=t,this.dirty=!0),this.hydrateLocal(),this.adoptServer(),this.readLive()&&(this.dirty=!0)}}firstUpdated(){this.loadThree()}updated(){this.dirty&&(this.needRender=!0)}repaint(){this.rev++}tentInches(){return Math.round(this.s.tH/.0254)}onModel(t){this.s.model=t.target.value,this.dirty=!0,this.repaint(),this.queueSaveView()}onSlider(t,e){const i=Number(e.target.value),s=this.tentInches();"hin"===t?this.s.hin=Math.min(i,s):"plantIn"===t?this.s.plantIn=Math.min(i,s):"numPlants"===t?this.s.numPlants=isNaN(i)?1:Math.max(1,Math.min(12,Math.round(i))):"photo"===t?this.s.photo=isNaN(i)?18:Math.max(1,Math.min(24,Math.round(i))):"dim"===t&&(this.auto||(this.s.dim=i,this.manualDim=i)),this.dirty=!0,this.repaint(),"numPlants"!==t&&"photo"!==t&&this.queueSaveView()}photoFollowsLight(){return!!this.auto&&(this.brightSrc||"").startsWith("light.")}lightPhotoperiod(){if(!this.hass)return null;const t=/^light\.sf_(.+)_(light_\d+)$/.exec(this.brightSrc||"");if(!t)return null;const e=t[1],i=t[2],s=t=>{const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""};let o=s(`text.sf_${e}_${i}_ppfd_start`),a=s(`text.sf_${e}_${i}_ppfd_stop`);o&&a&&("00:00"!==o||"00:00"!==a)||(o=s(`text.sf_${e}_${i}_schedule_start`),a=s(`text.sf_${e}_${i}_schedule_stop`));const n=/^(\d{1,2}):(\d{2})/.exec(o),r=/^(\d{1,2}):(\d{2})/.exec(a);if(!n||!r)return null;const l=(60*+r[1]+ +r[2]-(60*+n[1]+ +n[2])+1440)%1440;return Math.round(l/60)}effectivePhoto(){if(this.photoFollowsLight()){const t=this.lightPhotoperiod();if(null!=t)return t}return this.s.photo}onTent(t,e){const i=Number(e.target.value),s=this.s.metric?1:.3048,o=isNaN(i)?this.s[t]:i*s;"tW"===t?this.s.tW=Math.max(.3,o):"tL"===t?this.s.tL=Math.max(.6,o):this.s.tH=Math.max(.9,o);const a=this.tentInches();this.s.hin>a&&(this.s.hin=a),this.s.plantIn>a&&(this.s.plantIn=a),this.dirty=!0,this.repaint()}onAuto(t){if(this.auto=t.target.checked,this.auto){if(!this.brightSrc){const t=this.brightOptions();t.length&&(this.brightSrc=t[0].id)}this.readLive()}else this.s.dim=this.manualDim;this.dirty=!0,this.repaint()}onBrightSrc(t){this.brightSrc=t.target.value,this.auto&&this.readLive(),this.dirty=!0,this.repaint()}brightOptions(){if(!this.hass)return[];return Object.keys(this.hass.states).filter(t=>!!t.startsWith("light.sf_")||!(!t.startsWith("number.sf_")||!/schedule_brightness/i.test(t))).sort().map(t=>({id:t,name:this.hass.states[t].attributes.friendly_name||t}))}loadThree(){if(window.THREE)return void this.initThree();const t=window;if(!t._ppfdCBs){t._ppfdCBs=[];const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",e.onload=()=>t._ppfdCBs.forEach(t=>t()),document.head.appendChild(e)}t._ppfdCBs.push(()=>this.initThree())}canvas(){return this.renderRoot.querySelector("#c")}initThree(){const t=this.T=window.THREE,e=this.canvas();if(!t||!e)return;const i=e.parentElement?.offsetWidth||400;e.style.height="340px";const s=this.scene=new t.Scene;s.background=new t.Color(592914),this.camera=new t.PerspectiveCamera(36,i/340,.01,40);const o=this.renderer=new t.WebGLRenderer({canvas:e,antialias:!0});o.setSize(i,340),o.setPixelRatio(Math.min(devicePixelRatio,2)),s.add(new t.AmbientLight(3359829,1.1));const a=new t.DirectionalLight(16777215,.55);a.position.set(2,5,3),s.add(a),this.attachCam(e),this.dirty=!0,this.needRender=!0;const n=()=>{this.raf=requestAnimationFrame(n),this.dirty&&(this.dirty=!1,this.rebuild(),this.needRender=!0),this.needRender&&(this.needRender=!1,this.updCam(),o.render(s,this.camera))};n()}attachCam(t){t.addEventListener("mousedown",t=>{this.cam.drag=!0,this.cam.px=t.clientX,this.cam.py=t.clientY}),window.addEventListener("mouseup",()=>{this.cam.drag=!1}),window.addEventListener("mousemove",t=>{this.cam.drag&&(this.cam.theta-=.007*(t.clientX-this.cam.px),this.cam.phi=Math.max(.05,Math.min(1.3,this.cam.phi-.005*(t.clientY-this.cam.py))),this.cam.px=t.clientX,this.cam.py=t.clientY,this.needRender=!0)}),t.addEventListener("wheel",t=>{this.cam.r=Math.max(1.2,Math.min(10,this.cam.r+.005*t.deltaY)),this.needRender=!0},{passive:!0});let e=null;t.addEventListener("touchstart",t=>{1===t.touches.length&&(e={x:t.touches[0].clientX,y:t.touches[0].clientY,t:this.cam.theta,p:this.cam.phi})}),t.addEventListener("touchmove",t=>{e&&1===t.touches.length&&(this.cam.theta=e.t-.007*(t.touches[0].clientX-e.x),this.cam.phi=Math.max(.05,Math.min(1.3,e.p-.005*(t.touches[0].clientY-e.y))),this.needRender=!0)},{passive:!0})}updCam(){if(!this.camera)return;const{theta:t,phi:e,r:i}=this.cam,s=this.s.tH;this.camera.position.set(i*Math.cos(e)*Math.sin(t),i*Math.sin(e)+.38*s,i*Math.cos(e)*Math.cos(t)),this.camera.lookAt(0,.3*s,0)}rem(t){this.o[t]&&this.scene&&this.scene.remove(this.o[t]),this.o[t]=null}sprite(t,e){const i=this.T,s=document.createElement("canvas");s.width=128,s.height=64;const o=s.getContext("2d");return o.fillStyle="rgba(255,255,255,0.92)",o.font=`bold ${e}px sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(t,64,32),new i.Sprite(new i.SpriteMaterial({map:new i.CanvasTexture(s),transparent:!0,depthTest:!1}))}rebuild(){const t=this.T,e=this.scene;if(!t||!e)return;const{tW:i,tL:s,tH:o,model:a,hin:n,plantIn:r,numPlants:l,dim:c}=this.s,d=ie[a]||ie.SE4500,h=Math.max(1,n-r),p=se(d,h,c),u=.0254*r,g=.0254*n,m=i/2,f=s/2,v=i>s;this.rem("fr");const _=new t.Group,b=[[m,0,f],[m,0,-f],[-m,0,-f],[-m,0,f],[m,o,f],[m,o,-f],[-m,o,-f],[-m,o,f]],$=[];[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([t,e])=>$.push(...b[t],...b[e]));const x=new t.BufferGeometry;x.setAttribute("position",new t.Float32BufferAttribute($,3)),_.add(new t.LineSegments(x,new t.LineBasicMaterial({color:3822178})));const y=new t.Mesh(new t.BoxGeometry(i,o,s),new t.MeshStandardMaterial({color:12304282,side:t.BackSide,transparent:!0,opacity:.055,roughness:1}));y.position.set(0,o/2,0),_.add(y),e.add(_),this.o.fr=_,this.rem("ht");const w=new t.Group,S=Math.max(1.05*p.center,700),k=30,O=[],D=[],C=[],M=(v?d.lW:d.lL)/i,T=(v?d.lL:d.lW)/s,L=v?1:.7,N=v?.7:1;for(let t=0;t<=30;t++)for(let e=0;e<=k;e++){const o=e/k*i-m,a=t/30*s-f,n=2*(e/k-.5),r=2*(t/30-.5);let l;if(d.isBar){const t=Math.max(0,Math.abs(n)-.5*M)/(1-.5*M+.01),e=Math.max(0,Math.abs(r)-.5*T)/(1-.5*T+.01);l=p.edge+(p.center-p.edge)*Math.exp(-(t*t*3.8+e*e*9))}else{const t=Math.sqrt(n*n*L+r*r*N);l=p.edge+(p.center-p.edge)*Math.exp(-t*t*2.6)}l=Math.max(0,l),O.push(o,u+.004,a);const[c,h,g]=oe(l,S);D.push(c/255,h/255,g/255)}for(let t=0;t<30;t++)for(let e=0;e<k;e++){const i=31*t+e;C.push(i,i+31,i+1,i+1,i+31,i+31+1)}const P=new t.BufferGeometry;P.setAttribute("position",new t.Float32BufferAttribute(O,3)),P.setAttribute("color",new t.Float32BufferAttribute(D,3)),P.setIndex(C),P.computeVertexNormals(),w.add(new t.Mesh(P,new t.MeshBasicMaterial({vertexColors:!0,side:t.DoubleSide,transparent:!0,opacity:.9}))),[[0,p.center],[.36*i,p.avg],[.36*-i,p.avg]].forEach(([t,e])=>{const i=this.sprite(Math.round(e)+"",22);i.position.set(t,u+.065,0),i.scale.set(.25,.12,1),w.add(i)}),e.add(w),this.o.ht=w,this.rem("li");const E=new t.Group,R=new t.MeshStandardMaterial({color:5926525,metalness:.55,roughness:.45});if(d.isBar){const e=d.barCount;for(let i=0;i<e;i++){const s=1===e?0:-d.lL/2+d.lL/(e-1)*i,o=new t.Mesh(new t.BoxGeometry(.026,.013,d.lW),R);o.position.set(s,g,0),E.add(o);const a=new t.Mesh(new t.BoxGeometry(.017,.004,.9*d.lW),new t.MeshBasicMaterial({color:16775392}));a.position.set(s,g-.006,0),E.add(a)}[-d.lW/2,d.lW/2].forEach(e=>{const i=new t.Mesh(new t.BoxGeometry(d.lL,.01,.016),new t.MeshStandardMaterial({color:4018012,metalness:.4}));i.position.set(0,g,e),E.add(i)})}else{const e=new t.Mesh(new t.BoxGeometry(d.lL,.02,d.lW),new t.MeshStandardMaterial({color:4873579,metalness:.4,roughness:.6}));e.position.set(0,g,0),E.add(e);const i=new t.MeshBasicMaterial({color:16775392});for(let e=0;e<4;e++)for(let s=0;s<8;s++){const o=new t.Mesh(new t.CircleGeometry(.013,8),i);o.rotation.x=-Math.PI/2,o.position.set(-d.lL/2+(s+.5)*(d.lL/8),g-.009,-d.lW/2+(e+.5)*(d.lW/4)),E.add(o)}}const A=Math.min(o-.02,g+.05);if(A>g+.04){const e=new t.LineBasicMaterial({color:8947848,transparent:!0,opacity:.5});[-d.lL/2+.04,d.lL/2-.04].forEach(i=>{const s=(new t.BufferGeometry).setFromPoints([new t.Vector3(i,A,0),new t.Vector3(i,g,0)]);E.add(new t.Line(s,e))})}const F=new t.PointLight(16772778,.8,2.2);if(F.position.set(0,g,0),E.add(F),E.rotation.y=v?Math.PI/2:0,e.add(E),this.o.li=E,this.rem("bm"),g>u+.01){const o=new t.Group,a=Math.min(.28,.07+p.center/6e3),n=new t.LineBasicMaterial({color:16768341,transparent:!0,opacity:a}),r=.38*d.lL,l=.38*d.lW;[[-r,-l],[r,-l],[r,l],[-r,l]].forEach(([e,a])=>{const r=Math.sign(e)*i/2*.88,l=Math.sign(a)*s/2*.88,c=(new t.BufferGeometry).setFromPoints([new t.Vector3(e,g,a),new t.Vector3(r,u+.005,l)]);o.add(new t.Line(c,n))});const c=(new t.BufferGeometry).setFromPoints([new t.Vector3(0,g+.005,0),new t.Vector3(0,u+.005,0)]);o.add(new t.Line(c,new t.LineBasicMaterial({color:16777215,transparent:!0,opacity:.2}))),o.rotation.y=v?Math.PI/2:0,e.add(o),this.o.bm=o}this.rem("pl");const z=new t.Group,B=.0254*r,H=Math.min(.25,.35*B+.08),I=new t.MeshStandardMaterial({color:1710618,roughness:.9}),V=new t.MeshStandardMaterial({color:4025128,roughness:.8}),Q=new t.MeshStandardMaterial({color:3046686,roughness:.85,side:t.DoubleSide}),W=v?i:s,j=W/(l+1);for(let e=0;e<l;e++){const i=-W/2+j*(e+1),s=v?i:0,o=v?0:i,a=new t.Mesh(new t.CylinderGeometry(.06375,.075,H,12),I);a.position.set(s,H/2,o),z.add(a);const n=Math.max(.01,B-H);if(n>.015){const e=new t.Mesh(new t.CylinderGeometry(.011,.015,n,8),V);e.position.set(s,H+n/2,o),z.add(e);const i=Math.max(1,Math.floor(n/.09));for(let e=0;e<i;e++){const a=H+n*(.35+.55*e/Math.max(1,i-1)),r=Math.min(.11,.055+.16*n);for(let i=0;i<3;i++){const n=i*(2*Math.PI/3)+1.1*e,l=new t.Mesh(new t.SphereGeometry(r,6,4),Q);l.scale.set(1,.2,.5),l.position.set(s+Math.cos(n)*r*.6,a,o+Math.sin(n)*r*.6),z.add(l)}}}}if(e.add(z),this.o.pl=z,this.rem("hl"),g>u+.01){const s=new t.Group,o=-i/2-.07,a=new t.LineDashedMaterial({color:16777215,transparent:!0,opacity:.45,dashSize:.04,gapSize:.03}),l=(new t.BufferGeometry).setFromPoints([new t.Vector3(o,g,0),new t.Vector3(o,u,0)]),c=new t.Line(l,a);c.computeLineDistances(),s.add(c);const d=this.sprite(this.fmtSmall(n-r),28);d.position.set(o-.11,(g+u)/2,0),d.scale.set(.24,.12,1),s.add(d);const h=new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:.5}),p=new t.Mesh(new t.ConeGeometry(.013,.035,8),h);p.position.set(o,g-.02,0),s.add(p);const m=new t.Mesh(new t.ConeGeometry(.013,.035,8),h);m.rotation.z=Math.PI,m.position.set(o,u+.02,0),s.add(m),e.add(s),this.o.hl=s}this.fitDone||(this.fitDone=!0,this.cam.r=this.fitDistance()),this.updCam()}fitDistance(){return Math.min(10,Math.max(4.2,2+1.8*Math.max(this.s.tW,this.s.tL,this.s.tH)))}disconnectedCallback(){if(super.disconnectedCallback(),this.raf&&cancelAnimationFrame(this.raf),this.renderer)try{this.renderer.dispose()}catch{}}render(){if(!this.config)return U;const t=this.s,e=ie[t.model]||ie.SE4500,i=Math.max(1,t.hin-t.plantIn),s=se(e,i,t.dim),o=this.effectivePhoto(),a=(s.avg*o*3600/1e6).toFixed(1),n=(r=s.avg)<200?{label:"Too dim",color:"#4488dd"}:r<400?{label:"Seedling / early veg",color:"#22bbaa"}:r<600?{label:"Vegetative growth",color:"#44bb44"}:r<800?{label:"Transition / early flower",color:"#bbaa22"}:r<1e3?{label:"Peak flower zone",color:"#ee8800"}:{label:"High intensity — watch heat",color:"#dd2222"};var r;const l=this.tentInches(),c=this.tentUnit(),d=this.config.title||"PPFD visualizer",h=this.brightOptions();return W`
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
        ${"view"===this.tab?W`
          <div class="stats">
            <div class="stat"><div class="sl">Center PPFD</div><div class="sv">${s.center.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Avg canopy</div><div class="sv">${s.avg.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Edge PPFD</div><div class="sv">${s.edge.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">DLI @ ${o}h</div><div class="sv">${a}<span class="su">mol/m²/d</span></div></div>
          </div>
          <div class="leg"><span>Low</span><div class="legbar"></div><span>High PPFD</span></div>
          <div class="zone">
            <span class="zbadge" style="background:${n.color}22;color:${n.color};border:1px solid ${n.color}44">${n.label}</span>
            ${this.fmtSmall(i)} light-to-canopy · ${t.dim}% brightness · ${o}h light
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
        `:W`
          <div class="sec">Brightness</div>
          <div class="set">
            <label class="setrow"><input type="checkbox" .checked=${this.auto} @change=${this.onAuto}> Auto-read brightness from a light</label>
            <div class="cg"><span class="cl">Light source</span>
              <select .value=${this.brightSrc} @change=${this.onBrightSrc}>
                <option value="" ?selected=${!this.brightSrc}>— none —</option>
                ${h.map(t=>W`<option value=${t.id} ?selected=${this.brightSrc===t.id}>${t.name}</option>`)}
              </select>
            </div>
            <div class="hint">
              ${this.auto&&this.brightSrc?W`Reading ${this.hass?.states[this.brightSrc]?.attributes.friendly_name||this.brightSrc}: ${t.dim}%`:"Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target) and the value tracks it live."}
            </div>
          </div>
          <div class="div"></div>
          <div class="sec">Plants &amp; photoperiod</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Number of plants</span><input type="number" min="1" max="12" step="1" .value=${String(t.numPlants)} @change=${t=>this.onSlider("numPlants",t)}></div>
              <div class="cg"><span class="cl">Photoperiod (h)</span><input type="number" min="1" max="24" step="1" .value=${String(this.effectivePhoto())} ?disabled=${this.photoFollowsLight()} @change=${t=>this.onSlider("photo",t)}></div>
            </div>
            ${this.photoFollowsLight()?W`<div class="hint">Auto from the selected light's schedule — ${this.effectivePhoto()}h. Uncheck “Auto-read brightness from a light” to set hours manually.</div>`:U}
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
  `,t([ut({attribute:!1})],ae.prototype,"hass",void 0),t([gt()],ae.prototype,"config",void 0),t([gt()],ae.prototype,"tab",void 0),t([gt()],ae.prototype,"rev",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",Yt),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Xt),customElements.get("spider-light-card")||customElements.define("spider-light-card",ee),customElements.get("ppfd-3d-card")||customElements.define("ppfd-3d-card",ae);const ne=window.customCards=window.customCards||[],re=t=>{ne.some(e=>e&&e.type===t.type)||ne.push(t)};re({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),re({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),re({type:"ppfd-3d-card",name:"PPFD 3D Grow Light Card",description:"3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.21.61 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const t=["spider-farmer-card","spider-light-card","ppfd-3d-card"],e=new Set([...t,...t.map(t=>`custom:${t}`)]),i=()=>{const t=[["spider-farmer-card",Yt],["spider-farmer-card-editor",Xt],["spider-light-card",ee],["ppfd-3d-card",ae]];for(const[e,i]of t)if(!customElements.get(e))try{customElements.define(e,i)}catch{}},s=()=>{let t=0;for(const i of(()=>{const t=[],e=new Set,i=s=>{if(!s||e.has(s))return;e.add(s);let o=[];try{o=s.querySelectorAll("hui-error-card")}catch{return}o.forEach(e=>t.push(e));let a=[];try{a=s.querySelectorAll("*")}catch{return}a.forEach(t=>{const e=t.shadowRoot;e&&i(e)})};return i(document),t})()){const s=i._config||{},o=s.origConfig&&s.origConfig.type||s.type||"";e.has(o)&&(i.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),t++)}return t};let o=0;const a=()=>{i(),s(),++o<12&&setTimeout(a,250)},n=()=>{i(),a()};"complete"===document.readyState?n():window.addEventListener("load",n,{once:!0})})();export{Yt as SpiderFarmerCard,Xt as SpiderFarmerCardEditor,ee as SpiderLightCard,ae as SpiderPpfdCard};
