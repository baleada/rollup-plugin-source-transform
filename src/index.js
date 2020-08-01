import pluginUtils from '@rollup/pluginutils'

const { createFilter } = pluginUtils

export default function sourceTransform (options = {}) {
  const { transform, include, exclude, test: rawTest } = options,
        test = resolveTest(include, exclude, rawTest)

  return {
    name: 'source-transform',
    async transform (source, id) {
      if (!test({ source, id, createFilter })) {
        return null
      }

      return await transform({
        source,
        id,
        context: this,
        utils: pluginUtils
      })
    }
  }
}

function resolveTest (include, exclude, test) {
  return typeof test === 'function'
    ? test
    : ({ id, createFilter }) => createFilter(include, exclude)(id)
}
