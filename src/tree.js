// Virtual file system builder for content navigation
export function buildVirtualFS(contentEntries) {
  const virtualFS = {};

  contentEntries.forEach(({ file, module }) => {
    const pathParts = file.replace('/src/content/', '').replace('.md', '').split('/');
    let current = virtualFS;

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // This is a file
        current[part] = {
          __file: true,
          __path: file,
          __module: module,
        };
      } else {
        // This is a directory
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return virtualFS;
}