// src/components/Footer/Footer.tsx with dark mode support
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface FooterProps {
  onAddTask: () => void;
  onToggleCompletedTasks: () => void;
  showCompletedTasks: boolean;
}

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const AddTaskButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const CompletedTasksButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryLight}30; /* 30% opacity */
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const Footer = ({ 
  onAddTask, 
  onToggleCompletedTasks, 
  showCompletedTasks 
}: FooterProps) => {
  return (
    <FooterContainer>
      <AddTaskButton
        whileTap={{ scale: 0.95 }}
        onClick={onAddTask}
      >
        + Add Task
      </AddTaskButton>
      <CompletedTasksButton
        whileTap={{ scale: 0.95 }}
        onClick={onToggleCompletedTasks}
      >
        {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
      </CompletedTasksButton>
    </FooterContainer>
  );
};

export default Footer;