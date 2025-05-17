'use client';

import React, { useState } from 'react';
import AgentItem from './components/AgentItem';
import { useAgents } from './hooks/useAgents';
import AgentInputDialog from './components/AgentInputDialog';
import { Button } from '@/components/ui/button';
import { Agent } from './types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const AgentsContainer = () => {
  const [openInput, setOpenInput] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [name, setName] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { agents, loading, error, addAgent, editAgent, deleteAgent } =
    useAgents();

  const reset = async () => {
    setOpenInput(false);
    setOpenDelete(false);
    setAgent(null);
    setName('');
    setLanguages([]);
    setIsEditing(false);
  };

  const handleAddAgent = async () => {
    await addAgent({ name, languageSkills: languages });
    await reset();
  };

  const handleUpdateAgent = async () => {
    const addSkills = languages.filter(
      (lang) => !agent?.languageSkills.includes(lang)
    );
    const removeSkills =
      agent?.languageSkills.filter((lang) => !languages.includes(lang)) || [];
    await editAgent(agent!.id, {
      languageSkills: agent!.languageSkills,
      addSkills,
      removeSkills,
    });
    await reset();
  };

  const handleDeleteAgent = async () => {
    await deleteAgent(agent!.id);
    await reset();
  };

  const handleAddClick = () => {
    setOpenInput(true);
    setName('');
    setLanguages([]);
    setIsEditing(false);
  };

  const handleEditClick = (agent: Agent) => {
    setOpenInput(true);
    setAgent(agent);
    setName(agent.name);
    setLanguages(agent.languageSkills);
    setIsEditing(true);
  };

  const handleDeleteClick = (agent: Agent) => {
    setAgent(agent);
    setName(agent.name);
    setOpenDelete(true);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Agents</h2>
        <Button onClick={handleAddClick} variant="default">
          Add Agent
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="grid gap-4">
        {agents.length === 0 && (
          <div className="text-center text-muted-foreground">
            No agents available
          </div>
        )}
        {agents.map((agent) => (
          <AgentItem
            key={agent.id}
            agent={agent}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            enableEdit
            enableDelete
          />
        ))}
      </div>

      <AgentInputDialog
        open={openInput}
        setOpen={setOpenInput}
        name={name}
        setName={setName}
        languages={languages}
        setLanguages={setLanguages}
        isEditing={isEditing}
        handleAddAgent={isEditing ? handleUpdateAgent : handleAddAgent}
      />

      <ConfirmDialog
        title="Delete Agent"
        description={`Are you sure you want to delete agent ${name}? This action cannot be undone.`}
        onConfirm={handleDeleteAgent}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </div>
  );
};

export default AgentsContainer;
