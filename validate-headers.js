(()=>{"use strict";var e={143:function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),i=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)};Object.defineProperty(t,"__esModule",{value:!0}),t.Token=void 0,i(r(802),t),i(r(788),t),i(r(816),t);var s=r(472);Object.defineProperty(t,"Token",{enumerable:!0,get:function(){return s.Token}})},788:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ParseError=t.parseItem=t.parseList=t.parseDictionary=void 0;const n=r(816),i=r(472),s=r(689);t.parseDictionary=function(e){return new a(e).parseDictionary()},t.parseList=function(e){return new a(e).parseList()},t.parseItem=function(e){return new a(e).parseItem()};class o extends Error{constructor(e,t){super(`Parse error: ${t} at offset ${e}`)}}t.ParseError=o;class a{constructor(e){this.input=e,this.pos=0}parseDictionary(){this.skipWS();const e=new Map;for(;!this.eof();){const t=this.parseKey();let r;if("="===this.lookChar()?(this.pos++,r=this.parseItemOrInnerList()):r=[!0,this.parseParameters()],e.set(t,r),this.skipOWS(),this.eof())return e;if(this.expectChar(","),this.pos++,this.skipOWS(),this.eof())throw new o(this.pos,"Dictionary contained a trailing comma")}return e}parseList(){this.skipWS();const e=[];for(;!this.eof();){if(e.push(this.parseItemOrInnerList()),this.skipOWS(),this.eof())return e;if(this.expectChar(","),this.pos++,this.skipOWS(),this.eof())throw new o(this.pos,"A list may not end with a trailing comma")}return e}parseItem(e=!0){e&&this.skipWS();const t=[this.parseBareItem(),this.parseParameters()];return e&&this.checkTrail(),t}parseItemOrInnerList(){return"("===this.lookChar()?this.parseInnerList():this.parseItem(!1)}parseInnerList(){this.expectChar("("),this.pos++;const e=[];for(;!this.eof();){if(this.skipWS(),")"===this.lookChar())return this.pos++,[e,this.parseParameters()];e.push(this.parseItem(!1));const t=this.lookChar();if(" "!==t&&")"!==t)throw new o(this.pos,"Expected a whitespace or ) after every item in an inner list")}throw new o(this.pos,"Could not find end of inner list")}parseBareItem(){const e=this.lookChar();if(e.match(/^[-0-9]/))return this.parseIntegerOrDecimal();if('"'===e)return this.parseString();if(e.match(/^[A-Za-z*]/))return this.parseToken();if(":"===e)return this.parseByteSequence();if("?"===e)return this.parseBoolean();throw new o(this.pos,"Unexpected input")}parseParameters(){const e=new Map;for(;!this.eof()&&";"===this.lookChar();){this.pos++,this.skipWS();const t=this.parseKey();let r=!0;"="===this.lookChar()&&(this.pos++,r=this.parseBareItem()),e.set(t,r)}return e}parseIntegerOrDecimal(){let e="integer",t=1,r="";if("-"===this.lookChar()&&(t=-1,this.pos++),!u(this.lookChar()))throw new o(this.pos,"Expected a digit (0-9)");for(;!this.eof();){const t=this.getChar();if(u(t))r+=t;else{if("integer"!==e||"."!==t){this.pos--;break}if(r.length>12)throw new o(this.pos,"Exceeded maximum decimal length");r+=".",e="decimal"}if("integer"===e&&r.length>15)throw new o(this.pos,"Exceeded maximum integer length");if("decimal"===e&&r.length>16)throw new o(this.pos,"Exceeded maximum decimal length")}if("integer"===e)return parseInt(r,10)*t;if(r.endsWith("."))throw new o(this.pos,"Decimal cannot end on a period");if(r.split(".")[1].length>3)throw new o(this.pos,"Number of digits after the decimal point cannot exceed 3");return parseFloat(r)*t}parseString(){let e="";for(this.expectChar('"'),this.pos++;!this.eof();){const t=this.getChar();if("\\"===t){if(this.eof())throw new o(this.pos,"Unexpected end of input");const t=this.getChar();if("\\"!==t&&'"'!==t)throw new o(this.pos,"A backslash must be followed by another backslash or double quote");e+=t}else{if('"'===t)return e;if(!s.isAscii(t))throw new Error("Strings must be in the ASCII range");e+=t}}throw new o(this.pos,"Unexpected end of input")}parseToken(){let e="";for(;!this.eof();){const t=this.lookChar();if(!/^[:/!#$%&'*+\-.^_`|~A-Za-z0-9]$/.test(t))return new i.Token(e);e+=this.getChar()}return new i.Token(e)}parseByteSequence(){this.expectChar(":"),this.pos++;const e=this.input.indexOf(":",this.pos);if(-1===e)throw new o(this.pos,'Could not find a closing ":" character to mark end of Byte Sequence');const t=this.input.substring(this.pos,e);if(this.pos+=t.length+1,!/^[A-Za-z0-9+/=]*$/.test(t))throw new o(this.pos,"ByteSequence does not contain a valid base64 string");return new n.ByteSequence(t)}parseBoolean(){this.expectChar("?"),this.pos++;const e=this.getChar();if("1"===e)return!0;if("0"===e)return!1;throw new o(this.pos,'Unexpected character. Expected a "1" or a "0"')}parseKey(){if(!this.lookChar().match(/^[a-z*]/))throw new o(this.pos,"A key must begin with an asterisk or letter (a-z)");let e="";for(;!this.eof();){const t=this.lookChar();if(!/^[a-z0-9_\-.*]$/.test(t))return e;e+=this.getChar()}return e}lookChar(){return this.input[this.pos]}expectChar(e){if(this.lookChar()!==e)throw new o(this.pos,`Expected ${e}`)}getChar(){return this.input[this.pos++]}eof(){return this.pos>=this.input.length}skipOWS(){for(;;){const e=this.input.substr(this.pos,1);if(" "!==e&&"\t"!==e)break;this.pos++}}skipWS(){for(;" "===this.lookChar();)this.pos++}checkTrail(){if(this.skipWS(),!this.eof())throw new o(this.pos,"Unexpected characters at end of input")}}t.default=a;const c=/^[0-9]$/;function u(e){return c.test(e)}},802:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.serializeItem=t.serializeDictionary=t.serializeList=t.SerializeError=void 0;const n=r(816),i=r(472),s=r(689);class o extends Error{}function a(e){return u(e[0])+h(e[1])}function c(e){return`(${e[0].map((e=>a(e))).join(" ")})${h(e[1])}`}function u(e){if("number"==typeof e)return Number.isInteger(e)?function(e){if(e<-999999999999999||e>999999999999999)throw new o("Structured headers can only encode integers in the range range of -999,999,999,999,999 to 999,999,999,999,999 inclusive");return e.toString()}(e):function(e){const t=e.toFixed(3).replace(/0+$/,"");if(t.split(".")[0].replace("-","").length>12)throw new o("Fractional numbers are not allowed to have more than 12 significant digits before the decimal point");return t}(e);if("string"==typeof e)return function(e){if(!s.isAscii(e))throw new o("Only ASCII strings may be serialized");return`"${e.replace(/("|\\)/g,(e=>"\\"+e))}"`}(e);if(e instanceof i.Token)return function(e){return e.toString()}(e);if(e instanceof n.ByteSequence)return function(e){return`:${e.toBase64()}:`}(e);if("boolean"==typeof e)return function(e){return e?"?1":"?0"}(e);throw new o("Cannot serialize values of type "+typeof e)}function h(e){return Array.from(e).map((([e,t])=>{let r=";"+l(e);return!0!==t&&(r+="="+u(t)),r})).join("")}function l(e){if(!s.isValidKeyStr(e))throw new o("Keys in dictionaries must only contain lowercase letter, numbers, _-*. and must start with a letter or *");return e}t.SerializeError=o,t.serializeList=function(e){return e.map((e=>s.isInnerList(e)?c(e):a(e))).join(", ")},t.serializeDictionary=function(e){return Array.from(e.entries()).map((([e,t])=>{let r=l(e);return!0===t[0]?r+=h(t[1]):(r+="=",s.isInnerList(t)?r+=c(t):r+=a(t)),r})).join(", ")},t.serializeItem=a},472:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Token=void 0;const n=r(689);t.Token=class{constructor(e){if(!n.isValidTokenStr(e))throw new TypeError("Invalid character in Token string. Tokens must start with *, A-Z and the rest of the string may only contain a-z, A-Z, 0-9, :/!#$%&'*+-.^_`|~");this.value=e}toString(){return this.value}}},816:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ByteSequence=void 0,t.ByteSequence=class{constructor(e){this.base64Value=e}toBase64(){return this.base64Value}}},689:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isInnerList=t.isValidKeyStr=t.isValidTokenStr=t.isAscii=void 0;const r=/^[\x20-\x7E]*$/,n=/^[a-zA-Z*][:/!#$%&'*+\-.^_`|~A-Za-z0-9]*$/,i=/^[a-z*][*\-_.a-z0-9]*$/;t.isAscii=function(e){return r.test(e)},t.isValidTokenStr=function(e){return n.test(e)},t.isValidKeyStr=function(e){return i.test(e)},t.isInnerList=function(e){return Array.isArray(e[0])}}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}(()=>{const e=/^[0-9]+$/,t=/^-?[0-9]+$/,n=/^0[xX][0-9A-Fa-f]{1,32}$/;class i{constructor(){this.path=[],this.errors=[],this.warnings=[]}error(e){this.errors.push({path:[...this.path],msg:e})}warn(e){this.warnings.push({path:[...this.path],msg:e})}scope(e,t){this.path.push(e),t(),this.path.pop()}result(){return{errors:this.errors,warnings:this.warnings}}validate(e,t){l()(this,e)&&(Object.entries(t).forEach((([t,r])=>this.scope(t,(()=>r(this,e,t))))),Object.keys(e).forEach((e=>{e in t||this.scope(e,(()=>this.warn("unknown field")))})))}}function s(e=(()=>{})){return(t,r,n)=>{n in r?e(t,r[n]):t.error("missing required field")}}function o(e=(()=>{})){return(t,r,n)=>{n in r&&e(t,r[n])}}function a(e=(()=>{})){return(t,r)=>{"string"!=typeof r?t.error("must be a string"):e(t,r)}}function c(e,t){"boolean"!=typeof t&&e.error("must be a boolean")}function u(e){return"object"==typeof e&&e.constructor===Object}function h(e){return e instanceof Array}function l(e=(()=>{}),t=1/0){return(r,n)=>{if(u(n)){const i=Object.entries(n);return i.length>t&&r.error(`exceeds the maximum number of keys (${t})`),i.forEach((([t,n])=>r.scope(t,(()=>e(r,t,n))))),!0}r.error("must be an object")}}function p(e=(()=>{}),t=1/0,r=0){return(n,i)=>{if(h(i))return(i.length>t||i.length<r)&&n.error(`List size out of expected bounds. Size must be within [${r}, ${t}]`),void i.forEach(((t,r)=>n.scope(r,(()=>e(n,t)))));n.error("must be a list")}}const f=a(((t,r)=>{e.test(r)?BigInt(r)>2n**64n-1n&&t.error("must fit in an unsigned 64-bit integer"):t.error(`must be a uint64 (must match ${e})`)}));function g(e=(()=>{})){return(t,r)=>{"number"!=typeof r?t.error("must be a number"):e(t,r)}}const d=g(((e,t)=>{(!Number.isInteger(t)||t<0)&&e.error("must be a non-negative integer")})),m=g(((e,t)=>{(!Number.isInteger(t)||t<=0)&&e.error("must be a positive integer")})),w=a(((e,r)=>{t.test(r)?((r=BigInt(r))<(-2n)**(64n-1n)||r>2n**(64n-1n)-1n)&&e.error("must fit in a signed 64-bit integer"):e.error(`must be an int64 (must match ${t})`)})),y=a(((e,t)=>{if(!n.test(t))return e.error(`must be a hex128 (must match ${n})`)})),b=a(((e,t)=>{try{t=new URL(t)}catch{return void e.error("must contain a valid URL")}"https:"!==t.protocol&&("http:"!==t.protocol||"localhost"!==t.hostname&&"127.0.0.1"!==t.hostname)&&e.error("must contain a potentially trustworthy URL"),"/"!==t.pathname&&e.warn("contains a path that will be ignored"),""!==t.search&&e.warn("contains a query string that will be ignored"),""!==t.hash&&e.warn("contains a fragment that will be ignored")})),k=p(b,3,1),v=(e,t)=>"string"==typeof t?b(e,t):h(t)?k(e,t):void e.error("must be a list or a string"),_=(e,t)=>{"number"==typeof t?(!Number.isInteger(t)||t<0||t>20)&&e.error("must be an integer in the range [0, 20]"):e.error("must be an integer in the range [0, 20]")},S=(e,t)=>{e.validate(t,{start_time:o(d),end_times:s(p(m,5,1))})},x=(e,t)=>"number"==typeof t?d(e,t):"string"==typeof t?f(e,t):void e.error("must be a non-negative integer or a string"),C=()=>l(((e,t,r)=>{p(a())(e,r)})),I=((e=(()=>{}),t,r)=>(n,i,s)=>u(i)?e(n,i,s):h(i)?p(e,t,r)(n,i,s):void n.error("must be a list or an object"))(C()),$=l(((e,t,r)=>{y(e,r)}),20);function O(e){const t=new i;return t.validate(e,{aggregatable_report_window:o(x),event_report_window:o(x),event_report_windows:o(S),aggregation_keys:o($),debug_key:o(f),debug_reporting:o(c),destination:s(v),expiry:o(x),filter_data:o(l(((e,t,r)=>{"source_type"!==t?p(a(),50)(e,r):e.error("is prohibited because it is implicitly set")}),50)),priority:o(w),source_event_id:o(f),max_event_level_reports:o(_)}),"object"==typeof e&&"event_report_window"in e&&"event_report_windows"in e&&t.error("event_report_window and event_report_windows in the same source"),t.result()}const L=p(((e,t)=>e.validate(t,{filters:o(I),key_piece:s(y),not_filters:o(I),source_keys:o(p(a(),20))}))),j=l(((e,t,r)=>{(!Number.isInteger(r)||r<=0||r>65536)&&e.error("must be an integer in the range (1, 65536]")}),20),q=p(((e,t)=>e.validate(t,{deduplication_key:o(f),filters:o(I),not_filters:o(I),priority:o(w),trigger_data:o(f)}))),E=p(((e,t)=>e.validate(t,{deduplication_key:o(f),filters:o(C()),not_filters:o(C())}))),z=a(((e,t)=>{const r="exclude",n="include";t!==r&&t!==n&&e.error(`must match '${r}' or '${n}' (case-sensitive)`)}));function A(e){const t=new i;return t.validate(e,{aggregatable_trigger_data:o(L),aggregatable_values:o(j),aggregation_coordinator_origin:o(b),debug_key:o(f),debug_reporting:o(c),event_trigger_data:o(q),filters:o(I),not_filters:o(I),aggregatable_deduplication_keys:o(E),aggregatable_source_registration_time:o(z)}),t.result()}function T(e,t){let r;try{r=JSON.parse(e)}catch(e){return{errors:[{msg:e.message}],warnings:[]}}return t(r)}var P=r(143);function B(e){const t=function(e){if("string"!=typeof e)return"must be a string"}(e);if(t)return t;try{e=new URL(e)}catch{return"must contain a valid URL"}return"https:"!==e.protocol&&("http:"!==e.protocol||"localhost"!==e.hostname&&"127.0.0.1"!==e.hostname)?"must contain a potentially trustworthy URL":void 0}function U(e=(()=>{})){return t=>{if(void 0!==t)return e(t)}}function W(e){if("boolean"!=typeof e)return"must be a boolean"}const D=document.querySelector("form"),N=D.querySelector("textarea"),M=document.querySelector("#errors"),R=document.querySelector("#warnings"),V=document.querySelector("#success"),K=document.querySelector("#pathful-issue"),Z=e=>"string"==typeof e?`["${e}"]`:`[${e}]`,F=({path:e,msg:t})=>{let r;return e instanceof Array?0===e.length?(r=document.createElement("li"),r.textContent=`JSON root ${t}`):(r=K.content.cloneNode(!0),r.querySelector("code").textContent=e.map(Z).join(""),r.querySelector("span").textContent=t):(r=document.createElement("li"),r.textContent=t),r},J=()=>D.elements.header.value;D.addEventListener("input",(()=>{let e;switch(J()){case"source":e=T(N.value,O);break;case"trigger":e=T(N.value,A);break;case"os-source":case"os-trigger":e=function(e,t){const r=[],n=[];let i;try{i=(0,P.parseList)(e)}catch(e){return r.push({msg:e.toString()}),{errors:r,warnings:n}}for(const[e,s]of i){const i=B(e);i&&r.push({msg:i,path:[]}),Object.entries(t).forEach((([e,t])=>{const n=t(s.get(e));n&&r.push({msg:n,path:[e]}),s.delete(e)}));for(const e of s.keys())n.push({msg:"unknown parameter",path:[e]})}return{errors:r,warnings:n}}(N.value,{"debug-reporting":U(W)});break;case"eligible":e=function(e){const t=[],r=[];let n;try{n=(0,P.parseDictionary)(e)}catch(e){return t.push({msg:e.toString()}),{errors:t,warnings:r}}for(const[e,t]of n){switch(e){case"event-source":case"trigger":break;case"navigation-source":r.push({msg:"may only be specified in browser-initiated requests",path:[e]});break;default:r.push({msg:"unknown dictionary key",path:[e]})}!0!==t[0]&&r.push({msg:"ignoring dictionary value",path:[e]}),0!==t[1].size&&r.push({msg:"ignoring parameters",path:[e]})}return{errors:t,warnings:r}}(N.value);break;default:return}const t=document.createElement("div");t.textContent=0===e?.errors?.length&&0===e?.warnings?.length?"The header is valid.":"",V.replaceChildren(t),M.replaceChildren(...e.errors.map(F)),R.replaceChildren(...e.warnings.map(F))})),document.querySelector("#linkify").addEventListener("click",(async()=>{const e=new URL(location);e.search="",e.searchParams.set("header",J()),e.searchParams.set("json",N.value),await navigator.clipboard.writeText(e.toString())}));const X=new URLSearchParams(location.search),G=X.get("json");switch(G&&(N.value=G),X.get("header")){case"eligible":D.querySelector("input[value=eligible]").click();break;case"os-source":D.querySelector("input[value=os-source]").click();break;case"os-trigger":D.querySelector("input[value=os-trigger]").click();break;case"trigger":D.querySelector("input[value=trigger]").click();break;default:D.querySelector("input[value=source]").click()}})()})();