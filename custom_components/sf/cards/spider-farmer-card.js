/*! spider-farmer-card v0.6.1 | MIT */
function t(t,e,s,i){var r,n=arguments.length,o=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,s,o):r(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,g=m?m.emptyScript:"",$=f.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const n=this.constructor;if(!1===i&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??b)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,$?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+O,P=`<${k}>`,N=document,T=()=>N.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,M="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,j=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,W=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,Z=N.createTreeWalker(N,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(o.lastIndex=d,l=o.exec(s),null!==l);)d=o.lastIndex,o===R?"!--"===l[1]?o=H:void 0!==l[1]?o=D:void 0!==l[2]?(W.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=r??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?j:'"'===l[3]?B:L):o===B||o===L?o=j:o===H||o===D?o=R:(o=j,r=void 0);const h=o===j&&t[e+1].startsWith("/>")?" ":"";n+=o===R?s+P:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+O+h):s+O+(-2===c?e:h)}return[J(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class G{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=G.createElement(l,s),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Z.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[n++],s=i.getAttribute(t).split(O),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?et:"?"===o[1]?st:"@"===o[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(O)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(W.test(i.tagName)){const t=i.textContent.split(O),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),Z.nextNode(),a.push({type:2,index:++r});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(O,t+1));)a.push({type:7,index:r}),t+=O.length-1}r++}}static createElement(t,e){const s=N.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===I)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??N).importNode(e,!0);Z.currentNode=i;let r=Z.nextNode(),n=0,o=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=s[++o]}n!==a?.index&&(r=Z.nextNode(),n++)}return Z.currentNode=N,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),z(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Y(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=Q(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const i=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Q(this,i[s+o],e,o),a===I&&(a=this._$AH[o]),n||=!z(a)||a!==this._$AH[o],a===V?t=V:t!==V&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends tt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===I)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,Y),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Y(e.insertBefore(T(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const lt=ot.litElementPolyfillSupport;lt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:b},dt=(t=ct,e,s)=>{const{kind:i,metadata:r}=s;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?dt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=/^sf_(dp\d+|ac5|ac10)_/;function ft(t){return t.split(".")[1]??""}function mt(t){const e=new Set;for(const s of Object.keys(t.states)){const t=ft(s).match(ut);t&&e.add(t[1])}return[...e].sort()}function gt(t){return mt(t).filter(e=>Object.keys(t.states).some(t=>{const s=ft(t);return s===`sf_${e}_temperature`||s===`sf_${e}_soil_avg_temperature`||s===`sf_${e}_light_1`||s===`sf_${e}_fan`||s===`sf_${e}_blower`}))}function $t(t,e){const s=`sf_${e}_`,i=Object.keys(t.states);return i.find(t=>ft(t)===`sf_${e}_temperature`)??i.find(t=>{const i=ft(t);return i.startsWith(s)&&!i.startsWith(`sf_${e}_env_`)})}function vt(t,e){const s=$t(t,e);return s?t.entities?.[s]?.device_id:void 0}function _t(t,e){if(!e)return[];const s=vt(t,e);return function(t){return mt(t).filter(e=>!!t.states[`switch.sf_${e}_outlet_1`])}(t).filter(i=>{if(i===e)return!0;if(!s)return!1;const r=vt(t,i),n=r?t.devices?.[r]:void 0;return n?.via_device_id===s})}function bt(t,e){if(!t||!e)return"";const s=$t(t,e);if(!s)return"";const i=t.entities?.[s]?.device_id,r=i?t.devices?.[i]:void 0;if(r)return r.name_by_user||r.name||"";const n=(t.states[s].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return n?n[1]:""}const yt=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","VPD","mdi:water-opacity"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],xt=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],wt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],St=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],At=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class Et extends at{constructor(){super(...arguments),this.tab="overview",this.soilOpen=null,this.soilAllOpen=!1}setConfig(t){if(!t.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=t;const e=t.default_tab;this.tab="environment"===e||"config"===e?"env":"outlets"===e?"outlets":"calibration"===e||"cali"===e?"cali":"overview"}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(t){const e=(t?gt(t):[])[0]||"dp1",s=t?_t(t,e):[];return{type:"custom:spider-farmer-card",panel:e,...s.length?{outlets:s}:{}}}eid(t,e){return`${t}.sf_${this.config.panel}_${e}`}get(t){return this.hass?.states[t]}accent(){return this.config.accent||"#ff7a1a"}shouldUpdate(t){return t.has("config")||t.has("hass")||t.has("tab")||t.has("soilOpen")||t.has("soilAllOpen")}renderParam([t,e,s]){const i=this.get(`sensor.sf_${this.config.panel}_${t}`);if(!i)return V;const r=i.attributes.unit_of_measurement||"",n=this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(r,"").trim():i.state,o=t.startsWith("soil_avg_")?t.slice(9):null,a=!!o&&this.soilProbeRows(o).length>1,l=a&&this.soilOpen===o;return F`
      <div class="tile ${a?"clickable":""} ${l?"active":""}"
        style=${l?`box-shadow:inset 0 0 0 1px ${this.accent()}`:""}
        role=${a?"button":V}
        @click=${a?()=>this.soilOpen=l?null:o:void 0}>
        <div class="tile-label">
          ${e}${a?F`<ha-icon class="tile-more"
                icon=${l?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:V}
        </div>
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val">${n}<span class="unit">${r}</span></div>
      </div>`}soilProbeRows(t){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${t}$`),s=[];for(const i of Object.keys(this.hass?.states??{})){const r=ft(i).match(e);r&&s.push({slot:r[1],name:this.soilSensorName(i,t),e:this.hass.states[i]})}return s.sort((t,e)=>Number(t.slot.replace(/\D/g,""))-Number(e.slot.replace(/\D/g,""))),s.map(({name:t,e:e})=>({name:t,e:e}))}soilSensorName(t,e){let s=this.hass?.states[t]?.attributes.friendly_name??"";const i=bt(this.hass,this.config.panel);i&&s.startsWith(i)&&(s=s.slice(i.length).trim());const r="temperature"===e?"Temperature":"moisture"===e?"Moisture":"EC";return s=s.replace(new RegExp(`\\s*${r}\\s*$`,"i"),"").trim(),s||ft(t)}renderSoilPop(){const t=this.soilOpen;if(!t)return V;const e=this.soilProbeRows(t);if(!e.length)return V;return F`
      <div class="soil-pop">
        <div class="soil-pop-head">
          <span>${"temperature"===t?"Soil Temperature":"moisture"===t?"Soil Moisture":"Soil EC"} · by probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${e.map(({name:t,e:e})=>{const s=e.attributes.unit_of_measurement||"",i=this.hass?.formatEntityState?this.hass.formatEntityState(e).replace(s,"").trim():e.state;return F`
            <div class="soil-pop-row">
              <span class="spn">${t}</span>
              <span class="spv">${i}<span class="unit">${s}</span></span>
            </div>`})}
      </div>`}soilProbeSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=ft(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}soilCellValue(t,e){const s=this.get(`sensor.sf_${this.config.panel}_${t}_${e}`);return s&&"unknown"!==s.state&&"unavailable"!==s.state?this.hass?.formatEntityState?this.hass.formatEntityState(s):`${s.state}${s.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(t){for(const e of["temperature","moisture","ec"]){const s=`sensor.sf_${this.config.panel}_${t}_${e}`;if(this.hass?.states[s])return this.soilSensorName(s,e)}return t.replace(/^soil(\d+)$/,"Soil $1")}renderSoilAll(){const t=this.soilProbeSlots();if(t.length<2)return V;const e=this.soilAllOpen;return F`
      <div class="section-label soil-all-head" role="button"
        aria-expanded=${e?"true":"false"}
        @click=${()=>this.soilAllOpen=!e}>
        <span>All Soil Sensors Stats</span>
        <ha-icon icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${e?F`
            <div class="soil-all">
              <div class="soil-all-row soil-all-hd">
                <span class="sa-name">Probe</span>
                <span class="sa-v">Temp</span>
                <span class="sa-v">WC</span>
                <span class="sa-v">EC</span>
              </div>
              ${t.map(t=>F`
                  <div class="soil-all-row">
                    <span class="sa-name">${this.probeNameForSlot(t)}</span>
                    <span class="sa-v">${this.soilCellValue(t,"temperature")}</span>
                    <span class="sa-v">${this.soilCellValue(t,"moisture")}</span>
                    <span class="sa-v">${this.soilCellValue(t,"ec")}</span>
                  </div>`)}
            </div>`:V}`}renderLight([t,e,s]){const i=this.eid("light",t),r=this.get(i);if(!r)return V;const n="on"===r.state,o=Math.round((r.attributes.brightness??0)/255*100);return F`
      <div class="row">
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="row-body">
          <div class="row-label">${e}</div>
          <input type="range" min="11" max="100" .value=${n?String(o):"0"}
            style="accent-color:${this.accent()}"
            @change=${t=>this.setBrightness(i,t)} />
        </div>
        <span class="row-val" style="color:${this.accent()}">${n?o+"%":"off"}</span>
      </div>`}renderFan([t,e,s]){const i=this.eid("fan",t),r=this.get(i);if(!r)return V;const n="on"===r.state,o=Math.round(r.attributes.percentage??0);return F`
      <div class="row">
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="row-body">
          <div class="row-label">${e}</div>
          <input type="range" min="0" max="100" .value=${String(n?o:0)}
            style="accent-color:${this.accent()}"
            @change=${t=>this.setPercent(i,t)} />
        </div>
        <button class="toggle ${n?"on":""}" style=${n?`background:${this.accent()}`:""}
          @click=${()=>this.hass?.callService("fan","toggle",{entity_id:i})}
          aria-label="Toggle ${e}"></button>
      </div>`}renderClimate([t,e,s]){const i=this.eid("switch",t),r=this.get(i);if(!r)return V;const n="on"===r.state;return F`
      <div class="row">
        <ha-icon icon="${s}" style="color:${this.accent()}"></ha-icon>
        <div class="row-label" style="flex:1">${e}</div>
        <button class="toggle ${n?"on":""}" style=${n?`background:${this.accent()}`:""}
          @click=${()=>this.hass?.callService("switch","toggle",{entity_id:i})}
          aria-label="Toggle ${e}"></button>
      </div>`}setBrightness(t,e){const s=Number(e.target.value);s<=0?this.hass?.callService("light","turn_off",{entity_id:t}):this.hass?.callService("light","turn_on",{entity_id:t,brightness_pct:s})}setPercent(t,e){const s=Number(e.target.value);this.hass?.callService("fan","set_percentage",{entity_id:t,percentage:s})}renderOverview(){const t=yt.map(t=>this.renderParam(t)).filter(t=>t!==V),e=xt.map(t=>this.renderLight(t)).filter(t=>t!==V),s=wt.map(t=>this.renderFan(t)).filter(t=>t!==V),i=St.map(t=>this.renderClimate(t)).filter(t=>t!==V),r=[...e,...s,...i];return F`
      ${t.length?F`<div class="section-label">Parameters</div>
            <div class="grid">${t}</div>
            ${this.renderSoilPop()}`:V}
      ${this.renderSoilAll()}
      ${r.length?F`<div class="section-label">Devices</div>
            <div class="controls">${r}</div>`:V}`}renderControl(t,e){const s=this.get(t);if(!s)return V;const i=t.split(".")[0],r=e??s.attributes.friendly_name??t.split(".")[1];let n;return n="number"===i?this.numberControl(t,s):"select"===i?this.selectControl(t,s):"text"===i?this.textControl(t,s):"switch"===i?this.switchControl(t,s):F`<span class="ctl-val">${s.state}</span>`,F`
      <div class="ctl">
        <div class="ctl-label">${r}</div>
        <div class="ctl-input">${n}</div>
      </div>`}numberControl(t,e){const s=e.attributes.min??0,i=e.attributes.max??100,r=e.attributes.step??1,n=e.attributes.unit_of_measurement??"",o="slider"===e.attributes.mode,a="unknown"===e.state||"unavailable"===e.state?"":e.state;return o?F`
        <div class="slider-wrap">
          <input type="range" min=${s} max=${i} step=${r}
            .value=${String(a)} style="accent-color:${this.accent()}"
            @change=${e=>this.setNumber(t,e)} />
          <span class="slider-val" style="color:${this.accent()}">${a}${n}</span>
        </div>`:F`
      <span class="num-box">
        <input type="number" min=${s} max=${i} step=${r}
          .value=${String(a)} @change=${e=>this.setNumber(t,e)} />
        <span class="unit">${n}</span>
      </span>`}selectControl(t,e){const s=e.attributes.options??[];return F`
      <select @change=${e=>this.setSelect(t,e)}>
        ${s.map(t=>F`<option value=${t} ?selected=${t===e.state}>${t}</option>`)}
      </select>`}textControl(t,e){const s="unknown"===e.state||"unavailable"===e.state?"":e.state,i=/^\d{1,2}:\d{2}$/.test(s);return F`
      <input type=${i?"time":"text"} .value=${s}
        @change=${e=>this.setText(t,e)} />`}switchControl(t,e){const s="on"===e.state;return F`
      <button class="toggle ${s?"on":""}"
        style=${s?`background:${this.accent()}`:""}
        @click=${()=>this.hass?.callService("switch","toggle",{entity_id:t})}
        aria-label="Toggle"></button>`}setNumber(t,e){const s=Number(e.target.value);Number.isNaN(s)||this.hass?.callService("number","set_value",{entity_id:t,value:s})}setSelect(t,e){const s=e.target.value;this.hass?.callService("select","select_option",{entity_id:t,option:s})}setText(t,e){const s=e.target.value;this.hass?.callService("text","set_value",{entity_id:t,value:s})}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const t=this.config.outlets??[];if(!this.hass)return t;const e=new Set(_t(this.hass,this.config.panel));return t.filter(t=>e.has(t))}hasOutlets(){return this.outletSlots().some(t=>{for(let e=1;e<=10;e++)if(this.get(`select.sf_${t}_outlet_${e}_mode`))return!0;return!1})}renderEnv(){const t=this.config.panel;if(!this.hasEnv())return V;const e=`text.sf_${t}_env_day_start`,s=`text.sf_${t}_env_day_end`,i=this.get(e)||this.get(s);return F`
      <div class="section-label">Environment</div>
      ${i?F`<div class="env-cycle">
            ${this.renderControl(e,"Day Cycle Start")}
            ${this.renderControl(s,"Day Cycle Stop")}
          </div>`:V}
      ${At.map(([e,s,i,r,n])=>this.get(`number.sf_${t}_${s}`)?F`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${n} style="color:${this.accent()}"></ha-icon>
              <span>${e}</span>
            </div>
            <div class="env-grid">
              ${this.renderControl(`number.sf_${t}_${s}`,"Day")}
              ${this.renderControl(`number.sf_${t}_${i}`,"Night")}
              ${this.renderControl(`number.sf_${t}_${r}`,"Dead Zone")}
            </div>
          </div>`:V)}`}renderOutlets(){const t=this.outletSlots().flatMap(t=>this.renderSlotOutlets(t));return t.length?F`<div class="section-label">Outlets</div>${t}`:V}renderSlotOutlets(t){const e=[];for(let s=1;s<=10;s++){const i=`select.sf_${t}_outlet_${s}_mode`;if(!this.get(i))continue;const r=`switch.sf_${t}_outlet_${s}`,n=`sf_${t}_outlet_${s}_`,o=Object.keys(this.hass?.states??{}).filter(t=>{const e=t.split(".")[1]??"";return e.startsWith(n)&&e!==`${n}mode`}).sort(),a=this.get(r);e.push(F`
        <div class="outlet">
          <div class="outlet-head">
            <span class="outlet-name">Outlet ${s}</span>
            ${a?this.switchControl(r,a):V}
          </div>
          <div class="outlet-body">
            ${this.renderControl(i,"Mode")}
            ${o.map(t=>this.renderControl(t))}
          </div>
        </div>`)}return e}caliSoilSlots(){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),e=new Set;for(const s of Object.keys(this.hass?.states??{})){const i=ft(s).match(t);i&&e.add(i[1])}return[...e].sort((t,e)=>Number(t.replace(/\D/g,""))-Number(e.replace(/\D/g,"")))}hasCali(){return!!this.get(`number.sf_${this.config.panel}_cal_air_temp`)||this.caliSoilSlots().length>0}probeName(t){const e=this.get(`number.sf_${this.config.panel}_${t}_cal_temp`);let s=e?.attributes.friendly_name??"";const i=bt(this.hass,this.config.panel);return i&&s.startsWith(i)&&(s=s.slice(i.length).trim()),s=s.replace(/\s*Temp Calibration\s*$/i,"").trim(),s||t.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const t=this.config.panel,e=[[`number.sf_${t}_cal_air_temp`,"Air Temp"],[`number.sf_${t}_cal_air_humidity`,"Air Humidity"],[`number.sf_${t}_cal_ppfd`,"PPFD"],[`number.sf_${t}_cal_co2`,"CO2"]].map(([t,e])=>this.renderControl(t,e)).filter(t=>t!==V),s=this.caliSoilSlots().map(e=>{const s=[this.renderControl(`number.sf_${t}_${e}_cal_temp`,"Temp"),this.renderControl(`number.sf_${t}_${e}_cal_moisture`,"Moisture"),this.renderControl(`number.sf_${t}_${e}_cal_ec`,"EC")].filter(t=>t!==V),i=this.renderControl(`select.sf_${t}_${e}_substrate`,"Substrate");return F`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(e)}</span>
          </div>
          <div class="env-grid">${s}</div>
          ${i!==V?F`<div class="cali-sub">${i}</div>`:V}
        </div>`});return e.length||s.length?F`
      ${e.length?F`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${e}</div>`:V}
      ${s.length?F`<div class="section-label">Soil Calibration</div>${s}`:V}`:F`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`}render(){if(!this.hass||!this.config)return V;const t=this.hasEnv(),e=this.hasOutlets(),s=this.hasCali();let i=this.tab;"env"!==i||t||(i="overview"),"outlets"!==i||e||(i="overview"),"cali"!==i||s||(i="overview");const r=t||e||s,n=this.accent(),o=(t,e)=>F`<button class="tab ${i===t?"active":""}"
        style=${i===t?`color:${n};border-color:${n}`:""}
        @click=${()=>this.tab=t}>${e}</button>`,a=bt(this.hass,this.config.panel);return F`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||"Spider Farmer"}</span>
          ${a?F`<span class="device">${a}</span>`:V}
        </div>
        ${r?F`<div class="tabs">
              ${o("overview","Overview")}
              ${t?o("env","Environment"):V}
              ${e?o("outlets","Outlets"):V}
              ${s?o("cali","Calibration"):V}
            </div>`:V}
        ${"env"===i?this.renderEnv():"outlets"===i?this.renderOutlets():"cali"===i?this.renderCali():this.renderOverview()}
      </ha-card>`}}Et.styles=o`
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
      /* Narrow screens can't fit four tabs — scroll instead of clipping the
         last one. Scrollbar hidden; swipe to reach off-screen tabs. */
      overflow-x: auto; scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar { display: none; }
    .tab {
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 12px; cursor: pointer; margin-bottom: -1px;
      white-space: nowrap; flex: 0 0 auto;
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
    .tile-label {
      font-size: 11px; color: var(--secondary-text-color);
      display: flex; align-items: center; gap: 3px;
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
    .num-box { display: flex; align-items: center; gap: 4px; width: 100%; }
    .num-box input[type="number"] { flex: 1 1 auto; min-width: 0; }
    .num-box .unit { flex: 0 0 auto; }
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
  `,t([ht({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"config",void 0),t([pt()],Et.prototype,"tab",void 0),t([pt()],Et.prototype,"soilOpen",void 0),t([pt()],Et.prototype,"soilAllOpen",void 0);class Ct extends at{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(t){this._config={...t}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_panelChanged(t){const e=t.target.value,s={...this._config};e?s.panel=e:delete s.panel,this._emit(s)}_titleChanged(t){const e=t.target.value.trim(),s={...this._config};e?s.title=e:delete s.title,this._emit(s)}_tabChanged(t){const e=t.target.value;this._emit({...this._config,default_tab:e})}_outletToggled(t,e){const s=e.target.checked,i=new Set(this._config.outlets??[]);s?i.add(t):i.delete(t);const r=[...i].sort(),n={...this._config};r.length?n.outlets=r:delete n.outlets,this._emit(n)}render(){if(!this.hass)return V;const t=this._config,e=t.default_tab,s=gt(this.hass),i=_t(this.hass,t.panel),r=t=>{const e=bt(this.hass,t);return e?`${t} — ${e}`:t};return F`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${s.length?V:F`<option value="">(no devices found yet)</option>`}
            ${t.panel?V:F`<option value="" selected>— choose a device —</option>`}
            ${s.map(e=>F`<option value=${e} ?selected=${e===t.panel}>${r(e)}</option>`)}
            ${t.panel&&!s.includes(t.panel)?F`<option value=${t.panel} selected>${t.panel} (not found)</option>`:V}
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
          </select>
        </label>

        ${i.length?F`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${i.map(e=>F`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(t.outlets??[]).includes(e)}
                          @change=${t=>this._outletToggled(e,t)} />
                        <span>${r(e)}</span>
                      </label>`)}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`:V}
      </div>`}}Ct.styles=o`
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
  `,t([ht({attribute:!1})],Ct.prototype,"hass",void 0),t([pt()],Ct.prototype,"_config",void 0),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",Et),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",Ct),window.customCards=window.customCards||[],window.customCards.push({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.6.1 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px");export{Et as SpiderFarmerCard,Ct as SpiderFarmerCardEditor};
