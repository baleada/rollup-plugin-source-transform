import { rollup } from 'rollup'
import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { sourceTransform } from '../../src/index'
import { readFileSync, unlinkSync } from 'fs'

const suite = createSuite('source transform (node)')

const inputOptions = {
        input: 'tests/stubs/baleada.js',
        plugins: [
          sourceTransform({
            transform: ({ source, id }) => source.replace(/Baleada/, `${id} - Baleada`)
          })
        ]
      },
      outputOptions = {
        file: 'tests/fixtures/output.js',
        format: 'cjs' as const,
      },
      withFilePathRegexp = new RegExp('tests/stubs/baleada.js - Baleada: a toolkit for building web apps')

suite(`transforms the source`, async () => {
  // Remove any previous output
  try {
    unlinkSync('tests/fixtures/output.js')
  } catch (error) {
    if (!/no such file/.test(error.message)) {
      throw error
    }
  }

  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)

  const value = readFileSync('./tests/fixtures/output.js', 'utf8')

  assert.ok(withFilePathRegexp.test(value))
})

suite.run()
