`parent` is a module, written in TypeScript, of mostly type declarations.
The `types` field in its `package.json` points to its source TypeScript
entrypoint and the `main` field points to its compiled JavaScript entrypoint.
It has a `tsconfig.json` used by its `build` script.

`child` is a module, written in TypeScript, that depends on `parent`. It has
a `tsconfig.json` and wants to build a bundle with Rollup.

After setting up:

```
cd child
yarn
```

This works:

```
npx tsc --project tsconfig.json --outDir out --module esnext
```

It produces the expected output at `out/index.js`:

```js
import parent from 'parent';
console.log(parent);
```

(This is exactly the same as the source TypeScript, but that's
just a coincidence.)

This doesn't work:

```
npx rollup --config
```

The error is this:

```
src/index.ts → dist/index.js...
[!] Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
node_modules/parent/src/internal/index.ts (1:12)
1: import type Parent from './Parent'
               ^
2: declare const parent: Parent
3: export default parent
Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
    at error (node_modules/rollup/dist/shared/rollup.js:5309:30)
    at Module.error (node_modules/rollup/dist/shared/rollup.js:9765:16)
    at Module.tryParse (node_modules/rollup/dist/shared/rollup.js:10169:25)
    at Module.setSource (node_modules/rollup/dist/shared/rollup.js:10068:24)
    at ModuleLoader.addModuleSource (node_modules/rollup/dist/shared/rollup.js:18451:20)
    at async ModuleLoader.fetchModule (node_modules/rollup/dist/shared/rollup.js:18507:9)
    at async Promise.all (index 0)
    at async ModuleLoader.fetchStaticDependencies (node_modules/rollup/dist/shared/rollup.js:18533:34)
    at async Promise.all (index 0)
    at async ModuleLoader.fetchModule (node_modules/rollup/dist/shared/rollup.js:18509:9)
```

I'm suspecting that Rollup successfully compiles the `child` module to an
ESNext module that includes the line `import parent from 'parent'`, and
instead of resolving that module specifier to the _JavaScript_ in the parent
module, it resolves it to the TypeScript, which includes a line that is not
valid JavaScript (`import type Parent from './Parent'`).
How can I fix this?
