// src/components/Modals/AddTaskModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type PartialTask, type Priority, type Category, Priorities, Categories } from '../../types/Task';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: PartialTask) => void;
}

// Styled components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid #D1D5DB;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid #D1D5DB;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid #D1D5DB;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CancelButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: #E5E7EB;
  color: #4B5563;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const AddButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const AddTaskModal = ({ onClose, onAddTask }: AddTaskModalProps) => {
  const [newTask, setNewTask] = useState<PartialTask>({
    title: '',
    description: '',
    priority: Priorities.MEDIUM,
    category: Categories.PERSONAL,
    isCompleted: false,
  });

  const handleSubmit = () => {
    if (!newTask.title) return;
    
    onAddTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: Priorities.MEDIUM,
      category: Categories.PERSONAL,
      isCompleted: false,
    });
    onClose();
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <ModalTitle>Add New Task</ModalTitle>
        
        <FormField>
          <Label>Title</Label>
          <Input
            type="text"
            value={newTask.title || ''}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
          />
        </FormField>
        
        <FormField>
          <Label>Description</Label>
          <Textarea
            value={newTask.description || ''}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task description"
            rows={3}
          />
        </FormField>
        
        <FormGrid>
          <FormField>
            <Label>Priority</Label>
            <Select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
            >
              <option value={Priorities.LOW}>Low</option>
              <option value={Priorities.MEDIUM}>Medium</option>
              <option value={Priorities.HIGH}>High</option>
            </Select>
          </FormField>
          <FormField>
            <Label>Category</Label>
            <Select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Category })}
            >
              <option value={Categories.WORK}>Work</option>
              <option value={Categories.PERSONAL}>Personal</option>
              <option value={Categories.ERRANDS}>Errands</option>
              <option value={Categories.OTHER}>Other</option>
            </Select>
          </FormField>
        </FormGrid>
        
        <ButtonContainer>
          <CancelButton
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Cancel
          </CancelButton>
          <AddButton
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
          >
            Add Task
          </AddButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddTaskModal;