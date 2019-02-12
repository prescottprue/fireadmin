import fm from 'front-matter'
let modules

export default function loadFiles() {
  if (modules) {
    return modules
  }
  function requireAll(requireContext) {
    return requireContext.keys().map(requireContext)
  }

  const modulesList = requireAll(require.context('docs', true, /^\.\/.*\.md$/))

  modules = modulesList.map(moduleString => fm(moduleString))

  return modules
}
