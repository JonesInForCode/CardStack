// src/components/UpdateNotification/UpdateNotification.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { VersionInfo } from '../../utils/version';

interface UpdateNotificationProps {
  versionInfo: VersionInfo | null;
  onUpdate: () => void;
  onDismiss?: () => void;
}

const NotificationContainer = styled(motion.div)`
  position: fixed;
  bottom: 80px; // Above the Footer
  left: 16px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.md};
  z-index: 40;
  display: flex;
  flex-direction: column;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NotificationTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NotificationVersion = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
`;

const NotificationMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const UpdateButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const DismissButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const UpdateNotification = ({ versionInfo, onUpdate, onDismiss }: UpdateNotificationProps) => {
  if (!versionInfo) return null;
  
  return (
    <NotificationContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <NotificationHeader>
        <NotificationTitle>Update Available</NotificationTitle>
        <NotificationVersion>{versionInfo.version}</NotificationVersion>
      </NotificationHeader>

      <NotificationMessage>
        {versionInfo.updateMessage || "A new version of CardStack is available. Please refresh to update!"}
      </NotificationMessage>
      
      <ButtonContainer>
        {onDismiss && !versionInfo.requiredUpdate && (
          <DismissButton
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
          >
            Later
          </DismissButton>
        )}
        <UpdateButton
          whileTap={{ scale: 0.95 }}
          onClick={onUpdate}
        >
          Update Now
        </UpdateButton>
      </ButtonContainer>
    </NotificationContainer>
  );
};

export default UpdateNotification;