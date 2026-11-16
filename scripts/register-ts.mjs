// Test-only loader: lets Node's built-in test runner import the storefront's
// TypeScript files, which use extensionless relative imports ("./whatsapp").
import { register } from "node:module"

register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        try {
          return await next(specifier, context)
        } catch (error) {
          if (specifier.startsWith(".") && !/\\.[cm]?[jt]sx?$/.test(specifier)) {
            return next(specifier + ".ts", context)
          }
          throw error
        }
      }
    `),
  import.meta.url
)
