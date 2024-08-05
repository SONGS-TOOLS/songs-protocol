'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cx = _interopDefault(require('classnames'));
var React = require('react');
var React__default = _interopDefault(React);
var Lottie = _interopDefault(require('react-lottie'));
var Image = _interopDefault(require('next/image'));
var styled = require('styled-components');
var styled__default = _interopDefault(styled);
var ethers = require('ethers');
var reactDropzone = require('react-dropzone');
var reactDialog = require('@radix-ui/react-dialog');
var framerMotion = require('framer-motion');

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@import url(\"https://use.typekit.net/rgd2ttk.css\");\n\n/*! tailwindcss v3.4.3 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:\"\"}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]{display:none}h1,h2,h3,h4{font-family:mundial,sans-serif;font-weight:800}b,big,button,caption,em,h5,i,mark,p,small,span,strike,strong,sub,sup,table,td,th,u{font-family:proxima-nova,sans-serif}*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:0}.-left-1{left:-4px}.-top-1{top:-4px}.bottom-0{bottom:0}.bottom-3{bottom:.75rem}.left-0{left:0}.left-1\\/2{left:50%}.right-0{right:0}.right-3{right:.75rem}.top-0{top:0}.top-1\\/2{top:50%}.top-\\[14px\\]{top:14px}.z-20{z-index:20}.z-30{z-index:30}.z-50{z-index:50}.col-span-3{grid-column:span 3/span 3}.col-span-6{grid-column:span 6/span 6}.col-start-1{grid-column-start:1}.col-end-7{grid-column-end:7}.m-0{margin:0}.m-2{margin:8px}.m-5{margin:1.25rem}.my-4{margin-bottom:16px;margin-top:16px}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:.75rem}.mb-6{margin-bottom:24px}.mb-8{margin-bottom:32px}.mr-1{margin-right:4px}.mr-3{margin-right:.75rem}.mr-5{margin-right:1.25rem}.mt-2{margin-top:8px}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.table{display:table}.grid{display:grid}.contents{display:contents}.hidden{display:none}.h-1\\/2{height:50%}.h-10{height:40px}.h-11{height:2.75rem}.h-12{height:48px}.h-14{height:56px}.h-20{height:80px}.h-4{height:16px}.h-5{height:1.25rem}.h-6{height:24px}.h-8{height:32px}.h-\\[100px\\]{height:100px}.h-full{height:100%}.h-screen{height:100vh}.min-h-\\[120px\\]{min-height:120px}.min-h-\\[200px\\]{min-height:200px}.min-h-\\[400px\\]{min-height:400px}.w-10{width:40px}.w-11{width:2.75rem}.w-12{width:48px}.w-14{width:56px}.w-32{width:8rem}.w-4{width:16px}.w-5{width:1.25rem}.w-6{width:24px}.w-8{width:32px}.w-\\[2px\\]{width:2px}.w-fit{width:-moz-fit-content;width:fit-content}.w-full{width:100%}.w-screen{width:100vw}.min-w-\\[200px\\]{min-width:200px}.max-w-3xl{max-width:48rem}.-translate-x-1\\/2{--tw-translate-x:-50%}.-translate-x-1\\/2,.-translate-y-1\\/2{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y:-50%}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(1turn)}}.animate-\\[spin_1500ms_linear_infinite\\]{animation:spin 1.5s linear infinite}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.grid-cols-xs{grid-template-columns:repeat(6,minmax(32px,1fr))}.flex-col{flex-direction:column}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:4px}.gap-10{gap:40px}.gap-16{gap:64px}.gap-2{gap:8px}.gap-4,.gap-xs{gap:16px}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(8px*(1 - var(--tw-space-x-reverse)));margin-right:calc(8px*var(--tw-space-x-reverse))}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;white-space:nowrap}.text-ellipsis,.truncate{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.rounded,.rounded-base{border-radius:8px}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:24px}.rounded-md{border-radius:16px}.rounded-sm{border-radius:4px}.rounded-l-lg{border-bottom-left-radius:24px;border-top-left-radius:24px}.rounded-r-lg{border-bottom-right-radius:24px;border-top-right-radius:24px}.rounded-t{border-top-left-radius:8px;border-top-right-radius:8px}.border{border-width:1px}.border-2{border-width:2px}.border-x{border-left-width:1px;border-right-width:1px}.border-b-2{border-bottom-width:2px}.border-t{border-top-width:1px}.border-t-2{border-top-width:2px}.border-dashed{border-style:dashed}.border-none{border-style:none}.border-neutral-200{--tw-border-opacity:1;border-color:rgb(255 245 248/var(--tw-border-opacity))}.border-neutral-300{--tw-border-opacity:1;border-color:rgb(249 226 227/var(--tw-border-opacity))}.border-neutral-400{--tw-border-opacity:1;border-color:rgb(216 216 216/var(--tw-border-opacity))}.border-neutral-500{--tw-border-opacity:1;border-color:rgb(179 179 179/var(--tw-border-opacity))}.border-neutral-600{--tw-border-opacity:1;border-color:rgb(125 125 125/var(--tw-border-opacity))}.border-neutral-700{--tw-border-opacity:1;border-color:rgb(81 81 81/var(--tw-border-opacity))}.border-neutral-800{--tw-border-opacity:1;border-color:rgb(50 50 50/var(--tw-border-opacity))}.border-primary-blue{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.border-primary-blue-200{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.border-primary-blue-400{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.border-primary-blue-600,.border-primary-green{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.border-primary-green-200{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.border-primary-green-400{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.border-primary-green-600{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.border-secondary-beige-200{--tw-border-opacity:1;border-color:rgb(248 245 236/var(--tw-border-opacity))}.border-secondary-beige-400{--tw-border-opacity:1;border-color:rgb(235 225 199/var(--tw-border-opacity))}.border-secondary-beige-600{--tw-border-opacity:1;border-color:rgb(222 205 163/var(--tw-border-opacity))}.border-secondary-orange-200{--tw-border-opacity:1;border-color:rgb(255 233 214/var(--tw-border-opacity))}.border-secondary-orange-400{--tw-border-opacity:1;border-color:rgb(255 205 163/var(--tw-border-opacity))}.border-secondary-orange-600{--tw-border-opacity:1;border-color:rgb(255 177 111/var(--tw-border-opacity))}.border-secondary-pink-200{--tw-border-opacity:1;border-color:rgb(255 224 245/var(--tw-border-opacity))}.border-secondary-pink-400{--tw-border-opacity:1;border-color:rgb(255 199 236/var(--tw-border-opacity))}.border-secondary-pink-600{--tw-border-opacity:1;border-color:rgb(255 175 228/var(--tw-border-opacity))}.border-secondary-purple-200{--tw-border-opacity:1;border-color:rgb(214 216 255/var(--tw-border-opacity))}.border-secondary-purple-400{--tw-border-opacity:1;border-color:rgb(163 167 255/var(--tw-border-opacity))}.border-secondary-purple-600{--tw-border-opacity:1;border-color:rgb(113 118 255/var(--tw-border-opacity))}.border-secondary-teal-200{--tw-border-opacity:1;border-color:rgb(201 237 237/var(--tw-border-opacity))}.border-secondary-teal-400{--tw-border-opacity:1;border-color:rgb(163 224 225/var(--tw-border-opacity))}.border-secondary-teal-600{--tw-border-opacity:1;border-color:rgb(124 211 212/var(--tw-border-opacity))}.border-secondary-yellow-200{--tw-border-opacity:1;border-color:rgb(254 250 215/var(--tw-border-opacity))}.border-secondary-yellow-400{--tw-border-opacity:1;border-color:rgb(252 244 166/var(--tw-border-opacity))}.border-secondary-yellow-600{--tw-border-opacity:1;border-color:rgb(251 237 116/var(--tw-border-opacity))}.border-semantic-error{--tw-border-opacity:1;border-color:rgb(255 112 77/var(--tw-border-opacity))}.border-semantic-success{--tw-border-opacity:1;border-color:rgb(97 218 150/var(--tw-border-opacity))}.border-semantic-warning{--tw-border-opacity:1;border-color:rgb(255 185 67/var(--tw-border-opacity))}.border-white\\/80{border-color:hsla(0,0%,100%,.8)}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.bg-neutral-100{--tw-bg-opacity:1;background-color:rgb(245 245 245/var(--tw-bg-opacity))}.bg-neutral-200{--tw-bg-opacity:1;background-color:rgb(255 245 248/var(--tw-bg-opacity))}.bg-neutral-300{--tw-bg-opacity:1;background-color:rgb(249 226 227/var(--tw-bg-opacity))}.bg-neutral-400{--tw-bg-opacity:1;background-color:rgb(216 216 216/var(--tw-bg-opacity))}.bg-neutral-500{--tw-bg-opacity:1;background-color:rgb(179 179 179/var(--tw-bg-opacity))}.bg-neutral-600{--tw-bg-opacity:1;background-color:rgb(125 125 125/var(--tw-bg-opacity))}.bg-neutral-700{--tw-bg-opacity:1;background-color:rgb(81 81 81/var(--tw-bg-opacity))}.bg-neutral-800{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-primary-blue{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.bg-primary-blue-200{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.bg-primary-blue-400{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.bg-primary-blue-600,.bg-primary-green{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.bg-primary-green-200{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.bg-primary-green-400{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.bg-primary-green-600{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.bg-secondary-beige-200{--tw-bg-opacity:1;background-color:rgb(248 245 236/var(--tw-bg-opacity))}.bg-secondary-beige-400{--tw-bg-opacity:1;background-color:rgb(235 225 199/var(--tw-bg-opacity))}.bg-secondary-beige-600{--tw-bg-opacity:1;background-color:rgb(222 205 163/var(--tw-bg-opacity))}.bg-secondary-orange-200{--tw-bg-opacity:1;background-color:rgb(255 233 214/var(--tw-bg-opacity))}.bg-secondary-orange-400{--tw-bg-opacity:1;background-color:rgb(255 205 163/var(--tw-bg-opacity))}.bg-secondary-orange-600{--tw-bg-opacity:1;background-color:rgb(255 177 111/var(--tw-bg-opacity))}.bg-secondary-pink-200{--tw-bg-opacity:1;background-color:rgb(255 224 245/var(--tw-bg-opacity))}.bg-secondary-pink-400{--tw-bg-opacity:1;background-color:rgb(255 199 236/var(--tw-bg-opacity))}.bg-secondary-pink-600{--tw-bg-opacity:1;background-color:rgb(255 175 228/var(--tw-bg-opacity))}.bg-secondary-purple-200{--tw-bg-opacity:1;background-color:rgb(214 216 255/var(--tw-bg-opacity))}.bg-secondary-purple-400{--tw-bg-opacity:1;background-color:rgb(163 167 255/var(--tw-bg-opacity))}.bg-secondary-purple-600{--tw-bg-opacity:1;background-color:rgb(113 118 255/var(--tw-bg-opacity))}.bg-secondary-teal-200{--tw-bg-opacity:1;background-color:rgb(201 237 237/var(--tw-bg-opacity))}.bg-secondary-teal-400{--tw-bg-opacity:1;background-color:rgb(163 224 225/var(--tw-bg-opacity))}.bg-secondary-teal-600{--tw-bg-opacity:1;background-color:rgb(124 211 212/var(--tw-bg-opacity))}.bg-secondary-yellow-200{--tw-bg-opacity:1;background-color:rgb(254 250 215/var(--tw-bg-opacity))}.bg-secondary-yellow-400{--tw-bg-opacity:1;background-color:rgb(252 244 166/var(--tw-bg-opacity))}.bg-secondary-yellow-600{--tw-bg-opacity:1;background-color:rgb(251 237 116/var(--tw-bg-opacity))}.bg-semantic-error{--tw-bg-opacity:1;background-color:rgb(255 112 77/var(--tw-bg-opacity))}.bg-semantic-success{--tw-bg-opacity:1;background-color:rgb(97 218 150/var(--tw-bg-opacity))}.bg-semantic-warning{--tw-bg-opacity:1;background-color:rgb(255 185 67/var(--tw-bg-opacity))}.bg-slate-200{--tw-bg-opacity:1;background-color:rgb(226 232 240/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.bg-white\\/50{background-color:hsla(0,0%,100%,.5)}.bg-opacity-30{--tw-bg-opacity:0.3}.fill-neutral-200{fill:#fff5f8}.fill-neutral-300{fill:#f9e2e3}.fill-neutral-400{fill:#d8d8d8}.fill-neutral-500{fill:#b3b3b3}.fill-neutral-600{fill:#7d7d7d}.fill-neutral-700{fill:#515151}.fill-neutral-800{fill:#323232}.fill-primary-blue{fill:#ff6973}.fill-primary-blue-200{fill:#ffe9eb}.fill-primary-blue-400{fill:#ffb7c8}.fill-primary-blue-600,.fill-primary-green{fill:#ff6973}.fill-primary-green-200{fill:#ffe9eb}.fill-primary-green-400{fill:#ffb7c8}.fill-primary-green-600{fill:#ff6973}.fill-secondary-beige-200{fill:#f8f5ec}.fill-secondary-beige-400{fill:#ebe1c7}.fill-secondary-beige-600{fill:#decda3}.fill-secondary-orange-200{fill:#ffe9d6}.fill-secondary-orange-400{fill:#ffcda3}.fill-secondary-orange-600{fill:#ffb16f}.fill-secondary-pink-200{fill:#ffe0f5}.fill-secondary-pink-400{fill:#ffc7ec}.fill-secondary-pink-600{fill:#ffafe4}.fill-secondary-purple-200{fill:#d6d8ff}.fill-secondary-purple-400{fill:#a3a7ff}.fill-secondary-purple-600{fill:#7176ff}.fill-secondary-teal-200{fill:#c9eded}.fill-secondary-teal-400{fill:#a3e0e1}.fill-secondary-teal-600{fill:#7cd3d4}.fill-secondary-yellow-200{fill:#fefad7}.fill-secondary-yellow-400{fill:#fcf4a6}.fill-secondary-yellow-600{fill:#fbed74}.fill-semantic-error{fill:#ff704d}.fill-semantic-success{fill:#61da96}.fill-semantic-warning{fill:#ffb943}.p-0{padding:0}.p-1{padding:4px}.p-2{padding:8px}.p-3{padding:.75rem}.p-4{padding:16px}.p-6{padding:24px}.p-8{padding:32px}.px-2{padding-left:8px;padding-right:8px}.px-4{padding-left:16px;padding-right:16px}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-6{padding-left:24px;padding-right:24px}.px-8{padding-left:32px;padding-right:32px}.px-\\[16px\\]{padding-left:16px;padding-right:16px}.py-0{padding-bottom:0;padding-top:0}.py-0\\.5{padding-bottom:2px;padding-top:2px}.py-1{padding-bottom:4px;padding-top:4px}.py-3{padding-bottom:.75rem;padding-top:.75rem}.py-4{padding-bottom:16px;padding-top:16px}.pb-24{padding-bottom:6rem}.pl-0{padding-left:0}.pl-2{padding-left:8px}.pl-3{padding-left:.75rem}.pl-4{padding-left:16px}.pr-0{padding-right:0}.pr-16{padding-right:64px}.pr-2{padding-right:8px}.pr-3{padding-right:.75rem}.pr-4{padding-right:16px}.pt-4{padding-top:16px}.pt-8{padding-top:32px}.text-left{text-align:left}.text-center{text-align:center}.text-3xl{font-size:1.875rem}.text-5xl{font-size:2.625rem}.text-base{font-size:1rem}.text-lg{font-size:1.125rem}.text-sm{font-size:.875rem}.text-xl{font-size:1.25rem}.text-xs{font-size:.75rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.uppercase{text-transform:uppercase}.tracking-wide{letter-spacing:.025em}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-neutral-200{--tw-text-opacity:1;color:rgb(255 245 248/var(--tw-text-opacity))}.text-neutral-300{--tw-text-opacity:1;color:rgb(249 226 227/var(--tw-text-opacity))}.text-neutral-400{--tw-text-opacity:1;color:rgb(216 216 216/var(--tw-text-opacity))}.text-neutral-500{--tw-text-opacity:1;color:rgb(179 179 179/var(--tw-text-opacity))}.text-neutral-600{--tw-text-opacity:1;color:rgb(125 125 125/var(--tw-text-opacity))}.text-neutral-700{--tw-text-opacity:1;color:rgb(81 81 81/var(--tw-text-opacity))}.text-neutral-800{--tw-text-opacity:1;color:rgb(50 50 50/var(--tw-text-opacity))}.text-primary-blue{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.text-primary-blue-200{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.text-primary-blue-400{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.text-primary-blue-600,.text-primary-green{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.text-primary-green-200{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.text-primary-green-400{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.text-primary-green-600{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.text-secondary-beige-200{--tw-text-opacity:1;color:rgb(248 245 236/var(--tw-text-opacity))}.text-secondary-beige-400{--tw-text-opacity:1;color:rgb(235 225 199/var(--tw-text-opacity))}.text-secondary-beige-600{--tw-text-opacity:1;color:rgb(222 205 163/var(--tw-text-opacity))}.text-secondary-orange-200{--tw-text-opacity:1;color:rgb(255 233 214/var(--tw-text-opacity))}.text-secondary-orange-400{--tw-text-opacity:1;color:rgb(255 205 163/var(--tw-text-opacity))}.text-secondary-orange-600{--tw-text-opacity:1;color:rgb(255 177 111/var(--tw-text-opacity))}.text-secondary-pink-200{--tw-text-opacity:1;color:rgb(255 224 245/var(--tw-text-opacity))}.text-secondary-pink-400{--tw-text-opacity:1;color:rgb(255 199 236/var(--tw-text-opacity))}.text-secondary-pink-600{--tw-text-opacity:1;color:rgb(255 175 228/var(--tw-text-opacity))}.text-secondary-purple-200{--tw-text-opacity:1;color:rgb(214 216 255/var(--tw-text-opacity))}.text-secondary-purple-400{--tw-text-opacity:1;color:rgb(163 167 255/var(--tw-text-opacity))}.text-secondary-purple-600{--tw-text-opacity:1;color:rgb(113 118 255/var(--tw-text-opacity))}.text-secondary-teal-200{--tw-text-opacity:1;color:rgb(201 237 237/var(--tw-text-opacity))}.text-secondary-teal-400{--tw-text-opacity:1;color:rgb(163 224 225/var(--tw-text-opacity))}.text-secondary-teal-600{--tw-text-opacity:1;color:rgb(124 211 212/var(--tw-text-opacity))}.text-secondary-yellow-200{--tw-text-opacity:1;color:rgb(254 250 215/var(--tw-text-opacity))}.text-secondary-yellow-400{--tw-text-opacity:1;color:rgb(252 244 166/var(--tw-text-opacity))}.text-secondary-yellow-600{--tw-text-opacity:1;color:rgb(251 237 116/var(--tw-text-opacity))}.text-semantic-error{--tw-text-opacity:1;color:rgb(255 112 77/var(--tw-text-opacity))}.text-semantic-success{--tw-text-opacity:1;color:rgb(97 218 150/var(--tw-text-opacity))}.text-semantic-warning{--tw-text-opacity:1;color:rgb(255 185 67/var(--tw-text-opacity))}.text-slate-400{--tw-text-opacity:1;color:rgb(148 163 184/var(--tw-text-opacity))}.text-slate-600{--tw-text-opacity:1;color:rgb(71 85 105/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.opacity-0{opacity:0}.opacity-100{opacity:1}.opacity-50{opacity:.5}.shadow-md{--tw-shadow:0px 4px 8px 0px rgba(171,190,209,.4);--tw-shadow-colored:0px 4px 8px 0px var(--tw-shadow-color)}.shadow-md,.shadow-none{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-none{--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.shadow-sm{--tw-shadow:0px 2px 4px 0px rgba(172,197,218,.3);--tw-shadow-colored:0px 2px 4px 0px var(--tw-shadow-color)}.shadow-sm,.shadow-xl{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow:0px 8px 16px 0px rgba(171,190,209,.4);--tw-shadow-colored:0px 8px 16px 0px var(--tw-shadow-color)}.outline-none{outline:2px solid transparent;outline-offset:2px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur-sm{--tw-backdrop-blur:blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-opacity{transition-duration:.15s;transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-transform{transition-duration:.15s;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1)}.hover\\:border-neutral-200:hover{--tw-border-opacity:1;border-color:rgb(255 245 248/var(--tw-border-opacity))}.hover\\:border-neutral-300:hover{--tw-border-opacity:1;border-color:rgb(249 226 227/var(--tw-border-opacity))}.hover\\:border-neutral-400:hover{--tw-border-opacity:1;border-color:rgb(216 216 216/var(--tw-border-opacity))}.hover\\:border-neutral-500:hover{--tw-border-opacity:1;border-color:rgb(179 179 179/var(--tw-border-opacity))}.hover\\:border-neutral-600:hover{--tw-border-opacity:1;border-color:rgb(125 125 125/var(--tw-border-opacity))}.hover\\:border-neutral-700:hover{--tw-border-opacity:1;border-color:rgb(81 81 81/var(--tw-border-opacity))}.hover\\:border-neutral-800:hover{--tw-border-opacity:1;border-color:rgb(50 50 50/var(--tw-border-opacity))}.hover\\:border-primary-blue:hover{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.hover\\:border-primary-blue-200:hover{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.hover\\:border-primary-blue-400:hover{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.hover\\:border-primary-blue-600:hover,.hover\\:border-primary-green:hover{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.hover\\:border-primary-green-200:hover{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.hover\\:border-primary-green-400:hover{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.hover\\:border-primary-green-600:hover{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.hover\\:border-secondary-beige-200:hover{--tw-border-opacity:1;border-color:rgb(248 245 236/var(--tw-border-opacity))}.hover\\:border-secondary-beige-400:hover{--tw-border-opacity:1;border-color:rgb(235 225 199/var(--tw-border-opacity))}.hover\\:border-secondary-beige-600:hover{--tw-border-opacity:1;border-color:rgb(222 205 163/var(--tw-border-opacity))}.hover\\:border-secondary-orange-200:hover{--tw-border-opacity:1;border-color:rgb(255 233 214/var(--tw-border-opacity))}.hover\\:border-secondary-orange-400:hover{--tw-border-opacity:1;border-color:rgb(255 205 163/var(--tw-border-opacity))}.hover\\:border-secondary-orange-600:hover{--tw-border-opacity:1;border-color:rgb(255 177 111/var(--tw-border-opacity))}.hover\\:border-secondary-pink-200:hover{--tw-border-opacity:1;border-color:rgb(255 224 245/var(--tw-border-opacity))}.hover\\:border-secondary-pink-400:hover{--tw-border-opacity:1;border-color:rgb(255 199 236/var(--tw-border-opacity))}.hover\\:border-secondary-pink-600:hover{--tw-border-opacity:1;border-color:rgb(255 175 228/var(--tw-border-opacity))}.hover\\:border-secondary-purple-200:hover{--tw-border-opacity:1;border-color:rgb(214 216 255/var(--tw-border-opacity))}.hover\\:border-secondary-purple-400:hover{--tw-border-opacity:1;border-color:rgb(163 167 255/var(--tw-border-opacity))}.hover\\:border-secondary-purple-600:hover{--tw-border-opacity:1;border-color:rgb(113 118 255/var(--tw-border-opacity))}.hover\\:border-secondary-teal-200:hover{--tw-border-opacity:1;border-color:rgb(201 237 237/var(--tw-border-opacity))}.hover\\:border-secondary-teal-400:hover{--tw-border-opacity:1;border-color:rgb(163 224 225/var(--tw-border-opacity))}.hover\\:border-secondary-teal-600:hover{--tw-border-opacity:1;border-color:rgb(124 211 212/var(--tw-border-opacity))}.hover\\:border-secondary-yellow-200:hover{--tw-border-opacity:1;border-color:rgb(254 250 215/var(--tw-border-opacity))}.hover\\:border-secondary-yellow-400:hover{--tw-border-opacity:1;border-color:rgb(252 244 166/var(--tw-border-opacity))}.hover\\:border-secondary-yellow-600:hover{--tw-border-opacity:1;border-color:rgb(251 237 116/var(--tw-border-opacity))}.hover\\:border-semantic-error:hover{--tw-border-opacity:1;border-color:rgb(255 112 77/var(--tw-border-opacity))}.hover\\:border-semantic-success:hover{--tw-border-opacity:1;border-color:rgb(97 218 150/var(--tw-border-opacity))}.hover\\:border-semantic-warning:hover{--tw-border-opacity:1;border-color:rgb(255 185 67/var(--tw-border-opacity))}.hover\\:bg-neutral-200:hover{--tw-bg-opacity:1;background-color:rgb(255 245 248/var(--tw-bg-opacity))}.hover\\:bg-neutral-300:hover{--tw-bg-opacity:1;background-color:rgb(249 226 227/var(--tw-bg-opacity))}.hover\\:bg-neutral-400:hover{--tw-bg-opacity:1;background-color:rgb(216 216 216/var(--tw-bg-opacity))}.hover\\:bg-neutral-500:hover{--tw-bg-opacity:1;background-color:rgb(179 179 179/var(--tw-bg-opacity))}.hover\\:bg-neutral-600:hover{--tw-bg-opacity:1;background-color:rgb(125 125 125/var(--tw-bg-opacity))}.hover\\:bg-neutral-700:hover{--tw-bg-opacity:1;background-color:rgb(81 81 81/var(--tw-bg-opacity))}.hover\\:bg-neutral-800:hover{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.hover\\:bg-primary-blue:hover{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.hover\\:bg-primary-blue-200:hover{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.hover\\:bg-primary-blue-400:hover{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.hover\\:bg-primary-blue-600:hover,.hover\\:bg-primary-green:hover{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.hover\\:bg-primary-green-200:hover{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.hover\\:bg-primary-green-400:hover{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.hover\\:bg-primary-green-600:hover{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.hover\\:bg-secondary-beige-200:hover{--tw-bg-opacity:1;background-color:rgb(248 245 236/var(--tw-bg-opacity))}.hover\\:bg-secondary-beige-400:hover{--tw-bg-opacity:1;background-color:rgb(235 225 199/var(--tw-bg-opacity))}.hover\\:bg-secondary-beige-600:hover{--tw-bg-opacity:1;background-color:rgb(222 205 163/var(--tw-bg-opacity))}.hover\\:bg-secondary-orange-200:hover{--tw-bg-opacity:1;background-color:rgb(255 233 214/var(--tw-bg-opacity))}.hover\\:bg-secondary-orange-400:hover{--tw-bg-opacity:1;background-color:rgb(255 205 163/var(--tw-bg-opacity))}.hover\\:bg-secondary-orange-600:hover{--tw-bg-opacity:1;background-color:rgb(255 177 111/var(--tw-bg-opacity))}.hover\\:bg-secondary-pink-200:hover{--tw-bg-opacity:1;background-color:rgb(255 224 245/var(--tw-bg-opacity))}.hover\\:bg-secondary-pink-400:hover{--tw-bg-opacity:1;background-color:rgb(255 199 236/var(--tw-bg-opacity))}.hover\\:bg-secondary-pink-600:hover{--tw-bg-opacity:1;background-color:rgb(255 175 228/var(--tw-bg-opacity))}.hover\\:bg-secondary-purple-200:hover{--tw-bg-opacity:1;background-color:rgb(214 216 255/var(--tw-bg-opacity))}.hover\\:bg-secondary-purple-400:hover{--tw-bg-opacity:1;background-color:rgb(163 167 255/var(--tw-bg-opacity))}.hover\\:bg-secondary-purple-600:hover{--tw-bg-opacity:1;background-color:rgb(113 118 255/var(--tw-bg-opacity))}.hover\\:bg-secondary-teal-200:hover{--tw-bg-opacity:1;background-color:rgb(201 237 237/var(--tw-bg-opacity))}.hover\\:bg-secondary-teal-400:hover{--tw-bg-opacity:1;background-color:rgb(163 224 225/var(--tw-bg-opacity))}.hover\\:bg-secondary-teal-600:hover{--tw-bg-opacity:1;background-color:rgb(124 211 212/var(--tw-bg-opacity))}.hover\\:bg-secondary-yellow-200:hover{--tw-bg-opacity:1;background-color:rgb(254 250 215/var(--tw-bg-opacity))}.hover\\:bg-secondary-yellow-400:hover{--tw-bg-opacity:1;background-color:rgb(252 244 166/var(--tw-bg-opacity))}.hover\\:bg-secondary-yellow-600:hover{--tw-bg-opacity:1;background-color:rgb(251 237 116/var(--tw-bg-opacity))}.hover\\:bg-semantic-error:hover{--tw-bg-opacity:1;background-color:rgb(255 112 77/var(--tw-bg-opacity))}.hover\\:bg-semantic-success:hover{--tw-bg-opacity:1;background-color:rgb(97 218 150/var(--tw-bg-opacity))}.hover\\:bg-semantic-warning:hover{--tw-bg-opacity:1;background-color:rgb(255 185 67/var(--tw-bg-opacity))}.hover\\:fill-neutral-200:hover{fill:#fff5f8}.hover\\:fill-neutral-300:hover{fill:#f9e2e3}.hover\\:fill-neutral-400:hover{fill:#d8d8d8}.hover\\:fill-neutral-500:hover{fill:#b3b3b3}.hover\\:fill-neutral-600:hover{fill:#7d7d7d}.hover\\:fill-neutral-700:hover{fill:#515151}.hover\\:fill-neutral-800:hover{fill:#323232}.hover\\:fill-primary-blue:hover{fill:#ff6973}.hover\\:fill-primary-blue-200:hover{fill:#ffe9eb}.hover\\:fill-primary-blue-400:hover{fill:#ffb7c8}.hover\\:fill-primary-blue-600:hover,.hover\\:fill-primary-green:hover{fill:#ff6973}.hover\\:fill-primary-green-200:hover{fill:#ffe9eb}.hover\\:fill-primary-green-400:hover{fill:#ffb7c8}.hover\\:fill-primary-green-600:hover{fill:#ff6973}.hover\\:fill-secondary-beige-200:hover{fill:#f8f5ec}.hover\\:fill-secondary-beige-400:hover{fill:#ebe1c7}.hover\\:fill-secondary-beige-600:hover{fill:#decda3}.hover\\:fill-secondary-orange-200:hover{fill:#ffe9d6}.hover\\:fill-secondary-orange-400:hover{fill:#ffcda3}.hover\\:fill-secondary-orange-600:hover{fill:#ffb16f}.hover\\:fill-secondary-pink-200:hover{fill:#ffe0f5}.hover\\:fill-secondary-pink-400:hover{fill:#ffc7ec}.hover\\:fill-secondary-pink-600:hover{fill:#ffafe4}.hover\\:fill-secondary-purple-200:hover{fill:#d6d8ff}.hover\\:fill-secondary-purple-400:hover{fill:#a3a7ff}.hover\\:fill-secondary-purple-600:hover{fill:#7176ff}.hover\\:fill-secondary-teal-200:hover{fill:#c9eded}.hover\\:fill-secondary-teal-400:hover{fill:#a3e0e1}.hover\\:fill-secondary-teal-600:hover{fill:#7cd3d4}.hover\\:fill-secondary-yellow-200:hover{fill:#fefad7}.hover\\:fill-secondary-yellow-400:hover{fill:#fcf4a6}.hover\\:fill-secondary-yellow-600:hover{fill:#fbed74}.hover\\:fill-semantic-error:hover{fill:#ff704d}.hover\\:fill-semantic-success:hover{fill:#61da96}.hover\\:fill-semantic-warning:hover{fill:#ffb943}.hover\\:text-neutral-200:hover{--tw-text-opacity:1;color:rgb(255 245 248/var(--tw-text-opacity))}.hover\\:text-neutral-300:hover{--tw-text-opacity:1;color:rgb(249 226 227/var(--tw-text-opacity))}.hover\\:text-neutral-400:hover{--tw-text-opacity:1;color:rgb(216 216 216/var(--tw-text-opacity))}.hover\\:text-neutral-500:hover{--tw-text-opacity:1;color:rgb(179 179 179/var(--tw-text-opacity))}.hover\\:text-neutral-600:hover{--tw-text-opacity:1;color:rgb(125 125 125/var(--tw-text-opacity))}.hover\\:text-neutral-700:hover{--tw-text-opacity:1;color:rgb(81 81 81/var(--tw-text-opacity))}.hover\\:text-neutral-800:hover{--tw-text-opacity:1;color:rgb(50 50 50/var(--tw-text-opacity))}.hover\\:text-primary-blue:hover{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.hover\\:text-primary-blue-200:hover{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.hover\\:text-primary-blue-400:hover{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.hover\\:text-primary-blue-600:hover,.hover\\:text-primary-green:hover{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.hover\\:text-primary-green-200:hover{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.hover\\:text-primary-green-400:hover{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.hover\\:text-primary-green-600:hover{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.hover\\:text-secondary-beige-200:hover{--tw-text-opacity:1;color:rgb(248 245 236/var(--tw-text-opacity))}.hover\\:text-secondary-beige-400:hover{--tw-text-opacity:1;color:rgb(235 225 199/var(--tw-text-opacity))}.hover\\:text-secondary-beige-600:hover{--tw-text-opacity:1;color:rgb(222 205 163/var(--tw-text-opacity))}.hover\\:text-secondary-orange-200:hover{--tw-text-opacity:1;color:rgb(255 233 214/var(--tw-text-opacity))}.hover\\:text-secondary-orange-400:hover{--tw-text-opacity:1;color:rgb(255 205 163/var(--tw-text-opacity))}.hover\\:text-secondary-orange-600:hover{--tw-text-opacity:1;color:rgb(255 177 111/var(--tw-text-opacity))}.hover\\:text-secondary-pink-200:hover{--tw-text-opacity:1;color:rgb(255 224 245/var(--tw-text-opacity))}.hover\\:text-secondary-pink-400:hover{--tw-text-opacity:1;color:rgb(255 199 236/var(--tw-text-opacity))}.hover\\:text-secondary-pink-600:hover{--tw-text-opacity:1;color:rgb(255 175 228/var(--tw-text-opacity))}.hover\\:text-secondary-purple-200:hover{--tw-text-opacity:1;color:rgb(214 216 255/var(--tw-text-opacity))}.hover\\:text-secondary-purple-400:hover{--tw-text-opacity:1;color:rgb(163 167 255/var(--tw-text-opacity))}.hover\\:text-secondary-purple-600:hover{--tw-text-opacity:1;color:rgb(113 118 255/var(--tw-text-opacity))}.hover\\:text-secondary-teal-200:hover{--tw-text-opacity:1;color:rgb(201 237 237/var(--tw-text-opacity))}.hover\\:text-secondary-teal-400:hover{--tw-text-opacity:1;color:rgb(163 224 225/var(--tw-text-opacity))}.hover\\:text-secondary-teal-600:hover{--tw-text-opacity:1;color:rgb(124 211 212/var(--tw-text-opacity))}.hover\\:text-secondary-yellow-200:hover{--tw-text-opacity:1;color:rgb(254 250 215/var(--tw-text-opacity))}.hover\\:text-secondary-yellow-400:hover{--tw-text-opacity:1;color:rgb(252 244 166/var(--tw-text-opacity))}.hover\\:text-secondary-yellow-600:hover{--tw-text-opacity:1;color:rgb(251 237 116/var(--tw-text-opacity))}.hover\\:text-semantic-error:hover{--tw-text-opacity:1;color:rgb(255 112 77/var(--tw-text-opacity))}.hover\\:text-semantic-success:hover{--tw-text-opacity:1;color:rgb(97 218 150/var(--tw-text-opacity))}.hover\\:text-semantic-warning:hover{--tw-text-opacity:1;color:rgb(255 185 67/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:shadow-md:hover{--tw-shadow:0px 4px 8px 0px rgba(171,190,209,.4);--tw-shadow-colored:0px 4px 8px 0px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.focus\\:border-neutral-200:focus{--tw-border-opacity:1;border-color:rgb(255 245 248/var(--tw-border-opacity))}.focus\\:border-neutral-300:focus{--tw-border-opacity:1;border-color:rgb(249 226 227/var(--tw-border-opacity))}.focus\\:border-neutral-400:focus{--tw-border-opacity:1;border-color:rgb(216 216 216/var(--tw-border-opacity))}.focus\\:border-neutral-500:focus{--tw-border-opacity:1;border-color:rgb(179 179 179/var(--tw-border-opacity))}.focus\\:border-neutral-600:focus{--tw-border-opacity:1;border-color:rgb(125 125 125/var(--tw-border-opacity))}.focus\\:border-neutral-700:focus{--tw-border-opacity:1;border-color:rgb(81 81 81/var(--tw-border-opacity))}.focus\\:border-neutral-800:focus{--tw-border-opacity:1;border-color:rgb(50 50 50/var(--tw-border-opacity))}.focus\\:border-primary-blue:focus{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.focus\\:border-primary-blue-200:focus{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.focus\\:border-primary-blue-400:focus{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.focus\\:border-primary-blue-600:focus,.focus\\:border-primary-green:focus{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.focus\\:border-primary-green-200:focus{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.focus\\:border-primary-green-400:focus{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.focus\\:border-primary-green-600:focus{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.focus\\:border-secondary-beige-200:focus{--tw-border-opacity:1;border-color:rgb(248 245 236/var(--tw-border-opacity))}.focus\\:border-secondary-beige-400:focus{--tw-border-opacity:1;border-color:rgb(235 225 199/var(--tw-border-opacity))}.focus\\:border-secondary-beige-600:focus{--tw-border-opacity:1;border-color:rgb(222 205 163/var(--tw-border-opacity))}.focus\\:border-secondary-orange-200:focus{--tw-border-opacity:1;border-color:rgb(255 233 214/var(--tw-border-opacity))}.focus\\:border-secondary-orange-400:focus{--tw-border-opacity:1;border-color:rgb(255 205 163/var(--tw-border-opacity))}.focus\\:border-secondary-orange-600:focus{--tw-border-opacity:1;border-color:rgb(255 177 111/var(--tw-border-opacity))}.focus\\:border-secondary-pink-200:focus{--tw-border-opacity:1;border-color:rgb(255 224 245/var(--tw-border-opacity))}.focus\\:border-secondary-pink-400:focus{--tw-border-opacity:1;border-color:rgb(255 199 236/var(--tw-border-opacity))}.focus\\:border-secondary-pink-600:focus{--tw-border-opacity:1;border-color:rgb(255 175 228/var(--tw-border-opacity))}.focus\\:border-secondary-purple-200:focus{--tw-border-opacity:1;border-color:rgb(214 216 255/var(--tw-border-opacity))}.focus\\:border-secondary-purple-400:focus{--tw-border-opacity:1;border-color:rgb(163 167 255/var(--tw-border-opacity))}.focus\\:border-secondary-purple-600:focus{--tw-border-opacity:1;border-color:rgb(113 118 255/var(--tw-border-opacity))}.focus\\:border-secondary-teal-200:focus{--tw-border-opacity:1;border-color:rgb(201 237 237/var(--tw-border-opacity))}.focus\\:border-secondary-teal-400:focus{--tw-border-opacity:1;border-color:rgb(163 224 225/var(--tw-border-opacity))}.focus\\:border-secondary-teal-600:focus{--tw-border-opacity:1;border-color:rgb(124 211 212/var(--tw-border-opacity))}.focus\\:border-secondary-yellow-200:focus{--tw-border-opacity:1;border-color:rgb(254 250 215/var(--tw-border-opacity))}.focus\\:border-secondary-yellow-400:focus{--tw-border-opacity:1;border-color:rgb(252 244 166/var(--tw-border-opacity))}.focus\\:border-secondary-yellow-600:focus{--tw-border-opacity:1;border-color:rgb(251 237 116/var(--tw-border-opacity))}.focus\\:border-semantic-error:focus{--tw-border-opacity:1;border-color:rgb(255 112 77/var(--tw-border-opacity))}.focus\\:border-semantic-success:focus{--tw-border-opacity:1;border-color:rgb(97 218 150/var(--tw-border-opacity))}.focus\\:border-semantic-warning:focus{--tw-border-opacity:1;border-color:rgb(255 185 67/var(--tw-border-opacity))}.focus\\:bg-neutral-200:focus{--tw-bg-opacity:1;background-color:rgb(255 245 248/var(--tw-bg-opacity))}.focus\\:bg-neutral-300:focus{--tw-bg-opacity:1;background-color:rgb(249 226 227/var(--tw-bg-opacity))}.focus\\:bg-neutral-400:focus{--tw-bg-opacity:1;background-color:rgb(216 216 216/var(--tw-bg-opacity))}.focus\\:bg-neutral-500:focus{--tw-bg-opacity:1;background-color:rgb(179 179 179/var(--tw-bg-opacity))}.focus\\:bg-neutral-600:focus{--tw-bg-opacity:1;background-color:rgb(125 125 125/var(--tw-bg-opacity))}.focus\\:bg-neutral-700:focus{--tw-bg-opacity:1;background-color:rgb(81 81 81/var(--tw-bg-opacity))}.focus\\:bg-neutral-800:focus{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.focus\\:bg-primary-blue:focus{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.focus\\:bg-primary-blue-200:focus{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.focus\\:bg-primary-blue-400:focus{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.focus\\:bg-primary-blue-600:focus,.focus\\:bg-primary-green:focus{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.focus\\:bg-primary-green-200:focus{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.focus\\:bg-primary-green-400:focus{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.focus\\:bg-primary-green-600:focus{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.focus\\:bg-secondary-beige-200:focus{--tw-bg-opacity:1;background-color:rgb(248 245 236/var(--tw-bg-opacity))}.focus\\:bg-secondary-beige-400:focus{--tw-bg-opacity:1;background-color:rgb(235 225 199/var(--tw-bg-opacity))}.focus\\:bg-secondary-beige-600:focus{--tw-bg-opacity:1;background-color:rgb(222 205 163/var(--tw-bg-opacity))}.focus\\:bg-secondary-orange-200:focus{--tw-bg-opacity:1;background-color:rgb(255 233 214/var(--tw-bg-opacity))}.focus\\:bg-secondary-orange-400:focus{--tw-bg-opacity:1;background-color:rgb(255 205 163/var(--tw-bg-opacity))}.focus\\:bg-secondary-orange-600:focus{--tw-bg-opacity:1;background-color:rgb(255 177 111/var(--tw-bg-opacity))}.focus\\:bg-secondary-pink-200:focus{--tw-bg-opacity:1;background-color:rgb(255 224 245/var(--tw-bg-opacity))}.focus\\:bg-secondary-pink-400:focus{--tw-bg-opacity:1;background-color:rgb(255 199 236/var(--tw-bg-opacity))}.focus\\:bg-secondary-pink-600:focus{--tw-bg-opacity:1;background-color:rgb(255 175 228/var(--tw-bg-opacity))}.focus\\:bg-secondary-purple-200:focus{--tw-bg-opacity:1;background-color:rgb(214 216 255/var(--tw-bg-opacity))}.focus\\:bg-secondary-purple-400:focus{--tw-bg-opacity:1;background-color:rgb(163 167 255/var(--tw-bg-opacity))}.focus\\:bg-secondary-purple-600:focus{--tw-bg-opacity:1;background-color:rgb(113 118 255/var(--tw-bg-opacity))}.focus\\:bg-secondary-teal-200:focus{--tw-bg-opacity:1;background-color:rgb(201 237 237/var(--tw-bg-opacity))}.focus\\:bg-secondary-teal-400:focus{--tw-bg-opacity:1;background-color:rgb(163 224 225/var(--tw-bg-opacity))}.focus\\:bg-secondary-teal-600:focus{--tw-bg-opacity:1;background-color:rgb(124 211 212/var(--tw-bg-opacity))}.focus\\:bg-secondary-yellow-200:focus{--tw-bg-opacity:1;background-color:rgb(254 250 215/var(--tw-bg-opacity))}.focus\\:bg-secondary-yellow-400:focus{--tw-bg-opacity:1;background-color:rgb(252 244 166/var(--tw-bg-opacity))}.focus\\:bg-secondary-yellow-600:focus{--tw-bg-opacity:1;background-color:rgb(251 237 116/var(--tw-bg-opacity))}.focus\\:bg-semantic-error:focus{--tw-bg-opacity:1;background-color:rgb(255 112 77/var(--tw-bg-opacity))}.focus\\:bg-semantic-success:focus{--tw-bg-opacity:1;background-color:rgb(97 218 150/var(--tw-bg-opacity))}.focus\\:bg-semantic-warning:focus{--tw-bg-opacity:1;background-color:rgb(255 185 67/var(--tw-bg-opacity))}.focus\\:fill-neutral-200:focus{fill:#fff5f8}.focus\\:fill-neutral-300:focus{fill:#f9e2e3}.focus\\:fill-neutral-400:focus{fill:#d8d8d8}.focus\\:fill-neutral-500:focus{fill:#b3b3b3}.focus\\:fill-neutral-600:focus{fill:#7d7d7d}.focus\\:fill-neutral-700:focus{fill:#515151}.focus\\:fill-neutral-800:focus{fill:#323232}.focus\\:fill-primary-blue:focus{fill:#ff6973}.focus\\:fill-primary-blue-200:focus{fill:#ffe9eb}.focus\\:fill-primary-blue-400:focus{fill:#ffb7c8}.focus\\:fill-primary-blue-600:focus,.focus\\:fill-primary-green:focus{fill:#ff6973}.focus\\:fill-primary-green-200:focus{fill:#ffe9eb}.focus\\:fill-primary-green-400:focus{fill:#ffb7c8}.focus\\:fill-primary-green-600:focus{fill:#ff6973}.focus\\:fill-secondary-beige-200:focus{fill:#f8f5ec}.focus\\:fill-secondary-beige-400:focus{fill:#ebe1c7}.focus\\:fill-secondary-beige-600:focus{fill:#decda3}.focus\\:fill-secondary-orange-200:focus{fill:#ffe9d6}.focus\\:fill-secondary-orange-400:focus{fill:#ffcda3}.focus\\:fill-secondary-orange-600:focus{fill:#ffb16f}.focus\\:fill-secondary-pink-200:focus{fill:#ffe0f5}.focus\\:fill-secondary-pink-400:focus{fill:#ffc7ec}.focus\\:fill-secondary-pink-600:focus{fill:#ffafe4}.focus\\:fill-secondary-purple-200:focus{fill:#d6d8ff}.focus\\:fill-secondary-purple-400:focus{fill:#a3a7ff}.focus\\:fill-secondary-purple-600:focus{fill:#7176ff}.focus\\:fill-secondary-teal-200:focus{fill:#c9eded}.focus\\:fill-secondary-teal-400:focus{fill:#a3e0e1}.focus\\:fill-secondary-teal-600:focus{fill:#7cd3d4}.focus\\:fill-secondary-yellow-200:focus{fill:#fefad7}.focus\\:fill-secondary-yellow-400:focus{fill:#fcf4a6}.focus\\:fill-secondary-yellow-600:focus{fill:#fbed74}.focus\\:fill-semantic-error:focus{fill:#ff704d}.focus\\:fill-semantic-success:focus{fill:#61da96}.focus\\:fill-semantic-warning:focus{fill:#ffb943}.focus\\:text-neutral-200:focus{--tw-text-opacity:1;color:rgb(255 245 248/var(--tw-text-opacity))}.focus\\:text-neutral-300:focus{--tw-text-opacity:1;color:rgb(249 226 227/var(--tw-text-opacity))}.focus\\:text-neutral-400:focus{--tw-text-opacity:1;color:rgb(216 216 216/var(--tw-text-opacity))}.focus\\:text-neutral-500:focus{--tw-text-opacity:1;color:rgb(179 179 179/var(--tw-text-opacity))}.focus\\:text-neutral-600:focus{--tw-text-opacity:1;color:rgb(125 125 125/var(--tw-text-opacity))}.focus\\:text-neutral-700:focus{--tw-text-opacity:1;color:rgb(81 81 81/var(--tw-text-opacity))}.focus\\:text-neutral-800:focus{--tw-text-opacity:1;color:rgb(50 50 50/var(--tw-text-opacity))}.focus\\:text-primary-blue:focus{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.focus\\:text-primary-blue-200:focus{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.focus\\:text-primary-blue-400:focus{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.focus\\:text-primary-blue-600:focus,.focus\\:text-primary-green:focus{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.focus\\:text-primary-green-200:focus{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.focus\\:text-primary-green-400:focus{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.focus\\:text-primary-green-600:focus{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.focus\\:text-secondary-beige-200:focus{--tw-text-opacity:1;color:rgb(248 245 236/var(--tw-text-opacity))}.focus\\:text-secondary-beige-400:focus{--tw-text-opacity:1;color:rgb(235 225 199/var(--tw-text-opacity))}.focus\\:text-secondary-beige-600:focus{--tw-text-opacity:1;color:rgb(222 205 163/var(--tw-text-opacity))}.focus\\:text-secondary-orange-200:focus{--tw-text-opacity:1;color:rgb(255 233 214/var(--tw-text-opacity))}.focus\\:text-secondary-orange-400:focus{--tw-text-opacity:1;color:rgb(255 205 163/var(--tw-text-opacity))}.focus\\:text-secondary-orange-600:focus{--tw-text-opacity:1;color:rgb(255 177 111/var(--tw-text-opacity))}.focus\\:text-secondary-pink-200:focus{--tw-text-opacity:1;color:rgb(255 224 245/var(--tw-text-opacity))}.focus\\:text-secondary-pink-400:focus{--tw-text-opacity:1;color:rgb(255 199 236/var(--tw-text-opacity))}.focus\\:text-secondary-pink-600:focus{--tw-text-opacity:1;color:rgb(255 175 228/var(--tw-text-opacity))}.focus\\:text-secondary-purple-200:focus{--tw-text-opacity:1;color:rgb(214 216 255/var(--tw-text-opacity))}.focus\\:text-secondary-purple-400:focus{--tw-text-opacity:1;color:rgb(163 167 255/var(--tw-text-opacity))}.focus\\:text-secondary-purple-600:focus{--tw-text-opacity:1;color:rgb(113 118 255/var(--tw-text-opacity))}.focus\\:text-secondary-teal-200:focus{--tw-text-opacity:1;color:rgb(201 237 237/var(--tw-text-opacity))}.focus\\:text-secondary-teal-400:focus{--tw-text-opacity:1;color:rgb(163 224 225/var(--tw-text-opacity))}.focus\\:text-secondary-teal-600:focus{--tw-text-opacity:1;color:rgb(124 211 212/var(--tw-text-opacity))}.focus\\:text-secondary-yellow-200:focus{--tw-text-opacity:1;color:rgb(254 250 215/var(--tw-text-opacity))}.focus\\:text-secondary-yellow-400:focus{--tw-text-opacity:1;color:rgb(252 244 166/var(--tw-text-opacity))}.focus\\:text-secondary-yellow-600:focus{--tw-text-opacity:1;color:rgb(251 237 116/var(--tw-text-opacity))}.focus\\:text-semantic-error:focus{--tw-text-opacity:1;color:rgb(255 112 77/var(--tw-text-opacity))}.focus\\:text-semantic-success:focus{--tw-text-opacity:1;color:rgb(97 218 150/var(--tw-text-opacity))}.focus\\:text-semantic-warning:focus{--tw-text-opacity:1;color:rgb(255 185 67/var(--tw-text-opacity))}.active\\:border-neutral-200:active{--tw-border-opacity:1;border-color:rgb(255 245 248/var(--tw-border-opacity))}.active\\:border-neutral-300:active{--tw-border-opacity:1;border-color:rgb(249 226 227/var(--tw-border-opacity))}.active\\:border-neutral-400:active{--tw-border-opacity:1;border-color:rgb(216 216 216/var(--tw-border-opacity))}.active\\:border-neutral-500:active{--tw-border-opacity:1;border-color:rgb(179 179 179/var(--tw-border-opacity))}.active\\:border-neutral-600:active{--tw-border-opacity:1;border-color:rgb(125 125 125/var(--tw-border-opacity))}.active\\:border-neutral-700:active{--tw-border-opacity:1;border-color:rgb(81 81 81/var(--tw-border-opacity))}.active\\:border-neutral-800:active{--tw-border-opacity:1;border-color:rgb(50 50 50/var(--tw-border-opacity))}.active\\:border-primary-blue:active{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.active\\:border-primary-blue-200:active{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.active\\:border-primary-blue-400:active{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.active\\:border-primary-blue-600:active,.active\\:border-primary-green:active{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.active\\:border-primary-green-200:active{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.active\\:border-primary-green-400:active{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.active\\:border-primary-green-600:active{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.active\\:border-secondary-beige-200:active{--tw-border-opacity:1;border-color:rgb(248 245 236/var(--tw-border-opacity))}.active\\:border-secondary-beige-400:active{--tw-border-opacity:1;border-color:rgb(235 225 199/var(--tw-border-opacity))}.active\\:border-secondary-beige-600:active{--tw-border-opacity:1;border-color:rgb(222 205 163/var(--tw-border-opacity))}.active\\:border-secondary-orange-200:active{--tw-border-opacity:1;border-color:rgb(255 233 214/var(--tw-border-opacity))}.active\\:border-secondary-orange-400:active{--tw-border-opacity:1;border-color:rgb(255 205 163/var(--tw-border-opacity))}.active\\:border-secondary-orange-600:active{--tw-border-opacity:1;border-color:rgb(255 177 111/var(--tw-border-opacity))}.active\\:border-secondary-pink-200:active{--tw-border-opacity:1;border-color:rgb(255 224 245/var(--tw-border-opacity))}.active\\:border-secondary-pink-400:active{--tw-border-opacity:1;border-color:rgb(255 199 236/var(--tw-border-opacity))}.active\\:border-secondary-pink-600:active{--tw-border-opacity:1;border-color:rgb(255 175 228/var(--tw-border-opacity))}.active\\:border-secondary-purple-200:active{--tw-border-opacity:1;border-color:rgb(214 216 255/var(--tw-border-opacity))}.active\\:border-secondary-purple-400:active{--tw-border-opacity:1;border-color:rgb(163 167 255/var(--tw-border-opacity))}.active\\:border-secondary-purple-600:active{--tw-border-opacity:1;border-color:rgb(113 118 255/var(--tw-border-opacity))}.active\\:border-secondary-teal-200:active{--tw-border-opacity:1;border-color:rgb(201 237 237/var(--tw-border-opacity))}.active\\:border-secondary-teal-400:active{--tw-border-opacity:1;border-color:rgb(163 224 225/var(--tw-border-opacity))}.active\\:border-secondary-teal-600:active{--tw-border-opacity:1;border-color:rgb(124 211 212/var(--tw-border-opacity))}.active\\:border-secondary-yellow-200:active{--tw-border-opacity:1;border-color:rgb(254 250 215/var(--tw-border-opacity))}.active\\:border-secondary-yellow-400:active{--tw-border-opacity:1;border-color:rgb(252 244 166/var(--tw-border-opacity))}.active\\:border-secondary-yellow-600:active{--tw-border-opacity:1;border-color:rgb(251 237 116/var(--tw-border-opacity))}.active\\:border-semantic-error:active{--tw-border-opacity:1;border-color:rgb(255 112 77/var(--tw-border-opacity))}.active\\:border-semantic-success:active{--tw-border-opacity:1;border-color:rgb(97 218 150/var(--tw-border-opacity))}.active\\:border-semantic-warning:active{--tw-border-opacity:1;border-color:rgb(255 185 67/var(--tw-border-opacity))}.active\\:bg-neutral-200:active{--tw-bg-opacity:1;background-color:rgb(255 245 248/var(--tw-bg-opacity))}.active\\:bg-neutral-300:active{--tw-bg-opacity:1;background-color:rgb(249 226 227/var(--tw-bg-opacity))}.active\\:bg-neutral-400:active{--tw-bg-opacity:1;background-color:rgb(216 216 216/var(--tw-bg-opacity))}.active\\:bg-neutral-500:active{--tw-bg-opacity:1;background-color:rgb(179 179 179/var(--tw-bg-opacity))}.active\\:bg-neutral-600:active{--tw-bg-opacity:1;background-color:rgb(125 125 125/var(--tw-bg-opacity))}.active\\:bg-neutral-700:active{--tw-bg-opacity:1;background-color:rgb(81 81 81/var(--tw-bg-opacity))}.active\\:bg-neutral-800:active{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.active\\:bg-primary-blue:active{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.active\\:bg-primary-blue-200:active{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.active\\:bg-primary-blue-400:active{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.active\\:bg-primary-blue-600:active,.active\\:bg-primary-green:active{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.active\\:bg-primary-green-200:active{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.active\\:bg-primary-green-400:active{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.active\\:bg-primary-green-600:active{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.active\\:bg-secondary-beige-200:active{--tw-bg-opacity:1;background-color:rgb(248 245 236/var(--tw-bg-opacity))}.active\\:bg-secondary-beige-400:active{--tw-bg-opacity:1;background-color:rgb(235 225 199/var(--tw-bg-opacity))}.active\\:bg-secondary-beige-600:active{--tw-bg-opacity:1;background-color:rgb(222 205 163/var(--tw-bg-opacity))}.active\\:bg-secondary-orange-200:active{--tw-bg-opacity:1;background-color:rgb(255 233 214/var(--tw-bg-opacity))}.active\\:bg-secondary-orange-400:active{--tw-bg-opacity:1;background-color:rgb(255 205 163/var(--tw-bg-opacity))}.active\\:bg-secondary-orange-600:active{--tw-bg-opacity:1;background-color:rgb(255 177 111/var(--tw-bg-opacity))}.active\\:bg-secondary-pink-200:active{--tw-bg-opacity:1;background-color:rgb(255 224 245/var(--tw-bg-opacity))}.active\\:bg-secondary-pink-400:active{--tw-bg-opacity:1;background-color:rgb(255 199 236/var(--tw-bg-opacity))}.active\\:bg-secondary-pink-600:active{--tw-bg-opacity:1;background-color:rgb(255 175 228/var(--tw-bg-opacity))}.active\\:bg-secondary-purple-200:active{--tw-bg-opacity:1;background-color:rgb(214 216 255/var(--tw-bg-opacity))}.active\\:bg-secondary-purple-400:active{--tw-bg-opacity:1;background-color:rgb(163 167 255/var(--tw-bg-opacity))}.active\\:bg-secondary-purple-600:active{--tw-bg-opacity:1;background-color:rgb(113 118 255/var(--tw-bg-opacity))}.active\\:bg-secondary-teal-200:active{--tw-bg-opacity:1;background-color:rgb(201 237 237/var(--tw-bg-opacity))}.active\\:bg-secondary-teal-400:active{--tw-bg-opacity:1;background-color:rgb(163 224 225/var(--tw-bg-opacity))}.active\\:bg-secondary-teal-600:active{--tw-bg-opacity:1;background-color:rgb(124 211 212/var(--tw-bg-opacity))}.active\\:bg-secondary-yellow-200:active{--tw-bg-opacity:1;background-color:rgb(254 250 215/var(--tw-bg-opacity))}.active\\:bg-secondary-yellow-400:active{--tw-bg-opacity:1;background-color:rgb(252 244 166/var(--tw-bg-opacity))}.active\\:bg-secondary-yellow-600:active{--tw-bg-opacity:1;background-color:rgb(251 237 116/var(--tw-bg-opacity))}.active\\:bg-semantic-error:active{--tw-bg-opacity:1;background-color:rgb(255 112 77/var(--tw-bg-opacity))}.active\\:bg-semantic-success:active{--tw-bg-opacity:1;background-color:rgb(97 218 150/var(--tw-bg-opacity))}.active\\:bg-semantic-warning:active{--tw-bg-opacity:1;background-color:rgb(255 185 67/var(--tw-bg-opacity))}.active\\:fill-neutral-200:active{fill:#fff5f8}.active\\:fill-neutral-300:active{fill:#f9e2e3}.active\\:fill-neutral-400:active{fill:#d8d8d8}.active\\:fill-neutral-500:active{fill:#b3b3b3}.active\\:fill-neutral-600:active{fill:#7d7d7d}.active\\:fill-neutral-700:active{fill:#515151}.active\\:fill-neutral-800:active{fill:#323232}.active\\:fill-primary-blue:active{fill:#ff6973}.active\\:fill-primary-blue-200:active{fill:#ffe9eb}.active\\:fill-primary-blue-400:active{fill:#ffb7c8}.active\\:fill-primary-blue-600:active,.active\\:fill-primary-green:active{fill:#ff6973}.active\\:fill-primary-green-200:active{fill:#ffe9eb}.active\\:fill-primary-green-400:active{fill:#ffb7c8}.active\\:fill-primary-green-600:active{fill:#ff6973}.active\\:fill-secondary-beige-200:active{fill:#f8f5ec}.active\\:fill-secondary-beige-400:active{fill:#ebe1c7}.active\\:fill-secondary-beige-600:active{fill:#decda3}.active\\:fill-secondary-orange-200:active{fill:#ffe9d6}.active\\:fill-secondary-orange-400:active{fill:#ffcda3}.active\\:fill-secondary-orange-600:active{fill:#ffb16f}.active\\:fill-secondary-pink-200:active{fill:#ffe0f5}.active\\:fill-secondary-pink-400:active{fill:#ffc7ec}.active\\:fill-secondary-pink-600:active{fill:#ffafe4}.active\\:fill-secondary-purple-200:active{fill:#d6d8ff}.active\\:fill-secondary-purple-400:active{fill:#a3a7ff}.active\\:fill-secondary-purple-600:active{fill:#7176ff}.active\\:fill-secondary-teal-200:active{fill:#c9eded}.active\\:fill-secondary-teal-400:active{fill:#a3e0e1}.active\\:fill-secondary-teal-600:active{fill:#7cd3d4}.active\\:fill-secondary-yellow-200:active{fill:#fefad7}.active\\:fill-secondary-yellow-400:active{fill:#fcf4a6}.active\\:fill-secondary-yellow-600:active{fill:#fbed74}.active\\:fill-semantic-error:active{fill:#ff704d}.active\\:fill-semantic-success:active{fill:#61da96}.active\\:fill-semantic-warning:active{fill:#ffb943}.active\\:text-neutral-200:active{--tw-text-opacity:1;color:rgb(255 245 248/var(--tw-text-opacity))}.active\\:text-neutral-300:active{--tw-text-opacity:1;color:rgb(249 226 227/var(--tw-text-opacity))}.active\\:text-neutral-400:active{--tw-text-opacity:1;color:rgb(216 216 216/var(--tw-text-opacity))}.active\\:text-neutral-500:active{--tw-text-opacity:1;color:rgb(179 179 179/var(--tw-text-opacity))}.active\\:text-neutral-600:active{--tw-text-opacity:1;color:rgb(125 125 125/var(--tw-text-opacity))}.active\\:text-neutral-700:active{--tw-text-opacity:1;color:rgb(81 81 81/var(--tw-text-opacity))}.active\\:text-neutral-800:active{--tw-text-opacity:1;color:rgb(50 50 50/var(--tw-text-opacity))}.active\\:text-primary-blue:active{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.active\\:text-primary-blue-200:active{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.active\\:text-primary-blue-400:active{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.active\\:text-primary-blue-600:active,.active\\:text-primary-green:active{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.active\\:text-primary-green-200:active{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.active\\:text-primary-green-400:active{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.active\\:text-primary-green-600:active{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.active\\:text-secondary-beige-200:active{--tw-text-opacity:1;color:rgb(248 245 236/var(--tw-text-opacity))}.active\\:text-secondary-beige-400:active{--tw-text-opacity:1;color:rgb(235 225 199/var(--tw-text-opacity))}.active\\:text-secondary-beige-600:active{--tw-text-opacity:1;color:rgb(222 205 163/var(--tw-text-opacity))}.active\\:text-secondary-orange-200:active{--tw-text-opacity:1;color:rgb(255 233 214/var(--tw-text-opacity))}.active\\:text-secondary-orange-400:active{--tw-text-opacity:1;color:rgb(255 205 163/var(--tw-text-opacity))}.active\\:text-secondary-orange-600:active{--tw-text-opacity:1;color:rgb(255 177 111/var(--tw-text-opacity))}.active\\:text-secondary-pink-200:active{--tw-text-opacity:1;color:rgb(255 224 245/var(--tw-text-opacity))}.active\\:text-secondary-pink-400:active{--tw-text-opacity:1;color:rgb(255 199 236/var(--tw-text-opacity))}.active\\:text-secondary-pink-600:active{--tw-text-opacity:1;color:rgb(255 175 228/var(--tw-text-opacity))}.active\\:text-secondary-purple-200:active{--tw-text-opacity:1;color:rgb(214 216 255/var(--tw-text-opacity))}.active\\:text-secondary-purple-400:active{--tw-text-opacity:1;color:rgb(163 167 255/var(--tw-text-opacity))}.active\\:text-secondary-purple-600:active{--tw-text-opacity:1;color:rgb(113 118 255/var(--tw-text-opacity))}.active\\:text-secondary-teal-200:active{--tw-text-opacity:1;color:rgb(201 237 237/var(--tw-text-opacity))}.active\\:text-secondary-teal-400:active{--tw-text-opacity:1;color:rgb(163 224 225/var(--tw-text-opacity))}.active\\:text-secondary-teal-600:active{--tw-text-opacity:1;color:rgb(124 211 212/var(--tw-text-opacity))}.active\\:text-secondary-yellow-200:active{--tw-text-opacity:1;color:rgb(254 250 215/var(--tw-text-opacity))}.active\\:text-secondary-yellow-400:active{--tw-text-opacity:1;color:rgb(252 244 166/var(--tw-text-opacity))}.active\\:text-secondary-yellow-600:active{--tw-text-opacity:1;color:rgb(251 237 116/var(--tw-text-opacity))}.active\\:text-semantic-error:active{--tw-text-opacity:1;color:rgb(255 112 77/var(--tw-text-opacity))}.active\\:text-semantic-success:active{--tw-text-opacity:1;color:rgb(97 218 150/var(--tw-text-opacity))}.active\\:text-semantic-warning:active{--tw-text-opacity:1;color:rgb(255 185 67/var(--tw-text-opacity))}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:border-neutral-200:disabled{--tw-border-opacity:1;border-color:rgb(255 245 248/var(--tw-border-opacity))}.disabled\\:border-neutral-300:disabled{--tw-border-opacity:1;border-color:rgb(249 226 227/var(--tw-border-opacity))}.disabled\\:border-neutral-400:disabled{--tw-border-opacity:1;border-color:rgb(216 216 216/var(--tw-border-opacity))}.disabled\\:border-neutral-500:disabled{--tw-border-opacity:1;border-color:rgb(179 179 179/var(--tw-border-opacity))}.disabled\\:border-neutral-600:disabled{--tw-border-opacity:1;border-color:rgb(125 125 125/var(--tw-border-opacity))}.disabled\\:border-neutral-700:disabled{--tw-border-opacity:1;border-color:rgb(81 81 81/var(--tw-border-opacity))}.disabled\\:border-neutral-800:disabled{--tw-border-opacity:1;border-color:rgb(50 50 50/var(--tw-border-opacity))}.disabled\\:border-primary-blue:disabled{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.disabled\\:border-primary-blue-200:disabled{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.disabled\\:border-primary-blue-400:disabled{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.disabled\\:border-primary-blue-600:disabled,.disabled\\:border-primary-green:disabled{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.disabled\\:border-primary-green-200:disabled{--tw-border-opacity:1;border-color:rgb(255 233 235/var(--tw-border-opacity))}.disabled\\:border-primary-green-400:disabled{--tw-border-opacity:1;border-color:rgb(255 183 200/var(--tw-border-opacity))}.disabled\\:border-primary-green-600:disabled{--tw-border-opacity:1;border-color:rgb(255 105 115/var(--tw-border-opacity))}.disabled\\:border-secondary-beige-200:disabled{--tw-border-opacity:1;border-color:rgb(248 245 236/var(--tw-border-opacity))}.disabled\\:border-secondary-beige-400:disabled{--tw-border-opacity:1;border-color:rgb(235 225 199/var(--tw-border-opacity))}.disabled\\:border-secondary-beige-600:disabled{--tw-border-opacity:1;border-color:rgb(222 205 163/var(--tw-border-opacity))}.disabled\\:border-secondary-orange-200:disabled{--tw-border-opacity:1;border-color:rgb(255 233 214/var(--tw-border-opacity))}.disabled\\:border-secondary-orange-400:disabled{--tw-border-opacity:1;border-color:rgb(255 205 163/var(--tw-border-opacity))}.disabled\\:border-secondary-orange-600:disabled{--tw-border-opacity:1;border-color:rgb(255 177 111/var(--tw-border-opacity))}.disabled\\:border-secondary-pink-200:disabled{--tw-border-opacity:1;border-color:rgb(255 224 245/var(--tw-border-opacity))}.disabled\\:border-secondary-pink-400:disabled{--tw-border-opacity:1;border-color:rgb(255 199 236/var(--tw-border-opacity))}.disabled\\:border-secondary-pink-600:disabled{--tw-border-opacity:1;border-color:rgb(255 175 228/var(--tw-border-opacity))}.disabled\\:border-secondary-purple-200:disabled{--tw-border-opacity:1;border-color:rgb(214 216 255/var(--tw-border-opacity))}.disabled\\:border-secondary-purple-400:disabled{--tw-border-opacity:1;border-color:rgb(163 167 255/var(--tw-border-opacity))}.disabled\\:border-secondary-purple-600:disabled{--tw-border-opacity:1;border-color:rgb(113 118 255/var(--tw-border-opacity))}.disabled\\:border-secondary-teal-200:disabled{--tw-border-opacity:1;border-color:rgb(201 237 237/var(--tw-border-opacity))}.disabled\\:border-secondary-teal-400:disabled{--tw-border-opacity:1;border-color:rgb(163 224 225/var(--tw-border-opacity))}.disabled\\:border-secondary-teal-600:disabled{--tw-border-opacity:1;border-color:rgb(124 211 212/var(--tw-border-opacity))}.disabled\\:border-secondary-yellow-200:disabled{--tw-border-opacity:1;border-color:rgb(254 250 215/var(--tw-border-opacity))}.disabled\\:border-secondary-yellow-400:disabled{--tw-border-opacity:1;border-color:rgb(252 244 166/var(--tw-border-opacity))}.disabled\\:border-secondary-yellow-600:disabled{--tw-border-opacity:1;border-color:rgb(251 237 116/var(--tw-border-opacity))}.disabled\\:border-semantic-error:disabled{--tw-border-opacity:1;border-color:rgb(255 112 77/var(--tw-border-opacity))}.disabled\\:border-semantic-success:disabled{--tw-border-opacity:1;border-color:rgb(97 218 150/var(--tw-border-opacity))}.disabled\\:border-semantic-warning:disabled{--tw-border-opacity:1;border-color:rgb(255 185 67/var(--tw-border-opacity))}.disabled\\:bg-neutral-200:disabled{--tw-bg-opacity:1;background-color:rgb(255 245 248/var(--tw-bg-opacity))}.disabled\\:bg-neutral-300:disabled{--tw-bg-opacity:1;background-color:rgb(249 226 227/var(--tw-bg-opacity))}.disabled\\:bg-neutral-400:disabled{--tw-bg-opacity:1;background-color:rgb(216 216 216/var(--tw-bg-opacity))}.disabled\\:bg-neutral-500:disabled{--tw-bg-opacity:1;background-color:rgb(179 179 179/var(--tw-bg-opacity))}.disabled\\:bg-neutral-600:disabled{--tw-bg-opacity:1;background-color:rgb(125 125 125/var(--tw-bg-opacity))}.disabled\\:bg-neutral-700:disabled{--tw-bg-opacity:1;background-color:rgb(81 81 81/var(--tw-bg-opacity))}.disabled\\:bg-neutral-800:disabled{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.disabled\\:bg-primary-blue:disabled{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.disabled\\:bg-primary-blue-200:disabled{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.disabled\\:bg-primary-blue-400:disabled{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.disabled\\:bg-primary-blue-600:disabled,.disabled\\:bg-primary-green:disabled{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.disabled\\:bg-primary-green-200:disabled{--tw-bg-opacity:1;background-color:rgb(255 233 235/var(--tw-bg-opacity))}.disabled\\:bg-primary-green-400:disabled{--tw-bg-opacity:1;background-color:rgb(255 183 200/var(--tw-bg-opacity))}.disabled\\:bg-primary-green-600:disabled{--tw-bg-opacity:1;background-color:rgb(255 105 115/var(--tw-bg-opacity))}.disabled\\:bg-secondary-beige-200:disabled{--tw-bg-opacity:1;background-color:rgb(248 245 236/var(--tw-bg-opacity))}.disabled\\:bg-secondary-beige-400:disabled{--tw-bg-opacity:1;background-color:rgb(235 225 199/var(--tw-bg-opacity))}.disabled\\:bg-secondary-beige-600:disabled{--tw-bg-opacity:1;background-color:rgb(222 205 163/var(--tw-bg-opacity))}.disabled\\:bg-secondary-orange-200:disabled{--tw-bg-opacity:1;background-color:rgb(255 233 214/var(--tw-bg-opacity))}.disabled\\:bg-secondary-orange-400:disabled{--tw-bg-opacity:1;background-color:rgb(255 205 163/var(--tw-bg-opacity))}.disabled\\:bg-secondary-orange-600:disabled{--tw-bg-opacity:1;background-color:rgb(255 177 111/var(--tw-bg-opacity))}.disabled\\:bg-secondary-pink-200:disabled{--tw-bg-opacity:1;background-color:rgb(255 224 245/var(--tw-bg-opacity))}.disabled\\:bg-secondary-pink-400:disabled{--tw-bg-opacity:1;background-color:rgb(255 199 236/var(--tw-bg-opacity))}.disabled\\:bg-secondary-pink-600:disabled{--tw-bg-opacity:1;background-color:rgb(255 175 228/var(--tw-bg-opacity))}.disabled\\:bg-secondary-purple-200:disabled{--tw-bg-opacity:1;background-color:rgb(214 216 255/var(--tw-bg-opacity))}.disabled\\:bg-secondary-purple-400:disabled{--tw-bg-opacity:1;background-color:rgb(163 167 255/var(--tw-bg-opacity))}.disabled\\:bg-secondary-purple-600:disabled{--tw-bg-opacity:1;background-color:rgb(113 118 255/var(--tw-bg-opacity))}.disabled\\:bg-secondary-teal-200:disabled{--tw-bg-opacity:1;background-color:rgb(201 237 237/var(--tw-bg-opacity))}.disabled\\:bg-secondary-teal-400:disabled{--tw-bg-opacity:1;background-color:rgb(163 224 225/var(--tw-bg-opacity))}.disabled\\:bg-secondary-teal-600:disabled{--tw-bg-opacity:1;background-color:rgb(124 211 212/var(--tw-bg-opacity))}.disabled\\:bg-secondary-yellow-200:disabled{--tw-bg-opacity:1;background-color:rgb(254 250 215/var(--tw-bg-opacity))}.disabled\\:bg-secondary-yellow-400:disabled{--tw-bg-opacity:1;background-color:rgb(252 244 166/var(--tw-bg-opacity))}.disabled\\:bg-secondary-yellow-600:disabled{--tw-bg-opacity:1;background-color:rgb(251 237 116/var(--tw-bg-opacity))}.disabled\\:bg-semantic-error:disabled{--tw-bg-opacity:1;background-color:rgb(255 112 77/var(--tw-bg-opacity))}.disabled\\:bg-semantic-success:disabled{--tw-bg-opacity:1;background-color:rgb(97 218 150/var(--tw-bg-opacity))}.disabled\\:bg-semantic-warning:disabled{--tw-bg-opacity:1;background-color:rgb(255 185 67/var(--tw-bg-opacity))}.disabled\\:fill-neutral-200:disabled{fill:#fff5f8}.disabled\\:fill-neutral-300:disabled{fill:#f9e2e3}.disabled\\:fill-neutral-400:disabled{fill:#d8d8d8}.disabled\\:fill-neutral-500:disabled{fill:#b3b3b3}.disabled\\:fill-neutral-600:disabled{fill:#7d7d7d}.disabled\\:fill-neutral-700:disabled{fill:#515151}.disabled\\:fill-neutral-800:disabled{fill:#323232}.disabled\\:fill-primary-blue:disabled{fill:#ff6973}.disabled\\:fill-primary-blue-200:disabled{fill:#ffe9eb}.disabled\\:fill-primary-blue-400:disabled{fill:#ffb7c8}.disabled\\:fill-primary-blue-600:disabled,.disabled\\:fill-primary-green:disabled{fill:#ff6973}.disabled\\:fill-primary-green-200:disabled{fill:#ffe9eb}.disabled\\:fill-primary-green-400:disabled{fill:#ffb7c8}.disabled\\:fill-primary-green-600:disabled{fill:#ff6973}.disabled\\:fill-secondary-beige-200:disabled{fill:#f8f5ec}.disabled\\:fill-secondary-beige-400:disabled{fill:#ebe1c7}.disabled\\:fill-secondary-beige-600:disabled{fill:#decda3}.disabled\\:fill-secondary-orange-200:disabled{fill:#ffe9d6}.disabled\\:fill-secondary-orange-400:disabled{fill:#ffcda3}.disabled\\:fill-secondary-orange-600:disabled{fill:#ffb16f}.disabled\\:fill-secondary-pink-200:disabled{fill:#ffe0f5}.disabled\\:fill-secondary-pink-400:disabled{fill:#ffc7ec}.disabled\\:fill-secondary-pink-600:disabled{fill:#ffafe4}.disabled\\:fill-secondary-purple-200:disabled{fill:#d6d8ff}.disabled\\:fill-secondary-purple-400:disabled{fill:#a3a7ff}.disabled\\:fill-secondary-purple-600:disabled{fill:#7176ff}.disabled\\:fill-secondary-teal-200:disabled{fill:#c9eded}.disabled\\:fill-secondary-teal-400:disabled{fill:#a3e0e1}.disabled\\:fill-secondary-teal-600:disabled{fill:#7cd3d4}.disabled\\:fill-secondary-yellow-200:disabled{fill:#fefad7}.disabled\\:fill-secondary-yellow-400:disabled{fill:#fcf4a6}.disabled\\:fill-secondary-yellow-600:disabled{fill:#fbed74}.disabled\\:fill-semantic-error:disabled{fill:#ff704d}.disabled\\:fill-semantic-success:disabled{fill:#61da96}.disabled\\:fill-semantic-warning:disabled{fill:#ffb943}.disabled\\:text-neutral-200:disabled{--tw-text-opacity:1;color:rgb(255 245 248/var(--tw-text-opacity))}.disabled\\:text-neutral-300:disabled{--tw-text-opacity:1;color:rgb(249 226 227/var(--tw-text-opacity))}.disabled\\:text-neutral-400:disabled{--tw-text-opacity:1;color:rgb(216 216 216/var(--tw-text-opacity))}.disabled\\:text-neutral-500:disabled{--tw-text-opacity:1;color:rgb(179 179 179/var(--tw-text-opacity))}.disabled\\:text-neutral-600:disabled{--tw-text-opacity:1;color:rgb(125 125 125/var(--tw-text-opacity))}.disabled\\:text-neutral-700:disabled{--tw-text-opacity:1;color:rgb(81 81 81/var(--tw-text-opacity))}.disabled\\:text-neutral-800:disabled{--tw-text-opacity:1;color:rgb(50 50 50/var(--tw-text-opacity))}.disabled\\:text-primary-blue:disabled{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.disabled\\:text-primary-blue-200:disabled{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.disabled\\:text-primary-blue-400:disabled{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.disabled\\:text-primary-blue-600:disabled,.disabled\\:text-primary-green:disabled{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.disabled\\:text-primary-green-200:disabled{--tw-text-opacity:1;color:rgb(255 233 235/var(--tw-text-opacity))}.disabled\\:text-primary-green-400:disabled{--tw-text-opacity:1;color:rgb(255 183 200/var(--tw-text-opacity))}.disabled\\:text-primary-green-600:disabled{--tw-text-opacity:1;color:rgb(255 105 115/var(--tw-text-opacity))}.disabled\\:text-secondary-beige-200:disabled{--tw-text-opacity:1;color:rgb(248 245 236/var(--tw-text-opacity))}.disabled\\:text-secondary-beige-400:disabled{--tw-text-opacity:1;color:rgb(235 225 199/var(--tw-text-opacity))}.disabled\\:text-secondary-beige-600:disabled{--tw-text-opacity:1;color:rgb(222 205 163/var(--tw-text-opacity))}.disabled\\:text-secondary-orange-200:disabled{--tw-text-opacity:1;color:rgb(255 233 214/var(--tw-text-opacity))}.disabled\\:text-secondary-orange-400:disabled{--tw-text-opacity:1;color:rgb(255 205 163/var(--tw-text-opacity))}.disabled\\:text-secondary-orange-600:disabled{--tw-text-opacity:1;color:rgb(255 177 111/var(--tw-text-opacity))}.disabled\\:text-secondary-pink-200:disabled{--tw-text-opacity:1;color:rgb(255 224 245/var(--tw-text-opacity))}.disabled\\:text-secondary-pink-400:disabled{--tw-text-opacity:1;color:rgb(255 199 236/var(--tw-text-opacity))}.disabled\\:text-secondary-pink-600:disabled{--tw-text-opacity:1;color:rgb(255 175 228/var(--tw-text-opacity))}.disabled\\:text-secondary-purple-200:disabled{--tw-text-opacity:1;color:rgb(214 216 255/var(--tw-text-opacity))}.disabled\\:text-secondary-purple-400:disabled{--tw-text-opacity:1;color:rgb(163 167 255/var(--tw-text-opacity))}.disabled\\:text-secondary-purple-600:disabled{--tw-text-opacity:1;color:rgb(113 118 255/var(--tw-text-opacity))}.disabled\\:text-secondary-teal-200:disabled{--tw-text-opacity:1;color:rgb(201 237 237/var(--tw-text-opacity))}.disabled\\:text-secondary-teal-400:disabled{--tw-text-opacity:1;color:rgb(163 224 225/var(--tw-text-opacity))}.disabled\\:text-secondary-teal-600:disabled{--tw-text-opacity:1;color:rgb(124 211 212/var(--tw-text-opacity))}.disabled\\:text-secondary-yellow-200:disabled{--tw-text-opacity:1;color:rgb(254 250 215/var(--tw-text-opacity))}.disabled\\:text-secondary-yellow-400:disabled{--tw-text-opacity:1;color:rgb(252 244 166/var(--tw-text-opacity))}.disabled\\:text-secondary-yellow-600:disabled{--tw-text-opacity:1;color:rgb(251 237 116/var(--tw-text-opacity))}.disabled\\:text-semantic-error:disabled{--tw-text-opacity:1;color:rgb(255 112 77/var(--tw-text-opacity))}.disabled\\:text-semantic-success:disabled{--tw-text-opacity:1;color:rgb(97 218 150/var(--tw-text-opacity))}.disabled\\:text-semantic-warning:disabled{--tw-text-opacity:1;color:rgb(255 185 67/var(--tw-text-opacity))}.group:hover .group-hover\\:ml-1{margin-left:4px}.group:hover .group-hover\\:mr-0{margin-right:0}@media (min-width:640px){.sm\\:h-30{height:120px}}@media (min-width:768px){.md\\:col-span-12{grid-column:span 12/span 12}.md\\:col-start-9{grid-column-start:9}.md\\:col-end-13{grid-column-end:13}.md\\:col-end-9{grid-column-end:9}.md\\:flex{display:flex}.md\\:grid-cols-md{grid-template-columns:repeat(12,48px)}.md\\:gap-md{gap:16px}.md\\:rounded{border-radius:8px}.md\\:border-y{border-bottom-width:1px;border-top-width:1px}.md\\:pt-1{padding-top:4px}.md\\:text-3xl{font-size:1.875rem}.md\\:text-4xl{font-size:2.375rem}.md\\:text-6xl{font-size:3.25rem}.md\\:text-7xl{font-size:3.875rem}.md\\:text-base{font-size:1rem}.md\\:text-head{font-size:22px}.md\\:text-lg{font-size:1.125rem}.md\\:text-sm{font-size:.875rem}.md\\:text-xl{font-size:1.25rem}.md\\:font-bold{font-weight:700}}@media (min-width:1280px){.xl\\:grid-cols-xl{grid-template-columns:repeat(12,80px)}.xl\\:gap-xl{gap:24px}}@media (max-width:767px){.sm-only\\:text-xs{font-size:.75rem}}";
styleInject(css_248z,{"insertAt":"top"});

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  strings.raw = raw;
  return strings;
}

var Spinner = function Spinner(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex items-center justify-center w-fit"
  }, /*#__PURE__*/React__default.createElement("svg", {
    "aria-hidden": "true",
    role: "status",
    className: cx("animate-[spin_1500ms_linear_infinite]", className),
    viewBox: "0 0 100 101",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
    fill: "#E5E7EB"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
    fill: "inherit"
  })));
};

var _excluded = ["label", "children", "border", "size", "disabled", "loading", "className"];
var Button = function Button(_ref) {
  var _cx;
  var label = _ref.label,
    children = _ref.children,
    _ref$border = _ref.border,
    border = _ref$border === void 0 ? "primary-blue-600" : _ref$border,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? "medium" : _ref$size,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$loading = _ref.loading,
    loading = _ref$loading === void 0 ? false : _ref$loading,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  var _useState = React.useState(false),
    isPressed = _useState[0],
    setIsPressed = _useState[1];
  var sizeClass = cx({
    "h-12 px-6 text-sm": size === "medium",
    "h-10 px-4 text-sm": size === "small",
    "h-8 px-2 text-xs": size === "compact"
  });
  var styleClass = cx((_cx = {
    "bg-neutral-100 text-neutral-600": disabled
  }, _cx["border-2 border-" + border + " bg-neutral-100 text-neutral-800"] = !disabled, _cx));
  var effectClass = cx({
    "shadow-sm": !disabled && !isPressed,
    "hover:shadow-md": !isPressed && !disabled && !loading,
    "cursor-default": !disabled && loading,
    "cursor-not-allowed": disabled
  });
  return /*#__PURE__*/React__default.createElement("button", Object.assign({
    className: cx("flex items-center justify-center w-fit rounded-full gap-2 transition-all", sizeClass, styleClass, effectClass, className),
    onMouseDown: function onMouseDown() {
      return setIsPressed(true);
    },
    onMouseUp: function onMouseUp() {
      return setIsPressed(false);
    },
    onTouchStart: function onTouchStart() {
      return setIsPressed(true);
    },
    onTouchEnd: function onTouchEnd() {
      return setIsPressed(false);
    }
  }, props), /*#__PURE__*/React__default.createElement("span", {
    className: cx("flex items-center gap-2 justify-center flex-nowrap whitespace-nowrap overflow-hidden transition-opacity", loading ? "opacity-0" : "opacity-100")
  }, children != null ? children : label), /*#__PURE__*/React__default.createElement("span", {
    className: cx("absolute flex items-center justify-center w-full h-full transition-opacity pointer-events-none", loading ? "opacity-100" : "opacity-0")
  }, /*#__PURE__*/React__default.createElement(Spinner, {
    className: "w-4 h-4 fill-" + border
  })));
};

