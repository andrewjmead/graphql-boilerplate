import { defaultFieldResolver } from "graphql"
import { SchemaDirectiveVisitor } from 'graphql-tools'

class UpperCaseDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;

        field.resolve = async (obj, args, context, info) => {
            const result = await resolve.apply(this, [obj, args, context, info])

            if (typeof result === "string") {
                return result.toUpperCase();
            }
            return result;
        }
    }
}

class IsUserDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field
        field.resolve = async function (...argsArray) {
            const result = await resolve.apply(this, argsArray)
            const [obj, args, context] = argsArray
            const { user } = context

            if (user && user._id === obj._id) {
                return result
            }

            return null
        }
    }
}

// class AuthDirective extends SchemaDirectiveVisitor {
//     visitObject(type) {
//         this.ensureFieldsWrapped(type);
//         type._requiredAuthRole = this.args.requires;
//     }
//     // Visitor methods for nested types like fields and arguments
//     // also receive a details object that provides information about
//     // the parent and grandparent types.
//     visitFieldDefinition(field, details) {
//         this.ensureFieldsWrapped(details.objectType);
//         field._requiredAuthRole = this.args.requires;
//     }

//     ensureFieldsWrapped(objectType) {
//         // Mark the GraphQLObjectType object to avoid re-wrapping:
//         if (objectType._authFieldsWrapped) return;
//         objectType._authFieldsWrapped = true;

//         const fields = objectType.getFields();

//         Object.keys(fields).forEach(fieldName => {
//             const field = fields[fieldName];
//             const { resolve = defaultFieldResolver } = field;
//             field.resolve = async function (...args) {
//                 const context = args[2];

//                 if (!context.userrr) {
//                     // throw new Error('na')
//                     // return null
//                     console.log(fieldName)
//                 }

//                 return resolve.apply(this, args);
//             };
//         });
//     }
// }


export { UpperCaseDirective, IsUserDirective }