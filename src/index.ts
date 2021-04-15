import pluginUtils from '@rollup/pluginutils'
import type { Plugin, TransformPluginContext, TransformResult } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'

const { createFilter } = pluginUtils

type SourceTransformOptions = {
  transform?: ((api: SourceTransformApi) => TransformResult) | ((api: SourceTransformApi) => Promise<TransformResult>),
  include?: FilterPattern,
  exclude?: FilterPattern,
  test?: (api: SourceTestApi) => boolean
}

type SourceTransformApi = {
  source: string,
  id: string,
  context: TransformPluginContext,
  utils: typeof pluginUtils
}

type SourceTestApi = {
  source: string,
  id: string,
  createFilter: typeof createFilter
}

const defaultOptions: SourceTransformOptions = {
  transform: ({ source}) => source,
}

export default function sourceTransform (options: SourceTransformOptions = {}): Plugin {
  const { transform, include, exclude, test: rawTest } = { ...defaultOptions, ...options },
        test = ensureTest({ include, exclude, rawTest })



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

function ensureTest ({ include, exclude, rawTest }: { include?: FilterPattern, exclude?: FilterPattern, rawTest?: (api: SourceTestApi) => boolean }) {
  return typeof rawTest === 'function'
    ? rawTest
    : ({ id, createFilter }) => createFilter(include, exclude)(id)
}
