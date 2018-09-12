const fs = require("fs");

global.TextEncoder = class {
  encode(s) {
    return Buffer.from(s);
  }
};

eval(fs.readFileSync(`${__dirname}/dist/stylus-renderer.min.js`, "utf8"));

const source = `
fontColor = #123456
navPos = bottom
fixNav = 0
navHeight = 60px

@-moz-document domain("stackoverflow.com") {
  body {
    color: fontColor;
    background: #eee;
    --test: abs(-2);
  }
  if navPos == "bottom" {
    body > .container {
      padding-top: 0 !important;
    }
    body > footer {
      padding-bottom: 60px !important;
    }
    body > header {
      top: auto !important;
      bottom: 0 !important;
    }
  }
  if not fixNav {
    body {
      position: relative !important;
    }
    body > header {
      position: absolute !important;
    }
  }
  body > header {
    height: navHeight !important;
  }
}
`;

console.log(new StylusRenderer(source).render());
