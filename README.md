# Ticket Assignment system

## Dashboard page

- Contains number of Active calls, Active chats and closed Tasks
- Ticket Queue with tabs calls and text
- Agent workload with progress bar and available capacity of each agents
- Active Agents to show agents currently assigned a task
- Has a rest button which allows the user to reset the whole system
- Has a Assign Ticket button which allows the user to create a new ticket in the system

## Agents page

- Shows all agents available in the system
- Allows the user to add an agent, edit language skills
- Shows the current tasks assigned to the agent on click of the down arrow
- Allows the user to close a task from the agent

## Languages supported

- English
- German
- Spanish
- French
- Italian
- Portuguese
- Dutch

## Workload types supported

- Chat
- Call

## Assumptions

- Active calls - is based on the platform type `call`
- Active chats - is based on the platform type `chat`
- Active agents - agents with assigned tasks
- Agent capacity - 1 call and 2 chats or 4 chats at a time.

## Tech use for frontend

- Typescript
- Next.js
- Shadcn

## End to end testing

- Added some happy path testing
- Could use data-testid to improve the consistency of tests

## Potential issues in backend

- Reset system still keeps agents in validation so after resetting cannot use the same agent name
- Calling assign ticket and then creating an agent doesn't assign the ticket to agent.
- Since the assignment is automated by backend and only for testing the API to assign manually is exposed, the section "Nice to Have" in requirement which says to use dynamic reassignment only from frontend doesn't seem possible.
- If no restriction is selected when assigning ticket then it is only queued and not assigned
