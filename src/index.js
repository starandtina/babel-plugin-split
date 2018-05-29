export default function({ types: t }) {
  return {
    visitor: {
      'ClassDeclaration|ClassExpression': path => {
        console.log(path.node.body.body)
      },
    },
  }
}
