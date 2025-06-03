// src/components/Modals/AddSubtaskModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type PartialTask } from '../../types/Task';

interface AddSubtaskModalProps {
  parentTaskTitle: string;
  onClose: () => void;
  onAddSubtask: (subtask: PartialTask) => void;
}

// Reuse styled components from AddTaskModal
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
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ParentInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
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
  border: 1px solid ${({ theme }) => theme.colors.textSecondary}50;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.textSecondary}50;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CancelButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
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

const AddSubtaskModal = ({ parentTaskTitle, onClose, onAddSubtask }: AddSubtaskModalProps) => {
  const [newSubtask, setNewSubtask] = useState<PartialTask>({
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!newSubtask.title) return;
    
    onAddSubtask(newSubtask);
    setNewSubtask({
      title: '',
      description: '',
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
        <ModalTitle>Add Subtask</ModalTitle>
        
        <ParentInfo>
          Adding subtask to: <strong>{parentTaskTitle}</strong>
        </ParentInfo>
        
        <FormField>
          <Label>Subtask Title</Label>
          <Input
            type="text"
            value={newSubtask.title || ''}
            onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
            placeholder="What needs to be done?"
            autoFocus
          />
        </FormField>
        
        <FormField>
          <Label>Description (optional)</Label>
          <Textarea
            value={newSubtask.description || ''}
            onChange={(e) => setNewSubtask({ ...newSubtask, description: e.target.value })}
            placeholder="Additional details..."
            rows={2}
          />
        </FormField>
        
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
            Add Subtask
          </AddButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddSubtaskModal;