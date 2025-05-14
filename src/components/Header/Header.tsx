// src/components/Header/Header.tsx with styled-components
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>CardStack</Title>
      <Subtitle>Focus on one task at a time</Subtitle>
    </HeaderContainer>
  );
};

export default Header;