var AnimationLoader = function AnimationLoader(_ref) {
  var animationData = _ref.animationData,
    _ref$width = _ref.width,
    width = _ref$width === void 0 ? 100 : _ref$width,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? 100 : _ref$height;
  var defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return /*#__PURE__*/React__default.createElement("div", null, animationData && /*#__PURE__*/React__default.createElement(Lottie, {
    options: defaultOptions,
    width: width,
    height: height
  }));
};

var _templateObject;
var iconSpacing = {
  xs: 24,
  sm: 48,
  md: 96,
  lg: 192,
  xl: 384
};
var CenteredIcon = /*#__PURE__*/styled__default.div(_templateObject || (_templateObject = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\theight: 100%;\n\twidth: 100%;\n\tsvg {\n\t\theight: 100%;\n\t\twidth: 100%;\n\t\tfill: ", ";\n\t}\n"])), function (props) {
  return "var(--tw-" + props.fill + ")";
});
var IllustrationRenderer = function IllustrationRenderer(props) {
  var icon = props.icon,
    size = props.size,
    className = props.className,
    customSize = props.customSize,
    _props$fillColor = props.fillColor,
    fillColor = _props$fillColor === void 0 ? "" : _props$fillColor;
  var squareSize;
  if (customSize !== undefined) {
    squareSize = customSize;
  } else {
    squareSize = iconSpacing[size];
  }
  var renderIcon = function renderIcon(icon) {
    if (typeof icon === "string") {
      return /*#__PURE__*/React__default.createElement(Image, {
        src: icon,
        alt: "Icon"
      });
    }
    return /*#__PURE__*/React__default.createElement(CenteredIcon, {
      fill: fillColor
    }, icon);
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: cx("relative", "inline-block", "flex items-center justify-center rounded", className),
    style: {
      width: squareSize,
      height: squareSize
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: squareSize,
      height: squareSize
    },
    className: "flex items-center justify-center"
  }, renderIcon(icon)));
};

