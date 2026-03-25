export type SidebarView = 'scene' | 'import-export' | 'timeline' | 'library'

export const VALID_TABS: SidebarView[] = ['scene', 'import-export', 'timeline', 'library']

export function getTabFromPathname(pathname: string): SidebarView | null {
  const segment = pathname.replace(/^\//, '')
  if (VALID_TABS.includes(segment as SidebarView)) {
    return segment as SidebarView
  }
  return null
}
