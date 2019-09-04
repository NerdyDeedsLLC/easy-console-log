# console-log-debugger README

Easy way to add console log for debugging, works for any language, just modify the settings

## Settings

Open settings.json and add these:

```
    "consoleLog.config" : {
        "javascript": "console.log('{count}: Line {line} {current}",
        "php": "echo \"{count}: Line {line} {current}\\r\\n\";"
        "plaintext": "[DEBUG] {count}: Line {line}, {current}",
    } 
```
![](https://i.imgur.com/XLOrFqk.gif)