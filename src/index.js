import { resolve } from 'path'
import fs from 'fs'
import { transform } from '@babel/core'
import * as t from '@babel/types'
import generate from '@babel/generator'
import template from '@babel/template'

const DECORATOR_NAME = 'split'

export default function({ types: t }) {
  return {
    visitor: {
      ClassDeclaration: path => {
        const body = path.node.body.body
        const container = path.container
        console.log(path.parentPath.container)
        // check @split
        const splitClassMethods = body.filter(
          node =>
            node.decorators &&
            node.decorators.filter(decorator => decorator.expression.name === DECORATOR_NAME)
              .length > 0,
        )

        // transform class methods to object methods
        if (splitClassMethods.length > 0) {
          const parentPath = path.parentPath

          let importDeclarations = []

          // if (Array.isArray(container)) {
          //   importDeclarations = container.filter(c => c.type === 'ImportDeclaration')
          // }

          const methods = t.objectProperty(
            t.identifier('splitClassMethods'),
            t.objectExpression(
              splitClassMethods.map(method => {
                body.splice(body.indexOf(method), 1)

                return t.objectProperty(
                  t.identifier(method.key.name),
                  t.functionExpression(null, method.params, method.body),
                )
                // return t.objectMethod(method.kind, method.key, method.params, method.body)
              }),
            ),
          )

          const program = t.program([t.exportDefaultDeclaration(t.objectExpression([methods]))])

          program.body.unshift(...importDeclarations)

          // write the `program` into one tmp JS file
          const dist = resolve(__dirname, '../tmp')
          const fileName = path.node.id.name // Class name

          if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist)
          }

          fs.writeFileSync(
            `${dist}/${fileName}.js`,
            transform(generate(program, {}).code, {
              plugins: ['babel-plugin-transform-react-jsx'],
            }).code,
          )

          // Add one new method named `_load`
          body.push(
            t.classMethod(
              'method',
              t.identifier('_load'),
              [],
              t.blockStatement([
                template(
                  `
                  return import('${dist}/${fileName}.js').then(({ default: binding }) => {

                    if (binding.splitClassMethods) {
                      for (let method in binding.splitClassMethods) {
                        this[method] = binding.splitClassMethods[method]
                      }
                    }
                  })
                `,
                  { plugins: ['dynamicImport'] },
                )(),
              ]),
            ),
          )
        }
      },
    },
  }
}
