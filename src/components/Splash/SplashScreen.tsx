// src/components/Splash/SplashScreen.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

// Styled components
const SplashContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.splash};
`;

const SplashContent = styled(motion.div)`
  text-align: center;
  color: white;
`;

const CardsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
  height: 8rem;
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 5rem;
  height: 7rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardEmoji = styled.span`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const SplashTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const SplashSubtitle = styled(motion.p)`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: rgba(255, 255, 255, 0.8);
`;

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => (
  <SplashContainer
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 1.5, delay: 1 }}
    onAnimationComplete={onAnimationComplete}
  >
    <SplashContent
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <CardsContainer
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Card 
          initial={{ rotate: -15, x: -30 }}
          animate={{ rotate: -8, x: -40 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <CardEmoji>🛒</CardEmoji>
        </Card>
        <Card 
          initial={{ rotate: 0, y: 10 }}
          animate={{ rotate: 5, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          <CardEmoji>📝</CardEmoji>
        </Card>
        <Card 
          initial={{ rotate: 10, x: 30 }}
          animate={{ rotate: -3, x: 40 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <CardEmoji>💼</CardEmoji>
        </Card>
      </CardsContainer>
      <SplashTitle 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        CardStack
      </SplashTitle>
      <SplashSubtitle 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        One task at a time
      </SplashSubtitle>
    </SplashContent>
  </SplashContainer>
);

export default SplashScreen;