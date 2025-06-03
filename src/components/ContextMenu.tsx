// src/components/ContextMenu.tsx
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onAddSubtask: () => void;
  onViewSubtasks: () => void;
}

const MenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`;

const MenuContainer = styled(motion.div)`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  overflow: hidden;
  min-width: 160px;
  z-index: 50;
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight}20;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContextMenu = ({ isOpen, position, onClose, onAddSubtask, onViewSubtasks }: ContextMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MenuOverlay onClick={onClose} />
          <MenuContainer
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ left: position.x, top: position.y }}
          >
            <MenuItem
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onViewSubtasks();
                onClose();
              }}
            >
              <span>👁️</span>
              View Subtasks
            </MenuItem>
            <MenuDivider />
            <MenuItem
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onAddSubtask();
                onClose();
              }}
            >
              <span>➕</span>
              Add Subtask
            </MenuItem>
          </MenuContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;