var _excluded$1 = ["children", "size", "color", "background", "border", "className"];
var Label = function Label(_ref) {
  var children = _ref.children,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? "medium" : _ref$size,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? "neutral-800" : _ref$color,
    _ref$background = _ref.background,
    background = _ref$background === void 0 ? "neutral-100" : _ref$background,
    _ref$border = _ref.border,
    border = _ref$border === void 0 ? "neutral-200" : _ref$border,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cx("flex items-center justify-center w-fit flex-nowrap rounded px-2", size === "small" ? "text-xs" : "text-sm py-0.5", "border-2 border-" + border, "text-" + color + " bg-" + background, className)
  }, props), children);
};

var _excluded$2 = ["children", "className"];
var ActionContainer = function ActionContainer(_ref) {
  var children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  var _useState = React.useState(false),
    isPressed = _useState[0],
    setIsPressed = _useState[1];
  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cx("flex items-center justify-center w-fit cursor-pointer", "transition-all", isPressed ? "shadow-none" : "shadow-sm hover:shadow-md", className),
    onMouseDown: function onMouseDown() {
      return setIsPressed(true);
    },
    onMouseUp: function onMouseUp() {
      return setIsPressed(false);
    },
    onTouchStart: function onTouchStart() {
      return setIsPressed(true);
    },
    onTouchEnd: function onTouchEnd() {
      return setIsPressed(false);
    }
  }, props), children);
};

var GridContainer = function GridContainer(_ref) {
  var children = _ref.children,
    className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: cx("grid", "grid-cols-xs gap-xs", "md:grid-cols-md md:gap-md", "xl:grid-cols-xl xl:gap-xl", className)
  }, children);
};

function shortenAddress(address) {
  if (address === null) return '';
  if (isAddress(address)) return address.substring(0, 5) + '…' + address.substring(address.length - 4, address.length);else return address;
}
// check label type
function isAddress(address) {
  var re = /0x[a-fA-F0-9]{40}/g;
  return Boolean(address == null ? void 0 : address.match(re));
}
function isEnsDomain(input) {
  if (!input) return false;
  // The pattern for a valid ENS domain:
  // - starts with an alphanumeric character (case-insensitive)
  // - followed by zero or more alphanumeric characters, hyphens, or underscores (case-insensitive)
  // - ends with '.eth'
  var ensPattern = new RegExp('^([a-z0-9]+(-[a-z0-9]+)*.)*[a-z0-9]+(-[a-z0-9]+)*.eth$');
  return ensPattern.test(input);
}
function shortenENS(input) {
  if (!input || !isEnsDomain(input)) return input;
  var _input$split = input.split('.eth'),
    name = _input$split[0];
  var shortenedName = name.slice(0, 7);
  return shortenedName + "\u2026eth";
}

var shortenHash = function shortenHash(hash, charsStart, charsEnd) {
  if (charsStart === void 0) {
    charsStart = 4;
  }
  if (!hash) return "";
  return hash.substring(0, charsStart + 2) + "..." + hash.substring(hash.length - (charsEnd || charsStart));
};



var index = {
  __proto__: null,
  shortenAddress: shortenAddress,
  isAddress: isAddress,
  isEnsDomain: isEnsDomain,
  shortenENS: shortenENS,
  shortenHash: shortenHash
};

var _excluded$3 = ["color", "children", "className"];
var Body1 = function Body1(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  return /*#__PURE__*/React__default.createElement("p", Object.assign({
    className: cx("text-base md:text-lg font-medium tracking-wide", color ? "text-" + color : "text-neutral-800", className)
  }, props), children);
};

var _excluded$4 = ["color", "children", "className"];
var Body2 = function Body2(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$4);
  return /*#__PURE__*/React__default.createElement("p", Object.assign({
    className: cx("text-sm md:text-base tracking-wide", color ? "text-" + color : "text-neutral-800", className)
  }, props), children);
};

var _excluded$5 = ["color", "children", "className"];
var Body3 = function Body3(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$5);
  return /*#__PURE__*/React__default.createElement("p", Object.assign({
    className: cx("text-xs md:text-sm tracking-wide", color ? "text-" + color : "text-neutral-800", className)
  }, props), children);
};

var _excluded$6 = ["color", "children", "className"];
var BodyHeadline = function BodyHeadline(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$6);
  return /*#__PURE__*/React__default.createElement("h5", Object.assign({
    className: cx("text-xl md:text-head tracking-wide line-clamp-2 font-semibold", color && "text-" + color, className)
  }, props), children);
};

var _excluded$7 = ["color", "children"];
var Headline1 = function Headline1(_ref) {
  var color = _ref.color,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$7);
  return /*#__PURE__*/React__default.createElement("h1", Object.assign({}, props, {
    className: cx("text-5xl md:text-7xl pb-base", color && "text-" + color)
  }), children);
};

var _excluded$8 = ["color", "children"];
var Headline2 = function Headline2(_ref) {
  var color = _ref.color,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$8);
  return /*#__PURE__*/React__default.createElement("h2", Object.assign({}, props, {
    className: cx("text-5xl md:text-6xl pb-base", color && "text-" + color)
  }), children);
};

var _excluded$9 = ["color", "children"];
var Headline3 = function Headline3(_ref) {
  var color = _ref.color,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$9);
  return /*#__PURE__*/React__default.createElement("h3", Object.assign({}, props, {
    className: cx("text-3xl md:text-4xl md:font-bold font-semibold", color && "text-" + color)
  }), children);
};

var _excluded$a = ["color", "children", "className"];
var Headline4 = function Headline4(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$a);
  return /*#__PURE__*/React__default.createElement("h4", Object.assign({}, props, {
    className: cx("text-lg md:text-3xl pb-min3 md:pb-base font-medium", color && "text-" + color, className)
  }), children);
};

var _excluded$b = ["color", "children", "className"];
var HeadlineBasic = function HeadlineBasic(_ref) {
  var color = _ref.color,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$b);
  return /*#__PURE__*/React__default.createElement("h4", Object.assign({}, props, {
    className: cx("text-lg md:text-xl font-bold", color && "text-" + color, className)
  }), children);
};

var AddressDisplay = function AddressDisplay(_ref) {
  var address = _ref.address,
    ensName = _ref.ensName,
    className = _ref.className;
  var displayAddress = React.useMemo(function () {
    return ensName != null ? ensName : shortenHash(ethers.utils.getAddress(address));
  }, [address, ensName]);
  return /*#__PURE__*/React__default.createElement(Body3, {
    className: cx("flex flex-nowrap whitespace-nowrap overflow-hidden text-ellipsis items-stretch", className)
  }, displayAddress);
};

var IconRenderer = function IconRenderer(_ref) {
  var Icon = _ref.icon,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? "small" : _ref$size,
    _ref$rounded = _ref.rounded,
    rounded = _ref$rounded === void 0 ? true : _ref$rounded,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? "black" : _ref$color,
    background = _ref.background,
    iconClass = _ref.iconClass,
    containerClass = _ref.containerClass;
  var sizeClass = cx({
    "w-4 h-4": size === "extra-small",
    "w-6 h-6": size === "small",
    "w-8 h-8": size === "medium",
    "w-10 h-10": size === "large"
  });
  var paddingClass = cx({
    "p-2": size === "large"
  });
  var roundingClass = cx({
    "rounded-sm": size === "small",
    "rounded-md": size === "large",
    "rounded": !["large", "small"].includes(size)
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: cx("flex items-center justify-center w-fit transition-all", paddingClass, rounded && roundingClass, background ? "bg-" + background : "bg-transparent", containerClass)
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: cx("transition-all", sizeClass, "fill-" + color, iconClass)
  }));
};

var _excluded$c = ["theme", "background"];
var ThemedIconRenderer = function ThemedIconRenderer(_ref) {
  var theme = _ref.theme,
    _ref$background = _ref.background,
    background = _ref$background === void 0 ? true : _ref$background,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$c);
  var themes = {
    citizen: {
      color: "primary-blue-600",
      background: "primary-blue-200"
    },
    agreement: {
      color: "primary-green-600",
      background: "primary-green-200"
    },
    dispute: {
      color: "secondary-orange-600",
      background: "secondary-orange-200"
    },
    neutral: {
      color: "neutral-600",
      background: "neutral-200"
    }
  };
  return /*#__PURE__*/React__default.createElement(IconRenderer, Object.assign({}, props, {
    color: themes[theme].color,
    background: background ? themes[theme].background : "transparent"
  }));
};

var _excluded$d = ["leftIcon", "rightIcon", "size", "disabled", "border", "className", "children"];
var IconButton = function IconButton(_ref) {
  var LeftIcon = _ref.leftIcon,
    RightIcon = _ref.rightIcon,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? "medium" : _ref$size,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$border = _ref.border,
    border = _ref$border === void 0 ? "primary-blue-600" : _ref$border,
    className = _ref.className,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$d);
  var iconClass = cx(size === "compact" ? "w-4 h-4" : "w-6 h-6", disabled ? "fill-neutral-400" : "fill-" + border);
  /* Avoid weird tailwind spacing issues when using jit */
  var leftIconPadding = cx({
    "pl-2": size === "compact",
    "pl-3": size === "small",
    "pl-4": size === "medium"
  });
  var rightIconPadding = cx({
    "pr-2": size === "compact",
    "pr-3": size === "small",
    "pr-4": size === "medium"
  });
  return /*#__PURE__*/React__default.createElement(Button, Object.assign({
    size: size,
    disabled: disabled,
    border: border,
    className: cx(className, LeftIcon && leftIconPadding, RightIcon && rightIconPadding)
  }, props), LeftIcon && /*#__PURE__*/React__default.createElement(LeftIcon, {
    className: iconClass
  }), children, RightIcon && /*#__PURE__*/React__default.createElement(RightIcon, {
    className: iconClass
  }));
};

var _excluded$e = ["label", "children", "size", "disabled", "loading", "borderWidth", "gradient", "backgroundColor", "className"];
var _templateObject$1, _templateObject2;
var gradientStyles = /*#__PURE__*/styled.css(_templateObject$1 || (_templateObject$1 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  ", "\n"])), function (_ref) {
  var _ref$gradient = _ref.gradient,
    gradient = _ref$gradient === void 0 ? "" : _ref$gradient,
    _ref$borderWidth = _ref.borderWidth,
    borderWidth = _ref$borderWidth === void 0 ? 0 : _ref$borderWidth;
  return gradient && "\n    &:before {\n      content: '';\n      position: absolute;\n      top: 0; right: 0; bottom: 0; left: 0;\n      z-index: -1;\n      margin: -" + borderWidth + "px;\n      border-radius: inherit;\n      background: linear-gradient(to right, " + gradient + ");\n    }\n  ";
});
var StyledButton = /*#__PURE__*/styled__default.button(_templateObject2 || (_templateObject2 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: fit-content;\n  border-radius: 9999px; /* rounded-full */\n  gap: 0.5rem; /* gap-2 */\n  transition: all 0.2s;\n  position: relative;\n  padding: ", "px;\n  background: ", ";\n  background-clip: padding-box;\n  border: solid ", "px transparent;\n  ", "\n  ", "\n  ", "\n  ", "\n"])), function (_ref2) {
  var borderWidth = _ref2.borderWidth;
  return borderWidth;
}, function (_ref3) {
  var backgroundColor = _ref3.backgroundColor;
  return backgroundColor;
}, function (_ref4) {
  var borderWidth = _ref4.borderWidth;
  return borderWidth;
}, gradientStyles, function (_ref5) {
  var disabled = _ref5.disabled;
  return disabled && "\n    color: #A3A3A3; /* text-neutral-600 */\n    cursor: not-allowed;\n  ";
}, function (_ref6) {
  var disabled = _ref6.disabled,
    loading = _ref6.loading;
  return !disabled && !loading && "\n    &:hover {\n      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* hover:shadow-md */\n    }\n  ";
}, function (_ref7) {
  var loading = _ref7.loading;
  return loading && "\n    cursor: default;\n  ";
});
var GradientBorderButton = function GradientBorderButton(_ref8) {
  var label = _ref8.label,
    children = _ref8.children,
    _ref8$size = _ref8.size,
    size = _ref8$size === void 0 ? "medium" : _ref8$size,
    _ref8$disabled = _ref8.disabled,
    disabled = _ref8$disabled === void 0 ? false : _ref8$disabled,
    _ref8$loading = _ref8.loading,
    loading = _ref8$loading === void 0 ? false : _ref8$loading,
    _ref8$borderWidth = _ref8.borderWidth,
    borderWidth = _ref8$borderWidth === void 0 ? 2 : _ref8$borderWidth,
    _ref8$gradient = _ref8.gradient,
    gradient = _ref8$gradient === void 0 ? "blue, green" : _ref8$gradient,
    _ref8$backgroundColor = _ref8.backgroundColor,
    backgroundColor = _ref8$backgroundColor === void 0 ? "#F5F5F5" : _ref8$backgroundColor,
    className = _ref8.className,
    props = _objectWithoutPropertiesLoose(_ref8, _excluded$e);
  var _useState = React.useState(false),
    setIsPressed = _useState[1];
  var sizeClass = cx({
    "h-12 px-6 text-sm": size === "medium",
    "h-10 px-4 text-sm": size === "small",
    "h-8 px-2 text-xs": size === "compact"
  });
  return /*#__PURE__*/React__default.createElement(StyledButton, Object.assign({
    className: cx(sizeClass, className),
    onMouseDown: function onMouseDown() {
      return setIsPressed(true);
    },
    onMouseUp: function onMouseUp() {
      return setIsPressed(false);
    },
    onTouchStart: function onTouchStart() {
      return setIsPressed(true);
    },
    onTouchEnd: function onTouchEnd() {
      return setIsPressed(false);
    },
    disabled: disabled,
    loading: loading,
    borderWidth: borderWidth,
    gradient: gradient,
    backgroundColor: backgroundColor
  }, props), /*#__PURE__*/React__default.createElement("span", {
    className: cx("flex items-center gap-2 justify-center flex-nowrap whitespace-nowrap overflow-hidden transition-opacity", loading ? "opacity-0" : "opacity-100")
  }, children != null ? children : label), loading && ( /*#__PURE__*/React__default.createElement("span", {
    className: cx("absolute flex items-center justify-center w-full h-full transition-opacity pointer-events-none", loading ? "opacity-100" : "opacity-0")
  }, /*#__PURE__*/React__default.createElement(Spinner, {
    className: "w-4 h-4 fill-current"
  }))));
};

var _excluded$f = ["children", "className"];
var Card = function Card(props) {
  var children = props.children,
    className = props.className,
    rest = _objectWithoutPropertiesLoose(props, _excluded$f);
  var cardClass = cx("p-4", "w-full", "bg-white", "rounded-lg", "border-2", "border-neutral-c-200", "transition-all", className);
  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cardClass
  }, rest), children);
};

var _excluded$g = ["primaryIcon", "actionIcon", "theme", "disabled", "className", "children"];
var Handler = function Handler(_ref) {
  var PrimaryIcon = _ref.primaryIcon,
    ActionIcon = _ref.actionIcon,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? "neutral" : _ref$theme,
    className = _ref.className,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$g);
  return /*#__PURE__*/React__default.createElement(ActionContainer, {
    className: "rounded"
  }, /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cx("flex items-center justify-center w-fit flex-nowrap overflow-hidden rounded transition-all p-1 pr-2", "text-sm text-neutral-800", "bg-neutral-100", "gap-1", className)
  }, props), PrimaryIcon && /*#__PURE__*/React__default.createElement(ThemedIconRenderer, {
    icon: PrimaryIcon,
    size: "small",
    theme: theme
  }), children, ActionIcon && ( /*#__PURE__*/React__default.createElement(ThemedIconRenderer, {
    icon: ActionIcon,
    size: "extra-small",
    theme: theme,
    background: false
  }))));
};

