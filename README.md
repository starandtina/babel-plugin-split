# babel-plugin-split



## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-split
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["split"]
}
```

### Via CLI

```sh
$ babel --plugins split script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["split"]
});
```
