export const mockDashboardData = {
  github: [
    '3 open PRs',
    '2 code reviews pending',
    'Last commit: 2h ago',
  ],
  jira: [
    '5 active tickets',
    '1 blocker (AUTH-234)',
    '2 in review',
  ],
};

const mockResponses = {
  standup: `Here's your standup brief:

**Yesterday:** You merged PR #456 for the auth feature and completed JIRA-123. 

**Today:** You're working on the API integration (PR #457) and reviewing Sarah's database PR.

**Blockers:** AUTH-234 is blocked waiting for backend team's token refresh endpoint.`,

  design: `Design sync prep:

The new dashboard mockups are in Figma. Key updates:
- Collapsible sidebar approved
- Dark theme is primary
- Sarah suggested mobile-first approach

Action items from last sync: You completed the component library audit.`,

  default: `I can help you prep for meetings. Try asking:
- "Prep me for standup"
- "What's new since yesterday?"
- "What's blocking the auth feature?"
- "Show me my open PRs"`,
};

export function getMockResponse(query) {
  const q = query.toLowerCase();
  
  if (q.includes('standup') || q.includes('stand up')) {
    return mockResponses.standup;
  }
  
  if (q.includes('design') || q.includes('sync')) {
    return mockResponses.design;
  }
  
  if (q.includes('blocker') || q.includes('blocking')) {
    return 'AUTH-234 is blocked. The backend team needs to deploy the token refresh endpoint before you can proceed with the auth feature.';
  }
  
  if (q.includes('pr') || q.includes('pull request')) {
    return 'You have 3 open PRs:\n1. #457 - API Integration (in progress)\n2. #456 - Auth feature (merged)\n3. #455 - UI updates (needs review)';
  }
  
  return mockResponses.default;
}