var _excluded$h = ["icon", "iconPosition", "className", "children"];
var RoundedHandler = function RoundedHandler(_ref) {
  var Icon = _ref.icon,
    _ref$iconPosition = _ref.iconPosition,
    iconPosition = _ref$iconPosition === void 0 ? "left" : _ref$iconPosition,
    className = _ref.className,
    children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$h);
  return /*#__PURE__*/React__default.createElement(ActionContainer, {
    className: "rounded-full"
  }, /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cx("flex items-center justify-center w-fit flex-nowrap overflow-hidden rounded-full transition-all p-1", iconPosition === "left" ? "pr-3" : "pl-3", "text-sm text-neutral-800", "bg-neutral-100", "gap-1", className)
  }, props), iconPosition === "left" && Icon, children, iconPosition === "right" && Icon));
};

var _excluded$i = ["children", "icon", "iconPosition", "className"];
var IconLabel = function IconLabel(_ref) {
  var children = _ref.children,
    Icon = _ref.icon,
    _ref$iconPosition = _ref.iconPosition,
    iconPosition = _ref$iconPosition === void 0 ? "left" : _ref$iconPosition,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$i);
  return /*#__PURE__*/React__default.createElement(Label, Object.assign({
    className: cx("border-none gap-2", iconPosition === "left" ? "pl-0" : "pr-0", className),
    size: "small"
  }, props), iconPosition === "left" && Icon, children, iconPosition === "right" && Icon);
};

var ActionLabel = function ActionLabel(props) {
  return /*#__PURE__*/React__default.createElement(ActionContainer, {
    className: "rounded"
  }, /*#__PURE__*/React__default.createElement(Label, Object.assign({}, props)));
};

var ActionIconLabel = function ActionIconLabel(props) {
  return /*#__PURE__*/React__default.createElement(ActionContainer, {
    className: "rounded"
  }, /*#__PURE__*/React__default.createElement(IconLabel, Object.assign({}, props)));
};

var _path;
function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var SvgAgreement = function SvgAgreement(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M12 7.283a6 6 0 0 1 1.74 2.094 5.84 5.84 0 0 1 0 5.244A6 6 0 0 1 12 16.715a6 6 0 0 1-1.74-2.094 5.85 5.85 0 0 1 0-5.244A6 6 0 0 1 12 7.283m-.791-.514a6.9 6.9 0 0 0-1.834 2.352A6.7 6.7 0 0 0 8.726 12c0 .995.22 1.977.649 2.88a6.9 6.9 0 0 0 1.832 2.351A6.3 6.3 0 0 1 8.125 18a6.3 6.3 0 0 1-3.067-.822 6.1 6.1 0 0 1-2.24-2.195A5.87 5.87 0 0 1 2 11.998a5.86 5.86 0 0 1 .82-2.984 6.1 6.1 0 0 1 2.24-2.193A6.3 6.3 0 0 1 8.128 6a6.3 6.3 0 0 1 3.08.768Zm1.583 10.463a6.9 6.9 0 0 0 1.832-2.35c.429-.904.65-1.886.649-2.88a6.7 6.7 0 0 0-.649-2.881 6.9 6.9 0 0 0-1.833-2.352A6.3 6.3 0 0 1 15.872 6a6.3 6.3 0 0 1 3.068.82 6.1 6.1 0 0 1 2.24 2.194 5.86 5.86 0 0 1 .82 2.985 5.87 5.87 0 0 1-.818 2.984 6.1 6.1 0 0 1-2.24 2.195 6.3 6.3 0 0 1-3.067.822 6.3 6.3 0 0 1-3.082-.768Z"
  })));
};

var _path$1;
function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var SvgAlert = function SvgAlert(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/React.createElement("path", {
    d: "m12.658 4.378 7.24 12.487a.754.754 0 0 1-.278 1.034.76.76 0 0 1-.38.101H4.76a.76.76 0 0 1-.658-.378.75.75 0 0 1 0-.757l7.24-12.487a.76.76 0 0 1 1.038-.277.76.76 0 0 1 .278.277m-1.418 9.838v1.514h1.52v-1.514zm0-5.297v3.784h1.52V8.919z"
  })));
};

var _path$2;
function _extends$3() { _extends$3 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var SvgCheck = function SvgCheck(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React.createElement("path", {
    d: "m10 15.172 9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
  })));
};

var _path$3;
function _extends$4() { _extends$4 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
var SvgClock = function SvgClock(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/React.createElement("path", {
    d: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16m.8 8a.8.8 0 0 1-.232.568l-2.4 2.4A.8.8 0 0 1 9.04 13.84l2.16-2.168V8a.8.8 0 1 1 1.6 0z"
  })));
};

