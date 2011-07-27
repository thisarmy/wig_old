#!/bin/bash
cat jquery.js lang.js range.js position.js dom.js core.js editable.js event.js ierange-m2.js jquery.aloha.js log.js markup.js selection.js > combined.js
uglifyjs combined.js > combined.uglified.js
