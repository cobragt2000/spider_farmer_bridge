/*! spider-farmer-card v0.3.0 | MIT */
function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,$=g?g.emptyScript:"",m=f.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??b)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,m?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+P,O=`<${k}>`,T=document,N=()=>T.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,z="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,j=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),V=new WeakMap,Z=T.createTreeWalker(T,129);function J(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===H?"!--"===l[1]?o=R:void 0!==l[1]?o=D:void 0!==l[2]?(F.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=r??H,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?j:'"'===l[3]?B:L):o===B||o===L?o=j:o===R||o===D?o=H:(o=j,r=void 0);const h=o===j&&t[e+1].startsWith("/>")?" ":"";n+=o===H?i+O:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+P+h):i+P+(-2===c?e:h)}return[J(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=G.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[n++],i=s.getAttribute(t).split(P),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(P),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),Z.nextNode(),a.push({type:2,index:++r});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(P,t+1));)a.push({type:7,index:r}),t+=P.length-1}r++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=U(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);Z.currentNode=s;let r=Z.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=Z.nextNode(),n++)}return Z.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),U(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Q(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==W,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Q(this,s[i+o],e,o),a===W&&(a=this._$AH[o]),n||=!U(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,Y),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(N(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const lt=ot.litElementPolyfillSupport;lt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},dt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=/^sf_(dp\d+|ac5|ac10)_/;function ft(t){return t.split(".")[1]??""}function gt(t){const e=new Set;for(const i of Object.keys(t.states)){const t=ft(i).match(ut);t&&e.add(t[1])}return[...e].sort()}function $t(t){return gt(t).filter(e=>Object.keys(t.states).some(t=>{const i=ft(t);return i===`sf_${e}_temperature`||i===`sf_${e}_soil_avg_temperature`||i===`sf_${e}_light_1`||i===`sf_${e}_fan`||i===`sf_${e}_blower`}))}function mt(t,e){const i=`sf_${e}_`,s=Object.keys(t.states);return s.find(t=>ft(t)===`sf_${e}_temperature`)??s.find(t=>{const s=ft(t);return s.startsWith(i)&&!s.startsWith(`sf_${e}_env_`)})}function _t(t,e){const i=mt(t,e);return i?t.entities?.[i]?.device_id:void 0}function vt(t,e){if(!e)return[];const i=_t(t,e);return function(t){return gt(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}(t).filter(s=>{if(s===e)return!0;if(!i)return!1;const r=_t(t,s),n=r?t.devices?.[r]:void 0;return n?.via_device_id===i})}function bt(t,e){if(!t||!e)return"";const i=mt(t,e);if(!i)return"";const s=t.entities?.[i]?.device_id,r=s?t.devices?.[s]:void 0;if(r)return r.name_by_user||r.name||"";const n=(t.states[i].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return n?n[1]:""}const yt=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","VPD","mdi:water-opacity"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],xt=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],wt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],At=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],St=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class Ct extends at{constructor(){super(...arguments),this.tab="overview"}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t,this.tab="config"===t.default_tab?"config":"cali"===t.default_tab?"cali":"overview"}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?$t(t):[])[0]||"dp1",i=t?vt(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...i.length?{outlets:i}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||"#ff7a1a"}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")}renderParam([t,e,i]){const s=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!s)return q;const r=s.attributes.unit_of_measurement||"",n=this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(r,"").trim():s.state;return I`
      <div class="tile">
        <div class="tile-label">${e}</div>
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val">${n}<span class="unit">${r}</span></div>
      </div>`}renderLight([t,e,i]){const s=this.eid("light",t),r=this.get(s);if(!r)return q;const n="on"===r.state,o=Math.round((r.attributes.brightness??0)/255*100);return I`
      <div class="row">
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="row-body">
          <div class="row-label">${e}</div>
          <input type="range" min="11" max="100" .value=${n?String(o):"0"}
            style="accent-color:${this.accent()}"
            @change=${t=>this.setBrightness(s,t)} />
        </div>
        <span class="row-val" style="color:${this.accent()}">${n?o+"%":"off"}</span>
      </div>`}renderFan([t,e,i]){const s=this.eid("fan",t),r=this.get(s);if(!r)return q;const n="on"===r.state,o=Math.round(r.attributes.percentage??0);return I`
      <div class="row">
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="row-body">
          <div class="row-label">${e}</div>
          <input type="range" min="0" max="100" .value=${String(n?o:0)}
            style="accent-color:${this.accent()}"
            @change=${t=>this.setPercent(s,t)} />
        </div>
        <button class="toggle ${n?"on":""}" style=${n?`background:${this.accent()}`:""}
          @click=${()=>this.hass?.callService("fan","toggle",{entity_id:s})}
          aria-label="Toggle ${e}"></button>
      </div>`}renderClimate([t,e,i]){const s=this.eid("switch",t),r=this.get(s);if(!r)return q;const n="on"===r.state;return I`
      <div class="row">
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="row-label" style="flex:1">${e}</div>
        <button class="toggle ${n?"on":""}" style=${n?`background:${this.accent()}`:""}
          @click=${()=>this.hass?.callService("switch","toggle",{entity_id:s})}
          aria-label="Toggle ${e}"></button>
      </div>`}setBrightness(t,e){const i=Number(e.target.value);i<=0?this.hass?.callService("light","turn_off",{entity_id:t}):this.hass?.callService("light","turn_on",{entity_id:t,brightness_pct:i})}setPercent(t,e){const i=Number(e.target.value);this.hass?.callService("fan","set_percentage",{entity_id:t,percentage:i})}renderOverview(){const t=yt.map(t=>this.renderParam(t)).filter(t=>t!==q),e=xt.map(t=>this.renderLight(t)).filter(t=>t!==q),i=wt.map(t=>this.renderFan(t)).filter(t=>t!==q),s=At.map(t=>this.renderClimate(t)).filter(t=>t!==q),r=[...e,...i,...s];return I`
      ${t.length?I`<div class="section-label">Parameters</div>
            <div class="grid">${t}</div>`:q}
      ${r.length?I`<div class="section-label">Devices</div>
            <div class="controls">${r}</div>`:q}`}renderControl(t,e){const i=this.get(t);if(!i)return q;const s=t.split(".")[0],r=e??i.attributes.friendly_name??t.split(".")[1];let n;return n="number"===s?this.numberControl(t,i):"select"===s?this.selectControl(t,i):"text"===s?this.textControl(t,i):"switch"===s?this.switchControl(t,i):I`<span class="ctl-val">${i.state}</span>`,I`
      <div class="ctl">
        <div class="ctl-label">${r}</div>
        <div class="ctl-input">${n}</div>
      </div>`}numberControl(t,e){const i=e.attributes.min??0,s=e.attributes.max??100,r=e.attributes.step??1,n=e.attributes.unit_of_measurement??"",o="slider"===e.attributes.mode,a="unknown"===e.state||"unavailable"===e.state?"":e.state;return o?I`
        <div class="slider-wrap">
          <input type="range" min=${i} max=${s} step=${r}
            .value=${String(a)} style="accent-color:${this.accent()}"
            @change=${e=>this.setNumber(t,e)} />
          <span class="slider-val" style="color:${this.accent()}">${a}${n}</span>
        </div>`:I`
      <span class="num-box">
        <input type="number" min=${i} max=${s} step=${r}
          .value=${String(a)} @change=${e=>this.setNumber(t,e)} />
        <span class="unit">${n}</span>
      </span>`}selectControl(t,e){const i=e.attributes.options??[];return I`
      <select @change=${e=>this.setSelect(t,e)}>
        ${i.map(t=>I`<option value=${t} ?selected=${t===e.state}>${t}</option>`)}
      </select>`}textControl(t,e){const i="unknown"===e.state||"unavailable"===e.state?"":e.state,s=/^\d{1,2}:\d{2}$/.test(i);return I`
      <input type=${s?"time":"text"} .value=${i}
        @change=${e=>this.setText(t,e)} />`}switchControl(t,e){const i="on"===e.state;return I`
      <button class="toggle ${i?"on":""}"
        style=${i?`background:${this.accent()}`:""}
        @click=${()=>this.hass?.callService("switch","toggle",{entity_id:t})}
        aria-label="Toggle"></button>`}setNumber(t,e){const i=Number(e.target.value);Number.isNaN(i)||this.hass?.callService("number","set_value",{entity_id:t,value:i})}setSelect(t,e){const i=e.target.value;this.hass?.callService("select","select_option",{entity_id:t,option:i})}setText(t,e){const i=e.target.value;this.hass?.callService("text","set_value",{entity_id:t,value:i})}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.outlets??[];if(!this.hass)return t;const e=new Set(vt(this.hass,this.config.panel));return t.filter(t=>e.has(t))}hasConfig(){return!!this.hasEnv()||this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}renderEnv(){const t=this.config.panel;if(!this.hasEnv())return q;const e=`text.sf_${t}_env_day_start`,i=`text.sf_${t}_env_day_end`,s=this.get(e)||this.get(i);return I`
      <div class="section-label">Environment</div>
      ${s?I`<div class="env-cycle">
            ${this.renderControl(e,"Day Cycle Start")}
            ${this.renderControl(i,"Day Cycle Stop")}
          </div>`:q}
      ${St.map(([e,i,s,r,n])=>this.get(`number.sf_${t}_${i}`)?I`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${n} style="color:${this.accent()}"></ha-icon>
              <span>${e}</span>
            </div>
            <div class="env-grid">
              ${this.renderControl(`number.sf_${t}_${i}`,"Day")}
              ${this.renderControl(`number.sf_${t}_${s}`,"Night")}
              ${this.renderControl(`number.sf_${t}_${r}`,"Dead Zone")}
            </div>
          </div>`:q)}`}renderOutlets(){const t=this.outletSlots().flatMap(t=>this.renderSlotOutlets(t));return t.length?I`<div class="section-label">Outlets</div>${t}`:q}renderSlotOutlets(t){const e=[];for(let i=1;i<=10;i++){const s=`select.sf_${t}_outlet_${i}_mode`;if(!this.get(s))continue;const r=`switch.sf_${t}_outlet_${i}`,n=`sf_${t}_outlet_${i}_`,o=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return e.startsWith(n)&&e!==`${n}mode`}).sort(),a=this.get(r);e.push(I`
        <div class="outlet">
          <div class="outlet-head">
            <span class="outlet-name">Outlet ${i}</span>
            ${a?this.switchControl(r,a):q}
          </div>
          <div class="outlet-body">
            ${this.renderControl(s,"Mode")}
            ${o.map(t=>this.renderControl(t))}
          </div>
        </div>`)}return e}renderConfig(){return I`${this.renderEnv()}${this.renderOutlets()}`}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const i of Object.keys(this.hass?.states??{})){const s=ft(i).match(t);s&&e.add(s[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let i=e?.attributes.friendly_name??"";const s=bt(this.hass,this.config.panel);return s&&i.startsWith(s)&&(i=i.slice(s.length).trim()),i=i.replace(/\s*Temp Calibration\s*$/i,"").trim(),i||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.renderControl(t,e)).filter(t=>t!==q),i=this.caliSoilSlots().map(e=>{const i=[this.renderControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.renderControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.renderControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==q),s=this.renderControl(`select.sf_${t}_${e}_substrate`,"Substrate");return I`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="env-grid">${i}</div>
          ${s!==q?I`<div class="cali-sub">${s}</div>`:q}
        </div>`});return e.length||i.length?I`
      ${e.length?I`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:q}
      ${i.length?I`<div class="section-label">Soil Calibration</div>${i}`:q}`:I`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}render(){if(!this.hass||!this.config)return q;const t=this.hasConfig(),e=this.hasCali();let i=this.tab;"config"!==i||t||(i="overview"),"cali"!==i||e||(i="overview");const s=t||e,r=this.accent(),n=(t,e)=>I`<button class="tab ${i===t?"active":""}"
        style=${i===t?`color:${r};border-color:${r}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,o=bt(this.hass,this.config.panel);return I`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${o?I`<span class="device">${o}</span>`:q}
        </div>
        ${s?I`<div class="tabs">
              ${n("overview","Overview")}
              ${t?n("config","Config"):q}
              ${e?n("cali","Cali"):q}
            </div>`:q}
        ${"config"===i?this.renderConfig():"cali"===i?this.renderCali():this.renderOverview()}
      </ha-card>`}}Ct.styles=o`
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
    }
    .tab {
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 12px; cursor: pointer; margin-bottom: -1px;
    }
    .tab.active { border-bottom-width: 2px; border-style: solid; }
    .section-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 2px 8px;
    }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .tile {
      background: var(--secondary-background-color); border-radius: 12px; padding: 10px;
    }
    .tile-label { font-size: 11px; color: var(--secondary-text-color); }
    .tile ha-icon { --mdc-icon-size: 20px; display: block; margin: 2px 0; }
    .tile-val { font-size: 17px; font-weight: 500; }
    .unit { font-size: 11px; color: var(--secondary-text-color); margin-left: 2px; }
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
    .env-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .outlet {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .outlet-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    }
    .outlet-name { font-size: 14px; font-weight: 500; }
    .outlet-body { display: flex; flex-direction: column; gap: 8px; }

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

    .ctl { display: flex; flex-direction: column; gap: 4px; }
    .ctl-label { font-size: 11px; color: var(--secondary-text-color); }
    .ctl-input { display: flex; align-items: center; }
    .ctl-input input[type="number"],
    .ctl-input input[type="text"],
    .ctl-input input[type="time"],
    .ctl-input select {
      width: 100%; box-sizing: border-box;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      font-size: 14px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding: 6px 8px;
    }
    .num-box { display: flex; align-items: center; gap: 4px; width: 100%; }
    .slider-wrap { display: flex; align-items: center; gap: 8px; width: 100%; }
    .slider-wrap input[type="range"] { flex: 1; }
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
  `,t([ht({attribute:!1})],Ct.prototype,"hass",void 0),t([pt()],Ct.prototype,"config",void 0),t([pt()],Ct.prototype,"tab",void 0);class Et extends at{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,i={...this._config};e?i.panel=e:delete i.panel,this._emit(i)}_titleChanged(t){const e=t.target.value.trim(),i={...this._config};e?i.title=e:delete i.title,this._emit(i)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const i=e.target.checked,s=new Set(this._config.outlets??[]);i?s.add(t):s.delete(t);const r=[...s].sort(),n={...this._config};r.length?n.outlets=r:delete n.outlets,this._emit(n)}render(){if(!this.hass)return q;const t=this._config,e=$t(this.hass),i=vt(this.hass,t.panel),s=t=>{const e=bt(this.hass,t);return e?`${t} — ${e}`:t};return I`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${e.length?q:I`<option value="">(no devices found yet)</option>`}
            ${t.panel?q:I`<option value="" selected>— choose a device —</option>`}
            ${e.map(e=>I`<option value=${e} ?selected=${e===t.panel}>${s(e)}</option>`)}
            ${t.panel&&!e.includes(t.panel)?I`<option value=${t.panel} selected>${t.panel} (not found)</option>`:q}
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
            <option value="overview" ?selected=${"config"!==t.default_tab}>Overview</option>
            <option value="config" ?selected=${"config"===t.default_tab}>Config</option>
          </select>
        </label>

        ${i.length?I`
              <div class="field">
                <span class="flabel">Outlet devices (Config tab)</span>
                <div class="checks">
                  ${i.map(e=>I`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${s(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:q}
      </div>`}}Et.styles=o`
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
  `,t([ht({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"_config",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",Ct),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Et),window.customCards=window.customCards||[],window.customCards.push({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.3.0 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px");export{Ct as SpiderFarmerCard,Et as SpiderFarmerCardEditor};
