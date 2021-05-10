`parent` is a module written in TypeScript.
It has two source files:

```ts
// src/index.ts
export { String } from './types'
```

```ts
// src/types.d.ts
export type String = string
```

I can build `parent` as a JavaScript module:

```
cd parent
yarn
npx tsc --project tsconfig.json --outDir out --module esnext
```

It compiles only the `.ts` file, and produces what I would expect,
a JavaScript module exporting an empty object:

```js
// out/index.js
export {};
```

But if I change the `.ts` file to export _everything_ from the `.d.ts` file,
like this:

```ts
// src/index.ts
export * from './types'
```

then I get an identical re-export statement in the output:

```js
// out/index.js
export * from './types'
```

and because the `.d.ts` file produces no `.js` output, the import from
`'./types'` is dangling.

Is this a bug?
I expect TypeScript to recognize that everything re-exported from
`'./types'` is a type declaration, and for the `export * from './types'` line
to be compiled to nothing, just as if I had manually named every export from
`'./types'`.
