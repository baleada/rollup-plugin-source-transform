import pluginUtils from '@rollup/pluginutils'
import type { Plugin, TransformPluginContext, TransformResult } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'

const { createFilter } = pluginUtils

export type Options = {
  transform?: ((api: Api) => TransformResult) | ((api: Api) => Promise<TransformResult>),
  include?: FilterPattern,
  exclude?: FilterPattern,
  test?: Test
}

type Test = (api: TestApi) => boolean

type TestApi = {
  id?: string,
  source?: string,
}

export type Api = {
  source: string,
  id: string,
  context: TransformPluginContext,
  utils: typeof pluginUtils
}

const defaultOptions: Options = {
  transform: ({ source}) => source,
}

export function sourceTransform (options: Options = {}): Plugin {
  const { transform, include, exclude, test: rawTest } = { ...defaultOptions, ...options },
        test = ensureTest({ include, exclude, rawTest })



  return {
    name: 'source-transform',
    async transform (source, id) {
      if (!test({ source, id })) {
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

function ensureTest ({ include, exclude, rawTest }: { include?: FilterPattern, exclude?: FilterPattern, rawTest?: Test }): Test {
  if (typeof rawTest === 'function') {
    return rawTest
  }

  const filter = createFilter(include, exclude)
  return ({ id }) => filter(id)
}
