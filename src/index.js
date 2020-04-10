import pluginUtils from '@rollup/pluginutils'

export default function sourceTransform (options = {}) {
  const { transform, include, exclude } = options,
        { createFilter } = pluginUtils,
        filter = createFilter(include, exclude)

  return {
    name: 'source-transform',
    transform: (source, id) => {
      if (!filter(id)) {
        return null
      }

      return transform({
        source,
        id,
        context: this,
        utils: pluginUtils
      })
    }
  }
}
