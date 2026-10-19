installHook.js:1 ERROR RuntimeError: NG0919: Cannot read @NgModule metadata. This can indicate a runtime circular dependency in your app that needs to be resolved. Find more at https://v22.angular.dev/errors/NG0919
    at assertTypeDefined (def_getters.ts:68:11)
    at getNgModuleDef (def_getters.ts:17:3)
    at new NgModuleRef2 (ng_module_ref.ts:55:25)
    at NgModuleFactory2.create (ng_module_ref.ts:107:12)
    at loadChildren (_router-chunk.mjs:3499:32)
    at async _router-chunk.mjs:3454:24
    at async Recognizer.getChildConfig (_router-chunk.mjs:3174:21)
    at async Recognizer.matchSegmentAgainstRoute (_router-chunk.mjs:3125:9)
    at async Recognizer.processSegment (_router-chunk.mjs:3061:16)
    at async Recognizer.processChildren (_router-chunk.mjs:3049:27)
