export function formatErrors(errors) {
  return errors
    .map((error) => `Error in ${error.name} file, ${error.message}`)
    .join('\n');
}
