import { createContext, useCallback, useContext, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { FocusContext } from './FocusProvider';

export const FocusScopeContext = createContext<string | null>(null);

interface FocusScopeProps {
    id: string;
    children: ReactNode;
    onBack?: () => void;
}

export function FocusScope({ id, children, onBack }: FocusScopeProps) {
    const context = useContext(FocusContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error('FocusScope must be used inside a FocusProvider.');
    }

    const { activateScope, deactivateScope, registerBackHandler } = context;
    const defaultBackHandler = useCallback(() => {
        if (onBack) {
            onBack();
            return;
        }

        navigate(-1);
    }, [navigate, onBack]);

    useEffect(() => {
        activateScope(id);
        return () => deactivateScope(id);
    }, [activateScope, deactivateScope, id]);

    useLayoutEffect(() => registerBackHandler(defaultBackHandler), [defaultBackHandler, registerBackHandler]);

    return <FocusScopeContext.Provider value={id}>{children}</FocusScopeContext.Provider>;
}