var _path$4;
function _extends$5() { _extends$5 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
var SvgCollateral = function SvgCollateral(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$5({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$4 || (_path$4 = /*#__PURE__*/React.createElement("path", {
    d: "M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16m0-1.6V5.6a6.4 6.4 0 1 0 0 12.8"
  })));
};

var _path$5;
function _extends$6() { _extends$6 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
var SvgConstitution = function SvgConstitution(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$6({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$5 || (_path$5 = /*#__PURE__*/React.createElement("path", {
    d: "M19 4C7.333 4 5.778 15.2 5 20h1.554q.777-4 3.89-4.4c3.112-.4 5.445-3.2 6.223-5.6L15.5 9.2l.778-.8c.778-.8 1.558-2 2.722-4.4"
  })));
};

var _path$6;
function _extends$7() { _extends$7 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
var SvgCreation = function SvgCreation(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$7({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$6 || (_path$6 = /*#__PURE__*/React.createElement("path", {
    d: "M18.47 4c.438 0 .793.358.793.8v3.006l-7.13 7.2-.005 3.39 3.364.005 3.771-3.807V19.2c0 .442-.355.8-.792.8H5.792A.797.797 0 0 1 5 19.2V4.8c0-.442.355-.8.792-.8h12.679Zm1.41 5.446L21 10.578 14.837 16.8l-1.122-.002.001-1.13zM12.132 12H8.17v1.6h3.962zm2.377-3.2h-6.34v1.6h6.34z"
  })));
};

var _path$7;
function _extends$8() { _extends$8 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
var SvgCross = function SvgCross(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$8({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$7 || (_path$7 = /*#__PURE__*/React.createElement("path", {
    d: "m12 10.586 4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
  })));
};

var _path$8;
function _extends$9() { _extends$9 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
var SvgDashboard = function SvgDashboard(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$9({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$8 || (_path$8 = /*#__PURE__*/React.createElement("path", {
    d: "M5 12.778h6.222V5H5zM5 19h6.222v-4.667H5zm7.778 0H19v-7.778h-6.222zm0-14v4.667H19V5z"
  })));
};

var _path$9;
function _extends$a() { _extends$a = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
var SvgDispute = function SvgDispute(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$a({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$9 || (_path$9 = /*#__PURE__*/React.createElement("path", {
    d: "M13.113 18.499V20H4v-1.501zM13.557 4l5.907 5.839-1.074 1.063-.805-.266-1.88 1.857L20 16.74l-1.074 1.06-4.295-4.246-1.825 1.804.215.85-1.075 1.061-5.906-5.838 1.074-1.062.858.212 4.78-4.724-.268-.796z"
  })));
};

var _path$a;
function _extends$b() { _extends$b = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
var SvgDown = function SvgDown(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$b({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$a || (_path$a = /*#__PURE__*/React.createElement("path", {
    d: "m11.1 15.65-4.827-4.693L5 12.194 12 19l7-6.806-1.273-1.237L12.9 15.65V5h-1.8z"
  })));
};

var _path$b;
function _extends$c() { _extends$c = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }
var SvgDropdown = function SvgDropdown(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$c({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$b || (_path$b = /*#__PURE__*/React.createElement("path", {
    d: "M3 8.75 4.817 7 12 14.375 19.183 7 21 8.75 12 18z"
  })));
};

var _path$c;
function _extends$d() { _extends$d = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }
var SvgFileAdd = function SvgFileAdd(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$d({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$c || (_path$c = /*#__PURE__*/React.createElement("path", {
    d: "M15.111 4 19 8v11.206c0 .21-.082.413-.227.562a.76.76 0 0 1-.545.232H5.772a.77.77 0 0 1-.544-.234.8.8 0 0 1-.228-.56V4.794C5 4.355 5.346 4 5.772 4zm-3.889 7.2H8.89v1.6h2.333v2.4h1.556v-2.4h2.333v-1.6h-2.333V8.8h-1.556z"
  })));
};

var _path$d;
function _extends$e() { _extends$e = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }
var SvgFileEncrypted = function SvgFileEncrypted(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$d || (_path$d = /*#__PURE__*/React.createElement("path", {
    d: "M19 8v11.194a.82.82 0 0 1-.224.568.78.78 0 0 1-.548.238H5.772a.76.76 0 0 1-.546-.232.8.8 0 0 1-.226-.562V4.794A.79.79 0 0 1 5.776 4h9.333zm-10.111.8v4.48c0 .68.347 1.314.923 1.691L12 16.4l2.188-1.429a2 2 0 0 0 .673-.723c.162-.296.248-.629.25-.968V8.8H8.89Zm1.555 1.6h3.111v2.88c0 .126-.07.254-.202.34L12 14.505l-1.353-.884a.41.41 0 0 1-.203-.34z"
  })));
};

var _path$e;
function _extends$f() { _extends$f = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }
var SvgFilePending = function SvgFilePending(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$f({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$e || (_path$e = /*#__PURE__*/React.createElement("path", {
    d: "M15.111 4 19 8v11.207a.783.783 0 0 1-.772.793H5.772C5.346 20 5 19.636 5 19.206V4.794C5 4.355 5.346 4 5.772 4zm-2.333 5.6h-1.556v4.8h3.89v-1.6h-2.334z"
  })));
};

var _path$f;
function _extends$g() { _extends$g = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }
var SvgFilter = function SvgFilter(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$g({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$f || (_path$f = /*#__PURE__*/React.createElement("path", {
    d: "m5 5 5.444 6.223v6.222L13.556 19v-7.778L19 5z"
  })));
};

var _path$g;
function _extends$h() { _extends$h = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }
var SvgFingerpint = function SvgFingerpint(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$h({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$g || (_path$g = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M7.547 7.385a.674.674 0 0 1-.947-.072.676.676 0 0 1 .075-.947l.882-.754A6.6 6.6 0 0 1 9.663 4.4a7.08 7.08 0 0 1 4.949.094 6.65 6.65 0 0 1 2.263 1.48h.003l.059.062a7.264 7.264 0 0 1 0 10.27l-1.529 1.531a2.863 2.863 0 0 1-4.045 0 2.86 2.86 0 0 1 0-4.044l1.55-1.55a1.517 1.517 0 0 0 0-2.143l-.002-.003a1.52 1.52 0 0 0-1.076-.443c-.402 0-.788.158-1.073.443l-1.657 1.66a5.74 5.74 0 0 0-1.416 5.788.67.67 0 0 1-.046.512.66.66 0 0 1-.391.33.68.68 0 0 1-.513-.045.68.68 0 0 1-.33-.394 7.09 7.09 0 0 1 1.746-7.14l1.66-1.658a2.857 2.857 0 0 1 4.043 0l.002.003h.003a2.866 2.866 0 0 1 0 4.04h-.002l-1.55 1.55a1.527 1.527 0 0 0 0 2.148 1.52 1.52 0 0 0 2.148 0l1.531-1.532a5.92 5.92 0 0 0 0-8.374l-.061-.061A5.4 5.4 0 0 0 14.12 5.74a5.8 5.8 0 0 0-2.114-.4c-.646 0-1.287.107-1.899.322a5.3 5.3 0 0 0-1.679.968l-.882.754Zm-2.21 7.41a.69.69 0 0 1-.258.446.673.673 0 0 1-1.073-.625 9.4 9.4 0 0 1 .899-2.924 9.8 9.8 0 0 1 1.888-2.59L8.34 7.574v-.002a5.014 5.014 0 0 1 7.046.016 5.067 5.067 0 0 1 0 7.172l-1.53 1.529a.667.667 0 0 1-1.143-.475.66.66 0 0 1 .197-.472l1.529-1.529a3.73 3.73 0 0 0 0-5.273 3.67 3.67 0 0 0-5.158-.01l-1.548 1.525a8.5 8.5 0 0 0-1.628 2.235 8 8 0 0 0-.77 2.505Zm6.254 4.48a.66.66 0 0 0-.295-.418 3.3 3.3 0 0 1-.595-.48 3.57 3.57 0 0 1-1.036-2.525 3.78 3.78 0 0 1 1.116-2.677v-.002l1.53-1.526a.672.672 0 0 0-.948-.95l-1.529 1.529a5.13 5.13 0 0 0-1.51 3.624 4.9 4.9 0 0 0 1.425 3.47 4.5 4.5 0 0 0 .831.668.669.669 0 0 0 1.011-.713",
    clipRule: "evenodd"
  })));
};

var _path$h;
function _extends$i() { _extends$i = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }
var SvgFullOrb = function SvgFullOrb(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$i({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$h || (_path$h = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12m-12 9.8c-1.76-7.44-7.4-9.633-10-9.8h10zM22 12c-2.6-.167-8.24-2.36-10-9.8V12z",
    clipRule: "evenodd"
  })));
};

var _path$i;
function _extends$j() { _extends$j = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$j.apply(this, arguments); }
var SvgInfo = function SvgInfo(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$j({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$i || (_path$i = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8m1.284 5.962H11.28l-.944 4.463a6 6 0 0 0-.082.493q-.027.226-.027.418 0 .44.115.754.117.313.316.516.201.204.473.3a1.78 1.78 0 0 0 1.12.009 1.4 1.4 0 0 0 .826-.706 1.7 1.7 0 0 0 .166-.642q-.075.033-.162.06a1 1 0 0 1-.287.028q-.29 0-.427-.112-.136-.113-.136-.404 0-.109.01-.221t.044-.228l1-4.728Zm-.625-2.963q-.231 0-.432.089a1.12 1.12 0 0 0-.584 1.457 1.06 1.06 0 0 0 .584.578 1.1 1.1 0 0 0 .432.084 1.1 1.1 0 0 0 .431-.084q.201-.086.354-.231a1.08 1.08 0 0 0 .241-1.21 1.15 1.15 0 0 0-.595-.594 1.1 1.1 0 0 0-.431-.089",
    clipRule: "evenodd"
  })));
};

var _path$j;
function _extends$k() { _extends$k = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$k.apply(this, arguments); }
var SvgJudge = function SvgJudge(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$k({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$j || (_path$j = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "m7.082 11.874 1.045-4.809 2.38-.346L12 9.65l1.493-2.932 2.38.346 1.046 4.81-9.837-.001ZM18 13.982h-2.72L14.537 22H9.463l-.742-8.018H6v-1.265h12zm-6-8.134a1.93 1.93 0 0 1-1.934-1.924C10.066 2.862 10.932 2 12 2s1.934.861 1.934 1.924A1.93 1.93 0 0 1 12 5.848",
    clipRule: "evenodd"
  })));
};

var _path$k;
function _extends$l() { _extends$l = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$l.apply(this, arguments); }
var SvgLeft = function SvgLeft(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$l({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$k || (_path$k = /*#__PURE__*/React.createElement("path", {
    d: "m8.35 12.9 4.693 4.827L11.806 19 5 12l6.806-7 1.237 1.273L8.35 11.1H19v1.8z"
  })));
};

var _path$l;
function _extends$m() { _extends$m = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$m.apply(this, arguments); }
var SvgLess = function SvgLess(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$m({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$l || (_path$l = /*#__PURE__*/React.createElement("path", {
    d: "M5 11h14v2H5z"
  })));
};

var _path$m;
function _extends$n() { _extends$n = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$n.apply(this, arguments); }
var SvgManifesto = function SvgManifesto(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$n({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$m || (_path$m = /*#__PURE__*/React.createElement("path", {
    d: "M6.4 14.1V5.7a.7.7 0 0 1 .7-.7h11.2a.7.7 0 0 1 .7.7v11.2a2.1 2.1 0 0 1-2.1 2.1H7.1A2.1 2.1 0 0 1 5 16.9v-1.4h11.2v1.4a.7.7 0 1 0 1.4 0v-2.8z"
  })));
};

var _path$n;
function _extends$o() { _extends$o = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$o.apply(this, arguments); }
var SvgN3 = function SvgN3(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$o({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$n || (_path$n = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0m-8 6.533c-1.173-4.96-4.933-6.422-6.667-6.533H12zM18.667 12c-1.734-.111-5.494-1.573-6.667-6.533V12z",
    clipRule: "evenodd"
  })));
};

var _path$o;
function _extends$p() { _extends$p = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$p.apply(this, arguments); }
var SvgPaper = function SvgPaper(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$p({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$o || (_path$o = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M7.333 4C6.045 4 5 5.102 5 6.462v11.076C5 18.898 6.045 20 7.333 20h9.334C17.955 20 19 18.898 19 17.538V6.462C19 5.102 17.955 4 16.667 4zm1.459 3.077c-.484 0-.875.413-.875.923s.391.923.875.923h6.416c.484 0 .875-.413.875-.923s-.391-.923-.875-.923zm-.875 4.615c0-.51.391-.923.875-.923h6.416c.484 0 .875.413.875.923s-.391.923-.875.923H8.792c-.484 0-.875-.413-.875-.923m.875 2.77c-.484 0-.875.413-.875.923s.391.923.875.923h3.5c.483 0 .875-.414.875-.923s-.392-.924-.875-.924z",
    clipRule: "evenodd"
  })));
};

var _path$p;
function _extends$q() { _extends$q = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$q.apply(this, arguments); }
var SvgPlay = function SvgPlay(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$q({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$p || (_path$p = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16m4.727 8L9.454 7.636v8.728zm-5.818-1.795L13.9 12l-2.99 1.795z",
    clipRule: "evenodd"
  })));
};

var _path$q;
function _extends$r() { _extends$r = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$r.apply(this, arguments); }
var SvgPlus = function SvgPlus(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$r({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$q || (_path$q = /*#__PURE__*/React.createElement("path", {
    d: "M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
  })));
};

var _path$r;
function _extends$s() { _extends$s = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$s.apply(this, arguments); }
var SvgPrivate = function SvgPrivate(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$s({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$r || (_path$r = /*#__PURE__*/React.createElement("path", {
    d: "m10.731 5 1.6 1.556H19.2c.212 0 .416.082.566.227s.234.344.234.55v10.89a.77.77 0 0 1-.234.55.8.8 0 0 1-.566.227H4.8a.8.8 0 0 1-.566-.228.77.77 0 0 1-.234-.55V5.778c0-.206.084-.404.234-.55A.8.8 0 0 1 4.8 5zM12 9.667a1.63 1.63 0 0 0-.974.321c-.28.209-.48.5-.571.832a1.5 1.5 0 0 0 .067.998c.135.316.373.58.678.751v3.32h1.6v-3.32a1.57 1.57 0 0 0 .679-.752c.135-.316.158-.667.067-.998a1.55 1.55 0 0 0-.572-.831A1.63 1.63 0 0 0 12 9.667"
  })));
};

var _path$s;
function _extends$t() { _extends$t = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$t.apply(this, arguments); }
var SvgResolution = function SvgResolution(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$t({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$s || (_path$s = /*#__PURE__*/React.createElement("path", {
    d: "M13.58 10.8a.75.75 0 0 0-1.053 0l-.527.517a1.5 1.5 0 0 1-1.058.448 1.5 1.5 0 0 1-1.066-.43 1.46 1.46 0 0 1-.436-1.048 1.45 1.45 0 0 1 .454-1.042l4.192-4.126a4.9 4.9 0 0 1 2.968.261 4.8 4.8 0 0 1 2.25 1.922 4.7 4.7 0 0 1-.47 5.56l-1.569 1.564zM5.417 6.395a4.91 4.91 0 0 1 5.964-.687l-2.54 2.501a2.9 2.9 0 0 0-.875 2.037c-.01.765.285 1.504.82 2.058a3 3 0 0 0 2.05.909 3 3 0 0 0 2.11-.758l.107-.1 3.16 3.107-3.16 3.109c-.28.275-.658.429-1.053.429a1.5 1.5 0 0 1-1.053-.429l-5.53-5.44A4.72 4.72 0 0 1 4 9.762c0-1.263.51-2.475 1.418-3.368Z"
  })));
};

var _path$t;
function _extends$u() { _extends$u = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$u.apply(this, arguments); }
var SvgRight = function SvgRight(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$u({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$t || (_path$t = /*#__PURE__*/React.createElement("path", {
    d: "m15.65 11.1-4.693-4.827L12.194 5 19 12l-6.806 7-1.237-1.273L15.65 12.9H5v-1.8z"
  })));
};

var _path$u;
function _extends$v() { _extends$v = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$v.apply(this, arguments); }
var SvgSignal = function SvgSignal(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$v({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$u || (_path$u = /*#__PURE__*/React.createElement("path", {
    d: "m13.788 6.076-2.63 4.774 1.307.791 2.63-4.774c3.149 2.193 4.761 5.6 3.443 7.991-1.404 2.549-5.428 2.654-8.992.499-3.564-2.158-5.489-5.861-4.084-8.409 1.317-2.391 4.94-2.632 8.326-.872M14.932 4l1.308.791-1.133 2.055-1.307-.791zm-6.91 14.418h7.753V20H6.728a.7.7 0 0 1-.385-.102.77.77 0 0 1-.282-.294.82.82 0 0 1 0-.79L7.76 15.73l1.307.79-1.044 1.897Z"
  })));
};

var _path$v;
function _extends$w() { _extends$w = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$w.apply(this, arguments); }
var SvgTheme = function SvgTheme(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$w({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$v || (_path$v = /*#__PURE__*/React.createElement("path", {
    d: "M12 4c4.418 0 8 3.182 8 7.111a4.446 4.446 0 0 1-4.445 4.444h-1.573c-.737 0-1.333.596-1.333 1.334 0 .337.133.649.337.88.214.24.348.551.348.897C13.334 19.405 12.72 20 12 20a8 8 0 0 1 0-16m-3.6 8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4m7.2 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4M12 9.6a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4"
  })));
};

var _path$w;
function _extends$x() { _extends$x = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$x.apply(this, arguments); }
var SvgToken = function SvgToken(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$x({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$w || (_path$w = /*#__PURE__*/React.createElement("path", {
    d: "M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16m0-11.394L8.606 12 12 15.394 15.394 12z"
  })));
};

var _path$x;
function _extends$y() { _extends$y = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$y.apply(this, arguments); }
var SvgUnlock = function SvgUnlock(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$y({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$x || (_path$x = /*#__PURE__*/React.createElement("path", {
    d: "M12.3 4.01a4.5 4.5 0 0 0-4.483 2.823A1.227 1.227 0 0 0 8.972 8.5a1.25 1.25 0 0 0 1.166-.741A2 2 0 0 1 12.2 6.51c1.038.102 1.8 1.035 1.8 2.08V11H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-.5V8.653c0-2.396-1.808-4.486-4.2-4.643M12 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
  })));
};

var _path$y;
function _extends$z() { _extends$z = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$z.apply(this, arguments); }
var SvgUp = function SvgUp(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$z({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$y || (_path$y = /*#__PURE__*/React.createElement("path", {
    d: "m11.1 8.35-4.827 4.693L5 11.806 12 5l7 6.806-1.273 1.237L12.9 8.35V19h-1.8z"
  })));
};

var _path$z;
function _extends$A() { _extends$A = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$A.apply(this, arguments); }
var SvgUser = function SvgUser(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$A({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$z || (_path$z = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M6.638 18.666a2 2 0 0 1-1.926-2.54l.17-.608a4 4 0 0 1 3.852-2.92h7.29a3 3 0 0 1 2.888 2.19l.376 1.339a2 2 0 0 1-1.926 2.54zM12 10.532c-1.737 0-3.145-1.462-3.145-3.266S10.263 4 12 4s3.145 1.462 3.145 3.266-1.408 3.266-3.145 3.266",
    clipRule: "evenodd"
  })));
};

var _path$A;
function _extends$B() { _extends$B = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$B.apply(this, arguments); }
var SvgWorld = function SvgWorld(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$B({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$A || (_path$A = /*#__PURE__*/React.createElement("path", {
    d: "M4 12.81h4.403c.138 2.564.95 5.045 2.352 7.19a8.03 8.03 0 0 1-4.595-2.435A8.13 8.13 0 0 1 4 12.81m0-1.62a8.13 8.13 0 0 1 2.16-4.755A8.03 8.03 0 0 1 10.755 4a14.56 14.56 0 0 0-2.352 7.19zm16 0h-4.404A14.56 14.56 0 0 0 13.244 4a8.03 8.03 0 0 1 4.595 2.435 8.13 8.13 0 0 1 2.16 4.755Zm0 1.62a8.13 8.13 0 0 1-2.161 4.755A8.03 8.03 0 0 1 13.244 20a14.56 14.56 0 0 0 2.352-7.19h4.403Zm-9.986 0h3.971A12.94 12.94 0 0 1 12 18.957a12.94 12.94 0 0 1-1.986-6.147m0-1.62A12.94 12.94 0 0 1 12 5.043a12.94 12.94 0 0 1 1.985 6.147z"
  })));
};

var _path$B;
function _extends$C() { _extends$C = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$C.apply(this, arguments); }
var SvgZoom = function SvgZoom(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$C({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, props), _path$B || (_path$B = /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M15.237 12.976 20 17.74 18.74 19l-4.764-4.763a6.24 6.24 0 1 1 1.26-1.26Zm-4.998.72a4.457 4.457 0 1 0 0-8.914 4.457 4.457 0 0 0 0 8.914",
    clipRule: "evenodd"
  })));
};

var _excluded$j = ["address", "name", "avatar", "theme"];
var AccountLabel = function AccountLabel(_ref) {
  var address = _ref.address,
    name = _ref.name,
    avatar = _ref.avatar,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? "neutral" : _ref$theme,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$j);
  var _useState = React.useState(false),
    avatarError = _useState[0],
    setAvatarError = _useState[1];
  // Reset avatar error state when avatar changes
  React.useEffect(function () {
    setAvatarError(false);
  }, [avatar]);
  var icon = React.useMemo(function () {
    if (avatar && !avatarError) {
      return /*#__PURE__*/React__default.createElement("img", {
        src: avatar,
        className: "w-6 h-6 rounded bg-neutral-200",
        onError: function onError() {
          return setAvatarError(true);
        }
      });
    }
    return /*#__PURE__*/React__default.createElement(ThemedIconRenderer, {
      theme: theme,
      icon: SvgUser
    });
  }, [avatar, avatarError, theme]);
  return /*#__PURE__*/React__default.createElement(IconLabel, Object.assign({
    icon: icon
  }, props), /*#__PURE__*/React__default.createElement(AddressDisplay, {
    address: address,
    ensName: name
  }));
};

var _excluded$k = ["status", "value", "label", "focusColor", "disabled", "onFocus", "onValueChange", "resolveEnsNameFromAddress", "resolveAddressFromEnsName", "onAddressValidated", "onEnsResolved", "onResolvingError"];
// FIXME: Got this component working from Aragon's design system, it needs some cleanup
var WalletInput = /*#__PURE__*/React__default.forwardRef(function (_ref, ref) {
  var _ref$status = _ref.status,
    status = _ref$status === void 0 ? 'default' : _ref$status,
    value = _ref.value,
    label = _ref.label,
    focusColor = _ref.focusColor,
    disabled = _ref.disabled,
    onFocus = _ref.onFocus,
    onValueChange = _ref.onValueChange,
    resolveEnsNameFromAddress = _ref.resolveEnsNameFromAddress,
    resolveAddressFromEnsName = _ref.resolveAddressFromEnsName,
    onAddressValidated = _ref.onAddressValidated,
    onEnsResolved = _ref.onEnsResolved,
    onResolvingError = _ref.onResolvingError,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$k);
  var inputRef = React.useRef(null);
  var wasNotEditingRef = React.useRef(true);
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertLabel, setAlertLabel] = useState('');
  // const [truncate, setTruncate] = useState(false);
  var _useState = React.useState(false),
    isEditing = _useState[0],
    setIsEditing = _useState[1];
  var _useState2 = React.useState(function () {
      return value.address ? 'address' : 'ensName';
    }),
    displayMode = _useState2[0],
    setDisplayMode = _useState2[1];
  // const [initialHeight, setInitialHeight] = useState(0);
  var _useState3 = React.useState(),
    resolvedValues = _useState3[0],
    setResolvedValues = _useState3[1];
  var canToggle = !!value.address && !!value.ensName;
  // const togglerLabel = displayMode === 'address' ? 'ENS' : '0x…';
  var ensSupported = !!resolveAddressFromEnsName && !!resolveEnsNameFromAddress;
  // holds the full format of the potentially shortened value in the input
  var fullValue = React.useMemo(function () {
    return String(displayMode === 'address' ? value.address : value.ensName);
  }, [displayMode, value.address, value.ensName]);
  // Only show see on scan button if the input is valid
  /*
  const showExternalButton =
    blockExplorerURL && (IsAddress(fullValue) || isEnsDomain(fullValue));
  const adornmentsDisabled = disabled && !fullValue;
  */
  // This displays the truncated address/ens when the value is not being
  // edited by the user, or in the case of ens, when the length of the name
  // would have otherwise overflown
  var displayedValue = React.useMemo(function () {
    if (isEditing) return fullValue;
    if (displayMode === 'address') return shortenAddress(value.address);
    // Get the current height and compare it with the initial height.
    // because the input row is set to 1, when the input gets filled,
    // the height is being adjusted so that the overflow is not hidden.
    // The height being modified means that the text would have otherwise
    // wrapped/overflown.
    /*
    if (getTextAreaHeight(textareaRef.current) > initialHeight || truncate) {
      setTruncate(false);
      return shortenENS(value.ensName);
    } else {
      return value.ensName as string;
    }
    */
    return value.ensName;
  }, [displayMode, fullValue,
  // initialHeight,
  isEditing,
  // truncate,
  value.address, value.ensName]);
  /*************************************************
   *               Hooks & Effects                 *
   *************************************************/
  React.useEffect(function () {
    function resolveValues() {
      return _resolveValues.apply(this, arguments);
    }
    function _resolveValues() {
      _resolveValues = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var newValue, _result$toLowerCase, result, _result$toLowerCase2, _result, resolvedType;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              newValue = _extends({}, value);
              if (!(displayMode === 'address')) {
                _context.next = 17;
                break;
              }
              _context.prev = 2;
              if (!isAddress(fullValue)) {
                _context.next = 9;
                break;
              }
              onAddressValidated == null || onAddressValidated(fullValue);
              // resolve ens name
              _context.next = 7;
              return resolveEnsNameFromAddress == null ? void 0 : resolveEnsNameFromAddress(fullValue);
            case 7:
              result = _context.sent;
              newValue.ensName = (_result$toLowerCase = result == null ? void 0 : result.toLowerCase()) != null ? _result$toLowerCase : '';
            case 9:
              _context.next = 15;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](2);
              onResolvingError == null || onResolvingError(_context.t0);
              newValue.ensName = '';
            case 15:
              _context.next = 31;
              break;
            case 17:
              if (!resolveAddressFromEnsName) {
                _context.next = 31;
                break;
              }
              _context.prev = 18;
              if (!isEnsDomain(fullValue)) {
                _context.next = 25;
                break;
              }
              _context.next = 22;
              return resolveAddressFromEnsName == null ? void 0 : resolveAddressFromEnsName(fullValue);
            case 22:
              _result = _context.sent;
              newValue.address = (_result$toLowerCase2 = _result == null ? void 0 : _result.toLowerCase()) != null ? _result$toLowerCase2 : '';
              // wait until the corresponding ens value is resolved
              newValue.address && (onEnsResolved == null ? void 0 : onEnsResolved(value.address));
            case 25:
              _context.next = 31;
              break;
            case 27:
              _context.prev = 27;
              _context.t1 = _context["catch"](18);
              onResolvingError == null || onResolvingError(_context.t1);
              newValue.address = '';
            case 31:
              resolvedType = displayMode === 'address' ? 'ensName' : 'address';
              if (!resolvedValues || newValue[resolvedType] !== resolvedValues[resolvedType]) {
                setResolvedValues(newValue);
              }
              /* If the new values are different from the current ones, update the controller */
              if (newValue[resolvedType] !== value[resolvedType]) onValueChange(newValue);
            case 34:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 11], [18, 27]]);
      }));
      return _resolveValues.apply(this, arguments);
    }
    if (ensSupported &&
    // network supports ens
    displayMode &&
    // not initial state/render
    value[displayMode] &&
    // the displayed value isn't empty
    JSON.stringify(value) !== JSON.stringify(resolvedValues) // value and resolved values don't match
    ) resolveValues();
  }, [displayMode, ensSupported, fullValue, onValueChange, onAddressValidated, onEnsResolved, onResolvingError, resolveAddressFromEnsName, resolveEnsNameFromAddress, resolvedValues, value]);
  /*
  useEffect(() => {
    if (resolvedValues) {
      // update the controller value if it is not the same as the resolved values;
      // this works in conjunction with the previous hook
      const resolvedType = displayMode === 'address' ? 'ensName' : 'address';
      if (value[resolvedType] !== resolvedValues[resolvedType])
        onValueChange(resolvedValues);
    }
  }, [displayMode, onValueChange, resolvedValues, value]);
  */
  // resolve the forwarded ref and local ref
  React.useEffect(function () {
    if (typeof ref === 'function') {
      ref(inputRef.current);
    } else if (ref) {
      ref.current = inputRef.current;
    }
  }, [ref]);
  // adjust textarea height so that it grows as filled
  /*
  useEffect(() => {
    if (textareaRef.current) {
      // get the initial height of the text area
      if (textareaRef.current.style.height !== null) {
        setInitialHeight(prev => {
          if (prev) return prev;
          else return getTextAreaHeight(textareaRef.current);
        });
      }
       // adjust height so input grows as filled
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, value, displayedValue]);
  */
  // select text on focus, this needs to be done here instead of onFocus because
  // updating the isEditing state will remove the focus when the component re-renders
  React.useEffect(function () {
    if (wasNotEditingRef && isEditing) {
      var _inputRef$current;
      (_inputRef$current = inputRef.current) == null || _inputRef$current.select();
    }
  }, [isEditing]);
  /*
  useEffect(() => {
    if (!isEditing) {
      if (getTextAreaHeight(textareaRef.current) > initialHeight) {
        setTruncate(true);
      }
    }
  }, [initialHeight, isEditing, displayedValue]);
  */
  /*************************************************
   *             Callbacks and handlers            *
   *************************************************/
  /*
  const alert = useCallback((label: string) => {
    setAlertLabel(label);
    setShowAlert(true);
     setTimeout(() => {
      setShowAlert(false);
    }, 1200);
  }, []);
  */
  // Show ens or address
  var toggleDisplayMode = React.useCallback(
  // (event: React.MouseEvent<HTMLDivElement>) => {
  function () {
    var newDisplayMode = displayMode === 'address' ? 'ensName' : 'address';
    setDisplayMode(newDisplayMode);
    // onToggleButtonClick?.(event);
  },
  //   [displayMode, onToggleButtonClick]
  [displayMode]);
  var handleBlur = React.useCallback(function (event) {
    event.preventDefault();
    setIsEditing(false);
    wasNotEditingRef.current = false;
  }, []);
  var handleFocus = React.useCallback(function (event) {
    setIsEditing(true);
    wasNotEditingRef.current = true;
    onFocus == null || onFocus(event);
  }, [onFocus]);
  /*
  const handleOnWheel = useCallback(
    (event: React.WheelEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.currentTarget.blur();
      onWheel?.(event);
    },
    [onWheel]
  );
  */
  var setValue = React.useCallback(function (addressOrEns) {
    setResolvedValues(undefined);
    if (addressOrEns === '') {
      return {
        ensName: '',
        address: ''
      };
    }
    // set proper display mode based on the value
    if (isAddress(addressOrEns) || !ensSupported || addressOrEns.startsWith('0x')) {
      setDisplayMode('address');
      return {
        ensName: '',
        address: addressOrEns.toLowerCase()
      };
    } else {
      setDisplayMode('ensName');
      return {
        address: '',
        ensName: addressOrEns.toLowerCase()
      };
    }
  }, [ensSupported]);
  var handleChange = React.useCallback(function (event) {
    onValueChange(setValue(event.target.value));
  }, [onValueChange, setValue]);
  /*
  const handleClearInput = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onValueChange(setValue(''));
      setIsEditing(true);
      alert('Cleared');
      // onClearButtonClick?.(event);
    },
  //   [alert, onClearButtonClick, onValueChange, setValue]
    [alert, onValueChange, setValue]
  );
  */
  /*
  const handlePasteFromClipboard = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const clipboardData = await navigator.clipboard.readText();
         setIsEditing(false);
        onValueChange(setValue(clipboardData));
        alert('Pasted');
      //   onPasteButtonClick?.(event);
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
      }
    },
  //   [alert, onPasteButtonClick, onValueChange, setValue]
    [alert, onValueChange, setValue]
  );
  */
  /*
  const handleCopyToClipboard = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      navigator.clipboard.writeText(
        (displayMode === 'address' ? value.address : value.ensName) || ''
      );
      alert('Copied');
      // onCopyButtonClick?.(event);
    },
  //   [alert, displayMode, onCopyButtonClick, value.address, value.ensName]
    [alert, displayMode, value.address, value.ensName]
  );
  */
  var DisplayModeToggle = React.useMemo(function () {
    if (!ensSupported) return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
    return /*#__PURE__*/React__default.createElement(ActionLabel, {
      color: "neutral-500",
      border: "neutral-300",
      background: "white",
      className: "transition",
      onClick: toggleDisplayMode
    }, displayMode === 'address' ? 'ENS' : '0x...');
  }, [ensSupported, displayMode, toggleDisplayMode]);
  var statusClass = !disabled && cx({
    "border-neutral-300": status === 'default',
    "border-semantic-success": status === 'success',
    "border-semantic-warning": status === 'warning',
    "border-semantic-error": status === 'error'
  });
  return /*#__PURE__*/React__default.createElement("div", null, label && /*#__PURE__*/React__default.createElement(Body3, {
    color: "neutral-600",
    className: "mb-2"
  }, label), /*#__PURE__*/React__default.createElement("div", {
    className: cx("flex relative items-center justify-center w-full p-3 border-2 rounded-base outline-none transition-all", disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800", statusClass, "focus:ring-" + focusColor + " focus:border-" + focusColor)
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({}, props, {
    type: "text",
    id: "wallet-input",
    className: cx("w-full appearance-none bg-transparent border-none outline-none resize-none p-0 m-0", "font-inherit", "disabled:cursor-not-allowed"),
    disabled: disabled,
    value: displayedValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur
  })), displayedValue && !isEditing && canToggle && ( /*#__PURE__*/React__default.createElement("span", {
    className: "absolute right-0 top-1/2 -translate-y-1/2 mr-3"
  }, DisplayModeToggle))));
});
WalletInput.displayName = 'WalletInput';

var CustomRadioInput = function CustomRadioInput(_ref) {
  var id = _ref.id,
    name = _ref.name,
    value = _ref.value,
    label = _ref.label,
    checked = _ref.checked,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _onChange = _ref.onChange;
  return /*#__PURE__*/React__default.createElement("label", {
    htmlFor: id,
    className: "flex items-center space-x-2 cursor-pointer" + (disabled ? " opacity-50 cursor-not-allowed" : "")
  }, /*#__PURE__*/React__default.createElement("input", {
    id: id,
    name: name,
    type: "radio",
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: function onChange() {
      return _onChange(value);
    },
    className: "form-radio text-pr-c-green2"
  }), /*#__PURE__*/React__default.createElement("span", null, label));
};

var ScreenType;
(function (ScreenType) {
  ScreenType[ScreenType["Mobile"] = 0] = "Mobile";
  ScreenType[ScreenType["Desktop"] = 1] = "Desktop";
})(ScreenType || (ScreenType = {}));
var reportScreen = function reportScreen() {
  if (typeof window !== "undefined") {
    var w = window.innerWidth;
    if (w < 768) {
      return ScreenType.Mobile;
    }
  }
  return ScreenType.Desktop;
};
var useScreen = function useScreen() {
  var _useState = React.useState(reportScreen()),
    screen = _useState[0],
    setScreen = _useState[1];
  React.useEffect(function () {
    var handleChange = function handleChange() {
      setScreen(reportScreen());
    };
    window.addEventListener("resize", handleChange);
    return function () {
      window.removeEventListener("resize", handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    screen: screen
  };
};

var _excluded$l = ["label", "showFiles", "acceptedFiles", "dropzoneConfig", "className", "required", "name"];
var FileLabel = function FileLabel(_ref) {
  var name = _ref.name,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? "black" : _ref$color,
    _ref$background = _ref.background,
    background = _ref$background === void 0 ? "white" : _ref$background;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex gap-2 bg-white w-fit rounded pr-2 no-wrap overflow-hidden"
  }, /*#__PURE__*/React__default.createElement(IconRenderer, {
    icon: SvgPaper,
    size: "small",
    color: background,
    background: color
  }), /*#__PURE__*/React__default.createElement(Body2, {
    color: color,
    className: "line-clamp-1"
  }, name));
};
var DropInput = function DropInput(_ref2) {
  var label = _ref2.label,
    showFiles = _ref2.showFiles,
    acceptedFiles = _ref2.acceptedFiles,
    dropzoneConfig = _ref2.dropzoneConfig,
    className = _ref2.className,
    required = _ref2.required,
    name = _ref2.name,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded$l);
  var _useScreen = useScreen(),
    screen = _useScreen.screen;
  var isMobile = screen === ScreenType.Mobile;
  var _useDropzone = reactDropzone.useDropzone(_extends({}, dropzoneConfig)),
    dropzoneAcceptedFiles = _useDropzone.acceptedFiles,
    getRootProps = _useDropzone.getRootProps,
    getInputProps = _useDropzone.getInputProps;
  var acceptedFilesCombined = React.useMemo(function () {
    return acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles : dropzoneAcceptedFiles;
  }, [acceptedFiles, dropzoneAcceptedFiles]);
  return /*#__PURE__*/React__default.createElement("div", null, label && ( /*#__PURE__*/React__default.createElement(Body2, {
    color: "neutral-600",
    className: "mb-2"
  }, label, required && /*#__PURE__*/React__default.createElement("span", {
    className: "text-semantic-error"
  }, " *"))), /*#__PURE__*/React__default.createElement("div", Object.assign({}, getRootProps({
    className: cx("flex flex-col items-center justify-center w-full gap-2 p-3 rounded-md",
    // "h-20 sm:h-30", // Height adjustments
    "font-primary text-neutral-500 bg-neutral-200", "border-2 border-dashed", "cursor-pointer transition-transform", className)
  })), /*#__PURE__*/React__default.createElement("input", Object.assign({}, getInputProps(), {
    name: name,
    required: required
  }, props)), showFiles && acceptedFilesCombined.length > 0 && ( /*#__PURE__*/React__default.createElement("aside", {
    className: "w-full"
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "flex flex-col items-center p-2 gap-1 w-full"
  }, acceptedFilesCombined.map(function (file, i) {
    return /*#__PURE__*/React__default.createElement(FileLabel, {
      key: i,
      name: file.name,
      color: "neutral-600"
    });
  })))), (!acceptedFilesCombined.length || acceptedFilesCombined.length === 0) && ( /*#__PURE__*/React__default.createElement("div", {
    className: "cursor-pointer flex p-4 flex-col justify-center items-center gap-2"
  }, /*#__PURE__*/React__default.createElement(IconRenderer, {
    icon: SvgFileAdd,
    color: "neutral-500",
    background: "neutral-300",
    size: "large"
  }), /*#__PURE__*/React__default.createElement(Body2, {
    color: "neutral-500",
    className: "mt-2"
  }, isMobile ? "Tap to add file" : "Drag and Drop files here or click to ", !acceptedFilesCombined || acceptedFilesCombined.length === 0 ? "upload" : "replace")))));
};

var PasswordInput = function PasswordInput(props) {
  var _props$focusColor = props.focusColor,
    focusColor = _props$focusColor === void 0 ? "primary-blue-400" : _props$focusColor,
    _props$status = props.status,
    status = _props$status === void 0 ? 'default' : _props$status,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    label = props.label;
  var statusClass = !disabled && cx({
    "border-neutral-300": status === 'default',
    "border-semantic-success": status === 'success',
    "border-semantic-warning": status === 'warning',
    "border-semantic-error": status === 'error'
  });
  return /*#__PURE__*/React__default.createElement("div", null, label && ( /*#__PURE__*/React__default.createElement(Body2, {
    color: "neutral-600",
    className: "mb-2"
  }, label)), /*#__PURE__*/React__default.createElement("input", Object.assign({
    type: "password",
    id: "password-input",
    className: cx("block w-full p-3 border-2 rounded-base outline-none transition-all", disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800", statusClass, "focus:ring-" + focusColor + " focus:border-" + focusColor),
    disabled: disabled
  }, props)));
};

var _excluded$m = ["focusColor", "status", "disabled", "label", "required"];
var TextAreaInput = function TextAreaInput(props) {
  var _props$focusColor = props.focusColor,
    focusColor = _props$focusColor === void 0 ? "primary-blue-400" : _props$focusColor,
    _props$status = props.status,
    status = _props$status === void 0 ? "default" : _props$status,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    label = props.label,
    required = props.required,
    inputProps = _objectWithoutPropertiesLoose(props, _excluded$m);
  var statusClass = cx({
    "border-neutral-300": status === "default" && !disabled,
    "border-semantic-success": status === "success" && !disabled,
    "border-semantic-warning": status === "warning" && !disabled,
    "border-semantic-error": status === "error" && !disabled
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-col gap-2"
  }, label && ( /*#__PURE__*/React__default.createElement(Body2, {
    color: "neutral-600",
    className: "mb-2"
  }, label, required && /*#__PURE__*/React__default.createElement("span", {
    className: "text-semantic-error"
  }, " *"))), /*#__PURE__*/React__default.createElement("textarea", Object.assign({
    id: "text-area-input",
    className: cx("block w-full p-3 border-2 rounded-base outline-none transition-colors", disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800", statusClass, "focus:ring-" + focusColor + " focus:border-" + focusColor),
    disabled: disabled
  }, inputProps)));
};

var _excluded$n = ["label", "focusColor", "status", "disabled", "className", "required"];
var TextInput = function TextInput(_ref) {
  var label = _ref.label,
    _ref$focusColor = _ref.focusColor,
    focusColor = _ref$focusColor === void 0 ? "primary-blue-400" : _ref$focusColor,
    _ref$status = _ref.status,
    status = _ref$status === void 0 ? "default" : _ref$status,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    className = _ref.className,
    required = _ref.required,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$n);
  var statusClass = cx({
    "border-neutral-300": status === "default" && !disabled,
    "border-semantic-success": status === "success" && !disabled,
    "border-semantic-warning": status === "warning" && !disabled,
    "border-semantic-error": status === "error" && !disabled
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-col gap-2 w-full"
  }, label && ( /*#__PURE__*/React__default.createElement(Body2, {
    color: "neutral-600"
  }, label, required && /*#__PURE__*/React__default.createElement("span", {
    className: "text-semantic-error"
  }, " *"))), /*#__PURE__*/React__default.createElement("input", Object.assign({
    type: "text",
    className: cx("block w-full p-3 border-2 rounded-base outline-none transition-all", disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800", statusClass, "focus:ring-" + focusColor + " focus:border-" + focusColor, className),
    disabled: disabled,
    required: required
  }, props)));
};

var AddressInput = function AddressInput(props) {
  var _props$focusColor = props.focusColor,
    focusColor = _props$focusColor === void 0 ? "primary-blue-200" : _props$focusColor,
    ensProvider = props.ensProvider,
    defaultValue = props.defaultValue,
    label = props.label,
    _props$status = props.status,
    status = _props$status === void 0 ? 'default' : _props$status,
    onBlurCustom = props.onBlurCustom,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    _props$showEnsName = props.showEnsName,
    showEnsName = _props$showEnsName === void 0 ? false : _props$showEnsName;
  // const [isValid, setIsValid] = useState(true);
  var _useState = React.useState(false),
    isLoading = _useState[0],
    setIsLoading = _useState[1];
  var _useState2 = React.useState(""),
    inputValue = _useState2[0],
    setInputValue = _useState2[1];
  var _useState3 = React.useState(""),
    ensName = _useState3[0],
    setEnsName = _useState3[1];
  var statusClass = !disabled && cx({
    "border-neutral-300": status === 'default',
    "border-semantic-success": status === 'success',
    "border-semantic-warning": status === 'warning',
    "border-semantic-error": status === 'error'
  });
  React.useEffect(function () {
    setInputValue(defaultValue != null ? defaultValue : "");
  }, [defaultValue]);
  var fetchAddress = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(value) {
      var _yield$ensProvider$re, _ethers$utils$getAddr, address;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsLoading(true);
            _context.prev = 1;
            _context.next = 4;
            return ensProvider == null ? void 0 : ensProvider.resolveName(value);
          case 4:
            _context.t0 = _yield$ensProvider$re = _context.sent;
            if (!(_context.t0 != null)) {
              _context.next = 9;
              break;
            }
            _context.t1 = _yield$ensProvider$re;
            _context.next = 10;
            break;
          case 9:
            _context.t1 = value;
          case 10:
            address = _context.t1;
            setIsLoading(false);
            return _context.abrupt("return", (_ethers$utils$getAddr = ethers.ethers.utils.getAddress(address)) != null ? _ethers$utils$getAddr : null);
          case 15:
            _context.prev = 15;
            _context.t2 = _context["catch"](1);
            setIsLoading(false);
            return _context.abrupt("return", null);
          case 19:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 15]]);
    }));
    return function fetchAddress(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var handleBlur = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
      var addressOrEns, address;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            addressOrEns = e.target.value;
            _context2.next = 3;
            return fetchAddress(addressOrEns);
          case 3:
            address = _context2.sent;
            // setIsValid(address ? true : false);
            if (address) {
              setEnsName(addressOrEns); // Update the ENS name
            }
            onBlurCustom == null || onBlurCustom(_extends({}, e, {
              target: _extends({}, e.target, {
                value: address != null ? address : e.target.value
              })
            }));
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function handleBlur(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React__default.createElement("div", null, label && /*#__PURE__*/React__default.createElement(Body3, {
    color: "neutral-600 mb-3"
  }, label), /*#__PURE__*/React__default.createElement("div", {
    className: cx("flex items-center justify-center relative")
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    type: "text",
    id: "text-input",
    value: showEnsName && ensName ? ensName : inputValue,
    className: cx("block w-full p-3 border-2 rounded-base outline-none transition-all", disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800", statusClass, "focus:ring-" + focusColor + " focus:border-" + focusColor),
    onChange: function onChange(e) {
      return setInputValue(e.target.value);
    },
    onBlur: handleBlur
  }, props)), isLoading && ( /*#__PURE__*/React__default.createElement(Spinner, {
    className: "text-primary-blue-100 w-5 h-5 absolute right-3 top-[14px]"
  }))));
};

var ModalOverlay = function ModalOverlay() {
  return /*#__PURE__*/React__default.createElement(framerMotion.motion.div, {
    key: "modal-overlay",
    initial: {
      opacity: 0,
      backdropFilter: "blur(2px)"
    },
    animate: {
      opacity: 1,
      backdropFilter: "blur(8px)"
    },
    exit: {
      opacity: 0,
      backdropFilter: "blur(0px)"
    },
    transition: {
      duration: 0.15
    },
    className: "fixed w-screen h-screen inset-0 z-30 bg-primary-blue-200 bg-opacity-30 transition-all"
  });
};
var ModalContainer = function ModalContainer(_ref) {
  var children = _ref.children,
    className = _ref.className;
  var _useScreen = useScreen(),
    screen = _useScreen.screen;
  var contentAnimation = React.useMemo(function () {
    /* FIXME: If for any reason the screen type changes while the modal is open,
     *	the animation will displace the modal from the center of the screen */
    if (screen == ScreenType.Mobile) {
      return {
        initial: {
          opacity: 0,
          y: "100%"
        },
        animate: {
          opacity: 1,
          y: "0%"
        },
        exit: {
          opacity: 0,
          y: "100%"
        }
      };
    } else {
      return {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        exit: {
          opacity: 0
        }
      };
    }
  }, [screen]);
  return /*#__PURE__*/React__default.createElement(framerMotion.motion.div, Object.assign({
    key: "modal-container"
  }, contentAnimation, {
    transition: {
      duration: 0.2
    },
    className: cx("fixed z-50 transition-all", screen === ScreenType.Mobile ? "bottom-0 left-0 right-0" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", "rounded-t md:rounded", className)
  }), children);
};
var Modal = function Modal(_ref2) {
  var isOpen = _ref2.isOpen,
    onClose = _ref2.onClose,
    children = _ref2.children,
    _ref2$isClosingDisabl = _ref2.isClosingDisabled,
    isClosingDisabled = _ref2$isClosingDisabl === void 0 ? false : _ref2$isClosingDisabl,
    className = _ref2.className;
  var _React$useState = React__default.useState(false),
    rootOpen = _React$useState[0],
    setRootOpen = _React$useState[1];
  var handleClose = React.useCallback(function () {
    if (!isClosingDisabled) onClose();
  }, [isClosingDisabled, onClose]);
  /* Propage open / close state to root */
  /* Adds a delay to the close animation to prevent flickering */
  React.useEffect(function () {
    if (isOpen === rootOpen) return;
    if (isOpen) {
      setRootOpen(true);
    } else {
      // FIXME: this is a hack to prevent the root to unmount before the exit animation is finished
      setTimeout(function () {
        setRootOpen(false);
      }, 300);
    }
  }, [isOpen, rootOpen]);
  return /*#__PURE__*/React__default.createElement(reactDialog.Root, {
    open: rootOpen
  }, /*#__PURE__*/React__default.createElement(reactDialog.Portal, null, /*#__PURE__*/React__default.createElement(framerMotion.AnimatePresence, null, isOpen && ( /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(ModalOverlay, null), /*#__PURE__*/React__default.createElement(reactDialog.Content, {
    onInteractOutside: function onInteractOutside() {
      return handleClose();
    },
    onEscapeKeyDown: function onEscapeKeyDown() {
      return handleClose();
    }
  }, /*#__PURE__*/React__default.createElement(ModalContainer, {
    className: className
  }, children)))))));
};

var Loading = function Loading(_ref) {
  var _ref$size = _ref.size,
    size = _ref$size === void 0 ? 50 : _ref$size,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? '#000' : _ref$color;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: size + "px",
    height: size + "px",
    viewBox: "0 0 50 50",
    style: {
      display: 'block',
      margin: 'auto'
    }
  }, /*#__PURE__*/React__default.createElement("circle", {
    cx: "25",
    cy: "25",
    r: "20",
    fill: "none",
    stroke: color,
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeDasharray: "31.415, 31.415",
    transform: "rotate(-90 25 25)"
  }, /*#__PURE__*/React__default.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    from: "0 25 25",
    to: "360 25 25",
    dur: "1s",
    repeatCount: "indefinite"
  })));
};

var _path$C, _defs;
function _extends$D() { _extends$D = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$D.apply(this, arguments); }
var SvgNation3Logo = function SvgNation3Logo(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$D({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "none",
    viewBox: "0 0 50 50"
  }, props), _path$C || (_path$C = /*#__PURE__*/React.createElement("path", {
    fill: "url(#Nation3Logo_svg__a)",
    fillRule: "evenodd",
    d: "M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25M25 45.417C21.333 29.917 9.583 25.347 4.167 25H25zM45.833 25C40.417 24.653 28.667 20.083 25 4.583V25z",
    clipRule: "evenodd"
  })), _defs || (_defs = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "Nation3Logo_svg__a",
    x1: 0,
    x2: 32.215,
    y1: 0,
    y2: -9.611,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })))));
};

var IFooterDefaultProps = {
  menu: [{
    name: "Docs",
    link: "https://docs.nation3.org"
  }, {
    name: "About Nation3",
    link: "https://nation3.org"
  }, {
    name: "Support",
    link: "https://discord.gg/invite/nation3-690584551239581708"
  }]
};
var Footer = function Footer(props) {
  var menu = props.menu;
  return /*#__PURE__*/React__default.createElement("footer", {
    className: "flex w-full justify-center p-4 border-t-2 border-neutral-200"
  }, /*#__PURE__*/React__default.createElement(GridContainer, null, /*#__PURE__*/React__default.createElement("div", {
    className: "col-span-6 flex justify-start items-center gap-2"
  }, /*#__PURE__*/React__default.createElement(SvgNation3Logo, {
    className: "w-10 h-10 rounded-full fill-neutral-600"
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "text-md font-bossa text-neutral-700"
  }, "NATION3"), /*#__PURE__*/React__default.createElement("a", {
    href: "https://docs.nation3.org/agreements/agreements-beta",
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React__default.createElement(Label, {
    color: "neutral-600",
    border: "neutral-500",
    className: "no-wrap"
  }, "Beta v0.2.0"))), /*#__PURE__*/React__default.createElement("div", {
    className: "col-span-6 flex justify-end items-center gap-4"
  }, menu && menu.map(function (e) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("a", {
      className: "flex items-center gap-1 no-wrap",
      href: e.link,
      target: "_blank",
      rel: "noreferrer"
    }, /*#__PURE__*/React__default.createElement(Body3, null, e.name), /*#__PURE__*/React__default.createElement(ThemedIconRenderer, {
      icon: SvgRight,
      theme: "neutral",
      size: "extra-small",
      rounded: false,
      containerClass: "rounded-sm"
    })));
  }))));
};
Footer.defaultProps = IFooterDefaultProps;

var _excluded$o = ["label", "active", "className"];
var StepHandler = function StepHandler(_ref) {
  var label = _ref.label,
    active = _ref.active,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$o);
  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: cx("flex flex-col py-1 border-b-2 transition-all", "transition-all no-wrap", active ? "border-primary-green-600 text-neutral-800" : "border-primary-green-200 text-neutral-500", "truncate", className)
  }, props), /*#__PURE__*/React__default.createElement(Body3, {
    className: cx("sm-only:text-xs truncate")
  }, label));
};
var ProgressSteps = function ProgressSteps(props) {
  var steps = props.steps,
    onStepChange = props.onStepChange,
    currentStep = props.currentStep; // Remove the useState for activeStep
  var handleStepChange = function handleStepChange(index) {
    if (index < currentStep) onStepChange(index);
  };
  return /*#__PURE__*/React__default.createElement("nav", {
    className: "flex w-full gap-4"
  }, steps.map(function (_ref2, index) {
    var label = _ref2.label,
      hidden = _ref2.hidden;
    return /*#__PURE__*/React__default.createElement(StepHandler, {
      key: index,
      label: label,
      active: index <= currentStep,
      className: cx("w-full", hidden && "hidden", index < currentStep && "cursor-pointer"),
      onClick: function onClick() {
        return handleStepChange(index);
      }
    });
  }));
};

/*
ASYNC STEPS EXAMPLE PROCESS

1. stepIndex = 0;
2. steps[stepIndex].action executes
3. loadingIndex = stepIndex;
4. All actions are successful -> loadingIndex = null
5. stepIndex = 1
6. ... Repeat

X. Want to show a finish screen?
Set finishMessage, finishImage, finishAction props.
Set areStepsFinished = true;
 */
var IStepsDefaultProps = {
  steps: [],
  icon: null,
  title: "Title",
  stepIndex: 0,
  isLoading: true
};
var Step = function Step(props) {
  var _useScreen = useScreen(),
    screen = _useScreen.screen;
  var stepInfo = props.stepInfo,
    index = props.index,
    stepIndex = props.stepIndex,
    listLenght = props.listLenght,
    isLoading = props.isLoading;
  return /*#__PURE__*/React__default.createElement("div", {
    className: cx("flex mb-1 transition-all", screen === ScreenType.Desktop && "min-h-[120px]", index < stepIndex && "opacity-50")
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-col items-center w-10 mr-5"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: cx("transition-all text-slate-600 font-semibold border-2 w-10 h-10 p-2 m-2 text-sm rounded-full flex items-center justify-center relative", index === stepIndex && "border-bluesky ")
  }, index === stepIndex && isLoading && ( /*#__PURE__*/React__default.createElement(Spinner, {
    className: "w-11 h-11 absolute -left-1 -top-1 text-bluesky"
  })), index + 1), index !== listLenght - 1 && ( /*#__PURE__*/React__default.createElement("div", {
    className: cx("w-[2px] transition-all rounded-full h-full bg-slate-200")
  }))), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React__default.createElement("p", {
    className: cx("text-slate-600 text-lg font-semibold mb-2 md:pt-1 pt-4 mr-3", index !== stepIndex && "opacity-50")
  }, stepInfo.title)), screen === ScreenType.Mobile && index === stepIndex ? ( /*#__PURE__*/React__default.createElement(framerMotion.motion.div, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    className: cx("text-slate-400 text-sm")
  }, stepInfo.description)) : screen === ScreenType.Desktop ? ( /*#__PURE__*/React__default.createElement("div", {
    className: "text-slate-400 text-sm"
  }, stepInfo.description)) : ( /*#__PURE__*/React__default.createElement(React__default.Fragment, null))));
};
var Steps = function Steps(props) {
  var steps = props.steps,
    stepIndex = props.stepIndex,
    isStepLoading = props.isStepLoading,
    _props$isCTAdisabled = props.isCTAdisabled,
    isCTAdisabled = _props$isCTAdisabled === void 0 ? false : _props$isCTAdisabled,
    areStepsFinished = props.areStepsFinished,
    finishImage = props.finishImage,
    finishMessage = props.finishMessage,
    finishAction = props.finishAction;
  var stepAction = function stepAction() {
    !isCTAdisabled && steps[stepIndex].action();
  };
  return /*#__PURE__*/React__default.createElement("section", {
    className: "max-w-3xl w-full bg-white rounded-lg relative shadow-xl"
  }, areStepsFinished ? ( /*#__PURE__*/React__default.createElement("div", {
    className: "p-8 flex flex-col items-center"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "w-32"
  }, finishImage && /*#__PURE__*/React__default.createElement("img", {
    className: "",
    src: finishImage
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "mb-6 text-center"
  }, finishMessage), /*#__PURE__*/React__default.createElement(Button, {
    className: "px-6 w-32",
    onClick: finishAction
  }, "Finish"))) : ( /*#__PURE__*/React__default.createElement("div", {
    className: "pb-24 pt-8 px-8 flex justify-between"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "w-full pr-16 relative"
  }, steps == null ? void 0 : steps.map(function (step, index) {
    return /*#__PURE__*/React__default.createElement(Step, {
      key: step.title,
      listLenght: steps.length,
      stepInfo: step,
      stepIndex: stepIndex,
      isLoading: isStepLoading != null ? isStepLoading : false,
      index: index
    });
  })))), !areStepsFinished && ( /*#__PURE__*/React__default.createElement("div", {
    onClick: stepAction,
    className: cx("py-3 group transition-all px-5 m-5 border-bluesky border-2 rounded-lg absolute bottom-3 right-3 flex justify-start min-w-[200px] items-center text-bluesky gap-2", isStepLoading || isCTAdisabled ? "opacity-50" : "cursor-pointer  hover:bg-bluesky hover:text-white")
  }, /*#__PURE__*/React__default.createElement("p", {
    className: ""
  }, !areStepsFinished ? steps && steps[stepIndex].stepCTA : "Finish"), /*#__PURE__*/React__default.createElement(SvgRight, {
    className: cx(isStepLoading && "group-hover:ml-1 group-hover:mr-0 transition-all", "mr-1 h-5")
  }))));
};
Steps.defaultProps = IStepsDefaultProps;

var Table = function Table(_ref) {
  var columns = _ref.columns,
    data = _ref.data,
    clickHandlers = _ref.clickHandlers,
    className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "relative overflow-x-auto " + className
  }, /*#__PURE__*/React__default.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React__default.createElement("thead", {
    className: "sticky top-0 text-xs text-gray-500 uppercase"
  }, /*#__PURE__*/React__default.createElement("tr", null, columns.map(function (column, index) {
    return /*#__PURE__*/React__default.createElement("th", {
      key: index,
      scope: "col",
      className: "px-6 py-3 bg-gray-100 " + (index == 0 ? "rounded-l-lg" : "") + " " + (index + 1 >= columns.length ? "rounded-r-lg" : "")
    }, column.toUpperCase());
  }))), /*#__PURE__*/React__default.createElement("tbody", {
    className: "text-black overflow-y-auto"
  }, data.map(function (row, index) {
    return /*#__PURE__*/React__default.createElement("tr", {
      key: index,
      className: "bg-white " + (index != 0 && "border-t") + " " + (clickHandlers && "cursor-pointer"),
      onClick: (clickHandlers == null ? void 0 : clickHandlers[index]) !== undefined ? clickHandlers[index] : undefined
    }, row.map(function (item, index) {
      return /*#__PURE__*/React__default.createElement("td", {
        key: index,
        className: "px-6 py-4"
      }, item);
    }));
  }))));
};

var _g, _defs$1;
function _extends$E() { _extends$E = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$E.apply(this, arguments); }
var SvgOrbitingOrbGreen = function SvgOrbitingOrbGreen(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$E({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "none",
    viewBox: "0 0 85 86"
  }, props), _g || (_g = /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#orbitingOrbGreen_svg__a)"
  }, /*#__PURE__*/React.createElement("path", {
    stroke: "url(#orbitingOrbGreen_svg__b)",
    d: "M79 42.834c0 20.158-16.342 36.5-36.5 36.5S6 62.992 6 42.834s16.342-36.5 36.5-36.5S79 22.674 79 42.833Z",
    opacity: 0.3
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#orbitingOrbGreen_svg__c)",
    d: "M50.396 50.73c-9.438 9.438-18.893 17.05-26.542 21.729-3.827 2.341-7.178 3.933-9.833 4.662-2.699.74-4.487.539-5.417-.391s-1.132-2.719-.391-5.417c.728-2.656 2.32-6.006 4.662-9.834 4.679-7.648 12.29-17.104 21.729-26.542s18.893-17.05 26.542-21.73c3.827-2.34 7.178-3.933 9.833-4.661 2.699-.74 4.487-.54 5.417.39.93.931 1.132 2.72.391 5.418-.728 2.655-2.32 6.006-4.662 9.834-4.679 7.648-12.29 17.103-21.729 26.542Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#orbitingOrbGreen_svg__d)",
    d: "M34.604 50.73c-9.439-9.44-17.05-18.894-21.73-26.543-2.341-3.827-3.933-7.178-4.662-9.833-.74-2.699-.539-4.487.391-5.417s2.719-1.132 5.417-.391c2.656.728 6.006 2.32 9.834 4.662 7.649 4.679 17.104 12.29 26.542 21.729s17.05 18.893 21.73 26.542c2.34 3.827 3.933 7.178 4.661 9.833.74 2.699.54 4.487-.39 5.417-.931.93-2.72 1.132-5.418.391-2.655-.728-6.006-2.32-9.833-4.662-7.649-4.679-17.104-12.29-26.543-21.729Z"
  }))), _defs$1 || (_defs$1 = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "orbitingOrbGreen_svg__b",
    x1: 73.341,
    x2: 90.604,
    y1: 1.377,
    y2: 23.811,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "orbitingOrbGreen_svg__c",
    x1: 12.5,
    x2: 8.82,
    y1: 61.834,
    y2: 48.348,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF",
    stopOpacity: 0.15
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "orbitingOrbGreen_svg__d",
    x1: 11,
    x2: 22.994,
    y1: 12.333,
    y2: 2.467,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB",
    stopOpacity: 0.32
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "orbitingOrbGreen_svg__a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 .333h85v85H0z"
  })))));
};

