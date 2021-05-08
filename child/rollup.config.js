import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'iife',
    },
    plugins: [
      typescript({ module: 'esnext', target: 'es2015' }),
    ]
  }
]
