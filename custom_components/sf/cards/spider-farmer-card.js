/*! spider-farmer-card v0.17.13 | MIT */
function t(t,e,s,i){var r,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,s,i);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(a=(o<3?r(a):o>3?r(e,s,a):r(e,s))||a);return o>3&&a&&Object.defineProperty(e,s,a),a}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)},n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,m=g?g.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},_=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:_};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const o=this.constructor;if(!1===i&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??_)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[b("elementProperties")]=new Map,y[b("finalized")]=new Map,v?.({ReactiveElement:y}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,O="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+R,E=`<${C}>`,M=document,N=()=>M.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,T="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,F=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,H=/"/g,L=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),I=W(1),V=W(2),G=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,J=M.createTreeWalker(M,129);function Z(t,e){if(!D(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",a=z;for(let e=0;e<s;e++){const s=t[e];let n,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===z?"!--"===l[1]?a=B:void 0!==l[1]?a=F:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=j):void 0!==l[3]&&(a=j):a===j?">"===l[0]?(a=r??z,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?j:'"'===l[3]?H:U):a===H||a===U?a=j:a===B||a===F?a=z:(a=j,r=void 0);const p=a===j&&t[e+1].startsWith("/>")?" ":"";o+=a===z?s+E:c>=0?(i.push(n),s.slice(0,c)+O+s.slice(c)+R+p):s+R+(-2===c?e:p)}return[Z(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const a=t.length-1,n=this.parts,[l,c]=X(t,e);if(this.el=Y.createElement(l,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(O)){const e=c[o++],s=i.getAttribute(t).split(R),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:a[2],strings:s,ctor:"."===a[1]?it:"?"===a[1]?rt:"@"===a[1]?ot:st}),i.removeAttribute(t)}else t.startsWith(R)&&(n.push({type:6,index:r}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(R),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],N()),J.nextNode(),n.push({type:2,index:++r});i.append(t[e],N())}}}else if(8===i.nodeType)if(i.data===C)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(R,t+1));)n.push({type:7,index:r}),t+=R.length-1}r++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===G)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=P(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);J.currentNode=i;let r=J.nextNode(),o=0,a=0,n=s[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new et(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new at(r,this,t)),this._$AV.push(e),n=s[++a]}o!==n?.index&&(r=J.nextNode(),o++)}return J.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),P(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>D(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new Y(t)),e}k(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new et(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const i=t;let a,n;for(t=r[0],a=0;a<r.length-1;a++)n=Q(this,i[s+a],e,a),n===G&&(n=this._$AH[a]),o||=!P(n)||n!==this._$AH[a],n===q?t=q:t!==q&&(t+=(n??"")+r[a+1]),this._$AH[a]=n}o&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class rt extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends st{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===G)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(Y,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new et(e.insertBefore(N(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:_},ht=(t=pt,e,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,s)=>"object"==typeof s?ht(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ft(t){return ut({...t,state:!0,attribute:!1})}const gt="#ff7a1a",mt=["S","M","T","W","T","F","S"],vt=/^sf_(dp\d+|ac5|ac10)_/;function bt(t){return t.split(".")[1]??""}function $t(t,e,s,i){const r=i*Math.PI/180;return[t+s*Math.cos(r),e+s*Math.sin(r)]}function _t(t,e,s,i,r){const o=135+270*i,a=135+270*r,[n,l]=$t(t,e,s,o),[c,d]=$t(t,e,s,a),p=a-o>180?1:0;return`M ${n.toFixed(2)} ${l.toFixed(2)} A ${s} ${s} 0 ${p} 1 ${c.toFixed(2)} ${d.toFixed(2)}`}function xt(t){const e=String(t),s=e.indexOf(".");return s>=0?e.length-s-1:0}function yt(t){const e=t.currentTarget,s=e.parentElement?.querySelector(".sl-bub");if(!s)return;const i=Number(e.min||"0"),r=Number(e.max||"100"),o=Number(e.value),a=r>i?(o-i)/(r-i):0,n=xt(Number(e.step||"1")),l=Number.isFinite(o)?o.toFixed(n):e.value;s.textContent="1"===e.dataset.off&&o<=i?"off":`${l}${e.dataset.unit??""}`,s.style.left=`calc(${a} * (100% - 18px) + 9px)`}const wt=a`
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
`;function St(t){const e=new Set;for(const s of Object.keys(t.states)){const t=bt(s).match(vt);t&&e.add(t[1])}return[...e].sort()}function kt(t){return St(t).filter(e=>Object.keys(t.states).some(t=>{const s=bt(t);return s===`sf_${e}_temperature`||s===`sf_${e}_soil_avg_temperature`||s===`sf_${e}_light_1`||s===`sf_${e}_fan`||s===`sf_${e}_blower`}))}function At(t,e){const s=`sf_${e}_`,i=Object.keys(t.states);return i.find(t=>bt(t)===`sf_${e}_temperature`)??i.find(t=>{const i=bt(t);return i.startsWith(s)&&!i.startsWith(`sf_${e}_env_`)})}function Ot(t,e){const s=At(t,e);return s?t.entities?.[s]?.device_id:void 0}function Rt(t,e){if(!e)return[];const s=Ot(t,e);return function(t){return St(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}(t).filter(i=>{if(i===e)return!0;if(!s)return!1;const r=Ot(t,i),o=r?t.devices?.[r]:void 0;return o?.via_device_id===s})}function Ct(t,e){if(!t||!e)return"";const s=At(t,e);if(!s)return"";const i=t.entities?.[s]?.device_id,r=i?t.devices?.[i]:void 0;if(r)return r.name_by_user||r.name||"";const o=(t.states[s].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return o?o[1]:""}const Et=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","VPD","mdi:water-opacity"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Mt={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},Nt="#ff6b6b",Pt="#45b6ff",Dt="rgba(255,107,107,0.16)",Tt=t=>!!t&&("unavailable"===t.state||"unknown"===t.state),zt=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],Bt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],Ft=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],jt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class Ut extends ct{constructor(){super(...arguments),this.tab="overview",this.colorMode="off",this.alertsDraft=null,this.soilOpen=null,this.soilAllOpen=!1,this.deviceOpen=null,this.draft={},this.modePick={},this.outletDraft={},this.logDate=null,this.logDev="all",this.logType="all"}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"calibration"===e||"cali"===e?"cali":"alerts"===e?"alerts":"log"===e?"log":"overview";const s=t.alarm_colors;let i="tile"===s||"text"===s?s:"off";try{const e=localStorage.getItem(`sf-colors-${t.panel}`);"off"!==e&&"tile"!==e&&"text"!==e||(i=e)}catch{}this.colorMode=i}setColorMode(t){this.colorMode=t;try{localStorage.setItem(`sf-colors-${this.config.panel}`,t)}catch{}}alarmStatus(t,e){if("off"===this.colorMode)return null;const s=Mt[t];if(!s)return null;const i=this.alertsSettings();if(!i)return null;const r=[...i.climate||[],...i.substrate||[]].find(t=>t&&t.key===s);if(!r||!r.enabled)return null;const o=parseFloat(e);if(!Number.isFinite(o))return null;const a=Number(r.max),n=Number(r.min);return Number.isFinite(a)&&o>a?"above":Number.isFinite(n)&&o<n?"below":null}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?kt(t):[])[0]||"dp1",s=t?Rt(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...s.length?{outlets:s}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||gt}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")||t.has("outletDraft")||t.has("alertsDraft")||t.has("deviceOpen")||t.has("draft")||t.has("modePick")||t.has("logDate")||t.has("logDev")||t.has("logType")||t.has("colorMode")}willUpdate(t){if(t.has("hass")&&Object.keys(this.modePick).length){let t=null;for(const[e,s]of Object.entries(this.modePick))this.get(e)?.state===s&&(t=t??{...this.modePick},delete t[e]);t&&(this.modePick=t)}}renderParam([t,e,s]){const i=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!i)return q;const r=i.attributes.unit_of_measurement||"",o=t.startsWith("soil_avg_")&&Tt(i),a=o?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(r,"").trim():i.state,n=t.startsWith("soil_avg_")?t.slice(9):null,l=!!n&&this.soilProbeRows(n).length>1,c=l&&this.soilOpen===n,d=this.alarmStatus(t,i.state),p="above"===d?Nt:"below"===d?Pt:"";let h=c?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",u="";if(o)h=`background:${Dt};box-shadow:inset 0 0 0 1px ${Nt}`,u=`color:${Nt}`;else if(d&&"text"===this.colorMode)u=`color:${p}`;else if(d&&"tile"===this.colorMode){h=`background:${"above"===d?Dt:"rgba(69,182,255,0.16)"};box-shadow:inset 0 0 0 1px ${p}`}return I`
      <div class="tile ${l?"clickable":""} ${c?"active":""}"
        style=${h||q}
        role=${l?"button":q}
        @click=${l?()=>this.soilOpen=c?null:n:void 0}>
        <div class="tile-label">
          ${e}${l?I`<ha-icon class="tile-more"
                icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:q}
        </div>
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${u||q}>${a}${o?q:I`<span class="unit">${r}</span>`}</div>
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),s=[];for(const i of Object.keys(this.hass?.states??{})){const r=bt(i).match(e);r&&s.push({slot:r[1],name:this.soilSensorName(i,t),e:this.hass.states[i]})}return s.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),s.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let s=this.hass?.states[t]?.attributes.friendly_name??"";const i=Ct(this.hass,this.config.panel);i&&s.startsWith(i)&&(s=s.slice(i.length).trim());const r="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return s=s.replace(new RegExp(`\\s*${r}\\s*$`,"i"),"").trim(),s||bt(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return q;const e=this.soilProbeRows(t);if(!e.length)return q;return I`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:t,e:e})=>{const s=Tt(e),i=e.attributes.unit_of_measurement||"",r=this.hass?.formatEntityState?this.hass.formatEntityState(e).replace(i,"").trim():e.state;return I`
            <div class="soil-pop-row ${s?"offline":""}">
              <span class="spn">${t}</span>
              <span class="spv">${s?I`Offline`:I`${r}<span class="unit">${i}</span>`}</span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}probeOffline(t){const e=this.get(`sensor.sf_${this.config.panel}_${t}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${t}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${t}_ec`);return Tt(e)}soilCellValue(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return s&&"unknown"!==s.state&&"unavailable"!==s.state?this.hass?.formatEntityState?this.hass.formatEntityState(s):`${s.state}${s.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const s=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[s])return this.soilSensorName(s,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const t=this.soilProbeSlots();if(t.length<2)return q;const e=this.soilAllOpen,s=this.accent(),i=t.filter(t=>this.probeOffline(t)).length,r=i?`background:${Dt};box-shadow:inset 0 0 0 1px ${Nt}`:e?`box-shadow:inset 0 0 0 1px ${s}`:"",o=i?`${i} offline`:`${t.length} probes`;return I`
      <div class="tile clickable ${e?"active":""}" style=${r||q}
        role="button" aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${i?Nt:s}"></ha-icon>
        <div class="tile-val" style=${i?`color:${Nt}`:q}>${o}</div>
      </div>`}renderSoilAllTable(){const t=this.soilProbeSlots();return t.length<2||!this.soilAllOpen?q:I`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">Probe</span>
          <span class="sa-v">Temp</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${t.map(t=>I`
            <div class="soil-all-row ${this.probeOffline(t)?"offline":""}">
              <span class="sa-name">${this.probeNameForSlot(t)}</span>
              <span class="sa-v">${this.soilCellValue(t,"temperature")}</span>
              <span class="sa-v">${this.soilCellValue(t,"moisture")}</span>
              <span class="sa-v">${this.soilCellValue(t,"ec")}</span>
            </div>`)}
      </div>`}overviewDevices(){const t=[],e=(e,s)=>{for(const[i,r,o]of s){const s=this.eid(e,i);this.get(s)&&t.push({domain:e,suffix:i,id:s,label:r,icon:o})}};return e("light",zt),e("fan",Bt),e("switch",Ft),t}deviceStateText(t,e){if("unavailable"===e.state||"unknown"===e.state)return"Offline";if("light"===t)return"on"!==e.state?"Off":`${Math.round((e.attributes.brightness??0)/255*100)}%`;if("fan"===t){if("on"!==e.state)return"Off";const t=Math.round(e.attributes.percentage??0);return t?`${t}%`:"On"}return"on"===e.state?"On":"Off"}deviceFault(t){const e=this.config.panel,s=t=>this.get(`sensor.sf_${e}_${t}`)?.state;return"humidifier"===t&&"Empty"===s("humidifier_tank")?"TANK EMPTY":"dehumidifier"===t&&"Full"===s("dehumidifier_tank")?"TANK FULL":"heater"===t&&"Alarm"===s("heater_status")?"Alarm":null}deviceTile(t){const e=this.get(t.id);if(!e)return q;const s="on"===e.state,i=`${t.domain}:${t.suffix}`,r=this.deviceOpen===i,o=this.accent(),a=this.deviceFault(t.suffix),n=a?Nt:s?o:"var(--secondary-text-color)";return I`
      <div class="tile clickable ${r?"active":""}"
        style=${(a?`background:${Dt};box-shadow:inset 0 0 0 1px ${Nt}`:r?`box-shadow:inset 0 0 0 1px ${o}`:"")||q}
        role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>this.toggleDevice(r?null:i)}>
        <div class="tile-label">${t.label}
          <ha-icon class="tile-more"
            icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon=${t.icon} style="color:${n}"></ha-icon>
        <div class="tile-val" style=${a?`color:${Nt}`:s?`color:${o}`:""}>
          ${a??this.deviceStateText(t.domain,e)}
        </div>
      </div>`}relatedControls(t,e){const s=this.config.panel,i=new RegExp(`^(number|select|switch|text)\\.sf_${s}_${t}(_|$)`),r=`switch.sf_${s}_${t}`,o=`number.sf_${s}_${t}_speed`,a=Ct(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(t=>i.test(t)&&t!==r&&!("fan"===e&&t===o)).sort().map(t=>{let e=this.hass?.states[t]?.attributes.friendly_name??"";return a&&e.startsWith(a)&&(e=e.slice(a.length).trim()),this.ctlRow(e||t,t)})}renderDevicePop(){const t=this.deviceOpen;if(!t)return q;const e=this.overviewDevices().find(e=>`${e.domain}:${e.suffix}`===t);if(!e)return q;const s=this.get(e.id);if(!s)return q;const i="light"===e.domain?this.renderLightBody(e,s):"fan"===e.suffix?this.renderFanBody(e,s):"blower"===e.suffix?this.renderBlowerBody(e,s):"heater"===e.suffix?this.renderHeaterBody(e,s):"dehumidifier"===e.suffix?this.renderDehumidifierBody(e,s):"humidifier"===e.suffix?this.renderHumidifierBody(e,s):this.renderGenericBody(e,s);return I`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${e.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${i}
      </div>`}powerRow(t,e,s,i){const r=this.accent();return I`
      <div class="dev-row">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${i?"on":""}"
          style=${i?`background:${r}`:""}
          @click=${()=>this.hass?.callService(e,"toggle",{entity_id:t})}
          aria-label="Toggle ${s}"></button>
      </div>`}renderGenericBody(t,e){const s="on"===e.state,i=this.accent(),r="fan"===t.domain?"fan":"switch";let o=q;if("fan"===t.domain){const r=Math.round(e.attributes.percentage??0);o=I`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(s?r:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${s?r+"%":"off"}</span>
        </div>`}return I`${this.powerRow(t.id,r,t.label,s)}${o}${this.relatedControls(t.suffix,t.domain)}`}renderHeaterBody(t,e){const s=this.config.panel,i="on"===e.state,r=`select.sf_${s}_heater_mode_set`,o=this.get(r),a=this.modeOf(r),n=`number.sf_${s}_heater_level`,l=`text.sf_${s}_heater_apply`,c=this.numOpts(1,10,1,t=>`L${t}`),d=[];if(o&&d.push(this.liveModeRow("Mode",r)),d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===a)d.push(this.optSelectRow("Gear",n,c,!0));else if("Time Slot"===a){const t=`text.sf_${s}_heater_schedule_start`,e=`text.sf_${s}_heater_schedule_stop`,i={[r]:"mode",[t]:"schedule_start",[e]:"schedule_end",[n]:"gear"};d.push(this.stagedPeriodRow(t,e,"Schedule")),d.push(this.optSelectRow("Gear",n,c)),d.push(this.saveBar(l,i))}else if("Cycle"===a){const t=`text.sf_${s}_heater_cycle_start`,e=`text.sf_${s}_heater_cycle_run`,i=`text.sf_${s}_heater_cycle_off`,o=`number.sf_${s}_heater_cycle_times`,a={[r]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[o]:"cycle_times",[n]:"gear"};d.push(this.stagedRow("Start Time",t,"time")),d.push(this.stagedRow("Run Time",e,"duration")),d.push(this.stagedRow("Closing Time",i,"duration")),d.push(this.stagedRangeRow("Execution Times",o)),d.push(this.optSelectRow("Gear",n,c)),d.push(this.saveBar(l,a))}else if("Temperature"===a){const t={[r]:"mode",[n]:"gear"};d.push(this.optSelectRow("Gear",n,c)),d.push(this.infoRow("Runs on the tent's day/night temperature targets","")),d.push(this.saveBar(l,t))}return d}renderDehumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,r=`select.sf_${s}_dehumidifier_mode_set`,o=this.get(r),a=this.modeOf(r),n=`select.sf_${s}_dehumidifier_level`,l=`text.sf_${s}_dehumidifier_apply`,c=[];if(o&&c.push(this.liveModeRow("Mode",r)),c.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===a)c.push(this.ctlRow("Wind Speed",n));else if("Time Slot"===a){const t=`text.sf_${s}_dehumidifier_schedule_start`,e=`text.sf_${s}_dehumidifier_schedule_stop`,i={[r]:"mode",[t]:"schedule_start",[e]:"schedule_end",[n]:"wind"};c.push(this.stagedPeriodRow(t,e,"Schedule")),c.push(this.stagedRow("Wind Speed",n)),c.push(this.saveBar(l,i))}else if("Cycle"===a){const t=`text.sf_${s}_dehumidifier_cycle_start`,e=`text.sf_${s}_dehumidifier_cycle_run`,i=`text.sf_${s}_dehumidifier_cycle_off`,o=`number.sf_${s}_dehumidifier_cycle_times`,a={[r]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[o]:"cycle_times",[n]:"wind"};c.push(this.stagedRow("Start Time",t,"time")),c.push(this.stagedRow("Run Time",e,"duration")),c.push(this.stagedRow("Closing Time",i,"duration")),c.push(this.stagedRangeRow("Execution Times",o)),c.push(this.stagedRow("Wind Speed",n)),c.push(this.saveBar(l,a))}else if("Humidity"===a){const t={[r]:"mode",[n]:"wind"};c.push(this.stagedRow("Wind Speed",n)),c.push(this.infoRow("Runs on the tent's day/night humidity targets","")),c.push(this.saveBar(l,t))}return c}renderHumidifierBody(t,e){const s=this.config.panel,i="on"===e.state,r=`select.sf_${s}_humidifier_mode_set`,o=this.get(r),a=this.modeOf(r),n=`number.sf_${s}_humidifier_level`,l=`text.sf_${s}_humidifier_apply`,c=this.numOpts(1,4,1,t=>`L${t}`),d=[];if(o&&d.push(this.liveModeRow("Mode",r)),d.push(this.powerRow(t.id,"switch",t.label,i)),"Manual"===a)d.push(this.optSelectRow("Gear",n,c,!0));else if("Time Slot"===a){const t=`text.sf_${s}_humidifier_schedule_start`,e=`text.sf_${s}_humidifier_schedule_stop`,i={[r]:"mode",[t]:"schedule_start",[e]:"schedule_end",[n]:"gear"};d.push(this.stagedPeriodRow(t,e,"Schedule")),d.push(this.optSelectRow("Gear",n,c)),d.push(this.saveBar(l,i))}else if("Cycle"===a){const t=`text.sf_${s}_humidifier_cycle_start`,e=`text.sf_${s}_humidifier_cycle_run`,i=`text.sf_${s}_humidifier_cycle_off`,o=`number.sf_${s}_humidifier_cycle_times`,a={[r]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[o]:"cycle_times",[n]:"gear"};d.push(this.stagedRow("Start Time",t,"time")),d.push(this.stagedRow("Run Time",e,"duration")),d.push(this.stagedRow("Closing Time",i,"duration")),d.push(this.stagedRangeRow("Execution Times",o)),d.push(this.optSelectRow("Gear",n,c)),d.push(this.saveBar(l,a))}else if("Humidity"===a){const t={[r]:"mode",[n]:"gear"};d.push(this.optSelectRow("Gear",n,c)),d.push(this.infoRow("Runs on the tent's day/night humidity targets","")),d.push(this.saveBar(l,t))}return d}textState(t){const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}durMinutes(t,e){const s=t=>{const e=/^(\d{1,2}):(\d{2})/.exec(t);return e?60*Number(e[1])+Number(e[2]):null},i=s(this.textState(t)),r=s(this.textState(e));if(null==i||null==r)return null;let o=(r-i+1440)%1440;return 0===o&&(o=1440),o}durationText(t,e){const s=this.durMinutes(t,e);return null==s?null:`${Math.floor(s/60)}h ${String(s%60).padStart(2,"0")}min`}infoRow(t,e){return I`<div class="dev-row">
      <span class="dev-lbl">${t}</span><span class="dev-spacer"></span>
      <span class="dev-val">${e}</span>
    </div>`}ctlRow(t,e){const s=this.get(e);if(!s)return q;const i=e.split(".")[0];let r;return r="number"===i?this.numberControl(e,s):"select"===i?this.selectControl(e,s):"text"===i?this.textControl(e,s):"switch"===i?this.switchControl(e,s):I`<span class="ctl-val">${s.state}</span>`,I`<div class="dev-row">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${r}</div>
    </div>`}renderLightBody(t,e){const s=this.config.panel,i=t.suffix,r=this.accent(),o="on"===e.state,a=`select.sf_${s}_${i}_mode`,n=this.get(a),l=this.modeOf(a),c=this.get(`sensor.sf_${s}_${i}_brightness`),d=this.get(`sensor.sf_${s}_ppfd`),p=c&&Number.isFinite(Number(c.state))?`${Math.round(Number(c.state))}%`:"—",h=d&&Number.isFinite(Number(d.state))?`${Math.round(Number(d.state))} µmol`:"—",u=`text.sf_${s}_${i}_apply`,f=`number.sf_${s}_${i}_go_dark`,g=`number.sf_${s}_${i}_turn_off`,m=[];if(n&&m.push(this.liveModeRow("Mode",a)),m.push(this.powerRow(t.id,"light",t.label,o)),"Manual"===l){const s=Math.round((e.attributes.brightness??0)/255*100);m.push(I`
        <div class="dev-row">
          <span class="dev-lbl">Brightness</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${o?String(s):"0"}
              style="accent-color:${r}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setBrightness(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${o?s+"%":"off"}</span>
        </div>`),m.push(this.infoRow("Current PPFD",h))}else if("Time Slot"===l){const t=`text.sf_${s}_${i}_schedule_start`,e=`text.sf_${s}_${i}_schedule_stop`,r=`number.sf_${s}_${i}_schedule_brightness`,o=`number.sf_${s}_${i}_fade`,n={[a]:"mode",[t]:"schedule_start",[e]:"schedule_end",[r]:"schedule_brightness",[o]:"fade_minutes",[f]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${p} · ${h}`));const l=this.durationText(t,e);l&&m.push(this.infoRow("Light duration",l)),m.push(this.stagedPeriodRow(t,e,"Lighting period")),m.push(this.optSelectRow("Target Brightness",r,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",o,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",f,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.optSelectRow("Turn off",g,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.saveBar(u,n))}else if("PPFD"===l){const t=`text.sf_${s}_${i}_ppfd_start`,e=`text.sf_${s}_${i}_ppfd_stop`,r=`number.sf_${s}_${i}_ppfd_target`,o=`number.sf_${s}_${i}_ppfd_fade`,n=`number.sf_${s}_${i}_ppfd_min`,l=`number.sf_${s}_${i}_ppfd_max`,c={[a]:"mode",[t]:"ppfd_start",[e]:"ppfd_end",[r]:"ppfd_target",[o]:"ppfd_fade_minutes",[n]:"ppfd_min",[l]:"ppfd_max",[f]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${p} · ${h}`));const d=this.durationText(t,e),v=this.durMinutes(t,e),b=Number(this.get(r)?.state);if(d&&null!=v&&Number.isFinite(b)){const t=b*v*60/1e6;m.push(this.infoRow("DLI · duration",`${t.toFixed(2)} mol/m²/day · ${d}`))}else d&&m.push(this.infoRow("Light duration",d));m.push(this.stagedPeriodRow(t,e,"Lighting period")),m.push(I`<div class="dev-row ${r in this.draft?"staged":""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(r,this.numOpts(20,2e3,10,t=>`${t} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",n,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Dimming Range Max",l,this.numOpts(11,100,1,t=>`${t}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",o,this.offOpts(1,60,1,t=>`${t} min`))),m.push(this.optSelectRow("Go dark",f,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.optSelectRow("Turn off",g,this.offOpts(59,122,1,t=>`${t}°F`))),m.push(this.saveBar(u,c))}return m}renderFanBody(t,e){const s=this.config.panel,i=this.accent(),r="on"===e.state,o=`select.sf_${s}_fan_mode_set`,a=this.get(o),n=this.modeOf(o),l=`number.sf_${s}_fan_oscillation`,c=`number.sf_${s}_fan_schedule_gear`,d=`number.sf_${s}_fan_standby_speed`,p=`switch.sf_${s}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",c,this.numOpts(1,10,1,t=>`L${t}`)),u=Math.max(1,Math.round(Number(this.draftVal(c))||1)),f=()=>this.optSelectRow("Standby Speed",d,this.offOpts(1,u-1)),g=()=>this.optSelectRow("Oscillation",l,this.offOpts(1,10),!0),m=`text.sf_${s}_fan_apply`,v=[];if(a&&v.push(this.liveModeRow("Mode",o)),v.push(this.powerRow(t.id,"fan",t.label,r)),"Manual"===n){const s=Math.round(e.attributes.percentage??0);v.push(I`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(r?s:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${r?s+"%":"off"}</span>
        </div>`)}else if("Time Slot"===n){const t={[o]:"mode",[`text.sf_${s}_fan_schedule_start`]:"schedule_start",[`text.sf_${s}_fan_schedule_stop`]:"schedule_end",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${s}_fan_schedule_start`,`text.sf_${s}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,t))}else if("Cycle"===n){const t=`text.sf_${s}_fan_cycle_start`,e=`text.sf_${s}_fan_cycle_run`,i=`text.sf_${s}_fan_cycle_off`,r=`number.sf_${s}_fan_cycle_times`,a={[o]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[r]:"cycle_times",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Start Time",t,"time")),v.push(this.stagedRow("Run Duration",e,"duration")),v.push(this.stagedRow("Off Duration",i,"duration")),v.push(this.stagedRangeRow("Execution Times",r)),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,a))}else if("Environment"===n){const t=`select.sf_${s}_fan_run_mode`,e={[o]:"mode",[t]:"env_submode",[c]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Run Mode",t)),v.push(h()),v.push(f()),v.push(g()),v.push(this.ctlRow("Natural Wind",p)),v.push(this.saveBar(m,e))}return v}renderBlowerBody(t,e){const s=this.config.panel,i=this.accent(),r="on"===e.state,o=`select.sf_${s}_blower_mode_set`,a=this.get(o),n=this.modeOf(o),l=`number.sf_${s}_blower_running_speed`,c=`number.sf_${s}_blower_standby_speed`,d=`switch.sf_${s}_blower_close_co2`,p=`text.sf_${s}_blower_apply`,h=()=>this.optSelectRow("Running Speed",l,this.numOpts(25,100,1,t=>`${t}%`)),u=Math.max(25,Math.round(Number(this.draftVal(l))||25)),f=()=>this.optSelectRow("Standby Speed",c,this.offOpts(25,u-1)),g=[];if(a&&g.push(this.liveModeRow("Mode",o)),g.push(this.powerRow(t.id,"fan",t.label,r)),"Manual"===n){const s=Math.round(e.attributes.percentage??0);g.push(I`
        <div class="dev-row">
          <span class="dev-lbl">Speed</span>
          <span class="sl-live">
            <input type="range" min="0" max="100" .value=${String(r?s:0)}
              style="accent-color:${i}" data-unit="%"
              @input=${yt}
              @change=${e=>this.setPercent(t.id,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="dev-val">${r?s+"%":"off"}</span>
        </div>`),g.push(this.ctlRow("Close CO2 Device",d))}else if("Time Slot"===n){const t={[o]:"mode",[`text.sf_${s}_blower_schedule_start`]:"schedule_start",[`text.sf_${s}_blower_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedPeriodRow(`text.sf_${s}_blower_schedule_start`,`text.sf_${s}_blower_schedule_stop`,"Schedule")),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,t))}else if("Cycle"===n){const t=`text.sf_${s}_blower_cycle_start`,e=`text.sf_${s}_blower_cycle_run`,i=`text.sf_${s}_blower_cycle_off`,r=`number.sf_${s}_blower_cycle_times`,a={[o]:"mode",[t]:"cycle_start",[e]:"cycle_run",[i]:"cycle_off",[r]:"cycle_times",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedRow("Start Time",t,"time")),g.push(this.stagedRow("Run Duration",e,"duration")),g.push(this.stagedRow("Off Duration",i,"duration")),g.push(this.stagedRangeRow("Execution Times",r)),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,a))}else if("Environment"===n){const t=`select.sf_${s}_blower_run_mode`,e={[o]:"mode",[t]:"env_submode",[l]:"schedule_speed",[c]:"standby_speed"};g.push(this.stagedRow("Run Mode",t)),g.push(h()),g.push(f()),g.push(this.ctlRow("Close CO2 Device",d)),g.push(this.saveBar(p,e))}return g}setBrightness(t,e){const s=Number(e.target.value);s<=0?this.hass?.callService("light","turn_off",{entity_id:t}):this.hass?.callService("light","turn_on",{entity_id:t,brightness_pct:s})}setPercent(t,e){const s=Number(e.target.value);this.hass?.callService("fan","set_percentage",{entity_id:t,percentage:s})}renderOverview(){const t=Et.map(t=>this.renderParam(t)).filter(t=>t!==q),e=this.soilStatsTile(),s=this.overviewDevices();return I`
      ${t.length||e!==q?I`<div class="section-label">Parameters</div>
            <div class="grid">${t}${e}</div>
            ${this.renderSoilPop()}
            ${this.renderSoilAllTable()}`:q}
      ${s.length?I`<div class="section-label">Devices</div>
            <div class="grid">${s.map(t=>this.deviceTile(t))}</div>
            ${this.renderDevicePop()}`:q}`}renderControl(t,e){const s=this.get(t);if(!s)return q;const i=t.split(".")[0],r=e??s.attributes.friendly_name??t.split(".")[1];let o;return o="number"===i?this.numberControl(t,s):"select"===i?this.selectControl(t,s):"text"===i?this.textControl(t,s):"switch"===i?this.switchControl(t,s):I`<span class="ctl-val">${s.state}</span>`,I`
      <div class="ctl">
        <div class="ctl-label">${r}</div>
        <div class="ctl-input">${o}</div>
      </div>`}numberControl(t,e){const s=e.attributes.min??0,i=e.attributes.max??100,r=e.attributes.step??1,o=e.attributes.unit_of_measurement??"",a="slider"===e.attributes.mode,n=function(t,e){return""===t||"unknown"===t||"unavailable"===t?"":Number.isFinite(Number(t))?Number(t).toFixed(xt(e)):t}(e.state,r);return a?I`
        <div class="slider-wrap">
          <span class="sl-live">
            <input type="range" min=${s} max=${i} step=${r}
              .value=${n} style="accent-color:${this.accent()}" data-unit=${o}
              @input=${yt}
              @change=${e=>this.setNumber(t,e)} />
            <span class="sl-bub"></span>
          </span>
          <span class="slider-val" style="color:${this.accent()}">${n}${o}</span>
        </div>`:I`
      <span class="num-box">
        <input type="number" min=${s} max=${i} step=${r}
          .value=${n} @change=${e=>this.setNumber(t,e)} />
        <span class="unit">${o}</span>
      </span>`}selectControl(t,e){const s=e.attributes.options??[];return I`
      <select .value=${e.state} @change=${e=>this.setSelect(t,e)}>
        ${s.map(t=>I`<option value=${t} ?selected=${t===e.state}>${t}</option>`)}
      </select>`}textControl(t,e){const s="unknown"===e.state||"unavailable"===e.state?"":e.state,i=/^\d{1,2}:\d{2}$/.test(s);return I`
      <input type=${i?"time":"text"} .value=${s}
        @change=${e=>this.setText(t,e)} />`}switchControl(t,e){const s="on"===e.state;return I`
      <button class="toggle ${s?"on":""}"
        style=${s?`background:${this.accent()}`:""}
        @click=${()=>this.hass?.callService("switch","toggle",{entity_id:t})}
        aria-label="Toggle"></button>`}setNumber(t,e){const s=Number(e.target.value);Number.isNaN(s)||this.hass?.callService("number","set_value",{entity_id:t,value:s})}setSelect(t,e){const s=e.target.value;this.hass?.callService("select","select_option",{entity_id:t,option:s})}setText(t,e){const s=e.target.value;this.hass?.callService("text","set_value",{entity_id:t,value:s})}draftVal(t){if(t in this.draft)return this.draft[t];const e=this.get(t);return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:""}stage(t,e){this.draft={...this.draft,[t]:e}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(t){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=t}modeOf(t,e="Manual"){return this.modePick[t]??this.get(t)?.state??e}stagedInput(t,e){const s=this.get(t);if(!s)return q;const i=t.split(".")[0],r=this.draftVal(t);if(!e&&"number"===i){const e=s.attributes.min??0,i=s.attributes.max??100,o=s.attributes.step??1,a=s.attributes.unit_of_measurement??"";return I`<span class="num-box">
        <input type="number" min=${e} max=${i} step=${o} .value=${r}
          @input=${e=>this.stage(t,e.target.value)} />
        <span class="unit">${a}</span></span>`}if(!e&&"select"===i){const e=s.attributes.options??[];return I`<select .value=${r} @change=${e=>this.stage(t,e.target.value)}>
        ${e.map(t=>I`<option value=${t} ?selected=${t===r}>${t}</option>`)}
      </select>`}const o="time"===e||"duration"===e||/^\d{1,2}:\d{2}/.test(r);return I`<input type=${o?"time":"text"}
      step=${"duration"===e?"1":q} .value=${r}
      @change=${e=>this.stage(t,e.target.value)} />`}numOpts(t,e,s=1,i=String){const r=[],o=(String(s).split(".")[1]||"").length,a=s>0?Math.round((e-t)/s):0;for(let e=0;e<=a;e++){const a=Number((t+e*s).toFixed(o));r.push({label:i(a),value:String(a)})}return r}offOpts(t,e,s=1,i){return[{label:"Off",value:"0"},...this.numOpts(t,e,s,i)]}optSelect(t,e,s=!1){if(!this.get(t))return q;const i=this.draftVal(t),r=e.find(t=>Number(t.value)===Number(i))?.value??e.find(t=>t.value===i)?.value??i;return I`<select .value=${String(r)} @change=${e=>{const i=e.target.value;s?this.hass?.callService("number","set_value",{entity_id:t,value:Number(i)}):this.stage(t,i)}}>
      ${e.map(t=>I`
        <option value=${t.value} ?selected=${String(t.value)===String(r)}>${t.label}</option>`)}
    </select>`}optSelectRow(t,e,s,i=!1){if(!this.get(e))return q;const r=!i&&e in this.draft?"dev-row staged":"dev-row";return I`<div class=${r}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.optSelect(e,s,i)}</div>
    </div>`}stagedRow(t,e,s){if(!this.get(e))return q;const i=e in this.draft?"dev-row staged":"dev-row";return I`<div class=${i}>
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">${this.stagedInput(e,s)}</div>
    </div>`}stagedRangeRow(t,e,s){const i=this.get(e);if(!i)return q;const r=Math.round(Number(i.attributes.min??1)),o=Math.round(Number(i.attributes.max??100)),a=Math.max(1,Math.round(Number(i.attributes.step??1)));return this.optSelectRow(t,e,this.numOpts(r,o,a,s))}stagedPeriodRow(t,e,s){const i=this.get(t),r=this.get(e);if(!i&&!r)return q;const o=t in this.draft||e in this.draft;return I`<div class="dev-row period-row ${o?"staged":""}">
      <span class="dev-lbl">${s}</span>
      <div class="period-times">
        ${i?this.stagedInput(t,"time"):q}
        <span class="dash">–</span>
        ${r?this.stagedInput(e,"time"):q}
      </div>
    </div>`}liveModeRow(t,e){const s=this.get(e);if(!s)return q;const i=s.attributes.options??[];return I`<div class="dev-row">
      <span class="dev-lbl">${t}</span>
      <div class="ctl-input">
        <select .value=${this.modeOf(e,s.state)} @change=${t=>{const s=t.target.value;this.modePick={...this.modePick,[e]:s},"Manual"===s?(this.draft={},this.setSelect(e,t)):this.draft={[e]:s}}}>
          ${i.map(t=>I`
            <option value=${t} ?selected=${t===this.modeOf(e,s.state)}>${t}</option>`)}
        </select>
      </div>
    </div>`}saveBar(t,e){const s=Object.keys(this.draft).some(t=>t in e);return I`<div class="save-bar">
      <button class="save-btn" ?disabled=${!s}
        style=${s?`background:${this.accent()}`:""}
        @click=${()=>this.commitBundle(t,e)}>Save</button>
      <button class="discard-btn" ?disabled=${!s}
        @click=${()=>this.discardEdits()}>Discard</button>
    </div>`}commitBundle(t,e){const s={};for(const[t,i]of Object.entries(e))if(t in this.draft){const e=this.draft[t];s[i]="number"===t.split(".")[0]?Number(e):e}if(!Object.keys(s).length)return;const i=t.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),r=i?"light_1"===i[1]?"light":"light_2"===i[1]?"light2":i[1]:null;r&&!this.get(t)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(e)[0],module:r,settings:s}):this.hass?.callService("text","set_value",{entity_id:t,value:JSON.stringify(s)});const o={...this.draft};for(const t of Object.keys(e))delete o[t];this.draft=o}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.outlets??[];if(!this.hass)return t;const e=new Set(Rt(this.hass,this.config.panel));return t.filter(t=>e.has(t))}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}rangeSelect(t){const e=this.get(t);if(!e)return q;const s=Number(e.attributes.min??0),i=Number(e.attributes.max??100),r=Number(e.attributes.step??1)||1,o=e.attributes.unit_of_measurement??"";return this.optSelect(t,this.numOpts(s,i,r,t=>`${t}${o}`),!0)}envControl(t,e){return this.get(t)?I`
      <div class="ctl">
        <div class="ctl-label">${e}</div>
        <div class="ctl-input">${this.rangeSelect(t)}</div>
      </div>`:q}renderEnv(){const t=this.config.panel;if(!this.hasEnv())return q;const e=`text.sf_${t}_env_day_start`,s=`text.sf_${t}_env_day_end`,i=this.get(e)||this.get(s);return I`
      <div class="section-label">Environment</div>
      ${i?I`<div class="env-cycle">
            ${this.renderControl(e,"Day Cycle Start")}
            ${this.renderControl(s,"Day Cycle Stop")}
          </div>`:q}
      ${jt.map(([e,s,i,r,o])=>this.get(`number.sf_${t}_${s}`)?I`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${o} style="color:${this.accent()}"></ha-icon>
              <span>${e}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${t}_${i}`,"Night")}
              ${this.envControl(`number.sf_${t}_${s}`,"Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${t}_${r}`,"Dead Zone")}
            </div>
          </div>`:q)}
      ${this.renderVpd()}`}vpdRangeFor(t,e){const s=this.get(t),i=this.get(e);if(!s||!i)return null;const r=Number(s.state),o=Number(i.state);if(!Number.isFinite(r)||!Number.isFinite(o))return null;const a=this.config.panel,n=Number(this.get(`number.sf_${a}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${a}_env_humi_deadband`)?.state??0)||0,c="°C"===s.attributes.unit_of_measurement,d=t=>c?t:5*(t-32)/9,p=t=>.6108*Math.exp(17.27*t/(t+237.3)),h=Math.max(0,o-l),u=Math.min(100,o+l),f=Math.max(0,p(d(r-n))*(1-u/100)),g=Math.max(0,p(d(r+n))*(1-h/100));return`${f.toFixed(2)} – ${g.toFixed(2)}`}renderVpd(){const t=this.config.panel,e=this.vpdRangeFor(`number.sf_${t}_env_temp_day`,`number.sf_${t}_env_humi_day`),s=this.vpdRangeFor(`number.sf_${t}_env_temp_night`,`number.sf_${t}_env_humi_night`);return e||s?I`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${e?I`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${e}</span>
              </div>`:q}
          ${s?I`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${s}</span>
              </div>`:q}
        </div>
      </div>`:q}renderOutlets(){const t=this.outletSlots().flatMap(t=>this.renderSlotOutlets(t));return t.length?I`<div class="section-label">Outlets</div>${t}`:q}renderSlotOutlets(t){const e=[];for(let s=1;s<=10;s++){const i=`select.sf_${t}_outlet_${s}_mode`;if(!this.get(i))continue;const r=`switch.sf_${t}_outlet_${s}`,o=`sf_${t}_outlet_${s}_`,a="Time Slot"===(this.get(i)?.state??"")&&!!this.get(`sensor.${o}ts_schedule`),n=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return!(!e.startsWith(o)||e===`${o}mode`)&&(e!==`${o}ts_schedule`&&(!a||e!==`${o}ts_type`&&e!==`${o}ts_start`&&e!==`${o}ts_stop`))}).sort(),l=this.get(r);e.push(I`
        <div class="outlet">
          <div class="outlet-head">
            <span class="outlet-name">Outlet ${s}</span>
            ${l?this.switchControl(r,l):q}
          </div>
          <div class="outlet-body">
            ${this.renderControl(i,"Mode")}
            ${n.map(t=>this.renderControl(t))}
            ${a?this.renderOutletSchedule(t,s):q}
          </div>
        </div>`)}return e}outletKey(t,e){return`${t}_${e}`}outletPeriods(t,e){const s=this.outletDraft[this.outletKey(t,e)];if(s)return s;const i=this.get(`sensor.sf_${t}_outlet_${e}_ts_schedule`)?.attributes.periods;return Array.isArray(i)?i:[]}editOutlet(t,e,s){const i=this.outletKey(t,e),r=this.outletDraft[i]??this.outletPeriods(t,e),o=JSON.parse(JSON.stringify(r));s(o),this.outletDraft={...this.outletDraft,[i]:o}}clearOutletDraft(t,e){const s=this.outletKey(t,e),i={...this.outletDraft};delete i[s],this.outletDraft=i}saveOutlet(t,e){const s=this.outletDraft[this.outletKey(t,e)];s&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${t}_outlet_${e}_mode`,periods:s}),this.clearOutletDraft(t,e))}renderOutletSchedule(t,e){const s=this.outletPeriods(t,e),i=!!this.outletDraft[this.outletKey(t,e)],r=this.accent();return I`
      <div class="ts-editor">
        ${s.map((s,i)=>I`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${i+1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${()=>this.editOutlet(t,e,t=>t.splice(i,1))}>✕</button>
            </div>
            <div class="days">
              ${mt.map((o,a)=>I`<button
                  class="day ${s.days.includes(a)?"on":""}"
                  style=${s.days.includes(a)?`background:${r};border-color:${r}`:""}
                  @click=${()=>this.editOutlet(t,e,t=>{const e=t[i].days,s=e.indexOf(a);s>=0?e.splice(s,1):e.push(a),e.sort((t,e)=>t-e)})}>${o}</button>`)}
            </div>
            <div class="sched-times">
              <div class="tf">
                <span class="tf-lbl">Start</span>
                <input type="time" .value=${s.start}
                  @change=${s=>this.editOutlet(t,e,t=>{t[i].start=s.target.value})} />
              </div>
              <span class="dash">—</span>
              <div class="tf">
                <span class="tf-lbl">Stop</span>
                <input type="time" .value=${s.end}
                  @change=${s=>this.editOutlet(t,e,t=>{t[i].end=s.target.value})} />
              </div>
            </div>
          </div>`)}
        <div class="sched-actions">
          <button class="add"
            @click=${()=>this.editOutlet(t,e,t=>t.push({days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00"}))}>
            + Add slot
          </button>
          ${i?I`<button class="discard" @click=${()=>this.clearOutletDraft(t,e)}>Discard</button>
                <button class="save" style="background:${r}"
                  @click=${()=>this.saveOutlet(t,e)}>Save</button>`:q}
        </div>
      </div>`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=bt(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let s=e?.attributes.friendly_name??"";const i=Ct(this.hass,this.config.panel);return i&&s.startsWith(i)&&(s=s.slice(i.length).trim()),s=s.replace(/\s*Temp Calibration\s*$/i,"").trim(),s||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.envControl(t,e)).filter(t=>t!==q),s=this.caliSoilSlots().map(e=>{const s=[this.envControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.envControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==q),i=this.renderControl(`select.sf_${t}_${e}_substrate`,"Substrate");return I`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="env-grid">${s}</div>
          ${i!==q?I`<div class="cali-sub">${i}</div>`:q}
        </div>`});return e.length||s.length?I`
      ${e.length?I`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:q}
      ${s.length?I`<div class="section-label">Soil Calibration</div>${s}`:q}`:I`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}hasAlerts(){return!!this.alertsSettings()}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return t&&"object"==typeof t?t:null}editAlert(t){const e=this.alertsDraft??this.alertsSettings()??{},s=JSON.parse(JSON.stringify(e));t(s),this.alertsDraft=s}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const t=this.alertsSettings();if(!t)return q;const e=null!==this.alertsDraft,s=this.accent();return I`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(t,"climate","Climate")}
      ${this.renderAlertGroup(t,"substrate","Substrate")}
      ${this.renderAlertOther(t)}
      <div class="sched-actions" style="margin-top:10px">
        ${e?I`<button class="discard" @click=${()=>this.alertsDraft=null}>Discard</button>
              <button class="save" style="background:${s}"
                @click=${()=>this.saveAlerts()}>Save</button>`:I`<span class="alert-hint">Toggle an alert and adjust its limits, then Save.</span>`}
      </div>`}renderAlertGroup(t,e,s){const i=t[e]||[];return i.length?I`
      <div class="section-label">${s}</div>
      ${i.map((t,s)=>this.renderAlertMetric(e,s,t))}`:q}alertBounds(t){switch(t){case"temp":case"tempSoil":return[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(t,e,s){const i=this.accent(),[r,o]=this.alertBounds(s.key),a=Number(s.step??1)||1,n="ppfd"===s.key?Math.max(r,o-100):o,l=(i,l)=>{const c=this.numOpts(r,"min"===l?n:o,a);return I`
      <label class="av">
        <span class="av-lbl">${i}</span>
        <span class="num-box">
          <select .value=${String(s[l]??"")}
            @change=${s=>this.editAlert(i=>{i[t][e][l]=Number(s.target.value)})}>
            ${c.map(t=>I`
              <option value=${t.value} ?selected=${String(t.value)===String(s[l]??"")}>${t.label}</option>`)}
          </select>
          <span class="unit">${s.unit??""}</span>
        </span>
      </label>`};return I`
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
      </div>`}renderAlertOther(t){const e=t.other||[];if(!e.length)return q;const s=this.accent();return I`
      <div class="section-label">Other Device</div>
      ${e.map((t,e)=>I`<div class="alert-bool">
          <span class="alert-name">${t.label}</span>
          <button class="toggle ${t.enabled?"on":""}"
            style=${t.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(t=>{const s=t.other[e];s.enabled=s.enabled?0:1})}
            aria-label="Toggle ${t.label} alarm"></button>
        </div>`)}`}hasLog(){return this.alarmSources().length>0}alarmSources(){const t=[],e=e=>{const s=this.get(`sensor.sf_${e}_alarms`);s&&t.push({slot:e,ent:s,name:Ct(this.hass,e)||e})};e(this.config.panel);for(const t of this.outletSlots())t!==this.config.panel&&e(t);return t}logToday(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}renderLog(){const t=this.alarmSources(),e=this.logDate||this.logToday(),s=this.logDev||"all",i=this.logType||"all";let r=[];for(const e of t){if("all"!==s&&s!==e.slot)continue;const t=e.ent.attributes.events;Array.isArray(t)&&t.forEach(t=>r.push({...t,_src:e.name}))}const o=[...new Set(r.map(t=>t.device).filter(Boolean))].sort(),a=new Date(`${e}T00:00:00`).getTime()/1e3,n=new Date(`${e}T23:59:59.999`).getTime()/1e3;return r=r.filter(t=>(t.epoch||0)>=a&&(t.epoch||0)<=n&&("all"===i||t.device===i)).sort((t,e)=>(e.epoch||0)-(t.epoch||0)).slice(0,50),I`
      <div class="log-filters">
        ${t.length>1?I`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${t=>{this.logDev=t.target.value}}>
                  <option value="all" ?selected=${"all"===s}>All</option>
                  ${t.map(t=>I`
                    <option value=${t.slot} ?selected=${s===t.slot}>${t.name}</option>`)}
                </select>
              </div>
            </div>`:q}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${t=>{this.logType=t.target.value}}>
              <option value="all" ?selected=${"all"===i}>All</option>
              ${o.map(t=>I`
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
      ${r.length?I`
            <div class="log-count">${r.length} ${1===r.length?"entry":"entries"}${r.length>10?" — scroll for more":""}</div>
            <div class="log-list">
              ${r.map(e=>I`
                <div class="log-row ${e.alarmType?"raise":"restore"}">
                  <div class="log-title">${t.length>1&&"all"===s?`${e._src} `:""}${e.device||`Device ${e.devType}`} ${e.alarm||""}</div>
                  <div class="log-time">${e.epoch?(t=>{try{return new Date(1e3*t).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(e.epoch):e.time||""}</div>
                </div>`)}
            </div>`:I`<div class="cali-empty">No log entries on this date.</div>`}`}render(){if(!this.hass||!this.config)return q;const t=this.hasEnv(),e=this.hasOutlets(),s=this.hasCali(),i=this.hasAlerts(),r=this.hasLog();let o=this.tab;"env"!==o||t||(o="overview"),"outlets"!==o||e||(o="overview"),"cali"!==o||s||(o="overview"),"alerts"!==o||i||(o="overview"),"log"!==o||r||(o="overview"),"settings"!==o||i||(o="overview");const a=t||e||s||i||r,n=this.accent(),l=(t,e)=>I`<button class="tab ${o===t?"active":""}"
        style=${o===t?`color:${n};border-color:${n}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,c=Ct(this.hass,this.config.panel);return I`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${c?I`<span class="device">${c}</span>`:q}
        </div>
        ${a?I`<div class="tabs">
              ${l("overview","Overview")}
              ${t?l("env","Environment"):q}
              ${e?l("outlets","Outlets"):q}
              ${s?l("cali","Calibration"):q}
              ${i?l("alerts","Alerts"):q}
              ${r?l("log","Log"):q}
              ${i?l("settings","Settings"):q}
            </div>`:q}
        ${"env"===o?this.renderEnv():"outlets"===o?this.renderOutlets():"cali"===o?this.renderCali():"alerts"===o?this.renderAlerts():"log"===o?this.renderLog():"settings"===o?this.renderSettings():this.renderOverview()}
      </ha-card>`}renderSettings(){const t=this.accent(),e=(e,s,i)=>I`
      <button class="seg ${this.colorMode===e?"on":""}"
        style=${this.colorMode===e?`border-color:${t};color:${t}`:q}
        @click=${()=>this.setColorMode(e)}>
        <ha-icon icon=${i}></ha-icon><span>${s}</span>
      </button>`;return I`
      <div class="section-label">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${Nt}">red above max</span>,
        <span style="color:${Pt}">blue below min</span>. Only applies to
        metrics whose alarm is switched on in the Alerts tab. Saved on this
        device.
      </div>
      <div class="seg-row">
        ${e("off","No color","mdi:circle-off-outline")}
        ${e("tile","Tile color","mdi:square-rounded")}
        ${e("text","Text color","mdi:format-color-text")}
      </div>`}}Ut.styles=a`
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
    .ts-editor .save, .ts-editor .discard {
      border: none; border-radius: 8px; font-size: 13px; font-weight: 500;
      padding: 7px 14px; cursor: pointer;
    }
    .ts-editor .save { color: #fff; }
    .ts-editor .discard { background: var(--secondary-background-color); color: var(--primary-text-color); }

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
    .alert-hint { font-size: 12px; color: var(--secondary-text-color); }
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
    .save, .discard {
      border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
      padding: 8px 16px; cursor: pointer;
    }
    .save { color: #fff; }
    .discard { background: var(--secondary-background-color); color: var(--primary-text-color); }

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
  `,t([ut({attribute:!1})],Ut.prototype,"hass",void 0),t([ft()],Ut.prototype,"config",void 0),t([ft()],Ut.prototype,"tab",void 0),t([ft()],Ut.prototype,"colorMode",void 0),t([ft()],Ut.prototype,"alertsDraft",void 0),t([ft()],Ut.prototype,"soilOpen",void 0),t([ft()],Ut.prototype,"soilAllOpen",void 0),t([ft()],Ut.prototype,"deviceOpen",void 0),t([ft()],Ut.prototype,"draft",void 0),t([ft()],Ut.prototype,"modePick",void 0),t([ft()],Ut.prototype,"outletDraft",void 0),t([ft()],Ut.prototype,"logDate",void 0),t([ft()],Ut.prototype,"logDev",void 0),t([ft()],Ut.prototype,"logType",void 0);class Ht extends ct{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,s={...this._config};e?s.panel=e:delete s.panel,this._emit(s)}_titleChanged(t){const e=t.target.value.trim(),s={...this._config};e?s.title=e:delete s.title,this._emit(s)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const s=e.target.checked,i=new Set(this._config.outlets??[]);s?i.add(t):i.delete(t);const r=[...i].sort(),o={...this._config};r.length?o.outlets=r:delete o.outlets,this._emit(o)}render(){if(!this.hass)return q;const t=this._config,e=t.default_tab,s=kt(this.hass),i=Rt(this.hass,t.panel),r=t=>{const e=Ct(this.hass,t);return e?`${t} — ${e}`:t};return I`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${s.length?q:I`<option value="">(no devices found yet)</option>`}
            ${t.panel?q:I`<option value="" selected>— choose a device —</option>`}
            ${s.map(e=>I`<option value=${e} ?selected=${e===t.panel}>${r(e)}</option>`)}
            ${t.panel&&!s.includes(t.panel)?I`<option value=${t.panel} selected>${t.panel} (not found)</option>`:q}
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

        ${i.length?I`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${i.map(e=>I`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${r(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:q}
      </div>`}}Ht.styles=a`
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
  `,t([ut({attribute:!1})],Ht.prototype,"hass",void 0),t([ft()],Ht.prototype,"_config",void 0);const Lt=/^sf_(se\d+)_light$/;function Wt(t){const e=new Set;for(const s of Object.keys(t.states)){if(!s.startsWith("light."))continue;const t=bt(s).match(Lt);t&&e.add(t[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}class It extends ct{constructor(){super(...arguments),this.draft=null}setConfig(t){this.config=t}getCardSize(){return 7}static getStubConfig(t){const e=t?Wt(t):[];return{type:"custom:spider-light-card",...e[0]?{light:e[0]}:{}}}accent(){return this.config.accent||gt}seSlot(){return this.config.light||(this.hass?Wt(this.hass)[0]:"")||"se1"}get(t){return this.hass?.states[t]}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("draft")}setBrightness(t){const e=`light.sf_${this.seSlot()}_light`;t<=0?this.hass?.callService("light","turn_off",{entity_id:e}):this.hass?.callService("light","turn_on",{entity_id:e,brightness_pct:t})}toggle(){this.hass?.callService("light","toggle",{entity_id:`light.sf_${this.seSlot()}_light`})}setMode(t){this.hass?.callService("select","select_option",{entity_id:`select.sf_${this.seSlot()}_mode`,option:t})}render(){if(!this.hass||!this.config)return q;const t=this.seSlot(),e=this.get(`light.sf_${t}_light`);if(!e)return I`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light?` for "${this.config.light}"`:""}.
        </div>
      </ha-card>`;const s="on"===e.state,i=s?Math.max(0,Math.min(100,Math.round((e.attributes.brightness??0)/255*100))):0,r=this.get(`select.sf_${t}_mode`),o=r?.state??"",a=Ct(this.hass,t),n=this.accent(),l=i/100,[c,d]=$t(100,100,78,135+270*l);return I`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Light"}</span>
          ${a?I`<span class="device">${a}</span>`:q}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${_t(100,100,78,0,1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${s&&l>0?V`<path d=${_t(100,100,78,0,l)} fill="none"
                  stroke-linecap="round" stroke=${n} stroke-width="15"></path>`:q}
            ${s?V`<circle cx=${c.toFixed(2)} cy=${d.toFixed(2)} r="10"
                  fill="#fff" stroke=${n} stroke-width="3"></circle>`:q}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${s?n:"var(--secondary-text-color)"}>
              ${s?i+"%":"Off"}
            </text>
          </svg>
          <button class="power ${s?"on":""}"
            style=${s?`background:${n}`:""}
            @click=${()=>this.toggle()} aria-label="Toggle light"></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(i)}
            style="accent-color:${n}" data-unit="%"
            @input=${yt}
            @change=${t=>this.setBrightness(Number(t.target.value))} />
          <span class="sl-bub"></span>
        </span>

        ${r?I`<div class="modes">
              ${(r.attributes.options??["Manual","Automatic"]).map(t=>I`<button
                  class="mode ${o===t?"active":""}"
                  style=${o===t?`color:${n};border-color:${n}`:""}
                  @click=${()=>this.setMode(t)}>${t}</button>`)}
            </div>`:q}

        ${"Automatic"===o?this.renderSchedule(t):q}
      </ha-card>`}periodsFor(t){if(this.draft)return this.draft;const e=this.get(`sensor.sf_${t}_schedule`)?.attributes.periods;return Array.isArray(e)?e:[]}edit(t,e){const s=this.draft??this.periodsFor(t),i=JSON.parse(JSON.stringify(s));e(i),this.draft=i}saveSchedule(t){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${t}_light`,periods:this.draft}),this.draft=null)}renderSchedule(t){if(!this.get(`sensor.sf_${t}_schedule`))return this.renderScheduleLegacy(t);const e=this.periodsFor(t),s=null!==this.draft,i=this.accent();return I`
      <div class="section-label">Schedule</div>
      ${e.map((e,s)=>this.renderPeriod(t,e,s,i))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(t,t=>t.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          + Add period
        </button>
        ${s?I`<button class="discard" @click=${()=>this.draft=null}>Discard</button>
              <button class="save" style="background:${i}"
                @click=${()=>this.saveSchedule(t)}>Save</button>`:q}
      </div>`}renderPeriod(t,e,s,i){return I`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${s+1}</span>
          <button class="del" aria-label="Delete period"
            @click=${()=>this.edit(t,t=>t.splice(s,1))}>✕</button>
        </div>
        <div class="days">
          ${mt.map((r,o)=>I`<button
              class="day ${e.days.includes(o)?"on":""}"
              style=${e.days.includes(o)?`background:${i};border-color:${i}`:""}
              @click=${()=>this.edit(t,t=>{const e=t[s].days,i=e.indexOf(o);i>=0?e.splice(i,1):e.push(o),e.sort((t,e)=>t-e)})}>${r}</button>`)}
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
      </div>`}renderScheduleLegacy(t){const e=this.get(`text.sf_${t}_schedule_start`),s=this.get(`text.sf_${t}_schedule_stop`),i=this.get(`number.sf_${t}_schedule_brightness`),r=this.get(`number.sf_${t}_sunrise_sunset_fade`);return e||s||i||r?I`
      <div class="section-label">Schedule</div>
      ${e||s?I`<div class="sched-times">
            ${this.timeField(`text.sf_${t}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${t}_schedule_stop`,"Stop")}
          </div>`:q}
      ${i?this.numRow(`number.sf_${t}_schedule_brightness`,"Brightness",i):q}
      ${r?this.numRow(`number.sf_${t}_sunrise_sunset_fade`,"Sunrise / sunset fade",r):q}`:q}timeField(t,e){const s=this.get(t);if(!s)return q;const i="unknown"===s.state||"unavailable"===s.state?"":s.state;return I`<div class="tf">
      <span class="tf-lbl">${e}</span>
      <input type="time" .value=${i}
        @change=${e=>this.hass?.callService("text","set_value",{entity_id:t,value:e.target.value})} />
    </div>`}numRow(t,e,s){const i=s.attributes.min??0,r=s.attributes.max??100,o=s.attributes.step??1,a=s.attributes.unit_of_measurement??"",n="unknown"===s.state||"unavailable"===s.state?"":s.state;return I`<div class="num-row">
      <span class="nr-lbl">${e}</span>
      <span class="sl-live">
        <input type="range" min=${i} max=${r} step=${o} .value=${String(n)}
          style="accent-color:${this.accent()}" data-unit=${a}
          @input=${yt}
          @change=${e=>this.hass?.callService("number","set_value",{entity_id:t,value:Number(e.target.value)})} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${n}${a}</span>
    </div>`}}It.styles=a`
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
    .save, .discard {
      border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
      padding: 8px 16px; cursor: pointer;
    }
    .save { color: #fff; }
    .discard { background: var(--secondary-background-color); color: var(--primary-text-color); }
  `,t([ut({attribute:!1})],It.prototype,"hass",void 0),t([ft()],It.prototype,"config",void 0),t([ft()],It.prototype,"draft",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",Ut),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Ht),customElements.get("spider-light-card")||customElements.define("spider-light-card",It),window.customCards=window.customCards||[],window.customCards.push({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),window.customCards.push({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.17.13 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const t=["spider-farmer-card","spider-light-card"],e=new Set([...t,...t.map(t=>`custom:${t}`)]),s=()=>{const t=[["spider-farmer-card",Ut],["spider-farmer-card-editor",Ht],["spider-light-card",It]];for(const[e,s]of t)if(!customElements.get(e))try{customElements.define(e,s)}catch{}},i=()=>{let t=0;for(const s of(()=>{const t=[],e=new Set,s=i=>{if(!i||e.has(i))return;e.add(i);let r=[];try{r=i.querySelectorAll("hui-error-card")}catch{return}r.forEach(e=>t.push(e));let o=[];try{o=i.querySelectorAll("*")}catch{return}o.forEach(t=>{const e=t.shadowRoot;e&&s(e)})};return s(document),t})()){const i=s._config||{},r=i.origConfig&&i.origConfig.type||i.type||"";e.has(r)&&(s.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),t++)}return t};let r=0;const o=()=>{s(),i(),++r<12&&setTimeout(o,250)},a=()=>{s(),o()};"complete"===document.readyState?a():window.addEventListener("load",a,{once:!0})})();export{Ut as SpiderFarmerCard,Ht as SpiderFarmerCardEditor,It as SpiderLightCard};