var _g$1, _rect, _g2, _path$D, _defs$2;
function _extends$F() { _extends$F = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$F.apply(this, arguments); }
var SvgWarnDocument = function SvgWarnDocument(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$F({
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    width: "1em",
    height: "1em",
    fill: "none",
    viewBox: "0 0 115 115"
  }, props), _g$1 || (_g$1 = /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#warnDocument_svg__a)"
  }, /*#__PURE__*/React.createElement("path", {
    stroke: "url(#warnDocument_svg__b)",
    strokeWidth: 1.353,
    d: "M46.816 68.183c-12.77-12.77-23.067-25.562-29.398-35.91-3.168-5.178-5.322-9.712-6.307-13.304-1.002-3.651-.73-6.07.529-7.329s3.678-1.53 7.329-.53c3.592.986 8.125 3.14 13.304 6.308 10.348 6.33 23.14 16.629 35.91 29.399S91.25 72.378 97.58 82.726c3.168 5.178 5.322 9.712 6.308 13.304 1.001 3.65.729 6.07-.53 7.329s-3.677 1.53-7.328.529c-3.593-.986-8.126-3.14-13.305-6.308-10.348-6.33-23.14-16.628-35.91-29.398Z"
  }))), /*#__PURE__*/React.createElement("g", {
    filter: "url(#warnDocument_svg__c)"
  }, /*#__PURE__*/React.createElement("mask", {
    id: "warnDocument_svg__e",
    width: 57,
    height: 57,
    x: 29,
    y: 29,
    maskUnits: "userSpaceOnUse",
    style: {
      maskType: "alpha"
    }
  }, _rect || (_rect = /*#__PURE__*/React.createElement("rect", {
    width: 56,
    height: 56,
    x: 29,
    y: 29,
    fill: "url(#warnDocument_svg__d)",
    rx: 6
  }))), _g2 || (_g2 = /*#__PURE__*/React.createElement("g", {
    mask: "url(#warnDocument_svg__e)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 56,
    height: 56,
    x: 29,
    y: 29,
    fill: "#FFE5DE",
    rx: 16
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FF704D",
    d: "M47.2 60.3V47.1a1.1 1.1 0 0 1 1.1-1.1h17.6a1.1 1.1 0 0 1 1.1 1.1v17.6a3.3 3.3 0 0 1-3.3 3.3H48.3a3.3 3.3 0 0 1-3.3-3.3v-2.2h17.6v2.2a1.1 1.1 0 0 0 2.2 0v-4.4z"
  })))), _path$D || (_path$D = /*#__PURE__*/React.createElement("path", {
    stroke: "url(#warnDocument_svg__f)",
    strokeWidth: 1.353,
    d: "M68.183 68.183c-12.77 12.77-25.562 23.068-35.91 29.398-5.178 3.169-9.712 5.323-13.304 6.308-3.65 1.001-6.07.73-7.329-.529s-1.53-3.678-.529-7.329c.986-3.592 3.14-8.126 6.308-13.304 6.33-10.348 16.628-23.14 29.398-35.91s25.562-23.068 35.91-29.398c5.178-3.168 9.712-5.322 13.304-6.308 3.65-1.001 6.07-.73 7.329.53 1.259 1.258 1.53 3.677.529 7.328-.986 3.592-3.14 8.126-6.308 13.304-6.33 10.348-16.628 23.14-29.398 35.91Z"
  })), _defs$2 || (_defs$2 = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "warnDocument_svg__b",
    x1: 103.838,
    x2: 11.162,
    y1: 103.838,
    y2: 11.162,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#FF704D"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#FF3200",
    stopOpacity: 0
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "warnDocument_svg__f",
    x1: 103.838,
    x2: 11.162,
    y1: 11.162,
    y2: 103.838,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#FF704D"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#FF3200",
    stopOpacity: 0
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "warnDocument_svg__a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 0h114.999v114.999H0z"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: "warnDocument_svg__d",
    width: 1,
    height: 1,
    patternContentUnits: "objectBoundingBox"
  }, /*#__PURE__*/React.createElement("use", {
    xlinkHref: "#warnDocument_svg__g",
    transform: "scale(.00298)"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "warnDocument_svg__c",
    width: 72,
    height: 72,
    x: 21,
    y: 25,
    colorInterpolationFilters: "sRGB",
    filterUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("feFlood", {
    floodOpacity: 0,
    result: "BackgroundImageFix"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    "in": "SourceAlpha",
    result: "hardAlpha",
    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
  }), /*#__PURE__*/React.createElement("feOffset", {
    dy: 4
  }), /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: 4
  }), /*#__PURE__*/React.createElement("feComposite", {
    in2: "hardAlpha",
    operator: "out"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    values: "0 0 0 0 0.670588 0 0 0 0 0.745098 0 0 0 0 0.819608 0 0 0 0.4 0"
  }), /*#__PURE__*/React.createElement("feBlend", {
    in2: "BackgroundImageFix",
    result: "effect1_dropShadow_98_4202"
  }), /*#__PURE__*/React.createElement("feBlend", {
    "in": "SourceGraphic",
    in2: "effect1_dropShadow_98_4202",
    result: "shape"
  })), /*#__PURE__*/React.createElement("image", {
    xlinkHref: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAAFQCAIAAABmirGOAAAMbmlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnluSkJCEEkBASuhNEKkBpITQAkgvgo2QBBJKjAlBxV4WFVy7iIANXRVRbCsgduzKotj7YkFFWRd1saHyJiSg677yvfN9c++fM2f+U+5M7j0AaH3gSaV5qDYA+ZICWUJ4MHN0WjqT9BRggA4IwBf48vhyKTsuLhpAGbj/Xd7dAIjyftVZyfXP+f8qugKhnA8AMhbiTIGcnw/xcQDwKr5UVgAAUam3mlwgVeLZEOvJYIAQr1LibBXersSZKny43yYpgQPxZQA0qDyeLBsA+j2oZxbysyEP/TPErhKBWAKA1jCIA/gingBiZezD8vMnKnE5xPbQXgoxjAewMr/jzP4bf+YgP4+XPYhVefWLRohYLs3jTf0/S/O/JT9PMeDDFg6qSBaRoMwf1vBW7sQoJaZC3CXJjIlV1hriD2KBqu4AoBSRIiJZZY+a8OUcWD9gALGrgBcSBbEJxGGSvJhotT4zSxzGhRjuFnSKuICbBLEhxAuF8tBEtc1G2cQEtS+0PkvGYav153iyfr9KXw8UuclsNf8bkZCr5sfoRaKkVIgpEFsXilNiIKZD7CLPTYxS24wsEnFiBmxkigRl/NYQJwgl4cEqfqwwSxaWoLYvyZcP5IttFIm5MWq8r0CUFKGqD3aKz+uPH+aCXRZK2MkDPEL56OiBXATCkFBV7thzoSQ5Uc3zQVoQnKBai1OkeXFqe9xSmBeu1FtC7CEvTFSvxVMK4OZU8eNZ0oK4JFWceFEOLzJOFQ++DEQDDggBTKCAIxNMBDlA3NrV0AV/qWbCAA/IQDYQAme1ZmBFav+MBF4TQRH4AyIhkA+uC+6fFYJCqP8yqFVdnUFW/2xh/4pc8BTifBAF8uBvRf8qyaC3FPAEasT/8M6Dgw/jzYNDOf/v9QPabxo21ESrNYoBj0ytAUtiKDGEGEEMIzrgxngA7odHw2sQHG44C/cZyOObPeEpoY3wiHCd0E64PUE8V/ZDlKNAO+QPU9ci8/ta4LaQ0xMPxv0hO2TGDXBj4Ix7QD9sPBB69oRajjpuZVWYP3D/LYPvnobajuxKRslDyEFk+x9X0h3pnoMsylp/Xx9VrJmD9eYMzvzon/Nd9QXwHvWjJbYQ24+dxU5g57HDWANgYsewRqwFO6LEg7vrSf/uGvCW0B9PLuQR/8MfT+1TWUm5a61rp+tn1VyBcEqB8uBxJkqnysTZogImG74dhEyuhO8yjOnm6uYGgPJdo/r7ehvf/w5BDFq+6eb9DoD/sb6+vkPfdJHHANjrDY//wW86exYAOpoAnDvIV8gKVTpceSHAfwkteNKMgBmwAvYwHzfgBfxAEAgFkSAWJIE0MB5WWQT3uQxMBtPBHFAMSsEysBpUgA1gM9gOdoF9oAEcBifAGXARXAbXwV24ezrAS9AN3oFeBEFICA1hIEaIOWKDOCFuCAsJQEKRaCQBSUMykGxEgiiQ6cg8pBRZgVQgm5AaZC9yEDmBnEfakNvIQ6QTeYN8QjGUiuqhpqgtOhxloWw0Ck1Cx6HZ6CS0CJ2PLkHL0Wp0J1qPnkAvotfRdvQl2oMBTBMzwCwwZ4yFcbBYLB3LwmTYTKwEK8OqsTqsCT7nq1g71oV9xIk4A2fiznAHR+DJOB+fhM/EF+MV+Ha8Hj+FX8Uf4t34VwKNYEJwIvgSuITRhGzCZEIxoYywlXCAcBqepQ7COyKRaEC0I3rDs5hGzCFOIy4mriPuJh4nthEfE3tIJJIRyYnkT4ol8UgFpGLSWtJO0jHSFVIH6YOGpoa5hptGmEa6hkRjrkaZxg6NoxpXNJ5p9JK1yTZkX3IsWUCeSl5K3kJuIl8id5B7KToUO4o/JYmSQ5lDKafUUU5T7lHeampqWmr6aMZrijVna5Zr7tE8p/lQ8yNVl+pI5VDHUhXUJdRt1OPU29S3NBrNlhZES6cV0JbQamgnaQ9oH+gMugudSxfQZ9Er6fX0K/RXWmQtGy221nitIq0yrf1al7S6tMnattocbZ72TO1K7YPaN7V7dBg6I3RidfJ1Fuvs0Dmv81yXpGurG6or0J2vu1n3pO5jBsawYnAYfMY8xhbGaUaHHlHPTo+rl6NXqrdLr1WvW19X30M/RX+KfqX+Ef12A8zA1oBrkGew1GCfwQ2DT0NMh7CHCIcsGlI35MqQ94ZDDYMMhYYlhrsNrxt+MmIahRrlGi03ajC6b4wbOxrHG082Xm982rhrqN5Qv6H8oSVD9w29Y4KaOJokmEwz2WzSYtJjamYabio1XWt60rTLzMAsyCzHbJXZUbNOc4Z5gLnYfJX5MfMXTH0mm5nHLGeeYnZbmFhEWCgsNlm0WvRa2lkmW8613G1534pixbLKslpl1WzVbW1uPcp6unWt9R0bsg3LRmSzxuaszXtbO9tU2wW2DbbP7QztuHZFdrV29+xp9oH2k+yr7a85EB1YDrkO6xwuO6KOno4ix0rHS06ok5eT2GmdU9swwjCfYZJh1cNuOlOd2c6FzrXOD10MXKJd5ro0uLwabj08ffjy4WeHf3X1dM1z3eJ6d4TuiMgRc0c0jXjj5ujGd6t0u+ZOcw9zn+Xe6P7aw8lD6LHe45Ynw3OU5wLPZs8vXt5eMq86r05va+8M7yrvmyw9VhxrMeucD8En2GeWz2Gfj75evgW++3z/9HP2y/Xb4fd8pN1I4cgtIx/7W/rz/Df5twcwAzICNga0B1oE8gKrAx8FWQUJgrYGPWM7sHPYO9mvgl2DZcEHgt9zfDkzOMdDsJDwkJKQ1lDd0OTQitAHYZZh2WG1Yd3hnuHTwo9HECKiIpZH3OSacvncGm53pHfkjMhTUdSoxKiKqEfRjtGy6KZR6KjIUStH3YuxiZHENMSCWG7sytj7cXZxk+IOxRPj4+Ir458mjEiYnnA2kZE4IXFH4ruk4KSlSXeT7ZMVyc0pWiljU2pS3qeGpK5IbR89fPSM0RfTjNPEaY3ppPSU9K3pPWNCx6we0zHWc2zx2Bvj7MZNGXd+vPH4vPFHJmhN4E3Yn0HISM3YkfGZF8ur5vVkcjOrMrv5HP4a/ktBkGCVoFPoL1whfJbln7Ui63m2f/bK7E5RoKhM1CXmiCvEr3MicjbkvM+Nzd2W25eXmrc7XyM/I/+gRFeSKzk10WzilIltUidpsbR9ku+k1ZO6ZVGyrXJEPk7eWKAHP+pbFPaKnxQPCwMKKws/TE6ZvH+KzhTJlJapjlMXTX1WFFb0yzR8Gn9a83SL6XOmP5zBnrFpJjIzc2bzLKtZ82d1zA6fvX0OZU7unN/mus5dMfeveanzmuabzp89//FP4T/VFtOLZcU3F/gt2LAQXyhe2LrIfdHaRV9LBCUXSl1Ly0o/L+YvvvDziJ/Lf+5bkrWkdanX0vXLiMsky24sD1y+fYXOiqIVj1eOWlm/irmqZNVfqyesPl/mUbZhDWWNYk17eXR541rrtcvWfq4QVVyvDK7cXWVStajq/TrBuivrg9bXbTDdULrh00bxxlubwjfVV9tWl20mbi7c/HRLypazv7B+qdlqvLV065dtkm3t2xO2n6rxrqnZYbJjaS1aq6jt3Dl25+VdIbsa65zrNu022F26B+xR7HmxN2PvjX1R+5r3s/bX/Wrza9UBxoGSeqR+an13g6ihvTGtse1g5MHmJr+mA4dcDm07bHG48oj+kaVHKUfnH+07VnSs57j0eNeJ7BOPmyc03z05+uS1U/GnWk9HnT53JuzMybPss8fO+Z87fN73/MELrAsNF70u1rd4thz4zfO3A61erfWXvC81Xva53NQ2su3olcArJ66GXD1zjXvt4vWY6203km/cujn2Zvstwa3nt/Nuv75TeKf37ux7hHsl97Xvlz0weVD9u8Pvu9u92o88DHnY8ijx0d3H/Mcvn8iffO6Y/5T2tOyZ+bOa527PD3eGdV5+MeZFx0vpy96u4j90/qh6Zf/q1z+D/mzpHt3d8Vr2uu/N4rdGb7f95fFXc09cz4N3+e9635d8MPqw/SPr49lPqZ+e9U7+TPpc/sXhS9PXqK/3+vL7+qQ8Ga//UwCDA83KAuDNNgBoaQAwYN9GGaPqBfsFUfWv/Qj8J6zqF/vFC4A6+P0e3wW/bm4CsGcLbL8gvxbsVeNoACT5ANTdfXCoRZ7l7qbiosI+hfCgr+8t7NlIKwH4sqyvr7e6r+/LZhgs7B2PS1Q9qFKIsGfYGPclMz8T/BtR9aff5fjjHSgj8AA/3v8FYmOQ+lOZAlwAAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAAVCgAwAEAAAAAQAAAVAAAAAANiYLMQAADAxJREFUeAHt3TGuZEcVBmAGeQmEiAzEDtjDhF4BrGAkS+TOkUYaJGJERoREMkuw5B1YJiR1Tgo4sNxBy6en6/apOv830Ty9erfqfH/96uiq37x/9/Fn/hEgkCHw84wxTUmAwP8FFN49IBAkoPBBYRuVgMK7AwSCBBQ+KGyjElB4d4BAkIDCB4VtVAIK7w4QCBJQ+KCwjUpA4d0BAkECCh8UtlEJKLw7QCBIQOGDwjYqAYV3BwgECSh8UNhGJaDw7gCBIAGFDwrbqAQU3h0gECSg8EFhG5WAwrsDBIIEFD4obKMSUHh3gECQgMIHhW1UAgrvDhAIElD4oLCNSkDh3QECQQIKHxS2UQkovDtAIEhA4YPCNioBhXcHCAQJKHxQ2EYloPDuAIEgAYUPCtuoBBTeHSAQJKDwQWEblYDCuwMEggQUPihsoxJQeHeAQJCAwgeFbVQCCu8OEAgSUPigsI1KQOHdAQJBAgofFLZRCSi8O0AgSEDhg8I2KgGFdwcIBAkofFDYRiWg8O4AgSABhQ8K26gEFN4dIBAkoPBBYRuVgMK7AwSCBBQ+KGyjElB4d4BAkIDCB4VtVAKfIVgr8MWHt2sfeNDT3r/7WDxtXan+zOLW4ct8wodfAONnCSh8Vt6mDRdQ+PALYPwsAYXPytu04QIKH34BjJ8loPBZeZs2XEDhwy+A8bMEFD4rb9OGCyh8+AUwfpaAwmflbdpwAYUPvwDGzxJQ+Ky8TRsuoPDhF8D4WQLelivlXX+7q/S4oYso7R+sT/j9M3JCAssEFH4ZpQcR2F9A4ffPyAkJLBNQ+GWUHkRgfwGF3z8jJySwTEDhl1F6EIH9BRR+/4yckMAyAYVfRulBBPYXUPj9M3JCAssEFH4ZpQcR2F9A4ffPyAkJLBNQ+GWUHkRgfwGF3z8jJySwTOBN8nd3ebtr2T066kHJd94n/FFX1WEJPCeg8M/5+WsCRwko/FFxOSyB5wQU/jk/f03gKAGFPyouhyXwnIDCP+fnrwkcJaDwR8XlsASeE1D45/z8NYGjBBT+qLgclsBzAgr/nJ+/JnCUgMIfFZfDEnhOQOGf8/PXBI4SUPij4nJYAs8JDPxuOe/APXclTv3r5Hfg6pn5hK9bWUngeAGFPz5CAxCoCyh83cpKAscLKPzxERqAQF1A4etWVhI4XkDhj4/QAATqAgpft7KSwPECCn98hAYgUBdQ+LqVlQSOF1D44yM0AIG6gMLXrawkcLyAwh8foQEI1AUUvm5lJYHjBQa+LVd/a8p7dZX7+48//aGy7H9rPv/jX4srLesS8AnfJW9fAg0CCt+AbksCXQIK3yVvXwINAgrfgG5LAl0CCt8lb18CDQIK34BuSwJdAgrfJW9fAg0CCt+AbksCXQIK3yVvXwINAgrfgG5LAl0CCt8lb18CDQIK34BuSwJdAgrfJW9fAg0Cb+rvljWc7pO27H0H7op3y+rPrIPV32zr3b0+UX3lvDtfn90nfN3KSgLHCyj88REagEBdQOHrVlYSOF5A4Y+P0AAE6gIKX7eyksDxAgp/fIQGIFAXUPi6lZUEjhdQ+OMjNACBuoDC162sJHC8gMIfH6EBCNQFFL5uZSWB4wUU/vgIDUCgLqDwdSsrCRwvMPBtuSsyueINvCveQqvP3vu23BXnvOIduN/+7hfFo37z9XfFlb3LfML3+tudwEsFFP6l3DYj0Cug8L3+difwUgGFfym3zQj0Cih8r7/dCbxUQOFfym0zAr0CCt/rb3cCLxVQ+Jdy24xAr4DC9/rbncBLBRT+pdw2I9AroPC9/nYn8FIBhX8pt80I9AoofK+/3Qm8VOCzl+5msx8J1N9X+9EfLftv/V293nMuG9iDvhfwCe8iEAgSUPigsI1KQOHdAQJBAgofFLZRCSi8O0AgSEDhg8I2KgGFdwcIBAkofFDYRiWg8O4AgSABhQ8K26gEFN4dIBAkoPBBYRuVgMK7AwSCBKLflrviG+Pqd+fLf31bX1xc+eWvf1NcecU7cL0TFQcPX+YTPvwCGD9LQOGz8jZtuIDCh18A42cJKHxW3qYNF1D48Atg/CwBhc/K27ThAgoffgGMnyWg8Fl5mzZcQOHDL4DxswQUPitv04YLKHz4BTB+loDCZ+Vt2nABhQ+/AMbPEoh+W64e9bxvYps3UT3N5JU+4ZPTN3ucgMLHRW7gZAGFT07f7HECCh8XuYGTBRQ+OX2zxwkofFzkBk4WUPjk9M0eJ6DwcZEbOFlA4ZPTN3ucgMLHRW7gZAGFT07f7HECCh8XuYGTBRQ+OX2zxwl4W64Uef2b2B54C638PXClI36/qL77Fc/8/IKJ6ue0siLgE76iZA2BIQIKPyRIYxCoCCh8RckaAkMEFH5IkMYgUBFQ+IqSNQSGCCj8kCCNQaAioPAVJWsIDBFQ+CFBGoNARUDhK0rWEBgioPBDgjQGgYqAwleUrCEwREDhhwRpDAIVAYWvKFlDYIhA9Nty7999LMb4xYe3xZX1ZVe82Vbf/YqVV0xUf0/xionmPdMn/LxMTUTgroDC36XxCwLzBBR+XqYmInBXQOHv0vgFgXkCCj8vUxMRuCug8Hdp/ILAPAGFn5epiQjcFVD4uzR+QWCegMLPy9REBO4KKPxdGr8gME9A4edlaiICdwUU/i6NXxCYJ6Dw8zI1EYG7AtFvy91VCfhF/S20K96BOwX4m6+/O+WoxXP6hC9CWUZggoDCT0jRDASKAgpfhLKMwAQBhZ+QohkIFAUUvghlGYEJAgo/IUUzECgKKHwRyjICEwQUfkKKZiBQFFD4IpRlBCYIKPyEFM1AoCig8EUoywhMEFD4CSmagUBRQOGLUJYRmCDgbbkJKX7CDFe8A1d/A+8TDvyTf3LF9//95KY/LKh/T+EPf9LyH5/wLew2JdAjoPA97nYl0CKg8C3sNiXQI6DwPe52JdAioPAt7DYl0COg8D3udiXQIqDwLew2JdAjoPA97nYl0CKg8C3sNiXQI6DwPe52JdAioPAt7DYl0COg8D3udiXQIqDwLew2JdAj4G25HveLdv3nn/++/Ml/+/d/is/86quviitPWfbLv/y+eNRffXhbXNn7Xp1P+GJMlhGYIKDwE1I0A4GigMIXoSwjMEFA4SekaAYCRQGFL0JZRmCCgMJPSNEMBIoCCl+EsozABAGFn5CiGQgUBRS+CGUZgQkCCj8hRTMQKAoofBHKMgITBBR+QopmIFAUUPgilGUEJgi86X13ZwLh7Qz1bzi74tvdbs/y6p96v1vu1dPe7ndKj3zC3+bmJwKjBRR+dLyGI3AroPC3Hn4iMFpA4UfHazgCtwIKf+vhJwKjBRR+dLyGI3AroPC3Hn4iMFpA4UfHazgCtwIKf+vhJwKjBRR+dLyGI3AroPC3Hn4iMFpA4UfHazgCtwIKf+vhJwKjBXy33AHx1t9CO+UNvFPeLTvgcjx4RJ/wD4JZTuBkAYU/OT1nJ/CggMI/CGY5gZMFFP7k9JydwIMCCv8gmOUEThZQ+JPTc3YCDwoo/INglhM4WUDhT07P2Qk8KKDwD4JZTuBkAYU/OT1nJ/CggMI/CGY5gZMFFP7k9JydwIMCCv8gmOUEThbwttwB6dXfgau/V3fF2N6Bu0J17TN9wq/19DQCWwso/NbxOByBtQIKv9bT0whsLaDwW8fjcATWCij8Wk9PI7C1gMJvHY/DEVgroPBrPT2NwNYCCr91PA5HYK2Awq/19DQCWwso/NbxOByBtQIKv9bT0whsLaDwW8fjcATWCij8Wk9PI7C1gLflto7n0cNd8V6dd+AeTWHn9T7hd07H2QgsFlD4xaAeR2BnAYXfOR1nI7BYQOEXg3ocgZ0FFH7ndJyNwGIBhV8M6nEEdhZQ+J3TcTYCiwUUfjGoxxHYWUDhd07H2QgsFlD4xaAeR2BnAYXfOR1nI7BYQOEXg3ocgZ0FFH7ndJyNwGIBhV8M6nEEdhZQ+J3TcTYCiwUUfjGoxxHYWUDhd07H2QgsFlD4xaAeR2BnAYXfOR1nI7BYQOEXg3ocgZ0FFH7ndJyNwGIBhV8M6nEEdhZQ+J3TcTYCiwUUfjGoxxHYWUDhd07H2QgsFlD4xaAeR2BnAYXfOR1nI7BY4L9sp4QP9X1wywAAAABJRU5ErkJggg==",
    id: "warnDocument_svg__g",
    width: 336,
    height: 336
  }))));
};

var _g$2, _defs$3;
function _extends$G() { _extends$G = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$G.apply(this, arguments); }
var SvgAgreementsHeader = function SvgAgreementsHeader(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$G({
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    fill: "none",
    viewBox: "0 0 1716 278"
  }, props), _g$2 || (_g$2 = /*#__PURE__*/React.createElement("g", {
    opacity: 0.5
  }, /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__a)",
    d: "M1501.58 359.184v.5h96.07v-.5c0-102.218-82.87-185.082-185.08-185.082-102.22 0-185.08 82.864-185.08 185.082v.5h96.06v-.5c0-49.164 39.85-89.018 89.02-89.018 49.16 0 89.01 39.854 89.01 89.018Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__b)",
    d: "M1501.59 359.184v.5h96.06v-.5c0-102.218-82.87-185.082-185.08-185.082-102.22 0-185.08 82.864-185.08 185.082v.5h96.06v-.5c0-49.164 39.85-89.018 89.02-89.018 49.16 0 89.02 39.854 89.02 89.018Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__c)",
    d: "M1558.74 359.094v.5h156.14v-.5c0-166.566-135.09-301.594-301.74-301.594-166.64 0-301.73 135.028-301.73 301.594v.5h156.14v-.5c0-80.371 65.19-145.524 145.59-145.524 80.41 0 145.6 65.153 145.6 145.524Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__d)",
    d: "M1558.74 359.094v.5h156.14v-.5c0-166.566-135.09-301.594-301.74-301.594-166.64 0-301.73 135.028-301.73 301.594v.5h156.14v-.5c0-80.371 65.19-145.524 145.59-145.524 80.41 0 145.6 65.153 145.6 145.524Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__e)",
    d: "M551.825 422.094v.5h156.142v-.5c0-166.566-135.091-301.594-301.734-301.594S104.5 255.528 104.5 422.094v.5h156.141v-.5c0-80.371 65.184-145.524 145.592-145.524s145.592 65.153 145.592 145.524Z",
    opacity: 0.3
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__f)",
    d: "M1501.58 359.184v.5h96.07v-.5c0-102.218-82.87-185.082-185.08-185.082-102.22 0-185.08 82.864-185.08 185.082v.5h96.06v-.5c0-49.164 39.85-89.018 89.02-89.018 49.16 0 89.01 39.854 89.01 89.018Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__g)",
    d: "M1501.59 359.184v.5h96.06v-.5c0-102.218-82.87-185.082-185.08-185.082-102.22 0-185.08 82.864-185.08 185.082v.5h96.06v-.5c0-49.164 39.85-89.018 89.02-89.018 49.16 0 89.02 39.854 89.02 89.018Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__h)",
    d: "M1457.62 359.094v.5h156.07v-.5c0-166.566-135.03-301.594-301.6-301.594-166.56 0-301.59 135.028-301.59 301.594v.5h156.07v-.5c0-80.371 65.15-145.524 145.52-145.524s145.53 65.153 145.53 145.524Z",
    opacity: 0.6
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__i)",
    d: "M420.618 422.094v.5h156.069l.001-.5c0-166.566-135.029-301.594-301.594-301.594C108.528 120.5-26.5 255.528-26.5 422.094v.5h156.07v-.5c0-80.371 65.153-145.524 145.524-145.524s145.524 65.153 145.524 145.524Z",
    opacity: 0.2
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__j)",
    d: "M1501.59 359.184v.5h96.06v-.5c0-102.218-82.87-185.082-185.08-185.082-102.22 0-185.08 82.864-185.08 185.082v.5h96.06v-.5c0-49.164 39.85-89.018 89.02-89.018 49.16 0 89.02 39.854 89.02 89.018Z",
    opacity: 0.5
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__k)",
    d: "M464.585 422.183v.5h96.063v-.5c0-102.217-82.864-185.081-185.081-185.081-102.218 0-185.082 82.864-185.082 185.081v.5h96.063v-.5c0-49.163 39.855-89.018 89.019-89.018 49.163 0 89.018 39.855 89.018 89.018Z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__l)",
    d: "M1107.38 359.333v.5h69.97v-.5c0-74.241-60.18-134.426-134.42-134.426-74.246 0-134.43 60.185-134.43 134.426v.5h69.974v-.5c0-35.595 28.856-64.451 64.456-64.451 35.59 0 64.45 28.856 64.45 64.451Z",
    opacity: 0.5
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__m)",
    d: "m1548.42 27.254 9.65 28.941-12.02-27.834"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__n)",
    d: "M1545.42 88V27.095h-1.9l-2.37 58.357"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__o)",
    d: "m1545.58 28.519 4.11-1.74v-2.214l-24.83-2.689 20.72 5.377"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__p)",
    d: "M1545.42 23.932 1558.39 1l-9.81 23.564"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__q)",
    d: "m1509.84 35.534 6.08 18.227-7.57-17.53"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__r)",
    d: "M1507.95 72.685v-37.25h-1.2l-1.49 36.752"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__s)",
    d: "m1508.05 36.33 2.59-1.095v-1.394L1495 32.147l13.05 3.387"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__t)",
    d: "M1507.95 33.442 1516.12 19l-6.18 14.84"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "url(#agreementsHeader_svg__u)",
    d: "M1561 186c27-17.333 77.8-63.2 65-108-8.06-28.22-38.98-42.727-76.5-46.464M1446 44.747c30.12-10.689 65.49-15.821 97-13.747"
  }))), _defs$3 || (_defs$3 = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__a",
    x1: 1597.15,
    x2: 1406.14,
    y1: 359.184,
    y2: 473.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__b",
    x1: 1597.15,
    x2: 1406.14,
    y1: 359.184,
    y2: 473.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__c",
    x1: 1714.38,
    x2: 1402.73,
    y1: 359.094,
    y2: 545.144,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__d",
    x1: 1714.38,
    x2: 1402.73,
    y1: 359.094,
    y2: 545.144,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__e",
    x1: 707.467,
    x2: 395.818,
    y1: 422.094,
    y2: 608.144,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__f",
    x1: 1597.15,
    x2: 1406.14,
    y1: 359.184,
    y2: 473.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__g",
    x1: 1597.15,
    x2: 1406.14,
    y1: 359.184,
    y2: 473.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__h",
    x1: 1613.19,
    x2: 1301.61,
    y1: 359.094,
    y2: 545.017,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__i",
    x1: 576.187,
    x2: 264.607,
    y1: 422.094,
    y2: 608.017,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__j",
    x1: 1597.15,
    x2: 1406.14,
    y1: 359.184,
    y2: 473.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__k",
    x1: 560.148,
    x2: 369.138,
    y1: 422.183,
    y2: 536.161,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__l",
    x1: 1176.85,
    x2: 1038.26,
    y1: 359.333,
    y2: 442.031,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__m",
    x1: 1558.07,
    x2: 1549.77,
    y1: 27.254,
    y2: 26.225,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__n",
    x1: 1545.42,
    x2: 1542.42,
    y1: 27.095,
    y2: 27.033,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__o",
    x1: 1549.69,
    x2: 1541.93,
    y1: 21.877,
    y2: 13.217,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__p",
    x1: 1558.39,
    x2: 1549.53,
    y1: 1,
    y2: -0.455,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__q",
    x1: 1515.92,
    x2: 1510.69,
    y1: 35.534,
    y2: 34.886,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__r",
    x1: 1507.95,
    x2: 1506.06,
    y1: 35.434,
    y2: 35.394,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__s",
    x1: 1510.64,
    x2: 1505.75,
    y1: 32.148,
    y2: 26.694,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__t",
    x1: 1516.12,
    x2: 1510.54,
    y1: 19,
    y2: 18.084,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "agreementsHeader_svg__u",
    x1: 1606,
    x2: 1621.48,
    y1: 174,
    y2: 67.12,
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#69C9FF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: 1,
    stopColor: "#88F1BB",
    stopOpacity: 0.47
  })))));
};

exports.AccountLabel = AccountLabel;
exports.ActionContainer = ActionContainer;
exports.ActionIconLabel = ActionIconLabel;
exports.ActionLabel = ActionLabel;
exports.AddressDisplay = AddressDisplay;
exports.AddressInput = AddressInput;
exports.AgreementIcon = SvgAgreement;
exports.AgreementsHeader = SvgAgreementsHeader;
exports.AlertIcon = SvgAlert;
exports.AnimationLoader = AnimationLoader;
exports.Body1 = Body1;
exports.Body2 = Body2;
exports.Body3 = Body3;
exports.BodyHeadline = BodyHeadline;
exports.Breadcrumbs = ProgressSteps;
exports.Button = Button;
exports.Card = Card;
exports.CheckIcon = SvgCheck;
exports.ClockIcon = SvgClock;
exports.CollateralIcon = SvgCollateral;
exports.ConstitutionIcon = SvgConstitution;
exports.CreationIcon = SvgCreation;
exports.CrossIcon = SvgCross;
exports.CustomRadioInput = CustomRadioInput;
exports.DashboardIcon = SvgDashboard;
exports.DisputeIcon = SvgDispute;
exports.DownIcon = SvgDown;
exports.DropInput = DropInput;
exports.DropdownIcon = SvgDropdown;
exports.FileAddIcon = SvgFileAdd;
exports.FileEncryptedIcon = SvgFileEncrypted;
exports.FilePendingIcon = SvgFilePending;
exports.FilterIcon = SvgFilter;
exports.FingerprintIcon = SvgFingerpint;
exports.Footer = Footer;
exports.FullOrbIcon = SvgFullOrb;
exports.GradientBorderButton = GradientBorderButton;
exports.GridContainer = GridContainer;
exports.Handler = Handler;
exports.Headline1 = Headline1;
exports.Headline2 = Headline2;
exports.Headline3 = Headline3;
exports.Headline4 = Headline4;
exports.HeadlineBasic = HeadlineBasic;
exports.IconButton = IconButton;
exports.IconLabel = IconLabel;
exports.IconRenderer = IconRenderer;
exports.IllustrationRenderer = IllustrationRenderer;
exports.InfoIcon = SvgInfo;
exports.JudgeIcon = SvgJudge;
exports.Label = Label;
exports.LeftIcon = SvgLeft;
exports.LessIcon = SvgLess;
exports.Loading = Loading;
exports.ManifestoIcon = SvgManifesto;
exports.Modal = Modal;
exports.ModalContainer = ModalContainer;
exports.ModalOverlay = ModalOverlay;
exports.N3Icon = SvgN3;
exports.OrbitingOrbGreen = SvgOrbitingOrbGreen;
exports.PaperIcon = SvgPaper;
exports.PasswordInput = PasswordInput;
exports.PlayIcon = SvgPlay;
exports.PlusIcon = SvgPlus;
exports.PrivateIcon = SvgPrivate;
exports.ResolutionIcon = SvgResolution;
exports.RightIcon = SvgRight;
exports.RoundedHandler = RoundedHandler;
exports.SignalIcon = SvgSignal;
exports.Spinner = Spinner;
exports.Steps = Steps;
exports.Table = Table;
exports.TextAreaInput = TextAreaInput;
exports.TextInput = TextInput;
exports.ThemeIcon = SvgTheme;
exports.ThemedIconRenderer = ThemedIconRenderer;
exports.TokenIcon = SvgToken;
exports.UnlockIcon = SvgUnlock;
exports.UpIcon = SvgUp;
exports.UserIcon = SvgUser;
exports.WalletInput = WalletInput;
exports.WarnDocumentOrange = SvgWarnDocument;
exports.WorldIcon = SvgWorld;
exports.ZoomIcon = SvgZoom;
exports.useScreen = useScreen;
exports.utils = index;
//# sourceMappingURL=mufi-ui-components.cjs.development.js.map
