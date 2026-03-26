export const formatId = (id: string) => {
  return id.replaceAll(/(::)/g, '.');
}