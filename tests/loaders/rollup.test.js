import fs from 'fs'
import { rollup } from 'rollup'
import test from 'ava';
import loader from '../../src/index.js'

console.log(loader)


const inputOptions = {
        input: 'tests/stubs/baleada.js',
        plugins: [
          loader({
            transform: ({ source, id }) => source.replace(/Baleada/, `${id} - Baleada`)
          })
        ]
      },
      outputOptions = {
        file: 'tests/loader-output/rollup.js',
        format: 'cjs',
      },
      withFilePathRegexp = new RegExp('tests/stubs/baleada.js - Baleada: a toolkit for building web apps')

test('uses the transform callback', async t => {
  // Remove any previous loader output
  await fs.unlink('tests/loader-output/rollup.js', err => {
    if (err) {
      if (!/no such file/.test(err.message)) throw err
    }
  })

  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)

  const value = fs.readFileSync('./tests/loader-output/rollup.js', 'utf8')

  t.assert(withFilePathRegexp.test(value))
})
