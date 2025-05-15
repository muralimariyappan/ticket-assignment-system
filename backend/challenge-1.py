from typing import List, Optional, Dict, Any, Set
from enum import Enum
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import queue
import uuid
import time

class TaskType(Enum):
    VOICE = "voice"
    TEXT = "text"

class TaskPlatform:
    CALL = "call"
    EMAIL = "email"
    FACEBOOK_CHAT = "facebook_chat"
    WEBSITE_CHAT = "website_chat"
    
    @staticmethod
    def is_voice(platform: str) -> bool:
        return platform == TaskPlatform.CALL

class Task:
    def __init__(self, platform: str):
        self.id = str(uuid.uuid4())  # Generate unique ID for each task
        self.platform = platform
        self.is_voice = TaskPlatform.is_voice(platform)

class Ticket:
    def __init__(self, id: Optional[str] = None, restrictions: List[str] = None, platform: str = None):
        # Generate UUID if not provided
        self.id = id if id else str(uuid.uuid4())
        self.restrictions = restrictions or []
        self.platform = platform
        self.is_voice = TaskPlatform.is_voice(platform) if platform else False
        self.created_at = time.time()

class Agent:
    def __init__(self, name: str, language_skills: List[str], id: Optional[str] = None):
        self.id = id if id else str(uuid.uuid4())
        self.name = name
        self.language_skills = language_skills
        self.assigned_tasks: List[Task] = []  # Start with no tasks
    
    def has_voice_call(self) -> bool:
        return any(task.is_voice for task in self.assigned_tasks)
    
    def can_handle_language(self, language: str) -> bool:
        return language in self.language_skills
    
    def can_accept_task(self, ticket: Ticket) -> bool:
        # Check language compatibility
        if not any(self.can_handle_language(lang) for lang in ticket.restrictions):
            return False
            
        # Check capacity constraints
        if ticket.is_voice:
            # Cannot handle two voice calls
            if self.has_voice_call():
                return False
            # Max 3 tasks if one is a voice call
            return len(self.assigned_tasks) < 3
        else:
            # Text-based task
            if self.has_voice_call():
                # Max 3 tasks if one is a voice call
                return len(self.assigned_tasks) < 3
            else:
                # Max 4 text-based tasks
                return len(self.assigned_tasks) < 4
    
    def get_task_platforms(self) -> List[str]:
        """Get list of task platforms for API responses"""
        return [task.platform for task in self.assigned_tasks]

class TicketAssignment:
    def __init__(self, agent: Agent, ticket: Ticket, task: Task):
        self.agent = agent
        self.ticket = ticket
        self.task = task

class TicketQueue:
    def __init__(self):
        self.voice_queue = queue.PriorityQueue()  # Higher priority
        self.text_queue = queue.PriorityQueue()
        self.counter = 0  # Counter to ensure FIFO ordering for same priority
        self.queued_ticket_ids = set()  # Track IDs of tickets in the queue
    
    def add_ticket(self, ticket: Ticket, priority: int = 0):
        # Check if ticket is already in queue
        if ticket.id in self.queued_ticket_ids:
            return False
            
        # Use counter to break ties (FIFO ordering)
        self.counter += 1
        if ticket.is_voice:
            self.voice_queue.put((priority, self.counter, ticket))
        else:
            self.text_queue.put((priority, self.counter, ticket))
            
        # Mark ticket as queued
        self.queued_ticket_ids.add(ticket.id)
        return True
    
    def get_next_ticket(self) -> Optional[Ticket]:
        # Try voice queue first (higher priority)
        if not self.voice_queue.empty():
            priority, counter, ticket = self.voice_queue.get()
            # Remove from queued set
            self.queued_ticket_ids.remove(ticket.id)
            return ticket
        # Then try text queue
        if not self.text_queue.empty():
            priority, counter, ticket = self.text_queue.get()
            # Remove from queued set
            self.queued_ticket_ids.remove(ticket.id)
            return ticket
        return None
    
    def is_ticket_queued(self, ticket_id: str) -> bool:
        """Check if a ticket is already in the queue"""
        return ticket_id in self.queued_ticket_ids

class TicketAssignmentService:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}  # Map agent IDs to Agent objects
        self.agent_names: Dict[str, str] = {}  # Map agent names to agent IDs
        self.ticket_queue = TicketQueue()
        self.completed_tasks: Set[str] = set()  # Track completed task IDs
        self.assigned_ticket_ids: Set[str] = set()  # Track assigned ticket IDs
        self.ticket_to_task_map: Dict[str, List[str]] = {}  # Map ticket IDs to task IDs
    
    def register_agent(self, agent: Agent) -> bool:
        """Register an agent if not already exists"""
        # Check if agent name is already taken
        if agent.name in self.agent_names:
            return False
        
        # Add agent to maps
        self.agents[agent.id] = agent
        self.agent_names[agent.name] = agent.id
        return True
    
    def get_agent_by_name(self, name: str) -> Optional[Agent]:
        """Get agent by name"""
        if name not in self.agent_names:
            return None
        return self.agents[self.agent_names[name]]
    
    def get_agent_by_id(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    def is_ticket_assigned_or_queued(self, ticket_id: str) -> bool:
        """Check if a ticket is already assigned or queued"""
        return (ticket_id in self.assigned_ticket_ids or 
                self.ticket_queue.is_ticket_queued(ticket_id))
    
    def assign_ticket(self, ticket: Ticket) -> Optional[TicketAssignment]:
        # Check if ticket is already assigned or queued
        if self.is_ticket_assigned_or_queued(ticket.id):
            return None
            
        # First, try to find a suitable agent
        best_agent = None
        min_tasks = float('inf')
        
        for agent in self.agents.values():
            if agent.can_accept_task(ticket):
                # Prefer agent with fewer tasks
                if len(agent.assigned_tasks) < min_tasks:
                    min_tasks = len(agent.assigned_tasks)
                    best_agent = agent
        
        if best_agent:
            # Create a new task for this ticket
            task = Task(ticket.platform)
            # Assign the ticket
            best_agent.assigned_tasks.append(task)
            # Mark ticket as assigned
            self.assigned_ticket_ids.add(ticket.id)
            # Track which tasks belong to which ticket
            if ticket.id not in self.ticket_to_task_map:
                self.ticket_to_task_map[ticket.id] = []
            self.ticket_to_task_map[ticket.id].append(task.id)
            return TicketAssignment(best_agent, ticket, task)
        else:
            # Queue the ticket for later assignment
            success = self.ticket_queue.add_ticket(ticket)
            if not success:
                # Ticket is already in queue
                return None
            return None
    
    def process_queued_tickets(self):
        """Try to assign queued tickets when agents become available"""
        ticket = self.ticket_queue.get_next_ticket()
        while ticket:
            # Since we're taking the ticket from the queue, we need to either
            # assign it or put it back
            assignment = None
            
            # Find a suitable agent
            best_agent = None
            min_tasks = float('inf')
            
            for agent in self.agents.values():
                if agent.can_accept_task(ticket):
                    if len(agent.assigned_tasks) < min_tasks:
                        min_tasks = len(agent.assigned_tasks)
                        best_agent = agent
            
            if best_agent:
                # Create a new task for this ticket
                task = Task(ticket.platform)
                # Assign the ticket
                best_agent.assigned_tasks.append(task)
                # Mark ticket as assigned
                self.assigned_ticket_ids.add(ticket.id)
                assignment = TicketAssignment(best_agent, ticket, task)
            
            if not assignment:
                # If we couldn't assign this ticket, put it back and stop
                self.ticket_queue.add_ticket(ticket)
                break
                
            # Try the next ticket
            ticket = self.ticket_queue.get_next_ticket()
    
    def mark_task_complete(self, agent_id: str, task_id: str) -> bool:
        """Mark a task as complete and remove it from agent's assigned tasks"""
        # Check if task already completed
        if task_id in self.completed_tasks:
            return False
            
        if agent_id not in self.agents:
            return False
            
        agent = self.agents[agent_id]
        task_found = False
        
        for i, task in enumerate(agent.assigned_tasks):
            if task.id == task_id:
                # Remove the task
                agent.assigned_tasks.pop(i)
                # Mark as completed
                self.completed_tasks.add(task_id)
                task_found = True
                break
                
        if not task_found:
            return False
        
        # Clean up ticket_to_task_map and assigned_ticket_ids
        ticket_to_remove = None
        for ticket_id, task_ids in self.ticket_to_task_map.items():
            if task_id in task_ids:
                task_ids.remove(task_id)
                # If this was the last task for this ticket, we can remove the ticket ID
                if not task_ids:
                    ticket_to_remove = ticket_id
                break
        
        # Remove the ticket ID if all its tasks are completed
        if ticket_to_remove:
            self.assigned_ticket_ids.remove(ticket_to_remove)
            del self.ticket_to_task_map[ticket_to_remove]
        
        # Try to assign queued tickets
        self.process_queued_tickets()
        return True

# FastAPI implementation
app = FastAPI(title="Ticket Assignment Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketRequest(BaseModel):
    id: str
    restrictions: List[str]
    platform: str

class AgentRequest(BaseModel):
    name: str
    language_skills: List[str] = []  # No assigned_tasks parameter

class TaskResponse(BaseModel):
    id: str
    platform: str

class AgentResponse(BaseModel):
    id: str
    name: str
    language_skills: List[str]
    assigned_tasks: List[TaskResponse]

class AssignmentResponse(BaseModel):
    ticket_id: str
    agent_id: Optional[str] = None
    agent_name: Optional[str] = None
    task_id: Optional[str] = None
    queued: bool

# Add these new models for the queue endpoint
class QueuedTicketResponse(BaseModel):
    priority: int
    position: int
    ticket_id: str
    platform: str
    restrictions: List[str]
    is_voice: bool
    created_at: float

class QueueStatusResponse(BaseModel):
    voice_queue: List[QueuedTicketResponse]
    text_queue: List[QueuedTicketResponse]
    total_queued: int  # Changed from List to int

class AgentUpdateRequest(BaseModel):
    language_skills: Optional[List[str]] = None
    add_skills: Optional[List[str]] = None
    remove_skills: Optional[List[str]] = None

service = TicketAssignmentService()

@app.post("/agents", status_code=status.HTTP_201_CREATED, response_model=AgentResponse)
def register_agent(agent_request: AgentRequest):
    agent = Agent(
        name=agent_request.name,
        language_skills=agent_request.language_skills
    )
    
    if not service.register_agent(agent):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Agent with name '{agent.name}' already exists"
        )
    
    # Convert to response format
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[]  # No tasks initially
    )

