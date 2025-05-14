// src/components/Footer/Footer.tsx with styled-components
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface FooterProps {
  onAddTask: () => void;
  onToggleCompletedTasks: () => void;
  showCompletedTasks: boolean;
  snoozedTasksCount: number;
  onToggleSnoozedTasks: () => void;
  showSnoozedTasks: boolean;
}

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const AddTaskButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CompletedTasksButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const SnoozedTasksButton = styled(motion.button)<{ hasSnoozed: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ hasSnoozed, theme }) => 
    hasSnoozed ? theme.colors.primaryDark : theme.colors.primaryDark};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  position: relative;
`;

const SnoozeBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  padding: 4px 8px;
  border-radius: 12px;
`;

const Footer = ({ 
  onAddTask, 
  onToggleCompletedTasks, 
  showCompletedTasks,
  snoozedTasksCount,
  onToggleSnoozedTasks,
  showSnoozedTasks
}: FooterProps) => {
  return (
    <FooterContainer>
      <AddTaskButton
        whileTap={{ scale: 0.95 }}
        onClick={onAddTask}
      >
        + Add Task
      </AddTaskButton>
      <ButtonGroup>
        {snoozedTasksCount > 0 && (
          <SnoozedTasksButton
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSnoozedTasks}
            hasSnoozed={true}
          >
            {showSnoozedTasks ? 'Hide Snoozed' : 'Snoozed'}
            <SnoozeBadge>{snoozedTasksCount}</SnoozeBadge>
          </SnoozedTasksButton>
        )}
        <CompletedTasksButton
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCompletedTasks}
        >
          {showCompletedTasks ? 'Hide Completed' : 'Completed'}
        </CompletedTasksButton>
      </ButtonGroup>
    </FooterContainer>
  );
};

export default Footer;