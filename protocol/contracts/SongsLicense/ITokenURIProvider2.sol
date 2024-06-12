// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/utils/Base64.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract ITokenURIProvider {
  function tokenURI(
    uint256 tokenId,
    string memory name,
    string memory baseURI,
    string memory imageHash,
    string memory htmlHash
  ) external pure returns (string memory) {
    string memory imageUrl = string(abi.encodePacked(baseURI, imageHash));
    string memory animationUrl = string(
      abi.encodePacked(baseURI, htmlHash, '/#/', Strings.toString(tokenId))
    );

    string memory metadata = string(
      abi.encodePacked(
        '{',
        '"name":"SONGS \u25D2 ',
        name,
        '",',
        '"description":"This license allows the holder to publish Wrapped Songs at the SONGS Protocol",',
        '"image":"',
        imageUrl,
        '",',
        '"image_data":"data:image/svg+xml;base64,',
        _generateSVGImage(tokenId, name),
        '",',
        '"animation_url":"',
        animationUrl,
        '",',
        '"external_url":"https://songs-tools.com",',
        '"attributes":[',
        _getAttributes(tokenId, name),
        ']',
        '}'
      )
    );

    string memory json = Base64.encode(bytes(metadata));
    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  function _getAttributes(
    uint256 tokenId,
    string memory name
  ) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{"trait_type":"License ID","value":"',
          Strings.toString(tokenId),
          '"},',
          '{"trait_type":"Name","value":"',
          name,
          '"}'
        )
      );
  }

  function _generateSVGImage(
    uint256 tokenId,
    string memory name
  ) internal pure returns (string memory) {
    return
      Base64.encode(
        bytes(
          abi.encodePacked(
            _generateSVGHeader(),
            _generateSVGBody(tokenId, name),
            _generateSVGFooter()
          )
        )
      );
  }

  function _generateSVGHeader() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<rect width="1000" height="1000" fill="url(#paint0_linear_2112_4359)" />',
          '<pattern id="dottedPattern" patternUnits="userSpaceOnUse" width="10" height="10">',
          '<circle cx="5" cy="5" r="1" fill="#282828" />',
          '</pattern>',
          '<rect width="100%" height="100%" fill="url(#dottedPattern)" style="mix-blend-mode: soft-light;" />'
        )
      );
  }

  function _generateSVGBody(
    uint256 tokenId,
    string memory name
  ) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<g>',
          _generateSVGRectangles(),
          _generateSVGCircle(),
          _generateSVGLines(),
          _generateSVGPaths(),
          _generateSVGTexts(tokenId, name),
          '</g>'
        )
      );
  }

  function _generateSVGRectangles() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<rect x="54" y="236" width="892.12" height="528.143" rx="30" fill="url(#paint0_linear_2112_4360)" fill-opacity="0.4" shape-rendering="crispEdges" filter="url(#filter0_bd_2112_4360)" />',
          '<rect x="57" y="239" width="886.12" height="522.143" rx="27" stroke="url(#paint1_linear_2112_4360)" stroke-width="6" shape-rendering="crispEdges"  />'
        )
      );
  }

  function _generateSVGCircle() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<circle cx="500" cy="500" r="210" fill="white" opacity="0.4" filter="url(#filter0_f_2114_4429)" style="animation: rotate 45s linear infinite; transform-origin: center"/>'
        )
      );
  }
  function _generateSVGLines() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<path d="M327.853 566.191C309.853 540.191 317.353 459.691 381.504 434.691" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M315.829 495.14C309.149 464.231 346.884 392.729 415.719 394.181" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M331.91 424.895C337.567 393.782 399.792 342.163 462.831 369.847" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M373.649 366.153C390.782 339.573 468.024 315.696 515.671 365.396" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M434.691 327.853C460.691 309.853 541.191 317.353 566.191 381.504" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M505.743 315.829C536.653 309.149 608.155 346.884 606.702 415.719" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M575.988 331.91C607.101 337.567 658.72 399.792 631.036 462.831" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M634.731 373.65C661.311 390.783 685.188 468.025 635.488 515.672" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M673.03 434.691C691.03 460.691 683.53 541.191 619.379 566.191" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M685.054 505.742C691.734 536.652 653.999 608.154 585.164 606.701" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M668.973 575.988C663.316 607.101 601.091 658.72 538.051 631.036" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M627.234 634.73C610.101 661.31 532.859 685.187 485.212 635.487" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M566.191 673.03C540.191 691.03 459.691 683.53 434.691 619.379" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M495.139 685.054C464.23 691.734 392.728 653.999 394.18 585.164" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M424.895 668.973C393.782 663.316 342.163 601.091 369.847 538.051" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>',
          '<path d="M366.152 627.233C339.572 610.1 315.695 532.858 365.395 485.211" stroke="#EFECEA" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 8" style="animation: rotate 45s linear infinite; transform-origin: center; mix-blend-mode: luminosity;"/>'
        )
      );
  }

  function _generateSVGPaths() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<path d="M419.513 489.776C417.585 481.997 421.489 472.448 424.343 465.172C428.561 454.678 435.283 445.331 443.775 437.87C465.904 417.779 499.36 411.871 527.446 421.552C540.406 426.351 552.384 434.121 561.758 444.273C571.374 454.574 578.079 467.602 580.776 481.418C582.104 487.342 581.376 492.953 576.606 497.289C557.238 514.234 521.155 518.582 496.132 517.971C476.393 517.351 456.281 514.407 438.112 506.315C430.807 502.807 421.948 497.997 419.533 489.848L419.513 489.776Z" fill="#FEFEFE" style="mix-blend-mode:soft-light"/>',
          '<path d="M419.513 489.776C417.585 481.997 421.489 472.448 424.343 465.172C428.561 454.678 435.283 445.331 443.775 437.87C465.904 417.779 499.36 411.871 527.446 421.552C540.406 426.351 552.384 434.121 561.758 444.273C571.374 454.574 578.079 467.602 580.776 481.418C582.104 487.342 581.376 492.953 576.606 497.289C557.238 514.234 521.155 518.582 496.132 517.971C476.393 517.351 456.281 514.407 438.112 506.315C430.807 502.807 421.948 497.997 419.533 489.848L419.513 489.776Z" stroke="#393939" stroke-width="4.29773" stroke-miterlimit="10" stroke-linecap="round"/>',
          '<path d="M580.507 499.031C582.729 499.932 581.554 507.478 581.433 510.245C579.678 530.907 568.288 550.024 552.667 563.305C540.041 574.623 523.691 580.918 506.996 582.68C499.485 583.395 491.902 582.856 484.488 581.622C449.238 575.854 421.269 544.566 418.499 509.07C418.262 506.444 417.96 503.689 418.004 501.078C418.085 498.54 418.576 496.626 421.482 499.232C442.09 520.027 475.195 524.853 503.313 524.781C523.985 524.379 545.168 520.533 563.466 510.522C567.813 508.097 571.91 505.145 575.613 501.798C576.909 500.632 579.473 498.54 580.475 499.019L580.503 499.027L580.507 499.031Z" fill="#FEFEFE" style="mix-blend-mode:soft-light"/>',
          '<path d="M580.507 499.031C582.729 499.932 581.554 507.478 581.433 510.245C579.678 530.907 568.288 550.024 552.667 563.305C540.041 574.623 523.691 580.918 506.996 582.68C499.485 583.395 491.902 582.856 484.488 581.622C449.238 575.854 421.269 544.566 418.499 509.07C418.262 506.444 417.96 503.689 418.004 501.078C418.085 498.54 418.576 496.626 421.482 499.232C442.09 520.027 475.195 524.853 503.313 524.781C523.985 524.379 545.168 520.533 563.466 510.522C567.813 508.097 571.91 505.145 575.613 501.798C576.909 500.632 579.473 498.54 580.475 499.019L580.503 499.027L580.507 499.031Z" stroke="#393939" stroke-width="4.29773" stroke-miterlimit="10" stroke-linecap="round"/>',
          '<path d="M581.002 498.38C580.362 499.659 579.388 500.648 578.406 501.67C576.547 503.609 574.635 505.467 572.481 507.092C567.04 511.194 561.131 514.448 554.812 516.994C550.356 518.788 545.808 520.301 541.175 521.543C535.412 523.088 529.571 524.299 523.643 525.075C520.052 525.545 516.458 525.964 512.852 526.302C511.165 526.458 509.471 526.531 507.776 526.567C501.139 526.72 494.51 526.615 487.877 526.189C481.341 525.771 474.852 525.006 468.433 523.792C461.602 522.497 454.881 520.755 448.328 518.362C441.031 515.695 434.18 512.228 427.905 507.651C424.062 504.848 420.886 501.413 418.463 497.31C418.527 495.556 418.475 493.791 418.761 492.049C418.797 491.828 418.894 491.615 418.962 491.397C419.389 491.603 419.485 492.045 419.674 492.411C420.954 494.861 422.802 496.868 424.762 498.758C427.966 501.847 431.713 504.172 435.686 506.147C445.036 510.796 454.929 513.765 465.144 515.78C468.956 516.532 472.784 517.208 476.635 517.714C478.587 517.972 480.56 518.048 482.516 518.285C484.939 518.579 487.366 518.748 489.797 518.925C490.171 518.953 490.546 519.018 490.92 519.026C494.728 519.098 498.539 519.207 502.347 519.215C505.027 519.223 507.716 519.215 510.385 518.997C513.234 518.764 516.092 518.676 518.934 518.318C521.163 518.04 523.413 517.932 525.643 517.626C531.681 516.797 537.654 515.655 543.55 514.098C548.597 512.767 553.544 511.138 558.35 509.115C563.204 507.072 567.953 504.811 572.26 501.706C575.174 499.603 577.855 497.278 579.972 494.354C580.237 493.988 580.567 493.65 580.656 493.147C580.741 492.672 581.071 492.978 581.308 493.034C581.32 493.682 581.252 494.342 581.36 494.973C581.566 496.16 581.376 497.274 580.986 498.38H581.002Z" fill="#393939"/>'
        )
      );
  }


