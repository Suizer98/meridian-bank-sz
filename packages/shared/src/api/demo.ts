const DEMO_PARAMS = ['scenario', 'delay']

// Forwards ?scenario= and ?delay= from the page URL to GET requests so the
// loading, empty and error states can be shown on the deployed site.
export function withDemoParams(path: string): string {
  const pageParams = new URLSearchParams(window.location.search)
  const forwarded = new URLSearchParams()

  for (const name of DEMO_PARAMS) {
    const value = pageParams.get(name)
    if (value) forwarded.set(name, value)
  }

  const query = forwarded.toString()
  if (!query) return path
  return `${path}${path.includes('?') ? '&' : '?'}${query}`
}
