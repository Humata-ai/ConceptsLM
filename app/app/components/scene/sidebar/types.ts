export type SidebarView = 'scene' | 'import-export' | 'timeline' | 'library'

export type LibrarySection = 'dictionary' | 'quality-domains' | 'quality-dimensions'

export const VALID_TABS: SidebarView[] = ['scene', 'import-export', 'timeline', 'library']

export const VALID_LIBRARY_SECTIONS: LibrarySection[] = ['dictionary', 'quality-domains', 'quality-dimensions']

export const LIBRARY_SECTION_LABELS: Record<LibrarySection, string> = {
  'dictionary': 'Dictionary',
  'quality-domains': 'Quality Domains',
  'quality-dimensions': 'Quality Dimensions',
}

export function getTabFromPathname(pathname: string): SidebarView | null {
  const segment = pathname.replace(/^\//, '').split('/')[0]
  if (VALID_TABS.includes(segment as SidebarView)) {
    return segment as SidebarView
  }
  return null
}

export function getLibrarySectionFromPathname(pathname: string): LibrarySection | null {
  const segments = pathname.replace(/^\//, '').split('/')
  if (segments[0] === 'library' && segments.length > 1) {
    const section = segments[1]
    if (VALID_LIBRARY_SECTIONS.includes(section as LibrarySection)) {
      return section as LibrarySection
    }
  }
  return null
}
