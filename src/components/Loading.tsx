// src/components/Loading.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface LoadingProps {
  message?: string;
}

// Styled components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AnimationContainer = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Bar = styled(motion.div)<{ index: number }>`
  width: 1rem;
  height: 4rem;
  background-color: ${({ theme, index }) => {
    const opacity = 1 - (index * 0.2);
    return `${theme.colors.primary}${Math.floor(opacity * 100)}`;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const Message = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/**
 * Loading indicator component with animation
 */
const Loading = ({ message = 'Loading your tasks...' }: LoadingProps) => {
  return (
    <LoadingContainer>
      <AnimationContainer
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
      >
        {[0, 1, 2].map((i) => (
          <Bar 
            key={i}
            index={i}
            animate={{ 
              height: [64, 128, 64],
              y: [0, -16, 0]
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.2
            }}
          />
        ))}
      </AnimationContainer>
      <Message>{message}</Message>
    </LoadingContainer>
  );
};

export default Loading;