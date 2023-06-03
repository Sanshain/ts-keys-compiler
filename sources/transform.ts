import ts from 'typescript';
import path from 'path';
import fs from "fs";

type Options = {
   methodName?: 'keys' | 'getOwnPropertyNames',
   verbose?: boolean,
}

const methodOwner = 'ObjectConstructor';
let methodName = 'getOwnPropertyNames'
let globalOptions: Options = {}

const createArrayExpression = ts.factory ? ts.factory.createArrayLiteralExpression : ts.createArrayLiteral;
const createStringLiteral = ts.factory ? ts.factory.createStringLiteral : ts.createLiteral;

export default function keysTransform(program: ts.Program, options: Options = {verbose: true}): ts.TransformerFactory<ts.SourceFile> {
   globalOptions = options;
   methodName = options.methodName || methodName
   return (context: ts.TransformationContext) => {
      return (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
   }
}

function visitNodeAndChildren(node: ts.SourceFile, program: ts.Program, context: ts.TransformationContext): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined {
   if ('fileName' in node) {
      // skip undue files
      if (!~node.getText().indexOf(`Object.${methodName}<`)) return node;
   }
   return ts.visitEachChild(visitNode(node, program), childNode => visitNodeAndChildren(childNode, program, context), context);
}

function visitNode(node: ts.SourceFile, program: ts.Program): ts.SourceFile;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined {
   const typeChecker = program.getTypeChecker();
   if (isKeysImportExpression(node)) {
      return;
   }
   if (!isKeysCallExpression(node, typeChecker)) {
      return node;
   }
   if (!node.typeArguments) {
      // return createArrayExpression([]);
      return node;
   }
   const typeArg = node.typeArguments[0]
   const type = typeChecker.getTypeFromTypeNode(typeArg);

   const properties = typeChecker.getPropertiesOfType(type);
   const everyPropIsRequired = properties.every(prop => prop.declarations?.every(d => !(d as ts.PropertyDeclaration).questionToken));
   if (!everyPropIsRequired || type.isUnion() || (type as any).intrinsicName == 'any') {
      // todo or => type.types.length > 1
      return node;
   }
   if (globalOptions.verbose && properties.length > 10) {
      console.warn(`The type <${typeArg.getFullText()}> contains more then 10 fields that will be transformed into a large inline structure, ` +
         `which can lead to a significant bloat of the bundle.`)
   }
   // let file = node.getSourceFile()
   // file.update('let t = 11;' + file.text, { newLength: 11, span: { start: 0, length: 0 } })
   return createArrayExpression(properties.map(property => createStringLiteral(property.name)));
   // ts.factory.createFunctionExpression()
}

const indexJs = path.join(__dirname, 'index.js');
function isKeysImportExpression(node: ts.Node): node is ts.ImportDeclaration {
   if (!ts.isImportDeclaration(node)) {
      return false;
   }
   const module = (node.moduleSpecifier as ts.StringLiteral).text;
   try {
      return indexJs === (
         module.startsWith('.')
            ? require.resolve(path.resolve(path.dirname(node.getSourceFile().fileName), module))
            : require.resolve(module)
      );
   } catch (e) {
      return false;
   }
}

const indexTs = path.join(__dirname, 'index.d.ts');
function isKeysCallExpression(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression {
   if (!ts.isCallExpression(node)) {
      return false;
   }
   const declaration = typeChecker.getResolvedSignature(node)?.declaration;
   // if (!declaration || ts.isJSDocSignature(declaration) || declaration.name?.getText() !== 'keys') {
   //   return false;
   // }
   if (!declaration || ts.isJSDocSignature(declaration)
      || (declaration.parent as ts.ConstructSignatureDeclaration)?.name?.getText() !== methodOwner || declaration.name?.getText() !== methodName) {

      return false;
   }
   return true
   // try {
   //   // require.resolve is required to resolve symlink.
   //   // https://github.com/kimamula/ts-transformer-keys/issues/4#issuecomment-643734716
   //   return require.resolve(declaration.getSourceFile().fileName) === indexTs;
   // } catch {
   //   // declaration.getSourceFile().fileName may not be in Node.js require stack and require.resolve may result in an error.
   //   // https://github.com/kimamula/ts-transformer-keys/issues/47
   //   return false;
   // }
}
