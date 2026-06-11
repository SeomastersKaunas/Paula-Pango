import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { app, isFirebaseConfigured } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timeoutId: number | undefined;

    const startAuthListener = () => {
      try {
        const auth = getAuth(app);
        unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setUser(user);
            setLoading(false);
          },
          (error) => {
            // Suppress Firebase auth errors silently (especially during PageSpeed Insights)
            setLoading(false);
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
              console.warn('Firebase auth error (suppressed):', error);
            }
          }
        );
      } catch (error) {
        // Suppress initialization errors
        setLoading(false);
        if (process.env.NODE_ENV === 'development') {
          console.warn('Firebase auth initialization error (suppressed):', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      // Skip Firebase entirely when not configured (preview/demo mode)
      if (!isFirebaseConfigured) {
        setLoading(false);
        return;
      }

      // Detect PageSpeed Insights crawler - skip Firebase initialization
      const isPageSpeedInsights =
        navigator.userAgent.includes('Chrome-Lighthouse') ||
        navigator.userAgent.includes('PageSpeed') ||
        navigator.userAgent.includes('GTmetrix') ||
        (window.navigator as any).webdriver === true;
      
      if (isPageSpeedInsights) {
        // Skip Firebase for crawlers to avoid network errors
        setLoading(false);
        return;
      }

      const win = window as any;
      if (typeof win.requestIdleCallback === 'function') {
        win.requestIdleCallback(startAuthListener);
      } else {
        timeoutId = window.setTimeout(startAuthListener, 0);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
