/*! spider-farmer-card v0.21.134 | MIT */
function e(e,t,i,s){var o,a=arguments.length,n=a<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new a(i,e,s)},r=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,b=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const a=s?.call(this);o?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=s;const a=o.fromAttribute(t,e.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const a=this.constructor;if(!1===s&&(o=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??y)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==o||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,v?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,S=e=>e,k=w.trustedTypes,O=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,D="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+T,M=`<${C}>`,P=document,A=()=>P.createComment(""),L=e=>null===e||"object"!=typeof e&&"function"!=typeof e,E=Array.isArray,N="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,R=/>/g,B=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,I=/"/g,G=/^(?:script|style|textarea|title)$/i,W=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=W(1),Q=W(2),K=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),q=new WeakMap,U=P.createTreeWalker(P,129);function Z(e,t){if(!E(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==O?O.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let o,a=2===t?"<svg>":3===t?"<math>":"",n=F;for(let t=0;t<i;t++){const i=e[t];let r,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===F?"!--"===l[1]?n=z:void 0!==l[1]?n=R:void 0!==l[2]?(G.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=B):void 0!==l[3]&&(n=B):n===B?">"===l[0]?(n=o??F,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?B:'"'===l[3]?I:H):n===I||n===H?n=B:n===z||n===R?n=F:(n=B,o=void 0);const h=n===B&&e[t+1].startsWith("/>")?" ":"";a+=n===F?i+M:d>=0?(s.push(r),i.slice(0,d)+D+i.slice(d)+T+h):i+T+(-2===d?t:h)}return[Z(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,a=0;const n=e.length-1,r=this.parts,[l,d]=J(e,t);if(this.el=Y.createElement(l,i),U.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=U.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(D)){const t=d[a++],i=s.getAttribute(e).split(T),n=/([.?@])?(.*)/.exec(t);r.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?oe:"@"===n[1]?ae:ie}),s.removeAttribute(e)}else e.startsWith(T)&&(r.push({type:6,index:o}),s.removeAttribute(e));if(G.test(s.tagName)){const e=s.textContent.split(T),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],A()),U.nextNode(),r.push({type:2,index:++o});s.append(e[t],A())}}}else if(8===s.nodeType)if(s.data===C)r.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(T,e+1));)r.push({type:7,index:o}),e+=T.length-1}o++}}static createElement(e,t){const i=P.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===K)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=L(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(t,!0);U.currentNode=s;let o=U.nextNode(),a=0,n=0,r=i[0];for(;void 0!==r;){if(a===r.index){let t;2===r.type?t=new te(o,o.nextSibling,this,e):1===r.type?t=new r.ctor(o,r.name,r.strings,this,e):6===r.type&&(t=new ne(o,this,e)),this._$AV.push(t),r=i[++n]}a!==r?.index&&(o=U.nextNode(),a++)}return U.currentNode=P,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),L(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>E(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new Y(e)),t}k(e){E(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new te(this.O(A()),this.O(A()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=S(e).nextSibling;S(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,s){const o=this.strings;let a=!1;if(void 0===o)e=X(this,e,t,0),a=!L(e)||e!==this._$AH&&e!==K,a&&(this._$AH=e);else{const s=e;let n,r;for(e=o[0],n=0;n<o.length-1;n++)r=X(this,s[i+n],t,n),r===K&&(r=this._$AH[n]),a||=!L(r)||r!==this._$AH[n],r===j?e=j:e!==j&&(e+=(r??"")+o[n+1]),this._$AH[n]=r}a&&!s&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class oe extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ae extends ie{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??j)===K)return;const i=this._$AH,s=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(Y,te),(w.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let de=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new te(t.insertBefore(A(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:y},pe=(e=he,t,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ue(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ge(e){return ue({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=1,fe=3,ve=4;class be{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e={},ye=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends be{constructor(e){if(super(e),e.type!==fe&&e.type!==me&&e.type!==ve)throw Error("The `live` directive is not allowed on child or event bindings");if(!(e=>void 0===e.strings)(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===K||t===j)return t;const i=e.element,s=e.name;if(e.type===fe){if(t===i[s])return K}else if(e.type===ve){if(!!t===i.hasAttribute(s))return K}else if(e.type===me&&i.getAttribute(s)===t+"")return K;return((e,t=_e)=>{e._$AH=t;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(e),t}});const $e={de:{" (this card)":" (diese Karte)"," kWh":" kWh"," — scroll for more":" – weitere beim Scrollen","(Environment / PPFD). A":"(Umgebung / PPFD). Eine","(an active alarm wins; targets colour everything else). Targets add a small “target …” line to Temp / Humidity / CO2 tiles.":"(ein aktiver Alarm hat Vorrang; die Ziele färben alles andere). Ziele fügen den Kacheln Temperatur / Feuchte / CO2 eine kleine Zeile „Ziel …“ hinzu.","(min)":"(min)","(no devices found yet)":"(noch keine Geräte gefunden)","(the controller's alarm limits on the Alerts tab),":"(die Alarmgrenzen des Controllers im Reiter Alarme),","(the environment day/night target ± dead zone), or":"(das Tag-/Nachtziel der Umgebung ± Spielraum) oder",") so you can drive the outlets from your own automations.":"), damit du die Steckdosen mit eigenen Automationen steuern kannst.",") to:":") auf:","+ Add period":"+ Abschnitt hinzufügen","+ Add slot":"+ Zeitfenster hinzufügen","+ Add stage":"+ Phase hinzufügen","+ From template":"+ Aus Vorlage",". Off outlets stay neutral.":". Ausgeschaltete Steckdosen bleiben neutral.",". Saved to the controller, so it sticks across upgrades and your other devices.":". Wird im Controller gespeichert und bleibt so über Updates und auf deinen anderen Geräten erhalten.","/media/… (never /www)":"/media/… (nie /www)","1 day":"1 Tag","1 hour":"1 Stunde","1 hr":"1 Std.","12-hour time (AM/PM)":"12-Stunden-Uhr (AM/PM)","3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W":"3D-PPFD-Ansicht für Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W",": also keep the averaged tiles and All Soil Stats.":": die gemittelten Kacheln und „Alle Bodenwerte“ zusätzlich behalten.",": keep just the All Soil Stats summary tile above the per-sensor tiles.":": nur die Übersichtskachel „Alle Bodenwerte“ über den Sensor-Kacheln behalten.",": show only the per-sensor tiles.":": nur die Kacheln je Sensor zeigen.","A phantom Light 2 or Fan tile? Manage per-device accessories in the integration: Settings → Devices & services → Spider Farmer Bridge → Configure → “Device accessories”. HA then skips the entity entirely.":"Eine Phantom-Kachel Licht 2 oder Umluft? Das Zubehör je Gerät stellst du in der Integration ein: Einstellungen → Geräte & Dienste → Spider Farmer Bridge → Konfigurieren → „Gerätezubehör“. HA legt die Entität dann gar nicht erst an.","Above max":"Über max","Above target":"Über dem Ziel","Accent colour":"Akzentfarbe",Active:"Aktiv","Add a stage from a template":"Phase aus einer Vorlage hinzufügen",'Adds a "Device Log" tab with a 24h/7d on-off timeline per device (lights, fan, blower, heater, humidifier, dehumidifier) from Home Assistant\'s recorder history. Tap a row for its recent events.':"Fügt einen Reiter „Geräteprotokoll“ mit einer Ein-/Aus-Zeitleiste über 24 h/7 T je Gerät hinzu (Lichter, Umluft, Abluft, Heizung, Luftbefeuchter, Luftentfeuchter), aus dem Verlauf von Home Assistant. Tippe auf eine Zeile für die letzten Ereignisse.",'Adds a "Time-lapse" tab to this panel\'s card for a grow time-lapse. Pick its camera in the tab; it reuses the Spider Time-lapse card (frames, scrub/play, MP4 export, env overlay).':"Fügt der Karte dieses Panels einen Reiter „Zeitraffer“ hinzu. Die Kamera wählst du im Reiter; er nutzt die Spider-Zeitraffer-Karte (Bilder, Vor-/Zurückspulen, MP4-Export, Klima-Einblendung).",'Adds a "VPD" tab with a vibrant temperature × humidity phase chart (grid or trend) plus growth-stage targets. Uses this panel\'s air temp + humidity — no extra entities.':"Fügt einen Reiter „VPD“ mit einem farbigen Temperatur-×-Feuchte-Diagramm (Raster oder Verlauf) und Zielen je Wachstumsphase hinzu. Nutzt Lufttemperatur und Luftfeuchte dieses Panels – keine zusätzlichen Entitäten.",'Adds an "Outlets Log" tab with a 24h/7d on-off timeline per outlet (from Home Assistant\'s recorder history). Tap a row to see its recent switch events.':"Fügt einen Reiter „Steckdosenprotokoll“ mit einer Ein-/Aus-Zeitleiste über 24 h/7 T je Steckdose hinzu (aus dem Verlauf von Home Assistant). Tippe auf eine Zeile für die letzten Schaltvorgänge.","Adds the quick-toggle row(s) as full-width bars in the panel — draggable in Rearrange like any tile.":"Zeigt die Schnellschalter-Zeile(n) als Balken über die ganze Breite – beim Anordnen verschiebbar wie jede Kachel.",Aeration:"Belüftung","Air Calibration":"Luft-Kalibrierung","Air Humi":"Luftfeuchte","Air Humidity":"Luftfeuchtigkeit","Air Temp":"Lufttemp.","Air VPD":"Luft-VPD","Air {temp} · RH {rh}%":"Luft {temp} · rF {rh}%",Alarm:"Alarm","Alarm when the reading leaves the set range.":"Alarm, wenn der Wert den eingestellten Bereich verlässt.",Alarms:"Alarme",Alerts:"Alarme",All:"Alle","All Soil Stats":"Alle Bodenwerte","All together":"Alle zusammen","Also plots leaf VPD (from the leaf-VPD sensor) alongside air VPD on the tab.":"Zeigt im Reiter zusätzlich zum Luft-VPD auch das Blatt-VPD (vom Blatt-VPD-Sensor).",Amps:"Ampere",Apply:"Übernehmen","Apply appearance to":"Aussehen anwenden auf","Apply to {n} outlet":"Auf {n} Steckdose übernehmen","Apply to {n} outlets":"Auf {n} Steckdosen übernehmen","Apply {outlet}'s settings":"Einstellungen von {outlet} übernehmen",Auto:"Auto","Auto (first found)":"Auto (erstes gefundenes)","Auto (follow HA)":"Auto (wie HA)","Auto from the selected light's schedule — {hours}h. Uncheck “Auto-read brightness from a light” to set hours manually.":"Automatisch aus dem Zeitplan des gewählten Lichts – {hours} h. Schalte „Helligkeit automatisch von einem Licht lesen“ aus, um die Stunden selbst einzustellen.","Auto-read brightness from a light":"Helligkeit automatisch von einem Licht lesen",Automatic:"Automatisch",Average:"Mittelwert",Averaged:"Gemittelt","Averaged tiles & stats":"Gemittelte Kacheln & Werte","Avg canopy":"Ø Blätterdach","Avg {value}":"Ø {value}",Background:"Hintergrund","Below min":"Unter min","Below target":"Unter dem Ziel",Blower:"Abluft","Blower (Humidity Priority)":"Abluft (Feuchte zuerst)","Blower (Temperature Priority)":"Abluft (Temperatur zuerst)",Border:"Rahmen","Border width":"Rahmenbreite",Both:"Beides",Brightness:"Helligkeit","Brightness (%)":"Helligkeit (%)","Brightness dial, mode, and schedule for a Spider Farmer SE-series light":"Helligkeitsregler, Modus und Zeitplan für ein Licht der Spider-Farmer-SE-Serie","Burn into video":"Ins Video brennen","CO2 Injection":"CO2-Begasung","CO₂":"CO₂","Calibrate from 5 readings":"Aus 5 Messungen kalibrieren",Calibration:"Kalibrierung",Camera:"Kamera","Camera time-lapse for the Spider Farmer Bridge — capture, scrub, env overlay, export":"Kamera-Zeitraffer für die Spider Farmer Bridge – Aufnahme, Spulen, Klima-Einblendung, Export",Cancel:"Abbrechen","Capture daily at":"Täglich aufnehmen um","Capture daily at (time of day)":"Täglich aufnehmen um (Uhrzeit)","Capturing…":"Nimmt auf…","Center PPFD":"PPFD Mitte",Cleaning:"Reinigung","Cleaning sensor…":"Sensor wird gereinigt…",Climate:"Klima","Cloning and seedling":"Stecklinge und Sämlinge",Close:"Schließen","Close CO2 Device":"CO2-Gerät schließen","Closing Time":"Ausschaltzeit","Collapse the row of tabs for a compact card. Tap the card title (its name in the header) to show or hide the tabs again at any time.":"Blendet die Reiterleiste aus, damit die Karte kompakter ist. Tippe auf den Kartentitel (den Namen oben), um die Reiter jederzeit wieder ein- oder auszublenden.","Colour a device tile while it's on, by its mode —":"Eine Gerätekachel einfärben, solange das Gerät an ist, je nach Modus –","Colour a reading that's":"Einen Wert einfärben, der","Colour an Overview reading when it crosses its alarm limits —":"Einen Wert in der Übersicht einfärben, wenn er seine Alarmgrenzen überschreitet –","Colour an outlet tile while it's on, by its mode —":"Eine Steckdosenkachel einfärben, solange sie an ist, je nach Modus –","Colour by":"Einfärben nach","Colours & tile appearance":"Farben & Kachel-Aussehen","Colours the Leaf VPD tile when it drifts outside this band, using the Settings-tab highlight colours.":"Färbt die Kachel Blatt-VPD ein, wenn der Wert diesen Bereich verlässt – in den Hervorhebungsfarben aus dem Reiter Einstellungen.","Compressor lockout after turning off — it can't restart until this reaches 0:00":"Kompressorsperre nach dem Ausschalten – er kann erst wieder starten, wenn hier 0:00 steht",Cooldown:"Abkühlen","Cooldown length":"Abkühldauer",Cooler:"Kühlung",Cooling:"Kühlen","Cooling sensor…":"Sensor kühlt ab…","Copy another outlet's settings into this one":"Einstellungen einer anderen Steckdose hierher kopieren","Copy from…":"Kopieren von…","Copy settings into {outlet} from:":"Einstellungen nach {outlet} kopieren von:","Copy this outlet's settings to others":"Einstellungen dieser Steckdose auf andere kopieren","Copy to…":"Kopieren nach…","Corner radius":"Eckenradius","Create a plan here, or in the Spider Farmer app. While a plan runs the manual Environment targets pause.":"Lege hier oder in der Spider-Farmer-App einen Plan an. Solange ein Plan läuft, ruhen die manuellen Umgebungsziele.",Current:"Aktuell","Current PPFD":"PPFD aktuell",Custom:"Eigene","Custom band (kPa):":"Eigener Bereich (kPa):","Custom folder":"Eigener Ordner","Custom layout":"Eigene Anordnung","Custom outlet names":"Eigene Steckdosennamen","Custom…":"Eigene…",Cycle:"Zyklus","DLI @ {hours}h":"DLI bei {hours} h","DLI · duration":"DLI · Dauer",Date:"Datum",Day:"Tag","Day Cycle":"Tagphase","Day Cycle Start":"Tagphase Beginn","Day Cycle Stop":"Tagphase Ende","Day {n}":"Tag {n}",Daytime:"Tagsüber",Dead:"Spielraum","Dead Zone":"Spielraum","Dead-zone band":"Spielraum-Band","Deadband % (turn on above target+this)":"Spielraum % (einschalten über Ziel + diesem Wert)","Default tab":"Startreiter",Defaults:"Standardwerte",Dehumidification:"Entfeuchtung",Dehumidifier:"Luftentfeuchter","Dehumidifier cooldown timer":"Abkühlzeit Luftentfeuchter",Dehumidifying:"Entfeuchten",Delete:"Löschen","Delete ALL {n} image(s) and exported videos for {name}? This cannot be undone.":"ALLE {n} Bilder und exportierten Videos von {name} löschen? Das lässt sich nicht rückgängig machen.","Delete all images":"Alle Bilder löschen","Delete period":"Abschnitt löschen","Delete slot":"Zeitfenster löschen","Delete this stage?":"Diese Phase löschen?","Delete this time-lapse and its images":"Diesen Zeitraffer und seine Bilder löschen","Delete?":"Löschen?",Device:"Gerät","Device Log":"Geräteprotokoll","Device Type":"Gerätetyp","Device active color":"Farbe aktiver Geräte","Device mode summary":"Modus-Zusammenfassung je Gerät","Device tiles":"Gerätekacheln",Devices:"Geräte","Dim max":"Dimmen max","Dim min":"Dimmen min","Dimming Range Max":"Dimmbereich max","Dimming Range Min":"Dimmbereich min",Discard:"Verwerfen","Download MP4":"MP4 herunterladen","Drag Overview tiles to reorder them and close gaps, or tap a tile's eye icon to hide it. Opens Overview in rearrange mode; changes save on Apply.":"Ziehe Kacheln in der Übersicht, um sie umzusortieren und Lücken zu schließen, oder tippe auf das Augen-Symbol, um eine Kachel auszublenden. Öffnet die Übersicht im Anordnen-Modus; gespeichert wird mit Übernehmen.","Drag each reading on the image to place it independently.":"Ziehe jeden Wert auf dem Bild an seine eigene Stelle.","Drag to rearrange; tap the eye to hide a tile. Changes save on Apply.":"Zum Umsortieren ziehen; Auge antippen blendet eine Kachel aus. Gespeichert wird mit Übernehmen.",Drip:"Tropf","Drip Irrigation":"Tropfbewässerung",Dry:"Trocknen","Ease back to Low within % of target":"Zurück auf Niedrig innerhalb von % am Ziel","Edge PPFD":"PPFD Rand","Edges, border, and background for every tile.":"Ecken, Rahmen und Hintergrund für jede Kachel.","Enable Leaf VPD":"Blatt-VPD einschalten","Enable VPD graph":"VPD-Diagramm einschalten","Enable capture":"Aufnahme einschalten","Enable smart humidity control":"Smarte Feuchteregelung einschalten","Energy Usage":"Energieverbrauch","Env overlay":"Klima-Einblendung",Environment:"Umgebung","Escalate to High after":"Auf Hoch schalten nach","Execution Times":"Ausführungen",Exhaust:"Abluft","Exhaust fan":"Abluftventilator","Export MP4":"MP4 exportieren","Export failed: {error}":"Export fehlgeschlagen: {error}","Exporting…":"Exportiert…","External sensor":"Externer Sensor",Fan:"Umluft","First frame at {time} · in {left}":"Erstes Bild um {time} · in {left}","Flowering period":"Blütephase",Follows:"Folgt","Follows the environment day/night cycle (from Environment/Planting Plan): on during the selected phase, off in the other. The integration drives it.":"Folgt dem Tag-/Nacht-Zyklus der Umgebung (aus Umgebung/Anbauplan): an in der gewählten Phase, aus in der anderen. Die Integration steuert das.","Free-move panel":"Frei verschiebbar","From template":"Aus Vorlage","G Series":"G-Serie",Gear:"Stufe","General device":"Allgemeines Gerät",'Give each outlet its own name (e.g. "Exhaust Fan", "Veg Light"), shown in the Outlets tab in place of "Outlet 1/2/…". Edit each name on its outlet after enabling. Saved to the controller, so it sticks across upgrades and your other devices.':"Gib jeder Steckdose einen eigenen Namen (z. B. „Abluft“, „Wachstumslicht“), der im Reiter Steckdosen statt „Steckdose 1/2/…“ erscheint. Den Namen änderst du nach dem Einschalten an der jeweiligen Steckdose. Wird im Controller gespeichert und bleibt so über Updates und auf deinen anderen Geräten erhalten.","Go dark":"Abdunkeln",Grid:"Raster",Grow:"Grow","Growth-stage buttons":"Wachstumsphasen-Knöpfe","Header connection info":"Verbindungsanzeige im Kopf",Heater:"Heizung",Heating:"Heizen",Height:"Höhe","Height ({unit})":"Höhe ({unit})","Hidden tiles":"Ausgeblendete Kacheln","Hide Energy Usage tile":"Kachel Energieverbrauch ausblenden","Hide the tab bar":"Reiterleiste ausblenden","Hide the tabs":"Reiter ausblenden","Hide tile":"Kachel ausblenden","High PPFD":"Hoher PPFD","High intensity — watch heat":"Hohe Intensität – auf Wärme achten",Highlight:"Hervorheben","History graph":"Verlaufsdiagramm",Horizontal:"Waagerecht","How the soil probes appear on Overview.":"Wie die Bodensensoren in der Übersicht erscheinen.",Humidification:"Befeuchtung",Humidifier:"Luftbefeuchter",Humidifying:"Befeuchten",Humidity:"Luftfeuchte","Humidity Only":"Nur Feuchte","Humidity Priority":"Feuchte zuerst","Humidity entity":"Feuchte-Entität","Humidity sensor":"Feuchtesensor","Imperial (in / ft)":"Imperial (in / ft)","In range":"Im Bereich","In-range highlight":"Hervorhebung im Bereich",Interval:"Abstand",Keep:"Behalten","Keep (days)":"Aufbewahren (Tage)","LD - 18:00hrs":"LD - 18:00hrs","LD - {duration}":"LD - {duration}",Layout:"Anordnung","Leaf VPD":"Blatt-VPD","Leaf VPD target":"Blatt-VPD-Ziel","Leaf offset (day)":"Blatt-Versatz (Tag)","Leaf offset (night)":"Blatt-Versatz (Nacht)",Length:"Länge","Length ({unit})":"Länge ({unit})",Level:"Stufe","Level history":"Stufenverlauf",Light:"Licht","Light & plants":"Licht & Pflanzen","Light 1":"Licht 1","Light 2":"Licht 2","Light Duration · {duration}":"Lichtdauer · {duration}","Light Env":"Licht-Umgebung","Light detected":"Licht erkannt","Light detected · {ppfd} µmol":"Licht erkannt · {ppfd} µmol","Light duration":"Lichtdauer","Light height":"Lichthöhe","Light height ({unit})":"Lichthöhe ({unit})","Light model":"Lichtmodell","Light source":"Lichtquelle","Lighting period":"Beleuchtungszeit",Linked:"Gekoppelt","Linked — a controller (cb/ac) connected by RJ12 is driving this light.":"Gekoppelt – ein per RJ12 angeschlossener Controller (cb/ac) steuert dieses Licht.","Loading 24h history…":"Lade Verlauf der letzten 24 h…","Loading history…":"Lade Verlauf…","Loading…":"Lädt…",Log:"Protokoll",Low:"Niedrig",Manual:"Manuell","Many dehumidifiers enforce a compressor lockout after switching off — they can't restart until it elapses, even when SF or the integration calls for them. Show a live countdown so you always know when it can come back on.":"Viele Luftentfeuchter haben nach dem Ausschalten eine Kompressorsperre – sie starten erst danach wieder, auch wenn SF oder die Integration sie anfordern. Zeigt einen Countdown, damit du siehst, wann er wieder anlaufen kann.",Max:"Max","Metric (cm / m)":"Metrisch (cm / m)",Min:"Min","Minimum off time":"Mindest-Auszeit","Minimum on time":"Mindest-Laufzeit",Mode:"Modus",Moisture:"Feuchte","My templates":"Meine Vorlagen",Name:"Name","Nat Wind":"Naturwind","Natural Wind":"Naturwind","Near edge":"Am Rand","New plan from a template":"Neuer Plan aus einer Vorlage",Night:"Nacht","Night Cycle":"Nachtphase",Nighttime:"Nachts",'No Spider Farmer SE light found for "{light}".':"Kein Spider-Farmer-SE-Licht für „{light}“ gefunden.","No Spider Farmer SE light found yet — add the card once the light is online, or leave it on Auto.":"Noch kein Spider-Farmer-SE-Licht gefunden – füge die Karte hinzu, sobald das Licht online ist, oder lass sie auf Auto.","No Spider Farmer SE light found.":"Kein Spider-Farmer-SE-Licht gefunden.","No active planting plan for this device":"Kein aktiver Anbauplan für dieses Gerät","No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.":"Für dieses Gerät wurden noch keine Alarme gemeldet. Schalte in der Spider-Farmer-App Alarme dafür ein, dann erscheinen sie hier.","No calibration entities yet — they appear once the controller has reported its configuration.":"Noch keine Kalibrier-Entitäten – sie erscheinen, sobald der Controller seine Konfiguration gemeldet hat.","No color":"Keine Farbe","No devices on this controller.":"Keine Geräte an diesem Controller.","No environment targets reported for this device yet.":"Für dieses Gerät wurden noch keine Umgebungsziele gemeldet.","No events in this window.":"Keine Ereignisse in diesem Zeitraum.","No frames yet":"Noch keine Bilder","No log entries on this date.":"Keine Einträge an diesem Tag.","No other outlets.":"Keine weiteren Steckdosen.","No outlets on this controller.":"Keine Steckdosen an diesem Controller.","No planting plan running":"Kein Anbauplan aktiv","No saved templates yet — build or edit a plan, then “Save as template”.":"Noch keine gespeicherten Vorlagen – lege einen Plan an oder bearbeite einen und wähle dann „Als Vorlage speichern“.","No switch events in this window.":"Keine Schaltvorgänge in diesem Zeitraum.","Not cleaning":"Keine Reinigung","Not enough VPD history yet.":"Noch nicht genug VPD-Verlauf.","Not enough history yet at this range.":"Für diesen Zeitraum noch nicht genug Verlauf.","Not enough history yet for {name} at this range.":"Für {name} in diesem Zeitraum noch nicht genug Verlauf.","Number of plants":"Anzahl Pflanzen",Off:"Aus","Off Duration":"Pausendauer","Off hides the Leaf VPD tile and its target settings.":"Aus blendet die Kachel Blatt-VPD und ihre Zieleinstellungen aus.","Off · {ago}":"Aus · {ago}","Off: show just the values (e.g. 72°F) without the Temp/RH labels":"Aus: nur die Werte zeigen (z. B. 22 °C), ohne die Beschriftungen Temp/rF",Offline:"Offline",On:"An","On device tile":"Auf der Gerätekachel","On each device tile (Blower, Fan, Heater, Humidifier, Dehumidifier, Lights), show a small line with its mode and key settings — so you can read it without opening the tile.":"Zeigt auf jeder Gerätekachel (Abluft, Umluft, Heizung, Luftbefeuchter, Luftentfeuchter, Lichter) eine kleine Zeile mit Modus und wichtigsten Einstellungen – so liest du sie ab, ohne die Kachel zu öffnen.","On now":"Jetzt an","On outlet tiles":"Auf Steckdosenkacheln","On quick-off, remember the device's mode; on quick-on, re-select it so the controller re-applies that mode's settings (instead of a bare manual on). Saved on the controller, so it syncs across your devices.":"Beim Schnell-Aus den Modus des Geräts merken und beim Schnell-An wieder wählen, damit der Controller die Einstellungen dieses Modus erneut anwendet (statt nur manuell einzuschalten). Wird im Controller gespeichert und gilt so auf allen deinen Geräten.","On: all tiles — sensors, energy, devices, outlets — merge into one grid with no section headings, so any tile can go anywhere. Off: tiles reorder within their own section (sensors, devices, outlets stay grouped).":"An: alle Kacheln – Sensoren, Energie, Geräte, Steckdosen – bilden ein gemeinsames Raster ohne Abschnittsüberschriften, jede Kachel kann überall hin. Aus: Kacheln lassen sich nur innerhalb ihres Abschnitts umsortieren (Sensoren, Geräte, Steckdosen bleiben getrennt).",'On: buttons show the outlet number + name (e.g. "4-Heater"), or just the number for unnamed outlets. Off: a status dot + number.':"An: die Knöpfe zeigen Nummer + Name der Steckdose (z. B. „4-Heizung“), bei Steckdosen ohne Namen nur die Nummer. Aus: Statuspunkt + Nummer.","On: first frame lands on the next 5/10/15… clock mark. Off: start right away.":"An: das erste Bild fällt auf die nächste volle 5/10/15… Minute. Aus: sofort beginnen.","On: quick-on restores the outlet's last mode/config (saved when you quick-off it). Off: plain on/off — a bare toggle reverts the outlet to Manual, like the device does.":"An: Schnell-An stellt Modus und Einstellungen der Steckdose wieder her (gespeichert beim Schnell-Aus). Aus: einfaches Ein/Aus – ein bloßes Umschalten setzt die Steckdose auf Manuell zurück, wie das Gerät selbst.",Online:"Online","Operating Mode — tap to switch to {mode}":"Betriebsart – antippen, um auf {mode} zu wechseln",Oscillation:"Schwenken","Other Device":"Andere Geräte","Out-of-range highlight":"Hervorhebung außerhalb des Bereichs","Outlet active color":"Farbe aktiver Steckdosen","Outlet devices (Outlets tab)":"Steckdosen-Geräte (Reiter Steckdosen)","Outlet tiles":"Steckdosenkacheln",Outlets:"Steckdosen","Outlets Log":"Steckdosenprotokoll",Overview:"Übersicht",PPFD:"PPFD","PPFD - Plan":"PPFD - Plan","PPFD 3D Grow Light Card":"PPFD-3D-Growlicht-Karte","PPFD Visualizer":"PPFD-Ansicht","PPFD visualizer":"PPFD-Ansicht","Panel device":"Panel-Gerät",Parameters:"Messwerte",Pause:"Pause","Peak flower zone":"Optimale Blütezone","Per sensor":"Je Sensor","Period {n}":"Abschnitt {n}","Photoperiod (h)":"Lichtdauer (h)","Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target) and the value tracks it live.":"Wähle ein Spider-Farmer-Licht (aktuelle Helligkeit) oder eine Zeitplan-Helligkeit (Ziel), dann folgt der Wert ihr live.","Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target). This is the card's default — the card's own Settings tab can change it live.":"Wähle ein Spider-Farmer-Licht (aktuelle Helligkeit) oder eine Zeitplan-Helligkeit (Ziel). Das ist der Standard der Karte – im Reiter Einstellungen der Karte lässt er sich live ändern.","Pick a camera to start this panel's time-lapse.":"Wähle eine Kamera, um den Zeitraffer dieses Panels zu starten.","Plant height":"Pflanzenhöhe","Plant height ({unit})":"Pflanzenhöhe ({unit})","Planting Plan":"Anbauplan","Planting plan active":"Anbauplan aktiv","Planting plan stopped":"Anbauplan gestoppt","Planting plan · {name}":"Anbauplan · {name}",Plants:"Pflanzen","Plants & photoperiod":"Pflanzen & Lichtdauer",Play:"Abspielen","Point an IR thermometer at 5 leaf spots and enter each. The average becomes leaf temp; the implied offset (leaf − air) fills the offset you pick below — Apply to save it. Measure under the light for Day, lights-off for Night.":"Miss mit einem IR-Thermometer an 5 Stellen auf den Blättern und trage jeden Wert ein. Der Mittelwert wird zur Blatttemperatur; der Versatz (Blatt − Luft) kommt in den unten gewählten Versatz – mit Übernehmen speichern. Für Tag unter Licht messen, für Nacht bei ausgeschaltetem Licht.","Point the signal bars at a different entity — e.g. the controller is on another AP or hard-wired, and its dBm is reported by your router/AP integration instead of the bundled Wi-Fi AP.":"Die Signalbalken auf eine andere Entität beziehen – z. B. wenn der Controller an einem anderen Access Point hängt oder verkabelt ist und dein Router/AP den dBm-Wert liefert statt des mitgelieferten WLAN-AP.",Power:"Leistung","Power strips nested under this panel. Standalone strips are controlled from their own card.":"Steckdosenleisten, die an diesem Panel hängen. Eigenständige Leisten steuerst du über ihre eigene Karte.","Pri Humid":"Feuchte zuerst","Pri Temp":"Temp. zuerst","Prioritize Humidity":"Feuchte zuerst","Prioritize Temperature":"Temperatur zuerst",Probe:"Sensor",Quick:"Schnell","Quick Toggle":"Schnellschalter","Quick-toggle devices row":"Schnellschalter-Zeile Geräte","Quick-toggle outlets row":"Schnellschalter-Zeile Steckdosen","Quick-toggle profile saved — quick-on restores this device's mode":"Schnellschalter-Profil gespeichert – Schnell-An stellt den Modus dieses Geräts wieder her","Quick-toggle profile saved — quick-on restores this outlet's mode":"Schnellschalter-Profil gespeichert – Schnell-An stellt den Modus dieser Steckdose wieder her",RH:"rF","Read env from":"Klimawerte von","Readings stack in one box, in the order selected. Drag the box on the image to place it.":"Die Werte stehen untereinander in einem Kasten, in der gewählten Reihenfolge. Zieh den Kasten auf dem Bild an seine Stelle.","Ready to create this time-lapse.":"Bereit, diesen Zeitraffer anzulegen.","Rearrange / Hide Tiles":"Kacheln anordnen / ausblenden","Rearrange tiles":"Kacheln anordnen","Remember device settings on toggle":"Geräte-Einstellungen beim Umschalten merken","Remember outlet settings on toggle":"Steckdosen-Einstellungen beim Umschalten merken",Replace:"Ersetzen",Reset:"Zurücksetzen","Reset background & border to theme":"Hintergrund & Rahmen auf das Design zurücksetzen","Reset order":"Reihenfolge zurücksetzen","Resize the whole card and choose how many tiles sit per row. Saved to the controller, so it sticks across upgrades and your other devices.":"Größe der ganzen Karte und Anzahl Kacheln je Zeile. Wird im Controller gespeichert und bleibt so über Updates und auf deinen anderen Geräten erhalten.","Run Duration":"Laufdauer","Run Mode":"Betriebsart","Run Time":"Laufzeit","Running Speed":"Stufe im Betrieb","Runs a self-clean heat cycle on the air temp/humidity probe (~2 hours). The probe's device turns off during it, then a 5-minute cooldown follows — Air Temp, Humidity and VPD pause until it finishes.":"Startet einen Heiz-Reinigungszyklus am Luft-Temperatur-/Feuchtesensor (~2 Stunden). Das Gerät des Sensors schaltet sich dabei ab, danach folgen 5 Minuten Abkühlung – Lufttemperatur, Feuchte und VPD pausieren bis zum Ende.","Runs from your Environment day/night targets (set on the Environment tab). There are no separate on/off thresholds here.":"Läuft nach deinen Tag-/Nacht-Zielen der Umgebung (im Reiter Umgebung). Eigene Ein-/Aus-Schwellen gibt es hier nicht.","Runs on the tent's day/night humidity targets, at Low or High power":"Läuft nach den Tag-/Nacht-Feuchtezielen des Zelts, auf Niedrig oder Hoch","SE Series":"SE-Serie","SE light":"SE-Licht","SF Series":"SF-Serie","SF sensor":"SF-Sensor","Save & activate":"Speichern & aktivieren","Save Plan":"Plan speichern","Save as template":"Als Vorlage speichern","Saving…":"Speichert…",Scale:"Größe",Schedule:"Zeitplan",Scheduled:"Zeitgesteuert","Seedling / early veg":"Sämling / frühes Wachstum","Seedling cultivation":"Sämlingsanzucht","Sensor Cleaning":"Sensorreinigung","Sensor cleaning":"Sensorreinigung","Sensor tiles":"Sensorkacheln","Set up the PPFD visualizer. Each card keeps its own settings.":"PPFD-Ansicht einrichten. Jede Karte hat ihre eigenen Einstellungen.","Set up the Spider Farmer SE light card. Each card keeps its own settings.":"Spider-Farmer-SE-Lichtkarte einrichten. Jede Karte hat ihre eigenen Einstellungen.","Set up the time-lapse: camera, a title, the capture interval and a secure storage folder. The folder is named Title_camera_interval, so the same camera on two cards at different intervals are separate time-lapses. Retention and the env overlay are on the card's ⚙ settings.":"Zeitraffer einrichten: Kamera, Titel, Aufnahmeabstand und ein geschützter Speicherordner. Der Ordner heißt Titel_Kamera_Abstand, sodass dieselbe Kamera auf zwei Karten mit verschiedenen Abständen zwei getrennte Zeitraffer ergibt. Aufbewahrung und Klima-Einblendung findest du in den ⚙-Einstellungen der Karte.","Set up {name}":"{name} einrichten",Settings:"Einstellungen","Show Device Log tab":"Reiter Geräteprotokoll zeigen","Show Leaf VPD tile":"Kachel Blatt-VPD zeigen","Show Outlets Log tab":"Reiter Steckdosenprotokoll zeigen","Show Time-lapse tab":"Reiter Zeitraffer zeigen","Show all {n} stages":"Alle {n} Phasen zeigen","Show connection info":"Verbindung anzeigen","Show cooldown timer":"Abkühlzeit anzeigen","Show device quick row":"Schnellzeile Geräte zeigen","Show everything in one view: append the outlet tiles to the Overview tab, at the bottom under Devices.":"Alles auf einen Blick: die Steckdosenkacheln unten in der Übersicht unter Geräte anhängen.","Show labels":"Beschriftung zeigen","Show less":"Weniger zeigen","Show outlet names on quick buttons":"Steckdosennamen auf den Schnellknöpfen","Show outlet quick row":"Schnellzeile Steckdosen zeigen","Show outlets on Overview":"Steckdosen in der Übersicht zeigen","Show quick-toggle row on Overview":"Schnellschalter-Zeile in der Übersicht zeigen","Show the controller's online status + Wi-Fi signal bars in the top-right of the header. Signal comes from the controller's own Wi-Fi — no extra entities are created.":"Zeigt oben rechts im Kopf den Online-Status und die WLAN-Signalbalken des Controllers. Das Signal kommt aus dem WLAN des Controllers selbst – es werden keine zusätzlichen Entitäten angelegt.","Show the tabs":"Reiter einblenden","Show tile":"Kachel einblenden","Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.":"Zeiten auf den Kacheln als 5:00am–11:00pm statt 05:00–23:00 anzeigen.","Shown on every Overview tile, independent of the colour mode. Tap any tile to open its history graph (6h–7d, selectable).":"Erscheint auf jeder Kachel der Übersicht, unabhängig vom Farbmodus. Tippe auf eine Kachel für ihr Verlaufsdiagramm (6 h–7 T, wählbar).","Shows a compact row of icon buttons above the device tiles for fast on/off toggling.":"Zeigt über den Gerätekacheln eine schmale Zeile mit Symbolknöpfen zum schnellen Ein- und Ausschalten.","Shows a compact row of numbered on/off buttons above the outlet tiles for fast toggling.":"Zeigt über den Steckdosenkacheln eine schmale Zeile mit nummerierten Ein/Aus-Knöpfen zum schnellen Schalten.","Signal entity":"Signal-Entität","Simulate Sunrise/Sunset":"Sonnenauf-/-untergang simulieren","Slot {n}":"Zeitfenster {n}",Smart:"Smart","Smart control":"Smarte Regelung","Snapshot interval":"Aufnahmeabstand","Soil Calibration":"Boden-Kalibrierung","Soil EC":"Boden-EC","Soil Temp":"Bodentemp.","Soil sensors":"Bodensensoren",Speed:"Stufe","Spider Farmer":"Spider Farmer","Spider Farmer Card":"Spider-Farmer-Karte","Spider Light":"Spider Light","Spider Light Card":"Spider-Lichtkarte","Spider Time-lapse Card":"Spider-Zeitraffer-Karte",Split:"Geteilt","Split (3 tiles)":"Geteilt (3 Kacheln)",Stage:"Phase",Stages:"Phasen",Standalone:"Eigenständig","Standby Speed":"Stufe in Bereitschaft",Start:"Beginn","Start Plan":"Plan starten","Start Time":"Startzeit","Start capture":"Aufnahme starten","Start cleaning":"Reinigung starten","Start on the mark":"Zur vollen Marke starten","Starting — Please Wait…":"Startet – bitte warten…","Starts in":"Startet in","Stats only":"Nur Werte","Status LED":"Status-LED","Status LED (tap to toggle)":"Status-LED (antippen zum Umschalten)",Stop:"Ende","Stop Plan":"Plan stoppen","Stop capture":"Aufnahme stoppen","Stop cleaning":"Reinigung stoppen","Stopping — Please Wait…":"Stoppt – bitte warten…","Storage folder (secure — never /www)":"Speicherordner (geschützt – nie /www)","Strip sensor (default)":"Sensor der Leiste (Standard)",Substrate:"Substrat","Sun fade":"Dimmzeit","Sunrise / sunset fade":"Dimmzeit Sonnenauf-/-untergang","Sunrise/set":"Sonnenauf-/-untergang","System templates":"System-Vorlagen","Tap the eye icon on any tile above to hide it here.":"Tippe oben auf das Augen-Symbol einer Kachel, um sie hier auszublenden.",Target:"Ziel","Target / range line":"Zeile Ziel / Bereich","Target Brightness":"Ziel-Helligkeit","Target PPFD":"Ziel-PPFD","Target humidity %":"Ziel-Luftfeuchte %","Target source:":"Zielquelle:",Targets:"Ziele",Temp:"Temp","Temp+Humid":"Temp.+Feuchte",Temperature:"Temperatur","Temperature & Humidity":"Temperatur & Feuchte","Temperature & Humidity Sensor":"Temperatur- & Feuchtesensor","Temperature Only":"Nur Temperatur","Temperature Priority":"Temperatur zuerst","Temperature entity":"Temperatur-Entität","Temperature source":"Temperaturquelle","Template name":"Name der Vorlage","Tent dimensions":"Zeltmaße","Tent overview + config for the Spider Farmer Bridge integration":"Zeltübersicht und Einstellungen für die Integration Spider Farmer Bridge","Tent size ({unit})":"Zeltgröße ({unit})","Text color":"Textfarbe","Text colour":"Textfarbe","Text size":"Textgröße","This makes its folder and starts the time-lapse. Change the camera, title, interval or folder in the editor (⋮ → Edit) first if needed. To remove this card, edit the dashboard and delete the card.":"Legt den Ordner an und startet den Zeitraffer. Kamera, Titel, Abstand oder Ordner änderst du vorher bei Bedarf im Editor (⋮ → Bearbeiten). Zum Entfernen bearbeite das Dashboard und lösche die Karte.","This strip has no Spider Farmer air sensor. Use a 3rd-party Home Assistant temperature/humidity sensor as its reference — the readings appear on the card (and as":"Diese Leiste hat keinen Spider-Farmer-Luftsensor. Nimm einen fremden Temperatur-/Feuchtesensor aus Home Assistant als Bezug – die Werte erscheinen auf der Karte (und als","Tile appearance":"Kachel-Aussehen","Tile color":"Kachelfarbe","Tile extras":"Kachel-Extras","Tiles per row":"Kacheln je Zeile","Time Slot":"Zeitfenster","Time —":"Zeit –","Time-lapse":"Zeitraffer","Time-lapse not set up yet. Open this card's editor (⋮ → Edit) and choose a camera. Give it a title and storage folder there too; set the interval and env overlay from the ⚙ settings.":"Zeitraffer noch nicht eingerichtet. Öffne den Editor dieser Karte (⋮ → Bearbeiten) und wähle eine Kamera. Gib dort auch Titel und Speicherordner an; Abstand und Klima-Einblendung stellst du in den ⚙-Einstellungen ein.","Time-lapses (tap 🗑, then confirm, to delete — images included)":"Zeitraffer (zum Löschen 🗑 antippen und bestätigen – mit Bildern)","Timer loop":"Zeitschleife","Timer period":"Zeitspanne",Timestamp:"Zeitstempel",Title:"Titel","Title (optional — defaults to the camera name)":"Titel (optional – sonst der Kameraname)",Toggle:"Umschalten","Toggle light":"Licht umschalten","Toggle {name}":"{name} umschalten","Toggle {name} alarm":"Alarm {name} umschalten","Too dim":"Zu dunkel","Transition / early flower":"Übergang / frühe Blüte",Trend:"Verlauf","Trend arrows":"Trendpfeile","Turn off":"Ausschalten",Type:"Typ",Units:"Einheiten",Use:"Verwenden","Use a custom signal source":"Eigene Signalquelle verwenden","Use for day":"Für Tag verwenden","Use for night":"Für Nacht verwenden","VAPOR PRESSURE DEFICIT":"DAMPFDRUCKDEFIZIT","VPD graph":"VPD-Diagramm","VPD kPa":"VPD kPa","VPD referenced to the leaf surface, which runs cooler than the air. Under the light leaves transpire and sit well below air; lights-off they settle near air temp — so set a Day and Night offset. Calibrate the day value from measurements if you like, then Apply.":"VPD bezogen auf die Blattoberfläche, die kühler ist als die Luft. Unter Licht verdunsten die Blätter und liegen deutlich unter der Lufttemperatur; ohne Licht nähern sie sich ihr an – stelle deshalb einen Versatz für Tag und Nacht ein. Den Tageswert kannst du aus Messungen kalibrieren, dann Übernehmen.","Vegetative growth":"Wachstumsphase",Vertical:"Senkrecht",View:"Ansicht",Volts:"Volt","Waiting for the first frame…":"Warte auf das erste Bild…","Waiting for this panel's air temperature and humidity…":"Warte auf Lufttemperatur und Luftfeuchte dieses Panels…",Watts:"Watt","What drives the tile highlight —":"Wonach die Kacheln hervorgehoben werden –","Which display panel this card shows.":"Welches Display Panel diese Karte zeigt.","While a plan is active the controller sets temperature, humidity and CO₂ from the plan schedule. Switch to Environment to see the manual targets used when no plan runs.":"Solange ein Plan aktiv ist, stellt der Controller Temperatur, Feuchte und CO₂ nach dem Plan ein. Wechsle zu Umgebung, um die manuellen Ziele zu sehen, die ohne Plan gelten.",Width:"Breite","Width ({unit})":"Breite ({unit})","Wind Speed":"Windstärke","Wired (Ethernet)":"Kabel (Ethernet)","above max":"über max",air:"Luft","always overrides.":"hat immer Vorrang.",avg:"Ø",band:"Band","below min":"unter min","camera name":"Kameraname",current:"aktuell",fault:"Störung",frame:"Bild","gives each probe three separate tiles.":"gibt jedem Sensor drei eigene Kacheln.","its limits. Applies to every reading; off by default.":"innerhalb seiner Grenzen liegt. Gilt für jeden Wert; standardmäßig aus.","kPa air VPD":"kPa Luft-VPD","kPa leaf VPD":"kPa Blatt-VPD","keeps one tile per metric (averaged across probes).":"behält eine Kachel je Messgröße (über alle Sensoren gemittelt).",leaf:"Blatt","lights off · dark · set dates on apply":"Licht aus · dunkel · Daten beim Übernehmen festlegen",max:"max",min:"min","mol/m²/d":"mol/m²/T",night:"Nacht",preview:"Vorschau","shows one tile per probe with Temp, Moisture and EC on it, tap for its graph.":"zeigt eine Kachel je Sensor mit Temperatur, Feuchte und EC, antippen für das Diagramm.",signal:"Signal","size estimate appears after the first frames":"die Größenschätzung erscheint nach den ersten Bildern",'spider-farmer-card: "panel" is required (e.g. panel: dp1)':"spider-farmer-card: „panel“ ist erforderlich (z. B. panel: dp1)",target:"Ziel","temperature & humidity":"Temperatur & Feuchte","this time-lapse":"diesen Zeitraffer","use planting plan instead →":"stattdessen Anbauplan verwenden →","use stage buttons instead →":"stattdessen Phasen-Knöpfe verwenden →",within:"innerhalb","{days} days":"{days} Tage","{height} light-to-canopy · {dim}% brightness · {hours}h light":"{height} Licht bis Blätterdach · {dim}% Helligkeit · {hours} h Licht","{n} day":"{n} Tag","{n} hr":"{n} Std.","{n} stage":"{n} Phase","{n} stage · managed by the controller":"{n} Phase · vom Controller gesteuert","{n} stages":"{n} Phasen","{n} stages · managed by the controller":"{n} Phasen · vom Controller gesteuert","{time} left":"noch {time}","{time}hrs":"{time} Std.","— choose a device —":"– Gerät wählen –","— choose camera —":"– Kamera wählen –","— choose —":"– wählen –","— none —":"– keine –","“{name}” saved to My templates":"„{name}“ unter Meine Vorlagen gespeichert","…if RH hasn't dropped this %":"…wenn die rF nicht um diese % gefallen ist","≈ {size} at full retention":"≈ {size} bei voller Aufbewahrung","● capturing":"● nimmt auf","⚙ Custom":"⚙ Eigene","⚠ Important: while a 3rd-party (External) sensor is in use, control this device from Home Assistant only — you CANNOT use the Spider Farmer app. The app has no access to your 3rd-party sensor and will fight the integration's control.":"⚠ Wichtig: Solange ein fremder (externer) Sensor genutzt wird, steuere dieses Gerät nur aus Home Assistant – die Spider-Farmer-App geht dann NICHT. Die App kennt deinen fremden Sensor nicht und arbeitet gegen die Steuerung der Integration.","⚠ When enabled, the integration drives the dehumidifier itself (full Manual) to hold your humidity target — this overrides Spider Farmer's own automation. It runs continuously in Home Assistant (works with no dashboard open). On an HA restart the gear holds its last state until HA is back.":"⚠ Eingeschaltet steuert die Integration den Luftentfeuchter selbst (vollständig manuell), um dein Feuchteziel zu halten – das übergeht die Automatik von Spider Farmer. Die Regelung läuft dauerhaft in Home Assistant (auch ohne offenes Dashboard). Bei einem HA-Neustart bleibt das Gerät im letzten Zustand, bis HA wieder da ist.","🌱 Propagation":"🌱 Anzucht","🌸 Flowering":"🌸 Blüte","🌿 Vegetative":"🌿 Wachstum"}};let xe,we="";function Se(e){const t=String(e?.locale?.language||e?.language||"en").toLowerCase();t!==we&&(we=t,xe=$e[t]||$e[t.split("-")[0]])}function ke(e,t){let i=xe&&xe[e]||e;return t&&(i=i.replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):e)),i}!function(){try{if("undefined"==typeof document||!document.fonts||"undefined"==typeof FontFace)return;const e="SF Overlay";let t=!1;if(document.fonts.forEach(i=>{i&&i.family===e&&(t=!0)}),t)return;new FontFace(e,'url(data:font/woff2;base64,d09GMgABAAAAACrMAA8AAAAAfbwAACp0AAJeuAAAAAAAAAAAAAAAAAAAAAAAAAAAGigbpyAcgXQfhTIGVgBMEQwK7UTUdgE2AiQDhwwLg0wABCAFz2YHIBudbiXjmKXAxgHA9trxoqgLlFS+mQEzMinP/v9LApXDtSbleOEADIZCE4mu7FruK2o5Cr+xu+HURfHp3w3fNFc3w+dK9CFUQJGkZ03zGL4oSkWQVzgEQ/8Z+G3mPQPbxt5JXiYtPNZ+/55kk937C8QOFZACRIsSVNnVVdhOFaGrAgRXV9X/Nj/A3Po3NiIdJUjUqJSoFHCUwoAxUEoGo0alCJvQE0YN5IZwCB6MFpGjbNwpitJ6xlfuG42LuirJ8cBKdrxQVocd/gcGjgfoCOKoGXjM3DblY43QESR5RDVzulctDqjEA4DHayiD2zGCcsqv9tO9H7eXRJPOREUiKCovlEAiPWVKYHT9ctqbwh5BO0a/6lJ657L6ndpoJfs7gOAgHII2d9PYvGqIivbCF/T/37vj8Q8wkRL7Y0eJJVxgbW3TXvft2m+crulrVDPdTPgr8P8VUJhpwP9TtWwxxPFEnSNWjt3lUDSEqEvdFb271A/+jPCB+ZyFBG0klk/mOtLcHDQEuALDhZQ7x3Axlg6pTp3bVIVUu3fnppBVievOld1W/vu1VncviYeIWDtioPS36N5h/1ST2O7eeUmIRxqR0D4mmsSTVRohQkgFKoOJTM0nMzK2cAUxXjiCdv+fy1JmSG4nYjcHSonlUJewlE7RBFGL2tSix6+H7HoYaw6DrtJN8n/McW/8UoIECSJSyv0KIQB0AgBAAQUImAUBN7kJAhZ5AgKesgkHIADoALpYweE0xysQhBK2pyWBJCgAiN/ADThtK/G7iUnAA0ImKODQFk+MniAP7napeIcW+qiTYy3GaC6EiLn7I0I4AVERA0ELQSAa40nL2HtjTgYNN4raHMXTW2Jjx0ggcoP6AggHpICucvCgSHbfu30sMzQOas4dwneowBG9jhSic6cumS4z25D6fIT+AtWxiAwnN14VTzbVjtdjOqIiuomMDT5GKU8Wry4adYCFqrCc5hmQuoljGgByiAwvi4zlyYdeGyyhQT0WH7kBVecEDd4j6T7j05muL6pKPmPXUQ94RIPazK25QB8EU2KgZMXy7VymX9TW6px/dp/Na0AwkhJjqBJAyR/MJKoMRiX1pYvaIgZiLOackTc/V5AnYa3m0vUT8Am204qaVXGh1qaceWfW0YUEuIwTwZCvwwNXZGqbOlAZwAPUyBgwU3Wt4HXJMqD1XE1oVoRw3aL/oo/1T/VM92pW1K8R8t/tqMTykU/RmgFdJM0uh8+ipEhJpNzeSfGoKO7JZakrQgtjlKu4sKjSzYkKRIHmaaWCYbIlMChDYuU2XLYLwRpZD1JB+qmDU1/AVZIsGpCRuE9Vvpy5jpcBYECCi5dKvcMFR/Gpzl9IeJLVaD5DIAk0sNDMsYwCANaFrZbAmOym05TL4Eo6BccmMrd2AWOUmnUU3cSDXNAscj5V9tZkyTiFnjdPk2E06W72nPBYWTeqzgKljo29MQ+MyWrYUWxzje9/ln891gig4+TehXxW1KtKPrSLBYyLOgw1av73Xlj7FyD+xx6D+P9UUUKcECEgWyoQ1GjgpEUHD32W+LlwJcGLl2N8+ZESIICMIKFkxYuniIxMSYESGGXKqaOi0lSrkZYW7fT16WdqyChL06Y5mDXLEQcjSpQgYGBwUKYMSYUKFDVqOKlTx0WDBm5atPDQpo2XDh189OnjZ8CAgOOOE2TIkBAjRo4wZgzNhAlhpkyJMGNGlDlzYixYEGfJ0lEuXEhw5UoyUeYb+t0j6XRZUBgMR06IIy+0lwIDrGDrQkWUFcNRUeIoK3NUlSs1Zt4CxfibrYS1wRFHd9S1kwZXTILD0XR1eynDRknzZitwdwKCkOHb5wB4hRj4fehvC8TixQPEQ1w6IiEU4N9LkJAj0ISJECVG/aPbAGlJkHSMFCnSQETmpMiSA9KRp0CREgxlKovi4pxGzhEOjw9yoQlRAAbFjETT26hFnBZAAkwbCshXzQdZukS6BwYnvCjRA9DH3txJdFeI+f+l/pqK6kpPBNVbs3HLeOH4lu/ccr+/m5PvbG0Fo2JNZ5gaLLLK+7Y8l+jxqZL+L0cch8nex5UHNUeoGp+N7pQPnd4HlOrR0YdeeoFFVIJgot8cJwFiZChRtymFkeCKN89F04NncARrN+Dw7GnLFQQgnr57oANs8S9+WHUC7mcAaBFgOMDZAAAqY7xS4vDGrQY/kiIEaDq0wQ00SommDRHHZcRfU82A/xSA6QX2i5NDH25AggVRnGeYJ3JUjOSc1MgVEMANvMAHVthwitOEgwAkyGFHMqglxlaccW2k4J54/QnVIGDpkdDWCLiM3B55WGl15N7IE/uOO8VeYwT7Ocsb//6Ywz+MaL9hzcSG7vNTeuhXXrxM4fRoA2yzAw3MCVrpSaX1So8LcqPOURji2TxipmA3auqF2RwmFJJHFcv2OqDYl0agusgZOAHc0FsAkdO/wPQIgooAyp9TakzVAI4CzAYAYNkeZzzYoTCiRxarYkIribILIJFkHW31AgkIrKPArHbuyQEckMdv5J1tYlmuG0aHOez3dlxv8Ty/GsAP4+lnfv8O9QPCLwBkBaAF0Lke6N0f0EMA2SIq6eGDRQIncAACp5rjQSEd/RH6VUTgHNqzzfdChDN90aRAP6BRRDJUWlyYo98KtA9oMaHNAH6G/S2AQO/OLsZJ8k6GkPrIHDBdf5J75gjAsG++VeUtG/QnpGnJ6aRkWFzisOSg7DnwywjFKTb8J+tcNloL/XLF+MEknnSBZe3OttTEe7yFfXHBYWIxFmy05qIGiIBdTRYPf3mu6+g0Qe4POCxhdJrvOdTpH2f2/YgpqJrpQF0NZsRwwSZFHUCqbsC4ypEk9L5P3FsfIRsBBL6CiNRa5ohfo3r/jAbm4UmHFMw+tGivOOk2sITa2K4c+HxPdgcMJKw71BNNDQefmI7NLeozRGBE1Behxd2mXl0bVkgDYYcVcWSYqSBDKAwtQS4GJdCy02KN+o7UahiFjOPWxLb172fMBUn+6dsjwRnJ97eh/KjPZ98Ne3FJZURJeWY69o/+cwiOxDRAcr7C+v65mFLNw0q4cMVouV9D34nT6+a4fCW6qii4nAyuplcCVgPRDsL9mwjRNVKGDvUvOQhTBpLkOQqarFncitSG21b590ku9Jsybncu44C9hd2Bg138zqwV0OIpwRM/qm/hay9KKCH5pItKkuWrM+HFyPa6kNmcmwykKAhR9iBUr+ctFUlCH8NQIh0Xu07Xv0OM+ZFsv25mi7AHGUn4cLbysFYV5EtM+Kbwl1xja0mZXMhKsaXetSYe/mLgr4//Ai1QTLjDTEir6ztK5iFHEYEcMCU4tzKwqLhPRrpG+m1pfeFfNnpnknv+pl+wuuTpazRB1uqsWf3nVBo0rv5whDgu5a6acb+H7/6K269WFa3lvkxdzp56YYcW2tJcOVeXa111xY5DqbbmI5msVW2zQwk8f4o2H5rURqev2qKT0QZYCedo934oSWDQ6fKDda2v0tsXrF2DPTUycYH9yjUY3itv99De8+bBAChOW/9okmSUOz5N7fBCKW+rghJXQ06qNhJi6tBcHn5R35Jcm3S2sz6OKHmlyyL/21BUlXb9VaDxFJSw/I5BJN5zPRo7a2yJ1bD/Uz0dQOhJQuGmwYLWKOWBKm8IZ+JEf4ryyxMLzxY89TSfkuR3lQXmT+YAsj3YR9kVC+QZjHjKxRtkIZT7NB7SQ//zFiMaO+5mTDWhY3RbSyI8SCR199ZgyZqqlDnnnGLpaOBjC9CMYBfwqCRi/sIJ1wJ2f7vhEhzrlNShF4J7IgILpkktQs6NIf6WuqaqQ+bSnSE5iZ4ivVe19DPcDiNPoqVziOedm3f53n16YD0CMUfYeIFAlEzS3o1YYaQvdcQwD6rKX+c/f6yG7tsFSNHjZfrX7JWsp3Di8sCFkyIfTWXB6D5m0OOBDUIO+g3Wgvio2xrWcKA2rhRPZ46x82LOo8n1spJmPHU6iHUQhRMJPdM5URa4EhtrMuyhcBvFk8R/ruE1quxiN2ESZ1njVbP3Oc62xq1YgNzWQOjdrT53b7ZgClQwbRm8NS1RFNRAEQQ1qj77LqOUnDEHbkObKlmfxtGHVRYMJE4+K3ywCAltwRhx/OX//IZhvgOMosCgxWSguY9ta8FEYCfBBXv6zAzqS8Uv3zPLmFuzrlO+Ns6MlxvE/sVRWOMyoKsQVQV0tom2SlOxYC49ZDJFX0+tnjbJDAB100NF+MFrN/tvbt/LDxAYjmCM/dM2IpqCfcJBRNwglr9bbZBqaGwlzyGNCdsxKWoJNbMxco3u/1QhtYtauOaCrC6bsvC8rbdtU3/donQQSx/s47q9gB7BQ+qKla9pLqenjzXK8AYmlUfSyT8gplaqBQ0sd3pyauFN6/zEeCTciDBlzRCqxGgrdWk7ascRDHEyHpxmFgy3vb8yy/k9fX9efPsLfTOCPWJ96vIv2grVOaDmBAJV8LgpzmxLABICmfrePQmdLyjDUTQeJpNxOppI9nVVL73oCts3NRcyWSKN6h9DHJ7S1CfVD9TI2NmiRFgxpFkKAUo2CaT5+51KMHZSdftb1yZJ1NVeswhTuVRzFhjJr7ug+uQbVqXaci8tG0RPvF1W7XIySDgexJdNFCpWD6xk1fTdnOj3cKcqclUBOmQJWWWxtSpS70S0gAPePqpLSUQ6IS+w7K7HYy+P5S7QZ7bdlZdGPxUXi3aRsza0F23kTRIQGrwkkM8In47fff4/+LlZm3xbeCpkXfox+rWF9/Pfocjn/EP6QxPEvJlVOQNPJbRDP8U/tWYkDgz603kLodwXg863aGoh2tVPzSdswRQOwMOPj1RKU2Pj4asnkQ99EjRYr52J+KWLMvBijIIZ3N/Cn09OBu3WReDli6M1Gj9vbxmO/x6VNLbw58J+CZHl1j5B8EUAljG+VZgitjbu3f7eAIKJfJbiPImB7xwwZ/1OHpkcDZOO8iuDj8nKRNN5FG0CQnc4+/TzdS4mBGQ437I5ea73ZpsH1Fbc6qlLvdzUrNEMWqF7HLi42T2iNHBpLNTo1+rhKnCyVymi+C4xPBz9xNZiaimb9YF9aikmwFsF5VgeS1eOo3cQ6Ga0iBPeNi0xsW0z1KZyoDtHs2ULrn71HWhnYugwoo0H7TjEfe0z2tdibO/ZJcHSBmapv7F7fXJV8A3+31PIATl/qT/9NQZ1wpD9O0rskdY/dm6whaJ/01gg60ww9lzE1sOreeiCxNDg7Fg4LXIxKKqupCiqPugk84uKxwvMo48/nZyceNLWMf5kcko8JrWR2Ly3JLIuCG3cwugGQ3R+hwVBsAPxWZA+WWdOT6y3t7OeALbcO5DHYEL9AjuCa9fmOiJ6bNxsS2p+cFsE269wpkzwF8ciTuUelflZUxsbvIst/s9A5FFB6VZp1KFBjlXXs5usAAYmEDOK1W3TdzpTlBRsaEFQ0vpAbVSkdL9w7uXLopslex0Nr+sXtjbr5hvfAJ+LyNz3pn5+cyuGHN2xAIvUC+POgZXRJmGOcMM80ncli5g1wAgziAzmUSMmWOyjdHSYj9q+4zzg/a+1K922hSdsIbpImiENT8J5Ha6BQimbqVBWxwT1v/xaW48bGTK/tY1vaFS8tf0Hz4XsLNUP4Wdl/8Tw6w+PVIIrC++6ApxaHsxTUPHHHPMak5h+gaqBS/BqdM/obSiLeGCf4XArS3/NIPhf0Zc3TjkxQpMv8IuB4QcVqlzXPPWZ3n+S4X8rn1GeD9BfNEic+buBUsKq7xnsHW1oSz+X2pXdHDCNSVG5RpRfkg95wX9vOKeaCfoxKvK7sofIgNuHt9l9bNwyrmseBNnsY0xc0kyQkPZ3jPDr/7T4hMNvyMfKr4boz+rFDyz/1dqKeQyc6MAEqICmo2UFfbyrkz5RAfNEZ5c/T55MlieGpuK19EBQCG2BvXoqfhuFfvPiiPgOUvhCVpQvQ9qLJgt8pezrWMX9/DX5fa3bcP4mldFSXk5+KrWHVkYThp4slKdeLRg5vPt889fdkQLCyV9U7FqgrPO8/PKFxlundC+44tKohcVFtYVpaQYVFWOZsCXH8sRcUvFceiAgJGx+8mpYwhZKiG8O+kJ2pE9vl2StG6XVwntjqTBshSOoaYOaNhmnRw7sCpMfrMRRP8X7vbYUCNZ1+SlAH3lAMqm44eAXZ9QuMhHKvPWvf5M6S4sxLQw5GRJccvy0QUhRYoLvsDPOYeq02XXTWNbzuXYv14qQk0En3+EzA8OM4Jskpborh3yhu+YChZGdVdOtMGbpRXOLvfLP16WlR9/6Yy95WHgWU7YuijOeX423mbT1jS3SPD9E3raLsG2NGfKYayeKJ5yJixVNaCv8io31C0nKwakSmsddi/Jz8nNK3aZHy91zcwryTpRNPzw7kN3uEemzT+a21pPgBK0FIeEXKpIBg/uYBvaD8rzO8jw21C5hnLpby6outJZ0O8bc0KqnJhFTqMn1H3tQL7/NXq3M7ySL1sszVpqXjqz/kAR/UhQ7JvzF6SI4YqaudsQMil6cjglfO+P61rUkoJQeG1dKDyh76wLHjPUqPxrLSehqyx01nu5pH26IKyhqOjPUDgIN7CHmi4lF5qLsV+aNx3WFMqksP6bf8gp46bMvevSKFKb5HwvsCD/fnJjE44fXcrkmOT9KDv8RUSUiYqCna7wi8ZeVsZgr+Of4FeAU+eLzRSoqf6i+DJkodOvDrjfTtiyx4cbr6Blt6ai9MYNuWb5bd+5m8Go9YnbesDoSa18lPnzVAU72AufIS4rBKnVQ3/zjQ2vgt7fRwDlIO07y2uBwlZbiYhsb4ColXfxpt0UGIyoyy8IyszsqKpNReqbBYXXLxfIyfFT1Ys/SD9h5+gy2fxwGr5DikJ8MeJU+brxDKKJbASNSbUlt8ah7KWD2YMpOPJtinXuraX0mz73hfGTmRkYpr/sS/GA/ri4aT/cROaytLysuri+pBadSxgLRZNU4omc4Pz06Hd8jlyW5rfnP49F1pc1jZ9/p5evey3Z640wcmCzPSyojt8hlS2xrL8/2/31099OZdRWAGPZ7pghwaq0yVgT4VdirVQcDD+ZvGOWDqlWGsoKGlPT2lMED08Nek61/Jct49QDTwAaUM/uWKOOdaP273eml35YgsQ9F/0KL7qMPgUecvU7UTNNc37ylgORZ787uzX6iGCAL4Mxeb4uhxawrIoUWVxeB25jdQLNEXVxkzncW0QL8XGJ9lAPgQh1Q+oCvh51kqTTEBNXPYsCtlCff495TwHKBLae9PHb+RC/LVQN7+0CKOgWOfiYcI7U4k2D6+GZ/DDmqgJjcwnp8TWPMM5/FtImZxFVcWbneNf1z9geHSH7v+SbcXzoBOky86rRq6If3P8DGX2+190Vtra1fBWzKCfPoIRz51qEjDw/QLbKHcH5948AlNg42acZXvDVbNf1GFnZu3yY04kdAC2V6YRiY0780rIVEtM25TnYqgQVmNJyl1rL6TiPOWeWv5ujMXkcIXn6xuno50lUD1/+Hh/rwT9/6e+zs34aRhoNRGne14gXMTPlE1R1+7nApjc0jGhkjFTTWgGAb6JWJtQxFe/nGRetR9O6P3x+iDPlMDjCnwULJeonxtKGe+UuL/PqGdY+9lvt1lCuyX8ZPdsRPq03D/6+Rqdkws6irkTl3fpgjUQbdyfEQLoHJAhcHBoNFbye35TT0TzOy0pwqyh4/HE2aW3gHAmI4Fi4R3SvWK2zaP12zf7m0GpzxxLXkeOqIv1c9dZPyzpsT/GcDDsyUMOMgcFTscoHgUFfpRJ4lFf05/XGHMU7vTLlEovR8ATyVulJoGdU9M93viRsftCH8GZmVzSR/I+X2muFrVTPcrO9/sbzMfNFQ1/9yabH/39pLB8KmYqLCZgf/oc1ExdCmQLzsPw5cfOPMDLZk+vpD7gl0dT+IFokncgXhYpgs4OJjgVH3tW03tHZr78qMD53fwTxmPKpU9OE1MLtmO+itdlkttLIiINAu0q1O4X/zGozmytbPfz0OvaEUrzQTY7RgFFlUFXzCE+/LVD5kYprqi+ib/XcII7IgQaLbkClkXKWHd+o0bZrdSX+AK6eU28DAeC+rvZ1Mz2m4Ms0gs3CsKw4xQ1GkucX3Mh/6APkQNy++e+WRNi/lhPsOnPjFeKHos0IBZ9efx2GJBOLWj4g2HsE0roPLmVmv8IfNuvPYXWl92L1afF29ZuFQG+u9WJeVU0dL8ApwPV6qECAT6DMvvpvQDj4P3GK4s31ajirX6orlPC6B/bkZqs23vrpn75viU2usKbSZs8SGg2d9td9sKE7VJ4Oqv7aFVidKJkmFVLd+HWeA1AtZ4AEmY+H39JsLgScpX1tDqhdRkmS/ybavNYHYCy4U22+9tc8OGuKJNTYUm5r41Kb3z3rrvv2cXqTBcJzPsGNk0kWLbvuoPZp1eHC/V6T/G4RTiVrLOnviw2RsnycoIKPaaUKMEE3vKQquFe7eZo3zU1REdl5xVy/XcOQAUZwzqkLDVZVpJ1uh5MUlQ1A4EOU5juDgMTgQlyeAnBuyQgGc9q+NeqqXq1vXp9IePiqnlN/XYW4z395fpCy+42T//1/rRjkwHdm+cy+FePu2BybdxlaFmHnvTsq5O3cup6pYW2Qo35yw54h3bnsrkyzsVFKDDCISk3EJqcp2VmmYsOJztBbiubaW6sG3XkpJudQKbvcX2xaXFzvIHYYBNC8yj5X7TPZk5uSstTsP2TOAZtgOA02fmZ/5GOCeDUiM9P3POkTX63zJt7K31qG6njXlq7UMf9UaVbPIeF/X0NtE+qMH6UUtMaFhVaeM1swS7GpWLw+4t8gEyTCwqnWqFoRzAV6EjexqdkZ+MyHsVE2ofr9FsnPRIr3XvVkGVF6gV1dWy5abDLDjvN3MlZhw48Rz0prjUS8QNjRP81HNtHjOQBOhePu05ETsFRVG7Mhi2+HFJTvh9Ckwt4tLT++EnbKQfWm9HwvtFQrlHRp6B9vamQOX7LLk7BXzHWQqpF0ef/9w7/73/x67l0vDed8h8tDA2PWGczMUx9MFTWUp5TOVU6OosLRQkk25oqNivps0Vdp5bPhP0feduQ6+dpFe/nGFFKIsOARiZrX5tflnH3b6K3V+GgkE68L9FMC2ryG0ne8QO066HVFMYODm5rSRxchJWGtPryCbGMLQQHoWNi45Ap3h4KXjVvH8SsE9iwi34yYO+EtOIHjyM7YeCwqcyX6JSX6+iQl+fokJvr5JyT4FdiT9gQ2dFIcS1mhZ+chIednY+N6ELNYV9z05lB6GNqn/H0DPC/URsUlyL4P0wx1i/U4aZSm5KpG9pEukzS8OFCdUeUjng8JNXJgwPsE/Z7r0qnmOmLNolkX6McfEDB8XjyTPBGxCeDjOxsoi2ipCPUbY72iqGzpf2JTaR4p2DokA9VHConNGCwz8AVx8LNbFyrry+vrLfdWscCt1Fd7vk/VlbuIY5xPeQr4GPlSfKEKNt4a3Bqg1sK8DF60auORngEu+xucf9OsN1gzyJQiOuKwdrkFgonGcfkhGaLoulr+/GO0upGc5qyunib0FvPN8t6Kfq6ftq1aybydpFMFxipdIj9zemJ29/WRk5O7Tmdm7G8PEM7kdFaV57XFnctpLK8ntICCGedjp//DjbnJ1xgwPH+7MtMaYFIZgQ4LqN+25iT4jzhHkLLmpcKsIXs9hYCY+zGRecOVwBYxdQm2Dg23tsFh726AgW+wqqEngyAtFqWKfJWuieyq9PZXY0UF0sSGxFJ1J2+tw6kk2c3+zu8j5fHR73m01cfb5NrFu9CoaBI3ZHVc3xkTj6B1Ty9TllZ1dP6rf0Q8b54Eg5KbX0srSUnrmys1PylxcWnTlZjDwxAdrr/lsdjhENJCcc6pjmWN3X8k5XKUHmVR1LG3zjvHh7thITlq04YX16JyJCf5jwZvgy0tvUj0FGx6hqY4Q1AZzeQ5/wNbGRnPK8V8RYKjpbVxvcllZM7UG+BkpS++ePLn35CXHZiP3ZSJOz9zPTqOk50xENf7K1uiaXbmkmwTDV7ZKxj4tIzzM1iIAbx1mEmGBLQvL7+1vlOEmFCWnFJWfL06chPioemhkjFS2NCzfuaOee8ja6ZIdbqXvoT78M6uLY3GLRtFGg9Ead7XOXv6S6ZXulvEogzJ9f6Jvi9a35mHEu5dtHQ1rx6lDBx3RuMx6ND818Kz2Ip/DVLbxJI9Kbk2K/MDvyeTFSymT398rk2ciRvX0EZuzClGSYddW9/KoXkkKONVI0PmY/PmW9O7zp8+cdj9K2WZ1ii98Kwlq9tuKffMVTQtraSao2zT1vV5zE0m0zmk09jK+mSGGNv3vNP24g+H5y+E+F4eNUu1CZuPhxnUY7hz0Ed63ZeSeGQ+v3FThOW+SQZpAqP+YUTXy8T5oFWiUfrQNCrKzx2IfkL2d12bZllsl8uifHOQXQssCOARVMW6IE7mIspjaMNUfdpPdghL7oMPCRbADZNkEoy5jcelemfLE8gnqBD0LHv/zXZ8TETn/uql9e1yvh6MDKRCSlScsCvzclfPAWz0PEqaVr8Py+mrfrNA67jpR/teucvw1XEC+FlX4QjKRgh36tHG99u2m12DcVZwBYwDUH1XOvzZsVz7B63THKlhpzesL+xr9Am9Kx/yzE2OBZ/jZfAfwkuAC0tubPdhMAfVH2VUrT94rgscvpfGDoxPATdpMoma2TYgOHYtxjDHDtkDd9fZWfO205ITAWGK4hx0KeX3SGunllBg1IjAhycI3kcH4URlwJ9DMTjrGxBwbEmVltyXVbAM3HowfLD818DZPQJc4cOe2mGEvShOZJermz4AEJjfmhsj4JpbkhMBIYpSXE9J68joK6WGXGD4mMCE5ja9tBU3Tsgngxm8n1WS3sQg9xkkahPZu0vPfNurhYLEUG0TfRo8AJwYO99mNY1cGR8bf9yRfr46/GgflXjHYedwOJ9l92y9+HcBQB2EDJ6O8VYsH362HT2pErtlSOe6N98Bbaac38dMgpbK+epsuWxl+FCDT8Hl8l7sFFJzNC6pfCyin6HDlxhBIWOW736sTpI8oEDXCPRHRhPRApT8Bowvmm2+7zw0q+1+nHvBW9Vy9/62qCjH0GLKAbmP526pa+G4FFpIxlvGIfVKl1YMp8eC0XZsSknvbvefeKW7Zyidkig6gVcNZdAT3tnuvuGVrXnE36bm33XvFLa1Hyj609W+562rg3nbvuXeKW9qEfv4duLfde8UtbeFkpzKHzRnsV4ApTyufK58vj7NvVJ24fQsU2+WW9lRJd5p7jsVB3ve3D1mgR4brUJbmWfu6mpsiFuNs37F5mqt+6eQOmvK08rnyeTvOxl7G/lB5WvmcHWeHXiZtixXnueskobbo8u133uFfXD/CA7D96dgt+X6gma2OGn92aMDjSjwUE4vhW/uQWkmupj1hGbCqNlBM3NoHS0AmSlbXlMpjNA5DXO0ELgAN/vbLgBuWcFJj19dNOygm+uD4MMw02sAxiRxniJ+AvbTID8R0MgGKpsegv03hIqWS0ksjGw9BviYLbo2ORUB66XgqoMnT8RzsFPsYuGA/JgDDZ1PXgIQMEsFBM8iC08FDYl2xsQWCq4dfjn3DgQBAw2+8zWZP2Oqs/vHINwDAx/WaWwHgTzb81T7ael16Sy1AAxwAgACUxCoLNFAp1UqYmOrH981uQ9AqIBmLcRpkIV+D7hIwC42UbE2hGrKQ5BniJsMAZtTCdW2TrrvgpflUhwGE5cy2WSNrZXhGZxTWx6pOKNRhDhTd34fXabbUNQAnPQu057LsjaRmDQmEUDLadDYMLVSsp6ARjW5bYqTwZT38KSd7kWprJac8oYtRbrvx3Z8yHG6v8gonJ2Odhj9JnUoD6HpEi7G/E/x+awDn7SXkbc0JI5BC70yxt+v1PnpmDxdhQs2Z44/HU+uCRlllosS19r6acCklj71Mi+SEwbS896BNYZ2rwIqyNE9ohgS7hADHsKAAYvu883CaK8wKWbjyn28YsAlP9aYBhHRaINX2eQPeYdowgFdW3YVGMiYcF4wyQKS6BIOKnhsvDDGlp69MC+Bsn7kyR6XkusQWCudpuL6swpMHyIGBHkJLWF2lONwFLq7J8EF7WHtNjoki5MFAgH3sEcvOxwTnqVgqTwEhBwZyTMeiZdTwOamP3PuyLQInnii3PBgSAPIFGvI4Y/DA/qprvO0n2FqZjLH1vQ2ACxhzVOtMtiCj1J3tc2gk7ODF6Dnfw1vL1N8R0P6oldo+2hL4eRcEAL/whhMcQC1TSuNaZ+h6OQh1AAbAQ2BOQRDz7xQOQv49Bemo/3nU/CmcJBM4hYtSyiEPii6n8LMoriS4fsxThMTdRjnaFn79Ad4gXy2MJpI2JGB3QYmwYb6g0ZHChq+CM+5Jf4x/Vn6SMiaQF4KOdY0hJeQPo5HIEeXYDddcc9Pxs38vUx6+1CBR/HniGC6qTCdEgfrda0UiBZnwE/7wiTPOB2n0kvKCLCgyCkVHd1FtzgY/PyTbC67eTfpar99PqB7YaX3LlqbAirQaxfRRc5gIWXj+DQhsIiMxgzw6CoqZcMY3JipWx4RMxIK+TtQ+OXkr2lQeNydJZWadtHtqRwl5DqRlmdED/dLQSvYGDU/Yi8G8kzsBfDkzhYUv/f7VpglcCHcX6DwypODQydx03/5sCyg6SzkT4XNsjsgPDPEvOAYvtAjtsFpQWBvUF5AwlmabQ22zcwhX5IdS6cyvAQ4D8tu18UTOQOfA9dk5BCWMMF92Y2druwImaTuUVZNnG4tZP4Jn7YaPVpI1cKz3Nlki1QIZFGDshkbJLXNMpuQyd/kpIfXJMRXpd+KbjUogvSWAXyRDAqi+FdWEttexRNERH8I90E/2ercmH8xQh1hQLUyiDUYk8awOYXGqzcY5KhgUcADD0e5KNGgdySp0UsFIKRC16Qb5cy2RSJoMjMZg4BuUYMx5DA+uYz6Dh+jMI+2OFUGhCnirg1Az+Ky3CJOkmDHprguJm+uGVhVXOsGxCI41dHaXN2akXxlHZ/OT7Umdi2OMjhF0HGp+OErZgiqMImEPiqkDydZKs6Xlu7caQ+g+fQiEude9CBG3GTXpW+tv9hD5JUlNGMtmzkAEzpFBZZRwDIcydkrvV5UJGvbTxlq3pBstJHXYp9NaR8+/qOi2LA4z4KYuQiyQEnTmdNxG4nB6goFQhWuECG6gD6QyhyKuxc1UcYPjUziTFJrxKWquFPtBQg16TBe4PFLmpkWKinQufRa1juvLDIM8QjDwCkxdCYmLiNPoV6Xt5KgbAZ1vJmx1Gn17ZJqFbOpfmgN0OGmjKWF+Xbo/zRapBJiQUyQgHzPyeIsiyEqMC8U6l7he1clFcphGphm1+ry46I+SQISAg3fNfGCRLSM45lLHNtP2MOWmC81BGsY3bzVlHMU5jUXDEik503DdoVuzCRO3LeVA7tfcqCeZqIgM1IU6pDI5wlUjnMlZGN0kjVnqRHRq3sR0awJl+9ZORaXAQSOUBZKR1EHdR5ciJpODJahjZH9SAHZso0R/w1kYKDnJvkRZeE4XrSoCleYhidCqBZpDkSSd/CazApVWyQnfKfYAh6TkyKOhSSSgUaUKj2BjIdg9LcA5FLA7DIFvfTKCNHnrAApQwLWELv6CLayHSVOvFIOWpHTy17XiQylzMEWaUEiS7L2822g1zES3JiCi5oVkLxhSaJBUGgOG7zkAfdUoGUB9NEypej8piqjTVIjlFHCgfm7IdLODiAjq3oCN3C30axUIqAwjUBkeQpwEkQE19IKLyARjHiLIPEpPRkTggKGzkwExj2EKa4I7x17oorIt33Ay8zIPURQro6Ez1HrW9wpUewcQkZrs/hHK1/AaCV1G8PoM1mehZtqvCaFZQ1tBAuCXXw/Il0axs6jfzKm/7tmMkMpUO2mKLZ2NDcSgrRkeqBSKJJ2udj5yokSOrUT5jzx9l1vTer9WbWwYjUbUbDnzrM7iCoIVmIxbd4SSC1pwpyTXK9znGG1b1n4UCRdseH1KWLc5jcda94tU94ANCcyMWUhuSmidwfV8cgdIaTZvElBsCa4wjgxTTrKlhBYZqSczmX116o1dIXDoEIFWQ52QTE0PN9iW/8sl9n7S+a9ImEYK927AFuIVlJQfLSsj22TIqO3JkA+RPFl7r5RxLDwRqPeDjgL4zzvSTNc79OfAbhb4+lv/8h2n4h2jn+YqR6jbtLj0gtwYDhKVMUwkLjbaNfF5Rac37zGydxKzd1eGEz2l8enfR4gijsYkyjGsJI5GEJUxTCQmhmEgccli6ZGYADKtvFk7SxZhE7GowHgYVhKDgtmI2FvUOkw2hp3E0QpiPAwfiYuH4SBxSWFpkoB0nPG5Pz774DP9v/Lcu75RJQwnifExnCQmhmEhcUlhKEngRZbVJL3bc0ljKZK49LAUSIwgG4sLozvTu4fOP+sy1EF3dHWJf7eiHSfhgdlOth8nXBAqR69dIzZzlfpAv6lQ) format("woff2")',{style:"normal",weight:"400"}).load().then(e=>document.fonts.add(e)).catch(()=>{})}catch(e){}}();const Oe="#ff7a1a",De=["#5dcaa5","#85b7eb","#ef9f27","#ed93b1","#b39ddb","#4dd0e1","#f06292","#9ccc65"],Te={"prioritize temperature":"Prioritize Temperature","prioritize humidity":"Prioritize Humidity","temperature only":"Temperature Only","humidity only":"Humidity Only","temperature & humidity":"Temperature & Humidity"},Ce=["S","M","T","W","T","F","S"],Me=/^sf_(dp\d+|ac5|ac10|st\d+)_/;function Pe(e){return e.split(".")[1]??""}function Ae(e,t,i,s){const o=s*Math.PI/180;return[e+i*Math.cos(o),t+i*Math.sin(o)]}function Le(e,t,i,s,o){const a=135+270*s,n=135+270*o,[r,l]=Ae(e,t,i,a),[d,c]=Ae(e,t,i,n),h=n-a>180?1:0;return`M ${r.toFixed(2)} ${l.toFixed(2)} A ${i} ${i} 0 ${h} 1 ${d.toFixed(2)} ${c.toFixed(2)}`}function Ee(e){const t=e.currentTarget,i=t.parentElement?.querySelector(".sl-bub");if(!i)return;const s=Number(t.min||"0"),o=Number(t.max||"100"),a=Number(t.value),n=o>s?(a-s)/(o-s):0,r=function(e){const t=String(e),i=t.indexOf(".");return i>=0?t.length-i-1:0}(Number(t.step||"1")),l=Number.isFinite(a)?a.toFixed(r):t.value;i.textContent="1"===t.dataset.off&&a<=s?"off":`${l}${t.dataset.unit??""}`,i.style.left=`calc(${n} * (100% - 18px) + 9px)`}const Ne=n`
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
`;function Fe(e){const t=new Set;for(const i of Object.keys(e.states)){const e=Pe(i).match(Me);e&&t.add(e[1])}return[...t].sort()}function ze(e){return Fe(e).filter(t=>/^(ac|st)\d/.test(t)&&!!e.states[`switch.sf_${t}_outlet_1`]||Object.keys(e.states).some(e=>{const i=Pe(e);return i===`sf_${t}_temperature`||i===`sf_${t}_soil_avg_temperature`||i===`sf_${t}_light_1`||i===`sf_${t}_fan`||i===`sf_${t}_blower`}))}function Re(e){return Fe(e).filter(t=>!!e.states[`switch.sf_${t}_outlet_1`])}function Be(e,t){const i=`sf_${t}_`,s=Object.keys(e.states);return s.find(e=>Pe(e)===`sf_${t}_temperature`)??s.find(e=>{const s=Pe(e);return s.startsWith(i)&&!s.startsWith(`sf_${t}_env_`)})}function He(e,t){const i=Be(e,t);return i?e.entities?.[i]?.device_id:void 0}function Ie(e,t){if(!t)return[];const i=He(e,t);return i?Re(e).filter(s=>{if(s===t)return!1;const o=He(e,s),a=o?e.devices?.[o]:void 0;return a?.via_device_id===i}):[]}function Ge(e,t){if(!e||!t)return"";const i=Be(e,t);if(!i)return"";const s=e.entities?.[i]?.device_id,o=s?e.devices?.[s]:void 0;if(o)return o.name_by_user||o.name||"";const a=(e.states[i].attributes.friendly_name||"").match(/^(SF .+? [0-9A-Fa-f]{4})\b/);return a?a[1]:""}const We=[["temperature","Air Temp","mdi:thermometer"],["humidity","Air Humi","mdi:water-percent"],["vpd","Air VPD","mdi:water-opacity"],["leaf_vpd","Leaf VPD","mdi:leaf"],["co2","CO2","mdi:molecule-co2"],["ppfd","PPFD","mdi:white-balance-sunny"],["soil_avg_temperature","Soil Temp","mdi:thermometer"],["soil_avg_moisture","Moisture","mdi:water"],["soil_avg_ec","Soil EC","mdi:flash"]],Ve={temperature:"temp",humidity:"humi",vpd:"vpd",co2:"co2",ppfd:"ppfd",soil_avg_temperature:"tempSoil",soil_avg_moisture:"humiSoil",soil_avg_ec:"ECSoil"},Qe={temperature:"temp",humidity:"humi",co2:"co2"},Ke="#ff6b6b",je="rgba(255,107,107,0.16)",qe=(e,t=.16)=>{const i=/^#?([0-9a-fA-F]{6})$/.exec((e||"").trim());if(!i)return`rgba(255,107,107,${t})`;const s=parseInt(i[1],16);return`rgba(${s>>16&255},${s>>8&255},${255&s},${t})`},Ue=e=>"string"==typeof e&&/^#[0-9a-fA-F]{6}$/.test(e),Ze=e=>"alarms"===e||"targets"===e||"both"===e,Je=Oe,Ye={"Time Slot":["ts_type","ts_start","ts_stop"],Cycle:["cycle_start","cycle_run","cycle_off","cycle_times"],Temperature:["temp_device"],Humidity:["humidity_device"],CO2:["co2_device"],"Drip Irrigation":["drip_soil","drip_avg"],Manual:[]},Xe=[{label:"General device",mode:"Manual",cfg:{dev_type:"0"}},{label:"Timer period",mode:"Time Slot",cfg:{dev_type:"1"}},{label:"Timer loop",mode:"Cycle",cfg:{dev_type:"2"}},{label:"Blower",mode:"Blower (Temperature Priority)",cfg:{dev_type:"3"}},{label:"Humidification",mode:"Humidity",cfg:{dev_type:"4",humidity_device:"Humidifying"}},{label:"Dehumidification",mode:"Humidity",cfg:{dev_type:"5",humidity_device:"Dehumidifying"}},{label:"Heater",mode:"Temperature",cfg:{dev_type:"6",temp_device:"Heating"}},{label:"Cooler",mode:"Temperature",cfg:{dev_type:"7",temp_device:"Cooling"}},{label:"CO2 Injection",mode:"CO2",cfg:{dev_type:"8",co2_device:"Aeration"}},{label:"Exhaust fan",mode:"CO2",cfg:{dev_type:"9",co2_device:"Exhaust"}},{label:"Light Env",mode:"Light Env",cfg:{}}],et={"Temperature Priority":"Blower (Temperature Priority)","Humidity Priority":"Blower (Humidity Priority)"},tt=new Set(["Blower","Humidification","Dehumidification","Heater","Cooler","CO2 Injection","Exhaust fan"]),it=Oe,st=e=>!!e&&("unavailable"===e.state||"unknown"===e.state),ot=e=>{const t=(e||"").match(/^(\d{1,2}):(\d{2})$/);if(!t)return null;const i=+t[1],s=+t[2];return i<=23&&s<=59?60*i+s:null},at=(e,t,i,s,o="",a=!1)=>V`<div class="save-bar ${o}">
  ${((e,t,i,s,o=!1)=>V`
  <button class="save-btn" ?disabled=${!t||o}
    style=${t&&!o?`background:${e}`:""}
    @click=${i}>${o?V`<span class="save-spin"></span>${ke("Saving…")}`:ke("Apply")}</button>
  <button class="discard-btn" ?disabled=${!t||o}
    @click=${s}>${ke("Discard")}</button>`)(e,t,i,s,a)}
</div>`,nt=[["light_1","Light 1","mdi:lightbulb"],["light_2","Light 2","mdi:lightbulb"]],rt=[["fan","Fan","mdi:fan"],["blower","Blower","mdi:weather-windy"]],lt=[["heater","Heater","mdi:radiator"],["humidifier","Humidifier","mdi:air-humidifier"],["dehumidifier","Dehumidifier","mdi:air-humidifier-off"]],dt=[["Temperature","env_temp_day","env_temp_night","env_temp_deadband","mdi:thermometer"],["Humidity","env_humi_day","env_humi_night","env_humi_deadband","mdi:water-percent"],["CO2","env_co2_day","env_co2_night","env_co2_deadband","mdi:molecule-co2"]];class ct extends de{constructor(){super(...arguments),this.tab="overview",this.envSubView=null,this.planDraft=null,this.planEditStage=null,this.planShowAll=!1,this.planTplOpen=null,this.planTplName="",this._tplMsg="",this._tplMsgT=null,this.planDelArm=!1,this._planPending="",this.colorMode="off",this.colHi=Ke,this.colLo="#45b6ff",this.colorModeIn="off",this.colIn="#4caf7d",this.colWarn="#ffb300",this.colorSource="alarms",this.showTrend=!1,this.showBand=!1,this.showTargets=!0,this.tileSummary=!1,this.hour12=!1,this.customOutletNames=!1,this.outletNames={},this.showConn=!1,this.connCustom=!1,this.connSignal="",this.showOutletsLog=!1,this.showVpd=!1,this.showLeafVpd=!0,this._colorOpen=!1,this._tsOpen=!1,this._cdOpen=!1,this._setOverviewOpen=!1,this._setExtrasOpen=!1,this._setConnOpen=!1,this._setVpdOpen=!1,this._setDevOpen=!1,this._setOutletOpen=!1,this._setLayoutOpen=!1,this._setSoilOpen=!1,this.vpdLeaf=!1,this.vpdStage="veg",this.vpdView="grid",this.vpdHighlight=!1,this.vpdPlanSource=!1,this.vpdCustom=[1,1.4],this.ologRange=24,this.ologOpen=null,this._olog={},this._ologLoading={},this._ologVer=0,this._saving=!1,this._savingT=null,this._savingAt=0,this._savingWatch=[],this.outletCopyOpen=!1,this.outletCopySel={},this.outletCopyFromOpen=!1,this.showOutletQuick=!1,this.outletQuickRemember=!1,this.outletQuickNames=!1,this._olqMem={},this.showDeviceLog=!1,this.hideTabs=!1,this.showTimelapseTab=!1,this.tlCam="",this.tlInterval=300,this.tlDailyAt="00:00",this.showDeviceQuick=!1,this.deviceQuickRemember=!1,this.dlogOpen=null,this._dlqMem={},this._devPend={},this._pendLevel={},this._outPend={},this._cdTick=0,this._cdOffAt={},this._cdLastState={},this.customLayout=!1,this.cardScale=100,this.tileCols=3,this.layoutMode="sections",this.unifiedDeviceQuick=!1,this.unifiedOutletQuick=!1,this.tileOrder={params:[],devices:[],outlets:[],all:[]},this.reorderMode=!1,this.tileOrderDraft=null,this.tileOrderBase=null,this.dragId=null,this.dragSec="",this.hiddenTiles={},this.hiddenDraft=null,this.tileRadius=12,this.tileBorderW=1,this.tileBorderCol="",this.tileBg="",this.taTiles=!0,this.taDevices=!0,this.taOutlets=!0,this.cooldownShow=!1,this.cooldownDevice=!0,this.cooldownOutlet=!1,this.cooldownSecs=180,this.outletsOnOverview=!1,this.outletQuickOverview=!1,this.hideEnergyTile=!1,this.tempSource="sf",this.extTemp="",this.extHumi="",this._smartOpen=!1,this.smart={},this.paramOpen=null,this._hist={},this._graph={},this._graphLoading={},this._graphAt={},this._graphTimer=null,this._graphVer=0,this.graphRange=6,this.powerMetric="power",this._graphSel=null,this._graphPin=null,this.hideLight2=!1,this.outletColorMode="off",this.ocManual=Je,this.ocSched="#45b6ff",this.ocEnv="#4caf7d",this.ocDrip="#3cc8d0",this.deviceColorMode="off",this.dcManual=it,this.dcSched="#45b6ff",this.dcAuto="#4caf7d",this._colorSynced=!1,this.colorDraft=null,this.alertsDraft=null,this.soilOpen=null,this.soilGraphOpen=null,this.soilAllOpen=!1,this.soilMode="avg",this.soilKeep="replace",this.soilTileGraph=null,this.soilTileMetric="temperature",this.deviceOpen=null,this.deviceGraphOpen=null,this.outletOpen=null,this.draft={},this.modePick={},this.dirPick={},this.outletLightDir={},this.outletDraft={},this.outletNameDraft={},this.outletCfgDraft={},this._stDt={},this.leafSpots=[],this.leafCalTarget="day",this.logDate=null,this.logDev="all",this.logType="all",this._used=new Set,this._myTpl=null}setConfig(e){if(!e.panel)throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');this.config=e;const t=e.default_tab;this.tab="environment"===t||"config"===t?"env":"outlets"===t?"outlets":"outlets_log"===t?"olog":"device_log"===t?"dlog":"timelapse"===t?"tlapse":"vpd"===t?"vpd":"calibration"===t||"cali"===t?"cali":"alerts"===t?"alerts":"log"===t?"log":"overview";const i=e.alarm_colors;let s="tile"===i||"text"===i?i:"off";try{const t=localStorage.getItem(`sf-colors-${e.panel}`);if("off"===t||"tile"===t||"text"===t)s=t;else if(t){const e=JSON.parse(t);"off"!==e.mode&&"tile"!==e.mode&&"text"!==e.mode||(s=e.mode),"off"!==e.modeIn&&"tile"!==e.modeIn&&"text"!==e.modeIn||(this.colorModeIn=e.modeIn),Ue(e.hi)&&(this.colHi=e.hi),Ue(e.lo)&&(this.colLo=e.lo),Ue(e.in)&&(this.colIn=e.in),"boolean"==typeof e.hide2&&(this.hideLight2=e.hide2),"off"!==e.omode&&"tile"!==e.omode&&"text"!==e.omode||(this.outletColorMode=e.omode),Ue(e.ocManual)&&(this.ocManual=e.ocManual),Ue(e.ocSched)&&(this.ocSched=e.ocSched),Ue(e.ocEnv)&&(this.ocEnv=e.ocEnv),Ue(e.ocDrip)&&(this.ocDrip=e.ocDrip),"off"!==e.dmode&&"tile"!==e.dmode&&"text"!==e.dmode||(this.deviceColorMode=e.dmode),Ue(e.dcManual)&&(this.dcManual=e.dcManual),Ue(e.dcSched)&&(this.dcSched=e.dcSched),Ue(e.dcAuto)&&(this.dcAuto=e.dcAuto),Ze(e.source)&&(this.colorSource=e.source),Ue(e.warn)&&(this.colWarn=e.warn),"boolean"==typeof e.showTrend&&(this.showTrend=e.showTrend),"boolean"==typeof e.showBand&&(this.showBand=e.showBand),"boolean"==typeof e.showTargets&&(this.showTargets=e.showTargets),"boolean"==typeof e.tileSummary&&(this.tileSummary=e.tileSummary),"boolean"==typeof e.hour12&&(this.hour12=e.hour12),"boolean"==typeof e.showConn&&(this.showConn=e.showConn),"boolean"==typeof e.connCustom&&(this.connCustom=e.connCustom),"string"==typeof e.connSignal&&(this.connSignal=e.connSignal),"boolean"==typeof e.showOutletsLog&&(this.showOutletsLog=e.showOutletsLog),"boolean"==typeof e.showOutletQuick&&(this.showOutletQuick=e.showOutletQuick),"boolean"==typeof e.outletQuickRemember&&(this.outletQuickRemember=e.outletQuickRemember),"boolean"==typeof e.outletQuickNames&&(this.outletQuickNames=e.outletQuickNames),"boolean"==typeof e.showVpd&&(this.showVpd=e.showVpd),"boolean"==typeof e.showLeafVpd&&(this.showLeafVpd=e.showLeafVpd),"boolean"==typeof e.vpdLeaf&&(this.vpdLeaf=e.vpdLeaf),"boolean"==typeof e.showDeviceLog&&(this.showDeviceLog=e.showDeviceLog),"boolean"==typeof e.hideTabs&&(this.hideTabs=e.hideTabs),"avg"!==e.soilMode&&"sensor"!==e.soilMode&&"split"!==e.soilMode||(this.soilMode=e.soilMode),"replace"!==e.soilKeep&&"keep"!==e.soilKeep&&"stats"!==e.soilKeep||(this.soilKeep=e.soilKeep),"boolean"==typeof e.showDeviceQuick&&(this.showDeviceQuick=e.showDeviceQuick),"boolean"==typeof e.deviceQuickRemember&&(this.deviceQuickRemember=e.deviceQuickRemember),"boolean"==typeof e.customNames&&(this.customOutletNames=e.customNames),e.outletNames&&"object"==typeof e.outletNames&&(this.outletNames=e.outletNames),"boolean"==typeof e.customLayout&&(this.customLayout=e.customLayout),"number"==typeof e.scale&&e.scale>=70&&e.scale<=150&&(this.cardScale=e.scale),"number"==typeof e.cols&&e.cols>=2&&e.cols<=5&&(this.tileCols=e.cols)}}catch{}this.colorMode=s,this._colorSynced=!1}serverColors(){const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;if(!e)return{};const t=e=>"off"===e||"tile"===e||"text"===e,i={};if(e.colors&&t(e.colors)&&(i.mode=e.colors),e.colors_in&&t(e.colors_in)&&(i.modeIn=e.colors_in),Ze(e.color_source)&&(i.source=e.color_source),Ue(e.color_warn)&&(i.warn=e.color_warn),"1"!==e.show_conn&&"0"!==e.show_conn||(i.showConn="1"===e.show_conn),"1"!==e.conn_custom&&"0"!==e.conn_custom||(i.connCustom="1"===e.conn_custom),"string"==typeof e.conn_signal&&(i.connSignal=e.conn_signal),"1"!==e.outlets_log&&"0"!==e.outlets_log||(i.showOutletsLog="1"===e.outlets_log),"1"!==e.outlet_quick&&"0"!==e.outlet_quick||(i.showOutletQuick="1"===e.outlet_quick),"1"!==e.outlet_quick_remember&&"0"!==e.outlet_quick_remember||(i.outletQuickRemember="1"===e.outlet_quick_remember),"1"!==e.outlet_quick_names&&"0"!==e.outlet_quick_names||(i.outletQuickNames="1"===e.outlet_quick_names),"1"!==e.vpd_graph&&"0"!==e.vpd_graph||(i.showVpd="1"===e.vpd_graph),"1"!==e.vpd_leaf&&"0"!==e.vpd_leaf||(i.vpdLeaf="1"===e.vpd_leaf),"1"!==e.leaf_vpd_tile&&"0"!==e.leaf_vpd_tile||(i.showLeafVpd="1"===e.leaf_vpd_tile),"1"!==e.device_log&&"0"!==e.device_log||(i.showDeviceLog="1"===e.device_log),"1"!==e.hide_tabs&&"0"!==e.hide_tabs||(i.hideTabs="1"===e.hide_tabs),"avg"!==e.soil_mode&&"sensor"!==e.soil_mode&&"split"!==e.soil_mode||(i.soilMode=e.soil_mode),"replace"!==e.soil_keep&&"keep"!==e.soil_keep&&"stats"!==e.soil_keep||(i.soilKeep=e.soil_keep),"1"!==e.timelapse_tab&&"0"!==e.timelapse_tab||(i.showTimelapseTab="1"===e.timelapse_tab),void 0!==e.tl_cam&&(i.tlCam=e.tl_cam),void 0!==e.tl_interval&&(i.tlInterval=Number(e.tl_interval)||300),void 0!==e.tl_daily_at&&(i.tlDailyAt=String(e.tl_daily_at)),"1"!==e.device_quick&&"0"!==e.device_quick||(i.showDeviceQuick="1"===e.device_quick),"1"!==e.device_quick_remember&&"0"!==e.device_quick_remember||(i.deviceQuickRemember="1"===e.device_quick_remember),e.graph_range&&(i.graphRange=Number(e.graph_range)||6),e.olog_range&&(i.ologRange=Number(e.olog_range)||24),e.power_metric&&(i.powerMetric=e.power_metric),void 0!==e.hidden_tiles){const t={};for(const i of e.hidden_tiles.split(",").filter(Boolean))t[i]=!0;i.hiddenTiles=t}if(void 0!==e.tile_radius&&""!==e.tile_radius&&(i.tileRadius=Number(e.tile_radius)),void 0!==e.tile_border_w&&""!==e.tile_border_w&&(i.tileBorderW=Number(e.tile_border_w)),Ue(e.tile_border_col)?i.tileBorderCol=e.tile_border_col:""===e.tile_border_col&&(i.tileBorderCol=""),Ue(e.tile_bg)?i.tileBg=e.tile_bg:""===e.tile_bg&&(i.tileBg=""),"1"!==e.ta_tiles&&"0"!==e.ta_tiles||(i.taTiles="1"===e.ta_tiles),"1"!==e.ta_devices&&"0"!==e.ta_devices||(i.taDevices="1"===e.ta_devices),"1"!==e.ta_outlets&&"0"!==e.ta_outlets||(i.taOutlets="1"===e.ta_outlets),"1"!==e.cooldown_show&&"0"!==e.cooldown_show||(i.cooldownShow="1"===e.cooldown_show),"1"!==e.cooldown_device&&"0"!==e.cooldown_device||(i.cooldownDevice="1"===e.cooldown_device),"1"!==e.cooldown_outlet&&"0"!==e.cooldown_outlet||(i.cooldownOutlet="1"===e.cooldown_outlet),void 0!==e.cooldown_secs&&""!==e.cooldown_secs&&(i.cooldownSecs=Number(e.cooldown_secs)),"1"!==e.overview_outlets&&"0"!==e.overview_outlets||(i.outletsOnOverview="1"===e.overview_outlets),"1"!==e.overview_quick&&"0"!==e.overview_quick||(i.outletQuickOverview="1"===e.overview_quick),"1"!==e.hide_energy_tile&&"0"!==e.hide_energy_tile||(i.hideEnergyTile="1"===e.hide_energy_tile),"sf"!==e.temp_source&&"external"!==e.temp_source||(i.tempSource=e.temp_source),"string"==typeof e.ext_temp&&(i.extTemp=e.ext_temp),"string"==typeof e.ext_humi&&(i.extHumi=e.ext_humi),"string"==typeof e.smart)try{i.smart=JSON.parse(e.smart)}catch{}"1"!==e.show_trend&&"0"!==e.show_trend||(i.showTrend="1"===e.show_trend),"1"!==e.show_band&&"0"!==e.show_band||(i.showBand="1"===e.show_band),"1"!==e.show_targets&&"0"!==e.show_targets||(i.showTargets="1"===e.show_targets),"1"!==e.tile_summary&&"0"!==e.tile_summary||(i.tileSummary="1"===e.tile_summary),"1"!==e.time_12h&&"0"!==e.time_12h||(i.hour12="1"===e.time_12h),Ue(e.color_hi)&&(i.hi=e.color_hi),Ue(e.color_lo)&&(i.lo=e.color_lo),Ue(e.color_in)&&(i.in=e.color_in),"1"!==e.hide_light2&&"0"!==e.hide_light2||(i.hide2="1"===e.hide_light2),"1"!==e.custom_outlet_names&&"0"!==e.custom_outlet_names||(i.customNames="1"===e.custom_outlet_names),"1"!==e.custom_layout&&"0"!==e.custom_layout||(i.customLayout="1"===e.custom_layout);const s=parseInt(e.card_scale,10);Number.isFinite(s)&&s>=70&&s<=150&&(i.scale=s);const o=parseInt(e.tile_cols,10);if(Number.isFinite(o)&&o>=2&&o<=5&&(i.cols=o),"sections"!==e.layout_mode&&"unified"!==e.layout_mode||(i.layoutMode=e.layout_mode),"1"!==e.unified_dev_quick&&"0"!==e.unified_dev_quick||(i.unifiedDeviceQuick="1"===e.unified_dev_quick),"1"!==e.unified_outlet_quick&&"0"!==e.unified_outlet_quick||(i.unifiedOutletQuick="1"===e.unified_outlet_quick),e.tile_order)try{const t=JSON.parse(e.tile_order);if(t&&"object"==typeof t){const e=e=>Array.isArray(e)?e.filter(e=>"string"==typeof e):[];i.tileOrder={params:e(t.params),devices:e(t.devices),outlets:e(t.outlets),all:e(t.all)}}}catch{}return e.outlet_colors&&t(e.outlet_colors)&&(i.omode=e.outlet_colors),Ue(e.oc_manual)&&(i.ocManual=e.oc_manual),Ue(e.oc_sched)&&(i.ocSched=e.oc_sched),Ue(e.oc_env)&&(i.ocEnv=e.oc_env),Ue(e.oc_drip)&&(i.ocDrip=e.oc_drip),e.device_colors&&t(e.device_colors)&&(i.dmode=e.device_colors),Ue(e.dc_manual)&&(i.dcManual=e.dc_manual),Ue(e.dc_sched)&&(i.dcSched=e.dc_sched),Ue(e.dc_auto)&&(i.dcAuto=e.dc_auto),i}serverOutletNames(){const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,t={};if(!e)return t;for(const[i,s]of Object.entries(e))i.startsWith("outlet_name_")&&"string"==typeof s&&(t[i.slice(12)]=s);return t}serverOutletLightDirs(){const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,t={};if(!e)return t;for(const[i,s]of Object.entries(e))!i.startsWith("oletdir_")||"Day"!==s&&"Night"!==s||(t[i.slice(8)]=s);return t}connInfo(){let e=null,t=!1,i=!1;if(this.connCustom&&this.connSignal){const i=this.get(this.connSignal);if(i){const s=Number(i.state);Number.isFinite(s)&&(e=s),t="unavailable"!==i.state&&"unknown"!==i.state&&"off"!==i.state}}else{const s=this.get(`sensor.sf_${this.config.panel}_alarm_settings`);if(s){i=!0===s.attributes.eth_online;const o=s.attributes.wifi_rssi;"number"==typeof o&&(e=o);const a=s.attributes.wifi_online;t=i||("boolean"==typeof a?a:"unavailable"!==s.state&&"unknown"!==s.state)}}let s=0,o="var(--secondary-text-color)";return null!=e&&(e>=-60?(s=4,o="#54c06a"):e>=-67?(s=3,o="#54c06a"):e>=-75?(s=2,o="#e0b23a"):(s=1,o="#e2544f")),{online:t,rssi:e,bars:s,color:o,wired:i}}renderConn(){if(!this.showConn)return j;const e=this.connInfo(),t=e.online?"#54c06a":"#e2544f",i=V`<span class="conn-st" style="color:${t}">
        <span class="conn-dot" style="background:${t}"></span>${e.online?ke("Online"):ke("Offline")}
      </span>`;if(e.wired)return V`<span class="conn">${i}
        <ha-icon class="conn-eth" icon="mdi:ethernet"
          style="color:${t}" title=${ke("Wired (Ethernet)")}></ha-icon>
      </span>`;const s=[1,2,3,4].map(t=>{const i=3+2*t;return Q`<rect x=${4*(t-1)} y=${12-i} width="3" height=${i} rx="1"
        fill=${t<=e.bars?e.color:"var(--divider-color, #3a3e44)"}></rect>`});return V`<span class="conn">${i}
      <svg width="15" height="12" viewBox="0 0 15 12" aria-label=${ke("signal")}>${s}</svg>
    </span>`}signalEntityOptions(){return this.hass?Object.keys(this.hass.states).filter(e=>e.startsWith("sensor.")&&"signal_strength"===this.hass.states[e].attributes.device_class).sort().map(e=>({id:e,name:this.hass.states[e].attributes.friendly_name||e})):[]}persistColorOption(e,t){const i=`sensor.sf_${this.config.panel}_alarm_settings`;this.get(i)&&this.hass?.callService("sf","set_card_option",{entity_id:i,key:e,value:t})}toggleTabs(){this.hideTabs=!this.hideTabs,this.persistColorOption("hide_tabs",this.hideTabs?"1":"0"),this.cacheColors()}cacheColors(){try{localStorage.setItem(`sf-colors-${this.config.panel}`,JSON.stringify({mode:this.colorMode,modeIn:this.colorModeIn,source:this.colorSource,warn:this.colWarn,showTrend:this.showTrend,showBand:this.showBand,showTargets:this.showTargets,tileSummary:this.tileSummary,hour12:this.hour12,showConn:this.showConn,connCustom:this.connCustom,connSignal:this.connSignal,showOutletsLog:this.showOutletsLog,showOutletQuick:this.showOutletQuick,outletQuickRemember:this.outletQuickRemember,outletQuickNames:this.outletQuickNames,showVpd:this.showVpd,vpdLeaf:this.vpdLeaf,showLeafVpd:this.showLeafVpd,showDeviceLog:this.showDeviceLog,showDeviceQuick:this.showDeviceQuick,deviceQuickRemember:this.deviceQuickRemember,hideTabs:this.hideTabs,soilMode:this.soilMode,soilKeep:this.soilKeep,hi:this.colHi,lo:this.colLo,in:this.colIn,hide2:this.hideLight2,omode:this.outletColorMode,ocManual:this.ocManual,ocSched:this.ocSched,ocEnv:this.ocEnv,ocDrip:this.ocDrip,dmode:this.deviceColorMode,dcManual:this.dcManual,dcSched:this.dcSched,dcAuto:this.dcAuto,customNames:this.customOutletNames,outletNames:this.outletNames,customLayout:this.customLayout,scale:this.cardScale,cols:this.tileCols}))}catch{}}layoutStyle(){const e=[];return this.customLayout&&(e.push(`--sf-cols:${this.tileCols}`),100!==this.cardScale&&e.push(`zoom:${(this.cardScale/100).toFixed(2)}`)),12!==this.tileRadius&&e.push(`--sf-tile-radius:${this.tileRadius}px`),this.tileBorderW>0&&e.push(`--sf-tile-bw:${this.tileBorderW}px`),this.tileBorderCol&&e.push(`--sf-tile-bc:${this.tileBorderCol}`),this.tileBg&&e.push(`--sf-tile-bg:${this.tileBg}`),e.join(";")}applyOrder(e,t,i){if(!i||0===i.length)return e;const s=new Map;i.forEach((e,t)=>s.set(e,t));const o=e.filter(e=>s.has(t(e))).sort((e,i)=>s.get(t(e))-s.get(t(i)));return[...o,...e.filter(e=>!s.has(t(e)))]}persistTileOrder(){this.persistColorOption("tile_order",JSON.stringify(this.tileOrder))}overviewNatural(){const e=e=>e!==j?e:void 0,t="avg"===this.soilMode||"keep"===this.soilKeep,i="avg"===this.soilMode||"keep"===this.soilKeep||"stats"===this.soilKeep,s=[];for(const e of We){if(e[0].startsWith("soil_avg_")&&!t)continue;const i=this.renderParam(e);i!==j&&s.push({id:e[0],tpl:i,pop:this.paramPop(e[0])})}if("sensor"===this.soilMode)for(const t of this.soilProbeSlots())s.push({id:`soil_sensor_${t}`,tpl:this.soilSensorTile(t),pop:e(this.soilSensorPop(t))});else if("split"===this.soilMode)for(const t of this.soilProbeSlots())for(const i of ct.SOIL_METRICS){const o=this.soilSplitTile(t,i);o!==j&&s.push({id:`soil_${t}_${i.key}`,tpl:o,pop:e(this.soilSplitPop(t,i.key))})}if(i){const t=this.soilStatsTile();t!==j&&s.push({id:"soil_stats",tpl:t,pop:e(this.renderSoilAllTable())})}const o=this.overviewDevices().map(e=>{const t=`${e.domain}:${e.suffix}`;return{id:t,tpl:this.deviceTile(e),pop:this.devicePop(e,t)}}),a=this.outletSlots().flatMap(t=>this.outletNums(t).map(i=>{const s=this.outletKey(t,i);return{id:`${t}:${i}`,tpl:this.outletTile(t,i),pop:this.outletOpen===s?e(this.renderOutletPop()):void 0}}));return{params:s,devices:o,outlets:a,energy:this.hasEnergyTile()?{id:"energy",tpl:this.energyTile(),pop:"power"===this.paramOpen?e(this.renderParamGraph()):void 0}:null}}paramPop(e){const t=[];if(this.paramOpen===e){const e=this.renderParamGraph();e!==j&&t.push(e)}if(e.startsWith("soil_avg_")){const i=e.slice(9);if(this.soilGraphOpen===i&&t.push(this.renderSoilGraph(i)),this.soilOpen===i){const e=this.renderSoilPop();e!==j&&t.push(e)}}return t.length?V`${t}`:void 0}devicePop(e,t){const i=[];if(this.deviceGraphOpen===t){const t=this.renderDeviceGraph(e);t!==j&&i.push(t)}if(this.deviceOpen===t){const e=this.renderDevicePop();e!==j&&i.push(e)}return i.length?V`${i}`:void 0}unifiedNatural(e){const t=[];if(this.unifiedDeviceQuick){const e=this.renderDeviceQuickRow(!0);e!==j&&t.push({id:"quickrow:devices",tpl:e,full:!0})}if(this.unifiedOutletQuick)for(const e of this.outletSlots()){const i=this.renderQuickRow(e,!0);i!==j&&t.push({id:`quickrow:${e}`,tpl:i,full:!0})}return t.push(...e.params,...e.energy?[e.energy]:[],...e.devices,...e.outlets),t}unifiedOrder(e,t){const i=new Set(t),s=e=>!!e.full&&!i.has(e.id),o=e.filter(s),a=e.filter(e=>!s(e));return[...o,...this.applyOrder(a,e=>e.id,t)]}presentTileIds(){const e=this.overviewNatural(),t=e=>e.map(e=>e.id);return{params:t(e.params),devices:t(e.devices),outlets:t(e.outlets),all:t(this.unifiedNatural(e))}}enterReorder(){if(this.outletOnly())return;const e=this.presentTileIds(),t={params:this.applyOrder(e.params,e=>e,this.tileOrder.params),devices:this.applyOrder(e.devices,e=>e,this.tileOrder.devices),outlets:this.applyOrder(e.outlets,e=>e,this.tileOrder.outlets),all:this.unifiedOrder(this.unifiedNatural(this.overviewNatural()),this.tileOrder.all).map(e=>e.id)};this.tileOrderDraft={...t},this.tileOrderBase={...t},this.hiddenDraft={...this.hiddenTiles},this.reorderMode=!0,this.tab="overview"}exitReorder(e){e&&this.tileOrderDraft&&(this.tileOrder={...this.tileOrderDraft},this.persistTileOrder()),e&&this.hiddenDraft&&(this.hiddenTiles={...this.hiddenDraft},this.persistHidden()),this.reorderMode=!1,this.tileOrderDraft=null,this.tileOrderBase=null,this.hiddenDraft=null,this.dragId=null,this.dragSec=""}persistHidden(){this.persistColorOption("hidden_tiles",Object.keys(this.hiddenTiles).filter(e=>this.hiddenTiles[e]).join(","))}effHidden(){return this.reorderMode&&this.hiddenDraft?this.hiddenDraft:this.hiddenTiles}isHidden(e){return!!this.effHidden()[e]}toggleHide(e){if(!this.reorderMode)return;const t={...this.hiddenDraft??{}};t[e]?delete t[e]:t[e]=!0,this.hiddenDraft=t}hideBtn(e,t){return V`<button class="rhide" title=${ke(t?"Show tile":"Hide tile")}
      aria-label=${ke(t?"Show tile":"Hide tile")}
      @pointerdown=${e=>e.stopPropagation()}
      @click=${t=>{t.stopPropagation(),this.toggleHide(e)}}>
      <ha-icon icon=${t?"mdi:eye-off-outline":"mdi:eye-outline"}></ha-icon>
    </button>`}resetOrder(){const e=this.presentTileIds();this.tileOrderDraft={params:e.params,devices:e.devices,outlets:e.outlets,all:e.all}}reorderDirty(){if(!this.tileOrderDraft||!this.tileOrderBase)return!1;const e=e=>e.join(""),t=["params","devices","outlets","all"].some(t=>e(this.tileOrderDraft[t])!==e(this.tileOrderBase[t])),i=e=>Object.keys(e).filter(t=>e[t]).sort().join(""),s=i(this.hiddenDraft??{})!==i(this.hiddenTiles);return t||s}reorderMove(e,t,i){if(!this.tileOrderDraft||t===i)return;const s=[...this.tileOrderDraft[e]],o=s.indexOf(t),a=s.indexOf(i);o<0||a<0||(s.splice(o,1),s.splice(a,0,t),this.tileOrderDraft={...this.tileOrderDraft,[e]:s})}onReorderDown(e){const t=e.target?.closest?.(".rwrap");if(t){this.dragId=t.dataset.tid||null,this.dragSec=t.dataset.sec||"";try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}e.preventDefault()}}onReorderMoveEvt(e){if(!this.dragId)return;e.preventDefault();const t=this.renderRoot,i=t.elementFromPoint?.(e.clientX,e.clientY),s=i?.closest?.(".rwrap");if(!s)return;const o=s.dataset.sec||"",a=s.dataset.tid||"";o===this.dragSec&&a&&a!==this.dragId&&this.reorderMove(o,this.dragId,a)}onReorderUp(){this.dragId=null}outOfRange(e,t){const i=this.alertsSettings();if(!i||!Number.isFinite(t))return null;const s=[...i.climate||[],...i.substrate||[]].find(t=>t&&t.key===e);if(!s||!s.enabled)return null;const o=Number(s.max),a=Number(s.min);return Number.isFinite(o)&&t>o?"above":Number.isFinite(a)&&t<a?"below":null}colorForOor(e){return"above"===e?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colHi,state:"above"}:"below"===e?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colLo,state:"below"}:"near"===e?"off"===this.colorMode?null:{mode:this.colorMode,color:this.colWarn,state:"near"}:"off"===this.colorModeIn?null:{mode:this.colorModeIn,color:this.colIn,state:"in"}}readingColor(e,t){const i=parseFloat(t);return Number.isFinite(i)?this.colorForOor(e?this.outOfRange(e,i):null):null}leafVpdRange(){const e=this.get(this.eid("number","leaf_vpd_min")),t=this.get(this.eid("number","leaf_vpd_max")),i=e=>e&&Number.isFinite(+e.state)?+e.state:null;return{min:i(e),max:i(t)}}planStageCurrent(){const e=this.planInfo();if(!e.active||!e.stages.length)return null;const t=e.progress?e.progress.stageId:void 0;return e.stages.find(e=>e.stageId===t)||e.stages[0]}ppfdPlanTargetSub(){let e=!1;try{e=!!this.planInfo().active}catch{e=!1}if(!e)return j;const t=this.config.panel;for(const e of["light_1","light_2"]){const i=this.modeOf(`select.sf_${t}_${e}_mode`,"");if("PPFD"!==i&&"PPFD - Plan"!==i)continue;const s=Number(this.get(`number.sf_${t}_${e}_ppfd_target`)?.state);if(Number.isFinite(s)&&s>0)return V`<div class="tile-target">${ke("target")} ${Math.round(s)} µmol</div>`}return j}targetInfo(e){const t=Qe[e];if(!t)return null;const i=this.config.panel,s=!1!==this.cycleIsDay(),o=this.planStageCurrent();if(o){const e=o[`${t}_${s?"day":"night"}`];if(null!=e&&Number.isFinite(Number(e))){let s=Number(e),a=Number(o[`${t}_dz`]);if("temp"===t){const e=this.get(`number.sf_${i}_env_temp_day`)?.attributes?.unit_of_measurement;"°F"!==e&&"℉"!==e||(s=9*s/5+32,Number.isFinite(a)&&(a=9*a/5))}return Number.isFinite(a)||(a=Number(this.get(`number.sf_${i}_env_${t}_deadband`)?.state??0)||0),{target:Math.round(10*s)/10,dead:Math.round(10*a)/10}}}const a=this.get(`number.sf_${i}_env_${t}_${s?"day":"night"}`),n=this.get(`number.sf_${i}_env_${t}_deadband`);if(!a||!n)return null;const r=parseFloat(a.state),l=parseFloat(n.state);return Number.isFinite(r)&&Number.isFinite(l)?{target:r,dead:l}:null}vpdRangeNums(e,t){const i=this.get(e),s=this.get(t);if(!i||!s)return null;const o=Number(i.state),a=Number(s.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,d="°C"===i.attributes.unit_of_measurement,c=e=>d?e:5*(e-32)/9,h=e=>.6108*Math.exp(17.27*e/(e+237.3));return{lo:Math.max(0,h(c(o-r))*(1-Math.min(100,a+l)/100)),hi:Math.max(0,h(c(o+r))*(1-Math.max(0,a-l)/100))}}airVpdRange(){const e=this.config.panel,t=this.targetInfo("temperature"),i=this.targetInfo("humidity");if(!t||!i){const t=!1!==this.cycleIsDay()?"day":"night";return this.vpdRangeNums(`number.sf_${e}_env_temp_${t}`,`number.sf_${e}_env_humi_${t}`)}const s=this.get(`number.sf_${e}_env_temp_day`)?.attributes?.unit_of_measurement,o="°C"===s,a=e=>.6108*Math.exp(17.27*e/(e+237.3)),n=(e=>o?e:5*(e-32)/9)(t.target),r=o?t.dead:5*t.dead/9,l=Math.max(0,i.target-i.dead),d=Math.min(100,i.target+i.dead),c=Math.max(0,a(n-r)*(1-d/100)),h=Math.max(0,a(n+r)*(1-l/100));return h>c?{lo:c,hi:h}:null}targetBandRaw(e){const t=this.targetInfo(e);if(t)return{lo:t.target-t.dead,hi:t.target+t.dead,margin:t.dead};if("vpd"===e){const e=this.airVpdRange();return e&&e.hi>e.lo?{lo:e.lo,hi:e.hi,margin:.15*(e.hi-e.lo)}:null}if("leaf_vpd"===e){const{min:e,max:t}=this.leafVpdRange();return null!=e&&null!=t&&t>e?{lo:e,hi:t,margin:.15*(t-e)}:null}if(e.startsWith("soil_avg_")){const t=this.alarmRange(e);if(t)return{lo:t.lo,hi:t.hi,margin:.06*(t.hi-t.lo)}}return null}alarmRange(e){const t=Ve[e];if(!t)return null;const i=this.alertsSettings();if(!i)return null;const s=[...i.climate||[],...i.substrate||[]].find(e=>e&&e.key===t);if(!s||!s.enabled)return null;const o=Number(s.min),a=Number(s.max);return Number.isFinite(o)&&Number.isFinite(a)&&a>o?{lo:o,hi:a}:null}metricBand(e){const t=this.targetBandRaw(e);if("leaf_vpd"===e)return t;if("targets"===this.colorSource)return t;const i=this.alarmRange(e),s=i?{lo:i.lo,hi:i.hi,margin:0}:null;return"alarms"===this.colorSource?s:t??s}targetOutOfRange(e,t){const i=this.metricBand(e);return i?t>i.hi+i.margin?"above":t<i.lo-i.margin?"below":t>i.hi||t<i.lo?"near":null:null}targetSubline(e,t){if(!this.showTargets)return j;const i=this.targetInfo(e);if("alarms"!==this.colorSource&&i)return V`<div class="tile-target">${ke("target")} ${i.target}${t} · ±${i.dead}</div>`;const s=this.metricBand(e);if(!s)return j;const o="alarms"!==this.colorSource||"leaf_vpd"===e?"target":"range",a=Math.abs((s.lo+s.hi)/2),n=t||"",r=/kpa/i.test(n)?2:/ms\/cm/i.test(n)?1:/°|%|ppm|µmol/.test(n)?0:a<10?2:a<100?1:0;return V`<div class="tile-target">${ke(o)} ${s.lo.toFixed(r)}–${s.hi.toFixed(r)} ${t}</div>`}paramEid(e){return`sensor.sf_${this.config.panel}_${e}`}recordHistory(){const e=Date.now();for(const[t]of We){const i=this.get(this.paramEid(t)),s=i?parseFloat(i.state):NaN;if(!Number.isFinite(s))continue;const o=this.paramEid(t),a=this._hist[o]||(this._hist[o]=[]),n=a[a.length-1];for((!n||n.v!==s||e-n.t>6e4)&&a.push({t:e,v:s});a.length>60||a.length&&e-a[0].t>12e5;)a.shift()}}trend(e){const t=this._hist[this.paramEid(e)];if(!t||t.length<3)return null;const i=t[0].v,s=t[t.length-1].v,o=t.reduce((e,t)=>Math.max(e,Math.abs(t.v)),0)||1;return Math.abs(s-i)<Math.max(.05,.004*o)?"flat":s>i?"up":"down"}trendIcon(e){if(!this.showTrend)return j;const t=this.trend(e);if(!t)return j;return V`<ha-icon class="tile-trend" icon=${"up"===t?"mdi:trending-up":"down"===t?"mdi:trending-down":"mdi:trending-neutral"} style="color:${"up"===t?"#ff8a65":"down"===t?"#5db2ff":"var(--secondary-text-color)"}"></ha-icon>`}bandInfo(e){const t=this.metricBand(e);if(!t)return null;const i=t.hi-t.lo;return{min:t.lo-i-t.margin,max:t.hi+i+t.margin,bandLo:t.lo,bandHi:t.hi,warnLo:t.lo-t.margin,warnHi:t.hi+t.margin}}renderBand(e,t){if(!this.showBand||!Number.isFinite(t))return j;const i=this.bandInfo(e);if(!i)return j;let s=i.min,o=i.max;const a=o-s||1;t<s&&(s=t-.06*a),t>o&&(o=t+.06*a);const n=e=>Math.max(0,Math.min(100,(e-s)/(o-s)*100));return V`<div class="tile-band">
      <div class="bz" style=${`left:${n(i.warnLo)}%;width:${n(i.warnHi)-n(i.warnLo)}%;background:${qe(this.colWarn,.28)}`}></div>
      <div class="bz" style=${`left:${n(i.bandLo)}%;width:${n(i.bandHi)-n(i.bandLo)}%;background:${qe(this.colIn,.42)}`}></div>
      <div class="bmark" style=${`left:${n(t)}%`}></div>
    </div>`}_gkey(e){return`${e}|${this.graphRange}`}toggleGraph(e){const t=this.paramOpen===e;this.paramOpen=t?null:e,this._graphSel=null,this._graphPin=null,null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null),t||(this.fetchGraph(this.paramEid(e)),this._graphTimer=window.setInterval(()=>{null!=this.paramOpen?this._graphVer++:null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null)},1e4))}soilGraphEids(e){const t=this.soilProbeRows(e).map(e=>e.eid);return[...t,this.paramEid(`soil_avg_${e}`)]}toggleSoilGraph(e){const t=this.soilGraphOpen===e;if(this.soilGraphOpen=t?null:e,this._graphSel=null,this._graphPin=null,null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null),!t){for(const t of this.soilGraphEids(e))this.fetchGraph(t);this._graphTimer=window.setInterval(()=>{null!=this.soilGraphOpen||null!=this.paramOpen?this._graphVer++:null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null)},1e4)}}setGraphRange(e){if(e!==this.graphRange){if(this.graphRange=e,this._graphSel=null,this._graphPin=null,this.persistColorOption("graph_range",String(e)),this.paramOpen&&this.fetchGraph(this.paramEid(this.paramOpen)),this.soilGraphOpen)for(const e of this.soilGraphEids(this.soilGraphOpen))this.fetchGraph(e);if(this.deviceGraphOpen){const e=this.deviceLevelSensor(this.deviceGraphOpen.split(":")[1]);e&&this.fetchGraph(e.eid)}}}setPowerMetric(e){e!==this.powerMetric&&(this.powerMetric=e,this._graphSel=null,this._graphPin=null,this.persistColorOption("power_metric",e),"power"===this.paramOpen&&this.fetchGraph(this.paramEid(e)))}async fetchGraph(e){const t=this._gkey(e),i=null!=this._graphAt[t]&&Date.now()-this._graphAt[t]<15e3;if(!(this._graph[t]&&i||this._graphLoading[t])&&this.hass){this._graphLoading[t]=!0;try{const i=new Date,s=new Date(i.getTime()-3600*this.graphRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0}),a=o&&o[e]||[];this._graph[t]=a.map(e=>({t:null!=e.lu?1e3*e.lu:Date.parse(e.last_updated??e.last_changed),v:parseFloat(e.s??e.state)})).filter(e=>Number.isFinite(e.v)&&Number.isFinite(e.t)),this._graphAt[t]=Date.now()}catch(e){this._graph[t]=[]}finally{this._graphLoading[t]=!1,this._graphVer++}}}renderParamGraph(e){const t=e?null:this.paramOpen;if(!e&&!t)return j;const i=!e&&"power"===t,s=i?ct.POWER_METRICS.find(e=>e.key===this.powerMetric)??ct.POWER_METRICS[0]:null,o=e?e.eid:this.paramEid(i?s.key:t),a=this._gkey(o),n=e?e.label:i?s.label:(We.find(e=>e[0]===t)||[,t.charAt(0).toUpperCase()+t.slice(1)])[1],r=this.get(o)?.attributes.unit_of_measurement||"",l=!!e&&!r,d=()=>{this._graphSel=null,this._graphPin=null,e?e.onClose():this.paramOpen=null},c=V`<select class="pg-range" @change=${e=>this.setGraphRange(Number(e.target.value))}>
      ${[[1,"1h"],[6,"6h"],[12,"12h"],[24,"24h"],[168,"7d"]].map(([e,t])=>V`
        <option value=${e} ?selected=${this.graphRange===e}>${t}</option>`)}
    </select>`,h=i?V`<select class="pg-range" @change=${e=>this.setPowerMetric(e.target.value)}>
      ${ct.POWER_METRICS.map(e=>V`
        <option value=${e.key} ?selected=${this.powerMetric===e.key}>${ke(e.label)}</option>`)}
    </select>`:e?.picker?V`<select class="pg-range" @change=${t=>e.picker.onPick(t.target.value)}>
      ${e.picker.options.map(t=>V`
        <option value=${t.key} ?selected=${e.picker.current===t.key}>${ke(t.label)}</option>`)}
    </select>`:j;if(this._graphLoading[a])return V`<div class="param-graph"><div class="pg-head"><span>${ke(n)}</span>${h}${c}<span class="pg-now">…</span><ha-icon icon="mdi:close" @click=${d}></ha-icon></div><span class="pg-note">${ke("Loading history…")}</span></div>`;this.fetchGraph(o);const p=this._graph[a],u=this.get(o),g=u&&"unavailable"!==u.state&&"unknown"!==u.state?parseFloat(u.state):NaN,m=Date.now(),f=p&&p.length&&Number.isFinite(g)&&m-p[p.length-1].t>1e3?[...p,{t:m,v:g}]:p||[];if(f.length<2)return V`<div class="param-graph"><div class="pg-head"><span>${ke(n)}</span>${h}${c}<span class="pg-now"></span><ha-icon icon="mdi:close" @click=${d}></ha-icon></div><span class="pg-note">${ke("Not enough history yet for {name} at this range.",{name:ke(n)})}</span></div>`;const v=f.map(e=>e.v),b=Math.min(...v),_=Math.max(...v),y=v.reduce((e,t)=>e+t,0)/v.length,$=v[v.length-1],x=l?0:Math.abs(y)<10?2:Math.abs(y)<100?1:0,w=e=>e.toFixed(x),S=e?null:this.bandInfo(t),k=e?null:"leaf_vpd"===t||"alarms"!==this.colorSource?this.targetOutOfRange(t,$):this.outOfRange(Ve[t],$),O="above"===k?this.colHi:"below"===k?this.colLo:"near"===k?this.colWarn:"var(--primary-text-color)",D=520,T=120,C=f[0].t,M=f[f.length-1].t||C+1;let P=b,A=_;if(l)P=Math.floor(b),A=Math.ceil(_),A-P<1&&(P-=1,A+=1),P=Math.max(0,P);else{S&&(P=Math.min(P,S.warnLo),A=Math.max(A,S.warnHi));const e=.08*(A-P)||1;P-=e,A+=e,b>=0&&(!S||S.warnLo>=0)&&(P=Math.max(0,P)),"%"===r&&_<=100&&(A=Math.min(100,A))}const L=e=>6+(e-C)/(M-C)*508,E=e=>114-(e-P)/(A-P)*108,N=e=>L(e).toFixed(1),F=e=>E(e).toFixed(1);let z=`M${N(f[0].t)} ${F(f[0].v)}`;for(let e=1;e<f.length;e++)z+=` L${N(f[e].t)} ${F(f[e-1].v)} L${N(f[e].t)} ${F(f[e].v)}`;const R=z,B=114..toFixed(1),H=i?`${R} L${N(f[f.length-1].t)} ${B} L${N(f[0].t)} ${B} Z`:null,I=this.accent(),G=v.indexOf(b),W=v.indexOf(_),K=(e,t)=>Q`<line x1="0" x2=${D} y1=${E(e).toFixed(1)} y2=${E(e).toFixed(1)} stroke=${t} stroke-width="1" stroke-dasharray="3 3" opacity="0.6"></line>`,q=e=>this.graphRange>=168?new Date(e).toLocaleDateString([],{month:"numeric",day:"numeric"}):new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:this.hour12}),U=this.graphRange>=168?7:6,Z=Array.from({length:U+1},(e,t)=>C+t/U*(M-C)),J=null!=this._graphSel?this._graphSel:null!=this._graphPin?this._graphPin:null,Y=null!=J?this._graphSampleAt(f,J):null,X=(e,t)=>{const i=e.currentTarget.getBoundingClientRect();if(!i.width)return;const s=Math.max(0,Math.min(1,(e.clientX-i.left)/i.width)),o=C+s*(M-C);this._graphSel=o,t&&(this._graphPin=o)},ee=null!=Y?Y.v:$;return V`<div class="param-graph">
      <div class="pg-head">
        <span>${ke(n)}</span>${h}${c}
        <span class="pg-now" style="color:${null!=Y?"var(--primary-text-color)":O}">
          ${null!=Y?V`<span class="pg-at">${(e=>new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))(Y.t)}</span> `:j}${w(ee)}<span class="pg-u">${r}</span></span>
        <ha-icon icon="mdi:close" @click=${d}></ha-icon>
      </div>
      <div class="pg-stats">
        <span>${ke("min")} <b>${w(b)}</b></span><span>${ke("avg")} <b>${w(y)}</b></span>
        <span>${ke("max")} <b>${w(_)}</b></span>
        ${S?V`<span>${ke("band")} <b>${w(S.bandLo)}–${w(S.bandHi)}</b> ${r}</span>`:j}
      </div>
      <div class="pg-plot">
        <div class="pg-yax"><span>${w(A)}</span><span>${w(P)}</span></div>
        <svg viewBox="0 0 ${D} ${T}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${e=>X(e,!1)}
          @pointerdown=${e=>{e.currentTarget.setPointerCapture?.(e.pointerId),X(e,!0)}}
          @pointerleave=${()=>{this._graphSel=null}}>
          ${Z.map(e=>Q`<line x1=${L(e).toFixed(1)} x2=${L(e).toFixed(1)} y1="0" y2=${T} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${S?Q`
            <rect x="0" y=${E(S.warnHi).toFixed(1)} width=${D} height=${(E(S.bandHi)-E(S.warnHi)).toFixed(1)} fill=${qe(this.colWarn,.16)}></rect>
            <rect x="0" y=${E(S.bandLo).toFixed(1)} width=${D} height=${(E(S.warnLo)-E(S.bandLo)).toFixed(1)} fill=${qe(this.colWarn,.16)}></rect>
            <rect x="0" y=${E(S.bandHi).toFixed(1)} width=${D} height=${(E(S.bandLo)-E(S.bandHi)).toFixed(1)} fill=${qe(this.colIn,.2)}></rect>
            ${K(S.bandHi,this.colIn)}${K(S.bandLo,this.colIn)}`:j}
          ${H?Q`<path d=${H} fill=${qe(I,.18)} stroke="none"></path>`:j}
          <path d=${R} fill="none" stroke=${I} stroke-width="2"></path>
          <circle cx=${L(f[G].t).toFixed(1)} cy=${E(b).toFixed(1)} r="2.5" fill=${this.colLo}></circle>
          <circle cx=${L(f[W].t).toFixed(1)} cy=${E(_).toFixed(1)} r="2.5" fill=${this.colHi}></circle>
          <circle cx=${L(f[f.length-1].t).toFixed(1)} cy=${E($).toFixed(1)} r="3.5" fill=${I}></circle>
          ${null!=Y?Q`
            <line x1=${L(Y.t).toFixed(1)} x2=${L(Y.t).toFixed(1)} y1="0" y2=${T} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            <circle cx=${L(Y.t).toFixed(1)} cy=${E(Y.v).toFixed(1)} r="4" fill="var(--primary-text-color)"></circle>`:j}
          <rect x="0" y="0" width=${D} height=${T} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${Z.map(e=>V`<span>${q(e)}</span>`)}</div>
    </div>`}deviceLevelSensor(e){let t,i;if(e.startsWith("light"))t=`${e}_brightness`,i="Brightness";else if("fan"===e)t="fan_speed",i="Speed";else if("blower"===e)t="blower_speed",i="Speed";else if("heater"===e)t="heater_level",i="Level";else{if("humidifier"!==e)return null;t="humidifier_level",i="Level"}const s=`sensor.sf_${this.config.panel}_${t}`;return this.get(s)?{eid:s,word:i}:null}renderDeviceGraph(e){const t=this.deviceLevelSensor(e.suffix);return t?this.renderParamGraph({eid:t.eid,label:`${ke(e.label)} · ${ke(t.word)}`,onClose:()=>{this.deviceGraphOpen=null}}):j}toggleDeviceGraph(e){const t=this.deviceGraphOpen===e;if(this.deviceGraphOpen=t?null:e,this._graphSel=null,this._graphPin=null,null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null),!t){const t=this.deviceLevelSensor(e.split(":")[1]);t&&this.fetchGraph(t.eid),this._graphTimer=window.setInterval(()=>{null!=this.deviceGraphOpen||null!=this.soilGraphOpen||null!=this.paramOpen?this._graphVer++:null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null)},1e4)}}soilMetricLabel(e){const t=`soil_avg_${e}`;return(We.find(e=>e[0]===t)||[,e.charAt(0).toUpperCase()+e.slice(1)])[1]}renderSoilGraph(e){const t=`soil_avg_${e}`,i=this.paramEid(t),s=this.soilMetricLabel(e),o=this.get(i)?.attributes.unit_of_measurement||"",a=V`<select class="pg-range" @change=${e=>this.setGraphRange(Number(e.target.value))}>
      ${[[1,"1h"],[6,"6h"],[12,"12h"],[24,"24h"],[168,"7d"]].map(([e,t])=>V`
        <option value=${e} ?selected=${this.graphRange===e}>${t}</option>`)}
    </select>`,n=V`<ha-icon icon="mdi:close" @click=${()=>{this.soilGraphOpen=null,this._graphSel=null,this._graphPin=null}}></ha-icon>`,r=e=>V`<div class="pg-head">
      <span>${ke(s)} · By Probe</span>${a}<span class="pg-now">${e}</span>${n}</div>`;let l=!1;const d=e=>{const t=this._gkey(e);this._graphLoading[t]&&(l=!0),this.fetchGraph(e);const i=this._graph[t]||[],s=this.get(e),o=s&&"unavailable"!==s.state&&"unknown"!==s.state?parseFloat(s.state):NaN,a=Date.now();return i.length&&Number.isFinite(o)&&a-i[i.length-1].t>1e3?[...i,{t:a,v:o}]:i},c=this.soilProbeRows(e).map((e,t)=>{const i=this.get(e.eid);return{name:e.name,color:De[t%De.length],width:1.5,pts:d(e.eid),live:i?parseFloat(i.state):NaN,off:st(i)}}),h=this.get(i);if(c.push({name:"Average",color:this.accent(),width:2.6,pts:d(i),live:h?parseFloat(h.state):NaN,off:st(h)}),l&&c.every(e=>!e.pts.length))return V`<div class="param-graph">${r(V`…`)}<span class="pg-note">${ke("Loading history…")}</span></div>`;const p=c.filter(e=>e.pts.length>=2);if(!p.length)return V`<div class="param-graph">${r(j)}<span class="pg-note">${ke("Not enough history yet at this range.")}</span></div>`;const u=p.flatMap(e=>e.pts.map(e=>e.v)),g=Math.min(...u),m=Math.max(...u),f=this.bandInfo(t);let v=g,b=m;f&&(v=Math.min(v,f.warnLo),b=Math.max(b,f.warnHi));const _=.08*(b-v)||1;v-=_,b+=_,g>=0&&(!f||f.warnLo>=0)&&(v=Math.max(0,v));const y=Math.min(...p.map(e=>e.pts[0].t)),$=Math.max(...p.map(e=>e.pts[e.pts.length-1].t))||y+1,x=520,w=120,S=e=>6+(e-y)/($-y)*508,k=e=>114-(e-v)/(b-v)*108,O=(g+m)/2,D=Math.abs(O)<10?2:Math.abs(O)<100?1:0,T=e=>e.toFixed(D),C=e=>this.graphRange>=168?new Date(e).toLocaleDateString([],{month:"numeric",day:"numeric"}):new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:this.hour12}),M=this.graphRange>=168?7:6,P=Array.from({length:M+1},(e,t)=>y+t/M*($-y)),A=null!=this._graphSel?this._graphSel:null!=this._graphPin?this._graphPin:null,L=null!=A?Math.max(y,Math.min($,A)):null,E=(e,t)=>{const i=e.currentTarget.getBoundingClientRect();if(!i.width)return;const s=Math.max(0,Math.min(1,(e.clientX-i.left)/i.width)),o=y+s*($-y);this._graphSel=o,t&&(this._graphPin=o)};return V`<div class="param-graph">
      ${r(null!=L?V`<span class="pg-at">${(e=>new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))(L)}</span>`:j)}
      <div class="pg-plot">
        <div class="pg-yax"><span>${T(b)}</span><span>${T(v)}</span></div>
        <svg viewBox="0 0 ${x} ${w}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${e=>E(e,!1)}
          @pointerdown=${e=>{e.currentTarget.setPointerCapture?.(e.pointerId),E(e,!0)}}
          @pointerleave=${()=>{this._graphSel=null}}>
          ${P.map(e=>Q`<line x1=${S(e).toFixed(1)} x2=${S(e).toFixed(1)} y1="0" y2=${w} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${f?Q`
            <rect x="0" y=${k(f.bandHi).toFixed(1)} width=${x} height=${(k(f.bandLo)-k(f.bandHi)).toFixed(1)} fill=${qe(this.colIn,.14)}></rect>
            <line x1="0" x2=${x} y1=${k(f.bandHi).toFixed(1)} y2=${k(f.bandHi).toFixed(1)} stroke=${this.colIn} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"></line>
            <line x1="0" x2=${x} y1=${k(f.bandLo).toFixed(1)} y2=${k(f.bandLo).toFixed(1)} stroke=${this.colIn} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"></line>`:j}
          ${p.map(e=>Q`<path d=${(e=>{const t=e=>S(e).toFixed(1),i=e=>k(e).toFixed(1);let s=`M${t(e[0].t)} ${i(e[0].v)}`;for(let o=1;o<e.length;o++)s+=` L${t(e[o].t)} ${i(e[o-1].v)} L${t(e[o].t)} ${i(e[o].v)}`;return s})(e.pts)} fill="none" stroke=${e.color} stroke-width=${e.width} opacity=${"Average"===e.name?1:.85}></path>`)}
          ${null!=L?Q`
            <line x1=${S(L).toFixed(1)} x2=${S(L).toFixed(1)} y1="0" y2=${w} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            ${p.map(e=>{const t=this._graphSampleAt(e.pts,L);return Q`<circle cx=${S(t.t).toFixed(1)} cy=${k(t.v).toFixed(1)} r="3" fill=${e.color}></circle>`})}`:j}
          <rect x="0" y="0" width=${x} height=${w} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${P.map(e=>V`<span>${C(e)}</span>`)}</div>
      <div class="pg-legend">
        ${c.map(e=>{const t=null!=L&&e.pts.length?this._graphSampleAt(e.pts,L).v:e.live,i=e.off&&null==L?"offline":Number.isFinite(t)?`${T(t)}${o}`:"—";return V`<span class="pg-leg ${"Average"===e.name?"avg":""}">
            <i style="background:${e.color}"></i>${ke(e.name)} <b>${i}</b></span>`})}
      </div>
    </div>`}_graphSampleAt(e,t){const i=e[0].t,s=e[e.length-1].t,o=Math.max(i,Math.min(s,t));let a=0;for(let t=0;t<e.length&&e[t].t<=o;t++)a=t;return{t:o,v:e[a].v}}soilCellStyle(e,t){const i=this.get(`sensor.sf_${this.config.panel}_${e}_${t}`);if(!i||st(i))return"";const s="temperature"===t?"tempSoil":"moisture"===t?"humiSoil":"ECSoil",o=this.readingColor(s,i.state);return o?`color:${o.color}`:""}getCardSize(){return 8}static getConfigElement(){return document.createElement("spider-farmer-card-editor")}static getStubConfig(e){const t=(e?ze(e):[])[0]||"dp1",i=e?Ie(e,t):[];return{type:"custom:spider-farmer-card",panel:t,...i.length?{outlets:i}:{}}}eid(e,t){return`${e}.sf_${this.config.panel}_${t}`}get(e){return e&&this._used.add(e),this.hass?.states[e]}_hassTouchedUs(e,t){if(!e||!t)return!0;if(0===this._used.size)return!0;for(const i of this._used)if(e.states[i]!==t.states[i])return!0;return!1}accent(){return this.config.accent||Oe}shouldUpdate(e){return!(1===e.size&&e.has("hass")&&!this._hassTouchedUs(e.get("hass"),this.hass))&&(e.has("config")||e.has("hass")||e.has("tab")||e.has("soilOpen")||e.has("soilGraphOpen")||e.has("soilAllOpen")||e.has("soilMode")||e.has("soilKeep")||e.has("soilTileGraph")||e.has("soilTileMetric")||e.has("outletDraft")||e.has("outletNameDraft")||e.has("outletCfgDraft")||e.has("_stDt")||e.has("_cdTick")||e.has("alertsDraft")||e.has("deviceOpen")||e.has("deviceGraphOpen")||e.has("outletOpen")||e.has("draft")||e.has("modePick")||e.has("dirPick")||e.has("outletLightDir")||e.has("logDate")||e.has("logDev")||e.has("logType")||e.has("colorMode")||e.has("colorModeIn")||e.has("colHi")||e.has("colLo")||e.has("colIn")||e.has("hideLight2")||e.has("colorDraft")||e.has("hideTabs")||e.has("outletColorMode")||e.has("ocManual")||e.has("ocSched")||e.has("ocEnv")||e.has("ocDrip")||e.has("deviceColorMode")||e.has("dcManual")||e.has("dcSched")||e.has("dcAuto")||e.has("colorSource")||e.has("colWarn")||e.has("showTrend")||e.has("showBand")||e.has("paramOpen")||e.has("_graphVer")||e.has("graphRange")||e.has("powerMetric")||e.has("_graphSel")||e.has("_graphPin")||e.has("showTargets")||e.has("tileSummary")||e.has("hour12")||e.has("showConn")||e.has("connCustom")||e.has("connSignal")||e.has("showOutletsLog")||e.has("ologRange")||e.has("showVpd")||e.has("vpdLeaf")||e.has("showLeafVpd")||e.has("_colorOpen")||e.has("vpdStage")||e.has("vpdView")||e.has("vpdHighlight")||e.has("vpdPlanSource")||e.has("showDeviceLog")||e.has("showDeviceQuick")||e.has("showTimelapseTab")||e.has("tlCam")||e.has("tlInterval")||e.has("tlDailyAt")||e.has("deviceQuickRemember")||e.has("dlogOpen")||e.has("planDraft")||e.has("planEditStage")||e.has("planShowAll")||e.has("planDelArm")||e.has("envSubView")||e.has("_planPending")||e.has("planTplOpen")||e.has("planTplName")||e.has("_tplMsg")||e.has("ologOpen")||e.has("_ologVer")||e.has("_saving")||e.has("outletCopyOpen")||e.has("outletCopySel")||e.has("outletCopyFromOpen")||e.has("showOutletQuick")||e.has("outletQuickRemember")||e.has("outletQuickNames")||e.has("leafSpots")||e.has("leafCalTarget")||e.has("customOutletNames")||e.has("outletNames")||e.has("customLayout")||e.has("cardScale")||e.has("tileCols")||e.has("layoutMode")||e.has("tileOrder")||e.has("unifiedDeviceQuick")||e.has("unifiedOutletQuick")||e.has("reorderMode")||e.has("tileOrderDraft")||e.has("hiddenTiles")||e.has("hiddenDraft")||e.has("tileOrderBase")||e.has("dragId")||e.has("_devPend")||e.has("_outPend")||e.has("_pendLevel")||e.has("tileRadius")||e.has("tileBorderW")||e.has("tileBorderCol")||e.has("tileBg")||e.has("taTiles")||e.has("taDevices")||e.has("taOutlets")||e.has("cooldownShow")||e.has("cooldownDevice")||e.has("cooldownOutlet")||e.has("cooldownSecs")||e.has("_cdOpen")||e.has("outletsOnOverview")||e.has("outletQuickOverview")||e.has("hideEnergyTile")||e.has("_setOverviewOpen")||e.has("_setExtrasOpen")||e.has("_setConnOpen")||e.has("_setVpdOpen")||e.has("_setDevOpen")||e.has("_setOutletOpen")||e.has("_setLayoutOpen")||e.has("_setSoilOpen")||e.has("tempSource")||e.has("extTemp")||e.has("extHumi")||e.has("_tsOpen")||e.has("smart")||e.has("_smartOpen"))}willUpdate(e){if(this._saving&&e.has("hass")){const e=Date.now()-this._savingAt,t=this._savingWatch.some(e=>(this.get(e.id)?.state??"")!==e.was);(this._savingWatch.length?t&&e>300||e>5e3:e>3500)&&(this._saving=!1,this._savingWatch=[],clearTimeout(this._savingT))}if(!this._colorSynced){const e=this.serverColors();Object.keys(e).length&&(e.mode&&(this.colorMode=e.mode),e.modeIn&&(this.colorModeIn=e.modeIn),e.source&&(this.colorSource=e.source),e.warn&&(this.colWarn=e.warn),void 0!==e.showTrend&&(this.showTrend=e.showTrend),void 0!==e.showBand&&(this.showBand=e.showBand),void 0!==e.showTargets&&(this.showTargets=e.showTargets),void 0!==e.tileSummary&&(this.tileSummary=e.tileSummary),void 0!==e.hour12&&(this.hour12=e.hour12),void 0!==e.showConn&&(this.showConn=e.showConn),void 0!==e.connCustom&&(this.connCustom=e.connCustom),void 0!==e.connSignal&&(this.connSignal=e.connSignal),void 0!==e.showOutletsLog&&(this.showOutletsLog=e.showOutletsLog),void 0!==e.showOutletQuick&&(this.showOutletQuick=e.showOutletQuick),void 0!==e.outletQuickRemember&&(this.outletQuickRemember=e.outletQuickRemember),void 0!==e.outletQuickNames&&(this.outletQuickNames=e.outletQuickNames),void 0!==e.showVpd&&(this.showVpd=e.showVpd),void 0!==e.showLeafVpd&&(this.showLeafVpd=e.showLeafVpd),void 0!==e.vpdLeaf&&(this.vpdLeaf=e.vpdLeaf),void 0!==e.showDeviceLog&&(this.showDeviceLog=e.showDeviceLog),void 0!==e.hideTabs&&(this.hideTabs=e.hideTabs),void 0!==e.soilMode&&(this.soilMode=e.soilMode),void 0!==e.soilKeep&&(this.soilKeep=e.soilKeep),void 0!==e.showTimelapseTab&&(this.showTimelapseTab=e.showTimelapseTab),void 0!==e.tlCam&&(this.tlCam=e.tlCam),void 0!==e.tlInterval&&(this.tlInterval=e.tlInterval),void 0!==e.tlDailyAt&&(this.tlDailyAt=e.tlDailyAt),void 0!==e.showDeviceQuick&&(this.showDeviceQuick=e.showDeviceQuick),void 0!==e.deviceQuickRemember&&(this.deviceQuickRemember=e.deviceQuickRemember),e.hi&&(this.colHi=e.hi),e.lo&&(this.colLo=e.lo),e.in&&(this.colIn=e.in),void 0!==e.hide2&&(this.hideLight2=e.hide2),e.omode&&(this.outletColorMode=e.omode),e.ocManual&&(this.ocManual=e.ocManual),e.ocSched&&(this.ocSched=e.ocSched),e.ocEnv&&(this.ocEnv=e.ocEnv),e.ocDrip&&(this.ocDrip=e.ocDrip),e.dmode&&(this.deviceColorMode=e.dmode),e.dcManual&&(this.dcManual=e.dcManual),e.dcSched&&(this.dcSched=e.dcSched),e.dcAuto&&(this.dcAuto=e.dcAuto),void 0!==e.customNames&&(this.customOutletNames=e.customNames),void 0!==e.customLayout&&(this.customLayout=e.customLayout),e.scale&&(this.cardScale=e.scale),e.cols&&(this.tileCols=e.cols),e.layoutMode&&(this.layoutMode=e.layoutMode),void 0!==e.unifiedDeviceQuick&&(this.unifiedDeviceQuick=e.unifiedDeviceQuick),void 0!==e.unifiedOutletQuick&&(this.unifiedOutletQuick=e.unifiedOutletQuick),e.tileOrder&&(this.tileOrder=e.tileOrder),e.graphRange&&(this.graphRange=e.graphRange),e.ologRange&&(this.ologRange=e.ologRange),e.powerMetric&&(this.powerMetric=e.powerMetric),e.hiddenTiles&&!this.reorderMode&&(this.hiddenTiles=e.hiddenTiles),void 0!==e.tileRadius&&(this.tileRadius=e.tileRadius),void 0!==e.tileBorderW&&(this.tileBorderW=e.tileBorderW),void 0!==e.tileBorderCol&&(this.tileBorderCol=e.tileBorderCol),void 0!==e.tileBg&&(this.tileBg=e.tileBg),void 0!==e.taTiles&&(this.taTiles=e.taTiles),void 0!==e.taDevices&&(this.taDevices=e.taDevices),void 0!==e.taOutlets&&(this.taOutlets=e.taOutlets),void 0!==e.cooldownShow&&(this.cooldownShow=e.cooldownShow),void 0!==e.cooldownDevice&&(this.cooldownDevice=e.cooldownDevice),void 0!==e.cooldownOutlet&&(this.cooldownOutlet=e.cooldownOutlet),void 0!==e.cooldownSecs&&Number.isFinite(e.cooldownSecs)&&(this.cooldownSecs=e.cooldownSecs),void 0!==e.outletsOnOverview&&(this.outletsOnOverview=e.outletsOnOverview),void 0!==e.outletQuickOverview&&(this.outletQuickOverview=e.outletQuickOverview),void 0!==e.hideEnergyTile&&(this.hideEnergyTile=e.hideEnergyTile),void 0!==e.tempSource&&(this.tempSource=e.tempSource),void 0!==e.extTemp&&(this.extTemp=e.extTemp),void 0!==e.extHumi&&(this.extHumi=e.extHumi),void 0!==e.smart&&(this.smart=e.smart),this._colorSynced=!0,this.cacheColors());const t=this.serverOutletNames();Object.keys(t).length&&(this.outletNames=t);const i=this.serverOutletLightDirs();Object.keys(i).length&&(this.outletLightDir=i)}if(e.has("tab")&&(null!==this.colorDraft&&(this.colorDraft=null),null!==this.alertsDraft&&(this.alertsDraft=null),null!==this.envSubView&&(this.envSubView=null),null!==this.planDraft&&(this.planDraft=null),null!==this.planEditStage&&(this.planEditStage=null),this.planShowAll&&(this.planShowAll=!1),this.planDelArm&&(this.planDelArm=!1),Object.keys(this.draft).length&&(this.draft={}),Object.keys(this.outletDraft).length&&(this.outletDraft={}),Object.keys(this.outletNameDraft).length&&(this.outletNameDraft={}),Object.keys(this.outletCfgDraft).length&&(this.outletCfgDraft={}),Object.keys(this.modePick).length&&(this.modePick={})),e.has("hass")&&this.recordHistory(),e.has("hass")&&Object.keys(this.modePick).length){let e=null;for(const[t,i]of Object.entries(this.modePick))this.get(t)?.state===i&&(e=e??{...this.modePick},delete e[t]);e&&(this.modePick=e)}if(e.has("hass")&&Object.keys(this._devPend).length){let e=null;for(const[t,i]of Object.entries(this._devPend)){const s=this.deviceLiveOn(t);null!==s&&s===i.on&&(e=e??{...this._devPend},delete e[t])}e&&(this._devPend=e)}if(e.has("hass")&&Object.keys(this._pendLevel).length){let e=null;const t=Date.now();for(const[i,s]of Object.entries(this._pendLevel)){const o=this.liveLevelPct(i);(t>s.until||o>=0&&Math.abs(o-s.pct)<=1)&&(e=e??{...this._pendLevel},delete e[i])}e&&(this._pendLevel=e)}if(e.has("hass")&&Object.keys(this._outPend).length){let e=null;for(const[t,i]of Object.entries(this._outPend)){const s=this.get(t);s&&"on"===s.state===i.on&&(e=e??{...this._outPend},delete e[t])}e&&(this._outPend=e)}}cleaningActive(){const e=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);return!!e&&"on"===e.state}cleaningRemaining(){const e=this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_time`),t=e?parseInt(e.state,10):NaN;if(!Number.isFinite(t)||t<=0)return"";const i=Math.floor(t/3600),s=Math.floor(t%3600/60);return i?`${i}h ${s}m`:`${s}m`}cleaningCooling(){return"2"===this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_phase`)?.state}cleaningLabel(){return ke(this.cleaningCooling()?"Cooling":"Cleaning")}setCleaning(e){this.hass?.callService("sf","set_sensor_heating",{entity_id:`binary_sensor.sf_${this.config.panel}_sensor_cleaning`,on:e})}renderSensorCleaning(){const e=this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);if(!e)return j;const t="on"===e.state,i=this.cleaningCooling(),s=this.cleaningRemaining(),o=this.accent(),a=t?i?"Cooling sensor…":"Cleaning sensor…":"Not cleaning",n=t&&i?"mdi:thermometer-chevron-down":"mdi:broom",r="flex:1;border-radius:8px;padding:9px;font-size:13px;font-weight:500;";return V`
      <div class="section-label">${ke("Sensor Cleaning")}</div>
      <div style="font-size:12px;color:var(--secondary-text-color);line-height:1.5;margin:0 0 10px;">
        ${ke("Runs a self-clean heat cycle on the air temp/humidity probe (~2 hours). The probe's device turns off during it, then a 5-minute cooldown follows — Air Temp, Humidity and VPD pause until it finishes.")}
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:var(--secondary-background-color);border-radius:8px;padding:9px 11px;margin-bottom:10px;">
        <ha-icon icon=${n}
          style="color:${t?o:"var(--secondary-text-color)"}"></ha-icon>
        <span style="font-size:13px;">${ke(a)}</span>
        <span style="margin-left:auto;font-size:13px;font-weight:500;color:${o};">${t&&s?ke("{time} left",{time:s}):""}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button ?disabled=${t} @click=${()=>this.setCleaning(!0)}
          style="${r}border:none;cursor:${t?"not-allowed":"pointer"};opacity:${t?".45":"1"};background:${o};color:#fff;">${ke("Start cleaning")}</button>
        <button ?disabled=${!t} @click=${()=>this.setCleaning(!1)}
          style="${r}background:transparent;cursor:${t?"pointer":"not-allowed"};opacity:${t?"1":".45"};color:${o};border:1px solid ${o};">${ke("Stop cleaning")}</button>
      </div>`}renderParam([e,t,i]){if("leaf_vpd"===e&&!this.showLeafVpd)return j;const s=this.get(`sensor.sf_${this.config.panel}_${e}`);if(!s)return j;const o=s.attributes.unit_of_measurement||"",a=e.startsWith("soil_avg_")&&st(s),n=["temperature","humidity","vpd","leaf_vpd"].includes(e)&&this.cleaningActive(),r=n?"--":a?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(s).replace(o,"").trim():s.state,l=e.startsWith("soil_avg_")?e.slice(9):null,d=!!l&&this.soilProbeRows(l).length>1,c=d&&this.soilOpen===l;let h;const p=this.paramOpen===e;if(a||n)h=null;else{const t=parseFloat(s.state);if(Number.isFinite(t)){const i="targets"!==this.colorSource?this.outOfRange(Ve[e],t):null,s="alarms"!==this.colorSource||"leaf_vpd"===e?this.targetOutOfRange(e,t):null;h=this.colorForOor(i??s)}else h=null}const u=!a&&!d,g=!!l&&this.soilGraphOpen===l;let m=c||p||g?`box-shadow:inset 0 0 0 1px ${this.accent()}`:"",f="";a?(m=`background:${je};box-shadow:inset 0 0 0 1px ${Ke}`,f=`color:${Ke}`):h&&"text"===h.mode?f=`color:${h.color}`:h&&"tile"===h.mode&&(m=`background:${qe(h.color)};box-shadow:inset 0 0 0 1px ${h.color}`);const v=d||u;return V`
      <div class="tile ${v?"clickable":""} ${c||p||g?"active":""}"
        style=${m||j}
        role=${v?"button":j}
        @click=${d?()=>this.soilOpen=c?null:l:u?()=>this.toggleGraph(e):void 0}>
        <div class="tile-label">
          <span class="tl-name">${ke(t)}</span>
          <span class="tl-right">
            ${n?V`<ha-icon icon="mdi:broom" title=${ke("Sensor cleaning")}
              style="--mdc-icon-size:15px;color:var(--warning-color,#ff9800)"></ha-icon>`:j}
            ${this.trendIcon(e)}
            ${d&&l?V`<ha-icon class="tile-more soil-graph-btn"
                  icon="mdi:chart-line" title=${ke("History graph")}
                  role="button" aria-label=${ke("History graph")}
                  style=${this.soilGraphOpen===l?`color:${this.accent()}`:j}
                  @click=${e=>{e.stopPropagation(),this.toggleSoilGraph(l)}}></ha-icon>`:j}
            ${d?V`<ha-icon class="tile-more"
                  icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>`:u?V`<ha-icon class="tile-more"
                  icon=${p?"mdi:chevron-up":"mdi:chart-line"}></ha-icon>`:j}
          </span>
        </div>
        <ha-icon icon="${i}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${f||j}>${r}${a||n?j:V`<span class="unit">${o}</span>`}</div>
        ${n?V`<div class="tile-target" style="color:var(--warning-color,#ff9800)">${this.cleaningLabel()}${this.cleaningRemaining()?" · "+this.cleaningRemaining():""}</div>`:a?j:this.targetSubline(e,o)}
        ${a||n||"ppfd"!==e?j:this.ppfdPlanTargetSub()}
        ${a||n?j:this.renderBand(e,parseFloat(s.state))}
      </div>`}soilProbeRows(e){const t=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${e}$`),i=[];for(const s of Object.keys(this.hass?.states??{})){const o=Pe(s).match(t);o&&i.push({slot:o[1],name:this.soilSensorName(s,e),eid:s,e:this.hass.states[s]})}return i.sort((e,t)=>Number(e.slot.replace(/\D/g,""))-Number(t.slot.replace(/\D/g,""))),i.map(({name:e,eid:t,e:i})=>({name:e,eid:t,e:i}))}soilSensorName(e,t){let i=this.hass?.states[e]?.attributes.friendly_name??"";const s=Ge(this.hass,this.config.panel);s&&i.startsWith(s)&&(i=i.slice(s.length).trim());const o="temperature"===t?"Temperature":"moisture"===t?"Moisture":"EC";return i=i.replace(new RegExp(`\\s*${o}\\s*$`,"i"),"").trim(),i||Pe(e)}renderSoilPop(){const e=this.soilOpen;if(!e)return j;const t=this.soilProbeRows(e);return t.length?V`
      <div class="soil-pop">
        <div class="soil-pop-head sph-tc">
          <span>${this.soilMetricLabel(e)} · By Probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label=${ke("Close")}
            @click=${()=>this.soilOpen=null}></ha-icon>
        </div>
        ${t.map(({name:t,e:i})=>{const s=st(i),o=i.attributes.unit_of_measurement||"",a=this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,n="temperature"===e?"tempSoil":"moisture"===e?"humiSoil":"ECSoil",r=s?null:this.readingColor(n,i.state);return V`
            <div class="soil-pop-row ${s?"offline":""}">
              <span class="spn">${ke(t)}</span>
              <span class="spv" style=${r?`color:${r.color}`:j}>${s?V`Offline`:V`${a}<span class="unit">${o}</span>`}</span>
            </div>`})}
      </div>`:j}soilProbeSlots(){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`),t=new Set;for(const i of Object.keys(this.hass?.states??{})){const s=Pe(i).match(e);s&&t.add(s[1])}return[...t].sort((e,t)=>Number(e.replace(/\D/g,""))-Number(t.replace(/\D/g,"")))}probeOffline(e){const t=this.get(`sensor.sf_${this.config.panel}_${e}_temperature`)??this.get(`sensor.sf_${this.config.panel}_${e}_moisture`)??this.get(`sensor.sf_${this.config.panel}_${e}_ec`);return st(t)}soilCellValue(e,t){const i=this.get(`sensor.sf_${this.config.panel}_${e}_${t}`);return i&&"unknown"!==i.state&&"unavailable"!==i.state?this.hass?.formatEntityState?this.hass.formatEntityState(i):`${i.state}${i.attributes.unit_of_measurement??""}`:"—"}probeNameForSlot(e){for(const t of["temperature","moisture","ec"]){const i=`sensor.sf_${this.config.panel}_${e}_${t}`;if(this.hass?.states[i])return this.soilSensorName(i,t)}return e.replace(/^soil(\d+)$/,"Soil $1")}soilStatsTile(){const e=this.soilProbeSlots();if(e.length<2)return j;const t=this.soilAllOpen,i=this.accent(),s=e.filter(e=>this.probeOffline(e)).length,o=s?`background:${je};box-shadow:inset 0 0 0 1px ${Ke}`:t?`box-shadow:inset 0 0 0 1px ${i}`:"",a=s?`${s} offline`:`${e.length} probes`;return V`
      <div class="tile clickable ${t?"active":""}" style=${o||j}
        role="button" aria-expanded=${t?"true":"false"}
        @click=${()=>this.soilAllOpen=!t}>
        <div class="tile-label">${ke("All Soil Stats")}
          <ha-icon class="tile-more"
            icon=${t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${s?Ke:i}"></ha-icon>
        <div class="tile-val" style=${s?`color:${Ke}`:j}>${ke(a)}</div>
      </div>`}renderSoilAllTable(){const e=this.soilProbeSlots();return e.length<2||!this.soilAllOpen?j:V`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">${ke("Probe")}</span>
          <span class="sa-v">${ke("Temp")}</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${e.map(e=>V`
            <div class="soil-all-row ${this.probeOffline(e)?"offline":""}">
              <span class="sa-name">${this.probeNameForSlot(e)}</span>
              <span class="sa-v" style=${this.soilCellStyle(e,"temperature")||j}>${this.soilCellValue(e,"temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(e,"moisture")||j}>${this.soilCellValue(e,"moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(e,"ec")||j}>${this.soilCellValue(e,"ec")}</span>
            </div>`)}
      </div>`}soilCell(e,t){const i=this.get(`sensor.sf_${this.config.panel}_${e}_${t.key}`);if(!i)return{val:"—",unit:"",color:null,mode:"off",off:!0,present:!1};const s=st(i),o=i.attributes.unit_of_measurement||"",a=s?"Offline":this.hass?.formatEntityState?this.hass.formatEntityState(i).replace(o,"").trim():i.state,n=s?null:this.readingColor(t.ck,i.state);return{val:a,unit:o,color:n?n.color:null,mode:n?n.mode:"off",off:s,present:!0}}soilSensorTile(e){const t=this.probeNameForSlot(e),i=this.probeOffline(e),s=this.accent(),o=this.soilTileGraph===e;return V`
      <div class="tile clickable ${o?"active":""}" style=${(i?`background:${je};box-shadow:inset 0 0 0 1px ${Ke}`:o?`box-shadow:inset 0 0 0 1px ${s}`:"")||j}
        role="button" @click=${()=>this.toggleSoilTileGraph(e)}>
        <div class="tile-label"><span class="tl-name">${ke(t)}</span>
          <span class="tl-right"><ha-icon class="tile-more"
            icon=${o?"mdi:chevron-up":"mdi:chart-line"}></ha-icon></span>
        </div>
        <div class="soil-rows">
          ${ct.SOIL_METRICS.map(t=>{const s=this.soilCell(e,t);return V`<div class="sr">
              <span class="k">${ke(t.short)}</span>
              <span class="v" style=${i?`color:${Ke}`:s.color?`color:${s.color}`:j}>${s.off?ke("Offline"):V`${s.val}<span class="unit">${s.unit}</span>`}</span>
            </div>`})}
        </div>
      </div>`}soilSensorPop(e){if(this.soilTileGraph!==e)return j;const t=this.soilTileMetric,i=ct.SOIL_METRICS.find(e=>e.key===t);return this.renderParamGraph({eid:`sensor.sf_${this.config.panel}_${e}_${t}`,label:`${this.probeNameForSlot(e)} · ${ke(i.short)}`,onClose:()=>{this.soilTileGraph=null},picker:{options:ct.SOIL_METRICS.map(e=>({key:e.key,label:ke(e.short)})),current:t,onPick:t=>{this.soilTileMetric=t,this.fetchGraph(`sensor.sf_${this.config.panel}_${e}_${t}`)}}})}soilSplitTile(e,t){if(!this.get(`sensor.sf_${this.config.panel}_${e}_${t.key}`))return j;const i=`${e}:${t.key}`,s=this.soilTileGraph===i,o=this.soilCell(e,t),a=this.accent();let n=s?`box-shadow:inset 0 0 0 1px ${a}`:"",r="";return o.off?(n=`background:${je};box-shadow:inset 0 0 0 1px ${Ke}`,r=`color:${Ke}`):o.color&&"text"===o.mode?r=`color:${o.color}`:o.color&&"tile"===o.mode&&(n=`background:${qe(o.color)};box-shadow:inset 0 0 0 1px ${o.color}`),V`
      <div class="tile clickable ${s?"active":""}" style=${n||j}
        role="button" @click=${()=>this.toggleSoilTileGraph(i)}>
        <div class="tile-label"><span class="tl-name">${this.probeNameForSlot(e)} ${ke(t.short)}</span>
          <span class="tl-right"><ha-icon class="tile-more"
            icon=${s?"mdi:chevron-up":"mdi:chart-line"}></ha-icon></span>
        </div>
        <ha-icon icon="${t.icon}" style="color:${o.off?Ke:a}"></ha-icon>
        <div class="tile-val" style=${r||j}>${o.off?ke("Offline"):V`${o.val}<span class="unit">${o.unit}</span>`}</div>
      </div>`}soilSplitPop(e,t){if(this.soilTileGraph!==`${e}:${t}`)return j;const i=ct.SOIL_METRICS.find(e=>e.key===t);return this.renderParamGraph({eid:`sensor.sf_${this.config.panel}_${e}_${t}`,label:`${this.probeNameForSlot(e)} · ${ke(i.short)}`,onClose:()=>{this.soilTileGraph=null}})}toggleSoilTileGraph(e){const t=this.soilTileGraph===e;if(this.soilTileGraph=t?null:e,this._graphSel=null,this._graphPin=null,null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null),!t){const[t,i]=e.split(":"),s=i||this.soilTileMetric;this.fetchGraph(`sensor.sf_${this.config.panel}_${t}_${s}`),this._graphTimer=window.setInterval(()=>{null!=this.soilTileGraph||null!=this.deviceGraphOpen||null!=this.soilGraphOpen||null!=this.paramOpen?this._graphVer++:null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null)},1e4)}}overviewDevices(){const e=[],t=(t,i)=>{for(const[s,o,a]of i){const i=this.eid(t,s);this.get(i)&&e.push({domain:t,suffix:s,id:i,label:o,icon:a})}};return t("light",nt),t("fan",rt),t("switch",lt),this.hideLight2?e.filter(e=>"light_2"!==e.suffix):e}deviceStateText(e,t){if("unavailable"===t.state||"unknown"===t.state)return"Offline";if("light"===e.domain)return"on"!==t.state?"Off":`${Math.round((t.attributes.brightness??0)/255*100)}%`;if("fan"===e.domain){if("on"!==t.state)return"Off";const e=Math.round(t.attributes.percentage??0);return e?`${e}%`:"On"}if("on"!==t.state)return"Off";const i=this.config.panel;if("dehumidifier"===e.suffix){const e=this.get(`sensor.sf_${i}_dehumidifier_level`)?.state;return e&&"Off"!==e&&"unknown"!==e?e:"On"}if("heater"===e.suffix||"humidifier"===e.suffix){const t=this.get(`sensor.sf_${i}_${e.suffix}_level`)?.state;return t&&"0"!==t&&"unknown"!==t?`L${t}`:"On"}return"On"}deviceFault(e){const t=this.config.panel,i=e=>this.get(`sensor.sf_${t}_${e}`)?.state;return"humidifier"===e&&"Empty"===i("humidifier_tank")?"EMPTY":"dehumidifier"===e&&"Full"===i("dehumidifier_tank")?"FULL":"heater"===e&&"Alarm"===i("heater_status")?"Alarm":null}envIsDay(e){const t=(e,t)=>{const i=/^(\d{1,2}):(\d{2})/.exec(this.get(e)?.state||"");return i?60*+i[1]+ +i[2]:t},i=t(`text.sf_${e}_env_day_start`,300),s=t(`text.sf_${e}_env_day_end`,1200),o=new Date,a=60*o.getHours()+o.getMinutes();return i<=s?a>=i&&a<s:a>=i||a<s}humiTarget(e=this.config.panel){const t=Number(this.get(`number.sf_${e}_env_humi_day`)?.state),i=Number(this.get(`number.sf_${e}_env_humi_night`)?.state),s=this.get(`binary_sensor.sf_${e}_is_day`)?.state,o=this.get(`sensor.sf_${e}_is_day_env_target`)?.state;return"on"===s||"1"===o||"off"!==s&&"0"!==o&&this.envIsDay(e)?Number.isFinite(t)?t:i:Number.isFinite(i)?i:t}humiDeadband(e){const t=Number(this.get(`number.sf_${e}_env_humi_deadband`)?.state);return Number.isFinite(t)?t:0}cooldownFrom(e,t){const i=this.get(e);if(!i)return null;const s=this._cdOffAt[e],o=null!=s?s:t&&"off"===i.state&&i.last_changed?Date.parse(i.last_changed):null;if(null==o)return null;const a=(Date.now()-o)/1e3,n=Math.ceil(this.cooldownSecs-a);return n<=0?null:{remaining:n,waiting:t}}cooldownSwitchIds(){const e=[],t=this.config.panel;this.get(`switch.sf_${t}_dehumidifier`)&&e.push(`switch.sf_${t}_dehumidifier`);for(const t of this.outletSlots())for(const i of this.outletNums(t)){const s=this.get(`select.sf_${t}_outlet_${i}_mode`)?.state,o=this.get(`select.sf_${t}_outlet_${i}_humidity_device`)?.state;"Humidity"===s&&"Dehumidifying"===o&&e.push(`switch.sf_${t}_outlet_${i}`)}return e}trackCooldownTransitions(){for(const e of this.cooldownSwitchIds()){const t=this.get(e)?.state;if(null==t)continue;const i=this._cdLastState[e];i!==t&&("off"===t&&"on"===i&&(this._cdOffAt[e]=Date.now()),this._cdLastState[e]=t)}}dehumCooldown(e){if("dehumidifier"!==e||!this.cooldownShow||!this.cooldownDevice)return null;const t=this.config.panel,i=Number(this.get(`sensor.sf_${t}_humidity`)?.state),s=this.humiTarget(),o=Number.isFinite(i)&&Number.isFinite(s)&&i>s+this.humiDeadband(t);return this.cooldownFrom(`switch.sf_${t}_dehumidifier`,o)}outletCooldown(e,t){if(!this.cooldownShow||!this.cooldownOutlet)return null;const i=this.get(`select.sf_${e}_outlet_${t}_humidity_device`)?.state,s=this.get(`select.sf_${e}_outlet_${t}_mode`)?.state;if("Humidity"!==s||"Dehumidifying"!==i)return null;const o=Number(this.get(`sensor.sf_${e}_humidity`)?.state),a=this.humiTarget(e),n=Number.isFinite(o)&&Number.isFinite(a)&&o>a+this.humiDeadband(e);return this.cooldownFrom(`switch.sf_${e}_outlet_${t}`,n)}hasDehumidifier(){if(this.get(`switch.sf_${this.config.panel}_dehumidifier`))return!0;for(const e of this.outletSlots()){if(this.get(`switch.sf_${e}_dehumidifier`))return!0;for(const t of this.outletNums(e)){const i=this.get(`select.sf_${e}_outlet_${t}_mode`)?.state,s=this.get(`select.sf_${e}_outlet_${t}_humidity_device`)?.state||this.dirPick[`${e}_${t}`];if("Humidity"===i&&"Dehumidifying"===s)return!0}}return!1}anyCooldownActive(){if(!this.cooldownShow)return!1;if(this.cooldownDevice&&this.dehumCooldown("dehumidifier"))return!0;if(this.cooldownOutlet)for(const e of this.outletSlots())for(const t of this.outletNums(e))if(this.outletCooldown(e,t))return!0;return!1}fmtMMSS(e){return e=Math.max(0,Math.round(e)),`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}cooldownPill(e,t=""){if(!e)return j;const i=Math.max(0,Math.min(100,e.remaining/this.cooldownSecs*100)),s="var(--warning-color,#ff9800)";return V`
      <div class="cd-pill ${t}" title=${ke("Compressor lockout after turning off — it can't restart until this reaches 0:00")}>
        <span class="cd-txt" style="color:${s}">
          <ha-icon icon="mdi:timer-sand" style="--mdc-icon-size:14px"></ha-icon>
          ${e.waiting?ke("Starts in"):ke("Cooldown")} ${this.fmtMMSS(e.remaining)}
        </span>
        <div class="cd-bar"><div class="cd-fill" style="width:${i.toFixed(1)}%;background:${s}"></div></div>
      </div>`}renderCooldownPill(e){return this.cooldownPill(this.dehumCooldown(e),"cd-device")}deviceMode(e){const t=this.config.panel,i="light"===e.domain?`select.sf_${t}_${e.suffix}_mode`:`select.sf_${t}_${e.suffix}_mode_set`;return this.get(i)?this.modeOf(i):""}deviceColorFor(e){switch((e=>"Time Slot"===e||"Cycle"===e?"sched":"Environment"===e||"Temperature"===e||"Humidity"===e||"PPFD"===e||"PPFD - Plan"===e?"auto":"manual")(e)){case"sched":return this.dcSched;case"auto":return this.dcAuto;default:return this.dcManual}}deviceTile(e){const t=this.get(e.id);if(!t)return j;const i=this.devPend(e.suffix),s=this.dehumCooldown(e.suffix),o=(i?i.on:"on"===t.state)&&!s,a=!!i&&i.on&&"on"!==t.state,n=`${e.domain}:${e.suffix}`,r=this.deviceOpen===n,l=this.deviceGraphOpen===n,d=this.deviceLevelSensor(e.suffix),c=this.accent(),h=st(t)||!0===t.attributes.offline&&!o,p=!h&&this.deviceFault(e.suffix),u=h||!!p,g=!u&&o&&"off"!==this.deviceColorMode?this.deviceColorFor(this.deviceMode(e)):"",m=u?Ke:g||(o?c:"var(--secondary-text-color)");let f="";return u?f=`background:${je};box-shadow:inset 0 0 0 1px ${Ke}`:g&&"tile"===this.deviceColorMode&&(f=`background:${qe(g)};box-shadow:inset 0 0 0 1px ${g}`),!r&&!l||u||(f=`box-shadow:inset 0 0 0 1px ${c}`+(g&&"tile"===this.deviceColorMode?`;background:${qe(g)}`:"")),V`
      <div class="tile tile-device clickable ${r||l?"active":""}"
        style=${f||j}
        role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>this.toggleDevice(r?null:n)}>
        <div class="tile-label"><span class="tl-name">${ke(e.label)}</span>
          <span class="tl-right">
            ${d?V`<ha-icon class="tile-more device-graph-btn"
                icon="mdi:chart-line" title=${ke("Level history")}
                role="button" aria-label=${ke("Level history")}
                style=${l?`color:${c}`:j}
                @click=${e=>{e.stopPropagation(),this.toggleDeviceGraph(n)}}></ha-icon>`:j}
            <ha-icon class="tile-more"
              icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
          </span>
        </div>
        ${this.tileSummary&&!u?this.deviceSummaryRow(e):j}
        <ha-icon icon=${e.icon} style="color:${o||u?m:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${u?`color:${Ke}`:o?`color:${m}`:""}>
          ${h?ke("Offline"):p??(o?a?ke("On"):this.deviceStateText(e,t):ke("Off"))}
        </div>
        ${o||u?j:this.renderCooldownPill(e.suffix)}
        ${this.lightDLI(e)}
        ${this.fanBadge(e)}
        ${o||u||!this.dlqHas(e.suffix)?j:V`<div class="tile-qta" style="color:${c}"
          title=${ke("Quick-toggle profile saved — quick-on restores this device's mode")}>
          <div class="l1">${ke("Quick Toggle")}</div><div class="l2">${ke("Active")}</div></div>`}
      </div>`}lightSchedule(e,t){const i=this.config.panel,s=e=>{const t=this.get(e);return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""};if("PPFD - Plan"===t){const t=this.planActiveLight(e);if(t&&t.ppfd_start&&t.ppfd_stop)return[t.ppfd_start,t.ppfd_stop]}let o=s(`text.sf_${i}_${e}_schedule_start`),a=s(`text.sf_${i}_${e}_schedule_stop`);if("PPFD"===t||"PPFD - Plan"===t){const t=s(`text.sf_${i}_${e}_ppfd_start`),n=s(`text.sf_${i}_${e}_ppfd_stop`);t&&n&&("00:00"!==t||"00:00"!==n)&&(o=t,a=n)}return[o,a]}planActiveLight(e){let t;try{t=this.planInfo()}catch{return null}if(!t.active||!t.stages.length)return null;const i=t.progress?.stageId,s=t.stages.find(e=>e.stageId===i)||t.stages[0],o="light_2"===e?"light2":"light1";return s&&s[o]&&"object"==typeof s[o]?s[o]:null}lightDLI(e){if("light"!==e.domain)return j;const t=this.config.panel,i=e.suffix,s=this.modeOf(`select.sf_${t}_${i}_mode`);if("PPFD"!==s&&"PPFD - Plan"!==s)return j;let o=Number(this.get(`number.sf_${t}_${i}_ppfd_target`)?.state);if((!Number.isFinite(o)||o<=0)&&"PPFD - Plan"===s){const e=this.planActiveLight(i);e&&(o=Math.max(20,Number(e.ppfd_target)||0))}if(!Number.isFinite(o)||o<=0)return j;let[a,n]=this.lightSchedule(i,s);if(!("PPFD - Plan"!==s||/^\d/.test(a)&&/^\d/.test(n))){const e=this.planActiveLight(i);e&&e.ppfd_start&&e.ppfd_stop&&(a=e.ppfd_start,n=e.ppfd_stop)}const r=/^(\d{1,2}):(\d{2})/.exec(a),l=/^(\d{1,2}):(\d{2})/.exec(n);if(!r||!l)return j;const d=(60*+l[1]+ +l[2]-(60*+r[1]+ +r[2])+1440)%1440/60;if(d<=0)return j;const c=o*d*.0036;return V`<div class="tile-dli">
      <div>${Math.round(o)} µmol</div>
      <div class="tile-dli-v">DLI ${c.toFixed(1)}</div>
    </div>`}fanBadge(e){if("fan"!==e.suffix)return j;const t=this.config.panel,i=e.suffix,s=e=>{const t=this.get(e);return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""},o=[],a=s(`number.sf_${t}_${i}_oscillation`)||s(`sensor.sf_${t}_${i}_oscillation`);a&&"0"!==a&&o.push(`Osc ${a}`);if("on"===(s(`switch.sf_${t}_${i}_natural_wind`)||s(`binary_sensor.sf_${t}_${i}_natural_wind`))&&o.push("Nat Wind"),"Manual"!==this.modeOf(`select.sf_${t}_${i}_mode_set`)){const e=s(`number.sf_${t}_${i}_standby_speed`);e&&o.push("Stby "+("0"===e?"Off":10*Number(e)+"%"))}return o.length?V`<div class="tile-dli">${o.map(e=>V`<div>${e}</div>`)}</div>`:j}deviceSummaryRow(e){const t=this.deviceSummaryLines(e);return t.length?V`<div class="tile-summary">
          ${t.map(e=>V`<span>${ke(e)}</span>`)}
        </div>`:j}fmtClock(e){if(!this.hour12)return e;const t=/^(\d{1,2}):(\d{2})/.exec(e||"");if(!t)return e;let i=+t[1];const s=i>=12?"pm":"am";return i=i%12||12,`${i}:${t[2]}${s}`}shortDur(e){const t=/^(\d+):(\d{2})(?::(\d{2}))?$/.exec((e||"").trim());if(!t)return e||"";const i=+t[1],s=+t[2],o=+(t[3]??0);return i?s?`${i}h${s}m`:`${i}h`:s?o?`${s}m${o}s`:`${s}m`:`${o}s`}deviceSummaryLines(e){const t=this.config.panel,i=e.suffix,s=e=>{const t=this.get(e);return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""},o={"prioritize temperature":"Pri Temp","prioritize humidity":"Pri Humid","temperature only":"Temperature","humidity only":"Humidity","temperature & humidity":"Temp+Humid"},a=[];if("light"===e.domain){const e=this.modeOf(`select.sf_${t}_${i}_mode`)||"";if(!e||"unavailable"===e||"unknown"===e)return[];if(a.push(e),"Manual"!==e){const[t,s]=this.lightSchedule(i,e);if(t&&s&&("00:00"!==t||"00:00"!==s)){a.push(`${this.fmtClock(t)}–${this.fmtClock(s)}`);const e=this.hrsText(t,s);e&&a.push(ke("LD - {duration}",{duration:e}))}}return a}if("blower"===i||"fan"===i){const e=this.modeOf(`select.sf_${t}_${i}_mode_set`)||"";if(!e||"unavailable"===e||"unknown"===e)return[];if("Manual"===e)return a.push("Manual"),a;const n=e=>"blower"===i?`${e}%`:`L${e}`,r=s("blower"===i?`number.sf_${t}_blower_running_speed`:`number.sf_${t}_fan_schedule_gear`),l=s(`number.sf_${t}_${i}_standby_speed`),d="0"===r?"Auto":r?n(r):"",c=l&&"0"!==l?n(l):"Off",h="blower"===i&&d?`${d} · Stby ${c}`:"";if("Environment"===e){const e=this.modeOf(`select.sf_${t}_${i}_run_mode`);a.push("Environment"),e&&a.push(o[e.toLowerCase()]??e),h&&a.push(h)}else if("Time Slot"===e){a.push("Time Slot");const e=s(`text.sf_${t}_${i}_schedule_start`),o=s(`text.sf_${t}_${i}_schedule_stop`);e&&o&&a.push(`${this.fmtClock(e)}–${this.fmtClock(o)}`),h&&a.push(h)}else if("Cycle"===e){a.push("Cycle");const e=s(`text.sf_${t}_${i}_cycle_run`),o=s(`text.sf_${t}_${i}_cycle_off`);e&&o&&a.push(`${this.shortDur(e)} on · ${this.shortDur(o)} off`),h&&a.push(h)}return a}if("heater"===i||"humidifier"===i||"dehumidifier"===i){const e=this.modeOf(`select.sf_${t}_${i}_mode_set`)||"";if(!e||"unavailable"===e||"unknown"===e)return[];if("Manual"===e)return a.push("Manual"),a;if("Time Slot"===e){a.push("Time Slot");const e=s(`text.sf_${t}_${i}_schedule_start`),o=s(`text.sf_${t}_${i}_schedule_stop`);e&&o&&a.push(`${this.fmtClock(e)}–${this.fmtClock(o)}`)}else if("Cycle"===e){a.push("Cycle");const e=s(`text.sf_${t}_${i}_cycle_run`),o=s(`text.sf_${t}_${i}_cycle_off`);e&&o&&a.push(`${this.shortDur(e)} on · ${this.shortDur(o)} off`)}else{a.push("Environment");const o=e;if("humidifier"===i||"heater"===i){const e=s(`select.sf_${t}_${i}_gear`);a.push(o),a.push(e&&"Automatic"!==e?`Auto - Lvl ${e}`:"Auto")}else{const e=s(`select.sf_${t}_dehumidifier_gear`)||s(`select.sf_${t}_dehumidifier_level_set`)||"";a.push(e?`${o} · ${e}`:o)}}return a}return[]}relatedControls(e,t){const i=this.config.panel,s=new RegExp(`^(number|select|switch|text)\\.sf_${i}_${e}(_|$)`),o=`switch.sf_${i}_${e}`,a=`number.sf_${i}_${e}_speed`,n=Ge(this.hass,this.config.panel);return Object.keys(this.hass?.states??{}).filter(e=>s.test(e)&&e!==o&&!("fan"===t&&e===a)).sort().map(e=>{let t=this.hass?.states[e]?.attributes.friendly_name??"";return n&&t.startsWith(n)&&(t=t.slice(n.length).trim()),this.ctlRow(t||e,e)})}renderDevicePop(){const e=this.deviceOpen;if(!e)return j;const t=this.overviewDevices().find(t=>`${t.domain}:${t.suffix}`===e);if(!t)return j;const i=this.get(t.id);if(!i)return j;const s="light"===t.domain?this.renderLightBody(t,i):"fan"===t.suffix?this.renderFanBody(t,i):"blower"===t.suffix?this.renderBlowerBody(t,i):"heater"===t.suffix?this.renderHeaterBody(t,i):"dehumidifier"===t.suffix?this.renderDehumidifierBody(t,i):"humidifier"===t.suffix?this.renderHumidifierBody(t,i):this.renderGenericBody(t,i);return V`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${ke(t.label)}</span>
          <ha-icon icon="mdi:close" role="button" aria-label=${ke("Close")}
            @click=${()=>this.toggleDevice(null)}></ha-icon>
        </div>
        ${s}
      </div>`}devOn(e,t){const i=`power:${e}`;if(i in this.draft)return"on"===this.draft[i];const s=e.split(".")[1]?.replace(`sf_${this.config.panel}_`,""),o=s?this.devPend(s):null;return o?o.on:t}powerRow(e,t,i,s){const o=`power:${e}`,a=this.devOn(e,s),n=this.accent();return V`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">${ke("Power")}</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${a?"on":""}"
          style=${a?`background:${n}`:""}
          @click=${()=>this.stage(o,a?"off":"on")}
          aria-label=${ke("Toggle {name}",{name:ke(i)})}></button>
      </div>`}deviceBar(e,t,i){const s=Object.keys(this.draft).length>0;return this.saveBar(s,()=>this.deviceApply(e,t,i),()=>this.discardEdits(),"",i.id)}deviceApply(e,t,i){this.commitBundle(e,t);const s=`bri:${i.id}`,o=`pct:${i.id}`,a=`power:${i.id}`;s in this.draft&&this.hass?.callService("light","turn_on",{entity_id:i.id,brightness_pct:Number(this.draft[s])}),o in this.draft&&this.hass?.callService("fan","set_percentage",{entity_id:i.id,percentage:Number(this.draft[o])});for(const e of Object.keys(this.draft)){if(e.includes(":")||e in t)continue;const i=this.draft[e];switch(e.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:e,value:Number(i)});break;case"select":this.hass?.callService("select","select_option",{entity_id:e,option:i});break;case"text":this.hass?.callService("text","set_value",{entity_id:e,value:i});break;case"switch":this.hass?.callService("switch","on"===i?"turn_on":"turn_off",{entity_id:e})}}if(a in this.draft){const e="on"===this.draft[a],t="light"===i.domain&&s in this.draft||"fan"===i.domain&&o in this.draft;if(!e||!t){const t="fan"===i.domain?"fan":"light"===i.domain?"light":"switch";this.hass?.callService(t,e?"turn_on":"turn_off",{entity_id:i.id})}}const n="off"===this.draft[a],r="on"===this.draft[a],l=o in this.draft?o:s in this.draft?s:null;l&&(this._pendLevel={...this._pendLevel,[i.id]:{pct:Number(this.draft[l]),until:Date.now()+8e3}}),this.draft={};const d=i.id.split(".")[1]?.replace(`sf_${this.config.panel}_`,"");d&&this.dlqClear(d),d&&n?this.markDevPend(d,!1):d&&r&&this.markDevPend(d,!0)}renderGenericBody(e,t){const i="on"===t.state,s="fan"===e.domain?"fan":"switch",o=Math.round(t.attributes.percentage??0),a="fan"===e.domain?this.speedRow(e,i?o:0,0,10):j;return V`${this.powerRow(e.id,s,e.label,i)}${a}${this.relatedControls(e.suffix,e.domain)}${this.deviceBar(`text.sf_${this.config.panel}_${e.suffix}_apply`,{},e)}`}speedRow(e,t,i=0,s=0){const o=`pct:${e.id}`,a=this._pendLevel[e.id],n=o in this.draft?Number(this.draft[o]):a&&a.until>Date.now()?a.pct:t,r=s>0?Array.from({length:s},(e,t)=>{const i=t+1;return{value:Math.round(i/s*100),label:String(i),sel:Math.round(n/100*s)===i}}):(()=>{const e=[];i<=0&&e.push({value:0,label:"Off",sel:0===n});for(let t=Math.max(i,1);t<=100;t+=1)e.push({value:t,label:t+"%",sel:t===n});return e})();return V`
      <div class="dev-row ${o in this.draft?"staged":""}">
        <span class="dev-lbl">${ke("Speed")}</span>
        <span class="ctl-input">
          <select .value=${ye(String((r.find(e=>e.sel)||r[0]||{value:n}).value))} @change=${e=>this.stage(o,e.target.value)}>
            ${r.map(e=>V`<option value=${e.value}
              ?selected=${e.sel}>${ke(e.label)}</option>`)}
          </select>
        </span>
      </div>`}brightnessRow(e,t){const i=`bri:${e.id}`,s=this._pendLevel[e.id],o=i in this.draft?Number(this.draft[i]):s&&s.until>Date.now()?s.pct:t,a=[];for(let e=11;e<=100;e+=1)a.push(e);return V`
      <div class="dev-row ${i in this.draft?"staged":""}">
        <span class="dev-lbl">${ke("Brightness")}</span>
        <span class="ctl-input">
          <select .value=${ye(String(o))} @change=${e=>this.stage(i,e.target.value)}>
            ${a.map(e=>V`<option value=${e} ?selected=${e===o}>${e+"%"}</option>`)}
          </select>
        </span>
      </div>`}renderHeaterBody(e,t){const i=this.config.panel,s="on"===t.state,o=`select.sf_${i}_heater_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_heater_level`,l=`text.sf_${i}_heater_apply`,d=this.numOpts(1,10,1,e=>`L${e}`),c=[];if(a&&c.push(this.liveModeRow("Mode",o,e.id)),"Manual"===n&&c.push(this.powerRow(e.id,"switch",e.label,s)),"Manual"===n)c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${e.id}`]:"onoff"},e));else if("Time Slot"===n){const t=`text.sf_${i}_heater_schedule_start`,s=`text.sf_${i}_heater_schedule_stop`,a={[o]:"mode",[t]:"schedule_start",[s]:"schedule_end",[r]:"gear"};c.push(this.stagedPeriodRow(t,s,"Schedule")),c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,a,e))}else if("Cycle"===n){const t=`text.sf_${i}_heater_cycle_start`,s=`text.sf_${i}_heater_cycle_run`,a=`text.sf_${i}_heater_cycle_off`,n=`number.sf_${i}_heater_cycle_times`,h={[o]:"mode",[t]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};c.push(this.stagedRow("Start Time",t,"time")),c.push(this.stagedRow("Run Time",s,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",n)),c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,h,e))}else if("Temperature"===n){const t=`select.sf_${i}_heater_gear`,s=!!this.get(t),a=s?{[o]:"mode",[t]:"auto_gear"}:{[o]:"mode",[r]:"gear"};c.push(s?this.stagedRow("Gear",t):this.optSelectRow("Gear",r,d)),c.push(this.infoRow("Automatic follows the day/night temperature targets; 1–10 sets a fixed level","")),c.push(this.deviceBar(l,a,e))}return c}renderDehumidifierBody(e,t){const i=this.config.panel,s="on"===t.state,o=`select.sf_${i}_dehumidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`select.sf_${i}_dehumidifier_level`,l=`text.sf_${i}_dehumidifier_apply`,d=[];if(a&&d.push(this.liveModeRow("Mode",o,e.id)),"Manual"===n&&d.push(this.powerRow(e.id,"switch",e.label,s)),"Manual"===n)d.push(this.ctlRow("Wind Speed",r)),d.push(this.deviceBar(l,{[o]:"mode",[r]:"wind",[`power:${e.id}`]:"onoff"},e));else if("Time Slot"===n){const t=`text.sf_${i}_dehumidifier_schedule_start`,s=`text.sf_${i}_dehumidifier_schedule_stop`,a={[o]:"mode",[t]:"schedule_start",[s]:"schedule_end",[r]:"wind"};d.push(this.stagedPeriodRow(t,s,"Schedule")),d.push(this.stagedRow("Wind Speed",r)),d.push(this.deviceBar(l,a,e))}else if("Cycle"===n){const t=`text.sf_${i}_dehumidifier_cycle_start`,s=`text.sf_${i}_dehumidifier_cycle_run`,a=`text.sf_${i}_dehumidifier_cycle_off`,n=`number.sf_${i}_dehumidifier_cycle_times`,c={[o]:"mode",[t]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"wind"};d.push(this.stagedRow("Start Time",t,"time")),d.push(this.stagedRow("Run Time",s,"duration")),d.push(this.stagedRow("Closing Time",a,"duration")),d.push(this.stagedRangeRow("Execution Times",n)),d.push(this.stagedRow("Wind Speed",r)),d.push(this.deviceBar(l,c,e))}else if("Humidity"===n){const t=`select.sf_${i}_dehumidifier_gear`,s=!!this.get(t),a=s?{[o]:"mode",[t]:"auto_gear"}:{[o]:"mode",[r]:"wind"};d.push(this.stagedRow("Wind Speed",s?t:r)),d.push(this.infoRow("Runs on the tent's day/night humidity targets, at Low or High power","")),d.push(this.deviceBar(l,a,e))}return d}renderHumidifierBody(e,t){const i=this.config.panel,s="on"===t.state,o=`select.sf_${i}_humidifier_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_humidifier_level`,l=`text.sf_${i}_humidifier_apply`,d=this.numOpts(1,4,1,e=>`L${e}`),c=[];if(a&&c.push(this.liveModeRow("Mode",o,e.id)),"Manual"===n&&c.push(this.powerRow(e.id,"switch",e.label,s)),"Manual"===n)c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,{[o]:"mode",[r]:"gear",[`power:${e.id}`]:"onoff"},e));else if("Time Slot"===n){const t=`text.sf_${i}_humidifier_schedule_start`,s=`text.sf_${i}_humidifier_schedule_stop`,a={[o]:"mode",[t]:"schedule_start",[s]:"schedule_end",[r]:"gear"};c.push(this.stagedPeriodRow(t,s,"Schedule")),c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,a,e))}else if("Cycle"===n){const t=`text.sf_${i}_humidifier_cycle_start`,s=`text.sf_${i}_humidifier_cycle_run`,a=`text.sf_${i}_humidifier_cycle_off`,n=`number.sf_${i}_humidifier_cycle_times`,h={[o]:"mode",[t]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"gear"};c.push(this.stagedRow("Start Time",t,"time")),c.push(this.stagedRow("Run Time",s,"duration")),c.push(this.stagedRow("Closing Time",a,"duration")),c.push(this.stagedRangeRow("Execution Times",n)),c.push(this.optSelectRow("Gear",r,d)),c.push(this.deviceBar(l,h,e))}else if("Humidity"===n){const t=`select.sf_${i}_humidifier_gear`,s=!!this.get(t),a=s?{[o]:"mode",[t]:"auto_gear"}:{[o]:"mode",[r]:"gear"};c.push(s?this.stagedRow("Gear",t):this.optSelectRow("Gear",r,d)),c.push(this.infoRow("Automatic follows the day/night humidity targets; 1–4 sets a fixed level","")),c.push(this.deviceBar(l,a,e))}return c}textState(e){const t=this.get(e);return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""}durMinutes(e,t){const i=e=>{const t=/^(\d{1,2}):(\d{2})/.exec(e);return t?60*Number(t[1])+Number(t[2]):null},s=i(this.textState(e)),o=i(this.textState(t));if(null==s||null==o)return null;let a=(o-s+1440)%1440;return 0===a&&(a=1440),a}durationText(e,t){const i=this.durMinutes(e,t);return null==i?null:`${Math.floor(i/60)}h ${String(i%60).padStart(2,"0")}min`}infoRow(e,t){return V`<div class="dev-row">
      <span class="dev-lbl">${ke(e)}</span><span class="dev-spacer"></span>
      <span class="dev-val">${t}</span>
    </div>`}ctlRow(e,t){if(!this.get(t))return j;const i="switch"===t.split(".")[0]?this.stagedSwitch(t):this.stagedInput(t);return V`<div class="dev-row ${t in this.draft?"staged":""}">
      <span class="dev-lbl">${ke(e)}</span>
      <div class="ctl-input">${i}</div>
    </div>`}renderLightBody(e,t){const i=this.config.panel,s=e.suffix,o="on"===t.state,a=`select.sf_${i}_${s}_mode`,n=this.get(a),r=this.modeOf(a),l=this.get(`sensor.sf_${i}_${s}_brightness`),d=this.get(`sensor.sf_${i}_ppfd`),c=l&&Number.isFinite(Number(l.state))?`${Math.round(Number(l.state))}%`:"—",h=d&&Number.isFinite(Number(d.state))?`${Math.round(Number(d.state))} µmol`:"—",p=`text.sf_${i}_${s}_apply`,u=`number.sf_${i}_${s}_go_dark`,g=`number.sf_${i}_${s}_turn_off`,m=[];let f=!1;try{f=!!this.planInfo().active}catch{f=!1}const v=f?["Manual","PPFD - Plan"]:["Manual","Time Slot","PPFD"];if(n&&m.push(this.liveModeRow("Mode",a,void 0,v)),m.push(this.powerRow(e.id,"light",e.label,o)),"Manual"===r){const i=Math.round((t.attributes.brightness??0)/255*100),s={[a]:"mode",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.brightnessRow(e,o?i:0)),m.push(this.infoRow("Current PPFD",h)),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,s,e))}else if("Time Slot"===r){const t=`text.sf_${i}_${s}_schedule_start`,o=`text.sf_${i}_${s}_schedule_stop`,n=`number.sf_${i}_${s}_schedule_brightness`,r=`number.sf_${i}_${s}_fade`,l={[a]:"mode",[t]:"schedule_start",[o]:"schedule_end",[n]:"schedule_brightness",[r]:"fade_minutes",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${c} · ${h}`));const d=this.durationText(t,o);d&&m.push(this.infoRow("Light duration",d)),m.push(this.stagedPeriodRow(t,o,"Lighting period")),m.push(this.optSelectRow("Target Brightness",n,this.numOpts(11,100,1,e=>`${e}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,e=>`${e} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,l,e))}else if("PPFD"===r||"PPFD - Plan"===r){const t=`text.sf_${i}_${s}_ppfd_start`,o=`text.sf_${i}_${s}_ppfd_stop`,n=`number.sf_${i}_${s}_ppfd_target`,r=`number.sf_${i}_${s}_ppfd_fade`,l=`number.sf_${i}_${s}_ppfd_min`,d=`number.sf_${i}_${s}_ppfd_max`,f={[a]:"mode",[t]:"ppfd_start",[o]:"ppfd_end",[n]:"ppfd_target",[r]:"ppfd_fade_minutes",[l]:"ppfd_min",[d]:"ppfd_max",[u]:"dim_threshold",[g]:"off_threshold"};m.push(this.infoRow("Current",`${c} · ${h}`));const v=this.durationText(t,o),b=this.durMinutes(t,o),_=Number(this.get(n)?.state);if(v&&null!=b&&Number.isFinite(_)){const e=_*b*60/1e6;m.push(this.infoRow("DLI · duration",`${e.toFixed(2)} mol/m²/day · ${v}`))}else v&&m.push(this.infoRow("Light duration",v));m.push(this.stagedPeriodRow(t,o,"Lighting period")),m.push(V`<div class="dev-row ${n in this.draft?"staged":""}">
        <span class="dev-lbl">${ke("Target PPFD")}</span>
        <div class="ctl-input">${this.optSelect(n,this.numOpts(20,2e3,10,e=>`${e} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title=${ke("current")}>${h}</span>
      </div>`),m.push(this.optSelectRow("Dimming Range Min",l,this.numOpts(11,100,1,e=>`${e}%`))),m.push(this.optSelectRow("Dimming Range Max",d,this.numOpts(11,100,1,e=>`${e}%`))),m.push(this.optSelectRow("Simulate Sunrise/Sunset",r,this.offOpts(1,60,1,e=>`${e} min`))),m.push(this.optSelectRow("Go dark",u,this.tempThresholdOpts())),m.push(this.optSelectRow("Turn off",g,this.tempThresholdOpts())),m.push(this.deviceBar(p,f,e))}return m}renderFanBody(e,t){const i=this.config.panel,s="on"===t.state,o=`select.sf_${i}_fan_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_fan_oscillation`,l=`number.sf_${i}_fan_schedule_gear`,d=`number.sf_${i}_fan_standby_speed`,c=`switch.sf_${i}_fan_natural_wind`,h=()=>this.optSelectRow("Gear",l,this.numOpts(1,10,1,e=>`L${e}`)),p=Math.max(1,Math.round(Number(this.draftVal(l))||1)),u=["","0"].includes(String(this.draftVal(l))),g=()=>this.optSelectRow("Standby Speed",d,this.offOpts(1,u?10:p-1)),m=()=>this.optSelectRow("Oscillation",r,this.offOpts(1,10)),f=`text.sf_${i}_fan_apply`,v=[];if(a&&v.push(this.liveModeRow("Mode",o,e.id)),"Manual"===n&&v.push(this.powerRow(e.id,"fan",e.label,s)),"Manual"===n){const i=Math.round(t.attributes.percentage??0);v.push(this.speedRow(e,s?i:0,0,10)),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(f,{[o]:"mode"},e))}else if("Time Slot"===n){const t={[o]:"mode",[`text.sf_${i}_fan_schedule_start`]:"schedule_start",[`text.sf_${i}_fan_schedule_stop`]:"schedule_end",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedPeriodRow(`text.sf_${i}_fan_schedule_start`,`text.sf_${i}_fan_schedule_stop`,"Schedule")),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(f,t,e))}else if("Cycle"===n){const t=`text.sf_${i}_fan_cycle_start`,s=`text.sf_${i}_fan_cycle_run`,a=`text.sf_${i}_fan_cycle_off`,n=`number.sf_${i}_fan_cycle_times`,r={[o]:"mode",[t]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Start Time",t,"time")),v.push(this.stagedRow("Run Duration",s,"duration")),v.push(this.stagedRow("Off Duration",a,"duration")),v.push(this.stagedRangeRow("Execution Times",n)),v.push(h()),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(f,r,e))}else if("Environment"===n){const t=`select.sf_${i}_fan_run_mode`,s={[o]:"mode",[t]:"env_submode",[l]:"schedule_speed",[d]:"standby_speed"};v.push(this.stagedRow("Run Mode",t)),v.push(this.optSelectRow("Gear",l,this.autoOpts(1,10,1,e=>`L${e}`))),v.push(g()),v.push(m()),v.push(this.ctlRow("Natural Wind",c)),v.push(this.deviceBar(f,s,e))}return v}renderBlowerBody(e,t){const i=this.config.panel,s="on"===t.state,o=`select.sf_${i}_blower_mode_set`,a=this.get(o),n=this.modeOf(o),r=`number.sf_${i}_blower_running_speed`,l=`number.sf_${i}_blower_standby_speed`,d=`switch.sf_${i}_blower_close_co2`,c=`text.sf_${i}_blower_apply`,h=()=>this.optSelectRow("Running Speed",r,this.numOpts(25,100,1,e=>`${e}%`)),p=["","0"].includes(String(this.draftVal(r))),u=Math.max(25,Math.round(Number(this.draftVal(r))||25)),g=()=>this.optSelectRow("Standby Speed",l,this.offOpts(25,p?100:u-1)),m=[];if(a&&m.push(this.liveModeRow("Mode",o,e.id)),"Manual"===n&&m.push(this.powerRow(e.id,"fan",e.label,s)),"Manual"===n){const i=Math.round(t.attributes.percentage??0);m.push(this.speedRow(e,s?i:0,25)),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,{[o]:"mode"},e))}else if("Time Slot"===n){const t={[o]:"mode",[`text.sf_${i}_blower_schedule_start`]:"schedule_start",[`text.sf_${i}_blower_schedule_stop`]:"schedule_end",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedPeriodRow(`text.sf_${i}_blower_schedule_start`,`text.sf_${i}_blower_schedule_stop`,"Schedule")),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,t,e))}else if("Cycle"===n){const t=`text.sf_${i}_blower_cycle_start`,s=`text.sf_${i}_blower_cycle_run`,a=`text.sf_${i}_blower_cycle_off`,n=`number.sf_${i}_blower_cycle_times`,p={[o]:"mode",[t]:"cycle_start",[s]:"cycle_run",[a]:"cycle_off",[n]:"cycle_times",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Start Time",t,"time")),m.push(this.stagedRow("Run Duration",s,"duration")),m.push(this.stagedRow("Off Duration",a,"duration")),m.push(this.stagedRangeRow("Execution Times",n)),m.push(h()),m.push(g()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,p,e))}else if("Environment"===n){const t=`select.sf_${i}_blower_run_mode`,s={[o]:"mode",[t]:"env_submode",[r]:"schedule_speed",[l]:"standby_speed"};m.push(this.stagedRow("Run Mode",t)),m.push(this.optSelectRow("Running Speed",r,this.autoOpts(25,100,1,e=>`${e}%`))),m.push(g()),m.push(this.ctlRow("Close CO2 Device",d)),m.push(this.deviceBar(c,s,e))}return m}cycleIsDay(){const e=this.config.panel,t=this.get(`binary_sensor.sf_${e}_daytime_schedule`);if(t&&("on"===t.state||"off"===t.state))return"on"===t.state;const i=ot(this.get(`text.sf_${e}_env_day_start`)?.state),s=ot(this.get(`text.sf_${e}_env_day_end`)?.state);if(null==i||null==s)return null;const o=new Date,a=60*o.getHours()+o.getMinutes();return i<=s?a>=i&&a<s:a>=i||a<s}lightLeak(){if(!1!==this.cycleIsDay())return{on:!1,text:""};const e=this.config.panel,t=this.get(`sensor.sf_${e}_ppfd`);if(t){const e=Number(t.state);return Number.isFinite(e)&&e>1?{on:!0,text:ke("Light detected · {ppfd} µmol",{ppfd:Math.round(e)})}:{on:!1,text:""}}const i=this.get(`binary_sensor.sf_${e}_daytime_light_sensor`);return i&&"on"===i.state?{on:!0,text:"Light detected"}:{on:!1,text:""}}renderParamsHead(){const e=this.cycleIsDay(),t=this.lightLeak(),i=null===e?j:V`<span class="cycle-badge"
          style="color:${e?"#e0a83a":"#8f9bd4"};background:${e?"rgba(224,168,58,0.14)":"rgba(143,155,212,0.16)"}">
          <ha-icon icon=${e?"mdi:white-balance-sunny":"mdi:weather-night"}></ha-icon>${ke(e?"Day Cycle":"Night Cycle")}</span>`;return V`
      <div class="params-head">
        <span class="ph-label">${ke("Parameters")}</span>
        <span class="ph-mid">${t.on?V`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${ke(t.text)}</span>`:j}</span>
        ${i}
      </div>`}hasEnergyTile(){return!this.hideEnergyTile&&!!this.get(`sensor.sf_${this.config.panel}_power`)}energyTile(){const e=this.config.panel,t=(t,i,s)=>{const o=this.get(`sensor.sf_${e}_${t}`),a=o?Number(o.state):NaN;return Number.isFinite(a)?`${a.toFixed(s)}${i}`:"–"},i="power"===this.paramOpen,s=this.accent();return V`
      <div class="tile clickable ${i?"active":""}"
        style=${i?`box-shadow:inset 0 0 0 1px ${s}`:j}
        role="button" aria-expanded=${i?"true":"false"}
        @click=${()=>this.toggleGraph("power")}>
        <div class="tile-label">
          <span class="tl-name">${ke("Power")}</span>
          <span class="tl-right">
            <ha-icon class="tile-more"
              icon=${i?"mdi:chevron-up":"mdi:chart-line"}></ha-icon>
          </span>
        </div>
        <ha-icon icon="mdi:flash" style="color:${s}"></ha-icon>
        <div class="tile-val">${t("power","",0)}<span class="unit">W</span></div>
        <div class="tile-target">${t("voltage"," V",0)} · ${t("current"," A",2)}</div>
        <div class="tile-target">${t("energy"," kWh",2)}</div>
      </div>`}renderEnergyTile(){if(!this.hasEnergyTile())return j;const e="power"===this.paramOpen;return V`
      <div class="section-label">${ke("Energy Usage")}</div>
      <div class="grid">${this.energyTile()}</div>
      ${e?this.renderParamGraph():j}`}renderTileGrid(e,t){const i="all"===e?" ugrid":"";return this.reorderMode?V`<div class="grid rgrid${i}"
        @pointerdown=${e=>this.onReorderDown(e)}
        @pointermove=${e=>this.onReorderMoveEvt(e)}
        @pointerup=${()=>this.onReorderUp()}
        @pointercancel=${()=>this.onReorderUp()}>
        ${t.map(t=>V`
          <div class="rwrap ${this.dragId===t.id?"dragging":""} ${t.full?"rfull":""}"
            data-sec=${e} data-tid=${t.id}>
            <div class="rhandle"><ha-icon icon="mdi:drag"></ha-icon></div>
            ${this.hideBtn(t.id,!1)}
            ${t.tpl}
          </div>`)}
      </div>`:V`<div class="grid${i}">${t.map(e=>V`
        ${e.full?V`<div class="rspan">${e.tpl}</div>`:e.tpl}
        ${e.pop?V`<div class="rspan tile-exp">${e.pop}</div>`:j}`)}</div>`}renderHiddenTray(e){if(!this.reorderMode)return j;const t=this.effHidden(),i=new Set,s=[],o=e=>{i.has(e.id)||(i.add(e.id),s.push(e))};e.params.forEach(o),e.devices.forEach(o),e.outlets.forEach(o),e.energy&&o(e.energy),this.unifiedNatural(e).forEach(o);const a=s.filter(e=>t[e.id]);return V`<div class="hidden-tray">
      <div class="section-label">${ke("Hidden tiles")}</div>
      ${a.length?V`<div class="grid">${a.map(e=>V`
            <div class="rwrap rhidden">${this.hideBtn(e.id,!0)}${e.tpl}</div>`)}</div>`:V`<div class="ht-note">${ke("Tap the eye icon on any tile above to hide it here.")}</div>`}
    </div>`}renderReorderBar(){const e=this.accent();return V`<div class="reorder-bar">
      <div class="reorder-note">
        <ha-icon icon="mdi:drag-variant"></ha-icon>
        <span>${ke("Drag to rearrange; tap the eye to hide a tile. Changes save on Apply.")}</span>
      </div>
      <button class="reorder-reset" @click=${()=>this.resetOrder()}>${ke("Reset order")}</button>
      ${at(e,this.reorderDirty(),()=>this.exitReorder(!0),()=>this.exitReorder(!1),"apply-bar")}
    </div>`}renderOverview(){const e=this.reorderMode,t=this.overviewNatural(),i=t=>e&&this.tileOrderDraft?this.tileOrderDraft[t]:this.tileOrder[t],s=e=>e.filter(e=>!this.isHidden(e.id));if("unified"===this.layoutMode){const o=s(this.unifiedOrder(this.unifiedNatural(t),i("all")));return V`
        ${e?this.renderReorderBar():j}
        ${o.length?this.renderTileGrid("all",o):j}
        ${this.renderHiddenTray(t)}`}const o=s(this.applyOrder(t.params,e=>e.id,i("params"))),a=s(this.applyOrder(t.devices,e=>e.id,i("devices"))),n=s(this.applyOrder(t.outlets,e=>e.id,i("outlets")));return V`
      ${e?this.renderReorderBar():j}
      ${o.length?V`${this.renderParamsHead()}
            ${this.renderTileGrid("params",o)}`:j}
      ${this.hasEnergyTile()&&!this.isHidden("energy")?V`<div class="section-label">${ke("Energy Usage")}</div>
            <div class="grid">${e?V`<div class="rwrap">${this.hideBtn("energy",!1)}${this.energyTile()}</div>`:this.energyTile()}</div>
            ${"power"!==this.paramOpen||e?j:this.renderParamGraph()}`:j}
      ${a.length?V`<div class="section-label">${ke("Devices")}</div>
            ${e?j:this.renderDeviceQuickRow()}
            ${this.renderTileGrid("devices",a)}`:j}
      ${(this.outletsOnOverview||this.outletQuickOverview)&&this.hasOutlets()?V`<div class="section-label">${ke("Outlets")}</div>
            ${this.outletQuickOverview&&!e?this.outletSlots().map(e=>this.renderQuickRow(e)):j}
            ${this.outletsOnOverview?this.renderTileGrid("outlets",n):j}`:j}
      ${this.renderHiddenTray(t)}`}draftVal(e){if(e in this.draft)return this.draft[e];const t=this.get(e);return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""}stage(e,t){this.draft={...this.draft,[e]:t}}clearDraft(){Object.keys(this.draft).length&&(this.draft={})}discardEdits(){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={})}toggleDevice(e){this.clearDraft(),Object.keys(this.modePick).length&&(this.modePick={}),this.deviceOpen=e}modeOf(e,t="Manual"){return this.modePick[e]??this.get(e)?.state??t}stagedInput(e,t){const i=this.get(e);if(!i)return j;const s=e.split(".")[0],o=this.draftVal(e);if(!t&&"number"===s){const t=i.attributes.min??0,s=i.attributes.max??100,a=i.attributes.step??1,n=i.attributes.unit_of_measurement??"";return V`<span class="num-box">
        <input type="number" min=${t} max=${s} step=${a} .value=${o}
          @input=${t=>this.stage(e,t.target.value)} />
        <span class="unit">${n}</span></span>`}if(!t&&"select"===s){const t=i.attributes.options??[],s=e=>ke(Te[e.toLowerCase()]??e);return V`<select @change=${t=>this.stage(e,t.target.value)}>
        ${t.map(e=>V`<option value=${e} .selected=${e===o}>${s(e)}</option>`)}
      </select>`}if("duration"===t)return this.durationInput(e);const a="time"===t||/^\d{1,2}:\d{2}/.test(o);return V`<input type=${a?"time":"text"} .value=${o}
      @change=${t=>this.stage(e,t.target.value)} />`}durationInput(e){const t=(this.draftVal(e)||"").trim(),i=/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(t),s=i?+i[1]:0,o=i?+i[2]:0,a=i?+(i[3]??0):0,n=e=>String(e).padStart(2,"0"),r=(t,i,s)=>this.stage(e,`${n(Math.max(0,Math.min(99,t)))}:${n(Math.max(0,Math.min(59,i)))}:${n(Math.max(0,Math.min(59,s)))}`),l=(e,t,i,s)=>V`
      <span class="dur-box">
        <input type="number" min="0" max=${t} step="1" .value=${String(e)}
          @input=${e=>s(Math.floor(Number(e.target.value)||0))} />
        <span class="dur-unit">${i}</span>
      </span>`;return V`<span class="dur-input">
      ${l(s,99,"h",e=>r(e,o,a))}
      ${l(o,59,"min",e=>r(s,e,a))}
      ${l(a,59,"s",e=>r(s,o,e))}
    </span>`}numOpts(e,t,i=1,s=String){const o=[],a=(String(i).split(".")[1]||"").length,n=i>0?Math.round((t-e)/i):0;for(let t=0;t<=n;t++){const n=Number((e+t*i).toFixed(a));o.push({label:s(n),value:String(n)})}return o}offOpts(e,t,i=1,s){return[{label:"Off",value:"0"},...this.numOpts(e,t,i,s)]}autoOpts(e,t,i=1,s){return[{label:"Automatic",value:"0"},...this.numOpts(e,t,i,s)]}optSelect(e,t,i=!1){if(!this.get(e))return j;const s=this.draftVal(e),o=t.find(e=>Number(e.value)===Number(s))?.value??t.find(e=>e.value===s)?.value??s;return V`<select @change=${t=>{const s=t.target.value;i?this.hass?.callService("number","set_value",{entity_id:e,value:Number(s)}):this.stage(e,s)}}>
      ${t.map(e=>V`
        <option value=${e.value} .selected=${String(e.value)===String(o)}>${ke(e.label)}</option>`)}
    </select>`}optSelectRow(e,t,i,s=!1){if(!this.get(t))return j;const o=!s&&t in this.draft?"dev-row staged":"dev-row";return V`<div class=${o}>
      <span class="dev-lbl">${ke(e)}</span>
      <div class="ctl-input">${this.optSelect(t,i,s)}</div>
    </div>`}stagedRow(e,t,i){if(!this.get(t))return j;const s=t in this.draft?"dev-row staged":"dev-row";return V`<div class=${s}>
      <span class="dev-lbl">${ke(e)}</span>
      <div class="ctl-input">${this.stagedInput(t,i)}</div>
    </div>`}stagedRangeRow(e,t,i){const s=this.get(t);if(!s)return j;const o=Math.round(Number(s.attributes.min??1)),a=Math.round(Number(s.attributes.max??100)),n=Math.max(1,Math.round(Number(s.attributes.step??1)));return this.optSelectRow(e,t,this.numOpts(o,a,n,i))}stagedPeriodRow(e,t,i){const s=this.get(e),o=this.get(t);if(!s&&!o)return j;const a=e in this.draft||t in this.draft;return V`<div class="dev-row period-row ${a?"staged":""}">
      <span class="dev-lbl">${ke(i)}</span>
      <div class="period-times">
        ${s?this.stagedInput(e,"time"):j}
        <span class="dash">–</span>
        ${o?this.stagedInput(t,"time"):j}
      </div>
    </div>`}liveModeRow(e,t,i,s){const o=this.get(t);if(!o)return j;const a=s??o.attributes.options??[],n=this.modeOf(t,o.state);return V`<div class="dev-row ${t in this.draft?"staged":""}">
      <span class="dev-lbl">${ke(e)}</span>
      <div class="ctl-input">
        <select @change=${e=>{const s=e.target.value;this.modePick={...this.modePick,[t]:s},this.draft=i&&"Manual"===s?{[t]:s,[`power:${i}`]:"off"}:{[t]:s}}}>
          ${a.map(e=>V`
            <option value=${e} .selected=${e===n}>${ke(e)}</option>`)}
        </select>
      </div>
    </div>`}commitBundle(e,t){const i={};for(const[e,s]of Object.entries(t))if(e in this.draft){const t=this.draft[e];i[s]="number"===e.split(".")[0]?Number(t):t}if(!Object.keys(i).length)return;const s=e.match(/_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/),o=s?"light_1"===s[1]?"light":"light_2"===s[1]?"light2":s[1]:null;o&&!this.get(e)?this.hass?.callService("sf","apply_bundle",{entity_id:Object.keys(t)[0],module:o,settings:i}):this.hass?.callService("text","set_value",{entity_id:e,value:JSON.stringify(i)});const a={...this.draft};for(const e of Object.keys(t))delete a[e];this.draft=a}stagedSwitch(e){const t=e in this.draft?"on"===this.draft[e]:this.outPend(e)?.on??"on"===this.get(e)?.state;return V`<button class="toggle ${t?"on":""}"
      style=${t?`background:${this.accent()}`:""}
      @click=${()=>this.stage(e,t?"off":"on")} aria-label=${ke("Toggle")}></button>`}stagedCtl(e,t,i){const s=this.get(e);if(!s)return j;const o=t??s.attributes.friendly_name??e.split(".")[1],a="switch"===e.split(".")[0]?this.stagedSwitch(e):this.stagedInput(e,i),n=e in this.draft;return V`
      <div class="ctl ${n?"staged":""}">
        <div class="ctl-label">${ke(o)}</div>
        <div class="ctl-input">${a}</div>
      </div>`}applyStaged(e){for(const t of e){if(!(t in this.draft))continue;const e=this.draft[t];switch(t.split(".")[0]){case"number":this.hass?.callService("number","set_value",{entity_id:t,value:Number(e)});break;case"text":this.hass?.callService("text","set_value",{entity_id:t,value:e});break;case"select":this.hass?.callService("select","select_option",{entity_id:t,option:e});break;case"switch":this.hass?.callService("switch","on"===e?"turn_on":"turn_off",{entity_id:t}),/^switch\.sf_.+_outlet_\d+$/.test(t)&&this.markOutPend(t,"on"===e)}}const t={...this.draft};for(const i of e)delete t[i];this.draft=t}discardStaged(e){const t={...this.draft};let i=!1;for(const s of e)s in t&&(delete t[s],i=!0);i&&(this.draft=t)}applyBar(e,t={}){const i=!!t.extraDirty||e.some(e=>e in this.draft);return this.saveBar(i,()=>{this.applyStaged(e),t.onApply?.()},()=>{this.discardStaged(e),t.onDiscard?.()},"apply-bar")}envIds(){const e=this.config.panel,t=[];for(const i of[`text.sf_${e}_env_day_start`,`text.sf_${e}_env_day_end`])this.get(i)&&t.push(i);for(const[,i,s,o]of dt)for(const a of[s,i,o]){const i=`number.sf_${e}_${a}`;this.get(i)&&t.push(i)}for(const i of["leaf_vpd_min","leaf_vpd_max"]){const s=`number.sf_${e}_${i}`;this.get(s)&&t.push(s)}return t}caliIds(){const e=this.config.panel,t=[];for(const i of["cal_air_temp","cal_air_humidity","cal_ppfd","cal_co2"]){const s=`number.sf_${e}_${i}`;this.get(s)&&t.push(s)}for(const i of this.caliSoilSlots()){for(const s of["cal_temp","cal_moisture","cal_ec"]){const o=`number.sf_${e}_${i}_${s}`;this.get(o)&&t.push(o)}const s=`select.sf_${e}_${i}_substrate`;this.get(s)&&t.push(s)}for(const i of[`number.sf_${e}_leaf_offset`,`number.sf_${e}_leaf_offset_night`])this.get(i)&&t.push(i);return t}hasEnv(){return!!this.get(`number.sf_${this.config.panel}_env_temp_day`)}outletSlots(){const e=this.config.panel??"",t=this.config.outlets??[];if(!this.hass)return t;const i=[];e&&this.get(`switch.sf_${e}_outlet_1`)&&i.push(e);const s=new Set(Ie(this.hass,e));for(const o of t)o!==e&&s.has(o)&&i.push(o);return i}hasOutlets(){return this.outletSlots().some(e=>{for(let t=1;t<=10;t++)if(this.get(`select.sf_${e}_outlet_${t}_mode`))return!0;return!1})}outletOnly(){if(!this.hasOutlets())return!1;const e=!(!this.get(this.eid("sensor","temperature"))&&!this.get(this.eid("sensor","humidity"))),t=!!this.get(this.eid("sensor","soil_avg_temperature")),i=this.overviewDevices().length>0,s=!!this.get(this.eid("number","env_temp_day"));return!(e||t||i||s)}rangeSelect(e){const t=this.get(e);if(!t)return j;const i=Number(t.attributes.min??0),s=Number(t.attributes.max??100),o=Number(t.attributes.step??1)||1,a=t.attributes.unit_of_measurement??"";return this.optSelect(e,this.numOpts(i,s,o,e=>`${e}${a}`),!1)}envControl(e,t){return this.get(e)?V`
      <div class="ctl">
        <div class="ctl-label">${ke(t)}</div>
        <div class="ctl-input">${this.rangeSelect(e)}</div>
      </div>`:j}planEntity(){return this.get(`sensor.sf_${this.config.panel}_plan`)}hasPlan(){return!!this.planEntity()}planInfo(){const e=this.planEntity(),t=e?.attributes??{};return{active:!!t.active,stages:Array.isArray(t.stages)?t.stages:[],progress:t.progress&&"object"==typeof t.progress?t.progress:{}}}renderEnv(){if(!this.hasEnv())return V`<div class="cali-empty">${ke("No environment targets reported for this device yet.")}</div>`;if(!this.hasPlan())return this.renderEnvBody(!0);const e=this.planInfo(),t=this.envSubView??(e.active?"plan":"env"),i=this.accent(),s=(e,s)=>V`
      <button class="env-seg ${t===e?"active":""}"
        style=${t===e?`color:${i};border-color:${i}`:""}
        @click=${()=>this.envSubView=e}>${ke(s)}</button>`;return V`
      <div class="env-seg-row">
        ${s("env","Environment")}
        ${s("plan","Planting Plan")}
      </div>
      ${"plan"===t?this.renderPlan(e):this.renderEnvBody(!1)}`}renderEnvBody(e){const t=this.config.panel,i=`text.sf_${t}_env_day_start`,s=`text.sf_${t}_env_day_end`,o=this.get(i)||this.get(s);return V`
      ${e?V`<div class="section-label">${ke("Environment")}</div>`:j}
      ${o?V`<div class="env-cycle">
            ${this.stagedCtl(i,"Day Cycle Start","time")}
            ${this.stagedCtl(s,"Day Cycle Stop","time")}
          </div>`:j}
      ${dt.map(([e,i,s,o,a])=>this.get(`number.sf_${t}_${i}`)?V`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${a} style="color:${this.accent()}"></ha-icon>
              <span>${ke(e)}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${t}_${s}`,"Night")}
              ${this.envControl(`number.sf_${t}_${i}`,"Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${t}_${o}`,"Dead Zone")}
            </div>
          </div>`:j)}
      ${this.renderLeafVpdTargets()}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`}renderPlan(e){if(null!=this.planEditStage&&this.planDraft)return this.renderStageEditor(this.planEditStage);if(this.planTplOpen)return this.renderPlanTemplatePicker();const t=this.accent(),i=`switch.sf_${this.config.panel}_plan_enabled`,s=!!this.get(i),o=e.stages,a=e.progress||{},n=e=>{const t=Math.max(0,o.findIndex(t=>t.stageId===e)),i=this.planShowAll?o.map((e,t)=>t):[t];return V`
        <div class="section-label">${ke("Stages")}</div>
        ${i.map(t=>this.renderPlanStage(o[t],e,t))}
        ${o.length>1?V`<button class="plan-editbtn" style="margin:2px 0 6px"
          @click=${()=>{this.planShowAll=!this.planShowAll}}>
          ${this.planShowAll?ke("Show less"):ke("Show all {n} stages",{n:o.length})}</button>`:j}
        <div style="display:flex;gap:10px">
          <button class="plan-btn" style="flex:1" @click=${()=>this.addPlanStage()}>${ke("+ Add stage")}</button>
          <button class="plan-btn" style="flex:1" @click=${()=>{this.planTplOpen="append"}}>${ke("+ From template")}</button>
        </div>`},r=(e,s)=>"start"===this._planPending&&!s||"stop"===this._planPending&&s?V`
          <button class="plan-btn ${s?"stop":"start"}" disabled
            style="opacity:.7;cursor:default${s?"":`;background:${t};border-color:${t};color:#0c1f06`}">
            ${"start"===this._planPending?ke("Starting — Please Wait…"):ke("Stopping — Please Wait…")}
          </button>`:V`
        <button class="plan-btn ${s?"stop":"start"}"
          style=${s?"":`background:${t};border-color:${t};color:#0c1f06`}
          @click=${()=>{this.envSubView="plan",this._planPending=s?"stop":"start",this._planPendTimer&&clearTimeout(this._planPendTimer),this._planPendTimer=setTimeout(()=>{this._planPending="",this.requestUpdate()},15e3),this.hass?.callService("switch",s?"turn_off":"turn_on",{entity_id:i}),this.setPlanLights(!s)}}>
          ${ke(e)}</button>`;if(!e.active)return o.length?V`
        <div class="plan-banner">
          <ha-icon icon="mdi:sprout-outline" style="color:var(--secondary-text-color)"></ha-icon>
          <div style="flex:1">
            <div class="plan-banner-title">${ke("Planting plan stopped")}</div>
            <div class="plan-banner-sub">
              ${o.length} stage${1===o.length?"":"s"} · running the manual Environment targets
            </div>
          </div>
        </div>
        ${n(null)}
        ${s?V`<div class="plan-actions">${r("Start Plan",!1)}</div>`:j}`:V`
          <div class="plan-empty">
            <ha-icon icon="mdi:sprout-outline"></ha-icon>
            <div class="plan-empty-title">${ke("No planting plan running")}</div>
            <div class="plan-empty-sub">
              ${ke("Create a plan here, or in the Spider Farmer app. While a plan runs the manual Environment targets pause.")}
            </div>
            <div style="display:flex;gap:10px;max-width:340px;margin:14px auto 0">
              <button class="plan-btn" style="flex:1;background:${t};border-color:${t};color:#0c1f06"
                @click=${()=>{this.planTplOpen="new"}}>${ke("From template")}</button>
              <button class="plan-btn" style="flex:1"
                @click=${()=>this.startPlanEdit(!0)}>${ke("Custom")}</button>
            </div>
          </div>`;const l=o.find(e=>e.stageId===a.stageId)||o[0],d=Number(a.progress),c=Number.isFinite(d),h=[];return null!=a.planted&&h.push(`${this.fmtNum(a.planted)} planted`),null!=a.remain&&h.push(`${this.fmtNum(a.remain)} left`),null!=a.totalDays&&h.push(`${this.fmtNum(a.totalDays)} total`),V`
      <div class="plan-banner">
        <ha-icon icon="mdi:sprout" style="color:${t}"></ha-icon>
        <div style="flex:1">
          <div class="plan-banner-title">${l&&l.label||ke("Planting plan active")}</div>
          <div class="plan-banner-sub">
            ${h.length?ke("{days} days",{days:h.join(" · ")}):ke(1===o.length?"{n} stage · managed by the controller":"{n} stages · managed by the controller",{n:o.length})}
          </div>
        </div>
        ${c?V`<div class="plan-pct" style="color:${t}">${Math.round(d)}%</div>`:j}
      </div>
      ${c?V`<div class="plan-bar"><div class="plan-bar-fill"
            style="width:${Math.max(0,Math.min(100,d))}%;background:${t}"></div></div>`:j}
      ${n(a.stageId)}
      ${s?V`<div class="plan-actions">${r("Stop Plan",!0)}</div>`:j}
      <div class="plan-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>${ke("While a plan is active the controller sets temperature, humidity and CO₂ from the plan schedule. Switch to Environment to see the manual targets used when no plan runs.")}</span>
      </div>`}decodePlanDate(e){const t=Number(e);if(!Number.isFinite(t)||t<=0)return null;const i=255&t,s=(t>>8)-494344;if(s<=0||i<1||i>31)return null;const o=new Date(Math.floor((s-1)/12),(s-1)%12,i);return isNaN(o.getTime())?null:o}planStageDates(e){const t=this.decodePlanDate(e.start),i=this.decodePlanDate(e.end);if(!t||!i)return"";const s=e=>e.toLocaleDateString(void 0,{month:"short",day:"numeric"}),o=Math.round((i.getTime()-t.getTime())/864e5)+1,a=t.getFullYear()!==i.getFullYear()?`, ${i.getFullYear()}`:"";return`${s(t)} – ${s(i)}${a} · ${o} day${1===o?"":"s"}`}encodePlanCode(e){const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e||"");if(!t)return null;const i=+t[1],s=+t[2],o=+t[3];return s<1||s>12||o<1||o>31?null:12*i+s+494344<<8|o}codeToInputDate(e){const t=this.decodePlanDate(e);if(!t)return"";const i=e=>String(e).padStart(2,"0");return`${t.getFullYear()}-${i(t.getMonth()+1)}-${i(t.getDate())}`}tempUnitF(){const e=this.get(`number.sf_${this.config.panel}_env_temp_day`)?.attributes?.unit_of_measurement;return"°F"===e||"℉"===e}peSelect(e,t,i){const s=t.find(t=>Number(t.value)===Number(e))?.value??t.find(t=>t.value===String(e))?.value??String(e??"");return V`<select class="pe-sel" @change=${e=>i(e.target.value)}>
      ${t.map(e=>V`<option value=${e.value}
        .selected=${String(e.value)===String(s)}>${ke(e.label)}</option>`)}
    </select>`}envOptsFor(e){const t=this.get(`number.sf_${this.config.panel}_${e}`),i=Number(t?.attributes?.min??0),s=Number(t?.attributes?.max??100),o=Number(t?.attributes?.step??1)||1,a=t?.attributes?.unit_of_measurement??"";return this.numOpts(i,s,o,e=>`${e}${a}`)}epochToLocalInput(e){const t=Number(e);if(!Number.isFinite(t)||t<=0)return"";const i=new Date(1e3*t),s=e=>String(e).padStart(2,"0");return`${i.getFullYear()}-${s(i.getMonth()+1)}-${s(i.getDate())}T${s(i.getHours())}:${s(i.getMinutes())}`}localInputToEpoch(e){const t=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(e||"");if(t)return Math.floor(new Date(+t[1],+t[2]-1,+t[3],+t[4],+t[5]).getTime()/1e3)}threshToDisp(e){const t=Number(e);return Number.isFinite(t)&&0!==t?String(this.tempUnitF()?Math.round(9*t/5+32):Math.round(t)):"0"}threshToC(e){const t=Number(e);return Number.isFinite(t)&&0!==t?this.tempUnitF()?Math.round(5*(t-32)/9*1e4)/1e4:t:0}threshOpts(){const e=this.tempUnitF(),t=e?"°F":"°C";return[{label:"Off",value:"0"},...this.numOpts(e?59:15,e?122:50,1,e=>`${e}${t}`)]}durText(e,t){const i=/^(\d{2}):(\d{2})/.exec(e||""),s=/^(\d{2}):(\d{2})/.exec(t||"");if(!i||!s)return"";let o=(60*+s[1]+ +s[2]-(60*+i[1]+ +i[2])+1440)%1440;0===o&&e===t&&(o=0);return`${Math.floor(o/60)}h ${String(o%60).padStart(2,"0")}m`}hrsText(e,t){const i=/^(\d{1,2}):(\d{2})/.exec(e||""),s=/^(\d{1,2}):(\d{2})/.exec(t||"");if(!i||!s)return"";const o=(60*+s[1]+ +s[2]-(60*+i[1]+ +i[2])+1440)%1440;return ke("{time}hrs",{time:`${Math.floor(o/60)}:${String(o%60).padStart(2,"0")}`})}startPlanEdit(e=!1){const t=this.tempUnitF(),i=e=>{const i=Number(e);return null!=e&&""!==e&&Number.isFinite(i)?t?Math.round(9*i/5+32):Math.round(10*i)/10:""},s=e=>{const i=Number(e);return null!=e&&""!==e&&Number.isFinite(i)?t?Math.round(9*i/5):Math.round(10*i)/10:""};if(e)return this.planDraft=[{stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}],void(this.planEditStage=0);const o=e=>e?{...e,go_dark:this.threshToDisp(e.go_dark),turn_off:this.threshToDisp(e.turn_off)}:null;this.planDraft=this.planInfo().stages.map(e=>({stageId:e.stageId,label:e.label||"",start:this.codeToInputDate(e.start),end:this.codeToInputDate(e.end),alarm:this.epochToLocalInput(e.alarm),temp_day:i(e.temp_day),temp_night:i(e.temp_night),temp_dz:s(e.temp_dz),humi_day:e.humi_day??"",humi_night:e.humi_night??"",humi_dz:e.humi_dz??"",co2_day:e.co2_day??"",co2_night:e.co2_night??"",co2_dz:e.co2_dz??"",light1:o(e.light1)??{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:o(e.light2)}))}planDraftSet(e,t,i){this.planDraft&&(this.planDraft=this.planDraft.map((s,o)=>o===e?{...s,[t]:i}:s))}addPlanStage(){this.planDraft||this.startPlanEdit();const e={stageId:null,label:"New stage",start:"",end:"",alarm:"",temp_day:"",temp_night:"",temp_dz:"",humi_day:"",humi_night:"",humi_dz:"",co2_day:"",co2_night:"",co2_dz:"",light1:{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0},light2:null},t=this.planDraft??[];this.planDraft=[...t,e],this.planEditStage=t.length}removePlanStage(e){this.planDraft&&(this.planDraft=this.planDraft.filter((t,i)=>i!==e),this.planEditStage=null,this.savePlanEdit(this.planInfo().active))}savePlanEdit(e){if(!this.planDraft)return;const t=this.tempUnitF(),i=e=>{const t=Number(e);return""!==e&&null!=e&&Number.isFinite(t)?t:void 0},s=e=>{const s=i(e);if(void 0!==s)return t?Math.round(5*(s-32)/9*1e4)/1e4:s},o=e=>{if(e)return{...e,go_dark:this.threshToC(e.go_dark),turn_off:this.threshToC(e.turn_off)}},a=this.planDraft.map(e=>{const a=this.encodePlanCode(e.start),n=this.encodePlanCode(e.end);let r=this.localInputToEpoch(e.alarm);if(void 0===r){const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.start||"");t&&(r=Math.floor(new Date(+t[1],+t[2]-1,+t[3],12,0,0).getTime()/1e3))}const l={},d=(e,t,i,s)=>{const o={};void 0!==t&&(o.day=t),void 0!==i&&(o.night=i),void 0!==s&&(o.dz=s),Object.keys(o).length&&(l[e]=o)},c=(e,t,i)=>void 0!==e?e:t?void 0:i,h=this.planEnvHas("temp"),p=this.planEnvHas("humi"),u=this.planEnvHas("co2");d("temp",c(s(e.temp_day),h,25),c(s(e.temp_night),h,20),c((e=>{const s=i(e);if(void 0!==s)return t?Math.round(5*s/9*1e4)/1e4:s})(e.temp_dz),h,2)),d("humi",c(i(e.humi_day),p,60),c(i(e.humi_night),p,55),c(i(e.humi_dz),p,5)),d("co2",c(i(e.co2_day),u,500),c(i(e.co2_night),u,500),c(i(e.co2_dz),u,100));const g={stageId:e.stageId,label:e.label,start:a,end:n,alarm:r,target:l};return g.light1=o(this.planLightHas("light1")?e.light1??this.defaultPlanLight():this.offPlanLight()),g.light2=o(this.planLightHas("light2")?e.light2??this.defaultPlanLight():this.offPlanLight()),g});this.hass?.callService("sf","set_plan",{entity_id:`sensor.sf_${this.config.panel}_plan`,stages:a,enabled:e}),e&&this.setPlanLights(!0),this.planDraft=null,this.planEditStage=null}setPlanLights(e){const t=e?"PPFD - Plan":"Manual";for(const i of["light_1","light_2"]){const s=`select.sf_${this.config.panel}_${i}_mode`;if(!this.get(s))continue;this.hass?.callService("select","select_option",{entity_id:s,option:t}),this.modePick={...this.modePick,[s]:t};const o=`light.sf_${this.config.panel}_${i}`;this.get(o)&&this.hass?.callService("light",e?"turn_on":"turn_off",{entity_id:o})}}presetDraftStage(e){const t=this.tempUnitF(),i=e=>t?Math.round(9*e/5+32):Math.round(10*e)/10,s=()=>"dry"===e.key?{mode:"Time Slot",ts_start:"00:00",ts_stop:"00:00",ts_bri:11,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}:{mode:"PPFD",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:e.ppfd??300,ppfd_start:e.on??"05:00",ppfd_stop:e.off??"23:00",ppfd_fade:e.fade??30,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0};return{stageId:null,label:e.label,start:"",end:"",alarm:"",temp_day:i(e.tC),temp_night:i(e.tCn),temp_dz:(e=>t?Math.round(9*e/5):Math.round(10*e)/10)(e.tDz),humi_day:e.hd,humi_night:e.hn,humi_dz:e.hDz,co2_day:e.cd??"",co2_night:e.cn??"",co2_dz:e.cDz??"",light1:s(),light2:s()}}myTemplates(){if(this._myTpl)return this._myTpl;const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,t=e?.plan_templates;if(t)try{const e=JSON.parse(t);if(Array.isArray(e))return e}catch{}try{const e=JSON.parse(localStorage.getItem(ct.MY_TPL_KEY)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}saveMyTemplate(e){const t=(e||"").trim();if(!this.planDraft||!t)return;const i=this.myTemplates().filter(e=>e.name!==t);i.push({name:t,stages:JSON.parse(JSON.stringify(this.planDraft))}),this._myTpl=i,this.persistColorOption("plan_templates",JSON.stringify(i)),this.planTplName="",this._tplMsg=ke("“{name}” saved to My templates",{name:t}),clearTimeout(this._tplMsgT),this._tplMsgT=setTimeout(()=>{this._tplMsg=""},3e3)}deleteMyTemplate(e){const t=this.myTemplates().filter(t=>t.name!==e);this._myTpl=t,this.persistColorOption("plan_templates",JSON.stringify(t)),this.requestUpdate()}usePreset(e,t){const i=this.presetDraftStage(e);t&&this.planDraft?(this.planDraft=[...this.planDraft,i],this.planEditStage=this.planDraft.length-1):(this.planDraft=[i],this.planEditStage=0),this.planTplOpen=null}useMyTemplate(e,t){const i=this.myTemplates().find(t=>t.name===e);if(!i)return;const s=JSON.parse(JSON.stringify(i.stages));t&&this.planDraft?this.planDraft=[...this.planDraft,...s]:this.planDraft=s,this.planEditStage=0,this.planTplOpen=null}renderPlanTemplatePicker(){const e=this.accent(),t="append"===this.planTplOpen,i=this.tempUnitF()?"°F":"°C",s=e=>this.tempUnitF()?Math.round(9*e/5+32):Math.round(10*e)/10,o=this.myTemplates(),a=(t,i,s,o)=>V`
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--divider-color,#2a2f31)">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
          <span style="font-weight:600">${ke(t)}</span>
          <span style="font-size:12px;color:var(--secondary-text-color)">${i}</span>
        </div>
        <span style="display:flex;gap:6px;flex:none">
          <button class="plan-editbtn" style="border-color:${e};color:${e}" @click=${s}>${ke("Use")}</button>
          ${o?V`<button class="plan-editbtn" @click=${o}>${ke("Delete")}</button>`:j}
        </span>
      </div>`;return V`
      <div class="section-label">${ke(t?"Add a stage from a template":"New plan from a template")}</div>
      <div style="font-size:12px;color:var(--secondary-text-color);margin:2px 0 4px">${ke("System templates")}</div>
      ${ct.PLAN_PRESETS.map(e=>a(`${e.emoji} ${ke(e.label)}`,"dry"===e.key?ke("lights off · dark · set dates on apply"):`${s(e.tC)}/${s(e.tCn)}${i} · ${e.hd}/${e.hn}% RH · PPFD ${e.ppfd}`,()=>this.usePreset(e,t)))}
      <div style="font-size:12px;color:var(--secondary-text-color);margin:12px 0 4px">${ke("My templates")}</div>
      ${o.length?o.map(e=>a(`💾 ${e.name}`,ke(1===e.stages.length?"{n} stage":"{n} stages",{n:e.stages.length}),()=>this.useMyTemplate(e.name,t),()=>this.deleteMyTemplate(e.name))):V`<div style="font-size:12px;color:var(--secondary-text-color);padding:6px 0">
            ${ke("No saved templates yet — build or edit a plan, then “Save as template”.")}</div>`}
      <button class="plan-btn" style="margin-top:12px" @click=${()=>{this.planTplOpen=null}}>${ke("Cancel")}</button>`}renderStageLight(e,t){const i=this.accent(),s=this.planDraft[e][t];if(!s)return j;const o=(i,o)=>this.planDraftSet(e,t,{...s,[i]:o}),a=e=>V`<input type="time" class="pe-in"
      .value=${String(s[e]??"")} @change=${t=>o(e,t.target.value)}>`,n=(e,t)=>this.peSelect(s[e],t,t=>o(e,t)),r=e=>V`<button class="pe-modebtn ${s.mode===e?"on":""}"
      style=${s.mode===e?`border-color:${i};color:${i}`:""}
      @click=${()=>o("mode",e)}>${ke(e)}</button>`,l="PPFD"===s.mode,d=l?"ppfd_start":"ts_start",c=l?"ppfd_stop":"ts_stop",h=this.durText(s[d],s[c]),p=this.numOpts(11,100,1,e=>`${e}%`),u=this.numOpts(20,2e3,10,e=>`${e} µmol`),g=this.offOpts(1,60,1,e=>`${e} min`),m=(e,t)=>V`<label class="pe-cell">
      <span>${ke(e)}</span>${t}</label>`,f=e=>V`<div class="pe-cellrow">${e}</div>`,v=m("Go dark",n("go_dark",this.threshOpts())),b=m("Turn off",n("turn_off",this.threshOpts()));return V`
      <div class="pe-light">
        <div class="pe-light-head"><span>${ke("light1"===t?"Light 1":"Light 2")}</span>
          <span class="pe-modes">${r("Time Slot")}${r("PPFD")}</span></div>
        <div class="pe-timesrow">
          <label>On${a(d)}</label>
          <label>Off${a(c)}</label>
        </div>
        ${h?V`<div class="pe-durrow">${ke("Light Duration · {duration}",{duration:h})}</div>`:j}
        ${l?V`
          ${f([m("Target",n("ppfd_target",u)),m("Dim min",n("ppfd_min",p)),m("Dim max",n("ppfd_max",p)),m("Sunrise/set",n("ppfd_fade",g))])}
          ${f([v,b])}`:V`
          ${f([m("Brightness",n("ts_bri",p)),m("Sunrise/set",n("ts_fade",g)),v,b])}`}
      </div>`}renderStageEditor(e){const t=this.accent(),i=this.tempUnitF()?"°F":"°C",s=this.planDraft[e],o=(t,i)=>this.planDraftSet(e,t,i),a=e=>V`<input type="date" class="pe-in"
      .value=${String(s[e]??"")} @change=${t=>o(e,t.target.value)}>`,n=(e,t,i,a)=>V`
      <div class="pe-row"><span class="pe-lbl">${ke(e)}</span>
        <span class="pe-cells">
          ${this.peSelect(s[t+"_night"],i,e=>o(t+"_night",e))}
          ${this.peSelect(s[t+"_day"],i,e=>o(t+"_day",e))}
          ${this.peSelect(s[t+"_dz"],a,e=>o(t+"_dz",e))}
        </span></div>`;return V`
      ${this.planDelArm?V`<div class="pe-head pe-delrow">
            <span class="pe-delq">${ke("Delete this stage?")}</span>
            <button class="pe-del-yes" @click=${()=>{this.planDelArm=!1,this.removePlanStage(e)}}>${ke("Delete")}</button>
            <button class="pe-del-no" @click=${()=>{this.planDelArm=!1}}>${ke("Cancel")}</button>
          </div>`:V`<div class="pe-head">
            <ha-icon icon="mdi:arrow-left" class="pe-back"
              @click=${()=>{this.planEditStage=null,this.planDelArm=!1}}></ha-icon>
            <input class="pe-name" .value=${s.label||""}
              @change=${e=>o("label",e.target.value)}>
            <ha-icon icon="mdi:delete" class="pe-del"
              @click=${()=>{this.planDelArm=!0}}></ha-icon>
          </div>`}
      <div class="pe-dates">
        <label>Start${a("start")}</label>
        <label>End${a("end")}</label>
      </div>
      <div class="pe-alarmrow">
        <label>${ke("Alarm")}<input type="datetime-local" class="pe-in"
          .value=${String(s.alarm??"")}
          @change=${e=>o("alarm",e.target.value)}></label>
      </div>
      <div class="pe-grid-head"><span></span><span class="pe-cells">
        <span>${ke("Night")}</span><span>${ke("Day")}</span><span>${ke("Dead")}</span></span></div>
      ${this.planEnvHas("temp")?n("Temp "+i,"temp",this.envOptsFor("env_temp_day"),this.envOptsFor("env_temp_deadband")):j}
      ${this.planEnvHas("humi")?n("Humidity","humi",this.envOptsFor("env_humi_day"),this.envOptsFor("env_humi_deadband")):j}
      ${this.planEnvHas("co2")?n("CO₂","co2",this.envOptsFor("env_co2_day"),this.envOptsFor("env_co2_deadband")):j}
      ${this.planLightHas("light1")?this.renderStageLight(e,"light1"):j}
      ${this.planLightHas("light2")?this.renderStageLight(e,"light2"):j}
      <div class="plan-actions" style="display:flex;gap:10px">
        <button class="plan-btn" style="flex:1;background:${t};border-color:${t};color:#0c1f06"
          @click=${()=>this.savePlanEdit(this.planInfo().active)}>${this.planInfo().active?ke("Save & activate"):ke("Save Plan")}</button>
        <button class="plan-btn" style="flex:1"
          @click=${()=>{this.planDraft=null,this.planEditStage=null,this.planDelArm=!1}}>${ke("Cancel")}</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
        <input class="pe-name" style="flex:1;min-width:0" placeholder=${ke("Template name")}
          .value=${this.planTplName}
          @input=${e=>{this.planTplName=e.target.value}}>
        <button class="plan-btn" style="flex:0 0 auto;width:auto;padding:11px 14px;white-space:nowrap"
          ?disabled=${!this.planTplName.trim()}
          @click=${()=>this.saveMyTemplate(this.planTplName)}>${ke("Save as template")}</button>
      </div>
      ${this._tplMsg?V`<div style="display:flex;align-items:center;gap:6px;margin-top:8px;
        color:#46c98a;font-size:13px;font-weight:600">
        <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:18px"></ha-icon>${this._tplMsg}</div>`:j}
      <div class="plan-note" style="margin-top:6px">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>“Save as template” stores this whole plan under My templates (on the
        controller, so it syncs across your devices) — it doesn't change the running
        plan. Use “${this.planInfo().active?ke("Save & activate"):ke("Save Plan")}” to apply it to the controller.</span>
      </div>`}editStage(e){this.planDraft||this.startPlanEdit(),this.planEditStage=e,this.planDelArm=!1}planEnvHas(e){const t="temp"===e?"temperature":"humi"===e?"humidity":"co2";return!!this.get(`sensor.sf_${this.config.panel}_${t}`)}planLightHas(e){return!!this.get(this.eid("light","light1"===e?"light_1":"light_2"))}defaultPlanLight(){return{mode:"Time Slot",ts_start:"05:00",ts_stop:"23:00",ts_bri:100,ts_fade:0,ppfd_target:300,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:11,ppfd_max:100,go_dark:0,turn_off:0}}offPlanLight(){return{mode:"Manual",ts_start:"05:00",ts_stop:"23:00",ts_bri:0,ts_fade:0,ppfd_target:0,ppfd_start:"05:00",ppfd_stop:"23:00",ppfd_fade:0,ppfd_min:0,ppfd_max:0,go_dark:0,turn_off:0}}renderPlanStage(e,t,i=-1){const s=this.accent(),o=null!=t&&e.stageId===t,a=this.planStageDates(e),n=(e,t,i,s="")=>V`
      <div class="plan-metric">
        <span class="plan-metric-label">${ke(e)}</span>
        <span class="plan-metric-vals">
          <span>N ${this.fmtNum(t)}${s}</span>
          <span>D ${this.fmtNum(i)}${s}</span>
        </span>
      </div>`,r=(e,t)=>{if(!t||"object"!=typeof t)return j;const i=t.mode||"";let s="",o="";if("Manual"===i){const e=Number(t.ts_bri)||0;s=e>0?`${e}%`:"Off"}else"PPFD"===i?(s=`${t.ppfd_start}–${t.ppfd_stop}`,o=`PPFD ${Math.max(20,Math.round(Number(t.ppfd_target)||0))}`):(s=`${t.ts_start}–${t.ts_stop}`,o=`${Math.round(Number(t.ts_bri)||0)}%`);return V`
        <div class="plan-metric">
          <span class="plan-metric-label">${ke(e)}</span>
          <span class="plan-metric-vals">
            ${s?V`<span>${s}</span>`:j}
            ${o?V`<span>${o}</span>`:j}
          </span>
        </div>`},l=this.planLightHas("light1"),d=this.planLightHas("light2");return V`
      <div class="plan-stage ${o?"current":""}"
        style=${o?`border-color:${s}`:""}>
        <div class="plan-stage-head">
          <span class="plan-stage-dot" style="background:${s}"></span>
          <span class="plan-stage-name">${e.label||ke("Stage")}</span>
          ${o?V`<span class="plan-stage-badge" style="color:${s};border-color:${s}">${ke("Current")}</span>`:j}
          ${i>=0?V`<ha-icon icon="mdi:pencil" class="plan-stage-edit"
            @click=${()=>this.editStage(i)}></ha-icon>`:j}
        </div>
        ${a?V`<div class="plan-stage-dates">${a}</div>`:j}
        <div class="plan-stage-grid">
          ${this.planEnvHas("temp")?n("Temp",this.fmtTemp(e.temp_night),this.fmtTemp(e.temp_day)):j}
          ${this.planEnvHas("humi")?n("Humidity",e.humi_night,e.humi_day,"%"):j}
          ${this.planEnvHas("co2")?n("CO₂",e.co2_night,e.co2_day,""):j}
          ${l?r(d?"Light 1":"Light",e.light1):j}
          ${d?r("Light 2",e.light2):j}
        </div>
      </div>`}fmtTemp(e){if(null==e||""===e)return"–";const t=Number(e);if(!Number.isFinite(t))return"–";const i=this.get(`number.sf_${this.config.panel}_env_temp_day`),s=i?.attributes?.unit_of_measurement;return"°F"===s||"℉"===s?`${Math.round(9*t/5+32)}°`:`${Math.round(t)}°`}fmtNum(e){if(null==e||""===e)return"–";const t=Number(e);return Number.isFinite(t)?`${Math.round(t)}`:String(e)}vpdRangeFor(e,t){const i=this.get(e),s=this.get(t);if(!i||!s)return null;const o=Number(i.state),a=Number(s.state);if(!Number.isFinite(o)||!Number.isFinite(a))return null;const n=this.config.panel,r=Number(this.get(`number.sf_${n}_env_temp_deadband`)?.state??0)||0,l=Number(this.get(`number.sf_${n}_env_humi_deadband`)?.state??0)||0,d="°C"===i.attributes.unit_of_measurement,c=e=>d?e:5*(e-32)/9,h=e=>.6108*Math.exp(17.27*e/(e+237.3)),p=Math.max(0,a-l),u=Math.min(100,a+l),g=Math.max(0,h(c(o-r))*(1-u/100)),m=Math.max(0,h(c(o+r))*(1-p/100));return`${g.toFixed(2)} – ${m.toFixed(2)}`}renderVpd(){const e=this.config.panel,t=this.vpdRangeFor(`number.sf_${e}_env_temp_day`,`number.sf_${e}_env_humi_day`),i=this.vpdRangeFor(`number.sf_${e}_env_temp_night`,`number.sf_${e}_env_humi_night`);return t||i?V`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>${ke("VPD kPa")}</span>
        </div>
        <div class="vpd-grid">
          ${t?V`<div class="vpd-line">
                <span class="vpd-lbl">${ke("Daytime")}</span>
                <span class="vpd-val">${t}</span>
              </div>`:j}
          ${i?V`<div class="vpd-line">
                <span class="vpd-lbl">${ke("Nighttime")}</span>
                <span class="vpd-val">${i}</span>
              </div>`:j}
        </div>
      </div>`:j}renderLeafVpdTargets(){if(!this.showLeafVpd)return j;const e=this.get(this.eid("number","leaf_vpd_min")),t=this.get(this.eid("number","leaf_vpd_max"));if(!e||!t)return j;const i=(e,t)=>{const i=this.eid("number",e);return V`
      <div class="ctl ${i in this.draft?"staged":""}">
        <div class="ctl-label">${ke(t)}</div>
        <div class="ctl-input">
          <span class="num-box">
            <input type="number" step="0.05" min="0" max="4" .value=${this.draftVal(i)}
              @change=${e=>{const t=parseFloat(e.target.value);Number.isFinite(t)&&this.stage(i,String(t))}} />
            <span class="unit">kPa</span>
          </span>
        </div>
      </div>`};return V`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:leaf" style="color:${this.accent()}"></ha-icon>
          <span>${ke("Leaf VPD target")}</span>
        </div>
        <div class="leaf-tgt-grid">
          ${i("leaf_vpd_min","Min")}
          ${i("leaf_vpd_max","Max")}
        </div>
        <div class="set-note" style="margin:8px 2px 0">
          ${ke("Colours the Leaf VPD tile when it drifts outside this band, using the Settings-tab highlight colours.")}
        </div>
      </div>`}toggleOutlet(e){this.outletOpen=e,this.outletCopyOpen=!1,this.outletCopyFromOpen=!1,this.outletCopySel={}}outletNums(e){const t=[];for(let i=1;i<=10;i++)this.get(`select.sf_${e}_outlet_${i}_mode`)&&t.push(i);return t}outletName(e,t){if(this.customOutletNames){const i=this.outletNames[`${e}_${t}`];if(i&&i.trim())return i.trim()}return`Outlet ${t}`}stageOutletName(e,t,i){this.outletNameDraft={...this.outletNameDraft,[`${e}_${t}`]:i}}outletNameDirty(e,t){const i=`${e}_${t}`;return i in this.outletNameDraft&&this.outletNameDraft[i].trim()!==(this.outletNames[i]??"").trim()}clearOutletNameDraft(e,t){const i=`${e}_${t}`;if(!(i in this.outletNameDraft))return;const s={...this.outletNameDraft};delete s[i],this.outletNameDraft=s}commitOutletName(e,t){const i=`${e}_${t}`;if(!(i in this.outletNameDraft))return;const s=this.outletNameDraft[i].trim(),o={...this.outletNames};s?o[i]=s:delete o[i],this.outletNames=o,this.persistColorOption(`outlet_name_${e}_${t}`,s),this.cacheColors(),this.clearOutletNameDraft(e,t)}stripBarPills(e){const t=[],i=`select.sf_${e}_operating_mode`,s=this.get(i);if(s){const e=s.state,o="Smart"===e,a=o?"Standalone":"Smart";t.push(V`<button class="oq-btn ${o?"live":""}"
        title=${ke("Operating Mode — tap to switch to {mode}",{mode:ke(a)})}
        aria-label=${`Operating Mode: ${e}`}
        @click=${()=>this.hass?.callService("select","select_option",{entity_id:i,option:a})}>
        <span class="oq-dot"></span>${ke(e)}</button>`)}const o=`switch.sf_${e}_indicator_light`,a=this.get(o);if(a){const e="on"===a.state;t.push(V`<button class="oq-btn ${e?"live":""}"
        title=${ke("Status LED (tap to toggle)")} aria-label=${ke("Status LED")}
        @click=${()=>this.hass?.callService("switch","toggle",{entity_id:o})}>
        <span class="oq-dot"></span>${ke("Status LED")}</button>`)}return V`<span style="display:inline-flex;gap:6px">${t}</span>`}renderOutlets(){const e=this.outletSlots().filter(e=>this.outletNums(e).length>0);return e.length?V`
      ${this.outletOnly()?this.renderEnergyTile():j}
      ${e.map(e=>{const t=Ge(this.hass,e)||(e.startsWith("st")?"S-Station":`${e.toUpperCase()} Power Strip`);return V`
          <div class="section-label" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span>${ke(t)}</span>
            ${this.stripBarPills(e)}
          </div>
          ${this.renderQuickRow(e)}
          <div class="grid">
            ${this.outletNums(e).map(t=>{const i=this.outletKey(e,t);return V`${this.outletTile(e,t)}
                ${this.outletOpen===i?V`<div class="rspan tile-exp">${this.renderOutletPop()}</div>`:j}`})}
          </div>`})}`:j}ologKey(e){return`${e}|${this.ologRange}`}async fetchOlog(e){const t=this.ologKey(e);if(!this._olog[t]&&!this._ologLoading[t]&&this.hass){this._ologLoading[t]=!0;try{const i=new Date,s=new Date(i.getTime()-3600*this.ologRange*1e3),o=await this.hass.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0}),a=o&&o[e]||[];this._olog[t]=a.map(e=>({t:null!=e.lu?1e3*e.lu:Date.parse(e.last_updated??e.last_changed),on:"on"===(e.s??e.state)})).filter(e=>Number.isFinite(e.t))}catch{this._olog[t]=[]}finally{this._ologLoading[t]=!1,this._ologVer++}}}ologSegments(e,t,i){const s=this._olog[e]||[],o=i-t,a=[];for(let e=0;e<s.length;e++){if(!s[e].on)continue;const n=Math.max(s[e].t,t),r=e+1<s.length?s[e+1].t:i;r<=n||a.push({left:(n-t)/o*100,width:(r-n)/o*100})}return a}ologEvents(e,t){const i=this._olog[e]||[],s=[];for(let e=i.length-1;e>=0&&s.length<10;e--){const o=e+1<i.length?i[e+1].t:t;s.push({on:i[e].on,t:i[e].t,dur:i[e].on?o-i[e].t:null})}return s}ologAxis(){const e=this.ologRange;let t;if(e>=168)t=["7d","5d","3d","1d","now"];else{const i=e=>0===e?"now":e<1?`${Math.round(60*e)}m`:Number.isInteger(e)?`${e}h`:`${e.toFixed(1)}h`;t=[1,.75,.5,.25,0].map(t=>i(e*t))}return V`<div class="olog-axis">${t.map(e=>V`<span>${e}</span>`)}</div>`}ologTickStyle(){const e=this.ologRange,t="rgba(255,255,255,0.12)";return`background-image:repeating-linear-gradient(to right,${t} 0,${t} 1px,transparent 1px,transparent ${(100/(e>=168?7:e<=1?6:e)).toFixed(4)}%)`}ologTime(e){return new Date(e).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",hour12:this.hour12})}ologDur(e){const t=Math.round(e/6e4);if(t<60)return`${t}m`;const i=Math.floor(t/60),s=t%60;return s?`${i}h${s}m`:`${i}h`}ologAgo(e){const t=Math.round(e/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const i=Math.floor(t/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}ologRow(e,t,i,s){const o=`switch.sf_${e}_outlet_${t}`,a=this.ologKey(o);this._olog[a]||this.fetchOlog(o);const n=this.outletKey(e,t),r=this.ologOpen===n,l="on"===this.get(o)?.state,d=this._olog[a]||[],c=d.length?d[d.length-1].t:null,h=l?ke("On now"):c?ke("Off · {ago}",{ago:this.ologAgo(s-c)}):ke("Off"),p=!!this._ologLoading[a]&&!this._olog[a],u=this.ologSegments(a,i,s);return V`
      <div class="olog-row" role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>{this.ologOpen=r?null:n}}>
        <div class="olog-nm">${this.outletName(e,t)}<span class="olog-cur">${h}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${p?V`<span class="olog-load">${ke("Loading…")}</span>`:u.map(e=>V`<span class="olog-seg"
                style="left:${e.left.toFixed(2)}%;width:${Math.max(.4,e.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${r?V`<div class="olog-exp">
        ${(()=>{const e=this.ologEvents(a,s);return e.length?e.map(e=>V`<div class="olog-ev">
              <span><span class=${e.on?"on":"off"}>${e.on?ke("On"):ke("Off")}</span> · ${this.ologTime(e.t)}</span>
              <span class="dur">${null!=e.dur?this.ologDur(e.dur):"—"}</span>
            </div>`):V`<div class="olog-ev" style="color:var(--secondary-text-color)">${ke("No switch events in this window.")}</div>`})()}
      </div>`:j}`}vpdBand(){if(this.vpdPlanSource){const e=this.vpdPlanBand();if(e)return e}switch(this.vpdStage){case"prop":return[.4,.8];case"flower":return[1.2,1.6];case"custom":return this.vpdCustom;default:return[.8,1.2]}}vpdPlanBand(){try{const e=this.planStageCurrent?.(),t=String(e?.name??e?.stageName??"").toLowerCase();if(!t)return null;if(/seed|clone|prop|germ/.test(t))return[.4,.8];if(/veg/.test(t))return[.8,1.2];if(/flow|bloom|fruit|dry/.test(t))return[1.2,1.6]}catch{}return null}vpdPlanName(){try{const e=this.planStageCurrent?.();return String(e?.name??e?.stageName??"")}catch{return""}}vpdReadings(){const e=this.get(`sensor.sf_${this.config.panel}_temperature`),t=this.get(`sensor.sf_${this.config.panel}_humidity`);if(!e||!t)return null;const i=parseFloat(e.state),s=parseFloat(t.state);if(!Number.isFinite(i)||!Number.isFinite(s))return null;const o=e.attributes.unit_of_measurement||"°C",a=/F/i.test(o),n=a?5*(i-32)/9:i,r=e=>610.7*Math.exp(17.27*e/(e+237.3))/1e3,l=r(n)*s/100,d=this.get(`sensor.sf_${this.config.panel}_leaf_vpd`),c=d?parseFloat(d.state):NaN;let h,p;if(Number.isFinite(c)){h=c;const e=Math.log(1e3*Math.max(.001,h+l)/610.7);p=237.3*e/(17.27-e)}else p=n-2,h=r(p)-l;const u=a?9*p/5+32:p;return{airT:i,rh:s,isF:a,unit:o,air:r(n)-l,leaf:h,leafT:u}}async fetchVpdHist(e){if(!this._graph[e]&&!this._graphLoading[e]&&this.hass){this._graphLoading[e]=!0;try{const t=new Date,i=new Date(t.getTime()-864e5),s=await this.hass.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:t.toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0}),o=s&&s[e]||[];this._graph[e]=o.map(e=>({t:null!=e.lu?1e3*e.lu:Date.parse(e.last_updated??e.last_changed),v:parseFloat(e.s??e.state)})).filter(e=>Number.isFinite(e.v)&&Number.isFinite(e.t))}catch{this._graph[e]=[]}finally{this._graphLoading[e]=!1,this._graphVer++}}}renderVpdTab(){const e=this.accent(),t=this.vpdReadings();if(!t)return V`<div style="padding:24px 16px;color:var(--secondary-text-color);text-align:center">
        ${ke("Waiting for this panel's air temperature and humidity…")}</div>`;const i=this.vpdBand(),s=t.air>=i[0]&&t.air<=i[1],o=s?"#46c98a":t.air>i[1]?"#e5734b":"#52b6d6",a=s?"rgba(70,201,138,.15)":t.air>i[1]?"rgba(229,115,75,.16)":"rgba(82,182,214,.16)",n=ke(s?"In range":t.air>i[1]?"Above target":"Below target")+` · ${i[0].toFixed(1)}–${i[1].toFixed(1)} kPa`,r=(()=>{try{return!!this.planInfo?.().active}catch{return!1}})(),l=this.vpdPlanSource&&!!this.vpdPlanBand(),d=(t,i)=>V`
      <button style="padding:4px 12px;font-size:12px;border:none;cursor:pointer;background:${this.vpdView===t?e:"#1a1e20"};color:${this.vpdView===t?"#151515":"#aeb4b9"}"
        @click=${()=>this.vpdView=t}>${ke(i)}</button>`,c=(t,i)=>V`
      <button style="padding:5px 9px;border-radius:8px;font-size:12px;white-space:nowrap;cursor:${l?"default":"pointer"};
        opacity:${l?".45":"1"};
        background:${this.vpdStage!==t||l?"#1e2224":"rgba(239,139,43,.16)"};
        border:1px solid ${this.vpdStage!==t||l?"#2f3538":e};
        color:${this.vpdStage!==t||l?"#c7cccf":"#fff"}"
        @click=${()=>{l||(this.vpdStage=t)}}>${ke(i)}</button>`,h=(e,t)=>()=>{const i=[this.vpdCustom[0],this.vpdCustom[1]];0===t?i[0]=Math.min(i[1]-.1,Math.max(.2,i[0]+.05*e)):i[1]=Math.max(i[0]+.1,Math.min(2,i[1]+.05*e)),this.vpdCustom=[Math.round(100*i[0])/100,Math.round(100*i[1])/100],this.requestUpdate()};return V`
      <div style="padding:10px 14px 14px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <span style="font-size:12px;letter-spacing:.06em;color:var(--secondary-text-color);font-weight:600">${ke("VAPOR PRESSURE DEFICIT")}</span>
          <div style="display:flex;gap:10px;align-items:center">
            <div style="display:flex;border:1px solid #2f3538;border-radius:8px;overflow:hidden">${d("grid","Grid")}${d("trend","Trend")}</div>
            <span style="font-size:12px;color:#aeb4b9">${ke("Highlight")}</span>
            <button class="toggle ${this.vpdHighlight?"on":""}" style=${this.vpdHighlight?`background:${e}`:j}
              @click=${()=>this.vpdHighlight=!this.vpdHighlight}></button>
          </div>
        </div>
        <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          ${c("prop","🌱 Propagation")}${c("veg","🌿 Vegetative")}${c("flower","🌸 Flowering")}${c("custom","⚙ Custom")}
        </div>
        <div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;align-items:center">
          ${ke("Target source:")}
          <span style="color:#c7cccf">${l?ke("Planting plan · {name}",{name:this.vpdPlanName()}):ke("Growth-stage buttons")}</span>
          ${this.vpdPlanSource?V`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                @click=${()=>this.vpdPlanSource=!1}>${ke("use stage buttons instead →")}</span>`:r?V`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                  @click=${()=>this.vpdPlanSource=!0}>${ke("use planting plan instead →")}</span>`:V`<span style="color:#5a6166;cursor:default" title=${ke("No active planting plan for this device")}>${ke("use planting plan instead →")}</span>`}
        </div>
        ${"custom"!==this.vpdStage||l?j:V`
          <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:13px;color:#c7cccf">
            ${ke("Custom band (kPa):")}
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              ${ke("min")} <b style="cursor:pointer;color:${e}" @click=${h(-1,0)}>−</b>${this.vpdCustom[0].toFixed(2)}<b style="cursor:pointer;color:${e}" @click=${h(1,0)}>+</b></span>
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              ${ke("max")} <b style="cursor:pointer;color:${e}" @click=${h(-1,1)}>−</b>${this.vpdCustom[1].toFixed(2)}<b style="cursor:pointer;color:${e}" @click=${h(1,1)}>+</b></span>
          </div>`}
        <div style="display:flex;justify-content:center;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap">
          <div><span style="font-size:26px;font-weight:700">${t.air.toFixed(2)}</span> <span style="font-size:13px;color:var(--secondary-text-color)">${ke("kPa air VPD")}</span></div>
          ${this.vpdLeaf?V`<div><span style="font-size:20px;font-weight:600;color:#c7cccf">${t.leaf.toFixed(2)}</span> <span style="font-size:12px;color:var(--secondary-text-color)">${ke("kPa leaf VPD")}</span></div>`:j}
          <span style="font-size:12px;padding:3px 9px;border-radius:20px;font-weight:600;color:${o};background:${a}">${n}</span>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--secondary-text-color);margin-bottom:10px">${ke("Air {temp} · RH {rh}%",{temp:`${t.airT.toFixed(1)}${t.unit}`,rh:t.rh.toFixed(0)})}</div>
        <div style="background:#121517;border:1px solid #262b2d;border-radius:10px;padding:8px 6px 4px">
          <canvas id="vpdcanvas" style="width:100%;display:block;border-radius:6px"></canvas>
          ${"grid"===this.vpdView?V`
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:8px 6px 3px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#1f71a1;vertical-align:-1px;margin-right:4px"></i>&lt;0.4</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#23aa9c;vertical-align:-1px;margin-right:4px"></i>0.4–0.8</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#96c55a;vertical-align:-1px;margin-right:4px"></i>0.8–1.2</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#e4c02a;vertical-align:-1px;margin-right:4px"></i>1.2–1.6</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ec8c2d;vertical-align:-1px;margin-right:4px"></i>1.6–2.0</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ce4233;vertical-align:-1px;margin-right:4px"></i>≥2.0</span>
            </div>
            <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:0 6px 4px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#fff;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>${ke("air")}</span>
              ${this.vpdLeaf?V`<span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#35e08a;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>${ke("leaf")}</span>`:j}
            </div>`:j}
        </div>
      </div>`}drawVpdCanvas(){const e=this.renderRoot?.querySelector("#vpdcanvas");if(!e)return;const t=this.vpdReadings();if(!t)return;const i=e.getContext("2d");if(!i)return;const s=Math.min(2,window.devicePixelRatio||1),o=Math.max(280,Math.round(e.clientWidth||460)),a=210;e.width=o*s,e.height=a*s,e.style.height=a+"px",i.setTransform(s,0,0,s,0,0),i.clearRect(0,0,o,a);const n=32,r=22,l=o-n-10,d=178,c=this.vpdBand(),h=ct.VPD_TH,p=ct.VPD_COL,u=(e,t,i)=>{const s=Math.max(0,Math.min(1,(i-e)/(t-e)));return s*s*(3-2*s)},g=e=>610.7*Math.exp(17.27*e/(e+237.3))/1e3;if("trend"===this.vpdView){const e=`sensor.sf_${this.config.panel}_vpd`,t=this._graph[e],s=.2,a=2,h=e=>r+(1-(e-s)/(a-s))*d;if(i.strokeStyle="#242a2c",i.fillStyle="#8b9298",i.font="9px sans-serif",i.textAlign="end",i.lineWidth=1,[.4,.8,1.2,1.6].forEach(e=>{const t=h(e);i.beginPath(),i.moveTo(n,t),i.lineTo(o-10,t),i.stroke(),i.fillText(e.toFixed(1),27,t+3)}),this.vpdHighlight){const e=h(Math.min(c[1],a)),t=h(Math.max(c[0],s));i.fillStyle="rgba(70,201,138,.16)",i.fillRect(n,e,l,t-e)}if(!t||!this._graph[e])return i.fillStyle="#8b9298",i.textAlign="center",void i.fillText(ke("Loading 24h history…"),o/2,105);if(t.length<2)return i.fillStyle="#8b9298",i.textAlign="center",void i.fillText(ke("Not enough VPD history yet."),o/2,105);const p=t[0].t,u=t[t.length-1].t,g=Math.max(1,u-p),m=e=>n+(e-p)/g*l;i.beginPath(),t.forEach((e,t)=>{const o=m(e.t),n=h(Math.max(s,Math.min(a,e.v)));t?i.lineTo(o,n):i.moveTo(o,n)}),i.strokeStyle=this.accent(),i.lineWidth=2,i.lineJoin="round",i.stroke();const f=t[t.length-1];return i.beginPath(),i.arc(m(f.t),h(Math.max(s,Math.min(a,f.v))),4,0,7),i.fillStyle=this.accent(),i.fill(),i.fillStyle="#8b9298",void["-24h","-12h","now"].forEach((e,t)=>{const s=n+t/2*l;i.textAlign=0===t?"start":2===t?"end":"center",i.fillText(e,s,203)})}const m=t.isF,f=m?90:32,v=m?60:16,b=e=>m?5*(e-32)/9:e,_=e=>{const t=[p[0][0],p[0][1],p[0][2]];for(let i=0;i<h.length;i++){const s=u(h[i]-.018,h[i]+.018,e),o=p[i+1];t[0]+=(o[0]-t[0])*s,t[1]+=(o[1]-t[1])*s,t[2]+=(o[2]-t[2])*s}return t},y=Math.round(l),$=Math.round(d),x=document.createElement("canvas");x.width=y,x.height=$;const w=x.getContext("2d");if(!w)return;const S=w.createImageData(y,$),k=S.data;for(let e=0;e<$;e++)for(let t=0;t<y;t++){const i=90-(t+.5)/y*60,s=b(v+(e+.5)/$*(f-v)),o=g(s)-g(s)*i/100,a=_(o);let n=a[0],r=a[1],l=a[2];if(this.vpdHighlight){const e=.66*(1-u(c[0]-.05,c[0]+.02,o)*(1-u(c[1]-.02,c[1]+.05,o)));n=n*(1-e)+18*e,r=r*(1-e)+21*e,l=l*(1-e)+23*e}const d=4*(e*y+t);k[d]=n,k[d+1]=r,k[d+2]=l,k[d+3]=255}w.putImageData(S,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(x,n,r,l,d);const O=e=>n+(90-e)/60*l,D=e=>r+(e-v)/(f-v)*d;i.fillStyle="#eef1f2",i.font="9px sans-serif",i.textAlign="end";(m?[60,68,76,84,90]:[16,20,24,28,32]).forEach(e=>i.fillText(e+"°",27,D(e)+3)),i.textAlign="center",[90,75,60,45,30].forEach(e=>i.fillText(e+"%",O(e),15));const T=O(t.rh),C=D(t.airT);if(i.save(),i.setLineDash([3,4]),i.strokeStyle="rgba(255,255,255,.35)",i.lineWidth=1,i.beginPath(),i.moveTo(n,C),i.lineTo(o-10,C),i.moveTo(T,r),i.lineTo(T,200),i.stroke(),i.restore(),this.vpdLeaf){const e=D(t.leafT);i.beginPath(),i.arc(T,e,5,0,7),i.fillStyle="#35e08a",i.fill(),i.strokeStyle="#151515",i.lineWidth=1.3,i.stroke()}i.beginPath(),i.arc(T,C,5,0,7),i.fillStyle="#ffffff",i.fill(),i.strokeStyle="#151515",i.lineWidth=1.3,i.stroke()}updated(e){"vpd"===this.tab&&this.showVpd&&("trend"===this.vpdView&&this.fetchVpdHist(`sensor.sf_${this.config.panel}_vpd`),this.drawVpdCanvas()),this.trackCooldownTransitions();const t=this.anyCooldownActive();if(t&&void 0===this._cdTimer?this._cdTimer=setInterval(()=>{this._cdTick++},1e3):t||void 0===this._cdTimer||(clearInterval(this._cdTimer),this._cdTimer=void 0),this._planPending){const e=this.planInfo().active;("start"===this._planPending&&e||"stop"===this._planPending&&!e)&&(this._planPending="",this._planPendTimer&&(clearTimeout(this._planPendTimer),this._planPendTimer=void 0))}}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._cdTimer&&(clearInterval(this._cdTimer),this._cdTimer=void 0),null!=this._graphTimer&&(clearInterval(this._graphTimer),this._graphTimer=null),this._planPendTimer&&(clearTimeout(this._planPendTimer),this._planPendTimer=void 0)}renderOutletsLog(){const e=this.outletSlots().filter(e=>this.outletNums(e).length>0);if(!e.length)return V`<div class="set-note">${ke("No outlets on this controller.")}</div>`;const t=Date.now(),i=t-3600*this.ologRange*1e3,s=this.accent(),o=(e,t)=>V`<button class="olog-rb ${this.ologRange===e?"on":""}"
      style=${this.ologRange===e?`background:${s};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=e,this.persistColorOption("olog_range",String(e))}}>${ke(t)}</button>`;return V`
      <div class="olog-range">${o(1,"1h")}${o(6,"6h")}${o(12,"12h")}${o(24,"24h")}${o(168,"7d")}</div>
      ${e.map(s=>V`
        ${e.length>1?V`<div class="section-label">${Ge(this.hass,s)||`${s.toUpperCase()} Power Strip`}</div>`:j}
        ${this.outletNums(s).map(e=>this.ologRow(s,e,i,t))}
      `)}
      ${this.ologAxis()}`}renderTimelapseTab(){const e=Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("camera.")).sort(),t=this.tlCam,i=`${this.config.panel}_main`,s=!!this.hass?.states[`sensor.sf_timelapse_${this.config.panel}_main`],o=V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Camera")}</span>
        <select style="max-width:60%" .value=${ye(t||"")}
          @change=${e=>{this.tlCam=e.target.value,this.persistColorOption("tl_cam",e.target.value)}}>
          <option value="">${ke("— choose camera —")}</option>
          ${e.map(e=>V`<option value=${e} ?selected=${e===t}>${this.hass?.states[e]?.attributes?.friendly_name||e}</option>`)}
        </select>
      </div>`,a=()=>{if(!s||!t)return;const e={tl_id:i,interval:this.tlInterval};86400===this.tlInterval&&(e.daily_at=this.tlDailyAt),this.hass?.callService("sf","timelapse_configure",e)},n=V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Snapshot interval")}</span>
        <select style="max-width:60%" .value=${ye(String(this.tlInterval))}
          @change=${e=>{this.tlInterval=Number(e.target.value)||300,this.persistColorOption("tl_interval",String(this.tlInterval)),a()}}>
          ${[[300,"5 min"],[600,"10 min"],[900,"15 min"],[1200,"20 min"],[1800,"30 min"],[3600,"1 hour"],[86400,"1 day"]].map(([e,t])=>V`<option value=${e} ?selected=${e===this.tlInterval}>${ke(t)}</option>`)}
        </select>
      </div>
      ${86400===this.tlInterval?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Capture daily at")}</span>
          <input type="time" style="max-width:60%" .value=${ye(this.tlDailyAt)}
            @change=${e=>{this.tlDailyAt=e.target.value||"00:00",this.persistColorOption("tl_daily_at",this.tlDailyAt),a()}}>
        </div>`:j}`;if(!t)return V`<div style="padding:4px 2px">
        <div class="set-note">${ke("Pick a camera to start this panel's time-lapse.")}</div>
        ${o}${n}</div>`;const r={type:"custom:spider-timelapse-card",panel:this.config.panel,camera:t,title:(this.config.title||"Grow")+" Time-lapse",tl_id:i,interval:this.tlInterval};return 86400===this.tlInterval&&(r.daily_at=this.tlDailyAt),V`<div style="padding:2px">
      ${s?j:V`${o}${n}`}
      <spider-timelapse-card .hass=${this.hass} .config=${r}></spider-timelapse-card>
    </div>`}renderDeviceLog(){const e=this.overviewDevices();if(!e.length)return V`<div class="set-note">${ke("No devices on this controller.")}</div>`;const t=this.accent(),i=(e,i)=>V`<button class="olog-rb ${this.ologRange===e?"on":""}"
      style=${this.ologRange===e?`background:${t};border-color:transparent;color:#fff`:""}
      @click=${()=>{this.ologRange=e,this.persistColorOption("olog_range",String(e))}}>${ke(i)}</button>`;return V`
      <div class="olog-range">${i(1,"1h")}${i(6,"6h")}${i(12,"12h")}${i(24,"24h")}${i(168,"7d")}</div>
      ${e.map(e=>this.dlogRow(e))}
      ${this.ologAxis()}`}dlogRow(e){const t=Date.now(),i=t-3600*this.ologRange*1e3,s=e.id,o=this.ologKey(s);this._olog[o]||this.fetchOlog(s);const a=`${e.domain}:${e.suffix}`,n=this.dlogOpen===a,r="on"===this.get(s)?.state,l=this._olog[o]||[],d=l.length?l[l.length-1].t:null,c=r?ke("On now"):d?ke("Off · {ago}",{ago:this.ologAgo(t-d)}):ke("Off"),h=!!this._ologLoading[o]&&!this._olog[o],p=this.ologSegments(o,i,t);return V`
      <div class="olog-row" role="button" aria-expanded=${n?"true":"false"}
        @click=${()=>{this.dlogOpen=n?null:a}}>
        <div class="olog-nm"><ha-icon icon=${e.icon} style="--mdc-icon-size:15px;margin-right:5px;vertical-align:-3px"></ha-icon>${ke(e.label)}<span class="olog-cur">${c}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${h?V`<span class="olog-load">${ke("Loading…")}</span>`:p.map(e=>V`<span class="olog-seg"
                style="left:${e.left.toFixed(2)}%;width:${Math.max(.4,e.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${n?V`<div class="olog-exp">
        ${(()=>{const e=this.ologEvents(o,t);return e.length?e.map(e=>V`<div class="olog-ev">
              <span><span class=${e.on?"on":"off"}>${e.on?ke("On"):ke("Off")}</span> · ${this.ologTime(e.t)}</span>
              <span class="dur">${null!=e.dur?this.ologDur(e.dur):"—"}</span>
            </div>`):V`<div class="olog-ev" style="color:var(--secondary-text-color)">${ke("No events in this window.")}</div>`})()}
      </div>`:j}`}deviceModeSelectId(e){const t=this.config.panel;return"light"===e.domain?`select.sf_${t}_${e.suffix}_mode`:`select.sf_${t}_${e.suffix}_mode_set`}dlqRead(e){const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,i=t?.[`dlq_${e}`];if(!i)return null;try{const e=JSON.parse(i);return e&&e.mode?e:null}catch{return null}}dlqHas(e){const t=this._dlqMem[e]||this.dlqRead(e);return!(!t||!t.mode||"Manual"===t.mode)}dlqClear(e){delete this._dlqMem[e];const t=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;t&&t[`dlq_${e}`]&&this.persistColorOption(`dlq_${e}`,"")}liveLevelPct(e){const t=this.hass?.states[e];if(!t)return-1;if(e.startsWith("fan."))return Math.round(Number(t.attributes.percentage??0));if(e.startsWith("light.")){const e=t.attributes.brightness;return null!=e?Math.round(Number(e)/255*100):"on"===t.state?100:0}return-1}devPend(e){const t=this._devPend[e];return t&&t.until>Date.now()?{on:t.on}:null}markDevPend(e,t){this._devPend={...this._devPend,[e]:{on:t,until:Date.now()+8e3}},window.setTimeout(()=>{const t=this._devPend[e];if(t&&t.until<=Date.now()){const{[e]:t,...i}=this._devPend;this._devPend=i}},8100)}deviceLiveOn(e){const t=this.config.panel;for(const i of["switch","light","fan"]){const s=this.get(`${i}.sf_${t}_${e}`);if(s)return"on"===s.state}return null}outPend(e){const t=this._outPend[e];return t&&t.until>Date.now()?{on:t.on}:null}markOutPend(e,t){this._outPend={...this._outPend,[e]:{on:t,until:Date.now()+8e3}},window.setTimeout(()=>{const t=this._outPend[e];if(t&&t.until<=Date.now()){const{[e]:t,...i}=this._outPend;this._outPend=i}},8100)}deviceEnabled(e){const t="on"===this.get(e.id)?.state,i="Manual"!==(this.deviceMode(e)||"Manual")&&!!this.get(this.deviceModeSelectId(e));return t||i}quickToggleDevice(e){const t="on"===this.get(e.id)?.state,i=e.domain,s=this.deviceMode(e)||"Manual",o=this.deviceModeSelectId(e),a="Manual"!==s&&!!this.get(o);if(t||a){if(this.deviceQuickRemember&&a){const t={mode:s};this._dlqMem[e.suffix]=t,this.persistColorOption(`dlq_${e.suffix}`,JSON.stringify(t))}this.markDevPend(e.suffix,!1),a?(this.hass?.callService("select","select_option",{entity_id:o,option:"Manual"}),setTimeout(()=>this.hass?.callService(i,"turn_off",{entity_id:e.id}),400)):this.hass?.callService(i,"turn_off",{entity_id:e.id})}else{this.markDevPend(e.suffix,!0);const t=this.deviceQuickRemember?this._dlqMem[e.suffix]||this.dlqRead(e.suffix):null;t&&t.mode&&"Manual"!==t.mode&&this.get(o)?(this.hass?.callService("select","select_option",{entity_id:o,option:t.mode}),this.dlqClear(e.suffix)):this.hass?.callService(i,"turn_on",{entity_id:e.id})}}renderDeviceQuickRow(e=!1){if(!e&&!this.showDeviceQuick)return j;const t=this.overviewDevices();return t.length?V`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>
        <span class="oq-lab-lines"><b>${ke("Quick")}</b><span>${ke("Devices")}</span></span></span>
      ${t.map(e=>{const t=this.dlqHas(e.suffix),i=this.devPend(e.suffix),s=i?i.on:this.deviceEnabled(e);return V`<button class="oq-btn ${t?"on":s?"live":""}"
          title=${ke(e.label)} aria-label=${ke(e.label)}
          @click=${()=>this.quickToggleDevice(e)}>
          <ha-icon icon=${e.icon} style="--mdc-icon-size:14px"></ha-icon>${ke(e.label)}</button>`})}
    </div>`:j}applyWithSaving(e,t){const i=[],s=e=>{e&&this.get(e)&&!i.some(t=>t.id===e)&&i.push({id:e,was:this.get(e)?.state??""})};t&&s(t);for(const e of Object.keys(this.draft)){const t=e.match(/^(?:power|bri|pct):(.+)$/);t?s(t[1]):e.includes(":")||/^(number|text|switch|light|fan)\./.test(e)&&s(e)}e(),this._saving=!0,this._savingAt=Date.now(),this._savingWatch=i,clearTimeout(this._savingT),this._savingT=setTimeout(()=>{this._saving=!1},12e3)}saveBar(e,t,i,s="",o){return at(this.accent(),e,()=>this.applyWithSaving(t,o),i,s,this._saving)}outletSnapshot(e,t){const i=this.get(`select.sf_${e}_outlet_${t}_mode`)?.state||"Manual",s={};for(const o of Ye[i]||[])for(const i of["text","number","select","switch"]){const a=this.get(`${i}.sf_${e}_outlet_${t}_${o}`);if(a){s[o]=a.state;break}}return{mode:i,config:s}}copyOutletTo(e,t,i){const s=this.outletSnapshot(e,t),o="Time Slot"===s.mode?this.outletPeriods(e,t):null;for(const e of i){const t=`select.sf_${e.slot}_outlet_${e.n}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:t,mode:s.mode,config:s.config}),o&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:t,periods:o}),this.olqClear(e.slot,e.n)}}renderOutletCopyPanel(e,t){const i=this.hass?Re(this.hass):[],s=[e,...i.filter(t=>t!==e)].filter((e,t,i)=>i.indexOf(e)===t),o=[];for(const i of s){const s=[];for(const o of this.outletNums(i))i===e&&o===t||s.push({slot:i,n:o,key:this.outletKey(i,o),name:this.outletName(i,o),mode:this.get(`select.sf_${i}_outlet_${o}_mode`)?.state||""});s.length&&o.push({slot:i,current:i===e,label:Ge(this.hass,i)||`${i.toUpperCase()} Power Strip`,items:s})}const a=o.flatMap(e=>e.items),n=a.filter(e=>this.outletCopySel[e.key]),r=this.get(`select.sf_${e}_outlet_${t}_mode`)?.state||"Manual";return V`<div class="oc-panel">
      <div class="oc-title">${ke("Apply {outlet}'s settings",{outlet:this.outletName(e,t)})}
        (<span style="color:${this.accent()}">${ke(r)}</span>${ke(") to:")}</div>
      ${a.length?V`<div class="oc-cols">
        ${o.map(e=>V`<div class="oc-col">
          <div class="oc-colhd">${ke(e.label)}${e.current?V`<span class="oc-cur">${ke("current")}</span>`:j}</div>
          ${e.items.map(e=>V`
            <label class="oc-ck">
              <input type="checkbox" .checked=${!!this.outletCopySel[e.key]}
                @change=${t=>{this.outletCopySel={...this.outletCopySel,[e.key]:t.target.checked}}}>
              <span>${e.name}${e.mode?V` <span class="oc-mode">· ${ke(e.mode)}</span>`:j}</span>
            </label>`)}
        </div>`)}
      </div>`:V`<div class="oc-mode">${ke("No other outlets.")}</div>`}
      <button class="oc-apply" ?disabled=${0===n.length}
        @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(e,t,n.map(e=>({slot:e.slot,n:e.n})))),this.outletCopyOpen=!1,this.outletCopySel={}}}>${ke(1===n.length?"Apply to {n} outlet":"Apply to {n} outlets",{n:n.length})}</button>
    </div>`}renderOutletCopyFromPanel(e,t){const i=this.hass?Re(this.hass):[],s=[e,...i.filter(t=>t!==e)].filter((e,t,i)=>i.indexOf(e)===t),o=[];for(const i of s){const s=[];for(const o of this.outletNums(i))i===e&&o===t||s.push({slot:i,n:o,name:this.outletName(i,o),mode:this.get(`select.sf_${i}_outlet_${o}_mode`)?.state||""});s.length&&o.push({slot:i,current:i===e,label:Ge(this.hass,i)||`${i.toUpperCase()} Power Strip`,items:s})}const a=o.some(e=>e.items.length);return V`<div class="oc-panel">
      <div class="oc-title">${ke("Copy settings into {outlet} from:",{outlet:this.outletName(e,t)})}</div>
      ${a?V`<div class="oc-cols">
        ${o.map(i=>V`<div class="oc-col">
          <div class="oc-colhd">${ke(i.label)}${i.current?V`<span class="oc-cur">${ke("current")}</span>`:j}</div>
          ${i.items.map(i=>V`
            <button class="oc-fromitem"
              @click=${()=>{this.applyWithSaving(()=>this.copyOutletTo(i.slot,i.n,[{slot:e,n:t}])),this.outletCopyFromOpen=!1}}>${i.name}${i.mode?V` <span class="oc-mode">· ${ke(i.mode)}</span>`:j}</button>`)}
        </div>`)}
      </div>`:V`<div class="oc-mode">${ke("No other outlets.")}</div>`}
    </div>`}outletRememberKey(e,t){return`sf-olq-${this.config.panel}-${e}-${t}`}olqRead(e,t){const i=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options,s=i?.[`olq_${e}_${t}`];if(!s)return null;try{const e=JSON.parse(s);return e&&e.mode?e:null}catch{return null}}olqHas(e,t){const i=this._olqMem[this.outletRememberKey(e,t)]||this.olqRead(e,t);return!(!i||!i.mode||"Manual"===i.mode)}olqClear(e,t){delete this._olqMem[this.outletRememberKey(e,t)];const i=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.card_options;i&&i[`olq_${e}_${t}`]&&this.persistColorOption(`olq_${e}_${t}`,"")}quickToggle(e,t){const i=`switch.sf_${e}_outlet_${t}`,s="on"===this.get(i)?.state;if(this.markOutPend(i,!s),!this.outletQuickRemember)return void this.hass?.callService("switch","toggle",{entity_id:i});const o=this.outletRememberKey(e,t);if(s){const s=this.outletSnapshot(e,t);"Time Slot"===s.mode&&(s.periods=this.outletPeriods(e,t)),this._olqMem[o]=s,this.persistColorOption(`olq_${e}_${t}`,JSON.stringify(s)),this.hass?.callService("switch","turn_off",{entity_id:i})}else{const s=this._olqMem[o]||this.olqRead(e,t);if(s&&s.mode&&"Manual"!==s.mode){const i=`select.sf_${e}_outlet_${t}_mode`;this.hass?.callService("sf","set_outlet_config",{entity_id:i,mode:s.mode,config:s.config}),s.periods&&this.hass?.callService("sf","set_outlet_schedule",{entity_id:i,periods:s.periods}),this.olqClear(e,t)}else this.hass?.callService("switch","turn_on",{entity_id:i})}}renderQuickRow(e,t=!1){if(!t&&!this.showOutletQuick)return j;const i=this.outletNums(e);return i.length?V`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>
        <span class="oq-lab-lines"><b>${ke("Quick")}</b><span>${ke("Outlets")}</span></span></span>
      ${i.map(t=>{const i=this.olqHas(e,t),s=`switch.sf_${e}_outlet_${t}`,o=this.outPend(s),a=o?o.on:"on"===this.get(s)?.state,n=i?"on":a?"live":"",r=this.outletQuickNames&&this.customOutletNames?(this.outletNames[`${e}_${t}`]||"").trim():"";return V`<button class="oq-btn ${n}"
          title=${this.outletName(e,t)} aria-label=${this.outletName(e,t)}
          @click=${()=>this.quickToggle(e,t)}>${this.outletQuickNames?V`${r?`${t}-${r}`:String(t)}`:V`<span class="oq-dot"></span>${t}`}</button>`})}
    </div>`:j}outletColorFor(e){switch((e=>"Time Slot"===e||"Cycle"===e?"sched":"Temperature"===e||"Humidity"===e||"CO2"===e||"Light Env"===e?"env":"Drip Irrigation"===e?"drip":"manual")(e)){case"sched":return this.ocSched;case"env":return this.ocEnv;case"drip":return this.ocDrip;default:return this.ocManual}}outletModeDetail(e,t,i){const s=`sf_${e}_outlet_${t}`,o=e=>this.get(e)?.state??"",a=this.dirPick[`${e}_${t}`]||"";if("Light Env"===i){return"Night"===(a||this.outletLightDir[`${e}_${t}`]||"Day")?{text:"Night",cls:"od-night"}:{text:"Day",cls:"od-day"}}if("Temperature"===i){const e=o(`select.${s}_temp_device`)||a;return"Heating"===e?{text:"Heating",cls:"od-heat"}:"Cooling"===e?{text:"Cooling",cls:"od-cool"}:null}if("Humidity"===i){const e=o(`select.${s}_humidity_device`)||a;return"Humidifying"===e?{text:"Humidifying",cls:"od-hum"}:"Dehumidifying"===e?{text:"Dehumidifying",cls:"od-dehum"}:null}if("CO2"===i){const e=o(`select.${s}_co2_device`);return"Aeration"===e?{text:"Aeration",cls:"od-aer"}:"Exhaust"===e?{text:"Exhaust",cls:"od-exh"}:null}if("Time Slot"===i){const i=this.outletPeriods(e,t);if(i.length){const e=i[0],t=`${this.fmtClock(e.start)}–${this.fmtClock(e.end)}`;return{text:i.length>1?`${t} +${i.length-1}`:t,cls:"od-sched"}}const a=o(`text.${s}_ts_start`),n=o(`text.${s}_ts_stop`);return a&&n?{text:`${this.fmtClock(a)}–${this.fmtClock(n)}`,cls:"od-sched"}:null}if("Cycle"===i){const e=e=>{const t=Number(e);return Number.isFinite(t)&&t>=60&&t%60==0?t/60+"h":`${t}m`},t=o(`number.${s}_cycle_run`),i=o(`number.${s}_cycle_off`);if(t&&i){let a=`${e(t)} on · ${e(i)} off`;const n=o(`number.${s}_cycle_times`);n&&Number(n)>1&&(a+=` · ×${Math.round(Number(n))}`);const r=o(`text.${s}_cycle_start`);return r&&"00:00"!==r&&(a+=` @ ${this.fmtClock(r)}`),{text:a,cls:"od-sched"}}return null}return null}outletTile(e,t){const i=`switch.sf_${e}_outlet_${t}`,s=this.outPend(i),o=s?s.on:"on"===this.get(i)?.state,a=this.draftVal(`select.sf_${e}_outlet_${t}_mode`)||"",n=this.outletKey(e,t),r=this.outletOpen===n,l=this.accent(),d=o&&"off"!==this.outletColorMode?this.outletColorFor(a):"",c=d||l;let h="";return d&&"tile"===this.outletColorMode&&(h=`background:${qe(d)};box-shadow:inset 0 0 0 1px ${d}`),r&&(h=`box-shadow:inset 0 0 0 1px ${l}`+(d&&"tile"===this.outletColorMode?`;background:${qe(d)}`:"")),V`
      <div class="tile tile-outlet clickable ${r?"active":""}"
        style=${h||j}
        role="button" aria-expanded=${r?"true":"false"}
        @click=${()=>this.toggleOutlet(r?null:n)}>
        <div class="tile-label" title=${this.outletName(e,t)}>${this.outletName(e,t)}
          <ha-icon class="tile-more"
            icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${o?c:"var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${o?`color:${c}`:j}>${ke(o?"On":"Off")}</div>
        ${o?j:this.cooldownPill(this.outletCooldown(e,t),"cd-outlet")}
        <div class="tile-sub">${ke(a)}</div>
        ${(()=>{const i=this.outletModeDetail(e,t,a);return i?V`<div class="tile-sub2 ${i.cls}">${ke(i.text)}</div>`:j})()}
        ${!o&&this.olqHas(e,t)?V`<div class="tile-qta" style="color:${l}"
          title=${ke("Quick-toggle profile saved — quick-on restores this outlet's mode")}>
          <div class="l1">${ke("Quick Toggle")}</div><div class="l2">${ke("Active")}</div></div>`:j}
      </div>`}clearOutletCfgDraft(e,t){const i=this.outletKey(e,t);if(!(i in this.outletCfgDraft))return;const s={...this.outletCfgDraft};delete s[i],this.outletCfgDraft=s}renderLightEnvConfig(e,t){const i=this.outletKey(e,t),s=this.outletCfgDraft[i]??{},o=s.light_device??this.outletLightDir[i]??"Day",a="light_device"in s&&s.light_device!==(this.outletLightDir[i]??"Day");return V`
      <div class="set-note" style="margin-top:6px">
        ${ke("Follows the environment day/night cycle (from Environment/Planting Plan): on during the selected phase, off in the other. The integration drives it.")}
      </div>
      <div class="dev-row ${a?"staged":""}">
        <span class="dev-lbl">${ke("Follows")}</span>
        <span class="ctl-input">
          <select @change=${e=>this.outletCfgDraft={...this.outletCfgDraft,[i]:{...s,light_device:e.target.value}}}>
            ${["Day","Night"].map(e=>V`<option value=${e} ?selected=${o===e}>${ke(e)}</option>`)}
          </select>
        </span>
      </div>`}renderOutletModeConfig(e,t,i){const s=this.outletKey(e,t),o=this.outletCfgDraft[s]??{},a=(e,t)=>this.outletCfgDraft={...this.outletCfgDraft,[s]:{...o,[e]:t}},n=(e,t,i,s)=>V`
      <div class="dev-row ${t in o?"staged":""}">
        <span class="dev-lbl">${ke(e)}</span>
        <span class="num-box">
          <input type="number" min="0" max="1440" .value=${o[t]??String(i)}
            @change=${e=>a(t,e.target.value)} />
          ${s?V`<span class="unit">${s}</span>`:j}
        </span>
      </div>`,r=(e,t,i)=>V`
      <div class="dev-row ${t in o?"staged":""}">
        <span class="dev-lbl">${ke(e)}</span>
        <span class="ctl-input">
          <select @change=${e=>a(t,e.target.value)}>
            ${i.map(e=>V`<option value=${e}
              ?selected=${(o[t]??i[0])===e}>${ke(e)}</option>`)}
          </select>
        </span>
      </div>`;switch(i){case"Cycle":return V`
        ${l="Start",d="cycle_start",c="12:00",V`
      <div class="dev-row ${d in o?"staged":""}">
        <span class="dev-lbl">${ke(l)}</span>
        <span class="num-box">
          <input type="time" .value=${o[d]??c}
            @change=${e=>a(d,e.target.value)} />
        </span>
      </div>`}
        ${n("Run Duration","cycle_run",60,"min")}
        ${n("Off Duration","cycle_off",60,"min")}
        ${n("Execution Times","cycle_times",1,"")}`;case"Temperature":return r("Device","temp_device",["Heating","Cooling"]);case"Humidity":return r("Device","humidity_device",["Humidifying","Dehumidifying"]);case"CO2":return r("Device","co2_device",["Aeration","Exhaust"]);default:return j}var l,d,c}stDeviceType(e,t){const i=i=>this.get(`select.sf_${e}_outlet_${t}_${i}`)?.state||"",s=this.get(`select.sf_${e}_outlet_${t}_mode`)?.state||"";return"Light Env"===s?"Light Env":s.startsWith("Blower")?"Blower":"Time Slot"===s?"Timer period":"Cycle"===s?"Timer loop":"Temperature"===s?"Cooling"===i("temp_device")?"Cooler":"Heater":"Humidity"===s?"Dehumidifying"===i("humidity_device")?"Dehumidification":"Humidification":"CO2"===s?"Exhaust"===i("co2_device")?"Exhaust fan":"CO2 Injection":"General device"}stBlowerMode(e,t){return"Blower (Humidity Priority)"===this.get(`select.sf_${e}_outlet_${t}_mode`)?.state?"Humidity Priority":"Temperature Priority"}renderStationDeviceType(e,t){const i=this.outletKey(e,t),s=this._stDt[i]??{},o=this.stDeviceType(e,t),a=s.type??o,n=this.stBlowerMode(e,t),r=s.blower??n,l=this.outletLightDir[i]??"Day",d=s.light??l,c=`select.sf_${e}_outlet_${t}_mode`,h=e=>this._stDt={...this._stDt,[i]:{...s,...e}},p=`switch.sf_${e}_outlet_${t}`,u="General device"===a&&p in this.draft&&this.draft[p]!==this.get(p)?.state,g=void 0!==s.type&&s.type!==o||"Blower"===a&&void 0!==s.blower&&s.blower!==n||"Light Env"===a&&void 0!==s.light&&s.light!==l||"Timer loop"===a&&i in this.outletCfgDraft||"Timer period"===a&&i in this.outletDraft||u||this.outletNameDirty(e,t);return V`
      <div class="toggle-row" style="margin-top:4px">
        <span>${ke("Device Type")}</span>
        <select style="max-width:60%"
          @change=${e=>h({type:e.target.value})}>
          ${Xe.map(e=>V`
            <option value=${ke(e.label)} ?selected=${e.label===a}>${ke(e.label)}</option>`)}
        </select>
      </div>
      ${"Blower"===a?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Mode")}</span>
          <select style="max-width:60%"
            @change=${e=>h({blower:e.target.value})}>
            ${Object.keys(et).map(e=>V`
              <option value=${e} ?selected=${e===r}>${ke(e)}</option>`)}
          </select>
        </div>`:j}
      ${"Light Env"===a?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Follows")}</span>
          <select style="max-width:60%"
            @change=${e=>h({light:e.target.value})}>
            ${["Day","Night"].map(e=>V`
              <option value=${e} ?selected=${e===d}>${ke(e)}</option>`)}
          </select>
        </div>
        <div class="set-note" style="margin-top:8px">
          ${ke("Follows the environment day/night cycle (from Environment/Planting Plan): on during the selected phase, off in the other. The integration drives it.")}
        </div>`:j}
      ${"General device"===a?this.stagedCtl(`switch.sf_${e}_outlet_${t}`,"Power"):j}
      ${"Timer period"===a?this.renderOutletSchedule(e,t):j}
      ${"Timer loop"===a?this.renderOutletModeConfig(e,t,"Cycle"):j}
      ${tt.has(a)?V`
        <div class="set-note" style="margin-top:8px">
          ${ke("Runs from your Environment day/night targets (set on the Environment tab). There are no separate on/off thresholds here.")}
        </div>`:j}
      ${this.saveBar(g,()=>{if(this.commitOutletName(e,t),"Light Env"===o&&"Light Env"!==a){this.hass?.callService("sf","set_outlet_env",{entity_id:c,enabled:!1}),this.persistColorOption(`oletdir_${i}`,"");const e={...this.outletLightDir};delete e[i],this.outletLightDir=e}if("Light Env"===a){this.hass?.callService("sf","set_outlet_config",{entity_id:c,mode:"Manual",config:{}}),this.applyOutletEnv(e,t,"Light Env",d),this.outletLightDir={...this.outletLightDir,[i]:d},this.dirPick={...this.dirPick,[i]:d},this.persistColorOption(`oletdir_${i}`,d),this.clearOutletCfgDraft(e,t);const s={...this._stDt};return delete s[i],this._stDt=s,void(this.modePick={...this.modePick,[c]:"Light Env"})}const n=void 0!==s.type&&s.type!==o,l=i in this.outletCfgDraft||i in this.outletDraft;if(n||l||"General device"!==a){const s=Xe.find(e=>e.label===a);let o=s.mode,n={...s.cfg};"Blower"===a&&(o=et[r]||s.mode),"Timer loop"===a&&(n={...n,...this.outletCfgDraft[i]??{}}),this.hass?.callService("sf","set_outlet_config",{entity_id:c,mode:o,config:n}),"Timer period"===a&&this.saveOutlet(e,t),this.modePick={...this.modePick,[c]:o}}if("General device"===a&&p in this.draft){const e=this.draft[p];this.hass?.callService("switch","on"===e?"turn_on":"turn_off",{entity_id:p}),this.markOutPend(p,"on"===e);const t={...this.draft};delete t[p],this.draft=t}this.clearOutletCfgDraft(e,t);const h={...this._stDt};delete h[i],this._stDt=h},()=>{const s={...this._stDt};if(delete s[i],this._stDt=s,this.clearOutletCfgDraft(e,t),this.clearOutletDraft(e,t),this.clearOutletNameDraft(e,t),p in this.draft){const e={...this.draft};delete e[p],this.draft=e}},"apply-bar")}`}renderOutletPop(){const e=this.outletOpen;if(!e)return j;const t=e.lastIndexOf("_");if(t<0)return j;const i=e.slice(0,t),s=Number(e.slice(t+1));if(!i||!Number.isFinite(s))return j;const o=`select.sf_${i}_outlet_${s}_mode`;if(!this.get(o))return j;const a=`switch.sf_${i}_outlet_${s}`,n=this.get(a),r=`sf_${i}_outlet_${s}_`,l=this.draftVal(o)||this.get(o)?.state||"",d="Time Slot"===l,c=new Set((Ye[l]||[]).map(e=>`${r}${e}`)),h=Object.keys(this.hass?.states??{}).filter(e=>{const t=e.split(".")[1]??"";return!!c.has(t)&&(!d||t!==`${r}ts_type`&&t!==`${r}ts_start`&&t!==`${r}ts_stop`)}).sort(),p=this.get(o)?.state||"",u=l!==p&&"Manual"!==l&&!d&&(Ye[l]||[]).length>0&&0===h.length,g=this.outletKey(i,s),m=[...u?[]:[o],...n?[a]:[],...h.filter(e=>/^(switch|number|select|text)\./.test(e))],f=!!this.outletDraft[this.outletKey(i,s)],v=this.outletNameDirty(i,s),b="Light Env"===l&&"light_device"in(this.outletCfgDraft[g]??{})&&this.outletCfgDraft[g].light_device!==(this.outletLightDir[g]??"Day"),_=u||b;return V`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${this.outletName(i,s)}</span>
          <span style="display:inline-flex;align-items:center;gap:8px">
            <button class="oc-copybtn" title=${ke("Copy this outlet's settings to others")}
              @click=${()=>{this.outletCopyOpen=!this.outletCopyOpen,this.outletCopyFromOpen=!1,this.outletCopySel={}}}>
              <ha-icon icon="mdi:content-copy"></ha-icon>${ke("Copy to…")}
            </button>
            <button class="oc-copybtn" title=${ke("Copy another outlet's settings into this one")}
              @click=${()=>{this.outletCopyFromOpen=!this.outletCopyFromOpen,this.outletCopyOpen=!1}}>
              <ha-icon icon="mdi:content-duplicate"></ha-icon>${ke("Copy from…")}
            </button>
            <ha-icon icon="mdi:close" role="button" aria-label=${ke("Close")}
              @click=${()=>this.toggleOutlet(null)}></ha-icon>
          </span>
        </div>
        ${this.outletCopyOpen?this.renderOutletCopyPanel(i,s):j}
        ${this.outletCopyFromOpen?this.renderOutletCopyFromPanel(i,s):j}
        ${this.customOutletNames?V`
          <div class="toggle-row ${this.outletNameDirty(i,s)?"staged":""}">
            <span>${ke("Name")}</span>
            <span class="num-box">
              <input type="text" style="width:140px;text-align:left"
                .value=${this.outletKey(i,s)in this.outletNameDraft?this.outletNameDraft[this.outletKey(i,s)]:this.outletNames[`${i}_${s}`]??""}
                placeholder=${`Outlet ${s}`}
                @input=${e=>this.stageOutletName(i,s,e.target.value)} />
            </span>
          </div>`:j}
        ${i.startsWith("st")?this.renderStationDeviceType(i,s):V`
        ${this.stagedCtl(o,"Mode")}
        ${n&&!u&&"Light Env"!==l?this.stagedCtl(a,"Power"):j}
        ${u?this.renderOutletModeConfig(i,s,l):j}
        ${"Light Env"===l?this.renderLightEnvConfig(i,s):j}
        ${"Light Env"===l?j:h.map(e=>this.stagedCtl(e))}
        ${d?this.renderOutletSchedule(i,s):j}
        ${this.applyBar(m,{extraDirty:f||v||_,onApply:()=>{const e=this.stripIsExternal(i),t="Light Env"===p,a="Light Env"===l,n=a?this.outletCfgDraft[g]?.light_device||this.outletLightDir[g]||"Day":"Humidity"===l?this.outletCfgDraft[g]?.humidity_device||this.draftVal(`select.sf_${i}_outlet_${s}_humidity_device`)||"Humidifying":this.outletCfgDraft[g]?.temp_device||this.draftVal(`select.sf_${i}_outlet_${s}_temp_device`)||"Cooling";if(a)this.applyOutletEnv(i,s,"Light Env",n),this.outletLightDir={...this.outletLightDir,[g]:n},this.dirPick={...this.dirPick,[g]:n},this.persistColorOption(`oletdir_${g}`,n),this.clearOutletCfgDraft(i,s),this.modePick={...this.modePick,[o]:"Light Env"};else{if(t){this.hass?.callService("sf","set_outlet_env",{entity_id:o,enabled:!1}),this.persistColorOption(`oletdir_${g}`,"");const e={...this.outletLightDir};delete e[g],this.outletLightDir=e}else e&&!this.isEnvOutletMode(l)&&this.applyOutletEnv(i,s,l,n);if(this.isEnvOutletMode(l)&&(this.dirPick={...this.dirPick,[g]:n}),u){if(this.hass?.callService("sf","set_outlet_config",{entity_id:o,mode:l,config:this.outletCfgDraft[g]??{}}),this.clearOutletCfgDraft(i,s),o in this.draft){const e={...this.draft};delete e[o],this.draft=e}this.modePick={...this.modePick,[o]:l}}}this.saveOutlet(i,s),this.commitOutletName(i,s),this.olqClear(i,s)},onDiscard:()=>{if(this.clearOutletDraft(i,s),this.clearOutletNameDraft(i,s),this.clearOutletCfgDraft(i,s),o in this.draft){const e={...this.draft};delete e[o],this.draft=e}}})}`}
      </div>`}outletKey(e,t){return`${e}_${t}`}stripIsExternal(e){return e===this.config.panel&&"external"===this.tempSource}isEnvOutletMode(e){return"Temperature"===e||"Humidity"===e||"Light Env"===e}applyOutletEnv(e,t,i,s){const o=this.isEnvOutletMode(i);this.hass?.callService("sf","set_outlet_env",{entity_id:`select.sf_${e}_outlet_${t}_mode`,enabled:o,mode:o?i:"Temperature",direction:s})}outletPeriods(e,t){const i=this.outletDraft[this.outletKey(e,t)];if(i)return i;const s=this.get(`sensor.sf_${e}_outlet_${t}_ts_schedule`)?.attributes.periods;return Array.isArray(s)?s:[]}editOutlet(e,t,i){const s=this.outletKey(e,t),o=this.outletDraft[s]??this.outletPeriods(e,t),a=JSON.parse(JSON.stringify(o));i(a),this.outletDraft={...this.outletDraft,[s]:a}}clearOutletDraft(e,t){const i=this.outletKey(e,t),s={...this.outletDraft};delete s[i],this.outletDraft=s}saveOutlet(e,t){const i=this.outletDraft[this.outletKey(e,t)];i&&(this.hass?.callService("sf","set_outlet_schedule",{entity_id:`select.sf_${e}_outlet_${t}_mode`,periods:i}),this.clearOutletDraft(e,t))}renderOutletSchedule(e,t){const i=this.outletPeriods(e,t),s=this.accent();return V`
      <div class="ts-editor">
        ${i.map((i,o)=>V`
          <div class="period">
            <div class="period-head">
              <span class="period-name">${ke("Slot {n}",{n:o+1})}</span>
              <button class="del" aria-label=${ke("Delete slot")}
                @click=${()=>this.editOutlet(e,t,e=>e.splice(o,1))}>✕</button>
            </div>
            <div class="days">
              ${Ce.map((a,n)=>V`<button
                  class="day ${i.days.includes(n)?"on":""}"
                  style=${i.days.includes(n)?`background:${s};border-color:${s}`:""}
                  @click=${()=>this.editOutlet(e,t,e=>{const t=e[o].days,i=t.indexOf(n);i>=0?t.splice(i,1):t.push(n),t.sort((e,t)=>e-t)})}>${a}</button>`)}
            </div>
            <div class="sched-times">
              <div class="tf">
                <span class="tf-lbl">${ke("Start")}</span>
                <input type="time" .value=${i.start}
                  @change=${i=>this.editOutlet(e,t,e=>{e[o].start=i.target.value})} />
              </div>
              <span class="dash">—</span>
              <div class="tf">
                <span class="tf-lbl">${ke("Stop")}</span>
                <input type="time" .value=${i.end}
                  @change=${i=>this.editOutlet(e,t,e=>{e[o].end=i.target.value})} />
              </div>
            </div>
          </div>`)}
        <div class="sched-actions">
          <button class="add"
            @click=${()=>this.editOutlet(e,t,e=>e.push({days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00"}))}>
            ${ke("+ Add slot")}
          </button>
        </div>
      </div>`}caliSoilSlots(){const e=new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`),t=new Set;for(const i of Object.keys(this.hass?.states??{})){const s=Pe(i).match(e);s&&t.add(s[1])}return[...t].sort((e,t)=>Number(e.replace(/\D/g,""))-Number(t.replace(/\D/g,"")))}probeName(e){const t=this.get(`number.sf_${this.config.panel}_${e}_cal_temp`);let i=t?.attributes.friendly_name??"";const s=Ge(this.hass,this.config.panel);return s&&i.startsWith(s)&&(i=i.slice(s.length).trim()),i=i.replace(/\s*Temp Calibration\s*$/i,"").trim(),i||e.replace(/^soil(\d+)$/,"Soil $1")}renderCali(){const e=this.config.panel,t=[[`number.sf_${e}_cal_air_temp`,"Air Temp"],[`number.sf_${e}_cal_air_humidity`,"Air Humidity"],[`number.sf_${e}_cal_ppfd`,"PPFD"],[`number.sf_${e}_cal_co2`,"CO2"]].map(([e,t])=>this.envControl(e,t)).filter(e=>e!==j),i=this.caliSoilSlots().map(t=>{const i=[this.envControl(`number.sf_${e}_${t}_cal_temp`,"Temp"),this.envControl(`number.sf_${e}_${t}_cal_moisture`,"Moisture"),this.envControl(`number.sf_${e}_${t}_cal_ec`,"EC")].filter(e=>e!==j),s=this.stagedCtl(`select.sf_${e}_${t}_substrate`,"Substrate");return V`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(t)}</span>
          </div>
          <div class="cali-soil-grid">${i}${s!==j?s:j}</div>
        </div>`}),s=this.renderLeafVpdCalibration();return t.length||i.length||s!==j?V`
      ${t.length?V`<div class="section-label">${ke("Air Calibration")}</div>
            <div class="cali-air">${t}</div>`:j}
      ${i.length?V`<div class="section-label">${ke("Soil Calibration")}</div>${i}`:j}
      ${s}
      ${this.renderSensorCleaning()}
      ${this.applyBar(this.caliIds())}`:V`<div class="cali-empty">
        ${ke("No calibration entities yet — they appear once the controller has reported its configuration.")}
      </div>`}alertsSettings(){if(this.alertsDraft)return this.alertsDraft;const e=this.get(`sensor.sf_${this.config.panel}_alarm_settings`)?.attributes.settings;return e&&"object"==typeof e?e:null}editAlert(e){const t=this.alertsDraft??this.alertsSettings()??{},i=JSON.parse(JSON.stringify(t));e(i),this.alertsDraft=i}saveAlerts(){this.alertsDraft&&(this.hass?.callService("sf","set_alarm_settings",{entity_id:`sensor.sf_${this.config.panel}_alarm_settings`,settings:this.alertsDraft}),this.alertsDraft=null)}renderAlerts(){const e=this.alertsSettings();if(!e)return V`<div class="cali-empty">${ke("No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.")}</div>`;const t=null!==this.alertsDraft;return V`
      <div class="alert-note">${ke("Alarm when the reading leaves the set range.")}</div>
      ${this.renderAlertGroup(e,"climate","Climate")}
      ${this.renderAlertGroup(e,"substrate","Substrate")}
      ${this.renderAlertOther(e)}
      ${this.saveBar(t,()=>this.saveAlerts(),()=>this.alertsDraft=null,"apply-bar")}`}renderAlertGroup(e,t,i){const s=e[t]||[];return s.length?V`
      <div class="section-label">${ke(i)}</div>
      ${s.map((e,i)=>this.renderAlertMetric(t,i,e))}`:j}tempUnit(){return this.hass?.config?.unit_system?.temperature||"°F"}isCelsius(){return this.tempUnit().includes("C")}tempThresholdOpts(){const e=this.isCelsius();return this.offOpts(e?15:59,e?50:122,1,e=>`${e}${this.tempUnit()}`)}alertBounds(e){switch(e){case"temp":case"tempSoil":return this.isCelsius()?[0,50]:[32,122];case"humi":case"humiSoil":default:return[0,100];case"vpd":return[0,6];case"co2":return[0,5e3];case"ppfd":return[0,4e3];case"ECSoil":return[0,10]}}renderAlertMetric(e,t,i){const s=this.accent(),[o,a]=this.alertBounds(i.key),n=Number(i.step??1)||1,r="ppfd"===i.key?Math.max(o,a-100):a,l=(s,l)=>{const d=this.numOpts(o,"min"===l?r:a,n);return V`
      <label class="av">
        <span class="av-lbl">${ke(s)}</span>
        <span class="num-box">
          <select @change=${i=>this.editAlert(s=>{s[e][t][l]=Number(i.target.value)})}>
            ${d.map(e=>V`
              <option value=${e.value} .selected=${String(e.value)===String(i[l]??"")}>${ke(e.label)}</option>`)}
          </select>
          <span class="unit">${i.unit??""}</span>
        </span>
      </label>`};return V`
      <div class="alert-row ${i.enabled?"":"off"}">
        <div class="alert-head">
          <span class="alert-name">${ke(i.label)} <span class="unit">${i.unit??""}</span></span>
          <button class="toggle ${i.enabled?"on":""}"
            style=${i.enabled?`background:${s}`:""}
            @click=${()=>this.editAlert(i=>{const s=i[e][t];s.enabled=s.enabled?0:1})}
            aria-label=${ke("Toggle {name} alarm",{name:ke(i.label)})}></button>
        </div>
        <div class="alert-vals">
          ${"range"===i.kind?l("Min","min"):j}
          ${l("Max","max")}
        </div>
      </div>`}renderAlertOther(e){const t=e.other||[];if(!t.length)return j;const i=this.accent();return V`
      <div class="section-label">${ke("Other Device")}</div>
      ${t.map((e,t)=>V`<div class="alert-bool">
          <span class="alert-name">${ke(e.label)}</span>
          <button class="toggle ${e.enabled?"on":""}"
            style=${e.enabled?`background:${i}`:""}
            @click=${()=>this.editAlert(e=>{const i=e.other[t];i.enabled=i.enabled?0:1})}
            aria-label=${ke("Toggle {name} alarm",{name:ke(e.label)})}></button>
        </div>`)}`}alarmSources(){const e=[],t=t=>{const i=this.get(`sensor.sf_${t}_alarms`);i&&e.push({slot:t,ent:i,name:Ge(this.hass,t)||t})};this.config.panel&&t(this.config.panel);for(const e of this.outletSlots())e!==this.config.panel&&t(e);return e}logToday(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}renderLog(){const e=this.alarmSources(),t=this.logDate||this.logToday(),i=this.logDev||"all",s=this.logType||"all";let o=[];for(const t of e){if("all"!==i&&i!==t.slot)continue;const e=t.ent.attributes.events;Array.isArray(e)&&e.forEach(e=>o.push({...e,_src:t.name}))}const a=[...new Set(o.map(e=>e.device).filter(Boolean))].sort(),n=new Date(`${t}T00:00:00`).getTime()/1e3,r=new Date(`${t}T23:59:59.999`).getTime()/1e3,l=new Set;return o=o.filter(e=>(e.epoch||0)>=n&&(e.epoch||0)<=r&&("all"===s||e.device===s)).sort((e,t)=>(t.epoch||0)-(e.epoch||0)).filter(e=>{const t=`${e.epoch}|${e._src}|${e.device||`Device ${e.devType}`}|${e.alarm||""}|${e.alarmType||0}`;return!l.has(t)&&(l.add(t),!0)}).slice(0,50),V`
      <div class="log-filters">
        ${e.length>1?V`<div class="ctl">
              <div class="ctl-label">${ke("Device")}</div>
              <div class="ctl-input">
                <select @change=${e=>{this.logDev=e.target.value}}>
                  <option value="all" ?selected=${"all"===i}>${ke("All")}</option>
                  ${e.map(e=>V`
                    <option value=${e.slot} ?selected=${i===e.slot}>${ke(e.name)}</option>`)}
                </select>
              </div>
            </div>`:j}
        <div class="ctl">
          <div class="ctl-label">${ke("Type")}</div>
          <div class="ctl-input">
            <select @change=${e=>{this.logType=e.target.value}}>
              <option value="all" ?selected=${"all"===s}>${ke("All")}</option>
              ${a.map(e=>V`
                <option value=${e} ?selected=${s===e}>${ke(e)}</option>`)}
            </select>
          </div>
        </div>
        <div class="ctl">
          <div class="ctl-label">${ke("Date")}</div>
          <div class="ctl-input">
            <input type="date" .value=${t} @change=${e=>{this.logDate=e.target.value||null}} />
          </div>
        </div>
      </div>
      ${o.length?V`
            <div class="log-count">${o.length} ${1===o.length?"entry":"entries"}${o.length>10?ke(" — scroll for more"):""}</div>
            <div class="log-list">
              ${o.map(t=>V`
                <div class="log-row ${t.alarmType?"raise":"restore"}">
                  <div class="log-title">${e.length>1&&"all"===i?`${t._src} `:""}${t.device||`Device ${t.devType}`} ${t.alarm||""}</div>
                  <div class="log-time">${t.epoch?(e=>{try{return new Date(1e3*e).toLocaleString(void 0,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return""}})(t.epoch):t.time||""}</div>
                </div>`)}
            </div>`:V`<div class="cali-empty">${ke("No log entries on this date.")}</div>`}`}render(){if(Se(this.hass),!this.hass||!this.config)return j;this._used=new Set;const e=this.hasOutlets(),t=this.outletOnly(),i=!!this.get(this.eid("number","env_temp_day")),s=`sf_${this.config.panel}_`,o=!!this.get(this.eid("number","cal_air_temp"))||Object.keys(this.hass.states).some(e=>e.includes(s)&&/_cal_(temp|moisture|ec)$/.test(e)),a=i,n=o,r=!t,l=this.showVpd&&!t,d=!t,c=t?"outlets":"overview";let h=this.tab;!t||"overview"!==h&&"alerts"!==h&&"vpd"!==h||(h="outlets"),"env"!==h||a||(h=c),"cali"!==h||n||(h=c),"outlets"!==h||e||(h="overview"),"olog"!==h||e&&this.showOutletsLog||(h="overview"),"vpd"!==h||l||(h=c),"dlog"!==h||this.showDeviceLog&&this.overviewDevices().length>0||(h=c),"tlapse"!==h||this.showTimelapseTab||(h=c);const p=!this.hideTabs,u=this.accent(),g=(e,t)=>V`<button class="tab ${h===e?"active":""}"
        style=${h===e?`color:${u};border-color:${u}`:""}
        @click=${()=>this.tab=e}>${ke(t)}</button>`,m=Ge(this.hass,this.config.panel),f=[this.taTiles?"":"ta-x-t",this.taDevices?"":"ta-x-d",this.taOutlets?"":"ta-x-o"].filter(Boolean).join(" ");return V`
      <ha-card class=${f||j} style=${this.layoutStyle()||j}>
        <div class="header">
          <span class="title" style="cursor:pointer" title=${ke(p?"Hide the tabs":"Show the tabs")} @click=${()=>this.toggleTabs()}>${this.config.title||ke("Spider Farmer")}</span>
          ${m?V`<span class="device">${m}</span>`:j}
          ${this.renderConn()}
        </div>
        ${p?V`<div class="tabs">
              ${d?g("overview","Overview"):j}
              ${a?g("env","Environment"):j}
              ${e?g("outlets","Outlets"):j}
              ${e&&this.showOutletsLog?g("olog","Outlets Log"):j}
              ${this.showDeviceLog&&this.overviewDevices().length>0?g("dlog","Device Log"):j}
              ${this.showTimelapseTab?g("tlapse","Time-lapse"):j}
              ${l?g("vpd","VPD"):j}
              ${n?g("cali","Calibration"):j}
              ${r?g("alerts","Alerts"):j}
              ${g("log","Log")}
              ${g("settings","Settings")}
            </div>`:j}
        ${"env"===h?this.renderEnv():"outlets"===h?this.renderOutlets():"olog"===h?this.renderOutletsLog():"dlog"===h?this.renderDeviceLog():"tlapse"===h?this.renderTimelapseTab():"vpd"===h?this.renderVpdTab():"cali"===h?this.renderCali():"alerts"===h?this.renderAlerts():"log"===h?this.renderLog():"settings"===h?this.renderSettings():this.renderOverview()}
      </ha-card>`}setLeafSpot(e,t){const i=[...this.leafSpots];i[e]=parseFloat(t),this.leafSpots=i}renderLeafVpdCalibration(){if(!this.showLeafVpd)return j;const e=this.eid("number","leaf_offset"),t=this.get(e);if(!t)return j;const i=t.attributes.unit_of_measurement||"°",s=this.get(this.eid("sensor","temperature")),o=s&&Number.isFinite(+s.state)?+s.state:null;if(5!==this.leafSpots.length){const e=o??0;this.leafSpots=Array(5).fill(Math.round(10*e)/10)}const a=this.leafSpots,n=a.filter(e=>Number.isFinite(e)),r=n.length?n.reduce((e,t)=>e+t,0)/n.length:null,l=null!=r&&null!=o?r-o:null,d=e in this.draft,c=t=>this.stage(e,String(Math.round(10*t)/10)),h=this.eid("number","leaf_offset_night"),p=!!this.get(h),u=h in this.draft,g=e=>this.stage(h,String(Math.round(10*e)/10)),m=this.accent(),f=p?this.leafCalTarget:"day";return V`
      <div class="section-label" style="margin-top:16px">${ke("Leaf VPD")}</div>
      <div class="set-note">
        ${ke("VPD referenced to the leaf surface, which runs cooler than the air. Under the light leaves transpire and sit well below air; lights-off they settle near air temp — so set a Day and Night offset. Calibrate the day value from measurements if you like, then Apply.")}
      </div>
      <div class="toggle-row ${d?"staged":""}">
        <span>${ke("Leaf offset (day)")}</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(e)}
            @change=${e=>{const t=parseFloat(e.target.value);Number.isFinite(t)&&c(t)}} />
          <span class="unit">${i}</span>
        </span>
      </div>
      ${p?V`
      <div class="toggle-row ${u?"staged":""}">
        <span>${ke("Leaf offset (night)")}</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(h)}
            @change=${e=>{const t=parseFloat(e.target.value);Number.isFinite(t)&&g(t)}} />
          <span class="unit">${i}</span>
        </span>
      </div>`:j}
      <details class="leaf-cal">
        <summary>${ke("Calibrate from 5 readings")}</summary>
        <div class="set-note">
          ${ke("Point an IR thermometer at 5 leaf spots and enter each. The average becomes leaf temp; the implied offset (leaf − air) fills the offset you pick below — Apply to save it. Measure under the light for Day, lights-off for Night.")}
        </div>
        ${p?V`
        <div class="seg-row" style="grid-template-columns:repeat(2,1fr);margin-bottom:8px">
          <button class="seg ${"day"===f?"on":""}"
            style=${"day"===f?`border-color:${m};color:${m}`:j}
            @click=${()=>{this.leafCalTarget="day"}}>
            <ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>${ke("Day")}</span>
          </button>
          <button class="seg ${"night"===f?"on":""}"
            style=${"night"===f?`border-color:${m};color:${m}`:j}
            @click=${()=>{this.leafCalTarget="night"}}>
            <ha-icon icon="mdi:weather-night"></ha-icon><span>${ke("Night")}</span>
          </button>
        </div>`:j}
        <div class="leaf-spots">
          ${a.map((e,t)=>V`<input type="number" step="0.1"
            .value=${Number.isFinite(e)?String(e):""}
            @input=${e=>this.setLeafSpot(t,e.target.value)} />`)}
        </div>
        <div class="leaf-cal-foot">
          <span>
            ${ke("Avg {value}",{value:null!=r?r.toFixed(1)+i:"—"})}
            · offset ${null!=l?(e=>(e>=0?"+":"")+e.toFixed(1))(l)+i:"—"}
          </span>
          <button class="leaf-apply" ?disabled=${null==l}
            @click=${()=>null!=l&&(e=>"night"===f?g(e):c(e))(l)}>
            ${ke("night"===f?"Use for night":"Use for day")}</button>
        </div>
      </details>`}_sensorOptions(e){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("sensor.")&&!t.includes("sf_")&&this.hass.states[t].attributes?.device_class===e).map(e=>({id:e,name:this.hass.states[e].attributes?.friendly_name||e})).sort((e,t)=>e.name.localeCompare(t.name)):[]}_commitTempSource(e){const t=e.tsSource??this.tempSource,i=e.tsTemp??this.extTemp,s=e.tsHumi??this.extHumi;if(t===this.tempSource&&i===this.extTemp&&s===this.extHumi)return;const o=this.get(`switch.sf_${this.config.panel}_indicator_light`)?`switch.sf_${this.config.panel}_indicator_light`:`switch.sf_${this.config.panel}_outlet_1`;this.tempSource=t,this.extTemp=i,this.extHumi=s,this.hass?.callService("sf","set_strip_sensor",{entity_id:o,source:t,temp_entity:"external"===t?i:"",humi_entity:"external"===t?s:""})}renderTempSource(e,t){if(!/^(ac|st)\d/.test(this.config.panel||""))return j;const i=this.accent(),s=e?.tsSource??this.tempSource,o=e?.tsTemp??this.extTemp,a=e?.tsHumi??this.extHumi,n=(e,o)=>V`
      <button class="seg ${s===e?"on":""}"
        style=${s===e?`border-color:${i};color:${i}`:j}
        @click=${()=>t({tsSource:e})}>${ke(o)}</button>`,r=(e,i,s,o)=>V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke(o)}</span>
        <select style="max-width:60%"
          @change=${e=>t({[s]:e.target.value})}>
          <option value="" ?selected=${!e}>${ke("— choose —")}</option>
          ${this._sensorOptions(i).map(t=>V`
            <option value=${t.id} ?selected=${t.id===e}>${ke(t.name)}</option>`)}
          ${e&&!this._sensorOptions(i).some(t=>t.id===e)?V`<option value=${e} selected>${e}</option>`:j}
        </select>
      </div>`;return V`
      <div class="section-label set-collapse-h"
        @click=${()=>this._tsOpen=!this._tsOpen}>
        <span>${ke("Temperature source")}</span>
        <ha-icon icon=${this._tsOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._tsOpen?V`
      <div class="set-note">
        ${ke("This strip has no Spider Farmer air sensor. Use a 3rd-party Home Assistant temperature/humidity sensor as its reference — the readings appear on the card (and as")} <code>sensor.sf_${this.config.panel}_temperature</code> /
        <code>_humidity</code>${ke(") so you can drive the outlets from your own automations.")}
      </div>
      <div class="set-note" style="font-weight:700;color:var(--warning-color,#ff9800);margin-top:6px">
        ${ke("⚠ Important: while a 3rd-party (External) sensor is in use, control this device from Home Assistant only — you CANNOT use the Spider Farmer app. The app has no access to your 3rd-party sensor and will fight the integration's control.")}
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        ${n("sf","SF sensor")}
        ${n("external","External sensor")}
      </div>
      ${"external"===s?V`
        ${r(o,"temperature","tsTemp","Temperature entity")}
        ${r(a,"humidity","tsHumi","Humidity entity")}
      `:j}`:j}`}_commitSmartControl(e){const t=e.sc;if(!t)return;if(JSON.stringify(t)===JSON.stringify(this.smart||{}))return;const i=this.config.panel,s=this.get(`switch.sf_${i}_dehumidifier`)?`switch.sf_${i}_dehumidifier`:`switch.sf_${i}_indicator_light`,{enabled:o,...a}=t;this.smart={...t},this.hass?.callService("sf","set_smart_control",{entity_id:s,enabled:!!o,settings:a})}renderSmartControl(e,t){const i=this.config.panel;if(!this.get(`switch.sf_${i}_dehumidifier`))return j;const s=this.accent(),o={...this.smart||{},...e?.sc??{}},a=e=>t({sc:{...o,...e}}),n=!!o.enabled,r=(e,t)=>Number.isFinite(Number(e))?Number(e):t,l=(e,t,i,s=1)=>V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke(e)}</span>
        <input type="number" style="max-width:90px" step=${s}
          .value=${String(r(o[t],i))}
          @change=${e=>a({[t]:Number(e.target.value)})} />
      </div>`,d=(e,t,i)=>V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke(e)} <span style="color:var(--secondary-text-color)">${ke("(min)")}</span></span>
        <input type="number" style="max-width:90px" step="0.5" min="0"
          .value=${String(Math.round(r(o[t],i)/60*10)/10)}
          @change=${e=>a({[t]:Math.round(60*Number(e.target.value))})} />
      </div>`;return V`
      <div class="section-label set-collapse-h"
        @click=${()=>this._smartOpen=!this._smartOpen}>
        <span>${ke("Smart control")}</span>
        <ha-icon icon=${this._smartOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._smartOpen?V`
      <div class="set-note" style="color:var(--warning-color,#ff9800)">
        ${ke("⚠ When enabled, the integration drives the dehumidifier itself (full Manual) to hold your humidity target — this overrides Spider Farmer's own automation. It runs continuously in Home Assistant (works with no dashboard open). On an HA restart the gear holds its last state until HA is back.")}
      </div>
      <div class="toggle-row">
        <span>${ke("Enable smart humidity control")}</span>
        <button class="toggle ${n?"on":""}"
          style=${n?`background:${s}`:j}
          @click=${()=>a({enabled:!n})}></button>
      </div>
      ${n?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Humidity sensor")}</span>
          <select style="max-width:60%"
            @change=${e=>a({humidity:e.target.value})}>
            <option value="" ?selected=${!o.humidity}>${ke("Strip sensor (default)")}</option>
            ${this._sensorOptions("humidity").map(e=>V`
              <option value=${e.id} ?selected=${e.id===o.humidity}>${ke(e.name)}</option>`)}
            ${o.humidity&&!this._sensorOptions("humidity").some(e=>e.id===o.humidity)?V`<option value=${o.humidity} selected>${o.humidity}</option>`:j}
          </select>
        </div>
        ${l("Target humidity %","target",55)}
        ${l("Deadband % (turn on above target+this)","deadband",5)}
        ${d("Escalate to High after","escalate_after_s",300)}
        ${l("…if RH hasn't dropped this %","escalate_drop",1,.5)}
        ${l("Ease back to Low within % of target","ease_band",3)}
        ${d("Minimum on time","min_on_s",120)}
        ${d("Minimum off time","min_off_s",120)}
      `:j}`:j}`}setHead(e,t,i){return V`
      <div class="section-label set-collapse-h" style="margin-top:16px" @click=${i}>
        <span>${ke(t)}</span>
        <ha-icon icon=${e?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>`}renderSettings(){const e=this.accent(),t=this.colorDraft,i=t?.mode??this.colorMode,s=t?.modeIn??this.colorModeIn,o=t?.hi??this.colHi,a=t?.lo??this.colLo,n=t?.in??this.colIn,r=t?.warn??this.colWarn,l=t?.showTrend??this.showTrend,d=t?.showBand??this.showBand,c=t?.showTargets??this.showTargets,h=t?.tileSummary??this.tileSummary,p=t?.hour12??this.hour12,u=t?.showConn??this.showConn,g=t?.connCustom??this.connCustom,m=t?.connSignal??this.connSignal,f=t?.showOutletsLog??this.showOutletsLog,v=t?.showOutletQuick??this.showOutletQuick,b=t?.outletQuickRemember??this.outletQuickRemember,_=t?.outletQuickNames??this.outletQuickNames,y=t?.showVpd??this.showVpd,$=t?.vpdLeaf??this.vpdLeaf,x=t?.showLeafVpd??this.showLeafVpd,w=t?.showDeviceLog??this.showDeviceLog,S=t?.hideTabs??this.hideTabs,k=t?.soilMode??this.soilMode,O=t?.soilKeep??this.soilKeep,D=t?.showTimelapseTab??this.showTimelapseTab,T=t?.showDeviceQuick??this.showDeviceQuick,C=t?.deviceQuickRemember??this.deviceQuickRemember,M=t?.customNames??this.customOutletNames,P=t?.customLayout??this.customLayout,A=t?.scale??this.cardScale,L=t?.cols??this.tileCols,E=t?.layoutMode??this.layoutMode,N=t?.unifiedDeviceQuick??this.unifiedDeviceQuick,F=t?.unifiedOutletQuick??this.unifiedOutletQuick,z=t?.tileRadius??this.tileRadius,R=t?.tileBorderW??this.tileBorderW,B=t?.tileBorderCol??this.tileBorderCol,H=t?.tileBg??this.tileBg,I=t?.taTiles??this.taTiles,G=t?.taDevices??this.taDevices,W=t?.taOutlets??this.taOutlets,Q=t?.cdShow??this.cooldownShow,K=t?.cdDevice??this.cooldownDevice,q=t?.cdOutlet??this.cooldownOutlet,U=t?.cdSecs??this.cooldownSecs,Z=t?.ovOutlets??this.outletsOnOverview,J=t?.ovQuick??this.outletQuickOverview,Y=t?.hideEnergy??this.hideEnergyTile,X=!!this.get(this.eid("light","light_2")),ee=this.outletOnly(),te=t?.omode??this.outletColorMode,ie=t?.ocManual??this.ocManual,se=t?.ocSched??this.ocSched,oe=t?.ocEnv??this.ocEnv,ae=t?.ocDrip??this.ocDrip,ne=this.hasOutlets(),re=t?.dmode??this.deviceColorMode,le=t?.dcManual??this.dcManual,de=t?.dcSched??this.dcSched,ce=t?.dcAuto??this.dcAuto,he=this.overviewDevices().length>0,pe=!!t&&(void 0!==t.mode&&t.mode!==this.colorMode||void 0!==t.modeIn&&t.modeIn!==this.colorModeIn||void 0!==t.source&&t.source!==this.colorSource||void 0!==t.warn&&t.warn!==this.colWarn||void 0!==t.showTrend&&t.showTrend!==this.showTrend||void 0!==t.showBand&&t.showBand!==this.showBand||void 0!==t.showTargets&&t.showTargets!==this.showTargets||void 0!==t.tileSummary&&t.tileSummary!==this.tileSummary||void 0!==t.hour12&&t.hour12!==this.hour12||void 0!==t.showConn&&t.showConn!==this.showConn||void 0!==t.connCustom&&t.connCustom!==this.connCustom||void 0!==t.connSignal&&t.connSignal!==this.connSignal||void 0!==t.showOutletsLog&&t.showOutletsLog!==this.showOutletsLog||void 0!==t.showOutletQuick&&t.showOutletQuick!==this.showOutletQuick||void 0!==t.outletQuickRemember&&t.outletQuickRemember!==this.outletQuickRemember||void 0!==t.outletQuickNames&&t.outletQuickNames!==this.outletQuickNames||void 0!==t.showVpd&&t.showVpd!==this.showVpd||void 0!==t.showLeafVpd&&t.showLeafVpd!==this.showLeafVpd||void 0!==t.showDeviceLog&&t.showDeviceLog!==this.showDeviceLog||void 0!==t.hideTabs&&t.hideTabs!==this.hideTabs||void 0!==t.soilMode&&t.soilMode!==this.soilMode||void 0!==t.soilKeep&&t.soilKeep!==this.soilKeep||void 0!==t.showTimelapseTab&&t.showTimelapseTab!==this.showTimelapseTab||void 0!==t.showDeviceQuick&&t.showDeviceQuick!==this.showDeviceQuick||void 0!==t.deviceQuickRemember&&t.deviceQuickRemember!==this.deviceQuickRemember||void 0!==t.vpdLeaf&&t.vpdLeaf!==this.vpdLeaf||void 0!==t.hi&&t.hi!==this.colHi||void 0!==t.lo&&t.lo!==this.colLo||void 0!==t.in&&t.in!==this.colIn||void 0!==t.hide2&&t.hide2!==this.hideLight2||void 0!==t.customNames&&t.customNames!==this.customOutletNames||void 0!==t.customLayout&&t.customLayout!==this.customLayout||void 0!==t.scale&&t.scale!==this.cardScale||void 0!==t.cols&&t.cols!==this.tileCols||void 0!==t.layoutMode&&t.layoutMode!==this.layoutMode||void 0!==t.unifiedDeviceQuick&&t.unifiedDeviceQuick!==this.unifiedDeviceQuick||void 0!==t.unifiedOutletQuick&&t.unifiedOutletQuick!==this.unifiedOutletQuick||void 0!==t.omode&&t.omode!==this.outletColorMode||void 0!==t.ocManual&&t.ocManual!==this.ocManual||void 0!==t.ocSched&&t.ocSched!==this.ocSched||void 0!==t.ocEnv&&t.ocEnv!==this.ocEnv||void 0!==t.ocDrip&&t.ocDrip!==this.ocDrip||void 0!==t.dmode&&t.dmode!==this.deviceColorMode||void 0!==t.dcManual&&t.dcManual!==this.dcManual||void 0!==t.dcSched&&t.dcSched!==this.dcSched||void 0!==t.dcAuto&&t.dcAuto!==this.dcAuto||void 0!==t.tileRadius&&t.tileRadius!==this.tileRadius||void 0!==t.tileBorderW&&t.tileBorderW!==this.tileBorderW||void 0!==t.tileBorderCol&&t.tileBorderCol!==this.tileBorderCol||void 0!==t.tileBg&&t.tileBg!==this.tileBg||void 0!==t.taTiles&&t.taTiles!==this.taTiles||void 0!==t.taDevices&&t.taDevices!==this.taDevices||void 0!==t.taOutlets&&t.taOutlets!==this.taOutlets||void 0!==t.cdShow&&t.cdShow!==this.cooldownShow||void 0!==t.cdDevice&&t.cdDevice!==this.cooldownDevice||void 0!==t.cdOutlet&&t.cdOutlet!==this.cooldownOutlet||void 0!==t.cdSecs&&t.cdSecs!==this.cooldownSecs||void 0!==t.ovOutlets&&t.ovOutlets!==this.outletsOnOverview||void 0!==t.ovQuick&&t.ovQuick!==this.outletQuickOverview||void 0!==t.hideEnergy&&t.hideEnergy!==this.hideEnergyTile||void 0!==t.tsSource&&t.tsSource!==this.tempSource||void 0!==t.tsTemp&&t.tsTemp!==this.extTemp||void 0!==t.tsHumi&&t.tsHumi!==this.extHumi||void 0!==t.sc&&JSON.stringify(t.sc)!==JSON.stringify(this.smart||{})),ue=e=>this.colorDraft={...this.colorDraft??{},...e},ge=(t,i,s,o,a)=>V`
      <button class="seg ${t===i?"on":""}"
        style=${t===i?`border-color:${e};color:${e}`:j}
        @click=${a}>
        <ha-icon icon=${o}></ha-icon><span>${ke(s)}</span>
      </button>`,me=t?.source??this.colorSource,fe=(t,i,s)=>V`
      <button class="seg ${me===t?"on":""}"
        style=${me===t?`border-color:${e};color:${e}`:j}
        @click=${()=>ue({source:t})}>
        <ha-icon icon=${s}></ha-icon><span>${ke(i)}</span>
      </button>`,ve=(e,t,i)=>V`
      <label class="color-field">
        <span>${ke(e)}</span>
        <input class="pinwheel" type="color" .value=${t}
          @input=${e=>i(e.target.value)} />
      </label>`,be=this.renderTempSource(t,ue),_e=this.renderSmartControl(t,ue),ye=V`
      <div class="section-label set-collapse-h"
        @click=${()=>this._colorOpen=!this._colorOpen}>
        <span>${ke("Colours & tile appearance")}</span>
        <ha-icon icon=${this._colorOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._colorOpen?V`
      ${ee?j:V`
      <div class="section-label">${ke("Colour by")}</div>
      <div class="set-note">
        ${ke("What drives the tile highlight —")}
        <span style="color:${this.accent()}">${ke("Alarms")}</span> ${ke("(the controller's alarm limits on the Alerts tab),")}
        <span style="color:${this.accent()}">${ke("Targets")}</span> ${ke("(the environment day/night target ± dead zone), or")}
        <span style="color:${this.accent()}">${ke("Both")}</span> ${ke("(an active alarm wins; targets colour everything else). Targets add a small “target …” line to Temp / Humidity / CO2 tiles.")}
      </div>
      <div class="seg-row">
        ${fe("alarms","Alarms","mdi:bell-outline")}
        ${fe("targets","Targets","mdi:target")}
        ${fe("both","Both","mdi:set-center")}
      </div>

      <div class="section-label" style="margin-top:16px">${ke("Out-of-range highlight")}</div>
      <div class="set-note">
        ${ke("Colour an Overview reading when it crosses its alarm limits —")}
        <span style="color:${o}">${ke("above max")}</span>,
        <span style="color:${a}">${ke("below min")}</span>${ke(". Saved to the controller, so it sticks across upgrades and your other devices.")}
      </div>
      <div class="seg-row">
        ${ge(i,"off","No color","mdi:circle-off-outline",()=>ue({mode:"off"}))}
        ${ge(i,"tile","Tile color","mdi:square-rounded",()=>ue({mode:"tile"}))}
        ${ge(i,"text","Text color","mdi:format-color-text",()=>ue({mode:"text"}))}
      </div>
      <div class="color-row">
        ${ve("Above max",o,e=>ue({hi:e}))}
        ${ve("Below min",a,e=>ue({lo:e}))}
        ${ve("Near edge",r,e=>ue({warn:e}))}
      </div>

      <div class="section-label" style="margin-top:16px">${ke("In-range highlight")}</div>
      <div class="set-note">
        ${ke("Colour a reading that's")} <span style="color:${n}">${ke("within")}</span> ${ke("its limits. Applies to every reading; off by default.")}
      </div>
      <div class="seg-row">
        ${ge(s,"off","No color","mdi:circle-off-outline",()=>ue({modeIn:"off"}))}
        ${ge(s,"tile","Tile color","mdi:square-rounded",()=>ue({modeIn:"tile"}))}
        ${ge(s,"text","Text color","mdi:format-color-text",()=>ue({modeIn:"text"}))}
      </div>
      <div class="color-row">
        ${ve("In range",n,e=>ue({in:e}))}
      </div>
      `}

      ${X?V`
            <div class="section-label" style="margin-top:16px">${ke("Devices")}</div>
            <div class="set-note">
              ${ke("A phantom Light 2 or Fan tile? Manage per-device accessories in the integration: Settings → Devices & services → Spider Farmer Bridge → Configure → “Device accessories”. HA then skips the entity entirely.")}
            </div>`:j}

      ${ne?V`
            <div class="section-label" style="margin-top:16px">${ke("Outlet active color")}</div>
            <div class="set-note">
              ${ke("Colour an outlet tile while it's on, by its mode —")}
              <span style="color:${ie}">${ke("Manual")}</span>,
              <span style="color:${se}">${ke("Scheduled")}</span>,
              <span style="color:${oe}">${ke("Environment")}</span>,
              <span style="color:${ae}">${ke("Drip")}</span>${ke(". Off outlets stay neutral.")}
            </div>
            <div class="seg-row">
              ${ge(te,"off","No color","mdi:circle-off-outline",()=>ue({omode:"off"}))}
              ${ge(te,"tile","Tile color","mdi:square-rounded",()=>ue({omode:"tile"}))}
              ${ge(te,"text","Text color","mdi:format-color-text",()=>ue({omode:"text"}))}
            </div>
            <div class="color-row">
              ${ve("Manual",ie,e=>ue({ocManual:e}))}
              ${ve("Scheduled",se,e=>ue({ocSched:e}))}
            </div>
            <div class="color-row">
              ${ve("Environment",oe,e=>ue({ocEnv:e}))}
              ${ve("Drip",ae,e=>ue({ocDrip:e}))}
            </div>`:j}

      ${he?V`
            <div class="section-label" style="margin-top:16px">${ke("Device active color")}</div>
            <div class="set-note">
              ${ke("Colour a device tile while it's on, by its mode —")}
              <span style="color:${le}">${ke("Manual")}</span>,
              <span style="color:${de}">${ke("Scheduled")}</span>,
              <span style="color:${ce}">${ke("Auto")}</span> ${ke("(Environment / PPFD). A")}
              <span style="color:${Ke}">${ke("fault")}</span> ${ke("always overrides.")}
            </div>
            <div class="seg-row">
              ${ge(re,"off","No color","mdi:circle-off-outline",()=>ue({dmode:"off"}))}
              ${ge(re,"tile","Tile color","mdi:square-rounded",()=>ue({dmode:"tile"}))}
              ${ge(re,"text","Text color","mdi:format-color-text",()=>ue({dmode:"text"}))}
            </div>
            <div class="color-row">
              ${ve("Manual",le,e=>ue({dcManual:e}))}
              ${ve("Scheduled",de,e=>ue({dcSched:e}))}
              ${ve("Auto",ce,e=>ue({dcAuto:e}))}
            </div>`:j}

      <div class="section-label" style="margin-top:16px">${ke("Tile appearance")}</div>
      <div class="set-note">${ke("Edges, border, and background for every tile.")}</div>
      <div class="set-note" style="margin-top:6px;display:flex;justify-content:space-between">
        <span>${ke("Corner radius")}</span><span style="color:${e};font-weight:500">${z}px</span>
      </div>
      <input type="range" min="0" max="20" step="1" .value=${String(z)} style="width:100%"
        @input=${e=>ue({tileRadius:Number(e.target.value)})} />
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>${ke("Border width")}</span><span style="color:${e};font-weight:500">${R}px</span>
      </div>
      <input type="range" min="0" max="4" step="1" .value=${String(R)} style="width:100%"
        @input=${e=>ue({tileBorderW:Number(e.target.value)})} />
      <div class="color-row" style="margin-top:8px">
        ${ve("Border",B||e,e=>ue({tileBorderCol:e}))}
        ${ve("Background",H||"#1e1e1e",e=>ue({tileBg:e}))}
      </div>
      <div class="ta-preview"
        style="border-radius:${z}px;border:${R}px solid ${B||"transparent"};background:${H||"var(--secondary-background-color)"}">
        <span style="color:${H?"#fff":"var(--secondary-text-color)"}">${ke("Heater")}</span>
        <b style="color:${H?"#fff":"var(--primary-text-color)"}">L4</b>
        <span style="font-size:10px;color:var(--secondary-text-color)">${ke("preview")}</span>
      </div>
      <div class="toggle-row" style="margin-top:6px">
        <span style="font-size:13px;color:var(--secondary-text-color)">${ke("Reset background & border to theme")}</span>
        <button class="olog-rb" @click=${()=>ue({tileBg:"",tileBorderCol:"",tileBorderW:1})}>${ke("Reset")}</button>
      </div>
      <div class="set-note" style="margin-top:12px">${ke("Apply appearance to")}</div>
      <div class="toggle-row">
        <span>${ke("Sensor tiles")}</span>
        <button class="toggle ${I?"on":""}"
          style=${I?`background:${e}`:j}
          @click=${()=>ue({taTiles:!I})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Device tiles")}</span>
        <button class="toggle ${G?"on":""}"
          style=${G?`background:${e}`:j}
          @click=${()=>ue({taDevices:!G})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Outlet tiles")}</span>
        <button class="toggle ${W?"on":""}"
          style=${W?`background:${e}`:j}
          @click=${()=>ue({taOutlets:!W})}></button>
      </div>
      `:j}`,$e=this.hasDehumidifier()?V`
      <div class="section-label set-collapse-h" style="margin-top:16px"
        @click=${()=>this._cdOpen=!this._cdOpen}>
        <span>${ke("Dehumidifier cooldown timer")}</span>
        <ha-icon icon=${this._cdOpen?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </div>
      ${this._cdOpen?V`
      <div class="set-note">
        ${ke("Many dehumidifiers enforce a compressor lockout after switching off — they can't restart until it elapses, even when SF or the integration calls for them. Show a live countdown so you always know when it can come back on.")}
      </div>
      <div class="toggle-row">
        <span>${ke("Show cooldown timer")}</span>
        <button class="toggle ${Q?"on":""}"
          style=${Q?`background:${e}`:j}
          @click=${()=>ue({cdShow:!Q})}></button>
      </div>
      ${Q?V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("On device tile")}</span>
        <button class="toggle ${K?"on":""}"
          style=${K?`background:${e}`:j}
          @click=${()=>ue({cdDevice:!K})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("On outlet tiles")}</span>
        <button class="toggle ${q?"on":""}"
          style=${q?`background:${e}`:j}
          @click=${()=>ue({cdOutlet:!q})}></button>
      </div>
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>${ke("Cooldown length")}</span>
        <span style="color:${e};font-weight:500">${(U/60).toFixed(1).replace(/\.0$/,"")} min</span>
      </div>
      <input type="range" min="30" max="900" step="30" .value=${String(U)} style="width:100%"
        @input=${e=>ue({cdSecs:Number(e.target.value)})} />
      `:j}
      `:j}
      `:j,xe=this.hasOutlets()?V`
      ${this.setHead(this._setOverviewOpen,"Overview",()=>this._setOverviewOpen=!this._setOverviewOpen)}
      ${this._setOverviewOpen?V`
      <div class="set-note">
        ${ke("Show everything in one view: append the outlet tiles to the Overview tab, at the bottom under Devices.")}
      </div>
      <div class="toggle-row">
        <span>${ke("Show outlets on Overview")}</span>
        <button class="toggle ${Z?"on":""}"
          style=${Z?`background:${e}`:j}
          @click=${()=>ue({ovOutlets:!Z})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show quick-toggle row on Overview")}</span>
        <button class="toggle ${J?"on":""}"
          style=${J?`background:${e}`:j}
          @click=${()=>ue({ovQuick:!J})}></button>
      </div>
      ${this.get(`sensor.sf_${this.config.panel}_power`)?V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Hide Energy Usage tile")}</span>
        <button class="toggle ${Y?"on":""}"
          style=${Y?`background:${e}`:j}
          @click=${()=>ue({hideEnergy:!Y})}></button>
      </div>`:j}`:j}`:j,we=V`
      ${this.setHead(this._setExtrasOpen,"Tile extras",()=>this._setExtrasOpen=!this._setExtrasOpen)}
      ${this._setExtrasOpen?V`
      <div class="set-note">
        ${ke("Shown on every Overview tile, independent of the colour mode. Tap any tile to open its history graph (6h–7d, selectable).")}
      </div>
      ${ee?j:V`
      <div class="toggle-row">
        <span>${ke("Target / range line")}</span>
        <button class="toggle ${c?"on":""}"
          style=${c?`background:${e}`:j}
          @click=${()=>ue({showTargets:!c})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Trend arrows")}</span>
        <button class="toggle ${l?"on":""}"
          style=${l?`background:${e}`:j}
          @click=${()=>ue({showTrend:!l})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Dead-zone band")}</span>
        <button class="toggle ${d?"on":""}"
          style=${d?`background:${e}`:j}
          @click=${()=>ue({showBand:!d})}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Device mode summary")}</span>
        <button class="toggle ${h?"on":""}"
          style=${h?`background:${e}`:j}
          @click=${()=>ue({tileSummary:!h})}></button>
      </div>
      <div class="set-note">
        ${ke("On each device tile (Blower, Fan, Heater, Humidifier, Dehumidifier, Lights), show a small line with its mode and key settings — so you can read it without opening the tile.")}
      </div>`}
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("12-hour time (AM/PM)")}</span>
        <button class="toggle ${p?"on":""}"
          style=${p?`background:${e}`:j}
          @click=${()=>ue({hour12:!p})}></button>
      </div>
      <div class="set-note">
        ${ke("Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.")}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Hide the tab bar")}</span>
        <button class="toggle ${S?"on":""}"
          style=${S?`background:${e}`:j}
          @click=${()=>ue({hideTabs:!S})}></button>
      </div>
      <div class="set-note">
        ${ke("Collapse the row of tabs for a compact card. Tap the card title (its name in the header) to show or hide the tabs again at any time.")}
      </div>`:j}`,Se=V`
      ${this.setHead(this._setConnOpen,"Header connection info",()=>this._setConnOpen=!this._setConnOpen)}
      ${this._setConnOpen?V`
      <div class="set-note">
        ${ke("Show the controller's online status + Wi-Fi signal bars in the top-right of the header. Signal comes from the controller's own Wi-Fi — no extra entities are created.")}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show connection info")}</span>
        <button class="toggle ${u?"on":""}"
          style=${u?`background:${e}`:j}
          @click=${()=>ue({showConn:!u})}></button>
      </div>
      ${u?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Use a custom signal source")}</span>
          <button class="toggle ${g?"on":""}"
            style=${g?`background:${e}`:j}
            @click=${()=>ue({connCustom:!g})}></button>
        </div>
        <div class="set-note">
          ${ke("Point the signal bars at a different entity — e.g. the controller is on another AP or hard-wired, and its dBm is reported by your router/AP integration instead of the bundled Wi-Fi AP.")}
        </div>
        ${g?V`
          <div class="toggle-row" style="margin-top:6px">
            <span>${ke("Signal entity")}</span>
            <select style="max-width:60%"
              @change=${e=>ue({connSignal:e.target.value})}>
              <option value="" ?selected=${!m}>${ke("— none —")}</option>
              ${this.signalEntityOptions().map(e=>V`
                <option value=${e.id} ?selected=${m===e.id}>${ke(e.name)}</option>`)}
            </select>
          </div>`:j}
      `:j}`:j}`,Oe=ee?j:V`
      ${this.setHead(this._setVpdOpen,"VPD graph",()=>this._setVpdOpen=!this._setVpdOpen)}
      ${this._setVpdOpen?V`
      <div class="set-note">
        ${ke('Adds a "VPD" tab with a vibrant temperature × humidity phase chart (grid or trend) plus growth-stage targets. Uses this panel\'s air temp + humidity — no extra entities.')}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show Leaf VPD tile")}</span>
        <button class="toggle ${x?"on":""}"
          style=${x?`background:${e}`:j}
          @click=${()=>ue({showLeafVpd:!x})}></button>
      </div>
      <div class="set-note">${ke("Off hides the Leaf VPD tile and its target settings.")}</div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Enable VPD graph")}</span>
        <button class="toggle ${y?"on":""}"
          style=${y?`background:${e}`:j}
          @click=${()=>ue({showVpd:!y})}></button>
      </div>
      ${y?V`
        <div class="toggle-row" style="margin-top:8px">
          <span>${ke("Enable Leaf VPD")}</span>
          <button class="toggle ${$?"on":""}"
            style=${$?`background:${e}`:j}
            @click=${()=>ue({vpdLeaf:!$})}></button>
        </div>
        <div class="set-note">
          ${ke("Also plots leaf VPD (from the leaf-VPD sensor) alongside air VPD on the tab.")}
        </div>`:j}`:j}`,De=he?V`
      ${this.setHead(this._setDevOpen,"Devices",()=>this._setDevOpen=!this._setDevOpen)}
      ${this._setDevOpen?V`
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show Device Log tab")}</span>
        <button class="toggle ${w?"on":""}"
          style=${w?`background:${e}`:j}
          @click=${()=>ue({showDeviceLog:!w})}></button>
      </div>
      <div class="set-note">
        ${ke('Adds a "Device Log" tab with a 24h/7d on-off timeline per device (lights, fan, blower, heater, humidifier, dehumidifier) from Home Assistant\'s recorder history. Tap a row for its recent events.')}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show Time-lapse tab")}</span>
        <button class="toggle ${D?"on":""}"
          style=${D?`background:${e}`:j}
          @click=${()=>ue({showTimelapseTab:!D})}></button>
      </div>
      <div class="set-note">
        ${ke('Adds a "Time-lapse" tab to this panel\'s card for a grow time-lapse. Pick its camera in the tab; it reuses the Spider Time-lapse card (frames, scrub/play, MP4 export, env overlay).')}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Quick-toggle devices row")}</span>
        <button class="toggle ${T?"on":""}"
          style=${T?`background:${e}`:j}
          @click=${()=>ue({showDeviceQuick:!T})}></button>
      </div>
      <div class="set-note">
        ${ke("Shows a compact row of icon buttons above the device tiles for fast on/off toggling.")}
      </div>
      ${T?V`
        <div class="toggle-row" style="margin-top:6px">
          <span>${ke("Remember device settings on toggle")}</span>
          <button class="toggle ${C?"on":""}"
            style=${C?`background:${e}`:j}
            @click=${()=>ue({deviceQuickRemember:!C})}></button>
        </div>
        <div class="set-note">
          ${ke("On quick-off, remember the device's mode; on quick-on, re-select it so the controller re-applies that mode's settings (instead of a bare manual on). Saved on the controller, so it syncs across your devices.")}
        </div>`:j}
      `:j}`:j,Te=ne?V`
      ${this.setHead(this._setOutletOpen,"Outlets",()=>this._setOutletOpen=!this._setOutletOpen)}
      ${this._setOutletOpen?V`
      <div class="toggle-row" style="margin-top:12px">
        <span>${ke("Custom outlet names")}</span>
        <button class="toggle ${M?"on":""}"
          style=${M?`background:${e}`:j}
          @click=${()=>ue({customNames:!M})}></button>
      </div>
      <div class="set-note">
        ${ke('Give each outlet its own name (e.g. "Exhaust Fan", "Veg Light"), shown in the Outlets tab in place of "Outlet 1/2/…". Edit each name on its outlet after enabling. Saved to the controller, so it sticks across upgrades and your other devices.')}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Show Outlets Log tab")}</span>
        <button class="toggle ${f?"on":""}"
          style=${f?`background:${e}`:j}
          @click=${()=>ue({showOutletsLog:!f})}></button>
      </div>
      <div class="set-note">
        ${ke('Adds an "Outlets Log" tab with a 24h/7d on-off timeline per outlet (from Home Assistant\'s recorder history). Tap a row to see its recent switch events.')}
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>${ke("Quick-toggle outlets row")}</span>
        <button class="toggle ${v?"on":""}"
          style=${v?`background:${e}`:j}
          @click=${()=>ue({showOutletQuick:!v})}></button>
      </div>
      <div class="set-note">
        ${ke("Shows a compact row of numbered on/off buttons above the outlet tiles for fast toggling.")}
      </div>
      ${v?V`
        <div class="toggle-row" style="margin-top:6px">
          <span>${ke("Show outlet names on quick buttons")}</span>
          <button class="toggle ${_?"on":""}"
            style=${_?`background:${e}`:j}
            @click=${()=>ue({outletQuickNames:!_})}></button>
        </div>
        <div class="set-note">
          ${ke('On: buttons show the outlet number + name (e.g. "4-Heater"), or just the number for unnamed outlets. Off: a status dot + number.')}
        </div>
        <div class="toggle-row" style="margin-top:6px">
          <span>${ke("Remember outlet settings on toggle")}</span>
          <button class="toggle ${b?"on":""}"
            style=${b?`background:${e}`:j}
            @click=${()=>ue({outletQuickRemember:!b})}></button>
        </div>
        <div class="set-note">
          ${ke("On: quick-on restores the outlet's last mode/config (saved when you quick-off it). Off: plain on/off — a bare toggle reverts the outlet to Manual, like the device does.")}
        </div>`:j}`:j}`:j,Ce=V`
      ${this.setHead(this._setLayoutOpen,"Layout",()=>this._setLayoutOpen=!this._setLayoutOpen)}
      ${this._setLayoutOpen?V`
      <div class="set-note">
        ${ke("Resize the whole card and choose how many tiles sit per row. Saved to the controller, so it sticks across upgrades and your other devices.")}
      </div>
      <div class="toggle-row">
        <span>${ke("Custom layout")}</span>
        <button class="toggle ${P?"on":""}"
          style=${P?`background:${e}`:j}
          @click=${()=>ue({customLayout:!P})}></button>
      </div>
      ${P?V`
        <div class="set-note" style="margin-top:10px;display:flex;justify-content:space-between">
          <span>${ke("Scale")}</span><span style="color:${e};font-weight:500">${A}%</span>
        </div>
        <input type="range" min="70" max="150" step="5" .value=${String(A)}
          style="width:100%"
          @input=${e=>ue({scale:Number(e.target.value)})} />
        <div class="set-note" style="margin-top:10px">${ke("Tiles per row")}</div>
        <div class="seg-row" style="grid-template-columns:repeat(4,1fr)">
          ${[2,3,4,5].map(t=>V`
            <button class="seg ${L===t?"on":""}"
              style=${L===t?`border-color:${e};color:${e}`:j}
              @click=${()=>ue({cols:t})}><span>${t}</span></button>`)}
        </div>
        ${this.outletOnly()?j:V`
        <div class="toggle-row" style="margin-top:12px">
          <span>${ke("Free-move panel")}</span>
          <button class="toggle ${"unified"===E?"on":""}"
            style=${"unified"===E?`background:${e}`:j}
            @click=${()=>ue({layoutMode:"unified"===E?"sections":"unified"})}></button>
        </div>
        <div class="set-note" style="margin-top:2px;opacity:.8">
          ${ke("On: all tiles — sensors, energy, devices, outlets — merge into one grid with no section headings, so any tile can go anywhere. Off: tiles reorder within their own section (sensors, devices, outlets stay grouped).")}
        </div>
        ${"unified"===E&&(this.overviewDevices().length||this.hasOutlets())?V`
        ${this.overviewDevices().length?V`
        <div class="toggle-row" style="margin-top:10px">
          <span>${ke("Show device quick row")}</span>
          <button class="toggle ${N?"on":""}"
            style=${N?`background:${e}`:j}
            @click=${()=>ue({unifiedDeviceQuick:!N})}></button>
        </div>`:j}
        ${this.hasOutlets()?V`
        <div class="toggle-row" style="margin-top:6px">
          <span>${ke("Show outlet quick row")}</span>
          <button class="toggle ${F?"on":""}"
            style=${F?`background:${e}`:j}
            @click=${()=>ue({unifiedOutletQuick:!F})}></button>
        </div>`:j}
        <div class="set-note" style="margin-top:2px;opacity:.8">
          ${ke("Adds the quick-toggle row(s) as full-width bars in the panel — draggable in Rearrange like any tile.")}
        </div>`:j}
        <div class="section-label" style="margin-top:16px">${ke("Rearrange tiles")}</div>
        <div class="set-note" style="margin-top:2px;opacity:.8">
          ${ke("Drag Overview tiles to reorder them and close gaps, or tap a tile's eye icon to hide it. Opens Overview in rearrange mode; changes save on Apply.")}
        </div>
        <button class="seg" style="margin-top:8px;width:auto;padding:7px 12px"
          @click=${()=>this.enterReorder()}>
          <ha-icon icon="mdi:drag-variant" style="--mdc-icon-size:18px"></ha-icon>
          <span style="margin-left:6px">${ke("Rearrange / Hide Tiles")}</span>
        </button>`}`:j}`:j}`,Me=this.soilProbeSlots().length>0?V`
      ${this.setHead(this._setSoilOpen,"Soil sensors",()=>this._setSoilOpen=!this._setSoilOpen)}
      ${this._setSoilOpen?V`
      <div class="set-note">
        ${ke("How the soil probes appear on Overview.")} <b>${ke("Averaged")}</b> ${ke("keeps one tile per metric (averaged across probes).")} <b>${ke("Per sensor")}</b> ${ke("shows one tile per probe with Temp, Moisture and EC on it, tap for its graph.")} <b>${ke("Split")}</b> ${ke("gives each probe three separate tiles.")}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        ${[["avg","Averaged"],["sensor","Per sensor"],["split","Split (3 tiles)"]].map(([t,i])=>V`
          <button class="seg ${k===t?"on":""}"
            style=${k===t?`border-color:${e};color:${e}`:j}
            @click=${()=>ue({soilMode:t})}>${ke(i)}</button>`)}
      </div>
      ${"avg"!==k?V`
        <div class="toggle-row" style="margin-top:12px"><span>${ke("Averaged tiles & stats")}</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
          ${[["replace","Replace"],["keep","Keep"],["stats","Stats only"]].map(([t,i])=>V`
            <button class="seg ${O===t?"on":""}"
              style=${O===t?`border-color:${e};color:${e}`:j}
              @click=${()=>ue({soilKeep:t})}>${ke(i)}</button>`)}
        </div>
        <div class="set-note">
          <b>${ke("Replace")}</b>${ke(": show only the per-sensor tiles.")} <b>${ke("Keep")}</b>${ke(": also keep the averaged tiles and All Soil Stats.")} <b>${ke("Stats only")}</b>${ke(": keep just the All Soil Stats summary tile above the per-sensor tiles.")}
        </div>`:j}`:j}`:j;return V`
      ${[{label:"Colours & tile appearance",tpl:ye},{label:"Dehumidifier cooldown timer",tpl:$e},{label:"Devices",tpl:De},{label:"Header connection info",tpl:Se},{label:"Layout",tpl:Ce},{label:"Outlets",tpl:Te},{label:"Overview",tpl:xe},{label:"Smart control",tpl:_e},{label:"Soil sensors",tpl:Me},{label:"Temperature source",tpl:be},{label:"Tile extras",tpl:we},{label:"VPD graph",tpl:Oe}].sort((e,t)=>e.label.localeCompare(t.label)).map(e=>e.tpl)}
      ${this.saveBar(pe,()=>{const e=this.colorDraft;e&&(void 0!==e.mode&&e.mode!==this.colorMode&&(this.colorMode=e.mode,this.persistColorOption("colors",e.mode)),void 0!==e.modeIn&&e.modeIn!==this.colorModeIn&&(this.colorModeIn=e.modeIn,this.persistColorOption("colors_in",e.modeIn)),void 0!==e.source&&e.source!==this.colorSource&&(this.colorSource=e.source,this.persistColorOption("color_source",e.source)),void 0!==e.warn&&e.warn!==this.colWarn&&(this.colWarn=e.warn,this.persistColorOption("color_warn",e.warn)),void 0!==e.showTrend&&e.showTrend!==this.showTrend&&(this.showTrend=e.showTrend,this.persistColorOption("show_trend",e.showTrend?"1":"0")),void 0!==e.showBand&&e.showBand!==this.showBand&&(this.showBand=e.showBand,this.persistColorOption("show_band",e.showBand?"1":"0")),void 0!==e.showTargets&&e.showTargets!==this.showTargets&&(this.showTargets=e.showTargets,this.persistColorOption("show_targets",e.showTargets?"1":"0")),void 0!==e.tileSummary&&e.tileSummary!==this.tileSummary&&(this.tileSummary=e.tileSummary,this.persistColorOption("tile_summary",e.tileSummary?"1":"0")),void 0!==e.showConn&&e.showConn!==this.showConn&&(this.showConn=e.showConn,this.persistColorOption("show_conn",e.showConn?"1":"0")),void 0!==e.connCustom&&e.connCustom!==this.connCustom&&(this.connCustom=e.connCustom,this.persistColorOption("conn_custom",e.connCustom?"1":"0")),void 0!==e.connSignal&&e.connSignal!==this.connSignal&&(this.connSignal=e.connSignal,this.persistColorOption("conn_signal",e.connSignal)),void 0!==e.showOutletsLog&&e.showOutletsLog!==this.showOutletsLog&&(this.showOutletsLog=e.showOutletsLog,this.persistColorOption("outlets_log",e.showOutletsLog?"1":"0")),void 0!==e.showOutletQuick&&e.showOutletQuick!==this.showOutletQuick&&(this.showOutletQuick=e.showOutletQuick,this.persistColorOption("outlet_quick",e.showOutletQuick?"1":"0")),void 0!==e.outletQuickRemember&&e.outletQuickRemember!==this.outletQuickRemember&&(this.outletQuickRemember=e.outletQuickRemember,this.persistColorOption("outlet_quick_remember",e.outletQuickRemember?"1":"0")),void 0!==e.outletQuickNames&&e.outletQuickNames!==this.outletQuickNames&&(this.outletQuickNames=e.outletQuickNames,this.persistColorOption("outlet_quick_names",e.outletQuickNames?"1":"0")),void 0!==e.showVpd&&e.showVpd!==this.showVpd&&(this.showVpd=e.showVpd,this.persistColorOption("vpd_graph",e.showVpd?"1":"0")),void 0!==e.vpdLeaf&&e.vpdLeaf!==this.vpdLeaf&&(this.vpdLeaf=e.vpdLeaf,this.persistColorOption("vpd_leaf",e.vpdLeaf?"1":"0")),void 0!==e.showLeafVpd&&e.showLeafVpd!==this.showLeafVpd&&(this.showLeafVpd=e.showLeafVpd,this.persistColorOption("leaf_vpd_tile",e.showLeafVpd?"1":"0")),void 0!==e.showDeviceLog&&e.showDeviceLog!==this.showDeviceLog&&(this.showDeviceLog=e.showDeviceLog,this.persistColorOption("device_log",e.showDeviceLog?"1":"0")),void 0!==e.hideTabs&&e.hideTabs!==this.hideTabs&&(this.hideTabs=e.hideTabs,this.persistColorOption("hide_tabs",e.hideTabs?"1":"0")),void 0!==e.soilMode&&e.soilMode!==this.soilMode&&(this.soilMode=e.soilMode,this.persistColorOption("soil_mode",e.soilMode)),void 0!==e.soilKeep&&e.soilKeep!==this.soilKeep&&(this.soilKeep=e.soilKeep,this.persistColorOption("soil_keep",e.soilKeep)),void 0!==e.showTimelapseTab&&e.showTimelapseTab!==this.showTimelapseTab&&(this.showTimelapseTab=e.showTimelapseTab,this.persistColorOption("timelapse_tab",e.showTimelapseTab?"1":"0")),void 0!==e.showDeviceQuick&&e.showDeviceQuick!==this.showDeviceQuick&&(this.showDeviceQuick=e.showDeviceQuick,this.persistColorOption("device_quick",e.showDeviceQuick?"1":"0")),void 0!==e.deviceQuickRemember&&e.deviceQuickRemember!==this.deviceQuickRemember&&(this.deviceQuickRemember=e.deviceQuickRemember,this.persistColorOption("device_quick_remember",e.deviceQuickRemember?"1":"0")),void 0!==e.hour12&&e.hour12!==this.hour12&&(this.hour12=e.hour12,this.persistColorOption("time_12h",e.hour12?"1":"0")),void 0!==e.hi&&e.hi!==this.colHi&&(this.colHi=e.hi,this.persistColorOption("color_hi",e.hi)),void 0!==e.lo&&e.lo!==this.colLo&&(this.colLo=e.lo,this.persistColorOption("color_lo",e.lo)),void 0!==e.in&&e.in!==this.colIn&&(this.colIn=e.in,this.persistColorOption("color_in",e.in)),void 0!==e.hide2&&e.hide2!==this.hideLight2&&(this.hideLight2=e.hide2,this.persistColorOption("hide_light2",e.hide2?"1":"0")),void 0!==e.customNames&&e.customNames!==this.customOutletNames&&(this.customOutletNames=e.customNames,this.persistColorOption("custom_outlet_names",e.customNames?"1":"0")),void 0!==e.customLayout&&e.customLayout!==this.customLayout&&(this.customLayout=e.customLayout,this.persistColorOption("custom_layout",e.customLayout?"1":"0")),void 0!==e.scale&&e.scale!==this.cardScale&&(this.cardScale=e.scale,this.persistColorOption("card_scale",String(e.scale))),void 0!==e.cols&&e.cols!==this.tileCols&&(this.tileCols=e.cols,this.persistColorOption("tile_cols",String(e.cols))),void 0!==e.layoutMode&&e.layoutMode!==this.layoutMode&&(this.layoutMode=e.layoutMode,this.persistColorOption("layout_mode",e.layoutMode)),void 0!==e.unifiedDeviceQuick&&e.unifiedDeviceQuick!==this.unifiedDeviceQuick&&(this.unifiedDeviceQuick=e.unifiedDeviceQuick,this.persistColorOption("unified_dev_quick",e.unifiedDeviceQuick?"1":"0")),void 0!==e.unifiedOutletQuick&&e.unifiedOutletQuick!==this.unifiedOutletQuick&&(this.unifiedOutletQuick=e.unifiedOutletQuick,this.persistColorOption("unified_outlet_quick",e.unifiedOutletQuick?"1":"0")),void 0!==e.tileRadius&&e.tileRadius!==this.tileRadius&&(this.tileRadius=e.tileRadius,this.persistColorOption("tile_radius",String(e.tileRadius))),void 0!==e.tileBorderW&&e.tileBorderW!==this.tileBorderW&&(this.tileBorderW=e.tileBorderW,this.persistColorOption("tile_border_w",String(e.tileBorderW))),void 0!==e.tileBorderCol&&e.tileBorderCol!==this.tileBorderCol&&(this.tileBorderCol=e.tileBorderCol,this.persistColorOption("tile_border_col",e.tileBorderCol)),void 0!==e.tileBg&&e.tileBg!==this.tileBg&&(this.tileBg=e.tileBg,this.persistColorOption("tile_bg",e.tileBg)),void 0!==e.taTiles&&e.taTiles!==this.taTiles&&(this.taTiles=e.taTiles,this.persistColorOption("ta_tiles",e.taTiles?"1":"0")),void 0!==e.taDevices&&e.taDevices!==this.taDevices&&(this.taDevices=e.taDevices,this.persistColorOption("ta_devices",e.taDevices?"1":"0")),void 0!==e.taOutlets&&e.taOutlets!==this.taOutlets&&(this.taOutlets=e.taOutlets,this.persistColorOption("ta_outlets",e.taOutlets?"1":"0")),void 0!==e.cdShow&&e.cdShow!==this.cooldownShow&&(this.cooldownShow=e.cdShow,this.persistColorOption("cooldown_show",e.cdShow?"1":"0")),void 0!==e.cdDevice&&e.cdDevice!==this.cooldownDevice&&(this.cooldownDevice=e.cdDevice,this.persistColorOption("cooldown_device",e.cdDevice?"1":"0")),void 0!==e.cdOutlet&&e.cdOutlet!==this.cooldownOutlet&&(this.cooldownOutlet=e.cdOutlet,this.persistColorOption("cooldown_outlet",e.cdOutlet?"1":"0")),void 0!==e.cdSecs&&e.cdSecs!==this.cooldownSecs&&(this.cooldownSecs=e.cdSecs,this.persistColorOption("cooldown_secs",String(e.cdSecs))),void 0!==e.ovOutlets&&e.ovOutlets!==this.outletsOnOverview&&(this.outletsOnOverview=e.ovOutlets,this.persistColorOption("overview_outlets",e.ovOutlets?"1":"0")),void 0!==e.ovQuick&&e.ovQuick!==this.outletQuickOverview&&(this.outletQuickOverview=e.ovQuick,this.persistColorOption("overview_quick",e.ovQuick?"1":"0")),void 0!==e.hideEnergy&&e.hideEnergy!==this.hideEnergyTile&&(this.hideEnergyTile=e.hideEnergy,this.persistColorOption("hide_energy_tile",e.hideEnergy?"1":"0")),void 0!==e.omode&&e.omode!==this.outletColorMode&&(this.outletColorMode=e.omode,this.persistColorOption("outlet_colors",e.omode)),void 0!==e.ocManual&&e.ocManual!==this.ocManual&&(this.ocManual=e.ocManual,this.persistColorOption("oc_manual",e.ocManual)),void 0!==e.ocSched&&e.ocSched!==this.ocSched&&(this.ocSched=e.ocSched,this.persistColorOption("oc_sched",e.ocSched)),void 0!==e.ocEnv&&e.ocEnv!==this.ocEnv&&(this.ocEnv=e.ocEnv,this.persistColorOption("oc_env",e.ocEnv)),void 0!==e.ocDrip&&e.ocDrip!==this.ocDrip&&(this.ocDrip=e.ocDrip,this.persistColorOption("oc_drip",e.ocDrip)),void 0!==e.dmode&&e.dmode!==this.deviceColorMode&&(this.deviceColorMode=e.dmode,this.persistColorOption("device_colors",e.dmode)),void 0!==e.dcManual&&e.dcManual!==this.dcManual&&(this.dcManual=e.dcManual,this.persistColorOption("dc_manual",e.dcManual)),void 0!==e.dcSched&&e.dcSched!==this.dcSched&&(this.dcSched=e.dcSched,this.persistColorOption("dc_sched",e.dcSched)),void 0!==e.dcAuto&&e.dcAuto!==this.dcAuto&&(this.dcAuto=e.dcAuto,this.persistColorOption("dc_auto",e.dcAuto)),this._commitTempSource(e),this._commitSmartControl(e),this._colorSynced=!0,this.cacheColors()),this.colorDraft=null},()=>this.colorDraft=null,"apply-bar")}`}}ct.POWER_METRICS=[{key:"power",label:"Watts"},{key:"voltage",label:"Volts"},{key:"current",label:"Amps"},{key:"energy",label:"kWh"}],ct.SOIL_METRICS=[{key:"temperature",short:"Temp",icon:"mdi:thermometer",ck:"tempSoil"},{key:"moisture",short:"Moisture",icon:"mdi:water",ck:"humiSoil"},{key:"ec",short:"EC",icon:"mdi:flash",ck:"ECSoil"}],ct.PLAN_PRESETS=[{key:"seedling",label:"Seedling cultivation",emoji:"🌱",tC:22.78,tCn:22.78,tDz:2.78,hd:75,hn:75,hDz:10,cd:600,cn:400,cDz:200,ppfd:200,on:"05:00",off:"23:00",fade:30},{key:"clone",label:"Cloning and seedling",emoji:"🌿",tC:23.89,tCn:22.22,tDz:2.78,hd:75,hn:75,hDz:10,cd:400,cn:400,cDz:100,ppfd:150,on:"05:00",off:"23:00",fade:30},{key:"veg",label:"Vegetative growth",emoji:"🌿",tC:29.4444,tCn:23.8889,tDz:2.7778,hd:70,hn:65,hDz:10,cd:1e3,cn:500,cDz:200,ppfd:600,on:"05:00",off:"23:00",fade:30},{key:"flower",label:"Flowering period",emoji:"🌸",tC:25,tCn:22.7778,tDz:2.7778,hd:55,hn:55,hDz:5,cd:1e3,cn:400,cDz:200,ppfd:900,on:"05:00",off:"17:00",fade:30},{key:"dry",label:"Dry",emoji:"🍂",tC:15.56,tCn:15.56,tDz:1.67,hd:55,hn:55,hDz:5,ppfd:0}],ct.MY_TPL_KEY="sf-plan-templates",ct.VPD_TH=[.4,.8,1.2,1.6,2],ct.VPD_COL=[[31,113,161],[35,170,156],[150,197,90],[228,192,42],[236,140,45],[206,66,51]],ct.styles=n`
    ${Ne}
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
    .oq-lab { font-size: 9px; color: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 4px;
      border: 1px solid var(--divider-color, #2a2f31); border-radius: 8px; padding: 3px 8px; }
    .oq-lab ha-icon { --mdc-icon-size: 14px; }
    .oq-lab-lines { display: flex; flex-direction: column; line-height: 1.05; text-align: left; }
    .oq-lab-lines b { font-weight: 600; font-size: 10px; color: var(--primary-text-color); }
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
    /* Rows sized to content (tiles keep their own min-height, so tile rows stay
       uniform) — this lets a full-width row (a tile's inline expansion, or a
       quick-toggle bar) be its own content height instead of a tall tile row.
       Dense flow backfills the empty cells a full-width row would otherwise leave
       in its partial row, so an expanded tile / moved bar never leaves tile gaps.
       (Dense is a no-op on grids without full-width items.) */
    .grid { display: grid; grid-template-columns: repeat(var(--sf-cols, 3), minmax(0, 1fr)); grid-auto-rows: min-content; grid-auto-flow: row dense; gap: 8px; }
    /* During rearrange, use linear flow so a tile's on-screen position matches its
       order in the list — dense would reflow tiles and make drag targeting wrong. */
    .grid.rgrid { grid-auto-flow: row; }
    .tile-exp { min-width: 0; }                    /* inline tile expansion (graph/detail) */
    /* Phase 2 — rearrange mode */
    .rspan { grid-column: 1 / -1; }               /* full-width item (quick rows) */
    /* quick rows carry their own bottom margin; inside the grid the gap already
       spaces them, so drop it to avoid a double gap after the row. */
    .rspan .oq-row, .rgrid .rwrap.rfull .oq-row { margin-bottom: 0; }
    .rgrid .rwrap.rfull { grid-column: 1 / -1; align-items: center; }
    .rwrap { position: relative; display: flex; }
    .rwrap > :not(.rhandle):not(.rhide) { flex: 1 1 auto; min-width: 0; pointer-events: none; }
    .rgrid .rwrap { touch-action: none; cursor: grab; -webkit-user-select: none; user-select: none; }
    .rgrid .rwrap.dragging { opacity: .55; cursor: grabbing; outline: 2px dashed #ff7a1a; outline-offset: -2px; border-radius: var(--sf-tile-radius, 12px); }
    .rhandle { position: absolute; top: 3px; right: 3px; z-index: 3; color: var(--secondary-text-color); opacity: .75; --mdc-icon-size: 18px; pointer-events: none; }
    .rhide { position: absolute; top: 3px; left: 3px; z-index: 4; pointer-events: auto; cursor: pointer; background: var(--card-background-color, #1c1c1c); border: 1px solid var(--divider-color, #444); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: var(--secondary-text-color); padding: 0; --mdc-icon-size: 15px; }
    .rhide:hover { color: var(--primary-text-color); border-color: var(--primary-text-color); }
    .hidden-tray { margin-top: 12px; border-top: 1px dashed var(--divider-color, #444); padding-top: 6px; }
    .hidden-tray .rwrap.rhidden { opacity: .6; }
    .ht-note { color: var(--secondary-text-color); font-size: .85em; padding: 4px 2px 8px; }
    .reorder-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: var(--secondary-background-color); border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
    .reorder-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); flex: 1 1 160px; }
    .reorder-bar .save-bar { margin: 0; }
    .reorder-reset { background: transparent; border: 1px solid var(--divider-color, #2a2f31); color: var(--primary-text-color); border-radius: 8px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
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
    /* touch-action:none so a finger drag scrubs the cursor instead of scrolling
       the page (otherwise the first touchmove starts a scroll and the pointer
       events are cancelled, so the slider never moves on mobile). (v0.21.73) */
    .param-graph .pg-svg { flex: 1; width: 100%; height: 120px; display: block; touch-action: none; }
    .param-graph .pg-xax {
      display: flex; justify-content: space-between; margin: 3px 0 0 36px;
      font-size: 10px; color: var(--secondary-text-color);
    }
    .param-graph .pg-note { font-size: 13px; color: var(--secondary-text-color); }
    /* Legend for the multi-line soil graph: a swatch + name + the value at the
       cursor (or live value when not scrubbing). The average uses a bar swatch,
       probes a dot. (v0.21.74) */
    .param-graph .pg-legend {
      display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 0 36px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .param-graph .pg-leg { display: inline-flex; align-items: center; gap: 5px; }
    .param-graph .pg-leg i { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex: none; }
    .param-graph .pg-leg.avg i { width: 14px; height: 3px; border-radius: 2px; }
    .param-graph .pg-leg b { color: var(--primary-text-color); font-weight: 500; }
    .tile .soil-graph-btn, .tile .device-graph-btn { cursor: pointer; }
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
    /* Per-sensor soil tile ("sensor" mode): the three metric rows under the label. */
    .soil-rows { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
    .soil-rows .sr { display: flex; align-items: baseline; justify-content: space-between; gap: 6px; min-width: 0; }
    .soil-rows .sr .k { font-size: 11px; color: var(--secondary-text-color); flex: 0 0 auto; }
    .soil-rows .sr .v { font-size: 15px; font-weight: 600; color: var(--primary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .soil-rows .sr .v .unit { font-size: 11px; font-weight: 400; }
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
    /* The soil per-probe breakdown header reads in title case ("Soil Temp · By
       Probe") to match the multi-line graph header; device/outlet pops keep the
       shared uppercase style. (v0.21.74) */
    .soil-pop-head.sph-tc { text-transform: none; letter-spacing: normal; }
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
    /* Device-tile cooldown: device tiles pin icon+value to the bottom, so place
       the pill as a centred overlay in the free middle of the tile (so it doesn't
       cram at the very bottom), matching where outlets show theirs. Compact font. */
    .cd-pill.cd-device {
      /* Nudged a hair below centre so it sits a touch lower in the tile. (v0.21.79) */
      position: absolute; left: 0; right: 0; top: 50%; transform: translateY(calc(-50% + 6px));
      width: auto; margin: 0; gap: 2px; z-index: 1;
    }
    .cd-pill.cd-device .cd-txt { font-size: 9px; gap: 2px; }
    .cd-pill.cd-device .cd-txt ha-icon { --mdc-icon-size: 11px; }
    .cd-pill.cd-device .cd-bar { width: 56px; }
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
  `,e([ue({attribute:!1})],ct.prototype,"hass",void 0),e([ge()],ct.prototype,"config",void 0),e([ge()],ct.prototype,"tab",void 0),e([ge()],ct.prototype,"envSubView",void 0),e([ge()],ct.prototype,"planDraft",void 0),e([ge()],ct.prototype,"planEditStage",void 0),e([ge()],ct.prototype,"planShowAll",void 0),e([ge()],ct.prototype,"planTplOpen",void 0),e([ge()],ct.prototype,"planTplName",void 0),e([ge()],ct.prototype,"_tplMsg",void 0),e([ge()],ct.prototype,"planDelArm",void 0),e([ge()],ct.prototype,"_planPending",void 0),e([ge()],ct.prototype,"colorMode",void 0),e([ge()],ct.prototype,"colHi",void 0),e([ge()],ct.prototype,"colLo",void 0),e([ge()],ct.prototype,"colorModeIn",void 0),e([ge()],ct.prototype,"colIn",void 0),e([ge()],ct.prototype,"colWarn",void 0),e([ge()],ct.prototype,"colorSource",void 0),e([ge()],ct.prototype,"showTrend",void 0),e([ge()],ct.prototype,"showBand",void 0),e([ge()],ct.prototype,"showTargets",void 0),e([ge()],ct.prototype,"tileSummary",void 0),e([ge()],ct.prototype,"hour12",void 0),e([ge()],ct.prototype,"customOutletNames",void 0),e([ge()],ct.prototype,"outletNames",void 0),e([ge()],ct.prototype,"showConn",void 0),e([ge()],ct.prototype,"connCustom",void 0),e([ge()],ct.prototype,"connSignal",void 0),e([ge()],ct.prototype,"showOutletsLog",void 0),e([ge()],ct.prototype,"showVpd",void 0),e([ge()],ct.prototype,"showLeafVpd",void 0),e([ge()],ct.prototype,"_colorOpen",void 0),e([ge()],ct.prototype,"_tsOpen",void 0),e([ge()],ct.prototype,"_cdOpen",void 0),e([ge()],ct.prototype,"_setOverviewOpen",void 0),e([ge()],ct.prototype,"_setExtrasOpen",void 0),e([ge()],ct.prototype,"_setConnOpen",void 0),e([ge()],ct.prototype,"_setVpdOpen",void 0),e([ge()],ct.prototype,"_setDevOpen",void 0),e([ge()],ct.prototype,"_setOutletOpen",void 0),e([ge()],ct.prototype,"_setLayoutOpen",void 0),e([ge()],ct.prototype,"_setSoilOpen",void 0),e([ge()],ct.prototype,"vpdLeaf",void 0),e([ge()],ct.prototype,"vpdStage",void 0),e([ge()],ct.prototype,"vpdView",void 0),e([ge()],ct.prototype,"vpdHighlight",void 0),e([ge()],ct.prototype,"vpdPlanSource",void 0),e([ge()],ct.prototype,"ologRange",void 0),e([ge()],ct.prototype,"ologOpen",void 0),e([ge()],ct.prototype,"_ologVer",void 0),e([ge()],ct.prototype,"_saving",void 0),e([ge()],ct.prototype,"outletCopyOpen",void 0),e([ge()],ct.prototype,"outletCopySel",void 0),e([ge()],ct.prototype,"outletCopyFromOpen",void 0),e([ge()],ct.prototype,"showOutletQuick",void 0),e([ge()],ct.prototype,"outletQuickRemember",void 0),e([ge()],ct.prototype,"outletQuickNames",void 0),e([ge()],ct.prototype,"showDeviceLog",void 0),e([ge()],ct.prototype,"hideTabs",void 0),e([ge()],ct.prototype,"showTimelapseTab",void 0),e([ge()],ct.prototype,"tlCam",void 0),e([ge()],ct.prototype,"tlInterval",void 0),e([ge()],ct.prototype,"tlDailyAt",void 0),e([ge()],ct.prototype,"showDeviceQuick",void 0),e([ge()],ct.prototype,"deviceQuickRemember",void 0),e([ge()],ct.prototype,"dlogOpen",void 0),e([ge()],ct.prototype,"_devPend",void 0),e([ge()],ct.prototype,"_pendLevel",void 0),e([ge()],ct.prototype,"_outPend",void 0),e([ge()],ct.prototype,"_cdTick",void 0),e([ge()],ct.prototype,"customLayout",void 0),e([ge()],ct.prototype,"cardScale",void 0),e([ge()],ct.prototype,"tileCols",void 0),e([ge()],ct.prototype,"layoutMode",void 0),e([ge()],ct.prototype,"unifiedDeviceQuick",void 0),e([ge()],ct.prototype,"unifiedOutletQuick",void 0),e([ge()],ct.prototype,"tileOrder",void 0),e([ge()],ct.prototype,"reorderMode",void 0),e([ge()],ct.prototype,"tileOrderDraft",void 0),e([ge()],ct.prototype,"tileOrderBase",void 0),e([ge()],ct.prototype,"dragId",void 0),e([ge()],ct.prototype,"hiddenTiles",void 0),e([ge()],ct.prototype,"hiddenDraft",void 0),e([ge()],ct.prototype,"tileRadius",void 0),e([ge()],ct.prototype,"tileBorderW",void 0),e([ge()],ct.prototype,"tileBorderCol",void 0),e([ge()],ct.prototype,"tileBg",void 0),e([ge()],ct.prototype,"taTiles",void 0),e([ge()],ct.prototype,"taDevices",void 0),e([ge()],ct.prototype,"taOutlets",void 0),e([ge()],ct.prototype,"cooldownShow",void 0),e([ge()],ct.prototype,"cooldownDevice",void 0),e([ge()],ct.prototype,"cooldownOutlet",void 0),e([ge()],ct.prototype,"cooldownSecs",void 0),e([ge()],ct.prototype,"outletsOnOverview",void 0),e([ge()],ct.prototype,"outletQuickOverview",void 0),e([ge()],ct.prototype,"hideEnergyTile",void 0),e([ge()],ct.prototype,"tempSource",void 0),e([ge()],ct.prototype,"extTemp",void 0),e([ge()],ct.prototype,"extHumi",void 0),e([ge()],ct.prototype,"_smartOpen",void 0),e([ge()],ct.prototype,"smart",void 0),e([ge()],ct.prototype,"paramOpen",void 0),e([ge()],ct.prototype,"_graphVer",void 0),e([ge()],ct.prototype,"graphRange",void 0),e([ge()],ct.prototype,"powerMetric",void 0),e([ge()],ct.prototype,"_graphSel",void 0),e([ge()],ct.prototype,"_graphPin",void 0),e([ge()],ct.prototype,"hideLight2",void 0),e([ge()],ct.prototype,"outletColorMode",void 0),e([ge()],ct.prototype,"ocManual",void 0),e([ge()],ct.prototype,"ocSched",void 0),e([ge()],ct.prototype,"ocEnv",void 0),e([ge()],ct.prototype,"ocDrip",void 0),e([ge()],ct.prototype,"deviceColorMode",void 0),e([ge()],ct.prototype,"dcManual",void 0),e([ge()],ct.prototype,"dcSched",void 0),e([ge()],ct.prototype,"dcAuto",void 0),e([ge()],ct.prototype,"colorDraft",void 0),e([ge()],ct.prototype,"alertsDraft",void 0),e([ge()],ct.prototype,"soilOpen",void 0),e([ge()],ct.prototype,"soilGraphOpen",void 0),e([ge()],ct.prototype,"soilAllOpen",void 0),e([ge()],ct.prototype,"soilMode",void 0),e([ge()],ct.prototype,"soilKeep",void 0),e([ge()],ct.prototype,"soilTileGraph",void 0),e([ge()],ct.prototype,"soilTileMetric",void 0),e([ge()],ct.prototype,"deviceOpen",void 0),e([ge()],ct.prototype,"deviceGraphOpen",void 0),e([ge()],ct.prototype,"outletOpen",void 0),e([ge()],ct.prototype,"draft",void 0),e([ge()],ct.prototype,"modePick",void 0),e([ge()],ct.prototype,"dirPick",void 0),e([ge()],ct.prototype,"outletLightDir",void 0),e([ge()],ct.prototype,"outletDraft",void 0),e([ge()],ct.prototype,"outletNameDraft",void 0),e([ge()],ct.prototype,"outletCfgDraft",void 0),e([ge()],ct.prototype,"_stDt",void 0),e([ge()],ct.prototype,"leafSpots",void 0),e([ge()],ct.prototype,"leafCalTarget",void 0),e([ge()],ct.prototype,"logDate",void 0),e([ge()],ct.prototype,"logDev",void 0),e([ge()],ct.prototype,"logType",void 0);class ht extends de{constructor(){super(...arguments),this._config={type:"custom:spider-farmer-card"}}setConfig(e){this._config={...e}}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_panelChanged(e){const t=e.target.value,i={...this._config};t?i.panel=t:delete i.panel,this._emit(i)}_titleChanged(e){const t=e.target.value.trim(),i={...this._config};t?i.title=t:delete i.title,this._emit(i)}_tabChanged(e){const t=e.target.value;this._emit({...this._config,default_tab:t})}_outletToggled(e,t){const i=t.target.checked,s=new Set(this._config.outlets??[]);i?s.add(e):s.delete(e);const o=[...s].sort(),a={...this._config};o.length?a.outlets=o:delete a.outlets,this._emit(a)}render(){if(Se(this.hass),!this.hass)return j;const e=this._config,t=e.default_tab,i=ze(this.hass),s=Ie(this.hass,e.panel),o=/^(ac|st)\d+/.test(e.panel||"")||s.length>0,a=!(!e.panel||"1"!==this.hass.states[`sensor.sf_${e.panel}_alarm_settings`]?.attributes?.card_options?.outlets_log),n=!(!e.panel||"1"!==this.hass.states[`sensor.sf_${e.panel}_alarm_settings`]?.attributes?.card_options?.vpd_graph),r=!(!e.panel||"1"!==this.hass.states[`sensor.sf_${e.panel}_alarm_settings`]?.attributes?.card_options?.device_log),l=e=>{const t=Ge(this.hass,e);return t?`${e} — ${t}`:e};return V`
      <div class="form">
        <label class="field">
          <span class="flabel">${ke("Panel device")}</span>
          <select @change=${this._panelChanged}>
            ${i.length?j:V`<option value="">${ke("(no devices found yet)")}</option>`}
            ${e.panel?j:V`<option value="" selected>${ke("— choose a device —")}</option>`}
            ${i.map(t=>V`<option value=${t} ?selected=${t===e.panel}>${l(t)}</option>`)}
            ${e.panel&&!i.includes(e.panel)?V`<option value=${e.panel} selected>${e.panel} (not found)</option>`:j}
          </select>
          <span class="hint">${ke("Which display panel this card shows.")}</span>
        </label>

        <label class="field">
          <span class="flabel">${ke("Title")}</span>
          <input type="text" .value=${e.title??""} placeholder=${ke("Spider Farmer")}
            @change=${this._titleChanged} />
        </label>

        <label class="field">
          <span class="flabel">${ke("Default tab")}</span>
          <select @change=${this._tabChanged}>
            <option value="overview" ?selected=${!t||"overview"===t}>${ke("Overview")}</option>
            <option value="environment" ?selected=${"environment"===t||"config"===t}>${ke("Environment")}</option>
            ${o?V`<option value="outlets" ?selected=${"outlets"===t}>${ke("Outlets")}</option>`:j}
            ${o&&a?V`<option value="outlets_log" ?selected=${"outlets_log"===t}>${ke("Outlets Log")}</option>`:j}
            ${r?V`<option value="device_log" ?selected=${"device_log"===t}>${ke("Device Log")}</option>`:j}
            ${n?V`<option value="vpd" ?selected=${"vpd"===t}>VPD</option>`:j}
            <option value="calibration" ?selected=${"calibration"===t||"cali"===t}>${ke("Calibration")}</option>
            <option value="alerts" ?selected=${"alerts"===t}>${ke("Alerts")}</option>
            <option value="log" ?selected=${"log"===t}>${ke("Log")}</option>
          </select>
        </label>

        ${s.length?V`
              <div class="field">
                <span class="flabel">${ke("Outlet devices (Outlets tab)")}</span>
                <div class="checks">
                  ${s.map(t=>V`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(e.outlets??[]).includes(t)}
                          @change=${e=>this._outletToggled(t,e)} />
                        <span>${l(t)}</span>
                      </label>`)}
                </div>
                <span class="hint">${ke("Power strips nested under this panel. Standalone strips are controlled from their own card.")}</span>
              </div>`:j}
      </div>`}}ht.styles=n`
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
  `,e([ue({attribute:!1})],ht.prototype,"hass",void 0),e([ge()],ht.prototype,"_config",void 0);const pt=/^sf_(se\d+)_light$/;function ut(e){const t=new Set;for(const i of Object.keys(e.states)){if(!i.startsWith("light."))continue;const e=Pe(i).match(pt);e&&t.add(e[1])}return[...t].sort((e,t)=>Number(e.replace(/\D/g,""))-Number(t.replace(/\D/g,"")))}class gt extends de{constructor(){super(...arguments),this.draft=null,this.ctlDraft={}}setConfig(e){this.config=e}getCardSize(){return 7}static getStubConfig(e){const t=e?ut(e):[];return{type:"custom:spider-light-card",...t[0]?{light:t[0]}:{}}}static getConfigElement(){return document.createElement("spider-light-card-editor")}accent(){return this.config.accent||Oe}seSlot(){return this.config.light||(this.hass?ut(this.hass)[0]:"")||"se1"}get(e){return this.hass?.states[e]}shouldUpdate(e){return e.has("config")||e.has("hass")||e.has("draft")||e.has("ctlDraft")}cur(e,t){return e in this.ctlDraft?this.ctlDraft[e]:t}stageCtl(e,t){this.ctlDraft={...this.ctlDraft,[e]:t}}isDirty(){return Object.keys(this.ctlDraft).length>0||null!==this.draft}applyAll(e){const t=this.ctlDraft,i=`light.sf_${e}_light`;if("bri"in t){const e=Number(t.bri);e>0?this.hass?.callService("light","turn_on",{entity_id:i,brightness_pct:e}):this.hass?.callService("light","turn_off",{entity_id:i})}"mode"in t&&this.hass?.callService("select","select_option",{entity_id:`select.sf_${e}_mode`,option:t.mode});for(const e of Object.keys(t))e.includes(".")&&(e.startsWith("number.")?this.hass?.callService("number","set_value",{entity_id:e,value:Number(t[e])}):e.startsWith("text.")&&this.hass?.callService("text","set_value",{entity_id:e,value:t[e]}));if("power"in t){const e="on"===t.power;e&&"bri"in t||this.hass?.callService("light",e?"turn_on":"turn_off",{entity_id:i})}this.draft&&this.saveSchedule(e),this.ctlDraft={}}discardAll(){Object.keys(this.ctlDraft).length&&(this.ctlDraft={}),null!==this.draft&&(this.draft=null)}render(){if(Se(this.hass),!this.hass||!this.config)return j;const e=this.seSlot(),t=this.get(`light.sf_${e}_light`);if(!t)return V`<ha-card>
        <div class="empty">
          ${this.config.light?ke('No Spider Farmer SE light found for "{light}".',{light:this.config.light}):ke("No Spider Farmer SE light found.")}
        </div>
      </ha-card>`;const i="on"===t.state,s=i?Math.max(0,Math.min(100,Math.round((t.attributes.brightness??0)/255*100))):0,o=this.get(`select.sf_${e}_mode`),a=this.cur("mode",o?.state??""),n=this.get(`sensor.sf_${e}_mode`)?.state??"",r=[a,n].some(e=>"Linked"===e||"Automatic (Standby)"===e),l=o?.attributes.options??["Manual","Automatic"],d="bri"in this.ctlDraft,c="on"===this.cur("power",i?"on":"off"),h=d?Number(this.ctlDraft.bri):c?s:0,p=d?h>0:c,u=Ge(this.hass,e),g=this.accent(),m=h/100,[f,v]=Ae(100,100,78,135+270*m);return V`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title||ke("Spider Light")}</span>
          ${u?V`<span class="device">${u}</span>`:j}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${Le(100,100,78,0,1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${p&&m>0?Q`<path d=${Le(100,100,78,0,m)} fill="none"
                  stroke-linecap="round" stroke=${g} stroke-width="15"></path>`:j}
            ${p?Q`<circle cx=${f.toFixed(2)} cy=${v.toFixed(2)} r="10"
                  fill="#fff" stroke=${g} stroke-width="3"></circle>`:j}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${p?g:"var(--secondary-text-color)"}>
              ${p?h+"%":ke("Off")}
            </text>
          </svg>
          <button class="power ${c?"on":""} ${r?"ro":""}"
            style=${c?`background:${g}`:""}
            ?disabled=${r}
            @click=${r?null:()=>this.stageCtl("power",c?"off":"on")}
            aria-label=${ke("Toggle light")}></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(h)}
            style="accent-color:${g}" data-unit="%" ?disabled=${r}
            @input=${Ee}
            @change=${e=>this.stageCtl("bri",e.target.value)} />
          <span class="sl-bub"></span>
        </span>

        ${o||r?V`<div class="modes">
              ${l.map(e=>{const t=r?"Linked"===e:a===e;return V`<button
                  class="mode ${t?"active":""} ${r?"ro":""}"
                  style=${t?`color:${g};border-color:${g}`:""}
                  ?disabled=${r}
                  @click=${r?null:()=>this.stageCtl("mode",e)}>${ke(e)}</button>`})}
              ${r&&!l.includes("Linked")?V`<button class="mode active ro"
                    style=${`color:${g};border-color:${g}`} disabled>${ke("Linked")}</button>`:j}
            </div>`:j}

        ${r?V`<div class="linked-note">${ke("Linked — a controller (cb/ac) connected by RJ12 is driving this light.")}</div>`:j}

        ${r||"Automatic"!==a?j:this.renderSchedule(e)}
        ${r?j:at(g,this.isDirty(),()=>this.applyAll(e),()=>this.discardAll(),"apply-bar")}
      </ha-card>`}periodsFor(e){if(this.draft)return this.draft;const t=this.get(`sensor.sf_${e}_schedule`)?.attributes.periods;return Array.isArray(t)?t:[]}edit(e,t){const i=this.draft??this.periodsFor(e),s=JSON.parse(JSON.stringify(i));t(s),this.draft=s}saveSchedule(e){this.draft&&(this.hass?.callService("sf","set_se_schedule",{entity_id:`light.sf_${e}_light`,periods:this.draft}),this.draft=null)}renderSchedule(e){if(!this.get(`sensor.sf_${e}_schedule`))return this.renderScheduleLegacy(e);const t=this.periodsFor(e),i=this.accent();return V`
      <div class="section-label">${ke("Schedule")}</div>
      ${t.map((t,s)=>this.renderPeriod(e,t,s,i))}
      <div class="sched-actions">
        <button class="add"
          @click=${()=>this.edit(e,e=>e.push({enabled:1,days:[0,1,2,3,4,5,6],start:"08:00",end:"20:00",brightness:50,fade:0}))}>
          ${ke("+ Add period")}
        </button>
      </div>`}renderPeriod(e,t,i,s){return V`
      <div class="period">
        <div class="period-head">
          <span class="period-name">${ke("Period {n}",{n:i+1})}</span>
          <button class="del" aria-label=${ke("Delete period")}
            @click=${()=>this.edit(e,e=>e.splice(i,1))}>✕</button>
        </div>
        <div class="days">
          ${Ce.map((o,a)=>V`<button
              class="day ${t.days.includes(a)?"on":""}"
              style=${t.days.includes(a)?`background:${s};border-color:${s}`:""}
              @click=${()=>this.edit(e,e=>{const t=e[i].days,s=t.indexOf(a);s>=0?t.splice(s,1):t.push(a),t.sort((e,t)=>e-t)})}>${o}</button>`)}
        </div>
        <div class="sched-times">
          <div class="tf">
            <span class="tf-lbl">${ke("Start")}</span>
            <input type="time" .value=${t.start}
              @change=${t=>this.edit(e,e=>{e[i].start=t.target.value})} />
          </div>
          <span class="dash">—</span>
          <div class="tf">
            <span class="tf-lbl">${ke("Stop")}</span>
            <input type="time" .value=${t.end}
              @change=${t=>this.edit(e,e=>{e[i].end=t.target.value})} />
          </div>
        </div>
        <div class="num-row">
          <span class="nr-lbl">${ke("Brightness")}</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${String(t.brightness)}
              style="accent-color:${s}" data-unit="%"
              @input=${Ee}
              @change=${t=>this.edit(e,e=>{e[i].brightness=Number(t.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${t.brightness}%</span>
        </div>
        <div class="num-row">
          <span class="nr-lbl">${ke("Sun fade")}</span>
          <span class="sl-live">
            <input type="range" min="0" max="30" .value=${String(t.fade)}
              style="accent-color:${s}" data-unit="m"
              @input=${Ee}
              @change=${t=>this.edit(e,e=>{e[i].fade=Number(t.target.value)})} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${t.fade}m</span>
        </div>
      </div>`}renderScheduleLegacy(e){const t=this.get(`text.sf_${e}_schedule_start`),i=this.get(`text.sf_${e}_schedule_stop`),s=this.get(`number.sf_${e}_schedule_brightness`),o=this.get(`number.sf_${e}_sunrise_sunset_fade`);return t||i||s||o?V`
      <div class="section-label">${ke("Schedule")}</div>
      ${t||i?V`<div class="sched-times">
            ${this.timeField(`text.sf_${e}_schedule_start`,"Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${e}_schedule_stop`,"Stop")}
          </div>`:j}
      ${s?this.numRow(`number.sf_${e}_schedule_brightness`,"Brightness",s):j}
      ${o?this.numRow(`number.sf_${e}_sunrise_sunset_fade`,"Sunrise / sunset fade",o):j}`:j}timeField(e,t){const i=this.get(e);if(!i)return j;const s="unknown"===i.state||"unavailable"===i.state?"":i.state,o=this.cur(e,s);return V`<div class="tf">
      <span class="tf-lbl">${ke(t)}</span>
      <input type="time" .value=${o}
        @change=${t=>this.stageCtl(e,t.target.value)} />
    </div>`}numRow(e,t,i){const s=i.attributes.min??0,o=i.attributes.max??100,a=i.attributes.step??1,n=i.attributes.unit_of_measurement??"",r="unknown"===i.state||"unavailable"===i.state?"":i.state,l=this.cur(e,r);return V`<div class="num-row">
      <span class="nr-lbl">${ke(t)}</span>
      <span class="sl-live">
        <input type="range" min=${s} max=${o} step=${a} .value=${String(l)}
          style="accent-color:${this.accent()}" data-unit=${n}
          @input=${Ee}
          @change=${t=>this.stageCtl(e,t.target.value)} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${l}${n}</span>
    </div>`}}gt.styles=n`
    ${Ne}
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
    /* Read-only (linked): a paired controller drives the light, so the card just
       reflects its state — dim the controls and show they can't be changed. */
    .mode.ro { cursor: default; }
    .mode.ro:not(.active) { opacity: .4; }
    .power.ro { cursor: default; opacity: .5; }
    input[type="range"]:disabled { opacity: .5; cursor: default; }
    .linked-note {
      font-size: 12px; color: var(--secondary-text-color);
      text-align: center; margin: 2px 2px 6px;
    }
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
  `,e([ue({attribute:!1})],gt.prototype,"hass",void 0),e([ge()],gt.prototype,"config",void 0),e([ge()],gt.prototype,"draft",void 0),e([ge()],gt.prototype,"ctlDraft",void 0);const mt={SE4500:{name:"SE4500",watts:320,isBar:!0,barCount:3,lW:1.163,lL:.369,ppfd:{8:{c:1800,a:1350,e:900},10:{c:1500,a:1150,e:780},12:{c:1250,a:960,e:650},14:{c:1060,a:820,e:545},16:{c:910,a:700,e:465},18:{c:790,a:610,e:400},20:{c:690,a:530,e:350},22:{c:610,a:470,e:305},24:{c:545,a:420,e:270},26:{c:490,a:375,e:240},28:{c:440,a:340,e:215},30:{c:400,a:305,e:195},32:{c:360,a:275,e:175},36:{c:300,a:230,e:145},42:{c:240,a:184,e:115},48:{c:195,a:149,e:93},60:{c:150,a:115,e:72},72:{c:118,a:90,e:56},84:{c:95,a:72,e:45}}},SF2000:{name:"SF2000",watts:200,isBar:!1,barCount:0,lW:.864,lL:.432,ppfd:{8:{c:1600,a:1050,e:480},10:{c:1320,a:870,e:400},12:{c:1100,a:720,e:330},14:{c:920,a:600,e:275},16:{c:780,a:505,e:230},18:{c:660,a:430,e:193},20:{c:570,a:370,e:165},22:{c:495,a:320,e:143},24:{c:435,a:280,e:125},26:{c:385,a:248,e:110},28:{c:340,a:218,e:97},30:{c:305,a:196,e:87},32:{c:274,a:176,e:78},36:{c:226,a:145,e:64},42:{c:182,a:116,e:51},48:{c:148,a:95,e:42},60:{c:97,a:62,e:27},72:{c:68,a:43,e:19},84:{c:49,a:31,e:14}}},SE5000:{name:"SE5000",watts:480,isBar:!0,barCount:4,lW:.855,lL:.85,ppfd:{8:{c:1561,a:1101,e:597},10:{c:1478,a:1041,e:631},12:{c:1402,a:986,e:661},14:{c:1332,a:935,e:686},16:{c:1267,a:889,e:708},18:{c:1206,a:845,e:727},20:{c:1150,a:805,e:744},22:{c:1098,a:767,e:752},24:{c:1049,a:732,e:718},26:{c:1003,a:700,e:686},28:{c:960,a:669,e:656},30:{c:920,a:640,e:628},32:{c:883,a:614,e:601},36:{c:814,a:565,e:554},42:{c:725,a:502,e:492},48:{c:650,a:449,e:440},60:{c:531,a:366,e:358},72:{c:442,a:303,e:297},84:{c:373,a:256,e:251}}},SF7000:{name:"SF7000",watts:650,isBar:!1,barCount:0,lW:.737,lL:.558,ppfd:{8:{c:2560,a:1105,e:314},10:{c:2298,a:1052,e:359},12:{c:2053,a:983,e:394},14:{c:1881,a:955,e:434},16:{c:1714,a:912,e:465},18:{c:1597,a:903,e:506},20:{c:1441,a:833,e:520},22:{c:1328,a:798,e:543},24:{c:1218,a:752,e:556},26:{c:1138,a:734,e:582},28:{c:1059,a:704,e:598},30:{c:987,a:677,e:613},32:{c:922,a:651,e:626},36:{c:811,a:603,e:591},42:{c:678,a:541,e:530},48:{c:575,a:488,e:478},60:{c:429,a:403,e:395},72:{c:332,a:332,e:325},84:{c:265,a:265,e:259}}},G1000W:{name:"G1000W",watts:1e3,isBar:!0,barCount:8,lW:1.153,lL:1.122,ppfd:{8:{c:2156,a:1822,e:1555},10:{c:2068,a:1769,e:1527},12:{c:1985,a:1720,e:1501},14:{c:1908,a:1672,e:1476},16:{c:1834,a:1626,e:1451},18:{c:1765,a:1582,e:1427},20:{c:1700,a:1540,e:1404},22:{c:1638,a:1499,e:1382},24:{c:1580,a:1460,e:1360},26:{c:1524,a:1422,e:1339},28:{c:1472,a:1386,e:1319},30:{c:1422,a:1352,e:1299},32:{c:1375,a:1318,e:1280},36:{c:1287,a:1255,e:1230},42:{c:1170,a:1168,e:1145},48:{c:1068,a:1068,e:1047},60:{c:901,a:901,e:883},72:{c:770,a:770,e:755},84:{c:666,a:666,e:653}}},SF1000:{name:"SF1000",watts:100,isBar:!1,barCount:0,lW:.325,lL:.29,ppfd:{8:{c:1079,a:618,e:330},10:{c:928,a:598,e:355},12:{c:842,a:578,e:380},14:{c:756,a:557,e:405},16:{c:656,a:516,e:404},18:{c:557,a:475,e:403},20:{c:499,a:426,e:361},22:{c:450,a:384,e:326},24:{c:408,a:348,e:295},26:{c:371,a:316,e:268},28:{c:339,a:289,e:245},30:{c:311,a:265,e:225},32:{c:287,a:244,e:207},36:{c:245,a:209,e:177},42:{c:198,a:169,e:144},48:{c:164,a:140,e:118},60:{c:117,a:100,e:85},72:{c:88,a:75,e:63},84:{c:68,a:58,e:49}}},SF1000D:{name:"SF1000D",watts:100,isBar:!1,barCount:0,lW:.3,lL:.3,ppfd:{8:{c:1100,a:498,e:290},10:{c:960,a:496,e:312},12:{c:870,a:494,e:334},14:{c:781,a:491,e:357},16:{c:692,a:476,e:364},18:{c:602,a:460,e:372},20:{c:544,a:416,e:336},22:{c:494,a:377,e:305},24:{c:450,a:344,e:278},26:{c:412,a:315,e:255},28:{c:379,a:290,e:234},30:{c:350,a:267,e:216},32:{c:323,a:247,e:200},36:{c:279,a:213,e:173},42:{c:228,a:174,e:141},48:{c:190,a:145,e:117},60:{c:137,a:105,e:85},72:{c:104,a:80,e:64},84:{c:82,a:62,e:50}}},SF2000Pro:{name:"SF2000Pro",watts:200,isBar:!1,barCount:0,lW:.33,lL:.33,ppfd:{8:{c:2226,a:1026,e:235},10:{c:1822,a:957,e:272},12:{c:1518,a:888,e:310},14:{c:1308,a:819,e:348},16:{c:1097,a:750,e:385},18:{c:954,a:663,e:368},20:{c:835,a:580,e:322},22:{c:736,a:512,e:284},24:{c:655,a:455,e:252},26:{c:586,a:407,e:226},28:{c:527,a:366,e:203},30:{c:477,a:331,e:184},32:{c:433,a:301,e:167},36:{c:363,a:252,e:140},42:{c:285,a:198,e:110},48:{c:230,a:160,e:89},60:{c:159,a:110,e:61},72:{c:116,a:81,e:45},84:{c:89,a:62,e:34}}},SF4000:{name:"SF4000",watts:450,isBar:!1,barCount:0,lW:.66,lL:.61,ppfd:{8:{c:2256,a:1529,e:215},10:{c:2021,a:1428,e:244},12:{c:1821,a:1327,e:273},14:{c:1671,a:1226,e:302},16:{c:1521,a:1125,e:331},18:{c:1371,a:1024,e:360},20:{c:1258,a:939,e:330},22:{c:1158,a:865,e:304},24:{c:1069,a:799,e:281},26:{c:991,a:740,e:260},28:{c:920,a:687,e:242},30:{c:857,a:640,e:225},32:{c:800,a:598,e:210},36:{c:703,a:525,e:184},42:{c:586,a:438,e:154},48:{c:497,a:371,e:130},60:{c:370,a:276,e:97},72:{c:286,a:213,e:75},84:{c:227,a:170,e:60}}},SF300:{name:"SF300",watts:33,isBar:!1,barCount:0,lW:.6,lL:.148,ppfd:{8:{c:555,a:444,e:278},10:{c:418,a:335,e:209},12:{c:282,a:226,e:141},14:{c:239,a:192,e:120},16:{c:196,a:157,e:98},18:{c:164,a:131,e:82},20:{c:139,a:111,e:70},22:{c:120,a:96,e:60},24:{c:104,a:83,e:52},26:{c:91,a:73,e:46},28:{c:80,a:64,e:40},30:{c:72,a:57,e:36},32:{c:64,a:51,e:32},36:{c:52,a:42,e:26},42:{c:40,a:32,e:20},48:{c:31,a:25,e:16},60:{c:21,a:17,e:10},72:{c:15,a:12,e:7},84:{c:11,a:9,e:6}}},SF600:{name:"SF600",watts:65,isBar:!1,barCount:0,lW:.6,lL:.148,ppfd:{8:{c:708,a:566,e:353},10:{c:550,a:440,e:275},12:{c:393,a:314,e:196},14:{c:346,a:277,e:173},16:{c:300,a:240,e:150},18:{c:256,a:205,e:128},20:{c:221,a:177,e:111},22:{c:193,a:154,e:97},24:{c:170,a:136,e:85},26:{c:151,a:121,e:75},28:{c:135,a:108,e:67},30:{c:121,a:97,e:60},32:{c:109,a:87,e:55},36:{c:90,a:72,e:45},42:{c:70,a:56,e:35},48:{c:56,a:45,e:28},60:{c:38,a:30,e:19},72:{c:28,a:22,e:14},84:{c:21,a:17,e:10}}},G5000:{name:"G5000",watts:480,isBar:!0,barCount:6,lW:.855,lL:.853,ppfd:{8:{c:1608,a:1067,e:333},10:{c:1519,a:1027,e:413},12:{c:1437,a:987,e:493},14:{c:1361,a:935,e:467},16:{c:1292,a:887,e:443},18:{c:1227,a:843,e:421},20:{c:1167,a:802,e:401},22:{c:1112,a:764,e:381},24:{c:1060,a:728,e:364},26:{c:1012,a:695,e:347},28:{c:967,a:664,e:332},30:{c:925,a:635,e:317},32:{c:886,a:608,e:304},36:{c:814,a:559,e:279},42:{c:722,a:496,e:248},48:{c:645,a:443,e:221},60:{c:524,a:360,e:180},72:{c:433,a:298,e:149},84:{c:365,a:250,e:125}}},G7000:{name:"G7000",watts:730,isBar:!0,barCount:10,lW:1.118,lL:1.153,ppfd:{8:{c:1591,a:1353,e:1159},10:{c:1440,a:1276,e:1084},12:{c:1290,a:1200,e:1009},14:{c:1171,a:1089,e:916},16:{c:1067,a:993,e:835},18:{c:977,a:908,e:764},20:{c:897,a:835,e:702},22:{c:827,a:769,e:647},24:{c:765,a:712,e:598},26:{c:709,a:660,e:555},28:{c:660,a:614,e:516},30:{c:615,a:572,e:481},32:{c:575,a:535,e:450},36:{c:506,a:470,e:395},42:{c:423,a:393,e:331},48:{c:359,a:334,e:281},60:{c:268,a:249,e:209},72:{c:208,a:193,e:162},84:{c:165,a:154,e:129}}},G4500:{name:"G4500",watts:320,isBar:!0,barCount:4,lW:1.14,lL:.37,ppfd:{8:{c:1570,a:1150,e:691},10:{c:1376,a:1070,e:702},12:{c:1182,a:989,e:714},14:{c:1040,a:870,e:628},16:{c:922,a:771,e:557},18:{c:823,a:689,e:497},20:{c:739,a:618,e:446},22:{c:667,a:558,e:403},24:{c:606,a:507,e:366},26:{c:552,a:462,e:334},28:{c:505,a:423,e:305},30:{c:464,a:389,e:281},32:{c:428,a:358,e:259},36:{c:367,a:307,e:222},42:{c:298,a:249,e:180},48:{c:246,a:206,e:149},60:{c:176,a:148,e:107},72:{c:133,a:111,e:80},84:{c:103,a:86,e:62}}},G8600:{name:"G8600",watts:800,isBar:!0,barCount:10,lW:1.153,lL:1.122,ppfd:{8:{c:1806,a:1601,e:1340},10:{c:1718,a:1502,e:1212},12:{c:1629,a:1403,e:1084},14:{c:1550,a:1335,e:1031},16:{c:1477,a:1272,e:983},18:{c:1409,a:1213,e:937},20:{c:1345,a:1158,e:895},22:{c:1286,a:1107,e:855},24:{c:1230,a:1059,e:819},26:{c:1178,a:1015,e:784},28:{c:1129,a:973,e:751},30:{c:1083,a:933,e:721},32:{c:1040,a:896,e:692},36:{c:962,a:828,e:640},42:{c:859,a:740,e:572},48:{c:772,a:665,e:514},60:{c:634,a:546,e:422},72:{c:529,a:456,e:352},84:{c:449,a:387,e:299}}},G1200W:{name:"G1200W",watts:1200,isBar:!0,barCount:12,lW:1.15,lL:1.7,ppfd:{8:{c:1762,a:1533,e:1357},10:{c:1705,a:1484,e:1294},12:{c:1648,a:1434,e:1230},14:{c:1595,a:1388,e:1191},16:{c:1545,a:1344,e:1153},18:{c:1497,a:1302,e:1117},20:{c:1451,a:1262,e:1083},22:{c:1407,a:1224,e:1050},24:{c:1365,a:1188,e:1019},26:{c:1325,a:1153,e:989},28:{c:1287,a:1120,e:961},30:{c:1250,a:1088,e:933},32:{c:1215,a:1058,e:907},36:{c:1150,a:1e3,e:858},42:{c:1060,a:923,e:791},48:{c:981,a:854,e:732},60:{c:847,a:737,e:632},72:{c:739,a:643,e:552},84:{c:650,a:566,e:485}}},G1500:{name:"G1500",watts:150,isBar:!0,barCount:4,lW:.58,lL:.52,ppfd:{8:{c:1258,a:839,e:497},10:{c:1056,a:756,e:527},12:{c:899,a:644,e:449},14:{c:775,a:555,e:387},16:{c:674,a:483,e:337},18:{c:592,a:424,e:296},20:{c:524,a:375,e:262},22:{c:468,a:335,e:233},24:{c:420,a:300,e:209},26:{c:378,a:271,e:189},28:{c:343,a:246,e:171},30:{c:313,a:224,e:156},32:{c:286,a:205,e:143},36:{c:242,a:173,e:121},42:{c:193,a:138,e:96},48:{c:157,a:113,e:78},60:{c:110,a:79,e:55},72:{c:82,a:58,e:41},84:{c:63,a:45,e:31}}},G3000:{name:"G3000",watts:300,isBar:!0,barCount:5,lW:.62,lL:.58,ppfd:{8:{c:1394,a:896,e:472},10:{c:1273,a:864,e:486},12:{c:1167,a:832,e:501},14:{c:1079,a:800,e:516},16:{c:991,a:768,e:530},18:{c:918,a:711,e:491},20:{c:852,a:660,e:456},22:{c:793,a:615,e:424},24:{c:740,a:574,e:396},26:{c:693,a:537,e:370},28:{c:649,a:503,e:347},30:{c:610,a:473,e:326},32:{c:574,a:445,e:307},36:{c:511,a:396,e:273},42:{c:435,a:337,e:232},48:{c:374,a:290,e:200},60:{c:285,a:221,e:153},72:{c:225,a:174,e:120},84:{c:182,a:141,e:97}}},SE1500:{name:"SE1500",watts:150,isBar:!0,barCount:4,lW:.6,lL:.52,ppfd:{8:{c:1281,a:901,e:580},10:{c:1059,a:785,e:556},12:{c:890,a:660,e:467},14:{c:759,a:562,e:398},16:{c:654,a:485,e:343},18:{c:570,a:422,e:299},20:{c:501,a:371,e:263},22:{c:444,a:329,e:233},24:{c:396,a:294,e:208},26:{c:355,a:263,e:187},28:{c:321,a:238,e:168},30:{c:291,a:216,e:153},32:{c:265,a:197,e:139},36:{c:223,a:165,e:117},42:{c:176,a:131,e:92},48:{c:143,a:106,e:75},60:{c:99,a:73,e:52},72:{c:73,a:54,e:38},84:{c:56,a:41,e:29}}},SE3000:{name:"SE3000",watts:300,isBar:!0,barCount:4,lW:.61,lL:.61,ppfd:{8:{c:1452,a:922,e:399},10:{c:1315,a:880,e:429},12:{c:1197,a:839,e:459},14:{c:1100,a:798,e:489},16:{c:1004,a:756,e:519},18:{c:925,a:696,e:478},20:{c:854,a:643,e:442},22:{c:792,a:596,e:409},24:{c:736,a:554,e:380},26:{c:685,a:516,e:354},28:{c:640,a:482,e:331},30:{c:599,a:451,e:310},32:{c:562,a:423,e:290},36:{c:497,a:375,e:257},42:{c:419,a:316,e:217},48:{c:359,a:270,e:185},60:{c:271,a:204,e:140},72:{c:212,a:159,e:109},84:{c:170,a:128,e:88}}},SE7000:{name:"SE7000",watts:730,isBar:!0,barCount:8,lW:1.08,lL:1.05,ppfd:{8:{c:1526,a:1465,e:1215},10:{c:1475,a:1398,e:1141},12:{c:1424,a:1331,e:1067},14:{c:1377,a:1287,e:1032},16:{c:1332,a:1245,e:998},18:{c:1289,a:1205,e:966},20:{c:1248,a:1167,e:935},22:{c:1210,a:1131,e:906},24:{c:1173,a:1096,e:879},26:{c:1137,a:1063,e:852},28:{c:1103,a:1031,e:827},30:{c:1071,a:1001,e:803},32:{c:1040,a:972,e:779},36:{c:982,a:918,e:736},42:{c:904,a:845,e:677},48:{c:835,a:780,e:626},60:{c:718,a:671,e:538},72:{c:625,a:584,e:468},84:{c:548,a:512,e:411}}},SE1000W:{name:"SE1000W",watts:1e3,isBar:!0,barCount:10,lW:1.12,lL:1.1,ppfd:{8:{c:2491,a:2089,e:1631},10:{c:2326,a:1990,e:1560},12:{c:2176,a:1892,e:1488},14:{c:2046,a:1794,e:1416},16:{c:1917,a:1695,e:1345},18:{c:1805,a:1596,e:1266},20:{c:1702,a:1505,e:1194},22:{c:1607,a:1421,e:1128},24:{c:1521,a:1345,e:1067},26:{c:1441,a:1274,e:1011},28:{c:1367,a:1209,e:959},30:{c:1299,a:1148,e:911},32:{c:1236,a:1092,e:867},36:{c:1122,a:992,e:787},42:{c:979,a:866,e:687},48:{c:862,a:762,e:605},60:{c:683,a:604,e:479},72:{c:554,a:490,e:389},84:{c:459,a:406,e:322}}}},ft=[["SF","SF Series"],["G","G Series"],["SE","SE Series"]];function vt(){const e=Object.keys(mt);return ft.map(([t,i])=>({label:i,models:e.filter(e=>{return((i=e).startsWith("SE")?"SE":i.startsWith("SF")?"SF":i.startsWith("G")?"G":"SF")===t;var i}).sort((e,t)=>e.localeCompare(t))})).filter(e=>e.models.length)}function bt(e,t,i){const s=e.ppfd,o=Object.keys(s).map(Number).sort((e,t)=>e-t);let a=o[0],n=o[o.length-1];for(let e=0;e<o.length-1;e++)if(t>=o[e]&&t<=o[e+1]){a=o[e],n=o[e+1];break}t<=o[0]&&(a=n=o[0]),t>=o[o.length-1]&&(a=n=o[o.length-1]);const r=a===n?0:(t-a)/(n-a),l=(e,t)=>Math.round((e+(t-e)*r)*i/100);return{center:l(s[a].c,s[n].c),avg:l(s[a].a,s[n].a),edge:l(s[a].e,s[n].e)}}function _t(e,t){const i=Math.max(0,Math.min(1,e/t));let s,o,a;if(i<.2){const e=i/.2;s=0,o=Math.round(80*e),a=Math.round(160+95*e)}else if(i<.4){const e=(i-.2)/.2;s=0,o=Math.round(80+175*e),a=Math.round(255-255*e)}else if(i<.6){const e=(i-.4)/.2;s=Math.round(220*e),o=255,a=0}else if(i<.8){const e=(i-.6)/.2;s=Math.round(220+35*e),o=Math.round(255-120*e),a=0}else{const e=(i-.8)/.2;s=255,o=Math.round(135-135*e),a=0}return[s,o,a]}class yt extends de{constructor(){super(...arguments),this.tab="view",this.rev=0,this.s={tW:.61,tL:1.22,tH:1.981,model:"SE4500",hin:18,plantIn:12,numPlants:2,dim:100,photo:18,metric:!1},this.manualDim=100,this.auto=!1,this.brightSrc="",this.T=null,this.scene=null,this.camera=null,this.renderer=null,this.raf=0,this.o={},this.cam={theta:.52,phi:.36,r:3.8,drag:!1,px:0,py:0},this.dirty=!0,this.needRender=!0,this.fitDone=!1,this.serverSynced=!1,this.localApplied=!1,this.saveT=null,this.saved=null}setConfig(e){this.config=e;const t=e.defaults||{},i=e.tent||{};this.s.model=e.light_model&&mt[e.light_model]?e.light_model:"SE4500",this.s.hin=t.height_inches??18,this.s.plantIn=t.plant_height_inches??12,this.s.numPlants=t.num_plants??2,this.s.dim=t.dimmer_percent??100,this.manualDim=this.s.dim,this.s.photo=t.photoperiod_hours??18,this.s.tW=Math.max(.3,.3048*(i.width_ft??2)),this.s.tL=Math.max(.6,.3048*(i.length_ft??4)),this.s.tH=Math.max(.9,.3048*(i.height_ft??6.5)),this.s.metric=this.resolveMetric(),this.auto=!!t.auto_brightness,this.brightSrc=t.brightness_source||"",this.serverSynced=!1,this.localApplied=!1,this.dirty=!0,this.fitDone=!1,this.saved=this.blob()}getCardSize(){return 11}static getStubConfig(e){let t;if(e){const i=Object.keys(e.states).filter(e=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(e)).sort(),s=i[0]&&/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(i[0]);s&&(t=s[1])}return{type:"custom:ppfd-3d-card",title:"PPFD Visualizer",card_id:"ppfd_"+Math.random().toString(36).slice(2,8),light_model:"SE4500",unit_system:"auto",...t?{panel:t}:{},defaults:{height_inches:18,plant_height_inches:12,num_plants:2,dimmer_percent:100,photoperiod_hours:18},tent:{width_ft:2,length_ft:4,height_ft:6.5}}}static getConfigElement(){return document.createElement("spider-ppfd-card-editor")}resolveMetric(){const e=(this.config?.unit_system||"auto").toLowerCase();if("metric"===e)return!0;if("imperial"===e)return!1;const t=this.hass?.config?.unit_system;return!(!t||!t.length)&&"mi"!==t.length}fmtSmall(e){return this.s.metric?`${Math.round(2.54*e)} cm`:`${Math.round(e)}"`}fmtTentDim(e){return this.s.metric?(.3048*e).toFixed(2):(+e).toFixed(1)}tentUnit(){return this.s.metric?"m":"ft"}optKey(){const e=this.config||{};return"ppfd:"+(e.card_id||e.light_model||"main")}panelSlot(){if(this.config?.panel)return this.config.panel;if(this.hass){const e=Object.keys(this.hass.states).filter(e=>/^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(e)).sort();if(e.length){const t=/^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(e[0]);if(t)return t[1]}}return null}alarmEntity(){const e=this.panelSlot();if(!e||!this.hass)return null;const t=`sensor.sf_${e}_alarm_settings`;return this.hass.states[t]?t:null}lsKey(){return`ppfd3d:${this.panelSlot()||"nopanel"}:${this.optKey()}`}blob(){return{model:this.s.model,hin:this.s.hin,plantIn:this.s.plantIn,numPlants:this.s.numPlants,photo:this.s.photo,dim:this.manualDim,tW:this.s.tW,tL:this.s.tL,tH:this.s.tH,auto:!!this.auto,src:this.brightSrc||""}}applyBlob(e){e&&(e.model&&mt[e.model]&&(this.s.model=e.model),null!=e.hin&&(this.s.hin=e.hin),null!=e.plantIn&&(this.s.plantIn=e.plantIn),null!=e.numPlants&&(this.s.numPlants=e.numPlants),null!=e.photo&&(this.s.photo=e.photo),null!=e.dim&&(this.manualDim=e.dim,this.s.dim=e.dim),null!=e.tW&&(this.s.tW=e.tW),null!=e.tL&&(this.s.tL=e.tL),null!=e.tH&&(this.s.tH=e.tH),this.auto=!!e.auto,this.brightSrc=e.src||"")}hydrateLocal(){if(!this.localApplied){this.localApplied=!0;try{const e=localStorage.getItem(this.lsKey());e&&(this.applyBlob(JSON.parse(e)),this.dirty=!0)}catch{}this.saved=this.blob()}}adoptServer(){if(this.serverSynced)return;const e=this.alarmEntity();if(!e)return;this.serverSynced=!0;const t=this.hass.states[e].attributes.card_options,i=this.optKey();if(t&&void 0!==t[i])try{this.applyBlob(JSON.parse(t[i])),this.dirty=!0}catch{}this.saved=this.blob()}queueSaveView(){clearTimeout(this.saveT),this.saveT=setTimeout(()=>this.saveView(),700)}saveView(){const e=this.blob();if(this.saved)for(const t of yt.SET_FIELDS)e[t]=this.saved[t];this.persistBlob(e),this.saved=e}applySettings(){const e=this.blob();this.persistBlob(e),this.saved=e,this.repaint()}discardSettings(){this.saved&&(this.auto=!!this.saved.auto,this.brightSrc=this.saved.src||"",this.s.numPlants=this.saved.numPlants,this.s.photo=this.saved.photo??this.s.photo,this.s.tW=this.saved.tW,this.s.tL=this.saved.tL,this.s.tH=this.saved.tH,this.auto?this.readLive():this.s.dim=this.manualDim,this.dirty=!0,this.repaint())}settingsDirty(){const e=this.saved;return!!e&&(!!this.auto!=!!e.auto||(this.brightSrc||"")!==(e.src||"")||this.s.numPlants!==e.numPlants||this.s.photo!==(e.photo??this.s.photo)||this.s.tW!==e.tW||this.s.tL!==e.tL||this.s.tH!==e.tH)}persistBlob(e){const t=JSON.stringify(e),i=this.alarmEntity();i&&this.hass?.callService&&this.hass.callService("sf","set_card_option",{entity_id:i,key:this.optKey(),value:t});try{localStorage.setItem(this.lsKey(),t)}catch{try{const e=this.lsKey();for(const t of Object.keys(localStorage))t.startsWith("ppfd3d:")&&t!==e&&localStorage.removeItem(t);localStorage.setItem(e,t)}catch{}}}brightnessOf(e){if(!e)return 0;if(String(e.entity_id).startsWith("light.")){if("on"!==e.state)return 0;const t=e.attributes&&e.attributes.brightness;return null!=t?Math.round(t/255*100):100}const t=parseFloat(e.state);return isNaN(t)?0:Math.max(0,Math.min(100,Math.round(t)))}readLive(){if(!this.hass)return!1;let e=!1;const t=this.config?.entities||{};if(t.dimmer_percent){const i=this.hass.states[t.dimmer_percent];if(i){const t=parseFloat(i.state);if(!isNaN(t)){const i=Math.max(10,Math.min(100,t));i===this.s.dim||this.auto||(this.s.dim=i,this.manualDim=i,e=!0)}}}if(t.height_inches){const i=this.hass.states[t.height_inches];if(i){const t=parseFloat(i.state);if(!isNaN(t)){const i=Math.max(8,t);i!==this.s.hin&&(this.s.hin=i,e=!0)}}}if(this.auto&&this.brightSrc){const t=this.brightnessOf(this.hass.states[this.brightSrc]);t!==this.s.dim&&(this.s.dim=t,e=!0)}return e}willUpdate(e){if(e.has("config")&&this.hydrateLocal(),e.has("hass")&&this.hass){const e=this.resolveMetric();e!==this.s.metric&&(this.s.metric=e,this.dirty=!0),this.hydrateLocal(),this.adoptServer(),this.readLive()&&(this.dirty=!0)}}firstUpdated(){this.loadThree()}updated(){this.dirty&&(this.needRender=!0)}repaint(){this.rev++}tentInches(){return Math.round(this.s.tH/.0254)}onModel(e){this.s.model=e.target.value,this.dirty=!0,this.repaint(),this.queueSaveView()}onSlider(e,t){const i=Number(t.target.value),s=this.tentInches();"hin"===e?this.s.hin=Math.min(i,s):"plantIn"===e?this.s.plantIn=Math.min(i,s):"numPlants"===e?this.s.numPlants=isNaN(i)?1:Math.max(1,Math.min(12,Math.round(i))):"photo"===e?this.s.photo=isNaN(i)?18:Math.max(1,Math.min(24,Math.round(i))):"dim"===e&&(this.auto||(this.s.dim=i,this.manualDim=i)),this.dirty=!0,this.repaint(),"numPlants"!==e&&"photo"!==e&&this.queueSaveView()}photoFollowsLight(){return!!this.auto&&(this.brightSrc||"").startsWith("light.")}lightPhotoperiod(){if(!this.hass)return null;const e=/^light\.sf_(.+)_(light_\d+)$/.exec(this.brightSrc||"");if(!e)return null;const t=e[1],i=e[2],s=e=>{const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:""};let o=s(`text.sf_${t}_${i}_ppfd_start`),a=s(`text.sf_${t}_${i}_ppfd_stop`);o&&a&&("00:00"!==o||"00:00"!==a)||(o=s(`text.sf_${t}_${i}_schedule_start`),a=s(`text.sf_${t}_${i}_schedule_stop`));const n=/^(\d{1,2}):(\d{2})/.exec(o),r=/^(\d{1,2}):(\d{2})/.exec(a);if(!n||!r)return null;const l=(60*+r[1]+ +r[2]-(60*+n[1]+ +n[2])+1440)%1440;return Math.round(l/60)}effectivePhoto(){if(this.photoFollowsLight()){const e=this.lightPhotoperiod();if(null!=e)return e}return this.s.photo}onTent(e,t){const i=Number(t.target.value),s=this.s.metric?1:.3048,o=isNaN(i)?this.s[e]:i*s;"tW"===e?this.s.tW=Math.max(.3,o):"tL"===e?this.s.tL=Math.max(.6,o):this.s.tH=Math.max(.9,o);const a=this.tentInches();this.s.hin>a&&(this.s.hin=a),this.s.plantIn>a&&(this.s.plantIn=a),this.dirty=!0,this.repaint()}onAuto(e){if(this.auto=e.target.checked,this.auto){if(!this.brightSrc){const e=this.brightOptions();e.length&&(this.brightSrc=e[0].id)}this.readLive()}else this.s.dim=this.manualDim;this.dirty=!0,this.repaint()}onBrightSrc(e){this.brightSrc=e.target.value,this.auto&&this.readLive(),this.dirty=!0,this.repaint()}brightOptions(){if(!this.hass)return[];return Object.keys(this.hass.states).filter(e=>!!e.startsWith("light.sf_")||!(!e.startsWith("number.sf_")||!/schedule_brightness/i.test(e))).sort().map(e=>({id:e,name:this.hass.states[e].attributes.friendly_name||e}))}loadThree(){if(window.THREE)return void this.initThree();const e=window;if(!e._ppfdCBs){e._ppfdCBs=[];const t=document.createElement("script");t.src=function(){try{const e=Array.from(document.querySelectorAll("script[src]")),t=e.find(e=>/spider-farmer-card-dev\.js/.test(e.src))||e.find(e=>/spider-farmer-card\.js/.test(e.src));if(t&&t.src)return t.src.replace(/[^/]*$/,"three.min.js")}catch{}return"/sf_bridge_frontend/three.min.js"}(),t.onload=()=>e._ppfdCBs.forEach(e=>e()),document.head.appendChild(t)}e._ppfdCBs.push(()=>this.initThree())}canvas(){return this.renderRoot.querySelector("#c")}initThree(){const e=this.T=window.THREE,t=this.canvas();if(!e||!t)return;const i=t.parentElement?.offsetWidth||400;t.style.height="340px";const s=this.scene=new e.Scene;s.background=new e.Color(592914),this.camera=new e.PerspectiveCamera(36,i/340,.01,40);const o=this.renderer=new e.WebGLRenderer({canvas:t,antialias:!0});o.setSize(i,340),o.setPixelRatio(Math.min(devicePixelRatio,2)),s.add(new e.AmbientLight(3359829,1.1));const a=new e.DirectionalLight(16777215,.55);a.position.set(2,5,3),s.add(a),this.attachCam(t),this.dirty=!0,this.needRender=!0;const n=()=>{this.raf=requestAnimationFrame(n),this.dirty&&(this.dirty=!1,this.rebuild(),this.needRender=!0),this.needRender&&(this.needRender=!1,this.updCam(),o.render(s,this.camera))};n()}attachCam(e){e.addEventListener("mousedown",e=>{this.cam.drag=!0,this.cam.px=e.clientX,this.cam.py=e.clientY}),window.addEventListener("mouseup",()=>{this.cam.drag=!1}),window.addEventListener("mousemove",e=>{this.cam.drag&&(this.cam.theta-=.007*(e.clientX-this.cam.px),this.cam.phi=Math.max(.05,Math.min(1.3,this.cam.phi-.005*(e.clientY-this.cam.py))),this.cam.px=e.clientX,this.cam.py=e.clientY,this.needRender=!0)}),e.addEventListener("wheel",e=>{this.cam.r=Math.max(1.2,Math.min(10,this.cam.r+.005*e.deltaY)),this.needRender=!0},{passive:!0});let t=null;e.addEventListener("touchstart",e=>{1===e.touches.length&&(t={x:e.touches[0].clientX,y:e.touches[0].clientY,t:this.cam.theta,p:this.cam.phi})}),e.addEventListener("touchmove",e=>{t&&1===e.touches.length&&(this.cam.theta=t.t-.007*(e.touches[0].clientX-t.x),this.cam.phi=Math.max(.05,Math.min(1.3,t.p-.005*(e.touches[0].clientY-t.y))),this.needRender=!0)},{passive:!0})}updCam(){if(!this.camera)return;const{theta:e,phi:t,r:i}=this.cam,s=this.s.tH;this.camera.position.set(i*Math.cos(t)*Math.sin(e),i*Math.sin(t)+.38*s,i*Math.cos(t)*Math.cos(e)),this.camera.lookAt(0,.3*s,0)}rem(e){this.o[e]&&this.scene&&this.scene.remove(this.o[e]),this.o[e]=null}sprite(e,t){const i=this.T,s=document.createElement("canvas");s.width=128,s.height=64;const o=s.getContext("2d");return o.fillStyle="rgba(255,255,255,0.92)",o.font=`bold ${t}px sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(e,64,32),new i.Sprite(new i.SpriteMaterial({map:new i.CanvasTexture(s),transparent:!0,depthTest:!1}))}rebuild(){const e=this.T,t=this.scene;if(!e||!t)return;const{tW:i,tL:s,tH:o,model:a,hin:n,plantIn:r,numPlants:l,dim:d}=this.s,c=mt[a]||mt.SE4500,h=Math.max(1,n-r),p=bt(c,h,d),u=.0254*r,g=.0254*n,m=i/2,f=s/2,v=i>s;this.rem("fr");const b=new e.Group,_=[[m,0,f],[m,0,-f],[-m,0,-f],[-m,0,f],[m,o,f],[m,o,-f],[-m,o,-f],[-m,o,f]],y=[];[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([e,t])=>y.push(..._[e],..._[t]));const $=new e.BufferGeometry;$.setAttribute("position",new e.Float32BufferAttribute(y,3)),b.add(new e.LineSegments($,new e.LineBasicMaterial({color:3822178})));const x=new e.Mesh(new e.BoxGeometry(i,o,s),new e.MeshStandardMaterial({color:12304282,side:e.BackSide,transparent:!0,opacity:.055,roughness:1}));x.position.set(0,o/2,0),b.add(x),t.add(b),this.o.fr=b,this.rem("ht");const w=new e.Group,S=Math.max(1.05*p.center,700),k=30,O=[],D=[],T=[],C=(v?c.lW:c.lL)/i,M=(v?c.lL:c.lW)/s,P=v?1:.7,A=v?.7:1;for(let e=0;e<=30;e++)for(let t=0;t<=k;t++){const o=t/k*i-m,a=e/30*s-f,n=2*(t/k-.5),r=2*(e/30-.5);let l;if(c.isBar){const e=Math.max(0,Math.abs(n)-.5*C)/(1-.5*C+.01),t=Math.max(0,Math.abs(r)-.5*M)/(1-.5*M+.01);l=p.edge+(p.center-p.edge)*Math.exp(-(e*e*3.8+t*t*9))}else{const e=Math.sqrt(n*n*P+r*r*A);l=p.edge+(p.center-p.edge)*Math.exp(-e*e*2.6)}l=Math.max(0,l),O.push(o,u+.004,a);const[d,h,g]=_t(l,S);D.push(d/255,h/255,g/255)}for(let e=0;e<30;e++)for(let t=0;t<k;t++){const i=31*e+t;T.push(i,i+31,i+1,i+1,i+31,i+31+1)}const L=new e.BufferGeometry;L.setAttribute("position",new e.Float32BufferAttribute(O,3)),L.setAttribute("color",new e.Float32BufferAttribute(D,3)),L.setIndex(T),L.computeVertexNormals(),w.add(new e.Mesh(L,new e.MeshBasicMaterial({vertexColors:!0,side:e.DoubleSide,transparent:!0,opacity:.9}))),[[0,p.center],[.36*i,p.avg],[.36*-i,p.avg]].forEach(([e,t])=>{const i=this.sprite(Math.round(t)+"",22);i.position.set(e,u+.065,0),i.scale.set(.25,.12,1),w.add(i)}),t.add(w),this.o.ht=w,this.rem("li");const E=new e.Group,N=new e.MeshStandardMaterial({color:5926525,metalness:.55,roughness:.45});if(c.isBar){const t=c.barCount;for(let i=0;i<t;i++){const s=1===t?0:-c.lL/2+c.lL/(t-1)*i,o=new e.Mesh(new e.BoxGeometry(.026,.013,c.lW),N);o.position.set(s,g,0),E.add(o);const a=new e.Mesh(new e.BoxGeometry(.017,.004,.9*c.lW),new e.MeshBasicMaterial({color:16775392}));a.position.set(s,g-.006,0),E.add(a)}[-c.lW/2,c.lW/2].forEach(t=>{const i=new e.Mesh(new e.BoxGeometry(c.lL,.01,.016),new e.MeshStandardMaterial({color:4018012,metalness:.4}));i.position.set(0,g,t),E.add(i)})}else{const t=new e.Mesh(new e.BoxGeometry(c.lL,.02,c.lW),new e.MeshStandardMaterial({color:4873579,metalness:.4,roughness:.6}));t.position.set(0,g,0),E.add(t);const i=new e.MeshBasicMaterial({color:16775392});for(let t=0;t<4;t++)for(let s=0;s<8;s++){const o=new e.Mesh(new e.CircleGeometry(.013,8),i);o.rotation.x=-Math.PI/2,o.position.set(-c.lL/2+(s+.5)*(c.lL/8),g-.009,-c.lW/2+(t+.5)*(c.lW/4)),E.add(o)}}const F=Math.min(o-.02,g+.05);if(F>g+.04){const t=new e.LineBasicMaterial({color:8947848,transparent:!0,opacity:.5});[-c.lL/2+.04,c.lL/2-.04].forEach(i=>{const s=(new e.BufferGeometry).setFromPoints([new e.Vector3(i,F,0),new e.Vector3(i,g,0)]);E.add(new e.Line(s,t))})}const z=new e.PointLight(16772778,.8,2.2);if(z.position.set(0,g,0),E.add(z),E.rotation.y=v?Math.PI/2:0,t.add(E),this.o.li=E,this.rem("bm"),g>u+.01){const o=new e.Group,a=Math.min(.28,.07+p.center/6e3),n=new e.LineBasicMaterial({color:16768341,transparent:!0,opacity:a}),r=.38*c.lL,l=.38*c.lW;[[-r,-l],[r,-l],[r,l],[-r,l]].forEach(([t,a])=>{const r=Math.sign(t)*i/2*.88,l=Math.sign(a)*s/2*.88,d=(new e.BufferGeometry).setFromPoints([new e.Vector3(t,g,a),new e.Vector3(r,u+.005,l)]);o.add(new e.Line(d,n))});const d=(new e.BufferGeometry).setFromPoints([new e.Vector3(0,g+.005,0),new e.Vector3(0,u+.005,0)]);o.add(new e.Line(d,new e.LineBasicMaterial({color:16777215,transparent:!0,opacity:.2}))),o.rotation.y=v?Math.PI/2:0,t.add(o),this.o.bm=o}this.rem("pl");const R=new e.Group,B=.0254*r,H=Math.min(.25,.35*B+.08),I=new e.MeshStandardMaterial({color:1710618,roughness:.9}),G=new e.MeshStandardMaterial({color:4025128,roughness:.8}),W=new e.MeshStandardMaterial({color:3046686,roughness:.85,side:e.DoubleSide}),V=v?i:s,Q=V/(l+1);for(let t=0;t<l;t++){const i=-V/2+Q*(t+1),s=v?i:0,o=v?0:i,a=new e.Mesh(new e.CylinderGeometry(.06375,.075,H,12),I);a.position.set(s,H/2,o),R.add(a);const n=Math.max(.01,B-H);if(n>.015){const t=new e.Mesh(new e.CylinderGeometry(.011,.015,n,8),G);t.position.set(s,H+n/2,o),R.add(t);const i=Math.max(1,Math.floor(n/.09));for(let t=0;t<i;t++){const a=H+n*(.35+.55*t/Math.max(1,i-1)),r=Math.min(.11,.055+.16*n);for(let i=0;i<3;i++){const n=i*(2*Math.PI/3)+1.1*t,l=new e.Mesh(new e.SphereGeometry(r,6,4),W);l.scale.set(1,.2,.5),l.position.set(s+Math.cos(n)*r*.6,a,o+Math.sin(n)*r*.6),R.add(l)}}}}if(t.add(R),this.o.pl=R,this.rem("hl"),g>u+.01){const s=new e.Group,o=-i/2-.07,a=new e.LineDashedMaterial({color:16777215,transparent:!0,opacity:.45,dashSize:.04,gapSize:.03}),l=(new e.BufferGeometry).setFromPoints([new e.Vector3(o,g,0),new e.Vector3(o,u,0)]),d=new e.Line(l,a);d.computeLineDistances(),s.add(d);const c=this.sprite(this.fmtSmall(n-r),28);c.position.set(o-.11,(g+u)/2,0),c.scale.set(.24,.12,1),s.add(c);const h=new e.MeshBasicMaterial({color:16777215,transparent:!0,opacity:.5}),p=new e.Mesh(new e.ConeGeometry(.013,.035,8),h);p.position.set(o,g-.02,0),s.add(p);const m=new e.Mesh(new e.ConeGeometry(.013,.035,8),h);m.rotation.z=Math.PI,m.position.set(o,u+.02,0),s.add(m),t.add(s),this.o.hl=s}this.fitDone||(this.fitDone=!0,this.cam.r=this.fitDistance()),this.updCam()}fitDistance(){return Math.min(10,Math.max(4.2,2+1.8*Math.max(this.s.tW,this.s.tL,this.s.tH)))}disconnectedCallback(){if(super.disconnectedCallback(),this.raf&&cancelAnimationFrame(this.raf),this.renderer)try{this.renderer.dispose()}catch{}}render(){if(Se(this.hass),!this.config)return j;const e=this.s,t=mt[e.model]||mt.SE4500,i=Math.max(1,e.hin-e.plantIn),s=bt(t,i,e.dim),o=this.effectivePhoto(),a=(s.avg*o*3600/1e6).toFixed(1),n=(r=s.avg)<200?{label:"Too dim",color:"#4488dd"}:r<400?{label:"Seedling / early veg",color:"#22bbaa"}:r<600?{label:"Vegetative growth",color:"#44bb44"}:r<800?{label:"Transition / early flower",color:"#bbaa22"}:r<1e3?{label:"Peak flower zone",color:"#ee8800"}:{label:"High intensity — watch heat",color:"#dd2222"};var r;const l=this.tentInches(),d=this.tentUnit(),c=this.config.title||"PPFD visualizer",h=this.brightOptions();return V`
      <div id="w">
        <div class="top">
          <div class="title">${ke(c)}</div>
          <select @change=${this.onModel} style="width:auto">
            ${vt().map(t=>V`<optgroup label=${ke(t.label)}>
              ${t.models.map(t=>V`<option value=${t} ?selected=${e.model===t}>${mt[t].name} ${mt[t].watts}W</option>`)}
            </optgroup>`)}
          </select>
        </div>
        <div class="tabs">
          <div class="tab ${"view"===this.tab?"on":""}" @click=${()=>{this.tab="view",this.needRender=!0}}>${ke("View")}</div>
          <div class="tab ${"set"===this.tab?"on":""}" @click=${()=>{this.tab="set"}}>${ke("Settings")}</div>
        </div>
        <!-- Canvas stays in the DOM across tabs (only hidden) so the WebGL
             context survives the switch — recreating it left the view black. -->
        <div class="vw" style=${"view"===this.tab?"":"display:none"}><canvas id="c" height="340"></canvas></div>
        ${"view"===this.tab?V`
          <div class="stats">
            <div class="stat"><div class="sl">${ke("Center PPFD")}</div><div class="sv">${s.center.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">${ke("Avg canopy")}</div><div class="sv">${s.avg.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">${ke("Edge PPFD")}</div><div class="sv">${s.edge.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">${ke("DLI @ {hours}h",{hours:o})}</div><div class="sv">${a}<span class="su">${ke("mol/m²/d")}</span></div></div>
          </div>
          <div class="leg"><span>${ke("Low")}</span><div class="legbar"></div><span>${ke("High PPFD")}</span></div>
          <div class="zone">
            <span class="zbadge" style="background:${n.color}22;color:${n.color};border:1px solid ${n.color}44">${ke(n.label)}</span>
            ${ke("{height} light-to-canopy · {dim}% brightness · {hours}h light",{height:this.fmtSmall(i),dim:e.dim,hours:o})}
          </div>
          <div class="div"></div>
          <div class="sec">${ke("Light & plants")}</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">${ke("Light height")} <span class="cv">${this.fmtSmall(e.hin)}</span></span><input type="range" min="8" max=${l} step="1" .value=${String(e.hin)} @input=${e=>this.onSlider("hin",e)}></div>
              <div class="cg"><span class="cl">${ke("Plant height")} <span class="cv">${this.fmtSmall(e.plantIn)}</span></span><input type="range" min="1" max=${l} step="1" .value=${String(e.plantIn)} @input=${e=>this.onSlider("plantIn",e)}></div>
              <div class="cg"><span class="cl">${ke("Brightness")} <span class="cv">${e.dim}%</span></span><input type="range" min="10" max="100" step="5" .value=${String(e.dim)} ?disabled=${this.auto&&!!this.brightSrc} @input=${e=>this.onSlider("dim",e)}></div>
            </div>
          </div>
        `:V`
          <div class="sec">${ke("Brightness")}</div>
          <div class="set">
            <label class="setrow"><input type="checkbox" .checked=${this.auto} @change=${this.onAuto}> ${ke("Auto-read brightness from a light")}</label>
            <div class="cg"><span class="cl">${ke("Light source")}</span>
              <select .value=${this.brightSrc} @change=${this.onBrightSrc}>
                <option value="" ?selected=${!this.brightSrc}>${ke("— none —")}</option>
                ${h.map(e=>V`<option value=${e.id} ?selected=${this.brightSrc===e.id}>${ke(e.name)}</option>`)}
              </select>
            </div>
            <div class="hint">
              ${this.auto&&this.brightSrc?V`Reading ${this.hass?.states[this.brightSrc]?.attributes.friendly_name||this.brightSrc}: ${e.dim}%`:ke("Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target) and the value tracks it live.")}
            </div>
          </div>
          <div class="div"></div>
          <div class="sec">${ke("Plants & photoperiod")}</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">${ke("Number of plants")}</span><input type="number" min="1" max="12" step="1" .value=${String(e.numPlants)} @change=${e=>this.onSlider("numPlants",e)}></div>
              <div class="cg"><span class="cl">${ke("Photoperiod (h)")}</span><input type="number" min="1" max="24" step="1" .value=${String(this.effectivePhoto())} ?disabled=${this.photoFollowsLight()} @change=${e=>this.onSlider("photo",e)}></div>
            </div>
            ${this.photoFollowsLight()?V`<div class="hint">${ke("Auto from the selected light's schedule — {hours}h. Uncheck “Auto-read brightness from a light” to set hours manually.",{hours:this.effectivePhoto()})}</div>`:j}
          </div>
          <div class="div"></div>
          <div class="sec">${ke("Tent dimensions")}</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">${ke("Width ({unit})",{unit:d})}</span><input type="number" min=${this.s.metric?"0.3":"1"} max=${this.s.metric?"3.0":"10"} step="0.1" .value=${this.fmtTentDim(e.tW/.3048)} @change=${e=>this.onTent("tW",e)}></div>
              <div class="cg"><span class="cl">${ke("Length ({unit})",{unit:d})}</span><input type="number" min=${this.s.metric?"0.3":"1"} max=${this.s.metric?"3.6":"12"} step="0.1" .value=${this.fmtTentDim(e.tL/.3048)} @change=${e=>this.onTent("tL",e)}></div>
              <div class="cg"><span class="cl">${ke("Height ({unit})",{unit:d})}</span><input type="number" min=${this.s.metric?"0.9":"3"} max=${this.s.metric?"3.6":"12"} step="0.1" .value=${this.fmtTentDim(e.tH/.3048)} @change=${e=>this.onTent("tH",e)}></div>
            </div>
          </div>
          ${at("var(--primary-color, #03a9f4)",this.settingsDirty(),()=>this.applySettings(),()=>this.discardSettings(),"ppfd-apply")}
        `}
      </div>
    `}}yt.SET_FIELDS=["auto","src","numPlants","photo","tW","tL","tH"],yt.styles=n`
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
  `,e([ue({attribute:!1})],yt.prototype,"hass",void 0),e([ge()],yt.prototype,"config",void 0),e([ge()],yt.prototype,"tab",void 0),e([ge()],yt.prototype,"rev",void 0);const $t=[[300,"5m"],[600,"10m"],[900,"15m"],[1200,"20m"],[1800,"30m"],[3600,"1h"],[86400,"1d"]];function xt(e,t,i){const s=(e||"").trim().replace(/\s+/g,"-"),o=(t||"").replace(/^camera\./,""),a=function(e){const t=$t.find(([t])=>t===e);return t?t[1]:e?e%86400==0?e/86400+"d":e%3600==0?e/3600+"h":e%60==0?e/60+"m":`${e}s`:""}(Number(i)||0);return[s,o,a].filter(Boolean).join("_")||"timelapse"}function wt(e,t,i){const s=xt(e,t,i).toLowerCase().replace(/[^a-z0-9]+/g,"_");let o=0,a=s.length;for(;o<a&&95===s.charCodeAt(o);)o++;for(;a>o&&95===s.charCodeAt(a-1);)a--;return s.slice(o,a)||"timelapse"}class St extends de{constructor(){super(...arguments),this.config={},this._frames=[],this._idx=0,this._playing=!1,this._session=null,this._loading=!1,this._sizeBytes=0,this._settingsOpen=!1,this._cfg={},this._instances=[],this._rmConfirm=null,this._rmTimer=null,this._timer=null,this._refresh=null,this._waitTick=null,this._frameErrAt=0,this._drag=null,this._dragGrabX=0,this._dragGrabY=0,this._dragW=0,this._dragH=0,this._dragEl=null,this._dragSibs=[],this._dragLastX=0,this._dragLastY=0,this._ovMove=e=>{if(!this._drag)return;const t=this.renderRoot.querySelector(".tl-stage");if(!t)return;const i=t.getBoundingClientRect(),s=this._dragW||0,o=this._dragH||0;let a=e.clientX-this._dragGrabX,n=e.clientY-this._dragGrabY;a=Math.max(i.left,Math.min(a,i.right-s)),n=Math.max(i.top,Math.min(n,i.bottom-o));const r=this._dragSibs,l=(e,t)=>r.some(i=>e<i.right&&e+s>i.left&&t<i.bottom&&t+o>i.top);let d=this._dragLastX,c=this._dragLastY;if(l(a,c)){let e=a;for(const t of r)c<t.bottom&&c+o>t.top&&(d+s<=t.left+.5?e=Math.min(e,t.left-s):d>=t.right-.5&&(e=Math.max(e,t.right)));l(e,c)||(d=e)}else d=a;if(l(d,n)){let e=n;for(const t of r)d<t.right&&d+s>t.left&&(c+o<=t.top+.5?e=Math.min(e,t.top-o):c>=t.bottom-.5&&(e=Math.max(e,t.bottom)));l(d,e)||(c=e)}else c=n;this._dragLastX=d,this._dragLastY=c,a=d,n=c;const h=(a+s/2-i.left)/i.width*100>50?a+s:a,p=Math.max(0,Math.min(100,Math.round((h-i.left)/i.width*1e3)/10)),u=i.height>0?Math.max(0,100*(1-o/i.height)):92,g=Math.max(0,Math.min(u,Math.round((n-i.top)/i.height*1e3)/10)),m={...this._cfg.overlay_pos||{}};m[this._drag]=[p,g],this._setCfg({overlay_pos:m})},this._ovUp=()=>{window.removeEventListener("pointermove",this._ovMove),window.removeEventListener("pointerup",this._ovUp),this._drag=null}}static getStubConfig(){return{}}static getConfigElement(){return document.createElement("spider-timelapse-card-editor")}setConfig(e){const t={...e||{}};!t.tl_id&&t.camera&&(t.tl_id=wt(t.title,t.camera,Number(t.interval)||0)),this.config=t}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this._startRefresh()}disconnectedCallback(){super.disconnectedCallback(),this._stopPlay(),this._refresh&&(clearInterval(this._refresh),this._refresh=null),this._waitTick&&(clearInterval(this._waitTick),this._waitTick=null)}_statusEntity(){const e=this.hass;if(!e)return null;const t=this.config.tl_id;if(t)for(const i of Object.keys(e.states)){if(!i.startsWith("sensor.sf_timelapse"))continue;const s=e.states[i];if(s&&s.attributes&&s.attributes.tl_id===t)return s}return this.config.entity&&e.states[this.config.entity]?e.states[this.config.entity]:!t&&e.states["sensor.sf_timelapse"]?e.states["sensor.sf_timelapse"]:null}_startRefresh(){this._refresh||(this._fetchFrames(),this._refresh=setInterval(()=>this._fetchFrames(),2e4))}async _fetchFrames(){if(this.hass?.connection&&!this._loading&&!this._playing){this._loading=!0;try{const e=await this.hass.connection.sendMessagePromise({type:"sf/timelapse/sessions",tl_id:this.config.tl_id}),t=e&&e.sessions||[],i=this._session||t[0]&&t[0].session||e&&e.status&&e.status.session||null;this._session=i;const s=t.find(e=>e.session===i);if(this._sizeBytes=s&&s.bytes||0,!i)return this._frames=[],void(this._loading=!1);const o=await this.hass.connection.sendMessagePromise({type:"sf/timelapse/frames",tl_id:this.config.tl_id,session:i}),a=o&&o.frames||[],n=this._idx>=this._frames.length-1;this._frames=a,(n||this._idx>=a.length)&&(this._idx=Math.max(0,a.length-1))}catch(e){}this._loading=!1}}_play(){if(!this._frames.length)return;this._playing=!0,this._preloadAround(this._idx);const e=Number(this.config.fps)||8;this._timer=setInterval(()=>{this._idx=this._frames.length?(this._idx+1)%this._frames.length:0,this._preloadAround(this._idx)},Math.max(40,1e3/e))}_stopPlay(){this._playing=!1,this._timer&&(clearInterval(this._timer),this._timer=null),this._fetchFrames()}_preloadAround(e){const t=this._frames.length;if(t)for(let i=1;i<=4;i++){const s=this._frames[(e+i)%t];if(s&&s.url){const e=new Image;e.decoding="async",e.src=s.url}}}_onFrameError(){const e=Date.now();if(e-this._frameErrAt<3e3)return;this._frameErrAt=e;const t=this._playing;this._playing=!1,this._fetchFrames().then(()=>{this._playing=t})}_toggle(){this._playing?this._stopPlay():this._play()}_startCapture(){const e=this._statusEntity(),t=e&&Number(e.attributes.interval_s)||300;this.hass.callService("sf","timelapse_start",{tl_id:this.config.tl_id,interval:t})}_stopCapture(){this.hass.callService("sf","timelapse_stop",{tl_id:this.config.tl_id})}_export(){this._session&&this.hass.callService("sf","timelapse_export",{tl_id:this.config.tl_id,session:this._session,fps:Number(this.config.fps)||15})}async _download(){try{const e=await this.hass.connection.sendMessagePromise({type:"sf/timelapse/export_url",tl_id:this.config.tl_id,session:this._session});e&&e.url&&window.open(e.url,"_blank")}catch(e){}}_clearAll(){const e=this._statusEntity(),t=e?e.attributes.frame_count??0:0,i=this.config.title||e&&e.attributes.name||ke("this time-lapse");window.confirm(ke("Delete ALL {n} image(s) and exported videos for {name}? This cannot be undone.",{n:t,name:i}))&&(this.hass.callService("sf","timelapse_clear",{tl_id:this.config.tl_id}),this._frames=[],this._idx=0,this._session=null,this._sizeBytes=0,setTimeout(()=>this._fetchFrames(),1500))}_camFriendly(e){const t=e||this._statusEntity()?.attributes?.camera||this.config.camera||"";if(!t)return"";return this.hass?.states[t]?.attributes?.friendly_name||""||String(t).replace(/^camera\./,"")}_displayName(e){const t=e?.attributes?.label||"";return this.config.title||t||this._camFriendly(e?.attributes?.camera)||e?.attributes?.name||ke("Time-lapse")}_panelList(){const e=this.hass;if(!e)return[];const t=new Set;for(const i of Object.keys(e.states)){const e=/^sensor\.sf_([a-z0-9]+)_temperature$/.exec(i);e&&t.add(e[1])}return[...t].sort()}_openSettings(){const e=this._statusEntity()?.attributes||{};this._cfg={interval:Number(e.interval_s)||300,retention:Number(e.retention_days)||7,enabled:!!e.capturing,overlay:!!e.overlay,overlay_burn:!!e.overlay_burn,overlay_panel:e.overlay_panel||this._panelList()[0]||"",overlay_fields:Array.isArray(e.overlay_fields)?[...e.overlay_fields]:["temp","humidity","vpd","timestamp"],overlay_color:e.overlay_color||"#ffffff",overlay_font:Number(e.overlay_font)||12,overlay_grouped:!1!==e.overlay_grouped,overlay_pos:e.overlay_pos&&"object"==typeof e.overlay_pos?{...e.overlay_pos}:{},overlay_orient:"h"===e.overlay_orient?"h":"v",overlay_labels:!1!==e.overlay_labels,align:!1!==e.align,daily_at:e.daily_at||"00:00"},this._settingsOpen=!0,this._loadInstances()}async _loadInstances(){if(this.hass?.connection)try{const e=await this.hass.connection.sendMessagePromise({type:"sf/timelapse/list"});this._instances=e&&e.instances||[]}catch(e){this._instances=[]}}_armRemove(e){this._rmConfirm=e,this._rmTimer&&clearTimeout(this._rmTimer),this._rmTimer=window.setTimeout(()=>{this._rmConfirm=null,this._rmTimer=null},4e3)}_removeInstance(e){this._rmConfirm=null,this._rmTimer&&(clearTimeout(this._rmTimer),this._rmTimer=null),this.hass.callService("sf","timelapse_clear",{tl_id:e}),this.hass.callService("sf","timelapse_remove",{tl_id:e}),this._instances=this._instances.filter(t=>t.tl_id!==e),setTimeout(()=>this._loadInstances(),1200)}_setupFromConfig(){const e=this.config.camera;if(!e)return;const t={tl_id:this.config.tl_id,camera:e,label:this.config.title||"",interval:Number(this.config.interval)||300};this.config.storage_dir&&(t.storage_dir=this.config.storage_dir),86400===(Number(this.config.interval)||300)&&this.config.daily_at&&(t.daily_at=this.config.daily_at),this.hass.callService("sf","timelapse_configure",t),setTimeout(()=>this._fetchFrames(),1500)}_applySettings(){const{storage_custom:e,...t}=this._cfg||{};this.hass.callService("sf","timelapse_configure",{tl_id:this.config.tl_id,name:this.config.name,...t}),this._settingsOpen=!1,setTimeout(()=>this._fetchFrames(),1500)}_liveReadings(e){const t=this.hass,i={};if(!t||!e)return i;const s=[["temp","temperature"],["humidity","humidity"],["vpd","vpd"],["co2","co2"],["ppfd","ppfd"]];for(const[o,a]of s){const s=t.states[`sensor.sf_${e}_${a}`];if(s&&["unknown","unavailable",""].indexOf(s.state)<0){const e=s.attributes&&s.attributes.unit_of_measurement||"";i[o]=`${s.state}${e}`}}return i}_nowStamp(){const e=new Date,t=e=>String(e).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`}_dayNumber(e){const t=this._statusEntity()?.attributes?.session,i=this._ymdDate(t);if(!i)return 1;const s=e&&/^(\d{4})(\d{2})(\d{2})-/.exec(e.stamp||""),o=s?new Date(+s[1],+s[2]-1,+s[3]):new Date,a=new Date(o.getFullYear(),o.getMonth(),o.getDate());return Math.floor((a.getTime()-i.getTime())/864e5)+1}_ymdDate(e){const t=/^(\d{4})(\d{2})(\d{2})-/.exec(e||"");return t?new Date(+t[1],+t[2]-1,+t[3]):null}_setCfg(e){this._cfg={...this._cfg,...e}}_toggleField(e){const t=this._cfg.overlay_fields||[];this._setCfg({overlay_fields:t.includes(e)?t.filter(t=>t!==e):[...t,e]})}_ovActive(){return this._settingsOpen?this._cfg||{}:this._statusEntity()?.attributes||{}}_overlayOn(e){return this._settingsOpen?!(!this._cfg||!this._cfg.overlay):!(!e.attributes.overlay||e.attributes.overlay_burn)}_overlayItems(e){const t=this._ovActive(),i=t.overlay_fields||[],s=this._settingsOpen,o=s?this._liveReadings(t.overlay_panel):null,a=o&&Object.keys(o).length?o:e&&e.data,n={temp:ke("Temp"),humidity:ke("RH"),vpd:"VPD",co2:"CO2",ppfd:"PPFD"},r=!1!==t.overlay_labels,l=[];for(const t of i)if("timestamp"===t)l.push(["timestamp",e?this._fmt(e.stamp):s?this._nowStamp():ke("Time —")]);else if("day"===t)l.push(["day",ke("Day {n}",{n:this._dayNumber(e)})]);else{const e=a&&a[t],i="string"==typeof e?e.replace(/\/m[²2]\/s/g,""):e,s=r?`${n[t]||t} `:"";l.push([t,i?`${s}${i}`:`${s}—`])}if(!l.length)return[];const d=t.overlay_pos&&"object"==typeof t.overlay_pos?t.overlay_pos:{},c=(e,t,i)=>Array.isArray(e)&&2===e.length?[Number(e[0]),Number(e[1])]:[t,i];if(!1!==t.overlay_grouped){const[e,i]=c(d.group,2,70),s="h"===t.overlay_orient?"   ":"\n";return[{key:"group",text:l.map(e=>e[1]).join(s),x:e,y:i}]}return l.map((e,t)=>{const[i,s]=c(d[e[0]],2,Math.min(4+12*t,88));return{key:e[0],text:e[1],x:i,y:s}})}_ovDown(e,t){e.preventDefault(),e.stopPropagation(),this._drag=t;const i=e.currentTarget;if(i){const t=i.getBoundingClientRect();this._dragGrabX=e.clientX-t.left,this._dragGrabY=e.clientY-t.top,this._dragW=t.width,this._dragH=t.height,this._dragEl=i,this._dragLastX=t.left,this._dragLastY=t.top,this._dragSibs=Array.from(this.renderRoot.querySelectorAll(".tl-ov")).filter(e=>e!==i).map(e=>e.getBoundingClientRect())}else this._dragGrabX=0,this._dragGrabY=0,this._dragW=0,this._dragH=0,this._dragEl=null,this._dragSibs=[];window.addEventListener("pointermove",this._ovMove),window.addEventListener("pointerup",this._ovUp)}_hsv2rgb(e,t,i){const s=i*t,o=s*(1-Math.abs(e/60%2-1)),a=i-s;let n=0,r=0,l=0;return e<60?(n=s,r=o):e<120?(n=o,r=s):e<180?(r=s,l=o):e<240?(r=o,l=s):e<300?(n=o,l=s):(n=s,l=o),[Math.round(255*(n+a)),Math.round(255*(r+a)),Math.round(255*(l+a))]}_drawWheel(e){if(!e||e._drawn)return;const t=e.getContext("2d");if(!t)return;e._drawn=!0;const i=e.width,s=e.height,o=i/2,a=s/2,n=Math.min(o,a),r=t.createImageData(i,s),l=r.data;for(let e=0;e<s;e++)for(let t=0;t<i;t++){const s=t-o,r=e-a,d=Math.sqrt(s*s+r*r),c=4*(e*i+t);if(d>n){l[c+3]=0;continue}let h=180*Math.atan2(r,s)/Math.PI;h<0&&(h+=360);const[p,u,g]=this._hsv2rgb(h,d/n,1);l[c]=p,l[c+1]=u,l[c+2]=g,l[c+3]=255}t.putImageData(r,0,0)}_wheelPick(e,t){const i=t.getBoundingClientRect(),s=i.width/2,o=i.height/2,a=Math.min(s,o),n=e.clientX-i.left-s,r=e.clientY-i.top-o;let l=180*Math.atan2(r,n)/Math.PI;l<0&&(l+=360);const d=Math.min(1,Math.sqrt(n*n+r*r)/a),[c,h,p]=this._hsv2rgb(l,d,1);this._setCfg({overlay_color:"#"+[c,h,p].map(e=>e.toString(16).padStart(2,"0")).join("")})}_wheelDown(e){const t=e.currentTarget;this._wheelPick(e,t);const i=e=>this._wheelPick(e,t),s=()=>{window.removeEventListener("pointermove",i),window.removeEventListener("pointerup",s)};window.addEventListener("pointermove",i),window.addEventListener("pointerup",s)}updated(){const e=this.renderRoot.querySelector(".tl-wheel");e&&this._drawWheel(e);const t=this._statusEntity(),i=!(!t||!t.attributes.capturing||this._frames.length||!t.attributes.next_capture);i&&!this._waitTick?this._waitTick=setInterval(()=>this.requestUpdate(),1e3):!i&&this._waitTick&&(clearInterval(this._waitTick),this._waitTick=null)}_waitMsg(e){const t=e&&e.attributes.next_capture;if(!t)return ke("Waiting for the first frame…");const i=new Date(t),s=i.getTime()-Date.now();if(s<=0)return ke("Capturing…");const o=Math.ceil(s/1e3),a=Math.floor(o/60),n=o%60,r=i.getHours(),l=r<12?"AM":"PM",d=a>0?`${a}m ${n}s`:`${n}s`;return ke("First frame at {time} · in {left}",{time:`${(r+11)%12+1}:${String(i.getMinutes()).padStart(2,"0")} ${l}`.trim(),left:d})}_settingsPanel(){const e=this._cfg||{},t=Number(e.interval??this._statusEntity()?.attributes?.interval_s)||300,i=this._statusEntity(),s=i&&Number(i.attributes.frame_count)||0,o=Math.max(1,Number(e.retention??7)||7),a=86400/t,n=this._sizeBytes>0&&s>0?ke("≈ {size} at full retention",{size:this._fmtSize(this._sizeBytes/s*a*o)}):ke("size estimate appears after the first frames");return V`<div class="tl-settings">
      <div class="tl-grid" style="grid-template-columns:${86400===t?"1fr 1fr 1fr":"1fr 1fr"}">
        <label class="tl-field"><span>${ke("Snapshot interval")}</span>
          <select .value=${ye(String(t))} @change=${e=>this._setCfg({interval:Number(e.target.value)})}>
            ${[[300,"5 min"],[600,"10 min"],[900,"15 min"],[1200,"20 min"],[1800,"30 min"],[3600,"1 hour"],[86400,"1 day"]].map(([e,i])=>V`<option value=${e} ?selected=${e===t}>${ke(i)}</option>`)}
          </select></label>
        <label class="tl-field"><span>${ke("Keep (days)")}</span>
          <input type="number" min="1" .value=${String(e.retention??7)} @change=${e=>this._setCfg({retention:Number(e.target.value)})} />
          <span style="font-size:.68em;color:var(--secondary-text-color);margin-top:3px;line-height:1.2">${n}</span></label>
        ${86400===t?V`<label class="tl-field"><span>${ke("Capture daily at")}</span>
          <input type="time" .value=${ye(e.daily_at||"00:00")}
            @change=${e=>this._setCfg({daily_at:e.target.value})} /></label>`:j}
      </div>
      <div class="tl-checks">
        <label class="tl-check"><input type="checkbox" .checked=${!!e.enabled} @change=${e=>this._setCfg({enabled:e.target.checked})} />${ke("Enable capture")}</label>
        <label class="tl-check"><input type="checkbox" .checked=${!!e.overlay} @change=${e=>this._setCfg({overlay:e.target.checked})} />${ke("Env overlay")}</label>
        <label class="tl-check"><input type="checkbox" .checked=${!!e.overlay_burn} @change=${e=>this._setCfg({overlay_burn:e.target.checked})} />${ke("Burn into video")}</label>
        <label class="tl-check" title=${ke("On: first frame lands on the next 5/10/15… clock mark. Off: start right away.")}>
          <input type="checkbox" .checked=${!1!==e.align} @change=${e=>this._setCfg({align:e.target.checked})} />${ke("Start on the mark")}</label>
      </div>
      ${e.overlay?V`
        <div class="tl-row tl-adj">
          <span>${ke("Read env from")}</span>
          <select class="tl-xnarrow" .value=${ye(e.overlay_panel||"")} @change=${e=>this._setCfg({overlay_panel:e.target.value})}>
            ${this._panelList().map(t=>V`<option value=${t} ?selected=${e.overlay_panel===t}>${t}</option>`)}
          </select>
          <span class="tl-gap">${ke("Text size")}</span>
          <select class="tl-xnarrow" .value=${ye(String(Number(e.overlay_font)||12))}
            @change=${e=>this._setCfg({overlay_font:Number(e.target.value)})}>
            ${Array.from({length:16},(e,t)=>t+5).map(t=>V`<option value=${String(t)} ?selected=${(Number(e.overlay_font)||12)===t}>${t}</option>`)}
          </select>
        </div>
        <div class="tl-checks">
          <label class="tl-check"><input type="checkbox" .checked=${!1!==e.overlay_grouped}
            @change=${e=>this._setCfg({overlay_grouped:e.target.checked})} />${ke("All together")}</label>
          <label class="tl-check" title=${ke("Off: show just the values (e.g. 72°F) without the Temp/RH labels")}>
            <input type="checkbox" .checked=${!1!==e.overlay_labels}
              @change=${e=>this._setCfg({overlay_labels:e.target.checked})} />${ke("Show labels")}</label>
          ${!1!==e.overlay_grouped?V`<span class="tl-inline"><span>${ke("Layout")}</span>
            <select class="tl-narrow" .value=${ye("h"===e.overlay_orient?"h":"v")}
              @change=${e=>this._setCfg({overlay_orient:e.target.value})}>
              <option value="v" ?selected=${"h"!==e.overlay_orient}>${ke("Vertical")}</option>
              <option value="h" ?selected=${"h"===e.overlay_orient}>${ke("Horizontal")}</option>
            </select></span>`:j}
        </div>
        <div class="tl-hint">${!1!==e.overlay_grouped?ke("Readings stack in one box, in the order selected. Drag the box on the image to place it."):ke("Drag each reading on the image to place it independently.")}</div>
        <div class="tl-fields">${[["timestamp","Timestamp"],["day","Day"],["temp","Temp"],["humidity","Humidity"],["vpd","VPD"],["co2","CO2"],["ppfd","PPFD"]].map(([t,i])=>V`
          <button class="tl-chip ${(e.overlay_fields||[]).includes(t)?"on":""}"
            @click=${()=>this._toggleField(t)}>${i}</button>`)}</div>
        <label class="tl-row"><span>${ke("Text colour")}</span>
          <span class="tl-wheelwrap">
            <canvas class="tl-wheel" width="104" height="104"
              @pointerdown=${e=>this._wheelDown(e)}></canvas>
            <span class="tl-swatch" style="background:${e.overlay_color||"#ffffff"}"></span>
          </span></label>`:j}
      ${this._instances.length?V`
        <div class="tl-manage">
          <div class="tl-manage-h">${ke("Time-lapses (tap 🗑, then confirm, to delete — images included)")}</div>
          ${this._instances.map(e=>{const t=e.label||this._camFriendly(e.camera)||e.name,i=this._rmConfirm===e.tl_id;return V`
            <div class="tl-manage-row">
              <span class="tl-manage-name">${t}${e.tl_id===this.config.tl_id?ke(" (this card)"):""}
                <span class="tl-manage-sub">${(e.camera||"—").replace("camera.","")} · ${e.status&&e.status.frame_count||0} frames</span></span>
              <button class="tl-xbtn ${i?"danger":""}" title=${ke("Delete this time-lapse and its images")}
                @click=${()=>i?this._removeInstance(e.tl_id):this._armRemove(e.tl_id)}>${i?ke("Delete?"):"🗑"}</button>
            </div>`})}
        </div>`:j}
      <div class="tl-apply">
        <button class="tl-ctl" @click=${()=>this._applySettings()}>${ke("Apply")}</button>
        <button class="tl-ctl" @click=${()=>{this._settingsOpen=!1}}>${ke("Cancel")}</button>
      </div>
    </div>`}_fmt(e){const t=/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/.exec(e||"");return t?`${t[1]}-${t[2]}-${t[3]} ${t[4]}:${t[5]}:${t[6]}`:e||""}_fmtSize(e){if(!e)return"";const t=["B","KB","MB","GB","TB"];let i=0,s=e;for(;s>=1024&&i<t.length-1;)s/=1024,i++;return`${s.toFixed(s<10&&i>0?1:0)} ${t[i]}`}_fmtInterval(e){const t=Number(e)||0,i={300:"5 min",600:"10 min",900:"15 min",1800:"30 min",2700:"45 min",3600:"1 hr",86400:"1 day"};return i[t]?ke(i[t]):t>=86400?ke("{n} day",{n:Math.round(t/86400)}):t>=3600?ke("{n} hr",{n:Math.round(t/3600)}):t>=60?`${Math.round(t/60)} min`:`${t}s`}render(){Se(this.hass);const e=this._statusEntity();if(!e)return this.config.camera?V`<ha-card><div class="tl-note">${ke("Ready to create this time-lapse.")}
          <div style="margin-top:8px"><button class="tl-ctl" @click=${()=>this._setupFromConfig()}>${ke("Set up {name}",{name:this.config.title||this._camFriendly(this.config.camera)})}</button></div>
          <div style="margin-top:6px">${ke("This makes its folder and starts the time-lapse. Change the camera, title, interval or folder in the editor (⋮ → Edit) first if needed. To remove this card, edit the dashboard and delete the card.")}</div></div></ha-card>`:V`<ha-card><div class="tl-note">${ke("Time-lapse not set up yet. Open this card's editor (⋮ → Edit) and choose a camera. Give it a title and storage folder there too; set the interval and env overlay from the ⚙ settings.")}</div></ha-card>`;const t=!!e.attributes.capturing,i=!!e.attributes.export_running,s=e.attributes.last_export,o=this._frames[this._idx],a=this._frames.length;return V`<ha-card>
      <div class="tl-head">
        <span>${this._displayName(e)}</span>
        <span class="tl-right">
          <span class="tl-sub">${t?ke("● capturing"):"idle"} · ${this._fmtInterval(e.attributes.interval_s)} · ${e.attributes.frame_count??0} frames${this._sizeBytes?" · "+this._fmtSize(this._sizeBytes):""}</span>
          <ha-icon class="tl-gear" icon="mdi:cog" @click=${()=>this._settingsOpen?this._settingsOpen=!1:this._openSettings()}></ha-icon>
        </span>
      </div>
      <div class="tl-stage">
        ${o?V`<img src=${o.url} alt=${ke("frame")} decoding="sync"
                @error=${()=>this._onFrameError()} />`:V`<div class="tl-empty">${t?this._waitMsg(e):ke("No frames yet")}</div>`}
        ${this._overlayOn(e)?this._overlayItems(o).map(e=>{const t=e.x>50,i=t?`right:${100-e.x}%`:`left:${e.x}%`;return V`
          <div class="tl-ov ${this._settingsOpen?"drag":""}"
            style="${i}; top:${e.y}%; text-align:${t?"right":"left"}; font-size:${Number(this._ovActive().overlay_font)||12}px; color:${this._ovActive().overlay_color||"#ffffff"}"
            @pointerdown=${this._settingsOpen?t=>this._ovDown(t,e.key):null}>${ke(e.text)}</div>`}):j}
      </div>
      ${this._settingsOpen?this._settingsPanel():j}
      <div class="tl-scrub">
        <button class="tl-btn" title=${this._playing?ke("Pause"):ke("Play")}
          @click=${()=>this._toggle()}>${this._playing?"⏸":"▶"}</button>
        <input type="range" min="0" max=${Math.max(0,a-1)} .value=${String(this._idx)}
          @input=${e=>{this._stopPlay(),this._idx=Number(e.target.value)}} />
        <span class="tl-count">${a?this._idx+1:0}/${a}</span>
      </div>
      <div class="tl-time">${o?this._fmt(o.stamp):""}</div>
      <div class="tl-controls">
        ${t?V`<button class="tl-ctl" @click=${()=>this._stopCapture()}>${ke("Stop capture")}</button>`:V`<button class="tl-ctl" @click=${()=>this._startCapture()}>${ke("Start capture")}</button>`}
        ${a?V`<button class="tl-ctl" ?disabled=${i}
          @click=${()=>this._export()}>${ke(i?"Exporting…":"Export MP4")}</button>`:j}
        ${s?V`<button class="tl-ctl" @click=${()=>this._download()}>${ke("Download MP4")}</button>`:j}
        ${a?V`<button class="tl-ctl tl-danger" @click=${()=>this._clearAll()}>${ke("Delete all images")}</button>`:j}
      </div>
      ${e.attributes.last_export_error?V`<div class="tl-err">${ke("Export failed: {error}",{error:e.attributes.last_export_error})}</div>`:j}
    </ha-card>`}}St.styles=n`
    ha-card { overflow: hidden; }
    .tl-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px 6px; font-weight: 600; }
    .tl-sub { font-weight: 400; color: var(--secondary-text-color); font-size: .9em; }
    .tl-stage { background: #000; aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; }
    .tl-stage img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .tl-empty { color: var(--secondary-text-color); }
    .tl-note { padding: 16px; color: var(--secondary-text-color); }
    .tl-scrub { display: flex; align-items: center; gap: 10px; padding: 8px 14px 2px; }
    .tl-scrub input[type=range] { flex: 1; }
    .tl-btn { background: var(--primary-color); color: #fff; border: none; border-radius: 6px; width: 34px; height: 30px; cursor: pointer; font-size: 14px; }
    .tl-count { color: var(--secondary-text-color); font-size: .85em; min-width: 52px; text-align: right; }
    .tl-time { text-align: center; color: var(--secondary-text-color); font-size: .85em; padding: 0 14px; min-height: 1em; }
    .tl-controls { display: flex; gap: 8px; padding: 10px 14px 14px; }
    .tl-ctl { background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; padding: 7px 12px; cursor: pointer; }
    .tl-ctl:hover { border-color: var(--primary-color); }
    .tl-ctl[disabled] { opacity: .6; cursor: default; border-color: var(--divider-color); }
    .tl-danger { color: var(--error-color, #c00); margin-left: auto; }
    .tl-danger:hover { border-color: var(--error-color, #c00); }
    .tl-err { color: var(--error-color, #c00); padding: 0 14px 12px; font-size: .85em; }
    .tl-right { display: inline-flex; align-items: center; gap: 8px; }
    .tl-gear { cursor: pointer; color: var(--secondary-text-color); --mdc-icon-size: 18px; }
    .tl-gear:hover { color: var(--primary-text-color); }
    .tl-stage { position: relative; overflow: hidden; }
    .tl-overlay { position: absolute; left: 10px; bottom: 10px; background: rgba(0,0,0,.55); color: #fff; padding: 6px 9px; border-radius: 5px; font-size: .85em; line-height: 1.3; white-space: pre; pointer-events: none; }
    .tl-ov { position: absolute; background: rgba(0,0,0,.5); padding: 3px 7px; border-radius: 0; font-family: "SF Overlay", var(--primary-font-family, sans-serif); font-size: .8em; line-height: 1.25; white-space: pre; width: max-content; max-width: 96%; pointer-events: none; text-shadow: 0 1px 2px rgba(0,0,0,.85); }
    .tl-ov.drag { pointer-events: auto; cursor: move; outline: 1px dashed rgba(255,255,255,.65); outline-offset: -1px; touch-action: none; }
    .tl-wheelwrap { display: inline-flex; align-items: center; gap: 10px; }
    .tl-wheel { border-radius: 50%; cursor: crosshair; touch-action: none; }
    .tl-swatch { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--divider-color); display: inline-block; }
    .tl-hint { color: var(--secondary-text-color); font-size: .8em; padding: 2px 0 4px; }
    .tl-manage { border-top: 1px solid var(--divider-color); margin-top: 6px; padding-top: 8px; }
    .tl-manage-h { font-size: .8em; color: var(--secondary-text-color); margin-bottom: 4px; }
    .tl-manage-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 0; }
    .tl-manage-name { font-size: .88em; display: flex; flex-direction: column; }
    .tl-manage-sub { color: var(--secondary-text-color); font-size: .82em; }
    .tl-xbtn { background: none; border: none; cursor: pointer; font-size: 1em; opacity: .8; color: inherit; }
    .tl-xbtn:hover { opacity: 1; }
    .tl-xbtn.danger { opacity: 1; color: var(--error-color, #db4437); font-weight: 600; font-size: .85em;
      border: 1px solid var(--error-color, #db4437); border-radius: 6px; padding: 2px 8px; }
    .tl-settings { padding: 8px 14px 12px; border-bottom: 1px solid var(--divider-color); }
    .tl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; padding: 2px 0 4px; }
    .tl-field { display: flex; flex-direction: column; gap: 2px; min-width: 0; align-items: flex-start; }
    .tl-field > span { color: var(--secondary-text-color); font-size: .8em; }
    .tl-field select, .tl-field input { width: 7rem; max-width: 100%; box-sizing: border-box; }
    .tl-field input.tl-text { padding: 4px 6px; border: 1px solid var(--divider-color);
      border-radius: 4px; background: var(--card-background-color);
      color: var(--primary-text-color); font: inherit; }
    .tl-checks { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 6px 0; }
    .tl-check { display: inline-flex; align-items: center; gap: 6px; font-size: .85em; color: var(--secondary-text-color); cursor: pointer; }
    .tl-inline { display: inline-flex; align-items: center; gap: 6px; font-size: .85em; color: var(--secondary-text-color); }
    .tl-narrow { max-width: 150px; }
    .tl-row select.tl-xnarrow { max-width: 96px; flex: 0 0 auto; }
    .tl-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 4px 0; font-size: .9em; }
    .tl-row.tl-adj { justify-content: flex-start; gap: 10px; flex-wrap: wrap; }
    .tl-row.tl-adj > select { flex: 0 0 auto; }
    .tl-row.tl-adj .tl-gap { margin-left: 6px; }
    .tl-row > span { color: var(--secondary-text-color); }
    .tl-row select, .tl-row input[type=text], .tl-row input[type=number] { max-width: 60%; flex: 1; }
    .tl-fields { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 0 2px; }
    .tl-chip { background: var(--secondary-background-color); color: var(--secondary-text-color); border: 1px solid var(--divider-color); border-radius: 12px; padding: 3px 10px; cursor: pointer; font-size: .85em; }
    .tl-chip.on { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .tl-apply { display: flex; gap: 8px; padding-top: 8px; }
  `,e([ue({attribute:!1})],St.prototype,"hass",void 0),e([ge()],St.prototype,"config",void 0),e([ge()],St.prototype,"_frames",void 0),e([ge()],St.prototype,"_idx",void 0),e([ge()],St.prototype,"_playing",void 0),e([ge()],St.prototype,"_session",void 0),e([ge()],St.prototype,"_loading",void 0),e([ge()],St.prototype,"_sizeBytes",void 0),e([ge()],St.prototype,"_settingsOpen",void 0),e([ge()],St.prototype,"_cfg",void 0),e([ge()],St.prototype,"_instances",void 0),e([ge()],St.prototype,"_rmConfirm",void 0);class kt extends de{constructor(){super(...arguments),this._config={},this._storageCustom=!1}setConfig(e){this._config=e||{},this._storageCustom=!!this._config.storage_dir&&this._config.storage_dir!==this._defDir()}_interval(){return Number(this._config.interval)||300}_intervalOpts(){return[[300,"5 min"],[600,"10 min"],[900,"15 min"],[1200,"20 min"],[1800,"30 min"],[3600,"1 hour"],[86400,"1 day"]]}_camFriendly(e){const t=e||this._config.camera||"";if(!t)return"";return this.hass?.states[t]?.attributes?.friendly_name||""||String(t).replace(/^camera\./,"")}_defDir(e=this._config){return"/media/sf_timelapse/"+xt(e.title,e.camera,Number(e.interval)||300)}_storagePresets(){const e=[this._defDir(),"/media/sf_timelapse","/share/sf_timelapse","/config/sf_timelapse"];return e.filter((t,i)=>e.indexOf(t)===i)}_apply(e){const t={...this._config,...e},i=Number(t.interval)||300;t.camera&&(t.tl_id=wt(t.title,t.camera,i)),t.storage_dir=this._storageCustom&&t.storage_dir?t.storage_dir:this._defDir(t),this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){Se(this.hass);const e=this._intervalOpts(),t=this._interval(),i=this._storagePresets(),s=this._storageCustom&&this._config.storage_dir?this._config.storage_dir:this._defDir(),o=this._storageCustom;return V`<div class="ed">
      <div class="ed-note">${ke("Set up the time-lapse: camera, a title, the capture interval and a secure storage folder. The folder is named Title_camera_interval, so the same camera on two cards at different intervals are separate time-lapses. Retention and the env overlay are on the card's ⚙ settings.")}</div>
      <label class="ed-field"><span>${ke("Camera")}</span>
        <ha-entity-picker .hass=${this.hass} .value=${this._config.camera||""}
          .includeDomains=${["camera"]} allow-custom-entity
          @value-changed=${e=>this._apply({camera:e.detail.value})}></ha-entity-picker></label>
      <label class="ed-field"><span>${ke("Title (optional — defaults to the camera name)")}</span>
        <input type="text" class="ed-input" .value=${this._config.title||""}
          placeholder=${this._camFriendly()||ke("camera name")}
          @change=${e=>this._apply({title:e.target.value})}></label>
      <label class="ed-field"><span>${ke("Interval")}</span>
        <select class="ed-input" .value=${ye(String(t))}
          @change=${e=>this._apply({interval:Number(e.target.value)})}>
          ${e.map(([e,i])=>V`<option value=${String(e)} ?selected=${t===e}>${ke(i)}</option>`)}
        </select></label>
      ${86400===t?V`<label class="ed-field"><span>${ke("Capture daily at (time of day)")}</span>
        <input type="time" class="ed-input" .value=${this._config.daily_at||"00:00"}
          @change=${e=>this._apply({daily_at:e.target.value})}></label>`:j}
      <label class="ed-field"><span>${ke("Storage folder (secure — never /www)")}</span>
        <select class="ed-input" .value=${ye(o?"__custom__":s)}
          @change=${e=>{const t=e.target.value;"__custom__"===t?this._storageCustom=!0:(this._storageCustom=!1,this._apply({storage_dir:t}))}}>
          ${i.map(e=>V`<option value=${e} ?selected=${!o&&s===e}>${e}</option>`)}
          <option value="__custom__" ?selected=${o}>${ke("Custom…")}</option>
        </select></label>
      ${o?V`<label class="ed-field"><span>${ke("Custom folder")}</span>
        <input type="text" class="ed-input" .value=${this._config.storage_dir||s} placeholder=${ke("/media/… (never /www)")}
          @change=${e=>this._apply({storage_dir:e.target.value})}></label>`:j}
    </div>`}}kt.styles=n`
    .ed { display: flex; flex-direction: column; gap: 12px; padding: 8px 4px; }
    .ed-note { color: var(--secondary-text-color); font-size: .9em; }
    ha-entity-picker { display: block; width: 100%; }
    .ed-field { display: flex; flex-direction: column; gap: 4px; font-size: .9em; }
    .ed-field > span { color: var(--secondary-text-color); }
    .ed-field select, .ed-input { padding: 7px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
  `,e([ue({attribute:!1})],kt.prototype,"hass",void 0),e([ge()],kt.prototype,"_config",void 0),e([ge()],kt.prototype,"_storageCustom",void 0);class Ot extends de{constructor(){super(...arguments),this._config={}}setConfig(e){this._config=e||{}}updated(){this.hass&&this._config&&this._config.type&&!this._config.card_id&&this._emit({card_id:"ppfd_"+Math.random().toString(36).slice(2,8)})}_emit(e){const t={...this._config,...e};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_set(e,t){this._emit({[e]:t})}_setDefault(e,t){this._emit({defaults:{...this._config.defaults||{},[e]:t}})}_setTent(e,t){this._emit({tent:{...this._config.tent||{},[e]:t}})}_brightOptions(){const e=this.hass;return e?Object.keys(e.states).filter(e=>e.startsWith("light.sf_")||e.startsWith("number.sf_")&&/schedule_brightness/i.test(e)).sort().map(t=>({id:t,name:e.states[t].attributes.friendly_name||t})):[]}_metric(){const e=(this._config?.unit_system||"auto").toLowerCase();if("metric"===e)return!0;if("imperial"===e)return!1;const t=this.hass?.config?.unit_system;return!(!t||!t.length)&&"mi"!==t.length}render(){Se(this.hass);const e=this._config||{},t=e.defaults||{},i=e.tent||{},s=(e,t)=>null==e?t:e,o=this._metric(),a=o?"cm":"in",n=o?"m":"ft",r=e=>o?Math.round(2.54*e):e,l=e=>o?+(e/2.54).toFixed(2):e,d=e=>o?+(.3048*e).toFixed(2):+(+e).toFixed(1),c=e=>o?+(e/.3048).toFixed(3):e,h=o?"0.05":"0.1";return V`<div class="ped">
      <div class="ped-note">${ke("Set up the PPFD visualizer. Each card keeps its own settings.")}</div>
      <label class="pf"><span>${ke("Title")}</span>
        <input type="text" .value=${e.title||""} @change=${e=>this._set("title",e.target.value)}></label>
      <label class="pf"><span>${ke("Light model")}</span>
        <select .value=${ye(e.light_model||"SE4500")} @change=${e=>this._set("light_model",e.target.value)}>
          ${vt().map(t=>V`<optgroup label=${ke(t.label)}>
            ${t.models.map(t=>V`<option value=${t} ?selected=${e.light_model===t}>${t}</option>`)}
          </optgroup>`)}
        </select></label>
      <label class="pf"><span>${ke("Units")}</span>
        <select .value=${ye(e.unit_system||"auto")} @change=${e=>this._set("unit_system",e.target.value)}>
          <option value="auto">${ke("Auto (follow HA)")}</option>
          <option value="imperial">${ke("Imperial (in / ft)")}</option>
          <option value="metric">${ke("Metric (cm / m)")}</option>
        </select></label>
      <div class="ped-h">${ke("Brightness")}</div>
      <label class="pf pf-row"><input type="checkbox" .checked=${!!t.auto_brightness}
          @change=${e=>this._setDefault("auto_brightness",e.target.checked)}>
        <span>${ke("Auto-read brightness from a light")}</span></label>
      <label class="pf"><span>${ke("Light source")}</span>
        <select .value=${ye(t.brightness_source||"")} @change=${e=>this._setDefault("brightness_source",e.target.value)}>
          <option value="" ?selected=${!t.brightness_source}>${ke("— none —")}</option>
          ${this._brightOptions().map(e=>V`<option value=${e.id} ?selected=${t.brightness_source===e.id}>${ke(e.name)}</option>`)}
        </select></label>
      <div class="ped-note">${ke("Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target). This is the card's default — the card's own Settings tab can change it live.")}</div>
      <div class="ped-h">${ke("Defaults")}</div>
      <div class="pgrid">
        <label class="pf"><span>${ke("Light height ({unit})",{unit:a})}</span><input type="number" min="0" .value=${String(r(s(t.height_inches,18)))} @change=${e=>this._setDefault("height_inches",l(Number(e.target.value)))}></label>
        <label class="pf"><span>${ke("Plant height ({unit})",{unit:a})}</span><input type="number" min="0" .value=${String(r(s(t.plant_height_inches,12)))} @change=${e=>this._setDefault("plant_height_inches",l(Number(e.target.value)))}></label>
        <label class="pf"><span>${ke("Plants")}</span><input type="number" min="1" .value=${String(s(t.num_plants,2))} @change=${e=>this._setDefault("num_plants",Number(e.target.value))}></label>
        <label class="pf"><span>${ke("Brightness (%)")}</span><input type="number" min="0" max="100" .value=${String(s(t.dimmer_percent,100))} @change=${e=>this._setDefault("dimmer_percent",Number(e.target.value))}></label>
        <label class="pf"><span>${ke("Photoperiod (h)")}</span><input type="number" min="0" max="24" .value=${String(s(t.photoperiod_hours,18))} @change=${e=>this._setDefault("photoperiod_hours",Number(e.target.value))}></label>
      </div>
      <div class="ped-h">${ke("Tent size ({unit})",{unit:n})}</div>
      <div class="pgrid">
        <label class="pf"><span>${ke("Width")}</span><input type="number" min="0" step=${h} .value=${String(d(s(i.width_ft,2)))} @change=${e=>this._setTent("width_ft",c(Number(e.target.value)))}></label>
        <label class="pf"><span>${ke("Length")}</span><input type="number" min="0" step=${h} .value=${String(d(s(i.length_ft,4)))} @change=${e=>this._setTent("length_ft",c(Number(e.target.value)))}></label>
        <label class="pf"><span>${ke("Height")}</span><input type="number" min="0" step=${h} .value=${String(d(s(i.height_ft,6.5)))} @change=${e=>this._setTent("height_ft",c(Number(e.target.value)))}></label>
      </div>
    </div>`}}Ot.styles=n`
    .ped { display: flex; flex-direction: column; gap: 10px; padding: 8px 4px; }
    .ped-note { color: var(--secondary-text-color); font-size: .9em; }
    .ped-h { font-weight: 600; margin-top: 4px; }
    .pf { display: flex; flex-direction: column; gap: 3px; font-size: .9em; }
    .pf.pf-row { flex-direction: row; align-items: center; gap: 8px; }
    .pf.pf-row > span { color: var(--primary-text-color); }
    .pf.pf-row input { width: auto; }
    .pf > span { color: var(--secondary-text-color); }
    .pf select, .pf input { padding: 6px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    .pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  `,e([ue({attribute:!1})],Ot.prototype,"hass",void 0),e([ge()],Ot.prototype,"_config",void 0);class Dt extends de{constructor(){super(...arguments),this._config={}}setConfig(e){this._config=e||{}}_emit(e){const t={...this._config,...e};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_set(e,t){this._emit({[e]:t})}_seLights(){const e=this.hass;return e?ut(e).map(t=>({slot:t,name:Ge(e,t)||`SE light (${t})`})):[]}render(){Se(this.hass);const e=this._config||{},t=this._seLights();return V`<div class="ped">
      <div class="ped-note">${ke("Set up the Spider Farmer SE light card. Each card keeps its own settings.")}</div>
      <label class="pf"><span>${ke("Title")}</span>
        <input type="text" .value=${e.title||""} placeholder=${ke("Spider Light")}
          @change=${e=>this._set("title",e.target.value)}></label>
      <label class="pf"><span>${ke("SE light")}</span>
        <select .value=${ye(e.light||"")} @change=${e=>this._set("light",e.target.value)}>
          <option value="" ?selected=${!e.light}>${ke("Auto (first found)")}</option>
          ${t.map(t=>V`<option value=${t.slot} ?selected=${e.light===t.slot}>${t.name}</option>`)}
        </select></label>
      ${0===t.length?V`<div class="ped-note">${ke("No Spider Farmer SE light found yet — add the card once the light is online, or leave it on Auto.")}</div>`:j}
      <label class="pf"><span>${ke("Accent colour")}</span>
        <input type="color" .value=${e.accent||Oe}
          @change=${e=>this._set("accent",e.target.value)}></label>
    </div>`}}Dt.styles=n`
    .ped { display: flex; flex-direction: column; gap: 10px; padding: 8px 4px; }
    .ped-note { color: var(--secondary-text-color); font-size: .9em; }
    .pf { display: flex; flex-direction: column; gap: 3px; font-size: .9em; }
    .pf > span { color: var(--secondary-text-color); }
    .pf select, .pf input { padding: 6px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    .pf input[type="color"] { height: 38px; padding: 2px; }
  `,e([ue({attribute:!1})],Dt.prototype,"hass",void 0),e([ge()],Dt.prototype,"_config",void 0),customElements.get("spider-light-card-editor")||customElements.define("spider-light-card-editor",Dt),customElements.get("spider-ppfd-card-editor")||customElements.define("spider-ppfd-card-editor",Ot),customElements.get("spider-farmer-card")||customElements.define("spider-farmer-card",ct),customElements.get("spider-timelapse-card")||customElements.define("spider-timelapse-card",St),customElements.get("spider-timelapse-card-editor")||customElements.define("spider-timelapse-card-editor",kt),customElements.get("spider-farmer-card-editor")||customElements.define("spider-farmer-card-editor",ht),customElements.get("spider-light-card")||customElements.define("spider-light-card",gt),customElements.get("ppfd-3d-card")||customElements.define("ppfd-3d-card",yt);const Tt=window.customCards=window.customCards||[];Se({language:"undefined"!=typeof document&&document.documentElement.lang||"en"});const Ct=e=>{Tt.some(t=>t&&t.type===e.type)||Tt.push({...e,name:ke(e.name),description:ke(e.description)})};Ct({type:"spider-farmer-card",name:"Spider Farmer Card",description:"Tent overview + config for the Spider Farmer Bridge integration",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),Ct({type:"spider-light-card",name:"Spider Light Card",description:"Brightness dial, mode, and schedule for a Spider Farmer SE-series light",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),Ct({type:"ppfd-3d-card",name:"PPFD 3D Grow Light Card",description:"3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),Ct({type:"spider-timelapse-card",name:"Spider Time-lapse Card",description:"Camera time-lapse for the Spider Farmer Bridge — capture, scrub, env overlay, export",preview:!0,documentationURL:"https://github.com/cobragt2000/spider_farmer_bridge"}),console.info("%c SPIDER-FARMER-CARD %c v0.21.134 ","color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px","color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"),(()=>{const e=["spider-farmer-card","spider-light-card","ppfd-3d-card","spider-timelapse-card"],t=new Set([...e,...e.map(e=>`custom:${e}`)]),i=()=>{const e=[["spider-farmer-card",ct],["spider-farmer-card-editor",ht],["spider-light-card",gt],["spider-light-card-editor",Dt],["ppfd-3d-card",yt],["spider-timelapse-card",St],["spider-timelapse-card-editor",kt]];for(const[t,i]of e)if(!customElements.get(t))try{customElements.define(t,i)}catch{}},s=()=>{let e=0;for(const i of(()=>{const e=[],t=new Set,i=s=>{if(!s||t.has(s))return;t.add(s);let o=[];try{o=s.querySelectorAll("hui-error-card")}catch{return}o.forEach(t=>e.push(t));let a=[];try{a=s.querySelectorAll("*")}catch{return}a.forEach(e=>{const t=e.shadowRoot;t&&i(t)})};return i(document),e})()){const s=i._config||{},o=s.origConfig&&s.origConfig.type||s.type||"";t.has(o)&&(i.dispatchEvent(new CustomEvent("ll-rebuild",{bubbles:!0,composed:!0})),e++)}return e};let o=0;const a=()=>{i(),s(),++o<12&&setTimeout(a,250)},n=()=>{i(),a()};"complete"===document.readyState?n():window.addEventListener("load",n,{once:!0})})();export{ct as SpiderFarmerCard,ht as SpiderFarmerCardEditor,gt as SpiderLightCard,Dt as SpiderLightCardEditor,yt as SpiderPpfdCard,Ot as SpiderPpfdCardEditor,St as SpiderTimelapseCard,kt as SpiderTimelapseCardEditor};
