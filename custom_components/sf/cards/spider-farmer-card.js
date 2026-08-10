/*! spider-farmer-card v0.20.50 | MIT */
function t(t,e,s,i){var o,a=arguments.length,r=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(r=(a<3?o(r):a>3?o(e,s,r):o(e,s))||r);return a>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(s,t,i)},n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,g=m?m.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);o?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const a=o.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const a=this.constructor;if(!1===i&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[b("elementProperties")]=new Map,y[b("finalized")]=new Map,v?.({ReactiveElement:y}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,k=w.trustedTypes,O=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,D="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,N=`<${M}>`,A=document,T=()=>A.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,P="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,L=/>/g,I=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,H=/"/g,j=/^(?:script|style|textarea|title)$/i,U=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),V=U(1),W=U(2),G=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,J=A.createTreeWalker(A,129);function Y(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==O?O.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let o,a=2===e?"<svg>":3===e?"<math>":"",r=z;for(let e=0;e<s;e++){const s=t[e];let n,l,d=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===z?"!--"===l[1]?r=F:void 0!==l[1]?r=L:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=I):void 0!==l[3]&&(r=I):r===I?">"===l[0]?(r=o??z,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?I:'"'===l[3]?H:B):r===H||r===B?r=I:r===F||r===L?r=z:(r=I,o=void 0);const h=r===I&&t[e+1].startsWith("/>")?" ":"";a+=r===z?s+N:d>=0?(i.push(n),s.slice(0,d)+D+s.slice(d)+C+h):s+C+(-2===d?e:h)}return[Y(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,a=0;const r=t.length-1,n=this.parts,[l,d]=Z(t,e);if(this.el=X.createElement(l,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&n.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(D)){const e=d[a++],s=i.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?at:st}),i.removeAttribute(t)}else t.startsWith(C)&&(n.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),J.nextNode(),n.push({type:2,index:++o});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===M)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)n.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=A.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===G)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const a=E(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??A).importNode(e,!0);J.currentNode=i;let o=J.nextNode(),a=0,r=0,n=s[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new et(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new rt(o,this,t)),this._$AV.push(e),n=s[++r]}a!==n?.index&&(o=J.nextNode(),a++)}return J.currentNode=A,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),E(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new X(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const o=this.strings;let a=!1;if(void 0===o)t=Q(this,t,e,0),a=!E(t)||t!==this._$AH&&t!==G,a&&(this._$AH=t);else{const i=t;let r,n;for(t=o[0],r=0;r<o.length-1;r++)n=Q(this,i[s+r],e,r),n===G&&(n=this._$AH[r]),a||=!E(n)||n!==this._$AH[r],n===q?t=q:t!==q&&(t+=(n??"")+o[r+1]),this._$AH[r]=n}a&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class at extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===G)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(X,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class dt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(T(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}dt._$litElement$=!0,dt.finalized=!0,lt.litElementHydrateSupport?.({LitElement:dt});const ct=lt.litElementPolyfillSupport;ct?.({LitElement:dt}),(lt.litElementVersions??=[]).push("4.2.2");
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
 */function ft(t){return ut({...t,state:!0,attribute:!1})}const mt="#ff7a1a",gt=["S","M","T","W","T","F","S"],vt=/^sf_(dp\d+|ac5|ac10|st\d+)_/;function bt(t){return t.split(".")[1]??""}function _t(t,e,s,i){const o=i*Math.PI/180;return[t+s*Math.cos(o),e+s*Math.sin(o)]}function $t(t,e,s,i,o){const a=135+270*i,r=135+270*o,[n,l]=_t(t,e,s,a),[d,c]=_t(t,e,s,r),h=r-a>180?1:0;return`M ${n.toFixed(2)} ${l.toFixed(2)} A ${s} ${s} 0 ${h} 1 ${d.toFixed(2)} ${c.toFixed(2)}`}function xt(t){const e=t.currentTarget,s=e.parentElement?.querySelector(".sl-bub");if(!s)return;const i=Number(e.min||"0"),o=Number(e.max||"100"),a=Number(e.value),r=o>i?(a-i)/(o-i):0,n=function(t){const e=String(t),s=e.indexOf(".");return s>=0?e.length-s-1:0}(Number(e.step||"1")),l=Number.isFinite(a)?a.toFixed(n):e.value;s.textContent="1"===e.dataset.off&&a<=i?"off":`${l}${e.dataset.unit??""}`,s.style.left=`calc(${r} * (100% - 18px) + 9px)`}const yt=r`
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
`;function wt(t){const e=new Set;for(const s of Object.keys(t.states)){const t=bt(s).match(vt);t&&e.add(t[1])}return[...e].sort()}function St(t){return wt(t).filter(e=>e.startsWith("st")&&!!t.states[`switch.sf_${e}_outlet_1`]||Object.keys(t.states).some(t=>{const s=bt(t);return s===`sf_${e}_temperature`||s===`sf_${e}_soil_avg_temperature`||s===`sf_${e}_light_1`||s===`sf_${e}_fan`||s===`sf_${e}_blower`}))}function kt(t,e){const s=`sf_${e}_`,i=Object.keys(t.states);return i.find(t=>bt(t)===`sf_${e}_temperature`)??i.find(t=>{const i=bt(t);return i.startsWith(s)&&!i.startsWith(`sf_${e}_env_`)})}function Ot(t,e){const s=kt(t,e);return s?t.entities?.[s]?.device_id:void 0}function Dt(t,e){if(!e)return[];const s=Ot(t,e);return s?function(t){return wt(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}(t).filter(i=>{if(i===e)return!1;const o=Ot(t,i),a=o?t.devices?.[o]:void 0;return a?.via_device_id===s}):[]}function Ct(t,e){if(!t||!e)return"";const s=kt(t,e);if(!s)return"";const i=t.entities?.[s]?.device_id,o=i?t.devices?.[i]:void 0;if(o)return o.name_by_user||o.name||"";const a=(t.states[s].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return a?a[1]:""}const Mt=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","Air VPD","mdi:water-opacity"],["leaf_vpd","Leaf VPD","mdi:leaf"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Nt={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},At={temperature:"temp",humidity:"humi",co2:"co2"},Tt="#ff6b6b",Et="rgba(255,107,107,0.16)",Rt=(t,e=.16)=>{const s=/^#?([0-9a-fA-F]{6})$/.exec((t||"").trim());if(!s)return`rgba(255,107,107,${e})`;const i=parseInt(s[1],16);return`rgba(${i>>16&255},${i>>8&255},${255&i},${e})`},Pt=t=>"string"==typeof t&&/^#[0-9a-fA-F]{6}$/.test(t),zt=t=>"alarms"===t||"targets"===t||"both"===t,Ft=mt,Lt={"Time Slot":["ts_type","ts_start","ts_stop"],Cycle:["cycle_start","cycle_run","cycle_off","cycle_times"],Temperature:["temp_device"],Humidity:["humidity_device"],CO2:["co2_device"],"Drip Irrigation":["drip_soil","drip_avg"],Manual:[]},It=mt,Bt=t=>!!t&&("unavailable"===t.state||"unknown"===t.state),Ht=t=>{const e=(t||"").match(/^(\d{1,2}):(\d{2})$/);if(!e)return null;const s=+e[1],i=+e[2];return s<=23&&i<=59?60*s+i:null},jt=(t,e,s,i,o="")=>V`<div class="save-bar ${o}">
  ${((t,e,s,i)=>V`
  <button class="save-btn" ?disabled=${!e}
    style=${e?`background:${t}`:""}
    @click=${s}>Apply</button>
  <button class="discard-btn" ?disabled=${!e}
    @click=${i}>Discard</button>`)(t,e,s,i)}
</div>`,Ut=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],Vt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],Wt=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],Gt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class qt extends dt{constructor(){super(...arguments),this.tab="overview",this.envSubView=null,this.planDraft=null,this.planEditStage=null,this.planShowAll=!1,this.planDelArm=!1,this.colorMode="off",this.colHi=Tt,this.colLo="#45b6ff",this.colorModeIn="off",this.colIn="#4caf7d",this.colWarn="#ffb300",this.colorSource="alarms",this.showTrend=!1,this.showBand=!1,this.showTargets=!0,this.tileSummary=!1,this.hour12=!1,this.customOutletNames=!1,this.outletNames={},this.customLayout=!1,this.cardScale=100,this.tileCols=3,this.paramOpen=null,this._hist={},this._graph={},this._graphLoading={},this._graphVer=0,this.hideLight2=!1,this.outletColorMode="off",this.ocManual=Ft,this.ocSched="#45b6ff",this.ocEnv="#4caf7d",this.ocDrip="#3cc8d0",this.deviceColorMode="off",this.dcManual=It,this.dcSched="#45b6ff",this.dcAuto="#4caf7d",this._colorSynced=!1,this.colorDraft=null,this.alertsDraft=null,this.soilOpen=null,this.soilAllOpen=!1,this.deviceOpen=null,this.outletOpen=null,this.draft={},this.modePick={},this.outletDraft={},this.outletNameDraft={},this.outletCfgDraft={},this.leafSpots=[],this.leafCalTarget="day",this.logDate=null,this.logDev="all",this.logType="all"}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"calibration"===e||"cali"===e?"cali":"alerts"===e?"alerts":"log"===e?"log":"overview";const s=t.alarm_colors;let i="tile"===s||"text"===s?s:"off";try{const e=localStorage.getItem(`sf-colors-${t.panel}`);if("off"===e||"tile"===e||"text"===e)i=e;else if(e){const t=JSON.parse(e);"off"!==t.mode&&"tile"!==t.mode&&"text"!==t.mode||(i=t.mode),"off"!==t.modeIn&&"tile"!==t.modeIn&&"text"!==t.modeIn||(this.colorModeIn=t.modeIn),Pt(t.hi)&&(this.colHi=t.hi),Pt(t.lo)&&(this.colLo=t.lo),Pt(t.in)&&(this.colIn=t.in),"boolean"==typeof t.hide2&&(this.hideLight2=t.hide2),"off"!==t.omode&&"tile"!==t.omode&&"text"!==t.omode||(this.outletColorMode=t.omode),Pt(t.ocManual)&&(this.ocManual=t.ocManual),Pt(t.ocSched)&&(this.ocSched=t.ocSched),Pt(t.ocEnv)&&(this.ocEnv=t.ocEnv),Pt(t.ocDrip)&&(this.ocDrip=t.ocDrip),"off"!==t.dmode&&"tile"!==t.dmode&&"text"!==t.dmode||(this.deviceColorMode=t.dmode),Pt(t.dcManual)&&(this.dcManual=t.dcManual),Pt(t.dcSched)&&(this.dcSched=t.dcSched),Pt(t.dcAuto)&&(this.dcAuto=t.dcAuto),zt(t.source)&&(this.colorSource=t.source),Pt(t.warn)&&(this.colWarn=t.warn),"boolean"==typeof t.showTrend&&(this.showTrend=t.showTrend),"boolean"==typeof t.showBand&&(this.showBand=t.showBand),"boolean"==typeof t.showTargets&&(this.showTargets=t.showTargets),"boolean"==typeof t.tileSummary&&(this.tileSummary=t.tileSummary),"boolean"==typeof t.hour12&&(this.hour12=t.hour12),"boolean"==typeof t.customNames&&(this.customOutletNames=t.customNames),t.outletNames&&"object"==typeof t.outletNames&&(this.outletNames=t.outletNames),"boolean"==typeof t.customLayout&&(this.customLayout=t.customLayout),"number"==typeof t.scale&&t.scale>=70&&t.scale<=150&&(this.cardScale=t.scale),"number"==typeof t.cols&&t.cols>=2&&t.cols<=5&&(this.tileCols=t.cols)}}catch{}this.colorMode=i,this._colorSynced=!1}serverColors(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;if(!t)return{};const e=t=>"off"===t||"tile"===t||"text"===t,s={};t.colors&&e(t.colors)&&(s.mode=t.colors),t.colors_in&&e(t.colors_in)&&(s.modeIn=t.colors_in),zt(t.color_source)&&(s.source=t.color_source),Pt(t.color_warn)&&(s.warn=t.color_warn),"1"!==t.show_trend&&"0"!==t.show_trend||(s.showTrend="1"===t.show_trend),"1"!==t.show_band&&"0"!==t.show_band||(s.showBand="1"===t.show_band),"1"!==t.show_targets&&"0"!==t.show_targets||(s.showTargets="1"===t.show_targets),"1"!==t.tile_summary&&"0"!==t.tile_summary||(s.tileSummary="1"===t.tile_summary),"1"!==t.time_12h&&"0"!==t.time_12h||(s.hour12="1"===t.time_12h),Pt(t.color_hi)&&(s.hi=t.color_hi),Pt(t.color_lo)&&(s.lo=t.color_lo),Pt(t.color_in)&&(s.in=t.color_in),"1"!==t.hide_light2&&"0"!==t.hide_light2||(s.hide2="1"===t.hide_light2),"1"!==t.custom_outlet_names&&"0"!==t.custom_outlet_names||(s.customNames="1"===t.custom_outlet_names),"1"!==t.custom_layout&&"0"!==t.custom_layout||(s.customLayout="1"===t.custom_layout);const i=parseInt(t.card_scale,10);Number.isFinite(i)&&i>=70&&i<=150&&(s.scale=i);const o=parseInt(t.tile_cols,10);return Number.isFinite(o)&&o>=2&&o<=5&&(s.cols=o),t.outlet_colors&&e(t.outlet_colors)&&(s.omode=t.outlet_colors),Pt(t.oc_manual)&&(s.ocManual=t.oc_manual),Pt(t.oc_sched)&&(s.ocSched=t.oc_sched),Pt(t.oc_env)&&(s.ocEnv=t.oc_env),Pt(t.oc_drip)&&(s.ocDrip=t.oc_drip),t.device_colors&&e(t.device_colors)&&(s.dmode=t.device_colors),Pt(t.dc_manual)&&(s.dcManual=t.dc_manual),Pt(t.dc_sched)&&(s.dcSched=t.dc_sched),Pt(t.dc_auto)&&(s.dcAuto=t.dc_auto),s}serverOutletNames(){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,e={};if(!t)return e;for(const[s,i]of Object.entries(t))s.startsWith("outlet_name_")&&"string"==typeof i&&(e[s.slice(12)]=i);return e}persistColorOption(t,e){const s=`sensor.sf_${this.config.panel}_alarm_settings`;this.get(s)&&this.hass?.callService("sf","set_card_option",{entity_id:s,key:t,value:e})}cacheColors(){try{localStorage.setItem(`sf-colors-${this.config.panel}`,JSON.stringify({mode:this.colorMode,modeIn:this.colorModeIn,source:this.colorSource,warn:this.colWarn,showTrend:this.showTrend,showBand:this.showBand,showTargets:this.showTargets,tileSummary:this.tileSummary,hour12:this.hour12,hi:this.colHi,lo:this.colLo,in:this.colIn,hide2:this.hideLight2,omode:this.outletColorMode,ocManual:this.ocManual,ocSched:this.ocSched,ocEnv:this.ocEnv,ocDrip:this.ocDrip,dmode:this.deviceColorMode,dcManual:this.dcManual,dcSched:this.dcSched,dcAuto:this.dcAuto,customNames:this.customOutletNames,outletNames:this.outletNames,customLayout:this.customLayout,scale:this.cardScale,cols:this.tileCols}))}catch{}}layoutStyle(){if(!this.customLayout)return"";const t=[`--sf-cols:${this.tileCols}`];return 100!==this.cardScale&&t.push(`zoom:${(this.cardScale/100).toFixed(2)}`),t.join(";")}outOfRange(t,e){const s=this.alertsSettings();if(!s||!Number.isFinite(e))return null;const i=[...s.climate||[],...s.substrate||[]].find(e=>e&&e.key===t);if(!i||!i.enabled)return null;const o=Number(i.max),a=Number(i.min);return Number.isFinite(o)&&e>o?"above":Number.isFinite(a)&&e<a?"below":null}colorForOor(t){return"above"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colHi,state:"above"}:"below"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colLo,state:"below"}:"near"===t?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colWarn,state:"near"}:"off"===this.colorModeIn?null:{mode:this.colorModeIn,color:this.colIn,state:"in"}}readingColor(t,e){const s=parseFloat(e);return Number.isFinite(s)?this.colorForOor(t?this.outOfRange(t,s):null):null}leafVpdRange(){const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max")),s=t=>t&&Number.isFinite(+t.state)?+t.state:null;return{min:s(t),max:s(e)}}planStageCurrent(){const t=this.planInfo();if(!t.active||!t.stages.length)return null;const e=t.progress?t.progress.stageId:void 0;return t.stages.find(t=>t.stageId===e)||t.stages[0]}targetInfo(t){const e=At[t];if(!e)return null;const s=this.config.panel,i=!1!==this.cycleIsDay(),o=this.planStageCurrent();if(o){const t=o[`${e}_${i?"day":"night"}`];if(null!=t&&Number.isFinite(Number(t))){let i=Number(t),a=Number(o[`${e}_dz`]);if("temp"===e){const t=this.get(`number.sf_${s}_env_temp_day`)?.attributes?.unit_of_measurement;"°F"!==t&&"℉"!==t||(i=9*i/5+32,Number.isFinite(a)&&(a=9*a/5))}return Number.isFinite(a)||(a=Number(this.get(`number.sf_${s}_env_${e}_deadband`)?.state??0)||0),{target:Math.round(10*i)/10,dead:Math.round(10*a)/10}}}const a=this.get(`number.sf_${s}_env_${e}_${i?"day":"night"}`),r=this.get(`number.sf_${s}_env_${e}_deadband`);if(!a||!r)return null;const n=parseFloat(a.state),l=parseFloat(r.state);return Number.isFinite(n)&&Number.isFinite(l)?{target:n,dead:l}:null}vpdRangeNums(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const o=Number(s.state),a=Number(i.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const r=this.config.panel,n=Number(this.get(`number.sf_${r}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${r}_env_humi_deadband`)?.state??0)||0,d="°C"===s.attributes.unit_of_measurement,c=t=>d?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3));return{lo:Math.max(0,h(c(o-n))*(1-Math.min(100,a+l)/100)),hi:Math.max(0,h(c(o+n))*(1-Math.max(0,a-l)/100))}}airVpdRange(){const t=this.config.panel,e=this.targetInfo("temperature"),s=this.targetInfo("humidity");if(!e||!s){const e=!1!==this.cycleIsDay()?"day":"night";return this.vpdRangeNums(`number.sf_${t}_env_temp_${e}`,`number.sf_${t}_env_humi_${e}`)}const i=this.get(`number.sf_${t}_env_temp_day`)?.attributes?.unit_of_measurement,o="°C"===i,a=t=>.6108*Math.exp(17.27*t/(t+237.3)),r=(t=>o?t:5*(t-32)/9)(e.target),n=o?e.dead:5*e.dead/9,l=Math.max(0,s.target-s.dead),d=Math.min(100,s.target+s.dead),c=Math.max(0,a(r-n)*(1-d/100)),h=Math.max(0,a(r+n)*(1-l/100));return h>c?{lo:c,hi:h}:null}targetBandRaw(t){const e=this.targetInfo(t);if(e)return{lo:e.target-e.dead,hi:e.target+e.dead,margin:e.dead};if("vpd"===t){const t=this.airVpdRange();return t&&t.hi>t.lo?{lo:t.lo,hi:t.hi,margin:.15*(t.hi-t.lo)}:null}if("leaf_vpd"===t){const{min:t,max:e}=this.leafVpdRange();return null!=t&&null!=e&&e>t?{lo:t,hi:e,margin:.15*(e-t)}:null}if(t.startsWith("soil_avg_")){const e=this.alarmRange(t);if(e)return{lo:e.lo,hi:e.hi,margin:.06*(e.hi-e.lo)}}return null}alarmRange(t){const e=Nt[t];if(!e)return null;const s=this.alertsSettings();if(!s)return null;const i=[...s.climate||[],...s.substrate||[]].find(t=>t&&t.key===e);if(!i||!i.enabled)return null;const o=Number(i.min),a=Number(i.max);return Number.isFinite(o)&&Number.isFinite(a)&&a>o?{lo:o,hi:a}:null}metricBand(t){const e=this.targetBandRaw(t);if("leaf_vpd"===t)return e;if("targets"===this.colorSource)return e;const s=this.alarmRange(t),i=s?{lo:s.lo,hi:s.hi,margin:0}:null;return"alarms"===this.colorSource?i:e??i}targetOutOfRange(t,e){const s=this.metricBand(t);return s?e>s.hi+s.margin?"above":e<s.lo-s.margin?"below":e>s.hi||e<s.lo?"near":null:null}targetSubline(t,e){if(!this.showTargets)return q;const s=this.targetInfo(t);if("alarms"!==this.colorSource&&s)return V`<div class="tile-target">target ${s.target}${e} · ±${s.dead}</div>`;const i=this.metricBand(t);if(!i)return q;const o="alarms"!==this.colorSource||"leaf_vpd"===t?"target":"range",a=Math.abs((i.lo+i.hi)/2),r=a<10?2:a<100?1:0;return V`<div class="tile-target">${o} ${i.lo.toFixed(r)}–${i.hi.toFixed(r)} ${e}</div>`}paramEid(t){return`sensor.sf_${this.config.panel}_${t}`}recordHistory(){const t=Date.now();for(const[e]of Mt){const s=this.get(this.paramEid(e)),i=s?parseFloat(s.state):NaN;if(!Number.isFinite(i))continue;const o=this.paramEid(e),a=this._hist[o]||(this._hist[o]=[]),r=a[a.length-1];for((!r||r.v!==i||t-r.t>6e4)&&a.push({t:t,v:i});a.length>60||a.length&&t-a[0].t>12e5;)a.shift()}}trend(t){const e=this._hist[this.paramEid(t)];if(!e||e.length<3)return null;const s=e[0].v,i=e[e.length-1].v,o=e.reduce((t,e)=>Math.max(t,Math.abs(e.v)),0)||1;return Math.abs(i-s)<Math.max(.05,.004*o)?"flat":i>s?"up":"down"}trendIcon(t){if(!this.showTrend)return q;const e=this.trend(t);if(!e)return q;return V`<ha-icon class="tile-trend" icon=${"up"===e?"mdi:trending-up":"down"===e?"mdi:trending-down":"mdi:trending-neutral"} style="color:${"up"===e?"#ff8a65":"down"===e?"#5db2ff":"var(--secondary-text-color)"}"></ha-icon>`}bandInfo(t){const e=this.metricBand(t);if(!e)return null;const s=e.hi-e.lo;return{min:e.lo-s-e.margin,max:e.hi+s+e.margin,bandLo:e.lo,bandHi:e.hi,warnLo:e.lo-e.margin,warnHi:e.hi+e.margin}}renderBand(t,e){if(!this.showBand||!Number.isFinite(e))return q;const s=this.bandInfo(t);if(!s)return q;let i=s.min,o=s.max;const a=o-i||1;e<i&&(i=e-.06*a),e>o&&(o=e+.06*a);const r=t=>Math.max(0,Math.min(100,(t-i)/(o-i)*100));return V`<div class="tile-band">
      <div class="bz" style=${`left:${r(s.warnLo)}%;width:${r(s.warnHi)-r(s.warnLo)}%;background:${Rt(this.colWarn,.28)}`}></div>
      <div class="bz" style=${`left:${r(s.bandLo)}%;width:${r(s.bandHi)-r(s.bandLo)}%;background:${Rt(this.colIn,.42)}`}></div>
      <div class="bmark" style=${`left:${r(e)}%`}></div>
    </div>`}toggleGraph(t){const e=this.paramOpen===t;this.paramOpen=e?null:t,e||this.fetchGraph(this.paramEid(t))}async fetchGraph(t){if(!this._graph[t]&&!this._graphLoading[t]&&this.hass){this._graphLoading[t]=!0;try{const e=new Date,s=new Date(e.getTime()-216e5),i=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:e.toISOString(),entity_ids:[t],minimal_response:!0,no_attributes:!0}),o=i&&i[t]||[];this._graph[t]=o.map(t=>({t:null!=t.lu?1e3*t.lu:Date.parse(t.last_updated??t.last_changed),v:parseFloat(t.s??t.state)})).filter(t=>Number.isFinite(t.v)&&Number.isFinite(t.t))}catch(e){this._graph[t]=[]}finally{this._graphLoading[t]=!1,this._graphVer++}}}renderParamGraph(){const t=this.paramOpen;if(!t)return q;const e=this.paramEid(t),s=(Mt.find(e=>e[0]===t)||[,t])[1],i=this.get(e)?.attributes.unit_of_measurement||"";if(this._graphLoading[e])return V`<div class="param-graph"><span class="pg-note">Loading history…</span></div>`;const o=this._graph[e];if(!o||o.length<2)return V`<div class="param-graph"><span class="pg-note">Not enough history yet for ${s}.</span></div>`;const a=o.map(t=>t.v),r=Math.min(...a),n=Math.max(...a),l=a.reduce((t,e)=>t+e,0)/a.length,d=a[a.length-1],c=Math.abs(l)<10?2:Math.abs(l)<100?1:0,h=t=>t.toFixed(c),p=this.bandInfo(t),u="leaf_vpd"===t||"alarms"!==this.colorSource?this.targetOutOfRange(t,d):this.outOfRange(Nt[t],d),f="above"===u?this.colHi:"below"===u?this.colLo:"near"===u?this.colWarn:"var(--primary-text-color)",m=520,g=120,v=o[0].t,b=o[o.length-1].t||v+1;let _=r,$=n;p&&(_=Math.min(_,p.warnLo),$=Math.max($,p.warnHi));const x=.08*($-_)||1;_-=x,$+=x;const y=t=>6+(t-v)/(b-v)*508,w=t=>114-(t-_)/($-_)*108,S=o.map((t,e)=>`${e?"L":"M"}${y(t.t).toFixed(1)} ${w(t.v).toFixed(1)}`).join(" "),k=`M${y(v).toFixed(1)} ${114..toFixed(1)} ${S.slice(1)} L${y(b).toFixed(1)} ${114..toFixed(1)} Z`,O=this.accent(),D=a.indexOf(r),C=a.indexOf(n),M=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),N=(t,e)=>W`<line x1="0" x2=${m} y1=${w(t).toFixed(1)} y2=${w(t).toFixed(1)} stroke=${e} stroke-width="1" stroke-dasharray="3 3" opacity="0.6"></line>`;return V`<div class="param-graph">
      <div class="pg-head">
        <span>${s} · last 6h</span>
        <span class="pg-now" style="color:${f}">${h(d)}<span class="pg-u">${i}</span></span>
        <ha-icon icon="mdi:close" @click=${()=>this.paramOpen=null}></ha-icon>
      </div>
      <div class="pg-stats">
        <span>min <b>${h(r)}</b></span><span>avg <b>${h(l)}</b></span>
        <span>max <b>${h(n)}</b></span>
        ${p?V`<span>band <b>${h(p.bandLo)}–${h(p.bandHi)}</b> ${i}</span>`:q}
      </div>
      <div class="pg-plot">
        <div class="pg-yax"><span>${h($)}</span><span>${h(_)}</span></div>
        <svg viewBox="0 0 ${m} ${g}" preserveAspectRatio="none" class="pg-svg">
          ${p?W`
            <rect x="0" y=${w(p.warnHi).toFixed(1)} width=${m} height=${(w(p.bandHi)-w(p.warnHi)).toFixed(1)} fill=${Rt(this.colWarn,.16)}></rect>
            <rect x="0" y=${w(p.bandLo).toFixed(1)} width=${m} height=${(w(p.warnLo)-w(p.bandLo)).toFixed(1)} fill=${Rt(this.colWarn,.16)}></rect>
            <rect x="0" y=${w(p.bandHi).toFixed(1)} width=${m} height=${(w(p.bandLo)-w(p.bandHi)).toFixed(1)} fill=${Rt(this.colIn,.2)}></rect>
            ${N(p.bandHi,this.colIn)}${N(p.bandLo,this.colIn)}`:q}
          <path d=${k} fill=${Rt(O,.12)} stroke="none"></path>
          <path d=${S} fill="none" stroke=${O} stroke-width="2"></path>
          <circle cx=${y(o[D].t).toFixed(1)} cy=${w(r).toFixed(1)} r="2.5" fill=${this.colLo}></circle>
          <circle cx=${y(o[C].t).toFixed(1)} cy=${w(n).toFixed(1)} r="2.5" fill=${this.colHi}></circle>
          <circle cx=${y(o[o.length-1].t).toFixed(1)} cy=${w(d).toFixed(1)} r="3.5" fill=${O}></circle>
        </svg>
      </div>
      <div class="pg-xax"><span>${M(v)}</span><span>${M(o[o.length-1].t)}</span></div>
    </div>`}soilCellStyle(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);if(!s||Bt(s))return"";const i="temperature"===e?"tempSoil":"moisture"===e?"humiSoil":"ECSoil",o=this.readingColor(i,s.state);return o?`color:${o.color}`:""}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?St(t):[])[0]||"dp1",s=t?Dt(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...s.length?{outlets:s}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||mt}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")||t.has("outletDraft")||t.has("outletNameDraft")||t.has("outletCfgDraft")||t.has("alertsDraft")||t.has("deviceOpen")||t.has("outletOpen")||t.has("draft")||t.has("modePick")||t.has("logDate")||t.has("logDev")||t.has("logType")||t.has("colorMode")||t.has("colorModeIn")||t.has("colHi")||t.has("colLo")||t.has("colIn")||t.has("hideLight2")||t.has("colorDraft")||t.has("outletColorMode")||t.has("ocManual")||t.has("ocSched")||t.has("ocEnv")||t.has("ocDrip")||t.has("deviceColorMode")||t.has("dcManual")||t.has("dcSched")||t.has("dcAuto")||t.has("colorSource")||t.has("colWarn")||t.has("showTrend")||t.has("showBand")||t.has("paramOpen")||t.has("_graphVer")||t.has("showTargets")||t.has("tileSummary")||t.has("hour12")||t.has("leafSpots")||t.has("leafCalTarget")||t.has("customOutletNames")||t.has("outletNames")||t.has("customLayout")||t.has("cardScale")||t.has("tileCols")}willUpdate(t){if(!this._colorSynced){const t=this.serverColors();Object.keys(t).length&&(t.mode&&(this.colorMode=t.mode),t.modeIn&&(this.colorModeIn=t.modeIn),t.source&&(this.colorSource=t.source),t.warn&&(this.colWarn=t.warn),void 0!==t.showTrend&&(this.showTrend=t.showTrend),void 0!==t.showBand&&(this.showBand=t.showBand),void 0!==t.showTargets&&(this.showTargets=t.showTargets),void 0!==t.tileSummary&&(this.tileSummary=t.tileSummary),void 0!==t.hour12&&(this.hour12=t.hour12),t.hi&&(this.colHi=t.hi),t.lo&&(this.colLo=t.lo),t.in&&(this.colIn=t.in),void 0!==t.hide2&&(this.hideLight2=t.hide2),t.omode&&(this.outletColorMode=t.omode),t.ocManual&&(this.ocManual=t.ocManual),t.ocSched&&(this.ocSched=t.ocSched),t.ocEnv&&(this.ocEnv=t.ocEnv),t.ocDrip&&(this.ocDrip=t.ocDrip),t.dmode&&(this.deviceColorMode=t.dmode),t.dcManual&&(this.dcManual=t.dcManual),t.dcSched&&(this.dcSched=t.dcSched),t.dcAuto&&(this.dcAuto=t.dcAuto),void 0!==t.customNames&&(this.customOutletNames=t.customNames),void 0!==t.customLayout&&(this.customLayout=t.customLayout),t.scale&&(this.cardScale=t.scale),t.cols&&(this.tileCols=t.cols),this._colorSynced=!0,this.cacheColors());const e=this.serverOutletNames();Object.keys(e).length&&(this.outletNames=e)}if(t.has("tab")&&(null!==this.colorDraft&&(this.colorDraft=null),null!==this.alertsDraft&&(this.alertsDraft=null),null!==this.envSubView&&(this.envSubView=null),null!==this.planDraft&&(this.planDraft=null),null!==this.planEditStage&&(this.planEditStage=null),this.planShowAll&&(this.planShowAll=!1),this.planDelArm&&(this.planDelArm=!1),Object.keys(this.draft).length&&(this.draft={}),Object.keys(this.outletDraft).length&&(this.outletDraft={}),Object.keys(this.outletNameDraft).length&&(this.outletNameDraft={}),Object.keys(this.outletCfgDraft).length&&(this.outletCfgDraft={}),Object.keys(this.modePick).length&&(this.modePick={})),t.has("hass")&&this.recordHistory(),t.has("hass")&&Object.keys(this.modePick).length){let t=null;for(const[e,s]of Object.entries(this.modePick))this.get(e)?.state===s&&(t=t??{...this.modePick},delete t[e]);t&&(this.modePick=t)}}renderParam([t,e,s]){const i=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!i)return q;const o=i.attributes.unit_of_measurement||"",a=t.startsWith("soil_avg_")&&Bt(i),r=a?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,n=t.startsWith("soil_avg_")?t.slice(9):null,l=!!n&&this.soilProbeRows(n).length>1,d=l&&this.soilOpen===n;let c;const h=this.paramOpen===t;if(a)c=null;else{const e=parseFloat(i.state);if(Number.isFinite(e)){const s="targets"!==this.colorSource?this.outOfRange(Nt[t],e):null,i="alarms"!==this.colorSource||"leaf_vpd"===t?this.targetOutOfRange(t,e):null;c=this.colorForOor(s??i)}else c=null}const p=!a&&!l;let u=d||h?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",f="";a?(u=`background:${Et};box-shadow:inset 0 0 0 1px ${Tt}`,f=`color:${Tt}`):c&&"text"===c.mode?f=`color:${c.color}`:c&&"tile"===c.mode&&(u=`background:${Rt(c.color)};box-shadow:inset 0 0 0 1px ${c.color}`);const m=l||p;return V`
      <div class="tile ${m?"clickable":""} ${d||h?"active":""}"
        style=${u||q}
        role=${m?"button":q}
        @click=${l?()=>this.soilOpen=d?null:n:p?()=>this.toggleGraph(t):void 0}>
        <div class="tile-label">
          <span class="tl-name">${e}</span>
          <span class="tl-right">
            ${this.trendIcon(t)}
            ${l?V`<ha-icon class="tile-more"
                  icon=${d?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:p?V`<ha-icon class="tile-more"
                  icon=${h?"mdi:chevron-up":"mdi:chart-line"}></ha-icon>`:q}
          </span>
        </div>
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${f||q}>${r}${a?q:V`<span class="unit">${o}</span>`}</div>
        ${a?q:this.targetSubline(t,o)}
        ${a?q:this.renderBand(t,parseFloat(i.state))}
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),s=[];for(const i of Object.keys(this.hass?.states??{})){const o=bt(i).match(e);o&&s.push({slot:o[1],name:this.soilSensorName(i,t),e:this.hass.states[i]})}return s.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),s.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let s=this.hass?.states[t]?.attributes.friendly_name??"";const i=Ct(this.hass,this.config.panel);i&&s.startsWith(i)&&(s=s.slice(i.length).trim());const o="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return s=s.replace(new RegExp(`\\s*${o}\\s*$`,"i"),"").trim(),s||bt(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return q;const e=this.soilProbeRows(t);if(!e.length)return q;return V`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:e,e:s})=>{const i=Bt(s),o=s.attributes.unit_of_measurement||"",a=this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(o,"").trim():s.state,r="temperature"===t?"tempSoil":"moisture"===t?"humiSoil":"ECSoil",n=i?null:this.readingColor(r,s.state);return V`
            <div class="soil-pop-row ${i?"offline":""}">
              <span class="spn">${e}</span>
              <span class="spv" style=${n?`color:${n.color}`:q}>${i?V`Offline`:V`${a}<span class="unit">${o}</span>`}</span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}probeOffline(t){const e=this.get(`sensor.sf_${this.config.panel}_${t}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${t}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${t}_ec`);return Bt(e)}soilCellValue(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return s&&"unknown"!==s.state&&"unavailable"!==s.state?this.hass?.formatEntityState?this.hass.formatEntityState(s):`${s.state}${s.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const s=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[s])return this.soilSensorName(s,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const t=this.soilProbeSlots();if(t.length<2)return q;const e=this.soilAllOpen,s=this.accent(),i=t.filter(t=>this.probeOffline(t)).length,o=i?`background:${Et};box-shadow:inset 0 0 0 1px ${Tt}`:e?`box-shadow:inset 0 0 0 1px ${s}`:"",a=i?`${i} offline`:`${t.length} probes`;return V`
      <div class="tile clickable ${e?"active":""}" style=${o||q}
        role="button" aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${i?Tt:s}"></ha-icon>
        <div class="tile-val" style=${i?`color:${Tt}`:q}>${a}</div>
      </div>`}renderSoilAllTable(){const t=this.soilProbeSlots();return t.length<2||!this.soilAllOpen?q:V`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">Probe</span>
          <span class="sa-v">Temp</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${t.map(t=>V`
            <div class="soil-all-row ${this.probeOffline(t)?"offline":""}">
              <span class="sa-name">${this.probeNameForSlot(t)}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"temperature")||q}>${this.soilCellValue(t,"temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"moisture")||q}>${this.soilCellValue(t,"moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(t,"ec")||q}>${this.soilCellValue(t,"ec")}</span>
            </div>`)}
      </div>`}overviewDevices(){const t=[],e=(e,s)=>{for(const[i,o,a]of s){const s=this.eid(e,i);this.get(s)&&t.push({domain:e,suffix:i,id:s,label:o,icon:a})}};return e("light",Ut),e("fan",Vt),e("switch",Wt),this.hideLight2?t.filter(t=>"light_2"!==t.suffix):t}deviceStateText(t,e){if("unavailable"===e.state||"unknown"===e.state)return"Offline";if("light"===t.domain)return"on"!==e.state?"Off":`${Math.round((e.attributes.brightness??0)/255*100)}%`;if("fan"===t.domain){if("on"!==e.state)return"Off";const t=Math.round(e.attributes.percentage??0);return t?`${t}%`:"On"}if("on"!==e.state)return"Off";const s=this.config.panel;if("dehumidifier"===t.suffix){const t=this.get(`sensor.sf_${s}_dehumidifier_level`)?.state;return t&&"Off"!==t&&"unknown"!==t?t:"On"}if("heater"===t.suffix||"humidifier"===t.suffix){const e=this.get(`sensor.sf_${s}_${t.suffix}_level`)?.state;return e&&"0"!==e&&"unknown"!==e?`L${e}`:"On"}return"On"}deviceFault(t){const e=this.config.panel,s=t=>this.get(`sensor.sf_${e}_${t}`)?.state;return"humidifier"===t&&"Empty"===s("humidifier_tank")?"EMPTY":"dehumidifier"===t&&"Full"===s("dehumidifier_tank")?"FULL":"heater"===t&&"Alarm"===s("heater_status")?"Alarm":null}deviceMode(t){const e=this.config.panel,s="light"===t.domain?`select.sf_${e}_${t.suffix}_mode`:`select.sf_${e}_${t.suffix}_mode_set`;return this.get(s)?this.modeOf(s):""}deviceColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Environment"===t||"Temperature"===t||"Humidity"===t||"PPFD"===t?"auto":"manual")(t)){case"sched":return this.dcSched;case"auto":return this.dcAuto;default:return this.dcManual}}deviceTile(t){const e=this.get(t.id);if(!e)return q;const s="on"===e.state,i=`${t.domain}:${t.suffix}`,o=this.deviceOpen===i,a=this.accent(),r=this.deviceFault(t.suffix),n=!r&&s&&"off"!==this.deviceColorMode?this.deviceColorFor(this.deviceMode(t)):"",l=r?Tt:n||(s?a:"var(--secondary-text-color)");let d="";return r?d=`background:${Et};box-shadow:inset 0 0 0 1px ${Tt}`:n&&"tile"===this.deviceColorMode&&(d=`background:${Rt(n)};box-shadow:inset 0 0 0 1px ${n}`),o&&!r&&(d=`box-shadow:inset 0 0 0 1px ${a}`+(n&&"tile"===this.deviceColorMode?`;background:${Rt(n)}`:"")),V`
      <div class="tile tile-device clickable ${o?"active":""}"
        style=${d||q}
        role="button" aria-expanded=${o?"true":"false"}
        @click=${()=>this.toggleDevice(o?null:i)}>
        <div class="tile-label">${t.label}
          <ha-icon class="tile-more"
            icon=${o?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        ${this.tileSummary&&!r?this.deviceSummaryRow(t):q}
        <ha-icon icon=${t.icon} style="color:${s||r?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${r?`color:${Tt}`:s?`color:${l}`:""}>
          ${r??this.deviceStateText(t,e)}
        </div>
        ${this.lightDLI(t)}
        ${this.fanBadge(t)}
      </div>`}lightSchedule(t,e){const s=this.config.panel,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""};let o=i(`text.sf_${s}_${t}_schedule_start`),a=i(`text.sf_${s}_${t}_schedule_stop`);if("PPFD"===e){const e=i(`text.sf_${s}_${t}_ppfd_start`),r=i(`text.sf_${s}_${t}_ppfd_stop`);e&&r&&("00:00"!==e||"00:00"!==r)&&(o=e,a=r)}return[o,a]}lightDLI(t){if("light"!==t.domain)return q;const e=this.config.panel,s=t.suffix,i=this.modeOf(`select.sf_${e}_${s}_mode`);if("PPFD"!==i)return q;const o=Number(this.get(`number.sf_${e}_${s}_ppfd_target`)?.state);if(!Number.isFinite(o)||o<=0)return q;const[a,r]=this.lightSchedule(s,i),n=/^(\d{1,2}):(\d{2})/.exec(a),l=/^(\d{1,2}):(\d{2})/.exec(r);if(!n||!l)return q;const d=(60*+l[1]+ +l[2]-(60*+n[1]+ +n[2])+1440)%1440/60;if(d<=0)return q;const c=o*d*.0036;return V`<div class="tile-dli">
      <div>${Math.round(o)} µmol</div>
      <div class="tile-dli-v">DLI ${c.toFixed(1)}</div>
    </div>`}fanBadge(t){if("fan"!==t.suffix)return q;const e=this.config.panel,s=t.suffix,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o=[],a=i(`number.sf_${e}_${s}_oscillation`)||i(`sensor.sf_${e}_${s}_oscillation`);a&&"0"!==a&&o.push(`Osc ${a}`);if("on"===(i(`switch.sf_${e}_${s}_natural_wind`)||i(`binary_sensor.sf_${e}_${s}_natural_wind`))&&o.push("Nat Wind"),"Manual"!==this.modeOf(`select.sf_${e}_${s}_mode_set`)){const t=i(`number.sf_${e}_${s}_standby_speed`);t&&o.push("Stby "+("0"===t?"Off":t+"%"))}return o.length?V`<div class="tile-dli">${o.map(t=>V`<div>${t}</div>`)}</div>`:q}deviceSummaryRow(t){const e=this.deviceSummaryLines(t);return e.length?V`<div class="tile-summary">
          ${e.map(t=>V`<span>${t}</span>`)}
        </div>`:q}fmtClock(t){if(!this.hour12)return t;const e=/^(\d{1,2}):(\d{2})/.exec(t||"");if(!e)return t;let s=+e[1];const i=s>=12?"pm":"am";return s=s%12||12,`${s}:${e[2]}${i}`}shortDur(t){const e=/^(\d+):(\d{2})(?::(\d{2}))?$/.exec((t||"").trim());if(!e)return t||"";const s=+e[1],i=+e[2],o=+(e[3]??0);return s?i?`${s}h${i}m`:`${s}h`:i?o?`${i}m${o}s`:`${i}m`:`${o}s`}deviceSummaryLines(t){const e=this.config.panel,s=t.suffix,i=t=>{const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""},o={"Prioritize temperature":"Pri Temp","Prioritize humidity":"Pri Humid","Temperature only":"Temp","Humidity only":"Humid","Temperature & humidity":"Temp/Humid"},a=[];if("light"===t.domain){const t=this.modeOf(`select.sf_${e}_${s}_mode`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];a.push(t);const[i,o]=this.lightSchedule(s,t);if(i&&o&&("00:00"!==i||"00:00"!==o)){a.push(`${this.fmtClock(i)}–${this.fmtClock(o)}`);const t=this.hrsText(i,o);t&&a.push(`LD - ${t}`)}return a}if("blower"===s||"fan"===s){const t=this.modeOf(`select.sf_${e}_${s}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;const r=t=>"blower"===s?`${t}%`:`L${t}`,n=i("blower"===s?`number.sf_${e}_blower_running_speed`:`number.sf_${e}_fan_schedule_gear`),l=i(`number.sf_${e}_${s}_standby_speed`),d="0"===n?"Auto":n?r(n):"",c=l&&"0"!==l?r(l):"Off",h="blower"===s&&d?`${d} · Stby ${c}`:"";if("Environment"===t){const t=this.modeOf(`select.sf_${e}_${s}_run_mode`);a.push(t?`Enviro · ${o[t]??t}`:"Enviro"),h&&a.push(h)}else if("Time Slot"===t){a.push("Time Slot");const t=i(`text.sf_${e}_${s}_schedule_start`),o=i(`text.sf_${e}_${s}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`),h&&a.push(h)}else if("Cycle"===t){a.push("Cycle");const t=i(`text.sf_${e}_${s}_cycle_run`),o=i(`text.sf_${e}_${s}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`),h&&a.push(h)}return a}if("heater"===s||"humidifier"===s||"dehumidifier"===s){const t=this.modeOf(`select.sf_${e}_${s}_mode_set`)||"";if(!t||"unavailable"===t||"unknown"===t)return[];if("Manual"===t)return a.push("Manual"),a;if("Time Slot"===t){a.push("Time Slot");const t=i(`text.sf_${e}_${s}_schedule_start`),o=i(`text.sf_${e}_${s}_schedule_stop`);t&&o&&a.push(`${this.fmtClock(t)}–${this.fmtClock(o)}`)}else if("Cycle"===t){a.push("Cycle");const t=i(`text.sf_${e}_${s}_cycle_run`),o=i(`text.sf_${e}_${s}_cycle_off`);t&&o&&a.push(`${this.shortDur(t)} on · ${this.shortDur(o)} off`)}else{const o="Temperature"===t?"Temp":"Humidity"===t?"Humid":t;let r="";if("humidifier"===s){const t=i(`select.sf_${e}_humidifier_gear`);r=t?"Automatic"===t?"Auto":`L${t}`:""}else if("heater"===s){const t=i(`select.sf_${e}_heater_gear`);r=t?"Automatic"===t?"Auto":`L${t}`:""}else r=i(`select.sf_${e}_dehumidifier_gear`)||i(`select.sf_${e}_dehumidifier_level_set`)||"";a.push(r?`${o} · ${r}`:o)}return a}return[]}relatedControls(t,e){const s=this.config.panel,i=new RegExp(`^(number|select|switch|text)\\.sf_${s}_${t}(_|$)`),o=`switch.sf_${s}_${t}`,a=`number.sf_${s}_${t}_speed`,r=Ct(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(t=>i.test(t)&&t!==o&&!("fan"===e&&t===a)).sort().map(t=>{let e=this.hass?.states[t]?.attributes.friendly_name??"";return r&&e.startsWith(r)&&(e=e.slice(r.length).trim()),this.ctlRow(e||t,t)})}renderDevicePop(){const t=this.deviceOpen;if(!t)return q;const e=this.overviewDevices().find(e=>`${e.domain}:${e.suffix}`===t);if(!e)return q;const s=this.get(e.id);if(!s)return q;const i="light"===e.domain?this.renderLightBody(e,s):"fan"===e.suffix?this.renderFanBody(e,s):"blower"===e.suffix?this.renderBlowerBody(e,s):"heater"===e.suffix?this.renderHeaterBody(e,s):"dehumidifier"===e.suffix?this.renderDehumidifierBody(e,s):"humidifier"===e.suffix?this.renderHumidifierBody(e,s):this.renderGenericBody(e,s);return V`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${e.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${i}
      </div>`}devOn(t,e){const s=`power:${t}`;return s in this.draft?"on"===this.draft[s]:e}powerRow(t,e,s,i){const o=`power:${t}`,a=this.devOn(t,i),r=this.accent();return V`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${a?"on":""}"
          style=${a?`background:${r}`:""}
          @click=${()=>this.stage(o,a?"off":"on")}
          aria-label="Toggle ${s}"></button>
      </div>`}deviceBar(t,e,s){const i=Object.keys(this.draft).length>0;return jt(this.accent(),i,()=>this.deviceApply(t,e,s),()=>this.discardEdits())}deviceApply(t,e,s){this.commitBundle(t,e);const i=`bri:${s.id}`,o=`pct:${s.id}`,a=`power:${s.id}`;i in this.draft&&this.hass?.callService("light","turn_on",{entity_id:s.id,brightness_pct:Number(this.draft[i])}),o in this.draft&&this.hass?.callService("fan","set_percentage",{entity_id:s.id,percentage:Number(this.draft[o])});for(const t of Object.keys(this.draft)){if(t.includes(":")||t in e)continue;const s=this.draft[t];switch(t.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:t,value:Number(s)});break;case"select":this.hass?.callService("select","select_option",{entity_id:t,option:s});break;case"text":this.hass?.callService("text","set_value",{entity_id:t,value:s});break;case"switch":this.hass?.callService("switch","on"===s?"turn_on":"turn_off",{entity_id:t})}}if(a in this.draft){const t="on"===this.draft[a],e="light"===s.domain&&i in this.draft||"fan"===s.domain&&o in this.draft;if(!t||!e){const e="fan"===s.domain?"fan":"light"===s.domain?"light":"switch";this.hass?.callService(e,t?"turn_on":"turn_off",{entity_id:s.id})}}this.draft={}}renderGenericBody(t,e){const s="on"===e.state,i="fan"===t.domain?"fan":"switch",o=Math.round(e.attributes.percentage??0),a="fan"===t.domain?this.speedRow(t,s?o:0,0,10):q;return V`${this.powerRow(t.id,i,t.label,s)}${a}${this.relatedControls(t.suffix,t.domain)}${this.deviceBar(`text.sf_${this.config.panel}_${t.suffix}_apply`,{},t)}`}speedRow(t,e,s=0,i=0){const o=`pct:${t.id}`,a=o in this.draft?Number(this.draft[o]):e,r=i>0?Array.from({length:i},(t,e)=>{const s=e+1;return{value:Math.round(s/i*100),label:String(s),sel:Math.round(a/100*i)===s}}):(()=>{const t=[];s<=0&&t.push({value:0,label:"Off",sel:0===a});for(let e=Math.max(s,1);e<=100;e+=1)t.push({value:e,label:e+"%",sel:e===a});return t})();return V`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">Speed</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(o,t.target.value)}>
            ${r.map(t=>V`<option value=${t.value}
              ?selected=${t.sel}>${t.label}</option>`)}
          </select>
        </span>
      </div>`}brightnessRow(t,e){const s=`bri:${t.id}`,i=s in this.draft?Number(this.draft[s]):e,o=[];for(let t=11;t<=100;t+=1)o.push(t);return V`
      <div class="dev-row ${s in this.draft?"staged":""}">
        <span class="dev-lbl">Brightness</span>
        <span class="ctl-input">
          <select @change=${t=>this.stage(s,t.target.value)}>
            ${o.map(t=>V`<option value=${t} ?selected=${t===i}>${t+"%"}</option>`)}
          </select>
        </span>
      </div>`}renderHeaterBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_heater_mode_set`,a=this.get(o),r=this.modeOf(o),n=`number.sf_${s}_heater_level`,l=`text.sf_${s}_heater_apply`,d=this.numOpts(1,10,1,t=>`L${t}`),c=[];if(a&&c.push(this.liveModeRow("Mode",o)),c.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===r)c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,{[o]:"mode"},t));else if("Time Slot"===r){const e=`text.sf_${s}_heater_schedule_start`,i=`text.sf_${s}_heater_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[n]:"gear"};c.push(this.stagedPeriodRow(e,i,"Schedule")),c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,a,t))}else if("Cycle"===r){const e=`text.sf_${s}_heater_cycle_start`,i=`text.sf_${s}_heater_cycle_run`,a=`text.sf_${s}_heater_cycle_off`,r=`number.sf_${s}_heater_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[r]:"cycle_times",[n]:"gear"};c.push(this.stagedRow("Start Time",e,"time")),c.push(this.stagedRow("Run Time",i,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",r)),c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,h,t))}else if("Temperature"===r){const e=`select.sf_${s}_heater_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[n]:"gear"};c.push(i?this.stagedRow("Gear",e):this.optSelectRow("Gear",n,d)),c.push(this.infoRow("Automatic follows the day/night temperature targets; 1–10 sets a fixed level","")),c.push(this.deviceBar(l,a,t))}return c}renderDehumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_dehumidifier_mode_set`,a=this.get(o),r=this.modeOf(o),n=`select.sf_${s}_dehumidifier_level`,l=`text.sf_${s}_dehumidifier_apply`,d=[];if(a&&d.push(this.liveModeRow("Mode",o)),d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===r)d.push(this.ctlRow("Wind Speed",n)),d.push(this.deviceBar(l,{[o]:"mode"},t));else if("Time Slot"===r){const e=`text.sf_${s}_dehumidifier_schedule_start`,i=`text.sf_${s}_dehumidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[n]:"wind"};d.push(this.stagedPeriodRow(e,i,"Schedule")),d.push(this.stagedRow("Wind Speed",n)),d.push(this.deviceBar(l,a,t))}else if("Cycle"===r){const e=`text.sf_${s}_dehumidifier_cycle_start`,i=`text.sf_${s}_dehumidifier_cycle_run`,a=`text.sf_${s}_dehumidifier_cycle_off`,r=`number.sf_${s}_dehumidifier_cycle_times`,c={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[r]:"cycle_times",[n]:"wind"};d.push(this.stagedRow("Start Time",e,"time")),d.push(this.stagedRow("Run Time",i,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",r)),d.push(this.stagedRow("Wind Speed",n)),d.push(this.deviceBar(l,c,t))}else if("Humidity"===r){const e=`select.sf_${s}_dehumidifier_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[n]:"wind"};d.push(this.stagedRow("Wind Speed",i?e:n)),d.push(this.infoRow("Runs on the tent's day/night humidity targets, at Low or High power","")),d.push(this.deviceBar(l,a,t))}return d}renderHumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_humidifier_mode_set`,a=this.get(o),r=this.modeOf(o),n=`number.sf_${s}_humidifier_level`,l=`text.sf_${s}_humidifier_apply`,d=this.numOpts(1,4,1,t=>`L${t}`),c=[];if(a&&c.push(this.liveModeRow("Mode",o)),c.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===r)c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,{[o]:"mode"},t));else if("Time Slot"===r){const e=`text.sf_${s}_humidifier_schedule_start`,i=`text.sf_${s}_humidifier_schedule_stop`,a={[o]:"mode",[e]:"schedule_start",[i]:"schedule_end",[n]:"gear"};c.push(this.stagedPeriodRow(e,i,"Schedule")),c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,a,t))}else if("Cycle"===r){const e=`text.sf_${s}_humidifier_cycle_start`,i=`text.sf_${s}_humidifier_cycle_run`,a=`text.sf_${s}_humidifier_cycle_off`,r=`number.sf_${s}_humidifier_cycle_times`,h={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[r]:"cycle_times",[n]:"gear"};c.push(this.stagedRow("Start Time",e,"time")),c.push(this.stagedRow("Run Time",i,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",r)),c.push(this.optSelectRow("Gear",n,d)),c.push(this.deviceBar(l,h,t))}else if("Humidity"===r){const e=`select.sf_${s}_humidifier_gear`,i=!!this.get(e),a=i?{[o]:"mode",[e]:"auto_gear"}:{[o]:"mode",[n]:"gear"};c.push(i?this.stagedRow("Gear",e):this.optSelectRow("Gear",n,d)),c.push(this.infoRow("Automatic follows the day/night humidity targets; 1–4 sets a fixed level","")),c.push(this.deviceBar(l,a,t))}return c}textState(t){const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}durMinutes(t,e){const s=t=>{const e=/^(\d{1,2}):(\d{2})/.exec(t);return e?60*Number(e[1])+Number(e[2]):null},i=s(this.textState(t)),o=s(this.textState(e));if(null==i||null==o)return null;let a=(o-i+1440)%1440;return 0===a&&(a=1440),a}durationText(t,e){const s=this.durMinutes(t,e);return null==s?null:`${Math.floor(s/60)}h ${String(s%60).padStart(2,"0")}min`}infoRow(t,e){return V`<div class="dev-row">
      <span class="dev-lbl">${t}</span><span class="dev-spacer"></span>
      <span class="dev-val">${e}</span>
    </div>`}ctlRow(t,e){if(!this.get(e))return q;const s="switch"===e.split(".")[0]?this.stagedSwitch(e):this.stagedInput(e);return V`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${s}</div>
    </div>`}renderLightBody(t,e){const s=this.config.panel,i=t.suffix,o="on"===e.state,a=`select.sf_${s}_${i}_mode`,r=this.get(a),n=this.modeOf(a),l=this.get(`sensor.sf_${s}_${i}_brightness`),d=this.get(`sensor.sf_${s}_ppfd`),c=l&&Number.isFinite(Number(l.state))?`${Math.round(Number(l.state))}%`:"—",h=d&&Number.isFinite(Number(d.state))?`${Math.round(Number(d.state))} µmol`:"—",p=`text.sf_${s}_${i}_apply`,u=`number.sf_${s}_${i}_go_dark`,f=`number.sf_${s}_${i}_turn_off`,m=[];if(r&&m.push(this.liveModeRow("Mode",a)),m.push(this.powerRow(t.id,"light",t.label,o)),"Manual"===n){const s=Math.round((e.attributes.brightness??0)/255*100),i={[a]:"mode",[u]:"dim_threshold",[f]:"off_threshold"};m.push(this.brightnessRow(t,o?s:0)),m.push(this.infoRow("Current PPFD",h)),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",f,this.tempThresholdOpts())),m.push(this.deviceBar(p,i,t))}else if("Time Slot"===n){const e=`text.sf_${s}_${i}_schedule_start`,o=`text.sf_${s}_${i}_schedule_stop`,r=`number.sf_${s}_${i}_schedule_brightness`,n=`number.sf_${s}_${i}_fade`,l={[a]:"mode",[e]:"schedule_start",[o]:"schedule_end",[r]:"schedule_brightness",[n]:"fade_minutes",[u]:"dim_threshold",[f]:"off_threshold"};m.push(this.infoRow("Current",`${c} · ${h}`));const d=this.durationText(e,o);d&&m.push(this.infoRow("Light duration",d)),m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(this.optSelectRow("Target Brightness",r,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",n,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",f,this.tempThresholdOpts())),m.push(this.deviceBar(p,l,t))}else if("PPFD"===n){const e=`text.sf_${s}_${i}_ppfd_start`,o=`text.sf_${s}_${i}_ppfd_stop`,r=`number.sf_${s}_${i}_ppfd_target`,n=`number.sf_${s}_${i}_ppfd_fade`,l=`number.sf_${s}_${i}_ppfd_min`,d=`number.sf_${s}_${i}_ppfd_max`,g={[a]:"mode",[e]:"ppfd_start",[o]:"ppfd_end",[r]:"ppfd_target",[n]:"ppfd_fade_minutes",[l]:"ppfd_min",[d]:"ppfd_max",[u]:"dim_threshold",[f]:"off_threshold"};m.push(this.infoRow("Current",`${c} · ${h}`));const v=this.durationText(e,o),b=this.durMinutes(e,o),_=Number(this.get(r)?.state);if(v&&null!=b&&Number.isFinite(_)){const t=_*b*60/1e6;m.push(this.infoRow("DLI · duration",`${t.toFixed(2)} mol/m²/day · ${v}`))}else v&&m.push(this.infoRow("Light duration",v));m.push(this.stagedPeriodRow(e,o,"Lighting period")),m.push(V`<div class="dev-row ${r in this.draft?"staged":""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(r,this.numOpts(20,2e3,10,t=>`${t} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",l,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Dimming Range Max",d,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",n,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",f,this.tempThresholdOpts())),m.push(this.deviceBar(p,g,t))}return m}renderFanBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_fan_mode_set`,a=this.get(o),r=this.modeOf(o),n=`number.sf_${s}_fan_oscillation`,l=`number.sf_${s}_fan_schedule_gear`,d=`number.sf_${s}_fan_standby_speed`,c=`switch.sf_${s}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",l,this.numOpts(1,10,1,t=>`L${t}`)),p=Math.max(1,Math.round(Number(this.draftVal(l))||1)),u="0"===String(this.draftVal(l)),f=()=>this.optSelectRow("Standby Speed",d,this.offOpts(1,u?10:p-1)),m=()=>this.optSelectRow("Oscillation",n,this.offOpts(1,10)),g=`text.sf_${s}_fan_apply`,v=[];if(a&&v.push(this.liveModeRow("Mode",o)),v.push(this.powerRow(t.id,"fan",t.label,i)),"Manual"===r){const s=Math.round(e.attributes.percentage??0);v.push(this.speedRow(t,i?s:0,0,10)),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(g,{[o]:"mode"},t))}else if("Time Slot"===r){const e={[o]:"mode",[`text.sf_${s}_fan_schedule_start`]:"schedule_start",[`text.sf_${s}_fan_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${s}_fan_schedule_start`,`text.sf_${s}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(f()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(g,e,t))}else if("Cycle"===r){const e=`text.sf_${s}_fan_cycle_start`,i=`text.sf_${s}_fan_cycle_run`,a=`text.sf_${s}_fan_cycle_off`,r=`number.sf_${s}_fan_cycle_times`,n={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[r]:"cycle_times",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Start Time",e,"time")),v.push(this.stagedRow("Run Duration",i,"duration")),v.push(this.stagedRow("Off Duration",a,"duration")),v.push(this.stagedRangeRow("Execution Times",r)),v.push(h()),v.push(f()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(g,n,t))}else if("Environment"===r){const e=`select.sf_${s}_fan_run_mode`,i={[o]:"mode",[e]:"env_submode",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Run Mode",e)),v.push(this.optSelectRow("Gear",l,this.autoOpts(1,10,1,t=>`L${t}`))),v.push(f()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(g,i,t))}return v}renderBlowerBody(t,e){const s=this.config.panel,i="on"===e.state,o=`select.sf_${s}_blower_mode_set`,a=this.get(o),r=this.modeOf(o),n=`number.sf_${s}_blower_running_speed`,l=`number.sf_${s}_blower_standby_speed`,d=`switch.sf_${s}_blower_close_co2`,c=`text.sf_${s}_blower_apply`,h=()=>this.optSelectRow("Running Speed",n,this.numOpts(25,100,1,t=>`${t}%`)),p="0"===String(this.draftVal(n)),u=Math.max(25,Math.round(Number(this.draftVal(n))||25)),f=()=>this.optSelectRow("Standby Speed",l,this.offOpts(25,p?100:u-1)),m=[];if(a&&m.push(this.liveModeRow("Mode",o)),m.push(this.powerRow(t.id,"fan",t.label,i)),"Manual"===r){const s=Math.round(e.attributes.percentage??0);m.push(this.speedRow(t,i?s:0,25)),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,{[o]:"mode"},t))}else if("Time Slot"===r){const e={[o]:"mode",[`text.sf_${s}_blower_schedule_start`]:"schedule_start",[`text.sf_${s}_blower_schedule_stop`]:"schedule_end",[n]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedPeriodRow(`text.sf_${s}_blower_schedule_start`,`text.sf_${s}_blower_schedule_stop`,"Schedule")),m.push(h()),m.push(f()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,e,t))}else if("Cycle"===r){const e=`text.sf_${s}_blower_cycle_start`,i=`text.sf_${s}_blower_cycle_run`,a=`text.sf_${s}_blower_cycle_off`,r=`number.sf_${s}_blower_cycle_times`,p={[o]:"mode",[e]:"cycle_start",[i]:"cycle_run",[a]:"cycle_off",[r]:"cycle_times",[n]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Start Time",e,"time")),m.push(this.stagedRow("Run Duration",i,"duration")),m.push(this.stagedRow("Off Duration",a,"duration")),m.push(this.stagedRangeRow("Execution Times",r)),m.push(h()),m.push(f()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,p,t))}else if("Environment"===r){const e=`select.sf_${s}_blower_run_mode`,i={[o]:"mode",[e]:"env_submode",[n]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Run Mode",e)),m.push(this.optSelectRow("Running Speed",n,this.autoOpts(25,100,1,t=>`${t}%`))),m.push(f()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,i,t))}return m}cycleIsDay(){const t=this.config.panel,e=this.get(`binary_sensor.sf_${t}_daytime_schedule`);if(e&&("on"===e.state||"off"===e.state))return"on"===e.state;const s=Ht(this.get(`text.sf_${t}_env_day_start`)?.state),i=Ht(this.get(`text.sf_${t}_env_day_end`)?.state);if(null==s||null==i)return null;const o=new Date,a=60*o.getHours()+o.getMinutes();return s<=i?a>=s&&a<i:a>=s||a<i}lightLeak(){if(!1!==this.cycleIsDay())return{on:!1,text:""};const t=this.config.panel,e=this.get(`sensor.sf_${t}_ppfd`);if(e){const t=Number(e.state);return Number.isFinite(t)&&t>1?{on:!0,text:`Light detected · ${Math.round(t)} µmol`}:{on:!1,text:""}}const s=this.get(`binary_sensor.sf_${t}_daytime_light_sensor`);return s&&"on"===s.state?{on:!0,text:"Light detected"}:{on:!1,text:""}}renderParamsHead(){const t=this.cycleIsDay(),e=this.lightLeak(),s=null===t?q:V`<span class="cycle-badge"
          style="color:${t?"#e0a83a":"#8f9bd4"};background:${t?"rgba(224,168,58,0.14)":"rgba(143,155,212,0.16)"}">
          <ha-icon icon=${t?"mdi:white-balance-sunny":"mdi:weather-night"}></ha-icon>${t?"Day Cycle":"Night Cycle"}</span>`;return V`
      <div class="params-head">
        <span class="ph-label">Parameters</span>
        <span class="ph-mid">${e.on?V`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${e.text}</span>`:q}</span>
        ${s}
      </div>`}renderOverview(){const t=Mt.map(t=>this.renderParam(t)).filter(t=>t!==q),e=this.soilStatsTile(),s=this.overviewDevices();return V`
      ${t.length||e!==q?V`${this.renderParamsHead()}
            <div class="grid">${t}${e}</div>
            ${this.renderParamGraph()}
            ${this.renderSoilPop()}
            ${this.renderSoilAllTable()}`:q}
      ${s.length?V`<div class="section-label">Devices</div>
            <div class="grid">${s.map(t=>this.deviceTile(t))}</div>
            ${this.renderDevicePop()}`:q}`}draftVal(t){if(t in this.draft)return this.draft[t];const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}stage(t,e){this.draft={...this.draft,[t]:e}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(t){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=t}modeOf(t,e="Manual"){return this.modePick[t]??this.get(t)?.state??e}stagedInput(t,e){const s=this.get(t);if(!s)return q;const i=t.split(".")[0],o=this.draftVal(t);if(!e&&"number"===i){const e=s.attributes.min??0,i=s.attributes.max??100,a=s.attributes.step??1,r=s.attributes.unit_of_measurement??"";return V`<span class="num-box">
        <input type="number" min=${e} max=${i} step=${a} .value=${o}
          @input=${e=>this.stage(t,e.target.value)} />
        <span class="unit">${r}</span></span>`}if(!e&&"select"===i){const e=s.attributes.options??[];return V`<select @change=${e=>this.stage(t,e.target.value)}>
        ${e.map(t=>V`<option value=${t} .selected=${t===o}>${t}</option>`)}
      </select>`}if("duration"===e)return this.durationInput(t);const a="time"===e||/^\d{1,2}:\d{2}/.test(o);return V`<input type=${a?"time":"text"} .value=${o}
      @change=${e=>this.stage(t,e.target.value)} />`}durationInput(t){const e=(this.draftVal(t)||"").trim(),s=/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(e),i=s?+s[1]:0,o=s?+s[2]:0,a=s?+(s[3]??0):0,r=t=>String(t).padStart(2,"0"),n=(e,s,i)=>this.stage(t,`${r(Math.max(0,Math.min(99,e)))}:${r(Math.max(0,Math.min(59,s)))}:${r(Math.max(0,Math.min(59,i)))}`),l=(t,e,s,i)=>V`
      <span class="dur-box">
        <input type="number" min="0" max=${e} step="1" .value=${String(t)}
          @input=${t=>i(Math.floor(Number(t.target.value)||0))} />
        <span class="dur-unit">${s}</span>
      </span>`;return V`<span class="dur-input">
      ${l(i,99,"h",t=>n(t,o,a))}
      ${l(o,59,"min",t=>n(i,t,a))}
      ${l(a,59,"s",t=>n(i,o,t))}
    </span>`}numOpts(t,e,s=1,i=String){const o=[],a=(String(s).split(".")[1]||"").length,r=s>0?Math.round((e-t)/s):0;for(let e=0;e<=r;e++){const r=Number((t+e*s).toFixed(a));o.push({label:i(r),value:String(r)})}return o}offOpts(t,e,s=1,i){return[{label:"Off",value:"0"},...this.numOpts(t,e,s,i)]}autoOpts(t,e,s=1,i){return[{label:"Automatic",value:"0"},...this.numOpts(t,e,s,i)]}optSelect(t,e,s=!1){if(!this.get(t))return q;const i=this.draftVal(t),o=e.find(t=>Number(t.value)===Number(i))?.value??e.find(t=>t.value===i)?.value??i;return V`<select @change=${e=>{const i=e.target.value;s?this.hass?.callService("number","set_value",{entity_id:t,value:Number(i)}):this.stage(t,i)}}>
      ${e.map(t=>V`
        <option value=${t.value} .selected=${String(t.value)===String(o)}>${t.label}</option>`)}
    </select>`}optSelectRow(t,e,s,i=!1){if(!this.get(e))return q;const o=!i&&e in this.draft?"dev-row staged":"dev-row";return V`<div class=${o}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.optSelect(e,s,i)}</div>
    </div>`}stagedRow(t,e,s){if(!this.get(e))return q;const i=e in this.draft?"dev-row staged":"dev-row";return V`<div class=${i}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.stagedInput(e,s)}</div>
    </div>`}stagedRangeRow(t,e,s){const i=this.get(e);if(!i)return q;const o=Math.round(Number(i.attributes.min??1)),a=Math.round(Number(i.attributes.max??100)),r=Math.max(1,Math.round(Number(i.attributes.step??1)));return this.optSelectRow(t,e,this.numOpts(o,a,r,s))}stagedPeriodRow(t,e,s){const i=this.get(t),o=this.get(e);if(!i&&!o)return q;const a=t in this.draft||e in this.draft;return V`<div class="dev-row period-row ${a?"staged":""}">
      <span class="dev-lbl">${s}</span>
      <div class="period-times">
        ${i?this.stagedInput(t,"time"):q}
        <span class="dash">–</span>
        ${o?this.stagedInput(e,"time"):q}
      </div>
    </div>`}liveModeRow(t,e){const s=this.get(e);if(!s)return q;const i=s.attributes.options??[],o=this.modeOf(e,s.state);return V`<div class="dev-row ${e in this.draft?"staged":""}">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">
        <select @change=${t=>{const s=t.target.value;this.modePick={...this.modePick,[e]:s},this.draft={[e]:s}}}>
          ${i.map(t=>V`
            <option value=${t} .selected=${t===o}>${t}</option>`)}
        </select>
      </div>
    </div>`}commitBundle(t,e){const s={};for(const[t,i]of Object.entries(e))if(t in this.draft){const e=this.draft[t];s[i]="number"===t.split(".")[0]?Number(e):e}if(!Object.keys(s).length)return;const i=t.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),o=i?"light_1"===i[1]?"light":"light_2"===i[1]?"light2":i[1]:null;o&&!this.get(t)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(e)[0],module:o,settings:s}):this.hass?.callService("text","set_value",{entity_id:t,value:JSON.stringify(s)});const a={...this.draft};for(const t of Object.keys(e))delete a[t];this.draft=a}stagedSwitch(t){const e="on"===this.draftVal(t);return V`<button class="toggle ${e?"on":""}"
      style=${e?`background:${this.accent()}`:""}
      @click=${()=>this.stage(t,e?"off":"on")} aria-label="Toggle"></button>`}stagedCtl(t,e,s){const i=this.get(t);if(!i)return q;const o=e??i.attributes.friendly_name??t.split(".")[1],a="switch"===t.split(".")[0]?this.stagedSwitch(t):this.stagedInput(t,s),r=t in this.draft;return V`
      <div class="ctl ${r?"staged":""}">
        <div class="ctl-label">${o}</div>
        <div class="ctl-input">${a}</div>
      </div>`}applyStaged(t){for(const e of t){if(!(e in this.draft))continue;const t=this.draft[e];switch(e.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:e,value:Number(t)});break;case"text":this.hass?.callService("text","set_value",{entity_id:e,value:t});break;case"select":this.hass?.callService("select","select_option",{entity_id:e,option:t});break;case"switch":this.hass?.callService("switch","on"===t?"turn_on":"turn_off",{entity_id:e})}}const e={...this.draft};for(const s of t)delete e[s];this.draft=e}discardStaged(t){const e={...this.draft};let s=!1;for(const i of t)i in e&&(delete e[i],s=!0);s&&(this.draft=e)}applyBar(t,e={}){const s=!!e.extraDirty||t.some(t=>t in this.draft);return jt(this.accent(),s,()=>{this.applyStaged(t),e.onApply?.()},()=>{this.discardStaged(t),e.onDiscard?.()},"apply-bar")}envIds(){const t=this.config.panel,e=[];for(const s of[`text.sf_${t}_env_day_start`,`text.sf_${t}_env_day_end`])this.get(s)&&e.push(s);for(const[,s,i,o]of Gt)for(const a of[i,s,o]){const s=`number.sf_${t}_${a}`;this.get(s)&&e.push(s)}for(const s of["leaf_vpd_min","leaf_vpd_max"]){const i=`number.sf_${t}_${s}`;this.get(i)&&e.push(i)}return e}caliIds(){const t=this.config.panel,e=[];for(const s of["cal_air_temp","cal_air_humidity","cal_ppfd","cal_co2"]){const i=`number.sf_${t}_${s}`;this.get(i)&&e.push(i)}for(const s of this.caliSoilSlots()){for(const i of["cal_temp","cal_moisture","cal_ec"]){const o=`number.sf_${t}_${s}_${i}`;this.get(o)&&e.push(o)}const i=`select.sf_${t}_${s}_substrate`;this.get(i)&&e.push(i)}for(const s of[`number.sf_${t}_leaf_offset`,`number.sf_${t}_leaf_offset_night`])this.get(s)&&e.push(s);return e}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.panel??"",e=this.config.outlets??[];if(!this.hass)return e;const s=[];t&&this.get(`switch.sf_${t}_outlet_1`)&&s.push(t);const i=new Set(Dt(this.hass,t));for(const o of e)o!==t&&i.has(o)&&s.push(o);return s}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}rangeSelect(t){const e=this.get(t);if(!e)return q;const s=Number(e.attributes.min??0),i=Number(e.attributes.max??100),o=Number(e.attributes.step??1)||1,a=e.attributes.unit_of_measurement??"";return this.optSelect(t,this.numOpts(s,i,o,t=>`${t}${a}`),!1)}envControl(t,e){return this.get(t)?V`
      <div class="ctl">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">${this.rangeSelect(t)}</div>
      </div>`:q}planEntity(){return this.get(`sensor.sf_${this.config.panel}_plan`)}hasPlan(){return!!this.planEntity()}planInfo(){const t=this.planEntity(),e=t?.attributes??{};return{active:!!e.active,stages:Array.isArray(e.stages)?e.stages:[],progress:e.progress&&"object"==typeof e.progress?e.progress:{}}}renderEnv(){if(!this.hasEnv())return V`<div class="cali-empty">No environment targets reported for this device yet.</div>`;if(!this.hasPlan())return this.renderEnvBody(!0);const t=this.planInfo(),e=this.envSubView??(t.active?"plan":"env"),s=this.accent(),i=(t,i)=>V`
      <button class="env-seg ${e===t?"active":""}"
        style=${e===t?`color:${s};border-color:${s}`:""}
        @click=${()=>this.envSubView=t}>${i}</button>`;return V`
      <div class="env-seg-row">
        ${i("env","Environment")}
        ${i("plan","Planting Plan")}
      </div>
      ${"plan"===e?this.renderPlan(t):this.renderEnvBody(!1)}`}renderEnvBody(t){const e=this.config.panel,s=`text.sf_${e}_env_day_start`,i=`text.sf_${e}_env_day_end`,o=this.get(s)||this.get(i);return V`
      ${t?V`<div class="section-label">Environment</div>`:q}
      ${o?V`<div class="env-cycle">
            ${this.stagedCtl(s,"Day Cycle Start","time")}
            ${this.stagedCtl(i,"Day Cycle Stop","time")}
          </div>`:q}
      ${Gt.map(([t,s,i,o,a])=>this.get(`number.sf_${e}_${s}`)?V`
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
          </div>`:q)}
      ${this.renderLeafVpdTargets()}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`}renderPlan(t){if(null!=this.planEditStage&&this.planDraft)return this.renderStageEditor(this.planEditStage);const e=this.accent(),s=`switch.sf_${this.config.panel}_plan_enabled`,i=!!this.get(s),o=t.stages,a=t.progress||{},r=t=>{const e=Math.max(0,o.findIndex(e=>e.stageId===t)),s=this.planShowAll?o.map((t,e)=>e):[e];return V`
        <div class="section-label">Stages</div>
        ${s.map(e=>this.renderPlanStage(o[e],t,e))}
        ${o.length>1?V`<button class="plan-editbtn" style="margin:2px 0 6px"
          @click=${()=>{this.planShowAll=!this.planShowAll}}>
          ${this.planShowAll?"Show less":`Show all ${o.length} stages`}</button>`:q}
        <button class="plan-btn" @click=${()=>this.addPlanStage()}>+ Add stage</button>`},n=(t,i)=>V`
      <button class="plan-btn ${i?"stop":"start"}"
        style=${i?"":`background:${e};border-color:${e};color:#0c1f06`}
        @click=${()=>{this.envSubView="plan",this.hass?.callService("switch",i?"turn_off":"turn_on",{entity_id:s})}}>
        ${t}</button>`;if(!t.active)return o.length?V`
        <div class="plan-banner">
          <ha-icon icon="mdi:sprout-outline" style="color:var(--secondary-text-color)"></ha-icon>
          <div style="flex:1">
            <div class="plan-banner-title">Planting plan stopped</div>
            <div class="plan-banner-sub">
              ${o.length} stage${1===o.length?"":"s"} · running the manual Environment targets
            </div>
          </div>
        </div>
        ${r(null)}
        ${i?V`<div class="plan-actions">${n("Start Plan",!1)}</div>`:q}`:V`
          <div class="plan-empty">
            <ha-icon icon="mdi:sprout-outline"></ha-icon>
            <div class="plan-empty-title">No planting plan running</div>
            <div class="plan-empty-sub">
              Create a plan here, or in the Spider Farmer app. While a plan runs
              the manual Environment targets pause.
            </div>
            <button class="plan-btn" style="max-width:200px;margin:14px auto 0;background:${e};border-color:${e};color:#0c1f06"
              @click=${()=>this.startPlanEdit(!0)}>+ Create plan</button>
          </div>`;const l=o.find(t=>t.stageId===a.stageId)||o[0],d=Number(a.progress),c=Number.isFinite(d),h=[];return null!=a.planted&&h.push(`${this.fmtNum(a.planted)} planted`),null!=a.remain&&h.push(`${this.fmtNum(a.remain)} left`),null!=a.totalDays&&h.push(`${this.fmtNum(a.totalDays)} total`),V`
      <div class="plan-banner">
        <ha-icon icon="mdi:sprout" style="color:${e}"></ha-icon>
        <div style="flex:1">
          <div class="plan-banner-title">${l&&l.label||"Planting plan active"}</div>
          <div class="plan-banner-sub">
            ${h.length?h.join(" · ")+" days":`${o.length} stage${1===o.length?"":"s"} · managed by the controller`}
          </div>
        </div>
        ${c?V`<div class="plan-pct" style="color:${e}">${Math.round(d)}%</div>`:q}
      </div>
      ${c?V`<div class="plan-bar"><div class="plan-bar-fill"
            style="width:${Math.max(0,Math.min(100,d))}%;background:${e}"></div></div>`:q}
      ${r(a.stageId)}
      ${i?V`<div class="plan-actions">${n("Stop Plan",!0)}</div>`:q}
      <div class="plan-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>While a plan is active the controller sets temperature, humidity
        and CO₂ from the plan schedule. Switch to Environment to see the manual
        targets used when no plan runs.</span>
      </div>`}decodePlanDate(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return null;const s=255&e,i=(e>>8)-494344;if(i<=0||s<1||s>31)return null;const o=new Date(Math.floor((i-1)/12),(i-1)%12,s);return isNaN(o.getTime())?null:o}planStageDates(t){const e=this.decodePlanDate(t.start),s=this.decodePlanDate(t.end);if(!e||!s)return"";const i=t=>t.toLocaleDateString(void 0,{month:"short",day:"numeric"}),o=Math.round((s.getTime()-e.getTime())/864e5)+1,a=e.getFullYear()!==s.getFullYear()?`, ${s.getFullYear()}`:"";return`${i(e)} – ${i(s)}${a} · ${o} day${1===o?"":"s"}`}encodePlanCode(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t||"");if(!e)return null;const s=+e[1],i=+e[2],o=+e[3];return i<1||i>12||o<1||o>31?null:12*s+i+494344<<8|o}codeToInputDate(t){const e=this.decodePlanDate(t);if(!e)return"";const s=t=>String(t).padStart(2,"0");return`${e.getFullYear()}-${s(e.getMonth()+1)}-${s(e.getDate())}`}tempUnitF(){const t=this.get(`number.sf_${this.config.panel}_env_temp_day`)?.attributes?.unit_of_measurement;return"°F"===t||"℉"===t}peSelect(t,e,s){const i=e.find(e=>Number(e.value)===Number(t))?.value??e.find(e=>e.value===String(t))?.value??String(t??"");return V`<select class="pe-sel" @change=${t=>s(t.target.value)}>
      ${e.map(t=>V`<option value=${t.value}
        .selected=${String(t.value)===String(i)}>${t.label}</option>`)}
    </select>`}envOptsFor(t){const e=this.get(`number.sf_${this.config.panel}_${t}`),s=Number(e?.attributes?.min??0),i=Number(e?.attributes?.max??100),o=Number(e?.attributes?.step??1)||1,a=e?.attributes?.unit_of_measurement??"";return this.numOpts(s,i,o,t=>`${t}${a}`)}epochToLocalInput(t){const e=Number(t);if(!Number.isFinite(e)||e<=0)return"";const s=new Date(1e3*e),i=t=>String(t).padStart(2,"0");return`${s.getFullYear()}-${i(s.getMonth()+1)}-${i(s.getDate())}T${i(s.getHours())}:${i(s.getMinutes())}`}localInputToEpoch(t){const e=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(t||"");if(e)return Math.floor(new Date(+e[1],+e[2]-1,+e[3],+e[4],+e[5]).getTime()/1e3)}threshToDisp(t){const e=Number(t);return Number.isFinite(e)&&0!==e?String(this.tempUnitF()?Math.round(9*e/5+32):Math.round(e)):"0"}threshToC(t){const e=Number(t);return Number.isFinite(e)&&0!==e?this.tempUnitF()?Math.round(5*(e-32)/9*1e4)/1e4:e:0}threshOpts(){const t=this.tempUnitF(),e=t?"°F":"°C";return[{label:"Off",value:"0"},...this.numOpts(t?59:15,t?122:50,1,t=>`${t}${e}`)]}durText(t,e){const s=/^(\d{2}):(\d{2})/.exec(t||""),i=/^(\d{2}):(\d{2})/.exec(e||"");if(!s||!i)return"";let o=(60*+i[1]+ +i[2]-(60*+s[1]+ +s[2])+1440)%1440;0===o&&t===e&&(o=0);return`${Math.floor(o/60)}h ${String(o%60).padStart(2,"0")}m`}hrsText(t,e){const s=/^(\d{1,2}):(\d{2})/.exec(t||""),i=/^(\d{1,2}):(\d{2})/.exec(e||"");if(!s||!i)return"";const o=(60*+i[1]+ +i[2]-(60*+s[1]+ +s[2])+1440)%1440;return`${Math.floor(o/60)}:${String(o%60).padStart(2,"0")}hrs`}startPlanEdit(t=!1){const e=this.tempUnitF(),s=t=>{const s=Number(t);return null!=t&&""!==t&&Number.isFinite(s)?e?Math.round(9*s/5+32):Math.round(10*s)/10:""},i=t=>{const s=Number(t);return null!=t&&""!==t&&Number.isFinite(s)?e?Math.round(9*s/5):Math.round(10*s)/10:""};if(t)return this.planDraft=[{stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}],void(this.planEditStage=0);const o=t=>t?{...t,go_dark:this.threshToDisp(t.go_dark),turn_off:this.threshToDisp(t.turn_off)}:null;this.planDraft=this.planInfo().stages.map(t=>({stageId:t.stageId,label:t.label||"",start:this.codeToInputDate(t.start),end:this.codeToInputDate(t.end),alarm:this.epochToLocalInput(t.alarm),temp_day:s(t.temp_day),temp_night:s(t.temp_night),temp_dz:i(t.temp_dz),humi_day:t.humi_day??"",humi_night:t.humi_night??"",humi_dz:t.humi_dz??"",co2_day:t.co2_day??"",co2_night:t.co2_night??"",co2_dz:t.co2_dz??"",light1:o(t.light1)??{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:o(t.light2)}))}planDraftSet(t,e,s){this.planDraft&&(this.planDraft=this.planDraft.map((i,o)=>o===t?{...i,[e]:s}:i))}addPlanStage(){this.planDraft||this.startPlanEdit();const t={stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:null},e=this.planDraft??[];this.planDraft=[...e,t],this.planEditStage=e.length}removePlanStage(t){this.planDraft&&(this.planDraft=this.planDraft.filter((e,s)=>s!==t),this.planEditStage=null,this.savePlanEdit(this.planInfo().active))}savePlanEdit(t){if(!this.planDraft)return;const e=this.tempUnitF(),s=t=>{const e=Number(t);return""!==t&&null!=t&&Number.isFinite(e)?e:void 0},i=t=>{const i=s(t);if(void 0!==i)return e?Math.round(5*(i-32)/9*1e4)/1e4:i},o=t=>{if(t)return{...t,go_dark:this.threshToC(t.go_dark),turn_off:this.threshToC(t.turn_off)}},a=this.planDraft.map(t=>{const a=this.encodePlanCode(t.start),r=this.encodePlanCode(t.end);let n=this.localInputToEpoch(t.alarm);if(void 0===n){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t.start||"");e&&(n=Math.floor(new Date(+e[1],+e[2]-1,+e[3],12,0,0).getTime()/1e3))}const l={},d=(t,e,s,i)=>{const o={};void 0!==e&&(o.day=e),void 0!==s&&(o.night=s),void 0!==i&&(o.dz=i),Object.keys(o).length&&(l[t]=o)},c=(t,e,s)=>void 0!==t?t:e?void 0:s,h=this.planEnvHas("temp"),p=this.planEnvHas("humi"),u=this.planEnvHas("co2");d("temp",c(i(t.temp_day),h,25),c(i(t.temp_night),h,20),c((t=>{const i=s(t);if(void 0!==i)return e?Math.round(5*i/9*1e4)/1e4:i})(t.temp_dz),h,2)),d("humi",c(s(t.humi_day),p,60),c(s(t.humi_night),p,55),c(s(t.humi_dz),p,5)),d("co2",c(s(t.co2_day),u,500),c(s(t.co2_night),u,500),c(s(t.co2_dz),u,100));const f={stageId:t.stageId,label:t.label,start:a,end:r,alarm:n,target:l};return f.light1=o(this.planLightHas("light1")?t.light1??this.defaultPlanLight():this.offPlanLight()),f.light2=o(this.planLightHas("light2")?t.light2??this.defaultPlanLight():this.offPlanLight()),f});this.hass?.callService("sf","set_plan",{entity_id:`sensor.sf_${this.config.panel}_plan`,stages:a,enabled:t}),this.planDraft=null,this.planEditStage=null}renderStageLight(t,e){const s=this.accent(),i=this.planDraft[t][e];if(!i)return q;const o=(s,o)=>this.planDraftSet(t,e,{...i,[s]:o}),a=t=>V`<input type="time" class="pe-in"
      .value=${String(i[t]??"")} @change=${e=>o(t,e.target.value)}>`,r=(t,e)=>this.peSelect(i[t],e,e=>o(t,e)),n=t=>V`<button class="pe-modebtn ${i.mode===t?"on":""}"
      style=${i.mode===t?`border-color:${s};color:${s}`:""}
      @click=${()=>o("mode",t)}>${t}</button>`,l="PPFD"===i.mode,d=l?"ppfd_start":"ts_start",c=l?"ppfd_stop":"ts_stop",h=this.durText(i[d],i[c]),p=this.numOpts(11,100,1,t=>`${t}%`),u=this.numOpts(20,2e3,10,t=>`${t} µmol`),f=this.offOpts(1,60,1,t=>`${t} min`),m=(t,e)=>V`<label class="pe-cell">
      <span>${t}</span>${e}</label>`,g=t=>V`<div class="pe-cellrow">${t}</div>`,v=m("Go dark",r("go_dark",this.threshOpts())),b=m("Turn off",r("turn_off",this.threshOpts()));return V`
      <div class="pe-light">
        <div class="pe-light-head"><span>${"light1"===e?"Light 1":"Light 2"}</span>
          <span class="pe-modes">${n("Time Slot")}${n("PPFD")}</span></div>
        <div class="pe-timesrow">
          <label>On${a(d)}</label>
          <label>Off${a(c)}</label>
        </div>
        ${h?V`<div class="pe-durrow">Light Duration · ${h}</div>`:q}
        ${l?V`
          ${g([m("Target",r("ppfd_target",u)),m("Dim min",r("ppfd_min",p)),m("Dim max",r("ppfd_max",p)),m("Sunrise/set",r("ppfd_fade",f))])}
          ${g([v,b])}`:V`
          ${g([m("Brightness",r("ts_bri",p)),m("Sunrise/set",r("ts_fade",f)),v,b])}`}
      </div>`}renderStageEditor(t){const e=this.accent(),s=this.tempUnitF()?"°F":"°C",i=this.planDraft[t],o=(e,s)=>this.planDraftSet(t,e,s),a=t=>V`<input type="date" class="pe-in"
      .value=${String(i[t]??"")} @change=${e=>o(t,e.target.value)}>`,r=(t,e,s,a)=>V`
      <div class="pe-row"><span class="pe-lbl">${t}</span>
        <span class="pe-cells">
          ${this.peSelect(i[e+"_night"],s,t=>o(e+"_night",t))}
          ${this.peSelect(i[e+"_day"],s,t=>o(e+"_day",t))}
          ${this.peSelect(i[e+"_dz"],a,t=>o(e+"_dz",t))}
        </span></div>`;return V`
      ${this.planDelArm?V`<div class="pe-head pe-delrow">
            <span class="pe-delq">Delete this stage?</span>
            <button class="pe-del-yes" @click=${()=>{this.planDelArm=!1,this.removePlanStage(t)}}>Delete</button>
            <button class="pe-del-no" @click=${()=>{this.planDelArm=!1}}>Cancel</button>
          </div>`:V`<div class="pe-head">
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
      ${this.planEnvHas("temp")?r("Temp "+s,"temp",this.envOptsFor("env_temp_day"),this.envOptsFor("env_temp_deadband")):q}
      ${this.planEnvHas("humi")?r("Humidity","humi",this.envOptsFor("env_humi_day"),this.envOptsFor("env_humi_deadband")):q}
      ${this.planEnvHas("co2")?r("CO₂","co2",this.envOptsFor("env_co2_day"),this.envOptsFor("env_co2_deadband")):q}
      ${this.planLightHas("light1")?this.renderStageLight(t,"light1"):q}
      ${this.planLightHas("light2")?this.renderStageLight(t,"light2"):q}
      <div class="plan-actions" style="display:flex;gap:10px">
        <button class="plan-btn" style="flex:1;background:${e};border-color:${e};color:#0c1f06"
          @click=${()=>this.savePlanEdit(this.planInfo().active)}>Save Plan</button>
        <button class="plan-btn" style="flex:1"
          @click=${()=>{this.planDraft=null,this.planEditStage=null,this.planDelArm=!1}}>Cancel</button>
      </div>`}editStage(t){this.planDraft||this.startPlanEdit(),this.planEditStage=t,this.planDelArm=!1}planEnvHas(t){const e="temp"===t?"temperature":"humi"===t?"humidity":"co2";return!!this.get(`sensor.sf_${this.config.panel}_${e}`)}planLightHas(t){return!!this.get(this.eid("light","light1"===t?"light_1":"light_2"))}defaultPlanLight(){return{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}offPlanLight(){return{mode:"Manual",ts_start:"05:00",ts_stop:"23:00",ts_bri:0,ts_fade:0,ppfd_target:0,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:0,ppfd_max:0,go_dark:0,turn_off:0}}renderPlanStage(t,e,s=-1){const i=this.accent(),o=null!=e&&t.stageId===e,a=this.planStageDates(t),r=(t,e,s,i="")=>V`
      <div class="plan-metric">
        <span class="plan-metric-label">${t}</span>
        <span class="plan-metric-vals">
          <span>N ${this.fmtNum(e)}${i}</span>
          <span>D ${this.fmtNum(s)}${i}</span>
        </span>
      </div>`;return V`
      <div class="plan-stage ${o?"current":""}"
        style=${o?`border-color:${i}`:""}>
        <div class="plan-stage-head">
          <span class="plan-stage-dot" style="background:${i}"></span>
          <span class="plan-stage-name">${t.label||"Stage"}</span>
          ${o?V`<span class="plan-stage-badge" style="color:${i};border-color:${i}">Current</span>`:q}
          ${s>=0?V`<ha-icon icon="mdi:pencil" class="plan-stage-edit"
            @click=${()=>this.editStage(s)}></ha-icon>`:q}
        </div>
        ${a?V`<div class="plan-stage-dates">${a}</div>`:q}
        <div class="plan-stage-grid">
          ${this.planEnvHas("temp")?r("Temp",this.fmtTemp(t.temp_night),this.fmtTemp(t.temp_day)):q}
          ${this.planEnvHas("humi")?r("Humidity",t.humi_night,t.humi_day,"%"):q}
          ${this.planEnvHas("co2")?r("CO₂",t.co2_night,t.co2_day,""):q}
        </div>
      </div>`}fmtTemp(t){if(null==t||""===t)return"–";const e=Number(t);if(!Number.isFinite(e))return"–";const s=this.get(`number.sf_${this.config.panel}_env_temp_day`),i=s?.attributes?.unit_of_measurement;return"°F"===i||"℉"===i?`${Math.round(9*e/5+32)}°`:`${Math.round(e)}°`}fmtNum(t){if(null==t||""===t)return"–";const e=Number(t);return Number.isFinite(e)?`${Math.round(e)}`:String(t)}vpdRangeFor(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const o=Number(s.state),a=Number(i.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const r=this.config.panel,n=Number(this.get(`number.sf_${r}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${r}_env_humi_deadband`)?.state??0)||0,d="°C"===s.attributes.unit_of_measurement,c=t=>d?t:5*(t-32)/9,h=t=>.6108*Math.exp(17.27*t/(t+237.3)),p=Math.max(0,a-l),u=Math.min(100,a+l),f=Math.max(0,h(c(o-n))*(1-u/100)),m=Math.max(0,h(c(o+n))*(1-p/100));return`${f.toFixed(2)} – ${m.toFixed(2)}`}renderVpd(){const t=this.config.panel,e=this.vpdRangeFor(`number.sf_${t}_env_temp_day`,`number.sf_${t}_env_humi_day`),s=this.vpdRangeFor(`number.sf_${t}_env_temp_night`,`number.sf_${t}_env_humi_night`);return e||s?V`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${e?V`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${e}</span>
              </div>`:q}
          ${s?V`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${s}</span>
              </div>`:q}
        </div>
      </div>`:q}renderLeafVpdTargets(){const t=this.get(this.eid("number","leaf_vpd_min")),e=this.get(this.eid("number","leaf_vpd_max"));if(!t||!e)return q;const s=(t,e)=>{const s=this.eid("number",t);return V`
      <div class="ctl ${s in this.draft?"staged":""}">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">
          <span class="num-box">
            <input type="number" step="0.05" min="0" max="4" .value=${this.draftVal(s)}
              @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&this.stage(s,String(e))}} />
            <span class="unit">kPa</span>
          </span>
        </div>
      </div>`};return V`
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
      </div>`}toggleOutlet(t){this.outletOpen=t}outletNums(t){const e=[];for(let s=1;s<=10;s++)this.get(`select.sf_${t}_outlet_${s}_mode`)&&e.push(s);return e}outletName(t,e){if(this.customOutletNames){const s=this.outletNames[`${t}_${e}`];if(s&&s.trim())return s.trim()}return`Outlet ${e}`}stageOutletName(t,e,s){this.outletNameDraft={...this.outletNameDraft,[`${t}_${e}`]:s}}outletNameDirty(t,e){const s=`${t}_${e}`;return s in this.outletNameDraft&&this.outletNameDraft[s].trim()!==(this.outletNames[s]??"").trim()}clearOutletNameDraft(t,e){const s=`${t}_${e}`;if(!(s in this.outletNameDraft))return;const i={...this.outletNameDraft};delete i[s],this.outletNameDraft=i}commitOutletName(t,e){const s=`${t}_${e}`;if(!(s in this.outletNameDraft))return;const i=this.outletNameDraft[s].trim(),o={...this.outletNames};i?o[s]=i:delete o[s],this.outletNames=o,this.persistColorOption(`outlet_name_${t}_${e}`,i),this.cacheColors(),this.clearOutletNameDraft(t,e)}ledToggle(t){const e=`switch.sf_${t}_indicator_light`,s=this.get(e);if(!s)return q;const i="on"===s.state,o=this.accent();return V`
      <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:400">
        <span style="opacity:.7">Indicator light</span>
        <button class="toggle sm ${i?"on":""}"
          style=${i?`background:${o}`:q}
          title="Indicator Light"
          aria-label="Indicator Light"
          @click=${()=>this.hass?.callService("switch","toggle",{entity_id:e})}></button>
      </span>`}renderOutlets(){const t=this.outletSlots().filter(t=>this.outletNums(t).length>0);if(!t.length)return q;const e=this.outletOpen?this.outletOpen.slice(0,this.outletOpen.lastIndexOf("_")):null;return V`
      ${t.map(t=>{const s=Ct(this.hass,t)||(t.startsWith("st")?"S-Station":`${t.toUpperCase()} Power Strip`);return V`
          <div class="section-label" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span>${s}</span>
            ${this.ledToggle(t)}
          </div>
          <div class="grid">
            ${this.outletNums(t).map(e=>this.outletTile(t,e))}
          </div>
          ${e===t?this.renderOutletPop():q}`})}`}outletColorFor(t){switch((t=>"Time Slot"===t||"Cycle"===t?"sched":"Temperature"===t||"Humidity"===t||"CO2"===t?"env":"Drip Irrigation"===t?"drip":"manual")(t)){case"sched":return this.ocSched;case"env":return this.ocEnv;case"drip":return this.ocDrip;default:return this.ocManual}}outletTile(t,e){const s="on"===this.draftVal(`switch.sf_${t}_outlet_${e}`),i=this.draftVal(`select.sf_${t}_outlet_${e}_mode`)||"",o=this.outletKey(t,e),a=this.outletOpen===o,r=this.accent(),n=s&&"off"!==this.outletColorMode?this.outletColorFor(i):"",l=n||r;let d="";return n&&"tile"===this.outletColorMode&&(d=`background:${Rt(n)};box-shadow:inset 0 0 0 1px ${n}`),a&&(d=`box-shadow:inset 0 0 0 1px ${r}`+(n&&"tile"===this.outletColorMode?`;background:${Rt(n)}`:"")),V`
      <div class="tile clickable ${a?"active":""}"
        style=${d||q}
        role="button" aria-expanded=${a?"true":"false"}
        @click=${()=>this.toggleOutlet(a?null:o)}>
        <div class="tile-label" title=${this.outletName(t,e)}>${this.outletName(t,e)}
          <ha-icon class="tile-more"
            icon=${a?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${s?l:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${s?`color:${l}`:q}>${s?"On":"Off"}</div>
        <div class="tile-sub">${i}</div>
      </div>`}clearOutletCfgDraft(t,e){const s=this.outletKey(t,e);if(!(s in this.outletCfgDraft))return;const i={...this.outletCfgDraft};delete i[s],this.outletCfgDraft=i}renderOutletModeConfig(t,e,s){const i=this.outletKey(t,e),o=this.outletCfgDraft[i]??{},a=(t,e)=>this.outletCfgDraft={...this.outletCfgDraft,[i]:{...o,[t]:e}},r=(t,e,s,i)=>V`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="num-box">
          <input type="number" min="0" max="1440" .value=${o[e]??String(s)}
            @change=${t=>a(e,t.target.value)} />
          ${i?V`<span class="unit">${i}</span>`:q}
        </span>
      </div>`,n=(t,e,s)=>V`
      <div class="dev-row ${e in o?"staged":""}">
        <span class="dev-lbl">${t}</span>
        <span class="ctl-input">
          <select @change=${t=>a(e,t.target.value)}>
            ${s.map(t=>V`<option value=${t}
              ?selected=${(o[e]??s[0])===t}>${t}</option>`)}
          </select>
        </span>
      </div>`;switch(s){case"Cycle":return V`
        ${l="Start",d="cycle_start",c="12:00",V`
      <div class="dev-row ${d in o?"staged":""}">
        <span class="dev-lbl">${l}</span>
        <span class="num-box">
          <input type="time" .value=${o[d]??c}
            @change=${t=>a(d,t.target.value)} />
        </span>
      </div>`}
        ${r("Run Duration","cycle_run",60,"min")}
        ${r("Off Duration","cycle_off",60,"min")}
        ${r("Execution Times","cycle_times",1,"")}`;case"Temperature":return n("Device","temp_device",["Heating","Cooling"]);case"Humidity":return n("Device","humidity_device",["Humidifying","Dehumidifying"]);case"CO2":return n("Device","co2_device",["Aeration","Exhaust"]);default:return q}var l,d,c}renderOutletPop(){const t=this.outletOpen;if(!t)return q;const e=t.lastIndexOf("_");if(e<0)return q;const s=t.slice(0,e),i=Number(t.slice(e+1));if(!s||!Number.isFinite(i))return q;const o=`select.sf_${s}_outlet_${i}_mode`;if(!this.get(o))return q;const a=`switch.sf_${s}_outlet_${i}`,r=this.get(a),n=`sf_${s}_outlet_${i}_`,l=this.draftVal(o)||this.get(o)?.state||"",d="Time Slot"===l,c=new Set((Lt[l]||[]).map(t=>`${n}${t}`)),h=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return!!c.has(e)&&(!d||e!==`${n}ts_type`&&e!==`${n}ts_start`&&e!==`${n}ts_stop`)}).sort(),p=this.get(o)?.state||"",u=l!==p&&"Manual"!==l&&!d&&(Lt[l]||[]).length>0&&0===h.length,f=this.outletKey(s,i),m=[...u?[]:[o],...r?[a]:[],...h.filter(t=>/^(switch|number|select|text)\./.test(t))],g=!!this.outletDraft[this.outletKey(s,i)],v=this.outletNameDirty(s,i),b=u;return V`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${this.outletName(s,i)}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleOutlet(null)}></ha-icon>
        </div>
        ${this.customOutletNames?V`
          <div class="toggle-row ${this.outletNameDirty(s,i)?"staged":""}">
            <span>Name</span>
            <span class="num-box">
              <input type="text" style="width:140px;text-align:left"
                .value=${this.outletKey(s,i)in this.outletNameDraft?this.outletNameDraft[this.outletKey(s,i)]:this.outletNames[`${s}_${i}`]??""}
                placeholder=${`Outlet ${i}`}
                @input=${t=>this.stageOutletName(s,i,t.target.value)} />
            </span>
          </div>`:q}
        ${this.stagedCtl(o,"Mode")}
        ${r&&!u?this.stagedCtl(a,"Power"):q}
        ${u?this.renderOutletModeConfig(s,i,l):q}
        ${h.map(t=>this.stagedCtl(t))}
        ${d?this.renderOutletSchedule(s,i):q}
        ${this.applyBar(m,{extraDirty:g||v||b,onApply:()=>{if(u){if(this.hass?.callService("sf","set_outlet_config",{entity_id:o,mode:l,config:this.outletCfgDraft[f]??{}}),this.clearOutletCfgDraft(s,i),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}this.modePick={...this.modePick,[o]:l}}this.saveOutlet(s,i),this.commitOutletName(s,i)},onDiscard:()=>{if(this.clearOutletDraft(s,i),this.clearOutletNameDraft(s,i),this.clearOutletCfgDraft(s,i),o in this.draft){const t={...this.draft};delete t[o],this.draft=t}}})}
      </div>`}outletKey(t,e){return`${t}_${e}`}outletPeriods(t,e){const s=this.outletDraft[this.outletKey(t,e)];if(s)return s;const i=this.get(`sensor.sf_${t}_outlet_${e}_ts_schedule`)?.attributes.periods;return Array.isArray(i)?i:[]}editOutlet(t,e,s){const i=this.outletKey(t,e),o=this.outletDraft[i]??this.outletPeriods(t,e),a=JSON.parse(JSON.stringify(o));s(a),this.outletDraft={...this.outletDraft,[i]:a}}clearOutletDraft(t,e){const s=this.outletKey(t,e),i={...this.outletDraft};delete i[s],this.outletDraft=i}saveOutlet(t,e){const s=this.outletDraft[this.outletKey(t,e)];s&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${t}_outlet_${e}_mode`,periods:s}),this.clearOutletDraft(t,e))}renderOutletSchedule(t,e){const s=this.outletPeriods(t,e),i=this.accent();return V`
      <div class="ts-editor">
        ${s.map((s,o)=>V`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${o+1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${()=>this.editOutlet(t,e,t=>t.splice(o,1))}>✕</button>
            </div>
            <div class="days">
              ${gt.map((a,r)=>V`<button
                  class="day ${s.days.includes(r)?"on":""}"
                  style=${s.days.includes(r)?`background:${i};border-color:${i}`:""}
                  @click=${()=>this.editOutlet(t,e,t=>{const e=t[o].days,s=e.indexOf(r);s>=0?e.splice(s,1):e.push(r),e.sort((t,e)=>t-e)})}>${a}</button>`)}
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
      </div>`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let s=e?.attributes.friendly_name??"";const i=Ct(this.hass,this.config.panel);return i&&s.startsWith(i)&&(s=s.slice(i.length).trim()),s=s.replace(/\s*Temp Calibration\s*$/i,"").trim(),s||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.envControl(t,e)).filter(t=>t!==q),s=this.caliSoilSlots().map(e=>{const s=[this.envControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.envControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==q),i=this.stagedCtl(`select.sf_${t}_${e}_substrate`,"Substrate");return V`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="cali-soil-grid">${s}${i!==q?i:q}</div>
        </div>`}),i=this.renderLeafVpdCalibration();return e.length||s.length||i!==q?V`
      ${e.length?V`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:q}
      ${s.length?V`<div class="section-label">Soil Calibration</div>${s}`:q}
      ${i}
      ${this.applyBar(this.caliIds())}`:V`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}hasAlerts(){return!!this.alertsSettings()}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return t&&"object"==typeof t?t:null}editAlert(t){const e=this.alertsDraft??this.alertsSettings()??{},s=JSON.parse(JSON.stringify(e));t(s),this.alertsDraft=s}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const t=this.alertsSettings();if(!t)return V`<div class="cali-empty">No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.</div>`;const e=null!==this.alertsDraft,s=this.accent();return V`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(t,"climate","Climate")}
      ${this.renderAlertGroup(t,"substrate","Substrate")}
      ${this.renderAlertOther(t)}
      ${jt(s,e,()=>this.saveAlerts(),()=>this.alertsDraft=null,"apply-bar")}`}renderAlertGroup(t,e,s){const i=t[e]||[];return i.length?V`
      <div class="section-label">${s}</div>
      ${i.map((t,s)=>this.renderAlertMetric(e,s,t))}`:q}tempUnit(){return this.hass?.config?.unit_system?.temperature||"°F"}isCelsius(){return this.tempUnit().includes("C")}tempThresholdOpts(){const t=this.isCelsius();return this.offOpts(t?15:59,t?50:122,1,t=>`${t}${this.tempUnit()}`)}alertBounds(t){switch(t){case"temp":case"tempSoil":return this.isCelsius()?[0,50]:[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(t,e,s){const i=this.accent(),[o,a]=this.alertBounds(s.key),r=Number(s.step??1)||1,n="ppfd"===s.key?Math.max(o,a-100):a,l=(i,l)=>{const d=this.numOpts(o,"min"===l?n:a,r);return V`
      <label class="av">
        <span class="av-lbl">${i}</span>
        <span class="num-box">
          <select @change=${s=>this.editAlert(i=>{i[t][e][l]=Number(s.target.value)})}>
            ${d.map(t=>V`
              <option value=${t.value} .selected=${String(t.value)===String(s[l]??"")}>${t.label}</option>`)}
          </select>
          <span class="unit">${s.unit??""}</span>
        </span>
      </label>`};return V`
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
      </div>`}renderAlertOther(t){const e=t.other||[];if(!e.length)return q;const s=this.accent();return V`
      <div class="section-label">Other Device</div>
      ${e.map((t,e)=>V`<div class="alert-bool">
          <span class="alert-name">${t.label}</span>
          <button class="toggle ${t.enabled?"on":""}"
            style=${t.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(t=>{const s=t.other[e];s.enabled=s.enabled?0:1})}
            aria-label="Toggle ${t.label} alarm"></button>
        </div>`)}`}hasLog(){return this.alarmSources().length>0}alarmSources(){const t=[],e=e=>{const s=this.get(`sensor.sf_${e}_alarms`);s&&t.push({slot:e,ent:s,name:Ct(this.hass,e)||e})};this.config.panel&&e(this.config.panel);for(const t of this.outletSlots())t!==this.config.panel&&e(t);return t}logToday(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}renderLog(){const t=this.alarmSources(),e=this.logDate||this.logToday(),s=this.logDev||"all",i=this.logType||"all";let o=[];for(const e of t){if("all"!==s&&s!==e.slot)continue;const t=e.ent.attributes.events;Array.isArray(t)&&t.forEach(t=>o.push({...t,_src:e.name}))}const a=[...new Set(o.map(t=>t.device).filter(Boolean))].sort(),r=new Date(`${e}T00:00:00`).getTime()/1e3,n=new Date(`${e}T23:59:59.999`).getTime()/1e3,l=new Set;return o=o.filter(t=>(t.epoch||0)>=r&&(t.epoch||0)<=n&&("all"===i||t.device===i)).sort((t,e)=>(e.epoch||0)-(t.epoch||0)).filter(t=>{const e=`${t.epoch}|${t._src}|${t.device||`Device ${t.devType}`}|${t.alarm||""}|${t.alarmType||0}`;return!l.has(e)&&(l.add(e),!0)}).slice(0,50),V`
      <div class="log-filters">
        ${t.length>1?V`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${t=>{this.logDev=t.target.value}}>
                  <option value="all" ?selected=${"all"===s}>All</option>
                  ${t.map(t=>V`
                    <option value=${t.slot} ?selected=${s===t.slot}>${t.name}</option>`)}
                </select>
              </div>
            </div>`:q}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${t=>{this.logType=t.target.value}}>
              <option value="all" ?selected=${"all"===i}>All</option>
              ${a.map(t=>V`
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
      ${o.length?V`
            <div class="log-count">${o.length} ${1===o.length?"entry":"entries"}${o.length>10?" — scroll for more":""}</div>
            <div class="log-list">
              ${o.map(e=>V`
                <div class="log-row ${e.alarmType?"raise":"restore"}">
                  <div class="log-title">${t.length>1&&"all"===s?`${e._src} `:""}${e.device||`Device ${e.devType}`} ${e.alarm||""}</div>
                  <div class="log-time">${e.epoch?(t=>{try{return new Date(1e3*t).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(e.epoch):e.time||""}</div>
                </div>`)}
            </div>`:V`<div class="cali-empty">No log entries on this date.</div>`}`}render(){if(!this.hass||!this.config)return q;const t=this.hasOutlets();let e=this.tab;"outlets"!==e||t||(e="overview");const s=this.accent(),i=(t,i)=>V`<button class="tab ${e===t?"active":""}"
        style=${e===t?`color:${s};border-color:${s}`:""}
        @click=${()=>this.tab=t}>${i}</button>`,o=Ct(this.hass,this.config.panel);return V`
      <ha-card style=${this.layoutStyle()||q}>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${o?V`<span class="device">${o}</span>`:q}
        </div>
        ${V`<div class="tabs">
              ${i("overview","Overview")}
              ${i("env","Environment")}
              ${t?i("outlets","Outlets"):q}
              ${i("cali","Calibration")}
              ${i("alerts","Alerts")}
              ${i("log","Log")}
              ${i("settings","Settings")}
            </div>`}
        ${"env"===e?this.renderEnv():"outlets"===e?this.renderOutlets():"cali"===e?this.renderCali():"alerts"===e?this.renderAlerts():"log"===e?this.renderLog():"settings"===e?this.renderSettings():this.renderOverview()}
      </ha-card>`}setLeafSpot(t,e){const s=[...this.leafSpots];s[t]=parseFloat(e),this.leafSpots=s}renderLeafVpdCalibration(){const t=this.eid("number","leaf_offset"),e=this.get(t);if(!e)return q;const s=e.attributes.unit_of_measurement||"°",i=this.get(this.eid("sensor","temperature")),o=i&&Number.isFinite(+i.state)?+i.state:null;if(5!==this.leafSpots.length){const t=o??0;this.leafSpots=Array(5).fill(Math.round(10*t)/10)}const a=this.leafSpots,r=a.filter(t=>Number.isFinite(t)),n=r.length?r.reduce((t,e)=>t+e,0)/r.length:null,l=null!=n&&null!=o?n-o:null,d=t in this.draft,c=e=>this.stage(t,String(Math.round(10*e)/10)),h=this.eid("number","leaf_offset_night"),p=!!this.get(h),u=h in this.draft,f=t=>this.stage(h,String(Math.round(10*t)/10)),m=this.accent(),g=p?this.leafCalTarget:"day";return V`
      <div class="section-label" style="margin-top:16px">Leaf VPD</div>
      <div class="set-note">
        VPD referenced to the leaf surface, which runs cooler than the air. Under
        the light leaves transpire and sit well below air; lights-off they settle
        near air temp — so set a Day and Night offset. Calibrate the day value
        from measurements if you like, then Apply.
      </div>
      <div class="toggle-row ${d?"staged":""}">
        <span>Leaf offset (day)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(t)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&c(e)}} />
          <span class="unit">${s}</span>
        </span>
      </div>
      ${p?V`
      <div class="toggle-row ${u?"staged":""}">
        <span>Leaf offset (night)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(h)}
            @change=${t=>{const e=parseFloat(t.target.value);Number.isFinite(e)&&f(e)}} />
          <span class="unit">${s}</span>
        </span>
      </div>`:q}
      <details class="leaf-cal">
        <summary>Calibrate from 5 readings</summary>
        <div class="set-note">
          Point an IR thermometer at 5 leaf spots and enter each. The average
          becomes leaf temp; the implied offset (leaf − air) fills the offset you
          pick below — Apply to save it. Measure under the light for Day, lights-off
          for Night.
        </div>
        ${p?V`
        <div class="seg-row" style="grid-template-columns:repeat(2,1fr);margin-bottom:8px">
          <button class="seg ${"day"===g?"on":""}"
            style=${"day"===g?`border-color:${m};color:${m}`:q}
            @click=${()=>{this.leafCalTarget="day"}}>
            <ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>Day</span>
          </button>
          <button class="seg ${"night"===g?"on":""}"
            style=${"night"===g?`border-color:${m};color:${m}`:q}
            @click=${()=>{this.leafCalTarget="night"}}>
            <ha-icon icon="mdi:weather-night"></ha-icon><span>Night</span>
          </button>
        </div>`:q}
        <div class="leaf-spots">
          ${a.map((t,e)=>V`<input type="number" step="0.1"
            .value=${Number.isFinite(t)?String(t):""}
            @input=${t=>this.setLeafSpot(e,t.target.value)} />`)}
        </div>
        <div class="leaf-cal-foot">
          <span>
            Avg ${null!=n?n.toFixed(1)+s:"—"}
            · offset ${null!=l?(t=>(t>=0?"+":"")+t.toFixed(1))(l)+s:"—"}
          </span>
          <button class="leaf-apply" ?disabled=${null==l}
            @click=${()=>null!=l&&(t=>"night"===g?f(t):c(t))(l)}>
            Use for ${"night"===g?"night":"day"}</button>
        </div>
      </details>`}renderSettings(){const t=this.accent(),e=this.colorDraft,s=e?.mode??this.colorMode,i=e?.modeIn??this.colorModeIn,o=e?.hi??this.colHi,a=e?.lo??this.colLo,r=e?.in??this.colIn,n=e?.warn??this.colWarn,l=e?.showTrend??this.showTrend,d=e?.showBand??this.showBand,c=e?.showTargets??this.showTargets,h=e?.tileSummary??this.tileSummary,p=e?.hour12??this.hour12,u=e?.customNames??this.customOutletNames,f=e?.customLayout??this.customLayout,m=e?.scale??this.cardScale,g=e?.cols??this.tileCols,v=!!this.get(this.eid("light","light_2")),b=e?.omode??this.outletColorMode,_=e?.ocManual??this.ocManual,$=e?.ocSched??this.ocSched,x=e?.ocEnv??this.ocEnv,y=e?.ocDrip??this.ocDrip,w=this.hasOutlets(),S=e?.dmode??this.deviceColorMode,k=e?.dcManual??this.dcManual,O=e?.dcSched??this.dcSched,D=e?.dcAuto??this.dcAuto,C=this.overviewDevices().length>0,M=!!e&&(void 0!==e.mode&&e.mode!==this.colorMode||void 0!==e.modeIn&&e.modeIn!==this.colorModeIn||void 0!==e.source&&e.source!==this.colorSource||void 0!==e.warn&&e.warn!==this.colWarn||void 0!==e.showTrend&&e.showTrend!==this.showTrend||void 0!==e.showBand&&e.showBand!==this.showBand||void 0!==e.showTargets&&e.showTargets!==this.showTargets||void 0!==e.tileSummary&&e.tileSummary!==this.tileSummary||void 0!==e.hour12&&e.hour12!==this.hour12||void 0!==e.hi&&e.hi!==this.colHi||void 0!==e.lo&&e.lo!==this.colLo||void 0!==e.in&&e.in!==this.colIn||void 0!==e.hide2&&e.hide2!==this.hideLight2||void 0!==e.customNames&&e.customNames!==this.customOutletNames||void 0!==e.customLayout&&e.customLayout!==this.customLayout||void 0!==e.scale&&e.scale!==this.cardScale||void 0!==e.cols&&e.cols!==this.tileCols||void 0!==e.omode&&e.omode!==this.outletColorMode||void 0!==e.ocManual&&e.ocManual!==this.ocManual||void 0!==e.ocSched&&e.ocSched!==this.ocSched||void 0!==e.ocEnv&&e.ocEnv!==this.ocEnv||void 0!==e.ocDrip&&e.ocDrip!==this.ocDrip||void 0!==e.dmode&&e.dmode!==this.deviceColorMode||void 0!==e.dcManual&&e.dcManual!==this.dcManual||void 0!==e.dcSched&&e.dcSched!==this.dcSched||void 0!==e.dcAuto&&e.dcAuto!==this.dcAuto),N=t=>this.colorDraft={...this.colorDraft??{},...t},A=(e,s,i,o,a)=>V`
      <button class="seg ${e===s?"on":""}"
        style=${e===s?`border-color:${t};color:${t}`:q}
        @click=${a}>
        <ha-icon icon=${o}></ha-icon><span>${i}</span>
      </button>`,T=e?.source??this.colorSource,E=(e,s,i)=>V`
      <button class="seg ${T===e?"on":""}"
        style=${T===e?`border-color:${t};color:${t}`:q}
        @click=${()=>N({source:e})}>
        <ha-icon icon=${i}></ha-icon><span>${s}</span>
      </button>`,R=(t,e,s)=>V`
      <label class="color-field">
        <span>${t}</span>
        <input class="pinwheel" type="color" .value=${e}
          @input=${t=>s(t.target.value)} />
      </label>`;return V`
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
        ${E("alarms","Alarms","mdi:bell-outline")}
        ${E("targets","Targets","mdi:target")}
        ${E("both","Both","mdi:set-center")}
      </div>

      <div class="section-label" style="margin-top:16px">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${o}">above max</span>,
        <span style="color:${a}">below min</span>. Saved to the controller, so
        it sticks across upgrades and your other devices.
      </div>
      <div class="seg-row">
        ${A(s,"off","No color","mdi:circle-off-outline",()=>N({mode:"off"}))}
        ${A(s,"tile","Tile color","mdi:square-rounded",()=>N({mode:"tile"}))}
        ${A(s,"text","Text color","mdi:format-color-text",()=>N({mode:"text"}))}
      </div>
      <div class="color-row">
        ${R("Above max",o,t=>N({hi:t}))}
        ${R("Below min",a,t=>N({lo:t}))}
        ${R("Near edge",n,t=>N({warn:t}))}
      </div>

      <div class="section-label" style="margin-top:16px">In-range highlight</div>
      <div class="set-note">
        Colour a reading that's <span style="color:${r}">within</span> its
        limits. Applies to every reading; off by default.
      </div>
      <div class="seg-row">
        ${A(i,"off","No color","mdi:circle-off-outline",()=>N({modeIn:"off"}))}
        ${A(i,"tile","Tile color","mdi:square-rounded",()=>N({modeIn:"tile"}))}
        ${A(i,"text","Text color","mdi:format-color-text",()=>N({modeIn:"text"}))}
      </div>
      <div class="color-row">
        ${R("In range",r,t=>N({in:t}))}
      </div>

      ${v?V`
            <div class="section-label" style="margin-top:16px">Devices</div>
            <div class="set-note">
              A phantom Light 2 or Fan tile? Manage per-device accessories in the
              integration: Settings → Devices &amp; services → Spider Farmer
              Bridge → Configure → “Device accessories”. HA then skips the
              entity entirely.
            </div>`:q}

      ${w?V`
            <div class="section-label" style="margin-top:16px">Outlet active color</div>
            <div class="set-note">
              Colour an outlet tile while it's on, by its mode —
              <span style="color:${_}">Manual</span>,
              <span style="color:${$}">Scheduled</span>,
              <span style="color:${x}">Environment</span>,
              <span style="color:${y}">Drip</span>. Off outlets stay neutral.
            </div>
            <div class="seg-row">
              ${A(b,"off","No color","mdi:circle-off-outline",()=>N({omode:"off"}))}
              ${A(b,"tile","Tile color","mdi:square-rounded",()=>N({omode:"tile"}))}
              ${A(b,"text","Text color","mdi:format-color-text",()=>N({omode:"text"}))}
            </div>
            <div class="color-row">
              ${R("Manual",_,t=>N({ocManual:t}))}
              ${R("Scheduled",$,t=>N({ocSched:t}))}
            </div>
            <div class="color-row">
              ${R("Environment",x,t=>N({ocEnv:t}))}
              ${R("Drip",y,t=>N({ocDrip:t}))}
            </div>`:q}

      ${C?V`
            <div class="section-label" style="margin-top:16px">Device active color</div>
            <div class="set-note">
              Colour a device tile while it's on, by its mode —
              <span style="color:${k}">Manual</span>,
              <span style="color:${O}">Scheduled</span>,
              <span style="color:${D}">Auto</span> (Environment / PPFD). A
              <span style="color:${Tt}">fault</span> always overrides.
            </div>
            <div class="seg-row">
              ${A(S,"off","No color","mdi:circle-off-outline",()=>N({dmode:"off"}))}
              ${A(S,"tile","Tile color","mdi:square-rounded",()=>N({dmode:"tile"}))}
              ${A(S,"text","Text color","mdi:format-color-text",()=>N({dmode:"text"}))}
            </div>
            <div class="color-row">
              ${R("Manual",k,t=>N({dcManual:t}))}
              ${R("Scheduled",O,t=>N({dcSched:t}))}
              ${R("Auto",D,t=>N({dcAuto:t}))}
            </div>`:q}
      <div class="section-label" style="margin-top:16px">Tile extras</div>
      <div class="set-note">
        Shown on every Overview tile, independent of the colour mode. Tap any tile
        to open its 6-hour history graph.
      </div>
      <div class="toggle-row">
        <span>Target / range line</span>
        <button class="toggle ${c?"on":""}"
          style=${c?`background:${t}`:q}
          @click=${()=>N({showTargets:!c})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Trend arrows</span>
        <button class="toggle ${l?"on":""}"
          style=${l?`background:${t}`:q}
          @click=${()=>N({showTrend:!l})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Dead-zone band</span>
        <button class="toggle ${d?"on":""}"
          style=${d?`background:${t}`:q}
          @click=${()=>N({showBand:!d})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device mode summary</span>
        <button class="toggle ${h?"on":""}"
          style=${h?`background:${t}`:q}
          @click=${()=>N({tileSummary:!h})}></button>
      </div>
      <div class="set-note">
        On each device tile (Blower, Fan, Heater, Humidifier, Dehumidifier,
        Lights), show a small line with its mode and key settings — so you can
        read it without opening the tile.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>12-hour time (AM/PM)</span>
        <button class="toggle ${p?"on":""}"
          style=${p?`background:${t}`:q}
          @click=${()=>N({hour12:!p})}></button>
      </div>
      <div class="set-note">
        Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.
      </div>
      ${w?V`
      <div class="set-note" style="margin-top:12px">
        Give each outlet its own name (e.g. "Exhaust Fan", "Veg Light"), shown in
        the Outlets tab in place of "Outlet 1/2/…". Edit each name on its outlet
        after enabling. Saved to the controller, so it sticks across upgrades and
        your other devices.
      </div>
      <div class="toggle-row">
        <span>Custom outlet names</span>
        <button class="toggle ${u?"on":""}"
          style=${u?`background:${t}`:q}
          @click=${()=>N({customNames:!u})}></button>
      </div>`:q}

      <div class="section-label" style="margin-top:16px">Layout</div>
      <div class="set-note">
        Resize the whole card and choose how many tiles sit per row. Saved to the
        controller, so it sticks across upgrades and your other devices.
      </div>
      <div class="toggle-row">
        <span>Custom layout</span>
        <button class="toggle ${f?"on":""}"
          style=${f?`background:${t}`:q}
          @click=${()=>N({customLayout:!f})}></button>
      </div>
      ${f?V`
        <div class="set-note" style="margin-top:10px;display:flex;justify-content:space-between">
          <span>Scale</span><span style="color:${t};font-weight:500">${m}%</span>
        </div>
        <input type="range" min="70" max="150" step="5" .value=${String(m)}
          style="width:100%"
          @input=${t=>N({scale:Number(t.target.value)})} />
        <div class="set-note" style="margin-top:10px">Tiles per row</div>
        <div class="seg-row" style="grid-template-columns:repeat(4,1fr)">
          ${[2,3,4,5].map(e=>V`
            <button class="seg ${g===e?"on":""}"
              style=${g===e?`border-color:${t};color:${t}`:q}
              @click=${()=>N({cols:e})}><span>${e}</span></button>`)}
        </div>`:q}
      ${jt(t,M,()=>{const t=this.colorDraft;t&&(void 0!==t.mode&&t.mode!==this.colorMode&&(this.colorMode=t.mode,this.persistColorOption("colors",t.mode)),void 0!==t.modeIn&&t.modeIn!==this.colorModeIn&&(this.colorModeIn=t.modeIn,this.persistColorOption("colors_in",t.modeIn)),void 0!==t.source&&t.source!==this.colorSource&&(this.colorSource=t.source,this.persistColorOption("color_source",t.source)),void 0!==t.warn&&t.warn!==this.colWarn&&(this.colWarn=t.warn,this.persistColorOption("color_warn",t.warn)),void 0!==t.showTrend&&t.showTrend!==this.showTrend&&(this.showTrend=t.showTrend,this.persistColorOption("show_trend",t.showTrend?"1":"0")),void 0!==t.showBand&&t.showBand!==this.showBand&&(this.showBand=t.showBand,this.persistColorOption("show_band",t.showBand?"1":"0")),void 0!==t.showTargets&&t.showTargets!==this.showTargets&&(this.showTargets=t.showTargets,this.persistColorOption("show_targets",t.showTargets?"1":"0")),void 0!==t.tileSummary&&t.tileSummary!==this.tileSummary&&(this.tileSummary=t.tileSummary,this.persistColorOption("tile_summary",t.tileSummary?"1":"0")),void 0!==t.hour12&&t.hour12!==this.hour12&&(this.hour12=t.hour12,this.persistColorOption("time_12h",t.hour12?"1":"0")),void 0!==t.hi&&t.hi!==this.colHi&&(this.colHi=t.hi,this.persistColorOption("color_hi",t.hi)),void 0!==t.lo&&t.lo!==this.colLo&&(this.colLo=t.lo,this.persistColorOption("color_lo",t.lo)),void 0!==t.in&&t.in!==this.colIn&&(this.colIn=t.in,this.persistColorOption("color_in",t.in)),void 0!==t.hide2&&t.hide2!==this.hideLight2&&(this.hideLight2=t.hide2,this.persistColorOption("hide_light2",t.hide2?"1":"0")),void 0!==t.customNames&&t.customNames!==this.customOutletNames&&(this.customOutletNames=t.customNames,this.persistColorOption("custom_outlet_names",t.customNames?"1":"0")),void 0!==t.customLayout&&t.customLayout!==this.customLayout&&(this.customLayout=t.customLayout,this.persistColorOption("custom_layout",t.customLayout?"1":"0")),void 0!==t.scale&&t.scale!==this.cardScale&&(this.cardScale=t.scale,this.persistColorOption("card_scale",String(t.scale))),void 0!==t.cols&&t.cols!==this.tileCols&&(this.tileCols=t.cols,this.persistColorOption("tile_cols",String(t.cols))),void 0!==t.omode&&t.omode!==this.outletColorMode&&(this.outletColorMode=t.omode,this.persistColorOption("outlet_colors",t.omode)),void 0!==t.ocManual&&t.ocManual!==this.ocManual&&(this.ocManual=t.ocManual,this.persistColorOption("oc_manual",t.ocManual)),void 0!==t.ocSched&&t.ocSched!==this.ocSched&&(this.ocSched=t.ocSched,this.persistColorOption("oc_sched",t.ocSched)),void 0!==t.ocEnv&&t.ocEnv!==this.ocEnv&&(this.ocEnv=t.ocEnv,this.persistColorOption("oc_env",t.ocEnv)),void 0!==t.ocDrip&&t.ocDrip!==this.ocDrip&&(this.ocDrip=t.ocDrip,this.persistColorOption("oc_drip",t.ocDrip)),void 0!==t.dmode&&t.dmode!==this.deviceColorMode&&(this.deviceColorMode=t.dmode,this.persistColorOption("device_colors",t.dmode)),void 0!==t.dcManual&&t.dcManual!==this.dcManual&&(this.dcManual=t.dcManual,this.persistColorOption("dc_manual",t.dcManual)),void 0!==t.dcSched&&t.dcSched!==this.dcSched&&(this.dcSched=t.dcSched,this.persistColorOption("dc_sched",t.dcSched)),void 0!==t.dcAuto&&t.dcAuto!==this.dcAuto&&(this.dcAuto=t.dcAuto,this.persistColorOption("dc_auto",t.dcAuto)),this._colorSynced=!0,this.cacheColors()),this.colorDraft=null},()=>this.colorDraft=null,"apply-bar")}`}}qt.styles=r`
    ${yt}
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
    .grid { display: grid; grid-template-columns: repeat(var(--sf-cols, 3), minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 8px; }
    .tile-val { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile {
      background: var(--secondary-background-color); border-radius: 12px; padding: 10px;
      min-width: 0; overflow: hidden; min-height: 138px; box-sizing: border-box;
      position: relative;
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
    .seg-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .seg {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      background: var(--secondary-background-color); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 12px;
      padding: 14px 8px; font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .seg ha-icon { --mdc-icon-size: 22px; }
    .seg.on { border-width: 2px; }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 10px;
      padding: 10px 12px; font-size: 14px;
    }
    .toggle-row.staged { box-shadow: inset 2px 0 0 var(--sf-accent, #ff9800); }
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
  `,t([ut({attribute:!1})],qt.prototype,"hass",void 0),t([ft()],qt.prototype,"config",void 0),t([ft()],qt.prototype,"tab",void 0),t([ft()],qt.prototype,"envSubView",void 0),t([ft()],qt.prototype,"planDraft",void 0),t([ft()],qt.prototype,"planEditStage",void 0),t([ft()],qt.prototype,"planShowAll",void 0),t([ft()],qt.prototype,"planDelArm",void 0),t([ft()],qt.prototype,"colorMode",void 0),t([ft()],qt.prototype,"colHi",void 0),t([ft()],qt.prototype,"colLo",void 0),t([ft()],qt.prototype,"colorModeIn",void 0),t([ft()],qt.prototype,"colIn",void 0),t([ft()],qt.prototype,"colWarn",void 0),t([ft()],qt.prototype,"colorSource",void 0),t([ft()],qt.prototype,"showTrend",void 0),t([ft()],qt.prototype,"showBand",void 0),t([ft()],qt.prototype,"showTargets",void 0),t([ft()],qt.prototype,"tileSummary",void 0),t([ft()],qt.prototype,"hour12",void 0),t([ft()],qt.prototype,"customOutletNames",void 0),t([ft()],qt.prototype,"outletNames",void 0),t([ft()],qt.prototype,"customLayout",void 0),t([ft()],qt.prototype,"cardScale",void 0),t([ft()],qt.prototype,"tileCols",void 0),t([ft()],qt.prototype,"paramOpen",void 0),t([ft()],qt.prototype,"_graphVer",void 0),t([ft()],qt.prototype,"hideLight2",void 0),t([ft()],qt.prototype,"outletColorMode",void 0),t([ft()],qt.prototype,"ocManual",void 0),t([ft()],qt.prototype,"ocSched",void 0),t([ft()],qt.prototype,"ocEnv",void 0),t([ft()],qt.prototype,"ocDrip",void 0),t([ft()],qt.prototype,"deviceColorMode",void 0),t([ft()],qt.prototype,"dcManual",void 0),t([ft()],qt.prototype,"dcSched",void 0),t([ft()],qt.prototype,"dcAuto",void 0),t([ft()],qt.prototype,"colorDraft",void 0),t([ft()],qt.prototype,"alertsDraft",void 0),t([ft()],qt.prototype,"soilOpen",void 0),t([ft()],qt.prototype,"soilAllOpen",void 0),t([ft()],qt.prototype,"deviceOpen",void 0),t([ft()],qt.prototype,"outletOpen",void 0),t([ft()],qt.prototype,"draft",void 0),t([ft()],qt.prototype,"modePick",void 0),t([ft()],qt.prototype,"outletDraft",void 0),t([ft()],qt.prototype,"outletNameDraft",void 0),t([ft()],qt.prototype,"outletCfgDraft",void 0),t([ft()],qt.prototype,"leafSpots",void 0),t([ft()],qt.prototype,"leafCalTarget",void 0),t([ft()],qt.prototype,"logDate",void 0),t([ft()],qt.prototype,"logDev",void 0),t([ft()],qt.prototype,"logType",void 0);class Kt extends dt{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,s={...this._config};e?s.panel=e:delete s.panel,this._emit(s)}_titleChanged(t){const e=t.target.value.trim(),s={...this._config};e?s.title=e:delete s.title,this._emit(s)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const s=e.target.checked,i=new Set(this._config.outlets??[]);s?i.add(t):i.delete(t);const o=[...i].sort(),a={...this._config};o.length?a.outlets=o:delete a.outlets,this._emit(a)}render(){if(!this.hass)return q;const t=this._config,e=t.default_tab,s=St(this.hass),i=Dt(this.hass,t.panel),o=t=>{const e=Ct(this.hass,t);return e?`${t} — ${e}`:t};return V`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${s.length?q:V`<option value="">(no devices found yet)</option>`}
            ${t.panel?q:V`<option value="" selected>— choose a device —</option>`}
            ${s.map(e=>V`<option value=${e} ?selected=${e===t.panel}>${o(e)}</option>`)}
            ${t.panel&&!s.includes(t.panel)?V`<option value=${t.panel} selected>${t.panel} (not found)</option>`:q}
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

        ${i.length?V`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${i.map(e=>V`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${o(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:q}
      </div>`}}Kt.styles=r`
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
  `,t([ut({attribute:!1})],Kt.prototype,"hass",void 0),t([ft()],Kt.prototype,"_config",void 0);const Jt=/^sf_(se\d+)_light$/;function Yt(t){const e=new Set;for(const s of Object.keys(t.states)){if(!s.startsWith("light."))continue;const t=bt(s).match(Jt);t&&e.add(t[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}class Zt extends dt{constructor(){super(...arguments),this.draft=null,this.ctlDraft={}}setConfig(t){this.config=t}getCardSize(){return 7}static getStubConfig(t){const e=t?Yt(t):[];return{type:"custom:spider-light-card",...e[0]?{light:e[0]}:{}}}accent(){return this.config.accent||mt}seSlot(){return this.config.light||(this.hass?Yt(this.hass)[0]:"")||"se1"}get(t){return this.hass?.states[t]}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("draft")||t.has("ctlDraft")}cur(t,e){return t in this.ctlDraft?this.ctlDraft[t]:e}stageCtl(t,e){this.ctlDraft={...this.ctlDraft,[t]:e}}isDirty(){return Object.keys(this.ctlDraft).length>0||null!==this.draft}applyAll(t){const e=this.ctlDraft,s=`light.sf_${t}_light`;if("bri"in e){const t=Number(e.bri);t>0?this.hass?.callService("light","turn_on",{entity_id:s,brightness_pct:t}):this.hass?.callService("light","turn_off",{entity_id:s})}"mode"in e&&this.hass?.callService("select","select_option",{entity_id:`select.sf_${t}_mode`,option:e.mode});for(const t of Object.keys(e))t.includes(".")&&(t.startsWith("number.")?this.hass?.callService("number","set_value",{entity_id:t,value:Number(e[t])}):t.startsWith("text.")&&this.hass?.callService("text","set_value",{entity_id:t,value:e[t]}));if("power"in e){const t="on"===e.power;t&&"bri"in e||this.hass?.callService("light",t?"turn_on":"turn_off",{entity_id:s})}this.draft&&this.saveSchedule(t),this.ctlDraft={}}discardAll(){Object.keys(this.ctlDraft).length&&(this.ctlDraft={}),null!==this.draft&&(this.draft=null)}render(){if(!this.hass||!this.config)return q;const t=this.seSlot(),e=this.get(`light.sf_${t}_light`);if(!e)return V`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light?` for "${this.config.light}"`:""}.
        </div>
      </ha-card>`;const s="on"===e.state,i=s?Math.max(0,Math.min(100,Math.round((e.attributes.brightness??0)/255*100))):0,o=this.get(`select.sf_${t}_mode`),a=this.cur("mode",o?.state??""),r="bri"in this.ctlDraft,n="on"===this.cur("power",s?"on":"off"),l=r?Number(this.ctlDraft.bri):n?i:0,d=r?l>0:n,c=Ct(this.hass,t),h=this.accent(),p=l/100,[u,f]=_t(100,100,78,135+270*p);return V`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Light"}</span>
          ${c?V`<span class="device">${c}</span>`:q}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${$t(100,100,78,0,1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${d&&p>0?W`<path d=${$t(100,100,78,0,p)} fill="none"
                  stroke-linecap="round" stroke=${h} stroke-width="15"></path>`:q}
            ${d?W`<circle cx=${u.toFixed(2)} cy=${f.toFixed(2)} r="10"
                  fill="#fff" stroke=${h} stroke-width="3"></circle>`:q}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${d?h:"var(--secondary-text-color)"}>
              ${d?l+"%":"Off"}
            </text>
          </svg>
          <button class="power ${n?"on":""}"
            style=${n?`background:${h}`:""}
            @click=${()=>this.stageCtl("power",n?"off":"on")}
            aria-label="Toggle light"></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(l)}
            style="accent-color:${h}" data-unit="%"
            @input=${xt}
            @change=${t=>this.stageCtl("bri",t.target.value)} />
          <span class="sl-bub"></span>
        </span>

        ${o?V`<div class="modes">
              ${(o.attributes.options??["Manual","Automatic"]).map(t=>V`<button
                  class="mode ${a===t?"active":""}"
                  style=${a===t?`color:${h};border-color:${h}`:""}
                  @click=${()=>this.stageCtl("mode",t)}>${t}</button>`)}
            </div>`:q}

        ${"Automatic"===a?this.renderSchedule(t):q}
        ${jt(h,this.isDirty(),()=>this.applyAll(t),()=>this.discardAll(),"apply-bar")}
      </ha-card>`}periodsFor(t){if(this.draft)return this.draft;const e=this.get(`sensor.sf_${t}_schedule`)?.attributes.periods;return Array.isArray(e)?e:[]}edit(t,e){const s=this.draft??this.periodsFor(t),i=JSON.parse(JSON.stringify(s));e(i),this.draft=i}saveSchedule(t){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${t}_light`,periods:this.draft}),this.draft=null)}renderSchedule(t){if(!this.get(`sensor.sf_${t}_schedule`))return this.renderScheduleLegacy(t);const e=this.periodsFor(t),s=this.accent();return V`
      <div class="section-label">Schedule</div>
      ${e.map((e,i)=>this.renderPeriod(t,e,i,s))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(t,t=>t.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          + Add period
        </button>
      </div>`}renderPeriod(t,e,s,i){return V`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${s+1}</span>
          <button class="del" aria-label="Delete period"
            @click=${()=>this.edit(t,t=>t.splice(s,1))}>✕</button>
        </div>
        <div class="days">
          ${gt.map((o,a)=>V`<button
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
      </div>`}renderScheduleLegacy(t){const e=this.get(`text.sf_${t}_schedule_start`),s=this.get(`text.sf_${t}_schedule_stop`),i=this.get(`number.sf_${t}_schedule_brightness`),o=this.get(`number.sf_${t}_sunrise_sunset_fade`);return e||s||i||o?V`
      <div class="section-label">Schedule</div>
      ${e||s?V`<div class="sched-times">
            ${this.timeField(`text.sf_${t}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${t}_schedule_stop`,"Stop")}
          </div>`:q}
      ${i?this.numRow(`number.sf_${t}_schedule_brightness`,"Brightness",i):q}
      ${o?this.numRow(`number.sf_${t}_sunrise_sunset_fade`,"Sunrise / sunset fade",o):q}`:q}timeField(t,e){const s=this.get(t);if(!s)return q;const i="unknown"===s.state||"unavailable"===s.state?"":s.state,o=this.cur(t,i);return V`<div class="tf">
      <span class="tf-lbl">${e}</span>
      <input type="time" .value=${o}
        @change=${e=>this.stageCtl(t,e.target.value)} />
    </div>`}numRow(t,e,s){const i=s.attributes.min??0,o=s.attributes.max??100,a=s.attributes.step??1,r=s.attributes.unit_of_measurement??"",n="unknown"===s.state||"unavailable"===s.state?"":s.state,l=this.cur(t,n);return V`<div class="num-row">
      <span class="nr-lbl">${e}</span>
      <span class="sl-live">
        <input type="range" min=${i} max=${o} step=${a} .value=${String(l)}
          style="accent-color:${this.accent()}" data-unit=${r}
          @input=${xt}
          @change=${e=>this.stageCtl(t,e.target.value)} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${l}${r}</span>
    </div>`}}Zt.styles=r`
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
  `,t([ut({attribute:!1})],Zt.prototype,"hass",void 0),t([ft()],Zt.prototype,"config",void 0),t([ft()],Zt.prototype,"draft",void 0),t([ft()],Zt.prototype,"ctlDraft",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",qt),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Kt),customElements.get("spider-light-card")||customElements.define("spider-light-card",Zt),window.customCards=window.customCards||[],window.customCards.push({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),window.customCards.push({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.20.50 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const t=["spider-farmer-card","spider-light-card"],e=new Set([...t,...t.map(t=>`custom:${t}`)]),s=()=>{const t=[["spider-farmer-card",qt],["spider-farmer-card-editor",Kt],["spider-light-card",Zt]];for(const[e,s]of t)if(!customElements.get(e))try{customElements.define(e,s)}catch{}},i=()=>{let t=0;for(const s of(()=>{const t=[],e=new Set,s=i=>{if(!i||e.has(i))return;e.add(i);let o=[];try{o=i.querySelectorAll("hui-error-card")}catch{return}o.forEach(e=>t.push(e));let a=[];try{a=i.querySelectorAll("*")}catch{return}a.forEach(t=>{const e=t.shadowRoot;e&&s(e)})};return s(document),t})()){const i=s._config||{},o=i.origConfig&&i.origConfig.type||i.type||"";e.has(o)&&(s.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),t++)}return t};let o=0;const a=()=>{s(),i(),++o<12&&setTimeout(a,250)},r=()=>{s(),a()};"complete"===document.readyState?r():window.addEventListener("load",r,{once:!0})})();export{qt as SpiderFarmerCard,Kt as SpiderFarmerCardEditor,Zt as SpiderLightCard};
