import type { Period } from "./schemas/common";
import type { Role } from "./schemas/content";

export type RoleGroup = {
  company: string | null;
  location: string | null;
  /** Spans every role in the group. */
  period: Period;
  /** Newest first, like the input. */
  roles: Role[];
};

/**
 * Folds consecutive roles at the same employer into one group, so a promotion
 * reads as one tenure. Roles with an unconfirmed employer are never merged.
 * Expects roles newest first.
 */
export function groupRolesByCompany(roles: Role[]): RoleGroup[] {
  const groups: RoleGroup[] = [];
  for (const role of roles) {
    const previous = groups.at(-1);
    if (previous && role.company && previous.company === role.company) {
      previous.roles.push(role);
      previous.period = { start: role.period.start, end: previous.period.end };
      previous.location ??= role.location;
    } else {
      groups.push({
        company: role.company,
        location: role.location,
        period: { ...role.period },
        roles: [role],
      });
    }
  }
  return groups;
}