@app.get("/agents/{agent_identifier}", response_model=AgentResponse)
def get_agent(agent_identifier: str, by_name: bool = False):
    """Get agent by ID or name"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

@app.post("/tickets/assign", response_model=AssignmentResponse)
def assign_ticket(ticket_request: TicketRequest):
    # If ID is not provided or empty, generate a UUID
    ticket_id = ticket_request.id if ticket_request.id else str(uuid.uuid4())
    
    ticket = Ticket(
        id=ticket_id,
        restrictions=ticket_request.restrictions,
        platform=ticket_request.platform
    )
    
    # Check if ticket ID is already assigned
    if ticket.id in service.assigned_ticket_ids:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ticket with ID '{ticket.id}' is already assigned"
        )
    
    # Check if ticket is already in queue
    if service.ticket_queue.is_ticket_queued(ticket.id):
        # Try to find an agent for this ticket now
        # First, remove it from the queue
        # Note: This is a simplified approach - in a real system, you'd want to
        # remove the specific ticket from the queue rather than checking all tickets
        
        # Create a temporary queue to hold other tickets
        temp_voice_queue = queue.PriorityQueue()
        temp_text_queue = queue.PriorityQueue()
        found_ticket = False
        
        # Process voice queue
        while not service.ticket_queue.voice_queue.empty():
            priority, counter, queued_ticket = service.ticket_queue.voice_queue.get()
            if queued_ticket.id == ticket.id:
                found_ticket = True
                # Remove from queued set
                service.ticket_queue.queued_ticket_ids.remove(ticket.id)
            else:
                temp_voice_queue.put((priority, counter, queued_ticket))
        
        # Restore voice queue without the target ticket
        service.ticket_queue.voice_queue = temp_voice_queue
        
        # If not found in voice queue, check text queue
        if not found_ticket:
            while not service.ticket_queue.text_queue.empty():
                priority, counter, queued_ticket = service.ticket_queue.text_queue.get()
                if queued_ticket.id == ticket.id:
                    found_ticket = True
                    # Remove from queued set
                    service.ticket_queue.queued_ticket_ids.remove(ticket.id)
                else:
                    temp_text_queue.put((priority, counter, queued_ticket))
            
            # Restore text queue without the target ticket
            service.ticket_queue.text_queue = temp_text_queue
        
        # Now try to assign the ticket
        if found_ticket:
            # Try to find a suitable agent
            best_agent = None
            min_tasks = float('inf')
            
            for agent in service.agents.values():
                if agent.can_accept_task(ticket):
                    if len(agent.assigned_tasks) < min_tasks:
                        min_tasks = len(agent.assigned_tasks)
                        best_agent = agent
            
            if best_agent:
                # Create a new task for this ticket
                task = Task(ticket.platform)
                # Assign the ticket
                best_agent.assigned_tasks.append(task)
                # Mark ticket as assigned
                service.assigned_ticket_ids.add(ticket.id)
                
                return AssignmentResponse(
                    ticket_id=ticket.id,
                    agent_id=best_agent.id,
                    agent_name=best_agent.name,
                    task_id=task.id,
                    queued=False
                )
            else:
                # Put it back in the queue
                service.ticket_queue.add_ticket(ticket)
                
                return AssignmentResponse(
                    ticket_id=ticket.id,
                    queued=True
                )
    
    # If not already assigned or queued, try to assign it
    assignment = service.assign_ticket(ticket)
    
    if assignment:
        return AssignmentResponse(
            ticket_id=ticket.id,
            agent_id=assignment.agent.id,
            agent_name=assignment.agent.name,
            task_id=assignment.task.id,
            queued=False
        )
    else:
        return AssignmentResponse(
            ticket_id=ticket.id,
            queued=True
        )

@app.post("/tasks/complete", status_code=status.HTTP_200_OK)
def complete_task(agent_identifier: str, task_id: str, by_name: bool = False):
    """Mark a task as complete"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
        agent_id = agent.id
    else:
        agent_id = agent_identifier
        if agent_id not in service.agents:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_id}' not found"
            )
    
    if not service.mark_task_complete(agent_id, task_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task not found or already completed"
        )
    return {"message": "Task marked as complete"}

@app.get("/agents", response_model=List[AgentResponse])
def list_agents():
    return [
        AgentResponse(
            id=agent.id,
            name=agent.name,
            language_skills=agent.language_skills,
            assigned_tasks=[
                TaskResponse(id=task.id, platform=task.platform)
                for task in agent.assigned_tasks
            ]
        )
        for agent in service.agents.values()
    ]

@app.get("/queue", response_model=QueueStatusResponse)
def get_queue_status():
    """Get the current status of the ticket queues"""
    # Helper function to extract tickets from a priority queue
    def extract_queue_items(priority_queue):
        # Create a copy of the queue to avoid modifying the original
        queue_copy = queue.PriorityQueue()
        items = []
        
        # Extract all items
        while not priority_queue.empty():
            priority, counter, ticket = priority_queue.get()
            items.append(QueuedTicketResponse(
                priority=priority,
                position=counter,
                ticket_id=ticket.id,
                platform=ticket.platform,
                restrictions=ticket.restrictions,
                is_voice=ticket.is_voice,
                created_at=ticket.created_at
            ))
            queue_copy.put((priority, counter, ticket))
        
        # Restore the original queue
        while not queue_copy.empty():
            priority_queue.put(queue_copy.get())
            
        return items
    
    # Get items from both queues
    voice_items = extract_queue_items(service.ticket_queue.voice_queue)
    text_items = extract_queue_items(service.ticket_queue.text_queue)
    
    return QueueStatusResponse(
        voice_queue=voice_items,
        text_queue=text_items,
        total_queued=len(voice_items) + len(text_items)
    )

# Add a debug endpoint to see the current state
@app.get("/debug")
def get_debug_info():
    """Get internal state for debugging"""
    return {
        "assigned_ticket_ids": list(service.assigned_ticket_ids),
        "completed_tasks": list(service.completed_tasks),
        "ticket_to_task_map": service.ticket_to_task_map,
        "queued_ticket_ids": list(service.ticket_queue.queued_ticket_ids),
        "agents": {
            id: {
                "language_skills": agent.language_skills,
                "assigned_tasks": [
                    {"id": task.id, "platform": task.platform}
                    for task in agent.assigned_tasks
                ]
            }
            for id, agent in service.agents.items()
        }
    }

# Add a reset endpoint for testing
@app.post("/reset")
def reset_service():
    """Reset the service state (for testing)"""
    service.agents = {}
    service.ticket_queue = TicketQueue()
    service.completed_tasks = set()
    service.assigned_ticket_ids = set()
    service.ticket_to_task_map = {}
    return {"message": "Service state reset successfully"}

@app.patch("/agents/{agent_identifier}", response_model=AgentResponse)
def update_agent(agent_identifier: str, update_request: AgentUpdateRequest, by_name: bool = False):
    """Update an existing agent's properties"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    # Replace entire language_skills list if provided
    if update_request.language_skills is not None:
        agent.language_skills = update_request.language_skills
    
    # Add individual skills
    if update_request.add_skills:
        for skill in update_request.add_skills:
            if skill not in agent.language_skills:
                agent.language_skills.append(skill)
    
    # Remove individual skills
    if update_request.remove_skills:
        agent.language_skills = [
            skill for skill in agent.language_skills 
            if skill not in update_request.remove_skills
        ]
    
    # Return updated agent
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

# For the example case, we'll need to manually assign tasks
def solve_example_case():
    # Create agents without pre-assigned tasks
    agent_a = Agent(name="A", language_skills=["German", "English"])
    agent_b = Agent(name="B", language_skills=["English", "French"])
    agent_c = Agent(name="C", language_skills=["English", "French"])
    
    service = TicketAssignmentService()
    service.register_agent(agent_a)
    service.register_agent(agent_b)
    service.register_agent(agent_c)
    
    # Manually assign the initial tasks to match the example
    for _ in range(3):  # 3 tasks for agent A
        if _ < 2:
            task = Task("facebook_chat")
        else:
            task = Task("email")
        agent_a.assigned_tasks.append(task)
    
    for _ in range(3):  # 3 tasks for agent B
        if _ == 0:
            task = Task("website_chat")
        elif _ == 1:
            task = Task("facebook_chat")
        else:
            task = Task("call")
        agent_b.assigned_tasks.append(task)
    
    for _ in range(2):  # 2 tasks for agent C
        if _ == 0:
            task = Task("website_chat")
        else:
            task = Task("facebook_chat")
        agent_c.assigned_tasks.append(task)
    
    # Now create and assign the ticket from the example
    ticket_id = str(uuid.uuid4())
    print(f"Example case ticket ID: {ticket_id}")
    
    ticket = Ticket(id=ticket_id, restrictions=["English"], platform="facebook_chat")
    assignment = service.assign_ticket(ticket)
    
    if assignment:
        return f"Ticket assigned to Agent {assignment.agent.name}"
    else:
        return "Ticket queued for later assignment"

# Add a helper endpoint for testing to manually assign tasks to agents
@app.post("/agents/{agent_identifier}/tasks", response_model=AgentResponse)
def assign_manual_task(
    agent_identifier: str, 
    platform: str, 
    by_name: bool = False
):
    """Manually assign a task to an agent (for testing)"""
    if by_name:
        agent = service.get_agent_by_name(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with name '{agent_identifier}' not found"
            )
    else:
        agent = service.get_agent_by_id(agent_identifier)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Agent with ID '{agent_identifier}' not found"
            )
    
    # Check if agent can accept another task
    if platform == "call" and agent.has_voice_call():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent cannot handle two voice calls simultaneously"
        )
    
    if agent.has_voice_call() and len(agent.assigned_tasks) >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent already has maximum tasks with a voice call"
        )
    
    if not agent.has_voice_call() and platform != "call" and len(agent.assigned_tasks) >= 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent already has maximum text-based tasks"
        )
    
    if not agent.has_voice_call() and platform == "call" and len(agent.assigned_tasks) >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Adding a voice call would exceed maximum tasks"
        )
    
    # Create and assign the task
    task = Task(platform)
    agent.assigned_tasks.append(task)
    
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        language_skills=agent.language_skills,
        assigned_tasks=[
            TaskResponse(id=task.id, platform=task.platform)
            for task in agent.assigned_tasks
        ]
    )

if __name__ == "__main__":
    # Run the HTTP server
    uvicorn.run(app, host="0.0.0.0", port=8000)