function _formatTokenId(uint256 tokenId) internal pure returns (string memory) {
    string memory paddedTokenId = Strings.toString(tokenId);
    while (bytes(paddedTokenId).length < 5) {
        paddedTokenId = string(abi.encodePacked("0", paddedTokenId));
    }
    return paddedTokenId;
}

  function _generateSVGTexts(
    uint256 tokenId,
    string memory name
  ) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<text x="98" y="275" opacity="0.7" fill="#353535" text-anchor="start" alignment-baseline="hanging" style="font-family: mundial; text-transform: uppercase; letter-spacing: 4px; font-size: 18px; text-shadow: 0px 1px 0px #00000002;">SONGS</text>',
          '<text x="910" y="275" opacity="0.7" fill="#353535" text-anchor="end" alignment-baseline="hanging" style="font-family: mundial; text-transform: uppercase; letter-spacing: 4px; font-size: 18px; text-shadow: 0px 1px 0px #00000002;">LICENSE</text>',
          '<text x="98" y="725" opacity="0.7" fill="#353535" text-anchor="start" alignment-baseline="baseline" style="font-family: mundial; text-transform: uppercase; letter-spacing: 4px; font-size: 18px; text-shadow: 0px 1px 0px #00000002;">',
          name,
          '</text>',
          '<text x="910" y="725" opacity="0.7" fill="#353535" text-anchor="end" alignment-baseline="baseline" style="font-family: mundial; text-transform: uppercase; letter-spacing: 4px; font-size: 18px; text-shadow: 0px 1px 0px #00000002;">ID:',
          _formatTokenId(tokenId),
          '</text>'
        )
      );
  }


  function _generateSVGFooter() internal pure returns (string memory) {
    return string(abi.encodePacked(_generateDefs(), _generateSVGCloseTag()));
  }

  function _generateDefs() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<defs>',
          _generateFilter0B21134395(),
          _generateLinearGradientPaint0Linear21134395(),
          _generateFilter0Bd21124360(),
          _generateLinearGradientPaint0Linear21124359(),
          _generateLinearGradientPaint0Linear21124360(),
          _generateLinearGradientPaint1Linear21124360(),
          _generateFilter0F21144429(),
          _generateStyle(),
          '</defs>'
        )
      );
  }

  function _generateFilter0B21134395() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<filter id="filter0_b_2113_4395" x="-10" y="-10" width="912.119" height="548.143" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">',
          '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
          '<feGaussianBlur in="BackgroundImageFix" stdDeviation="5"/>',
          '<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2113_4395"/>',
          '<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_2113_4395" result="shape"/>',
          '</filter>'
        )
      );
  }

  function _generateLinearGradientPaint0Linear21134395()
    internal
    pure
    returns (string memory)
  {
    return
      string(
        abi.encodePacked(
          '<linearGradient id="paint0_linear_2113_4395" x1="906" y1="5.05852e-05" x2="-4.77025e-05" y2="528" gradientUnits="userSpaceOnUse">',
          '<stop stop-color="white" stop-opacity="0.06"/>',
          '<stop offset="1" stop-color="#F3F3F3" stop-opacity="0.6"/>',
          '</linearGradient>'
        )
      );
  }

  function _generateFilter0Bd21124360() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<filter id="filter0_bd_2112_4360" x="36" y="226" width="928.119" height="566.143" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">',
          '<feFlood flood-opacity="0" result="BackgroundImageFix" />',
          '<feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />',
          '<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2112_4360" />',
          '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />',
          '<feOffset dy="10" />',
          '<feGaussianBlur stdDeviation="9" />',
          '<feComposite in2="hardAlpha" operator="out" />',
          '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />',
          '<feBlend mode="normal" in2="effect1_backgroundBlur_2112_4360" result="effect2_dropShadow_2112_4360" />',
          '<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2112_4360" result="shape" />',
          '</filter>'
        )
      );
  }

  function _generateLinearGradientPaint0Linear21124359()
    internal
    pure
    returns (string memory)
  {
    return
      string(
        abi.encodePacked(
          '<linearGradient id="paint0_linear_2112_4359" x1="1039.32" y1="-68.9694" x2="-317.473" y2="324.293" gradientUnits="userSpaceOnUse">',
          '<stop offset="0.0461987" stop-color="#76ACF5" />',
          '<stop offset="0.201565" stop-color="#B8BAD4" />',
          '<stop offset="0.361787" stop-color="#FBBAB7" />',
          '<stop offset="0.488023" stop-color="#FECD8A" />',
          '<stop offset="0.64339" stop-color="#F9DF7D" />',
          '<stop offset="0.793901" stop-color="#A9E6C8" />',
          '<stop offset="0.992965" stop-color="#31D0E9" />',
          '</linearGradient>'
        )
      );
  }

  function _generateLinearGradientPaint0Linear21124360()
    internal
    pure
    returns (string memory)
  {
    return
      string(
        abi.encodePacked(
          '<linearGradient id="paint0_linear_2112_4360" x1="981.202" y1="199.574" x2="-77.2059" y2="717.769" gradientUnits="userSpaceOnUse">',
          '<stop offset="0.0461987" stop-color="#76ACF5" />',
          '<stop offset="0.201565" stop-color="#B8BAD4" />',
          '<stop offset="0.361787" stop-color="#FBBAB7" />',
          '<stop offset="0.488023" stop-color="#FECD8A" />',
          '<stop offset="0.64339" stop-color="#F9DF7D" />',
          '<stop offset="0.793901" stop-color="#A9E6C8" />',
          '<stop offset="0.992965" stop-color="#31D0E9" />',
          '</linearGradient>'
        )
      );
  }

  function _generateLinearGradientPaint1Linear21124360()
    internal
    pure
    returns (string memory)
  {
    return
      string(
        abi.encodePacked(
          '<linearGradient id="paint1_linear_2112_4360" x1="981.202" y1="199.574" x2="-77.2059" y2="717.769" gradientUnits="userSpaceOnUse">',
          '<stop offset="0.0461987" stop-color="#76ACF5" />',
          '<stop offset="0.201565" stop-color="#B8BAD4" />',
          '<stop offset="0.361787" stop-color="#FBBAB7" />',
          '<stop offset="0.488023" stop-color="#FECD8A" />',
          '<stop offset="0.64339" stop-color="#F9DF7D" />',
          '<stop offset="0.793901" stop-color="#A9E6C8" />',
          '<stop offset="0.992965" stop-color="#31D0E9" />',
          '</linearGradient>'
        )
      );
  }

  function _generateFilter0F21144429() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<filter id="filter0_f_2114_4429" x="163.9" y="163.9" width="672.2" height="672.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">',
          '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
          '<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>',
          '<feGaussianBlur stdDeviation="39.55" result="effect1_foregroundBlur_2114_4429"/>',
          '</filter>'
        )
      );
  }

  function _generateStyle() internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<style>',
          '@import url("https://use.typekit.net/rgd2ttk.css");',
          '@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
          '@keyframes float { 0% { opacity: 0.4; } 50% { opacity: 0.9; } 100% { opacity: 0.4; } }',
          '</style>'
        )
      );
  }

  function _generateSVGCloseTag() internal pure returns (string memory) {
    return '</svg>';
  }
}
