// src/components/Drawers/CategoryDecksDrawer.tsx - Simplified design
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { type Task, Categories, getCategoryEmoji } from '../../types/Task';

interface CategoryDecksDrawerProps {
  tasks: Task[];
  onClose: () => void;
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

// Styled components
const DrawerOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
`;

const DrawerContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xl};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.modal};
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  
  /* iOS safe area support */
  padding-bottom: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom, 0));
`;

const DrawerScrollContent = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const DrawerTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Simple card design that subtly resembles a deck
const CategoryCard = styled(motion.button)<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, isSelected }) => 
    isSelected ? 'white' : theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: relative;
  text-align: left;
  
  /* Subtle deck effect with pseudo-elements */
  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.primary : theme.colors.background};
    z-index: -1;
  }
  
  /* Bottom card in stack */
  &:before {
    bottom: -3px;
    left: 2px;
    right: 2px;
    height: 100%;
    opacity: 0.3;
  }
  
  /* Middle card in stack */
  &:after {
    bottom: -1.5px;
    left: 1px;
    right: 1px;
    height: 100%;
    opacity: 0.6;
  }
`;

const CategoryContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CategoryEmoji = styled.span`
  font-size: 1.75rem;
  margin-right: ${({ theme }) => theme.spacing.md};
  min-width: 1.75rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  display: block;
`;

const CategoryTaskCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  opacity: 0.8;
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  position: sticky;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding-top: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

// Helper to count tasks by category
const getTaskCountByCategory = (tasks: Task[], category: string) => {
  return tasks.filter(task => task.category === category).length;
};

const CategoryDecksDrawer = ({ 
  tasks,
  onClose, 
  onSelectCategory,
  selectedCategory 
}: CategoryDecksDrawerProps) => {
  // Handle click on drawer content to prevent propagation
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Calculate total task count
  const totalTasks = tasks.length;

  return (
    <>
      {/* Overlay that closes the drawer when clicked */}
      <DrawerOverlay 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Drawer content */}
      <DrawerContainer
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={handleContentClick}
      >
        <DrawerScrollContent>
          <DrawerTitle>Category Decks</DrawerTitle>
          
          <CategoriesContainer>
            {/* All Tasks option */}
            <CategoryCard
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(null)}
              isSelected={selectedCategory === null}
            >
              <CategoryContent>
                <CategoryEmoji>🃏</CategoryEmoji>
                <CategoryInfo>
                  <CategoryName>All Tasks</CategoryName>
                  <CategoryTaskCount>{totalTasks} task{totalTasks !== 1 ? 's' : ''}</CategoryTaskCount>
                </CategoryInfo>
              </CategoryContent>
            </CategoryCard>
            
            {/* Category options */}
            {Object.values(Categories).map(category => {
              const taskCount = getTaskCountByCategory(tasks, category);
              
              return (
                <CategoryCard 
                  key={category}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCategory(category)}
                  isSelected={selectedCategory === category}
                >
                  <CategoryContent>
                    <CategoryEmoji>{getCategoryEmoji(category)}</CategoryEmoji>
                    <CategoryInfo>
                      <CategoryName>{category.charAt(0).toUpperCase() + category.slice(1)}</CategoryName>
                      <CategoryTaskCount>
                        {taskCount} task{taskCount !== 1 ? 's' : ''}
                      </CategoryTaskCount>
                    </CategoryInfo>
                  </CategoryContent>
                </CategoryCard>
              );
            })}
          </CategoriesContainer>
        </DrawerScrollContent>
        
        <CloseButtonContainer>
          <CloseButton
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Close
          </CloseButton>
        </CloseButtonContainer>
      </DrawerContainer>
    </>
  );
};

export default CategoryDecksDrawer;