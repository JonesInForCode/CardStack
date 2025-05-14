// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Styled components
const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg};
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: #B91C1C;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.p`
  color: #EF4444;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorDetails = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-family: monospace;
  color: #6B7280;
  overflow: auto;
`;

const RefreshButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: #DC2626;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  
  &:hover {
    background-color: #B91C1C;
  }
`;

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>The app encountered an error</ErrorMessage>
          {this.state.error && (
            <ErrorDetails>
              {this.state.error.toString()}
            </ErrorDetails>
          )}
          <RefreshButton onClick={() => window.location.reload()}>
            Refresh Page
          </RefreshButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;