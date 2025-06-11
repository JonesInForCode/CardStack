// src/components/Modals/InfoModal.tsx
import { motion } from 'framer-motion';

import styled from 'styled-components';

interface InfoModalProps {
  onClose: () => void;
}

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
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover, &:focus {
    text-decoration: underline;
  }
`;

const CloseButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const KofiContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  
  // We'll style our custom button to match Ko-fi's usual appearance
  button {
    background-color: #72a4f2;
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const InfoModal = ({ onClose }: InfoModalProps) => {
  // Reference to track if we've loaded the script already
  

  // Function to open Ko-fi in a new window
  const handleKofiClick = () => {
    window.open('https://ko-fi.com/I2I21F0Q5J', '_blank');
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalTitle>About CardStack</ModalTitle>
        
        <Description>
          CardStack is a task management application designed specifically for people with ADHD. Unlike conventional task managers, CardStack presents one task at a time as a full-screen card that demands attention.
        </Description>
        
        <KofiContainer>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleKofiClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9.5V15.5C6 16.0523 6.44772 16.5 7 16.5H12.5C13.0523 16.5 13.5 16.0523 13.5 15.5V9.5C13.5 8.94772 13.0523 8.5 12.5 8.5H7C6.44772 8.5 6 8.94772 6 9.5Z" fill="white"/>
              <path d="M11 8.5V16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13.5 12H17C17.5523 12 18 11.5523 18 11V10C18 9.44772 17.5523 9 17 9H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="white" strokeWidth="1.5"/>
            </svg>
            Support me on Ko-fi
          </motion.button>
        </KofiContainer>
        
        <SectionTitle>Connect</SectionTitle>
        <LinkContainer>
          <Link href="https://github.com/JonesInForCode/cardstack" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            GitHub Repository
          </Link>
          <Link href="https://github.com/JonesInForCode" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Creator's Profile
          </Link>
          <Link href="mailto:nico.rjones@outlook.com">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact the Creator
          </Link>
        </LinkContainer>
        
        <SectionTitle>License</SectionTitle>
        <Description>
          CardStack is released under the GNU Affero General Public License v3.0 with the explicit intention that it remains freely available to the neurodivergent community.
        </Description>
        
        <CloseButton
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Close
        </CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoModal;