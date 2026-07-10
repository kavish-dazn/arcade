import { createContext, useContext, useEffect, type ReactNode } from 'react';

import { FocusContext } from './FocusProvider';

export const FocusScopeContext = createContext<string | null>(null);

interface FocusScopeProps {
    id: string;
    children: ReactNode;
}

export function FocusScope({ id, children }: FocusScopeProps) {
    const context = useContext(FocusContext);

    if (!context) {
        throw new Error('FocusScope must be used inside a FocusProvider.');
    }

    const { activateScope, deactivateScope } = context;

    useEffect(() => {
        activateScope(id);
        return () => deactivateScope(id);
    }, [activateScope, deactivateScope, id]);

    return <FocusScopeContext.Provider value={id}>{children}</FocusScopeContext.Provider>;
}
