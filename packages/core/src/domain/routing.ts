export interface Authority {
  id: string;
  name: string;
  level: string;
  categoryIds: string[];
}

export function routeIssueToAuthority(categoryId: string, authorities: Authority[]): Authority | null {
  // Real implementation would do Point-in-Polygon for location based issues.
  // For MVP: simply route based on category ID.
  const matched = authorities.find((a) => a.categoryIds.includes(categoryId));
  return matched || null;
}
